# Mastery rollout guide — the implementation plan from the 2026-10-11 assessment

Companion to [`SITE_ASSESSMENT_2026-10-11.md`](SITE_ASSESSMENT_2026-10-11.md). That document says *what* is
wrong and why; this one says *in what order to fix it, step by step*, so any session can pick it up.
Owner question answered first.

---

## The sequencing decision: standard first, then rollout

**Recommendation: fix the standard on the 13 converted pages first, then roll it out to the 70. Do not
convert the 70 to today's Kalam and fix everything afterwards.**

Why, in plain terms:

1. **Most of the fixes live in shared code, not in the pages.** The spaced-review banner, calibration,
   fill-in-the-blanks and "Teach me this" are injected at runtime by `lib/review-queue.js` and
   `library/mastery-ui.js`. A fix there reaches all 83 pages at once, whichever order you choose. So the
   order question is really about the **per-page content** (cards, objections, the unseen objection, key
   terms), and that content must be shaped to fit the fixed mechanics.
2. **A converted page is a gated page.** Every one of the 70 conversions costs a gate round at the page's
   tier (dual consensus on Jesus, Trinity and Resurrection). If the template changes after a page is
   converted, any copy the change touches has to be re-gated on that page. Changing the template once on
   13 pages is cheaper than changing it twice on 83.
3. **The 70 would inherit the two dishonest bits.** Today's Gold is earned by three clicks on "I've still
   got it", and the flashcard copy promises a spaced deck that does not exist. Rolling that out means 70
   more pages making a promise the site cannot keep, on a site whose whole pitch is "checked before
   published".
4. **Timebox it.** The standard-fixing phase must not become a reason to delay the rollout. The items in
   Phase 1 are plumbing, scoped to two shared files and a data-shape rule. One to two sessions.

The one thing that should NOT wait: the five live defects in Phase 0. They are independent of the
mastery work and two of them are on the first pages a new visitor sees.

---

## Phase 0 — live defects (one session; do before anything else)

> **STATUS 2026-10-11: DONE and live on `main` (commit `1768f6fe`).** Beginner's Path gated in three rounds and stamped; demo auto-play off on phones; dashboard counters wired; flashcard sentence and shelf counts fixed on the 13; test suite now runs on Windows (142/142).

| Step | What to do | Gate | Done when |
|---|---|---|---|
| 0.1 | **Beginner's Path.** Replace the Day-1 takeaway ("even atheist scientists agree… that's not faith, that's logic") with wording ported from `ev-m-kalam.html`'s certified "argument in brief". Run argument + orthodoxy on the whole page. Add `/^beginners-path\.html$/` to `CONTENT_PATTERNS` in `tools/check-content-review.mjs` and stamp the page **in the same commit**. | Yes | CI green; page carries a `content-review` stamp. |
| 0.2 | **Evidence Library demo.** In `evidence-library.html` (~line 1269), skip `startDemo` when the viewport is under 700px; keep the pulsing button. | No | On a phone, first visit shows the hero unobstructed. |
| 0.3 | **Dead dashboard stats.** Either write `debateCount` (from `debate-arena.html` on debate end), `askUsage` (from `ask-anything.html`), `daily_arg_complete` (from `today.html`), or remove the tiles and the belt points that read them. | No | Dashboard numbers move after one debate / one question. |
| 0.4 | **Flashcard sentence** on the 13 pages: change "They drop into your spaced-repetition deck…" to a true sentence until Phase 1.2 lands (e.g. "Answer out loud before you flip; the whole argument returns for review on a spaced schedule"). | Copy only (editorial note on stamp, lens dates unchanged) | grep for the old sentence returns 0. |
| 0.5 | **Shelf counts** ("Argument 12 of 19", "Twenty-one more"): compute from the tab's page list, or reword. | No | No hard-coded totals on the 13 pages. |

Verify after: `node --test tests/*.test.mjs`, `node tools/check-content-review.mjs --changed`,
`node tools/check-retired-claims.mjs`, `node tools/check-orthodoxy-tripwires.mjs`. Push to `main`.

---

## Phase 1 — fix the standard on the 13 converted pages (one to two sessions)

