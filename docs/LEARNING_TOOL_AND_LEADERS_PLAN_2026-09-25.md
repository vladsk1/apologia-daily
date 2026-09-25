# Apologia Daily as a teaching tool — assessment, mastery-page redesign, and a Leaders section

**Date:** 2026-09-25. **Scope:** the site as a *teaching* product (can it reliably turn a church member into
someone who can explain and defend the arguments?), the 81 `ev-m-*` mastery pages in particular, what it takes
for a church to adopt it with confidence, and a proposed **Leaders** section so churches can run Apologia Daily
workshops and studies.

**Builds on (so it doesn't redo them):** `docs/LEARNING_ROADMAP_2026-09-09.md` (consumer learning-app
benchmark, items A–L), `docs/USABILITY_ASSESSMENT_2026-09-07.md`, `docs/APOLOGETICS_CERTIFICATE_BENCHMARK.md`
(three-level certificate), `docs/NUMBER_ONE_ROADMAP.md`, `docs/MASTERY_PAGE_AUDIT.md` (doctrinal audit, done).
This document is about **pedagogy and church adoption**. It is not a doctrinal review.

**Basis:** every count below was measured on 2026-09-25 against the working tree with `grep`/Python over the
files named. External benchmarks (§6) come from a read-only `apologia-product` research pass; its unverified
vendor claims are marked. **Nothing is built by this document. It changes no live content.**

---

## 0. The verdict

**The content is already better than the market. The teaching design is not yet.** The certified essays,
steelmanned objections, footnotes, primary sources and review discipline are rare, probably unique, among
church-facing apologetics resources. The mastery pages have the right skeleton: *Understand → Practice →
Prove*, an AI-graded Explain It Back, spaced-repetition cards, a Memory Palace room, and a confidence
self-rating. **But four design gaps stop the site from being the place a church can hand someone and trust
that they will come out able to teach the argument:**

1. **No teaching order.** The mastery library is numbered **alphabetically**, not pedagogically. The study
   plans, the daily loop and the Coach **never route to a mastery page** (§2).
2. **The mastery bar is too low, and it tests the easy objection.** A page can go "gold" in one sitting:
   open every section, score 7/10 once, flip each card once, and *attempt* one live objection, usually the
   **Common** one. The objection the page itself calls the hardest is **named but never drilled**, and
   mastery never needs to be shown again later (§3).
3. **There is nothing for the person who has to teach it.** No learning objectives, session plans, discussion
   questions, timings, answer keys, slides or handouts, and no leader training. A small-group leader has to
   build a lesson from a web page (§5).
4. **A church has no single page to vet.** The trust material is excellent but scattered across
   *What We Believe*, *Editorial Standards*, the Statement of Faith and the sources pages. Pastoral sign-off
   is still `_pending_` site-wide, and that is the first thing an elder board will ask about (§4).

**The fix is mostly *assembly*, not new authorship**, and that matters for this repo. Every new learning
layer proposed below can be built by **porting certified text** (the port rule in `CLAUDE.md`, 8–10), so it
costs gate rounds proportional to the few genuinely new sentences, not to the size of the feature.

## 0.1 What is actually live today vs. what this document proposes

**Basis:** apologiadaily.com itself could not be fetched from this session (the environment's egress policy
blocks the host). Vercel deploys `main`, and `origin/main` (`316bc0d`) is exactly the tree audited here,
so this table reflects what `main` serves. Rows that depend on the live database or API keys are marked
**unverified**: this session cannot log in or call production.

