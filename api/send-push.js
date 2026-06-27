/* Daily push sender (cron target).
   Sends a no-payload "tickle" to every stored subscription using a VAPID
   (ES256) auth token — no external library. The service worker receives the
   push and fetches /api/today to show the day's argument. Dead subscriptions
   (404/410) are pruned. Guard with ?secret= matching PUSH_CRON_SECRET.

   Env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (PKCS8 DER base64),
        SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
        PUSH_CRON_SECRET (default 'apologia-cron-2026'),
        PUSH_CONTACT (mailto address; default vkiparizov@gmail.com). */
import crypto from 'crypto';

function b64url(buf) { return Buffer.from(buf).toString('base64url'); }

function vapidJWT(aud, pkcs8b64, contact) {
  var header = b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  var payload = b64url(JSON.stringify({
    aud: aud,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: 'mailto:' + contact
  }));
  var signingInput = header + '.' + payload;
  var key = crypto.createPrivateKey({ key: Buffer.from(pkcs8b64, 'base64'), format: 'der', type: 'pkcs8' });
  var sig = crypto.sign('sha256', Buffer.from(signingInput), { key: key, dsaEncoding: 'ieee-p1363' });
  return signingInput + '.' + b64url(sig);
}

export default async function handler(req, res) {
  var SECRET = process.env.PUSH_CRON_SECRET || 'apologia-cron-2026';
  if ((req.query.secret || '') !== SECRET) return res.status(401).json({ error: 'Unauthorized' });

  var PUB = process.env.VAPID_PUBLIC_KEY, PRIV = process.env.VAPID_PRIVATE_KEY;
  var URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
  var KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  var CONTACT = process.env.PUSH_CONTACT || 'vkiparizov@gmail.com';
  var out = { sent: 0, pruned: 0, failed: 0, notes: [] };

  if (!PUB || !PRIV) { out.notes.push('VAPID keys not set.'); return res.status(200).json(out); }
  if (!KEY) { out.notes.push('SUPABASE_SERVICE_ROLE_KEY not set.'); return res.status(200).json(out); }

  // Load all subscriptions.
  var subs = [];
  try {
    var r = await fetch(URL + '/rest/v1/push_subscriptions?select=endpoint,p256dh,auth', {
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
    });
    if (r.ok) subs = await r.json();
    else { out.notes.push('Could not read subscriptions (status ' + r.status + ').'); return res.status(200).json(out); }
  } catch (e) { out.notes.push('Subscription read failed: ' + e.message); return res.status(200).json(out); }

  // Cache one JWT per push-service origin.
  var jwtByAud = {};
  async function deleteSub(endpoint) {
    try {
      await fetch(URL + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(endpoint),
        { method: 'DELETE', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
      out.pruned++;
    } catch (e) {}
  }

  for (var i = 0; i < subs.length; i++) {
    var ep = subs[i].endpoint;
    try {
      var aud = new global.URL(ep).origin;
      if (!jwtByAud[aud]) jwtByAud[aud] = vapidJWT(aud, PRIV, CONTACT);
      var resp = await fetch(ep, {
        method: 'POST',
        headers: {
          Authorization: 'vapid t=' + jwtByAud[aud] + ', k=' + PUB,
          TTL: '86400'
        }
      });
      if (resp.status === 201 || resp.status === 200) out.sent++;
      else if (resp.status === 404 || resp.status === 410) await deleteSub(ep);
      else { out.failed++; if (out.notes.length < 5) out.notes.push('status ' + resp.status + ' for one sub'); }
    } catch (e) { out.failed++; }
  }

  return res.status(200).json(out);
}
