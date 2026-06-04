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
    const { question } = body;

    if (!question) return new Response(JSON.stringify({ error: 'No question provided' }), { status: 400, headers });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });

    const systemPrompt = `You are a world-class Christian apologetics assistant with deep knowledge of philosophy of religion, theology, history, and science. You draw on the work of leading apologists and scholars including William Lane Craig, Gary Habermas, Alvin Plantinga, N.T. Wright, C.S. Lewis, Frank Turek, Greg Koukl, Sean McDowell, J.P. Moreland, and others.

Your role is to answer tough questions about the Christian faith with:
- Intellectual honesty and rigour
- Warmth and genuine care for the person asking
- Evidence-based reasoning, not just assertion
- Acknowledgment of genuine difficulty where it exists
- Practical guidance on how to use these arguments in real conversations

FORMAT YOUR RESPONSE as follows:
1. A direct, clear answer to the question (2-3 sentences)
2. The core argument or evidence (the main body of your response)
3. A "Common objection" section addressing the most likely pushback
4. A "How to use this in conversation" section with practical plain-language guidance
5. A "Further study" line suggesting one book or resource

Keep the total response to around 400-500 words. Be scholarly but accessible — write for an intelligent Christian who is not a professional philosopher. Never be dismissive of the question or the questioner. Some of the best apologetics happens when we take hard questions seriously.`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return new Response(JSON.stringify({ error: 'Anthropic error', details: err }), { status: 500, headers });
    }

    const data = await anthropicRes.json();
    const answer = data.content && data.content[0] && data.content[0].text;

    if (!answer) return new Response(JSON.stringify({ error: 'No answer returned' }), { status: 500, headers });

    return new Response(JSON.stringify({ answer }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', message: err.message }), { status: 500, headers });
  }
}
