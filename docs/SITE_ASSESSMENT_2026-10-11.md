# Apologia Daily — fresh site assessment, with a learning-science review of the mastery section (2026-10-11)

**Owner ask (2026-10-11):** a completely new assessment of the website and how to improve it; look at
learning tools we could add to or improve in the mastery section; use the best scientifically proven
learning tactics; look at what the best learning apps do. **Paid/paywall options are out of scope** (owner:
"they are coming").

**Report only. Nothing was changed on the site.** Every count below was measured today from the repo or
the live site (basis stated inline). Three read-only research passes fed it: a repo inventory of the
learning machinery, a learning-science evidence brief (meta-analyses, 2023–2026 included), and an app
benchmark (Duolingo, Brilliant, Anki/FSRS, Khan/Khanmigo, Speak/ELSA, Quizlet/Readwise, Hallow/YouVersion,
Truthly, STR). I also walked the live site as a first-time visitor on desktop (1280px) and phone (375px).

Earlier assessments this one builds on, not repeats: `MASTERY_LEARNING_ASSESSMENT_2026-09-26.md` (modes),
`MASTERY_PAGES_DEPTH_RECOMMENDATIONS_2026-10-04.md` (rigour), `LEARNING_ROADMAP_2026-09-09.md` (apps),
`USABILITY_ASSESSMENT_2026-09-07.md`, `SITE_CRITICAL_REVIEW_2026-09-30.md`. Where their recommendations have
since shipped, §2 says so.

---

## 0. The verdict in plain English

