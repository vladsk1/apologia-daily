/* a11y-cards.js — keyboard + screen-reader support for the Evidence Library
   argument cards (evidence-library.html loads its ev-s*.html tab fragments in
   via JS). The cards are <div class="card" onclick="tog(this)">…</div>: a mouse
   user can open them, but a keyboard user could never reach or trigger them, and
   a screen reader announced them as plain text.

   This adds, at RUNTIME (touching no gated markup), a proper disclosure control:
   the card's header row (.ch) becomes a focusable role="button" with
   aria-expanded, operable with Enter/Space, with a visible focus ring. The
   existing mouse onclick is untouched. Because fragments arrive after load, we
   enhance both what is present now and anything added later (MutationObserver).

   Tab buttons on the hub are already real <button>s (keyboard-fine); we only add
   role="tab" + aria-selected so their state is announced.

   Interaction plumbing only; no doctrinal content, no gate.
   Include once, after the page defines tog():  <script src="/library/a11y-cards.js" defer></script> */
(function () {
  if (window.__a11yCards) return; window.__a11yCards = true;

  var css = document.createElement('style');
  css.textContent =
    '.ch{outline:none}' +
    '.card > .ch:focus-visible{outline:2px solid #c8a951;outline-offset:-2px;border-radius:10px}';
  document.head.appendChild(css);

  function syncExpanded(card, header) {
    header.setAttribute('aria-expanded', card.classList.contains('op') ? 'true' : 'false');
  }

  function enhanceCard(card) {
    if (card.__a11y) return; card.__a11y = true;
    var header = card.querySelector('.ch');
    if (!header) return;                       // not an argument card
    header.setAttribute('role', 'button');
    if (!header.hasAttribute('tabindex')) header.setAttribute('tabindex', '0');
    var title = card.querySelector('.ct');
    if (title && !header.getAttribute('aria-label')) {
      header.setAttribute('aria-label', title.textContent.trim());
    }
    syncExpanded(card, header);
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();                    // Space must not scroll the page
        card.click();                          // reuse the exact mouse path (tog)
      }
    });
    // Reflect open/closed state however it was toggled (mouse, keyboard, or the
    // hub's own "open one, close the rest" logic).
    new MutationObserver(function () { syncExpanded(card, header); })
      .observe(card, { attributes: true, attributeFilter: ['class'] });
  }

  function enhanceTab(tab) {
    if (tab.__a11y) return; tab.__a11y = true;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', tab.classList.contains('on') ? 'true' : 'false');
    new MutationObserver(function () {
      tab.setAttribute('aria-selected', tab.classList.contains('on') ? 'true' : 'false');
    }).observe(tab, { attributes: true, attributeFilter: ['class'] });
  }

  function scan(root) {
    (root.querySelectorAll ? root.querySelectorAll('.card') : []).forEach(function (c) {
      if (c.getAttribute && /tog\s*\(/.test(c.getAttribute('onclick') || '')) enhanceCard(c);
    });
    (root.querySelectorAll ? root.querySelectorAll('.tab') : []).forEach(enhanceTab);
  }

  function boot() {
    scan(document);
    // Fragments (ev-s*.html) are swapped in after load — enhance them on arrival.
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.matches && n.matches('.card')) enhanceCard(n);
          scan(n);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
