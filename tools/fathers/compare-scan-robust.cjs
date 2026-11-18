// tools/fathers/compare-scan-robust.cjs — used for Hilary (2026-11-18); see docs/audits/fathers-hilary-copycheck-2026-11-18.md §3.
// Robust copy-check: locate each section in the scan OCR by voting (every 4-word sequence of the section votes for
// a start offset; the most-voted offset wins), then align by LCS in a window and report matches and differences.
// Usage: START=regex END=regex node compare-robust.cjs <text.json> <ocr.txt> <out.json>
const fs = require('fs');
const [, , jsonPath, ocrPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let ocr = fs.readFileSync(ocrPath, 'utf8');
const s0 = ocr.search(new RegExp(process.env.START)); const e0 = ocr.search(new RegExp(process.env.END));
ocr = ocr.slice(s0, e0 > s0 ? e0 : undefined).replace(/(\w)[-­]\s*\n\s*(\w)/g, '$1$2');
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const O = norm(ocr).split(' ');
const idx = new Map();
for (let i = 0; i < O.length - 3; i++) { const k = O[i] + ' ' + O[i + 1] + ' ' + O[i + 2] + ' ' + O[i + 3]; let a = idx.get(k); if (!a) idx.set(k, a = []); a.push(i); }
function lcsOps(a, b) {
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { ops.push(['=', a[i]]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['-', a[i]]); i++; } else { ops.push(['+', b[j]]); j++; } }
  while (i < n) ops.push(['-', a[i++]]); while (j < m) ops.push(['+', b[j++]]); return ops;
}
const rep = []; let tot = 0, mat = 0;
for (const o of J.orations) for (const s of o.sections) {
  const A = norm(s.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g, ' ').replace(/[\u0001-\u0004]/g, ' ')).split(' ').filter(Boolean);
  const votes = new Map();
  for (let k = 0; k < A.length - 3; k++) { const hits = idx.get(A[k] + ' ' + A[k + 1] + ' ' + A[k + 2] + ' ' + A[k + 3]); if (!hits || hits.length > 5) continue;
    for (const h of hits) { const st = Math.round((h - k) / 50); votes.set(st, (votes.get(st) || 0) + 1); } }
  let best = null, bv = 0; for (const [st, v] of votes) if (v > bv) { bv = v; best = st; }
  tot += A.length;
  if (best === null) { rep.push({ sec: `${o.n}.${s.n}`, located: false, words: A.length }); continue; }
  // section can be long: align in chunks of 300 words to keep LCS cheap
  let pos = Math.max(0, best * 50 - 60), matched = 0; const changes = [];
  for (let c = 0; c < A.length; c += 300) {
    const a = A.slice(c, c + 300); const W = O.slice(pos, pos + Math.round(a.length * 1.7) + 200);
    const ops = lcsOps(a, W); let last = ops.length - 1; while (last >= 0 && ops[last][0] !== '=') last--;
    const core = ops.slice(0, last + 1); matched += core.filter((x) => x[0] === '=').length;
    let cur = null; for (const [op, w] of core) { if (op === '=') { if (cur) { changes.push(cur); cur = null; } continue; } cur = cur || { a: [], b: [] }; (op === '-' ? cur.a : cur.b).push(w); }
    pos += core.filter((x) => x[0] !== '-').length;
  }
  mat += matched;
  rep.push({ sec: `${o.n}.${s.n}`, located: true, words: A.length, matched, pct: +(100 * matched / A.length).toFixed(1), changes: changes.map((c) => `${c.a.join(' ')} → ${c.b.join(' ')}`) });
}
fs.writeFileSync(outPath, JSON.stringify(rep, null, 1));
console.log(`words ${tot}, matched ${mat} (${(100 * mat / tot).toFixed(1)}%)`);
const low = rep.filter((r) => !r.located || r.pct < 90); console.log(`sections below 90% or not located: ${low.length}`, low.slice(0, 30).map((r) => `${r.sec} ${r.located ? r.pct + '%' : 'NF'}`).join(', '));
