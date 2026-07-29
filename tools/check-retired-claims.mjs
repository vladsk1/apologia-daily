#!/usr/bin/env node
/*
 * check-retired-claims.mjs — stop a retired argument from surviving somewhere else.
 *
 * THE HOLE THIS CLOSES, and it is not hypothetical.
 *
 * When a certified essay retires an argument, the argument does not only live in
 * the essay. On 2026-07-29 ONE retired Islam argument — the "lexical bridge"
 * (the Qur'an is God's eternal Word; the Qur'an calls Jesus God's Word; therefore
 * Jesus is eternal) — was found alive on SEVEN surfaces:
 *
 *   library/islam-eternalword.html     the essay, which disclaims it in Reply 3
 *                                      and then ran it two paragraphs earlier
 *   ev-m-trinity_islam.html            the mastery page
 *   ev-m-trinity_islam.html  cards[]   the flashcard deck, i.e. the memorised layer
 *   daily-mix.html                     a quiz where it was the GRADED CORRECT ANSWER
 *   worldviews.html          cards 12/13
 *   library/active-reading-data.json   the in-essay reading aid
 *   daily-args.json                    the daily argument feed
 *
 * Every one of those was found because a human or a review agent happened to look.
 * Nothing in CI would have caught any of them. A reader drilling the quiz was being
 * marked WRONG for not reciting an argument the essay had already withdrawn.
 *
 * WHY THE ORTHODOXY TRIPWIRES DON'T COVER IT. check-orthodoxy-tripwires.mjs guards
 * a curated list of HETERODOX phrasings — things that are wrong in themselves. Most
 * retired claims are not heterodox at all. "Stoner's odds", "roughly 300 bishops"
 * and "composite unity" are perfectly orthodox; they are simply things our own
 * certified essays have concluded we should stop saying. Different failure, same
 * shape of fix.
 *
 * HOW IT WORKS. tools/retired-claims.json holds an entry per retired claim: what was
 * retired, why, WHAT TO SAY INSTEAD, the regexes that catch it, and an `allow` list of
 * files where the string may legitimately appear — which is almost always the page
 * doing the retiring, since a page that says "do not claim X" must be allowed to
 * contain X.
 *
 * The `instead` field is the point. A future session that hits a flag needs to fix
 * the sentence correctly, not just delete it — and the reason a claim was retired is
 * exactly the context that is hardest to reconstruct later.
 *
 * Keep `allow` tight. A broad allow silently un-retires the claim, which is worse
 * than no check at all.
 *
 * USAGE
 *   node tools/check-retired-claims.mjs           # report; exit 1 on any hit
 *   node tools/check-retired-claims.mjs --warn    # report only; always exit 0
 *   node tools/check-retired-claims.mjs --list    # print the registry
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WARN_ONLY = process.argv.includes('--warn');
const LIST_ONLY = process.argv.includes('--list');

/* Build outputs and vendored copies are generated from these sources; gating the
   source covers them. docs/ is our own working notes and MUST be scannable text —
   the audit files quote retired claims in order to record that they were retired. */
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'app', 'ios', 'android', '_pdfs', 'docs', 'tests',
]);

/* tools/ is skipped EXCEPT tools/reel/**. The reel scripts and X-card specs are named in
   CLAUDE.md as gated doctrinal content, and they are exactly the compressed, screenshot-first
   layer where a retired claim survives longest — a blanket 'tools' skip made 51 reel specs and
   7 X-card specs invisible to this check (found 2026-07-29). The rest of tools/ is scanner
   baselines and this registry, which quote retired wording in order to catch it. */
const TOOLS_SCANNED_SUBDIR = 'reel';

/* Generated aggregates: they mirror content that is itself scanned, so a hit here is
   a duplicate of a hit at the source and just adds noise to the report. */
const SKIP_FILES = new Set(['search-index.json', 'sources-index.json', 'objections.json']);

function servedFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (path.relative(ROOT, full) === 'tools') {
        const reel = path.join(full, TOOLS_SCANNED_SUBDIR);
        if (existsSync(reel)) servedFiles(reel, acc);
        continue;
      }
      servedFiles(full, acc);
    }
    else if ((entry.endsWith('.html') || entry.endsWith('.json')) && !SKIP_FILES.has(entry)) {
      acc.push(path.relative(ROOT, full));
    }
  }
  return acc;
}

