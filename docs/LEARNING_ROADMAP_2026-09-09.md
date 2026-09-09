# Learning-Feature Roadmap — 2026-09-09

**Benchmarked against:** Hallow, YouVersion, Brilliant, Duolingo (+ Glorify, Truthly, Logos for signal).
**Produced by:** the `apologia-product` research agent (read-only), grounded in `CLAUDE.md`, a repo grep of what
is actually built, `docs/USABILITY_ASSESSMENT_2026-09-07.md` and `docs/MARKET_RESEARCH_2026-09-03.md` (both
pre-existing; this extends them rather than duplicating them), and web verification of each app's mechanics.
Vendor-reported figures are marked **unverified** where they could not be independently confirmed.

**Purpose:** a prioritized queue of learning/teaching features, ranked by (learning impact × retention impact)
÷ build effort, split into Quick Wins / Medium / Big Bets, each tagged with whether it touches the mandatory
content gate. This is a roadmap, not a commitment — nothing here is built.

---

## 0. What is already built (so nothing below duplicates it)

- **Feynman teach-back = "Explain It Back"** — already live and AI-graded on all 67 `ev-m-*.html` mastery pages
  (`api/tutor.js`). Candidate idea #4 is **already built**.
- **Real SM-2 spaced repetition** runs against Supabase `flashcards`, surfaced in `flashcards.html`, `palace.html`,
  and the 4-step guided daily session `today.html` (Review → Learn → Prove it → Done). The usability doc calls
  `/today` "the best learning surface on the site." ⚠ **CORRECTED 2026-09-09:** the agent's original line here
  repeated the usability doc's finding that `/today` was "linked from only 5 pages and absent from nav/homepage" —
  that was stale. Tier B (commit `3582e16`, earlier the same day) put **Today in the nav** (`tools/sync-nav.mjs:27`)
  and on the homepage; it is now linked from 320 pages. The discoverability problem is already fixed.
- **Read-along TTS**, sticky TOC + progress bar (`library/toc.js`), select-to-ask tutor (`library/ask-selection.js`),
  recall checkpoints (`library/active-reading.js`), "See the evidence" panels (`library/evidence.js`), and the
  "Read it with the AI tutor" cue (`library/tutor-help.js`) are live on all essays.
- **A standalone glossary page exists** (`glossary.html`) — a browse/search page, **not** inline hover definitions
  inside essay prose. Candidate #7 is **partially built; the inline/hover layer is the real gap.**
- **Debate Arena** (`api/debate.js`) already does dynamic, AI-driven branching conversation with personas — a
  stronger version of candidate #5's "branching scenarios" for anyone past the beginner stage.
- **A weekly email already exists** (`api/weekly-email.js`) and already reports flashcard due-count — candidate
  #10's "weekly recap" is a data point, not built from zero.
- **`api/tutor.js` carries zero user history/progress** (confirmed by grep — no history/progress/struggle field is
  passed into the prompt). Candidate #6 "progress-aware tutor" is a **genuine, unbuilt gap.**
