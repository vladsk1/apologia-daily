# Session handoff — 2026-07-06 (compact)

_Read this + `CLAUDE.md` + `HANDOFF.md` to resume. Everything below is already deployed to
`main`. This session ran on branch `claude/short-form-reels-generator-tjpymt`; deploy rule
unchanged: work on a feature branch, **never `git checkout main`**, deploy by
`git push origin <branch>:main`._

## The immediate next task (what to do first)

**Build AI-avatar ("talking person") teaching Shorts from the Evidence Library.** The user
wants a synthetic presenter narrating apologetics content for TikTok/Reels/Shorts.

Recommended path: **HeyGen (avatar + voice) → Canva (brand layer + trending sound) → MP4 9:16
→ native upload.** HeyGen has an official app inside Canva. Alternatives: Captions app,
Synthesia, D-ID.

**The job to help with = produce gated, avatar-ready scripts** (the tool is not the
bottleneck; trustworthy scripts are). For each topic deliver:
- a tight ~120–160-word presenter script (paste into HeyGen),
- on-screen caption keywords (gold highlight on payload word),
- a visual cue per line.
Draft **only** from a certified `library/*.html` essay or `/answers/*` page, then run the
**argument + orthodoxy gates** before delivering. NEVER let Canva/HeyGen AI *write* the
apologetics (it fabricates claims/quotes — proven this session). Always proofread the voice
export aloud (AI mangles "Kalam", "Cephas", scripture refs).

**Two cautions the user must weigh:** (1) accuracy — script from gated content only; (2)
authenticity — a fake human teaching faith can read as inauthentic; safest to use the AI
avatar for **evidence/history topics** (manuscripts, fine-tuning, gospel dating, empty tomb)
and keep pastoral/gospel-invitation content in a real human voice; consider an "AI-narrated"
disclosure.

First topics to script (user to confirm): fine-tuning, the empty tomb, gospel dating, who
Jesus claimed to be. Await the user's topic list, then produce scripts through the gates.

Note: this environment blocks downloading Canva exports (proxy 403), so avatar-video assembly
happens on the user's **local machine**; from here we produce scripts/specs only. The existing
local reel engine (`tools/reel/gen_reel.py` + `make-reel` skill) makes brand-perfect captioned
MP4s but has NO AI voice/avatar — the hybrid is: local tool for the gated captioned reel, Canva
for the AI voiceover + Magic Media background + avatar.

## What shipped this session (all live on `main`)

- **New Jesus-tab argument — OT typology (not prophecy):** `library/typology.html` (deep-dive,
  ~2,300w, orthonote clarifier on Melchizedek), `ev-s3.html` card 16 "Christ in All the
  Scriptures", `ev-m-typology.html` mastery page, wired into `library/index.html` + sitemap.
  Full pipeline CLEAN.
- **Reels (20 total):** added 3 typology angles + early-creed resurrection reel
  (`tools/reel/specs/*.json`), all gated + `reviewed`-stamped. Reel 1's Joseph scene was
  swapped to the bronze serpent (Num 21/John 3:14) per user.
- **Games — audited & fixed ALL of them** (user found repetition + tells + fabricated content):
  - `who-said-it.html`: 12→30 verified quotes, killed the "Lewis-is-always-right" tell (Lewis
    now a distractor 8×), least-seen sampling, option shuffle. Removed fabricated quotes.
  - `daily-quiz.html`: 30→90 questions (30/difficulty), seeded no-repeat rotation cycle.
  - `objection-catcher.html`: correct answer was the longest option in 10/10 (rebuilt all 30
    distractors as plausible failure-modes; 10→15 entries); `argument-or-fallacy.html`:
    rebalanced 16:8→16:14 + least-seen sampling; `speed-round.html`: fixed content errors
    (Pruss/Parfit/Dunn/Agapius/Crossan) + 13 length-tells.
  - Collateral fix: the Ehrman "certainly existed…" quote was misattributed to *Did Jesus
    Exist?* in certified content (`ev-s3.html`, `library/hist_jesus.html`) — corrected to
    *Forged* (2011) p.285.
- **Answers flywheel: 56→66 pages.** New SEO batch grounded in certified essays (Jesus outside
  the Bible, gospel dating, empty tomb, evidence Jesus is God, Christianity vs other religions,
  Dead Sea Scrolls, Aquinas's Five Ways, why resurrection accounts differ, Son of God,
  water/ice/steam Trinity w/ filioque clarifier). All gated CLEAN via `tools/gen-answers.mjs`.
- **Memory Palace overhaul** (`palace.html`): persistent 3-step "how it works", numbered
  in-stage flow, guided recall→finish flow, and **replaced all emoji with bespoke drawn SVG
  scenes for 30 rooms** + per-wing backdrops. Raster-upgrade path ready: `USE_ROOM_IMAGES`
  flag + `/palace-art/<key>.jpg` slot + 30 prompts in `docs/PALACE_ART_PROMPTS.md`.
- **Strategy docs created:** `docs/GROWTH_1000_PAID.md` (funnel math + 4 phases to 1,000
  paid), `docs/CREATOR_OUTREACH.md` (sourced 1k–50k apologetics creators + DM/comment
  strategy; GodLogic assessed = too big/combative), `docs/GAME_IDEAS.md` (Crossroads / Other
  Chair / Teach Timothy / Case Files / calibration — parked for later).

## Standing rules / guardrails (carry forward)

- **Mandatory content pipeline** for ALL written/AI content: draft → citations → argument →
  editor → footnote integrity → **orthodoxy gate (must be CLEAN)** → deploy. Answers + reels +
  card content included. `tools/gen-answers.mjs` refuses to build an unstamped answer;
  `tools/check-content-review.mjs` gates essays/fragments/reels; CI enforces it.
- **Orthodoxy outranks charity** (hard tiebreak); concede the observation, never the inference;
  pull-quote test. Nicene orthodoxy; denominational neutrality; 1 Peter 3:15 tone.
  Argument-specific rules (Kalam "begins to exist"; manuscripts=preservation-not-truth;
  fine-tuning data-conceded-design-inferred; resurrection lead with 1 Cor 15 creed; etc.).
- **Monetization is a STUB — do not run paid acquisition into it.** `isPro` hardcoded true,
  Stripe not live, Pro card = "Coming soon". Growth plan Phase 0 = turn payments on (human
  sign-off + keys required; never wire prices/payments without it).
- Deploy: `git push origin claude/short-form-reels-generator-tjpymt:main`. Latest state incl.
  palace art + this handoff.
- Open items: RESEND_API_KEY unset (answer-question emails); PostHog under-instrumented;
  human/pastoral sign-off pending on Trinity/Islam "Case, Plainly" tier; native MK/ES review.
