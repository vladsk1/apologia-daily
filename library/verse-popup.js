/* verse-popup.js — tap-to-read Scripture, site-wide, with inline Greek (Phase 2a).
   Tap any Bible reference and the verse opens in a popup on the page (no leaving).
   For New Testament verses a small "English / Greek" toggle reveals the verse
   word-by-word — each Greek word with its transliteration and meaning, tap a word
   for its dictionary meaning and grammar.

   English text: Berean Standard Bible (public domain / CC0), per-book under
     /library/bible/BSB/<USFM>.json  (+ index.json for validation).
   Greek text + meanings: STEP TAGNT (Tyndale House / STEPBible.org, CC BY),
     per-chapter under /library/bible/GRC/<USFM>/<chapter>.json as
     [word, translit, gloss, lemma, dictMeaning, morphCode] arrays.
   Both load ON DEMAND and cache, so pages stay light. Displays existing
   public-domain / openly-licensed reference data; adds no doctrinal content, so
   it needs no gate (same class as reviewed-badge.js).

   Include once per page, after the content:
     <script src="/library/verse-popup.js" defer></script> */
(function () {
  if (window.__versePopup) return; window.__versePopup = true;

  var BSB = '/library/bible/BSB/', GRC = '/library/bible/GRC/', HBO = '/library/bible/HBO/';

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
  var OSIS = {
    GEN:'Gen',EXO:'Exod',LEV:'Lev',NUM:'Num',DEU:'Deut',JOS:'Josh',JDG:'Judg',RUT:'Ruth','1SA':'1Sam','2SA':'2Sam',
    '1KI':'1Kgs','2KI':'2Kgs','1CH':'1Chr','2CH':'2Chr',EZR:'Ezra',NEH:'Neh',EST:'Esth',JOB:'Job',PSA:'Ps',PRO:'Prov',
    ECC:'Eccl',SNG:'Song',ISA:'Isa',JER:'Jer',LAM:'Lam',EZK:'Ezek',DAN:'Dan',HOS:'Hos',JOL:'Joel',AMO:'Amos',OBA:'Obad',
    JON:'Jonah',MIC:'Mic',NAM:'Nah',HAB:'Hab',ZEP:'Zeph',HAG:'Hag',ZEC:'Zech',MAL:'Mal',MAT:'Matt',MRK:'Mark',LUK:'Luke',
    JHN:'John',ACT:'Acts',ROM:'Rom','1CO':'1Cor','2CO':'2Cor',GAL:'Gal',EPH:'Eph',PHP:'Phil',COL:'Col','1TH':'1Thess',
    '2TH':'2Thess','1TI':'1Tim','2TI':'2Tim',TIT:'Titus',PHM:'Phlm',HEB:'Heb',JAS:'Jas','1PE':'1Pet','2PE':'2Pet',
    '1JN':'1John','2JN':'2John','3JN':'3John',JUD:'Jude',REV:'Rev'
  };
  var NT = {MAT:1,MRK:1,LUK:1,JHN:1,ACT:1,ROM:1,'1CO':1,'2CO':1,GAL:1,EPH:1,PHP:1,COL:1,'1TH':1,'2TH':1,'1TI':1,'2TI':1,TIT:1,PHM:1,HEB:1,JAS:1,'1PE':1,'2PE':1,'1JN':1,'2JN':1,'3JN':1,JUD:1,REV:1};

  var REF_RE = /(\b(?:[1-3]\s*)?[A-Za-z]{2,}\.?)\s*(\d+)[:.](\d+)(?:[-–](\d+))?/g;
  function norm(t) { return t.toLowerCase().replace(/[\s.]/g, ''); }

  // ---- decode a Robinson morphology code into readable grammar -------------
  var WHOLE = {PREP:'preposition',CONJ:'conjunction',ADV:'adverb',PRT:'particle',INJ:'interjection',COND:'conditional particle','N-PRI':'proper noun','A-NUI':'numeral','N-LI':'indeclinable letter','N-OI':'indeclinable noun',ARAM:'Aramaic word',HEB:'Hebrew word'};
  var POS = {N:'noun',A:'adjective',T:'the (article)',V:'verb',R:'relative pronoun',C:'reciprocal pronoun',D:'demonstrative pronoun',K:'correlative pronoun',I:'interrogative pronoun',X:'indefinite pronoun',Q:'correlative pronoun',F:'reflexive pronoun',S:'possessive pronoun',P:'personal pronoun'};
  var CASE={N:'nominative',G:'genitive',D:'dative',A:'accusative',V:'vocative'},NUM={S:'singular',P:'plural'},GEN={M:'masculine',F:'feminine',N:'neuter'};
  var TENSE={P:'present',I:'imperfect',F:'future',A:'aorist',X:'perfect',Y:'pluperfect'},VOICE={A:'active',M:'middle',P:'passive',E:'middle/passive',D:'middle deponent',O:'passive deponent',N:'deponent'},MOOD={I:'indicative',S:'subjunctive',O:'optative',M:'imperative',N:'infinitive',P:'participle'};
  var ORD={'1':'1st','2':'2nd','3':'3rd'};
  function nominal(seg) {
    if (!seg) return ''; var out = [], i = 0;
    if (/^[123]/.test(seg)) { out.push(ORD[seg[0]] + ' person'); i = 1; }
    if (CASE[seg[i]]) out.push(CASE[seg[i]]); if (NUM[seg[i+1]]) out.push(NUM[seg[i+1]]); if (GEN[seg[i+2]]) out.push(GEN[seg[i+2]]);
    return out.join(' ');
  }
  function decodeMorph(code) {
    if (!code) return ''; if (WHOLE[code]) return WHOLE[code];
    var p = code.split('-'), pos = p[0];
    if (pos === 'V') {
      var seg = p[1] || '', second = ''; if (seg[0] === '2') { second = 'second '; seg = seg.slice(1); }
      var g = [(second + (TENSE[seg[0]] || '')).trim(), VOICE[seg[1]], MOOD[seg[2]]].filter(Boolean).join(' ');
      var pn = p[2] || '', extra = '';
      if (MOOD[seg[2]] === 'participle' || MOOD[seg[2]] === 'infinitive') { var nd = nominal(pn); if (nd) extra = ', ' + nd; }
      else if (pn) { var per = /^[123]/.test(pn) ? ORD[pn[0]] + ' person ' : ''; extra = ', ' + (per + (NUM[pn[pn.length - 1]] || '')).trim(); }
      return ('verb — ' + g + extra).replace(/\s+/g, ' ').trim();
    }
    if (POS[pos]) { var d = nominal(p[1] || ''); return POS[pos] + (d ? ' — ' + d : ''); }
    return code;
  }

  // Hebrew (OpenScriptures morphology, as used by STEP TAHOT)
  var HPOS = {A:'adjective',C:'conjunction',D:'adverb',N:'noun',P:'pronoun',R:'preposition',S:'suffix',T:'particle',V:'verb'};
  var HG={m:'masculine',f:'feminine',c:'common',b:'both'},HN={s:'singular',p:'plural',d:'dual'},HST={a:'absolute',c:'construct',d:'determined'};
  var HSTEM={q:'qal',N:'niphal',p:'piel',P:'pual',h:'hiphil',H:'hophal',t:'hithpael',o:'polel',O:'polal',r:'poel',R:'poal',v:'hishtaphel'};
  var HCONJ={p:'perfect',q:'sequential perfect',i:'imperfect',w:'sequential imperfect',h:'cohortative',j:'jussive',v:'imperative',r:'participle',s:'passive participle',a:'infinitive absolute',c:'infinitive construct'};
  function hgn(seg) {
    if (!seg) return ''; var out = [], i = 0;
    if (/^[123]/.test(seg)) { out.push(ORD[seg[0]] + ' person'); i = 1; }
    if (HG[seg[i]]) { out.push(HG[seg[i]]); i++; } if (HN[seg[i]]) { out.push(HN[seg[i]]); i++; } if (HST[seg[i]]) out.push(HST[seg[i]]);
    return out.join(' ');
  }
  function decodeHeb(code) {
    if (!code) return ''; var aram = code[0] === 'A', c = code.replace(/^[HA]/, ''), pos = c[0];
    if (pos === 'N') { var t = c[1]; if (t === 'p') return 'proper noun'; if (t === 'g') return 'gentilic noun'; var d = [HG[c[2]], HN[c[3]], HST[c[4]]].filter(Boolean).join(' '); return 'noun' + (d ? ' — ' + d : ''); }
    if (pos === 'V') { var ex = hgn(c.slice(3)); return 'verb — ' + [HSTEM[c[1]], HCONJ[c[2]]].filter(Boolean).join(' ') + (ex ? ', ' + ex : ''); }
    if (pos === 'A') { var d2 = [HG[c[2]], HN[c[3]], HST[c[4]]].filter(Boolean).join(' '); return 'adjective' + (d2 ? ' — ' + d2 : ''); }
    if (pos === 'P') { var d3 = hgn(c.slice(2)); return 'pronoun' + (d3 ? ' — ' + d3 : ''); }
    return (aram ? 'Aramaic ' : '') + (HPOS[pos] || code);
  }
  function decode(code, lang) { return lang === 'hbo' ? decodeHeb(code) : decodeMorph(code); }

  var INDEX = null, BOOKCACHE = {}, GKCACHE = {};
  function loadBook(usfm) {
    if (!BOOKCACHE[usfm]) BOOKCACHE[usfm] = fetch(BSB + usfm + '.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return BOOKCACHE[usfm];
  }
  function origBase(usfm) { return NT[usfm] ? GRC : HBO; }
  function origLang(usfm) { return NT[usfm] ? 'grc' : 'hbo'; }
  function origLabel(usfm) { return NT[usfm] ? 'Greek' : 'Hebrew'; }
  function loadOrig(usfm, ch) {
    var k = origBase(usfm) + usfm + '/' + ch;
    if (!GKCACHE[k]) GKCACHE[k] = fetch(origBase(usfm) + usfm + '/' + ch + '.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return GKCACHE[k];
  }
  function valid(usfm, ch, v) { var b = INDEX && INDEX[usfm]; return !!(b && ch >= 1 && ch <= b.length && v >= 1 && v <= b[ch - 1]); }
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function css() {
    var s = document.createElement('style');
    s.textContent = [
      '.vref{color:inherit;text-decoration:none;cursor:pointer;border-bottom:1px solid rgba(200,169,81,.65);background:rgba(200,169,81,.13);border-radius:2px;padding:0 .05em}',
      '.vref:hover{background:rgba(200,169,81,.28)}.vref:focus-visible{outline:2px solid #c8a951;outline-offset:1px}',
      ".vpop{position:absolute;z-index:2147483000;width:min(380px,calc(100vw - 24px));max-height:min(72vh,600px);overflow:auto;background:#fff;border:1px solid rgba(200,169,81,.55);border-radius:12px;box-shadow:0 16px 44px rgba(10,22,40,.28);padding:.85rem 1rem 1rem;font-family:'DM Sans',system-ui,sans-serif;display:none;text-align:left}",
      '.vpop.open{display:block}',
      '.vpop-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 .5rem;padding-right:1rem}',
      '.vpop-ref{font-family:"Playfair Display",Georgia,serif;font-weight:500;font-size:16px;color:#0a1628}',
      '.vpop-tog{display:none;border:1px solid #e0dccf;border-radius:999px;overflow:hidden;font-size:11px;flex:0 0 auto}',
      '.vpop-tog.show{display:inline-flex}',
      '.vpop-tog button{border:0;background:none;padding:3px 11px;color:#8a94a3;cursor:pointer;font:inherit}',
      '.vpop-tog button.on{background:#0a1628;color:#fff}',
      '.vpop-txt{font-size:15px;line-height:1.6;color:#26364e}.vpop-txt .vn{font-size:.62em;font-weight:700;color:#a88930;vertical-align:super;margin-right:2px}',
      '.vpop-gk{display:none}.vpop-gk.show{display:block}',
      '.vpop-vlabel{font-size:11px;color:#a88930;font-weight:700;margin:.4rem 0 .3rem}',
      '.vpop-words{display:flex;flex-wrap:wrap;gap:6px}',
      '.vw{text-align:center;border:1px solid #eee7db;border-radius:8px;padding:5px 8px;background:none;cursor:pointer;font:inherit}',
      '.vw:hover{background:rgba(200,169,81,.10)}.vw.sel{border-color:#c8a951;background:rgba(200,169,81,.18)}',
      '.vw .vwg{font-size:17px;color:#0a1628;line-height:1.25}.vw .vwt{font-size:11px;color:#a88930}.vw .vwm{font-size:12px;color:#26364e}',
      '.vpop-detail{margin-top:10px;background:rgba(200,169,81,.10);border-radius:8px;padding:8px 11px;font-size:12px;line-height:1.55;color:#26364e;min-height:1px}',
      '.vpop-detail .dg{font-family:"Playfair Display",Georgia,serif;font-size:16px;color:#0a1628}.vpop-detail .dt{color:#a88930}.vpop-detail .dm{color:#8a94a3}',
      '.vpop-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid #eee7db;padding-top:.6rem;margin-top:.7rem}',
      '.vpop-src{font-size:11px;color:#8a94a3;line-height:1.35}',
      '.vpop-step{font-size:12px;font-weight:500;color:#1e4278;text-decoration:none;white-space:nowrap;border-bottom:1px solid rgba(30,66,120,.35)}.vpop-step:hover{border-bottom-color:#1e4278}',
      '.vpop-x{position:absolute;top:6px;right:8px;background:none;border:0;font-size:1rem;color:#8a94a3;cursor:pointer;line-height:1;padding:4px}',
      '@media (max-width:560px){.vpop{position:fixed;left:0;right:0;bottom:0;top:auto!important;width:auto;max-height:80vh;border-radius:14px 14px 0 0;box-shadow:0 -12px 40px rgba(10,22,40,.32);padding-bottom:calc(1rem + env(safe-area-inset-bottom))}}'
    ].join('');
    document.head.appendChild(s);
  }

  var pop, elRef, elTog, elTxt, elGk, elWords, elDetail, elSrc, elStep;
  var mode = 'en', cur = null, curWords = [];
  function ensurePop() {
    if (pop) return;
    pop = document.createElement('div'); pop.className = 'vpop'; pop.setAttribute('role', 'dialog');
    pop.innerHTML =
      '<button class="vpop-x" type="button" aria-label="Close">✕</button>' +
      '<div class="vpop-head"><span class="vpop-ref"></span>' +
      '<span class="vpop-tog"><button type="button" data-m="en" class="on">English</button><button type="button" data-m="gk">Greek</button></span></div>' +
      '<div class="vpop-txt"></div>' +
      '<div class="vpop-gk"><div class="vpop-words"></div><div class="vpop-detail"></div></div>' +
      '<div class="vpop-foot"><span class="vpop-src"></span><a class="vpop-step" target="_blank" rel="noopener"></a></div>';
    document.body.appendChild(pop);
    elRef = pop.querySelector('.vpop-ref'); elTog = pop.querySelector('.vpop-tog'); elTxt = pop.querySelector('.vpop-txt');
    elGk = pop.querySelector('.vpop-gk'); elWords = pop.querySelector('.vpop-words'); elDetail = pop.querySelector('.vpop-detail');
    elSrc = pop.querySelector('.vpop-src'); elStep = pop.querySelector('.vpop-step');
    pop.querySelector('.vpop-x').addEventListener('click', close);
    pop.addEventListener('click', function (e) {
      var t = e.target.closest('.vpop-tog button'); if (t) { setMode(t.getAttribute('data-m')); return; }
      var w = e.target.closest('.vw'); if (w) { selectWord(+w.getAttribute('data-i'), w); }
    });
  }
  function close() { if (pop) pop.classList.remove('open'); }
  function isMobile() { try { return window.matchMedia('(max-width:560px)').matches; } catch (e) { return false; } }
  function place() {
    if (isMobile() || !cur || !cur.el) return;
    var r = cur.el.getBoundingClientRect(), pr = pop.getBoundingClientRect();
    pop.style.top = (r.bottom + window.pageYOffset + 8) + 'px';
    pop.style.left = Math.max(window.pageXOffset + 12, Math.min(r.left + window.pageXOffset, window.pageXOffset + window.innerWidth - pr.width - 12)) + 'px';
  }

  function open(el) {
    ensurePop();
    var usfm = el.getAttribute('data-b'), ch = +el.getAttribute('data-c'),
        v1 = +el.getAttribute('data-v'), v2 = +(el.getAttribute('data-v2') || el.getAttribute('data-v'));
    cur = { usfm: usfm, ch: ch, v1: v1, v2: v2, el: el };
    elRef.textContent = el.textContent.replace(/^\(|\)$/g, '');
    var osis = OSIS[usfm] || usfm;
    elStep.href = 'https://www.stepbible.org/?q=reference=' + osis + '.' + ch + '.' + v1 + (v2 > v1 ? '-' + v2 : '');
    elTog.className = 'vpop-tog show';                 // every book has an original (Greek NT / Hebrew OT)
    elTog.querySelector('button[data-m="gk"]').textContent = origLabel(usfm);
    render();
    pop.classList.add('open'); place();
  }

  function setMode(m) {
    mode = m;
    [].forEach.call(elTog.querySelectorAll('button'), function (b) { b.className = b.getAttribute('data-m') === m ? 'on' : ''; });
    render();
    place();
  }

  function render() {
    var enOn = mode === 'en';
    elTxt.style.display = enOn ? '' : 'none';
    elGk.className = 'vpop-gk' + (enOn ? '' : ' show');
    if (enOn) {
      elSrc.textContent = 'Berean Standard Bible · public domain';
      elStep.textContent = 'Full study on STEP →';
      elTxt.textContent = '…';
      var c = cur;
      loadBook(c.usfm).then(function (data) {
        if (!cur || cur !== c) return;
        var parts = [];
        for (var v = c.v1; v <= c.v2; v++) { var t = data[c.ch + '.' + v]; if (t) parts.push((c.v2 > c.v1 ? '<span class="vn">' + v + '</span>' : '') + esc(t)); }
        elTxt.innerHTML = parts.length ? parts.join(' ') : 'Verse text unavailable.'; place();
      });
    } else {
      var lang = origLang(cur.usfm), rtl = lang === 'hbo';
      elSrc.textContent = origLabel(cur.usfm) + ': STEPBible / Tyndale House · CC BY';
      elStep.textContent = 'Full study on STEP →';
      elGk.innerHTML = '<span style="font-size:12px;color:#8a94a3">Loading…</span>';
      curWords = []; var c2 = cur;
      loadOrig(c2.usfm, c2.ch).then(function (data) {
        if (!cur || cur !== c2 || mode !== 'gk') return;
        var html = '', gi = 0; curWords = [];
        for (var v = c2.v1; v <= c2.v2; v++) {
          var ws = data[v]; if (!ws) continue;
          if (c2.v2 > c2.v1) html += '<div class="vpop-vlabel">verse ' + v + '</div>';
          html += '<div class="vpop-words"' + (rtl ? ' dir="rtl"' : '') + '>';
          for (var i = 0; i < ws.length; i++) {
            var w = ws[i]; curWords.push(w);
            html += '<button class="vw" type="button" data-i="' + gi + '"><span class="vwg">' + esc(w[0]) + '</span><span class="vwt">' + esc(w[1]) + '</span><span class="vwm">' + esc(w[2]) + '</span></button>';
            gi++;
          }
          html += '</div>';
        }
        elGk.innerHTML = (html || '<span style="font-size:12px;color:#8a94a3">Not available for this verse.</span>') + '<div class="vpop-detail"></div>';
        elDetail = elGk.querySelector('.vpop-detail');
        if (curWords.length) selectWord(0, elGk.querySelector('.vw'));
        place();
      });
    }
  }

  function selectWord(i, node) {
    var w = curWords[i]; if (!w) return;
    [].forEach.call(elGk.querySelectorAll('.vw'), function (b) { b.className = 'vw'; });
    if (node) node.className = 'vw sel';
    var morph = decode(w[5], cur ? origLang(cur.usfm) : 'grc');
    elDetail.innerHTML = '<span class="dg">' + esc(w[0]) + '</span><span class="dt"> · ' + esc(w[1]) + '</span> — ' + esc(w[4] || w[2]) +
      '<br><span class="dm">from ' + esc(w[3]) + (morph ? ' · ' + esc(morph) : '') + '</span>';
  }

  function wrapNode(node) {
    var text = node.nodeValue;
    if (!text || text.length < 4 || !/\d/.test(text)) return null;
    REF_RE.lastIndex = 0; var m, last = 0, frag = null;
    while ((m = REF_RE.exec(text))) {
      var usfm = TOKEN2USFM[norm(m[1])]; if (!usfm) continue;
      var ch = +m[2], v1 = +m[3]; if (!valid(usfm, ch, v1)) continue;
      if (!frag) frag = document.createDocumentFragment();
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement('a');
      a.className = 'vref'; a.setAttribute('role', 'button'); a.setAttribute('tabindex', '0');
      a.setAttribute('data-b', usfm); a.setAttribute('data-c', ch); a.setAttribute('data-v', v1);
      if (m[4]) a.setAttribute('data-v2', m[4]);
      a.textContent = m[0]; frag.appendChild(a); last = m.index + m[0].length;
    }
    if (frag && last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }

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
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue && /\d/.test(n.nodeValue) && !skip(n.parentNode)) nodes.push(n);
    for (var i = 0; i < nodes.length; i++) { var frag = wrapNode(nodes[i]); if (frag && nodes[i].parentNode) nodes[i].parentNode.replaceChild(frag, nodes[i]); }
  }

  function boot() {
    // Stable ids on essay paragraphs so the AI's citation links (/library/<slug>.html#p<N>)
    // land on the exact paragraph. Order matches build-essay-index.mjs (Nth .art-body <p>).
    // defer scripts run after the browser's initial hash scroll, so re-scroll if we arrived
    // via a #p<N> link once the ids exist.
    try {
      var ps = document.querySelectorAll('.art-body > p');
      for (var pi = 0; pi < ps.length; pi++) if (!ps[pi].id) ps[pi].id = 'p' + pi;
      if (ps.length && /^#p\d+$/.test(location.hash)) {
        var tgt = document.getElementById(location.hash.slice(1));
        if (tgt) window.scrollTo(0, Math.max(0, tgt.getBoundingClientRect().top + window.pageYOffset - 76));
      }
    } catch (e) {}
    css();
    fetch(BSB + 'index.json').then(function (r) { return r.json(); }).then(function (idx) {
      INDEX = idx; enhance(document.body);
      try {
        new MutationObserver(function (muts) {
          for (var i = 0; i < muts.length; i++) for (var j = 0; j < muts[i].addedNodes.length; j++) { var nn = muts[i].addedNodes[j]; if (nn.nodeType === 1 && !skip(nn)) enhance(nn); }
        }).observe(document.body, { childList: true, subtree: true });
      } catch (e) {}
    }).catch(function () {});
    document.addEventListener('click', function (e) {
      var v = e.target.closest ? e.target.closest('.vref') : null;
      if (v) { e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); open(v); return; }
      if (pop && pop.classList.contains('open') && !pop.contains(e.target)) close();
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('vref')) { e.preventDefault(); open(e.target); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
