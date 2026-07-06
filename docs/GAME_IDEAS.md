# Game & learning-feature ideas — parked for later

_Product recommendations from the 2026-07-06 session (learning-science audit + competitive
scan). Kept here so they survive session compaction. Competitive claims were verified by the
`apologia-product` agent: teach-a-student, steelman-first/ITT, calibration scoring, and
fix-the-broken-argument mechanics are ABSENT from the Christian app market as of the scan
(closest analogs: secular Feynman AI; one-off ITT blog contests; ReProof.AI's live fallacy
detection; BeliefMap.org's branching trees — both assessed as low-threat one-person projects)._

## Flagship candidates (in recommended build order)

### 1. Crossroads — conversation sim with dual meters (Truth × Trust)  ← build first
Reigns-style swipe/branching conversation. Every reply moves TWO meters: **Truth** (argument
soundness — drains on over-concession, granting the opponent's frame, unearned symmetry) and
**Trust** (the relationship — drains on bulldozing, sarcasm, syllogisms-at-a-funeral; at zero
the conversation ends: you were right and they left). Winning needs both. It is 1 Peter 3:15
and "concede the observation, never the inference" as a game loop — the house guardrails made
playable. Retention hook: a persistent NPC ("Sam") across a 7-day run who remembers yesterday
(narrative streak; no Christian app has a persistent relational NPC). v1 needs zero AI: static
branching JSON gated through the full content pipeline (like reel specs, `reviewed` stamp);
Pro = free-text replies scored on both axes via the /api/tutor pattern. Science:
transfer-appropriate processing (trains the actual skill — choosing the next sentence under
emotional load), natural interleaving. First scenario suggestion: problem of evil (tone
matters most).

### 2. The Other Chair — steelman-first / Ideological Turing Test
Before you may answer an objection, you must STATE the skeptic's case well enough that the AI
judge scores your steelman as accurate+strong; then you switch chairs and answer. Score =
steelman fidelity × answer quality. Confirmed absent from the entire market. Judge prompt must
enforce "concede the observation, never the inference" and every round must END in the
orthodox answer; the prompt itself goes through the orthodoxy gate.

### 3. Teach Timothy — protégé-effect mode
A simulated 16-year-old with honest doubts asks questions; you teach; THEN the student takes a
quiz and your score is the student's performance (protégé effect — Chase et al.; Feynman
technique; secular Feynman AI validates the UX). Reframes apologetics as discipleship, not
combat.

### 4. The Case Files — Ace Attorney × Cold-Case Christianity (prestige flagship, later)
Narrative detective game: the empty-tomb cold case; interview AI witnesses, collect evidence
cards, survive a cross-examination by presenting the right evidence at the right moment.
Nobody has made evidential apologetics a game despite the courtroom framing being a bestselling
book genre.

## Engagement layers (not new games)

- **Tactics Trainer + rating (chess.com model):** atomic mid-conversation "positions," an
  Elo-style rating that moves every attempt, daily position, Puzzle Rush survival mode, SRS on
  missed positions. Could unify Objection Catcher/Speed Round into one rated ladder.
- **Calibration wagering (cheapest to ship):** add "how sure are you?" (50–99%) to the daily
  quiz, scored so overconfidence costs more than ignorance (Brier-style). Trains the
  intellectual humility of 1 Pet 3:15. Confirmed absent from the market.

## Learning-science gaps in the current stack (quick wins)

1. **Interleaving:** daily quiz + due-cards should mix categories deliberately (blocked
   practice → poor discrimination; Rohrer & Taylor). Add a mixed-gauntlet Speed Round mode.
2. **Pretesting:** one commit-to-an-answer question at the top of each "Case, Plainly" block
   before reading (pretesting effect, Kornell/Bjork).
3. **Successive relearning:** mastery-dial decay over weeks; re-proving a checkpoint restores
   it (Rawson & Dunlosky). Natural retention loop.
4. **Elaborative interrogation:** on a flashcard miss, one AI-scored "why is that the answer?"
   prompt before rescheduling.

## What NOT to do
Ascend-style loot mechanics (evolving pets, Battle Pass) clash with the orthodoxy-gated,
serious-but-warm brand. Belts/streaks are already at the right gamification level.
