#!/usr/bin/env node
/* Lint: no /answers/* entry may carry an OVER-CONCESSION / unearned symmetry.
 *
 * The companion to check-answer-openings.mjs. That lint guards the FIRST
 * sentence (lead with the answer); this one scans the WHOLE answer — every
 * paragraph AND the `meta` subtitle — for the distinct failure the openings
 * lint structurally cannot see: a concession buried in sentence 2+, the closing
 * paragraph, or the SEO subtitle that grants a rival/heterodox view an unearned
 * symmetry (see "Orthodoxy outranks charity" + the SHORT-FORM ANSWER RULE in
 * CLAUDE.md). This is exactly how the "Are Mormons/JWs Christians?" over-
 * concessions survived: they led with the correct "no," so the openings lint
 * passed them, while "in a warmer, looser sense... it would be ungracious to
 * pretend otherwise" and "love Jesus... grant that warmly" sat later in the body
 * and in the meta, and the semantic catch (the agents' pull-quote test) only
 * runs in periodic sweeps, not on every change.
 *
 * PULL-QUOTE TEST, mechanized: each tell below is a phrase that, screenshotted
 * alone, tends to dignify or grant legitimacy to a heterodox/rival claim. This
 * is a COARSE regex net, NOT a judge — it complements (never replaces) the
 * apologia-argument + apologia-neutrality + apologia-orthodoxy gates, which
 * catch context-dependent over-concession a fixed phrase can't. A clean run does
 * not certify an answer concedes nothing; a FAIL means a high-confidence tell
 * appeared and a human must decide: rewrite (real over-concession) or accept
 * on-record (legitimate — e.g. the phrase is inside an explicit refutation).
 *
 * Baseline allowlist (tools/answer-concessions-baseline.json): slug -> [tells].
 * Fails on any NON-baselined hit so a regression can't ship.
 *
 * Usage:
 *   node tools/check-answer-concessions.mjs            # check (exit 1 on new hit)
 *   node tools/check-answer-concessions.mjs --update   # accept current hits into baseline
 *   node tools/check-answer-concessions.mjs --audit    # show every hit with context
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'answers', '_data.json');
const BASELINE = join(ROOT, 'tools', 'answer-concessions-baseline.json');

// High-confidence over-concession / unearned-symmetry tells. Curated to fire on
// near-certain concessions, not on any charitable word. When one legitimately
// appears inside an explicit refutation, baseline it on-record.
export const TELLS = [
  ['warmer/looser-sense concession', /\bin a (warmer|looser|softer|broader|generous)(,? \w+)? (sense|way)\b/i],
  ['ungracious-to-pretend',          /\bungracious to (pretend|deny|say)\b/i],
  ['grant-that-warmly',              /\bgrant (that|this|it|them|as much)\b[^.]{0,30}\bwarmly\b/i],
  ['grant-warmly (reversed)',        /\bwarmly\b[^.]{0,20}\bgrant\b/i],
  ['parallels-are-real',             /\bparallels are real\b/i],
  ['real-common-ground',             /\breal common ground\b/i],
  ['Christ-focused (of a rival)',    /\bChrist-?focused\b/i],
  ['real-biblical-reasoning',        /\breal biblical reasoning\b/i],
  ['not-baseless',                   /\bnot baseless\b/i],
  ['to-their-credit',                /\bto (their|its) credit\b/i],
  ['deserves-its-due',               /\bdeserves? (its|their) due\b/i],
  ['door-qualifies',                 /\bat your door\b[^.]{0,40}\bqualif/i],
  ['loves-Jesus-and (meta twin)',    /\blove(s)? Jesus and\b/i],
  ['ungracious/unfair-to-deny',      /\b(unfair|uncharitable) to (deny|say|call)\b/i],
];

function hitsFor(text) {
  const out = [];
  for (const [name, re] of TELLS) {
    const m = String(text).match(re);
    if (m) out.push({ name, at: m.index, snippet: String(text).slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' ').trim() });
  }
  return out;
}

export function scan() {
  const answers = JSON.parse(readFileSync(DATA, 'utf8')).answers;
  const results = [];
  for (const a of answers) {
    const body = hitsFor(a.a).map((h) => ({ ...h, field: 'a' }));
    const meta = hitsFor(a.meta || '').map((h) => ({ ...h, field: 'meta' }));
    const all = [...body, ...meta];
    if (all.length) results.push({ slug: a.slug, hits: all });
  }
  return results;
}

const args = new Set(process.argv.slice(2));
const results = scan();

if (args.has('--audit')) {
  if (!results.length) console.log('No over-concession tells anywhere.');
  for (const r of results) {
    console.log(`\n${r.slug}`);
    for (const h of r.hits) console.log(`   [${h.field}] ${h.name}\n      …${h.snippet}…`);
  }
  process.exit(0);
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};

if (args.has('--update')) {
  const next = {};
  for (const r of results) next[r.slug] = [...new Set(r.hits.map((h) => h.name))].sort();
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n');
  const n = Object.values(next).reduce((s, v) => s + v.length, 0);
  console.log(`Baseline written: ${n} accepted concession tell(s) across ${Object.keys(next).length} answer(s).`);
  console.log('Review the diff — each accepted tell should be a defended, in-refutation-context exception.');
  process.exit(0);
}

// A hit is "fresh" if its tell-name is not baselined for that slug.
const fresh = [];
for (const r of results) {
  const allowed = new Set(baseline[r.slug] || []);
  const bad = r.hits.filter((h) => !allowed.has(h.name));
  if (bad.length) fresh.push({ slug: r.slug, hits: bad });
}

if (!fresh.length) {
  const n = Object.values(baseline).reduce((s, v) => s + v.length, 0);
  console.log(`✓ Answer concessions: no un-reviewed over-concession tells${n ? ` (${n} baselined exception[s])` : ''}.`);
  process.exit(0);
}

console.log(`⛔ ${fresh.length} answer(s) carry an un-reviewed OVER-CONCESSION tell (unearned symmetry toward a rival/heterodox view):\n`);
for (const r of fresh) {
  console.log(`  answers/${r.slug}.html`);
  for (const h of r.hits) console.log(`     [${h.field}] ${h.name}: …${h.snippet}…`);
  console.log('');
}
console.log('Fix: rewrite so the concession grants only the OBSERVATION/sincerity, never the frame');
console.log('(concede the fact, withhold the inference); keep the pull-quote test in mind. If a hit is');
console.log('a genuine, defended exception (e.g. inside an explicit refutation), accept it on-record:');
console.log('   node tools/check-answer-concessions.mjs --update   (then commit the baseline diff)');
process.exit(1);
