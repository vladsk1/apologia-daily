/* Guards the CRISIS BACKSTOP wiring — see lib/crisis.js and CLAUDE.md's
 * PASTORAL CARE exception.
 *
 * WHY THIS FILE EXISTS. tools/test-crisis-routing.mjs already checks that the
 * regex matches the right phrases; tests/content-integrity.test.mjs runs it. But
 * a correct regex is worth nothing if an endpoint never calls it, and that was
 * the actual state of the site until 2026-08-10: the pattern lived inline in
 * api/ask.js and FIVE other free-text endpoints had no crisis path at all —
 * /api/tutor (the ask box on library/*.html and the Explain It Back grader on all
 * 67 ev-m-*.html pages), /api/debate (personas told never to break character),
 * /api/devotional (a reflection box whose job is to ask a warm follow-up),
 * /api/feedback (journal coaching + the debate transcript), and
 * /api/submit-question (a form that answered a cry for help with a thank-you).
 *
 * Nothing failed when that was true. These cases fail if it becomes true again.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { isCrisis, CRISIS_REPLY, crisisPattern } from '../lib/crisis.js';
import { checkEndpointsWired, GUARDED_ENDPOINTS, CRISIS_EXEMPT } from '../tools/test-crisis-routing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('every free-text endpoint imports AND calls the shared crisis guard', () => {
  // checkEndpointsWired() enumerates api/*.js from DISK, so a new endpoint that
  // reads user text is caught here the moment it is added. Do not replace this
  // with a hand-written list — a list checks itself, which is how devotional.js
  // and feedback.js were missed on this change's own first pass.
  const rows = checkEndpointsWired().filter((r) => r.needsGuard);
  assert.ok(rows.length >= 6, `expected at least 6 guarded endpoints, found ${rows.length}`);
  for (const r of rows) {
    assert.ok(r.imports, `${r.endpoint} does not import the crisis guard from lib/crisis.js`);
    assert.ok(r.calls, `${r.endpoint} imports the crisis guard but never calls it`);
  }
});

test('every crisis exemption carries a written reason', () => {
  for (const [file, reason] of Object.entries(CRISIS_EXEMPT)) {
    assert.equal(typeof reason, 'string');
    assert.ok(reason.length > 20, `api/${file} is exempt without a real reason`);
  }
});

test('the six known free-text endpoints are all in scope', () => {
  // Named explicitly so silently narrowing readsFreeText() cannot quietly drop one.
  for (const f of ['ask.js', 'tutor.js', 'debate.js', 'devotional.js', 'feedback.js', 'submit-question.js']) {
    assert.ok(GUARDED_ENDPOINTS.includes(f), `api/${f} fell out of the guarded set`);
  }
});

test('no endpoint keeps a private copy of the pattern', () => {
  // A second inline copy is how the two drift apart: a phrase gets added to one
  // and not the other, and nothing reports it. lib/crisis.js is the only home.
  for (const f of GUARDED_ENDPOINTS) {
    const src = readFileSync(join(ROOT, 'api', f), 'utf8');
    assert.ok(
      !/kill myself\|killing myself/.test(src),
      `api/${f} contains an inline copy of the crisis pattern — it must use lib/crisis.js`
    );
  }
});

test('the guard runs before the key check, the rate limit and the model call', () => {
  // Wiring alone is not enough: isCrisis() called AFTER the !apiKey 500 means a
  // dead key returns 500 to a crisis message — which is the one failure mode a
  // constant reply exists to survive — and called after overRateLimit means a
  // stranger sharing a NAT can make it return a bare 429. Both were true until
  // 2026-08-10, while the comments claimed otherwise.
  const firstIdx = (src, re) => { const m = src.match(re); return m ? m.index : Infinity; };
  for (const r of checkEndpointsWired().filter((x) => x.needsGuard)) {
    const src = readFileSync(join(ROOT, r.endpoint), 'utf8');
    // Skip the import line when locating the first call site.
    const body = src.replace(/^import .*$/gm, (m) => ' '.repeat(m.length));
    const guard = Math.min(
      firstIdx(body, /\b(isCrisis|anyCrisis)\s*\(/),
      firstIdx(body, /\.(some|every|filter|map)\s*\(\s*(isCrisis|anyCrisis)\s*\)/)
    );
    assert.ok(Number.isFinite(guard), `${r.endpoint}: no crisis call site found`);
    // ⚠ A CALL SITE IS NOT A RETURN. api/ask.js computed `const crisisBackstop =
    // isCrisis(question)` first and then fell through to a bare 500 and a bare
    // 429 anyway, because the flag was only consumed much later by the classifier
    // fall-through — and an offset-only assertion PASSED it. That is false
    // assurance inside the file written to prevent false assurance. Require the
    // endpoint to actually answer with CRISIS_REPLY, and require that answer to
    // precede the key check, the rate limit and the model call.
    const reply = firstIdx(body, /CRISIS_REPLY/);
    assert.ok(Number.isFinite(reply), `${r.endpoint}: never returns CRISIS_REPLY`);
    // Measure against the FAILURE RETURNS, not against the variable reads. The
    // reply legitimately sits inside the `if (!apiKey)` branch on api/ask.js —
    // there it IS the answer to the failed key check. What must never precede it
    // is a bare error response or a model call.
    for (const [label, re] of [
      ['the model call', /api\.anthropic\.com/],
      ['the bare 500 for a missing key', /res\.status\(500\)\.json\(\{\s*error:\s*'API key not configured'/],
      ['the bare 429 for rate limiting', /res\.status\(429\)\.json/],
    ]) {
      const at = firstIdx(body, re);
      if (!Number.isFinite(at)) continue;   // endpoint has no such branch
      assert.ok(guard < at, `${r.endpoint}: crisis guard runs AFTER ${label}`);
      assert.ok(reply < at, `${r.endpoint}: crisis REPLY comes after ${label} — a flag set early is not a guard`);
    }
    // And the guard itself must still precede the rate-limit decrement.
    const rl = firstIdx(body, /overRateLimit\s*\(/);
    if (Number.isFinite(rl)) {
      assert.ok(guard < rl, `${r.endpoint}: crisis guard runs AFTER the rate-limit decrement`);
    }
  }
});

test('isCrisis catches first-person crisis phrasing', () => {
  for (const msg of [
    'I want to kill myself',
    "I don't want to be alive anymore",
    'I feel suicidal',
    'Should I stop taking my medication and just pray?',
    'I keep wanting to hurt myself',
    "There's no reason to live",
  ]) assert.ok(isCrisis(msg), `missed: ${msg}`);
});

test('isCrisis catches curly apostrophes as well as straight ones', () => {
  // iOS and macOS substitute U+2019 by default, so /don'?t/ silently missed the
  // phone-typed form — the majority of our traffic — while a straight-quote test
  // corpus passed. Any apostrophe added to the pattern must accept both.
  assert.ok(isCrisis('I don\u2019t want to be alive'), 'curly apostrophe not matched');
  assert.ok(isCrisis("I don't want to be alive"), 'straight apostrophe not matched');
  assert.ok(isCrisis('i DON\u2019T WANT TO LIVE'), 'curly + case not matched');
});

test('the reply does not presume the writer is the person at risk', () => {
  // parents.html wraps input as 'My child is N years old and asked me: "..."',
  // so the likeliest true positive there is a THIRD party. Without this the reply
  // is addressed to the wrong person at the worst possible moment — and it is
  // also what keeps the two known false positives ("do people who commit suicide
  // go to hell?", asked by the bereaved) from being actively cruel.
  assert.match(CRISIS_REPLY, /writing about someone else/i);
});

test('isCrisis does not fire on ordinary apologetics questions', () => {
  for (const msg of [
    'How do I answer the problem of evil?',
    'Why does God allow suffering?',
    'Did Jesus really rise from the dead?',
    "How can I talk to a friend who's lost their faith?",
  ]) assert.ok(!isCrisis(msg), `false positive: ${msg}`);
});

test('isCrisis never throws on non-string input', () => {
  // The endpoints pass whatever arrived in the request body, which may be
  // anything at all. A throw here would 500 the endpoint on a crisis message.
  for (const v of [undefined, null, 0, {}, [], true]) {
    assert.equal(typeof isCrisis(v), 'boolean');
  }
});

test('the pattern is case-insensitive and not global', () => {
  assert.ok(crisisPattern.flags.includes('i'));
  // A /g regex is stateful across .test() calls — alternating hit/miss on the
  // same input. That would make crisis routing intermittent.
  assert.ok(!crisisPattern.flags.includes('g'), 'crisis pattern must not be global');
});

test('the reply refers to real human help, not to the tool', () => {
  assert.match(CRISIS_REPLY, /findahelpline\.com/);
  assert.match(CRISIS_REPLY, /emergency services/i);
  assert.match(CRISIS_REPLY, /pastor|priest|counsellor/i);
  // The certified PASTORAL CARE block in api/ask.js explicitly rules out lines
  // that centre the tool's own feelings — they imply it is the support needed.
  assert.ok(!/I'?m so glad you told me|I want to sit with you/i.test(CRISIS_REPLY));
  // And it must not answer the apologetics question it displaced.
  assert.ok(!/\b(evidence|argument for|proves|therefore)\b/i.test(CRISIS_REPLY));
});

test('the crisis reply is classified as the crisis route by the live harness', async () => {
  const { classifyAnswer } = await import('../tools/test-crisis-routing.mjs');
  assert.equal(classifyAnswer(CRISIS_REPLY), 'crisis');
});
