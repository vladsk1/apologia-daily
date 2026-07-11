# Session handoff — 2026-07-11 (WEB session)

_Read this + `CLAUDE.md` + `docs/SESSION_HANDOFF_2026-07-09.md` to resume. Everything below is
**deployed to `main`** (work on a feature branch, **never `git checkout main`**, deploy by
`git push origin <branch>:main`). At handoff, this branch == `origin/main`, tree clean — a plain
`git pull origin main` in any other session gets everything._

## ⚠️ READ FIRST — scope & what NOT to re-do
- **Del Rosario demo → local session owns it.** Source of truth: `docs/DEL_ROSARIO_READING_CLUB.md`.
  Nothing this session touched it. Do not re-open/re-summarise/"resume from the book."
- **`main` also carries LOCAL-session work not done here (do not claim or redo it):** the **God's
  Existence (`ev-s1`) + Science & Faith (`ev-s5`) card-tier rechecks** (commits `bed086b`,
  `841faa3`), a **Reels batch** (`b695f81`: all-religions, did-jesus-exist, science-disprove-god,
  suffering), **`tools/reel/gen_card.py` + answer quote-cards** (`50f4841`), the **"Air We Breathe"
  reel** (`2ca923d`, `adc7501`), and a **Study Plans** overhaul (`d1e83cb`). See those commits.
  **Consequence: all six argument tabs (`ev-s1`–`ev-s6`) are now four-agent-rechecked; only
  Conversion Stories (`ev-s7`) is unswept, and that was intentionally skipped.** (The `CLAUDE.md`
  pointer's older "only ev-s1/ev-s5 remain" line is now stale — corrected there.)

## What THIS web session shipped (live on `main`)

### 1. Evidence Library rechecks — Resurrection (`ev-s2`) + Biblical Reliability (`ev-s4`)
Full four-agent pass (citations + argument + neutrality + orthodoxy) benchmarked to the audited
essays. Both final orthodoxy gates **CLEAN** (ev-s2 8/8 cards; ev-s4 11/11 + intro; 0 heresy/drift).
Detail in `docs/SESSION_HANDOFF_2026-07-09.md` §1. Both fragments newly `content-review`-stamped.
Key fixes: de-quoted paraphrase-as-verbatim scholar quotes (Licona, 2× Brown, 2× Meier, Dunn);
corrected the Meier-brackets-resurrection misattribution; imported the Crossan/Ehrman "no honourable
tomb" objection + reply (Card 02 BREAK); added Dale Allison as hallucination critic; reduced the
uncertified Shroud section to a neutral note; fixed the false Cyrus/Deutero-Isaiah dating claim;
added the honest Tyre caveat (Ezek 29:18); scoped the DSS point to dating-not-identity; reconciled
the discredited Caesar/Plato manuscript counts (daily-args 10/7 → ~250/~210). Two optional
`orthonote` clarifier candidates deferred to human/pastoral (ev-s2 Card 08, ev-s4 Card 07).

### 2. Philippians 2 "deity of Christ" reels — 2 gated specs
- **`tools/reel/specs/phil2-deity.json`** — "four hidden Greek words" cut (morphē, harpagmos,
  ekenōsen, Kyrios). **User hand-edited this spec (hook + Kyrios scene) — that edit is intentional,
  keep it.**
- **`tools/reel/specs/phil2-everyknee.json`** — user's preferred **Isaiah-45-centered recut** ("every
  knee shall bow" applied to Jesus), slower (~67s). The "name above every name" scene routes
  confidence through the **uncontested facts** (Jesus is confessed *Kyrios*; *Kyrios* is the LXX word
  for YHWH) rather than the hedged "almost certainly the divine name" — both gates rated the change
  an improvement. Both gated CLEAN/SOUND.

### 3. Gospel-names (onomastic) reel — `tools/reel/specs/gospel-names.json`
From the citation-audited `library/names.html`: the Palestinian-names "fingerprint" (Tal Ilan's
~3,000-person lexicon; Simon & Joseph the top two in both Palestine and the Gospels/Acts, 15.6% vs
18.2%; selective disambiguation of over-common names). ~52s. Gated **orthodoxy CLEAN, argument SOUND
(0 BREAK, 0 citation errors)**; applied the WEAK fix (hook "no forger could fake" → "nearly
impossible to fake", matching the essay's Tuckett concession) + stat-precision polish. Keeps the
**provenance-not-proof** limit. Also produced (chat-only, not committed): an 8-tweet **X thread** and
TikTok/IG captions for the names argument.

### 4. Measurement + learning wiring (two Phase-0/Phase-1 fixes)
- **`analytics.js`/`signup.html`: `signup_completed` event** (`3da4499`) — fires on real Supabase
  account creation (props `{referred, confirmed}`), guarded so it can't break signup. Was the missing
  funnel denominator; signup.html is the only account-creation path (no OAuth).
- **`today.html`: Coach → `/today` adaptivity** (`81bee7d`) — the daily Learn step now targets the
  user's weakest argument via `Coach.prescription()` (for signed-in users with ≥2 args / ≥3 signals,
  weakest < 85% mastery, and a matching daily-args entry), with a gold "Coach pick" label +
  `today_coach_pick` event. Fully guarded → new/anon/strong users get the old fixed rotation. Verified
  against real `daily-args.json` (ids are 1:1 with `ev-m` slugs).

### 5. Footer About-link fix — `index.html`
Footer "About" pointed at a dead `index.html#about` anchor → repointed to `about.html` (`d0d63d5`).

### 6. Strategy roadmap (report-only, chat — capture below so it survives)
Ran three specialist agents (SEO, growth/business, product/learning). Consolidated **priority
sequence**:
- **Phase 0 (safety + measurement, before any traffic):** ✅ Search Console connected (user);
  ✅ `signup_completed` shipped; ⏳ **run the `ask_rate_limit` Supabase migration + verify the 429**
  (`api/ask.js` `DAILY_IP_CAP=40` is currently *dead / fail-open* — an open, two-call LLM endpoint =
  real cost risk before a reel goes viral). SQL is in `docs/ASKED_AND_ANSWERED_SPEC.md`; **human step.**
- **Phase 1 (scripted, high-ROI):** canonical the **63 `ev-m-*.html` mastery pages → essays** (they
  have no canonical/meta/schema and *cannibalize* the essays — likely suppressing rankings now);
  repoint the **hero CTA** (`index.html:884`) off dead `#pricing` → the free AI tool; refresh stale
  **`sitemap.xml` `<lastmod>`** dates; de-dupe QAPage vs FAQPage on answer pages.
- **Phase 2 (authority/visibility):** build **7 "pillar" hub pages** (one per Evidence Library tab —
  the library is one JS-tabbed page today, no crawlable per-tab URLs); finish **essay→answer reverse
  links** (only ~20/79 essays link to answers; answer→sibling + answer→essay are already done for all
  74); build a visible **Skill Map** rendering `Coach.profile()`.
- **Phase 3 (flywheel, only after cost is capped):** add **TTS to reels** → batch-produce from all
  ~66 answers → post native to TikTok/Reels/Shorts/FB; embed reels on answer pages (VideoObject).
- **Phase 4 (monetize, every step human-signed-off):** freemium Pro (gate *tools/depth*, never
  *answers-for-seekers*) + always-open donation; stand up donation first; wire real `isPro`/Stripe in
  staging only. **Never wire real prices/payments without sign-off.**

## Open / owed (carry forward)
- **`ask_rate_limit` SQL not yet run** (user; `docs/ASKED_AND_ANSWERED_SPEC.md`) — do before any push.
- **`RESEND_API_KEY`** unset in Vercel (captured questions don't email).
- **Monetization stub** — `isPro` hardcoded, Stripe not live; decide model, don't run paid acquisition
  into it, never wire prices/payments without human sign-off.
- **Human/pastoral + scholarly sign-off** on high-stakes Christology (Trinity/Islam/deity), incl. the
  2 deferred `orthonote` candidates (ev-s2 Card 08, ev-s4 Card 07) and the Phil 2 reels.
- **Native MK/ES doctrinal review** of the pilots.
- **Conversion Stories (`ev-s7`)** card tier intentionally unswept.
- Candidate next: Phase 1 SEO cleanup (mastery canonicals, hero CTA, sitemap); 7 pillar pages;
  reel TTS; extend pilots.

## Standing rules (see `CLAUDE.md`)
- Mandatory pipeline for ALL written/AI content incl. reels + answers + api prompts: draft →
  citations → argument → editor → footnote integrity → **orthodoxy gate (CLEAN)** → deploy.
- "Orthodoxy outranks charity" (concede the observation, not the inference; pull-quote test); Nicene
  orthodoxy; denominational neutrality; 1 Peter 3:15; charity is accuracy; no fabrication (the
  recurring real defect remains **paraphrases dressed as verbatim scholar quotes** — hunt them).
- Content-gate stamp required on changed `library/*.html`, `ev-s*.html`, `worldviews.html`, reel
  specs, `api/ask.js`. Never stamp a check you didn't run.
- Reel MP4s are **git-ignored** (`tools/reel/output/`) — only specs are committed; regenerate with
  `cd tools/reel && python3 gen_reel.py specs/<name>.json --theme navy` (also `parchment`).
- Deploy: `git push origin claude/short-form-reels-generator-tjpymt:main`.
