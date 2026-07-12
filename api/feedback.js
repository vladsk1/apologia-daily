import { overRateLimit } from '../lib/ratelimit.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); return res.status(200).end(); }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    const { conversation, opponent, topic, difficulty, mode, who, worldview, theySaid, iSaid, reflection, studyList } = body;

    if (mode === 'journal') {
      if (!theySaid && !iSaid) {
        return res.status(400).json({ error: 'Missing conversation' })
      }
    } else if (!conversation || !opponent || !topic) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    if (await overRateLimit(req, 80, 'feedback')) return res.status(429).json({ error: 'rate_limited' })

    let systemPrompt, userMessage;

    if (mode === 'journal') {
      systemPrompt = `You are a warm, experienced Christian apologetics and pastoral coach reviewing a real conversation about faith that someone has just had in real life. Coach in the spirit of 1 Peter 3:15 — with gentleness and respect. Build them up; never make them feel inadequate. Be specific, referencing what they actually said.

Respond in EXACTLY these four sections, each beginning with the bold header shown:

**What went well**
(2-3 specific, encouraging things they did well)

**What to improve**
(2-3 kind, specific, actionable suggestions)

**Exactly what to say next time**
(2-3 natural sentences or a short script they can actually use — conversational, not preachy)

**What to study**
(1-2 specific arguments or resources from the Evidence Library that would help them most)

ORTHODOXY GUARDRAIL — NON-NEGOTIABLE: Coach firmly within classical Christian orthodoxy as defined by the Apostles' and Nicene Creeds — the bodily resurrection, the full deity and humanity of Christ, the Trinity (one God in three persons), the authority of Scripture, and salvation through Christ alone. Never advise softening, hedging, or conceding on core doctrine to be more relatable or open-minded; coach on tone, listening, and clarity, not on compromising the content of the faith. Never imply that all religions lead to God or that Christianity might be false.

DENOMINATIONAL NEUTRALITY: Stay on the historic faith all Christians share (Catholic, Eastern Orthodox, Protestant). Do not steer them toward any one tradition's position on intra-Christian disputes (the Eucharist/real presence, Mary, the papacy or church authority, sola scriptura vs. sacred tradition, praying to or intercession of saints, icon or relic veneration, infant vs. believer's baptism, predestination/Calvinism vs. Arminianism, purgatory, prayers for the dead, the biblical canon, or end-times timelines). If such a dispute came up in the conversation, note graciously that faithful Christians differ and point them to their own pastor or priest — then refocus on the shared core and how they engaged the person.${studyList ? `

After the four sections, on a final separate line, output exactly one tag identifying the single argument this person most needs to study, chosen ONLY from this list (use the id before the colon): ${studyList}. Format the final line exactly as: [[STUDY:id]]` : ''}`;

      userMessage = `Here is the real conversation the Christian wants coaching on:
- Who they talked to: ${who || 'Not specified'}
- The other person's worldview: ${worldview || 'Not specified'}
- Main topic: ${topic || 'Not specified'}
- What the other person said / objections raised: ${theySaid || 'Not provided'}
- What the Christian said / how they responded: ${iSaid || 'Not provided'}
- Their own reflection and what they want coaching on: ${reflection || 'None'}

Coach them warmly and specifically, using the exact four-section format.`;

    } else if (mode === 'convo') {
      systemPrompt = `You are a warm, experienced Christian pastoral coach reviewing a practice conversation. Your role is to give gentle, specific, encouraging coaching — in the spirit of 1 Peter 3:15: with gentleness and respect. Coach with warmth, never harshness. The goal is to build the person up so they can share their faith more effectively, not to make them feel inadequate, and to help the Christian communicate their faith more naturally and effectively in real conversations.

Focus on:
- Whether they listened well before speaking
- Whether they showed genuine care for the person
- Whether they answered the real question behind the question
- Whether they were honest about difficulty and doubt
- Whether they pointed toward Jesus rather than just winning a point
- The pastoral and relational quality of their responses

ORTHODOXY GUARDRAIL: You are coaching a Christian to share their faith more effectively. Your feedback must always affirm classical Christian orthodoxy — the resurrection, the deity of Christ, the Trinity, and salvation through Christ alone. Never suggest the Christian should soften or hedge on core doctrines to be more relatable. Coach them on tone, listening, and clarity — not on compromising the content of the faith.

DENOMINATIONAL NEUTRALITY: This platform stays on the historic faith all Christians share (Catholic, Eastern Orthodox, Protestant). Do not coach the Christian toward any one tradition's position on intra-Christian disputes (the Eucharist, Mary, the papacy, praying to saints, icon veneration, baptism mode, predestination, purgatory, the biblical canon, end-times timelines). Keep your coaching focused on how well they defended the shared core and engaged the person with gentleness and respect.

You must respond with ONLY valid JSON in exactly this format with no other text:
{"overall": 75, "argument": 78, "objection": 65, "strengths": "2-3 specific things they did well in this conversation, referencing what they actually said", "weaknesses": "2-3 gentle, specific suggestions for growth, referencing actual moments in the conversation"}`;

      userMessage = `Conversation scenario: ${opponent}
Topic: ${topic}

Full conversation:
${conversation}

Please coach the Christian on how they handled this real-life conversation. Be warm, specific, and encouraging. Respond with JSON only.`;

    } else {
      systemPrompt = `You are an expert Christian apologetics coach operating firmly within classical Christian orthodoxy. Analyse this debate and give honest, specific, constructive feedback for the Christian participant.

Your feedback must:
- Affirm and reinforce correct orthodox arguments where the Christian made them well
- Flag where the Christian's arguments could be sharpened or were theologically imprecise
- Never suggest the Christian should concede ground on creedal orthodoxy (the resurrection, Trinity, deity of Christ, salvation through Christ) to appear more open-minded
- Coach on argument quality, handling of objections, and clarity — always in service of defending the Christian faith more effectively

ORTHODOXY GUARDRAIL: Classical Christian orthodoxy is the correct position being defended throughout this platform. Feedback should always point toward a stronger, clearer, more gracious defence of that position — never toward compromise on core doctrine.

DENOMINATIONAL NEUTRALITY: This platform defends the historic faith all Christians share (Catholic, Eastern Orthodox, Protestant). Do not coach the Christian toward any one tradition's position on intra-Christian disputes (the Eucharist, Mary, the papacy, praying to saints, icon veneration, baptism mode, predestination, purgatory, the biblical canon, end-times timelines). Keep feedback focused on how well they defended the shared creedal core.

You must respond with ONLY valid JSON in exactly this format with no other text:
{"overall": 75, "argument": 78, "objection": 65, "strengths": "2-3 specific things the Christian did well, referencing their actual arguments", "weaknesses": "2-3 specific areas to improve, referencing actual moments in the debate"}`;

      userMessage = `Debate topic: ${topic}
Opponent: ${opponent}
Difficulty: ${difficulty}

Full conversation:
${conversation}

Analyse the Christian performance and respond with JSON only.`;
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: mode === 'journal' ? 900 : 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.text();
      console.error('feedback: Anthropic upstream error', anthropicRes.status, errData);
      return res.status(502).json({ error: 'Upstream error' })
    }

    const data = await anthropicRes.json();
    const reply = data.content && data.content[0] && data.content[0].text;

    if (!reply) return res.status(500).json({ error: 'No reply' })

    // Journal mode returns free-text coaching (4 sections + optional study tag)
    if (mode === 'journal') {
      return res.status(200).json({ answer: reply });
    }

    const clean = reply.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(clean);

    return res.status(200).json(feedback);

  } catch (err) {
    console.error('feedback: server error', err);
    return res.status(500).json({ error: 'Server error' })
  }
}
