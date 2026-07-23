/* ============================================================
   Apologia Daily — cross-device progress sync (Phase-0 retention fix)

   Syncs learning progress (streak, mastery, challenge/quiz/deck progress)
   to Supabase so it survives a cleared browser or a phone↔laptop switch —
   the single biggest retention leak in the app (progress was localStorage-only).

   SAFE BY DEFAULT. This is a strict no-op unless BOTH are true:
     1. a Supabase auth session exists in localStorage (user is signed in), and
     2. the `user_progress` table exists (see docs/PROGRESS_SYNC.md — run that
        migration to ACTIVATE; until then every request 404s and we stay local-only).
   It never monkey-patches localStorage and never throws into the page: on any
   error it silently falls back to the exact local-only behaviour that exists today.

   Model: one RLS-protected row per user, `data jsonb` = a snapshot of the
   allow-listed progress keys. Pull+merge on load; debounced upsert on change,
   and on pagehide/visibility-hidden. Merge is per-key and monotonic where it
   matters (streak = latest day wins; mastery = union, "done" wins) so two
   devices converge without losing progress.
   ============================================================ */
(function () {
  'use strict';
  var URL = 'https://noprgxkwniouukmrfozc.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcHJneGt3bmlvdXVrbXJmb3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE1MTUsImV4cCI6MjA5NjEzNzUxNX0.GKmQgpndtaBUcz5SoT9H3bDsqjNSPixJJj4G3BrVkJw';

  // Learning-PROGRESS keys only. Deliberately NOT synced: prefs, dismissals,
  // caches, one-off "seen" flags, analytics counters (device-local by design).
  // NB: 'study_plans' / 'ad_plan_*' are intentionally NOT here — study-plans.html
  // already syncs plan progress to its own `study_plans_progress` table; owning it
  // in one place avoids two writers with different conflict rules racing on one key.
  var KEYS = ['ad_streak', 'ad_mastery', 'ad_visits', 'ad_today_done', 'ad_today_v1',
    'daily_arg_complete', 'ad_objdeck', 'ad_mix_done', 'quizCompleted', 'quizTotal',
    'speedRoundHistory', 'debateCount', 'ad_askcount'];
  var PREFIXES = ['ad_ch_', 'quizScore_', 'ad_fc_', 'ad_coach'];

  function keyMatches(k) {
    if (!k) return false;
    if (KEYS.indexOf(k) >= 0) return true;
    for (var i = 0; i < PREFIXES.length; i++) if (k.indexOf(PREFIXES[i]) === 0) return true;
    return false;
  }

  function session() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /^sb-.*-auth-token$/.test(k)) {
          var t = JSON.parse(localStorage.getItem(k) || '{}');
          var at = t.access_token || (t.currentSession && t.currentSession.access_token);
          var u = t.user || (t.currentSession && t.currentSession.user);
          if (at && u && u.id) return { token: at, uid: u.id };
        }
      }
    } catch (e) {}
    return null;
  }

  function snapshot() {
    var o = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (keyMatches(k)) o[k] = localStorage.getItem(k);
      }
    } catch (e) {}
    return o;
  }

  function pj(s) { try { return JSON.parse(s); } catch (e) { return null; } }
  function bad(k) { return k === '__proto__' || k === 'constructor' || k === 'prototype'; }

  function mergeVal(a, b) {
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      var o = {}, k;
      for (k in a) if (!bad(k)) o[k] = a[k];
      for (k in b) if (!bad(k)) o[k] = (k in o) ? mergeVal(o[k], b[k]) : b[k];
      if (a.done || b.done) o.done = true;  // mastery: once done, always done
      return o;
    }
    var x = parseFloat(a), y = parseFloat(b);
    if (!isNaN(x) && !isNaN(y)) return Math.max(x, y);  // counters only go up
    if (a == null) return b; if (b == null) return a;
    return (String(a) >= String(b)) ? a : b;  // later date / non-reverting flag
  }

  // Merge one key's server value into the local value; returns the string to store.
  function mergeKey(k, localStr, serverStr) {
    if (k === 'ad_streak') {   // FIELD-WISE — never reduces a streak (later-day + max counts)
      var a = pj(localStr), b = pj(serverStr);
      if (!a) return serverStr; if (!b) return localStr;
      var out = {}, f;
      for (f in a) if (!bad(f)) out[f] = a[f];
      for (f in b) if (!bad(f) && !(f in out)) out[f] = b[f];
      out.last = (a.last || '') >= (b.last || '') ? (a.last || '') : (b.last || '');
      out.count = Math.max(a.count || 0, b.count || 0);
      out.freezes = Math.max(a.freezes || 0, b.freezes || 0);
      return JSON.stringify(out);
    }
    var oa = pj(localStr), ob = pj(serverStr);
    if (oa && ob && typeof oa === 'object' && typeof ob === 'object' && !Array.isArray(oa) && !Array.isArray(ob)) {
      var o2 = {}, key;
      for (key in oa) if (!bad(key)) o2[key] = oa[key];
      for (key in ob) if (!bad(key)) o2[key] = (key in o2) ? mergeVal(o2[key], ob[key]) : ob[key];
      return JSON.stringify(o2);
    }
    if (Array.isArray(oa) && Array.isArray(ob)) {   // history: union, LOCAL-FIRST so newest survives the cap
      var seen = {}, res = [];
      [].concat(oa, ob).forEach(function (x) { var s = JSON.stringify(x); if (!seen[s]) { seen[s] = 1; res.push(x); } });
      return JSON.stringify(res.slice(0, 200));
    }
    var na = parseFloat(localStr), nb = parseFloat(serverStr);
    if (!isNaN(na) && !isNaN(nb)) return String(Math.max(na, nb));
    return (localStr >= serverStr) ? localStr : serverStr;  // later date / non-reverting flag (not blind server-wins)
  }

  function mergeIn(server) {
    if (!server || typeof server !== 'object') return false;
    var changed = false;
    for (var k in server) {
      if (!keyMatches(k)) continue;
      var sv = server[k], lv = localStorage.getItem(k);
      if (lv == null) { try { localStorage.setItem(k, sv); changed = true; } catch (e) {} continue; }
      if (lv === sv) continue;
      var merged = mergeKey(k, lv, sv);
      if (merged != null && merged !== lv) { try { localStorage.setItem(k, merged); changed = true; } catch (e) {} }
    }
    return changed;
  }

  // Expose the pure merge helpers for unit tests (Node/CJS only; no-op in the browser).
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mergeKey: mergeKey, mergeVal: mergeVal, keyMatches: keyMatches };
  }

  var S = session();
  if (!S) return;  // signed out → local-only, identical to today's behaviour

  var H = { 'apikey': ANON, 'Authorization': 'Bearer ' + S.token, 'Content-Type': 'application/json' };
  var lastSent = '', timer = null;

  function doPush() {
    timer = null;
    var snap = snapshot();
    var body = JSON.stringify(snap);
    if (body === lastSent) return;
    if (body.length > 90000) return;  // soft cap — avoid silent keepalive-body failures on a runaway blob
    lastSent = body;
    try {
      fetch(URL + '/rest/v1/user_progress?on_conflict=user_id', {
        method: 'POST', keepalive: true,
        headers: Object.assign({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }, H),
        body: JSON.stringify({ user_id: S.uid, data: snap, updated_at: new Date().toISOString() })
      }).catch(function () {});
    } catch (e) {}
  }
  function schedulePush(fast) { if (timer) clearTimeout(timer); timer = setTimeout(doPush, fast ? 800 : 2500); }

  // PULL + merge on load, then push the converged snapshot back.
  try {
    fetch(URL + '/rest/v1/user_progress?user_id=eq.' + encodeURIComponent(S.uid) + '&select=data', { headers: H })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (rows) {
        var server = (rows && rows[0] && rows[0].data) || null;
        if (mergeIn(server)) { try { window.dispatchEvent(new Event('ad-progress-synced')); } catch (e) {} }
        schedulePush(true);
      })
      .catch(function () { /* table missing / offline / RLS → stay local-only */ });
  } catch (e) {}

  // Detect local progress changes cheaply and push (no setItem monkey-patch).
  var lastSnap = JSON.stringify(snapshot());
  try {
    setInterval(function () {
      var s = JSON.stringify(snapshot());
      if (s !== lastSnap) { lastSnap = s; schedulePush(false); }
    }, 8000);
    window.addEventListener('pagehide', doPush);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') doPush(); });
  } catch (e) {}
})();
