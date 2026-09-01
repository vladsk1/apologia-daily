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
const HOME = path.join(ROOT, 'index.html');
const START = '<!-- trust-numbers:start -->';
const END = '<!-- trust-numbers:end -->';
/* The homepage carries the same figures in a compact strip, under its own markers.
   It sits directly after the AI chat, where the "can I trust this?" doubt forms.
   Generated from the SAME counts as the standards page so the two can never
   disagree — a homepage claiming more than its own evidence page is exactly the
   drift this tool exists to prevent. */
const HOME_START = '<!-- trust-strip:start -->';
const HOME_END = '<!-- trust-strip:end -->';

const read = (p) => readFileSync(path.join(ROOT, p), 'utf8');

/* Library pages that vercel.json permanently redirects away. Such a page never
   serves — a visitor asking for it is sent somewhere else — so it is not a
   published essay and must not be counted as one. Reading the redirect table is
   the principled test rather than a hardcoded filename: it stays true the next
   time a page is retired, and it cannot drift out of step with what the site
   actually serves.

   ⚠ This exists because it went wrong. library/legacy.html is a "Coming soon"
   placeholder AND is 301'd to the evidence library, yet it was being counted,
   so the homepage trust strip and editorial-standards.html both advertised 93
   deep-dive essays against a real 92 — on the two pages whose entire subject is
   that we check our work. Caught 2026-09-01 by the orthodoxy gate reviewing an
   ad that quoted the figure. Do NOT "simplify" this back to a bare glob. */
function redirectedLibraryPages() {
  const vercel = JSON.parse(read('vercel.json'));
  return new Set((vercel.redirects || [])
    .map((r) => String(r.source || '').replace(/^\//, ''))
    .filter((s) => /^library\/[^/]+\.html$/.test(s)));
}

function counts() {
  // Deep-dive essays (exclude the index, any language mirrors' indexes, and
  // any page the site redirects away — see redirectedLibraryPages above)
  const retired = redirectedLibraryPages();
  const essays = globSync('library/*.html', { cwd: ROOT })
    .filter((f) => !/index\.html$/.test(f))
    .filter((f) => !retired.has(f.split(path.sep).join('/'))).length;

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
    <li>${c.sourcesVerified === c.sourcesTotal
      ? `<strong>All ${c.sourcesTotal} passages</strong> in our public-domain source library have been checked word-for-word against the original text &mdash; and only checked passages may be quoted. A passage that fails the check is held back or removed rather than published: one was removed in July after the check found its wording spliced together from two different editions.`
      : `<strong>${c.sourcesVerified} of ${c.sourcesTotal} passages</strong> in our public-domain source library have been checked word-for-word against the original text. Only those may be quoted; the rest are held back until they pass.`}</li>
    <li><strong>${c.briefs} argument briefs</strong> &mdash; short summaries of our house framing that the assistant may draw on &mdash; every one of which cleared both review gates before it could be used.</li>
    <li><strong>${c.tests} automated checks</strong> run on every change to the site, alongside a separate scan of every published page of prose against a list of known heterodox phrasings. That scan is a coarse net rather than a judge: it fails the build when a new match appears, so a person has to look.</li>
  </ul>
  ${END}`;
}

function renderHome(c) {
  // Compact strip for index.html. Labels are kept to TWO WORDS deliberately: the
  // first cut used phrases like "Sources verified word-for-word", which wrapped to
  // three lines each and collapsed the row into a full-screen vertical stack on a
  // phone. The qualifying detail ("word-for-word", "before publishing") lives in the
  // note underneath, where it has room. Every figure here is mechanically counted;
  // the "five review stages" claim is the ONLY hard-coded one and it must keep
  // matching the five <li> items in editorial-standards.html's process list.
  return `${HOME_START}
    <div class="stat-item">
      <span class="stat-num">${c.sourcesVerified}</span>
      <span class="stat-lbl">Verified sources</span>
    </div>
    <div class="stat-item">
      <span class="stat-num">${c.essays}</span>
      <span class="stat-lbl">Cited deep dives</span>
    </div>
    <div class="stat-item">
      <span class="stat-num">5</span>
      <span class="stat-lbl">Review stages</span>
    </div>
    <div class="stat-item">
      <span class="stat-num">${c.answers}</span>
      <span class="stat-lbl">Answer pages</span>
    </div>
  ${HOME_END}`;
}

const c = counts();

/** Splice a generated block between markers, or fail loudly if they are missing. */
function splice(file, label, startTag, endTag, body) {
  const src = readFileSync(file, 'utf8');
  const s = src.indexOf(startTag);
  const e = src.indexOf(endTag);
  if (s === -1 || e === -1) {
    console.error(`✗ marker block not found in ${label} — expected ${startTag} ... ${endTag}`);
    process.exit(1);
  }
  return { src, next: src.slice(0, s) + body + src.slice(e + endTag.length) };
}

const targets = [
  { file: PAGE, label: 'editorial-standards.html', ...splice(PAGE, 'editorial-standards.html', START, END, render(c)) },
  { file: HOME, label: 'index.html', ...splice(HOME, 'index.html', HOME_START, HOME_END, renderHome(c)) },
];

const stale = targets.filter((t) => t.next !== t.src);

if (process.argv.includes('--check')) {
  if (stale.length) {
    for (const t of stale) console.error(`✗ ${t.label} figures are stale.`);
    console.error('Run: node tools/update-trust-numbers.mjs');
    process.exit(1);
  }
  console.log(`✓ trust figures match the repository (${targets.map((t) => t.label).join(', ')}).`);
} else {
  for (const t of stale) writeFileSync(t.file, t.next);
  console.log(stale.length
    ? `✓ trust figures updated: ${stale.map((t) => t.label).join(', ')}.`
    : '✓ trust figures already up to date.');
}
