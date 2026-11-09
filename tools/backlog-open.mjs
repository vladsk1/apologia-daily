#!/usr/bin/env node
// backlog-open.mjs — list the OPEN rows in docs/content-backlog.md, worst-first.
//
// WHY: "fix the rows before the next mine" (owner rule) only works if the open rows are
// easy to see. This prints every not-yet-shipped backlog row grouped by priority (P1 first)
// and, within a priority, oldest-surfaced first — so a content session clears the highest-
// stakes, longest-waiting corrections before starting a new mining run.
//
// A row is OPEN when its Status cell contains the word "OPEN" or a ⬜ marker (this is how the
// backlog spells open work, incl. "PARTLY DONE … ⬜ still OPEN"); pure DONE / ✅ / 🛑 rows are
// closed and never surface. Verdict-2 ("error in ours") rows are flagged — they are ALWAYS P1,
// so any that aren't are called out as a priority bug.
//
// Usage:
//   node tools/backlog-open.mjs            # human-readable, grouped
//   node tools/backlog-open.mjs --count    # just the open-row count (for scripts/CI)
//   node tools/backlog-open.mjs --p1       # only P1 rows
//
// Dependency-free, read-only. No network, no writes.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const BACKLOG = join(HERE, '..', 'docs', 'content-backlog.md');
const TODAY = new Date('2026-11-09'); // bump as a convenience; only used for age display

const args = process.argv.slice(2);
const COUNT_ONLY = args.includes('--count');
const P1_ONLY = args.includes('--p1');

function firstDate(s) {
  const m = s && s.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[0] : null;
}
function ageDays(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Math.round((TODAY - d) / 86400000);
}
function strip(s) {
  // collapse markdown emphasis / html entities enough for a one-line summary
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…').replace(/&rarr;/g, '→')
    .replace(/\*\*/g, '').replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

const text = readFileSync(BACKLOG, 'utf8');
const lines = text.split('\n');

const rows = [];
for (const line of lines) {
  if (!/^\s*\|/.test(line)) continue;                // table row
  if (/^\s*\|\s*-+\s*\|/.test(line)) continue;        // divider
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length < 7) continue;                     // not the 7-col open-backlog table
  const [P, what, type, surfaced, target, gate, status] = cells;
  if (!/^P[1-4]$/.test(P)) continue;                  // header / stray row
  const open = /\bOPEN\b/i.test(status) || /⬜/.test(status);
  if (!open) continue;
  const surfacedDate = firstDate(surfaced);
  // A mining "verdict 2 (error in ours)" — NOT the backlog's generic "correction" type, which
  // covers low-stakes phrasing/parity fixes too. Only flag rows that explicitly carry the mining
  // verdict so the "verdict 2 is always P1" check stays signal, not noise.
  const isVerdict2 = /verdict\s*2|error in ours/i.test(`${what} ${surfaced}`);
  rows.push({
    P,
    pri: Number(P.slice(1)),
    what: strip(what),
    target: strip(target),
    surfacedDate,
    age: ageDays(surfacedDate),
    isVerdict2,
  });
}

if (COUNT_ONLY) {
  console.log(String(rows.length));
  process.exit(0);
}

const shown = P1_ONLY ? rows.filter((r) => r.pri === 1) : rows;

// sort: priority asc, then oldest-surfaced first (largest age first; nulls last)
shown.sort((a, b) => a.pri - b.pri || (b.age ?? -1) - (a.age ?? -1));

const byPri = { 1: [], 2: [], 3: [], 4: [] };
for (const r of shown) byPri[r.pri].push(r);

console.log(`\nOPEN content-backlog rows — ${shown.length} (worst-first)\n`);
for (const p of [1, 2, 3, 4]) {
  const group = byPri[p];
  if (!group.length) continue;
  console.log(`P${p} — ${group.length}`);
  for (const r of group) {
    const age = r.age != null ? `${r.age}d` : '?';
    const when = r.surfacedDate || 'undated';
    console.log(`  • ${truncate(r.what, 110)}`);
    console.log(`      → ${truncate(r.target, 90)}  (surfaced ${when}, ${age} ago)`);
  }
  console.log('');
}

// verdict-2 priority check: "error in ours" must be P1
const misfiled = rows.filter((r) => r.isVerdict2 && r.pri !== 1);
if (misfiled.length) {
  console.log('⚠ VERDICT-2 ROWS NOT AT P1 (an "error in ours" is always P1 — re-prioritise):');
  for (const r of misfiled) console.log(`  • [${r.P}] ${truncate(r.what, 90)}`);
  console.log('');
}
