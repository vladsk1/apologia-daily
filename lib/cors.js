/**
 * cors.js — one place for the CORS headers on the public API endpoints.
 *
 * WHY THIS EXISTS: the header block was hand-copied into 8 handlers, and the
 * copies drifted. Four of them (ask, debate, devotional, feedback) set the
 * headers ONLY inside the `OPTIONS` branch, so the preflight passed but the
 * actual POST response carried no `Access-Control-Allow-Origin`. On the website
 * that goes unnoticed because the page and the API share an origin — but in the
 * native app the page origin is `https://localhost`, so every one of those calls
 * is cross-origin and the WebView blocks the response. That silently killed the
 * app's flagship features (Asked & Answered, Debate Arena, the daily devotional
 * reflection, feedback). Call `applyCors(req, res)` FIRST in every handler, on
 * every method — not just OPTIONS.
 *
 * ORIGIN ALLOWLIST: these endpoints spend Anthropic tokens, so they previously
 * being `*` let any site on the internet drive them from a user's browser. The
 * allowlist below covers the live site, Vercel preview deploys, and the
 * Capacitor app's local origins. A request whose Origin is not recognised gets
 * the canonical site origin back, which is what blocks it client-side.
 *
 * NOTE: `Origin` is trivially spoofable by a non-browser client (curl), so this
 * is a browser-scoping control, not authentication — the rate limiter and the
 * per-endpoint secrets remain the real protections.
 */

const ALLOWED = [
  /^https:\/\/(www\.)?apologiadaily\.com$/,   // production site
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,      // preview deploys
  /^https:\/\/localhost(:\d+)?$/,             // Capacitor iOS/Android (androidScheme/iosScheme: https)
  /^capacitor:\/\/localhost$/,                // Capacitor iOS default scheme
  /^ionic:\/\/localhost$/,                    // older Capacitor/Ionic shells
  /^http:\/\/localhost(:\d+)?$/,              // local development
];

const FALLBACK_ORIGIN = 'https://apologiadaily.com';

/** Resolve the Origin header against the allowlist. */
export function allowedOrigin(req) {
  const origin = (req && req.headers && req.headers.origin) || '';
  return ALLOWED.some((re) => re.test(origin)) ? origin : FALLBACK_ORIGIN;
}

/**
 * Set the CORS headers for this request. Returns true if the request was an
 * OPTIONS preflight and has been fully answered — the caller should return
 * immediately in that case.
 *
 *   export default async function handler(req, res) {
 *     if (applyCors(req, res)) return;
 *     ...
 *   }
 */
export function applyCors(req, res, { methods = 'POST, OPTIONS' } = {}) {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Responses vary by Origin, so caches must not serve one origin's headers to another.
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