> **STATUS 2026-10-11: BUILT (see the commit after `1768f6fe`).** 1.1 contract + test (`tests/mastery-contract.test.mjs`); 1.2 re-proof review; 1.3 graded per-card flashcards feeding `/today`; 1.4 pretest; 1.5 discrimination drill as a Gold sub-gate (`rq-disc`, `discPassed()`); 1.6 if-then plans (`ad_ifthen_arg`, shown at review + in the weekly email); 1.7 confident-wrong items go first (`hot`) — the two calibration widgets are **not** merged (left as a Phase 3 tidy-up); 1.8 the 8+ must come at Explain level 2 or 3 (`explainHi`) + hide-the-page toggle; 1.9 Listen buttons on the summary and the cold-objection reply; 1.10 push uses the learner's own due list (posted to the service worker) and the weekly email gained a "Your arguments" section; 1.12 typed cloze + fade past Silver; 1.13 **already true** for Daily Quiz and Daily Mix (both show the certified `feedback`/`e` text on every answer) — Speed Round has no explanation field, so adding one is CONTENT (a Phase 2 row), not plumbing. 1.11 (re-gate the 13 for changed UI wording) was not needed: no doctrinal string changed; editorial stamp notes added, lens dates unchanged. All mechanics are in the shared `lib/review-queue.js`, so they reach all 83 pages where the page carries the data (the 70 legacy pages get the hide toggle, Listen, typed cloze and the premises re-proof now; cards/OBJ-based features switch on as each page is converted).

Goal: when this phase ends, Kalam is the template the 70 will be copied from, and every mechanic on it
is honest. Work only on shared files plus the 13 pages. **Define the data shape first (1.1), because
the rollout porting in Phase 2 must produce it.**

| Step | What to do | Where | Gate |
|---|---|---|---|
| 1.1 | **Write down the page data contract.** Each new-standard page carries, in its inline script: `ARG_PREMISES` (3), `KEY_TERMS` (6–8), `DERIVE` rows, `cards` (12, each with a `front`, `back`, and a short `accept` regex or key-phrase list so it can be graded), `OBJ` (4 cold objections with certified replies), `UNSEEN` (1), `PRETEST` (1 objection + certified reply, may reuse OBJ[0]), `checks` (5 regexes). **Card rule: structure, not names.** Cards test the shape of the argument (premises, what each objection attacks, what the conclusion does and does not reach); never a scholar's name, a year or a page number as the answer. Memory for structure lasts years; names and dates decay first (Conway 1991). Put the contract at the top of `library/mastery-ui.js` as a comment and add a test in `tests/` that asserts every page containing `levelOf` has all the fields with the right counts. | `library/mastery-ui.js`, `tests/mastery-contract.test.mjs` (new) | No |
| 1.2 | **Make the spaced review a real re-proof.** When an argument is due, the banner shows one Bronze chip set *or* one cold objection (alternate), graded by the existing checkpoint/regex code; only then show "I've still got it / Needs work", and record the grade from the result rather than the click. Gold's "3 spaced reviews" now means three passed re-proofs. | `lib/review-queue.js` (banner, ~134–157), reads the page's `OBJ` / chip data | No |
| 1.3 | **Grade and schedule flashcards per card.** Flip stays, but the learner types or speaks a short answer first; grade with the card's `accept`; "correct 3× then it leaves today's set"; store per-card state in `ad_reviews[arg].cards`; feed the due cards into `/today`'s Review step through `lib/study-queue.js`. Then restore the "drop into your spaced deck" sentence, because it will be true. | `mastery-ui.js`, `review-queue.js`, `study-queue.js`, `today.html` | No |
| 1.4 | **Pretest slot.** Above "The argument in brief", one box: *"A friend says: '…' What would you say right now?"* Save the attempt; at the Bronze checkpoint show it beside the certified reply. Uses `PRETEST`. | `mastery-ui.js`; page markup | Content is the existing OBJ text, so no new gate |
| 1.5 | **Discrimination drill ("which argument answers this?")** as a Gold sub-requirement: 3 objections from this argument + 2 from sibling arguments on the same tab (pulled from `objections.json`), learner picks the argument first, then answers. | `mastery-ui.js`, `objections.json` (66 of 83 arguments have entries; add the missing 17 during Phase 2) | Plumbing; any new objection text is gated |
| 1.6 | **If-then plans after Silver.** Two fields: "If someone says… / I'll start with…". Store in `ad_ifthen` keyed by argument; add `ad_ifthen` to `progress-sync.js`'s synced keys; show them in the next due review and in the weekly email. | `mastery-ui.js`, `progress-sync.js`, `api/weekly-email.js` | No |
| 1.7 | **One calibration widget.** Merge the injected predict-your-score and the page's "be honest" row; confident-wrong items (predicted ≥7, scored ≤5) go to the front of the next review. | `review-queue.js`, page markup | No |
| 1.8 | **Count only the highest Explain level** toward Silver; hide the page body while recalling (a "hide the page" toggle on Drill 1). | page script (`explainLevels`), `mastery-ui.js` | No |
| 1.9 | **Read-along audio** on the summary and on each objection reply, reusing `library/read-along.js`. | page include | No |
| 1.10 | **Reminders tied to what is due.** `api/push.js`: if the user's `user_progress` has due items, send "N due, oldest: Kalam" instead of the rotating argument. `api/weekly-email.js`: add levels gained, retention rate, oldest due, the if-then plans. | `api/push.js`, `api/weekly-email.js` | Template copy only |
| 1.11 | **Re-gate the 13** for any user-facing wording that changed (the checklist copy, the pretest frame, the banner). One merged round, all lenses, then stamp. | the 13 pages | Yes |
| 1.12 | **Typed cloze, and fade the worked example.** The fill-in-the-blanks drill accepts a typed word per blank (graded against the blank; tap-to-reveal kept as a second chance) instead of reveal-only. Once a page reaches Silver, collapse the Drill 3 model reply by default (expertise reversal: scaffolds that help novices hurt learners who have moved past them). Shared code, so it reaches all 83 pages. | `lib/review-queue.js` (cloze, ~315–380), `mastery-ui.js` | No |
| 1.13 | **Show the certified reply on quiz misses** in `daily-quiz.html`, `daily-mix.html` and `speed-round.html`: when an answer is wrong, show the stored certified reply beside the key, not just right/wrong. The reply text already exists and is gated; this is plumbing. Confident misses feed 1.7. | the three game pages | No |

