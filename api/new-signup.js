/* New-signup notifier.
   Fired by a Supabase Database Webhook on INSERT into auth.users. Emails the
   founder so new signups land in real time, and (optionally) records a
   server-confirmed signup_completed event in PostHog for the funnel.

   Email is sent via Resend (https://resend.com — free tier ~3k/mo). In Resend
   test mode you can send FROM onboarding@resend.dev TO the email you signed up
   to Resend with, with no domain verification needed.

   Vercel env to set:
     RESEND_API_KEY        (required to actually send email)
     SIGNUP_NOTIFY_TO      (default: vkiparizov@gmail.com)
     SIGNUP_NOTIFY_FROM    (default: "Apologia Daily <onboarding@resend.dev>")
     SIGNUP_HOOK_SECRET    (optional; if set, the webhook must pass it as
                            ?secret=... or header x-signup-secret)
     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (optional; adds running total)
     POSTHOG_KEY, POSTHOG_HOST                (optional; records the event)

   Supabase setup: Database > Webhooks > Create > table auth.users, event
   INSERT, type HTTP Request, URL https://www.apologiadaily.com/api/new-signup
   (add ?secret=... or an x-signup-secret header to match SIGNUP_HOOK_SECRET). */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Shared-secret guard so randoms can't spam the notifier.
  var SECRET = process.env.SIGNUP_HOOK_SECRET;
  if (SECRET) {
    var given = (req.query && req.query.secret) || req.headers['x-signup-secret'] || '';
    if (given !== SECRET) return res.status(401).json({ error: 'Unauthorized' });
  }

  // Parse the Supabase webhook payload: { type, table, record, ... }.
  var body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = {}; }
  body = body || {};
  var record = body.record || body.new_record || {};
  var email = record.email || '(no email on record)';
  var when = record.created_at || new Date().toISOString();
  var userId = record.id || null;

  var notes = [];

  // Optional: running user total (GoTrue admin API), best-effort.
  var total = null;
  var SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
  var SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (SB_KEY) {
    try {
      var ur = await fetch(SB_URL + '/auth/v1/admin/users?page=1&per_page=1',
        { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
      if (ur.ok) { var ud = await ur.json(); if (typeof ud.total === 'number') total = ud.total; }
    } catch (e) { /* non-fatal */ }
  }

  // Send the email via Resend.
  var TO = process.env.SIGNUP_NOTIFY_TO || 'vkiparizov@gmail.com';
  var FROM = process.env.SIGNUP_NOTIFY_FROM || 'Apologia Daily <onboarding@resend.dev>';
  var RESEND = process.env.RESEND_API_KEY;
  var totalLine = (total !== null) ? ('Total users: ' + total) : '';
  if (RESEND) {
    try {
      var subject = '🎉 New signup: ' + email + (total !== null ? ' (#' + total + ')' : '');
      var html =
        '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">' +
        '<h2 style="margin:0 0 8px">New Apologia Daily signup</h2>' +
        '<p style="margin:0"><strong>' + email + '</strong></p>' +
        (totalLine ? '<p style="margin:6px 0;color:#555">' + totalLine + '</p>' : '') +
        '<p style="margin:6px 0;color:#888;font-size:13px">' + when + '</p>' +
        '</div>';
      var r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [TO], subject: subject, html: html })
      });
      if (!r.ok) notes.push('Resend returned status ' + r.status);
    } catch (e) { notes.push('Email send failed: ' + e.message); }
  } else {
    notes.push('RESEND_API_KEY not set — add it in Vercel env to receive signup emails.');
  }

  // Optional: record a server-confirmed signup in PostHog (real account, not just intent).
  var PH_KEY = process.env.POSTHOG_KEY;
  var PH_HOST = process.env.POSTHOG_HOST || 'https://eu.i.posthog.com';
  if (PH_KEY) {
    try {
      await fetch(PH_HOST + '/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: PH_KEY,
          event: 'signup_completed',
          distinct_id: userId || email,
          properties: { email: email, $lib: 'apologia-server' }
        })
      });
    } catch (e) { /* non-fatal */ }
  }

  // Always 200 so the Supabase webhook never enters an error-retry loop.
  return res.status(200).json({ ok: true, email: email, total: total, notes: notes });
}
