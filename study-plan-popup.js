/* =========================================================================
   APOLOGIA DAILY — Study-plan in-page article popup
   Drop-in add-on. Upload this file to GitHub (root folder, next to
   study-plans.html). study-plans.html already loads it via:
       <script src="study-plan-popup.js"></script>   (just before </body>)

   What it does: on a study plan, clicking "Open Read" on a reading day opens
   the real Evidence Library (or Worldviews) card in a popup ON the page
   (fetched live, so it never goes stale) instead of jumping away.
   Pro plans show the full card; free plans show the free portion only.
   The popup carries its own copy of the card styling, so it renders correctly
   on the study-plans page.
   NOTE: uses fetch() — only works on the live Vercel site, not a local file.

   HOW TO WIRE A DAY:
     EV_DAY_CARD[planId][dayNumber] = either
       "Exact Card Title"                   (uses the plan's default file below)
       { f: "ev-s3.html", t: "Card Title" } (override the file for that one day)
   Only "Read" days that have a real matching card are listed. Every other day
   (Ask, Debate, Quiz, Reflect, vague/"read whole tab" days, and the
   daily-defender habit plan) is left alone and opens its normal link.
   ========================================================================= */
(function () {
  /* 1. Default Evidence Library / Worldviews file each plan pulls from */
  var EV_PLAN_TAB = {
    "resurrection": "ev-s2.html",
    "gods_existence": "ev-s1.html",
    "bible_reliability": "ev-s4.html",
    "jesus_identity": "ev-s3.html",
    "answering_islam": "worldviews.html",
    "existence-god": "ev-s1.html",
    "jesus-crash-course": "ev-s3.html",
    "worldview-comparison": "ev-s1.html",
    "debate-ready": "ev-s3.html"
  };

  /* 2. For each wired plan: DAY NUMBER -> card (string = default file; {f,t} = override) */
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
    },
    "gods_existence": {
      1:  "The Kalam Cosmological Argument",
      3:  "The Leibniz Contingency Argument",
      4:  "The Thomistic Cosmological Argument",
      8:  "The Fine-Tuning Argument",
      9:  "The Argument from Consciousness",
      11: "The Argument from Reason",
      15: "The Moral Argument",
      16: "The Argument from Beauty",
      17: "The Ontological Argument"
    },
    "bible_reliability": {
      1:  "The Manuscript Reliability Argument",
      2:  "The Dead Sea Scrolls and Old Testament Reliability",
      3:  "Archaeological Confirmation of the Bible",
      5:  "The Early Date of the New Testament",
      8:  "The Argument from Fulfilled Prophecy in the Old Testament",
      9:  "The Canon Formation Argument",
      10: "The Reliability of the Gospel Eyewitnesses",
      12: "The Internal Consistency of Scripture"
    },
    "jesus_identity": {
      1:  "The Historical Existence of Jesus",
      2:  "Did Jesus Claim to Be God?",
      3:  "The Titles of Jesus",
      5:  "John 1:1 and the Pre-existence of Christ",
      8:  "Messianic Prophecy - the Statistical Case",
      9:  "Daniel's 70 Weeks",
      10: "The Early Creed of 1 Corinthians 15"
    },
    "answering_islam": {
      1:  "The Islamic Dilemma",
      2:  "The Variant Readings (Qira'at)",
      4:  "The Preservation Promise vs the Lost Verses",
      8:  { f: "ev-s3.html", t: "Did Jesus Claim to Be God?" },
      9:  { f: "ev-s3.html", t: "Messianic Prophecy - the Statistical Case" },
      11: "The Sira"
    },
    "existence-god": {
      1:  "The Kalam Cosmological Argument",
      3:  "The Leibniz Contingency Argument",
      5:  "The Fine-Tuning Argument",
      8:  "The Argument from Consciousness",
      10: "The Argument from Reason",
      12: "The Argument from Beauty",
      15: "The Moral Argument",
      17: "The Problem of Evil as Evidence for God",
      19: "The Thomistic Cosmological Argument",
      22: "The Ontological Argument",
      24: "The Argument from Religious Experience",
      28: "The Kalam Cosmological Argument"
    },
    "jesus-crash-course": {
      1:  "The Historical Existence of Jesus",
      2:  "Jesus as God in the New Testament",
      4:  "Did Jesus Claim to Be God?",
      8:  { f: "ev-s2.html", t: "The Minimal Facts Argument" },
      9:  "Messianic Prophecy - the Statistical Case",
      11: "The Early Creed of 1 Corinthians 15"
    },
    "worldview-comparison": {
      1:  { f: "ev-s2.html", t: "The Minimal Facts Argument" },
      2:  "The Moral Argument",
      4:  { f: "ev-s3.html", t: "Jesus as God in the New Testament" },
      8:  { f: "worldviews.html", t: "The Islamic Dilemma" },
      10: { f: "worldviews.html", t: "The Islamic Dilemma" },
      14: { f: "worldviews.html", t: "The Islamic Dilemma" },
      15: "The Moral Argument"
    },
    "debate-ready": {
      3:  { f: "ev-s1.html", t: "The Problem of Evil as Evidence for God" },
      8:  { f: "ev-s2.html", t: "The Minimal Facts Argument" },
      12: { f: "ev-s2.html", t: "The Minimal Facts Argument" },
      15: "Did Jesus Claim to Be God?",
      19: "John 1:1 and the Pre-existence of Christ"
    }
  };

  /* 3. Which plans show the full card.
        Site is currently fully open (Pro not yet gated), so every study-plan
        reading popup shows the complete argument — matching the Resurrection
        plan. When Stripe/Pro launches, set the free plans back to false. */
  var EV_PLAN_PRO = {
    "resurrection": true,
    "gods_existence": true,
    "bible_reliability": true,
    "jesus_identity": true,
    "answering_islam": true,
    "existence-god": true,
    "jesus-crash-course": true,
    "worldview-comparison": true,
    "debate-ready": true
  };

  var _evCache = {};

  /* Resolve a day's map entry to { file, title } (supports string or {f,t}) */
  function resolveEntry(planId, dayNum) {
    var byPlan = EV_DAY_CARD[planId];
    if (!byPlan) return null;
    var entry = byPlan[dayNum];
    if (!entry) return null;
    if (typeof entry === 'string') {
      var f = EV_PLAN_TAB[planId];
      if (!f) return null;
      return { file: f, title: entry };
    }
    if (entry.f && entry.t) return { file: entry.f, title: entry.t };
    return null;
  }

  /* Card styling copied from the Evidence Library + Worldviews, scoped under
     #ev-pop so it renders correctly inside the popup and never leaks out. */
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
    + '#ev-pop .aa2{background:rgba(255,255,255,.08);color:rgba(255,255,255,.65);}'
    /* ---- Worldviews (Islam) card styling, scoped to the popup ---- */
    + '#ev-pop .argument-card{background:transparent;border:none;border-radius:0;margin:0;box-shadow:none;overflow:visible;}'
    + '#ev-pop .argument-header{display:none;}'
    + '#ev-pop .argument-body{display:block;padding:0;}'
    + '#ev-pop .tier-label-free,#ev-pop .tier-label{font-family:var(--ui);font-size:.62rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--gr);background:var(--gr2);padding:3px 10px;border-radius:20px;display:inline-block;margin:0 0 .9rem;}'
    + '#ev-pop .argument-premise{background:#fff;border:1px solid var(--b);border-radius:3px;padding:1.25rem 1.5rem;margin:1.25rem 0;}'
    + '#ev-pop .argument-premise-label{font-family:var(--ui);font-size:.65rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);margin-bottom:.75rem;}'
    + '#ev-pop .argument-premise ol{padding-left:1.25rem;margin:0;}'
    + '#ev-pop .argument-premise ol li{font-size:.95rem;color:var(--m);margin-bottom:6px;line-height:1.6;}'
    + '#ev-pop .argument-premise p{font-size:.95rem;color:var(--m);line-height:1.7;margin:0 0 .5rem;}'
    + '#ev-pop .argument-plain,#ev-pop .argument-explanation{font-size:.98rem;color:var(--m);line-height:1.85;margin-bottom:1.25rem;}'
    + '#ev-pop .argument-plain strong,#ev-pop .argument-explanation strong{color:var(--n);}'
    + '#ev-pop .wv-objections,#ev-pop .argument-objections{background:var(--o);border-radius:4px;padding:1.25rem 1.5rem;margin-top:1.25rem;}'
    + '#ev-pop .wv-obj-title,#ev-pop .argument-objections-title{font-family:var(--ui);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mu);margin-bottom:1rem;}'
    + '#ev-pop .wv-obj-row,#ev-pop .objection-row{display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;}'
    + '#ev-pop .wv-oq,#ev-pop .objection-q{font-family:var(--ui);font-size:.65rem;font-weight:700;background:var(--n3);color:#fff;padding:1px 6px;border-radius:3px;flex-shrink:0;margin-top:2px;white-space:nowrap;}'
    + '#ev-pop .wv-oa,#ev-pop .objection-a{font-size:.92rem;color:var(--m);line-height:1.6;}'
    + '#ev-pop .wv-oa strong,#ev-pop .objection-a strong{color:var(--n);font-weight:500;}'
    + '#ev-pop .wv-pro{background:var(--n2);border-radius:6px;padding:1.5rem;margin-top:1.25rem;}'
    + '#ev-pop .wv-pro-header{display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;}'
    + '#ev-pop .wv-pro-badge{font-family:var(--ui);font-size:.62rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;background:rgba(200,169,81,.15);color:var(--g);padding:3px 10px;border-radius:20px;border:1px solid rgba(200,169,81,.3);}'
    + '#ev-pop .wv-pro-subtitle{font-family:var(--ui);font-size:.82rem;color:rgba(255,255,255,.5);}'
    + '#ev-pop .wv-pro-section-label{font-family:var(--ui);font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin:1.25rem 0 .6rem;}'
    + '#ev-pop .wv-pro-text,#ev-pop .wv-explain{font-size:.95rem;color:rgba(255,255,255,.78);line-height:1.85;margin-bottom:1rem;}'
    + '#ev-pop .wv-pro-text strong,#ev-pop .wv-explain strong{color:#fff;}';

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
            '<div id="ev-pop-kicker" style="font-family:\'DM Sans\',sans-serif;font-size:.62rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#c8a951;">Evidence Library</div>' +
            '<div id="ev-pop-title" style="font-family:\'Playfair Display\',serif;font-size:1.15rem;font-weight:700;color:#fff;margin-top:3px;">Loading…</div>' +
          '</div>' +
          '<button id="ev-pop-close" style="background:rgba(255,255,255,.1);border:none;border-radius:50%;width:32px;height:32px;color:#fff;font-size:1rem;cursor:pointer;flex-shrink:0;">✕</button>' +
        '</div>' +
        '<div id="ev-pop-body" style="padding:1.5rem;max-height:70vh;overflow-y:auto;font-family:\'Source Serif 4\',Georgia,serif;color:#0a1628;"></div>' +
        '<div style="padding:0 1.5rem 1.5rem;">' +
          '<a id="ev-pop-full" href="evidence-library.html" target="_blank" style="font-family:\'DM Sans\',sans-serif;font-size:.8rem;color:#7a8fa8;text-decoration:none;">Open the full Evidence Library →</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(pop);
    pop.addEventListener('click', function (e) { if (e.target === pop) closeEvPop(); });
    document.getElementById('ev-pop-close').addEventListener('click', closeEvPop);
  }

  function evNorm(s) {
    return (s || '').toLowerCase().replace(/[\u2018\u2019']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  /* The "main title" before any dash (hyphen / en / em) \u2014 lets a day match a card
     whose subtitle has since been reworded (e.g. map "Messianic Prophecy - the
     Statistical Case" still finds the card "Messianic Prophecy \u2014 Foretold and
     Fulfilled"). Normalised; used only as a fallback after exact/substring. */
  function evHead(s) {
    return evNorm((s || '').split(/[\u2014\u2013-]/)[0]);
  }

  /* Find a card by title. Tries Evidence Library (.card/.ct) first, then
     Worldviews (.argument-card/.argument-title). Returns the matched node. */
  function findEvCard(tabHtml, wantTitle) {
    var tmp = document.createElement('div');
    tmp.innerHTML = tabHtml;
    var wn = evNorm(wantTitle);
    var i, t, tn;

    var cards = tmp.querySelectorAll('.card');
    for (i = 0; i < cards.length; i++) {
      t = cards[i].querySelector('.ct');
      if (!t) continue;
      tn = evNorm(t.textContent);
      if (tn === wn || tn.indexOf(wn) !== -1 || wn.indexOf(tn) !== -1) {
        cards[i].classList.add('op');
        return cards[i];
      }
    }

    var acards = tmp.querySelectorAll('.argument-card');
    for (i = 0; i < acards.length; i++) {
      t = acards[i].querySelector('.argument-title');
      if (!t) continue;
      tn = evNorm(t.textContent);
      if (tn === wn || tn.indexOf(wn) !== -1 || wn.indexOf(tn) !== -1) {
        acards[i].classList.add('open');
        return acards[i];
      }
    }

    /* Fallback: match on the pre-dash main title (survives subtitle rewording). */
    var wh = evHead(wantTitle);
    if (wh.length >= 6) {
      for (i = 0; i < cards.length; i++) {
        t = cards[i].querySelector('.ct');
        if (t && evHead(t.textContent) === wh) { cards[i].classList.add('op'); return cards[i]; }
      }
      for (i = 0; i < acards.length; i++) {
        t = acards[i].querySelector('.argument-title');
        if (t && evHead(t.textContent) === wh) { acards[i].classList.add('open'); return acards[i]; }
      }
    }
    return null;
  }

  function openEvCard(planId, dayNum) {
    var resolved = resolveEntry(planId, dayNum);
    if (!resolved) return false;
    var file = resolved.file;
    var title = resolved.title;
    var isPro = !!EV_PLAN_PRO[planId];
    var isWv = /worldviews/.test(file);

    ensurePopup();
    var kicker = document.getElementById('ev-pop-kicker');
    if (kicker) kicker.textContent = isWv ? 'Worldviews' : 'Evidence Library';
    var fullLink = document.getElementById('ev-pop-full');
    if (fullLink) {
      fullLink.setAttribute('href', isWv ? 'worldviews.html' : 'evidence-library.html');
      fullLink.textContent = isWv ? 'Open the full Worldviews page →' : 'Open the full Evidence Library →';
    }
    document.getElementById('ev-pop-title').textContent = title;
    var bodyEl = document.getElementById('ev-pop-body');
    bodyEl.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">Loading the argument…</p>';
    document.getElementById('ev-pop').style.display = 'block';
    document.body.style.overflow = 'hidden';

    var fallbackHref = isWv ? 'worldviews.html' : 'evidence-library.html';
    var fallbackName = isWv ? 'Worldviews page' : 'Evidence Library';

    function render(tabHtml) {
      var card = findEvCard(tabHtml, title);
      if (!card) {
        bodyEl.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">Could not load this argument. <a href="' + fallbackHref + '" target="_blank" style="color:#1e4278;">Open it in the ' + fallbackName + ' →</a></p>';
        return;
      }
      /* Remove elements that don't work or aren't wanted in the reading popup */
      card.querySelectorAll('.inline-tutor,.tutor,.tutor-resp-text,.pocket-card-btn,.upgrade-prompt,.pbn').forEach(function (n) { n.remove(); });
      card.querySelectorAll('a[href^="ev-m-"]').forEach(function (n) { n.remove(); });
      /* Free plans: also strip the Pro deep dive (both card styles) */
      if (!isPro) {
        card.querySelectorAll('.pro,.pro-explain,.wv-pro,.wv-explain').forEach(function (n) { n.remove(); });
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
          bodyEl.innerHTML = '<p style="font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">Could not load. <a href="' + fallbackHref + '" target="_blank" style="color:#1e4278;">Open the ' + fallbackName + ' →</a></p>';
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
    if (resolveEntry(planId, dayNum)) {
      e.preventDefault();
      e.stopPropagation();
      openEvCard(planId, dayNum);
    }
  }, true);
})();
