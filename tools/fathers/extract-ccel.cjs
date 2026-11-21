// tools/fathers/extract-ccel.cjs — extract a work from a CCEL plain-text NPNF/ANF volume. Keeps the Father's
// text, the printed section numerals, and Bible references from the editors' footnotes (reference only); drops every
// other footnote. BLOCKS below are the measured line ranges of Orations 27-31 in CCEL npnf207.txt (2026-11-18);
// a new work passes its own ranges in a config file. Usage: node extract-ccel.cjs <npnfNNN.txt> <out.json> [config.json]
// config.json: { "blocks": { "<part>": [headingLine, textEndSeparator, notesEndSeparator] }, "numerals": "roman"|"arabic" }
const fs = require('fs');
const [, , src, out, cfgPath] = process.argv;
const CFG = cfgPath ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : null;
const L = fs.readFileSync(src, 'utf8').split(/\r?\n/);
// [heading line, text-end separator, notes-end separator] (1-based line numbers, measured)
const VERSE_LISTS = !!(CFG && CFG.verseLists);
const BLOCKS = CFG ? CFG.blocks : { 27: [31377, 31643, 31753], 28: [31755, 32668, 32916], 29: [32918, 33543, 33814],
  30: [33816, 34411, 34660], 31: [34662, 35437, 35646] };

const BOOK = {
  'gen': 'Genesis', 'exod': 'Exodus', 'ex': 'Exodus', 'lev': 'Leviticus', 'num': 'Numbers', 'deut': 'Deuteronomy',
  'josh': 'Joshua', 'judg': 'Judges', 'ruth': 'Ruth', '1 sam': '1 Samuel', '2 sam': '2 Samuel', '1 kings': '1 Kings',
  '2 kings': '2 Kings', '1 chron': '1 Chronicles', '2 chron': '2 Chronicles', 'ezra': 'Ezra', 'neh': 'Nehemiah',
  'esth': 'Esther', 'job': 'Job', 'ps': 'Psalm', 'prov': 'Proverbs', 'eccl': 'Ecclesiastes', 'eccles': 'Ecclesiastes',
  'cant': 'Song of Songs', 'song': 'Song of Songs', 'isa': 'Isaiah', 'is': 'Isaiah', 'jer': 'Jeremiah', 'lam': 'Lamentations',
  'ezek': 'Ezekiel', 'dan': 'Daniel', 'hos': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obad': 'Obadiah', 'jonah': 'Jonah',
  'mic': 'Micah', 'nah': 'Nahum', 'hab': 'Habakkuk', 'zeph': 'Zephaniah', 'hag': 'Haggai', 'zech': 'Zechariah', 'mal': 'Malachi',
  'matt': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'rom': 'Romans', '1 cor': '1 Corinthians',
  '2 cor': '2 Corinthians', 'gal': 'Galatians', 'eph': 'Ephesians', 'phil': 'Philippians', 'col': 'Colossians',
  '1 thess': '1 Thessalonians', '2 thess': '2 Thessalonians', '1 tim': '1 Timothy', '2 tim': '2 Timothy', 'tit': 'Titus',
  'titus': 'Titus', 'philem': 'Philemon', 'heb': 'Hebrews', 'jas': 'James', 'james': 'James', '1 pet': '1 Peter',
  '2 pet': '2 Peter', '1 john': '1 John', '2 john': '2 John', '3 john': '3 John', 'jude': 'Jude', 'rev': 'Revelation',
  'ecclus': 'Sirach', 'wisd': 'Wisdom', 'wisdom': 'Wisdom', 'baruch': 'Baruch', 'bar': 'Baruch', '1 macc': '1 Maccabees',
  '2 macc': '2 Maccabees', 'jerem': 'Jeremiah', 'ecc': 'Ecclesiastes', 'ephes': 'Ephesians', 'mat': 'Matthew', 'galat': 'Galatians', 'tob': 'Tobit', 'tobit': 'Tobit', 'judith': 'Judith', 'sus': 'Susanna', 'esd': 'Esdras',
  '1 esd': '1 Esdras', '2 esd': '2 Esdras', 'apoc': 'Revelation', 'isai': 'Isaiah', 'isaiah': 'Isaiah',
};
// A config may add book abbreviations ("bookAliases": {"luc": "Luke"}) and let a note open with "See " ("seePrefix": true),
// as On the Incarnation needs (2026-11-22). Both are off unless a config asks, so earlier extractions are unchanged.
if (CFG && CFG.bookAliases) Object.assign(BOOK, CFG.bookAliases);
const SEE = !!(CFG && CFG.seePrefix);
function roman(r) { const v = { i: 1, v: 5, x: 10, l: 50, c: 100 }; r = r.toLowerCase(); let t = 0;
  for (let i = 0; i < r.length; i++) { const a = v[r[i]], b = v[r[i + 1]] || 0; if (!a) return NaN; t += a < b ? -a : a; } return t; }

