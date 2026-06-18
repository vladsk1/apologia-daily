/* =========================================================================
   APOLOGIA DAILY — Study-plan in-page article popup
   Drop-in add-on. Upload this file to GitHub, then add ONE line just before
   </body> in study-plans.html:   <script src="study-plan-popup.js"></script>
   No other changes needed.

   What it does: on a study plan, clicking "Open Read" on a reading day opens
   the real Evidence Library card in a popup ON the page (fetched live, so it
   never goes stale) instead of jumping to the Evidence Library.
   Pro plans show the full card; free plans show the free portion only.
   NOTE: uses fetch() — only works on the live Vercel site, not a local file.
   ========================================================================= */
(function () {
  /* 1. Which ev tab file each plan pulls from (extend later for more plans) */
  var EV_PLAN_TAB = {
    "resurrection": "ev-s2.html"
  };

  /* 2. For each wired plan: DAY NUMBER -> exact Evidence Library card title */
  var EV_DAY_CARD = {
    "resurrection": {
      1:  "The Minimal Facts Argument",
      3:  "The Empty Tomb",
      5:  "Paul's Conversion and the Early Creed",
      8:  "The Resurrection Appearances",
      9:  "The Conversion of the Sceptics",
      11: "The Origin of the Disciples' Belief",
      15: "The Argument from the Burial",
      17: "The Argument from Post-Resurrection Behaviour",
      23: "The Minimal Facts Argument",
      24: "The Empty Tomb"
    }
  };

  /* 3. Which plans are Pro (show full card) vs free (free portion only) */
  var EV_PLAN_PRO = { "resurrection": true };

  var _evCache = {};

  /* Build the popup shell once and add it to the page */
  function ensurePopup() {
    if (document.getElementById('ev-pop')) return;
    var pop = document.createElement('div');
    pop.id = 'ev-pop';
    pop.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(5,13,26,.85);z-index:400;overflow-y:auto;padding:2rem 1rem;';
    pop.innerHTML =
      '<div style="background:#f8f7f4;border-radius:8px;max-width:760px;width:100%;margin:auto;overflow:hidden;">' +
        '<div style="background:#050d1a;padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;">' +
          '<div>' +
            '<div style="font-family:\'DM Sans\',sans-serif;font-size:.62rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#c8a951;">Evidence Library</div>' +
            '<div id="ev-pop-title" style="font-family:\'Playfair Display\',serif;font-size:1.15rem;font-weight:700;color:#fff;margin-top:3px;">Loading…</div>' +
          '</div>' +
          '<button id="ev-pop-close" style="background:rgba(255,255,255,.1);border:none;border-radius:50%;width:32px;height:32px;color:#fff;font-size:1rem;cursor:pointer;flex-shrink:0;">✕</button>' +
        '</div>' +
        '<div id="ev-pop-body" style="padding:1.5rem;max-height:70vh;overflow-y:auto;font-family:\'Source Serif 4\',Georgia,serif;color:#0a1628;"></div>' +
        '<div style="padding:0 1.5rem 1.5rem;">' +
          '<a href="evidence-library.html" target="_blank" style="font-family:\'DM Sans\',sans-serif;font-size:.8rem;color:#7a8fa8;text-decoration:none;">Open the full Evidence Library →</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(pop);
    pop.addEventListener('click', function (e) { if (e.target === pop) closeEvPop(); });
    document.getElementById('ev-pop-close').addEventListener('click', closeEvPop);
  }

  function evNorm(s) {
    return (s || '').toLowerCase().replace(/[\u2018\u2019']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findEvCard(tabHtml, wantTitle) {
    var tmp = document.createElement('div');
    tmp.innerHTML = tabHtml;
    var cards = tmp.querySelectorAll('.card');
    var wn = evNorm(wantTitle);
    for (var i = 0; i < cards.length; i++) {
      var t = cards[i].querySelector('.ct');
      if (!t) continue;
      var tn = evNorm(t.textContent);
      if (tn === wn || tn.indexOf(wn) !== -1 || wn.indexOf(tn) !== -1) {
        cards[i].classList.add('op');
        return cards[i];
      }
    }
    return null;
  }

  function openEvCard(planId, dayNum) {
    var file = EV_PLAN_TAB[planId];
    var title = EV_DAY_CARD[planId] && EV_DAY_CARD[planId][dayNum];
    if (!file || !title) return false;
    var isPro = !!EV_PLAN_PRO[planId];

    ensurePopup();
    document.getElementById('ev-pop-title').textContent = title;
    var bodyEl = document.getElementById('ev-pop-body');
    bodyEl.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">Loading the argument…</p>';
    document.getElementById('ev-pop').style.display = 'block';
    document.body.style.overflow = 'hidden';

    function render(tabHtml) {
      var card = findEvCard(tabHtml, title);
      if (!card) {
        bodyEl.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">Could not load this argument. <a href="evidence-library.html" target="_blank" style="color:#1e4278;">Open it in the Evidence Library →</a></p>';
        return;
      }
      if (!isPro) {
        card.querySelectorAll('.pro,.pro-explain,.inline-tutor,.tutor,.upgrade-prompt,.pbn').forEach(function (n) { n.remove(); });
      }
      card.querySelectorAll('[onclick]').forEach(function (n) { n.removeAttribute('onclick'); });
      bodyEl.innerHTML = '';
      bodyEl.appendChild(card);
      bodyEl.scrollTop = 0;
    }

    if (_evCache[file]) { render(_evCache[file]); }
    else {
      fetch(file).then(function (r) { return r.text(); })
        .then(function (h) { _evCache[file] = h; render(h); })
        .catch(function () {
          bodyEl.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">Could not load. <a href="evidence-library.html" target="_blank" style="color:#1e4278;">Open the Evidence Library →</a></p>';
        });
    }
    return true;
  }

  function closeEvPop() {
    var pop = document.getElementById('ev-pop');
    if (pop) pop.style.display = 'none';
    document.body.style.overflow = '';
  }

  /* 4. Intercept clicks on a wired reading day's "Open Read" link */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('.plan-day-link');
    if (!link) return;
    var item = e.target.closest('.plan-day-item');
    if (!item) return;
    var planId = item.getAttribute('data-plan');
    var dayNum = parseInt(item.getAttribute('data-day'), 10);
    if (EV_DAY_CARD[planId] && EV_DAY_CARD[planId][dayNum]) {
      e.preventDefault();
      e.stopPropagation();
      openEvCard(planId, dayNum);
    }
  }, true);
})();
