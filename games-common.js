/* games-common.js — shared engine for every Apologia Daily game.
 *
 * One place for the three things every game must do the same way:
 *   1. ONE STREAK    — games mark the same `ad_streak` key as /today & the dashboard
 *                      (identical freeze-banking rules), so a game played today keeps
 *                      the daily practice streak alive.
 *   2. COACH         — a finished game records accuracy to the adaptive Coach
 *                      (window.Coach), by argument id and/or category, so the coach's
 *                      weakest-skill prescription reflects game performance too.
 *   3. SHARE CARD    — one universal, brand-styled 1080×1080 result card + spoiler
 *                      text + native-share/download fallback, used by all games.
 *
 * Load once per game page (defer is fine — everything here is called at completion,
 * long after load): <script src="/games-common.js" defer></script>
 *
 * Public API — window.ADGame:
 *   ADGame.mark()                         → mark today on the shared streak; returns the streak object
 *   ADGame.streak()                       → read the shared streak object {last,count,freezes}
 *   ADGame.recordArg(argId, pct, label)   → Coach.recordQuiz for one argument slug
 *   ADGame.recordCat(category, pct, label)→ Coach.recordQuiz for one category ("The Trinity" etc.)
 *   ADGame.finish(opts)                   → do the whole completion in one call (see below)
 *   ADGame.share(opts)                    → build the universal card + native share / download
 *   ADGame.buildCard(opts)               → return the <canvas> (for preview/testing)
 *   ADGame.spoiler(opts)                  → return the emoji-grid spoiler text
 *
 * finish(opts): { pct, correct, total, cats:[], args:[], label }
 *   - marks the streak once
 *   - records each category in cats[] and each arg id in args[] to Coach at `pct`
 *     (pct is 0–100; if omitted it's derived from correct/total)
 *   - returns the streak object
 *
 * Category strings must match Coach's categories exactly:
 *   "God's Existence" · "The Resurrection" · "Biblical Reliability" ·
 *   "The Trinity" · "Jesus" · "Science & Faith"
 */
