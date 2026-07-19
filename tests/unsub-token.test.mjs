// The email one-click unsubscribe link is HMAC-signed (lib/unsub-token.js) so it
// can't be forged to unsubscribe someone else. These lock the sign/verify contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import { unsubToken, unsubUrl, verifyUnsubToken } from '../lib/unsub-token.js';

const SECRET = 'test-cron-secret';
const USER = '3f9a1c2e-0000-4a11-9b22-abc123def456'; // uuid-shaped

test('a freshly signed token verifies', () => {
  const t = unsubToken(USER, SECRET);
  assert.equal(t.length, 64); // sha256 hex
  assert.equal(verifyUnsubToken(USER, t, SECRET), true);
});

test('a tampered token is rejected', () => {
  const t = unsubToken(USER, SECRET);
  const tampered = (t[0] === '0' ? '1' : '0') + t.slice(1);
  assert.equal(verifyUnsubToken(USER, tampered, SECRET), false);
});

test('a token signed for another user does not verify', () => {
  const t = unsubToken(USER, SECRET);
  assert.equal(verifyUnsubToken('someone-else', t, SECRET), false);
});

test('a token signed with a different secret does not verify', () => {
  const t = unsubToken(USER, SECRET);
  assert.equal(verifyUnsubToken(USER, t, 'other-secret'), false);
});

test('missing pieces fail closed (never throw, never pass)', () => {
  const t = unsubToken(USER, SECRET);
  assert.equal(verifyUnsubToken(USER, t, ''), false);
  assert.equal(verifyUnsubToken(USER, '', SECRET), false);
  assert.equal(verifyUnsubToken('', t, SECRET), false);
  assert.equal(verifyUnsubToken(USER, undefined, SECRET), false);
});

test('unsubUrl embeds the user id and a matching token', () => {
  const url = unsubUrl(USER, SECRET);
  const q = new URL(url).searchParams;
  assert.equal(q.get('u'), USER);
  assert.equal(verifyUnsubToken(q.get('u'), q.get('t'), SECRET), true);
});
