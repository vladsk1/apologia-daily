/* Product metrics for the admin monitor.
   Reads server-side data from Supabase using the SERVICE ROLE key.
   Honest scope: most engagement (mastery progress, streaks, debate counts,
   Coach signals) lives in each browser's localStorage and never reaches the
   server — so retention/feature-usage must come from PostHog, not here. This
   endpoint reports what IS server-side: registered users and explain sessions.

   Setup: set SUPABASE_SERVICE_ROLE_KEY (Supabase > Project Settings > API) and
   optionally METRICS_SECRET (then call /api/metrics?secret=...). */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  var SECRET = process.env.METRICS_SECRET;
  var provided = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || (req.query.secret || '');
  if (!SECRET || provided !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized — set METRICS_SECRET in env and supply it.' });
  }

  var URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
  var KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  var out = { generated: new Date().toISOString(), metrics: {}, notes: [] };

  if (!KEY) {
    out.notes.push('SUPABASE_SERVICE_ROLE_KEY not set — add it in Vercel env to enable product metrics.');
    return res.status(200).json(out);
  }

  var H = { apikey: KEY, Authorization: 'Bearer ' + KEY };
  var now = Date.now();
  var iso = function (msAgo) { return new Date(now - msAgo).toISOString(); };
  var DAY = 86400000;

  // PostgREST exact-count helper (reads Content-Range header)
  async function count(table, query) {
    try {
      var r = await fetch(URL + '/rest/v1/' + table + '?select=id' + (query ? '&' + query : ''),
        { headers: Object.assign({ Prefer: 'count=exact', Range: '0-0' }, H) });
      var cr = r.headers.get('content-range') || '';
      var n = cr.split('/')[1];
      if (r.ok && n && n !== '*') return parseInt(n, 10);
      if (r.status === 404) return null; // table doesn't exist
      return null;
    } catch (e) { return null; }
  }

  // 1) Registered users (GoTrue admin API)
  try {
    var ur = await fetch(URL + '/auth/v1/admin/users?page=1&per_page=1', { headers: H });
    if (ur.ok) {
      var ud = await ur.json();
      if (typeof ud.total === 'number') out.metrics.total_users = ud.total;
      else out.notes.push('User total not returned by this GoTrue version — see Supabase dashboard for exact count.');
    } else { out.notes.push('Could not read users (status ' + ur.status + ').'); }
  } catch (e) { out.notes.push('User query failed: ' + e.message); }

  // 2) Explain It Back sessions (a real server-side engagement signal)
  var es = await count('explain_sessions');
  if (es !== null) {
    out.metrics.explain_sessions_total = es;
    out.metrics.explain_sessions_7d = await count('explain_sessions', 'created_at=gte.' + iso(7 * DAY));
    out.metrics.explain_sessions_30d = await count('explain_sessions', 'created_at=gte.' + iso(30 * DAY));
  } else {
    out.notes.push('explain_sessions table not found or unreadable.');
  }

  // 3) Coach signals (only present once the coach_signals table is created)
  var cs = await count('coach_signals');
  if (cs !== null) out.metrics.coach_signals_total = cs;

  out.notes.push('Engagement (mastery, streaks, debates, Coach) is stored client-side in localStorage and is not visible here — use PostHog for retention, funnels, and feature usage.');
  return res.status(200).json(out);
}
