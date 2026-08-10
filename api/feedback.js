// content-review: {"argument": "2026-08-10", "orthodoxy": "2026-08-10", "neutrality": "2026-08-10", "by": "FIRST GATE EVER of this live endpoint - it SCORES a believer out of 100 on Trinity/deity content and writes scripts they will say to real Muslim, JW and LDS friends. DUAL CONSENSUS. apologia-orthodoxy round 3: found the FALSE-COMMON-GROUND rail nested inside the study-list ternary, so it vanished whenever the journal topic was 'Other religions', 'Other' or unselected - i.e. exactly the Muslim/JW/LDS coaching path. Fixed by moving the closing brace only, text byte-identical; the gate pre-certified that form conditional on nothing but the brace moving, and the fix is verified at runtime by capturing the live system prompt on both topic paths. Creedal guardrail confirmed present in all three modes. apologia-neutrality round 3: NOT STAMPABLE as read; its findings applied verbatim - EARNED CONFIDENCE NOT MANUFACTURED CONFIDENCE added to both scoring branches, because the rubric could reward 'virtually all scholars' consensus claims that tools/retired-claims.json RETIRES and mark down the honest concessions library/minimalfacts.html and library/emptytomb.html make in our own voice; the 75/78/65 JSON example replaced with <0-100> plus a use-the-full-range instruction (it was anchoring every score near 75 beside a Pro upsell); JW/LDS shared vocabulary fenced separately from Islam's; 'a word from God' -> 'a word from Him' per the certified Q 4:171 form. ⚠ APPLIED AFTER NEUTRALITY READ THE FILE, NOT RE-READ BY EITHER LENS - ported verbatim, confirmation pass owed."}
import { overRateLimit, inputTooLong } from '../lib/ratelimit.js';
import { parseBody } from '../lib/parse-body.js';
import { anyCrisis, CRISIS_REPLY } from '../lib/crisis.js';