(function (global) {
  'use strict';

  var STREAK_KEY = 'ad_streak';

  function iso(d) { return d.toISOString().slice(0, 10); }

  function streak() {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"last":"","count":0,"freezes":0}'); }
    catch (e) { return { last: '', count: 0, freezes: 0 }; }
  }

  /* Identical logic to today.html adMark() / dashboard streak: consecutive-day
     count with a banked "freeze" that forgives a single missed day, and a freeze
     awarded every 7th day. Marking is idempotent per calendar day. */
  function mark() {
    try {
      var t = new Date();
      var td = iso(t),
          y1 = iso(new Date(t.getTime() - 864e5)),
          y2 = iso(new Date(t.getTime() - 1728e5));
      var s = streak();
      if (s.last === td) return s;
      if (s.last === y1) { s.count += 1; }
      else if (s.last === y2 && s.freezes > 0) { s.freezes -= 1; s.count += 2; }
      else { s.count = 1; }
      s.last = td;
      if (s.count % 7 === 0) { s.freezes = Math.min(3, (s.freezes || 0) + 1); }
      localStorage.setItem(STREAK_KEY, JSON.stringify(s));
      /* keep the legacy dashboard belt-point + games grid happy */
      try {
        var done = JSON.parse(localStorage.getItem('quizCompleted') || '[]');
        var ds = t.toDateString();
        if (done.indexOf(ds) === -1) { done.push(ds); localStorage.setItem('quizCompleted', JSON.stringify(done)); }
      } catch (e) {}
      return s;
    } catch (e) { return streak(); }
  }

  function coachRecord(id, pct, label) {
    try {
      if (global.Coach && global.Coach.recordQuiz && id != null) {
        var p = Math.max(0, Math.min(100, Math.round(pct)));
        global.Coach.recordQuiz(id, p, label || 'Game');
      }
    } catch (e) {}
  }
  function recordArg(argId, pct, label) { coachRecord(argId, pct, label); }
  function recordCat(cat, pct, label) { if (cat) coachRecord('cat:' + cat, pct, label); }

  function finish(opts) {
    opts = opts || {};
    var pct = opts.pct;
    if (pct == null && opts.total) pct = Math.round((opts.correct || 0) / opts.total * 100);
    if (pct == null) pct = 0;
    var s = mark();
    (opts.cats || []).forEach(function (c) { recordCat(c, pct, opts.label); });
    (opts.args || []).forEach(function (a) { recordArg(a, pct, opts.label); });
    return s;
  }

  /* ── universal share card ── */
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /* opts: { game, correct, total, results:[bool], unit, tagline, cta, path, icon } */
  function normResults(opts) {
    var total = opts.total || (opts.results ? opts.results.length : 10);
    if (opts.results && opts.results.length === total) return opts.results.slice();
    var correct = opts.correct || 0;
    return Array.from({ length: total }, function (_, i) { return i < correct; });
  }

  function buildCard(opts) {
    var results = normResults(opts);
    var total = results.length;
    var correct = (opts.correct != null) ? opts.correct : results.filter(Boolean).length;
    var pct = Math.round(correct / total * 100);
    var cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1080;
    var c = cv.getContext('2d');
    c.fillStyle = '#0a1628'; c.fillRect(0, 0, 1080, 1080);
    c.strokeStyle = 'rgba(200,169,81,0.35)'; c.lineWidth = 3; rr(c, 40, 40, 1000, 1000, 28); c.stroke();
    c.textAlign = 'center';
    c.fillStyle = '#c8a951'; c.font = '700 38px "DM Sans",sans-serif'; c.fillText('A P O L O G I A   D A I L Y', 540, 160);
    c.strokeStyle = 'rgba(200,169,81,0.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(390, 200); c.lineTo(690, 200); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.55)'; c.font = '500 30px "DM Sans",sans-serif';
    c.fillText((opts.game || 'DAILY GAME').toUpperCase(), 540, 290);
    c.fillStyle = '#e8cf87'; c.font = '700 180px "Playfair Display",Georgia,serif'; c.fillText(correct + '/' + total, 540, 500);
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.font = '400 32px "DM Sans",sans-serif'; c.fillText(opts.unit || 'correct', 540, 552);
    /* result grid — up to 2 rows of 5 */
    var perRow = 5, size = 100, gap = 22;
    var rowW = perRow * size + (perRow - 1) * gap, startX = (1080 - rowW) / 2, startY = 610;
    results.slice(0, 10).forEach(function (ok, i) {
      var x = startX + (i % perRow) * (size + gap), y = startY + Math.floor(i / perRow) * (size + gap);
      if (ok) {
        c.fillStyle = '#c8a951'; rr(c, x, y, size, size, 13); c.fill();
        c.strokeStyle = '#0a1628'; c.lineWidth = 8; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x + 27, y + 52); c.lineTo(x + 43, y + 70); c.lineTo(x + 73, y + 32); c.stroke();
      } else {
        c.fillStyle = 'rgba(255,255,255,0.07)'; rr(c, x, y, size, size, 13); c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 2; rr(c, x, y, size, size, 13); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x + 33, y + 33); c.lineTo(x + 67, y + 67); c.moveTo(x + 67, y + 33); c.lineTo(x + 33, y + 67); c.stroke();
      }
    });
    c.fillStyle = '#e8cf87'; c.font = '600 46px "DM Sans",sans-serif'; c.fillText(pct + '% accuracy', 540, 905);
    if (opts.tagline) { c.fillStyle = 'rgba(255,255,255,0.45)'; c.font = '400 28px "DM Sans",sans-serif'; c.fillText(opts.tagline, 540, 955); }
    c.fillStyle = '#c8a951'; c.font = '600 34px "DM Sans",sans-serif'; c.fillText((opts.cta || 'Can you beat it?') + '  apologiadaily.com', 540, 1015);
    return cv;
  }

  function spoiler(opts) {
    var results = normResults(opts);
    var total = results.length;
    var correct = (opts.correct != null) ? opts.correct : results.filter(Boolean).length;
    var icon = opts.icon || '✅';
    var row = function (n) { return results.slice(n, n + 5).map(function (ok) { return ok ? icon : '⬛'; }).join(''); };
    var path = opts.path || '/games.html';
    var url = 'https://apologiadaily.com' + path;
    return 'Apologia Daily — ' + (opts.game || 'Daily Game') + '\n' +
           row(0) + (total > 5 ? '\n' + row(5) : '') + '  ' + correct + '/' + total + '\n' +
           (opts.cta || 'Can you beat it?') + ' ' + url;
  }

  async function share(opts) {
    opts = opts || {};
    var text = spoiler(opts);
    var fname = 'apologia-' + (opts.game || 'game').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
    try {
      await (document.fonts && document.fonts.ready);
      var canvas = buildCard(opts);
      var blob = await new Promise(function (res) { canvas.toBlob(res, 'image/png'); });
      var file = new File([blob], fname, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: text }); return; }
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname;
      document.body.appendChild(a); a.click(); a.remove();
      if (navigator.clipboard) { try { await navigator.clipboard.writeText(text); } catch (e) {} }
      alert('Your result card was downloaded and the challenge text copied — post them anywhere!');
    } catch (e) {
      var url = 'https://apologiadaily.com' + (opts.path || '/games.html');
      if (navigator.share) { navigator.share({ text: text, url: url }); }
      else if (navigator.clipboard) { navigator.clipboard.writeText(text); alert('Result copied to clipboard — paste it anywhere!'); }
    }
  }

  global.ADGame = {
    streak: streak, mark: mark,
    recordArg: recordArg, recordCat: recordCat, finish: finish,
    buildCard: buildCard, spoiler: spoiler, share: share
  };
})(window);
