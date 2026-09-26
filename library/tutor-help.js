/* tutor-help.js — a subtle, permanent "how to read this with the AI tutor" cue.

   It tells the reader what the on-page AI helpers are for, features they would
   otherwise miss: (1) the "Ask AI Tutor" tab (clarify a hard point, test the case
   with an objection, go deeper), (2) the "Teach me this" guided Socratic tutor
   (build the argument yourself, one question at a time — socratic.js), and (3)
   highlight-any-sentence to ask about that exact passage (ask-selection.js).

   Two surfaces, one box:
   - Deep-dive essays: one box at the top of the essay body (.art-body).
   - Evidence Library hub: one box at the top of EACH argument card's body (.cb),
     so it appears when a reader opens a card. Exposed as window.ADTutorHelp.apply()
     and called by the hub's enhanceSection() on every tab load, with a
     MutationObserver safety net for the initial load-order race.

   It only describes features already on the page (the float-tutor + socratic +
   ask-selection) and adds no new endpoint and no doctrinal content — pure
   descriptive UI plumbing, no gate. Copy adapts to touch devices.

   Usage: one include per essay AND on evidence-library.html —
     <script src="/library/tutor-help.js" defer></script>
   Requires the page's float-tutor (window.toggleFloatTutor + #float-input). */
