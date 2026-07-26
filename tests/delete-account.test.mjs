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
 *   3. The auth user is deleted last AND SKIPPED ENTIRELY if any table delete
 *      failed, so a mid-way failure cannot leave an unreachable account with
 *      orphaned personal data. (Deleting last only helps if we actually abort.)
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

// The service-role delete path now requires a UUID-shaped id.
const UID = '11111111-2222-4333-8444-555555555555';

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

  const r = await deleteAccount(UID);
  assert.equal(r.ok, false);
  assert.equal(r.error, 'not_configured');
  assert.deepEqual(calls, [], 'a misconfigured deploy must not half-delete an account');
});

test('deleteAccount: removes app rows, then the auth user last', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  const calls = [];
  globalThis.fetch = async (url, opt) => { calls.push(`${opt.method} ${url}`); return { ok: true, status: 200 }; };

  const r = await deleteAccount(UID);
  assert.equal(r.ok, true);
  assert.ok(calls.every((c) => c.startsWith('DELETE ')), 'only DELETEs may be issued');
  assert.ok(calls.some((c) => c.includes('/rest/v1/user_progress')), 'app rows must be deleted');
  assert.ok(calls.at(-1).includes(`/auth/v1/admin/users/${UID}`),
    'the auth user must be deleted LAST, so a failure cannot orphan personal data');
  assert.ok(calls.filter((c) => c.includes('/rest/v1/')).every((c) => c.includes(UID)),
    'every row delete must be filtered to the verified user');
});

test('deleteAccount: a table absent from THIS project is tolerated', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  // USER_TABLES is deliberately broader than the live schema, so "no such table"
  // (identified by the PostgREST error CODE, not merely a 4xx) must not fail.
  globalThis.fetch = async (url) => (url.includes('coach_signals')
    ? { ok: false, status: 404, json: async () => ({ code: 'PGRST205' }) }
    : { ok: true, status: 200 });
  assert.equal((await deleteAccount(UID)).ok, true);
});

test('deleteAccount: a WRONG COLUMN is never mistaken for an absent table', async () => {
  // The bug this guards: treating any 400/404 as "table absent" means a renamed
  // or mistyped key column returns 400 (42703, undefined_column), every row
  // survives, and the user is told their data was erased. Silent data retention.
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  globalThis.fetch = async (url) => (url.includes('study_plans_progress')
    ? { ok: false, status: 400, json: async () => ({ code: '42703', message: 'column "user_id" does not exist' }) }
    : { ok: true, status: 200 });

  const r = await deleteAccount(UID);
  assert.equal(r.ok, false, 'an undefined-column error must NOT be reported as success');
  assert.ok(r.failed.includes('study_plans_progress'));
});

test('deleteAccount: a failed table delete ABORTS before the auth user is touched', async () => {
  // Deleting the auth user "last" only protects the user if we actually stop.
  // Otherwise the login is destroyed while rows survive: orphaned personal data
  // the user can never reach, and cannot ask us to remove.
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return url.includes('journal_entries')
      ? { ok: false, status: 500, json: async () => ({}) }
      : { ok: true, status: 200 };
  };

  const r = await deleteAccount(UID);
  assert.equal(r.ok, false);
  assert.equal(r.error, 'rows_failed');
  assert.ok(r.failed.includes('journal_entries'));
  assert.ok(!calls.some((c) => c.includes('/auth/v1/admin/users/')),
    'the auth user MUST NOT be deleted when any table delete failed');
});

test('deleteAccount: failure to delete the auth user is fatal', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();
  globalThis.fetch = async (url) => (url.includes('/auth/v1/admin/users/')
    ? { ok: false, status: 500 }
    : { ok: true, status: 200 });
  assert.equal((await deleteAccount(UID)).error, 'auth_delete_failed');
});

test('deleteAccount: a non-UUID id is refused before any delete is issued', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return { ok: true, status: 200 }; };

  const r = await deleteAccount('not-a-uuid');
  assert.equal(r.ok, false);
  assert.equal(r.error, 'bad_user_id');
  assert.deepEqual(calls, [], 'nothing may be deleted for a malformed id');
});

test('deleteAccount: the user id cannot widen the delete filter', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key';
  const deleteAccount = await freshDeleteAccount();

  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return { ok: true, status: 200 }; };

  // Two independent defences. First: an id carrying PostgREST separators (`&`,
  // `,`) is rejected outright by the UUID check, so it never reaches a filter.
  const r = await deleteAccount('abc&select=*,other');
  assert.equal(r.error, 'bad_user_id');
  assert.deepEqual(calls, [], 'an id with query separators must never be sent');

  // Second: the id that IS accepted is URL-encoded into the filter, and the
  // filter is always present and always scoped with eq.
  await deleteAccount(UID);
  const rowDeletes = calls.filter((c) => c.includes('/rest/v1/'));
  assert.ok(rowDeletes.length > 0);
  assert.ok(rowDeletes.every((c) => /=eq\.[0-9a-f-]+$/i.test(c)),
    'every row delete must carry an eq. filter on the user id — never an unfiltered DELETE');
});

test('CORS allows the Authorization header (without it the app cannot delete)', async () => {
  // The delete call sends a bearer token, which forces a preflight. If
  // Access-Control-Allow-Headers omits `authorization`, the browser blocks the
  // request before sending it. Same-origin on the web hides this completely, so
  // it would only surface in the native app — the platform that requires the feature.
  const { applyCors } = await import(LIB('cors.js'));
  const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; }, status() { return this; }, end() { return this; } };
  applyCors({ method: 'OPTIONS', headers: { origin: 'https://localhost' } }, res);

  assert.match(String(headers['Access-Control-Allow-Headers']).toLowerCase(), /authorization/,
    'Authorization must be an allowed request header');
  assert.match(String(headers['Access-Control-Allow-Headers']).toLowerCase(), /content-type/);
});

test('endpoint: only POST reaches the delete route, and the webhook secret cannot trigger it', () => {
  const src = readFileSync(path.join(ROOT, 'api', 'new-signup.js'), 'utf8');

  // Method check precedes the ?do= branch, so GET/DELETE get a 405.
  const methodIdx = src.indexOf("req.method !== 'POST'");
  const doIdx = src.indexOf("=== 'delete-account'");
  assert.ok(methodIdx !== -1 && doIdx !== -1 && methodIdx < doIdx,
    'non-POST requests must be rejected before the delete route');

  // The shared-secret webhook path must never reach deleteAccount: the only call
  // site is inside handleDeleteAccount, which is token-authenticated.
  const calls = src.match(/deleteAccount\(/g) || [];
  assert.equal(calls.length, 1, 'deleteAccount must have exactly one call site');
  const handlerStart = src.indexOf('async function handleDeleteAccount');
  const handlerEnd = src.indexOf('\n}', src.indexOf('return res.status(200).json({ ok: true });'));
  const callIdx = src.indexOf('deleteAccount(user.id)');
  assert.ok(callIdx > handlerStart && callIdx < handlerEnd,
    'the only deleteAccount call must sit inside the token-authenticated handler');
});

test('endpoint: deletion is authenticated by token and never by a body-supplied id', () => {
  const src = readFileSync(path.join(ROOT, 'api', 'new-signup.js'), 'utf8');

  assert.match(src, /verifyUserResult\(req\)/, 'the caller must be identified from their token');
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
