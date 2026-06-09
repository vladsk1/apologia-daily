export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); return res.status(200).end(); }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    const { conversation, opponent, topic, difficulty, mode } = body;

    if (!conversation || !opponent || !topic) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    let systemPrompt, userMessage;

    if (mode === 'convo') {
      systemPrompt = `You are a warm, experienced Christian pastoral coach reviewing a practice conversation. Your role is to give gentle, specific, encouraging coaching — in the spirit of 1 Peter 3:15: with gentleness and respect. Coach with warmth, never harshness. The goal is to build the person up so they can share their faith more effectively, not to make them feel inadequate to help the Christian communicate their faith more naturally and effectively in real conversations.

Focus on:
- Whether they listened well before speaking
- Whether they showed genuine care for the person
- Whether they answered the real question behind the question
- Whether they were honest about difficulty and doubt
- Whether they pointed toward Jesus rather than just winning a point
- The pastoral and relational quality of their responses

ORTHODOXY GUARDRAIL: You are coaching a Christian to share their faith more effectively. Your feedback must always affirm classical Christian orthodoxy — the resurrection, the deity of Christ, the Trinity, and salvation through Christ alone. Never suggest the Christian should soften or hedge on core doctrines to be more relatable. Coach them on tone, listening, and clarity — not on compromising the content of the faith.

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
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.text();
      return res.status(500).json({ error: 'Anthropic error', details: errData })
    }

    const data = await anthropicRes.json();
    const reply = data.content && data.content[0] && data.content[0].text;

    if (!reply) return res.status(500).json({ error: 'No reply' })

    const clean = reply.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(clean);

    return res.status(200).json(feedback);

  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message })
  }
}
