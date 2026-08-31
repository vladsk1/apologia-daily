/* PROTOTYPE — the end-of-card exit. NOT WIRED INTO ANY PAGE.
   Lives in docs/, excluded from the Vercel upload, injected at runtime for
   screenshots only.

   THE PROBLEM, MEASURED. Scrolled 6,000px into an open card on a phone there is
   NOTHING on screen telling a reader how to get out: no header, no chevron, and
   no control anywhere whose label says close / collapse / back / hide. The card
   can be closed by clicking any of its text, but nothing says so.
   And leaving by scrolling is expensive: from the top of the open Kalam card to
   the top of the next argument is 31,400px — 37.2 screens on a 390x844 phone.

   WHY AN END-CAP RATHER THAN A STICKY BAR. The sticky bar (see
   sticky-header-prototype.js) puts an exit on screen permanently, at the cost of
   a third fixed bar eating about a fifth of a phone screen. This puts the exit
   where the reader's need actually arises — at the end, when they have finished
   reading and are asking "right, what next?" — for no permanent screen space.

   It offers BOTH exits, because at the end of an argument there are only two
   sensible next moves:
     Close      — collapse and land back on this card in the list.
     Next       — collapse this, open the following argument, land on its top.
   The Next button is the bigger win: it turns a 37-screen scroll into a tap. */
(function () {
  if (window.__endcapProto) return; window.__endcapProto = true;

  var css = document.createElement('style');
  css.textContent = [
    '.adec{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap;',
      'margin:1.5rem 0 .25rem;padding:1rem 1.1rem;border-radius:6px;',
      'background:var(--n4,#f0f6fb);border:1px solid var(--b,#d4e0ec);}',
    '.adec-done{flex:1 1 100%;font-family:var(--ui,sans-serif);font-size:.66rem;font-weight:600;',
      'letter-spacing:.12em;text-transform:uppercase;color:var(--mu,#7a8fa8);margin-bottom:.1rem;}',
    '.adec-btn{font-family:var(--ui,sans-serif);font-size:.82rem;font-weight:500;cursor:pointer;',
      'border-radius:3px;padding:9px 16px;border:1px solid var(--b,#d4e0ec);background:#fff;color:var(--n3,#1e4278);}',
    '.adec-btn:hover{border-color:var(--n3,#1e4278);}',
    '.adec-next{background:var(--g,#c8a951);border-color:var(--g,#c8a951);color:var(--n,#0a1628);font-weight:600;',
      'margin-left:auto;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '@media(max-width:640px){.adec{gap:.5rem}.adec-btn{flex:1 1 100%;text-align:center;margin-left:0;}}'
  ].join('');
  document.head.appendChild(css);

  function chromeTop() {
    var t = document.querySelector('.cn');
    return 64 + (t ? t.getBoundingClientRect().height : 0);
  }
  function landOn(card) {
    var y = window.scrollY + card.getBoundingClientRect().top - chromeTop() - 12;
    window.scrollTo(0, Math.max(0, y));
  }

  function build(card) {
    if (card.querySelector('.adec')) return;
    var body = card.querySelector('.cb'); if (!body) return;
    /* Scope the lookup to the whole SECTION, not the card's parent: card 01 is
       nested inside the tab's .intro block while the rest are siblings after it,
       so a parentElement query finds no successor for the first card. */
    var sec = card.closest('.sec') || document;
    var cards = [].slice.call(sec.querySelectorAll('.card'));
    var next = cards[cards.indexOf(card) + 1];
    var nextTitle = next && next.querySelector('.ct') ? next.querySelector('.ct').textContent.trim() : null;

    var bar = document.createElement('div');
    bar.className = 'adec';
    bar.innerHTML =
      '<div class="adec-done">End of this argument</div>' +
      '<button type="button" class="adec-btn adec-close">&#10005; Close this argument</button>' +
      (nextTitle ? '<button type="button" class="adec-btn adec-next">Next: ' + nextTitle + ' &rarr;</button>' : '');

    bar.addEventListener('click', function (e) { e.stopPropagation(); });
    bar.querySelector('.adec-close').addEventListener('click', function () {
      card.classList.remove('op'); landOn(card);
    });
    var nb = bar.querySelector('.adec-next');
    if (nb) nb.addEventListener('click', function () {
      card.classList.remove('op'); next.classList.add('op'); landOn(next);
    });
    body.appendChild(bar);
  }

  document.querySelectorAll('.sec.go .card').forEach(build);
})();
