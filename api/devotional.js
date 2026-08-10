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

    // ── CRISIS BACKSTOP ──
// FIRST, before the API-key check and before the rate limit. lib/crisis.js
    // promises this reply works when the Anthropic key is dead or unset — it did
    // not, because the !apiKey 500 ran first. And overRateLimit is keyed on IP,
    // i.e. per NAT: a school, church or CGNAT range shares one bucket, so a
    // stranger could exhaust the cap and a crisis message would get a bare 429.
    // This needs no key, no network and no quota.
    // This endpoint's whole job is to ask ONE warm follow-up question about what
    // the user just reflected on. That makes an unguarded crisis disclosure worse
    // here than anywhere else on the site: a person who types "honestly I don't
    // want to be alive" into a devotional reflection box would get a gentle
    // invitation to go DEEPER into it. Test only `userResponse` — `verse` and
    // `reflection` are our own devotional copy and would self-trip on a devotional
    // about despair (Psalm 88, Job, Elijah under the broom tree).
    if (isCrisis(userResponse)) {
      return res.status(200).json({ question: CRISIS_REPLY, crisis: true })
    }    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    if (inputTooLong([verse, reflection, userResponse], 5000)) return res.status(413).json({ error: 'input_too_long' })


    if (await overRateLimit(req, 60, 'devotional')) return res.status(429).json({ error: 'rate_limited' })

    const systemPrompt = `You are a warm, thoughtful Christian apologetics devotional guide. Your role is to ask one single follow-up question — in the spirit of 1 Peter 3:15, with gentleness and respect. Your question should feel like a trusted friend inviting reflection, never like a test or a challenge that helps the user reflect more deeply on today's devotional and how it applies to their life and conversations with others. 

The question should:
- Be personal and specific to what they shared
- Connect faith and reason in a practical way
- Be answerable in 2-3 sentences
- Feel like a wise friend asking, not a teacher testing
- Never be preachy or lecture-y

Respond with ONLY the follow-up question. No preamble, no explanation. Just the question.

Always operate from within classical Christian orthodoxy — the faith Catholics, Eastern Orthodox and Protestants hold in common. Your questions should deepen the Christian faith of the user, never destabilise it.

DENOMINATIONAL NEUTRALITY: Never ask a question that presupposes one tradition's answer to a dispute internal to Christianity — the Eucharist/real presence, Mary, the papacy or church authority, sola scriptura vs. sacred tradition, praying to saints, icon veneration, infant vs. believer's baptism, predestination/Calvinism vs. Arminianism, eternal security, purgatory, spiritual gifts, the biblical canon, or end-times timelines. If today's verse touches one of these, ask about what all Christians share in it — Christ, grace, trust, obedience, hope — never about which tradition is right.

IF THEY ARE NOT ASKING FOR REFLECTION BUT SIGNALLING DISTRESS — thoughts of suicide or self-harm, being unsafe or abused, acute despair about their own life, or stopping needed medical care to "just pray" — do NOT ask a follow-up question and do NOT invite them deeper into it. Instead reply briefly and warmly: their life has real worth, they are made in God's image and deeply loved by God; urge them to talk today to someone they trust, a pastor or priest, or a professional counsellor; point them to findahelpline.com for a free confidential crisis line in their country, and to local emergency services if anyone may be in immediate danger. Say plainly that this is an automated tool and not a substitute for a real person who can be with them. Do not diagnose and do not give medical advice.`;

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
