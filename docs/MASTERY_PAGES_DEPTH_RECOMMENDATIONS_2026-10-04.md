# Making the mastery pages a *real* place to master an argument — options & depth report (2026-10-04)

**Owner ask (2026-10-04):** make the `ev-m-*` mastery pages genuinely better and more thorough —
*"each section needs to be better and more in depth… the place where users can really master the
argument, not just a gimmick. If done completely the user should really be able to master the
argument. Don't make it easy."* Research how it can be done; **report only, no changes made.**

This is the rigor/depth companion to [`docs/MASTERY_LEARNING_ASSESSMENT_2026-09-26.md`](MASTERY_LEARNING_ASSESSMENT_2026-09-26.md)
(which asked "what *modes* are missing" and whose top-5 are now largely **built** — see §1) and to the
roadmaps it cites (`LEARNING_ROADMAP_2026-09-09.md`, `PRODUCT_ROADMAP.md`). The 09-26 doc answered
*"what rungs are missing."* This doc answers the owner's sharper question: *"why does 100% still not
mean mastery, and how do we make earning it genuinely hard — section by section?"*

Nothing here is built. Everything here is **content + doctrinal-gate work** as much as it is
engineering — read §8 before scoping any of it.

---

## 0. Headline

**The scaffolding is excellent; the *standard* is the gimmick.** The page already has, or (via
`lib/review-queue.js`) injects, almost every mechanic the learning science rewards. What it does **not**
have is a **bar that is hard to clear**. "Mastered — turned gold on your shelf" is currently reachable
by: opening the accordions, scoring 7/10 **once** on one Explain-It-Back, flipping **5** recognition
flashcards once, and typing **9 characters** into the debate box (or just clicking "reveal a model
response" — `ev-m-kalam.html:783`, `788`). That is an **activity tracker wearing the word "mastery,"**
and it is exactly the *illusion of fluency* the science warns against (Bjork; Kruger–Dunning): the
learner leaves feeling ready and is not.

So the fix the owner is asking for is **not mainly more features** — it is to (a) **redefine what
"mastered" costs** so it can only be earned by demonstrated, spaced, repeated retrieval against a real
threshold, and (b) **deepen each section's content** so there is enough substance, difficulty, and
graded challenge for that bar to mean something. Both, together. Deepening content without raising the
bar just makes a longer gimmick; raising the bar without deepening content makes an unfair one.

The governing idea, from the research, is the **desirable-difficulty** principle: *conditions that make
practice harder and slower in the moment produce better long-term recall and transfer.* "Don't make it
easy" is not just the owner's instinct — it is the finding.

---

## 1. What already exists (so recommendations are additive, not duplicative)

Every `ev-m-*.html` page (81 of them, uniform) is a three-phase track:

**Phase 1 — Understand it:** a 3-paragraph crawlable SEO summary · the formal syllogism (P1/P2/∴C) ·
a "what must the cause be" **chip row** · **2** premise-defence accordions (intuition / track record) ·
**~6** objection accordions (each: *strongest form* → *reply*, badged Common/Trickier/Hard) · a
"hardest objection" callout linking to the essay · a **"Touch the originals"** static list of ~4 primary
sources.

**Phase 2 — Practice it:** **Explain It Back** (free-text → real AI grade 1–10 via `/api/tutor` grader
mode, with a local regex fallback) · **5 flashcards** (flip) · **1** seeded "live objection" + a reveal
model answer · a **Memory Palace** link.

**Phase 3 — Prove it:** a 4-item checklist (understood / explained / drilled / defended) · a
self-rated confidence row · a share-card PNG · "next argument" CTA · a **"Defend it live"** button into
the Debate Arena (`defend-live.js`).

**Already injected at runtime by `lib/review-queue.js` (all 81 pages) — the 09-26 top-5, mostly shipped:**
- **Spaced-repetition** (SM-2-lite ladder 1→3→7→16→35→90 days) with a "time to refresh" retrieval banner.
- **Calibration**: predict-your-score-before-you-check on Explain It Back, then shows the gap ("predicted 8, scored 5").
- **Completion/cloze "fill in the blanks"** drill (worked-example → completion → independent fading ladder) built by cloze-ing the page's own model answer.
- **Socratic "Teach me this"** launcher (multi-turn guided reconstruction, `api/tutor.js` socratic mode, scoped to the page's certified text, crisis-guarded, gated).
- **Interleaving CTA** into `objection-deck.html?arg=` (the mixed deck).

So the **mode gaps the 09-26 assessment flagged are largely closed.** What remains open is precisely the
owner's point: **depth and rigor of each section, and a mastery standard that is actually demanding.**
That is what the rest of this doc is about.

---

## 2. The core diagnosis — four reasons it still reads as a gimmick

1. **The dial measures *activity*, not *competence*.** All four checkpoints are one-shot and three of
   the four are near-free (open accordions; flip 5 cards; type 9 chars / click reveal). Only
   Explain-It-Back tests anything, and passing is 7/10 **once, forever**. There is no threshold, no
   repetition, no decay-and-re-prove. **100% ≠ mastery.**
2. **The content is thin for a "mastery" claim.** 5 flashcards and ~6 objections per argument is a
   *summary*, not a *curriculum*. A learner who truly mastered Kalam would field a dozen+ distinct
   objections, know the primary sources cold, and handle a curveball they have never seen. The page
   gives them enough to *recognise*, not enough to *master*.
3. **Mastery is binary and permanent.** It is gold or not-gold, and once gold it only ever gets a soft
   30-day nudge. Real mastery is **graded** (there is a difference between "can state it" and "can win
   the hard exchange cold") and **perishable** (it must be re-proven over spaced intervals or it lapses).
4. **Nothing tests transfer.** Every drill rehearses the *exact* material on the page. Mastery is the
   ability to deploy the argument against a **novel** objection, a **hostile re-frame**, or a **blend**
   of topics — none of which the page ever asks for. This is the gap between "knows the answers" and
   "can actually use it in a live conversation," which is the stated product goal.

Everything in §4–§6 fixes one of these four.

---

## 3. The governing standard — redefine "mastery" before touching any section

This is the backbone. Adopt an explicit, research-grounded definition of "mastered" and make the whole
page serve it. Four pillars, all A-tier evidence:

- **A real criterion, not an activity.** Mastery-learning's standard is **80–90% correct on a formative
  test before you advance** (Bloom's 2-sigma work; Slavin). Port that: a checkpoint is cleared by hitting
  a *score threshold on a retrieval task*, not by clicking.
- **Successive relearning, not one-and-done.** The durable-memory gold standard is: **recall to a
  criterion (≈3 correct retrievals), then relearn ≈3× at widely spaced intervals.** So "mastered" should
  require the learner to re-demonstrate the argument on ≥3 separate, spaced sessions — not pass once.
  This *is* the connection between the dial and the SR engine, made into the definition of success.
- **Desirable difficulties by design.** Free recall before any reveal; generation over recognition;
  variability and interleaving; **intermittent** rather than continuous feedback; escalating objection
  difficulty. Each makes a session harder and slower and the memory more durable and more transferable.
- **Graded levels, not a binary.** Replace "gold / not gold" with an earned ladder that maps to Bloom's
  cognitive levels and to what the argument is *for*:

  | Level | What it certifies (Bloom) | How it is earned |
  |---|---|---|
  | **Bronze — Understand** | Remember / Understand | Reconstruct the syllogism + name what the cause/claim must be, from memory, ≥80% |
  | **Silver — Defend** | Apply / Analyse | Field the ~6 certified objections cold (if-then), rubric-scored; pass the graded Explain-It-Back ≥8 |
  | **Gold — Master** | Evaluate / Create | Handle an **unseen** objection + a spoken live exchange, *and* re-prove Bronze/Silver on ≥3 spaced reviews (successive relearning) |

  Gold should be genuinely hard to reach and should **decay** if reviews lapse (it can drop to Silver and
  be re-earned). That single change converts the page from a checklist into a standard.

Everything below assumes this redefinition. Present it honestly in the UI ("Gold means you've proven
this three times, weeks apart, including against an objection you'd never seen" — earned confidence, the
1 Peter 3:15 frame), and **never** market it as "mastery guaranteed" (the deliberate-practice dosage
literature won't support that — Macnamara et al. 2014).

---

## 4. Phase 1 — "Understand it": options to deepen

The weakness: it is **read-only** (open an accordion = "understood") and **thin** (2 premise defences,
~6 objections, a chip row, a static source list). Options, strongest first:

**4.1 Turn "understood" into a retrieval gate, not an open-the-accordion gate.** Today `state.read`
flips when every accordion is opened. Replace with a short **structure-reconstruction check**: after
reading, the learner drags/orders the premises, or types the conclusion, or selects *which premise* each
of 3 mini-objections attacks — ≥80% to clear. *(Mastery criterion; generation effect.)* This alone kills
the biggest "gimmick" tell in Phase 1.

**4.2 A "key terms" pretraining strip** at the top of each page (define *anarthrous*, *homoousios*,
*pelach*, *harpagmos*, *actual infinite*, *BGV theorem* **before** the argument leans on them). Mayer's
pretraining principle; cheap, static, one small gated block per page. Reduces the load that otherwise
makes the hard objections bounce off.

**4.3 Derive the cause/claim instead of listing it.** The chip row ("uncaused · timeless · spaceless …
plausibly personal") hands the learner the conclusion. Make it a **derivation drill**: "A cause of *all*
space → therefore it cannot be ___?" revealing one property at a time as the learner reasons it out.
*(Generation effect; it also trains the *honest-scope* discipline — "not yet the God of the Nicene
Creed" — which the gates care about.)*

**4.4 Deepen and *grade* the objection set — the single biggest content lift.** Move from ~6 to a
**tiered bank of 10–15 objections per argument**, explicitly laddered:
- **Tier 1 (Common):** the front-door versions ("what caused God?", "that's just religion").
- **Tier 2 (Trickier):** the informed-skeptic versions (quantum vacuum, Cantor/actual-infinite).
- **Tier 3 (Hard / the literature):** the live academic objections the essays already name but the
  mastery pages mostly omit — **Morriston, Oppy, Carroll, Guth's dissent** for Kalam; **Allison,
  Carrier, the hallucination theories** for the resurrection; **Ehrman** done at full strength for the
  NT; the named critics on fine-tuning (**Stenger, Hossenfelder** — with the mandatory symmetry fence).
  The 09-26 and `MASTERY_PAGE_AUDIT.md` passes already flag that the strongest living critics are
  *named in the essays but absent from the pages* — this closes that, and it is where "don't make it
  easy" literally lives.

  ⚠ **This is heavy content work, not a UI change.** Every objection card is doctrinal content: it must
  be **ported from the paired certified essay's own text** (the port-don't-author rule — see §8), then
  re-gated argument + orthodoxy (+ neutrality for deity/Trinity/Islam/resurrection). A Tier-3 bank
  authored freshly is exactly how a page gets *worse*.

**4.5 A "name the target" discrimination drill.** Interleaving is clearest when categories are
*confusable* (Rohrer; Firth), and apologetics objections are confusable (does "the universe could be
infinite" attack P1 or P2? is "then who made God" a P1 attack or a scope confusion?). A quick drill —
"which premise / which step does this objection target?" across a shuffled set — trains the exact
diagnostic skill the page already says is "half the battle" (`ev-m-kalam.html:345`) but never drills.

**4.6 Make "Touch the originals" a retrieval task, not a static list.** Right now the primary sources
are read-only furniture. Options: a match drill (source ↔ what it establishes), a "which source would you
cite for *this* claim?" prompt, or a one-line "what does Vilenkin actually concede?" recall. Turns the
most-ignored section into a memory hook for the citations a learner needs in a real argument.

**4.7 A steelman-first exercise.** Before showing the reply, ask the learner to **state the objection in
its strongest form themselves** (type it), then compare to the certified steelman. Self-generation +
it directly trains the 1 Peter 3:15 "steelman before you answer" habit the whole site is built on.

---

## 5. Phase 2 — "Practice it": options to deepen

The weakness: one Explain-It-Back (pass once), 5 recognition flashcards, one scripted objection. Options:

**5.1 Explain It Back: free-recall-first, escalating, and re-demonstrated.**
- **Hide the whole argument during the attempt** (free recall, not look-and-paraphrase). *(Testing
  effect; the strongest drill on the page — promote it, don't bury it among four.)*
- **Escalate the prompt across attempts:** attempt 1 "state it"; attempt 2 "state it *and* answer the
  hardest objection"; attempt 3 "explain it to a 12-year-old *and* to a hostile grad student"
  (variability of practice; transfer).
- **Richer rubric feedback.** The grader already has `ARG_PREMISES`; feed it the certified **objections
  and concessions** too, so it can say "you never conceded the BGV theorem's limits" — specific, present
  feedback is what the evidence rewards (timing matters less than specificity). This is a prompt change to
  the grader call, scoped to certified text.
- **Require re-demonstration for Gold** (successive relearning): the Silver→Gold step needs ≥3 passing
  Explain-It-Backs on separate spaced days, not one.

**5.2 Flashcards: more of them, harder, and criterion-based.**
- **Grow the deck** from 5 to ~12–15 (ported from the premises, objections, concessions, sources, and
  the key terms) — but **type-the-answer / cloze first, flip to check second** (Quizlet's own data:
  Write/Learn ≫ Match/flip; `review-queue.js` already cloze-s the model answer — extend that pattern to
  the deck).
- **Grade each card** ("got it / missed it") and require a **≥3-correct criterion per card** before it
  counts, then hand it to the SR ladder. *(This is what "drilled it" should mean — not "flipped 5 cards
  once.")*

**5.3 The live objection: a graded ladder, not one scripted line.** Replace the single seeded skeptic +
reveal with the worked→completion→independent→**novel** ladder:
- **Worked:** read the certified model exchange (exists).
- **Completion:** the cloze version (`review-queue.js` injects this — keep).
- **Independent:** answer 3–4 *different* certified objections cold, **rubric-scored on rebuttal
  quality** (accurate · relevant · strong · *concedes what's owed* — the debate-assessment literature's
  dimensions, adapted to the house "concede the observation, never the inference" rule).
- **Novel (the Gold gate):** one **unseen** curveball per argument — a re-framed or blended objection the
  page never showed — graded by `/api/tutor` against the certified rails. This is the transfer test, and
  it is the thing that makes Gold *mean* "could actually hold the line."

  ⚠ Each model answer, rubric, and curveball is doctrinal content → port + gate (§8). The curveball is
  the riskiest string on the page (it's the one most likely to be authored, not ported) — it must be
  built from an objection the essay already answers, phrased differently, never a new claim.

**5.4 Spoken production.** A live conversation is *spoken*. The Debate Arena already has Web Speech mic +
TTS; the 09-26 doc flagged that the one missing piece is wiring voice into the Explain-It-Back / live-
objection box so the learner *says* the argument out loud, under mild time pressure. Highest realism for
the actual goal; mechanic already solved elsewhere.

**5.5 Interleaved "boss" drill.** The `objection-deck.html?arg=` CTA already gives per-argument practice;
add a **mixed final drill** that pulls objections at random across *all* the learner's studied arguments
(and, for confusable clusters, deliberately adjacent ones — Trinity vs. modalism vs. Arian). *(Interleaving
for transfer.)* Position it as a Gold-level gate, not an optional link.

**5.6 "Teach it" (Feynman) as a first-class drill.** The Socratic launcher has the learner *receive*
guidance; flip it so the learner *teaches* the AI "student" who plays a confused friend and asks
"why?" — the generation + self-explanation effect, and the truest test of mastery ("could teach it" is
already the top confidence label on the page). Reuses the socratic endpoint with an inverted role.

---

## 6. Phase 3 — "Prove it": make it an actual exam

The weakness: a 4-click checklist + self-rating. Options:

**6.1 Replace the checklist with the Bronze/Silver/Gold ladder from §3,** each earned by the graded
tasks above, each shown with *what it certifies* and *what it cost* ("Gold — proven 3× over 5 weeks,
including an unseen objection"). Honest, hard, and legible.

**6.2 A real "final exam" / certification attempt.** A timed, mixed, closed-book assessment per argument
(or per cluster): reconstruct + 3 objections incl. one unseen + state the honest concession → a single
scored pass/again. *(Mastery criterion; closed-book testing effect.)* This is the ceremony that makes
"mastered" worth something and is the natural anchor for the **named-review-board moat** the market docs
keep flagging ("certified by a real review board" is a far bigger trust claim than a gold dot).

**6.3 Calibration kept and strengthened.** `review-queue.js` already does predict-then-check; extend it
to the exam ("you predicted Gold; you're at Silver — here's the one link to close").

**6.4 Decay + re-prove.** Gold lapses to Silver if the spaced reviews aren't cleared; the dashboard "due
today" queue (already built via `lib/study-queue.js`/`today.html`) surfaces it. Perishable mastery is
honest mastery.

**6.5 The transfer artifact — the conversation-companion kit.** The 09-26 doc's one true differentiator:
assemble, from *this learner's own misses*, a one-page "I'm about to talk to a JW" sheet (the objections
they fumbled, the steelman, the concession, how to say it graciously). It is the literal product form of
"wield the argument in a live conversation," no competitor can copy it (needs the mastery data only this
site tracks), and it turns Phase 3 from a scoreboard into a deliverable.

---

## 7. A learner's journey under the new standard (what "hard" looks like end to end)

So the recommendation is concrete, here is Kalam under the redefined bar:

1. **Pretraining:** meet *actual infinite*, *BGV theorem*, *agent causation* (30s).
2. **Understand → Bronze:** read; then reconstruct P1/P2/∴C from memory and derive the cause's
   properties (≥80%). *Bronze earned.*
3. **Drill:** type-first flashcards (12) to a 3-correct criterion; "name the target" discrimination drill.
4. **Defend → Silver:** field the ~12 tiered objections cold, rubric-scored incl. Morriston and Guth's
   dissent; pass Explain-It-Back ≥8 answering the hardest objection in the same breath. *Silver earned.*
5. **Master → Gold:** handle one **unseen** objection; *say* the argument aloud against the Arena atheist;
   then re-prove Bronze/Silver on **two more spaced sessions** days/weeks apart. *Gold earned — and it
   can lapse.*
6. **Certify:** optional timed closed-book final; export the conversation-companion one-pager.

That is a learner who can genuinely use Kalam. Reaching Gold takes **weeks and repeated demonstrated
retrieval**, not an afternoon of clicking — which is the whole point.

---

## 8. Constraints, costs, and hazards — read before scoping

This is where this work is unusual: **most of it is doctrinal-content work wearing an engineering
costume.** The site's own rules make that non-negotiable.

- **Every new graded string is doctrinal content and must be gated.** New objections, model answers,
  rubrics, curveballs, flashcards, key-term definitions, exam items — all pass argument + orthodoxy
  (+ neutrality for deity/Trinity/Islam/resurrection), per the mandatory pipeline. A new Tier-3 objection
  bank across the Trinity/deity pages is a *large* dual-consensus gate load.
- **Port, don't author.** `CLAUDE.md` records this rule in blood: authored prose generates the next
  defect; ported-from-the-certified-essay prose survives. Every new objection/answer/curveball must be
  **ported from the paired essay's own certified text**, resolved by `<link rel="canonical">` not
  filename. Curveballs and rubrics are the highest-risk because they tempt authoring — build them from
  objections the essay already answers, phrased differently.
- **The four invisible layers.** `ARG_PREMISES`, the `cards` deck, the mock-scorer `checks` regexes, and
  the drill model answers are what the learner is *graded against* and are invisible to a prose gate.
  Any change here must be diffed against the essay first and node-tested (the essay-correct answer passes,
  the retired/overclaimed answer fails) — the exact discipline the 10-02/10-04 Kalam re-gate used.
- **Any new AI surface ships with the crisis guard (`lib/crisis.js`) from day one** and is rate-limited.
  The spoken box, the "teach it" inversion, the curveball grader all route through `/api/tutor` — fine,
  but `ev-m-evil.html`'s grader is a known disclosure surface; never add an AI path that bypasses the
  backstop.
- **Pro-tier + token budget.** Multi-turn/graded-AI drills are several LLM calls each; the free quota is
  tight. Gate the heavy drills Pro, keep a static fallback (the regex mock-scorer already models this).
- **Authoring burden × 81 pages.** The content lifts (§4.4, §5.1–5.3) are per-argument. This is a
  *programme*, not a patch — sequence it by cluster (do God's-existence first, it was just re-gated and
  has a clean backlog doc), and let the engineering (dial model, SR wiring, UI) be built once and shared
  while the content is filled in argument-by-argument behind it.
- **Don't overstate.** No "mastery guaranteed," no "10,000 hours." The honest claim is "proven, spaced,
  against the hard version" — which is *stronger* trust copy than a superlative, and matches the
  "Checked Before Published" / earned-confidence frame.
- **The standing bans still bind:** no Trinity diagram anywhere (an argument-flow chain of the *syllogism*
  is fine and useful; a diagram of the *persons* is not); denominational neutrality; `retired-claims.json`
  / tripwire checks run on every new string; and the whole thing is **still `_pending_` pastoral sign-off**
  site-wide — a graded "mastery certification" raises the stakes on getting a named human review board in
  place (the market docs' C1 moat), because the site would now be *certifying* people, not just publishing.

---

## 9. Prioritized build order

Ranked by (impact on "it's a real standard now") × (cheapness) × (gate safety). Engineering-once items
first because they make every later content lift pay off.

**Tier A — makes 100% mean something (mostly engineering, low content/gate load):**
1. **Redefine the dial: retrieval-earned checkpoints + Bronze/Silver/Gold + decay** (§3, §6.1). Turn
   "read = accordions opened" into a reconstruction check (§4.1) and "defended = 9 chars" into a graded
   rubric pass (§5.3 independent rung). Biggest single de-gimmicking move; reuses existing scoring.
2. **Successive-relearning requirement for Gold** (§3, §5.1) — wire the dial to the SR engine that
   already runs, as the *definition* of mastered.
3. **Free-recall-first Explain It Back + type-first flashcards** (§5.1, §5.2) — desirable-difficulty
   flips of existing drills; little new content.

**Tier B — adds real depth (heavy content + gate work, do by cluster):**
4. **Tiered objection bank (10–15, incl. the named academic critics) + model answers + rubric** (§4.4,
   §5.3). The core "don't make it easy" content lift; port-and-gate per argument.
5. **Unseen-objection curveball as the Gold transfer gate** (§5.3 novel rung). Small content, high
   meaning; highest authoring risk — build carefully.
6. **Richer rubric feedback from certified objections/concessions** (§5.1) — grader prompt change.

**Tier C — depth polish & realism:**
7. Key-terms pretraining (§4.2); derivation drill (§4.3); discrimination "name the target" drill (§4.5);
   active primary-source drill (§4.6); steelman-first (§4.7).
8. Spoken production (§5.4); "teach it" Feynman inversion (§5.6); interleaved boss drill (§5.5).

**Tier D — the differentiator & the ceremony:**
9. Timed closed-book certification (§6.2) + the named review board behind it.
10. The progress-aware **conversation-companion kit** (§6.5) — the one feature no competitor can copy.

---

## 10. What NOT to do

- **Don't just lengthen the prose or add a fourth content tier.** Length is not depth; mode and
  difficulty are (09-26 Q3). More words raise load for no retention gain.
- **Don't raise the bar without deepening the bank.** A hard exam over 6 objections is unfair; the
  content lift (Tier B) and the standard (Tier A) ship together per cluster.
- **Don't author the new objections/curveballs.** Port from the certified essay or don't ship them.
- **Don't let the gold dot / streak become the point** — point streaks at reviews-cleared, keep the
  ministry frame, offer streak-freeze grace.
- **Don't ship any new AI drill without the crisis guard and the gate.**
- **Don't market "mastery guaranteed."** Claim only what the standard proves: spaced, demonstrated,
  against the hard version.

---

*Prepared 2026-10-04. Research + assessment only; no mastery-page content or code was changed. Builds on
`docs/MASTERY_LEARNING_ASSESSMENT_2026-09-26.md` (whose top-5 modes are now largely shipped via
`lib/review-queue.js`) and reflects the current live anatomy of `ev-m-*.html` as of this date.*

### Evidence base (new/sharpened for the rigor question)
- **Mastery-learning criterion (80–90% before advancing) & 2-sigma:** Bloom 1984; Slavin 1987 meta-analysis.
- **Successive relearning (recall-to-criterion then relearn ×3 spaced):** Rawson & Dunlosky; Higham et al.; Dunlosky et al. 2013 (practice testing + distributed practice = highest-utility techniques).
- **Desirable difficulties (harder training → better retention/transfer; generation, variability, interleaving, intermittent feedback, testing-not-presentation):** R. A. Bjork; Bjork & Bjork.
- **Rebuttal-quality assessment (accurate · relevant · strong; clash & extension; synthesis as the top tier):** debate-pedagogy / argumentation-rubric literature.
- Plus the full A/B-tier base in `MASTERY_LEARNING_ASSESSMENT_2026-09-26.md` §5 (retrieval practice, spacing, implementation intentions, worked-example fading, fluency illusion, self-explanation, interleaving, dual coding).