// Parse the reference(s) at the START of a footnote. Returns [] if the note does not open with Scripture.
function parseRefs(note, prevBook) {
  // A note is a ';'-separated list. Each piece is "[cf.] [S.] Book roman. arabic[-arabic]",
  // "Ib. roman. arabic", or (continuation, same book) "roman. arabic". Stop at the first piece
  // that is not a reference (i.e. editorial commentary begins) — commentary is never kept.
  const refs = []; let book = prevBook;
  // Psalms may carry a double number, LXX first then the English one in brackets: "Ps. cxxxviii. (cxxxix.) 7-10".
  const one = /^(?:(Ib\.|Ibid\.)\s+|((?:[123]\s)?[A-Za-z]+)\.?\s+)?([ivxlc]+)\.\s*(?:\(([ivxlc]+)\.?\)\s*)?(\d+)(?:\s*[-–]\s*(\d+))?((?:\s*,\s*\d+(?:\s*[-–]\s*\d+)?(?!\s*\.))*)\.?([,.:]?\s+\S[\s\S]*)?$/;
  const pieces = note.trim().replace(/\.$/, '')
    .split(/\s*;\s*|,\s*(?:and\s+)?(?=(?:cf\.\s*)?(?:S\.\s*)?(?:[123]\s)?[A-Z][a-z]+\.\s+[ivxlc]+\.)/);
  for (let i = 0; i < pieces.length; i++) {
    let p = pieces[i].replace(/^and\s+/i, '');
    if (SEE && i === 0) p = p.replace(/^see\s+/i, '');
    p = p.replace(/^cf\.\s+/i, '').replace(/^(S\.|St\.)\s+/i, '').trim();
    // a range across chapters ("xvi. 28-xvii. 2") is kept as a reference to its first verse
    if (VERSE_LISTS) p = p.replace(/([ivxlc]+)\.\s*(\d+)\s*[-–]\s*[ivxlc]+\.\s*\d+/, (_, c, v) => `${c}. ${v}`);
    const m = p.match(one); if (!m) break;
    const trailing = !!m[8];                     // commentary after the reference: keep the ref, drop the rest, stop
    if (m[2]) { const key = m[2].toLowerCase().replace(/\s+/g, ' '); if (!BOOK[key]) break; book = BOOK[key]; }
    else if (!m[1] && i === 0) break;           // a bare "ix. 5" may only continue a list
    if (!book) break;
    // A double psalm number gives the Greek/Latin number and the English one in either order; the English
    // (Hebrew) number is the larger. VERSE_LISTS (config) also keeps ", 28" / ", 4-6" after the first verse.
    const ch = m[4] ? Math.max(roman(m[3]), roman(m[4])) : roman(m[3]); if (!ch) break;
    if (book === 'Galatians' && ch > 6) break;
    const spans = [[+m[5], m[6] ? +m[6] : +m[5]]];
    if (VERSE_LISTS && m[7]) for (const x of m[7].split(',').map((t) => t.trim()).filter(Boolean)) {
      const [a, b] = x.split(/\s*[-–]\s*/).map(Number); const last = spans[spans.length - 1];
      if (a === last[1] + 1) last[1] = b || a; else spans.push([a, b || a]);
    }
    for (const [a, b] of spans) refs.push(`${book} ${ch}:${a}${b !== a ? `–${b}` : ''}`);
    if (trailing) break;
  }
  return { refs, book };
}

const result = { source: 'CCEL, NPNF2-07 transcription (Print Basis: Christian Literature Publishing Co.; Rights: Public Domain)', orations: [] };
const dropped = [];
for (const [n, [h, tEnd, nEnd]] of Object.entries(BLOCKS)) {
  // footnotes
  const notes = {}; let curId = null, buf = [];
  for (let i = tEnd; i < nEnd - 1; i++) {
    const line = L[i]; const m = line.match(/^\s*\[(\d+)\]\s*(.*)$/);
    if (m) { if (curId) notes[curId] = buf.join(' '); curId = m[1]; buf = [m[2]]; }
    else if (curId && line.trim()) buf.push(line.trim());
  }
  if (curId) notes[curId] = buf.join(' ');
  // paragraphs
  const paras = []; let p = [];
  for (let i = h - 1; i < tEnd - 1; i++) {
    const t = L[i].trim();
    if (!t) { if (p.length) { paras.push(p.join(' ')); p = []; } continue; }
    p.push(t);
  }
  if (p.length) paras.push(p.join(' '));
  // "Ib." means the book of the previous FOOTNOTE, so resolve the notes in footnote order, not text order.
  const parsed = {}; let prevBook = null;
  for (const id of Object.keys(notes).sort((a, b) => a - b)) {
    const r = parseRefs(notes[id], prevBook); parsed[id] = r; if (r.refs.length) prevBook = r.book;
  }
  const heads = []; const sections = [];
  for (let para of paras) {
    // replace footnote markers
    para = para.replace(/\s*\[(\d+)\]/g, (_, id) => {
      const note = notes[id] || '';
      const { refs } = parsed[id] || { refs: [] };
      if (refs.length) return ' \u0001REF' + refs.join('; ') + '\u0002';
      dropped.push({ or: +n, id, note: note.slice(0, 140) });
      return '';
    });
    const NUM = CFG && CFG.numerals === 'arabic' ? /^(\d+)\.\s+/ : /^([IVXLC]+)\.\s+/;
    const m = para.match(NUM);
    if (m) sections.push({ n: /^\d+$/.test(m[1]) ? +m[1] : roman(m[1]), roman: m[1], paras: [para.replace(NUM, '')] });
    else if (sections.length) sections[sections.length - 1].paras.push(para);
    else heads.push(para);
  }
  result.orations.push({ n: +n, heads, sections, noteCount: Object.keys(notes).length });
}
fs.writeFileSync(out, JSON.stringify(result, null, 1));
fs.writeFileSync(out.replace(/\.json$/, '.dropped.json'), JSON.stringify(dropped, null, 1));
for (const o of result.orations) {
  const nums = o.sections.map((s) => s.n);
  const refs = o.sections.reduce((a, s) => a + s.paras.join(' ').split('\u0001REF').length - 1, 0);
  console.log(`Or ${o.n}: ${o.sections.length} sections [${nums[0]}..${nums[nums.length - 1]}] gaps=${JSON.stringify(nums.filter((v, i) => i && v !== nums[i - 1] + 1))} heads=${JSON.stringify(o.heads)} notes=${o.noteCount} refsKept=${refs}`);
}
console.log('footnotes dropped (not scripture):', dropped.length);
