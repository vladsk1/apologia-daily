#!/usr/bin/env node
/*
 * check-orthodoxy-tripwires.mjs — whole-corpus regression guard for known
 * heterodox phrasings.
 *
 * WHAT IT IS (and is NOT). This is a coarse, high-recall/low-precision net that
 * scans EVERY live page (not just changed files) for a curated set of phrases
 * that are heterodox when written in the site's OWN voice — "the Word was a
 * god" (John 1:1 / NWT), "Jesus became God," "we worship the same God" (of
 * Allah), modalist "God is one person," works-salvation, universalism-as-
 * certain, etc. It is NOT a doctrinal judge — the apologia-orthodoxy agent is.
 * Regex cannot tell "we affirm X" from "our opponents claim X, and here is why
 * they are wrong." Our pages refute these very heresies constantly, so a naive
 * scan would be almost all false positives.
 *
 * HOW IT STAYS USEFUL: a BASELINE ALLOWLIST. On `--update`, every current match
 * is recorded as an accepted occurrence (the corpus is already agent-gated, so
 * today's matches are legitimate refutation/attribution context). Thereafter the
 * check fails ONLY on a match that is not in the baseline — i.e. a NEWLY
 * introduced heterodox phrase. That turns a noisy scanner into a precise
 * "no new heterodox phrasing may appear without human review" gate: when a new
 * match appears, a human either fixes it (real drift) or, if it is legitimate
 * new refutation context, re-runs `--update` to accept it (which is itself an
 * on-record, reviewable act in the diff).
 *
 * USAGE
 *   node tools/check-orthodoxy-tripwires.mjs            # check vs baseline (exit 1 on new match)
 *   node tools/check-orthodoxy-tripwires.mjs --update   # regenerate the baseline allowlist
 *   node tools/check-orthodoxy-tripwires.mjs --list     # show all current matches w/ context
 *
 * Baseline file: tools/orthodoxy-tripwires-baseline.json
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';
import { createHash } from 'node:crypto';

const BASELINE = 'tools/orthodoxy-tripwires-baseline.json';

// Curated tripwire patterns. Each is heterodox IN THE SITE'S OWN VOICE.
// `note` explains the concern; matches in refutation/attribution/orthonote
// context are expected and get absorbed into the baseline.
const PATTERNS = [
  { name: 'jw-john-1-1', re: /\bthe Word was a god\b/gi,
    note: 'JW/NWT John 1:1 mistranslation — legit only when quoting to refute.' },
  { name: 'jesus-became-god', re: /\bJesus (?:became|was made|turned into) (?:a )?god\b/gi,
    note: 'Adoptionism/apotheosis in own voice.' },
  { name: 'god-was-a-man', re: /\bGod (?:was once|used to be|had been) a man\b/gi,
    note: 'Mormon exaltation teaching — reject in own voice.' },
  { name: 'man-becomes-god', re: /\b(?:men|man|humans|we|you) (?:can |will |may )?become gods?\b/gi,
    note: 'Exaltation/theosis-as-becoming-a-god — reject in own voice (guard vs Orthodox theosis language, which is baseline-able).' },
  { name: 'same-god-allah', re: /\b(?:we|christians) worship the same god\b/gi,
    note: '"Same God" as Allah affirmed in own voice.' },
  { name: 'modalism-one-person', re: /\bGod is (?:only )?one person\b/gi,
    note: 'Modalism — one person in three modes.' },
  { name: 'modalism-modes', re: /\b(?:three|3) (?:modes|masks|manifestations) of (?:the one )?god\b/gi,
    note: 'Modalism — modes/masks of God.' },
  { name: 'jesus-not-god', re: /\bJesus is not (?:god|divine|the one god)\b/gi,
    note: 'Denial of Christ deity — legit only as attributed opponent view.' },
  { name: 'jesus-created', re: /\bJesus (?:is|was) (?:a )?created (?:being|thing)\b/gi,
    note: 'Arianism — Christ as creature.' },
  { name: 'works-salvation', re: /\b(?:saved|salvation) by (?:your |our )?(?:own )?(?:good )?works\b/gi,
    note: 'Works-salvation affirmed in own voice.' },
  { name: 'earn-salvation', re: /\bearn (?:your|our|their|his|her) (?:own )?salvation\b/gi,
    note: 'Works-salvation.' },
  { name: 'universalism-certain', re: /\b(?:everyone|all people|all souls) (?:will|are|shall) (?:be )?saved\b/gi,
    note: 'Universalism asserted as certain.' },
  { name: 'all-paths', re: /\ball (?:paths|religions|roads) lead to god\b/gi,
    note: 'Religious pluralism in own voice.' },
  { name: 'divine-nature-died', re: /\bthe divine nature (?:died|suffered|perished)\b/gi,
    note: 'Patripassianism/theopaschism.' },
];

// Scan set: every live HTML page that carries doctrinal content.
const GLOBS = [
  '*.html',
  'library/**/*.html',
  'answers/*.html',
  'ev-s*.html',
  'worldviews.html',
];

