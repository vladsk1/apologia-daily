export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Access control: this endpoint exposes production deploy metadata + function
  // error logs, so it must never be public. Require LOGS_SECRET (fall back to the
  // shared METRICS_SECRET so ops only manages one secret). Fail CLOSED if unset.
  const SECRET = process.env.LOGS_SECRET || process.env.METRICS_SECRET;
  const provided = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || (req.query.secret || '');
  if (!SECRET || provided !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized — set LOGS_SECRET (or METRICS_SECRET) in env and supply it as ?secret= or a Bearer token.' });
  }

  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token) {
    return res.status(200).json({
      error: 'VERCEL_ACCESS_TOKEN not set',
      setup_instructions: 'Go to Vercel Dashboard > Settings > Tokens > Create token, then add it as environment variable VERCEL_ACCESS_TOKEN in your project settings.',
      deployments: [],
      function_errors: []
    });
  }

  const results = { deployments: [], function_errors: [], error: null };

  try {
    // ── GET RECENT DEPLOYMENTS ──
    const deplRes = await fetch(
      'https://api.vercel.com/v6/deployments?limit=5&target=production',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (deplRes.ok) {
      const deplData = await deplRes.json();
      results.deployments = (deplData.deployments || []).map(d => ({
        uid: d.uid,
        url: d.url,
        state: d.state,
        created: d.created,
        meta: d.meta || {},
        ready: d.ready
      }));

      // ── GET FUNCTION LOGS FROM LATEST DEPLOYMENT ──
      if (results.deployments.length > 0) {
        const latestUid = results.deployments[0].uid;

        try {
          const logsRes = await fetch(
            `https://api.vercel.com/v3/deployments/${latestUid}/events?limit=50&direction=backward`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              signal: AbortSignal.timeout(8000)
            }
          );

          if (logsRes.ok) {
            const logsText = await logsRes.text();
            // Events come as newline-delimited JSON
            const lines = logsText.split('\n').filter(Boolean);
            const events = lines.map(line => {
              try { return JSON.parse(line); } catch(e) { return null; }
            }).filter(Boolean);

            // Filter to errors and warnings only
            results.function_errors = events
              .filter(e => e.type === 'stderr' || (e.text && (
                e.text.toLowerCase().includes('error') ||
                e.text.toLowerCase().includes('failed') ||
                e.text.toLowerCase().includes('exception') ||
                e.text.toLowerCase().includes('unhandled') ||
                e.text.toLowerCase().includes('500')
              )))
              .slice(0, 20)
              .map(e => ({
                type: e.type || 'log',
                text: e.text || e.payload?.text || '',
                created: e.created,
                level: e.type === 'stderr' ? 'error' : 'warning'
              }));
          }
        } catch (logErr) {
          results.log_note = 'Build events fetched — runtime logs require Vercel Pro';
        }
      }
    } else {
      const errText = await deplRes.text();
      results.error = `Vercel API error: ${deplRes.status} — ${errText.slice(0, 200)}`;
    }
  } catch (e) {
    results.error = e.message;
  }

  return res.status(200).json(results);
}
