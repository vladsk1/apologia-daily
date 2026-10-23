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

test('unsubscribe links verify against UNSUB_SECRET or CRON_SECRET, so either can rotate safely', async () => {
  const { verifyUnsubTokenAny, unsubSigningSecret } = await import('../lib/unsub-token.js');
  const env = { UNSUB_SECRET: 'u-secret', CRON_SECRET: 'c-secret' };
  assert.equal(unsubSigningSecret(env), 'u-secret');
  assert.equal(unsubSigningSecret({ CRON_SECRET: 'c-secret' }), 'c-secret');
  assert.ok(verifyUnsubTokenAny(USER, unsubToken(USER, 'u-secret'), env), 'new links');
  assert.ok(verifyUnsubTokenAny(USER, unsubToken(USER, 'c-secret'), env), 'links already in inboxes');
  assert.ok(!verifyUnsubTokenAny(USER, unsubToken(USER, 'other'), env));
  assert.ok(!verifyUnsubTokenAny(USER, unsubToken(USER, 'c-secret'), { UNSUB_SECRET: 'u-secret' }));
});

test('marketing email footers carry the postal address when it is configured', async () => {
  const { postalFooterHtml } = await import('../lib/mail-footer.js');
  assert.equal(postalFooterHtml({}), '');
  assert.match(postalFooterHtml({ EMAIL_POSTAL_ADDRESS: 'PO Box 1, Town <NSW>', EMAIL_SENDER_NAME: 'A & B' }), /A &amp; B &middot; PO Box 1, Town &lt;NSW&gt;/);
  const src = (await import('node:fs')).readFileSync('api/weekly-email.js', 'utf8');
  assert.equal((src.match(/\$\{postalFooterHtml\(\)\}/g) || []).length, 2, 'both email templates (summary + nudge) must include the postal line');
});
