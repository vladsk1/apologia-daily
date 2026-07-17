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

// The argument-briefs retrieval layer (briefs/ -> lib/briefs-verified.js -> api/ask.js)
// must stay safe: only twice-gated briefs may reach the live module, and the build
// output must be in sync. This is the /sources-style trust boundary for briefs.
test('argument-briefs index is in sync (build is deterministic)', () => {
  assert.doesNotThrow(
    () => execFileSync('node', ['tools/build-briefs-index.mjs', '--check'], { cwd: process.cwd(), stdio: 'pipe' }),
    'briefs build is stale — run: node tools/build-briefs-index.mjs',
  );
});

test('lib/briefs-verified.js contains ONLY twice-gated briefs (no ungated leak to live)', async () => {
  const data = JSON.parse(readFileSync(new URL('../briefs/_data.json', import.meta.url), 'utf8'));
  const { VERIFIED_BRIEFS } = await import('../lib/briefs-verified.js');
  const gatedIds = new Set(
    data.filter((b) => b.reviewed && b.reviewed.argument && b.reviewed.orthodoxy).map((b) => b.id),
  );
  for (const b of VERIFIED_BRIEFS) {
    assert.ok(gatedIds.has(b.id), `ungated brief "${b.id}" leaked into the live module`);
  }
  // Every entry must carry the required fields + a reviewed object (stamped or not).
  for (const b of data) {
    for (const k of ['id', 'topic', 'tags', 'framing', 'from', 'reviewed']) {
      assert.ok(k in b, `brief "${b.id || '?'}" missing "${k}"`);
    }
    assert.ok(b.reviewed && typeof b.reviewed === 'object', `brief "${b.id}" reviewed must be an object`);
  }
});

// The briefs instruction block must keep the framing OPTIONAL and subordinate to the
// guardrails — a future edit must not turn it into a script the model must follow.
test('api/ask.js keeps the argument-brief block optional + guardrail-subordinate', () => {
  const ask = readFileSync(new URL('../api/ask.js', import.meta.url), 'utf8');
  const ask_l = ask.toLowerCase();
  assert.ok(ask.includes('buildBriefsBlock'), 'the briefs block builder is missing');
  assert.ok(ask.includes('retrieveBriefs'), 'brief retrieval is not wired');
  const required = [
    'optional',                       // the framing is optional background
    'ignore it',                      // the model may ignore it
    'never overrides a guardrail',    // guardrails win
    'not a quotable source',          // not to be quoted verbatim
  ];
  for (const s of required) assert.ok(ask_l.includes(s), `briefs block missing its safety instruction: "${s}"`);
});
