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
 * reviews" rather than an error. (The Supabase 'flashcards' account deck is
 * a separate store; since 2026-09-30 /today reviews both together via
 * lib/study-queue.js, and the standalone flashcards page is retired. These
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
      delete e.hot;
      m[id] = e; save(m);
    },
    isDue: function (id) { var e = load()[id]; return !!(e && e.due <= todayISO()); },
    isTracked: function (id) { return !!load()[id]; },
    /* Arguments due today, soonest-due first. */
    due: function () {
      var m = load(), t = todayISO(), out = [];
      for (var k in m) { if (Object.prototype.hasOwnProperty.call(m, k) && m[k].due <= t) out.push({ id: k, title: m[k].t, url: m[k].u, due: m[k].due, hot: !!m[k].hot }); }
      /* 1.7: a confidently-wrong argument (calibration gap >= 2) is 'hot' and goes first. */
      out.sort(function (a, b) { var h = (m[b.id].hot ? 1 : 0) - (m[a.id].hot ? 1 : 0); if (h) return h; return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0); });
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

  /* ---- "Teach me this" Socratic launcher ----
     The guided-reasoning tutor already exists and is already doctrine-gated
     (its system prompt lives in api/tutor.js, mode "socratic"; the engine is
     /library/socratic.js, which runs on the essays and the hub but was never
     wired to the mastery pages). This mounts a launcher between "Understand"
     and "Practice" — the seam where guided reconstruction belongs — and, on
     click, lazy-loads the engine and starts a walkthrough grounded in THIS
     page's own certified text (ARG_PREMISES + the Understand section). No new
     doctrinal content and no gate: this is interaction plumbing, and the tutor
     teaches only from the certified text handed to it at call time. */
  function masteryExcerpt() {
    var parts = [];
    try { if (Array.isArray(window.ARG_PREMISES)) parts.push(window.ARG_PREMISES.join('\n\n')); } catch (e) {}
    var u = document.getElementById('understand');
    if (u) parts.push((u.innerText || u.textContent || '').replace(/\s+/g, ' ').trim());
    return parts.join('\n\n').slice(0, 40000);
  }
  function loadSocratic(cb) {
    if (window.openSocratic) { cb(); return; }
    var existing = document.getElementById('ad-soc-js');
    var poll = function () { var iv = setInterval(function () { if (window.openSocratic) { clearInterval(iv); cb(); } }, 50); setTimeout(function () { clearInterval(iv); }, 8000); };
    if (existing) { poll(); return; }
    var s = document.createElement('script');
    s.id = 'ad-soc-js'; s.src = '/library/socratic.js'; s.defer = true;
    s.onload = function () { if (window.openSocratic) cb(); else poll(); };
    s.onerror = function () { alert('The guided tutor could not load. Please try again in a moment.'); };
    document.body.appendChild(s);
  }
  function injectSocraticLauncher() {
    if (document.getElementById('ad-teachme')) return;
    var practice = document.getElementById('practice');
    if (!practice) return;
    var wrap = document.createElement('div');
    wrap.id = 'ad-teachme';
    wrap.style.cssText = 'margin:1.5rem 0;';
    wrap.innerHTML =
      '<button type="button" id="ad-teachme-btn" style="width:100%;text-align:left;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;background:linear-gradient(120deg,#0a1628,#0f2040);border:1px solid rgba(200,169,81,.4);border-radius:10px;padding:1rem 1.25rem;">' +
        '<span style="display:flex;align-items:center;gap:.7rem;">' +
          '<span style="font-size:1.15rem;">&#129504;</span>' +
          '<span>' +
            '<span style="display:block;font-family:var(--fd,\'Playfair Display\',serif);font-size:.95rem;font-weight:700;color:#fff;">Teach me this &mdash; build the argument yourself</span>' +
            '<span style="display:block;font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.76rem;color:rgba(255,255,255,.6);margin-top:2px;">A guided, one-question-at-a-time walkthrough. The tutor asks; you reason it out, in your own words.</span>' +
          '</span>' +
        '</span>' +
        '<span style="font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.82rem;font-weight:600;padding:9px 18px;border-radius:5px;background:var(--g,#c8a951);color:#050d1a;white-space:nowrap;">Start &rarr;</span>' +
      '</button>';
    practice.parentNode.insertBefore(wrap, practice);
    var btn = document.getElementById('ad-teachme-btn');
    if (btn) btn.addEventListener('click', function () {
      btn.disabled = true; var cta = btn.querySelector('span:last-child'); var old = cta ? cta.textContent : '';
      if (cta) cta.textContent = 'Loading…';
      loadSocratic(function () {
        if (cta) cta.textContent = old || 'Start →';
        btn.disabled = false;
        try { window.openSocratic({ argument: pageTitle(), getExcerpt: masteryExcerpt }); } catch (e) {}
      });
    });
  }

  /* ---- Calibration on "Explain It Back" ----
     The mastery dial fills from activities done (sections opened, cards seen);
     the honest readiness signal is whether you can actually recall the argument.
     This asks the learner to PREDICT their score before they check, then shows
     the gap ("you predicted 8, you scored 5") — the fluency-illusion corrective:
     seeing the gap is itself the intervention, and it stops people quitting
     while they feel ready but are not. Additive DOM enhancement; the page's own
     scoring is unchanged. Calibration is stored under its own key so it never
     races the page's ad_mastery writes. */
  var CAL_KEY = 'ad_calibration';
  var predicted = null;
  function saveCalib(actual) {
    try { var m = JSON.parse(localStorage.getItem(CAL_KEY) || '{}'); m[ARG] = { p: predicted, a: actual, at: todayISO() }; localStorage.setItem(CAL_KEY, JSON.stringify(m)); } catch (e) {}
  }
  function injectCalibration() {
    var box = document.getElementById('explainBox');
    var scoreBtn = document.querySelector('button[onclick*="scoreExplain"]');
    var scoreNum = document.getElementById('scoreNum');
    var scoreOut = document.getElementById('scoreOut');
    if (!box || !scoreBtn || !scoreNum || !scoreOut) return;
    if (document.getElementById('ad-predict')) return;
    var row = document.createElement('div');
    row.id = 'ad-predict';
    row.style.cssText = 'margin:0 0 0.9rem;';
    var bands = [[3, 'Shaky'], [5, 'Getting there'], [7, 'Solid'], [9, 'Nailed it']];
    row.innerHTML =
      '<div style="font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.82rem;color:var(--tm,#5a6b82);margin-bottom:.4rem;">Before you check &mdash; how well did you do?</div>' +
      '<div style="display:flex;gap:.4rem;flex-wrap:wrap;">' +
        bands.map(function (b) { return '<button type="button" class="ad-pred-b" data-p="' + b[0] + '" style="font-family:var(--ui,sans-serif);font-size:.78rem;font-weight:500;padding:6px 12px;border:1px solid var(--border,#e8e2d8);border-radius:99px;background:#fff;color:var(--td,#0a1628);cursor:pointer;">' + b[1] + '</button>'; }).join('') +
      '</div>';
    var btnrow = scoreBtn.closest('.btnrow') || scoreBtn.parentNode;
    if (btnrow && btnrow.parentNode) btnrow.parentNode.insertBefore(row, btnrow);
    [].forEach.call(row.querySelectorAll('.ad-pred-b'), function (b) {
      b.addEventListener('click', function () {
        predicted = parseInt(b.getAttribute('data-p'), 10);
        [].forEach.call(row.querySelectorAll('.ad-pred-b'), function (o) { o.style.background = '#fff'; o.style.color = 'var(--td,#0a1628)'; o.style.borderColor = 'var(--border,#e8e2d8)'; });
        b.style.background = 'var(--g,#c8a951)'; b.style.color = '#050d1a'; b.style.borderColor = 'var(--g,#c8a951)';
      });
    });
    var mo = new MutationObserver(function () {
      var txt = (scoreNum.textContent || '').trim();
      var m = txt.match(/(\d+)\s*\/\s*10/);
      if (!m || predicted == null) return; // empty scoreNum = crisis path; skip
      var actual = parseInt(m[1], 10);
      var diff = predicted - actual;
      var msg = Math.abs(diff) <= 1
        ? 'Well-calibrated &mdash; you know what you know.'
        : (diff >= 2
          ? 'That&rsquo;s the fluency trap: it felt more solid than it was. Worth another pass before you lean on it in a real conversation.'
          : 'You knew it better than you thought &mdash; trust it a little more.');
      var el = document.getElementById('ad-calib') || document.createElement('div');
      el.id = 'ad-calib';
      el.style.cssText = 'margin-top:.8rem;padding:.7rem .9rem;border-radius:6px;background:rgba(200,169,81,.1);border:1px solid rgba(200,169,81,.35);font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.85rem;line-height:1.55;color:var(--td,#0a1628);';
      el.innerHTML = '<b>You predicted &ldquo;' + bandLabel(predicted) + '&rdquo; (~' + predicted + '/10); you scored ' + actual + '/10.</b> ' + msg;
      if (!el.parentNode) scoreOut.appendChild(el);
      saveCalib(actual);
    });
    mo.observe(scoreNum, { childList: true, subtree: true, characterData: true });
  }
  function bandLabel(p) { return p <= 3 ? 'Shaky' : (p <= 5 ? 'Getting there' : (p <= 7 ? 'Solid' : 'Nailed it')); }

  /* ---- Deployment ladder: fill-in-the-blanks (the missing middle rung) ----
     Beginners learn a skill best by watching a worked example, then practising
     with scaffolding, then going solo (worked example -> completion ->
     independent). The mastery page already has the outer rungs: Drill 3's
     certified "model response" is a worked example, and its open box is the
     independent attempt. The middle rung — a completion / fill-in-the-blanks —
     was missing. This builds it by CLOZE-ing the page's OWN certified model
     answer (blank out key words for the learner to recall), inserted before
     Drill 3. It reuses already-gated text and adds no new prose, so no gate. */
  function injectCompletionDrill() {
    var model = document.getElementById('modelAns');
    var debate = document.getElementById('debateBox');
    if (!model || !debate) return;
    if (document.getElementById('ad-completion')) return;
    var full = (model.innerText || model.textContent || '').replace(/\s+/g, ' ').trim();
    if (full.length < 120) return; // too short to make a worthwhile cloze
    var cloze = makeCloze(full);
    if (!cloze) return;
    var card = debate.closest ? debate.closest('.practicecard') : null;
    if (!card || !card.parentNode) return;
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
    var wrap = document.createElement('div');
    wrap.className = 'practicecard';
    wrap.id = 'ad-completion';
    wrap.innerHTML =
      '<span class="kick" style="font-family:var(--ui,sans-serif);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gd,#a88930);font-weight:600;display:block;margin-bottom:11px">Drill &middot; Fill in the blanks</span>' +
      '<h4 style="font-family:var(--fd,\'Playfair Display\',serif);font-size:19px;font-weight:600;margin-bottom:6px">Rebuild the reply, word by word</h4>' +
      '<p style="font-size:15px;color:var(--tm,#5a6b82);font-family:var(--ui,sans-serif);margin-bottom:14px">The training-wheels step between reading the argument and defending it cold. Try to recall each blank &mdash; tap to check. New to this one? <button type="button" id="ad-show-model" style="background:none;border:none;padding:0;color:var(--gd,#a88930);font-weight:600;cursor:pointer;font-family:inherit;font-size:inherit;text-decoration:underline;">read the model first</button>. Already confident? Skip to the live drill below and do it cold.</p>' +
      '<div id="ad-cloze-text" style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:1.02rem;line-height:1.9;color:var(--td,#2a3140);background:var(--w,#fff);border:1px solid var(--border,#e8e2d8);border-radius:8px;padding:14px 16px;">' + cloze + '</div>' +
      '<div style="margin-top:.7rem;"><button type="button" id="ad-reveal-all" style="font-family:var(--ui,sans-serif);font-size:.82rem;font-weight:500;padding:7px 14px;border:1px solid var(--border,#e8e2d8);border-radius:5px;background:#fff;color:var(--td,#0a1628);cursor:pointer;">Reveal all</button></div>';
    card.parentNode.insertBefore(wrap, card);
    // reveal a single blank on tap
    [].forEach.call(wrap.querySelectorAll('.ad-cloze'), function (b) {
      b.addEventListener('click', function () { revealCloze(b); });
    });
    var all = document.getElementById('ad-reveal-all');
    if (all) all.addEventListener('click', function () { [].forEach.call(wrap.querySelectorAll('.ad-cloze'), revealCloze); });
    var sm = document.getElementById('ad-show-model');
    if (sm) sm.addEventListener('click', function () {
      var t = document.getElementById('ad-cloze-text');
      if (t) { t.innerHTML = esc(full); }
      sm.textContent = 'model shown ✓'; sm.disabled = true; sm.style.textDecoration = 'none';
    });
  }
  function revealCloze(b) {
    if (!b || b.dataset.done) return;
    b.dataset.done = '1';
    b.textContent = b.getAttribute('data-w') || '';
    b.style.cssText = 'background:none;border:none;padding:0;color:var(--gd,#a88930);font-weight:600;font-family:inherit;font-size:inherit;cursor:default;';
  }
  function makeCloze(text) {
    var tokens = text.split(/(\s+)/); // keep whitespace tokens
    var cand = [];
    for (var i = 0; i < tokens.length; i++) {
      var core = tokens[i].replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
      if (/^[A-Za-z][A-Za-z'’-]{5,}$/.test(core) || /^\d{2,}$/.test(core)) cand.push(i);
    }
    if (cand.length < 2) return null;
    var want = Math.min(5, cand.length), step = Math.max(1, Math.floor(cand.length / want));
    var chosen = {};
    for (var k = 0; k < want; k++) { chosen[cand[Math.min(cand.length - 1, k * step)]] = true; }
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
    var out = '';
    for (var j = 0; j < tokens.length; j++) {
      if (chosen[j]) {
        var w = tokens[j], core2 = w.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
        var at = w.indexOf(core2), pre = w.slice(0, at), post = w.slice(at + core2.length);
        var dots = new Array(Math.min(core2.length, 12) + 1).join('•');
        out += esc(pre) + '<button type="button" class="ad-cloze" data-w="' + esc(core2) + '" title="Tap to reveal" style="min-width:' + (core2.length * 0.55 + 1) + 'em;border:0;border-bottom:2px dashed var(--gd,#a88930);background:rgba(200,169,81,.12);color:transparent;border-radius:3px;font-family:inherit;font-size:inherit;cursor:pointer;padding:0 3px;letter-spacing:1px;">' + dots + '</button>' + esc(post);
      } else {
        out += esc(tokens[j]);
      }
    }
    return out;
  }

  document.addEventListener('DOMContentLoaded', function () { sync(); injectBanner(); injectObjectionCTA(); injectSocraticLauncher(); injectCalibration(); injectCompletionDrill(); });
  // Catch the moment a learner reaches 100% without a reload, and re-sync on return.
  document.addEventListener('visibilitychange', function () { if (!document.hidden) sync(); });
  window.addEventListener('pageshow', sync);
})();

