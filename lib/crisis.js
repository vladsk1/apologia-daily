// content-review: {"argument": "2026-08-10", "orthodoxy": "2026-08-10", "by": "2026-08-10 (bereavement branch, OWNER-REQUESTED): the owner asked what a real person receives for \"Do people who commit suicide go to hell?\". Run against the live endpoint: it trips on \"commit suicide\" and returns the WHOLE crisis reply, addressed to them as though they were at risk — and that question is very often asked BY THE BEREAVED. The prior stamp claimed the third-party sentence MITIGATED this; that was false, because the person asked about has already died and \"help them reach one of these people today\" is meaningless there. Two sentences added at the end of paragraph 3, after the referral ladder and before the not-a-substitute close. ⭐ THE TWO GATES CONFLICTED DIRECTLY ON IT AND THE MERGE TOOK WHAT EACH WAS PROTECTING: apologia-orthodoxy [DRIFT] — the colon in \"I am sorry: that is a question worth...\" bound the apology to the DECLINE, so it read \"sorry, I won't answer that\", the brush-off cadence the disclaimer-last rule exists to keep out — and it directed NOT to use \"I am sorry for your loss\", which presumes a relation the conditional does not establish. apologia-argument [WEAK] — \"it deserves more than an automated answer\" MISSTATES OUR REASON (we decline on denominational neutrality, not because the format is inadequate) and, to a reader braced for the worst, reads as withheld bad news; it proposed exactly the \"for your loss\" wording orthodoxy barred. Resolution: apology unbound by a full stop (both), second-person object presuming no relation (orthodoxy's wording), the false reason dropped and replaced with \"not because I am holding anything back, but because it belongs with a pastor or priest\" (argument's wording) — a claim about OUR provision, adjudicating nothing about the deceased. Also corrected two comments the change falsified: this stamp's \"mitigates\" clause, and the header's claim that EVERY clause is ported from api/ask.js (this sentence has no counterpart there and is freshly authored — flagged in the header as carrying this file's gate only). ⚠ STILL UNMITIGATED, deliberately: \"I don't want to die — is there really an afterlife?\" trips on the bare \"want to die\" and still gets told their life has real worth. ⚠ apologia-argument's structural note: a same-day edit to a same-day-stamped file is INVISIBLE to check-stamp-integrity, which is date-based. ⚠ ORTHODOXY [NOTE] FOR THE PASTORAL REVIEWER, not fixable by wording: the sentence puts \"already died\" in front of a reader contemplating death. Unavoidable to reach the case, but a human should weigh it. Human/pastoral sign-off on CRISIS_REPLY remains _pending_ in docs/STATEMENT_OF_FAITH.md. PRIOR: FIRST GATE of this new file. apologia-orthodoxy round 3: CLEAN + STAMPABLE — CRISIS_REPLY re-read clause-by-clause and confirmed a faithful port of the certified PASTORAL CARE block in api/ask.js (imago Dei and God's love stated as universal claims about God's disposition, NOT the reader's standing, so not universalism; Christ offered as presence not argument; referral before disclaimer; denominationally neutral 'pastor or priest'; no diagnosis; no verdict on the eternal fate of the suicided, which divides the traditions and is not this file's job). apologia-argument round 3: SOUND — concedes nothing, asserts nothing about the reader's standing, no overstatement, the third-party sentence does the work the header claims. Three rounds of both lenses. WHAT THE STAMP DOES NOT COVER: human/pastoral sign-off, still _pending_ in docs/STATEMENT_OF_FAITH.md — and this is the sentence the site says to someone in danger. KNOWN AND RECORDED, not assumed: the regex catches ~20 fixed phrasings and misses most of how distress is actually expressed; 'Do people who commit suicide go to hell?' is an accepted false positive the third-party sentence mitigates (SUPERSEDED — see the 2026-08-10 correction at the head of this stamp), and 'I don't want to die - is there an afterlife?' is an accepted UNMITIGATED misfire."}
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
//                       parents.html, AND the Explain It Back grader on all 67
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
// tools/test-crisis-routing.mjs scans api/*.js and flags every file that reads a
// request body at all; opting out requires a written CRISIS_EXEMPT reason. It is
// deliberately NOT a list of known field names — that was the first cut, and it
// was a hand-maintained allowlist wearing a disk enumeration as a disguise: a new
// endpoint reading body.text or body.story would have passed silently, and the
// comment here would have told the next session it could not. A hand-maintained
// allowlist is not a net — that is how pocket-cards.html sat outside
// CONTENT_PATTERNS for months, and how devotional.js and feedback.js were missed
// on this change's own first pass.
//
// ── WHAT THIS LAYER IS AND IS NOT ───────────────────────────────────────────
// A model instruction can be argued out of; a string match cannot — but ONLY for
// the phrasings on the list, which is a small fraction of how distress is actually
// expressed. "I don't see the point any more", "I've been having dark thoughts",
// "I don't want to wake up tomorrow" all miss. So this is a floor, not a ceiling,
// and the second layers are not optional extras: api/ask.js pairs it with a Haiku
// PASTORAL verdict, and api/tutor.js and api/debate.js carry PASTORAL CARE
// instructions in their own system prompts for the signals the regex misses.
// api/devotional.js now carries one too — it is the surface where a miss costs
// most, since its whole job is to invite the person deeper into what they wrote.
// (api/feedback.js remains regex-only; recorded honestly rather than assumed.)
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
// sentence below, PLUS a second branch added 2026-08-10 for the case that
// sentence still could not reach: someone asking about a person who has ALREADY
// DIED. "Help them reach one of these people today" is meaningless there, so the
// reply now names that case, declines to answer it, and sends them to a person —
// which is also the denominationally right move, since whether a suicide is lost
// is a question the traditions answer differently and no automated tool should
// settle. ⚠ The SECOND known false positive is still unmitigated: "I don't want
// to die — is there really an afterlife?" is first-person, non-crisis and about
// nobody else, so that reader still gets told their life has real worth and that
// reaching out was brave. An accepted misfire, not a solved one.

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
// ⚠ ONE EXCEPTION, added 2026-08-10 — the BEREAVEMENT BRANCH, the two sentences
// beginning "And if you came here asking about someone who has already died".
// They have NO counterpart in api/ask.js and were authored here, because the owner
// asked what a real person receives for "Do people who commit suicide go to hell?"
// and the answer was the whole crisis reply, addressed to them as though they were
// at risk — the existing third-party sentence could not reach the case, since the
// person asked about has already died. They carry THIS file's gate only, not
// api/ask.js's: treat them as new content in any future review, and consider
// back-porting them into api/ask.js's own PASTORAL CARE block.
//
// ⚠ The third-party sentence is not decorative. The regex cannot tell "I don't
// want to live" from a parent reporting "my child said she doesn't want to live"
// — and on parents.html, whose client wraps input as 'My child is N years old and
// asked me: "..."', the third-party case is the LIKELIER true positive. Without
// that sentence the reply is addressed to the wrong person at the worst moment.
//
// ⚠ STRUCTURAL LIMIT, stated rather than left implicit: api/ask.js's PASTORAL CARE block shifts the
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
  "Please talk to a real person today: someone you trust, a pastor or priest, or a professional counsellor. For a free, confidential crisis line in your own country, findahelpline.com lists them worldwide. If you or someone else may be in immediate danger, please contact your local emergency services now. If you are writing about someone else, the same is true of them — please help them reach one of these people today. And if you came here asking about someone who has already died, I am sorry you are carrying that. I am not going to try to answer it here — not because I am holding anything back, but because it belongs with a pastor or priest who can sit with you.",
  "",
  "This is an automated tool, and it is not a substitute for a real person who can be with you. And the hope of Christ is here for you too — not as an argument, but as presence and comfort. Please reach out to someone today.",
].join('\n');
