import { requireSecret } from '../lib/require-secret.js';
/* Consolidated push endpoint — kept as ONE serverless function to stay under
   the Hobby plan's 12-function limit. Routes by query/method:
     GET  /api/push?do=public           -> VAPID public key (client subscribes)
     GET  /api/push?do=today            -> today's rotating argument (SW shows it)
     GET  /api/push?do=send&secret=...  -> daily cron sender (VAPID tickle)
     POST /api/push                     -> store a subscription (PushSubscription body)

   Env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (PKCS8 DER base64),
        SUPABASE_URL, SUPABASE_SERVICE_KEY,
        PUSH_CRON_SECRET (or CRON_SECRET — no default; endpoint fails closed),
        PUSH_CONTACT (mailto; default vkiparizov@gmail.com).

   Subscriptions table (Supabase SQL editor):
     create table if not exists push_subscriptions (
       endpoint text primary key, p256dh text not null,
       auth text not null, created_at timestamptz default now()); */
import crypto from 'crypto';

/* SSRF guard: a PushSubscription endpoint must be an HTTPS URL on a known
   browser-push service. Without this, an attacker could store an arbitrary
   endpoint (e.g. an internal/metadata URL) that the ?do=send cron would then
   fetch(). Allow only the official FCM/Apple/Mozilla/Windows push hosts. */
function isAllowedPushEndpoint(u) {
  var url;
  try { url = new URL(u); } catch (e) { return false; }
  if (url.protocol !== 'https:') return false;
  var h = url.hostname.toLowerCase();
  return (
    h === 'fcm.googleapis.com' ||
    h === 'updates.push.services.mozilla.com' ||
    h.endsWith('.push.services.mozilla.com') ||
    h === 'web.push.apple.com' ||
    h.endsWith('.push.apple.com') ||
    h.endsWith('.notify.windows.com')
  );
}