/* =====================================================================
   PHASE 1 (2026-10-11) — the honest-mechanics layer.
   docs/MASTERY_ROLLOUT_GUIDE_2026-10-11.md, steps 1.2–1.9 and 1.12.

   WHAT THIS ADDS (all plumbing; every string a learner reads below is either a
   short UI label or text the page ALREADY carries — card fronts/backs, the OBJ
   objections and their certified replies, ARG_PREMISES):

   1. Per-card graded flashcards (1.3). The learner types the key idea BEFORE the
      card flips; the layer shows which of the card's own key terms the answer
      missed, the learner marks Got it / Missed it, and each card keeps its own
      schedule (ladder 1/3/7/16/35/90 days). A card "rests" after 3 correct
      recalls. Due cards surface on /today via ADReview.dueCards().
   2. The spaced review is a RE-PROOF (1.2): when an argument is due, the banner
      poses one of the page's own cards or cold objections, requires a typed
      answer, reveals the certified reply with the missed key terms, and only then
      lets the learner grade it. "I've still got it" without producing anything
      no longer exists.
   3. Pretest (1.4): before the summary, "a friend says X — what would you say
      right now?" (X = the page's first cold objection). Saved and compared at the
      Bronze checkpoint.
   4. Discrimination drill (1.5): "Which argument answers this?" — 3 of this
      page's objections + 2 from sibling arguments (objections.json, same
      category). Pass = 4/5; recorded as ad_mastery[arg].disc, a Gold sub-gate.
   5. If-then plans (1.6): after Silver, two "If someone says… / I'll start
      with…" rows, stored in ad_ifthen_arg and shown again at review time.
   6. Confident-wrong first (1.7): a calibration gap of 2+ marks the argument
      "hot" and brings its review forward to today.
   7. Hide-the-page toggle on Explain It Back (1.8).
   8. Listen buttons (1.9): read the summary / a certified reply aloud.
   9. Typed cloze + fade (1.12): blanks are typed and checked; once a page is
      past Silver the fill-in-the-blanks drill collapses by default.

   CARD RULE (data contract, 1.1): cards test the STRUCTURE of the argument —
   premises, what each objection attacks, what the conclusion does and does not
   reach — never a scholar's name, a year or a page number as the answer.
   Memory for structure lasts years; names and dates decay first.

   Storage: ad_cards {arg:{i:{n,step,due,last,q,a}}}, ad_pretest {arg:{t,at}},
   ad_ifthen_arg {arg:[{i,t}]}, ad_reviews[arg].hot. All localStorage, all
   try/catch-guarded, synced by progress-sync.js where listed there.
   ===================================================================== */
