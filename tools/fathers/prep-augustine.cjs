// Build fathers/_data/augustine-trinity.text.json from the CCEL extraction of Augustine, On the Trinity (NPNF1-03, 1887),
// after tools/fathers/merge-chapters.cjs has joined CCEL's chapter blocks into books:
//  - fixes the section numbering where the transcription or the 1887 printing slips (NUMBER_FIX);
//  - applies the scan-confirmed WORD corrections (CCEL transcription slips → the 1887 printing);
//  - applies the Bible-REFERENCE corrections (REF_CORR, filled from tools/fathers/check-refs.cjs);
//  - removes the stray space left before punctuation where a footnote marker was removed (whitespace only).
// Every word correction was confirmed in at least two of three independent archive.org scans of the 1887 edition
// (selectlibraryofn03auguuoft, aselectlibrary03unknuoft, 11517981bsb), read in context. Full record:
// docs/audits/fathers-augustine-copycheck-2026-11-18.md. Keys are section ids ("book.section").
// Usage: node prep-augustine.cjs <augustine-books.json> <out-text.json>
const fs = require('fs');
const [, , inPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

// Section numbering (the standard Benedictine sections, which the 1887 translation follows):
const NUMBER_FIX = [
  // Book 1: the 1887 printing (and so the transcription) prints "—23." in the middle of a paragraph of §22, so the
  // section-number parser missed it; §23 begins there ("According to the form of God, all things that the Father hath…")
  { book: 1, split: { after: 22, inPara: '--23. According to the form of God', strip: '--23. ', n: 23 }, why: 'the number is printed mid-paragraph' },
  // the 1887 printing (and so the transcription) prints "26." twice in Book 2; the second ("There is yet another difficulty") is §27
  { book: 2, renumber: { at: 'There is yet another difficulty which troubles most people', from: 26, to: 27 }, why: 'the 1887 printing prints 26 twice' },
  // the transcription prints "22.--although…" with no space, so the number was read as text; §22 begins there
  { book: 4, split: { after: 21, at: '22.--although the name of prophets', n: 22, strip: '22.--' }, why: 'the transcription runs the number into the text' },
];

const CORR = [
  // transcription slips (a word changed)
  { sec: '3.8', from: 'an arrangement and distraction of limbs', to: 'an arrangement and distinction of limbs' },
  { sec: '3.20', from: 'more difficult and more known;', to: 'more difficult and more unknown;' },
  { sec: '3.27', from: 'He is equal and eternal with the Father', to: 'He is equal and coeternal with the Father' },
  { sec: '4.21', from: 'who have profiled better', to: 'who have profited better' },
  { sec: '4.22', from: 'by theHoly Spirit', to: 'by the Holy Spirit' },
  { sec: '5.17', from: 'converted and find them; then', to: 'converted and find Him, then' },
  { sec: '6.4', from: '"that they maybe one as we', to: '"that they may be one as we' },
  { sec: '7.7', from: 'than He is altered, and exists', to: 'than He is uttered, and exists' },
  { sec: '10.9', from: 'individual corpustules', to: 'individual corpuscules' },
  { sec: '12.11', from: 'heretics or schismstics', to: 'heretics or schismatics' },
  { sec: '12.23', from: 'able to rumiuate', to: 'able to ruminate' },
  { sec: '13.14', from: 'His love towards as,', to: 'His love towards us,' },
  { sec: '14.22', from: 'as in the former passages "In righteousness', to: 'as in the former passage "In righteousness' },
  { sec: '15.13', from: 'yet by all unstable knowledge', to: 'yet by an unstable knowledge' },
  { sec: '15.33', from: 'but whose shall drink', to: 'but whoso shall drink' },
  // words the transcription dropped (found by tools/fathers/check-dropped-words.cjs; all three scans)
  { sec: '3.6', from: '"For the creature serveth Thee', to: '"For the creature that serveth Thee' },
  { sec: '4.12', from: 'He might have said, and they are, not one thing', to: 'He might have said, I and they are, not one thing' },
  // the opening words of three books, printed in capitals in 1887, run together or left capitalised by the transcription
  { sec: '3.1', from: 'I Would have them believe', to: 'I would have them believe' },
  { sec: '4.1', from: 'Theknowledge of things', to: 'The knowledge of things' },
  { sec: '6.1', from: 'Somethink themselves', to: 'Some think themselves' },
  // a misprint in the 1887 printing itself (all three scans), which the transcription follows; corrected
  { sec: '4.4', from: 'necessity of comdemnation', to: 'necessity of condemnation', misprint: true },
  // modernised spellings (the 1887 printing has the older form)
  { sec: '1.2', from: '"Thou shall change them', to: '"Thou shalt change them' },
  { sec: '2.19', from: 'Him only shall thou serve', to: 'Him only shalt thou serve' },
  { sec: '5.3', from: '"Thus shall thou say', to: '"Thus shalt thou say' },
  { sec: '10.9', from: '"Thou shall love the Lord', to: '"Thou shalt love the Lord' },
  { sec: '13.16', from: 'unto dust thou shall return', to: 'unto dust thou shalt return' },
  { sec: '15.26', from: 'from one thing to another, but', to: 'from one thing to an other, but' },
  { sec: '15.38', from: 'by which he begot the Son', to: 'by which he begat the Son' },
];
// The 1887 printing itself misprints two words that the transcription silently corrects (all three scans):
const PRINTER_ERRORS = [
  { sec: '13.11', printed: 'they do no will', hosted: 'they do not will' },
  { sec: '15.21', printed: 'any number he choses', hosted: 'any number he chooses' },
];
// Each was checked against the verse wording (tools/fathers/check-refs.cjs) and looked for in the scans' printed footnotes.
const LAT_V = 'the 1887 edition gives the Latin (Vulgate) verse number; English Bibles number it';
const REF_CORR = [
  { sec: '1.17', from: 'Psalm 5:5', to: 'Psalm 5:3', why: `${LAT_V} 5:3 ("In the morning will I direct my prayer unto thee")` },
  { sec: '1.23', from: 'John 17:15', to: 'John 16:15', why: 'misprinted in the 1887 edition ("All things that the Father hath are mine")' },
  { sec: '1.31', from: 'Psalm 31:21', to: 'Psalm 31:20', why: `${LAT_V} 31:20 ("from the strife of tongues")` },
  { sec: '2.33', from: 'Psalm 8:8', to: 'Psalm 8:6', why: `${LAT_V} 8:6 ("thou hast put all things under his feet")` },
  { sec: '4.6', from: 'Psalm 15:3', to: 'Psalm 15:2', why: `${LAT_V} 15:2 ("speaketh the truth in his heart")` },
  { sec: '7.4', from: 'John 5:2', to: 'John 5:26', why: 'wrong as the transcription gives it; the scans\' footnote was not located ("as the Father hath life in himself")' },
  { sec: '8.10', from: '1 John 4:6', to: '1 John 4:16', why: 'misprinted in the 1887 edition ("God is love; and he that dwelleth in love dwelleth in God")' },
  { sec: '13.24', from: 'Romans 1:23', to: 'Romans 1:18', why: 'the 1887 edition prints the two footnotes here in each other\'s place ("hold the truth in unrighteousness")' },
  { sec: '13.24', from: 'Romans 1:18', to: 'Romans 1:23', why: 'the 1887 edition prints the two footnotes here in each other\'s place ("an image made like to corruptible man")' },
  { sec: '14.6', from: 'Psalm 39:7', to: 'Psalm 39:6', why: `${LAT_V} 39:6 ("he heapeth up riches, and knoweth not who shall gather them")` },
  { sec: '14.25', from: 'John 3:2', to: '1 John 3:2', why: 'wrong as the transcription gives it, which drops the "1" ("we shall see him as he is")' },
  { sec: '15.21', from: '1 John 3:4', to: '1 John 3:2', why: 'misprinted in the 1887 edition ("we shall see him as he is")' },
  { sec: '15.45', from: 'John 20:23', to: 'John 20:22', why: 'misprinted in the 1887 edition ("he breathed on them, and saith unto them, Receive ye the Holy Ghost")' },
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

// numbering
for (const f of NUMBER_FIX) {
  const B = J.orations.find((o) => o.n === f.book);
  if (f.split) {
    const i = B.sections.findIndex((s) => s.n === f.split.after); const S = B.sections[i];
    let moved;
    if (f.split.inPara) {
      const k = S.paras.findIndex((p) => p.includes(f.split.inPara)); if (k < 0) throw new Error(`split ${f.book}.${f.split.after}: not found`);
      const p = S.paras[k]; const j = p.indexOf(f.split.inPara);
      moved = [p.slice(j + f.split.strip.length), ...S.paras.slice(k + 1)];
      S.paras = [...S.paras.slice(0, k), p.slice(0, j).replace(/\s+$/, '')];
    } else {
      const k = S.paras.findIndex((p) => p.startsWith(f.split.at)); if (k < 1) throw new Error(`split ${f.book}.${f.split.after}: not found`);
      moved = S.paras.splice(k); if (f.split.strip) moved[0] = moved[0].slice(f.split.strip.length).replace(/^\s+/, '');
    }
    B.sections.splice(i + 1, 0, { n: f.split.n, paras: moved });
  } else {
    const S = B.sections.filter((s) => s.n === f.renumber.from && s.paras[0].startsWith(f.renumber.at));
    if (S.length !== 1) throw new Error(`renumber ${f.book}: ${S.length}`); S[0].n = f.renumber.to;
  }
  f.done = true;
}

const parts = [];
for (const o of J.orations) {
  const sections = o.sections.map((s) => ({ n: s.n, paras: s.paras.slice() }));
  for (const s of sections) {
    const key = `${o.n}.${s.n}`;
    for (const c of CORR.filter((c) => c.sec === key)) {
      const hits = s.paras.reduce((a, p) => a + p.split(c.from).length - 1, 0);
      if (hits !== 1) throw new Error(`word correction ${key} "${c.from}" matched ${hits}`);
      s.paras = s.paras.map((p) => p.split(c.from).join(c.to)); c.done = true;
    }
    s.paras = s.paras.map(toSegs);
    // resolve every reference correction for the section first, then apply them (so two references can be swapped)
    const todo = [];
    for (const c of REF_CORR.filter((c) => c.sec === key)) {
      const hits = [];
      for (const p of s.paras) for (const x of p) if (typeof x !== 'string') { const k = x.ref.split('; ').indexOf(c.from); if (k >= 0) hits.push([x, k]); }
      if (hits.length !== 1) throw new Error(`ref correction ${key} "${c.from}" matched ${hits.length}`);
      todo.push([...hits[0], c]);
    }
    for (const [x, k, c] of todo) { const parts2 = x.ref.split('; '); parts2[k] = c.to; x.ref = parts2.join('; '); c.done = true; }
  }
  parts.push({ n: o.n, title: `On the Trinity, Book ${ROMAN[o.n]}`, sections });
}
for (const c of [...NUMBER_FIX, ...CORR, ...REF_CORR]) if (!c.done) throw new Error('not applied: ' + JSON.stringify(c));
for (const p of parts) p.sections.forEach((s, i) => { if (s.n !== i + 1) throw new Error(`numbering gap in ${p.n} at ${s.n}`); });
const strip = (a) => a.map(({ done, ...c }) => c);
fs.writeFileSync(outPath, JSON.stringify({ parts, numberFixes: strip(NUMBER_FIX), corrections: strip(CORR), printerErrors: PRINTER_ERRORS, refCorrections: strip(REF_CORR) }, null, 1) + '\n');
console.log(parts.map((p) => `${p.n}: ${p.sections.length}`).join(' | '), `| corrections ${CORR.length}`);