**The mastery section is now genuinely ahead of anything in the apologetics market, and it is half
finished.** Thirteen of the 83 mastery pages (the God's Existence set) carry the new Bronze/Silver/Gold
standard: a from-memory reconstruction checkpoint, twelve flashcards, three escalating Explain-It-Back
prompts, four "answer it cold" objections, an objection the page never coached, and a Gold level that has
to be re-proved on spaced reviews. The other 70 pages still run the old standard, where "mastered" is
earned by opening the accordions, flipping five cards, scoring 7/10 once, and typing nine characters
into a box. A reader moving from Kalam to the Resurrection tab drops from a real exam into an activity
tracker. **Finishing that rollout is the single biggest improvement available, and it is content work,
not invention.**

Against the learning science, the design choices are right (retrieval over re-reading, spacing,
calibration, worked-to-faded scaffolds, Socratic tutor that never hands over answers). The gaps are in
**how honestly the mechanics are enforced**: the spaced "re-proof" that earns Gold is a self-graded
button, not a test; the flashcards are flip-only, never graded and never scheduled, even though the
page copy says they are; no drill forces the learner to *choose which argument* fits an objection; and
nothing asks the learner to attempt an answer *before* reading. Those four are the highest-value fixes
after the rollout, and three of them are plumbing with no new doctrinal text.

Site-wide, the walkthrough found **six live defects** worth fixing before anything new is built, two of
them on the first pages a new visitor meets (§1).

---

## 1. Live defects found in the walkthrough (fix first)

Ordered by who is affected first. "Gate" = needs the content pipeline (new doctrinal wording).

| # | What is wrong | Where | Fix | Gate? |
|---|---|---|---|---|
| 1 | **The Beginner's Path overclaims, and it has never been gated.** Day 1's takeaway tells a brand-new reader to say: *"The universe had a beginning — even atheist scientists agree on that… That's not faith. That's logic."* The certified Kalam pages say the opposite: BGV *corroborates without proving*, and co-author Guth is unpersuaded. `beginners-path.html` has no `content-review` stamp and is outside `CONTENT_PATTERNS` (already listed as a P1 hole in `GATE_COVERAGE.md`, still open). This is the first substantive content a new visitor reads. | `beginners-path.html:361`; `tools/check-content-review.mjs:42-50` | Port the takeaway from `ev-m-kalam.html`'s certified summary; gate the whole page (argument + orthodoxy); add it to `CONTENT_PATTERNS` in the same commit. | **Yes** |
| 2 | **On phones, an AI-tutor demo auto-plays over the Evidence Library hero on first visit.** Two seconds after load (any device), a scripted tutor panel opens and types a fine-tuning answer; on a 375px phone it sits over the headline and intro text and the two floating buttons ("Teach me this", "Ask AI Tutor") stack on top. The first-time phone visitor to the flagship page cannot read the page until they find the ×. It only happens once (`tutor_demo_seen`), which is exactly why nobody on the team sees it. | `evidence-library.html` ~1225–1300 (`setTimeout(startDemo, 2000)`) | On viewports under ~700px, do not auto-play; show the pulsing button only. On desktop, consider a one-line "See a demo" link instead of auto-play. | No |
| 3 | **Three dashboard statistics can never move.** `debateCount`, `askUsage` and `daily_arg_complete` are read by the dashboard and the games hub (debates fought, questions asked, belt points for debates) but no file on the site ever writes them. A user who debates every day sees "0 debates" and earns no belt points for it. | `dashboard.html:915-919`; `games.html`; verified by grep: zero writers | Write them from `debate-arena.html` and `ask-anything.html` (or drop the tiles). | No |
| 4 | **The flashcard copy promises something the code does not do.** On the 13 new-standard pages: *"They drop into your spaced-repetition deck so they return right before you'd forget."* The code only records that a card was viewed; no card is graded or scheduled anywhere. Only the *whole argument* is scheduled. A trust claim on a trust-first site. | `ev-m-kalam.html:695` vs `:858, :1068`; `lib/review-queue.js:36` | Either wire the cards into the account deck (§3, item B) or change the sentence now. | Copy only |
| 5 | **Two mastery standards, and inconsistent counts.** The Kalam page says "Argument 12 of 19 in the mastery library" and, lower down, "Twenty-one more core arguments are waiting"; the site has 83 mastery pages. Minor, but it is on the page that most advertises rigour. | `ev-m-kalam.html:394, :814` | Generate the counts, or reword to "in the God's Existence set". | No |
| 6 | **Reminders are not tied to what is due.** The daily push sends the *same* argument to every subscriber, rotating by day of year through 63 hard-coded entries; the weekly email counts only Supabase flashcards and ignores the mastery reviews and objection deck that live in `ad_reviews` / `ad_objdeck`. So the Gold-level "it returns on its own" promise depends on the user remembering to come back. | `api/push.js:46-130`; `api/weekly-email.js:165-182`; `sw.js:103-111` | Include the user's due count and the oldest due argument (data is already synced in `user_progress`). | No |

Smaller things noticed, not blocking: the Kalam page has **two separate confidence/calibration widgets**
(the injected predict-your-score one and the page's own "be honest" row; thresholds 8 vs 7 differ across
old and new pages); `supabase-js` and `html2canvas` load without `defer` on mastery pages (≈305 KB of
first-party JS/CSS per page, mastery pages average 100 KB of HTML); the deep-dive essay on a phone is
42,000px tall at "28 min read" with no "listen" control visible until you scroll (read-along exists but is
easy to miss); the floating tutor buttons appeared clipped at the right edge mid-animation on the essay
page (bounds check passed after load, so verify on a real device before acting).

---

## 2. What has shipped since the last assessment (so this one is additive)

Measured 2026-10-11 by grep over `ev-m-*.html` and `git log` since 2026-10-04.

- **Bronze/Silver/Gold mastery (10-04 recommendation #1): shipped on 13 of 83 pages**
  (beauty, consciousness, desire, evil, finetuning, kalam, leibniz, moral, ontological, properly-basic,
  reason, religious, thomistic). The 70 others keep the 4-checkpoint dial (read / 7-of-10 once / view 5
  cards / type 9 chars), with a 30-day "memory fades" drop to 75%.
- **Premise-defence rebuild (one card per premise, strength pills, honest limits, "try to answer it, then
  show the reply"): shipped on every tab, four-lens gated** (commits 10-08/10-09).
- **Key-terms block, reason-it-out derivation, unseen-objection Gold gate, three escalating Explain
  prompts, 12 flashcards: 13 pages.**
- **Runtime layer on all 83** (since 09-26): spaced-review banner (ladder 1/3/7/16/35/90 days),
  predict-your-score calibration, tap-to-reveal cloze drill, Socratic "Teach me this", objection-deck CTA.
- **Not done from the 10-04 list:** objection bank of 10–15 per page (it is 4), richer grader rubric
  (still `ARG_PREMISES` only), typed/graded flashcards with a 3-correct criterion, discrimination drill,
  spoken production, "teach it to a confused friend" inversion, certification exam, conversation kit.

---

## 3. The mastery section against the learning science

The evidence brief ranks techniques by evidence strength × relevance to *using an argument in a live
conversation*. Below, each top technique, the state of the site today, and the change. Effect sizes are
from the cited meta-analyses (full list in §7); "A/B/C" is the evidence tier.

| Technique (tier, headline figure) | On the site today | Gap, and the change |
|---|---|---|
| **Retrieval practice, production format** (A; g≈0.50–0.61, Yang 2021 / Adesope 2017) | Explain It Back (free recall, AI-graded) on all 83; Bronze reconstruction on 13. Strong. | Hide the page while recalling (the text is still on screen one scroll up). Count only the *highest* Explain level toward Silver, not any level. |
| **Spaced retrieval** (A; Cepeda 2008: optimal gap ≈ 5–20% of the interval you want to remember for; uniform schedules are as good as expanding, Latimier 2021) | Fixed ladder 1/3/7/16/35/90 days per *argument*. Fine schedule. | **The review itself is not retrieval.** The due banner asks "can you still state the core move?" and offers two buttons. A learner can click "I've still got it" three times and reach Gold without producing a word. Replace the banner with a 60-second re-proof: one Bronze chip set *or* one cold objection, graded, then the buttons. |
| **Successive relearning to criterion** (B+; Rawson & Dunlosky: 3 correct recalls in session 1, then ≥2–3 later sessions) | Gold needs 3 spaced "reviews" but they are self-graded (above). Flashcards: flip-only, no grade, no criterion. | Make each flashcard a typed-or-spoken prompt graded by the existing regex/AI, with "correct 3× then it leaves today's set". This also makes the copy in §1 #4 true. |
| **Interleaving** (B; g≈0.42–0.65, Firth 2021; strongest for confusable items) | `objection-deck.html` interleaves by category; Daily Mix uses a static bank. Mastery pages are blocked by one argument. | Add a **"which argument answers this?" discrimination drill** as a Gold sub-requirement: 3 objections from this argument plus 2 from sibling arguments, the learner picks the tool before answering (Khan Academy's rule: top level requires a mixed-skill check). Plumbing only, using existing certified objection cards. |
| **Inoculation / prebunking with boosters** (A/B; d≈0.36–0.43; effects decay within weeks without boosters, Maertens 2021) | The objection blocks *are* refutation texts (misconception → refutation → correct view), and the deck resurfaces misses. This is the use case. | Make the spaced review draw from the objections, not only the syllogism; active (learner-written) refutations decay slower than passive ones, so the typed reply matters. |
| **Implementation intentions, "if they say X, I'll say Y"** (A for behaviour generally; d≈0.65, Gollwitzer & Sheeran 2006) | `ad_ifthen` exists, private, in the objection deck only; not synced, never shown again. | After Silver, ask for two if-then plans naming the learner's *own* likely cues ("if my brother says…"); store with the argument; resurface them in the spaced review and the weekly email. Cheapest high-evidence item on this list. |
| **Worked example → faded completion → independent, switched off by mastery** (A; expertise reversal, Kalyuga 2007) | Shipped: model reply → cloze → cold drill. Good. | Cloze is tap-to-reveal with no typing; make it typed on the 2nd pass. Hide the worked example once Silver is earned (expertise reversal). |
| **Role-play under graduated pressure with post-hoc feedback** (B; pressure-training g≈0.67, Low 2021) | Debate Arena: 4 difficulties, mic input, read-aloud, coaching after. More than the docs credit. | Add "your weakest turn + the certified reply you could have used + retry that turn" (Duolingo Video Call and Speak both give feedback *after*, never mid-call). Prompt changes are gated. |
| **Learning by (interactive) teaching** (B; g=0.56 when actually teaching, Kobayashi 2019) | Socratic mode tutors *you*. Nothing has you teach. | **"Explain it to a confused friend"**: the AI plays a sincere, puzzled friend who asks naive follow-ups; the learner answers without the page; graded against `ARG_PREMISES`. Cooperative, not adversarial; distinct from the Arena. New system prompt → full gate + crisis guard first. |
| **Confidence ratings + hypercorrection** (B; confident errors, once corrected, stick best) | Predict-your-score and a confidence row are both live. The gap is shown; nothing is *done* with it. | Prioritise confident-wrong items (predicted 9, scored 5) to the front of the next review and the weekly email. Merge the two widgets into one. |
| **Pretesting / productive failure** (B; Pan & Sana 2021; Sinha & Kapur 2021) | Absent (0 hits). The "try to answer it, then show the reply" on premise cards is the right shape but comes after reading the premise. | Open every mastery page with one question *before* the summary: "A friend says: 'If everything needs a cause, what caused God?' Type what you'd say now." Then the page. Diff the attempt against the certified reply at the end. No new doctrine: the objection and reply already exist. |
| **Guardrailed Socratic AI** (B; hints-only tutors reach parity-to-+0.3 SD; unguarded answer-giving *lowered* exam scores 17%, Bastani 2025) | `api/tutor.js` socratic + grader modes, no answer-giving, crisis guard first. Right shape. | Keep it. The one risk is any surface that hands over the finished argument; the free Q&A mode is the place to watch. |
| **Mastery learning / criterion progression** (A, moderate; ES 0.52, Kulik 1990) | B/S/G on 13 pages. | Roll out to 70 (§5). Let adults preview ahead; let the criterion govern only the review queue, not access. |
| **Habit and motivation** (habit median ≈66 days, Lally 2010; flexible schedules beat rigid ones for durable behaviour, Beshears 2021; **no peer-reviewed evidence that streaks improve learning**, only engagement) | Daily streak + earned freezes (1 per 7 days, max 3). Belt tiers. No weekly goal. | Add a flexible weekly goal ("3 sessions this week") beside the streak; frame lapses as normal. Do not add loss-aversion stunts. |
| **Audio** (B; adults comprehend nonfiction equally by audio or text, Rogowsky 2016) | Read-along on 102/103 essays; a Listen button on `/today`; **zero audio on mastery pages**. | Reuse `library/read-along.js` on the mastery summary and objection replies. Plumbing only. |

Two site-level findings from the science that are not features:

- **Memory for *structure* outlives memory for names and dates by years** (Conway 1991: concepts
  plateau after ~3 years, names decay fastest; learners under-estimate what they still know). The
  mastery pages are correctly built around premise structure. Keep the flashcards on structure and the
  "which premise does this objection attack?" move; de-emphasise cards that test a scholar's name or a
  year.
- **Reading on screens costs about 0.2 SD in comprehension for expository text, and worse calibration**
  (Delgado 2018; Clinton 2019). The mitigation is segmenting plus retrieval checks, which is what the
  mastery page does and the 8,000-word essay does not. A "read this section, then one recall question"
  rhythm inside the long essays would carry that benefit into the deep dives.

---

## 4. What the best learning apps do that we do not (and what not to copy)

Verified in the benchmark (sources in §7). The Apologia column was checked against the repo.

**Worth adopting**

- **Mixed-skill check before the top level** (Khan Academy: "Mastered" requires a correct answer on a
  mixed-skill assessment after reaching "Proficient"). Maps to the discrimination drill above.
- **A single "mistakes" lane** (Duolingo Practice Hub; Anki leeches). Today, misses from the deck,
  cloze, Explain and quizzes are tracked in three schedulers and two stores (Supabase `flashcards`,
  `ad_objdeck`, `ad_reviews`) and only *aggregated* on `/today`. One lane, with the page's own certified
  reply shown as the "why", is the biggest retention lever the apps use. Plumbing only if the explanation
  is stored certified text, never generated.
- **"Explain my answer" is now free on Duolingo**; our equivalent is the certified reply already on the
  page. Surface it on quiz misses in Daily Quiz / Daily Mix / Speed Round, which currently show
  right/wrong only.
- **Feedback after, not during, role-play** (Duolingo Video Call, Speak). The Arena already does this;
  add transcript + retry-the-turn.
- **Retention readout** (Anki True Retention): "of the reviews due in the last 30 days, you passed 71%".
  Honest, cheap, and the only number that tells a learner whether they are keeping what they earned.
- **Weekly recap with learning content** (Duolingo, Speak, Readwise): arguments that moved up a level,
  calibration gap, oldest unreviewed item. The email exists; it reports flashcard counts.
- **Friend streaks** (Duolingo: 22% more likely to finish a lesson, company figure, correlational) map onto
  Study Groups as a "study partner" pair. Blocked on the age-screen SQL being live and a privacy review.
- **Home-screen widget / offline practice** (Mimo, Hallow downloads): defer; the native shell has never
  been compiled.

**Do not copy**

- Energy/hearts throttles and XP leagues: they reward speed and volume, punish mistakes, invite
  triumphalism. Rejected in earlier reviews for the same reason.
- AI-generated quizzes or flashcards from text (Quizlet Magic Notes): every graded answer on this site is
  gated content; `daily-mix.html` once graded a retired claim as correct. All test items must be ported.
- An AI persona that claims faith or speaks as Christ or a saint (Hallow-style companions).
- Guilt-framed notifications and streak-revival stunts.
- Any Trinity diagram, including skill-tree nodes or progress art (standing owner ban).
- Any new free-text box or picker that does not run `lib/crisis.js` first.

**Competitive position:** no apologetics app found (Truthly, STR Quick-Reference, Root & Reason) has
graded recall, calibration, spaced re-proof, or rubric-scored debate. The mastery stack is ahead of the
field. The gap is rollout breadth and loop honesty, not invention. Quizlet retired its AI tutor in 2025;
ChatGPT Study Mode and Gemini Guided Learning (both 2025) make "Socratic AI" table stakes; the edge is
that ours is scoped to certified text.

---

## 5. Prioritised plan

Effort: S = days, M = weeks, L = a sustained content programme. "Gate" = new doctrinal wording that must
pass argument + orthodoxy (+ neutrality on deity/Trinity/Islam/resurrection pages).

**Fix first (S, this week)**
1. Beginner's Path: port the Day-1 takeaway, gate the page, add to `CONTENT_PATTERNS`. (Gate: yes)
2. Evidence Library: no auto-play demo on phones. (No gate)
3. Dashboard: write `debateCount` / `askUsage` / `daily_arg_complete`, or remove the tiles. (No gate)
4. Flashcard sentence on the 13 pages: wire it or reword it. (Copy only)
5. Kalam shelf counts. (No gate)

**The main body of work (L): roll Bronze/Silver/Gold out to the other 70 mastery pages.**
Per page, from the paired certified essay: key terms, reason-it-out, Bronze chip set, 12 cards, 4 cold
objections, one unseen objection, three Explain levels. The 13 God's Existence pages are the template;
the per-page strings are ports, not authored prose (the port rule has held on every batch). Suggested
order: Resurrection tab (8), Jesus tab, Biblical Reliability, then the rest. (Gate: yes, per page.)

**Make the mechanics honest (M, plumbing; do alongside the rollout)**
6. Spaced review = a real re-proof (one chip set or one cold objection, graded), not two buttons.
7. Flashcards graded and scheduled per card, 3-correct criterion; unify the three schedulers into one
   store so `/today`, the dashboard, the push and the email read the same list.
8. Discrimination drill ("which argument answers this?") as a Gold sub-gate, from existing objection cards.
9. Pretest question at the top of every mastery page, from the page's own common objection.
10. If-then plans after Silver, resurfaced in reviews and the weekly email.
11. Confident-wrong items first in the next review; merge the two calibration widgets.
12. Reminders tied to what is due (push + email); weekly recap with levels gained and retention rate.
13. Flexible weekly goal beside the streak; retention readout and study calendar on `coach.html`.
14. Read-along audio on mastery summaries and objection replies.

**Bigger bets (M–L, gated)**
15. "Explain it to a confused friend" teach-back mode (new prompt: full gate + crisis guard first).
16. Arena: transcript, weakest turn, certified reply, retry-the-turn (prompt changes are gated).
17. Cumulative "closed-book" exam across a whole tab, once a tab is fully on the new standard.

**Deferred:** FSRS (a fixed ladder is close enough at ~80 arguments), widgets, offline practice,
certificates (parked by owner), friend streaks (blocked on age-screen SQL + privacy review).

---

## 6. What NOT to do

- Do not add a fourth prose tier or lengthen essays; the gap is enforcement of practice, not words.
- Do not pad quiz distractors to fix the answer-length tell (that is authoring doctrinal text for wrong
  answers on an ungated surface).
- Do not let a level or badge imply spiritual standing or doctrinal mastery; levels measure argument
  fluency.
- Do not market "mastery guaranteed" or cite the Feynman technique or Dunning–Kruger as evidence; the
  first has no studies as such and the second is contested (Gignac & Zajenkowski 2020).
- Do not add any learner-facing surface without the pastoral/crisis path; a picker cannot tell an
  apologetics query from a cry for help.

---

## 7. Basis and sources

**Measured in the repo (2026-10-11):** 83 `ev-m-*.html`; 13 contain `lvl-bronze` / `levelOf` /
`#bronzeGate` / an unseen-objection gate; flashcard counts 12 on the 13 (14 on properly-basic), 5–8 on the
70; `OBJ` = 4 on the 13, absent on the 70; `lib/review-queue.js` ladder `[1,3,7,16,35,90]`, last changed
2026-09-30; `objections.json` covers 66 of 83 arguments (148 objections); `beginners-path.html` has 0
`content-review` stamps and is not matched by `CONTENT_PATTERNS`; zero writers for `debateCount`,
`askUsage`, `daily_arg_complete`; `api/push.js` rotates 63 hard-coded entries by day of year.

**Measured on the live site (2026-10-11, apologiadaily.com):** mastery page 14,965px tall on desktop,
27,760px on a 375px phone, 21 requests; essay `library/kalam.html` 8,288 words, 42,178px on a phone; the
Evidence Library tutor demo auto-starts 2s after load on first visit and overlays the hero at 375px; no
console errors on any page visited.

**Not verified:** the signed-in dashboard, Study Groups and the Arena were inspected in code, not used
with an account; the floating-button clipping on the essay page was seen once mid-animation and passed a
bounds check afterwards; Brilliant lesson lengths, Hallow streak mechanics and YouVersion 2026 features
could not be sourced and are not claimed.

**Learning-science sources (key):** Yang et al. 2021, *Psych. Bull.* (testing effect, g=0.50, 222 studies);
Adesope et al. 2017, *RER* (g≈0.61); Cepeda et al. 2008, *Psych. Science* (spacing gaps);
Latimier, Peyre & Ramus 2021, *Educ. Psych. Rev.* (spaced retrieval; expanding ≈ uniform);
Firth, Rivers & Boyle 2021, *Review of Education* (interleaving); Rawson & Dunlosky 2011/2013 (successive
relearning); Pan & Sana 2021, *JEP: Applied* (pretesting); Sinha & Kapur 2021, *RER* (productive failure);
Butterfield & Metcalfe 2001/2006, Metcalfe 2017 *Annual Review* (hypercorrection, errors);
Wisniewski, Zierer & Hattie 2020 (feedback, d=0.48); Gollwitzer & Sheeran 2006 (implementation
intentions, d≈0.65); Kalyuga 2007 (expertise reversal); Low et al. 2021 (pressure training, g≈0.67);
Banas & Rains 2010; Lu et al. 2023 *JMIR* (inoculation; note the 2025 correction); Maertens et al. 2021
(decay/boosters); Schroeder & Kucera 2022 (refutation texts); Kobayashi 2019 (learning by teaching,
g=0.56); Kulik, Kulik & Bangert-Drowns 1990 (mastery learning, ES 0.52); Lally et al. 2010 and Singh et
al. 2024 (habit formation); Beshears et al. 2021, *Management Science* (flexible vs rigid routines);
Howard et al. 2021 (self-determination); Sailer & Homner 2020, Bai et al. 2020 (gamification);
Kestin et al. 2025, *Scientific Reports* (AI tutor vs active learning; see Ford 2026 re-analysis);
Bastani et al. 2025, *PNAS* (unguarded AI harms exam performance); De Simone et al. 2025, World Bank
(0.31 SD); Oreopoulos & Low 2026, NBER w35620 (Khanmigo, ~0.06 SD); Rogowsky et al. 2016 (audio vs
text); Delgado et al. 2018, Clinton 2019 (screen reading); Conway, Cohen & Stanhope 1991 (long-term
retention of structure). Retracted, do not cite: Wang & Fan 2025 (ChatGPT g=0.867).

**App sources (key):** Duolingo Q2 2026 results (58.7M DAU; 8-K via Quartr); Duolingo blog: Friend
Streak (2024-08-05), Video Call, Explain My Answer now free; Khan Academy support: mastery levels and the
mixed-skill rule; Anki manual: FSRS, desired retention, True Retention; Brilliant "How Brilliant teaches";
Quizlet Q-Chat discontinued (2025); TechCrunch 2025-08-06 (Gemini Guided Learning / ChatGPT Study Mode);
Chase et al. 2009 (protégé effect); App Store listings for Truthly, STR Quick-Reference, Root & Reason;
Hallow (Wikipedia, learnofchrist review); Mimo release notes (widgets). Full URLs are in the two agent
briefs retained in this session's transcript; the figures above are the only ones carried into
recommendations.
