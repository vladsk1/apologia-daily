// Build fathers/_data/athanasius-arians.text.json from the CCEL extraction of Athanasius, Four Discourses against the
// Arians, Discourses I–III (NPNF2-04, 1892; Newman's translation revised by Robertson). Steps:
//  - joins CCEL's chapter blocks into the three Discourses (the chapter titles are Newman's headings, which are dropped;
//    a chapter that begins in the middle of a section carries the marker "N (continued)." which is removed);
//  - removes the translator's secondary numbering "(3.)" … "(12.)" printed inside 1.55–1.62 (rule 1);
//  - restores the opening single quotation marks that the transcription lost (tools/fathers/athanasius-quotes.json);
//  - applies the scan-confirmed WORD corrections (CCEL transcription slips → the 1892 printing);
//  - applies the Bible-REFERENCE corrections (REF_CORR, from tools/fathers/check-refs.cjs);
//  - closes up the stray spaces left where footnote markers were removed (whitespace only).
// Every correction was confirmed in at least two of the archive.org scans of the 1892 volume
// (niceneandpostnic04unknuoft, selectlibraryofn04schauoft, selectlibraryofn04scha, cu31924096463454,
// selectlibraryofn0004henr), read in context. Full record: docs/audits/fathers-athanasius-copycheck-2026-11-20.md.
// Usage: node prep-athanasius.cjs <raw-extract.json> <out-text.json>
const fs = require('fs');
const path = require('path');
const [, , inPath, outPath] = process.argv;
const R = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'athanasius-map.json'), 'utf8'));
const QUOTES = JSON.parse(fs.readFileSync(path.join(__dirname, 'athanasius-quotes.json'), 'utf8'));
const ROMAN = ['', 'I', 'II', 'III'];

// 1. join the chapter blocks into Discourses
const books = new Map();
for (const o of R.orations) {
  const m = MAP.find((x) => x.k === o.n); if (!m) throw new Error('no map for chapter ' + o.n);
  if (!/^Chapter [IVXL]+\.--/.test(o.heads[0] || '')) throw new Error(`chapter ${o.n}: first head is not a chapter title`);
  const b = books.get(m.book) || { n: m.book, sections: [] }; books.set(m.book, b);
  for (let p of o.heads.slice(1)) {
    const last = b.sections[b.sections.length - 1]; if (!last) throw new Error(`chapter ${o.n}: text before the first section`);
    const c = p.match(/^(\d+) \(continued\)\. /);
    if (c) { if (+c[1] !== last.n) throw new Error(`chapter ${o.n}: "${c[1]} (continued)" after section ${last.n}`); p = p.slice(c[0].length); }
    last.paras.push(p);
  }
  const secs = o.sections.map((s) => ({ n: s.n, paras: s.paras.slice() }));
  const last = b.sections[b.sections.length - 1];
  if (secs.length && last && secs[0].n === last.n) {
    if (!/^\(continued\)\. /.test(secs[0].paras[0])) throw new Error(`chapter ${o.n}: section ${last.n} repeated without "(continued)"`);
    secs[0].paras[0] = secs[0].paras[0].replace(/^\(continued\)\. /, '');
    last.paras.push(...secs.shift().paras);
  }
  b.sections.push(...secs);
}
const D = [...books.values()].sort((a, b) => a.n - b.n);

// 2. opening quotation marks (positions measured on the joined text, before any other change)
const sec = (key) => { const [b, n] = key.split('.').map(Number); return D.find((x) => x.n === b).sections.find((x) => x.n === n); };
const byPara = new Map();
for (const q of QUOTES) { const k = `${q.sec}|${q.pi}`; if (!byPara.has(k)) byPara.set(k, []); byPara.get(k).push(q); }
for (const [k, list] of byPara) {
  const [key, pi] = k.split('|'); const S = sec(key); let p = S.paras[+pi];
  // check every position against the untouched paragraph first, then insert from the end backwards
  for (const q of list) if (p.slice(q.at, q.at + q.w.length) !== q.w) throw new Error(`quote ${q.sec} p${q.pi} @${q.at}: expected "${q.w}", found "${p.slice(q.at, q.at + q.w.length)}"`);
  for (const q of list.sort((a, b) => b.at - a.at)) p = p.slice(0, q.at) + "'" + p.slice(q.at);
  S.paras[+pi] = p;
}

