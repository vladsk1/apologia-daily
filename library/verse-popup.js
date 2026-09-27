/* verse-popup.js — tap-to-read Scripture, site-wide. Turns every Bible reference
   in readable content into a link that opens a small popup with the verse text,
   WITHOUT leaving the page. Text is the Berean Standard Bible (public domain /
   CC0), split into per-book files under /library/bible/BSB/ by
   tools/build-bible-data.mjs and loaded ON DEMAND (only the book a reader taps
   into is fetched, then cached) so pages stay light. A small index.json ships up
   front so a reference is only linked when the verse really exists (no dead links).
   Each popup also offers "See the Greek/Hebrew on STEP" (opens STEPBible for that
   verse, with English word meanings) — the slot the future inline word-study fills.

   Interaction plumbing only — it displays existing public-domain Scripture and
   adds no doctrinal content, so it needs no gate (same class as reviewed-badge.js).

   Include once per page, after the content:
     <script src="/library/verse-popup.js" defer></script>
   Works on essays (.art-body), the Evidence Library hub (incl. tab fragments that
   load after page load) and its cards, mastery pages, answers, and worldviews. */
(function () {
  if (window.__versePopup) return; window.__versePopup = true;

  var BASE = '/library/bible/BSB/';

  // book token (normalised: lowercase, no spaces/periods) -> USFM code
  var BOOKS = {
    GEN:['genesis','gen'],EXO:['exodus','exod','exo','ex'],LEV:['leviticus','lev'],NUM:['numbers','num'],
    DEU:['deuteronomy','deut','deu'],JOS:['joshua','josh','jos'],JDG:['judges','judg','jdg'],RUT:['ruth','rut'],
    '1SA':['1samuel','1sam','1sa'],'2SA':['2samuel','2sam','2sa'],'1KI':['1kings','1kgs','1ki'],'2KI':['2kings','2kgs','2ki'],
    '1CH':['1chronicles','1chron','1chr','1ch'],'2CH':['2chronicles','2chron','2chr','2ch'],EZR:['ezra','ezr'],
    NEH:['nehemiah','neh'],EST:['esther','esth','est'],JOB:['job'],PSA:['psalms','psalm','pss','ps'],
    PRO:['proverbs','prov','pro'],ECC:['ecclesiastes','eccl','ecc'],SNG:['songofsongs','songofsolomon','song','sng'],
    ISA:['isaiah','isa'],JER:['jeremiah','jer'],LAM:['lamentations','lam'],EZK:['ezekiel','ezek','ezk'],
    DAN:['daniel','dan'],HOS:['hosea','hos'],JOL:['joel','jol'],AMO:['amos','amo'],OBA:['obadiah','obad','oba'],
    JON:['jonah','jon'],MIC:['micah','mic'],NAM:['nahum','nah','nam'],HAB:['habakkuk','hab'],ZEP:['zephaniah','zeph','zep'],
    HAG:['haggai','hag'],ZEC:['zechariah','zech','zec'],MAL:['malachi','mal'],MAT:['matthew','matt','mat','mt'],
    MRK:['mark','mrk','mk'],LUK:['luke','luk','lk'],JHN:['john','jhn','jn'],ACT:['acts','act'],ROM:['romans','rom'],
    '1CO':['1corinthians','1cor','1co'],'2CO':['2corinthians','2cor','2co'],GAL:['galatians','gal'],
    EPH:['ephesians','eph'],PHP:['philippians','phil','php'],COL:['colossians','col'],
    '1TH':['1thessalonians','1thess','1th'],'2TH':['2thessalonians','2thess','2th'],'1TI':['1timothy','1tim','1ti'],
    '2TI':['2timothy','2tim','2ti'],TIT:['titus','tit'],PHM:['philemon','phlm','phm'],HEB:['hebrews','heb'],
    JAS:['james','jas'],'1PE':['1peter','1pet','1pe'],'2PE':['2peter','2pet','2pe'],'1JN':['1john','1jn'],
    '2JN':['2john','2jn'],'3JN':['3john','3jn'],JUD:['jude','jud'],REV:['revelation','rev']
  };
  var TOKEN2USFM = {};
  for (var uu in BOOKS) for (var ii = 0; ii < BOOKS[uu].length; ii++) TOKEN2USFM[BOOKS[uu][ii]] = uu;

  // USFM -> STEPBible / OSIS book name (for the "see the Greek/Hebrew" link)
  var OSIS = {
    GEN:'Gen',EXO:'Exod',LEV:'Lev',NUM:'Num',DEU:'Deut',JOS:'Josh',JDG:'Judg',RUT:'Ruth','1SA':'1Sam','2SA':'2Sam',
    '1KI':'1Kgs','2KI':'2Kgs','1CH':'1Chr','2CH':'2Chr',EZR:'Ezra',NEH:'Neh',EST:'Esth',JOB:'Job',PSA:'Ps',PRO:'Prov',
    ECC:'Eccl',SNG:'Song',ISA:'Isa',JER:'Jer',LAM:'Lam',EZK:'Ezek',DAN:'Dan',HOS:'Hos',JOL:'Joel',AMO:'Amos',OBA:'Obad',
    JON:'Jonah',MIC:'Mic',NAM:'Nah',HAB:'Hab',ZEP:'Zeph',HAG:'Hag',ZEC:'Zech',MAL:'Mal',MAT:'Matt',MRK:'Mark',LUK:'Luke',
    JHN:'John',ACT:'Acts',ROM:'Rom','1CO':'1Cor','2CO':'2Cor',GAL:'Gal',EPH:'Eph',PHP:'Phil',COL:'Col','1TH':'1Thess',
    '2TH':'2Thess','1TI':'1Tim','2TI':'2Tim',TIT:'Titus',PHM:'Phlm',HEB:'Heb',JAS:'Jas','1PE':'1Pet','2PE':'2Pet',
    '1JN':'1John','2JN':'2John','3JN':'3John',JUD:'Jude',REV:'Rev'
  };

  var REF_RE = /(\b(?:[1-3]\s*)?[A-Za-z]{2,}\.?)\s*(\d+)[:.](\d+)(?:[-–](\d+))?/g;
  function norm(t) { return t.toLowerCase().replace(/[\s.]/g, ''); }

  var INDEX = null;                 // { USFM: [versesInCh1, ...] }
  var BOOKCACHE = {};               // USFM -> Promise<{"ch.v": text}>
  function loadBook(usfm) {
    if (!BOOKCACHE[usfm]) {
      BOOKCACHE[usfm] = fetch(BASE + usfm + '.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    }
    return BOOKCACHE[usfm];
  }
  // does this reference exist? (validated against the small index, no text load)
  function valid(usfm, ch, v) {
    var b = INDEX && INDEX[usfm];
    return !!(b && ch >= 1 && ch <= b.length && v >= 1 && v <= b[ch - 1]);
  }

  function css() {
    var s = document.createElement('style');
    s.textContent = [
      // color:inherit so it reads on light essays AND dark card tiers; gold marks it tappable
      '.vref{color:inherit;text-decoration:none;cursor:pointer;',
      'border-bottom:1px solid rgba(200,169,81,.65);background:rgba(200,169,81,.13);border-radius:2px;padding:0 .05em}',
      '.vref:hover{background:rgba(200,169,81,.28)}',
      '.vref:focus-visible{outline:2px solid #c8a951;outline-offset:1px}',
      '.vpop{position:absolute;z-index:2147483000;width:min(360px,calc(100vw - 24px));background:#fff;',
      "border:1px solid rgba(200,169,81,.55);border-radius:12px;box-shadow:0 16px 44px rgba(10,22,40,.28);",
      "padding:.85rem 1rem 1rem;font-family:'DM Sans',system-ui,sans-serif;display:none;text-align:left}",
      '.vpop.open{display:block}',
      '.vpop-ref{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:1rem;color:#0a1628;margin:0 0 .4rem;padding-right:1.2rem}',
      '.vpop-txt{font-size:.96rem;line-height:1.6;color:#26364e;margin:0 0 .7rem}',
      '.vpop-txt .vn{font-size:.62em;font-weight:700;color:#a88930;vertical-align:super;margin-right:2px}',
      '.vpop-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid #eee7db;padding-top:.6rem}',
      '.vpop-src{font-size:.68rem;color:#8a94a3;line-height:1.35}',
      '.vpop-step{font-size:.76rem;font-weight:600;color:#1e4278;text-decoration:none;white-space:nowrap;border-bottom:1px solid rgba(30,66,120,.35)}',
      '.vpop-step:hover{border-bottom-color:#1e4278}',
      '.vpop-x{position:absolute;top:6px;right:8px;background:none;border:0;font-size:1rem;color:#8a94a3;cursor:pointer;line-height:1;padding:4px}',
      '@media (max-width:560px){.vpop{position:fixed;left:0;right:0;bottom:0;top:auto!important;width:auto;',
      'border-radius:14px 14px 0 0;box-shadow:0 -12px 40px rgba(10,22,40,.32);padding-bottom:calc(1rem + env(safe-area-inset-bottom))}}'
    ].join('');
    document.head.appendChild(s);
  }

  var pop, popRef, popTxt, popStep;
  function ensurePop() {
    if (pop) return;
    pop = document.createElement('div');
    pop.className = 'vpop'; pop.setAttribute('role', 'dialog');
    pop.innerHTML = '<button class="vpop-x" type="button" aria-label="Close">✕</button>' +
      '<p class="vpop-ref"></p><p class="vpop-txt"></p>' +
      '<div class="vpop-foot"><span class="vpop-src">Berean Standard Bible (public domain)</span>' +
      '<a class="vpop-step" target="_blank" rel="noopener">See the Greek/Hebrew on STEP →</a></div>';
    document.body.appendChild(pop);
    popRef = pop.querySelector('.vpop-ref'); popTxt = pop.querySelector('.vpop-txt'); popStep = pop.querySelector('.vpop-step');
    pop.querySelector('.vpop-x').addEventListener('click', close);
  }
  function close() { if (pop) pop.classList.remove('open'); }

  function isMobile() { try { return window.matchMedia('(max-width:560px)').matches; } catch (e) { return false; } }

  function place(el) {
    if (isMobile()) return;               // CSS pins it to the bottom on phones
    var r = el.getBoundingClientRect(), pr = pop.getBoundingClientRect();
    var top = r.bottom + window.pageYOffset + 8;
    var left = Math.min(r.left + window.pageXOffset, window.pageXOffset + window.innerWidth - pr.width - 12);
    pop.style.top = top + 'px'; pop.style.left = Math.max(window.pageXOffset + 12, left) + 'px';
  }

  function open(el) {
    ensurePop();
    var usfm = el.getAttribute('data-b'), ch = +el.getAttribute('data-c'),
        v1 = +el.getAttribute('data-v'), v2 = +(el.getAttribute('data-v2') || el.getAttribute('data-v'));
    popRef.textContent = el.textContent.replace(/^\(|\)$/g, '');
    var osis = OSIS[usfm] || usfm;
    popStep.href = 'https://www.stepbible.org/?q=reference=' + osis + '.' + ch + '.' + v1 + (v2 > v1 ? '-' + v2 : '');
    popTxt.textContent = '…';
    pop.classList.add('open'); place(el);
    loadBook(usfm).then(function (data) {
      var parts = [];
      for (var v = v1; v <= v2; v++) {
        var t = data[ch + '.' + v];
        if (t) parts.push((v2 > v1 ? '<span class="vn">' + v + '</span>' : '') + t);
      }
      popTxt.innerHTML = parts.length ? parts.join(' ') : 'Verse text unavailable.';
      if (pop.classList.contains('open')) place(el);
    });
  }

  // wrap references inside a text node, returning a fragment (or null if none)
  function wrapNode(node) {
    var text = node.nodeValue;
    if (!text || text.length < 4 || !/\d/.test(text)) return null;
    REF_RE.lastIndex = 0;
    var m, last = 0, frag = null;
    while ((m = REF_RE.exec(text))) {
      var usfm = TOKEN2USFM[norm(m[1])];
      if (!usfm) continue;
      var ch = +m[2], v1 = +m[3];
      if (!valid(usfm, ch, v1)) continue;    // unknown/nonexistent verse -> leave as plain text
      if (!frag) frag = document.createDocumentFragment();
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement('a');
      a.className = 'vref'; a.setAttribute('role', 'button'); a.setAttribute('tabindex', '0');
      a.setAttribute('data-b', usfm); a.setAttribute('data-c', ch); a.setAttribute('data-v', v1);
      if (m[4]) a.setAttribute('data-v2', m[4]);
      a.textContent = m[0];
      frag.appendChild(a);
      last = m.index + m[0].length;
    }
    if (frag && last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }

  // Skip chrome / interactive / non-prose. Verse refs only live in Bible-quoting
  // prose, so processing readable text and skipping these is safe everywhere.
  var SKIP_TAG = { A:1, SCRIPT:1, STYLE:1, SUP:1, BUTTON:1, INPUT:1, TEXTAREA:1, SELECT:1, OPTION:1, NAV:1, HEADER:1, FOOTER:1, CODE:1, PRE:1, H1:1 };
  var SKIP_CLASS = /\b(vref|vpop|on-box|art-refs|art-crumbs|art-meta|art-eyebrow|adn-|footer|float-|toc-|upgrade-prompt|inline-tutor|reader-help|ask-sel)\b/;
  var SKIP_ID = { 'float-tutor':1, 'ev-pop':1, 'ad-miniplayer':1, proGate:1 };
  function skip(el) {
    for (var n = el; n && n !== document.body && n.nodeType; n = n.parentNode) {
      if (n.nodeType !== 1) continue;
      if (SKIP_TAG[n.tagName]) return true;
      if (n.id && SKIP_ID[n.id]) return true;
      var c = n.getAttribute && n.getAttribute('class');
      if (c && SKIP_CLASS.test(c)) return true;
    }
    return false;
  }

  function enhance(root) {
    if (!root || root.nodeType !== 1 || !INDEX) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue && /\d/.test(n.nodeValue) && !skip(n.parentNode)) nodes.push(n);
    for (var i = 0; i < nodes.length; i++) {
      var frag = wrapNode(nodes[i]);
      if (frag && nodes[i].parentNode) nodes[i].parentNode.replaceChild(frag, nodes[i]);
    }
  }

  function boot() {
    css();
    fetch(BASE + 'index.json').then(function (r) { return r.json(); }).then(function (idx) {
      INDEX = idx;
      enhance(document.body);
      // Evidence Library hub swaps tab fragments in after load — enhance new content.
      try {
        new MutationObserver(function (muts) {
          for (var i = 0; i < muts.length; i++)
            for (var j = 0; j < muts[i].addedNodes.length; j++) {
              var nn = muts[i].addedNodes[j];
              if (nn.nodeType === 1 && !skip(nn)) enhance(nn);
            }
        }).observe(document.body, { childList: true, subtree: true });
      } catch (e) {}
    }).catch(function () {});

    // CAPTURE phase: a .vref can sit inside an Evidence Library .card whose inline
    // onclick="tog(this)" would otherwise collapse the card on tap. Stopping the
    // event in capture beats that bubble-phase handler; preventDefault stops any
    // stray navigation. Non-vref clicks fall through untouched (just close the popup).
    document.addEventListener('click', function (e) {
      var v = e.target.closest ? e.target.closest('.vref') : null;
      if (v) { e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); open(v); return; }
      if (pop && pop.classList.contains('open') && !pop.contains(e.target)) close();
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('vref')) {
        e.preventDefault(); open(e.target);
      }
    });
    window.addEventListener('scroll', function () { if (pop && pop.classList.contains('open') && !isMobile()) close(); }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
