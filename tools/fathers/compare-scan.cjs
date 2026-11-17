// tools/fathers/compare-scan.cjs — the Church Fathers copy-check (rule 1): compare a hosted text JSON
// (output of extract-ccel.cjs) word by word with the OCR of a scan of the original printing, section by
// section in reading order, and list every difference for hand-checking. Used for Gregory of Nazianzus 2026-11-18.
// Usage: node compare-scan.cjs <text.json> <scan-ocr.txt> <out-report.json>
const fs = require('fs');
const [, , jsonPath, ocrPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let ocr = fs.readFileSync(ocrPath, 'utf8');

// Restrict OCR to the orations: from the opening words of Or. 27.1 to the end of the volume part.
const start = ocr.search(/I\s+am\s+to\s+speak\s+against\s+persons/);
const endMark = ocr.search(/ORATION\s+XXXII|ORATION\s+XXXIII|THE\s+LAST\s+FAREWELL/i);
ocr = ocr.slice(start, endMark > start ? endMark : undefined);
// Undo end-of-line hyphenation, then tokenize.
ocr = ocr.replace(/(\w)[-­]\s*\n\s*(\w)/g, '$1$2');
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const ocrToks = norm(ocr).split(' ');
const ocrIndex = new Map();
for (let i = 0; i < ocrToks.length - 3; i++) {
  const k = ocrToks.slice(i, i + 4).join(' ');
  if (!ocrIndex.has(k)) ocrIndex.set(k, []); ocrIndex.get(k).push(i);
}

function sectionText(sec) {
  return sec.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g, ' ').replace(/[\u0001-\u0004]|Q/g, (m) => (m === 'Q' ? 'Q' : ' '));
}
// diff (LCS on small windows)
function diff(a, b) {
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push(['=', a[i]]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['-', a[i]]); i++; }
    else { ops.push(['+', b[j]]); j++; }
  }
  while (i < n) ops.push(['-', a[i++]]); while (j < m) ops.push(['+', b[j++]]);
  return ops;
}

const report = []; let prevPos = 0;
let totalWords = 0, matchedWords = 0;
for (const o of J.orations) for (const s of o.sections) {
  // the Q marker from extraction is inside \u0001Q ... clean it
  const txt = s.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g, ' ').replace(/\u0001Q/g, ' ').replace(/[\u0001-\u0004]/g, ' ');
  const na = norm(txt).split(' ').filter(Boolean);
  // locate in OCR: first 4-gram that hits
  let pos = -1;
  for (let i = 0; i < Math.min(na.length - 3, 60) && pos < 0; i++) {
    const hits = ocrIndex.get(na.slice(i, i + 4).join(' ')) || [];
    const p = hits.find((h) => h >= prevPos - 800);
    if (p !== undefined) pos = Math.max(0, p - i);
  }
  if (pos < 0) { report.push({ sec: `${o.n}.${s.n}`, located: false }); continue; }
  const window = ocrToks.slice(pos, pos + Math.round(na.length * 1.6) + 400);
  const ops = diff(na, window);
  // trim trailing '+' (OCR beyond the section, incl. footnotes)
  let lastEq = ops.length - 1; while (lastEq >= 0 && ops[lastEq][0] !== '=') lastEq--;
  const core = ops.slice(0, lastEq + 1);
  const eq = core.filter((x) => x[0] === '=').length; prevPos = pos + core.filter((x) => x[0] !== '-').length;
  totalWords += na.length; matchedWords += eq;
  // gather runs of -/+ as candidate changes
  const changes = []; let cur = null;
  for (const [op, w] of core) {
    if (op === '=') { if (cur) { changes.push(cur); cur = null; } continue; }
    cur = cur || { na: [], ocr: [] }; (op === '-' ? cur.na : cur.ocr).push(w);
  }
  report.push({ sec: `${o.n}.${s.n}`, located: true, words: na.length, matched: eq, pct: +(100 * eq / na.length).toFixed(1),
    changes: changes.filter((c) => c.na.length <= 4 && c.ocr.length <= 6).map((c) => `${c.na.join(' ')} → ${c.ocr.join(' ')}`) });
}
fs.writeFileSync(outPath, JSON.stringify(report, null, 1));
console.log(`words ${totalWords}, matched ${matchedWords} (${(100 * matchedWords / totalWords).toFixed(1)}%)`);
const low = report.filter((r) => !r.located || r.pct < 90);
console.log('not located / <90%:', low.map((r) => `${r.sec}${r.located ? ' ' + r.pct + '%' : ' NOT FOUND'}`).join(', ') || 'none');
