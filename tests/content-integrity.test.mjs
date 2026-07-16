// Content-pipeline invariants that protect the gates themselves.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runOffline, CASES } from '../tools/test-crisis-routing.mjs';

// Every /answers/* opening must LEAD WITH THE ANSWER — the short-form rule.
// The lint is a curated regex net for known front-loaded-opening tells; it
// exits non-zero (throwing here) if any answer opens by conceding/steelmanning
// before answering. Complements the apologia-argument gate.
test('no answer opens with a front-loaded tell (leads with the answer)', () => {
  assert.doesNotThrow(
    () => execFileSync('node', ['tools/check-answer-openings.mjs'], { cwd: process.cwd(), stdio: 'pipe' }),
    'an /answers/* entry opens front-loaded — run: node tools/check-answer-openings.mjs',
  );
});

// No /answers/* entry may carry an un-reviewed OVER-CONCESSION / unearned symmetry
// toward a rival or heterodox view — in ANY paragraph or the meta subtitle, not
// just the opening. This is the gap that let the "Are Mormons/JWs Christians?"
// concessions ship (they led with the correct "no," so the openings lint passed).
// Complements the apologia-argument/-neutrality/-orthodoxy pull-quote test.
test('no answer carries an over-concession tell (whole answer + meta)', () => {
  assert.doesNotThrow(
    () => execFileSync('node', ['tools/check-answer-concessions.mjs'], { cwd: process.cwd(), stdio: 'pipe' }),
    'an /answers/* entry over-concedes — run: node tools/check-answer-concessions.mjs',
  );
});

// The deterministic crisis backstop in api/ask.js must catch every unmistakable
// first-person crisis phrasing and stay silent on ordinary questions. This
// extracts the LIVE regex from api/ask.js and asserts it against the labeled
// corpus, so a regression in the regex (or its accidental removal) fails CI.
// The full end-to-end classifier path is exercised separately by
// `node tools/test-crisis-routing.mjs --live` (needs the deployed endpoint).
test('crisis backstop regex matches its labeled corpus (deterministic layer)', () => {
  const results = runOffline();
  const failed = results.filter((r) => !r.ok);
  assert.equal(
    failed.length, 0,
    `crisisBackstop misroutes ${failed.length} case(s): ${failed.map((r) => `"${r.msg}"`).join(', ')} — run: node tools/test-crisis-routing.mjs`,
  );
  // Guard against the corpus being gutted to trivially pass.
  assert.ok(CASES.filter((c) => c.backstop).length >= 6, 'crisis corpus lost its backstop-positive cases');
});

// Every content-review stamp must be valid JSON. A stamp with an unescaped inner
// double-quote silently breaks the gate's parser (the 2026-07-14 finding).
test('every content-review stamp parses as valid JSON', () => {
  const files = [
    ...globSync('library/**/*.html'),
    ...globSync('ev-s*.html'),
    'worldviews.html', 'what-we-believe.html', 'api/ask.js',
  ];
  for (const f of files) {
    let txt;
    try { txt = readFileSync(f, 'utf8'); } catch { continue; }
    const m = txt.match(/content-review:\s*(\{.*\})/);
    if (!m) continue; // unstamped is the content-review GATE's job, not this test's
    assert.doesNotThrow(() => JSON.parse(m[1]), `${f}: content-review stamp is not valid JSON`);
  }
});

// api/ask.js is the live AI's guardrail prompt. A future edit must not silently
// gut the non-negotiables. This is a presence check, not a semantic one.
test('api/ask.js retains its core orthodoxy guardrails', () => {
  const ask = readFileSync(new URL('../api/ask.js', import.meta.url), 'utf8').toLowerCase();
  const required = [
    'classical christian orthodoxy',
    'orthodoxy outranks charity',
    'final self-check',
    'salvation through christ alone',
    'begins to exist',        // the Kalam wording rule ("...that BEGINS to exist has a cause")
    'denominational neutrality',
  ];
  for (const s of required) assert.ok(ask.includes(s), `api/ask.js is missing a guardrail: "${s}"`);
});
