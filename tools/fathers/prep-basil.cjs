// Build fathers/_data/basil-spirit.text.json from the CCEL extraction of Basil, On the Holy Spirit (NPNF2-08, 1895):
//  - applies the scan-confirmed WORD corrections (CCEL transcription slips and dropped words → the 1895 printing);
//  - restores the Greek the 1895 printing gives in Greek type, which the transcription spells in Latin letters;
//  - restores the opening single quotation marks the transcription dropped;
//  - omits the translator's bracketed comparisons with the King James Version (rule 1: editors' notes are omitted);
//  - applies the Bible-REFERENCE corrections (REF_CORR, filled from tools/fathers/check-refs.cjs);
//  - removes the stray space left before punctuation where a footnote marker was removed (whitespace only).
// Every word correction was confirmed in at least two of three independent archive.org scans of the 1895 edition
// (selectlibraryofn08scha, cu31924103070102, selectlibraryofn08schauoft), read in context. Full record:
// docs/audits/fathers-basil-copycheck-2026-11-18.md. Keys are section ids ("chapter.section"; sections run 1–79 through the book).
// Usage: node prep-basil.cjs <ccel-basil.json> <out-text.json>
const fs = require('fs');
const [, , inPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX'];

const CORR = [
  // transcription slips (a word changed)
  { sec: '4.6', from: 'faithful accuracy of limitation', to: 'faithful accuracy of imitation' },
  { sec: '8.17', from: 'shall find pastare', to: 'shall find pasture' },
  { sec: '15.36', from: 'by promise hereof', to: 'by promise whereof' },
  { sec: '26.61', from: 'the Spirit of our Father which speaketh', to: 'the Spirit of your Father which speaketh' },
  { sec: '27.66', from: 'who is thence who has taught', to: 'who is there who has taught' },
  { sec: '27.66', from: 'contempt stretches to the trite', to: 'contempt attaches to the trite' },
  { sec: '29.73', from: 'The washing or water', to: 'The washing of water' },
  { sec: '30.76', from: 'blackens all the scenes so that', to: 'blackens all the scene, so that' },
  { sec: '30.79', from: 'reeking not of', to: 'recking not of' },
  // words the transcription dropped
  { sec: '14.32', from: 'they did "bear about in the body', to: 'they did not "bear about in the body' },
  { sec: '14.33', from: 'have been devised means to train', to: 'have been devised as means to train' },
  { sec: '19.48', from: 'could we get demonstrations', to: 'could we get our demonstrations' },
  { sec: '22.53', from: 'buried deep in lust of the flesh', to: 'buried deep in the lust of the flesh' },
  { sec: '26.62', from: 'behold there is place by me', to: 'behold there is a place by me' },
  { sec: '27.66', from: 'bruited abroad random', to: 'bruited abroad at random' },
  { sec: '29.73', from: 'frequently impels men to express', to: 'frequently impels the men to express' },
  // a stray caret where the 1895 printing has a footnote number
  { sec: '5.10', from: '^ Isaiah, moreover', to: 'Isaiah, moreover' },
  // the transcription prints "sub-numeration"; the 1895 text prints "subnumeration" (the hyphen appears only in a chapter heading)
  ...['17.41', '17.42', '17.43', '18.47'].map((sec) => ({ sec, from: 'sub-numeration', to: 'subnumeration', all: true })),
  // Greek printed in Greek type in 1895, spelled in Latin letters by the transcription
  { sec: '5.9', from: 'by (ek) the', to: 'by (ἐκ) the' },
  { sec: '5.10', from: "(di' ou)", to: "(δι' οὗ)" },
  { sec: '5.10', from: '(dia)', to: '(διά)', all: true },
  { sec: '5.11', from: '(en)', to: '(ἐν)', all: true },
  { sec: '27.66', from: 'Grk. anastasis', to: 'Grk. ἀνάστασις' },
  // opening single quotation marks the transcription dropped
  { sec: '2.4', from: "the term of whom' is unlike the term by whom,'", to: "the term 'of whom' is unlike the term 'by whom,'" },
  { sec: '18.46', from: "styled Spirit of Christ,'", to: "styled 'Spirit of Christ,'" },
  { sec: '18.46', from: "free will ab extra'", to: "free will 'ab extra'" },
  { sec: '21.52', from: "said, the Lord direct you into His own love,'", to: "said, 'the Lord direct you into His own love,'" },
  { sec: '21.52', from: "added into His own patience.'", to: "added 'into His own patience.'" },
];
// Rule 1 (editors' notes omitted): the translator's bracketed comparisons with the King James Version ("[by, A.V.]")
// and one with the Greek Old Testament ("[lxx., known]") are editorial notes printed inside the text, not Basil's words
// and not words supplied to make the sense run, so they are omitted. Brackets that render a word ("[the Father's]",
// "[the Spirit]", "[or in]", "[or by]") are the translation and are kept.
const OMIT = [
  { sec: '5.7', from: ' [lxx., known]' },
  { sec: '5.12', from: ' (A.V., "of" instead of "through a woman")' },
  { sec: '5.12', from: ' [A.V., of]' },
  { sec: '5.12', from: ' [A.V., by]' },
  { sec: '8.18', from: ' ["by" A.V.]' },
  { sec: '8.19', from: ' [by, A.V.]', all: true },
  { sec: '8.19', from: ' [can, A.V.]' },
  { sec: '8.19', from: ' [by whom, A.V.]' },
];
// The 1895 printing itself misprints two words that the transcription silently corrects ("trangressors" 11.27,
// "partriarchs" 16.39, in all three scans). The hosted text keeps the corrected spelling; both are listed here
// and on the book page.
const PRINTER_ERRORS = [
  { sec: '11.27', printed: 'trangressors', hosted: 'transgressors' },
  { sec: '16.39', printed: 'partriarchs', hosted: 'patriarchs' },
];

// Each was checked against the verse wording (tools/fathers/check-refs.cjs) and looked for in the scans' printed footnotes.
const GK_PS = 'the 1895 edition gives the Greek psalm number; English Bibles number it';
const GK_V = 'the 1895 edition gives the Greek verse number; English Bibles number it';
const REF_CORR = [
  { sec: '5.7', from: 'Romans 11:38', to: 'Romans 11:36', why: 'misprinted in the 1895 edition, which gives a verse that does not exist ("Of him, and through him, and to him, are all things")' },
  { sec: '5.9', from: '1 John 16:15', to: 'John 16:15', why: 'a slip in the transcription; the 1895 edition prints "John xvi. 15" ("He shall take of mine, and shall shew it unto you")' },
  { sec: '5.11', from: 'Psalm 107:13', to: 'Psalm 108:13', why: `${GK_PS} 108:13 ("Through God we shall do valiantly")` },
  { sec: '6.15', from: 'Psalm 139:7', to: 'Psalm 139:8', why: 'the 1895 edition gives the Prayer Book Psalter verse number; English Bibles number it 139:8 ("If I ascend up into heaven, thou art there")' },
  { sec: '8.18', from: 'Ephesians 5:29', to: 'Ephesians 5:27', why: 'misprinted in the 1895 edition ("not having spot, or wrinkle")' },
  { sec: '8.18', from: '1 Corinthians 4:6', to: '2 Corinthians 4:6', why: 'misprinted in the 1895 edition ("the light of the knowledge")' },
  { sec: '12.28', from: 'Isaiah 60:1', to: 'Isaiah 61:1', why: 'wrong as the transcription gives it; the scans\' footnote could not be read to say whether the slip is the 1895 edition\'s ("The Spirit of the Lord God is upon me; because the Lord hath anointed me")' },
  { sec: '12.28', from: 'Revelation 21:18–19', to: 'Revelation 22:18–19', why: 'misprinted in the 1895 edition (the warning against adding to or taking away from the book)' },
  { sec: '15.35', from: 'Psalm 51:9', to: 'Psalm 51:7', why: `${GK_V} 51:7 ("Wash me, and I shall be whiter than snow")` },
  { sec: '16.38', from: 'Psalm 14:4', to: 'Psalm 104:4', why: 'wrong as the transcription gives it; the scans\' footnote could not be read to say whether the slip is the 1895 edition\'s ("Who maketh his angels spirits; his ministers a flaming fire")' },
  { sec: '18.46', from: '2 Corinthians 1:12', to: '1 Corinthians 2:12', why: 'misprinted in the 1895 edition ("the spirit which is of God")' },
  { sec: '19.48', from: '1 John 1:20', to: '1 John 2:20', why: 'misprinted in the 1895 edition, which gives a verse that does not exist ("ye have an unction from the Holy One")' },
  { sec: '19.49', from: 'Isaiah 62:14', to: 'Isaiah 63:14', why: 'misprinted in the 1895 edition, which gives a verse that does not exist (the Spirit who led the people, Isaiah 63:14 in the Greek Old Testament)' },
  { sec: '23.54', from: 'Psalm 39:7', to: 'Psalm 139:7', why: 'misprinted in the 1895 edition ("Whither shall I go from thy spirit?")' },
  { sec: '24.55', from: 'Psalm 29:12', to: 'Psalm 30:12', why: `${GK_PS} 30:12 ("that my glory may sing praise to thee")` },
  { sec: '25.59', from: '2 Corinthians 13:13', to: '2 Corinthians 13:14', why: `${GK_V} 13:14 ("The grace of the Lord Jesus Christ, and the love of God, and the communion of the Holy Ghost")` },
  { sec: '26.61', from: 'Galatians 6:4', to: 'Galatians 4:6', why: 'a slip in the transcription; the 1895 edition prints "Gal. iv. 6" ("crying, Abba, Father")' },
  { sec: '30.78', from: 'Ezekiel 23:5', to: 'Exodus 23:5', why: 'misprinted in the 1895 edition (the law on helping an enemy\'s ass that has fallen under its burden)' },
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
  const sections = o.sections.map((s) => ({ n: s.n, paras: s.paras.slice() }));
  for (const s of sections) {
    const key = `${o.n}.${s.n}`;
    for (const c of CORR.filter((c) => c.sec === key)) {
      const hits = s.paras.reduce((a, p) => a + p.split(c.from).length - 1, 0);
      if (c.all ? hits < 1 : hits !== 1) throw new Error(`word correction ${key} "${c.from}" matched ${hits}`);
      s.paras = s.paras.map((p) => p.split(c.from).join(c.to)); c.done = true; c.count = hits;
    }
    for (const c of OMIT.filter((c) => c.sec === key)) {
      const hits = s.paras.reduce((a, p) => a + p.split(c.from).length - 1, 0);
      if (c.all ? hits < 1 : hits !== 1) throw new Error(`omission ${key} "${c.from}" matched ${hits}`);
      s.paras = s.paras.map((p) => p.split(c.from).join('')); c.done = true; c.count = hits;
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
  parts.push({ n: o.n, title: `On the Holy Spirit, Chapter ${ROMAN[o.n]}`, sections });
}
for (const c of [...CORR, ...OMIT, ...REF_CORR]) if (!c.done) throw new Error('not applied: ' + JSON.stringify(c));
let expect = 1; for (const p of parts) for (const s of p.sections) { if (s.n !== expect) throw new Error(`numbering gap at ${p.n}.${s.n}`); expect++; }
const strip = (a) => a.map(({ done, all, ...c }) => c);
fs.writeFileSync(outPath, JSON.stringify({ parts, corrections: strip(CORR), omitted: strip(OMIT), printerErrors: PRINTER_ERRORS, refCorrections: strip(REF_CORR) }, null, 1) + '\n');
console.log(`${parts.length} chapters, ${expect - 1} sections | corrections ${CORR.length}`);
