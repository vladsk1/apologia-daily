/* Consolidated push endpoint — kept as ONE serverless function to stay under
   the Hobby plan's 12-function limit. Routes by query/method:
     GET  /api/push?do=public           -> VAPID public key (client subscribes)
     GET  /api/push?do=today            -> today's rotating argument (SW shows it)
     GET  /api/push?do=send&secret=...  -> daily cron sender (VAPID tickle)
     POST /api/push                     -> store a subscription (PushSubscription body)

   Env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (PKCS8 DER base64),
        SUPABASE_URL, SUPABASE_SERVICE_KEY,
        PUSH_CRON_SECRET (default 'apologia-cron-2026'),
        PUSH_CONTACT (mailto; default vkiparizov@gmail.com).

   Subscriptions table (Supabase SQL editor):
     create table if not exists push_subscriptions (
       endpoint text primary key, p256dh text not null,
       auth text not null, created_at timestamptz default now()); */
import crypto from 'crypto';

var ARGS = [
  { t: 'The Kalam Cosmological Argument', u: '/ev-m-kalam.html', b: 'Whatever begins to exist has a cause. The universe began. So…' },
  { t: 'The Fine-Tuning of the Universe', u: '/ev-m-finetuning.html', b: 'The constants are dialed in with staggering precision. Why?' },
  { t: 'The Moral Argument', u: '/ev-m-moral.html', b: 'If there is no God, are some things still really evil?' },
  { t: 'The Empty Tomb', u: '/ev-m-emptytomb.html', b: 'Even the critics conceded the tomb was empty. The question is why.' },
  { t: 'The Minimal Facts of the Resurrection', u: '/ev-m-minimal.html', b: 'Facts even skeptical scholars grant — and what best explains them.' },
  { t: 'Why the Disciples Died for What They Saw', u: '/ev-m-disciplesbelief.html', b: 'People die for what they believe. Few die for what they know is a lie.' },
  { t: 'Manuscript Evidence for the New Testament', u: '/ev-m-manuscript.html', b: 'How do we know the text we read is what was written?' },
  { t: 'Fulfilled Messianic Prophecy', u: '/ev-m-messianic_prophecy.html', b: 'Written centuries early — and met in one life.' },
  { t: 'The Dead Sea Scrolls', u: '/ev-m-deadseascrolls.html', b: 'A 1,000-year jump back in time confirmed the text held.' },
  { t: 'The Big Bang and a Beginning', u: '/ev-m-bigbang.html', b: 'Science pointed to a beginning long before it was comfortable.' },
  { t: 'The Origin of Life', u: '/ev-m-originlife.html', b: 'Where did the first information-bearing molecule come from?' },
  { t: 'The Contingency Argument', u: '/ev-m-leibniz.html', b: 'Why is there something rather than nothing at all?' },
  { t: 'The Argument from Reason', u: '/ev-m-reason.html', b: 'If thought is just chemistry, why trust it?' },
  { t: 'The Historical Jesus', u: '/ev-m-hist_jesus.html', b: 'What can we actually establish about the man from history?' },
  { t: 'Undesigned Coincidences', u: '/ev-m-coincidences.html', b: 'The Gospels dovetail in ways forgers could not have planned.' }
];

function b64url(buf) { return Buffer.from(buf).toString('base64url'); }

function vapidJWT(aud, pkcs8b64, contact) {
  var header = b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  var payload = b64url(JSON.stringify({
    aud: aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:' + contact
  }));
  var signingInput = header + '.' + payload;
  var key = crypto.createPrivateKey({ key: Buffer.from(pkcs8b64, 'base64'), format: 'der', type: 'pkcs8' });
  var sig = crypto.sign('sha256', Buffer.from(signingInput), { key: key, dsaEncoding: 'ieee-p1363' });
  return signingInput + '.' + b64url(sig);
}

