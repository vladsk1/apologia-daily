# Mastery pages & the Evidence Library as a learning tool — assessment + the learning-science layer (2026-09-26)

**Scope.** This answers the owner's four questions of 2026-09-26 — *can the mastery page be more in-depth; should it have a "Teach Me" tutor (or what else); can the Evidence Library be improved / do the three layers work; what do the best science-backed learning tools and rival apps teach us* — and adds the one thing the four existing strategy docs do **not** have: an **evidence-based learning-science layer** to judge the design against. It **builds on and does not duplicate**:

- [`docs/LEARNING_ROADMAP_2026-09-09.md`](LEARNING_ROADMAP_2026-09-09.md) — app-by-app benchmark + prioritized feature roadmap (items E/F/K referenced below).
- [`docs/PRODUCT_ROADMAP.md`](PRODUCT_ROADMAP.md) — the six-pillar "Logos of apologetics" frame ("why wouldn't I just ask ChatGPT").
- [`docs/USABILITY_ASSESSMENT_2026-09-07.md`](USABILITY_ASSESSMENT_2026-09-07.md) — navigation/IA + the "two systems that don't talk" finding.
- [`docs/MARKET_RESEARCH_2026-09-03.md`](MARKET_RESEARCH_2026-09-03.md) — competitor landscape + the review-board moat (C1).

Read those for the full competitive tables and business case. This doc is the **learning-design** view and the **direct answers**.

---

## 0. Headline verdict

**The site is already the most pedagogically complete apologetics learning system that exists** — no faith competitor (Hallow, Glorify, YouVersion, Truthly, the Apologist Project, Logos) teaches a *skill*; they deliver content or run a bare chatbot. Apologia's mastery track (syllogism → premise defence → objections → Explain It Back → flashcards → live-objection role-play → mastery dial → confidence rating), plus a real SM-2 spaced-repetition engine (`flashcards.html`, `objection-deck.html`), a daily 5-minute session (`today.html`), a memory palace, a voice-enabled Debate Arena, a coach, study plans/groups, and a conversation journal, is **further down the "teach a skill" road than anything in the category.**

So the bottleneck is **not content and not a shortage of features.** Measured against the learning science, it is four specific things:

1. **The mastery page's own progress is driven by clicks + a coarse 30-day fade, and is disconnected from the spaced-repetition engine that already runs elsewhere.** `ev-m-*` persistence is `ad_mastery` in localStorage with a single `FRESH_MS = 30 days` "memory fades" nudge — not per-item expanding intervals, and not fed into the `today.html`/flashcards review queue. The best-evidenced mechanic in the whole literature (spacing) is built on the site but **the flagship learning pages don't use it.**
2. **There is no Socratic "reconstruct it yourself" rung between reading and testing.** `api/tutor.js` is a *one-shot grader* (score + feedback on a submitted paragraph) with **zero conversation memory** — there is no multi-turn, guided-discovery surface anywhere. This is the rung Khanmigo and Brilliant's Koji fill, and the one the evidence most rewards.
3. **The three content tiers are progressive disclosure of the same explanation at increasing *length*, not distinct learning *modes*.** Length doesn't teach a skill; mode does.
4. **Each argument appears in ~5 places that don't share a path or progress** (answer → `ev-s` free tier → "Case, Plainly" → "Pro Deep Dive" → `library/*.html` essay → `ev-m-*` mastery). The learner has no single "what do I do next" spine — the same "two systems that don't talk" pattern the usability doc flagged for onboarding.

Everything below is a fix for one of those four.

---

## 1. Direct answers to the four questions

### Q1 — Can the mastery page be more in-depth?

**Yes, but the missing depth is *mode* depth, not more prose.** Adding a longer explanation is the one thing that would *not* help (see Q3). The evidence-backed depth to add, per page:

