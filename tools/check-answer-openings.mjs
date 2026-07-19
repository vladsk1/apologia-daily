#!/usr/bin/env node
/* Lint: every /answers/* answer must LEAD WITH THE ANSWER.
 *
 * A coarse mechanical net for KNOWN front-loaded-opening tells — charitable
 * throat-clearing or conceding/steelmanning before the question is answered
 * ("It's a fair question," "This is a serious objection," "Let's not soften
 * this," "The honest place to begin is with a concession," etc.). See the
 * SHORT-FORM ANSWER RULE in CLAUDE.md and tools/gen-answers.mjs: the first
 * sentence must answer the question; a front-loaded opening is a defect EVEN
 * WHEN every word is factually accurate — the defect is placement/weight.
 *
 * This is a regex net, NOT a judge. It complements (never replaces) the
 * apologia-argument gate, which catches front-loading the regex can't (e.g.
 * a narrative that builds the skeptic's case without a fixed opening phrase).
 * A clean run here does not certify an opening leads with the answer; a FAIL
 * here means an opening matched a high-confidence front-load tell.
 *
 * Baseline allowlist (tools/answer-openings-baseline.json): a map of
 * slug -> matched-tell for any opening deliberately accepted on-record. Fails
 * on any NON-baselined hit so a regression can't ship.
 *
 * Usage:
 *   node tools/check-answer-openings.mjs            # check (exit 1 on new hit)
 *   node tools/check-answer-openings.mjs --update   # accept current hits into the baseline
 *   node tools/check-answer-openings.mjs --audit    # print every answer's opening sentence
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'answers', '_data.json');
const BASELINE = join(ROOT, 'tools', 'answer-openings-baseline.json');

// High-confidence front-loaded openers, anchored at the START of the answer
// (after trimming). Each almost always means "conceding/throat-clearing before
// answering." Keep this list curated: a tell here should be a near-certain
// front-load, not a phrase that could plausibly begin a lead-with-the-answer.
const TELLS = [
  /^it'?s a fair\b/i,
  /^it is a fair\b/i,
  /^that'?s a fair\b/i,
  /^that is a fair\b/i,
  /^this is a fair\b/i,
  /^this is a (serious|common|deep|hard|difficult|painful)\b/i,
  /^it'?s a common\b/i,
  /^it is a common\b/i,
  /^let'?s not soften\b/i,
  /^let us not soften\b/i,
  /^the honest (place to begin|starting point|answer is)\b/i,
  /^first,? a fair concession\b/i,
  /^fairness to\b/i,
  /^there is a real observation underneath\b/i,
  /^there is real force\b/i,
  /^put at its strongest\b/i,
  /^stated at (its )?full strength\b/i,
  /^honestly,/i,
  /^at first glance\b/i,
  /^start with (an honest|a concession|the honest)\b/i,
  /^it depends what you mean\b/i,
  /^this deserves a careful\b/i,
  /^here'?s the honest form\b/i,
  /^this is one of those questions where\b/i,
  /^as with similar questions\b/i,
  /^this one is usually asked\b/i,
  /^let'?s feel the full weight\b/i,
  /^this is the (hardest|deepest) (form|and)\b/i,
  /^this is a question people feel\b/i,
  /^this is one of the most (serious|forceful|painful|morally serious|difficult|common)\b/i,
  // "Restate the rival's position first" openers — front-loading by naming what the
  // opposing view teaches/claims before giving our answer. (2026-07-18: caught the
  // pre-07-16 Islam + Wave-1/2 answers that opened on the objection instead of leading
  // with the answer — e.g. "Islam teaches that…", "Muslims are often taught…", "The
  // Quran makes a bold move…", "The fairest way to weigh…", "The worry is not that…".)
  /^(islam|muslims?|the qur'?an|the hadith|jehovah'?s witnesses|the watchtower|mormons?|the book of mormon) (teach|teaches|say|says|claim|claims|hold|holds|invite|invites|is often taught|are often taught|make a bold|makes a bold)\b/i,
  /^muslims are (often )?taught\b/i,
  /^the fairest way to\b/i,
  /^the worry is not that\b/i,
];

function openingSentence(a) {
  const first = String(a).split('\n\n')[0].trim();
  const m = first.match(/^[\s\S]*?[.!?](?:\s|$)/);
  return (m ? m[0] : first).trim();
}

const args = new Set(process.argv.slice(2));
const answers = JSON.parse(readFileSync(DATA, 'utf8')).answers;

if (args.has('--audit')) {
  for (const a of answers) console.log(`${a.slug}\n   ${openingSentence(a.a)}\n`);
  process.exit(0);
}

const hits = [];
for (const a of answers) {
  const open = openingSentence(a.a);
  const tell = TELLS.find((re) => re.test(open));
  if (tell) hits.push({ slug: a.slug, tell: String(tell), open });
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};

if (args.has('--update')) {
  const next = {};
  for (const h of hits) next[h.slug] = h.tell;
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n');
  console.log(`Baseline written: ${hits.length} accepted front-loaded opening(s).`);
  console.log('Review the diff — each accepted opening should be a deliberate, defended exception.');
  process.exit(0);
}

const fresh = hits.filter((h) => baseline[h.slug] !== h.tell);
if (fresh.length === 0) {
  const n = Object.keys(baseline).length;
  console.log(`✓ Answer openings: no front-loaded opener tells${n ? ` (${n} baselined exception[s])` : ''}. Every answer leads with the answer.`);
  process.exit(0);
}

console.log(`⛔ ${fresh.length} answer(s) OPEN with a front-loaded tell (concede/steelman before answering):\n`);
for (const h of fresh) {
  console.log(`  answers/${h.slug}.html`);
  console.log(`     opening: "${h.open.slice(0, 140)}${h.open.length > 140 ? '…' : ''}"`);
  console.log(`     tell:    ${h.tell}\n`);
}
console.log('Fix: rewrite the opening to LEAD WITH THE ANSWER (a direct "No —"/"Yes —"/clear');
console.log('assertion); move any brief, fact-bound acknowledgment to AFTER the answer.');
console.log('If an opening is a genuine, defended exception, accept it on-record:');
console.log('   node tools/check-answer-openings.mjs --update   (then commit the baseline diff)');
process.exit(1);