// 3. the translator's secondary numbering inside Discourse I §§55–62
let subnums = 0;
// (3.)–(12.); the transcription prints the seventh as "(7)." with the full stop outside the bracket (1.59)
for (const s of D[0].sections) if (s.n >= 55 && s.n <= 62) s.paras = s.paras.map((p) => p.replace(/(^|\s)\((\d{1,2})(?:\.\)|\)\.) /g, (x, a) => { subnums++; return a; }));
if (subnums !== 10) throw new Error('secondary numbering: expected 10, removed ' + subnums);

// 4. word corrections
const CORR = [
  // transcription slips (a word changed)
  { sec: '1.3', from: 'or as Simonians; and other, Cataphrygians', to: 'or as Simonians; and others, Cataphrygians' },
  { sec: '1.30', from: 'forthwith they spirit out their own venom', to: 'forthwith they spirt out their own venom' },
  { sec: '1.50', from: 'the Word Himself, hast spoken of Himself', to: 'the Word Himself, had spoken of Himself' },
  { sec: '2.27', from: 'not one only, but man out of their whole number', to: 'not one only, but many out of their whole number' },
  { sec: '2.32', from: "which says, 'This it My Son", to: "which says, 'This is My Son" },
  { sec: '2.36', from: 'such daring recurs a sentence', to: 'such daring incurs a sentence' },
  { sec: '3.10', from: "among the sons of Gods", to: 'among the sons of God' },
  { sec: '3.57', from: 'by that so-called tenor renders', to: 'by that so-called terror renders' },
  // a word the transcription dropped (all scans)
  { sec: '1.19', from: 'through whom are things, one of that', to: 'through whom are all things, one of that' },
  // modernised spellings (the 1892 printing has the older form)
  { sec: '1.45', from: 'moreover he may show that it', to: 'moreover he may shew that it' },
  { sec: '1.46', from: 'saying this He has shown that', to: 'saying this He has shewn that' },
  { sec: '1.51', from: 'in the Psalm, show, as again', to: 'in the Psalm, shew, as again' },
  { sec: '1.58', from: "greater' He again shows that", to: "greater' He again shews that" },
  { sec: '1.59', from: 'he wished to show that He', to: 'he wished to shew that He' },
  { sec: '3.11', from: 'will not be shown to have', to: 'will not be shewn to have' },
  { sec: '3.15', from: 'as the illustration shows', to: 'as the illustration shews' },
  { sec: '3.42', from: 'and being stupefied', to: 'and being stupified' },
];
// The 1892 printing misprints one word that the transcription silently corrects (all five scans):
const PRINTER_ERRORS = [{ sec: '1.38', printed: 'deifed men', hosted: 'deified men' }];
// Each was checked against the verse wording (tools/fathers/check-refs.cjs: every reference with no word in common with
// its verse was read by hand, and every Psalm reference was tested against the neighbouring verses) and looked for in the
// scans' printed footnotes.
const GK_V = 'the 1892 edition numbers the verse as the Greek and Hebrew Psalter do, counting the title; English Bibles number it';
const REF_CORR = [
  { sec: '1.36', from: 'Psalm 102:26–28', to: 'Psalm 102:25–27', why: `${GK_V} 102:25–27 ("Thou art the same, and Thy years shall not fail")` },
  { sec: '1.57', from: 'Psalm 89:7', to: 'Psalm 89:6', why: `${GK_V} 89:6 ("who … shall be like unto the Lord")` },
  { sec: '1.62', from: 'Psalm 30:3', to: 'Psalm 31:2', why: 'the 1892 edition gives the Greek (Septuagint) psalm number; English Bibles number it 31:2 ("be thou my strong rock, for an house of defence to save me")' },
  { sec: '2.6', from: 'Psalm 145:14', to: 'Psalm 145:13', why: 'the line "The Lord is faithful in all His words" is 145:13 in the Bibles that print it (it is in the Greek Psalter and the Dead Sea Psalms scroll)' },
  { sec: '2.31', from: 'Psalm 168:5', to: 'Psalm 148:5', why: 'there is no Psalm 168 ("He commanded, and they were created")' },
  { sec: '2.46', from: 'Psalm 51:12', to: 'Psalm 51:10', why: `${GK_V} 51:10 ("Create in me a clean heart, O God")` },
  { sec: '2.66', from: 'Psalm 22:32', to: 'Psalm 22:31', why: `${GK_V} 22:31 ("unto a people that shall be born")` },
  { sec: '2.71', from: '1 Corinthians 8:9', to: '1 Corinthians 8:6', why: 'wrong as the transcription gives it ("one Lord Jesus Christ, by whom are all things")' },
  { sec: '2.81', from: '1 John 8:27', to: 'Proverbs 8:27', why: 'wrong as the transcription gives it; the 1892 footnote reads "Prov. viii. 27" ("When he prepared the heavens, I was there")' },
  { sec: '3.17', from: 'John 8:44', to: 'John 17:22', why: 'the 1892 footnote reads "John viii. 44", which does not fit the words quoted ("that they may be one, even as we are one")' },
  { sec: '3.59', from: 'Philippians 2:26', to: 'Philippians 2:6', why: 'wrong as the transcription gives it ("Who, being in the form of God")' },
];