const REGISTRY = path.join(ROOT, 'tools', 'retired-claims.json');
if (!existsSync(REGISTRY)) {
  console.error('✗ tools/retired-claims.json is missing.');
  process.exit(1);
}
const { claims } = JSON.parse(readFileSync(REGISTRY, 'utf8'));

export function findHits(files, readFile) {
  const hits = [];
  for (const claim of claims) {
    const allow = new Set(claim.allow || []);
    for (const pattern of claim.patterns) {
      const re = new RegExp(pattern, 'gi');
      for (const rel of files) {
        if (allow.has(rel)) continue;
        const text = readFile(rel);
        let m;
        re.lastIndex = 0;
        while ((m = re.exec(text))) {
          const start = Math.max(0, m.index - 70);
          hits.push({
            claim, file: rel, match: m[0],
            context: text.slice(start, m.index + m[0].length + 70).replace(/\s+/g, ' ').trim(),
          });
          break; // one hit per file per pattern is enough to act on
        }
      }
    }
  }
  return hits;
}

/* Run the scan only when invoked directly (CLI), not when a test imports findHits.
 * Importing must not kick off the scan -- and must never call process.exit(), which
 * would kill the test runner mid-file. (check-stamp-integrity.mjs carries the same
 * guard; omitting it here silently collapsed the suite from 90 tests to 76.) */
function main() {
  if (LIST_ONLY) {
    console.log(`\nRetired claims registry — ${claims.length} entries\n`);
    for (const c of claims) {
      console.log(`  ${c.id}   (retired ${c.retired})`);
      console.log(`     what:    ${c.what}`);
      console.log(`     instead: ${c.instead}`);
      if ((c.allow || []).length) console.log(`     allowed in: ${c.allow.join(', ')}`);
      console.log('');
    }
    process.exit(0);
  }

  const files = servedFiles(ROOT);
  const cache = new Map();

  /* content-review stamps legitimately QUOTE retired wording — they are the record that
     it was removed ("removed unearned praise… genuine intellectual accomplishment…").
     Scanning them flags every page whose stamp documents a fix, which is backwards. */
  const STAMP = /<!--\s*content-review:[\s\S]*?-->|"reviewed"\s*:\s*\{[\s\S]*?\}/g;

  const read = (rel) => {
    if (!cache.has(rel)) {
      cache.set(rel, readFileSync(path.join(ROOT, rel), 'utf8').replace(STAMP, ' '));
    }
    return cache.get(rel);
  };

  const hits = findHits(files, read);

  if (hits.length === 0) {
    console.log(`✓ Retired claims: ${claims.length} registered, 0 alive on ${files.length} served files.`);
    process.exit(0);
  }

  /* Group by claim, because the whole point is seeing that one retired argument is
     alive on five surfaces rather than reading five unrelated-looking lines. */
  const byClaim = new Map();
  for (const h of hits) {
    if (!byClaim.has(h.claim.id)) byClaim.set(h.claim.id, { claim: h.claim, files: [] });
    byClaim.get(h.claim.id).files.push(h);
  }

  console.error(`\n⚠ ${byClaim.size} retired claim(s) are still alive on ${hits.length} file(s):\n`);
  for (const { claim, files: fs } of byClaim.values()) {
    console.error(`  ${claim.id}   (retired ${claim.retired})`);
    console.error(`     RETIRED:  ${claim.what}`);
    console.error(`     BECAUSE:  ${claim.why}`);
    console.error(`     INSTEAD:  ${claim.instead}`);
    for (const h of fs) {
      console.error(`       • ${h.file}`);
      console.error(`         …${h.context}…`);
    }
    console.error('');
  }
  console.error('Fix each with the INSTEAD wording — do not simply delete the sentence.');
  console.error('If a hit is legitimate (the page is the one retiring the claim), add that');
  console.error('file to the claim\'s "allow" list in tools/retired-claims.json, and keep it tight.\n');

  process.exit(WARN_ONLY ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith('check-retired-claims.mjs')) main();