Exit test for Phase 1: a tester who has never seen Kalam cannot reach Gold without typing or
selecting correct answers at least: 1 Bronze set, 1 Explain at level 3 scoring 8+, 4 cold objections,
1 unseen, 3 passed spaced re-proofs on 3 different days, and 5 discrimination items.

---

## Phase 2 — roll the standard out to the 70 pages (the long phase)

> **STATUS 2026-10-12: Jesus tab DONE (25) + Resurrection tab DONE (8) — 46 of 83 pages now carry the standard.** Jesus-tab batch (2026-10-11→12): 25 port agents → 25 conversions → four-lens gate in four rounds (32 + 20 + 7 + 1 READ-ONLY Explore/Opus reports), 0 HERESY throughout; the full account is in each page's stamp `by` note and the per-port `notes` field (R1 / R2 residue / R3 residue lines). Lessons that cost rounds: (a) a merged fix pass still produces fix artefacts — a duplicated sentence, a misattributed clause, an antecedent moved by an insertion, an undeclared connective — so round 3 is not optional; (b) when a page prints nearly the whole essay (god-crucified), an essay-sourced unseen objection can only be one the page never STATES as an objection — it took three swaps; (c) a port fix is not a fix until the KEPT layer that prints the same claim is aligned on the page (R2 required ~15 kept-layer edits, re-applied by a patch script after every reconversion); (d) one verse-count error (John 17:5) was inherited from an essay and surfaced only because a lens re-counted. Pre-existing kept-page/essay issues → `docs/content-backlog.md` JES-RB-1..9.  Method that worked, use it for the rest: (1) one Opus writer agent per page produces a PORT FILE `docs/mastery-ports/<slug>.json` (key terms, derive rows, honest state, ORDER/PROPS, 12 cards, 4 OBJ, unseen, explain2, ledger, notes) after reading the paired essay in full — no HTML edits, no git; (2) `node tools/mastery-convert.mjs <slug>` rebuilds the page deterministically from the legacy page + the port file (keeps everything already certified, replaces the inline script with the Kalam template, appends the template CSS, writes a GATE-PENDING stamp note); (3) `node --test tests/*.test.mjs` (the contract test holds the page to the standard) + the mechanical checks; (4) gate round 1: citations port-check + argument + neutrality + orthodoxy as READ-ONLY Explore agents (Opus), two pages per agent, findings keyed to port-file field paths; (5) apply ALL findings to the port file in one pass, `git checkout -- ev-m-<slug>.html && node tools/mastery-convert.mjs <slug>`; (6) round 2 confirmation, then a narrow round 3; (7) bump the four lens dates and replace the pending note with the gate account; (8) pre-existing kept-page findings go to backlog rows (RES-RB-* precedent), never bundled. Cost on this batch: 8 port agents + 14 + 6 + 2 lens runs, three rounds; 5 BREAKs in round 1, all dropped essay qualifiers, zero in round 2 — the port rule held again. **NEXT SESSION STARTS HERE — Biblical Reliability tab (11 pages = the `ev-m-*` links in `ev-s4.html`), same method, then Science (7) → Trinity (15, dual consensus) → Christian Revolution (6) → the 2 God's Existence pages not yet converted (cosmic, design).** Brief the port agents to grep `tools/retired-claims.json` and to carry every `orthonote` fence; brief the lenses to check the KEPT layer for the pre-fix twin of every string they fix; keep a `kept_patch.py` for kept-layer edits and re-run it after every reconversion.


