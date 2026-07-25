// lib/parse-body.js is the shared defensive request-body parser for the
// Claude-calling API endpoints. It must ALWAYS return a plain object so the
// endpoint's own field validation runs (clean 400) instead of a TypeError on
// destructuring an undefined/string body (a generic 500). These cases pin that
// contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBody } from '../lib/parse-body.js';

test('parseBody returns {} for a missing/undefined/null body (no throw)', () => {
  assert.deepEqual(parseBody({}), {});                 // req.body undefined
  assert.deepEqual(parseBody({ body: undefined }), {});
  assert.deepEqual(parseBody({ body: null }), {});
  assert.deepEqual(parseBody(undefined), {});           // no req at all
});

test('parseBody parses a JSON string body', () => {
  assert.deepEqual(parseBody({ body: '{"question":"hi"}' }), { question: 'hi' });
});

test('parseBody returns {} for a non-JSON / malformed string body', () => {
  assert.deepEqual(parseBody({ body: 'not json' }), {});
  assert.deepEqual(parseBody({ body: '' }), {});
});

test('parseBody passes an already-parsed object body through unchanged', () => {
  const obj = { question: 'hi', argument: 'kalam' };
  assert.equal(parseBody({ body: obj }), obj);
});

test('parseBody never throws (the whole point — clean 400, never a 500)', () => {
  for (const b of [undefined, null, 0, false, 'x', '{bad', [], {}]) {
    assert.doesNotThrow(() => parseBody({ body: b }));
    assert.equal(typeof parseBody({ body: b }), 'object');
  }
});
