// tools/fathers/check-refs.cjs — G-REF check for a hosted Father text: compares each Bible reference's
// BSB verse wording with the ~40 words of the Father's text before it and writes every reference with its
// overlap score; zero-overlap ones are read by hand. Usage: node check-refs.cjs <out.json> [text.json] (default: the Gregory text).
const fs = require('fs');
const T = JSON.parse(fs.readFileSync(process.argv[3] || 'fathers/_data/nazianzus-orations.text.json', 'utf8'));
const M = {Genesis:'GEN',Exodus:'EXO',Leviticus:'LEV',Numbers:'NUM',Deuteronomy:'DEU',Joshua:'JOS',Judges:'JDG',Ruth:'RUT','1 Samuel':'1SA','2 Samuel':'2SA','1 Kings':'1KI','2 Kings':'2KI','1 Chronicles':'1CH','2 Chronicles':'2CH',Ezra:'EZR',Nehemiah:'NEH',Esther:'EST',Job:'JOB',Psalm:'PSA',Proverbs:'PRO',Ecclesiastes:'ECC','Song of Songs':'SNG',Isaiah:'ISA',Jeremiah:'JER',Lamentations:'LAM',Ezekiel:'EZK',Daniel:'DAN',Hosea:'HOS',Joel:'JOL',Amos:'AMO',Obadiah:'OBA',Jonah:'JON',Micah:'MIC',Nahum:'NAM',Habakkuk:'HAB',Zephaniah:'ZEP',Haggai:'HAG',Zechariah:'ZEC',Malachi:'MAL',Matthew:'MAT',Mark:'MRK',Luke:'LUK',John:'JHN',Acts:'ACT',Romans:'ROM','1 Corinthians':'1CO','2 Corinthians':'2CO',Galatians:'GAL',Ephesians:'EPH',Philippians:'PHP',Colossians:'COL','1 Thessalonians':'1TH','2 Thessalonians':'2TH','1 Timothy':'1TI','2 Timothy':'2TI',Titus:'TIT',Philemon:'PHM',Hebrews:'HEB',James:'JAS','1 Peter':'1PE','2 Peter':'2PE','1 John':'1JN','2 John':'2JN','3 John':'3JN',Jude:'JUD',Revelation:'REV'};
const cache = {};
function verse(book, ch, v) {
  const u = M[book]; if (!u) return null;
  if (!cache[u]) cache[u] = JSON.parse(fs.readFileSync(`library/bible/BSB/${u}.json`, 'utf8'));
  const b = cache[u]; const k = b[`${ch}.${v}`]; if (typeof k === "string") return k;
  // try common shapes
  const c = Array.isArray(b) ? b[ch - 1] : (b[ch] || b[String(ch)] || (b.chapters && b.chapters[ch - 1]));
  if (!c) return null;
  const x = Array.isArray(c) ? c[v - 1] : (c[v] || c[String(v)]);
  return typeof x === 'string' ? x : (x && (x.text || x.t)) || null;
}
const STOP = new Set('the and of to a in that is was for it with as his he him be by not this are or from on at which but all have they you your thy thou thee i my me we our us shall will unto upon who whom what when so then there their them these those an has had were been do did no nor if out up into one more than also even its said say says god lord'.split(' '));
const words = (s) => s.toLowerCase().replace(/[^a-z ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
const stem = (w) => w.replace(/(eth|est|ing|ed|es|s)$/, '');
const out = []; let n = 0, missing = 0;
for (const p of T.parts) for (const s of p.sections) for (const para of s.paras) {
  let before = '';
  for (const seg of para) {
    if (typeof seg === 'string') { before += seg; continue; }
    for (const r of seg.ref.split('; ')) {
      n++;
      const m = r.match(/^(.+) (\d+):(\d+)(?:–(\d+))?/); if (!m) continue;
      const [_, book, ch, v1, v2] = m; const vs = [];
      for (let v = +v1; v <= +(v2 || v1); v++) { const t = verse(book, +ch, v); if (t) vs.push(t); }
      if (!M[book]) { out.push({ at: `${p.n}.${s.n}`, r, score: 'deutero', ctx: before.slice(-160) }); continue; }
      if (!vs.length) { missing++; out.push({ at: `${p.n}.${s.n}`, r, score: 'NO VERSE', ctx: before.slice(-160) }); continue; }
      const ctxW = new Set(words(before.split(/\s+/).slice(-40).join(' ')).map(stem));
      const vW = [...new Set(words(vs.join(' ')).map(stem))];
      const hit = vW.filter((w) => ctxW.has(w));
      out.push({ at: `${p.n}.${s.n}`, r, score: hit.length, hits: hit.slice(0, 6).join(','), ctx: before.slice(-160), verse: vs.join(' ').slice(0, 160) });
    }
  }
}
fs.writeFileSync(process.argv[2] || 'ref-check.json', JSON.stringify(out, null, 1));
const zero = out.filter((x) => x.score === 0);
console.log(`refs ${n} · checked ${out.length} · no-verse ${missing} · deuterocanonical ${out.filter((x) => x.score === 'deutero').length} · zero overlap ${zero.length}`);