Order: **Resurrection (8) → Jesus (21) → Biblical Reliability (11) → Science (7) → Trinity (15) →
Christian Revolution (6)** (plus the 2 remaining God's Existence pages, cosmic and design, if they are
not already in the 13). Resurrection first because it is the flagship cluster, has 8 pages, and the
premise-defence ports there were clean in three rounds.

**Per page, in this order (one page = one unit of work; batch 3–5 per session, same tab):**

1. **Read the paired essay in full** (resolve it by `<link rel="canonical">`, not filename). Then read
   the existing mastery page in full, including `ARG_PREMISES`, `cards`, `checks`.
2. **Port, never author.** Fill the Phase 1.1 contract from the essay and the ev-s card:
   - `KEY_TERMS`: the essay's own definitions.
   - `DERIVE`: the "what follows" lines (for non-cosmological arguments: the properties or facts the
     argument establishes, each as a reveal row).
   - "The honest state of the debate": the essay's bounded verdict and its named critics.
   - Bronze chip set: 6 true properties/claims + 4 decoys; decoys must be things the essay explicitly
     denies the argument reaches (e.g. "proves the Trinity"). **STANDING RULE (Biblical Reliability tab,
     2026-10-15): every decoy must carry a VERB on the argument** — "proves / requires / by itself rules
     out / settles …" — because a bare proposition graded false reads as the site denying the proposition
     itself (e.g. the bare decoy "the inclusio is a recognized ancient convention" → "the inclusio settles
     whose testimony stands behind Mark").
   - 12 `cards` with `accept` phrases taken from the essay's wording.
   - 4 `OBJ` with replies ported verbatim from the essay's objection sections.
   - 1 `UNSEEN`: an objection the essay answers but the page's §1 and Drill 4 do not show. Record in
     the stamp which essay section it was ported from.
   - 3 Explain levels: level 2's objection is `OBJ`'s hardest.
   - `PRETEST`: reuse the "Common" objection.
   - Add any missing `objections.json` entries for the argument (for the discrimination drill).
3. **Replace the legacy script**: remove the 4-checkpoint state, `FRESH_MS`, the debate-box rule;
   install the B/S/G block from the template. Fix the dial intro, the flashcard intro, the shelf line.
4. **Mechanical checks before any gate**: `node --test tests/*.test.mjs` (includes the contract test
   and inline-script syntax), `check-footnote-integrity`, `check-retired-claims`,
   `check-orthodoxy-tripwires`, `check-content-review --changed`.
5. **Gate, one merged round, all lenses, as READ-ONLY Explore agents** (hash the files before and
   after; never accept an agent's own account of what it changed). Diff the graded layer first:
   `ARG_PREMISES`, `cards`, `checks`, `OBJ`, `UNSEEN`, the Bronze chips. Fix all findings together;
   re-gate; stamp. Expect 2 rounds; if round 3 finds mostly your own authored strings, stop and port.
6. **Mirror.** If the argument has an MK/ES mastery mirror, sync it in the same commit (AI-translated,
   stamped "pending native gate"), or log the lag in `tools/mirror-parity-ledger.json`.
7. **Regenerate counted figures** (`build-sources-index`, `build-our-sources`, `update-trust-numbers`)
   if any essay or source changed; push to `main`.

Budget to expect: on the God's Existence conversion the per-page gate took 2–3 rounds. Plan on roughly
3–5 pages per working session, so 70 pages is about 15–25 sessions of content work.

---

## Phase 3 — cross-page features (after at least one full tab is converted)

| Step | What | Gate |
|---|---|---|
| 3.1 | **Single mistakes lane** on `/today`: misses from cards, cloze, Explain criteria, quizzes and the deck, each shown with the page's stored certified reply as the "why". Include the essay recall checkpoints (`library/active-reading.js`, live since 2026-07-24): a section the reader did not tick "I could recall it" becomes a due item here, answered by its curated takeaway (today `ad_read_<slug>` reaches nothing). Unify the three schedulers (`flashcards`, `ad_objdeck`, `ad_reviews`) into one store so `/today`, the dashboard, push and email read the same list. | Plumbing (explanations are stored text) |
| 3.2 | **Retention readout and study calendar** on `coach.html` ("of reviews due in 30 days, you passed 71%"). | No |
| 3.3 | **Flexible weekly goal** beside the streak. | No |
| 3.4 | **"Explain it to a confused friend"** teach-back mode in `api/tutor.js` (new system prompt: crisis guard first, then argument + orthodoxy + neutrality). | Yes |
| 3.5 | **Arena: transcript, weakest turn, certified reply, retry-the-turn.** | Yes if `api/debate.js` changes |
| 3.6 | **Tab-level closed-book exam** once a whole tab is on the new standard. | Content from existing certified items |

Deferred on purpose: FSRS, widgets, offline practice, certificates, friend streaks (needs the age-screen
SQL live and a privacy review), and teach-one-argument-each in Study Groups (same mechanism as 3.4 but it
needs a group that meets; revisit only if groups get traction).

---

## How to start a session on this guide

Paste this at the start of a session:

> Work from `docs/MASTERY_ROLLOUT_GUIDE_2026-10-11.md`, Phase N, step N.N. Read the assessment it links
> first. Measure, don't estimate; port, don't author; run the mechanical checks before any gate; run gate
> lenses as read-only Explore agents and hash files before and after; a fix pass re-opens the gate.
> Record what did not run. Report the exit test result for the phase.

Definition of done for the whole programme: all 83 `ev-m-*.html` pages pass the contract test; no page
contains `FRESH_MS`; the live review banner requires a graded re-proof; the flashcard sentence is true;
`/today`, the dashboard, push and email agree on what is due.

## ✅ Biblical Reliability tab (11 pages) — DONE 2026-10-15

All 11 `ev-m-*` Biblical Reliability pages (archaeology, canon, coincidences, consistency, deadseascrolls,
earlydate, eyewitnesses, jewishness, manuscript, names, prophecy) carry the Bronze/Silver/Gold standard and
are four-lens gated (rounds 1–3, READ-ONLY Explore/Opus agents, md5-checked before/after every round, git
status/log verified). **Round 2 (16 reports, all four lenses × 11 pages): orthodoxy 11/11 CLEAN (0 HERESY,
0 DRIFT); every NEW layer certified sound; the residue was localized KEPT-LAYER TWINS (stale pre-fix wording
beside the fixed NEW-layer string) + one NEW-layer Bronze-decoy-verb fix,** applied in one merged pass (port
fields via assert-guarded script + reconvert; kept-layer via `kept_patch_br.py`). **Round 3 (4 narrow lenses)
confirmed every residue edit landed and caught two of its own fix-artifacts (a duplicated phrase on
deadseascrolls, a bookended sentence on eyewitnesses) + two word-echoes — all cleaned.** Stamped 2026-10-15
(four lens dates + gate account). The port rule held once more: every verbatim essay port survived; the only
findings were in the few authored/attributed connective strings, all declared and re-gated. Pre-existing
kept-page/essay items → `docs/content-backlog.md` **BR-RB-1..8** (rule 9, not bundled; BR-RB-1 = the
consistency track-vs-essay mismatch, an OWNER CALL). **57 of 83 pages now carry the standard.**
Scratchpad artefacts for the pattern: `port-brief-br.txt`, `r2-brief-br.txt`, `r3-manifest-br.txt`,
`port_r2_br.py`, `kept_patch_br.py`, `kept_patch_br_r3.py`, `stamp_res.py`, `stamp_account_br.txt`.

## ✅ Science tab (7 pages) — DONE 2026-10-16

All 7 `ev-m-*` Science pages (bigbang, cambrian, cosmic, laws, mathematics, originlife, privileged) carry the
Bronze/Silver/Gold standard and are four-lens gated (round 1 + an independent round-2 confirmation, READ-ONLY
Explore/Opus agents, md5-checked, git status/log verified). **This was the cleanest batch yet: round 1 — 8
reports, all four lenses × 7 pages, including a kept-layer contradiction sweep — returned 0 BREAK / 0 DRIFT /
0 HERESY / 0 must-fix / 0 clarifier on every page; round 2 (3 independent lenses) confirmed it; no residue was
applied, so no round 3 was needed.** The port rule paid off end to end — every string ported, the tab hazards
front-loaded in the writer brief, the 2–3 declared-authored strings per page (unseen.q, obj landing clauses,
the order[2] fence) all surviving scrutiny. Verified on every surface: the DEISM-GAP fence (each reaches a
transcendent cause / purposive Mind, not yet the Triune God, pointing onward to the resurrection) + the
data-conceded/design-inferred wall; bigbang kalam ("begins to exist") with Guth kept as the dissenting BGV
co-author; cosmic carries its OWN cast (not finetuning's Stenger/Hossenfelder/Lewis-Barnes); the mathematics
Logos passage confirmed Nicene-common and conditionally framed; no god-of-the-gaps on origin-of-life/Cambrian;
Francis Collins never an ID premise. Stamped 2026-10-16. Pre-existing kept-page/essay items →
`docs/content-backlog.md` **SCI-RB-1..7**. ⚠ **SCI-RB-1 is an owner call: `ev-s5.html` links
`ev-m-miracles.html`, which does not exist** (a pre-existing broken tab link — build the page or drop the
link). **64 of 83 pages now carry the standard.**

## ✅ Trinity tab (12 pages) — DONE 2026-10-16, DUAL CONSENSUS

All 12 legacy `ev-m-*` Trinity pages carry the Bronze/Silver/Gold standard and are four-lens gated at
dual consensus: **analogies, early_church_trinity, eternal_generation, holy_spirit, modalism, nt_trinity,
ot_trinity, philosophical_trinity, relations, shema, trinity_islam, trinity_mormons.** (The other two
`ev-s6` links — `jesus_as_god_nt` and `trinity_jw` — were already converted + gated with the Jesus tab, so
the tab is **14 pages, 12 new this batch**.) Method: one Opus port agent per page (each reading the paired
essay in full, resolved by `<link rel="canonical">`) → `node tools/mastery-convert.mjs <slug>` → mechanical
checks → four-lens gate (citations + argument + **apologia-orthodoxy AND apologia-neutrality both CLEAN**) as
READ-ONLY Explore/Opus agents, md5-checked before/after and git status/log verified (write-access hazard) →
merged residue pass (NEW-layer via assert-guarded port edit + reconvert; KEPT-LAYER twins via a kept_patch
re-run after reconversion) → narrow round 2 confirmation **only where a fix was applied** → stamped with
`scratchpad/stamp_trinity.mjs`. **Round 1 returned all 12 STAMPABLE, 0 BREAK, 0 HERESY** — the port rule held
yet again: the only findings were DRIFT-level authored/compressed strings. Residue applied (all ports):
shema (dropped "outright"; added the essay's "we know of"+Philo "nearest case" qualifier across new + kept
layers — propagated to nt_trinity's kept twin too), ot_trinity (dropped an authored "symbol for faithful
Israel" Daniel-7 option; restored the Zechariah "referent debated" hedge), nt_trinity (unseen "as to a god"
→ "as though he were that God"), eternal_generation (distinguished Goligher's vs Trueman's distinct charges
per the essay). Trinity hard rules verified on every surface: **NO Trinity diagram/figure anywhere**; every
orthonote fence carried into the port prose; no retired echad-plurality / 300-bishops (always "about 250 to
318") / divine-identity-as-consensus / kalām-kalima lexical bridge / Arian "distinct from the essence";
modalism's "just as" (never "as the Father") and one-divine-will Gethsemane fence held; rival-worldview
EXPLICIT-VERDICT + FALSE-COMMON-GROUND landed and fenced; intra-Christian disputes (Filioque, EFS, relations
of origin, social-vs-classical) reported, not adjudicated. 3 coarse-net tripwire strings on the rival pages
(trinity_islam same-God DENIAL; trinity_mormons two LDS-belief attributions/rejections) confirmed legitimate
by both dual-consensus lenses and baselined in `tools/orthodoxy-tripwires-baseline.json`. Pre-existing
kept-page items → `docs/content-backlog.md` **TRIN-RB-1..3** (rule 9; TRIN-RB-1 = the analogies kept-layer
Scutum Fidei verbal description, an OWNER CALL — doctrinally clean, no rendered figure). Pastoral/elder
sign-off still `_pending_` site-wide (deity/Trinity is the first tier owed a human pass).
**76 of 83 pages now carry the standard.**

## ⏸ RESUME HERE — Christian Revolution tab, next

Remaining Phase 2 order: **Christian Revolution (the `ev-m-*` links in `ev-s8.html` — confirm the exact slug
list against that fragment first; the 2026-09-30 ruling replaced the old `legacy` essay with the 7 Christian
Revolution essays, so re-target any stale `legacy` reference) → the God's-Existence pages not yet converted**
(confirm which remain against `ev-s1.html` — "cosmic" is done as part of Science, so re-check the exact
remaining God's-Existence slugs rather than assuming). Same proven method as the Jesus / Biblical Reliability
/ Science / Trinity batches: one Opus port agent per page reading the paired essay in full (resolve by
`<link rel="canonical">`) → `node tools/mastery-convert.mjs <slug>` → `node --test tests/*.test.mjs` +
check-retired-claims/orthodoxy-tripwires/unquoted-attributions/footnote-integrity → four-lens gate as
READ-ONLY Explore/Opus agents, md5-checked → merged residue pass (NEW-layer via assert-guarded port edit +
reconvert; KEPT-LAYER twins via a `kept_patch` script re-run after every reconversion) → narrow round 2
**only if a fix was applied** → stamp → append backlog rows → commit ports + pages + backlog + guide,
**NEVER the reel specs under `tools/reel/`**, push `HEAD:main`, verify live. (Reusable Trinity-batch
scaffolding is in this session's scratchpad: `PORT_BRIEF_TRINITY.md`, `GATE_BRIEF_TRINITY.md`,
`stamp_trinity.mjs`.)
⚠ **TRINITY IS THE HIGHEST-STAKES TAB — four hard rules:** (1) **DUAL CONSENSUS is mandatory** — `apologia-orthodoxy`
AND the adversarial `apologia-neutrality` lens must BOTH return CLEAN/STAMPABLE on every page before stamping;
one lens is not enough, and a fix pass re-opens both. (2) 🔴 **NO TRINITY DIAGRAM, EVER** (standing owner ruling
in CLAUDE.md) — no figure/chart/illustration of the Trinity or the relations of the persons on any surface; the
converter builds none and no port may introduce one. (3) **The compression hazards this file already records cost
real rounds on Trinity content before** — modalism ("honoring the Son AS the Father"), the Arian-direction
"distinct from the essence" flashcard, the retired lexical *kalām Allāh* / *kalima* bridge on the Islam-adjacent
cards, "three hundred bishops" (→ "about 250 and 318"), and the Shema/*echad* overreach: grep
`tools/retired-claims.json`, carry every `orthonote` ＊ fence into the wording (cards/chips cannot host the box),
and name the person on any screenshot-bound surface. (4) **Several `ev-s6` Trinity cards were edited 2026-10-15**
(the verdict-close sweep), so read each paired essay in full and **diff the graded layer (ARG_PREMISES, cards,
checks) first.** The standing Bronze-decoy-verb rule (Phase 2 step 2) applies.
