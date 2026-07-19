// Shared HMAC helper for one-click email unsubscribe links.
// The token is HMAC-SHA256(userId) keyed by CRON_SECRET (already a required
// server secret), so an unsubscribe link is unforgeable WITHOUT any new env var
// and WITHOUT a new DB table. Used by api/weekly-email.js (builds links) and
// api/unsubscribe.js (verifies them). No secret is stored in this file — the key
// is passed in from process.env at call time.
import crypto from 'node:crypto';

const SITE = 'https://apologiadaily.com';

export function unsubToken(userId, secret) {
  return crypto.createHmac('sha256', String(secret)).update(String(userId)).digest('hex');
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
