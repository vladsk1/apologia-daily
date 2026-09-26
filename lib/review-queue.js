/* Apologia Daily — shared spaced-review queue (plumbing; no doctrinal content).
 *
 * WHAT THIS IS. One expanding-interval review schedule shared across every
 * mastery-track argument, so an argument you have completed comes back for a
 * quick self-check *before* you would forget it — the single best-evidenced
 * mechanic in the learning literature (the spacing effect). Until now the
 * mastery pages tracked "done" with a coarse 30-day fade and fed no review
 * queue; this connects them to a real, per-item schedule.
 *
 * DESIGN. Local-first: state lives in localStorage under 'ad_reviews', so it
 * works for logged-out visitors and needs no account and no server table. It
 * is per-viewer only, never leaves the browser, and every read/write is
 * try/catch-guarded so a private window or blocked storage degrades to "no
 * reviews" rather than an error. (The existing Supabase 'flashcards' review
 * queue used by today.html/flashcards.html is separate and untouched; these
 * can be merged later.)
 *
 * SCHEDULE. A simple SM-2-lite expanding ladder in days: 1 -> 3 -> 7 -> 16 ->
 * 35 -> 90. A "still got it" grade advances one rung; a "needs work" grade
 * resets to the first rung. Captures ~the whole benefit of the spacing effect
 * without a per-card ease-factor; FSRS/SM-2 tuning is a future, optional swap.
 *
 * SELF-WIRING. Included on a mastery page (ev-m-*.html), it auto-detects the
 * argument from the URL, schedules it once the page is completed, and injects
 * a "time to refresh" self-check banner when the argument is due. Included
 * anywhere else (e.g. the dashboard) it only exposes window.ADReview; call
 * ADReview.due() / ADReview.renderDueInto(el) to show the queue.
 *
 * NO CONTENT GATE. This file contains no doctrinal prose — it is UI/scheduling
 * plumbing, like reviewed-badge.js / evidence.js. The banner it injects shows
 * only the page's own <title> and generic UI copy.
 */
