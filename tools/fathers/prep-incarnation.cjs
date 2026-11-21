// Build fathers/_data/athanasius-incarnation.text.json from the CCEL extraction of Athanasius, On the Incarnation of the
// Word (NPNF2-04, 1892; Archibald Robertson's translation). Steps:
//  - each CCEL block is one numbered section (§1–§57); its first paragraph is Robertson's summary heading, which is
//    dropped (rule 1). §5 has no heading: its first paragraph is Athanasius's text and is kept;
//  - the small numbers inside each section ("2.", "3." …) are the 1892 printing's subdivisions, used when citing the work
//    (e.g. 54.3); they are numbering, not words, and are kept as printed;
//  - applies the scan-confirmed WORD corrections (CCEL transcription slips → the 1892 printing);
//  - closes up the stray spaces left where footnote markers were removed (whitespace only).
// Every correction was confirmed in all four archive.org scans of the 1892 volume (niceneandpostnic04unknuoft,
// selectlibraryofn04schauoft, selectlibraryofn04scha, cu31924096463454), read in context.
// Full record: docs/audits/fathers-incarnation-copycheck-2026-11-22.md.
// Extraction: node tools/fathers/extract-ccel.cjs npnf204.txt raw.json tools/fathers/incarnation-config.json
// Usage: node prep-incarnation.cjs <raw-extract.json> <out-text.json>
const fs = require('fs');
const [, , inPath, outPath] = process.argv;
const R = JSON.parse(fs.readFileSync(inPath, 'utf8'));

// 1. sections, with Robertson's headings dropped
const sections = [];
for (const o of R.orations) {
  if (o.sections.length) throw new Error(`block ${o.n}: unexpected numbered paragraphs`);
  const h = o.heads.slice(); const m = (h[0] || '').match(/^§(\d+)\.\s*/);
  if (!m || +m[1] !== o.n) throw new Error(`block ${o.n}: does not open with "§${o.n}."`);
  const paras = o.n === 5 ? [h[0].slice(m[0].length), ...h.slice(1)] : h.slice(1);
  if (!paras.length) throw new Error(`block ${o.n}: no text after the heading`);
  sections.push({ n: o.n, paras });
}
const headingsRemoved = sections.length - 1;

// 2. word corrections
const CORR = [
  // transcription slips (a word changed)
  { sec: '39', from: 'prophets were prophesying: God and Asaph', to: 'prophets were prophesying: Gad and Asaph' },
  { sec: '46', from: 'save since the Lord erected His conquest', to: 'save since the Lord effected His conquest' },
  { sec: '48', from: 'all whom even themselves bold to be gods', to: 'all whom even themselves hold to be gods' },
  { sec: '54', from: 'being impossible and incorruptible', to: 'being impassible and incorruptible' },
  // modernised spellings (the 1892 printing has the older form)
  { sec: '10', from: 'He might bring to naught Him', to: 'He might bring to nought Him' },
  { sec: '13', from: 'his own work be spent for naught', to: 'his own work be spent for nought' },
  { sec: '30', from: 'death has been brought to naught', to: 'death has been brought to nought' },
  { sec: '34', from: 'he hath been evilly entreated', to: 'he hath been evilly intreated' },
  { sec: '41', from: 'if they show themselves friends', to: 'if they shew themselves friends' },
];
// Bible-reference corrections (tools/fathers/check-refs.cjs: every reference with no word in common with its verse was
// read by hand against the words that follow it, and every Psalm number was checked against the English numbering).
const REF_CORR = [
  { sec: '6', from: 'Genesis 2:15', to: 'Genesis 2:17', why: 'the 1892 footnote reads "Gen. ii. 15" (Adam placed in the garden), which does not fit the words; the law of death that Athanasius means is 2:17 ("in the day that thou eatest thereof thou shalt surely die"), the verse he quotes in §3' },
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
      .replace(/([\w'"?!.)]) ([,;:.!?])(?=[\s'")]|$)/g, '$1$2').replace(/^ ([,;:.!?'"])(?=[\s,;:.!?'")]|$)/, '$1')
      .replace(/\( /g, '(').replace(/ \)/g, ')')
    : s));
}

for (const s of sections) {
  for (const c of CORR.filter((c) => c.sec === String(s.n))) {
    const hits = s.paras.reduce((a, p) => a + p.split(c.from).length - 1, 0);
    if (hits !== 1) throw new Error(`word correction ${c.sec} "${c.from}" matched ${hits}`);
    s.paras = s.paras.map((p) => p.split(c.from).join(c.to)); c.done = true;
  }
  s.paras = s.paras.map(toSegs);
  for (const c of REF_CORR.filter((c) => c.sec === String(s.n))) {
    const hits = [];
    for (const p of s.paras) for (const x of p) if (typeof x !== 'string') { const k = x.ref.split('; ').indexOf(c.from); if (k >= 0) hits.push([x, k]); }
    if (hits.length !== 1) throw new Error(`ref correction ${c.sec} "${c.from}" matched ${hits.length}`);
    const [x, k] = hits[0]; const r = x.ref.split('; '); r[k] = c.to; x.ref = r.join('; '); c.done = true;
  }
}
for (const c of [...CORR, ...REF_CORR]) if (!c.done) throw new Error('not applied: ' + JSON.stringify(c));
sections.forEach((s, i) => { if (s.n !== i + 1) throw new Error(`numbering gap at ${s.n}`); });
const parts = [{ n: 1, title: 'On the Incarnation of the Word', sections }];
const strip = (a) => a.map(({ done, ...c }) => c);
fs.writeFileSync(outPath, JSON.stringify({ parts, headingsRemoved, corrections: strip(CORR), printerErrors: [], refCorrections: strip(REF_CORR) }, null, 1) + '\n');
console.log(`${sections.length} sections | headings removed ${headingsRemoved} | corrections ${CORR.length}`);
