/* Question capture — the content flywheel intake.
   Visitors submit a question (from /answers/ or ask-anything); the founder gets
   an email so good questions can be drafted, run through the QA + orthodoxy
   pipeline, and published as indexable /answers/ pages. Also records a
   question_submitted event in PostHog so demand is measurable.

   No new infrastructure: reuses the same Resend + PostHog setup as new-signup.js.
   Vercel env (all optional — degrades gracefully):
     RESEND_API_KEY                  (to actually receive the emails)
     QUESTION_NOTIFY_TO              (default: SIGNUP_NOTIFY_TO or vkiparizov@gmail.com)
     SIGNUP_NOTIFY_FROM             (reused as the From address)
     POSTHOG_KEY, POSTHOG_HOST       (records question_submitted)

   Public browser form, so no shared secret. Spam is contained by a length cap,
   a required-field check, and an optional honeypot field ("website"). */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { body = {}; }
  body = body || {};

  // Honeypot: real users never fill this; bots often do.
  if (body.website) return res.status(200).json({ ok: true });

  var question = (body.question || '').toString().trim();
  var email = (body.email || '').toString().trim().slice(0, 200);
  var source = (body.source || 'unknown').toString().slice(0, 60);
  if (!question || question.length < 8) return res.status(400).json({ error: 'Please enter a question.' });
  if (question.length > 1000) question = question.slice(0, 1000) + '…';

  var notes = [];
  var when = new Date().toISOString();

  // Email the founder so the question feeds the content pipeline.
  var TO = process.env.QUESTION_NOTIFY_TO || process.env.SIGNUP_NOTIFY_TO || 'vkiparizov@gmail.com';
  var FROM = process.env.SIGNUP_NOTIFY_FROM || 'Apologia Daily <onboarding@resend.dev>';
  var RESEND = process.env.RESEND_API_KEY;
  if (RESEND) {
    try {
      var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
      var html =
        '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">' +
        '<h2 style="margin:0 0 8px">New question submitted</h2>' +
        '<p style="margin:0;font-size:17px"><strong>' + esc(question) + '</strong></p>' +
        '<p style="margin:8px 0;color:#555">From: ' + (email ? esc(email) : '(anonymous)') + ' &middot; via ' + esc(source) + '</p>' +
        '<p style="margin:6px 0;color:#888;font-size:13px">' + when + '</p>' +
        '<p style="margin:12px 0 0;color:#555;font-size:13px">If it is a good fit, draft a short answer, run it through citations + argument + orthodoxy, add it to answers/_data.json, and regenerate.</p>' +
        '</div>';
      var subject = '❓ New question: ' + question.slice(0, 80);
      var r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [TO], subject: subject, html: html, reply_to: email || undefined })
      });
      if (!r.ok) notes.push('Resend status ' + r.status);
    } catch (e) { notes.push('Email send failed: ' + e.message); }
  } else {
    notes.push('RESEND_API_KEY not set — question not emailed.');
  }

  // Record demand in PostHog (server-side), so the funnel is measurable.
  var PH_KEY = process.env.POSTHOG_KEY;
  var PH_HOST = process.env.POSTHOG_HOST || 'https://eu.i.posthog.com';
  if (PH_KEY) {
    try {
      await fetch(PH_HOST + '/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: PH_KEY,
          event: 'question_submitted',
          distinct_id: email || ('anon-' + when),
          properties: { source: source, has_email: !!email, $lib: 'apologia-server' }
        })
      });
    } catch (e) { /* non-fatal */ }
  }

  // Always 200 so the browser form gets a clean success.
  return res.status(200).json({ ok: true, notes: notes });
}