(function () {
  var KEY = 'ad_reviews';
  var LADDER = [1, 3, 7, 16, 35, 90]; // days between reviews, indexed by step

  /* All date math is done in UTC (parse with a 'Z' suffix, format via
     toISOString) so "today" and a scheduled due-date use the same basis.
     Mixing local-parsed dates with a UTC "today" caused an off-by-one in
     UTC-ahead timezones, which made a "due in 1 day" review read as due today. */
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function addDays(iso, n) {
    var d = new Date(iso + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(m) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} }

  var API = {
    /* Ensure an argument is in the review schedule. Idempotent: first call
       seeds it (first review due in 1 day); later calls only refresh label/url. */
    schedule: function (id, title, url) {
      if (!id) return;
      var m = load();
      if (!m[id]) {
        m[id] = { t: title || id, u: url || ('/ev-m-' + id + '.html'), step: 0, due: addDays(todayISO(), LADDER[0]), added: todayISO() };
      } else {
        if (title) m[id].t = title;
        if (url) m[id].u = url;
      }
      save(m);
    },
    /* Grade a review. quality >= 3 ("still got it") advances the ladder;
       anything less ("needs work") resets to the first rung. */
    grade: function (id, quality) {
      var m = load(), e = m[id];
      if (!e) return;
      if (quality >= 3) { e.step = Math.min((e.step || 0) + 1, LADDER.length - 1); }
      else { e.step = 0; }
      e.due = addDays(todayISO(), LADDER[e.step]);
      e.last = todayISO();
      m[id] = e; save(m);
    },
    isDue: function (id) { var e = load()[id]; return !!(e && e.due <= todayISO()); },
    isTracked: function (id) { return !!load()[id]; },
    /* Arguments due today, soonest-due first. */
    due: function () {
      var m = load(), t = todayISO(), out = [];
      for (var k in m) { if (Object.prototype.hasOwnProperty.call(m, k) && m[k].due <= t) out.push({ id: k, title: m[k].t, url: m[k].u, due: m[k].due }); }
      out.sort(function (a, b) { return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0); });
      return out;
    },
    count: function () { return API.due().length; },
    all: function () { return load(); },

    /* Render the due list into a container element (used by the dashboard).
       Returns the number of due items. Safe to call when none are due. */
    renderDueInto: function (el) {
      if (!el) return 0;
      var items = API.due();
      if (!items.length) { el.style.display = 'none'; return 0; }
      var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
      var rows = items.map(function (it) {
        return '<a href="' + esc(it.url) + '" style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem;text-decoration:none;padding:0.55rem 0;border-top:1px solid rgba(255,255,255,0.08);">' +
          '<span style="font-family:var(--font-ui,\'DM Sans\',sans-serif);font-size:0.9rem;color:#e8eefc;">' + esc(it.title) + '</span>' +
          '<span style="font-family:var(--font-ui,\'DM Sans\',sans-serif);font-size:0.78rem;font-weight:600;color:var(--gold,#c8a951);white-space:nowrap;">Refresh &rarr;</span>' +
          '</a>';
      }).join('');
      el.innerHTML =
        '<div style="font-family:var(--font-serif,\'Playfair Display\',serif);font-size:1.05rem;font-weight:700;color:#fff;margin-bottom:0.15rem;">' +
          items.length + ' argument' + (items.length !== 1 ? 's' : '') + ' due to refresh</div>' +
        '<div style="font-family:var(--font-ui,\'DM Sans\',sans-serif);font-size:0.72rem;color:rgba(255,255,255,0.55);margin-bottom:0.4rem;">A quick self-check brings each one back right before you&rsquo;d forget it &mdash; the way memory actually sticks.</div>' +
        rows;
      el.style.display = 'block';
      return items.length;
    }
  };

  window.ADReview = API;

  /* ---- Mastery-page auto-wiring (only on ev-m-*.html) ---- */
  if (!/\/ev-m-[^\/]+\.html$/.test(location.pathname)) return;

  var ARG = location.pathname.split('/').pop().replace('ev-m-', '').replace('.html', '');

  function masteryComplete() {
    try {
      var m = JSON.parse(localStorage.getItem('ad_mastery') || '{}');
      var e = m[ARG];
      // "done" is set when the mastery dial reaches 100%; fall back to the
      // four checkpoints in case an older entry predates the 'done' field.
      return !!(e && (e.done || (e.read && e.explain && e.cards && e.debate)));
    } catch (e) { return false; }
  }
  function pageTitle() { return (document.title || ARG).split('|')[0].replace(/\s+$/, '').trim(); }

  /* If the learner has completed this argument, make sure it is scheduled. */
  function sync() { if (masteryComplete()) API.schedule(ARG, pageTitle(), location.pathname); }

  /* When this argument is due, greet a returning learner with a retrieval
     prompt (retrieval practice, not re-reading) and let them self-grade. */
  function injectBanner() {
    if (!API.isDue(ARG)) return;
    if (document.getElementById('ad-review-banner')) return;
    var anchor = document.querySelector('.dialcard') || document.querySelector('#understand') || document.querySelector('.wrap');
    if (!anchor) return;
    var b = document.createElement('div');
    b.id = 'ad-review-banner';
    b.style.cssText = 'background:linear-gradient(135deg,#0a1628,#0f2040);border:1px solid rgba(200,169,81,0.5);border-radius:12px;padding:1rem 1.25rem;margin:0 0 1.25rem;';
    b.innerHTML =
      '<div style="font-family:var(--fd,\'Playfair Display\',serif);font-size:1.05rem;font-weight:700;color:#fff;">&#128260; Time to refresh this argument</div>' +
      '<div style="font-family:var(--ui,\'DM Sans\',sans-serif);font-size:0.85rem;color:rgba(255,255,255,0.7);margin:0.35rem 0 0.75rem;">Before you re-read: can you still state the core move and its strongest objection from memory? Try it, then rate yourself &mdash; this is what makes it stick for a real conversation.</div>' +
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap;">' +
        '<button type="button" id="ad-rev-good" style="font-family:var(--ui,sans-serif);font-size:0.82rem;font-weight:600;padding:8px 16px;border:none;border-radius:5px;background:var(--g,#c8a951);color:#050d1a;cursor:pointer;">I&rsquo;ve still got it</button>' +
        '<button type="button" id="ad-rev-again" style="font-family:var(--ui,sans-serif);font-size:0.82rem;font-weight:500;padding:8px 16px;border:1px solid rgba(200,169,81,0.5);border-radius:5px;background:transparent;color:#e8cf87;cursor:pointer;">Needs work</button>' +
      '</div>';
    anchor.parentNode.insertBefore(b, anchor);
    function done(msg) {
      b.innerHTML = '<div style="font-family:var(--ui,\'DM Sans\',sans-serif);font-size:0.9rem;color:#e8eefc;">' + msg + '</div>';
      setTimeout(function () { if (b && b.parentNode) b.parentNode.removeChild(b); }, 3500);
    }
    var g = document.getElementById('ad-rev-good'), a = document.getElementById('ad-rev-again');
    if (g) g.addEventListener('click', function () { API.grade(ARG, 5); done('&#10003; Nicely done &mdash; this one will come back in a while. Keep going below to sharpen it further.'); });
    if (a) a.addEventListener('click', function () { API.grade(ARG, 1); done('Good &mdash; we&rsquo;ll bring it back soon. Work through the drills below to lock it in.'); });
  }

  /* Close the loop to the interleaved objection drill: after the practice
     drills, offer a focused "practise this argument's objections" link
     (the deck's ?arg= filter, where the learner also writes their own
     if-then reply). Pure navigation; no content, no gate. */
  function injectObjectionCTA() {
    if (document.getElementById('ad-obj-cta')) return;
    var practice = document.getElementById('practice');
    if (!practice) return;
    var before = document.getElementById('proveit'); // sits after the drills, before "Prove it"
    var wrap = document.createElement('div');
    wrap.id = 'ad-obj-cta';
    wrap.style.cssText = 'margin:1.5rem 0;';
    wrap.innerHTML =
      '<a href="/objection-deck.html?arg=' + encodeURIComponent(ARG) + '" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;text-decoration:none;background:rgba(200,169,81,.08);border:1px solid rgba(200,169,81,.4);border-radius:8px;padding:0.9rem 1.2rem;">' +
        '<span style="display:flex;align-items:center;gap:.7rem;">' +
          '<span style="font-size:1.1rem;">&#127919;</span>' +
          '<span>' +
            '<span style="display:block;font-family:var(--fd,\'Playfair Display\',serif);font-size:.92rem;font-weight:700;color:var(--td,#0a1628);">Drill this argument&rsquo;s objections</span>' +
            '<span style="display:block;font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.74rem;color:var(--tm,#5a6b82);margin-top:2px;">Rehearse each &ldquo;if they say X&rdquo; and write your own reply &mdash; the mixed deck brings the ones you miss back sooner.</span>' +
          '</span>' +
        '</span>' +
        '<span style="font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.8rem;font-weight:600;color:var(--gd,#a88930);white-space:nowrap;">Practise &rarr;</span>' +
      '</a>';
    if (before && before.parentNode) { before.parentNode.insertBefore(wrap, before); }
    else { practice.appendChild(wrap); }
  }

  document.addEventListener('DOMContentLoaded', function () { sync(); injectBanner(); injectObjectionCTA(); });
  // Catch the moment a learner reaches 100% without a reload, and re-sync on return.
  document.addEventListener('visibilitychange', function () { if (!document.hidden) sync(); });
  window.addEventListener('pageshow', sync);
})();
