/* Orthodoxy clarifier ("orthonote") — a gold ＊ next to a doctrinally delicate
   phrase. Hover (desktop), tap (mobile), or keyboard-focus opens a small box
   that says what the phrase IS saying and what it is NOT saying, so a compressed
   line can't be misread as heterodox.

   Markup pattern (place inline around the phrase; the box text is DOCTRINAL
   content and must pass the apologia-orthodoxy gate like any content):

     <span class="on">
       <span class="on-phrase">the delicate phrase</span
       ><button class="on-mark" type="button" aria-label="Doctrinal clarification" aria-expanded="false">＊</button>
       <span class="on-box" role="tooltip">
         <h4>Short heading</h4>
         <span class="on-row on-yes"><b>Is saying</b><span>…</span></span>
         <span class="on-row on-no"><b>Not saying</b><span>…</span></span>
       </span>
     </span>

   Hover/focus is pure CSS; this script only adds tap-toggle + outside-tap close
   and injects the stylesheet once, so an essay needs just one include:
     <script src="/library/orthonote.js" defer></script>
   Styled for the light "manuscript" essay theme (gold #a88930 / #c8a951). */
(function () {
  if (window.__orthonote) return; window.__orthonote = true;

  var css = [
    '.on{position:relative;display:inline}',
    '.on-phrase{border-bottom:1px dotted #a88930;cursor:help}',
    ".on-mark{font-family:'DM Sans',sans-serif;font-weight:700;font-size:.62em;line-height:0;",
    'vertical-align:super;color:#a88930;background:none;border:0;padding:0 .12em;cursor:pointer}',
    '.on-mark:focus-visible{outline:2px solid #a88930;outline-offset:2px;border-radius:3px}',
    '.on-box{position:absolute;left:50%;top:calc(100% + 12px);',
    'transform:translateX(-50%) translateY(6px);width:min(340px,calc(100vw - 24px));z-index:40;',
    'background:#fff;border:1px solid rgba(200,169,81,.55);border-radius:12px;',
    'box-shadow:0 16px 44px rgba(10,22,40,.22);padding:.9rem 1rem 1rem;text-align:left;',
    "font-family:'DM Sans',sans-serif;line-height:1.5;",
    'opacity:0;visibility:hidden;pointer-events:none;transition:opacity .15s ease,transform .15s ease}',
    '.on-box::before{content:"";position:absolute;left:50%;top:-7px;width:12px;height:12px;',
    'background:#fff;border-left:1px solid rgba(200,169,81,.55);border-top:1px solid rgba(200,169,81,.55);',
    'transform:translateX(-50%) rotate(45deg)}',
    '.on:hover .on-box,.on:focus-within .on-box,.on-box.is-open{',
    'opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}',
    // heading is an inline <span> (NOT <h4>): a block element here would auto-close the
    // surrounding <p> during HTML parsing and eject the box's content. display:block via CSS.
    '.on-box .on-h{display:block;margin:0 0 .5rem;font-family:\'DM Sans\',sans-serif;font-size:.7rem;letter-spacing:.13em;',
    'text-transform:uppercase;color:#a88930;font-weight:700}',
    '.on-row{display:flex;gap:.5rem;font-size:.88rem;margin:.38rem 0;color:#26364e}',
    '.on-row b{flex:0 0 auto;font-size:.68rem;font-weight:700;letter-spacing:.02em;padding:.1rem .42rem;',
    'border-radius:6px;height:fit-content;margin-top:.12rem;text-transform:uppercase}',
    '.on-yes b{background:rgba(70,150,95,.13);color:#2f7a48;border:1px solid rgba(70,150,95,.32)}',
    '.on-no b{background:rgba(190,90,90,.12);color:#b0453f;border:1px solid rgba(190,90,90,.32)}',
    '@media (prefers-reduced-motion:reduce){.on-box{transition:none}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'orthonote-css'; style.textContent = css;
  document.head.appendChild(style);

  function closeAll(except) {
    document.querySelectorAll('.on-box.is-open').forEach(function (b) {
      if (b === except) return;
      b.classList.remove('is-open');
      var m = b.parentElement.querySelector('.on-mark');
      if (m) m.setAttribute('aria-expanded', 'false');
    });
  }

  // keep the box within the viewport horizontally (it's centered on the phrase, which
  // can sit near a screen edge on mobile). Runs on every show (hover/focus/tap).
  function place(box) {
    box.style.transform = 'translateX(-50%) translateY(0)';
    var r = box.getBoundingClientRect(), pad = 12, shift = 0;
    if (r.right > window.innerWidth - pad) shift = (window.innerWidth - pad) - r.right;
    if (r.left + shift < pad) shift = pad - r.left;
    if (shift) box.style.transform = 'translateX(calc(-50% + ' + Math.round(shift) + 'px)) translateY(0)';
  }

  document.querySelectorAll('.on').forEach(function (on) {
    var box = on.querySelector('.on-box');
    var mark = on.querySelector('.on-mark');
    if (!box) return;
    on.addEventListener('mouseenter', function () { place(box); });
    on.addEventListener('focusin', function () { place(box); });
    if (mark) mark.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = box.classList.toggle('is-open');
      mark.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(box);
      if (open) place(box);
    });
  });

  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
})();