- **Free recall before any reveal.** Flashcards that flip are *recognition* — seeing the front and thinking "I know this" is fluency, not retrieval, and builds the least durable memory (Quizlet's own data: Write/Learn ≫ Match/flip). Force a typed recall attempt first. "Explain It Back" already does this and is the strongest drill on the page — **promote it, don't bury it.**
- **A "key terms" pretraining strip** at the top (define *anarthrous*, *homoousios*, *pelach*, *harpagmos* before the argument uses them). Mayer's pre-training principle; cheap, static.
- **An elaborative-interrogation prompt** after the recall: *"Why would a thoughtful skeptic still not be satisfied — and why does the reply still hold?"* Forces integration, not parroting (self-explanation, d≈0.54).
- **If-then encoding of every objection** (see Q2 / §3.2) — the single change most aimed at the real goal.
- **The mastery % and confidence rating should be *earned by demonstrated retrieval over spaced reviews*, not by clicking through accordions or self-report.** A dial that rewards opening sections teaches the *illusion of fluency* — the exact failure where a learner quits feeling ready and is not (Dunning-Kruger; Bjork). Rate confidence *after* a recall attempt, then show the gap ("you predicted 8, scored 5").

### Q2 — Should the mastery page have a "Teach Me" tutor, or what other option?

**Yes — a Socratic "Teach Me" mode is the single most evidence-backed missing rung, and it is a genuine new build (not a tweak).** Today `api/tutor.js` grades one submitted paragraph and forgets it; there is no conversational, prompting-not-telling surface. Insert "Teach Me" **between "read the essay" and "Explain It Back"**: the AI asks the learner to reconstruct P1, P2, and the conclusion in their own words, giving hints and reframes rather than the answer. Evidence: Khanmigo is explicitly built never to hand over the answer; Brilliant's Koji guides inside the problem; a Socratic-tutor study reported large gains for guided discovery and *none* for answer-dispensing (directional finding corroborated by a 2025 *Frontiers in Education* comparative study; the specific "62%" figure is reported-but-unverified — do not cite the number).

**Guardrails that are non-negotiable for this build (all already precedent on this site):**
- **Scope it tightly to the page's own certified content** (`ARG_PREMISES`, `cards`, the certified objections) — "walk the reader through what THIS page already certifies," not open-ended theology. This caps the hallucination surface far below `/api/ask`.
- **Ship the pastoral-crisis guard (`lib/crisis.js`) from day one.** `CLAUDE.md` records that 5 of 6 AI endpoints (including `/api/tutor`) once shipped *without* a crisis path; a new multi-turn conversational surface must not repeat that.
- **It is gated content** — argument + orthodoxy, dual-consensus for Trinity/deity/Islam — every time the system prompt is touched.
- **Budget it Pro-tier.** Multi-turn = several LLM calls per session vs. one grading call today; the free AI quota is already tight.

**Options that may be worth as much or more than "Teach Me":**
- **A progress-aware "conversation companion" kit** — assemble "I'm about to talk to a JW" from the specific objections *this user* has missed (their Explain-It-Back scores, quiz misses), with the steelman, the concession, and how to say it graciously, exportable as a one-pager. **No competitor has this** — it requires the accumulated mastery data faith apps don't track and learning apps don't apply to apologetics. It is `PRODUCT_ROADMAP.md` pillar 2 / `LEARNING_ROADMAP.md` item F, and it is *literally* what "wield an argument in a live conversation" means in product form. This is the one genuine differentiator on the list.
- **Extend the Debate Arena's existing voice (Web Speech mic + TTS) to the Explain-It-Back box** on mastery pages. A live conversation is *spoken*; the hard part is already solved and Arena-only.
- **A worked-example → completion → independent fading ladder** (see §3.5) — turns "I understand it" into "I can run it under pressure."

### Q3 — Can the Evidence Library be improved? Do the three layers work?

**The three layers are a legitimate free/Pro *depth* ladder — keep them, do not add a fourth — but they are not a *learning* system, and they should stop being treated as one.** "Free plain-English → The Case, Plainly → Pro Deep Dive" is progressive disclosure of the *same explanation at increasing length*. None of the best learning apps differentiate pedagogy by "more prose"; they differentiate by **mode of engagement**: passive read → interactive step-through with predict-before-reveal → active free recall → adversarial application → spaced review. Layering length is a monetization/depth ladder (fine, and matches how Khan offers multiple formats of the same material); layering *mode* is what teaches a skill.

**The real improvement is architectural, not another tier.** Right now DEPTH (the 3 tiers) and MODE (the mastery track's 4 phases: Understand → Explain → Drill → Defend) live on **two different pages** (`library/*.html` vs `ev-m-*.html`) with two different progress systems that don't talk. Treat depth and mode as **orthogonal**, and give the reader one spine: *read at the depth you want → now reconstruct it (Teach Me) → now drill it → now defend it → come back when it's due.* Concretely, surface the mastery track as the visible "what to do next" from the essay page rather than as a separately-branded destination (the `library/tutor-help.js` "read it with the AI tutor" cue is a first step). This is the usability doc's "two systems that don't talk" finding applied to the core learning loop.

**Smaller Library wins that fit the evidence:** expand the "See the evidence" panels (Source row + Who-holds-it row) — they are genuinely dual-coded, structural presentations of the citations; add **timelines** (creed dating ~AD 30–35; Nicaea 325 — explicitly allowed under the diagram scope note) and **who-concedes-what tables**; render the syllogism as a clean premise→premise→conclusion **flow chain** (not a Trinity diagram — permitted, and it trains the discrimination skill).

### Q4 — Learning apps / science-backed tools

The full app-by-app tables are in `LEARNING_ROADMAP_2026-09-09.md` and `MARKET_RESEARCH_2026-09-03.md`; the science base is §2 below. The one-line takeaways that are *new* here:

- **Khanmigo / Brilliant Koji** — the Socratic-tutor and guide-inside-the-problem models (→ "Teach Me", Q2).
- **Duolingo "Video Call with Lily"** — a spoken AI partner that *remembers across sessions* and can prompt you to practise. Apologia's Debate Arena is the argument-training analog and already has voice; the one thing it lacks vs. Lily is **cross-session memory**, not the voice mechanic.
- **Anki FSRS** (FSRS-6, late 2025) — same retention as SM-2 with ~20–30% fewer reviews. A legitimate future *math swap* behind the existing flashcard UI; **low urgency, backlog it** — not a headline.
- **Quizlet** — the *harder-feeling* modes (Write/Learn/Test) build durable memory; the easy ones (Match/flip) don't. Direct backing for promoting Explain It Back over flashcard-flipping.
- **Yoodli** — a validated market precedent for "rehearse a hard conversation with a bot before you have it for real" (it scores *delivery*, not *content*, so don't imitate it directly — but it proves the pattern the Debate Arena occupies).

---

## 2. The mastery page, re-scored against the evidence

Techniques ranked by evidence strength, with what the page does today and the fix. (Evidence tiers and citations in §5.)

| Technique | Evidence | On the mastery page today? | The fix |
|---|---|---|---|
| **Retrieval practice / testing effect** | A-tier (g≈0.5–0.6) | ✅ Explain It Back; ⚠ flashcards are recognition | Force typed free-recall *before* any reveal; keep the model answer second |
| **Spacing / distributed practice** | A-tier | ❌ coarse 30-day fade, disconnected from the SR engine | Connect the page's items to the SM-2 scheduler + a unified "due today" queue |
| **Interleaving** | B+-tier (transfer) | ❌ drills blocked by topic | A "mixed drill" that pulls objections at random across studied topics |
| **Implementation intentions / if-then transfer** | A-tier (d≈0.65) | ⚠ seed only ("live objection") | Encode every objection as *If they say X → then say Y*; let the user author their own |
| **Elaboration / self-explanation** | B-tier (d≈0.54) | ✅ Explain It Back | Add an elaborative-interrogation prompt ("why is the skeptic still unsatisfied?") |
| **Worked example → fading** | A-/B+-tier | ❌ | Model dialogue → fill-the-blanks → open drill, entry point set by mastery level |
| **Deliberate practice + specific feedback** | Strong (feedback); dosage over-hyped | ⚠ bare score /10 | Rubric-specific feedback from the existing `ARG_PREMISES`; escalate objection difficulty |
| **Metacognition / calibration** | A-/B+-tier | ⚠ confidence rated *before* testing; % from clicks | Rate confidence *after* recall; show the gap; drive % from demonstrated retrieval |
| **Dual coding (structural only)** | A-/B+-tier | ✅ accordions segment; evidence panels good | Add key-terms pretraining, argument-flow chains, timelines, concede-tables. **No Trinity diagram** — the owner ban matches the coherence principle exactly (a misleading visual is worse than none) |
| **Gamification / streaks** | Strong for engagement; weak for *learning* | ✅ streaks | Point streaks at **reviews-cleared**, not days-opened; keep the 1 Peter 3:15 frame; streak-freeze grace; don't let it become the point |

---

## 3. Prioritized — the five highest-leverage changes

Ranked by (evidence strength) × (fit to *durable recall + live-conversation transfer*) × (cheapness on a static-JS + optional-Supabase stack). Each maps to an existing roadmap item where one exists.

**1. Connect the mastery pages to the spaced-repetition engine + a unified "due today" review queue.** *(Spacing — A-tier; the biggest current gap; `LEARNING_ROADMAP` item E.)* The engine exists (SM-2 in flashcards/objection-deck); the flagship learning pages just don't feed it. A "Due today" queue on the dashboard that pulls items across *all* studied arguments, shuffled (which also delivers interleaving), plus the existing push/weekly-email repurposed as "3 arguments due for review." localStorage first; Supabase sync via the existing `user_progress`/`progress-sync` plumbing.

**2. Reframe objections as if-then (situation→response) cards, and make the mixed drill interleaved.** *(Implementation intentions d≈0.65 — A-tier for transfer; interleaving — B+.)* Store each objection as `If they say X → then respond Y`; let learners author their own (self-generated is the strong form); add an "anything-goes" drill pulling objections at random across topics. This is the change most directly aimed at the actual goal — knowledge firing in a live, adversarial conversation.

**3. "Teach Me" Socratic mode on the mastery page.** *(Khanmigo / Koji / Socratic-tutor evidence; competitive #1; a genuine new build.)* Tightly scoped to the page's certified content, crisis-guarded from day one, gated, Pro-tier. The missing rung between "read" and "test."

**4. Make mastery % and confidence retrieval-earned, with the calibration gap shown.** *(Metacognition / fluency illusion — A-/B+-tier.)* Free-recall before reveal; confidence rated after the attempt; "predicted 8, scored 5." Kills the quit-while-feeling-ready failure. Small change, best-evidenced payoff, doubles as honest calibration.

**5. Build the worked-example → completion → independent fading ladder for deployment.** *(Worked-example + expertise-reversal — A-/B+-tier.)* Model dialogue → fill-the-blanks dialogue → open "live objection," entry point set by the learner's mastery so novices get scaffolding and returning experts skip straight to solving (expertise reversal). Turns understanding into performance under pressure.

**Plus, the one true differentiator (bigger bet):** the **progress-aware conversation-companion kit** (Q2; `PRODUCT_ROADMAP` pillar 2 / `LEARNING_ROADMAP` item F). Not catch-up — a feature no competitor can easily copy, because it needs the mastery data only this site tracks.

---

## 4. What NOT to do (de-prioritize / avoid)

- **Don't add a fourth content tier or lengthen the prose.** The learning gap is mode, not length (Q3). More words raise cognitive load for no retention gain (coherence principle).
- **Don't add Trinity diagrams** — the owner prohibition and the multimedia-coherence principle agree: a misleading structural visual is worse than none. Structural visuals that *aren't* Trinity diagrams (argument-flow chains, timelines, concede-tables) are fine and useful.
- **Don't let gamification become the point.** Use it to reward the effective behaviour (reviews cleared), keep the ministry frame, offer streak-freeze grace, avoid manipulative loss-aversion. It lifts engagement; it is weak evidence for *learning*, and it sits uneasily with the mission.
- **Don't ship "Teach Me" (or any new conversational surface) without the crisis guard and the gate.**
- **Don't build FSRS first.** It's a scheduling-math swap behind existing UI — real but low-urgency; backlog it.
- **Don't market "10,000 hours" / "mastery guaranteed."** The deliberate-practice dosage literature does not support strong claims (Macnamara et al. 2014).

**Adjacent to all of this and still the biggest *trust* gap** (from `MARKET_RESEARCH` C1, and every stamp on the site confesses it): the pastoral/scholarly **sign-off is `_pending_`** site-wide. For a site whose goal is to be *the* place Christians learn to teach these arguments, a named human review board is the moat and the credibility precondition — worth more than any single feature here.

---

## 5. Evidence base (learning science) — tiers and sources

**A-tier (act on with confidence):** retrieval practice / testing effect (Roediger & Karpicke 2006; Rowland 2014 meta g≈0.50; Adesope et al. 2017 g≈0.61; Karpicke & Blunt 2011 *Science* — beats concept-mapping even on inference); spacing effect (Cepeda et al. 2006, 254 studies); implementation intentions for transfer (Gollwitzer & Sheeran 2006, 94 tests, d≈0.65); worked-example effect + expertise reversal (Sweller; Kalyuga & Sweller); fluency illusion / overconfidence (Kruger & Dunning 1999; Bjork). Dunlosky et al. (2013) rate practice testing and distributed practice the two *highest*-utility techniques.

**B+/B-tier (well-founded, act on, weight modestly):** interleaving for transfer (Rohrer & Taylor 2007; Kornell & Bjork 2008; Firth et al. 2021 review — clearest when categories are confusable, which apologetics objections are); self-explanation / elaborative interrogation (Dunlosky d≈0.54/0.56); multimedia / segmenting / pretraining (Mayer; Mayer & Pilegard 2014); variability of practice + role-play for transfer.

**Over-hyped / handle with care:** the "10,000 hours" strong form of deliberate practice (Macnamara et al. 2014 — DP explains ~18% of variance in education, not near-totality); feedback *timing* (immediate vs delayed roughly equal in a 2023 meta-review — *specific and present* matters, exact timing less so); gamification for *learning* (strong for engagement, mixed for learning; overjustification/crowding-out risk — Deci & Ryan).

**Apps studied (this pass):** Khanmigo (Socratic-never-answer); Brilliant Koji (guide-in-problem + gap-tracking); Duolingo Video Call with Lily (spoken partner with cross-session memory); Anki FSRS-6; Quizlet mode-effectiveness (TESL-EJ); Yoodli (conversation rehearsal). Faith-app comparison unchanged from `MARKET_RESEARCH_2026-09-03.md`: none teaches a skill.

*Full source URLs are recorded in the two 2026-09-26 research passes (learning science + competitive) that produced this doc; the app-by-app benchmark tables live in `LEARNING_ROADMAP_2026-09-09.md`.*

---

*Prepared 2026-09-26. Assessment + research only — no site content or code changed. Recommendations are prioritized but not yet built; the top-5 in §3 are the suggested build order, each gate/effort tag inherited from `LEARNING_ROADMAP_2026-09-09.md` where an item already exists there.*
