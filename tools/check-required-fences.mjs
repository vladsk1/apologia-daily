#!/usr/bin/env node
/*
 * check-required-fences.mjs — compression-parity / required-qualifier guard (check C1).
 *
 * THE FAILURE IT CATCHES is the exact inverse of check-retired-claims.mjs, and it is the
 * single most-recorded failure in this repo's history: a claim is TRUE in the essay because
 * the essay fences it ("the Son was crucified — not that the divine nature died"), and the
 * fence is then dropped when the same claim is compressed into a card, a mastery page, a
 * flashcard, or a daily-arg. The sentence that was safe in context reads as heresy on its
 * own screen. retired-claims catches a BANNED phrase REAPPEARING; this catches a REQUIRED
 * fence GOING MISSING.
 *
 * HOW IT WORKS: tools/required-fences.json lists rules. Each rule names the FILES that make a
 * claim requiring a fence, plus `require` — a set of case-insensitive regexes, at least one of
 * which must appear in each file's served content (prose AND card / ARG_PREMISES script
 * strings both count). The content-review STAMP is stripped first, so a fence only documented
 * in the review comment ("GUARDRAIL HELD: preservation-not-truth") does NOT satisfy the rule —
 * the fence must be in the reader-facing content. A listed file with none of them has dropped
 * the fence → a gap.
 *
 * FALSE-POSITIVE SAFETY (the repo's cardinal rule — a net that cries wolf gets ignored): this
 * is NOT a corpus-wide scan. It only checks the files a rule explicitly lists, so a page that
 * never makes the claim is never asked for the fence. A rule must pass on ALL its listed files
 * with ZERO gaps before it ships (the seed rules do; see required-fences.json's _readme). A
 * genuine fence-free exception is accepted on-record in required-fences-baseline.json.
 *
 * Usage:
 *   node tools/check-required-fences.mjs           # fail on a new missing fence
 *   node tools/check-required-fences.mjs --list     # print every gap (and missing files)
 *   node tools/check-required-fences.mjs --update    # write current gaps to the baseline
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RULES_FILE = join(ROOT, 'tools', 'required-fences.json');
const BASELINE = join(ROOT, 'tools', 'required-fences-baseline.json');

/* A fence only counts when it is in the SERVED content, not merely documented in the
   review stamp. Without this, "GUARDRAIL HELD: preservation-not-truth" sitting in a
   content-review comment would satisfy the rule while the actual prose had dropped the
   fence — the exact false-pass this guard exists to prevent. Strip stamps before matching
   (same shape check-retired-claims.mjs strips). */
const STAMP = /<!--\s*content-review:[\s\S]*?-->|"reviewed"\s*:\s*\{[\s\S]*?\}/g;

// Pure core, unit-testable: given the rules and a reader, return every gap.
// readFile(relPath) -> string | null (null = file does not exist).
// Returns [{rule, file, kind:'missing-fence'|'missing-file', what, instead}].
export function findGaps(rules, readFile) {
  const gaps = [];
  for (const rule of rules) {
    const res = (rule.require || []).map((p) => new RegExp(p, 'i'));
    for (const file of rule.files || []) {
      let text = readFile(file);
      if (text != null) text = text.replace(STAMP, ' ');
      if (text == null) {
        gaps.push({ rule: rule.id, file, kind: 'missing-file',
                    what: rule.what, instead: rule.instead });
        continue;
      }
      if (!res.some((re) => re.test(text))) {
        gaps.push({ rule: rule.id, file, kind: 'missing-fence',
                    what: rule.what, instead: rule.instead });
      }
    }
  }
  return gaps;
}

function loadRules() {
  return JSON.parse(readFileSync(RULES_FILE, 'utf8')).rules || [];
}
function loadBaseline() {
  try { return new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).accepted || []); }
  catch { return new Set(); }
}
const sig = (g) => `${g.rule} :: ${g.file} :: ${g.kind}`;
const readRel = (rel) => {
  const full = join(ROOT, rel);
  return existsSync(full) ? readFileSync(full, 'utf8') : null;
};

function main() {
  const args = process.argv.slice(2);
  const rules = loadRules();
  const gaps = findGaps(rules, readRel);
  const fileCount = new Set(rules.flatMap((r) => r.files || [])).size;

  if (args.includes('--list')) {
    if (!gaps.length) { console.log('No missing fences. Every required qualifier is present.'); return; }
    for (const g of gaps) console.log(`  [${g.rule}] ${g.file} — ${g.kind}: ${g.what}`);
    console.log(`\n${gaps.length} gap(s) across ${rules.length} rule(s).`);
    return;
  }
  if (args.includes('--update')) {
    writeFileSync(BASELINE, JSON.stringify({ accepted: gaps.map(sig).sort() }, null, 2) + '\n');
    console.log(`Baseline updated: ${gaps.length} accepted gap(s).`);
    return;
  }

  const baseline = loadBaseline();
  const fresh = gaps.filter((g) => !baseline.has(sig(g)));
  if (!fresh.length) {
    console.log(`✓ Required fences: ${rules.length} rule(s) over ${fileCount} file(s), every qualifier present.`);
    return;
  }
  console.error(`✗ ${fresh.length} required doctrinal fence(s) are missing from a page that makes the claim:\n`);
  for (const g of fresh) {
    if (g.kind === 'missing-file') {
      console.error(`  [${g.rule}] ${g.file} — FILE NOT FOUND (rule mis-scoped, or file moved/renamed)`);
    } else {
      console.error(`  [${g.rule}] ${g.file} — dropped the fence`);
      console.error(`      claim:  ${g.what}`);
      console.error(`      fix:    ${g.instead}`);
    }
  }
  console.error('\nRestore the fence (do NOT drop the claim quietly — a reader memorises this surface).');
  console.error('If this file genuinely no longer makes the claim, remove it from the rule\'s `files`.');
  console.error('Accept a deliberate, defensible exception on-record with:');
  console.error('  node tools/check-required-fences.mjs --update');
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
