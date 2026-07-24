#!/usr/bin/env node
/* Inject the Active-Reading Layer script include into every English deep-dive essay.
 *
 * Scope: top-level library/*.html that contain <div class="art-body"> (the deep-dive essays).
 * Excludes translated pilots (library/mk/, library/es/) — their reader prompts would be
 * English-mismatched; a translated variant is a follow-up. Excludes non-essays (no .art-body).
 *
 * Idempotent: skips a file that already includes active-reading.js.
 * Usage:
 *   node tools/add-active-reading.mjs            # inject where missing
 *   node tools/add-active-reading.mjs --check    # CI: exit 1 if any qualifying essay lacks it
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'library');
const INCLUDE = '<script src="/library/active-reading.js" defer></script>';
const check = process.argv.includes('--check');

const files = readdirSync(LIB).filter(f => f.endsWith('.html'));
let injected = 0, already = 0, skipped = 0;
const missing = [];

for (const f of files) {
  const path = join(LIB, f);
  let html = readFileSync(path, 'utf8');
  if (!html.includes('class="art-body"')) { skipped++; continue; }   // not a deep-dive essay
  if (html.includes('active-reading.js')) { already++; continue; }   // idempotent
  if (check) { missing.push('library/' + f); continue; }

  const idx = html.lastIndexOf('</body>');
  if (idx === -1) { console.error(`  ! no </body> in ${f} — skipped`); skipped++; continue; }
  html = html.slice(0, idx) + '  ' + INCLUDE + '\n' + html.slice(idx);
  writeFileSync(path, html);
  injected++;
}

if (check) {
  if (missing.length) {
    console.error(`✗ ${missing.length} deep-dive essay(s) missing the active-reading include:`);
    missing.forEach(m => console.error('   ' + m));
    console.error('  run: node tools/add-active-reading.mjs');
    process.exit(1);
  }
  console.log(`✓ Active-reading include present on all ${already} deep-dive essays.`);
} else {
  console.log(`Active-reading include: injected ${injected}, already-present ${already}, non-essay skipped ${skipped}.`);
}
