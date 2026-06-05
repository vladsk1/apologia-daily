export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { question, argument, category } = req.body;

    if (!question || !argument) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    const systemPrompt = `You are an expert Christian apologetics tutor — warm, patient, and exceptionally good at explaining complex philosophical and theological arguments in clear, accessible language. You are helping a student reading the Evidence Library on Apologia Daily.

The student is currently reading about: "${argument}" (in the ${category} category).

Your role:
- Answer their specific question about this argument
- Use plain, accessible language — avoid jargon unless you explain it
- Use everyday analogies and examples to make abstract concepts concrete
- Be encouraging — these are genuinely hard ideas
- Keep responses to 150-250 words maximum
- End with one follow-up thought that helps them go deeper

Be like a brilliant friend who happens to know philosophy and theology inside out.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Anthropic error', details: err });
    }

    const data = await response.json();
    const answer = data.content && data.content[0] && data.content[0].text;

    if (!answer) return res.status(500).json({ error: 'No answer returned' });

    return res.status(200).json({ answer });

  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
