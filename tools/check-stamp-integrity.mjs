#!/usr/bin/env node
/*
 * check-stamp-integrity.mjs — catch content that was edited AFTER its
 * content-review stamp without being re-gated.
 *
 * THE HOLE THIS CLOSES. A file can be certified (argument + orthodoxy gates run,
 * `content-review` stamp dated), then later hand-edited while the stamp is left
 * untouched — so the gate certifies a version that no longer exists. This bit
 * the answer pages before (visible text edited, other copies stale). The
 * content-review CI gate only checks that CHANGED files are *stamped*; it does
 * not notice that a stamp is now *older than* the doctrinal content it vouches
 * for.
 *
 * HOW IT AVOIDS FALSE ALARMS. Gated pages legitimately get touched by non-
 * doctrinal passes — nav syncs, OG-tag sweeps, sitemap link updates. Those must
 * NOT trip the check. So for each gated file we find the last commit that
 * changed the stamp line, then inspect every later commit that touched the file:
 * if a later commit changed only nav / boilerplate / the stamp itself, it is
 * ignored; if it changed real prose lines, the file is flagged as
 * "edited after certification — re-gate and re-stamp."
 *
 * This is a heuristic (line-level, not semantic). It is deliberately biased
 * toward flagging: a false positive costs a glance; a false negative ships
 * un-reviewed doctrine.
 *
 * USAGE
 *   node tools/check-stamp-integrity.mjs           # report; exit 1 if any file is stale
 *   node tools/check-stamp-integrity.mjs --warn     # report only; always exit 0
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const WARN_ONLY = process.argv.includes('--warn');

// Files that carry an inline content-review stamp (answers/* have their own
// generator gate; reel specs use a JSON field and are low-churn — HTML/JS here).
const PATTERNS = [
  /^library\/(?!index\.html$).+\.html$/,
  /^ev-s\d[a-z0-9.]*\.html$/,
  /^worldviews\.html$/,
  /^api\/ask\.js$/,
];
const isGated = (p) => PATTERNS.some((re) => re.test(p));

// A changed diff line is "boilerplate" (ignore) if it is nav markup, the stamp
// itself, a sitemap/OG/meta tag, or pure whitespace. Anything else is treated
// as doctrinal-bearing content.
function isBoilerplateLine(line) {
  const s = line.slice(1).trim(); // drop the +/-
  if (s === '') return true;
  if (/content-review/.test(s)) return true;
  if (/class="adn-|<nav\b|<\/nav>|adn-links|adn-right|<ul class=|<\/ul>|<li>\s*<a |mega-|adn-mega/.test(s)) return true;
  if (/<meta\b|og:|twitter:|<link\b|rel="canonical"|hreflang/.test(s)) return true;
  if (/^<\/?(ul|li|nav|div)[ >]/.test(s)) return true;
  // a line that is ONLY a single anchor element = a nav / menu / footer / crumb
  // link, not doctrinal prose (inline prose links share their line with text).
  if (/^<a\b[^>]*>[^<]*<\/a>[,;]?$/.test(s)) return true;
  return false;
}

function sh(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }); }
  catch { return ''; }
}

function gatedFiles() {
  const set = new Set();
  for (const g of ['*.html', 'library/**/*.html', 'ev-s*.html', 'worldviews.html', 'api/ask.js']) {
    for (const f of globSync(g)) if (isGated(f)) set.add(f);
  }
  return [...set].sort();
}

const flagged = [];
for (const file of gatedFiles()) {
  // last commit that touched the stamp line
  const stampCommit = sh(`git log -n1 --format=%H -G content-review -- "${file}"`).trim();
  if (!stampCommit) continue; // no stamped history (unstamped is the content-review gate's job)

  // commits that touched the file strictly after the stamp commit
  const range = sh(`git log --format=%H ${stampCommit}..HEAD -- "${file}"`).trim();
  if (!range) continue;
  const laterCommits = range.split('\n').filter(Boolean);

  const offending = [];
  for (const c of laterCommits) {
    const diff = sh(`git show --format= --unified=0 ${c} -- "${file}"`);
    const changed = diff.split('\n').filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l));
    if (changed.some((l) => !isBoilerplateLine(l))) {
      const subj = sh(`git show -s --format=%s ${c}`).trim();
      offending.push({ c: c.slice(0, 9), subj });
    }
  }
  if (offending.length) flagged.push({ file, offending });
}

if (flagged.length === 0) {
  console.log('✓ Stamp integrity: no gated file has doctrinal edits after its content-review stamp.');
  process.exit(0);
}

console.error(`⚠ ${flagged.length} gated file(s) appear edited AFTER their content-review stamp (doctrinal lines changed with no re-stamp):\n`);
for (const f of flagged) {
  console.error(`  ${f.file}`);
  for (const o of f.offending) console.error(`     ${o.c}  ${o.subj}`);
  console.error('');
}
console.error('Re-run the argument + orthodoxy gates on each, then bump the content-review stamp date.');
console.error('(If a flagged commit is genuinely non-doctrinal, it is safe to re-stamp with the same review.)');
process.exit(WARN_ONLY ? 0 : 1);
