#!/usr/bin/env node
/*
 * check-crosscheck-block.mjs — machine guard for the FIVE-SURFACE CROSS-CHECK
 * checklist that every research-library mining note must carry.
 *
 * WHY IT EXISTS. On 2026-09-24 a mining run (Putting Jesus in His Place) ran the
 * mandatory cross-check against the ESSAYS ONLY and shipped. Nothing flagged it —
 * the essay work was real and correct — and the three-surface gap (/answers/*,
 * ev-s*, /briefs+/sources) stayed invisible until the owner asked "did it scan all
 * of them?" and an audit found it hadn't. The three research-library READMEs now
 * require a filled checklist block in every note; this check makes that hard.
 * (2026-09-24: the ev-m* mastery page was added as a sixth surface line — the block
 * heading kept the name "Five-surface cross-check", but six surface boxes are required.)
 *
 * THE CONTRACT. Every research note — docs/{book,video,article}-research/*.md,
 * excluding README.md, INDEX.md and MINING-BRIEF-*.md — that is NOT grandfathered
 * in the baseline must carry a "Five-surface cross-check" block that is COMPLETE:
 *   - the block heading is present;
 *   - all six surface lines are present (library essay, /answers, ev-s card, ev-m mastery, /briefs, /sources);
 *   - every checkbox is CHECKED ("- [x]") — none left "- [ ]" (an unchecked box = an
 *     admitted-unscanned surface, which is the exact failure this guards);
 *   - no template placeholder (<date>, <which…>, <where…>, etc.) still remains.
 *
 * WHAT IT IS NOT. A STRUCTURAL guard, not a judge of whether the cross-check was done
 * HONESTLY — identical in spirit to a content-review stamp. A ticked box you did not
 * earn still passes here; the discipline ("never tick one you didn't") is the only guard
 * against that, exactly as with every stamp on the site.
 *
 * THE BASELINE (tools/crosscheck-baseline.json). Grandfathers the notes that predate the
 * requirement (they did cross-checks, just not in this checkbox format). It is
 * HAND-MAINTAINED: a NEW note must COMPLY, it must not be quietly added to the baseline
 * to make the check pass. Adding a path to "exempt" is a deliberate, reviewable act in the
 * diff — deliberately there is NO `--update` that would auto-grandfather a fresh skip.
 *
 * USAGE
 *   node tools/check-crosscheck-block.mjs          # check (exit 1 on a non-exempt note missing/incomplete)
 *   node tools/check-crosscheck-block.mjs --audit  # list every note with its block status
 *
 * Baseline file: tools/crosscheck-baseline.json
 */

import { readFileSync, existsSync, globSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const BASELINE = 'tools/crosscheck-baseline.json';

const GLOBS = [
  'docs/book-research/*.md',
  'docs/video-research/*.md',
  'docs/article-research/*.md',
];

// The six surface lines the cross-check rule names (ev-m mastery page added 2026-09-24).
// A complete block mentions all six. 'ev-s' = Evidence-tab card, 'ev-m' = mastery page (distinct).
const SURFACE_KEYWORDS = ['library/', '/answers/', 'ev-s', 'ev-m', '/briefs', '/sources'];

// Distinctive fragments of the template's fill-in placeholders. If any survives in the
// block, the block was pasted but not filled. Precise (won't fire on ordinary prose).
const PLACEHOLDERS = ['<date>', '<session>', '<which', '<where', '<list', '<content-backlog'];

export function noteFiles() {
  const set = new Set();
  for (const g of GLOBS) {
    for (const f0 of globSync(g)) {
      const f = f0.replace(/\\/g, '/'); // Windows-portable keys
      const base = f.split('/').pop();
      if (/^(README|INDEX)\.md$/i.test(base)) continue;
      if (/^MINING-BRIEF-/i.test(base)) continue;
      set.add(f);
    }
  }
  return [...set].sort();
}

// The cross-check block: from the heading matching /...surface cross-check/i (count-word
// agnostic — "four-surface"/"five-surface" both match, so an old block heading still parses)
// to the next markdown heading (or EOF). Returns null when there is no such heading.
function blockOf(text) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,6}\s.*surface cross-check/i.test(lines[i])) { start = i; break; }
  }
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join('\n');
}

// Reason the note fails the contract, or null if it passes. `text` should be LF-normalized.
export function violationReason(text) {
  const block = blockOf(text);
  if (block === null) return 'no "Five-surface cross-check" block found';
  const lower = block.toLowerCase();
  const missing = SURFACE_KEYWORDS.filter((k) => !lower.includes(k.toLowerCase()));
  if (missing.length) return `block does not mention surface(s): ${missing.join(', ')}`;
  if (/^\s*-\s*\[\s\]/m.test(block)) return 'block has an UNCHECKED box ("- [ ]") — an admitted-unscanned surface';
  const ph = PLACEHOLDERS.filter((p) => lower.includes(p.toLowerCase()));
  if (ph.length) return `block still contains unfilled template placeholder(s): ${ph.join(', ')}`;
  const checked = (block.match(/^\s*-\s*\[[xX]\]/gm) || []).length;
  if (checked < 6) return `block has only ${checked} checked box(es); expected the 6 surface boxes checked`;
  return null;
}

function exemptSet() {
  if (!existsSync(BASELINE)) return new Set();
  return new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).exempt || []);
}

export function findViolations() {
  const exempt = exemptSet();
  const out = [];
  for (const f of noteFiles()) {
    if (exempt.has(f)) continue;
    const reason = violationReason(readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
    if (reason) out.push({ file: f, reason });
  }
  return out;
}

function main() {
  const arg = process.argv[2];
  const exempt = exemptSet();

  if (arg === '--audit') {
    for (const f of noteFiles()) {
      if (exempt.has(f)) { console.log(`•  ${f}  —  exempt (grandfathered)`); continue; }
      const reason = violationReason(readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
      console.log(`${reason ? '⚠' : '✓'}  ${f}  —  ${reason ? `NEEDS BLOCK — ${reason}` : 'OK — filled cross-check block'}`);
    }
    process.exit(0);
  }

  const violations = findViolations();
  if (violations.length === 0) {
    const total = noteFiles().length;
    console.log(`✓ Cross-check block: ${total - exempt.size} enforced note(s) carry a filled five-surface cross-check block; ${exempt.size} grandfathered.`);
    process.exit(0);
  }

  console.error(`⛔ ${violations.length} research note(s) missing or with an incomplete five-surface cross-check block:\n`);
  for (const { file, reason } of violations) console.error(`  ${file}\n     ${reason}\n`);
  console.error('Fill the checklist block (copy the template from the folder README and answer every surface box),');
  console.error(`or — only for a deliberate, reasoned exception — add the note's path to "exempt" in ${BASELINE}.`);
  process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