function toSegs(p) {
  const segs = []; let rest = p;
  const re = /\s*\u0001REF([^\u0002]*)\u0002/;
  for (;;) {
    const m = rest.match(re); if (!m) { if (rest) segs.push(rest); break; }
    const before = rest.slice(0, m.index); if (before) segs.push(before);
    segs.push({ ref: m[1] }); rest = rest.slice(m.index + m[0].length);
  }
  return segs.map((s) => (typeof s === 'string'
    ? s.replace(/--/g, '—').replace(/\s+/g, ' ')
      .replace(/([\w'?!.)]) ([,;:.!?])(?=[\s')]|$)/g, '$1$2').replace(/^ ([,;:.!?'])(?=[\s,;:.!?'")]|$)/, '$1')
      .replace(/(\w) '(?=[\s,;:.!?)]|$)/g, "$1'").replace(/\( /g, '(').replace(/ \)/g, ')')
    : s));
}

const parts = [];
for (const o of D) {
  const sections = o.sections.map((s) => ({ n: s.n, paras: s.paras.slice() }));
  for (const s of sections) {
    const key = `${o.n}.${s.n}`;
    for (const c of CORR.filter((c) => c.sec === key)) {
      const hits = s.paras.reduce((a, p) => a + p.split(c.from).length - 1, 0);
      if (hits !== 1) throw new Error(`word correction ${key} "${c.from}" matched ${hits}`);
      s.paras = s.paras.map((p) => p.split(c.from).join(c.to)); c.done = true;
    }
    s.paras = s.paras.map(toSegs);
    const todo = [];
    for (const c of REF_CORR.filter((c) => c.sec === key)) {
      const hits = [];
      for (const p of s.paras) for (const x of p) if (typeof x !== 'string') { const k = x.ref.split('; ').indexOf(c.from); if (k >= 0) hits.push([x, k]); }
      if (hits.length !== 1) throw new Error(`ref correction ${key} "${c.from}" matched ${hits.length}`);
      todo.push([...hits[0], c]);
    }
    for (const [x, k, c] of todo) { const r = x.ref.split('; '); r[k] = c.to; x.ref = r.join('; '); c.done = true; }
  }
  parts.push({ n: o.n, title: `Against the Arians, Discourse ${ROMAN[o.n]}`, sections });
}
for (const c of [...CORR, ...REF_CORR]) if (!c.done) throw new Error('not applied: ' + JSON.stringify(c));
for (const p of parts) p.sections.forEach((s, i) => { if (s.n !== i + 1) throw new Error(`numbering gap in ${p.n} at ${s.n}`); });
const strip = (a) => a.map(({ done, ...c }) => c);
fs.writeFileSync(outPath, JSON.stringify({ parts, quotesRestored: QUOTES.length, secondaryNumbersRemoved: subnums, corrections: strip(CORR), printerErrors: PRINTER_ERRORS, refCorrections: strip(REF_CORR) }, null, 1) + '\n');
console.log(parts.map((p) => `${p.n}: ${p.sections.length}`).join(' | '), `| quotes ${QUOTES.length} | corrections ${CORR.length}`);