function files() {
  const set = new Set();
  for (const g of GLOBS) for (const f of globSync(g)) {
    if (/\/index\.html$/.test(f) || f === 'index.html') continue; // link hubs, not prose
    set.add(f);
  }
  return [...set].sort();
}

// Strip <script>/<style> so JS/CSS strings don't trip patterns.
function textOf(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
             .replace(/<style[\s\S]*?<\/style>/gi, ' ');
}

function ctxKey(file, name, m, text, idx) {
  const start = Math.max(0, idx - 40), end = Math.min(text.length, idx + m.length + 40);
  const ctx = text.slice(start, end).replace(/\s+/g, ' ').trim().toLowerCase();
  const h = createHash('sha1').update(ctx).digest('hex').slice(0, 12);
  return { key: `${file}||${name}||${h}`, ctx };
}

function scan() {
  const hits = [];
  for (const file of files()) {
    const text = textOf(readFileSync(file, 'utf8'));
    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(text)) !== null) {
        const { key, ctx } = ctxKey(file, p.name, m[0], text, m.index);
        hits.push({ file, pattern: p.name, match: m[0], note: p.note, key, ctx });
        if (m.index === p.re.lastIndex) p.re.lastIndex++; // zero-width guard
      }
    }
  }
  return hits;
}

const arg = process.argv[2];
const hits = scan();

if (arg === '--list') {
  for (const h of hits) console.log(`${h.file}\n   [${h.pattern}] "${h.match}"  …${h.ctx}…\n`);
  console.log(`\n${hits.length} total match(es) across ${new Set(hits.map((h) => h.file)).size} file(s).`);
  process.exit(0);
}

if (arg === '--update') {
  const baseline = { generated: 'run `--update` to refresh', keys: [...new Set(hits.map((h) => h.key))].sort() };
  writeFileSync(BASELINE, JSON.stringify(baseline, null, 2) + '\n');
  console.log(`Baseline written: ${baseline.keys.length} accepted occurrence(s) across ${new Set(hits.map((h) => h.file)).size} file(s).`);
  console.log('Review the diff — each key is an accepted (legitimate refutation/attribution) occurrence.');
  process.exit(0);
}

// default: check vs baseline
if (!existsSync(BASELINE)) {
  console.error(`No baseline at ${BASELINE}. Run:  node tools/check-orthodoxy-tripwires.mjs --update`);
  process.exit(2);
}
const allow = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).keys);
const novel = hits.filter((h) => !allow.has(h.key));

if (novel.length === 0) {
  console.log(`✓ Orthodoxy tripwires: ${hits.length} known occurrence(s), 0 new. No un-reviewed heterodox phrasing introduced.`);
  process.exit(0);
}

console.error(`⛔ ${novel.length} NEW heterodox-pattern match(es) not in the baseline — review each:\n`);
for (const h of novel) {
  console.error(`  ${h.file}`);
  console.error(`     [${h.pattern}] "${h.match}"`);
  console.error(`     concern: ${h.note}`);
  console.error(`     context: …${h.ctx}…\n`);
}
console.error('If a match is REAL doctrinal drift, fix the wording and re-run.');
console.error('If it is legitimate new refutation/attribution context, accept it on-record:');
console.error('   node tools/check-orthodoxy-tripwires.mjs --update   (then commit the baseline diff)');
process.exit(1);
