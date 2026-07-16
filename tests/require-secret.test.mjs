// The shared cron/webhook secret guard. It replaced 5 hand-rolled copies, one of
// which had drifted to fail OPEN — so its fail-closed behavior is now tested once,
// centrally.
import test from 'node:test';
import assert from 'node:assert/strict';
import { requireSecret } from '../lib/require-secret.js';

function mockRes() {
  return { code: null, body: null, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
}

test('FAILS CLOSED when the secret env var is unset', () => {
  delete process.env.TEST_SECRET_X;
  const res = mockRes();
  const ok = requireSecret({ headers: {}, query: { secret: 'anything' } }, res, { envVars: ['TEST_SECRET_X'] });
  assert.equal(ok, false);
  assert.equal(res.code, 401);
});

test('accepts a matching Bearer token, ?secret=, and custom header', () => {
  process.env.TEST_SECRET_X = 's3cret';
  let res = mockRes();
  assert.equal(requireSecret({ headers: { authorization: 'Bearer s3cret' }, query: {} }, res, { envVars: ['TEST_SECRET_X'] }), true);
  assert.equal(res.code, null);

  res = mockRes();
  assert.equal(requireSecret({ headers: {}, query: { secret: 's3cret' } }, res, { envVars: ['TEST_SECRET_X'] }), true);

  res = mockRes();
  assert.equal(requireSecret({ headers: { 'x-cron-secret': 's3cret' }, query: {} }, res, { envVars: ['TEST_SECRET_X'], headers: ['x-cron-secret'] }), true);
  delete process.env.TEST_SECRET_X;
});

test('rejects a wrong value (401)', () => {
  process.env.TEST_SECRET_X = 's3cret';
  const res = mockRes();
  assert.equal(requireSecret({ headers: {}, query: { secret: 'nope' } }, res, { envVars: ['TEST_SECRET_X'] }), false);
  assert.equal(res.code, 401);
  delete process.env.TEST_SECRET_X;
});

test('allowBearer:false ignores a Bearer token (new-signup contract)', () => {
  process.env.TEST_SECRET_X = 's3cret';
  const res = mockRes();
  const ok = requireSecret({ headers: { authorization: 'Bearer s3cret' }, query: {} }, res, { envVars: ['TEST_SECRET_X'], allowBearer: false });
  assert.equal(ok, false);
  delete process.env.TEST_SECRET_X;
});

test('first non-empty env var wins (fallback chain)', () => {
  delete process.env.PRIMARY_X;
  process.env.FALLBACK_X = 'fb';
  const res = mockRes();
  assert.equal(requireSecret({ headers: {}, query: { secret: 'fb' } }, res, { envVars: ['PRIMARY_X', 'FALLBACK_X'] }), true);
  delete process.env.FALLBACK_X;
});
