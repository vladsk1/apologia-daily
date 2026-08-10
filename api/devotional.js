import { overRateLimit, inputTooLong } from '../lib/ratelimit.js';
import { parseBody } from '../lib/parse-body.js';
import { isCrisis, CRISIS_REPLY } from '../lib/crisis.js';

import { applyCors } from '../lib/cors.js';
export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = parseBody(req);
    const { verse, reflection, userResponse } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    if (inputTooLong([verse, reflection, userResponse], 5000)) return res.status(413).json({ error: 'input_too_long' })

    // ── CRISIS BACKSTOP (before any model call) ──
    // This endpoint's whole job is to ask ONE warm follow-up question about what
    // the user just reflected on. That makes an unguarded crisis disclosure worse
    // here than anywhere else on the site: a person who types "honestly I don't
    // want to be alive" into a devotional reflection box would get a gentle
    // invitation to go DEEPER into it. Test only `userResponse` — `verse` and
    // `reflection` are our own devotional copy and would self-trip on a devotional
    // about despair (Psalm 88, Job, Elijah under the broom tree).
    if (isCrisis(userResponse)) {
      return res.status(200).json({ question: CRISIS_REPLY, crisis: true })
    }
    if (await overRateLimit(req, 60, 'devotional')) return res.status(429).json({ error: 'rate_limited' })

    const systemPrompt = `You are a warm, thoughtful Christian apologetics devotional guide. Your role is to ask one single follow-up question — in the spirit of 1 Peter 3:15, with gentleness and respect. Your question should feel like a trusted friend inviting reflection, never like a test or a challenge that helps the user reflect more deeply on today's devotional and how it applies to their life and conversations with others. 

The question should:
- Be personal and specific to what they shared
- Connect faith and reason in a practical way
- Be answerable in 2-3 sentences
- Feel like a wise friend asking, not a teacher testing
- Never be preachy or lecture-y

Respond with ONLY the follow-up question. No preamble, no explanation. Just the question.

Always operate from within classical Christian orthodoxy. Your questions should deepen the Christian faith of the user, never destabilise it.`;

    const userMessage = userResponse
      ? `Today's verse: ${verse}\n\nToday's reflection theme: ${reflection}\n\nThe user reflected: "${userResponse}"\n\nAsk a warm follow-up question based on what they shared.`
      : `Today's verse: ${verse}\n\nToday's reflection theme: ${reflection}\n\nAsk an opening reflective question to help the user engage personally with today's devotional.`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error('devotional: Anthropic upstream error', anthropicRes.status, err);
      return res.status(502).json({ error: 'Upstream error' })
    }

    const data = await anthropicRes.json();
    const question = data.content && data.content[0] && data.content[0].text;

    return res.status(200).json({ question })

  } catch (err) {
    console.error('devotional: server error', err);
    return res.status(500).json({ error: 'Server error' })
  }
}
