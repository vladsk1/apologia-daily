// Shared shared-secret guard for cron / webhook / ops endpoints.
//
// Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we're at
// the Hobby 12-function limit); it's bundled into each endpoint that imports it.
//
// Why this exists: the guard was hand-copied into 5 endpoints with slight
// variations, and one (new-signup.js) drifted to FAIL OPEN when its secret was
// unset. One source of truth = that class of bug can't reappear.
//
// Contract (fail CLOSED): returns true only if a configured secret is present AND
// the caller supplied a matching value. On any failure it sends the 401 and
// returns false. Usage:
//     if (!requireSecret(req, res, { envVars: ['CRON_SECRET'] })) return;

import { timingSafeEqual } from 'node:crypto';

function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  if (A.length !== B.length) return false;       // length leak is unavoidable; content compare is constant-time
  return timingSafeEqual(A, B);
}

/**
 * @param req  the request
 * @param res  the response (a 401 is sent on failure)
 * @param opts.envVars    env var names to read the secret from; first non-empty wins
 * @param opts.headers    extra request headers to accept the secret from (e.g. 'x-cron-secret')
 * @param opts.allowBearer accept `Authorization: Bearer <secret>` (default true)
 * @param opts.allowQuery  accept `?secret=<secret>` (default true)
 * @param opts.message     the 401 error message (default 'Unauthorized')
 * @returns true if authorized; false if a 401 was sent
 */
export function requireSecret(req, res, opts = {}) {
  const {
    envVars = [],
    headers = [],
    allowBearer = true,
    allowQuery = true,
    message = 'Unauthorized',
  } = opts;

  const secret = envVars.map((v) => process.env[v]).find(Boolean);

  const h = (req && req.headers) || {};
  let provided = '';
  if (allowBearer) provided = provided || (h.authorization || '').replace(/^Bearer\s+/i, '');
  for (const name of headers) provided = provided || (h[name] || '');
  if (allowQuery) provided = provided || ((req.query && req.query.secret) || '');
  provided = provided || '';

  // Fail closed: no configured secret, or a missing/mismatched value → deny.
  if (!secret || !safeEqual(provided, secret)) {
    res.status(401).json({ error: message });
    return false;
  }
  return true;
}
