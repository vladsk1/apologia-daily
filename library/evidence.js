/* Evidence layer ("See the evidence") — turns a load-bearing claim in an essay
   into something the reader can tap open to see the case behind it, inline:
   the Source and Who holds it. (The component styles any ev-row it finds, so an
   essay MAY also add ev-obj "Strongest objection" / ev-ans "Honest answer" rows;
   the standard default is the two factual rows — Source + Who holds it.)

   It re-presents material that is ALREADY on the certified page (the footnotes
   and the cited scholars) as an explorable panel. The box text must trace to the
   certified essay: any wording NOT ported verbatim must pass the apologia-argument
   + apologia-orthodoxy gates like any content (dual-consensus for deity /
   resurrection / world-religions).

   Markup pattern (place inline around the claim; all inner elements are inline
   <span>s so they never auto-close the surrounding <p> — display:block via CSS):

     <span class="ev">
       <span class="ev-claim">the claim as it reads in the sentence</span
       ><button class="ev-mark" type="button" aria-expanded="false"
                aria-label="See the evidence for this claim">See&nbsp;the&nbsp;evidence</button>
       <span class="ev-box" role="dialog" aria-label="Evidence">
         <span class="ev-h">The evidence</span>
         <span class="ev-row ev-src"><b>Source</b><span>&hellip;</span></span>
         <span class="ev-row ev-who"><b>Who holds it</b><span>&hellip;</span></span>
       </span>
     </span>

   Hover/focus opens it (CSS); this script adds tap-toggle + outside-tap/Esc
   close and injects the stylesheet once. One include per essay:
     <script src="/library/evidence.js" defer></script>
   Styled for the light "manuscript" essay theme (navy #1e4278 / gold #c8a951). */
(function () {
  if (window.__evidence) return; window.__evidence = true;

  var css = [
    '.ev{position:relative;display:inline}',
    '.ev-claim{border-bottom:2px dotted #1e4278;background:rgba(30,66,120,.07);',
    'border-radius:3px;padding:0 .1em;cursor:pointer}',
    // the trigger: a small navy pill that clearly reads as tappable
    ".ev-mark{display:inline-flex;align-items:center;gap:.3em;margin:0 .1em 0 .32em;",
    "font-family:'DM Sans',sans-serif;font-weight:600;font-size:.62em;letter-spacing:.02em;",
    'vertical-align:.12em;line-height:1;color:#fff;background:#1e4278;border:0;',
    'border-radius:999px;padding:.34em .7em .34em .58em;cursor:pointer;text-transform:uppercase;',
    'transition:background .12s ease;white-space:nowrap}',
    '.ev-mark::before{content:"";width:.85em;height:.85em;flex:0 0 auto;',
    // magnifier glyph as an inline-mask so it needs no external asset
    'background:#fff;-webkit-mask:var(--ev-glass) center/contain no-repeat;mask:var(--ev-glass) center/contain no-repeat}',
    '.ev-mark:hover{background:#16345f}',
    '.ev-mark:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
    '.ev-box{position:absolute;left:50%;top:calc(100% + 12px);',
    'transform:translateX(-50%) translateY(6px);width:min(400px,calc(100vw - 24px));z-index:45;',
    'background:#fff;border:1px solid rgba(30,66,120,.28);border-radius:14px;',
    'box-shadow:0 18px 50px rgba(10,22,40,.26);padding:1rem 1.1rem 1.05rem;text-align:left;',
    "font-family:'DM Sans',sans-serif;line-height:1.5;",
    'opacity:0;visibility:hidden;pointer-events:none;transition:opacity .15s ease,transform .15s ease}',
    '.ev-box::before{content:"";position:absolute;left:50%;top:-7px;width:12px;height:12px;',
    'background:#fff;border-left:1px solid rgba(30,66,120,.28);border-top:1px solid rgba(30,66,120,.28);',
    'transform:translateX(-50%) rotate(45deg)}',
    '.ev:hover .ev-box,.ev:focus-within .ev-box,.ev-box.is-open{',
    'opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}',
    '.ev-box .ev-h{display:block;margin:0 0 .6rem;font-family:\'DM Sans\',sans-serif;font-size:.68rem;',
    'letter-spacing:.14em;text-transform:uppercase;color:#1e4278;font-weight:700}',
    '.ev-row{display:block;font-size:.9rem;margin:.6rem 0;color:#26364e}',
    '.ev-row b{display:block;font-size:.72rem;font-weight:800;letter-spacing:.08em;',
    'text-transform:uppercase;margin-bottom:.22rem}',
    '.ev-src b{color:#1e4278}',
    '.ev-who b{color:#2f7a48}',
    '.ev-obj b{color:#b0692f}',
    '.ev-ans b{color:#7a2f6e}',
    '.ev-row span{display:block}',
    '@media (max-width:640px){.ev-box{width:min(340px,calc(100vw - 20px))}}',
    '@media (prefers-reduced-motion:reduce){.ev-box{transition:none}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'evidence-css';
  // the magnifier mask, as a CSS variable so every .ev-mark reuses it
  style.textContent = ':root{--ev-glass:url("data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>') +
    '")}' + css;
  document.head.appendChild(style);

  function closeAll(except) {
    document.querySelectorAll('.ev-box.is-open').forEach(function (b) {
      if (b === except) return;
      b.classList.remove('is-open');
      var btn = b.parentNode && b.parentNode.querySelector('.ev-mark');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var mark = e.target.closest && e.target.closest('.ev-mark, .ev-claim');
    if (mark) {
      e.preventDefault();
      var wrap = mark.closest('.ev');
      var box = wrap && wrap.querySelector('.ev-box');
      var btn = wrap && wrap.querySelector('.ev-mark');
      if (!box) return;
      var willOpen = !box.classList.contains('is-open');
      closeAll(box);
      box.classList.toggle('is-open', willOpen);
      if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      return;
    }
    if (!(e.target.closest && e.target.closest('.ev-box'))) closeAll(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
