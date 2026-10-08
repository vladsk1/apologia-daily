// Shared HMAC helper for one-click email unsubscribe links.
// The token is HMAC-SHA256(userId). It is keyed by UNSUB_SECRET when that is set,
// and by CRON_SECRET otherwise. Verification accepts EITHER, so:
//   - adding UNSUB_SECRET does not break links already sitting in inboxes, and
//   - once UNSUB_SECRET is set, CRON_SECRET can be rotated without breaking new links.
// (Old links signed with a rotated-away CRON_SECRET stop working; that is why the
// separate secret exists.) Used by api/weekly-email.js (builds links) and
// lib/handle-unsubscribe.js (verifies them). No secret is stored in this file.
import crypto from 'node:crypto';

const SITE = 'https://apologiadaily.com';

export function unsubToken(userId, secret) {
  return crypto.createHmac('sha256', String(secret)).update(String(userId)).digest('hex');
}

/** The secret new links are signed with, or '' if none is configured. */
export function unsubSigningSecret(env = process.env) {
  return env.UNSUB_SECRET || env.CRON_SECRET || '';
}

export function unsubUrl(userId, secret) {
  return `${SITE}/api/unsubscribe?u=${encodeURIComponent(userId)}&t=${unsubToken(userId, secret)}`;
}

export function verifyUnsubToken(userId, token, secret) {
  if (!userId || !token || !secret) return false;
  const a = Buffer.from(String(token));
  const b = Buffer.from(unsubToken(userId, secret));
  if (a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(a, b); } catch (e) { return false; }
}

/** True if the token was signed with UNSUB_SECRET or CRON_SECRET. */
export function verifyUnsubTokenAny(userId, token, env = process.env) {
  return [env.UNSUB_SECRET, env.CRON_SECRET].some((s) => s && verifyUnsubToken(userId, token, s));
}
