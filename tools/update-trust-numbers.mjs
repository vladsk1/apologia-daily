#!/usr/bin/env node
/**
 * update-trust-numbers.mjs — keep the figures on /editorial-standards.html true.
 *
 * That page makes counted claims ("85 deep-dive essays", "132 of 133 source
 * passages verified"). Hand-typed numbers rot: within a month they are wrong,
 * and a page whose whole subject is "we check our work" cannot carry stale
 * numbers — that is the one page where being caught out costs the most.
 *
 * So the figures are COUNTED FROM THE REPO and written into a marked block:
 *     <!-- trust-numbers:start -->  ... generated ...  <!-- trust-numbers:end -->
 *
 * Usage:
 *   node tools/update-trust-numbers.mjs            # rewrite the block
 *   node tools/update-trust-numbers.mjs --check    # CI: fail if stale
 *
 * Only counts things that are independently verifiable from the repository, and
 * deliberately claims nothing about human/pastoral review, which is a separate
 * (and still open) matter — see docs/STATEMENT_OF_FAITH.md.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = path.join(ROOT, 'editorial-standards.html');
const START = '<!-- trust-numbers:start -->';
const END = '<!-- trust-numbers:end -->';

const read = (p) => readFileSync(path.join(ROOT, p), 'utf8');

function counts() {
  // Deep-dive essays (exclude the index and any language mirrors' indexes)
  const essays = globSync('library/*.html', { cwd: ROOT })
    .filter((f) => !/index\.html$/.test(f)).length;

  // Answer pages, and how many carry both gate dates in their provenance
  const answersData = JSON.parse(read('answers/_data.json'));
  const rows = Array.isArray(answersData) ? answersData
    : Object.values(answersData.answers || answersData);
  const answers = rows.filter((a) => a && typeof a === 'object' && a.slug).length;
  const answersReviewed = rows.filter((a) => a && a.reviewed
    && a.reviewed.argument && a.reviewed.orthodoxy).length;

  // Public-domain source passages, and how many are verified word-for-word.
  // Only `verified: true` passages compile into what the live AI may quote.
  const sources = JSON.parse(read('sources-index.json'));
  const srcRows = Array.isArray(sources) ? sources : (sources.passages || sources.entries || []);
  const sourcesTotal = srcRows.length;
  const sourcesVerified = srcRows.filter((s) => s.verified === true).length;

  /* Argument briefs. Count ONLY the gated ones, because that is what the page
     claims ("every one of which cleared both review gates"). briefs-index.json
     lists ALL briefs regardless of gate status — only lib/briefs-verified.js is
     filtered — so counting the index would, the moment an ungated brief is added,
     silently make the page assert a review that had not happened. Mirror the
     build's own predicate rather than trusting the index. */
  const briefs = JSON.parse(read('briefs-index.json'));
  const allBriefs = Array.isArray(briefs) ? briefs : (briefs.briefs || briefs.entries || []);
  const briefRows = allBriefs.filter((b) => b && b.reviewed && b.reviewed.argument && b.reviewed.orthodoxy);

  // Automated tests guarding the whole thing.
  const tests = globSync('tests/*.test.mjs', { cwd: ROOT })
    .map((f) => read(f))
    .reduce((n, src) => n + (src.match(/^\s*test\(/gm) || []).length, 0);

  return { essays, answers, answersReviewed, sourcesTotal, sourcesVerified,
    briefs: briefRows.length, tests };
}

function render(c) {
  // Wording rule: state only what is mechanically true. No claim of human or
  // pastoral sign-off anywhere in here.
  return `${START}
  <ul class="commit">
    <li><strong>${c.essays} deep-dive essays</strong> and <strong>${c.answers} answer pages</strong> published, each carrying a dated record of the reviews it passed &mdash; ${c.answersReviewed} of the ${c.answers} answers record both an argument and an orthodoxy review.</li>
    <li><strong>${c.sourcesVerified} of ${c.sourcesTotal} passages</strong> in our public-domain source library have been checked word-for-word against the original text. Only those may be quoted.</li>
    <li><strong>${c.briefs} argument briefs</strong> &mdash; short summaries of our house framing that the assistant may draw on &mdash; every one of which cleared both review gates before it could be used.</li>
    <li><strong>${c.tests} automated checks</strong> run on every change to the site, alongside a separate scan of every published page of prose against a list of known heterodox phrasings. That scan is a coarse net rather than a judge: it fails the build when a new match appears, so a person has to look.</li>
  </ul>
  ${END}`;
}

const page = readFileSync(PAGE, 'utf8');
const s = page.indexOf(START);
const e = page.indexOf(END);
if (s === -1 || e === -1) {
  console.error(`✗ marker block not found in editorial-standards.html — expected ${START} ... ${END}`);
  process.exit(1);
}

const next = page.slice(0, s) + render(counts()) + page.slice(e + END.length);

if (process.argv.includes('--check')) {
  if (next !== page) {
    console.error('✗ editorial-standards.html figures are stale. Run: node tools/update-trust-numbers.mjs');
    process.exit(1);
  }
  console.log('✓ editorial-standards.html figures match the repository.');
} else {
  writeFileSync(PAGE, next);
  console.log('✓ editorial-standards.html figures updated.');
}
