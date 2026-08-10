// Shared CRISIS BACKSTOP for every API endpoint that takes free text from a user.
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
// Until 2026-08-10 that path existed in exactly ONE endpoint, api/ask.js. FIVE
// others took free text with nothing behind them:
//   • /api/tutor      — the "ask about this argument" box on library/*.html and
//                       parents.html, AND the Explain It Back grader on all 63
//                       ev-m-*.html pages. Note which is which: ev-m-evil.html,
//                       the problem-of-evil page, has NO Q&A box — its only
//                       tutor call is the grader. So a first cut of this work
//                       that skipped grader mode left the single likeliest
//                       disclosure surface on the site unguarded.
//   • /api/debate     — the Debate Arena, personas told never to break character.
//   • /api/devotional — a reflection box whose entire job is to ask a warm
//                       follow-up question. Worse than an apologetics answer: it
//                       draws the person further in.
//   • /api/feedback   — conversation-journal mode takes `theySaid`, `iSaid` and
//                       `reflection` ("what they want coaching on"), 20k chars.
//   • /api/submit-question — a standalone form on answers/index.html that
//                       answered a cry for help with a canned thank-you.
//
// The regex below was previously inline in api/ask.js. It is unchanged apart from
// the smart-apostrophe fix noted at the pattern. All six endpoints now share it.
//
// ── THE NET IS ENUMERATED FROM DISK, NOT HAND-MAINTAINED ────────────────────
// tools/test-crisis-routing.mjs scans api/*.js, classifies each file by whether it
// reads free text AND calls the Anthropic API, and fails if such a file does not
// import isCrisis. An endpoint may opt out only via an explicit CRISIS_EXEMPT
// entry carrying a written reason. A hand-maintained allowlist is not a net —
// that is exactly how pocket-cards.html sat outside CONTENT_PATTERNS for months,
// and it is how devotional.js and feedback.js were missed on the first pass here.
//
// ── WHAT THIS LAYER IS AND IS NOT ───────────────────────────────────────────
// A model instruction can be argued out of; a string match cannot — but ONLY for
// the phrasings on the list, which is a small fraction of how distress is actually
// expressed. "I don't see the point any more", "I've been having dark thoughts",
// "I don't want to wake up tomorrow" all miss. So this is a floor, not a ceiling,
// and the second layers are not optional extras: api/ask.js pairs it with a Haiku
// PASTORAL verdict, and api/tutor.js and api/debate.js carry PASTORAL CARE
// instructions in their own system prompts for the signals the regex misses.
// (api/devotional.js and api/feedback.js are regex-only — recorded honestly here
// rather than left to be assumed.)
//
// ── FALSE POSITIVES ARE NOT UNIFORMLY HARMLESS ──────────────────────────────
// On the Q&A surfaces (ask, tutor) a false positive costs the person one answer
// they can ask again — genuinely harmless, and the same call api/ask.js already
// made. It is NOT harmless everywhere, and that trade is accepted deliberately in
// exchange for determinism:
//   • /api/debate  — corrupts a practice exercise and ends it early.
//   • /api/submit-question — suppresses the receipt for a legitimate asker and
//     costs founder attention; enough of them and the URGENT flag stops being
//     read, which is how check-stamp-integrity reached 59 unread flags.
// Two false positives WILL occur in production and are known by name:
//   • "Do people who commit suicide go to hell?" — a very common question, often
//     asked BY THE BEREAVED about someone who has died.
//   • "I don't want to die — is there really an afterlife?" — no negation guard.
// Negation lookbehinds are fragile and an over-narrow net cries wolf either way
// (see tools/retired-claims.json's tuning lessons), so instead the reply itself
// does not presume the writer is the person at risk — see the third-party
// sentence below, which de-fangs both.

