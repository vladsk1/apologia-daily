import { overRateLimit } from '../lib/ratelimit.js';
import { applyCors } from '../lib/cors.js';
import { isCrisis, CRISIS_REPLY } from '../lib/crisis.js';
/* Question intake. Visitors submit a question (from /answers/ or ask-anything).
   Since 2026-10-08 the text is NOT emailed to anyone and NOT stored: it is scanned
   for a crisis disclosure (lib/crisis.js) and discarded. Only a count
   (question_submitted, with the page it came from) goes to PostHog, so demand is
   measurable without keeping anyone's words.
   Vercel env (optional): POSTHOG_KEY, POSTHOG_HOST.

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

  // Questions are NOT emailed or stored (owner decision, 2026-10-08): the text is
  // used only for the crisis check above and is then discarded. A crisis message
  // still gets the referral reply immediately (CRISIS_REPLY, below).

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
