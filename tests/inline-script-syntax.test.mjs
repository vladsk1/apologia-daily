/**
 * inline-script-syntax.test.mjs
 *
 * Every page on this site ships its behaviour in INLINE <script> blocks. A
 * single syntax error in one of them is silent: the HTML still renders, the
 * page still looks finished, and nothing in CI or in a content review notices.
 * The whole block simply never executes.
 *
 * This was not hypothetical. On 2026-07-28 two mastery pages were found dead:
 *
 *   ev-m-phil2.html    'the name kyrios with YHWH's own oath'   <- unescaped '
 *   ev-m-daniel70.html 'Daniel's 70 Weeks'  (twice)             <- unescaped '
 *
 * On both pages boot(), the Pro gate, the mastery dial, the flashcards, the
 * /api/tutor call and the share-card generator never ran. ev-m-daniel70.html
 * was one of only four mastery pages that CARRIED A REVIEW STAMP — a doctrinal
 * gate had certified a page whose entire interactive layer was inert, because
 * a doctrinal gate reads prose and does not parse JavaScript.
 *
 * Both defects have the same shape: an apostrophe inside a single-quoted
 * string. Sibling pages avoid it by convention (writing "Daniel 7s", "Joels")
 * rather than by enforcement, which is exactly why two slipped through.
 *
 * So this parses — never executes — every inline script on every page, and
 * JSON.parses every application/ld+json block while it is here, since malformed
 * structured data fails just as quietly.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Build outputs and vendored copies are generated from these sources; gating
   the source covers them, and app/www is git-ignored anyway. */
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'app', 'ios', 'android', '_pdfs', 'docs', 'tests',
]);

function htmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) htmlFiles(full, acc);
    else if (entry.endsWith('.html')) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

/* Only <script> blocks with a body: external src="" tags have nothing to parse. */
const INLINE = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

const pages = htmlFiles(ROOT);

test('every page has at least one inline script (the scan is actually finding files)', () => {
  assert.ok(pages.length > 100, `expected the whole site, found ${pages.length} pages`);
});

test('every inline <script> block parses as valid JavaScript', () => {
  const broken = [];

  for (const rel of pages) {
    const html = readFileSync(path.join(ROOT, rel), 'utf8');
    let m, n = 0;

    while ((m = INLINE.exec(html))) {
      n++;
      const attrs = m[1] || '';
      const body = m[2];
      if (!body.trim()) continue;
      if (/type\s*=\s*["'][^"']*json/i.test(attrs)) continue; // handled below
      if (/type\s*=\s*["']module["']/i.test(attrs)) continue; // needs a different parser

      try {
        /* Parses only. vm.Script compiles without running, so the browser
           globals these scripts reference are never touched. */
        new vm.Script(body, { filename: `${rel}#script${n}` });
      } catch (err) {
        broken.push(`${rel} (inline script #${n}): ${err.message}`);
      }
    }
  }

  assert.deepEqual(broken, [],
    `Inline script(s) failed to parse — the whole block is dead on these pages:\n  ${broken.join('\n  ')}\n\n` +
    'The usual cause is an unescaped apostrophe inside a single-quoted string.');
});

test('every application/ld+json block is valid JSON', () => {
  const broken = [];

  for (const rel of pages) {
    const html = readFileSync(path.join(ROOT, rel), 'utf8');
    let m, n = 0;

    while ((m = INLINE.exec(html))) {
      n++;
      if (!/type\s*=\s*["'][^"']*ld\+json/i.test(m[1] || '')) continue;
      if (!m[2].trim()) continue;
      try {
        JSON.parse(m[2]);
      } catch (err) {
        broken.push(`${rel} (ld+json #${n}): ${err.message}`);
      }
    }
  }

  assert.deepEqual(broken, [],
    `Structured data failed to parse — search engines will drop it silently:\n  ${broken.join('\n  ')}`);
});
