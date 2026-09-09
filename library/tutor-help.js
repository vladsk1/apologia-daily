/* tutor-help.js — a subtle, permanent "how to read this with the AI tutor"
   cue at the top of a deep-dive essay. It tells the reader two things they
   would otherwise miss: (1) they can highlight any sentence to ask about that
   exact passage (the ask-selection.js feature), and (2) what the on-page AI
   tutor is actually for — clarifying a hard point, testing the case with an
   objection, or going deeper than the essay.

   It only describes features already on the page (the inline float-tutor +
   ask-selection) and adds no new endpoint and no doctrinal content — pure
   descriptive UI plumbing, no gate. Copy adapts to touch devices.

   Usage: one include per essay — <script src="/library/tutor-help.js" defer></script>
   Requires the essay's inline float-tutor (present on all deep-dive essays). */
(function () {
  if (window.__tutorHelp) return; window.__tutorHelp = true;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var body = document.querySelector('.art-body');
    var hasTutor = typeof window.toggleFloatTutor === 'function' || document.getElementById('float-input');
    if (!body || !hasTutor) return;
    if (document.querySelector('.reader-help')) return;

    injectCss();

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
        '<p class="rh-t">This essay has a built-in AI tutor&mdash;the gold <b>&#129504;&nbsp;Ask&nbsp;AI&nbsp;Tutor</b> tab on the right-hand edge of the screen. ' +
        tap + ' it (or <button type="button" class="rh-open">open it now</button>) to ask anything about this topic: ' +
        'have a tricky point explained, test the case with an objection, or go deeper than the essay goes.</p>' +
        '<p class="rh-t">You can also <b>' + verb.toLowerCase() + ' any sentence</b> in the essay to ask about that exact passage.</p>' +
        '<p class="rh-ex">Try asking: &ldquo;Explain this like I&rsquo;m new to it,&rdquo; &ldquo;What&rsquo;s the strongest objection here?&rdquo; or &ldquo;How would a skeptic respond?&rdquo;</p>' +
        '<p class="rh-note">For anything pastoral, it points you to a real person, not an argument.</p>' +
      '</div>';

    body.insertBefore(box, body.firstChild);

    var opener = box.querySelector('.rh-open');
    if (opener) opener.addEventListener('click', function () {
      try {
        var panel = document.getElementById('float-panel');
        var isOpen = panel && panel.style.display && panel.style.display !== 'none';
        if (!isOpen && typeof window.toggleFloatTutor === 'function') window.toggleFloatTutor();
        var input = document.getElementById('float-input');
        if (input) setTimeout(function () { try { input.focus(); } catch (e) {} }, 120);
        if (window.adTrack) window.adTrack('essay_tutor_help_open', {});
      } catch (e) {}
    });
  });

  function injectCss() {
    var css = [
      '.reader-help{display:flex;gap:.7rem;align-items:flex-start;margin:0 0 1.9rem;padding:.85rem 1.05rem;',
      'background:rgba(30,66,120,.05);border:1px solid rgba(30,66,120,.14);border-left:3px solid #1e4278;',
      "border-radius:10px;font-family:'DM Sans',system-ui,sans-serif}",
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
})();
