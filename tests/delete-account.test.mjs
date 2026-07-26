/**
 * delete-account.test.mjs — guards the account-deletion path.
 *
 * This code is DESTRUCTIVE and irreversible, and it runs with the Supabase
 * service-role key, so the invariants below are the difference between "a user
 * deletes their own account" and "anyone deletes anyone's account":
 *
 *   1. Identity comes only from a verified access token; every failure mode of
 *      that verification (missing, malformed, expired, network error) yields
 *      null, and callers must reject.
 *   2. With no service-role key configured, NOTHING is deleted and the result
 *      reports failure — never a false "your data is gone".
 *   3. The auth user is deleted last, so a mid-way failure cannot leave an
 *      unreachable account with orphaned personal data.
 *   4. The user id is URL-encoded into the PostgREST filter, so it cannot be
 *      used to widen the delete.
 *
 * The endpoint is exercised through the library modules (lib/verify-user.js and
 * lib/delete-account.js) rather than the HTTP handler, so no network is needed.
 */
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = (f) => path.join(ROOT, 'lib', f);

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });
beforeEach(() => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';
});

/* Each import needs a fresh module instance because the service-key lookup is
   read at call time from env — the cache-busting query keeps the cases isolated. */
let seq = 0;
const freshDeleteAccount = async () => (await import(LIB('delete-account.js') + '?t=' + (++seq))).deleteAccount;

test('verifyUser: a valid token resolves to the token owner', async () => {
  const { verifyUser } = await import(LIB('verify-user.js'));
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ id: 'user-123', email: 'a@b.c' }) });
  const u = await verifyUser({ headers: { authorization: 'Bearer aaa.bbb.ccc' } });
  assert.equal(u.id, 'user-123');
});

test('verifyUser: every failure mode fails closed (null)', async () => {
  const { verifyUser } = await import(LIB('verify-user.js'));

  globalThis.fetch = async () => { throw new Error('should not be called'); };
  assert.equal(await verifyUser({ headers: {} }), null, 'missing Authorization header');
  assert.equal(await verifyUser({ headers: { authorization: 'Bearer nope' } }), null,
    'a malformed token must be rejected without a network call');

  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({}) });
  assert.equal(await verifyUser({ headers: { authorization: 'Bearer aaa.bbb.ccc' } }), null,
    'expired or revoked session');

  globalThis.fetch = async () => { throw new Error('network down'); };
  assert.equal(await verifyUser({ headers: { authorization: 'Bearer aaa.bbb.ccc' } }), null,
    'network failure must not be treated as success');
});

test('deleteAccount: without a service key it deletes NOTHING and reports failure', async () => {
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_KEY;
  const deleteAccount = await freshDeleteAccount();

  const calls = [];
  globalThis.fetch = async (url, opt) => { calls.push(`${opt.method} ${url}`); return { ok: true, status: 200 }; };

  const r = await deleteAccount('user-123');
  assert.equal(r.ok, false);
  assert.equal(r.error, 'not_configured');
  assert.deepEqual(calls, [], 'a misconfigured deploy must not half-delete an account');
});

test('deleteAccount: removes app rows, then the auth user last', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  const calls = [];
  globalThis.fetch = async (url, opt) => { calls.push(`${opt.method} ${url}`); return { ok: true, status: 200 }; };

  const r = await deleteAccount('user-123');
  assert.equal(r.ok, true);
  assert.ok(calls.every((c) => c.startsWith('DELETE ')), 'only DELETEs may be issued');
  assert.ok(calls.some((c) => c.includes('/rest/v1/user_progress')), 'app rows must be deleted');
  assert.ok(calls.at(-1).includes('/auth/v1/admin/users/user-123'),
    'the auth user must be deleted LAST, so a failure cannot orphan personal data');
  assert.ok(calls.filter((c) => c.includes('/rest/v1/')).every((c) => c.includes('user-123')),
    'every row delete must be filtered to the verified user');
});

test('deleteAccount: a missing table is tolerated, a real error is reported', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  globalThis.fetch = async (url) => (url.includes('coach_signals') ? { ok: false, status: 404 } : { ok: true, status: 200 });
  assert.equal((await deleteAccount('user-123')).ok, true, 'a table absent from this project is not an error');

  globalThis.fetch = async (url) => (url.includes('flashcards') ? { ok: false, status: 500 } : { ok: true, status: 200 });
  const r = await deleteAccount('user-123');
  assert.equal(r.ok, false, 'a server error must not be reported as a completed deletion');
  assert.ok(r.failed.includes('flashcards'));

  globalThis.fetch = async (url) => (url.includes('/auth/v1/admin/users/') ? { ok: false, status: 500 } : { ok: true, status: 200 });
  assert.equal((await deleteAccount('user-123')).error, 'auth_delete_failed');
});

test('deleteAccount: the user id cannot widen the delete filter', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  const calls = [];
  globalThis.fetch = async (url, opt) => { calls.push(url); return { ok: true, status: 200 }; };
  await deleteAccount('abc&select=*');

  assert.ok(calls.every((c) => !c.includes('abc&select=*')), 'the id must not be interpolated raw');
  assert.ok(calls.some((c) => c.includes('abc%26select')), 'the id must be URL-encoded');
});

test('endpoint: deletion is authenticated by token and never by a body-supplied id', () => {
  const src = readFileSync(path.join(ROOT, 'api', 'new-signup.js'), 'utf8');

  assert.match(src, /verifyUser\(req\)/, 'the caller must be identified from their token');
  assert.match(src, /deleteAccount\(user\.id\)/,
    'deletion must use the VERIFIED user id — never one taken from the request body');
  assert.ok(!/deleteAccount\((body|req\.body)/.test(src),
    'a body-supplied user id would let anyone delete anyone');
  assert.match(src, /body\.confirm !== 'DELETE'/, 'a typed confirmation is required');
  assert.match(src, /overRateLimit\(/, 'the destructive route must be rate limited');

  // The signup notifier is webhook/shared-secret authed; the delete route is user
  // authed. The delete branch must return before ever reaching the secret gate.
  const deleteIdx = src.indexOf("=== 'delete-account'");
  const secretIdx = src.indexOf('requireSecret(req, res');
  assert.ok(deleteIdx !== -1 && secretIdx !== -1 && deleteIdx < secretIdx,
    'the user-authed delete route must be handled before the shared-secret path');
});