| Feature | Status on the live site | Evidence |
|---|---|---|
| Evidence Library essays (101), tab cards, 81 mastery pages | **LIVE** | Served HTML on `main` |
| Pro paywall | **NOT BUILT.** Everything is open to everyone; "Pro" is labelling only | `isPro = true` hard-coded on 205 pages; "launching soon" on 221; pricing card says "Pro — $8 planned price · launching soon"; no checkout (Stripe not wired) |
| Explain It Back / AI tutor / Debate Arena / Asked & Answered | **LIVE in code; working depends on the API key** (unverified from here) | `api/tutor.js`, `api/debate.js`, `api/ask.js` |
| Flashcards (SM-2), `/today`, Coach, progress sync | **LIVE for signed-in users** (unverified: needs Supabase) | `progress-sync.js`; migrations owner-reported run 2026-09-08 |
| Memory Palace rooms | **LIVE** on 37 of 81 mastery pages | `palace.html` links |
| Study Plans (10) + Advent / Easter challenges | **LIVE**, but ungated copy and no mastery-page links (§2.4, §2.6) | `study-plans.html`, `challenge.html` |
| Study Groups | **Built; whether it works for real accounts is UNVERIFIED.** It shows "being switched on" if the tables are missing | `study-groups.html:671/688/1145` |
| Reading Clubs | **LIVE, uneven depth.** 6 books listed; 2 have full club pages (On Guard, Islamic Dilemma); the page shows a fake "Week 5 of 12" banner to everyone | `reading-club*.html` |
| Del Rosario companion study | **Private preview, not a public feature** (served under `/demo/`, `noindex`) | `demo/del-rosario-companion-study.html` |
| Video lessons on essays | **Configured for 31 essays** (all have YouTube IDs); whether the videos play was not checked | `library/video-lessons.json` |
| For Parents | **LIVE** (AI "explain to my kid" tool + age path) | `parents.html` |
| **Certificates / diplomas / credentials** | **DO NOT EXIST.** No page, no feature. Every "certificate" string on the site is historical (the Decian *libelli*) or a review-stamp comment | grep over all served HTML; the plan is parked in `docs/APOLOGETICS_CERTIFICATE_BENCHMARK.md` |
| **Church / leader features** (leader guides, facilitator training, church licence, `/churches`, group-leader tools, present mode) | **DO NOT EXIST.** The only church touches are copy ("Perfect for a family or church"), a "church small group" label in Study Groups, and "talk to your pastor" referrals | No served page matches leader-guide/facilitator/church-licence terms, apart from the private demo |

**Two live claims worth checking** while here: the pricing card's "Join **thousands** of Christians" has no
figure behind it anywhere in the repo, and the Instagram data in `CLAUDE.md` (2026-08-05) records a
19-follower account. The pricing card also lists no Mastery Tracks, while every mastery page calls itself
"a Pro feature".

**So:** everything in §5 (the Leaders section) and every credential mentioned in this document is
**proposed, not existing**. §2–§3 are findings about what is live.

---

## 1. What is genuinely strong (keep it; lead with it)

- **Scholarly apparatus no competitor combines:** 101 `library/*.html` essays with numbered footnotes and
  bibliographies, a verified public-domain source library, "See the evidence" panels, and a public
  corrections log. This is the moat.
- **Honest steelmanning, built in.** Each mastery page states 4–7 objections "in their strongest form",
  tagged *Common / Trickier / Hard*, and names its hardest objection with a link to the essay's answer. Most
  church curricula give a paragraph of rebuttal and move on.
- **Real retrieval practice.** Explain It Back (graded by `/api/tutor`), SM-2 flashcards, the `/today` daily
  loop, and Memory Palace rooms on **37 of 81** mastery pages. These are the most evidence-backed learning
  mechanisms available (retrieval practice and spacing).
- **Metacognition.** The "how ready are you?" self-rating, and the calibration note when confidence runs
  ahead of the score (`setConf`/`calibNote`), are already live. Roadmap item A from 09-09 is effectively
  shipped.
- **Pastoral safety.** The crisis path in all six AI endpoints matters **more** in a church setting, where a
  youth leader may hand the tool to a struggling teenager.
