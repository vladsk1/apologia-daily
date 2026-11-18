// tools/fathers/verify-candidates.cjs — tests each candidate difference in context against three scans (Hilary, 2026-11-18). Candidates: [{sec,a,b}] with a = transcription words, b = scan words.
// For each candidate difference, re-align its section against scan A, capture 3 words of context either side
// on the hosted side, and test whether "<before> <scan reading> <after>" occurs in BOTH scans (normalized).
// Confirmed = both scans print the reading in that exact context. Usage: node verify-cands.cjs <text.json> <ocrA> <ocrB> <cands.json> <START> <END>
const fs = require('fs');
const [, , jsonPath, candPath, START, END, oa, ob, oc] = process.argv;
const J = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const cands = JSON.parse(fs.readFileSync(candPath, 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
const loadO = (p) => { let o = fs.readFileSync(p, 'utf8'); const s = o.search(new RegExp(START)); const e = o.search(new RegExp(END));
  o = o.slice(s, e > s ? e : undefined).replace(/(\w)[-­]\s*\n\s*(\w)/g, '$1$2'); return ' ' + norm(o) + ' '; };
const OA = loadO(oa), OB = loadO(ob), OC = loadO(oc);
const OAt = OA.trim().split(' ');
const idx = new Map(); for (let i = 0; i < OAt.length - 3; i++) { const k = OAt.slice(i, i + 4).join(' '); let a = idx.get(k); if (!a) idx.set(k, a = []); a.push(i); }
function lcs(a, b) { const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = []; let i = 0, j = 0; while (i < n && j < m) { if (a[i] === b[j]) { ops.push(['=', i, j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['-', i, j]); i++; } else { ops.push(['+', i, j]); j++; } }
  while (i < n) ops.push(['-', i++, j]); while (j < m) ops.push(['+', i, j++]); return ops; }
const out = [];
const bySec = {}; for (const c of cands) (bySec[c.sec] = bySec[c.sec] || []).push(c);
for (const [sec, list] of Object.entries(bySec)) {
  const [o, n] = sec.split('.').map(Number);
  const S = J.orations.find((x) => x.n === o).sections.find((x) => x.n === n);
  const A = norm(S.paras.join(' ').replace(/\u0001REF[^\u0002]*\u0002/g, ' ').replace(/[\u0001-\u0004]/g, ' ')).split(' ').filter(Boolean);
  const votes = new Map(); for (let k = 0; k < A.length - 3; k++) { const h = idx.get(A.slice(k, k + 4).join(' ')); if (!h || h.length > 5) continue; for (const x of h) { const st = Math.round((x - k) / 50); votes.set(st, (votes.get(st) || 0) + 1); } }
  let best = 0, bv = -1; for (const [st, v] of votes) if (v > bv) { bv = v; best = st; }
  let pos = Math.max(0, best * 50 - 60); const found = [];
  for (let c = 0; c < A.length; c += 300) {
    const a = A.slice(c, c + 300); const W = OAt.slice(pos, pos + Math.round(a.length * 1.7) + 200); const ops = lcs(a, W);
    let last = ops.length - 1; while (last >= 0 && ops[last][0] !== '=') last--; const core = ops.slice(0, last + 1);
    let run = null; for (const op of core) { if (op[0] === '=') { if (run) { found.push(run); run = null; } continue; } run = run || { ai: c + op[1], a: [], b: [] }; (op[0] === '-' ? run.a : run.b).push(op[0] === '-' ? a[op[1]] : W[op[2]]); }
    pos += core.filter((x) => x[0] !== '-').length;
  }
  for (const cd of list) {
    const r = found.find((f) => f.a.join(' ') === cd.a && f.b.join(' ').replace(/'/g, '') === cd.b);
    if (!r) { out.push({ ...cd, status: 'no-context' }); continue; }
    const before = A.slice(Math.max(0, r.ai - 3), r.ai).join(' '); const after = A.slice(r.ai + r.a.length, r.ai + r.a.length + 3).join(' ');
    const printed = ` ${before} ${cd.b} ${after} `.replace(/\s+/g, ' '); const hosted = ` ${before} ${cd.a} ${after} `.replace(/\s+/g, ' ');
    out.push({ ...cd, before, after, inA: OA.includes(printed), inB: OB.includes(printed), inC: OC.includes(printed), n: [OA, OB, OC].filter((t) => t.includes(printed)).length, hostedN: [OA, OB, OC].filter((t) => t.includes(hosted)).length });
  }
}
fs.writeFileSync(candPath.replace(/\.json$/, '.verified.json'), JSON.stringify(out, null, 1));
for (const x of out) console.log(`${x.sec} | ${x.a} → ${x.b} | ${x.status || ('print ' + x.n + '/3, hosted ' + x.hostedN + '/3')} | …${x.before || ''} [${x.b}] ${x.after || ''}…`);
