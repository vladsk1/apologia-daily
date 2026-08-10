// Shared CRISIS BACKSTOP for every Claude-calling API endpoint.
//
// Lives OUTSIDE api/ so Vercel never turns it into a serverless function (we're at
// the Hobby 12-function limit); it's bundled into each endpoint that imports it.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
// CLAUDE.md's PASTORAL CARE exception says a message that is a cry for help —
// suicidal ideation, self-harm, abuse or danger, acute despair, "should I stop my
// medication and just pray?" — must NEVER get a confident apologetics answer. The
// faithful response is compassion plus a referral to a real person.
//
// Until 2026-08-10 that path existed in exactly ONE endpoint, api/ask.js. The
// other three took free text from users with nothing behind them:
//   • /api/tutor  — the "ask a question about this argument" box on 72 pages,
//                   INCLUDING ev-m-evil.html (the problem-of-evil page) and
//                   parents.html, whose client wraps whatever a parent types into
//                   'My child is N years old and asked me: "..."' — a wrapper that
//                   does not merely miss a disclosure, it disguises one.
//   • /api/debate — the Debate Arena, whose personas are told never to break
//                   character while an adversarial persona argues back.
//   • /api/submit-question — a standalone form on answers/index.html that
//                   returned a canned thank-you and nothing else.
//
// The regex below was previously inline in api/ask.js. It is unchanged: this
// module is where it now lives, so all four endpoints share one alarm instead of
// one having it and three not. A new endpoint that takes user text is expected to
// import it — tests/crisis-guard.test.mjs fails if one doesn't.
//
// ── WHY A REGEX AND NOT JUST THE CLASSIFIER ─────────────────────────────────
// api/ask.js pairs this with a Haiku PASTORAL verdict that catches subtler signals
// (abuse, harm-to-others) no fixed phrase can. The two are deliberately BOTH
// present: as the comment there puts it, crisis routing "never rests on Haiku
// alone." A model instruction can be talked around; this cannot. So this is the
// floor, not the ceiling — endpoints that can afford a classifier should still run
// one, and api/debate.js and api/tutor.js additionally carry a break-character
// instruction in their prompts for the cases the regex misses.
//
// False positives are harmless by design: the person gets a warm pastoral message
// instead of an apologetics answer. That trade is deliberate and is the same call
// api/ask.js already made.

/* eslint-disable-next-line no-useless-escape */
const CRISIS_RE = /\b(kill myself|killing myself|end my life|ending my life|want to die|wanna die|don'?t want to (be alive|live)|take my (own )?life|taking my (own )?life|suicidal|commit suicide|better off (dead|without me)|no reason to live|hurt myself|harm myself|cutting myself|stop (taking|my) (my )?(meds|medication)|end it all)\b/i;

/**
 * True when the text carries an unmistakable first-person crisis signal.
 * Accepts anything stringable; non-strings are simply not a crisis.
 */
export function isCrisis(text) {
  return CRISIS_RE.test(String(text == null ? '' : text));
}

/** The raw pattern, for the offline harness in tools/test-crisis-routing.mjs. */
export const crisisPattern = CRISIS_RE;

// ── THE REPLY ───────────────────────────────────────────────────────────────
// DOCTRINAL/PASTORAL CONTENT — gated like any content (argument + orthodoxy).
//
// Every clause here is PORTED from the already-certified PASTORAL CARE block at
// the top of api/ask.js's system prompt rather than freshly authored, per the
// "PORT, DON'T AUTHOR" rule in CLAUDE.md. Specifically it keeps that block's
// deliberate choices, each of which was argued for there:
//   • second-person acknowledgment of THEIR pain, never the tool's feelings
//     about the message ("I'm so glad you told me" is explicitly ruled out —
//     it implies the tool is the support they need);
//   • their worth stated as imago Dei and God's love, not as an argument;
//   • a real person named FIRST and quickly — someone they trust, a pastor or
//     priest, a professional counsellor — then findahelpline.com, then emergency
//     services if there is immediate danger;
//   • Christ offered as comfort and presence, NOT as a case to be made;
//   • no diagnosis, no medical advice, no attempt to talk anyone out of how they
//     feel, and no theodicy.
//
// It is deterministic on purpose. The regex above is deterministic precisely so a
// model cannot be talked around it; a model-generated reply would hand that back.
export const CRISIS_REPLY = [
  "What you have written matters more than the question you came here with, so I am going to set the usual answer aside.",
  "",
  "You are not alone, and what you are carrying sounds heavy. Your life has real worth — you are made in God's image and you are deeply loved by God. Reaching out is a good and brave thing to do.",
  "",
  "Please talk to a real person today: someone you trust, your pastor or priest, or a professional counsellor. For a free, confidential crisis line in your own country, findahelpline.com lists them worldwide. If you or someone else may be in immediate danger, please contact your local emergency services now.",
  "",
  "This is a study tool, and it is not a substitute for a real person who can be with you. Christ is with you too — not as an argument, but as presence and comfort. Please reach out to someone today.",
].join('\n');
