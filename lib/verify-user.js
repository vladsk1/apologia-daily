/**
 * verify-user.js — resolve the CALLER'S identity from their Supabase access token.
 *
 * Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we are
 * at the Hobby 12-function limit); it is bundled into each endpoint that imports it.
 *
 * WHY THIS SHAPE: destructive, user-scoped endpoints must never accept a user id
 * from the request body — anyone could then delete anyone. The only trustworthy
 * source of "who is calling" is the bearer token, validated by Supabase itself.
 * We call GoTrue's /auth/v1/user with the caller's token rather than verifying a
 * JWT signature locally: it needs no JWT secret, and it honours revocation (a
 * signed-out or deleted user is rejected, where a signature check would still pass
 * until expiry).
 *
 * Returns { id, email } on success, or null on ANY failure — missing header,
 * malformed token, expired/revoked session, network error, or misconfiguration.
 * Callers must treat null as "reject the request" (fail closed).
 */

const SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
// The anon key is a public client key (it is already in the site's HTML); GoTrue
// wants it as the apikey header alongside the caller's bearer token.
const SB_ANON = process.env.SUPABASE_ANON_KEY || '';

/** Extract a bearer token from the Authorization header. */
export function bearerToken(req) {
  const h = (req && req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  const m = /^Bearer\s+(.+)$/i.exec(String(h).trim());
  return m ? m[1].trim() : '';
}

/**
 * Verify the caller's access token. Resolves to { id, email } or null.
 * NEVER returns an id derived from anything the caller could forge.
 */
export async function verifyUser(req) {
  return (await verifyUserResult(req)).user;
}

/**
 * Same check, but distinguishes WHY it failed so the caller can answer honestly:
 *   { user }                          — verified
 *   { user: null, reason: 'unauthenticated' }  — no/!valid/expired token → 401
 *   { user: null, reason: 'unavailable' }      — Supabase unreachable/misconfigured → 503
 *
 * Both failure reasons deny the request (fail closed); they differ only in the
 * message. Telling someone "your session expired, sign in again" during an
 * outage sends them to a login that will also fail.
 */
export async function verifyUserResult(req) {
  const token = bearerToken(req);
  // A Supabase access token is a JWT; reject obvious junk before making a call.
  if (!token || token.length > 4096 || token.split('.').length !== 3) {
    return { user: null, reason: 'unauthenticated' };
  }

  if (!SB_ANON) {
    // Without the anon key GoTrue's gateway may reject every request, which would
    // look exactly like "everyone's session expired". Fail closed, but say so.
    console.error('verify-user: SUPABASE_ANON_KEY is not set — user-authenticated ' +
      'endpoints cannot verify callers. Set it in the Vercel project settings.');
    return { user: null, reason: 'unavailable' };
  }

  try {
    const r = await fetch(SB_URL + '/auth/v1/user', {
      headers: { apikey: SB_ANON, Authorization: 'Bearer ' + token },
      signal: AbortSignal.timeout(8000),
    });
    if (r.status >= 500) return { user: null, reason: 'unavailable' };
    if (!r.ok) return { user: null, reason: 'unauthenticated' };
    const u = await r.json();
    if (!u || typeof u.id !== 'string' || !u.id) return { user: null, reason: 'unauthenticated' };
    return { user: { id: u.id, email: typeof u.email === 'string' ? u.email : null } };
  } catch (e) {
    return { user: null, reason: 'unavailable' };   // network/timeout/parse => fail closed
  }
}