(function () {
  var CKEY = 'ad_cards', PKEY = 'ad_pretest', IKEY = 'ad_ifthen_arg';
  var LADDER = [1, 3, 7, 16, 35, 90];
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function addDays(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function jget(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function words(s) { return String(s || '').trim().split(/\s+/).filter(Boolean); }
  var STOP = /^(about|above|after|again|against|almost|already|always|another|anything|around|because|before|begins?|being|between|cannot|could|doesn|during|either|enough|every|everything|exist|exists|existence|happen|having|instead|itself|little|merely|might|nothing|often|others?|really|rather|should|simply|something|their|there|these|things?|those|through|toward|under|unless|whatever|whether|which|while|without|would|yours?)$/;
  /* The card's / reply's own distinctive terms (6+ letters, not a stopword). */
  function keyTerms(text) {
    var seen = {}, out = [];
    words(String(text).toLowerCase().replace(/[^a-z0-9'’\s-]/g, ' ')).forEach(function (w) {
      w = w.replace(/^[-'’]+|[-'’]+$/g, '');
      if (w.length < 6 || STOP.test(w) || seen[w]) return;
      seen[w] = 1; out.push(w);
    });
    return out;
  }
  function stem(w) { return w.replace(/(ness|ally|ing|ed|es|s|ly)$/, ''); }
  function missedTerms(answer, model) {
    var a = String(answer).toLowerCase(), hits = [], miss = [];
    keyTerms(model).forEach(function (t) { (a.indexOf(stem(t)) !== -1 ? hits : miss).push(t); });
    return { hits: hits, miss: miss };
  }
  function feedbackHTML(answer, model) {
    var r = missedTerms(answer, model), tot = r.hits.length + r.miss.length;
    if (!tot) return '';
    var pct = Math.round(100 * r.hits.length / tot);
    var line = r.miss.length
      ? 'Your answer covered ' + r.hits.length + ' of ' + tot + ' key terms. Not mentioned: <b>' + esc(r.miss.slice(0, 4).join(', ')) + '</b>' + (r.miss.length > 4 ? '…' : '') + '.'
      : 'Your answer touched every key term in the reply.';
    return '<div class="ad-kt" style="font-family:var(--ui,\'DM Sans\',sans-serif);font-size:.8rem;color:var(--tm,#5a6b82);margin:.45rem 0 .2rem;">' + line + ' <span style="opacity:.7">(' + pct + '% term overlap — a hint, not a grade; judge the substance yourself.)</span></div>';
  }
  function levelNow(arg) { try { var e = (JSON.parse(localStorage.getItem('ad_mastery') || '{}') || {})[arg]; return e ? (e.level || 0) : 0; } catch (e) { return 0; } }
  function bsgPage() { return typeof OBJ !== 'undefined' && Array.isArray(OBJ) && OBJ.length > 0 && typeof cards !== 'undefined' && Array.isArray(cards); }
  var UI = 'font-family:var(--ui,\'DM Sans\',sans-serif);';
  var BTN = UI + 'font-size:.82rem;font-weight:600;padding:8px 16px;border:none;border-radius:5px;background:var(--g,#c8a951);color:#050d1a;cursor:pointer;';
  var GHOST = UI + 'font-size:.82rem;font-weight:500;padding:8px 14px;border:1px solid rgba(200,169,81,.5);border-radius:5px;background:transparent;color:var(--gd,#a88930);cursor:pointer;';
  var TA = UI + 'width:100%;box-sizing:border-box;min-height:84px;padding:10px 12px;border:1px solid var(--border,#e8e2d8);border-radius:6px;font-size:.95rem;line-height:1.55;resize:vertical;background:#fff;color:var(--td,#0a1628);';

  /* ---------- card store + public API (available on every page) ---------- */
  function cardsAll() { return jget(CKEY, {}); }
  function cardState(arg, i) { var m = cardsAll(); return (m[arg] && m[arg][i]) || null; }
  function gradeCard(arg, i, quality, q, a) {
    var m = cardsAll(); m[arg] = m[arg] || {};
    var s = m[arg][i] || { n: 0, step: 0 };
    if (quality >= 3) { s.n = (s.n || 0) + 1; s.step = Math.min((s.step || 0) + 1, LADDER.length - 1); }
    else { s.n = 0; s.step = 0; }
    /* first correct recall -> back tomorrow; then 3, 7, 16, 35, 90 days */
    s.due = addDays(todayISO(), LADDER[quality >= 3 ? Math.max(0, s.step - 1) : 0]); s.last = todayISO();
    if (q) s.q = q; if (a) s.a = a;
    m[arg][i] = s; jset(CKEY, m);
    return s;
  }
  function dueCards() {
    var m = cardsAll(), t = todayISO(), out = [];
    for (var arg in m) if (Object.prototype.hasOwnProperty.call(m, arg)) {
      for (var i in m[arg]) if (Object.prototype.hasOwnProperty.call(m[arg], i)) {
        var s = m[arg][i];
        if (s && s.q && s.due && s.due <= t) out.push({ kind: 'mcard', arg: arg, i: i, q: s.q, a: s.a, due: s.due, n: s.n || 0 });
      }
    }
    out.sort(function (x, y) { return x.due < y.due ? -1 : (x.due > y.due ? 1 : 0); });
    return out;
  }
  if (window.ADReview) {
    window.ADReview.dueCards = dueCards;
    window.ADReview.gradeCard = gradeCard;
    window.ADReview.dueCardCount = function () { return dueCards().length; };
    window.ADReview.feedbackHTML = feedbackHTML;
    window.ADReview.ifThenFor = function (arg) { return jget(IKEY, {})[arg] || []; };
  }

  /* ---------- tell the service worker what is due (push reminders, 1.10) ---------- */
  function postDue() {
    try {
      if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
      var due = (window.ADReview ? window.ADReview.due() : []), n = due.length + dueCards().length;
      try { if (window.ADStudy && window.ADStudy.localDueCount) n = window.ADStudy.localDueCount() + dueCards().length; } catch (e) {}
      navigator.serviceWorker.controller.postMessage({ type: 'ad-due', n: n, oldest: due.length ? due[0].title : '', at: todayISO() });
    } catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () { setTimeout(postDue, 800); });

  /* ======================= mastery pages only from here ======================= */
  if (!/\/ev-m-[^\/]+\.html$/.test(location.pathname)) return;
  var ARG = location.pathname.split('/').pop().replace('ev-m-', '').replace('.html', '');
  function pageTitle() { var h = document.querySelector('h1'); var t = h ? (h.textContent || '').replace(/\s+/g, ' ').trim() : ''; return t || (document.title || ARG).split('|')[0].replace(/\s+$/, '').trim(); }

  /* ---------- 1. graded, scheduled flashcards ---------- */
  function initCards() {
    var flash = document.getElementById('flash'), wrap = flash && flash.closest('.flashwrap');
    if (!flash || !wrap || typeof cards === 'undefined' || !Array.isArray(cards)) return;
    if (document.getElementById('ad-cardgrade')) return;
    flash.onclick = null; flash.removeAttribute('onclick'); // flipping is now earned by typing first
    var box = document.createElement('div');
    box.id = 'ad-cardgrade';
    box.style.cssText = 'margin:.8rem 0 0;';
    box.innerHTML =
      '<div style="' + UI + 'font-size:.8rem;color:var(--tm,#5a6b82);margin-bottom:.4rem;">Say it out loud, then <b>type the key idea</b> (a line is enough). The card flips once you have.</div>' +
      '<textarea id="ad-cardans" style="' + TA + 'min-height:64px" placeholder="Your answer, from memory…"></textarea>' +
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;align-items:center;">' +
        '<button type="button" id="ad-cardcheck" style="' + BTN + '">Check &amp; flip</button>' +
        '<span id="ad-cardstat" style="' + UI + 'font-size:.78rem;color:var(--tm,#5a6b82);"></span>' +
      '</div>' +
      '<div id="ad-cardfb"></div>' +
      '<div id="ad-cardrate" style="display:none;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;">' +
        '<button type="button" data-q="5" style="' + BTN + '">Got it &#10003;</button>' +
        '<button type="button" data-q="1" style="' + GHOST + '">Missed it — bring it back tomorrow</button>' +
      '</div>';
    wrap.parentNode.insertBefore(box, wrap.nextSibling);
    var ans = document.getElementById('ad-cardans'), chk = document.getElementById('ad-cardcheck'),
        fb = document.getElementById('ad-cardfb'), rate = document.getElementById('ad-cardrate'), stat = document.getElementById('ad-cardstat');
    function idx() { var m = ((document.getElementById('cardCount') || {}).textContent || '').match(/(\d+)\s+of/); return m ? parseInt(m[1], 10) - 1 : 0; }
    function status() {
      var s = cardState(ARG, idx());
      if (!s) { stat.textContent = 'Not yet graded.'; return; }
      stat.innerHTML = (s.n >= 3 ? '&#10003; Recalled ' + s.n + '× — resting until ' + esc(s.due) : 'Recalled ' + s.n + ' of 3 · back on ' + esc(s.due));
    }
    function reset() { ans.value = ''; fb.innerHTML = ''; rate.style.display = 'none'; chk.disabled = false; flash.classList.remove('flipped'); status(); }
    chk.addEventListener('click', function () {
      if (words(ans.value).length < 3) { fb.innerHTML = '<div style="' + UI + 'font-size:.8rem;color:#a32d2d;margin-top:.4rem;">Type at least a few words first — the recall is the point.</div>'; return; }
      flash.classList.add('flipped');
      fb.innerHTML = feedbackHTML(ans.value, cards[idx()].a);
      rate.style.display = 'flex'; chk.disabled = true;
    });
    flash.addEventListener('click', function () { if (flash.classList.contains('flipped')) flash.classList.remove('flipped'); else if (chk.disabled) flash.classList.add('flipped'); });
    [].forEach.call(rate.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        var i = idx(), c = cards[i];
        gradeCard(ARG, i, parseInt(b.getAttribute('data-q'), 10), c.q, c.a);
        status(); rate.style.display = 'none';
        fb.innerHTML += '<div style="' + UI + 'font-size:.8rem;color:#2f7d4f;margin-top:.3rem;">Recorded. Next card &rarr;</div>';
        postDue();
      });
    });
    var cc = document.getElementById('cardCount');
    if (cc) new MutationObserver(function () { reset(); }).observe(cc, { childList: true, characterData: true, subtree: true });
    status();
  }

  /* ---------- 2. the spaced review as a re-proof ---------- */
  function initReproof() {
    var API = window.ADReview; if (!API || !API.isDue(ARG)) return;
    var old = document.getElementById('ad-review-banner'); if (old) old.remove();
    if (document.getElementById('ad-reproof')) return;
    var anchor = document.querySelector('.dialcard') || document.querySelector('#understand'); if (!anchor) return;
    var entry = (API.all() || {})[ARG] || {}, step = entry.step || 0;
    var item;
    if (bsgPage()) {
      if (step % 2 === 0) { var c = cards[Math.floor(Math.random() * cards.length)]; item = { who: 'Recall', q: c.q, model: c.a }; }
      else { var o = OBJ[Math.floor(Math.random() * OBJ.length)]; item = { who: o.who, q: '"' + o.q + '"', model: o.model }; }
    } else {
      var prem = Array.isArray(window.ARG_PREMISES) ? window.ARG_PREMISES.join(' ') : '';
      item = { who: 'Recall', q: 'State the argument — both premises and the conclusion — from memory.', model: prem };
    }
    var plans = jget(IKEY, {})[ARG] || [];
    var b = document.createElement('div');
    b.id = 'ad-reproof';
    b.style.cssText = 'background:linear-gradient(135deg,#0a1628,#0f2040);border:1px solid rgba(200,169,81,0.5);border-radius:12px;padding:1rem 1.25rem;margin:0 0 1.25rem;color:#fff;';
    b.innerHTML =
      '<div style="font-family:var(--fd,\'Playfair Display\',serif);font-size:1.05rem;font-weight:700;">&#128260; Time to re-prove this argument</div>' +
      '<div style="' + UI + 'font-size:.85rem;color:rgba(255,255,255,.7);margin:.35rem 0 .7rem;">Before you re-read anything: answer this from memory. Only a produced answer counts toward Gold.</div>' +
      '<div style="' + UI + 'font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--g,#c8a951);">' + esc(item.who) + '</div>' +
      '<div style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:1rem;line-height:1.55;margin:.25rem 0 .6rem;">' + esc(item.q) + '</div>' +
      (plans.length ? '<div style="' + UI + 'font-size:.78rem;color:rgba(255,255,255,.6);margin-bottom:.5rem;">Your plan: ' + plans.map(function (p) { return '<i>if</i> ' + esc(p.i) + ' &rarr; <i>then</i> ' + esc(p.t); }).join(' &nbsp;·&nbsp; ') + '</div>' : '') +
      '<textarea id="ad-rp-ans" style="' + TA + 'min-height:72px;background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.2)" placeholder="Your answer, from memory (a few sentences)…"></textarea>' +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem;"><button type="button" id="ad-rp-check" style="' + BTN + '">Check my answer</button></div>' +
      '<div id="ad-rp-out" style="display:none;margin-top:.8rem;">' +
        '<div style="' + UI + 'font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--g,#c8a951);">The page\'s own reply</div>' +
        '<div style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:.95rem;line-height:1.6;margin:.25rem 0 .3rem;color:#f1ede4;">' + esc(item.model) + '</div>' +
        '<div id="ad-rp-fb"></div>' +
        '<div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem;">' +
          '<button type="button" id="ad-rp-good" style="' + BTN + '">I had it &#10003;</button>' +
          '<button type="button" id="ad-rp-again" style="' + GHOST + 'color:#e8cf87;">I didn&rsquo;t — bring it back soon</button>' +
        '</div>' +
      '</div>';
    anchor.parentNode.insertBefore(b, anchor);
    var ans = document.getElementById('ad-rp-ans');
    document.getElementById('ad-rp-check').addEventListener('click', function () {
      if (words(ans.value).length < 8) { ans.style.borderColor = '#f09595'; ans.placeholder = 'At least a sentence or two — this is the retrieval that makes it stick.'; return; }
      var fb = document.getElementById('ad-rp-fb'); fb.innerHTML = feedbackHTML(ans.value, item.model).replace('color:var(--tm,#5a6b82)', 'color:rgba(255,255,255,.75)');
      document.getElementById('ad-rp-out').style.display = 'block'; this.disabled = true;
    });
    function done(msg, q) {
      API.grade(ARG, q);
      try { var m = API.all(); if (m[ARG]) { delete m[ARG].hot; localStorage.setItem('ad_reviews', JSON.stringify(m)); } } catch (e) {}
      b.innerHTML = '<div style="' + UI + 'font-size:.9rem;color:#e8eefc;">' + msg + '</div>';
      try { if (typeof updateDial === 'function') updateDial(); } catch (e) {}
      postDue();
      setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 4000);
    }
    document.getElementById('ad-rp-good').addEventListener('click', function () { done('&#10003; Re-proved. It will come back after a longer gap. Keep going below to sharpen it.', 5); });
    document.getElementById('ad-rp-again').addEventListener('click', function () { done('Good call. It returns tomorrow — work through the drills below to lock it in.', 1); });
  }

  /* ---------- 3. pretest ---------- */
  function initPretest() {
    if (!bsgPage()) return;
    var dial = document.querySelector('.dialcard'), summary = document.querySelector('.seo-summary');
    var anchor = summary || dial; if (!anchor || document.getElementById('ad-pretest')) return;
    var saved = jget(PKEY, {})[ARG];
    var o = OBJ[0];
    var box = document.createElement('div');
    box.id = 'ad-pretest';
    box.style.cssText = 'background:var(--w,#fff);border:1px solid var(--border,#e8e2d8);border-left:3px solid var(--g,#c8a951);border-radius:10px;padding:1rem 1.2rem;margin:0 0 1.25rem;';
    if (saved && saved.t) {
      box.innerHTML = '<div style="' + UI + 'font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gd,#a88930);">Before you read &middot; saved</div>' +
        '<div style="' + UI + 'font-size:.85rem;color:var(--tm,#5a6b82);margin-top:.3rem;">Your first attempt at &ldquo;' + esc(o.q) + '&rdquo; is saved. You&rsquo;ll compare it with the certified reply at the Bronze checkpoint.</div>';
    } else {
      box.innerHTML = '<div style="' + UI + 'font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gd,#a88930);">Before you read &middot; try it first</div>' +
        '<div style="font-family:var(--fd,\'Playfair Display\',serif);font-size:1.05rem;font-weight:600;margin:.3rem 0 .2rem;color:var(--td,#0a1628);">A friend says: &ldquo;' + esc(o.q) + '&rdquo;</div>' +
        '<div style="' + UI + 'font-size:.85rem;color:var(--tm,#5a6b82);margin-bottom:.5rem;">What would you say right now, before reading a word of this page? One or two sentences. (Attempting first is what makes the reading stick.)</div>' +
        '<textarea id="ad-pre-ans" style="' + TA + 'min-height:64px" placeholder="I\'d say…"></textarea>' +
        '<div style="display:flex;gap:.5rem;margin-top:.5rem;"><button type="button" id="ad-pre-save" style="' + BTN + '">Save and start reading</button><button type="button" id="ad-pre-skip" style="' + GHOST + '">Skip</button></div>';
    }
    anchor.parentNode.insertBefore(box, anchor);
    var sv = document.getElementById('ad-pre-save'), sk = document.getElementById('ad-pre-skip');
    if (sv) sv.addEventListener('click', function () {
      var t = (document.getElementById('ad-pre-ans').value || '').trim(); if (words(t).length < 3) return;
      var m = jget(PKEY, {}); m[ARG] = { t: t, at: todayISO() }; jset(PKEY, m);
      box.innerHTML = '<div style="' + UI + 'font-size:.85rem;color:#2f7d4f;">&#10003; Saved. Read on — you&rsquo;ll see it beside the certified reply at the Bronze checkpoint.</div>';
      initPretestCompare();
    });
    if (sk) sk.addEventListener('click', function () { box.remove(); });
    initPretestCompare();
  }
  function initPretestCompare() {
    var gate = document.getElementById('bronzeGate'); var saved = jget(PKEY, {})[ARG];
    if (!gate || !saved || !saved.t || document.getElementById('ad-pre-cmp')) return;
    var o = OBJ[0];
    var d = document.createElement('div');
    d.id = 'ad-pre-cmp';
    d.style.cssText = 'margin-top:18px;border-top:1px solid var(--border,#e8e2d8);padding-top:16px;';
    d.innerHTML = '<div style="' + UI + 'font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gd,#a88930);">Before vs after</div>' +
      '<div style="' + UI + 'font-size:.85rem;color:var(--tm,#5a6b82);margin:.3rem 0 .5rem;">What you said to &ldquo;' + esc(o.q) + '&rdquo; before reading, beside the page&rsquo;s certified reply.</div>' +
      '<div style="display:grid;gap:.6rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">' +
        '<div style="background:var(--w,#fff);border:1px solid var(--border,#e8e2d8);border-radius:8px;padding:.7rem .9rem;"><div style="' + UI + 'font-size:.7rem;color:var(--tm,#5a6b82);text-transform:uppercase;letter-spacing:.1em;">You, before</div><div style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:.95rem;line-height:1.55;margin-top:.25rem;">' + esc(saved.t) + '</div></div>' +
        '<div style="background:rgba(200,169,81,.08);border:1px solid rgba(200,169,81,.35);border-radius:8px;padding:.7rem .9rem;"><div style="' + UI + 'font-size:.7rem;color:var(--gd,#a88930);text-transform:uppercase;letter-spacing:.1em;">The certified reply</div><div style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:.95rem;line-height:1.55;margin-top:.25rem;">' + esc(o.model) + '</div></div>' +
      '</div>' + feedbackHTML(saved.t, o.model);
    gate.appendChild(d);
  }

  /* ---------- 4. discrimination drill: which argument answers this? ---------- */
  function initDiscrimination() {
    if (!bsgPage()) return;
    var prove = document.getElementById('proveit'), unseen = document.getElementById('unseenGate');
    if (!prove || document.getElementById('ad-disc')) return;
    var card = document.createElement('div');
    card.className = 'card'; card.id = 'ad-disc';
    card.innerHTML = '<span class="kick">Gold gate &middot; which argument answers this?</span>' +
      '<h4>Five objections, four arguments &mdash; pick the right tool before you answer</h4>' +
      '<p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:14px">In a real conversation nobody tells you which argument is being attacked. Three of these are aimed at this argument; two are aimed at its neighbours on this tab. Choose the argument each one targets, then see the reply. Four of five to pass.</p>' +
      '<div id="ad-disc-body" style="' + UI + 'font-size:.85rem;color:var(--tm,#5a6b82);">Loading the objection bank&hellip;</div>';
    if (unseen && unseen.parentNode === prove) prove.insertBefore(card, unseen); else prove.appendChild(card);
    var body = document.getElementById('ad-disc-body');
    fetch('/objections.json', { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(function (j) {
      var all = (j && j.objections) || [];
      var mine = all.filter(function (o) { return o.arg === ARG; });
      var cat = mine.length ? mine[0].category : "God's Existence";
      var sibs = all.filter(function (o) { return o.arg !== ARG && o.category === cat; });
      if (sibs.length < 2) { body.textContent = 'Not enough neighbouring arguments in the bank yet for this drill.'; return; }
      build(sibs);
    });
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function build(sibs) {
      var me = pageTitle();
      var own = shuffle(OBJ).slice(0, 3).map(function (o) { return { q: o.q, who: o.who, arg: me, reply: o.model }; });
      var picked = shuffle(sibs).slice(0, 2).map(function (o) { return { q: o.front.replace(/^[^:]*:\s*/, '').replace(/^"|"$/g, ''), who: 'Skeptic', arg: o.argName, reply: o.back }; });
      var names = {}; sibs.forEach(function (s) { names[s.argName] = 1; }); picked.forEach(function (p) { delete names[p.arg]; });
      var extra = shuffle(Object.keys(names)).slice(0, 1);
      var options = shuffle([me].concat(picked.map(function (p) { return p.arg; }), extra));
      var items = shuffle(own.concat(picked)), i = 0, right = 0;
      function render() {
        if (i >= items.length) { finish(); return; }
        var it = items[i];
        body.innerHTML = '<div style="' + UI + 'font-size:.72rem;color:var(--tm,#5a6b82);margin-bottom:.3rem;">' + (i + 1) + ' of ' + items.length + '</div>' +
          '<div style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:1rem;line-height:1.55;color:var(--td,#0a1628);margin-bottom:.6rem;">&ldquo;' + esc(it.q) + '&rdquo;</div>' +
          '<div style="' + UI + 'font-size:.78rem;color:var(--tm,#5a6b82);margin-bottom:.4rem;">Which argument is this aimed at?</div>' +
          '<div id="ad-disc-opts" style="display:grid;gap:.4rem;">' + options.map(function (n) { return '<button type="button" class="btn ghost" data-n="' + esc(n) + '" style="text-align:left;">' + esc(n) + '</button>'; }).join('') + '</div>' +
          '<div id="ad-disc-reply" style="display:none;margin-top:.7rem;"></div>';
        [].forEach.call(body.querySelectorAll('#ad-disc-opts button'), function (b) {
          b.addEventListener('click', function () {
            var ok = b.getAttribute('data-n') === it.arg; if (ok) right++;
            [].forEach.call(body.querySelectorAll('#ad-disc-opts button'), function (x) { x.disabled = true; if (x.getAttribute('data-n') === it.arg) x.style.borderColor = '#2f7d4f'; });
            if (!ok) b.style.borderColor = '#a32d2d';
            var r = document.getElementById('ad-disc-reply');
            r.style.display = 'block';
            r.innerHTML = '<div style="' + UI + 'font-size:.78rem;font-weight:600;color:' + (ok ? '#2f7d4f' : '#a32d2d') + ';">' + (ok ? '&#10003; Right — ' : '&#10007; Not that one — ') + 'it targets <b>' + esc(it.arg) + '</b>.</div>' +
              '<div style="font-family:var(--ss,\'Source Serif 4\',Georgia,serif);font-size:.92rem;line-height:1.55;margin:.3rem 0 .5rem;color:var(--td,#2a3140);">' + esc(it.reply) + '</div>' +
              '<button type="button" id="ad-disc-next" style="' + BTN + '">' + (i + 1 < items.length ? 'Next &rarr;' : 'See my result') + '</button>';
            document.getElementById('ad-disc-next').addEventListener('click', function () { i++; render(); });
          });
        });
      }
      function finish() {
        var pass = right >= 4;
        if (pass) { try { var m = JSON.parse(localStorage.getItem('ad_mastery') || '{}'); m[ARG] = m[ARG] || {}; m[ARG].disc = true; localStorage.setItem('ad_mastery', JSON.stringify(m)); } catch (e) {} try { if (typeof updateDial === 'function') updateDial(); } catch (e) {} }
        body.innerHTML = '<div style="' + UI + 'font-size:.95rem;font-weight:600;color:' + (pass ? '#2f7d4f' : '#a32d2d') + ';">' + right + ' of ' + items.length + (pass ? ' — passed. That counts toward Gold.' : ' — not yet. Four of five to pass.') + '</div>' +
          '<button type="button" id="ad-disc-retry" style="' + GHOST + 'margin-top:.6rem;">Try a fresh set</button>';
        document.getElementById('ad-disc-retry').addEventListener('click', function () { build(sibs); });
      }
      render();
    }
  }

  /* ---------- 5. if-then plans ---------- */
  function initIfThen() {
    if (!bsgPage()) return;
    var prove = document.getElementById('proveit'); if (!prove || document.getElementById('ad-ifthen')) return;
    var first = prove.querySelector('.card'); if (!first) return;
    var lv = levelNow(ARG), plans = jget(IKEY, {})[ARG] || [];
    var card = document.createElement('div');
    card.className = 'card'; card.id = 'ad-ifthen';
    var rows = [0, 1].map(function (k) {
      var p = plans[k] || { i: '', t: '' };
      return '<div style="display:grid;gap:.4rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:.5rem;">' +
        '<input class="ad-it-i" placeholder="If someone says… (your own likely cue)" value="' + esc(p.i) + '" style="' + UI + 'padding:8px 10px;border:1px solid var(--border,#e8e2d8);border-radius:6px;font-size:.9rem;">' +
        '<input class="ad-it-t" placeholder="…then I\'ll start with…" value="' + esc(p.t) + '" style="' + UI + 'padding:8px 10px;border:1px solid var(--border,#e8e2d8);border-radius:6px;font-size:.9rem;"></div>';
    }).join('');
    card.innerHTML = '<span class="kick">Silver &middot; your if-then plans</span>' +
      '<h4>If they say X, I&rsquo;ll start with Y</h4>' +
      '<p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:14px">Knowledge fires in a real conversation when it is tied to a cue you will actually meet. Name two lines you expect to hear from a real person in your life, and the first thing you will say. They come back to you at review time.</p>' +
      (lv >= 2 ? rows + '<div style="display:flex;gap:.5rem;align-items:center;"><button type="button" id="ad-it-save" style="' + BTN + '">Save my plans</button><span id="ad-it-msg" style="' + UI + 'font-size:.78rem;color:#2f7d4f;"></span></div>'
               : '<div style="' + UI + 'font-size:.85rem;color:var(--tm,#5a6b82);">Unlocks at Silver &mdash; earn it above, then write your plans here.</div>');
    first.parentNode.insertBefore(card, first.nextSibling);
    var sv = document.getElementById('ad-it-save');
    if (sv) sv.addEventListener('click', function () {
      var is = card.querySelectorAll('.ad-it-i'), ts = card.querySelectorAll('.ad-it-t'), out = [];
      for (var k = 0; k < is.length; k++) { if (is[k].value.trim() && ts[k].value.trim()) out.push({ i: is[k].value.trim().slice(0, 200), t: ts[k].value.trim().slice(0, 300) }); }
      var m = jget(IKEY, {}); m[ARG] = out; jset(IKEY, m);
      document.getElementById('ad-it-msg').textContent = out.length ? '✓ Saved — you\'ll see these when this argument comes back for review.' : 'Fill in both halves of at least one plan.';
    });
  }

  /* ---------- 6. confident-wrong first (hot) ---------- */
  function initHot() {
    var sn = document.getElementById('scoreNum'); if (!sn) return;
    new MutationObserver(function () {
      try {
        var cal = jget('ad_calibration', {})[ARG]; if (!cal || cal.p == null || cal.a == null) return;
        if (cal.p - cal.a < 2) return;
        var m = jget('ad_reviews', {}); if (!m[ARG]) return;
        m[ARG].hot = 1; m[ARG].due = todayISO(); jset('ad_reviews', m);
      } catch (e) {}
    }).observe(sn, { childList: true, subtree: true, characterData: true });
  }

  /* ---------- 7. hide the page while writing ---------- */
  function initHide() {
    var box = document.getElementById('explainBox'), und = document.getElementById('understand');
    if (!box || !und || document.getElementById('ad-hide')) return;
    var lab = document.createElement('label');
    lab.id = 'ad-hide';
    lab.style.cssText = UI + 'display:flex;align-items:center;gap:.45rem;font-size:.8rem;color:var(--tm,#5a6b82);margin:0 0 .5rem;cursor:pointer;';
    lab.innerHTML = '<input type="checkbox" id="ad-hide-cb"> Hide the page above while I write (so this is recall, not copying)';
    box.parentNode.insertBefore(lab, box);
    document.getElementById('ad-hide-cb').addEventListener('change', function () {
      var on = this.checked; und.style.filter = on ? 'blur(9px)' : ''; und.style.pointerEvents = on ? 'none' : ''; und.style.userSelect = on ? 'none' : '';
    });
  }

  /* ---------- 8. listen ---------- */
  function speakable() { return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'; }
  var speaking = null;
  function speak(text, btn) {
    try {
      if (speaking) { window.speechSynthesis.cancel(); if (speaking.btn) speaking.btn.textContent = speaking.lbl; var same = speaking.btn === btn; speaking = null; if (same) return; }
      var u = new SpeechSynthesisUtterance(text); u.rate = 1; u.lang = 'en-GB';
      speaking = { btn: btn, lbl: btn.textContent }; btn.textContent = '■ Stop';
      u.onend = u.onerror = function () { if (speaking && speaking.btn === btn) { btn.textContent = speaking.lbl; speaking = null; } };
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function listenBtn(text, small) {
    var b = document.createElement('button'); b.type = 'button';
    b.style.cssText = GHOST + (small ? 'font-size:.74rem;padding:4px 10px;' : '');
    b.textContent = '▶ Listen'; b.setAttribute('aria-label', 'Read this aloud');
    b.addEventListener('click', function () { speak(text, b); });
    return b;
  }
  function initListen() {
    if (!speakable()) return;
    var s = document.querySelector('.seo-summary');
    if (s && !s.querySelector('.ad-listen')) {
      var t = [].map.call(s.querySelectorAll('p'), function (p) { return p.textContent; }).join(' ');
      var b = listenBtn(t, true); b.classList.add('ad-listen'); b.style.marginLeft = '.6rem'; b.style.verticalAlign = 'middle';
      var h = s.querySelector('h2'); if (h) h.appendChild(b);
    }
    var mt = document.getElementById('odModelText');
    if (mt && !document.getElementById('ad-listen-od')) {
      var b2 = listenBtn('', true); b2.id = 'ad-listen-od'; b2.style.marginTop = '.4rem';
      b2.addEventListener('click', function () { }, true);
      b2.onclick = function () { speak(mt.textContent, b2); };
      mt.parentNode.insertBefore(b2, mt.nextSibling);
    }
  }

  /* ---------- 9. typed cloze + fade ---------- */
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function initTypedCloze() {
    var wrap = document.getElementById('ad-completion'); if (!wrap) return;
    var lv = levelNow(ARG);
    if (lv >= 2 && !wrap.getAttribute('data-faded')) {
      wrap.setAttribute('data-faded', '1');
      var kids = [].slice.call(wrap.children).filter(function (k) { return !/kick|^H4$/i.test(k.className + k.tagName) || k.tagName === 'H4'; });
      var note = document.createElement('p');
      note.style.cssText = UI + 'font-size:.85rem;color:var(--tm,#5a6b82);margin:0;';
      note.innerHTML = 'You&rsquo;re past Silver, so the training wheels come off: do the cold drills below. <button type="button" id="ad-cloze-show" style="background:none;border:none;padding:0;color:var(--gd,#a88930);font-weight:600;cursor:pointer;font:inherit;text-decoration:underline;">Show the fill-in-the-blanks anyway</button>';
      var hidden = [];
      [].slice.call(wrap.children).forEach(function (k) { if (k.tagName !== 'SPAN' && k.tagName !== 'H4') { k.style.display = 'none'; hidden.push(k); } });
      wrap.appendChild(note);
      document.getElementById('ad-cloze-show').addEventListener('click', function () { hidden.forEach(function (k) { k.style.display = ''; }); note.remove(); });
    }
    [].forEach.call(wrap.querySelectorAll('.ad-cloze'), function (b) {
      if (b.getAttribute('data-typed')) return;
      b.setAttribute('data-typed', '1');
      b.addEventListener('click', function (e) {
        if (b.dataset.done) return;
        e.stopImmediatePropagation();
        var inp = document.createElement('input');
        inp.type = 'text'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', 'Type the missing word');
        inp.style.cssText = 'font:inherit;width:' + Math.max(5, (b.getAttribute('data-w') || '').length * 0.7 + 1) + 'em;border:0;border-bottom:2px solid var(--gd,#a88930);background:rgba(200,169,81,.12);padding:0 3px;border-radius:3px;outline:none;';
        b.parentNode.insertBefore(inp, b); b.style.display = 'none'; inp.focus();
        function finish() {
          var want = b.getAttribute('data-w') || '', got = inp.value.trim();
          if (!got) { inp.remove(); b.style.display = ''; return; }
          var ok = norm(got) === norm(want) || (norm(want).length > 6 && norm(got).length >= norm(want).length - 2 && norm(want).indexOf(norm(got)) === 0);
          inp.remove(); b.style.display = ''; b.dataset.done = '1';
          b.innerHTML = ok ? esc(want) + ' <small>✓</small>' : esc(want) + ' <small style="font-weight:400;color:#a32d2d">(you typed “' + esc(got) + '”)</small>';
          b.style.cssText = 'background:none;border:none;padding:0;font-weight:600;font-family:inherit;font-size:inherit;cursor:default;color:' + (ok ? '#2f7d4f' : 'var(--gd,#a88930)') + ';';
        }
        inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); finish(); } });
        inp.addEventListener('blur', finish);
      }, true);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // run after the first IIFE's DOMContentLoaded (registered earlier), so the
    // completion drill and the old banner already exist when we look for them.
    setTimeout(function () {
      try { initReproof(); } catch (e) { if (window.console) console.warn('reproof', e); }
      try { initCards(); } catch (e) { if (window.console) console.warn('cards', e); }
      try { initPretest(); } catch (e) { if (window.console) console.warn('pretest', e); }
      try { initDiscrimination(); } catch (e) { if (window.console) console.warn('disc', e); }
      try { initIfThen(); } catch (e) { if (window.console) console.warn('ifthen', e); }
      try { initHot(); } catch (e) {}
      try { initHide(); } catch (e) {}
      try { initListen(); } catch (e) {}
      try { initTypedCloze(); } catch (e) { if (window.console) console.warn('cloze', e); }
    }, 0);
  });
})();
