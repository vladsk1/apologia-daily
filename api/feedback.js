export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  try {
    const body = await req.json();
    const { conversation, opponent, topic, difficulty, mode } = body;

    if (!conversation || !opponent || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });

    let systemPrompt, userMessage;

    if (mode === 'convo') {
      systemPrompt = `You are a warm, experienced Christian pastoral coach reviewing a practice conversation. Your role is to give gentle, specific, encouraging coaching to help the Christian communicate their faith more naturally and effectively in real conversations.

Focus on:
- Whether they listened well before speaking
- Whether they showed genuine care for the person
- Whether they answered the real question behind the question
- Whether they were honest about difficulty and doubt
- Whether they pointed toward Jesus rather than just winning a point
- The pastoral and relational quality of their responses

You must respond with ONLY valid JSON in exactly this format with no other text:
{"overall": 75, "argument": 78, "objection": 65, "strengths": "2-3 specific things they did well in this conversation, referencing what they actually said", "weaknesses": "2-3 gentle, specific suggestions for growth, referencing actual moments in the conversation"}`;

      userMessage = `Conversation scenario: ${opponent}
Topic: ${topic}

Full conversation:
${conversation}

Please coach the Christian on how they handled this real-life conversation. Be warm, specific, and encouraging. Respond with JSON only.`;

    } else {
      systemPrompt = `You are an expert Christian apologetics coach. Analyse this debate and give honest specific constructive feedback for the Christian participant.

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
      return new Response(JSON.stringify({ error: 'Anthropic error', details: errData }), { status: 500, headers });
    }

    const data = await anthropicRes.json();
    const reply = data.content && data.content[0] && data.content[0].text;

    if (!reply) return new Response(JSON.stringify({ error: 'No reply' }), { status: 500, headers });

    const clean = reply.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(clean);

    return new Response(JSON.stringify(feedback), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', message: err.message }), { status: 500, headers });
  }
}
