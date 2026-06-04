export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { messages, opponent, topic, difficulty } = await req.json();

    if (!messages || !opponent || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const difficultyInstructions = {
      gentle: 'Be relatively gentle. Raise objections clearly but allow the Christian to make their points. Suitable for beginners.',
      challenging: 'Be intellectually rigorous and persistent. Press back on weak arguments. Do not let logical gaps slide.',
      expert: 'Be highly sophisticated philosophically. Know the literature deeply — Mackie, Flew, Dawkins, Krauss, Oppy. Anticipate standard apologetics responses.'
    };

    const opponentPersonas = {
      atheist: 'You are a thoughtful, intelligent atheist in a structured debate with a Christian. You are NOT hostile — you are genuinely sceptical. You draw on Dawkins, Hitchens, Harris, and Russell. You challenge belief in God using science, logic, and the problem of evil. Always respond directly and specifically to what the Christian just said. Never ignore their actual argument.',
      muslim: 'You are a knowledgeable Muslim in respectful interfaith dialogue with a Christian. You believe in Tawhid — the absolute oneness of God. You challenge the Trinity, the reliability of the Bible, and the divinity of Jesus. Draw on the Quran and scholars like Shabir Ally. Always respond directly to the specific arguments made.',
      agnostic: 'You are a genuine, open-minded agnostic in dialogue with a Christian. You are sincerely uncertain and genuinely curious. You ask hard questions about evidence, suffering, and religious diversity. You are moved by good arguments. Always respond to the specific things the Christian said.',
      secularist: 'You are a secular humanist engaging with a Christian. You believe morality is grounded in human flourishing. You raise concerns about religious harm, exclusivism, and the social consequences of
