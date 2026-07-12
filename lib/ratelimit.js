// Shared per-IP daily rate limit for the Claude-calling API endpoints.
//
// Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we're
// at the Hobby 12-function limit); it's bundled into each endpoint that imports it.
//
// Primary enforcement is a per-(tag, IP)/day counter in Supabase via the
// bump_ask_rate RPC (see docs/ASK_RATE_LIMIT.md). If Supabase is unconfigured or
// the RPC is unreachable / not-yet-migrated, we DEGRADE to a per-instance
// in-memory counter rather than failing open — so these endpoints can never
// become a fully unmetered LLM proxy on the Anthropic bill.

const SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const mem = new Map(); // key -> { day, n }  (per warm serverless instance)

function clientIp(req) {
  return String((req.headers && req.headers['x-forwarded-for']) || '').split(',')[0].trim() || 'unknown';
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
 * Returns true when this request is OVER the daily cap and should be blocked (429).
 * @param cap  max requests per IP per day for this tag
 * @param tag  per-endpoint budget name (so one endpoint can't starve another)
 */
export async function overRateLimit(req, cap = 40, tag = 'ai') {
  const key = tag + ':' + clientIp(req);
  if (SB_KEY) {
    try {
      const r = await fetch(SB_URL + '/rest/v1/rpc/bump_ask_rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
        body: JSON.stringify({ p_ip: key })
      });
      if (r.ok) {
        const n = await r.json();
        if (typeof n === 'number') return n > cap;
      }
      // reachable but unexpected (e.g. RPC not migrated yet) → degrade to memory
    } catch (e) { /* network error → degrade to memory */ }
  }
  return memBump(key) > cap;
}