import { applyCors } from '../lib/cors.js';
export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = parseBody(req);
    const { conversation, opponent, topic, difficulty, mode, who, worldview, theySaid, iSaid, reflection, studyList, userTurns } = body;

    // ── CRISIS BACKSTOP ── (first: needs no key, no network, no quota)
    // Journal mode is a "coach me on a real conversation I just had" box —
    // `reflection` is literally "what they want coaching on", up to 20k chars. A
    // high-probability disclosure surface.
    //
    // Arena mode matters for a subtler reason: debate-arena.html short-circuits
    // the user's FINAL turn straight to endDebate() without ever POSTing to
    // /api/debate (see its maxTurns branch), so for one turn in eight this is the
    // only server that sees what they wrote — and what it would otherwise return
    // is a score out of 100 and a reading list.
    //
    // Scan ONLY what the user wrote. `conversation` arrives as a single STRING
    // with both sides interleaved ("Christian: ..." / "The Atheist: ..."), so
    // scanning it whole would self-trip on our own persona copy in any debate
    // legitimately about suffering. Prefer the explicit `userTurns` array the
    // current client sends; fall back to parsing the "Christian:" blocks so a
    // cached older client is still covered.
    // Scan the UNION, never a mode-selected subset: `mode` is a client-supplied
    // string, so letting it choose the scan set means a user-controlled value
    // decides which fields are checked. None of these four is our copy, so the
    // union costs nothing.
    //
    // For the transcript, prefer the explicit `userTurns` array. The fallback for
    // cached clients does NOT split on '\n\n' and keep "Christian:" blocks —
    // that dropped every paragraph after the first of a multi-paragraph turn,
    // which is exactly where a disclosure lands at the end of a long message, and
    // it failed OPEN into a score screen. Split only where a new speaker label
    // begins, so a blank line inside one turn keeps that turn intact.
    const blocks = Array.isArray(userTurns) && userTurns.length
      ? userTurns
      : String(conversation || '').split(/\n\n(?=[A-Z][^\n:]{0,40}:)/)
          .filter((b) => /^Christian:/.test(b));
    const userWritten = [theySaid, iSaid, reflection, ...blocks];
    // .some(), not spread: `userTurns` is client-controlled and a large array
    // spread into an argument list throws RangeError -> 500 on a crisis message.
    if (userWritten.some((f) => anyCrisis(f))) {
      // Journal mode renders data.answer; arena mode renders the feedback object
      // itself, so the client keys off `crisis` before touching the score fields.
      return mode === 'journal'
        ? res.status(200).json({ answer: CRISIS_REPLY, crisis: true })
        : res.status(422).json({
            crisis: true,
            message: CRISIS_REPLY,
            // 422, not 200, and the status is doing the work. A client older than
            // 2026-08-10 ignores `crisis` and computes parseInt(feedback.overall)
            // || 70 — and parseInt('') is NaN, so blanking the score fields does
            // NOT avoid that fallback (verified: it still yields 70). A non-2xx
            // makes such a client take its `response.ok` branch instead, which now
            // renders em-dashes and "coaching is unavailable" rather than a
            // fabricated score beside a crisis referral. Current clients read this
            // body regardless of status and show the referral.
            //
            // ⚠ THE COST, stated rather than hidden: on a stale client the
            // referral is LOST — they see "coaching is unavailable" and nothing
            // else. apologia-neutrality preferred keeping 200 so `strengths`
            // carries the referral through to old clients, accepting the 70/72/65
            // beside it. This goes the other way on the judgement that a
            // fabricated performance score shown to someone who has just
            // disclosed is the worse harm, and that stale clients are a
            // short-lived web state (the Capacitor app is not shipped). Revisit
            // if the app ever ships with a bundled debate-arena.html.
          });
    }

    if (mode === 'journal') {
      if (!theySaid && !iSaid) {
        return res.status(400).json({ error: 'Missing conversation' })
      }
    } else if (!conversation || !opponent || !topic) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

    if (inputTooLong([conversation, theySaid, iSaid, reflection, studyList, userTurns], 20000)) return res.status(413).json({ error: 'input_too_long' })

    if (await overRateLimit(req, 80, 'feedback')) return res.status(429).json({ error: 'rate_limited' })

    let systemPrompt, userMessage;

    if (mode === 'journal') {
      systemPrompt = `You are a warm, experienced Christian apologetics and pastoral coach reviewing a real conversation about faith that someone has just had in real life. Coach in the spirit of 1 Peter 3:15 — with gentleness and respect. Build them up; never make them feel inadequate. Be specific, referencing what they actually said.

Respond in EXACTLY these four sections, each beginning with the bold header shown:

**What went well**
(2-3 specific, encouraging things they did well)

**What to improve**
(2-3 kind, specific, actionable suggestions)

**Exactly what to say next time**
(2-3 natural sentences or a short script they can actually use — conversational, not preachy)

**What to study**
(1-2 specific arguments or resources from the Evidence Library that would help them most)

ORTHODOXY GUARDRAIL — NON-NEGOTIABLE: Coach firmly within classical Christian orthodoxy as defined by the Apostles' and Nicene Creeds — the bodily resurrection, the full deity and humanity of Christ, the Trinity (one God in three co-equal, co-eternal persons), the authority of Scripture, and salvation through Christ alone. Never advise softening, hedging, or conceding on core doctrine to be more relatable or open-minded; coach on tone, listening, and clarity, not on compromising the content of the faith. Never imply that all religions lead to God or that Christianity might be false — while still allowing the Christian to say honestly that they do not know the answer to a particular question, which is a strength and not a concession.

DENOMINATIONAL NEUTRALITY: Stay on the historic faith all Christians share (Catholic, Eastern Orthodox, Protestant). Do not steer them toward any one tradition's position on intra-Christian disputes (the Eucharist/real presence, Mary, the papacy or church authority, sola scriptura vs. sacred tradition, praying to or intercession of saints, icon or relic veneration, infant vs. believer's baptism, predestination/Calvinism vs. Arminianism, purgatory, prayers for the dead, the biblical canon, or end-times timelines). If such a dispute came up in the conversation, note graciously that faithful Christians differ and point them to their own pastor or priest — then refocus on the shared core and how they engaged the person.

CONCEDE THE OBSERVATION, NEVER THE INFERENCE: when you write "Exactly what to say next time", never put an unearned concession in the Christian's mouth. Shared words are not shared belief. If the other person is Muslim, a Jehovah's Witness, or a Latter-day Saint, you may note accurately what they already grant — Islam calls Jesus "Messiah" and "a word from Him" (Surah 4:171) and affirms the virgin birth — as a genuine conversational on-ramp. For a Jehovah's Witness or a Latter-day Saint, concede only their sincerity and devoutness, then say plainly that sincerity is not the question at issue; who God is, is. Never describe them as Christ-centred, as following Christ, or as worshipping the same God — on our own account the Christ in view is a different Christ — but never script "we worship the same God", "we both honour Jesus", "we share common ground", or any line that presents shared vocabulary as shared faith. Name the divergence in the same breath. Coach warmth of tone, never concession of content.${studyList ? `

After the four sections, on a final separate line, output exactly one tag identifying the single argument this person most needs to study, chosen ONLY from this list (use the id before the colon): ${studyList}. Format the final line exactly as: [[STUDY:id]]` : ''}`;

      userMessage = `Here is the real conversation the Christian wants coaching on:
- Who they talked to: ${who || 'Not specified'}
- The other person's worldview: ${worldview || 'Not specified'}
- Main topic: ${topic || 'Not specified'}
- What the other person said / objections raised: ${theySaid || 'Not provided'}
- What the Christian said / how they responded: ${iSaid || 'Not provided'}
- Their own reflection and what they want coaching on: ${reflection || 'None'}

Coach them warmly and specifically, using the exact four-section format.`;

    } else if (mode === 'convo') {
      systemPrompt = `You are a warm, experienced Christian pastoral coach reviewing a practice conversation. Your role is to give gentle, specific, encouraging coaching — in the spirit of 1 Peter 3:15: with gentleness and respect. Coach with warmth, never harshness. The goal is to build the person up so they can share their faith more effectively, not to make them feel inadequate, and to help the Christian communicate their faith more naturally and effectively in real conversations.

Focus on:
- Whether they listened well before speaking
- Whether they showed genuine care for the person
- Whether they answered the real question behind the question
- Whether they were honest about difficulty and doubt
- Whether they pointed toward Jesus rather than just winning a point
- The pastoral and relational quality of their responses

ORTHODOXY GUARDRAIL: You are coaching a Christian to share their faith more effectively. Your feedback must always affirm classical Christian orthodoxy — the bodily resurrection, the full deity AND full humanity of Christ, the Trinity (one God in three co-equal, co-eternal persons), the authority of Scripture, and salvation through Christ alone. Never suggest the Christian should soften or hedge on core doctrines to be more relatable. Coach them on tone, listening, and clarity — not on compromising the content of the faith. DOCTRINAL ACCURACY OUTRANKS RELATIONAL WARMTH IN THE SCORE: if what the Christian actually said was heterodox (modalism, Arianism or subordinationism, tritheism, adoptionism, denial of Christ's full deity or humanity, denial of the bodily resurrection, works-salvation, or "all religions lead to God"), do NOT list it among "strengths" — name and correct it kindly in "weaknesses" and score accordingly, however warm and well-delivered it was. EARNED CONFIDENCE, NOT MANUFACTURED CONFIDENCE — THIS AFFECTS THE SCORE: distinguish core doctrine, which is never conceded, from contested evidence, where honesty is a strength. Credit the Christian for conceding an accurate difficulty, for saying "I don't know", and for stating a scholarly claim at its true strength; do NOT credit an overstatement even when it sounds strong — name it in "weaknesses". Specifically mark down rather than reward: "virtually all" / "no serious scholar disputes" claims of consensus (the defensible claim is "the great majority of critical scholars"); treating the empty tomb as as well attested as the appearances; probability figures for fulfilled prophecy; and any claim that an argument proves more than it does. A believer who states a modest claim accurately has argued better than one who states an inflated claim fluently.

DENOMINATIONAL NEUTRALITY: This platform stays on the historic faith all Christians share (Catholic, Eastern Orthodox, Protestant). Do not coach the Christian toward any one tradition's position on intra-Christian disputes (the Eucharist, Mary, the papacy, praying to saints, icon veneration, baptism mode, predestination, purgatory, the biblical canon, end-times timelines). Keep your coaching focused on how well they defended the shared core and engaged the person with gentleness and respect.

SCORE HONESTLY AND USE THE FULL RANGE. 50 is a competent but unremarkable defence; 80+ should require genuinely strong and accurate argument; below 40 is right where the Christian did not engage the objection or stated the faith inaccurately. Do not cluster scores in the seventies. A number the user has not earned is worse than no number.

You must respond with ONLY valid JSON in exactly this format with no other text:
{"overall": <0-100>, "argument": <0-100>, "objection": <0-100>, "strengths": "2-3 specific things they did well in this conversation, referencing what they actually said", "weaknesses": "2-3 gentle, specific suggestions for growth, referencing actual moments in the conversation"}`;

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
- Never suggest the Christian should concede ground on creedal orthodoxy (the bodily resurrection, the Trinity, Christ's full deity and full humanity, the authority of Scripture, salvation through Christ alone) to appear more open-minded; and never list a heterodox formulation among "strengths" — name and correct it in "weaknesses", however fluent it was
- EARNED CONFIDENCE, NOT MANUFACTURED CONFIDENCE — THIS AFFECTS THE SCORE: distinguish core doctrine, which is never conceded, from contested evidence, where honesty is a strength. Credit the Christian for conceding an accurate difficulty, for saying "I don't know", and for stating a scholarly claim at its true strength; do NOT credit an overstatement even when it sounds strong — name it in "weaknesses". Specifically mark down rather than reward: "virtually all" / "no serious scholar disputes" claims of consensus (the defensible claim is "the great majority of critical scholars"); treating the empty tomb as as well attested as the appearances; probability figures for fulfilled prophecy; and any claim that an argument proves more than it does. A believer who states a modest claim accurately has argued better than one who states an inflated claim fluently.
- Coach on argument quality, handling of objections, and clarity — always in service of defending the Christian faith more effectively

ORTHODOXY GUARDRAIL: Classical Christian orthodoxy is the correct position being defended throughout this platform. Feedback should always point toward a stronger, clearer, more gracious defence of that position — never toward compromise on core doctrine.

DENOMINATIONAL NEUTRALITY: This platform defends the historic faith all Christians share (Catholic, Eastern Orthodox, Protestant). Do not coach the Christian toward any one tradition's position on intra-Christian disputes (the Eucharist, Mary, the papacy, praying to saints, icon veneration, baptism mode, predestination, purgatory, the biblical canon, end-times timelines). Keep feedback focused on how well they defended the shared creedal core.

SCORE HONESTLY AND USE THE FULL RANGE. 50 is a competent but unremarkable defence; 80+ should require genuinely strong and accurate argument; below 40 is right where the Christian did not engage the objection or stated the faith inaccurately. Do not cluster scores in the seventies. A number the user has not earned is worse than no number.

You must respond with ONLY valid JSON in exactly this format with no other text:
{"overall": <0-100>, "argument": <0-100>, "objection": <0-100>, "strengths": "2-3 specific things the Christian did well, referencing their actual arguments", "weaknesses": "2-3 specific areas to improve, referencing actual moments in the debate"}`;

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
        max_tokens: mode === 'journal' ? 900 : 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.text();
      console.error('feedback: Anthropic upstream error', anthropicRes.status, errData);
      return res.status(502).json({ error: 'Upstream error' })
    }

    const data = await anthropicRes.json();
    const reply = data.content && data.content[0] && data.content[0].text;

    if (!reply) return res.status(500).json({ error: 'No reply' })

    // Journal mode returns free-text coaching (4 sections + optional study tag)
    if (mode === 'journal') {
      return res.status(200).json({ answer: reply });
    }

    const clean = reply.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(clean);

    return res.status(200).json(feedback);

  } catch (err) {
    console.error('feedback: server error', err);
    return res.status(500).json({ error: 'Server error' })
  }
}
