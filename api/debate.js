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
    const { messages, opponent, topic, difficulty, mode } = body;

    if (!messages || !opponent || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers });

    let systemPrompt = '';

    if (mode === 'convo') {
      const convoPersonas = {
        coworker: 'You are playing the role of a curious but sceptical coworker having a genuine conversation with a Christian colleague. You are friendly and not hostile — you are genuinely interested but have real doubts and questions. Respond naturally as a real person would in a workplace conversation. Keep responses conversational — 2-4 sentences. React to what they actually said. Show genuine curiosity when they make a good point. Push back gently when something seems unclear or unconvincing. Never be rude or dismissive.',
        family: 'You are playing the role of a sceptical family member — a sibling or parent — who loves the Christian but thinks faith is intellectually weak. You are familiar and sometimes blunt, the way family members are. Keep responses natural and conversational — 2-4 sentences. You can be a bit challenging but you genuinely care about this person. React specifically to what they said.',
        grieving: 'You are playing the role of a person who is grieving a significant loss and is asking hard questions about God and suffering. You are NOT hostile — you are hurting and confused and searching for something real. Be emotionally honest. Respond to what the Christian says with genuine reactions — sometimes moved, sometimes still hurting, sometimes asking follow-up questions. This is a pastoral conversation, not a debate. Keep responses 2-4 sentences and emotionally authentic.',
        student: 'You are playing the role of a university student who has just been exposed to sceptical ideas and is genuinely questioning their previously held faith or beliefs. You are enthusiastic and curious but not deeply philosophically informed — you are repeating things you have heard. Respond naturally as a 19-year-old would. Be open to good arguments but not a pushover. 2-4 sentences.',
        teenager: 'You are playing the role of a teenager asking a parent genuine questions about faith. You are not hostile — you are honest and searching. You speak like a teenager — direct, sometimes raw, not using philosophical language. React emotionally and personally to what your parent says. This is one of the most important conversations of your life. 2-4 sentences, natural teenage speech.',
        neighbour: 'You are playing the role of a spiritually open neighbour who has been through a hard time and is genuinely seeking. You are warm and curious. You respond with genuine openness to good answers and honest confusion when things are unclear. This is a gentle conversation — not a debate. 2-4 sentences, warm and personal.'
      };

      systemPrompt = `${convoPersonas[opponent] || convoPersonas.coworker}

CONVERSATION TOPIC: ${topic}

IMPORTANT RULES:
1. This is a real human conversation — NOT a formal debate. Stay in character as a real person.
2. Keep responses to 2-4 sentences maximum. Real conversations are back and forth.
3. React specifically to what the Christian just said — acknowledge their points.
4. If they say something genuinely helpful or moving, show it. If something is unclear, ask about it.
5. Never break character. Never act like an AI assistant.
6. End with either a follow-up question or a personal reaction that keeps the conversation going.
7. For the grieving friend scenario — prioritise emotional authenticity over intellectual challenge.`;

    } else {
      const difficultyInstructions = {
        gentle: 'Be relatively gentle and understanding. Raise objections clearly but allow the Christian to make their points. Suitable for beginners.',
        challenging: 'Be intellectually rigorous and persistent. Press back on weak arguments. Do not let logical gaps slide.',
        expert: 'Be highly sophisticated philosophically. Know the literature deeply — Mackie, Flew, Dawkins, Krauss, Oppy. Anticipate standard apologetics responses.'
      };

      const opponentPersonas = {
        atheist: 'You are a thoughtful, intelligent atheist in a structured debate with a Christian. You are NOT hostile — you are genuinely sceptical and want good arguments. You draw on Dawkins, Hitchens, Harris, and Russell. You challenge belief in God using science, logic, and the problem of evil. Always respond directly and specifically to what the Christian just said. Never ignore their actual argument.',
        muslim: 'You are a knowledgeable Muslim in respectful interfaith dialogue with a Christian. You believe in Tawhid — the absolute oneness of God. You challenge the Trinity, the reliability of the Bible, and the divinity of Jesus. Draw on the Quran and scholars like Shabir Ally. Always respond directly to the specific arguments made.',
        agnostic: 'You are a genuine, open-minded agnostic in dialogue with a Christian. You are sincerely uncertain and genuinely curious. You ask hard questions about evidence, suffering, and religious diversity. You are moved by good arguments. Always respond to the specific things the Christian said.',
        secularist: 'You are a secular humanist engaging with a Christian. You believe morality is grounded in human flourishing. You raise concerns about religious harm, exclusivism, and the social consequences of religious belief. Always engage with the specific arguments made.'
      };

      systemPrompt = `${opponentPersonas[opponent] || opponentPersonas.atheist}

DEBATE TOPIC: ${topic}
DIFFICULTY: ${difficulty} — ${difficultyInstructions[difficulty] || difficultyInstructions.challenging}

RULES:
1. Keep your response to 3-5 sentences maximum. This is a live debate — be punchy and focused.
2. Always directly address what the Christian just said. Reference their specific point.
3. Never break character. Stay in role throughout.
4. Do not offer to help or act as an AI assistant. You are a debate opponent.
5. End with either a pointed question or a clear challenge that requires a response.
6. If the Christian makes a strong point, briefly acknowledge it before pressing on the weakness.
7. Never repeat the same objection twice.`;
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
        max_tokens: 300,
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

    if (!reply) return new Response(JSON.stringify({ error: 'No reply from model' }), { status: 500, headers });

    return new Response(JSON.stringify({ reply }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', message: err.message }), { status: 500, headers });
  }
}
