export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const startTime = Date.now();
  const results = {};

  // ── CHECK SUPABASE ──
  try {
    const sbStart = Date.now();
    const sbRes = await fetch(
      'https://noprgxkwniouukmrfozc.supabase.co/rest/v1/devotionals?day_number=eq.1&select=day_number,theme',
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcHJneGt3bmlvdXVrbXJmb3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE1MTUsImV4cCI6MjA5NjEzNzUxNX0.GKmQgpndtaBUcz5SoT9H3bDsqjNSPixJJj4G3BrVkJw',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcHJneGt3bmlvdXVrbXJmb3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE1MTUsImV4cCI6MjA5NjEzNzUxNX0.GKmQgpndtaBUcz5SoT9H3bDsqjNSPixJJj4G3BrVkJw'
        }
      }
    );
    const sbData = await sbRes.json();
    const sbTime = Date.now() - sbStart;
    results.supabase = {
      status: sbRes.ok && sbData && sbData.length > 0 ? 'ok' : 'error',
      ms: sbTime,
      detail: sbRes.ok ? `${sbData.length} row(s) returned` : `HTTP ${sbRes.status}`
    };
  } catch (e) {
    results.supabase = { status: 'error', ms: null, detail: e.message };
  }

  // ── CHECK ANTHROPIC API KEY ──
  try {
    const hasKey = !!process.env.ANTHROPIC_API_KEY;
    results.anthropic_key = {
      status: hasKey ? 'ok' : 'error',
      ms: null,
      detail: hasKey ? 'API key present' : 'ANTHROPIC_API_KEY environment variable missing'
    };
  } catch (e) {
    results.anthropic_key = { status: 'error', ms: null, detail: e.message };
  }

  // ── CHECK API ENDPOINTS (lightweight ping) ──
  // These POSTs actually invoke the LLM endpoints (real token cost). Gate them
  // behind a secret so a public GET /api/health can't be looped to amplify spend.
  // Basic checks above (Supabase + key presence) stay public and free.
  const HSECRET = process.env.HEALTH_SECRET || process.env.METRICS_SECRET;
  const givenSecret = (req.query && req.query.secret) || req.headers['x-health-secret'] || '';
  const runPings = !!HSECRET && givenSecret === HSECRET;

  const endpoints = runPings ? [
    { name: 'ask', path: '/api/ask', body: { question: '__health_check__' } },
    { name: 'tutor', path: '/api/tutor', body: { question: '__health_check__', argument: 'test', category: 'test' } },
    { name: 'debate', path: '/api/debate', body: { message: '__health_check__', opponent: 'atheist', topic: 'test', difficulty: 'gentle', history: [], mode: 'debate' } },
    { name: 'devotional', path: '/api/devotional', body: { verse: 'test', reflection: 'test', userResponse: null } },
    { name: 'feedback', path: '/api/feedback', body: { history: [], opponent: 'atheist', topic: 'test', mode: 'debate' } },
  ] : [];
  if (!runPings) results.endpoints = { status: 'skipped', ms: null, detail: 'LLM endpoint pings require the health secret (?secret= or x-health-secret)' };

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://apologiadaily.com';

  for (const ep of endpoints) {
    try {
      const epStart = Date.now();
      const epRes = await fetch(`${baseUrl}${ep.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ep.body),
        signal: AbortSignal.timeout(8000)
      });
      const epTime = Date.now() - epStart;
      // 200 = working, 400 = health check rejected (endpoint alive), 500 = real error
      const isAlive = epRes.status < 500;
      results[ep.name] = {
        status: isAlive ? 'ok' : 'error',
        ms: epTime,
        detail: `HTTP ${epRes.status}`
      };
    } catch (e) {
      results[ep.name] = { status: 'error', ms: null, detail: e.message };
    }
  }

  const totalMs = Date.now() - startTime;
  const allOk = Object.values(results).every(r => r.status === 'ok' || r.status === 'skipped');

  return res.status(200).json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    total_ms: totalMs,
    checks: results
  });
}
