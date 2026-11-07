// Shared daily rate limit for the Claude-calling API endpoints — TWO-TIER.
//
// Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we're
// at the Hobby 12-function limit); it's bundled into each endpoint that imports it.
//
// TIERS (2026-11-07): the cap now depends on WHO is calling.
//   • Signed-in  → keyed on the verified user id, a generous PER-PERSON budget.
//   • Anonymous  → keyed on the IP (per-NAT), a small shared budget — enough to
//                  answer a seeker's first questions, not enough to fund abuse.
// A caller is "signed in" only when the request carries a bearer token that
// Supabase verifies (lib/verify-user.js) — a forged/expired token is treated as
// anonymous, so the per-user budget can't be minted by spoofing. The anonymous
// hot path pays NOTHING for this: with no token present we never make the verify
// call. See docs → the owner's notes on the open/free-account model.
//
// Primary enforcement is a per-(tag, principal)/day counter in Supabase via the
// bump_ask_rate RPC (see docs/ASK_RATE_LIMIT.md). If Supabase is unconfigured or
// the RPC is unreachable / not-yet-migrated, we DEGRADE to a per-instance
// in-memory counter rather than failing open — so these endpoints can never
// become a fully unmetered LLM proxy on the Anthropic bill.

import { createHmac } from 'node:crypto';
import { bearerToken, verifyUser } from './verify-user.js';

const SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const mem = new Map(); // key -> { day, n }  (per warm serverless instance)

// Derive the caller's IP from a header the platform sets and the client CANNOT
// forge. On Vercel that is `x-real-ip` (the true client IP). We must NOT trust the
// LEFTMOST `x-forwarded-for` value: an attacker prepends their own XFF, so the
// leftmost entry is caller-controlled — rotating it would mint a fresh rate-limit
// bucket per request and defeat the only cost cap on the LLM endpoints. If XFF is
// the only signal, use its LAST hop (added by the trusted proxy), not the first.
export function clientIp(req) {
  const h = (req && req.headers) || {};
  const real = h['x-real-ip'];
  if (real) return String(real).split(',')[0].trim() || 'unknown';
  const xff = String(h['x-forwarded-for'] || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (xff.length) return xff[xff.length - 1];
  return 'unknown';
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function memBump(key) {
  const day = today();
  const cur = mem.get(key);
  if (!cur || cur.day !== day) { mem.set(key, { day, n: 1 }); return 1; }
  cur.n += 1;
  return cur.n;
}

/**
 * True if the combined size of the user-supplied parts exceeds maxChars.
 * Caps per-request input so a giant payload can't run up token cost even when
 * the caller is under their daily request cap. Strings count by length; arrays/
 * objects (e.g. a debate `messages` array) by their JSON size. Cheap + local —
 * call it before overRateLimit so oversized bodies are rejected without a DB hit.
 */
export function inputTooLong(parts, maxChars) {
  let total = 0;
  for (const p of (Array.isArray(parts) ? parts : [parts])) {
    if (p == null) continue;
    total += typeof p === 'string' ? p.length : JSON.stringify(p).length;
  }
  return total > maxChars;
}

// Neither the IP nor the user id is ever stored as-is: the database key is a keyed
// hash (privacy.html §2), so ask_rate rows cannot be read back into an address or a
// user id. Rotating the salt only resets that day's counts.
function hashKey(s) {
  const salt = process.env.RATE_SALT || process.env.CRON_SECRET || 'apologia-rate-v1';
  return createHmac('sha256', salt).update(String(s)).digest('hex').slice(0, 32);
}
function ipKey(ip) { return hashKey(ip); }
function uidKey(id) { return hashKey('uid:' + id); }

/** Increment the per-(key)/day counter and return the new count. */
async function bump(key) {
  if (SB_KEY) {
    try {
      const r = await fetch(SB_URL + '/rest/v1/rpc/bump_ask_rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
        body: JSON.stringify({ p_ip: key })
      });
      if (r.ok) {
        const n = await r.json();
        if (typeof n === 'number') return n;
      }
      // reachable but unexpected (e.g. RPC not migrated yet) → degrade to memory
    } catch (e) { /* network error → degrade to memory */ }
  }
  return memBump(key);
}

/**
 * Decide whether this request is OVER its daily cap and should be blocked.
 *
 * @param req   the incoming request (for IP + bearer token).
 * @param caps  EITHER a number N (legacy: one cap for everyone, keyed per-user
 *              when signed in else per-IP) OR an object { anon, user } giving the
 *              two tiers. `anon: 0` makes the endpoint sign-in-required.
 * @param tag   per-endpoint budget name (so one endpoint can't starve another).
 * @param resolvedUser  OPTIONAL — a { id } already resolved by the caller
 *              (e.g. an endpoint that verified the token for its own auth gate),
 *              so we don't verify twice. Pass `null` to force the anonymous tier.
 *
 * @returns  false               → allowed
 *           true                → over the daily cap (caller should answer 429)
 *           'sign_in_required'  → anonymous caller on a sign-in-only endpoint
 *                                 (anon cap is 0); caller should answer 401.
 *
 * The anonymous path makes NO network call for verification: with no Authorization
 * header we go straight to the IP tier.
 */
export async function overRateLimit(req, caps = 40, tag = 'ai', resolvedUser) {
  const tiered = caps && typeof caps === 'object';
  const anonCap = tiered ? (Number(caps.anon) || 0) : caps;
  const userCap = tiered ? (Number(caps.user) || 0) : caps;

  // Resolve the caller only when a token is actually present.
  let user = resolvedUser;
  if (user === undefined) user = bearerToken(req) ? await verifyUser(req) : null;

  if (!user && anonCap <= 0) return 'sign_in_required';

  const cap = user ? userCap : anonCap;
  const key = user ? (tag + ':u:' + uidKey(user.id)) : (tag + ':' + ipKey(clientIp(req)));
  return (await bump(key)) > cap;
}
