// Build fathers/_data/hilary-trinity.text.json from the CCEL extraction of Hilary, On the Trinity (NPNF2-09, 1899; preface dated July 1898):
//  - applies the scan-confirmed WORD corrections (CCEL transcription slips and modernised spellings → the 1899 printing);
//  - applies the Bible-REFERENCE corrections (REF_CORR, filled from tools/fathers/check-refs.cjs);
//  - removes the stray space left before punctuation where a footnote marker was removed (whitespace only).
// Every word correction was confirmed in at least two of three independent archive.org scans of the 1899 edition (its 1899 printing and two later printings, page for page the same)
// (selectlibraryofn09scha, cu31924103070110, bwb_KS-420-200_9), read in context. Full record:
// docs/audits/fathers-hilary-copycheck-2026-11-18.md. Keys are section numbers ("book.section").
// Usage: node prep-hilary.cjs <ccel-hilary.json> <out-text.json>
const fs = require('fs');
const [, , inPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const CORR = [
  // transcription slips (a word changed or dropped)
  { sec: '1.5', from: 'found in these words spoken', to: 'found in them words spoken' },
  { sec: '1.13', from: 'limits which barred our', to: 'limits which bound our' },
  { sec: '1.13', from: 'rudiments of the word,', to: 'rudiments of the world,' },
  { sec: '2.15', from: 'The assertion is that Which', to: 'The assertion is that That Which' },
  { sec: '2.22', from: 'that the Sun was begotten', to: 'that the Son was begotten' },
  { sec: '2.27', from: 'and that Son shall be named', to: 'and that that Son shall be named' },
  { sec: '3.3', from: 'only a possible and embodied', to: 'only a passible and embodied' },
  { sec: '3.22', from: 'orThou hast made', to: 'or Thou hast made' },
  { sec: '4.4', from: 'a nature pro-existent', to: 'a nature pre-existent' },
  { sec: '4.27', from: 'do this things', to: 'do this thing' },
  { sec: '4.30', from: 'clear that demand', to: 'clear that that demand' },
  { sec: '6.46', from: 'the dating which', to: 'the daring which' },
  { sec: '7.3', from: 'by experience holy brigands', to: 'by experience how brigands' },
  { sec: '7.7', from: 'adversaries are ranted', to: 'adversaries are routed' },
  { sec: '7.22', from: 'us know that nature', to: 'us know that that nature' },
  { sec: '7.24', from: 'of the seal of David', to: 'of the seed of David' },
  { sec: '8.44', from: 'wholly whoever has', to: 'wholly whatever has' },
  { sec: '8.46', from: 'the nature of Gods--', to: 'the nature of God--' },
  { sec: '9.53', from: 'and I came unto you', to: 'and I come unto you' },
  { sec: '9.70', from: 'the mystery His birth', to: 'the mystery of His birth' },
  { sec: '9.70', from: 'being unskilled statement', to: 'being unskilled in statement' },
  { sec: '10.2', from: 'some shall away', to: 'some shall fall away' },
  { sec: '10.9', from: 'the impossible nature of God', to: 'the impassible nature of God' },
  { sec: '10.10', from: 'is not worth of Me', to: 'is not worthy of Me' },
  { sec: '10.11', from: 'the drought of vinegar', to: 'the draught of vinegar' },
  { sec: '10.41', from: 'the reality all His body', to: 'the reality of His body' },
  { sec: '10.42', from: 'while I was them', to: 'while I was with them' },
  { sec: '10.54', from: 'pry into secrets', to: 'pry into the secrets' },
  { sec: '11.28', from: 'but fulfil it', to: 'but to fulfil it' },
  { sec: '11.31', from: 'which is to came', to: 'which is to come' },
  { sec: '11.34', from: 'the covenant firm Me', to: 'the covenant from Me' },
  { sec: '11.40', from: 'through dissolutions', to: 'through dissolution' },
  { sec: '12.1', from: 'venture out trusty', to: 'venture our trusty' },
  { sec: '12.20', from: 'which hit themselves', to: 'which lift themselves' },
  { sec: '12.34', from: 'His is name is', to: 'His name is' },
  { sec: '12.50', from: 'His impossible birth', to: 'His impassible birth' },
  // spellings the transcription modernised; the 1899 printing keeps the older form
  { sec: '5.5', from: 'Divine also. God spoke', to: 'Divine also. God spake' },
  { sec: '5.5', from: 'true God Who spoke', to: 'true God Who spake' },
  { sec: '8.25', from: 'Spirit, they all spoke', to: 'Spirit, they all spake' },
  { sec: '8.35', from: 'the Spirit which spoke', to: 'the Spirit which spake' },
  { sec: '8.41', from: 'words which He spoke', to: 'words which He spake' },
  { sec: '8.44', from: 'indeed the Lord spoke', to: 'indeed the Lord spake' },
  { sec: '8.45', from: 'of Christ Who spoke', to: 'of Christ Who spake' },
  { sec: '9.5', from: 'claim that He spoke', to: 'claim that He spake' },
  { sec: '12.11', from: 'Master and Lord spoke', to: 'Master and Lord spake' },
  { sec: '2.8', from: 'as He that begot', to: 'as He that begat' },
  { sec: '2.22', from: 'possesses all things begot', to: 'possesses all things begat' },
  { sec: '3.3', from: 'before time was begot', to: 'before time was begat' },
  { sec: '3.22', from: 'a Father Who begot', to: 'a Father Who begat' },
  { sec: '4.9', from: 'that He, Who begot', to: 'that He, Who begat' },
  { sec: '4.41', from: 'Son Whom He begot', to: 'Son Whom He begat' },
  { sec: '12.8', from: 'said that He begot', to: 'said that He begat' },
  { sec: '12.10', from: 'that He really begot', to: 'that He really begat' },
  { sec: '12.13', from: 'by this act begot', to: 'by this act begat' },
  { sec: '12.13', from: 'learn that God begot', to: 'learn that God begat' },
  { sec: '2.23', from: 'if they be wrath', to: 'if they be wroth' },
  { sec: '4.28', from: 'a payment of honor', to: 'a payment of honour' },
  { sec: '7.19', from: 'conveyed in this showing', to: 'conveyed in this shewing' },
  { sec: '8.24', from: 'His own are naught', to: 'His own are nought' },
  { sec: '8.45', from: 'sealed, could be naught', to: 'sealed, could be nought' },
  { sec: '8.51', from: 'created through Him, recognize', to: 'created through Him, recognise' },
  { sec: '9.65', from: 'compel Him to recognize', to: 'compel Him to recognise' },
  { sec: '9.8', from: 'Him dwelleth the fullness', to: 'Him dwelleth the fulness' },
];
// Bible-reference corrections. References are the 1899 editors' identifications, not Hilary's words.
// Hilary read the Psalms in the Latin (Greek-derived) numbering, and the 1899 editors sometimes give that number;
// those are converted to the numbering English Bibles use, so the verse pop-up shows the verse Hilary quotes.
const LXX = 'the 1899 edition gives the Greek/Latin psalm number; English Bibles number it';
const REF_CORR = [
  { sec: '1.30', from: 'Mark 14:28', to: 'John 14:28', why: 'the 1899 edition prints "Ib." after a reference to Mark; the words quoted ("The Father is greater than I") are John 14:28' },
  { sec: '2.33', from: 'John 14:13–14', to: 'John 16:13–14', why: 'misprinted in the 1899 edition ("He shall glorify Me, for He shall take of Mine")' },
  { sec: '4.8', from: 'Psalm 7:12', to: 'Psalm 7:11', why: 'the 1899 edition gives the Greek/Latin verse number; English Bibles number it 7:11 ("God is the righteous Judge")' },
  { sec: '4.8', from: 'Psalm 139:6–9', to: 'Psalm 139:7–10', why: 'misprinted in the 1899 edition, which gives "cxxxix. 6-9 (cxxxviii. 7-10)"; the verses quoted are 7–10 ("Whither shall I go from Thy Spirit?")' },
  { sec: '4.16', from: 'Psalm 168:5', to: 'Psalm 148:5', why: 'misprinted in the 1899 edition, which gives a psalm that does not exist ("He commanded, and they were created")' },
  { sec: '6.44', from: '1 John 8:3', to: 'Romans 8:3', why: 'misprinted in the 1899 edition, which gives a chapter that does not exist ("God sent His Son in the likeness of the flesh of sin")' },
  { sec: '7.30', from: 'John 2:6', to: 'John 3:6', why: 'misprinted in the 1899 edition ("That which is born of the flesh is flesh")' },
  { sec: '8.1', from: 'Titus 1:9', to: 'Titus 1:10', why: 'misprinted in the 1899 edition ("many unruly, vain talkers and deceivers")' },
  { sec: '8.25', from: 'Psalm 2:8', to: 'Psalm 2:7', why: 'misprinted in the 1899 edition ("Thou art My Son; this day have I begotten Thee")' },
  { sec: '9.24', from: 'Mark 12:52', to: 'Mark 12:32', why: 'misprinted in the 1899 edition, which gives a verse that does not exist (the scribe\'s answer, Mark 12:32–33)' },
  { sec: '10.12', from: 'Psalm 15:10', to: 'Psalm 16:10', why: `${LXX} 16:10 ("Thou wilt not suffer Thy Holy One to see corruption")` },
  { sec: '10.12', from: 'Matthew 26:16', to: 'Matthew 26:61', why: 'misprinted in the 1899 edition (the temple rebuilt "in three days")' },
  { sec: '10.68', from: 'Genesis 15:16', to: 'Genesis 15:6', why: 'misprinted in the 1899 edition ("Abraham believed God")' },
  { sec: '11.23', from: '1 Timothy 5:11', to: '1 Timothy 6:11', why: 'wrong as the transcription gives it; the scans\' footnote is too faint to say whether the slip is the 1899 edition\'s ("O man of God")' },
  { sec: '12.3', from: 'Romans 1:23', to: 'Romans 1:25', why: 'wrong as the transcription gives it; the scans\' footnote is too faint to say whether the slip is the 1899 edition\'s ("Who changed the truth of God into a lie")' },
  { sec: '12.8', from: 'Psalm 109:3', to: 'Psalm 110:3', why: `${LXX} 110:3 ("From the womb, before the morning star, I begat Thee")` },
  { sec: '12.14', from: 'Psalm 21:32', to: 'Psalm 22:31', why: `${LXX} 22:31 ("a people which shall be born")` },
  { sec: '12.34', from: 'Psalm 71:17', to: 'Psalm 72:17', why: `${LXX} 72:17 ("His name is before the sun")` },
  { sec: '12.39', from: 'Psalm 32:6', to: 'Psalm 33:6', why: `${LXX} 33:6 ("By the word of the Lord were the heavens established")` },
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
  parts.push({ n: o.n, title: `On the Trinity, Book ${ROMAN[o.n]}`, sections });
}
for (const c of [...CORR, ...REF_CORR]) if (!c.done) throw new Error('not applied: ' + JSON.stringify(c));
for (const p of parts) p.sections.forEach((s, i) => { if (s.n !== i + 1) throw new Error(`numbering gap in ${p.n} at ${s.n}`); });
const strip = (a) => a.map(({ done, ...c }) => c);
fs.writeFileSync(outPath, JSON.stringify({ parts, corrections: strip(CORR), refCorrections: strip(REF_CORR) }, null, 1) + '\n');
console.log(parts.map((p) => `${p.n}: ${p.sections.length}`).join(' | '), `| corrections ${CORR.length}`);
