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
    'speedRoundHistory', 'debateCount', 'ad_askcount',
    // 2026-09-30: the rest of the learning record, so a new device picks it up too —
    // mastery-refresh schedule, confidence calibration, the Beginner's Path, devotional
    // completions and joined reading-club books.
    'ad_reviews', 'ad_calibration', 'beginners_path', 'completed', 'ad_joined_books'];
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

  function tstamp() { var args = arguments; return function (r) { if (!r || typeof r !== 'object') return ''; for (var i = 0; i < args.length; i++) if (r[args[i]]) return String(r[args[i]]); return ''; }; }
  // ad_reviews: a record that has been reviewed (has 'last') always outranks one that has only
  // been scheduled ('added'); 'added' only breaks a tie. A reset sets 'last', so it still wins.
  var RECORD_KEYS = {
    ad_reviews: function (r) { return (r && typeof r === 'object') ? (r.last ? '1' : '0') + String(r.last || '') + '|' + String(r.added || '') : ''; },
    ad_calibration: tstamp('at')
  };
  function isNum(v) { return typeof v === 'number' ? isFinite(v) : (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())); }
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
    // One side an array, the other not: keep the array. Before 2026-09-30 a nested array
    // could be merged into a bare number (parseFloat([1,2,3]) is 1), so some stored copies
    // of ad_ch_*.completed are numbers; the array is always the real record.
    if (Array.isArray(a) !== Array.isArray(b) && (Array.isArray(a) || Array.isArray(b))) return Array.isArray(a) ? a : b;
    if (Array.isArray(a) && Array.isArray(b)) {   // e.g. beginners_path.days: union, never drop a day
      var seenV = {}, outV = [];
      [].concat(a, b).forEach(function (x) { var s = JSON.stringify(x); if (!seenV[s]) { seenV[s] = 1; outV.push(x); } });
      return outV;
    }
    // Only real numbers compare numerically. parseFloat('2026-10-01') is 2026, so a date
    // string must never take this branch (it would be merged into a bare number).
    if (isNum(a) && isNum(b)) return Math.max(Number(a), Number(b));  // counters only go up
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
    // Whole-record keys: each entry is one event (a review grade, a prediction + score), so
    // keep the whole newer record rather than mixing fields from two different events.
    if (RECORD_KEYS[k] && oa && ob && typeof oa === 'object' && typeof ob === 'object') {
      var stamp = RECORD_KEYS[k], rec = {}, rk;
      for (rk in oa) if (!bad(rk)) rec[rk] = oa[rk];
      for (rk in ob) {
        if (bad(rk)) continue;
        if (!(rk in rec)) { rec[rk] = ob[rk]; continue; }
        var la = stamp(rec[rk]), lb = stamp(ob[rk]);
        if (lb > la) rec[rk] = ob[rk];
      }
      return JSON.stringify(rec);
    }
    if (oa && ob && typeof oa === 'object' && typeof ob === 'object' && !Array.isArray(oa) && !Array.isArray(ob)) {
      var o2 = {}, key;
      for (key in oa) if (!bad(key)) o2[key] = oa[key];
      for (key in ob) if (!bad(key)) o2[key] = (key in o2) ? mergeVal(o2[key], ob[key]) : ob[key];
      return JSON.stringify(o2);
    }
    if (Array.isArray(oa) && Array.isArray(ob)) {
      // Append-order lists (newest LAST): union with the other device's entries first and
      // this device's after, then keep the newest end. 'completed' (devotional days) and
      // 'quizCompleted' are small date strings that feed streaks, so they keep 2000.
      var seen = {}, res = [];
      [].concat(ob, oa).forEach(function (x) { var s = JSON.stringify(x); if (!seen[s]) { seen[s] = 1; res.push(x); } });
      return JSON.stringify(res.slice((k === 'completed' || k === 'quizCompleted') ? -2000 : -200));
    }
    if (isNum(localStr) && isNum(serverStr)) return String(Math.max(Number(localStr), Number(serverStr)));
    return (localStr >= serverStr) ? localStr : serverStr;  // later date / non-reverting flag (not blind server-wins)
  }

  // Keys whose arrival from the account means real progress this device did not have
  // (not pure counters like visits or ask counts, which differ on every session).
  var COUNTERS = { ad_visits: 1, ad_askcount: 1, debateCount: 1, quizTotal: 1, ad_mix_done: 1 };
  var imported = false;
  function mergeIn(server) {
    if (!server || typeof server !== 'object') return false;
    var changed = false;
    for (var k in server) {
      if (!keyMatches(k)) continue;
      var sv = server[k], lv = localStorage.getItem(k);
      if (lv == null) { try { localStorage.setItem(k, sv); changed = true; if (!COUNTERS[k]) imported = true; } catch (e) {} continue; }
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

  function showSyncedNotice() {
    try {
      if (sessionStorage.getItem('ad_sync_notice')) return;
      sessionStorage.setItem('ad_sync_notice', '1');
      var d = document.createElement('div');
      d.setAttribute('role', 'status');
      d.style.cssText = 'position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9999;background:#0a1628;color:#fff;font-family:system-ui,sans-serif;font-size:14px;padding:10px 14px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;gap:12px;align-items:center;max-width:calc(100% - 32px)';
      d.appendChild(document.createTextNode('Your progress from your account has been loaded.'));
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = 'Refresh to see it';
      b.style.cssText = 'background:#c8a951;color:#0a1628;border:0;border-radius:6px;padding:6px 10px;font-weight:600;cursor:pointer;font-size:13px';
      b.onclick = function () { location.reload(); };
      var x = document.createElement('button');
      x.type = 'button'; x.setAttribute('aria-label', 'Dismiss'); x.textContent = '\u00d7';
      x.style.cssText = 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1';
      x.onclick = function () { d.remove(); };
      d.appendChild(b); d.appendChild(x);
      (document.body || document.documentElement).appendChild(d);
    } catch (e) {}
  }

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
        if (mergeIn(server)) {
          try { window.dispatchEvent(new Event('ad-progress-synced')); } catch (e) {}
          // Pages read progress once, on load. If the account brought in progress this
          // device did not have at all (a new phone, a cleared browser), offer a refresh
          // rather than reloading on its own, so nothing the reader is doing is lost.
          if (imported) showSyncedNotice();
        }
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
