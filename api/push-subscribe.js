/* Stores a browser push subscription so the daily cron can reach it.
   Receives the PushSubscription JSON from the client and upserts it into the
   Supabase `push_subscriptions` table (keyed by endpoint). Service-role only.

   Table (create once in Supabase SQL editor):
     create table if not exists push_subscriptions (
       endpoint text primary key,
       p256dh   text not null,
       auth     text not null,
       created_at timestamptz default now()
     );
*/
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = {}; }
  body = body || {};
  var endpoint = body.endpoint;
  var keys = body.keys || {};
  if (!endpoint || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  var URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
  var KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
  if (!KEY) return res.status(200).json({ ok: false, note: 'SUPABASE_SERVICE_KEY not set' });

  try {
    var r = await fetch(URL + '/rest/v1/push_subscriptions?on_conflict=endpoint', {
      method: 'POST',
      headers: {
        apikey: KEY, Authorization: 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({ endpoint: endpoint, p256dh: keys.p256dh, auth: keys.auth })
    });
    if (!r.ok && r.status !== 409) {
      var t = await r.text();
      return res.status(200).json({ ok: false, status: r.status, note: t.slice(0, 200) });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
