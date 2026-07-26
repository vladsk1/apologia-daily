import { requireSecret } from '../lib/require-secret.js';
import { applyCors } from '../lib/cors.js';
import { verifyUser } from '../lib/verify-user.js';
import { deleteAccount } from '../lib/delete-account.js';
import { parseBody } from '../lib/parse-body.js';
import { overRateLimit } from '../lib/ratelimit.js';

/* Delete the CALLER'S OWN account and all their data (Apple Guideline 5.1.1(v);
   Google Play has the same requirement). See lib/delete-account.js.

   The identity comes solely from the verified access token — a user id in the
   body is ignored, so this cannot be pointed at someone else's account. */
async function handleDeleteAccount(req, res) {
  // Cheap abuse guard before any auth work (deletion attempts should be rare).
  if (await overRateLimit(req, 20, 'delete-account')) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const user = await verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not signed in, or your session has expired.' });
  }

  // Typed confirmation, so a stray POST (or a mis-wired button) cannot erase an
  // account. The UI asks the user to type DELETE.
  const body = parseBody(req);
  if (body.confirm !== 'DELETE') {
    return res.status(400).json({ error: 'Confirmation required.' });
  }

  const result = await deleteAccount(user.id);

  if (!result.ok) {
    // Never claim success we did not achieve: a user told "deleted" when data
    // remains has been misled about their own privacy.
    console.error('delete-account failed', { error: result.error, failed: result.failed });
    return res.status(500).json({
      error: 'We could not complete the deletion. Nothing has been partially removed that we can leave in place — please contact hello@apologiadaily.com and we will finish it manually.',
    });
  }

  return res.status(200).json({ ok: true });
}
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
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  /* ---- Account lifecycle: DELETION (?do=delete-account) ------------------
     Folded into this endpoint rather than added as api/delete-account.js
     because Vercel's Hobby plan caps the project at 12 serverless functions
     and we are at the cap (same reason push.js and weekly-email.js route by
     ?do=). This is the other end of the lifecycle this file already handles.

     NOTE THE DIFFERENT AUTH MODEL: the signup notifier below is a Supabase
     webhook guarded by a SHARED SECRET. Deletion is a USER action, so it is
     authenticated by the caller's own access token and must NEVER fall through
     to the shared-secret path — hence the early return. */
  if ((req.query && req.query.do) === 'delete-account') {
    return handleDeleteAccount(req, res);
  }

  // Shared-secret guard so randoms can't spam the notifier. FAIL CLOSED: if the
  // secret is not configured, reject — never leave this world-writable (matches
  // push.js / weekly-email.js). An unset secret must not skip the check.
  if (!requireSecret(req, res, { envVars: ['SIGNUP_HOOK_SECRET'], headers: ['x-signup-secret'], allowBearer: false })) return;

  // Parse the Supabase webhook payload: { type, table, record, ... }.
  var body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = {}; }
  body = body || {};
  var record = body.record || body.new_record || {};
  var email = record.email || '(no email on record)';
  var when = record.created_at || new Date().toISOString();
  var userId = record.id || null;
  var kind = (body.event === 'confirmed') ? 'confirmed' : 'created';

  var notes = [];

  // Optional: running user total (GoTrue admin API), best-effort.
  var total = null;
  var SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
  var SB_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
  if (SB_KEY) {
    try {
      var ur = await fetch(SB_URL + '/auth/v1/admin/users?page=1&per_page=1',
        { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
      if (ur.ok) { var ud = await ur.json(); if (typeof ud.total === 'number') total = ud.total; }
    } catch (e) { /* non-fatal */ }
  }

  // Escape record-derived fields before templating into the notification HTML —
  // `email`/`when` come from the (untrusted) webhook payload, so an attacker-set
  // value must not inject markup into the founder's inbox.
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // Send the email via Resend.
  var TO = process.env.SIGNUP_NOTIFY_TO || 'vkiparizov@gmail.com';
  var FROM = process.env.SIGNUP_NOTIFY_FROM || 'Apologia Daily <onboarding@resend.dev>';
  var RESEND = process.env.RESEND_API_KEY;
  var totalLine = (total !== null) ? ('Total users: ' + total) : '';
  if (RESEND) {
    try {
      var subject = (kind === 'confirmed' ? '✅ Email confirmed: ' : '🎉 New signup: ') + email + (total !== null ? ' (#' + total + ')' : '');
      var html =
        '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">' +
        '<h2 style="margin:0 0 8px">' + (kind === 'confirmed' ? 'Email confirmed' : 'New Apologia Daily signup') + '</h2>' +
        '<p style="margin:0"><strong>' + esc(email) + '</strong></p>' +
        (totalLine ? '<p style="margin:6px 0;color:#555">' + esc(totalLine) + '</p>' : '') +
        '<p style="margin:6px 0;color:#888;font-size:13px">' + esc(when) + '</p>' +
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
          event: (kind === 'confirmed' ? 'email_confirmed' : 'signup_completed'),
          distinct_id: userId || email,
          properties: { email: email, $lib: 'apologia-server' }
        })
      });
    } catch (e) { /* non-fatal */ }
  }

  // Always 200 so the Supabase webhook never enters an error-retry loop.
  return res.status(200).json({ ok: true, email: email, total: total, notes: notes });
}
