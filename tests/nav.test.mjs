// Guards the nav single-source-of-truth (the 2026-07-16 CI regression: gen-answers
// kept its own copy of the menu, which drifted from sync-nav's canonical CANON).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { CANON } from '../tools/sync-nav.mjs';

test('CANON is the canonical nav (mega menu + Search + Asked & Answered)', () => {
  assert.match(CANON, /adn-has-mega/, 'CANON should be the mega-menu nav');
  assert.match(CANON, /adn-search-link/, 'CANON should include the Search link');
  assert.match(CANON, /Asked &amp; Answered/);
});

test('gen-answers reuses CANON — no duplicated nav that can drift', () => {
  const src = readFileSync(new URL('../tools/gen-answers.mjs', import.meta.url), 'utf8');
  assert.match(src, /import\s*\{\s*CANON\s*\}/, 'gen-answers must import CANON from sync-nav');
  assert.doesNotMatch(src, /<ul class="adn-drop">/, 'gen-answers must NOT hardcode its own nav dropdown');
});

test('sync-nav --check reports zero drift across the corpus', () => {
  // execFileSync throws if the process exits non-zero
  execFileSync('node', ['tools/sync-nav.mjs', '--check'], { cwd: process.cwd(), stdio: 'pipe' });
});
