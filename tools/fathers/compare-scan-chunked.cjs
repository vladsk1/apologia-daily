// tools/fathers/compare-scan-chunked.cjs — copy-check for texts whose scans interleave long footnotes with the running
// text (Basil, On the Holy Spirit, NPNF2-08, 2026-11-18). Like compare-scan-robust.cjs, but every 60-word chunk of a
// section is located again by voting (4-word sequences, near the previous chunk), so a page of footnotes between two
// chunks is skipped instead of derailing the alignment. Usage: START=regex END=regex node compare-scan-chunked.cjs <extracted.json> <ocr.txt> <out.json>
const fs = require('fs');
const [, , jsonPath, ocrPath, outPath] = process.argv;
const J = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let ocr = fs.readFileSync(ocrPath, 'utf8');
const s0 = ocr.search(new RegExp(process.env.START)); const e0 = ocr.search(new RegExp(process.env.END));
if (s0 < 0) throw new Error('START not found');
ocr = ocr.slice(s0, e0 > s0 ? e0 : undefined).replace(/(\w)[-­]\s*\n\s*(\w)/g, '$1$2');
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const O = norm(ocr).split(' ');
const idx = new Map();
for (let i = 0; i < O.length - 3; i++) { const k = O.slice(i, i + 4).join(' '); let a = idx.get(k); if (!a) idx.set(k, a = []); a.push(i); }
function lcsOps(a, b) {
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { ops.push(['=', a[i], j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['-', a[i]]); i++; } else { ops.push(['+', b[j]]); j++; } }
  while (i < n) ops.push(['-', a[i++]]); return ops;
}
const CH = 60; let cursor = 0; const rep = []; let tot = 0, mat = 0;
for (const o of J.orations) for (const s of o.sections) {
  const A = norm(s.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g, ' ').replace(/[\u0001-\u0004]/g, ' ')).split(' ').filter(Boolean);
  let matched = 0; const changes = [];
  for (let c = 0; c < A.length; c += CH) {
    const a = A.slice(c, c + CH);
    const votes = new Map();
    for (let k = 0; k < a.length - 3; k++) { const hits = idx.get(a.slice(k, k + 4).join(' ')); if (!hits || hits.length > 8) continue;
      for (const h of hits) { const st = h - k; if (st < cursor - 400 || st > cursor + 6000) continue; const b = Math.round(st / 20); votes.set(b, (votes.get(b) || 0) + 1); } }
    let best = null, bv = 0; for (const [st, v] of votes) if (v > bv) { bv = v; best = st; }
    if (bv < 3) { // lost the place (pages out of order, or a very long note): vote over the whole scan
      const g = new Map(); for (let k = 0; k < a.length - 3; k++) { const hits = idx.get(a.slice(k, k + 4).join(' ')); if (!hits || hits.length > 8) continue;
        for (const h of hits) { const b = Math.round((h - k) / 20); g.set(b, (g.get(b) || 0) + 1); } }
      for (const [st, v] of g) if (v > bv) { bv = v; best = st; }
    }
    if (best === null) { changes.push(`[chunk at word ${c} not located] ${a.slice(0, 8).join(' ')}…`); continue; }
    const from = Math.max(0, best * 20 - 30); const W = O.slice(from, from + Math.round(a.length * 1.4) + 60);
    const ops = lcsOps(a, W); let first = ops.findIndex((x) => x[0] === '='); let last = ops.length - 1; while (last >= 0 && ops[last][0] !== '=') last--;
    // trim scan-only words before the first match and after the last (they belong to neighbouring text)
    const core = ops.slice(0, last + 1).filter((x, i) => !(i < first && x[0] === '+'));
    matched += core.filter((x) => x[0] === '=').length;
    let cur = null; for (const [op, w] of core) { if (op === '=') { if (cur) { changes.push(`${cur.a.join(' ')} → ${cur.b.join(' ')}`); cur = null; } continue; } cur = cur || { a: [], b: [] }; (op === '-' ? cur.a : cur.b).push(w); }
    if (last >= 0) cursor = from + ops[last][2];
  }
  tot += A.length; mat += matched;
  rep.push({ sec: `${o.n}.${s.n}`, words: A.length, matched, pct: +(100 * matched / A.length).toFixed(1), changes });
}
fs.writeFileSync(outPath, JSON.stringify(rep, null, 1));
console.log(`words ${tot}, matched ${mat} (${(100 * mat / tot).toFixed(1)}%)`);
const low = rep.filter((r) => r.pct < 95); console.log(`sections below 95%: ${low.length}`, low.map((r) => `${r.sec} ${r.pct}%`).join(', '));
