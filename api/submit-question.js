import { overRateLimit } from '../lib/ratelimit.js';
import { applyCors } from '../lib/cors.js';
import { isCrisis, CRISIS_REPLY } from '../lib/crisis.js';
/* Question intake. Visitors submit a question (from /answers/ or ask-anything).
   The text is NOT stored anywhere. It is scanned for a crisis disclosure
   (lib/crisis.js); a count (question_submitted, with the page it came from) goes
   to PostHog with no text and no identifier; and — owner decision 2026-10-23,
   reversing the 2026-10-08 no-email rule, mirrored in privacy.html §4 — the
   (redacted) text is emailed once to the site owner so real demand can drive new
   /answers/ pages. The email never reaches a database; it is sent and the request
   is then discarded.

   THREE SAFEGUARDS ON THE EMAIL, all enforced below:
     1. A CRISIS MESSAGE IS NEVER EMAILED. A cry for help is pastoral, not content:
        it is answered with CRISIS_REPLY and must not land in an inbox as a
        "question". The `!crisis` gate is that line.
     2. Email addresses and phone numbers are stripped from the text first, so a
        visitor who types contact details into an anonymous box does not have them
        forwarded.
     3. The text is truncated, and the form attaches no identifier — the
        notification is the redacted question plus the page it came from, nothing
        more.

   Vercel env (optional): POSTHOG_KEY, POSTHOG_HOST; RESEND_API_KEY (shared with
   the signup/weekly-email pipeline — set it once and this sends too);
   QUESTION_NOTIFY_TO / QUESTION_NOTIFY_FROM (default to the SIGNUP_NOTIFY_* values,
   then to vkiparizov@gmail.com / the Resend test sender).

   Public browser form, so no shared secret. Spam is contained by a length cap,
   a required-field check, and an optional honeypot field ("website"). */
export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = {}; }
  body = body || {};

  // Honeypot: real users never fill this; bots often do.
  var rawQuestion = (body.question || '').toString().trim();
  // Scan the RAW, untruncated text before anything can short-circuit. The
  // honeypot returns a silent 200 (browser autofill does fill a field named
  // "website"), and a length clamp would cut away a disclosure that
  // came at the end of a long message — both ran before the scan.
  var crisis = isCrisis(rawQuestion);
  if (body.website && !crisis) return res.status(200).json({ ok: true });

  var question = rawQuestion;
  var source = (body.source || 'unknown').toString().slice(0, 60);
  if (!question || question.length < 8) return res.status(400).json({ error: 'Please enter a question.' });

  // Per-IP daily cap so a bot ignoring the honeypot can't flood the analytics
  // count. A genuine ask form needs only a handful/day.
  if (await overRateLimit(req, 10, 'submitq')) {
    // Never answer a cry for help with "try again tomorrow". The cap is per-IP, so
    // a stranger on the same NAT can exhaust it. Return the referral regardless.
    if (crisis) return res.status(200).json({ ok: true, crisis: true, message: CRISIS_REPLY });
    return res.status(429).json({ error: 'Thanks — you have submitted several questions today. Please try again tomorrow.' });
  }

  var when = new Date().toISOString();

  // Email the (redacted) question to the owner — NON-CRISIS ONLY. The crisis
  // branches above have already returned CRISIS_REPLY, so by here `crisis` is the
  // final say; a cry for help is never forwarded as content. The text is not
  // stored: it is sent once and discarded with the request. Best-effort — any
  // failure is logged, never surfaced to the browser, and never blocks the 200.
  if (!crisis) {
    var RESEND = process.env.RESEND_API_KEY;
    if (RESEND) {
      // Remove anything that looks like an email address or a phone number before
      // sending. The phone pass only redacts a run with 7+ actual digits, so verse
      // references (John 3:16), years (AD 2026) and ranges (15:3-7) are left alone.
      var stripPII = function (s) {
        return String(s)
          .replace(/[\w.+-]+@[\w-]+\.[\w.-]{2,}/g, '[email removed]')
          .replace(/\+?\d[\d\s().-]{6,}\d/g, function (m) {
            return (m.replace(/\D/g, '').length >= 7) ? '[number removed]' : m;
          });
      };
      var esc = function (s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      };
      var MAX = 1000;
      var cleaned = stripPII(question);
      var clipped = cleaned.length > MAX ? cleaned.slice(0, MAX) + ' …[truncated]' : cleaned;
      var safeSource = source.replace(/[\r\n]+/g, ' ');
      var TO = process.env.QUESTION_NOTIFY_TO || process.env.SIGNUP_NOTIFY_TO || 'vkiparizov@gmail.com';
      var FROM = process.env.QUESTION_NOTIFY_FROM || process.env.SIGNUP_NOTIFY_FROM || 'Apologia Daily <contact@apologiadaily.com>';
      try {
        var r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: FROM,
            to: [TO],
            subject: '❓ New question asked (' + safeSource + ')',
            html:
              '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">' +
              '<h2 style="margin:0 0 8px">New question submitted</h2>' +
              '<p style="margin:0;white-space:pre-wrap">' + esc(clipped) + '</p>' +
              '<p style="margin:8px 0 0;color:#555;font-size:13px">From: ' + esc(safeSource) + '</p>' +
              '<p style="margin:6px 0;color:#888;font-size:13px">' + esc(when) + '</p>' +
              '<p style="margin:10px 0 0;color:#aaa;font-size:12px">Anonymous — no identifier is attached. Email addresses and phone numbers are stripped before sending.</p>' +
              '</div>'
          })
        });
        if (!r.ok) console.warn('submit-question: Resend returned status ' + r.status);
      } catch (e) { console.warn('submit-question: email send failed: ' + e.message); }
    }
  }

  // Record demand in PostHog (server-side), so the funnel is measurable.
  var PH_KEY = process.env.POSTHOG_KEY;
  var PH_HOST = process.env.POSTHOG_HOST || 'https://eu.i.posthog.com';
  // A crisis message is not "demand" for an answer: don't count it.
  if (PH_KEY && !crisis) {
    try {
      await fetch(PH_HOST + '/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: PH_KEY,
          event: 'question_submitted',
          distinct_id: 'anon-' + when,
          properties: { source: source, $lib: 'apologia-server' }
        })
      });
    } catch (e) { /* non-fatal */ }
  }

  // Always 200 so the browser form gets a clean success.
  if (crisis) return res.status(200).json({ ok: true, crisis: true, message: CRISIS_REPLY });
  return res.status(200).json({ ok: true });
}