// ⚠ The apostrophe class is load-bearing: iOS and macOS substitute a curly
// U+2019 by default, so /don'?t/ silently missed "I don't want to be alive"
// typed on a phone — the majority of our traffic — while the test corpus, which
// used a straight quote, passed. Any apostrophe added here must accept both.
const CRISIS_RE = /\b(kill myself|killing myself|end my life|ending my life|want to die|wanna die|don['’]?t want to (be alive|live)|take my (own )?life|taking my (own )?life|suicidal|commit suicide|better off (dead|without me)|no reason to live|hurt myself|harm myself|cutting myself|stop (taking|my) (my )?(meds|medication)|end it all)\b/i;

/**
 * True when the text carries an unmistakable first-person crisis signal.
 * Accepts anything stringable; non-strings are simply not a crisis.
 */
export function isCrisis(text) {
  return CRISIS_RE.test(String(text == null ? '' : text));
}

/**
 * True when ANY of the given fields carries a crisis signal. Pass only fields the
 * USER wrote — never our own persona copy, prompt scaffolding or topic strings,
 * which would self-trip on content legitimately about suffering.
 */
export function anyCrisis(...fields) {
  return fields.some((f) => isCrisis(f));
}

/** The raw pattern, for the offline harness in tools/test-crisis-routing.mjs. */
export const crisisPattern = CRISIS_RE;

// ── THE REPLY ───────────────────────────────────────────────────────────────
// DOCTRINAL/PASTORAL CONTENT — gated like any content (argument + orthodoxy).
//
// Every clause is PORTED from the already-certified PASTORAL CARE block at the top
// of api/ask.js's system prompt rather than freshly authored, per CLAUDE.md's
// "PORT, DON'T AUTHOR" rule. It keeps that block's deliberate choices, each of
// which was argued for there:
//   • second-person acknowledgment of THEIR pain, never the tool's feelings about
//     the message ("I'm so glad you told me" is explicitly ruled out — it implies
//     the tool is the support they need);
//   • worth as imago Dei and God's love — universal claims about God's disposition
//     and human nature (Gen 9:6, Jas 3:9, Rom 5:8), NOT a claim about the reader's
//     standing, so it is safe served to a non-believer and is not universalism;
//   • a real person named FIRST and quickly — someone they trust, a pastor OR
//     PRIEST (the site's denominationally neutral formulation; dropping "priest"
//     names nobody a Catholic or Orthodox reader would actually call), then
//     findahelpline.com, then emergency services;
//   • the HOPE OF CHRIST offered as comfort and presence, not as a case. The
//     certified block offers it; an earlier draft here asserted "Christ is with
//     you," which in Christian idiom (Matt 28:20, John 14:23 — both to disciples)
//     reads as covenantal presence and so asserts more about the reader than the
//     source authorises;
//   • the not-a-substitute disclaimer LAST, after the warmth and the referral.
//     Placed first it reads as a brush-off; placed here it is a hand-off. Do not
//     move it;
//   • no diagnosis, no medical advice, no theodicy, no attempt to talk anyone out
//     of how they feel. Note it does NOT tell the "stop my medication" case to
//     keep taking it — that would be medical advice, and the certified block
//     shows the same restraint.
//
// ⚠ The third-party sentence is not decorative. The regex cannot tell "I don't
// want to live" from a parent reporting "my child said she doesn't want to live"
// — and on parents.html, whose client wraps input as 'My child is N years old and
// asked me: "..."', the third-party case is the LIKELIER true positive. Without
// that sentence the reply is addressed to the wrong person at the worst moment.
//
// ⚠ STRUCTURAL LIMIT, stated rather than left implicit: api/ask.js:173 shifts the
// emphasis toward immediate safety when the danger is toward SOMEONE ELSE. Fixed
// text cannot express that branch. It is moot today because CRISIS_RE matches only
// self-directed signals — but if anyone widens the pattern to harm-to-others
// phrasings, this reply becomes the wrong branch and must be split first.
//
// It is deterministic on purpose. The regex is deterministic precisely so a model
// cannot be talked around it, and it must work when the Anthropic key is dead or
// unset — where a model-generated reply would 500 a crisis message.
export const CRISIS_REPLY = [
  "What you have written matters more than what you came here for, so I am going to set the usual answer aside.",
  "",
  "You are not alone, and what you are carrying sounds heavy. Your life has real worth — you are made in God's image and you are deeply loved by God. Reaching out is a good and brave thing to do.",
  "",
  "Please talk to a real person today: someone you trust, a pastor or priest, or a professional counsellor. For a free, confidential crisis line in your own country, findahelpline.com lists them worldwide. If you or someone else may be in immediate danger, please contact your local emergency services now. If you are writing about someone else, the same is true of them — please help them reach one of these people today.",
  "",
  "This is an automated tool, and it is not a substitute for a real person who can be with you. And the hope of Christ is here for you too — not as an argument, but as presence and comfort. Please reach out to someone today.",
].join('\n');
