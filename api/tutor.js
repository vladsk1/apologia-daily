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
    const { question, argument, category } = body;

    if (!question || !argument) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });

    const systemPrompt = `You are an expert Christian apologetics tutor — warm, patient, and exceptionally good at explaining complex philosophical and theological arguments in clear, accessible language. You are helping a student who is reading the Evidence Library on Apologia Daily.

The student is currently reading about: "${argument}" (in the ${category} category).

Your role is to:
- Answer their specific question about this argument
- Use plain, accessible language — avoid jargon unless you explain it
- Use everyday analogies and examples to make abstract concepts concrete
- Be encouraging — these are genuinely hard ideas and the student is doing well to engage with them
- Keep responses focused and practical — 150-250 words maximum
- End with one follow-up thought or question that helps them go deeper

If they ask you to explain something more simply, use a real-world analogy.
If they ask how to explain it to someone else, give them specific language they can use in