- **Tone.** The 1 Peter 3:15 framing is in the drills themselves ("One strong way to answer — in a
  1 Peter 3:15 tone"). This is exactly what churches worry outside apologetics material lacks.

---

## 2. Measured findings — the learning path

| # | Finding | Evidence (measured 2026-09-25) | Why it matters for teaching |
|---|---|---|---|
| 2.1 | **Mastery sequence is alphabetical.** | The "of 19" set runs archaeology 1, bigbang 2, cambrian 3, canon 4 … kalam 12 … prophecy 19, mixing God's-existence and Bible-reliability arguments in A–Z order. | "Argument 12 of 19" tells a learner nothing about what to learn first. Kalam, usually the *first* argument taught, is 12th. |
| 2.2 | **Set sizes contradict themselves.** | Seven different set sizes are in use (7, 8, 13, 15, 16, 19, 22). The "of 22" set has only 11 pages (numbers 2–12). `ev-m-typology` is "16 of 16" alone. 7 pages have no position line. | A learner cannot trust the map. |
| 2.3 | **Stale hard-coded copy.** | 20 pages say "Twenty-one more core arguments" or "Twenty more"; 22 of 81 have no "Next:" link. | Dead ends break a path, and wrong counts look careless to a vetting pastor. |
| 2.4 | **Study plans never reach a mastery page.** | `study-plans.html`: 10 plans (incl. the ongoing Daily Defender), 200 scheduled days, **0 links to `ev-m-*`**, 66 links to the bare `evidence-library.html` hub, 39 empty links, 13 to essays. | The structured path (the thing a church would actually use) skips the best teaching surface on the site. |
| 2.5 | **`/today` and the Coach don't link to mastery pages either.** | 0 `ev-m-` references in `today.html` or `coach.html`. Only the `ev-s*` tab cards, `dashboard.html` and `parents.html` link to them. | The mastery library is reachable mostly by browsing. |
| 2.6 | **Study plans are ungated doctrinal copy, with overclaims.** | `study-plans.html` has no `content-review` stamp and is outside `CONTENT_PATTERNS`. Day 1 of the resurrection plan: "Learn the five facts that **even atheist historians accept**". The certified `library/minimalfacts.html` says the case is "weakest when it inflates 'majority' into 'virtually all'". | This is the same "compressed surface contradicts its certified essay" failure `CLAUDE.md` records repeatedly, on the surface a church would assign as homework. **Gate before promoting plans to churches.** |
| 2.7 | **The Reading Clubs page shows fake progress.** | `reading-club.html:276–289` hard-coded "Mere Christianity — Week 5 of 12" at 42%, as static HTML shown to every visitor. Chapter "done / current" dots were hard-coded the same way. | A leader previewing the product sees invented progress. ✅ **Fixed on this branch 2026-09-25 (`fb9d40b`); not yet deployed to `main`.** The banner now shows only a club the visitor has joined, with no invented week; the fake dots are removed. |
| 2.8 | **An orphan "Coming soon" mastery page was indexed.** | `ev-m-legacy.html` (1.6 KB, `<h1>Coming soon`) was the mastery page for "Did Christianity Change the World?", taken offline at owner direction on 2026-08-23. It is linked from nowhere but was in `search-index.json`. The 8th Evidence Library tab, labelled **"The Christian Revolution"** on the live site (`evidence-library.html:363`; older notes call it "The Church in History"), now links seven mastery pages: riseofchurch, persecution, equality, compassion, science-history, abolition, progress (`ev-s8.html`). ⚠ That the last five cover the old essay's ground is an inference from their titles; the text was not compared. | Search sent learners to a placeholder. ✅ **Fixed on this branch 2026-09-25 (`fb9d40b`); not yet deployed.** `tools/build-search-index.mjs` now skips any `noindex` page (380 → 379 records, only this page removed). The file is left in place. Optional: a `vercel.json` redirect like the one `library/legacy.html` already has. |

---

## 3. Measured findings — the mastery page as a lesson

Worked example: `ev-m-kalam.html` (≈2,160 visible words). The structure is the same on all 81.

**What a learner does today:** reads "The argument in brief" → *Understand* (formal syllogism, what the cause
must be, premise defences, 5 objections, primary sources) → *Practice* (Explain It Back /10, flashcards, one
seeded live objection with a model answer, Memory Palace link) → *Prove* (four checkboxes + self-rating) →
"Next: the Fine-Tuning Argument".

| # | Gap | Detail |
|---|---|---|
| 3.1 | **Mastery can be crammed in one sitting and never decays.** | The four checkpoints are: open every section, score ≥7 once, see every card once, *attempt* the live objection. Nothing asks for the argument again in a week. The flashcards resurface in SM-2, but the **gold status doesn't depend on them.** |
| 3.2 | **Only one live objection is drilled, usually the easiest.** | Each page lists 4–7 objections (e.g. `ev-m-minimal`: Common ×2, Trickier ×2, Hard ×2), but Drill 3 seeds one scenario. On Kalam it is "who created God?", tagged **Common**. The flagged hardest objection (Morriston's causal-intuition objection) is linked to the essay, never practised. |
| 3.3 | **"Defended it" means "tried it".** | The checkbox is ticked by *attempting* the objection. There is no grading of the defence, unlike Explain It Back. |
| 3.4 | **The fallback scorer can grant mastery.** | `renderMockScore()` (regex scorer, used when `/api/tutor` fails) sets `explainPass` at ≥7 (`ev-m-kalam.html:757`). An API outage turns keyword-matching into a mastery credential. Low severity for individuals, more serious for any future certificate (see §7.4). |
| 3.5 | **No stated learning objectives or time estimate.** | The page never says "by the end you can: state P1/P2 precisely, name the two families of objection, answer 'what caused God?' in 30 seconds, and say honestly where the argument stops." Objectives are what let a leader plan and a learner self-assess. |
| 3.6 | **No "say it at three lengths".** | Real conversations need a 30-second version, a 2-minute version and a 10-minute version. The page has a summary and a full treatment, with nothing in between that is built for speaking. |
| 3.7 | **No "common mistakes believers make".** | The site's own rules (`CLAUDE.md` argument-specific rules) are exactly this list: "everything has a cause", "scientists agree the universe is designed", "manuscripts prove the Bible is true", "merely written decades later". Teaching the misstatements is one of the highest-value things an apologetics course does. It is already certified wording, and it is not on the pages. |
| 3.8 | **No conversation walkthrough or questions to ask.** | The live drill is a single exchange. There is no worked dialogue showing how the argument goes in real life: asking questions first, finding the other person's actual objection, knowing when to stop. (This is Stand to Reason's *Tactics* insight, and churches value it most.) |
| 3.9 | **No "where it stops" drill.** | Kalam honestly says it "concludes to a transcendent cause, not yet to the full God of Christianity". That honesty is taught in prose but never practised: "What does this argument **not** prove?" is not a question anyone is asked. That question is how you build the *durable, not brittle* confidence the mission statement asks for. |
| 3.10 | **No group mode.** | Everything is single-player and saved to one browser/account. Nothing lets a leader put the page on a screen, run the drill with a room, or see how the group is doing. |
| 3.11 | **Presented as Pro.** | Every page opens with "Mastery Tracks are a Pro feature" (with `isPro = true` hard-coded, so they are open for now). A church deciding whether to adopt needs to know what its members will be able to access. This is tied to the pricing decision already logged as OPEN. |

---

## 4. What makes a church adopt with confidence

This synthesises the research in §6 with what the site already has.

1. **One "For Churches" trust page** that a pastor can read in five minutes and forward to elders:
   - The Statement of Faith (Nicene + Apostles' Creeds) and the denominational-neutrality commitment, stated
     as a promise ("we will not teach your people a position on baptism, predestination, papacy, sacraments,
     Mary or end-times as settled").
   - **"Checked Before Published"**: the five review stages, an honest statement that the reviewers are
     AI under human supervision, and the public corrections log.
   - **Named human reviewers.** ⚠ This is the gap that matters most. Pastoral sign-off is `_pending_`
     site-wide (`docs/STATEMENT_OF_FAITH.md`). Recruiting a standing reviewer panel, ideally cross-tradition
     (for example one Protestant, one Catholic and one Orthodox pastor or theologian, matching the neutrality
     promise), is the **single highest-leverage church-adoption action**. It is already logged as OPEN.
   - The pastoral-care promise: the AI refers anyone in crisis to a real person, and never offers medical,
     legal or pastoral counselling.
   - **Data and privacy for minors** (youth groups): what is stored, and whether under-16s can use it. This
     needs an owner and legal decision; it isn't a content item.
2. **Free full preview for leaders.** Every curriculum churches trust lets the leader see all of it before
   committing.
3. **A scope-and-sequence chart.** One page showing every session, what it teaches, how long it takes and
   what it needs. Churches plan by term.
4. **Endorsements, where genuine.** The Del Rosario reading-club demo is the right model: invite a named
   scholar to review a study built on their work. Never imply an endorsement that hasn't been given.
5. **Respect for the church's authority.** Leader guides should say "if your church teaches X on a disputed
   question, your pastor is the guide here", the same fence `parents.html` already uses.

---

## 5. The Leaders section — proposal

**Working name:** *Apologia Daily for Churches* (a hub at `/churches`), containing a **Leaders' Track**
(training the leader) and a **Session Library** (what the leader runs).

### 5.1 Design principles

- **Assemble, don't author.** Every session is built from a mastery page and its certified essay. The
  leader-guide text is ported. Genuinely new strings (discussion questions, facilitation notes) are few and
  **declared** to the gate (port rule 8).
- **The leader doesn't need to be an expert.** The guide carries the argument, the likely questions, the
  answers and the honest limits, so a faithful small-group leader can run it with 30 minutes of preparation.
- **Practice, not lecture.** At least half of each session is people saying the argument out loud to each
  other. This is the one thing a group does better than an app.
- **Modular, not a locked script.** Churches adapt what they buy (§6), so sessions are self-contained and
  leaders can reorder them within a series.
- **Script the leader's words.** The biggest risk for a footnote-heavy site is intimidating a volunteer.
  The guide gives them sentences to say. The footnotes stay one tap away.
- **One session = one mastery page.** The group session and the individual mastery page use the same
  argument, objectives and drills, so homework and group time reinforce each other.

### 5.2 Session anatomy (a 60–75 minute template; 45- and 90-minute variants)

| Time | Segment | Source (ported from) | Leader gets |
|---|---|---|---|
| 0–5 | **Open**: a real-life question ("Has anyone asked you…?") | new (gated) | 2 prompt options |
| 5–10 | **Watch / hear**: the 1-minute version | the certified reel via `library/video-lessons.json`, or read-aloud of "The argument in brief" | Play link, or a script to read |
| 10–25 | **Teach**: the structure, premise by premise | mastery "Understand" + formal syllogism | Slide per premise; the "common mistakes" box; 3 check-for-understanding questions with answers |
| 25–45 | **Practice in pairs**: 30-second version, then the Common objection, then swap | mastery Drill 1 + Drill 3 + model answer | Timer cues, the model answer, an **observer checklist** (did they word P1 carefully? were they gentle?) |
| 45–55 | **The hard one**: the page's hardest objection, discussed as a group | the essay's section on it, ported | A 1-page "what we say / what we don't claim" brief |
| 55–65 | **Where it stops**: what the argument does and doesn't prove, and how it links to the gospel | the essay's own honest-scope paragraph | 2 discussion questions |
| 65–75 | **Pray and send**: one person to pray for; this week's homework (the mastery page + `/today`) | — | Prayer prompt; homework link / QR code |

**Deliverables per session:** a 3–5-minute leader briefing (read it, then pass Explain It Back yourself);
a leader guide with **an answer key for every discussion question** (web + print PDF), a slide deck, a one-page participant
handout (the argument, three lengths, the objections, QR to the mastery page), and a **Present mode** of
the mastery page (large type, drills revealed step by step, no personal progress shown).

### 5.3 Packaged series (a scope and sequence in teaching order, not alphabetical)

| Series | Sessions | Built from | Notes |
|---|---|---|---|
| **Foundations: Why believe?** | 6 | kalam, finetuning, moral, minimal, emptytomb, manuscript | Flagship: the one a church runs first |
| **The Resurrection** | 6 | minimal, earlycreed, emptytomb, appearances, disciplesbelief, paul | Easter / Lent timing (links to the 40-Day Challenge) |
| **Who is Jesus?** | 6 | hist_jesus, jesus_claims, jesus_as_god_nt, hands, phil2, humanity | ⚠ Deity tier: dual-consensus gate. Include `ev-m-humanity` so the Chalcedon gap doesn't come back in group form |
| **Can we trust the Bible?** | 6 | manuscript, earlydate, eyewitnesses, archaeology, canon, consistency | |
| **The Trinity** | 5 | shema, ot_trinity, nt_trinity, modalism, early_church_trinity | ⚠ Dual-consensus. 🔴 **No Trinity diagram, slide or handout figure, in any form** (owner ruling 2026-08-29). The slide template must enforce it |
| **Talking with friends of other faiths** | 5 | trinity_islam, trinity_jw, trinity_mormons + worldviews cards | ⚠ EXPLICIT-VERDICT + FALSE-COMMON-GROUND rules; dual-consensus. Add a facilitation note on having members of those faiths present |
| **Hard questions** | 4 | evil, + backlog topics (hell, OT violence) | ⚠ Suffering is often a **pastoral** question in a group. The leader guide must carry the crisis/pastoral note (see 5.5) |
| **One-off workshops** | 90 min / half day | any 2–4 sessions | For a church weekend or youth retreat |

### 5.4 The Leaders' Track (training the facilitator)

Five short modules, each a page with a practice step, completed before (or alongside) running the first
series:

1. **The posture:** 1 Peter 3:15, gentleness and respect, and why honest confidence beats hype (ported from
   `beginners-path.html` and the mission statement).
2. **How to run a practice-heavy session:** timing, pairing, the observer checklist, and drawing out quiet
   members.
3. **Handling a question you can't answer:** "Great question, I don't know, let's find out" → the
   select-to-ask tutor, the essay, the pastor. Leaders model intellectual honesty.
4. **When a question is really a cry for help:** recognising a pastoral moment in a group, and what to do
   (the site's existing pastoral-care rule, in facilitator form; never diagnose; refer to the pastor or a
   professional; findahelpline.com). ⚠ This module needs **pastoral sign-off** before it goes live.
5. **Staying inside the lines:** denominational neutrality in practice ("that's a question for our church's
   teaching, not this study") and the church's authority.

**Leader credential (NEW; nothing like it exists today):** complete the five modules, master the series'
arguments (using the stricter mastery rule in §7.2, item 11), and run one practice session. This would produce a
"Certified Apologia Daily Facilitator" badge. ⚠ **The site has no certificate or credential feature of any
kind.** The three-level certificate in `APOLOGETICS_CERTIFICATE_BENCHMARK.md` is a **parked strategy
document, not built** (`CLAUDE.md`, 2026-09-23 "PARKED FOR LATER"). This badge would be the site's
*first* credential and would need its own build (records, issuing, verification); it cannot "slot under"
anything existing. Be precise in wording: it certifies that someone has **completed training**, not
that they are theologically qualified.

### 5.5 Leader tools (product)

- **Group dashboard:** extend `study-groups.html` (which exists, but see §0.1: whether it works for real accounts is unverified) so a leader assigns a *series* (not just a study plan) and
  sees the group's progress **by argument** (who has explained it, who is stuck). Keep the existing
  principle: "ranked by showing up — not by being right". Show leaders participation, never public scores.
- **Present mode** on every mastery page (`?present=1`).
- **Printable pack generator:** leader guide, handout and slides, built from the same data so they cannot
  drift from the web page. Same single-source-of-truth idea as `tools/sync-nav.mjs`, and the port rule
  enforced by construction.
- **Leader AI prep assistant:** "What questions is my group likely to ask about the Kalam, and how do I
  answer them?" Use `/api/tutor` with a leader persona that is **retrieval-bounded to the certified essay
  and brief**. It is a gated system prompt, so argument + orthodoxy must run on it.
- **Church licence and roster:** one purchase for the whole church, members join with a code. This is a
  pricing/Stripe decision for the owner; it is not designed here.

---

## 6. Market benchmark — church curricula and leader training

From a read-only `apologia-product` pass on 2026-09-25. **The vendor sites were egress-blocked, so every
item comes from search-result summaries, not from the program pages.** Treat the details as leads to
confirm before anything goes into public copy. Tags: [S] = consistent across search results;
[U] = unverified or vendor claim.

| Program | Format | What the leader gets | Model / trust signal |
|---|---|---|---|
| **Alpha** [S] | ~10–11 weeks: meal + ~25–30 min video + small-group discussion | **The strongest facilitator anatomy found**: a Team Guide with 30-min *team-training* videos, a run-of-show, and leader-only discussion questions that guests never see | Separate editions for Catholic, Anglican and Protestant contexts. The closest model to our neutrality promise |
| **Christianity Explored / Discipleship Explored** [S] | 7 / 8 sessions | A Leader's Handbook with **every participant question pre-answered**, plus leader training | Good Book Company imprint. "Answers to every question" is the biggest help for a nervous volunteer |
| **Cold-Case Christianity** (Wallace, David C Cook) [S] | 8-session DVD | Facilitator's Guide + Participant's Guide | Mainstream-publisher vetting. Wallace himself tells churches to **adapt any curriculum they buy** [S] |
| **The Truth Project** (Focus on the Family) [S] | 12 video lessons / 13 weeks | Leader's Guide coordinated with a Study Guide | ⚠ Featured Ravi Zacharias: the **named-celebrity risk**, where a curriculum is damaged when a featured teacher is discredited |
| **Foundation Worldview** (kids) [S] | 25-lesson early-childhood; comparative-worldview track | Instructors' Guide with **learning objectives** + step-by-step procedure + **teach-the-teacher videos** | Built to be taught by non-expert volunteers and parents |
| **STR — Ambassador Basic / Tactics** [S; leader-guide contents U] | Audio + workbook; separate *Tactics* Study Guide for groups | Unclear from search | Public statement of faith + an "Ambassador's Creed" (a character commitment) |
| **Case for Christ / Faith** (Zondervan, Lifeway student edition) [S] | 5–6-session video studies | Study guide with "leader helps" | Evangelical-publisher default |
| **Mama Bear Apologetics** [S] | Chapter-aligned print study guide | Built-in partner/breakout prompts | Parent audience (compare `parents.html`) |
| **RightNow Media** [S; figures U] | Streaming library with an apologetics section | — | **Church licence** (reported ~$1,200–$5,000+/yr by attendance) that gives *every attendee* access. The most transferable pricing pattern |
| **Summit Ministries** [S] | Church curriculum + "Powered by Summit" custom on-site training | Trainers who design to the church's needs | Custom delivery |
| **CrossExamined Instructor Academy** [S] | 3-day selective intensive | Trains individual instructors, with no packaged church curriculum | Few, highly trained people. The wrong model for a base tier |
| **Reasonable Faith chapters / Ratio Christi** [S] | Local chapters / director-apprentice pipeline | Light structure (RF); formal staffing (RC) | Built on a named scholar (Craig) |
| **AI-native church apologetics curriculum** | — | — | **None found for 2025–26** (only AI-and-ministry conferences). An open lane, though the search wasn't exhaustive |

**What the best leader's guides share:** a leader-only layer; a pre-written answer to every discussion
question; a short *teach-the-teacher* briefing before each session; a fixed session count with a
run-of-show; logistics bundled in. §5.2 already includes most of these. **Add the other two explicitly:**
an answer key for every discussion question (ported from the essay), and a 3–5-minute leader briefing per
session (this can be the essay's "Case, Plainly" tier read aloud, or the Explain It Back grader turned on
the leader: *explain it to the tutor before you explain it to the group*).

**What makes an elder board adopt:** a public statement of faith; a trusted imprint or named reviewers; a
stated denominational fit or neutrality; preview access; and **a match against the church's own doctrinal
statement**. That last point means the §4 trust page should be easy to check line by line.

**Where Apologia Daily has white space nobody else fills:**
- Footnoted, citation-level sourcing that the leader can see.
- A public review trail and corrections log.
- **Live objection rehearsal** (Debate Arena) instead of a printed FAQ.
- **AI-graded leader self-check** before a session.
- **Correctable content**: printed curricula freeze, this doesn't.
- **No single-celebrity dependency.** Frame this to pastors as risk reduction.

**What churches reject:**
- Rigid, unmodifiable scripts. Build the sessions as modules a leader can reorder.
- Mismatches on secondary doctrine found half-way through. Surface the neutrality line up front.
- Material so academic it intimidates volunteer leaders [U as a sourced complaint]. For a footnote-heavy site
  this is **the biggest risk**. The answer the best curricula use is to **script the leader's own words**,
  not to hand over more source material.

---

## 7. Recommendations for the mastery pages (Mastery Page v2)

Ordered by teaching impact ÷ cost. **Gate cost** is noted for each, per the pipeline in `CLAUDE.md`.

### 7.1 Tier 1 — fixes (days; mostly mechanical)

1. **Replace the alphabetical numbering with real teaching orders.** Keep one canonical `tracks.json`
   (series → ordered pages) and generate the "Argument N of M", "Next:" and "more arguments" lines from it.
   That fixes 2.1–2.3 at once and makes 2.2 impossible to recur. *Gate: none (navigation), but choosing the
   order is an editorial decision for the owner.*
2. **Route study plans, `/today` and the Coach to mastery pages** (2.4, 2.5): replace the 66 bare hub links
   with deep links to the specific mastery page or essay. *Gate: link-only changes need none.*
3. **Gate `study-plans.html`** and add it to `CONTENT_PATTERNS` (2.6); fix the "even atheist historians
   accept" line by **porting** the minimal-facts essay's wording. *Gate: argument + orthodoxy (+ neutrality on
   the deity/Islam plans).*
4. ✅ **Remove the fake Reading Club banner** (2.7) and **de-index `ev-m-legacy.html`** (2.8). *Gate: none. Done on this branch 2026-09-25, not yet deployed.*
5. **Stop the mock scorer from granting mastery** (3.4): show its feedback, but require a real `/api/tutor`
   score for the checkpoint. *Engineering; `apologia-engineer` review.*

### 7.2 Tier 2 — new layers on every page (weeks; mostly ported content)

6. **Learning objectives + time estimate** at the top (3.5). 3–4 "you'll be able to…" lines, derived from
   the page's own syllogism and objections. *Gate: light (new strings, but formulaic).*
7. **"Say it three ways"**: a 30-second, 2-minute and 10-minute version (3.6). The 30-second version is
   ported from the syllogism + "in brief"; the 2-minute version from the essay's summary paragraph. *Gate:
   argument + orthodoxy. Compression is where defects appear, so this layer needs real attention; see
   `CLAUDE.md` on the pocket cards.*
8. **"Common mistakes"**: 2–4 misstatements per argument with the correct wording (3.7). For the flagship
   arguments the list already exists **verbatim** in `CLAUDE.md`'s argument-specific rules and in
   `tools/retired-claims.json` ("what to say instead"). *Gate: low. This is the most ported item on the list.*
9. **Drill every objection, graded, in a ladder** (3.2, 3.3): Common → Trickier → Hard, each answered in free
   text and scored by `/api/tutor` against the page's own reply. "Defended it" requires passing the Hard
   rung. `NUMBER_ONE_ROADMAP.md` §4.8 called this the "argument gym". *Gate: the rubrics are new content, and
   `CLAUDE.md` says the rubric strings are the highest-stakes on the page, so argument + orthodoxy, and
   neutrality on deity/Islam.*
10. **"Where it stops" question** (3.9): one graded prompt, "What does this argument *not* prove?", checked
    against the page's own honest-scope paragraph. *Gate: low (ported answer).*
11. **Mastery that must be shown again** (3.1): gold requires the Explain It Back to be passed again after
    ≥3 days (driven by the existing SM-2 queue). Show "gold, keep it fresh" rather than stripping the badge,
    keeping the retake-without-shame framing from the 09-09 roadmap. *Gate: none.*

### 7.3 Tier 3 — conversation and group (the parts that make it the best on the market)

12. **Worked conversation walkthrough** per argument (3.8): a short annotated dialogue that asks questions,
    finds the real objection, answers it and knows when to stop. Link each one to a scenario in Debate Arena.
    *Gate: full pipeline. This is new authored prose, so pilot it on 3 flagship pages first.*
13. **Present mode + group drills** (3.10). *Gate: none for the mode itself.*
14. **Leader notes panel** (collapsed by default) on each page, linking to that page's session in the
    Session Library. *Gate: as §5.*

### 7.4 One caution before any credential

Any certificate or facilitator badge makes the mastery checkpoints a **public claim**. Fix 3.1, 3.3 and 3.4
before a badge rests on them, or the credential will certify something the tool didn't measure.

---

## 8. Sequenced roadmap

| Phase | What | Gate load |
|---|---|---|
| **Now (1–2 weeks)** | Tier 1 fixes 1–5; draft the `/churches` trust page from existing certified trust copy; owner starts recruiting the pastoral reviewer panel | Low; the trust page is argument + orthodoxy |
| **Next (month 1)** | Tier 2 layers 6, 8, 10, 11 on the *Foundations* six pages; build the leader-guide/handout/slides generator; **pilot one Foundations session with a real small group** and revise | Moderate; mostly ported |
| **Then (month 2–3)** | Layers 7 and 9 (three lengths, objection ladder) across Foundations + Resurrection; Present mode; group dashboard by argument; Leaders' Track modules 1–3, 5 | Moderate to high: rubrics and compression |
| **After pastoral sign-off** | Leaders' Track module 4 (pastoral moments); *Who is Jesus?*, *Trinity*, *Other faiths* series (dual-consensus); facilitator credential; church licence (once pricing is decided) | High; dual-consensus tiers |

**First thing to do:** Tier 1 fix 1 (a real teaching order from one `tracks.json`). It is cheap, needs no
gate, and every later item (series, sessions, study-plan routing, the credential) depends on a canonical
sequence existing.

---

## 9. Owner decisions this raises

1. **Teaching order** for each series (§5.3 is a proposal).
2. **Mastery access for churches**: will the mastery pages stay Pro, and is there a church licence? This
   folds into the existing pricing/Stripe decision.
3. **Reviewer panel**: who, and from which traditions.
4. **Minors**: whether youth groups (under-16s) may use accounts, and on what terms.
5. **Credential wording**: what the facilitator badge certifies and what it disclaims.

## 10. Not verified here

- No live user testing and no PostHog data were reviewed. Whether learners actually finish mastery pages is
  unknown and should be measured before Tier 3 (the funnel events are listed in `docs/FUNNEL_EVENTS.md`).
- Whether Study Groups is live for real accounts was not tested; the "being switched on" notice is
  conditional (`study-groups.html:697`), and the owner reports the migrations ran on 2026-09-08.
- The drill-3 observation (3.2) was checked on `ev-m-kalam` by reading the page, and on five others by
  counting objection tags. It was not read on all 81.
