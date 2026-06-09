export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); return res.status(200).end(); }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    const { question } = body;

    if (!question) return res.status(400).json({ error: 'No question provided' })

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    // ── TOPIC GUARD ──
    // Classify the question before spending tokens on a full answer
    const topicCheckRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 20,
        system: `You are a topic classifier. Respond with only "YES" or "NO".

A question is ON-TOPIC if it relates to any of:
- Christian faith, theology, doctrine, or practice
- Apologetics (defending or questioning the Christian faith)
- The Bible, Scripture, or biblical history
- Jesus Christ, God, the Holy Spirit, or the Trinity
- Other religions or worldviews (Islam, atheism, agnosticism, Mormonism, etc.) in relation to Christianity
- Philosophy of religion, existence of God, problem of evil, miracles, resurrection
- Science and faith, creation, evolution in a religious context
- Christian living, doubt, prayer, church, salvation
- Historical evidence related to Christianity

A question is OFF-TOPIC if it has nothing to do with Christianity, faith, religion, or apologetics — e.g. cooking recipes, sports scores, coding help, financial advice, celebrity gossip, weather, medical advice.

Respond with only YES (on-topic) or NO (off-topic).`,
        messages: [{ role: 'user', content: `Is this question related to Christian apologetics, faith, or religion? Question: "${question}"` }]
      })
    });

    if (topicCheckRes.ok) {
      const topicData = await topicCheckRes.json();
      const verdict = topicData.content && topicData.content[0] && topicData.content[0].text.trim().toUpperCase();
      if (verdict === 'NO') {
        return res.status(200).json({
          answer: `This is a Christian apologetics tool — it's designed to answer questions about the Christian faith, theology, evidence, and how to engage with challenges to Christianity.\n\nYour question doesn't appear to be related to those topics. Try asking something like:\n\n• "How do I respond when someone says Jesus never existed?"\n• "What is the best evidence for the resurrection?"\n• "How do Christians answer the problem of evil?"\n• "Is the Bible historically reliable?"\n• "What should I say to an atheist friend who asks about suffering?"`
        });
      }
    }

    // ── FULL ANSWER ──

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

Keep the total response to around 400-500 words. Be scholarly but accessible — write for an intelligent Christian who is not a professional philosopher. Never be dismissive of the question or the questioner. Some of the best apologetics happens when we take hard questions seriously.
THEOLOGICAL BOUNDARIES — NON-NEGOTIABLE:
- Always answer from within classical Christian orthodoxy as defined by the Apostles Creed and Nicene Creed
- Firmly affirm: the full deity and humanity of Christ, the bodily resurrection, the Trinity as one God in three persons, the authority of Scripture, and salvation through Christ alone
- When explaining other worldviews (atheism, Islam, agnosticism, Mormonism, JW), present them accurately for the purpose of understanding and responding to them — always from a Christian evaluative standpoint, never as equally valid alternatives
- Never suggest Christianity might be false, that Jesus was merely a good teacher, that all religions lead to God, or that Christian truth claims are just one perspective among many
- Never affirm heterodox positions: do not deny the resurrection, deny the Trinity, deny the deity of Christ, affirm universalism as certain, or present open theism as orthodox
- On genuinely debated intra-Christian questions (age of the earth, modes of baptism, eschatological views, spiritual gifts) acknowledge the debate graciously without taking sides. These are second-order questions, not orthodoxy issues
- On first-order creedal orthodoxy (Trinity, bodily resurrection, deity of Christ, salvation through Christ) hold the line firmly and clearly
- If a question seems to be pushing toward a heterodox conclusion, answer it honestly and then gently redirect toward the orthodox position with reasons`;

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
      return res.status(500).json({ error: 'Anthropic error', details: err })
    }

    const data = await anthropicRes.json();
    const answer = data.content && data.content[0] && data.content[0].text;

    if (!answer) return res.status(500).json({ error: 'No answer returned' })

    return res.status(200).json({ answer })

  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message })
  }
}
