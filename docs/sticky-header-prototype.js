/* PROTOTYPE — Option C, the sticky card header. NOT WIRED INTO ANY PAGE.
   Lives in docs/, which .vercelignore excludes from the Vercel upload, so it is
   never served. Injected at runtime for screenshots only.

   THE PROBLEM IT ANSWERS. An open card runs a measured 7.4 screens on desktop
   and 25.8 on a phone (tallest: 39). The only close control is the card's own
   header, at the very top. So "scroll back up to close" means 26 screens.

   WHAT IT DOES. While a card is open AND its real header has scrolled out of
   view, a slim bar carrying that argument's title and a close button pins itself
   under the site nav and the tab row. Tap the ✕ and the card closes and the page
   scrolls back to where that card sits, so the reader lands in the list rather
   than somewhere arbitrary. */
(function () {
  if (window.__stickyHeadProto) return; window.__stickyHeadProto = true;

  var NAV = 64; // fixed site nav
  var tabs = document.querySelector('.cn');
  var TABS = tabs ? Math.round(tabs.getBoundingClientRect().height) : 49;
  var TOP = NAV + TABS;

  var css = document.createElement('style');
  css.textContent = [
    '.adsh{position:fixed;left:0;right:0;top:' + TOP + 'px;z-index:80;',
      'display:none;align-items:center;gap:.9rem;padding:.6rem 2rem;',
      'background:rgba(10,22,40,.97);border-bottom:1px solid rgba(200,169,81,.35);',
      'box-shadow:0 6px 18px rgba(5,13,26,.28);}',
    '.adsh.on{display:flex;}',
    '.adsh-num{font-family:Playfair Display,Georgia,serif;font-weight:700;font-size:.95rem;color:#c8a951;flex:0 0 auto;}',
    '.adsh-t{font-family:Playfair Display,Georgia,serif;font-weight:700;font-size:.92rem;color:#fff;',
      'flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.adsh-x{flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;cursor:pointer;',
      'font-family:DM Sans,sans-serif;font-size:.76rem;font-weight:500;color:#0a1628;background:#c8a951;',
      'border:0;border-radius:3px;padding:7px 14px;}',
    '@media(max-width:768px){.adsh{padding:.55rem 1rem;gap:.6rem;}.adsh-t{font-size:.82rem;}',
      '.adsh-x{padding:6px 11px;font-size:.72rem;}}'
  ].join('');
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.className = 'adsh';
  bar.innerHTML = '<span class="adsh-num"></span><span class="adsh-t"></span>' +
                  '<button class="adsh-x" type="button">&#10005; Close</button>';
  document.body.appendChild(bar);
  var numEl = bar.querySelector('.adsh-num'),
      txtEl = bar.querySelector('.adsh-t'),
      xBtn  = bar.querySelector('.adsh-x');

  var current = null;

  xBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!current) return;
    var y = window.scrollY + current.getBoundingClientRect().top - TOP - 12;
    current.classList.remove('op');
    bar.classList.remove('on'); current = null;
    window.scrollTo({ top: Math.max(y, 0), behavior: 'auto' });
  });

  function sync() {
    var card = document.querySelector('.sec.go .card.op');
    if (!card) { bar.classList.remove('on'); current = null; return; }
    var head = card.querySelector('.ch');
    var out = head.getBoundingClientRect().bottom < TOP;      // real header gone
    var stillOn = card.getBoundingClientRect().bottom > TOP;  // card still on screen
    if (out && stillOn) {
      if (card !== current) {
        current = card;
        var n = card.querySelector('.cnum'), t = card.querySelector('.ct');
        numEl.textContent = n ? n.textContent.trim() : '';
        txtEl.textContent = t ? t.textContent.trim() : '';
      }
      bar.classList.add('on');
    } else {
      bar.classList.remove('on');
    }
  }
  addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  document.addEventListener('click', function () { setTimeout(sync, 60); }, true);
  sync();
})();
