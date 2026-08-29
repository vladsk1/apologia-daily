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
  /^ev-m-.+\.html$/,
  /^worldviews\.html$/,
  /^api\/ask\.js$/,
];
const isGated = (p) => PATTERNS.some((re) => re.test(p));

// A changed diff line is "boilerplate" (ignore) if it is nav markup, the stamp
// itself, a sitemap/OG/meta tag, or pure whitespace. Anything else is treated
// as doctrinal-bearing content.
export function isBoilerplateLine(line) {
  const s = line.slice(1).trim(); // drop the +/-
  if (s === '') return true;
  if (/content-review/.test(s)) return true;
  if (/class="adn-|<nav\b|<\/nav>|adn-links|adn-right|<ul class=|<\/ul>|<li>\s*<a |mega-|adn-mega/.test(s)) return true;
  if (/<meta\b|og:|twitter:|<link\b|rel="canonical"|hreflang/.test(s)) return true;
  // the <title> element is SEO/tab metadata, not doctrinal prose. (JSON-LD is
  // deliberately NOT filtered: the FAQPage schema mirrors the essays' doctrinal
  // FAQ answers, so a schema edit should still trip the flag — bias toward flagging.)
  if (/<title[ >]|<\/title>/.test(s)) return true;
  // ...with ONE structured-data exception, keyed to the schema TYPE rather than
  // to JSON-LD in general. A BreadcrumbList is a trail of page names and URLs
  // (Home / Evidence Library / this page) carrying no argument of any kind — the
  // structured-data twin of the nav markup filtered above. FAQPage, Article and
  // every other type stay flaggable, so the reason JSON-LD is watched at all is
  // untouched.
  //
  // WHY IT EARNS AN EXCEPTION. On 2026-08-29 all 76 outstanding flags traced to
  // ONE commit (d83be712b, "SEO quick wins"), and the offending change in every
  // one of the 76 was a single breadcrumb line — audited per file, 76 breadcrumb
  // lines and 0 unexplained, with not one word of prose altered. Without this
  // rule the next metadata sweep re-flags the same 76, and 76 standing false
  // alarms is how this tool reached 59 unread flags before. A report nobody
  // reads is not a check, and noise is where a real flag hides.
  if (isBreadcrumbOnly(s)) return true;
  // a bare <script> include (site-wide JS enhancement: nav, related, orthonote,
  // active-reading, analytics, supabase CDN) is boilerplate, not doctrinal prose.
  if (/^<script\b[^>]*>\s*<\/script>$|^<script\b[^>]*\bsrc=/.test(s)) return true;
  if (/^<\/?(ul|li|nav|div)[ >]/.test(s)) return true;
  // a line that is ONLY a single anchor element = a nav / menu / footer / crumb
  // link, not doctrinal prose (inline prose links share their line with text).
  if (/^<a\b[^>]*>[^<]*<\/a>[,;]?$/.test(s)) return true;
  // ...and the same thing wrapped in its own <p>: a "Read the quick answer ->"
  // cross-link paragraph is navigation, not doctrine. Tight on purpose — a <p>
  // carrying prose AND a link shares the line with text and still trips the flag.
  if (/^<p\b[^>]*>\s*<a\b[^>]*>[^<]*<\/a>\s*<\/p>$/.test(s)) return true;
  if (isScriptPlumbing(s)) return true;
  return false;
}

/* A JSON-LD line that is a breadcrumb trail and NOTHING else.
 *
 * Deliberately strict on three counts, because this is the only hole in the
 * "all structured data is flaggable" rule and it must not become a doorway:
 *   1. the line must actually be a JSON-LD script, not prose mentioning the word;
 *   2. it must declare BreadcrumbList; and
 *   3. every @type on the line must be BreadcrumbList or its own ListItem
 *      entries — so a graph that bundles a breadcrumb together with FAQPage,
 *      Article or anything else still trips the flag.
 * The only free text a breadcrumb carries is page names, and the <title>
 * element — the same strings — is already exempt two lines above. */
export function isBreadcrumbOnly(s) {
  if (!/<script\b[^>]*application\/ld\+json/.test(s)) return false;
  if (!/"@type":\s*"BreadcrumbList"/.test(s)) return false;
  const types = [...s.matchAll(/"@type":\s*"([^"]+)"/g)].map((m) => m[1]);
  return types.length > 0 && types.every((t) => t === 'BreadcrumbList' || t === 'ListItem');
}

/* ── JS PLUMBING vs DOCTRINE INSIDE AN INLINE <script> ──────────────────────
 *
 * WHY THIS EXISTS. Until 2026-07-29 any changed line inside an inline script
 * counted as doctrinal, so ONE commit (0747dca97 — which only widened a
 * fetch() call to pass the essay body to the tutor) flagged 58 essays at once.
 * The report became 59 entries of noise that nobody reads, and noise is where
 * a real flag hides.
 *
 * WHY NOT JUST EXEMPT SCRIPT BODIES. Because the highest-stakes doctrinal
 * strings on the site live in them. Every mastery page carries ARG_PREMISES
 * (POSTed to /api/tutor as the rubric a reader is GRADED against, and printed
 * into a share-card PNG), a `cards` flashcard deck built for memorisation, and
 * the mock-scorer `checks` miss-text. The 2026-07-29 re-gate found that almost
 * every surviving defect lived in exactly those arrays. Exempting script
 * bodies would blind this tool to the layer it most needs to watch.
 *
 * SO CLASSIFY THE PAYLOAD, NOT THE LOCATION. A line is plumbing when it is
 * recognisably JavaScript AND none of its string literals carries a
 * natural-language sentence. Selectors, URLs, MIME types, header names and
 * short labels are not sentences; a premise, a flashcard answer or a miss-text
 * is. Ties go to flagging, per the file's standing bias. */
const JS_SHAPE = /\b(import|export|require|document|window|localStorage|sessionStorage|JSON|fetch|await|function|return|var|const|let|querySelector|getElementById|addEventListener|classList|textContent|innerHTML)\b|=>|\)\s*;\s*$/;

function stringLiterals(s) {
  const out = [];
  const re = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
  let m;
  while ((m = re.exec(s))) out.push(m[2]);
  return out;
}

/* A sentence, for this purpose: three or more words and long enough to carry a
 * claim. Deliberately generous — 'Evidence Library' (2 words) and '/api/tutor'
 * are not claims; 'the Word was God as to essence' is. */
function looksLikeProse(lit) {
  if (lit.length < 18) return false;
  if (/^(https?:|\/|\.|#)/.test(lit)) return false;        // URL, path, selector
  if (/^[\w-]+\/[\w-]+$/.test(lit)) return false;           // MIME type
  return lit.trim().split(/\s+/).length >= 3;
}

export function isScriptPlumbing(s) {
  if (!JS_SHAPE.test(s)) return false;
  return !stringLiterals(s).some(looksLikeProse);
}

function sh(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }); }
  catch { return ''; }
}

function gatedFiles() {
  const set = new Set();
  for (const g of ['*.html', 'library/**/*.html', 'ev-s*.html', 'ev-m-*.html', 'worldviews.html', 'api/ask.js']) {
    for (const f of globSync(g)) if (isGated(f)) set.add(f);
  }
  return [...set].sort();
}

function main() {
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
}

// Run the scan only when invoked directly (CLI), not when a test imports
// isBoilerplateLine — importing must not kick off the git-history scan.
if (process.argv[1] && process.argv[1].endsWith('check-stamp-integrity.mjs')) main();