- The 2026-09-07 usability audit **already independently proposed confidence calibration** (candidate #2) as
  small-effort and noted no comparable app in its scan does it.

---

## 1. Benchmark findings, app by app

### Duolingo — the strongest transferable playbook, mostly plumbing not content

| Mechanic | What it is | Verified? | Transferable to a text/argument domain? |
|---|---|---|---|
| **Half-life regression (BirdBrain) personalization** | ML model predicts what you'll forget and re-weights lesson selection per user | Verified — [Duolingo research](https://research.duolingo.com/) | **Yes** — same principle applies to which argument/objection resurfaces next |
| **"Explain My Answer" (LLM mistake explainer)** | On a wrong answer, an LLM explains *why* it was wrong | Verified — [Duolingo blog](https://blog.duolingo.com/explain-my-answer-now-free) | **Yes, directly** — Apologia already has the LLM infra (`api/tutor.js`); this is "explain why my explain-it-back score was low" |
| **Practice Hub "Mistakes" review** | A dedicated queue of just what you got wrong, across all past lessons | Verified — [Duolingo blog](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) | **Yes** — maps to interleaving quiz misses + low explain-it-back scores into one review queue |
| **Stories (light branching comprehension)** | Short scenarios with in-line checks that gate progress | Verified — [guide](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/) | **Partially** — good for beginner-tier walk-throughs; Debate Arena is already the stronger dynamic version |
| **Streaks + streak freeze** | Consecutive-day counter, one earned freeze | Verified widely; the "streak users 3× more likely to reach intermediate" claim is **Duolingo-reported, unverified** | **Already built** on Apologia |

**Not transferable / explicitly not recommended:** guilt-framed notifications and speed-ranked leaderboards — both
already rejected in the usability doc as conflicting with the 1 Peter 3:15 tone and rewarding glibness over rigor.

### Brilliant — the pedagogy worth borrowing, not the gamification

| Mechanic | Verified? | Transferable? |
|---|---|---|
| **Learning Paths** — ordered, prerequisite-gated sequences with checkpoints | Verified — [Brilliant help](https://brilliant.org/help/using-brilliant/what-are-learning-paths/) | **Yes** — direct analog to a visible order across the Evidence Library / `beginners-path.html` |
| **Predict-before-reveal pedagogy** — you guess/manipulate before the explanation | Verified on Brilliant's own site; the "6× more effective" figure is **Brilliant marketing, unverified** | **Yes — the direct ancestor of a steelman trainer** |
| **Leagues** (competitive tiers) | Verified widely | **No** — wrong incentive for a rigor-first product |

### Hallow — the audio/habit-loop leader, weakest on teaching

| Mechanic | Verified? | Transferable? |
|---|---|---|
| **Routines** — named, scheduled recurring sessions with push reminders | Verified — [Hallow help](https://help.hallow.com/en/articles/5761398-streaks-prayer-activity-faq) | **Yes** — "read one essay every weekday at 7am" / "review flashcards after lunch" |
| **Prayer Goal** — choose N sessions/week, not a rigid daily streak | Verified | **Yes** — a gentler companion to the daily streak |
| **3 length options per session** (5/10/15 min) | Verified | **Partially** — the existing "Case, Plainly" tier is already close to a 5-minute version |

Hallow has almost no *teaching* mechanic (no quizzes, no graded recall). Least useful for pedagogy; most useful for the
audio habit loop and "named routine."

### YouVersion — social accountability, not pedagogy

| Mechanic | Verified? | Transferable? |
|---|---|---|
| **Streaks** | Verified | Already built |
| **Plans with Friends + "Talk it Over" daily discussion prompt** | Verified — [YouVersion blog](https://blog.youversion.com/2017/11/youversion-bible-app-announcing-plans-with-friends-2017/) | **Yes** — a daily discussion prompt tied to the day's argument is a cheap addition to the existing Study Groups |
| "Even one Friend makes you more likely to stay engaged" | **Unverified** (secondary blog repeating YouVersion's own claim) | Directional only |
| Highlights / Notes / Verse Images | Verified | Weak — pocket cards / share-cards already cover the shareable-image half |

### Glorify, Truthly, Logos — added signal

- **Glorify:** streak + a long-run "Tree of Faith" growth visual + a monthly leaderboard — reported via third-party UX
  case studies, **not independently confirmed.** The transferable idea is the long-horizon *growth visual* (a cheaper
  cousin of a skill tree), not the leaderboard.
- **Truthly:** AI chat with guardrails, bite-sized doctrine lessons, daily challenges (App Store listing). Confirms
  Apologia's `evidence.js` / mastery-page / explain-it-back stack is at least at parity with the newest confessional AI
  competitor.
- **Logos Mobile Ed:** retakeable, no-shame self-assessment quizzes; 5–10 min segments — verified via
  [Logos](https://www.logos.com/mobile-ed). The transferable idea is **retake-without-penalty framing**, which should
  govern the *tone* of any calibration or steelman score (never punitive) — reinforcing "durable, not brittle, confidence."

### The one number worth citing outside vendor claims

The strongest **independently verified** evidence in the scan is the underlying learning science, not any app:
Roediger & Karpicke's retrieval-practice work found ~80% retention after a week for recall-tested readers vs ~34% for
reread-only, and active-recall approaches show up to ~50% better retention across studies
([Osmosis](https://www.osmosis.org/blog/active-recall-the-most-effective-high-yield-learning-technique),
[TalentCards](https://www.talentcards.com/blog/active-recall/)). This is the evidentiary backbone for ranking the
review-queue and steelman items above pure habit-loop items.

---

## 2. Verdict on the ten candidate ideas

| # | Idea | Verdict |
|---|---|---|
| 1 | Unified adaptive review queue | **Validate, rank high.** `/today` reviews only flashcards; quiz misses and low explain-it-back scores never feed back. Modeled on Duolingo's Practice Hub + BirdBrain. |
| 2 | Confidence calibration | **Validate, rank very high, near-zero cost.** No benchmarked app does this — a differentiator, not catch-up — and it directly serves the "durable not brittle confidence" mission. |
| 3 | Steelman trainer | **Validate, rank high.** 1 Peter 3:15 turned into a mechanic; Brilliant's predict-before-reveal is the analog. Mostly a UI re-sequence of content already certified on the mastery pages, keeping the gate cost small. |
| 4 | Feynman teach-back loop | **Already built — retire as a "new feature."** This is "Explain It Back." Redirect effort into promoting it and layering #2 on top. |
| 5 | Branching conversation scenarios | **Partially redundant — narrow the scope.** Debate Arena already does dynamic branching. The remaining gap is a scaffolded beginner mode *inside* it, not a scripted-fiction system. |
| 6 | Progress-aware tutor | **Validate, rank high — confirmed genuinely missing.** |
| 7 | Hover glossary | **Validate but narrow** — the page exists; the gap is inline surfacing. Plumbing-only if it republishes certified glossary text verbatim. |
| 8 | Audio "listen" mode / daily digest | **Validate, rank medium.** Per-essay TTS exists; the gap is a cross-feature daily digest — the one mechanic Hallow/Glorify do better. |
| 9 | Visual mastery map / skill tree | **Validate but de-scope v1.** Progress rings on library tabs/mastery pages deliver most of the value and fix the usability doc's "38 destinations, no sense of order." |
| 10 | Goals, streaks, weekly recap | **Quick win — more built than it looks.** Gaps: a real *recap* (not just what's due) and a Hallow-style flexible weekly goal. |

**What the benchmarks revealed that was not on the list:** (a) Duolingo's mistake-explainer — explaining *why* an
explain-it-back answer scored low, doable with a prompt change; (b) Logos's retake-without-penalty framing, which should
govern the tone of #2 and #9; (c) Hallow's "named routine" pattern, a cheap add once #10 is touched.

---

## 3. Prioritized roadmap

"Gate" = touches `apologia-argument` / `apologia-orthodoxy` (+ `apologia-neutrality` for deity/Trinity/Islam) per the
mandatory content pipeline in `CLAUDE.md`.

### QUICK WINS (plumbing/data only — days)

**A. Confidence calibration on "Explain It Back."**
Before grading, ask "how confident are you this answers a skeptic? (1–5)"; after grading, show the gap gently ("you were
more confident than the score — here's the one part worth revisiting"), never as a callout.
*Borrowed from:* general metacognition literature; no benchmarked app does it; corroborated by the 09-07 usability doc.
*Plugs into:* the existing `explain-it-back.html` grader UI and `api/tutor.js` scoring call.
*Effort:* Small. *Gate:* small argument+orthodoxy pass on the new UI copy (tone/UX text, not a doctrinal claim).

**B. Inline/hover glossary inside essay prose.**
Terms already defined in `glossary.html` get a hover/tap definition inline, reusing that page's certified copy verbatim.
*Plugs into:* `glossary.html` term data + the runtime-script precedent (`toc.js`, `reviewed-badge.js`).
*Effort:* Small. *Gate:* **none** if it republishes certified text verbatim — the cheapest item on the list.

**C. Weekly recap upgrade in the existing weekly email.**
`api/weekly-email.js` already computes flashcard due-count; add what was *learned* — arguments mastered this week,
streak length, one suggested next argument.
*Effort:* Small. *Gate:* none if the copy is numbers only.

**D. Hallow-style flexible weekly goal, alongside the streak.**
"I want to practice N times this week" as a gentler complement to the daily streak.
*Plugs into:* `dashboard.html`'s existing `goal` field + streak logic. *Effort:* Small–Medium. *Gate:* none.

### MEDIUM (weeks)

**E. Unified adaptive review queue.**
One queue ranked by recency/weakness across flashcards + quiz misses + low explain-it-back attempts, replacing
"flashcards only" as `/today` step 1. Needs a shared review-item schema across three currently separate sources.
*Borrowed from:* Duolingo Practice Hub + BirdBrain. *Effort:* Medium. *Gate:* none for the queue logic.

**F. Progress-aware tutor.**
Feed `api/tutor.js` a compact summary of what the user has read, which arguments they've mastered, and where their last
explain-it-back score was weak.
*Plugs into:* `progress-sync.js` / `user_progress`, `flashcards`, the tutor system prompt.
*Effort:* Medium. *Gate:* yes but narrow — any change to a live AI instruction block re-clears argument+orthodoxy.

**G. Steelman trainer.**
Before revealing a mastery page's answer to an objection, the reader types their own strongest version of the objection,
then sees it beside the page's certified steelman (self-comparison, not pass/fail — per Logos's retake-friendly framing).
*Plugs into:* the mastery pages' certified "the objection you will actually meet" content.
*Effort:* Medium. *Gate:* small — the framing copy needs a pass so it cannot itself become an over-concession.

**H. Daily audio digest.**
One "press play" track stitching the daily devotional + one argument's "Case, Plainly" tier + a short review prompt via
the existing TTS. *Effort:* Medium. *Gate:* none if it only reads certified text verbatim.

**I. Progress rings / first-cut mastery visualization.**
A ring per Evidence Library tab / mastery page showing % mastered from data already tracked — not a full unlock-gated
tree. *Effort:* Medium. *Gate:* none.

### BIG BETS (content-heavy — must pass the full gate)

**J. Full skill tree with sequential unlock** (Brilliant Learning Paths). Entangled with the still-undecided Pro
paywall. *Effort:* Big. *Gate:* none for ordering; "start here" framing copy needs the standard pass.

**K. Scaffolded beginner mode inside Debate Arena** (the narrowed #5). 2–3 suggested-response chips for a user's first
debates, fading out with competence. *Effort:* Medium–Big. *Gate:* yes — chips are new short-form content; Islam/JW/
Mormon personas must satisfy EXPLICIT-VERDICT + FALSE-COMMON-GROUND and require dual-consensus.

**L. Weekly produced audio episode** (Hallow/Glorify premium tier). Only after H validates the audio habit loop.
*Effort:* Big; full pipeline.

---

## 4. Recommended top-5 build order

1. **Confidence calibration (A)** — near-zero cost, mission-aligned, no competitor has it.
2. **Inline/hover glossary (B)** — cheapest item; no gate if scoped to certified text.
3. **Unified adaptive review queue (E)** — the most evidence-backed retention mechanic in the scan.
4. **Progress-aware tutor (F)** — confirmed zero-capability gap; highest "this app knows me" ceiling.
5. **Steelman trainer (G)** — the mission statement as a drill, using already-certified content.

**The one thing to do first: A, confidence calibration.** One UI addition and one fast gate round; no plumbing, no
schema change, no cross-feature integration — and the cheapest validation of whether users respond to this kind of
feedback before investing in E/F/G, which all build on the same underlying signal.

---

## 5. Repo files referenced (all read-only)

`CLAUDE.md` · `docs/USABILITY_ASSESSMENT_2026-09-07.md` · `docs/MARKET_RESEARCH_2026-09-03.md` · `today.html` ·
`flashcards.html` · `palace.html` · `explain-it-back.html` · `api/tutor.js` · `glossary.html` · `api/weekly-email.js` ·
`dashboard.html` · `api/debate.js` · `beginners-path.html` · `evidence-library.html`

## 6. External sources

- [Duolingo Research](https://research.duolingo.com/) · [Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free) · [Practice Hub](https://blog.duolingo.com/guide-to-duolingo-practice-hub/) · [Stories guide](https://duoplanet.com/duolingo-stories-the-complete-guide-what-you-need-to-know/)
- [Brilliant Learning Paths](https://brilliant.org/help/using-brilliant/what-are-learning-paths/) · [Brilliant features](https://brilliant.org/help/features/)
- [Hallow streaks FAQ](https://help.hallow.com/en/articles/5761398-streaks-prayer-activity-faq) · [Hallow features](https://hallow.com/features/)
- [YouVersion Plans with Friends](https://blog.youversion.com/2017/11/youversion-bible-app-announcing-plans-with-friends-2017/) · [YouVersion engagement](https://youversion.com/news/youversion-shares-its-top-hacks-for-more-consistent-bible-engagement)
- [Glorify UX case study](https://contra.com/p/kUPYQgEP-glorify-app-ux-paywall-design-and-gamified-faith-features) · [Glorify showcase](https://screensdesign.com/showcase/glorify-devotional-prayer)
- [Truthly (App Store)](https://apps.apple.com/us/app/truthly-chat-learn-share/id6504047524)
- [Logos Mobile Ed](https://www.logos.com/mobile-ed) · [Logos FAQ](https://www.logos.com/mobile-ed/faq?ssi=0)
- [Osmosis — active recall](https://www.osmosis.org/blog/active-recall-the-most-effective-high-yield-learning-technique) · [TalentCards — active recall](https://www.talentcards.com/blog/active-recall/)