/* Generated from daily-args.json (63 certified entries) — same order as the /today rotation. */
var ARGS = [
  { t: "The Kalam Cosmological Argument", b: "Whatever begins to exist has a cause — including the universe." },
  { t: "The Leibniz Contingency Argument", b: "Why is there something rather than nothing?" },
  { t: "The Thomistic Cosmological Argument", b: "Right now, something must be holding everything in existence — Aquinas's unmoved mover." },
  { t: "The Fine-Tuning Argument", b: "The universe's constants fall within extraordinarily narrow life-permitting ranges." },
  { t: "The Moral Argument", b: "Objective moral duties need a ground beyond human opinion." },
  { t: "The Ontological Argument", b: "The very concept of the greatest conceivable being presses toward his existence." },
  { t: "The Argument from Consciousness", b: "The existence of mind cannot be explained by matter alone." },
  { t: "The Argument from Reason", b: "If our minds are just evolved survival machines, why trust the reasoning that says so?" },
  { t: "The Argument from Beauty", b: "The existence of profound beauty points beyond the physical world." },
  { t: "The Argument from Religious Experience", b: "Billions of people across all cultures report direct experience of God." },
  { t: "The Argument from Desire", b: "Our deepest longings point toward a reality that can satisfy them." },
  { t: "The Problem of Evil as Evidence for God", b: "The very fact that evil feels objectively wrong presupposes an objective good." },
  { t: "The Minimal Facts Argument", b: "Start where sceptical scholars already agree — then ask which explanation fits every fact." },
  { t: "The Empty Tomb", b: "His enemies explained the emptiness instead of denying it." },
  { t: "Paul's Conversion and the Early Creed", b: "The church's persecutor, carrying a creed dated within years of the crucifixion." },
  { t: "The Resurrection Appearances", b: "Individuals and crowds, friends, a doubter, and an enemy — all said they saw him alive." },
  { t: "The Origin of the Disciples' Belief", b: "Something happened that turned frightened followers into fearless witnesses." },
  { t: "The Conversion of the Sceptics", b: "The people least likely to believe became the most committed believers." },
  { t: "The Argument from the Burial", b: "Before there can be an empty tomb, there has to be a known tomb." },
  { t: "The Argument from Post-Resurrection Behaviour", b: "The disciples behaved exactly as you would expect if the resurrection was real." },
  { t: "The Historical Existence of Jesus", b: "Five independent streams of ancient evidence — including hostile witnesses." },
  { t: "Jesus as God in the New Testament", b: "From Paul's earliest letters to Revelation, every corner of the New Testament places Jesus…" },
  { t: "The HANDS Framework", b: "Honors, Attributes, Names, Deeds, Seat — five lines of divine identity converging on Jesus." },
  { t: "Did Jesus Claim to Be God?", b: "Jesus made divine claims his Jewish audience understood clearly — and they tried to stone him for it." },
  { t: "Messianic Prophecy — Foretold and Fulfilled", b: "Specific prophecies written centuries before Jesus converge on one person." },
  { t: "John 1:1 and the Pre-existence of Christ", b: "The Word was God — what the Greek actually says." },
  { t: "The Philippians 2 Hymn", b: "An early Christian hymn treating Jesus as fully divine — within years of the crucifixion." },
  { t: "The Titles of Jesus", b: "Son of Man, Lord, I AM, Son of God — what they meant to a first-century Jewish audience." },
  { t: "The Criterion of Multiple Attestation", b: "Historical methodology confirms key facts about Jesus across independent sources." },
  { t: "The Early Creed of 1 Corinthians 15", b: "The resurrection was proclaimed within years of the crucifixion." },
  { t: "The Argument from Jesus's Character", b: "A moral character without historical parallel — and what it points to." },
  { t: "Daniel's 70 Weeks", b: "A timeline written centuries before Jesus points to his era — and the sequence is the striking part." },
  { t: "The Uniqueness of the Resurrection Claim", b: "No other religion makes a falsifiable historical claim of this kind." },
  { t: "The Virgin Birth and Isaiah 7:14", b: "Two independent traditions — and a prophecy Jewish translators heard before Christianity existed." },
  { t: "The Argument from the Resurrection Predictions", b: "Jesus predicted his own death and resurrection — and was right." },
  { t: "The Manuscript Reliability Argument", b: "The New Testament is the most well-attested document in ancient history." },
  { t: "Archaeological Confirmation of the Bible", b: "Hundreds of archaeological discoveries confirm biblical people, places, and details." },
  { t: "The Canon Formation Argument", b: "The books of the Bible were recognised, not invented, by the church." },
  { t: "The Argument from Fulfilled Prophecy in the Old Testament", b: "The Old Testament accurately predicted events centuries before they occurred." },
  { t: "The Internal Consistency of Scripture", b: "66 books written across 1,500 years by 40 authors telling one coherent story." },
  { t: "The Reliability of the Gospel Eyewitnesses", b: "The Gospels contain evidence of genuine eyewitness testimony." },
  { t: "The Dead Sea Scrolls and Old Testament Reliability", b: "Ancient manuscripts confirm the Old Testament text has been preserved with extraordinary accuracy." },
  { t: "The Early Date of the New Testament", b: "The Gospels were written within the lifetime of eyewitnesses." },
  { t: "The Argument from the Jewishness of Jesus", b: "The Gospels accurately portray Jesus within his first-century Jewish context." },
  { t: "The Argument from Undesigned Coincidences", b: "Interlocking incidental details across independent accounts — the fingerprint of real memory,…" },
  { t: "The Argument from Palestinian Names", b: "The Gospels get first-century Jewish name-statistics right — a test forgers could not have known…" },
  { t: "The Argument from the Big Bang", b: "Modern cosmology gives strong evidence that the universe had a beginning." },
  { t: "The Origin of Life Argument", b: "The information content of DNA points beyond unguided chemistry." },
  { t: "The Argument from Mathematics", b: "The unreasonable effectiveness of mathematics points to a rational Creator." },
  { t: "The Cambrian Explosion", b: "The sudden appearance of complex animal life is a real, unfinished puzzle." },
  { t: "The Argument from Cosmic Purposiveness", b: "The universe appears structured, at many levels, toward intelligent life." },
  { t: "The Privileged Planet Argument", b: "The conditions that make Earth habitable also make it good for discovery." },
  { t: "The Argument from the Laws of Nature", b: "Rational, discoverable laws are best explained by a rational Lawgiver." },
  { t: "The Shema and Trinitarian Monotheism", b: "Deuteronomy 6:4 doesn't disprove the Trinity — it defines what the Trinity affirms." },
  { t: "The Trinity in the New Testament", b: "Father, Son, and Spirit appear together repeatedly — in baptism, blessing, and mission." },
  { t: "The Old Testament Foundations", b: "The 'Let Us' passages, the Angel of the Lord, and Wisdom in Proverbs 8." },
  { t: "The Trinity in the Early Church", b: "The doctrine was not invented at Nicaea — it was confessed from the very beginning." },
  { t: "The Philosophical Defence of the Trinity", b: "Is the Trinity a contradiction? Why 'one nature, three persons' is coherent." },
  { t: "Responding to Muslims on the Trinity", b: "Tawhid, shirk, and why the Trinity is not polytheism." },
  { t: "Responding to Jehovah's Witnesses", b: "John 1:1, the New World Translation, and why Arianism was rejected by the early church." },
  { t: "Responding to Mormons on the Trinity", b: "The King Follett discourse, separate Gods, and why the Bible doesn't teach LDS theology." },
  { t: "Responding to Modalism and Oneness Pentecostalism", b: "Jesus Only theology, the modes of God, and why the baptism narrative refutes modalism." },
  { t: "The Eternal Generation of the Son", b: "What 'begotten, not made' means — the Nicene doctrine and its biblical foundations." }
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
    if (!isAllowedPushEndpoint(body.endpoint)) return res.status(400).json({ error: 'Unsupported push endpoint' });
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
    } catch (e) { console.error('push subscribe failed', e && e.message); return res.status(200).json({ ok: false, error: 'Subscription failed' }); }
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
    // Require a secret. Accept Vercel's native cron auth header
    // (Authorization: Bearer $CRON_SECRET) OR a manual ?secret= match against
    // PUSH_CRON_SECRET/CRON_SECRET. Fail CLOSED if none configured — no default.
    if (!requireSecret(req, res, { envVars: ['PUSH_CRON_SECRET', 'CRON_SECRET'] })) return;
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
        // Defence in depth: skip (and prune) any stored endpoint that isn't a
        // known push host — covers rows written before the allowlist existed.
        if (!isAllowedPushEndpoint(ep)) { await delSub(ep); continue; }
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
