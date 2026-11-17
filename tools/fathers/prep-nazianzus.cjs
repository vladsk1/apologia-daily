// Build fathers/_data/nazianzus-orations.text.json from the CCEL extraction:
//  - supplies the missing section-18 numeral in Oration 29 (no numeral in the 1894 printing);
//  - applies the scan-confirmed WORD corrections (CCEL slips → the 1894 printing);
//  - applies the Bible-REFERENCE corrections (1894 misprints and one transcription slip);
//  - removes the stray space left before punctuation where a footnote marker was removed
//    (whitespace only — no word changes).
// Usage: node prep-nazianzus.cjs <ccel-orations.json> <out-text.json>
const fs = require('fs');
const [, , inPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(inPath, 'utf8'));

const TITLES = {
  27: { title: 'The First Theological Oration', subtitle: 'A Preliminary Discourse Against the Eunomians' },
  28: { title: 'The Second Theological Oration' },
  29: { title: 'The Third Theological Oration', subtitle: 'On the Son' },
  30: { title: 'The Fourth Theological Oration', subtitle: 'Which is the Second Concerning the Son' },
  31: { title: 'The Fifth Theological Oration', subtitle: 'On the Holy Spirit' },
};
// Word corrections: CCEL transcription → the 1894 printing. Each confirmed in two independent scans
// (archive.org selectlibraryofn07schauoft and selectlibraryof07scha). Keys are FINAL section numbers.
const CORR = [
  { sec: '27.9', from: "spider's web, if it were", to: "spider's web, as if it were" },
  { sec: '28.6', from: 'the deep thing of God', to: 'the deep things of God' },
  { sec: '29.13', from: 'Their assertion, then, that which', to: 'Their assertion, then, that that which' },
  { sec: '29.18', from: 'letter be cleaned away', to: 'letter be cleansed away' },
];
// Bible-reference corrections. References are the 1894 editors' identifications, not Gregory's words.
const REF_CORR = [
  { sec: '29.17', from: 'John 7:12', to: 'John 8:12', why: 'misprinted in the 1894 edition ("I am the Light of the World")' },
  { sec: '29.19', from: 'Luke 2:41', to: 'Luke 2:7', why: 'misprinted in the 1894 edition (the swaddling clothes)' },
  { sec: '29.20', from: 'Isaiah 53:23', to: 'Matthew 4:23', why: 'misprinted in the 1894 edition, which gives a verse that does not exist ("He healeth every disease and every infirmity")' },
  { sec: '30.2', from: 'Psalm 14:7', to: 'Psalm 45:7', why: 'a transcription slip; the 1894 edition correctly reads Ps. xlv. 7' },
  { sec: '30.16', from: 'Luke 12:44', to: 'Luke 22:44', why: 'misprinted in the 1894 edition (the Agony and Bloody Sweat)' },
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
    ? s.replace(/--/g, '—').replace(/\s+/g, ' ').replace(/(\w) ([,;:.!?])(?=\s|$)/g, '$1$2').replace(/^ ([,;:.!?])/, '$1')
    : s));
}

const parts = [];
for (const o of J.orations) {
  let sections = [];
  for (const s of o.sections) {
    if (o.n === 29 && s.n === 17) {
      const i = s.paras.findIndex((p) => p.startsWith('But in opposition to all these'));
      if (i < 1) throw new Error('29.18 split point not found');
      sections.push({ n: 17, paras: s.paras.slice(0, i) });
      sections.push({ n: 18, supplied: true, paras: s.paras.slice(i) });
    } else sections.push({ n: s.n, paras: s.paras.slice() });
  }
  for (const s of sections) {
    const key = `${o.n}.${s.n}`;
    for (const c of CORR.filter((c) => c.sec === key)) {
      const hits = s.paras.filter((p) => p.includes(c.from)).length;
      if (hits !== 1) throw new Error(`word correction ${key} "${c.from}" matched ${hits}`);
      s.paras = s.paras.map((p) => p.replace(c.from, c.to)); c.done = true;
    }
    s.paras = s.paras.map(toSegs);
    for (const c of REF_CORR.filter((c) => c.sec === key)) {
      let hits = 0;
      for (const p of s.paras) for (const x of p) if (typeof x !== 'string') {
        const parts2 = x.ref.split('; ');
        const k = parts2.indexOf(c.from); if (k >= 0) { parts2[k] = c.to; x.ref = parts2.join('; '); hits++; }
      }
      if (hits !== 1) throw new Error(`ref correction ${key} "${c.from}" matched ${hits}`);
      c.done = true;
    }
  }
  parts.push({ n: o.n, ...TITLES[o.n], sections });
}
for (const c of [...CORR, ...REF_CORR]) if (!c.done) throw new Error('not applied: ' + JSON.stringify(c));
for (const p of parts) p.sections.forEach((s, i) => { if (s.n !== i + 1) throw new Error(`numbering gap in ${p.n} at ${s.n}`); });
const strip = (a) => a.map(({ done, ...c }) => c);
fs.writeFileSync(outPath, JSON.stringify({ parts, corrections: strip(CORR), refCorrections: strip(REF_CORR) }, null, 1) + '\n');
console.log(parts.map((p) => `${p.n}: ${p.sections.length}`).join(' | '));
