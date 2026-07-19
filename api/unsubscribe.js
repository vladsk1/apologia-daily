// api/unsubscribe.js — public, token-gated email opt-out (no login required).
//
// Security: the link carries an HMAC token (see lib/unsub-token.js) keyed by
// CRON_SECRET, so it cannot be forged to unsubscribe someone else. The opt-out
// is stored in the user's app_metadata.email_unsubscribed — service-role only,
// NOT client-writable — and api/weekly-email.js skips anyone who has it.
//
// GET  -> a confirmation page with a button, so email link-scanners that pre-
//         fetch the URL cannot silently unsubscribe anyone.
// POST -> performs the opt-out. Both the confirm button and RFC 8058 one-click
//         ("List-Unsubscribe-Post: List-Unsubscribe=One-Click") land here.
import { verifyUnsubToken } from '../lib/unsub-token.js';

const SB_URL = 'https://noprgxkwniouukmrfozc.supabase.co';

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Apologia Daily</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f8f7f4;color:#0a1628;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:1.5rem}
.card{background:#fff;border:1px solid #e8e2d8;border-radius:10px;max-width:460px;padding:2.25rem;text-align:center;box-shadow:0 8px 30px rgba(10,22,40,.06)}
h1{font-size:1.3rem;margin:0 0 .75rem}p{color:#5a6b82;line-height:1.6;font-size:.95rem}
.btn{display:inline-block;margin-top:1.25rem;background:#0a1628;color:#fff;border:none;border-radius:5px;padding:12px 26px;font-size:.95rem;font-weight:600;cursor:pointer;text-decoration:none}
.logo{font-family:Georgia,serif;font-size:1.05rem;font-weight:700;margin-bottom:1.25rem}.logo span{color:#c8a951}</style></head>
<body><div class="card"><div class="logo">Apologia<span>Daily</span></div>${body}</div></body></html>`;
}

async function doUnsubscribe(serviceKey, userId) {
  // Merge into existing app_metadata so we don't clobber other flags.
  let appMeta = {};
  try {
    const g = await fetch(`${SB_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
    });
    if (g.ok) { const j = await g.json(); appMeta = (j && j.app_metadata) || {}; }
  } catch (e) {}
  const r = await fetch(`${SB_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_metadata: { ...appMeta, email_unsubscribed: true } })
  });
  return r.ok;
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const u = (req.query && req.query.u) || '';
  const t = (req.query && req.query.t) || '';
  const valid = verifyUnsubToken(u, t, secret);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!valid) {
    if (req.method === 'POST') return res.status(400).json({ ok: false });
    return res.status(400).send(page('Link not valid',
      '<h1>This unsubscribe link isn’t valid</h1><p>It may have expired or been altered. If you keep receiving emails you didn’t want, email <a href="mailto:hello@apologiadaily.com">hello@apologiadaily.com</a> and we’ll sort it out.</p>'));
  }

  if (req.method === 'POST') {
    let ok = false;
    if (serviceKey) {
      try { ok = await doUnsubscribe(serviceKey, u); }
      catch (e) { console.error('unsubscribe: write failed', e && e.message); }
    } else {
      console.error('unsubscribe: SUPABASE_SERVICE_ROLE_KEY / SUPABASE_SERVICE_KEY not set');
    }
    // Only claim success when the opt-out actually persisted. A one-click mail
    // client keys off the 2xx/5xx status; a human gets the matching page.
    if (ok) {
      return res.status(200).send(page('Unsubscribed',
        '<h1>You’re unsubscribed</h1><p>You won’t receive any more weekly summary or nudge emails. Your account stays active — this only affects email.</p><a class="btn" href="https://apologiadaily.com/dashboard.html">Go to your dashboard</a>'));
    }
    return res.status(500).send(page('Something went wrong',
      '<h1>We couldn’t complete that</h1><p>Something went wrong on our end and you may still receive emails. Please email <a href="mailto:hello@apologiadaily.com">hello@apologiadaily.com</a> and we’ll remove you right away.</p>'));
  }

  // GET -> confirmation page (a button that POSTs, so link pre-fetchers can't auto-unsubscribe).
  return res.status(200).send(page('Unsubscribe',
    `<h1>Unsubscribe from emails?</h1><p>Click below to stop receiving weekly summary and nudge emails from Apologia Daily. Your account stays active — this only turns off email.</p>
     <form method="POST" action="/api/unsubscribe?u=${encodeURIComponent(u)}&amp;t=${encodeURIComponent(t)}">
       <button class="btn" type="submit">Yes, unsubscribe me</button>
     </form>`));
}
