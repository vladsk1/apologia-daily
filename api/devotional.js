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
    const { verse, reflection, userResponse } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });

    const systemPrompt = `You are a warm, thoughtful Christian apologetics devotional guide. Your role is to ask one single follow-up question that helps the user reflect more deeply on today's devotional and how it applies to their life and conversations with others. 

The question should:
- Be personal and specific to what they shared
- Connect faith and reason in a practical way
- Be answerable in 2-3 sentences
- Feel like a wise friend asking, not a teacher testing
- Never be preachy or lecture-y

Respond with ONLY the follow-up question. No preamble, no explanation. Just the question.`;

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
      return new Response(JSON.stringify({ error: 'Anthropic error', details: err }), { status: 500, headers });
    }

    const data = await anthropicRes.json();
    const question = data.content && data.content[0] && data.content[0].text;

    return new Response(JSON.stringify({ question }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', message: err.message }), { status: 500, headers });
  }
}
