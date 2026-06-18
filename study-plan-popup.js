/* =========================================================================
   APOLOGIA DAILY — Study-plan in-page article popup
   Drop-in add-on. Upload this file to GitHub (root folder, next to
   study-plans.html), then add ONE line just before </body> in
   study-plans.html:   <script src="study-plan-popup.js"></script>

   What it does: on a study plan, clicking "Open Read" on a reading day opens
   the real Evidence Library card in a popup ON the page (fetched live, so it
   never goes stale) instead of jumping to the Evidence Library.
   Pro plans show the full card; free plans show the free portion only.
   The popup carries its own copy of the Evidence Library card styling, so it
   renders correctly on the study-plans page.
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

  /* Card styling copied from the Evidence Library, scoped under #ev-pop so it
     renders correctly inside the popup and never leaks onto the study page. */
  var EV_POP_CSS =
    '#ev-pop{--n:#0a1628;--n2:#050d1a;--n3:#1e4278;--n4:#f0f6fb;--g:#c8a951;--gl:#d4b96a;--w:#fff;--o:#f8f7f4;--m:#3a4a62;--mu:#7a8fa8;--b:#d4e0ec;--gr:#0f6e56;--gr2:#e1f5ee;--fd:"Playfair Display",Georgia,serif;--ui:"DM Sans",sans-serif;--bo:"Source Serif 4",Georgia,serif;}'
    + '#ev-pop .card{background:transparent;border:none;border-radius:0;margin:0;overflow:visible;}'
    + '#ev-pop .ch{display:none;}'
    + '#ev-pop .cb{display:block;padding:0;border-top:none;}'
    + '#ev-pop .fl{font-family:var(--ui);font-size:.62rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--gr);background:var(--gr2);padding:3px 10px;border-radius:20px;display:inline-block;margin:0 0 .9rem;}'
    + '#ev-pop .pe{font-family:var(--ui);font-size:.9rem;background:var(--n4);border-left:3px solid var(--g);padding:12px 16px;border-radius:0 4px 4px 0;color:var(--m);margin-bottom:1.25rem;line-height:1.7;}'
    + '#ev-pop .pe strong{color:var(--n);}'
    + '#ev-pop .ap{background:#fff;border:1px solid var(--b);border-radius:3px;padding:1.25rem 1.5rem;margin:1.25rem 0;}'
    + '#ev-pop .apl{font-family:var(--ui);font-size:.65rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);margin-bottom:.75rem;}'
    + '#ev-pop .ap ol{padding-left:1.25rem;margin:0;}'
    + '#ev-pop .ap ol li{font-size:.95rem;color:var(--m);margin-bottom:6px;line-height:1.6;}'
    + '#ev-pop .ex{font-size:.98rem;color:var(--m);line-height:1.85;margin-bottom:1.25rem;}'
    + '#ev-pop .ob{background:var(--o);border-radius:4px;padding:1.25rem 1.5rem;margin-top:1.25rem;}'
    + '#ev-pop .obt{font-family:var(--ui);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mu);margin-bottom:1rem;}'
    + '#ev-pop .or{display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;}'
    + '#ev-pop .oq{font-family:var(--ui);font-size:.65rem;font-weight:700;background:var(--n3);color:#fff;padding:1px 6px;border-radius:3px;flex-shrink:0;margin-top:2px;}'
    + '#ev-pop .oa{font-size:.92rem;color:var(--m);line-height:1.6;}'
    + '#ev-pop .oa strong{color:var(--n);font-weight:500;}'
    + '#ev-pop .pro{background:var(--n2);border-radius:6px;padding:1.5rem;margin-top:1.25rem;}'
    + '#ev-pop .proh{display:flex;align-items:center;gap:12px;margin-bottom:1.25rem;flex-wrap:wrap;}'
    + '#ev-pop .prob{font-family:var(--ui);font-size:.62rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;background:rgba(200,169,81,.15);color:var(--g);padding:3px 10px;border-radius:20px;border:1px solid rgba(200,169,81,.3);}'
    + '#ev-pop .prot{font-family:var(--ui);font-size:.82rem;color:rgba(255,255,255,.5);}'
    + '#ev-pop .pro-explain{background:rgba(200,169,81,.06);border-left:3px solid var(--g);border-radius:0 4px 4px 0;padding:1rem 1.25rem;margin:.75rem 0 1.25rem;}'
    + '#ev-pop .psl{font-family:var(--ui);font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin:1.25rem 0 .6rem;}'
    + '#ev-pop .pt{font-size:.95rem;color:rgba(255,255,255,.78);line-height:1.85;margin-bottom:1rem;}'
    + '#ev-pop .pt strong{color:#fff;}'
    + '#ev-pop .af{display:flex;gap:10px;margin-top:1.5rem;flex-wrap:wrap;}'
    + '#ev-pop .aa{font-family:var(--ui);font-size:.82rem;font-weight:500;padding:9px 18px;border-radius:3px;text-decoration:none;}'
    + '#ev-pop .aa1{background:var(--g);color:var(--n);}'
    + '#ev-pop .aa2{background:rgba(255,255,255,.08);color:rgba(255,255,255,.65);}';

  /* Build the popup shell once and add it to the page */
  function ensurePopup() {
    if (document.getElementById('ev-pop')) return;

    var st = document.createElement('style');
    st.id = 'ev-pop-styles';
    st.textContent = EV_POP_CSS;
    document.head.appendChild(st);

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
      /* Remove elements that don't work or aren't wanted in the reading popup */
      card.querySelectorAll('.inline-tutor,.tutor,.tutor-resp-text,.pocket-card-btn,.upgrade-prompt,.pbn').forEach(function (n) { n.remove(); });
      card.querySelectorAll('a[href^="ev-m-"]').forEach(function (n) { n.remove(); });
      /* Free plans: also strip the Pro deep dive */
      if (!isPro) {
        card.querySelectorAll('.pro,.pro-explain').forEach(function (n) { n.remove(); });
      }
      /* Neutralise any leftover inline click handlers */
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