(function () {
  if (window.__tutorHelp) return; window.__tutorHelp = true;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function hasTutor() {
    return typeof window.toggleFloatTutor === 'function' || document.getElementById('float-input');
  }

  var cssDone = false;
  function injectCss() {
    if (cssDone) return; cssDone = true;
    var css = [
      '.reader-help{display:flex;gap:.7rem;align-items:flex-start;margin:0 0 1.9rem;padding:.85rem 1.05rem;',
      'background:rgba(30,66,120,.05);border:1px solid rgba(30,66,120,.14);border-left:3px solid #1e4278;',
      "border-radius:10px;font-family:'DM Sans',system-ui,sans-serif}",
      '.card .reader-help{margin:.25rem 0 1.25rem}',
      '.reader-help .rh-ic{flex:0 0 auto;color:#1e4278;font-size:1.15rem;line-height:1.35}',
      '.reader-help .rh-body{min-width:0}',
      '.reader-help .rh-b{margin:0 0 .25rem;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;',
      'font-weight:700;color:#1e4278}',
      '.reader-help .rh-t{margin:0;font-size:.9rem;line-height:1.5;color:#2a3a52}',
      '.reader-help .rh-t + .rh-t{margin-top:.5rem}',
      '.reader-help .rh-t b{color:#0a1628;font-weight:700}',
      '.reader-help .rh-ex{margin:.55rem 0 0;font-size:.84rem;line-height:1.5;color:#5a6b82;font-style:italic}',
      '.reader-help .rh-note{margin:.5rem 0 0;font-size:.8rem;line-height:1.45;color:#7a8aa0}',
      '.reader-help .rh-open{font:inherit;font-size:inherit;color:#1e4278;font-weight:700;background:none;',
      'border:0;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:2px}',
      '.reader-help .rh-open:hover{color:#16345f}',
      '.reader-help .rh-open:focus-visible{outline:2px solid #c8a951;outline-offset:2px;border-radius:2px}'
    ].join('');
    var st = document.createElement('style'); st.id = 'reader-help-css'; st.textContent = css;
    document.head.appendChild(st);
  }

  // scopeNoun: "essay" or "argument"
  function buildBox(scopeNoun) {
    var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var verb = touch ? 'Tap and hold' : 'Highlight';
    var tap = touch ? 'Tap' : 'Click';

    var box = document.createElement('aside');
    box.className = 'reader-help';
    box.setAttribute('aria-label', 'How to use the AI tutor on this page');
    box.innerHTML =
      '<span class="rh-ic" aria-hidden="true">&#129504;</span>' +
      '<div class="rh-body">' +
        '<p class="rh-b">Read it with the AI tutor</p>' +
        '<p class="rh-t">This ' + scopeNoun + ' has a built-in AI tutor&mdash;the gold <b>&#129504;&nbsp;Ask&nbsp;AI&nbsp;Tutor</b> tab on the right-hand edge of the screen. ' +
        tap + ' it (or <button type="button" class="rh-open">open it now</button>) to ask anything about this topic: ' +
        'have a tricky point explained, test the case with an objection, or go deeper than the ' + scopeNoun + ' goes.</p>' +
        '<p class="rh-t">Prefer to work it out for yourself? The <b>&#127891;&nbsp;Teach&nbsp;me&nbsp;this</b> tab, just above it, walks you through the argument one question at a time&mdash;until you can make the case in your own words.</p>' +
        '<p class="rh-t">You can also <b>' + verb.toLowerCase() + ' any sentence</b> to ask about that exact passage.</p>' +
        '<p class="rh-ex">Try asking: &ldquo;Explain this like I&rsquo;m new to it,&rdquo; &ldquo;What&rsquo;s the strongest objection here?&rdquo; or &ldquo;How would a skeptic respond?&rdquo;</p>' +
        '<p class="rh-note">For anything pastoral, it points you to a real person, not an argument.</p>' +
      '</div>';
    return box;
  }

  function wireOpener(box) {
    var opener = box.querySelector('.rh-open');
    if (!opener) return;
    opener.addEventListener('click', function () {
      try {
        var panel = document.getElementById('float-panel');
        var isOpen = panel && panel.style.display && panel.style.display !== 'none';
        if (!isOpen && typeof window.toggleFloatTutor === 'function') window.toggleFloatTutor();
        var input = document.getElementById('float-input');
        if (input) setTimeout(function () { try { input.focus(); } catch (e) {} }, 120);
        if (window.adTrack) window.adTrack('essay_tutor_help_open', {});
      } catch (e) {}
    });
  }

  // ── Deep-dive essays: one box at the top of the essay body ──
  ready(function () {
    var body = document.querySelector('.art-body');
    if (!body || !hasTutor()) return;
    if (body.querySelector(':scope > .reader-help')) return;
    injectCss();
    var box = buildBox('essay');
    body.insertBefore(box, body.firstChild);
    wireOpener(box);
  });

  // ── Evidence Library hub: one box at the top of each argument card's body ──
  window.ADTutorHelp = {
    apply: function (container) {
      try {
        if (!hasTutor()) return;
        var scope = (container && container.querySelectorAll) ? container : document;
        var cards = scope.querySelectorAll('.card');
        if (!cards.length) return;
        injectCss();
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          if (card.__tutorHelp) continue;
          var cb = card.querySelector('.cb');
          if (!cb) continue;
          card.__tutorHelp = true;
          if (cb.querySelector(':scope > .reader-help')) continue;
          var box = buildBox('argument');
          // Deterministic placement (independent of the card-video enhancer's
          // timing): just above the "Free" tier label, i.e. below any promo
          // video and above the plain-English summary and "The argument" list.
          var anchor = cb.querySelector(':scope > .fl') || cb.querySelector(':scope > .ap') || cb.firstChild;
          cb.insertBefore(box, anchor);
          wireOpener(box);
        }
      } catch (e) {}
    }
  };

  // Safety net for the hub (mirrors socratic.js): catch cards injected before the
  // deferred enhanceSection hook can reach this global, and on any re-render.
  // No-op on essays (no .card ever). Idempotent via the card.__tutorHelp guard.
  ready(function () {
    if (!document.querySelector('.card') && !document.getElementById('float-tutor')) return;
    if (!('MutationObserver' in window)) { window.ADTutorHelp.apply(document); return; }
    var queued = false;
    function flush() { queued = false; window.ADTutorHelp.apply(document); }
    var mo = new MutationObserver(function () {
      if (queued) return; queued = true;
      (window.requestAnimationFrame || setTimeout)(flush);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.ADTutorHelp.apply(document);
  });
})();
