/* Guards the CRISIS BACKSTOP wiring — see lib/crisis.js and CLAUDE.md's
 * PASTORAL CARE exception.
 *
 * WHY THIS FILE EXISTS. tools/test-crisis-routing.mjs already checks that the
 * regex matches the right phrases; tests/content-integrity.test.mjs runs it. But
 * a correct regex is worth nothing if an endpoint never calls it, and that was
 * the actual state of the site until 2026-08-10: the pattern lived inline in
 * api/ask.js and the other three free-text endpoints — /api/tutor (72 pages,
 * including the problem-of-evil page and parents.html), /api/debate (personas
 * told never to break character), /api/submit-question (a standalone form that
 * answered a cry for help with a canned thank-you) — had no crisis path at all.
 *
 * Nothing failed when that was true. These cases fail if it becomes true again.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { isCrisis, CRISIS_REPLY, crisisPattern } from '../lib/crisis.js';
import { checkEndpointsWired, GUARDED_ENDPOINTS } from '../tools/test-crisis-routing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('every free-text endpoint imports AND calls the shared crisis guard', () => {
  const rows = checkEndpointsWired();
  assert.equal(rows.length, GUARDED_ENDPOINTS.length);
  for (const r of rows) {
    assert.ok(r.imports, `${r.endpoint} does not import isCrisis from lib/crisis.js`);
    assert.ok(r.calls, `${r.endpoint} imports isCrisis but never calls it`);
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
