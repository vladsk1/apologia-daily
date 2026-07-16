// Content-pipeline invariants that protect the gates themselves.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';

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