function todayArg() {
  var now = new Date();
  var start = Date.UTC(now.getUTCFullYear(), 0, 0);
  var day = Math.floor((Date.now() - start) / 86400000);
  return ARGS[day % ARGS.length];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  var SB_URL = process.env.SUPABASE_URL || 'https://noprgxkwniouukmrfozc.supabase.co';
  var SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  var act = (req.query && req.query.do) || '';

  // ---- POST: store a subscription ----
  if (req.method === 'POST') {
    var body = req.body;
    try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = {}; }
    body = body || {};
    var keys = body.keys || {};
    if (!body.endpoint || !keys.p256dh || !keys.auth) return res.status(400).json({ error: 'Invalid subscription' });
    if (!SB_KEY) return res.status(200).json({ ok: false, note: 'SUPABASE_SERVICE_KEY not set' });
    try {
      var sr = await fetch(SB_URL + '/rest/v1/push_subscriptions?on_conflict=endpoint', {
        method: 'POST',
        headers: {
          apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY,
          'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({ endpoint: body.endpoint, p256dh: keys.p256dh, auth: keys.auth })
      });
      if (!sr.ok && sr.status !== 409) return res.status(200).json({ ok: false, status: sr.status });
      return res.status(200).json({ ok: true });
    } catch (e) { return res.status(200).json({ ok: false, error: e.message }); }
  }

  // ---- GET ?do=public: VAPID public key ----
  if (act === 'public') return res.status(200).json({ key: process.env.VAPID_PUBLIC_KEY || '' });

  // ---- GET ?do=today: today's argument ----
  if (act === 'today') {
    res.setHeader('Cache-Control', 's-maxage=3600');
    var a = todayArg();
    return res.status(200).json({ title: 'Today: ' + a.t, body: a.b, url: '/today' });
  }

  // ---- GET ?do=send: daily cron sender ----
  if (act === 'send') {
    var SECRET = process.env.PUSH_CRON_SECRET || 'apologia-cron-2026';
    if ((req.query.secret || '') !== SECRET) return res.status(401).json({ error: 'Unauthorized' });
    var PUB = process.env.VAPID_PUBLIC_KEY, PRIV = process.env.VAPID_PRIVATE_KEY;
    var CONTACT = process.env.PUSH_CONTACT || 'vkiparizov@gmail.com';
    var out = { sent: 0, pruned: 0, failed: 0, notes: [] };
    if (!PUB || !PRIV) { out.notes.push('VAPID keys not set.'); return res.status(200).json(out); }
    if (!SB_KEY) { out.notes.push('SUPABASE_SERVICE_KEY not set.'); return res.status(200).json(out); }
    var subs = [];
    try {
      var lr = await fetch(SB_URL + '/rest/v1/push_subscriptions?select=endpoint,p256dh,auth', {
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
      });
      if (lr.ok) subs = await lr.json();
      else { out.notes.push('Could not read subscriptions (status ' + lr.status + ').'); return res.status(200).json(out); }
    } catch (e) { out.notes.push('Subscription read failed: ' + e.message); return res.status(200).json(out); }

    var jwtByAud = {};
    async function delSub(ep) {
      try {
        await fetch(SB_URL + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(ep),
          { method: 'DELETE', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
        out.pruned++;
      } catch (e) {}
    }
    for (var i = 0; i < subs.length; i++) {
      var ep = subs[i].endpoint;
      try {
        var aud = new URL(ep).origin;
        if (!jwtByAud[aud]) jwtByAud[aud] = vapidJWT(aud, PRIV, CONTACT);
        var pr = await fetch(ep, { method: 'POST', headers: { Authorization: 'vapid t=' + jwtByAud[aud] + ', k=' + PUB, TTL: '86400' } });
        if (pr.status === 201 || pr.status === 200) out.sent++;
        else if (pr.status === 404 || pr.status === 410) await delSub(ep);
        else { out.failed++; if (out.notes.length < 5) out.notes.push('status ' + pr.status + ' for one sub'); }
      } catch (e) { out.failed++; }
    }
    return res.status(200).json(out);
  }

  return res.status(400).json({ error: 'unknown action' });
}
