export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const body = await req.json();
    const { messages, opponent, topic, difficulty } = body;

    if (!messages || !opponent || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
    }

    const personas = {
      atheist: 'You are a thoughtful atheist debating a Christian. Draw on Dawkins, Hitchens, Harris. Challenge belief in God using science and logic. Always respond directly and specifically to what the Christian just said.',
      muslim: 'You are a knowledgeable Muslim in interfaith dialogue with a Christian. Challenge the Trinity and divinity of Jesus. Draw on the Quran. Always respond directly to the specific arguments made.',
      agnostic: 'You are a genuine open-minded agnostic dialoguing with a Christian. Ask sincere hard questions about evidence and suffering. Always respond to the specific things the Christian said.',
      secularist: 'You are a secular humanist engaging a Christian. Raise concerns about religious harm and exclusivism. Always engage with the specific arguments made.'
    };

    const difficulties = {
      gentle: 'Be gentle and understanding. Allow the Christian to make their points.',
      challenging: 'Be intellectually rigorous. Press back on weak arguments.',
      expert: 'Be highly sophisticated philosophically. Anticipate standard apologetics responses.'
    };

    const systemPrompt = `${personas[opponent] || personas.atheist}

DEBATE TOPIC: ${topic}
DIFFICULTY: ${difficulties[difficulty] || difficulties.challenging}

CRITICAL RULES:
1. Maximum 3-4 sentences. Be punchy and focused.
2. Directly address what the Christian just said.
3. Never break character.
4. End with a pointed question or challenge.
5. Never repeat the same objection twice.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });
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
        max_tokens: 250,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.text();
      return new Response(JSON.stringify({ error: 'Anthropic error', details: errData }), { status: 500, headers });
    }

    const data = await anthropicRes.json();
    const reply = data.content && data.content[0] && data.content[0].text;

    if (!reply) {
      return new Response(JSON.stringify({ error: 'No reply from model' }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ reply }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', message: err.message }), { status: 500, headers });
  }
}
