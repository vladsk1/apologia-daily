# Apologia Daily — project guide

> **Resuming / new session?** Every chat auto-loads this file, so the live status lives
> here. All work is deployed to `main`, so a new session on **any** branch already has it
> (web sessions get different branch suffixes — that's fine). Full detail: `HANDOFF.md`
> (repo root; committed but not web-served). Deploy rule unchanged: push your working
> branch to `main`, never `git checkout main`.
>
> **2026-07-15 (orthodoxy-assurance hardening + Waves 1–3 answers + DNA reel).** Built a
> defense-in-depth layer so faithfulness to Nicene orthodoxy is enforced by *process*, not just
> intent. **NEW canonical anchor: [`docs/STATEMENT_OF_FAITH.md`](docs/STATEMENT_OF_FAITH.md)** — the
> Nicene (Schaff 381) + Apostles' (BCP 1662) creeds VERBATIM from verified `sources/creeds.json`, the
> non-negotiables, a rejected-heresies list, neutrality, and a pastoral sign-off log; the whole agent
> fleet + `api/ask.js` now reference it. **New guards (all live + wired into CI):** whole-corpus
> `tools/check-orthodoxy-tripwires.mjs` (baseline allowlist; blocks NEW heterodox phrasings) +
> `tools/check-stamp-integrity.mjs` (flags gated files edited after their stamp; nav/boilerplate
> filtered) + a scheduled `.github/workflows/monthly-orthodoxy-audit.yml`. **Process changes in this
> file:** clarifier-consideration is now a MANDATORY standing sub-step of the orthodoxy gate (always
> returns a "Clarifier candidates" verdict, even "none"); **dual-consensus** (orthodoxy AND neutrality
> both CLEAN) required for highest-stakes pages; a **"mission" check** ("strengthen believers'
> confidence — but confidence EARNED by truth, never hype") added to CLAUDE.md and **every** agent;
> `apologia-neutrality` gained a **6th failure mode** (over-concession / unearned symmetry to a rival
> worldview). **`api/ask.js`** got a runtime FINAL SELF-CHECK (re-audits its own answer vs the
> non-negotiables) — re-gated CLEAN. **`what-we-believe.html`** creeds: first swapped a mislabeled ELLC
> creed to verified PD, then — per owner decision — set BOTH creeds to the **ELLC-1988 modern-English
> texts WITH acknowledgment** (filioque bracketed neutrally); "report a doctrinal concern" link added;
> footer-linked site-wide. **Open human to-dos on it:** confirm ELLC permits the commercial use w/
> acknowledgment, and verify the ELLC **Nicene** wording byte-exact vs the official text (reconstructed).
> **Content: Waves 1–3 = 36 new `/answers/` pages (74→110)** grounded in
> certified essays, each argument+orthodoxy gated; and a **DNA-complexity reel** (added an optional
> `bg_image` backdrop feature to `tools/reel/gen_reel.py`). **OPEN (need a human):** (1) recruit a
> standing **pastoral/elder reviewer** — sign-off log in the Statement of Faith is _pending_; (2) the
> **monthly agent-sweep Routine** (#5's agent half) was NOT created — `create_trigger` hit a
> permission error; retry it. Also: a **Reasonable Faith** (Craig) book-research note is awaiting a
> **print/Kindle** copy (Perlego is forbidden — do not extract from it).
>
> **2026-07-12 (search + Logos assessment + PD source library — handoff:
> `docs/SESSION_HANDOFF_2026-07-12-search-and-sources.md`).** Shipped **site-wide search**
> (`/search` + `search.html` + `tools/build-search-index.mjs` → `search-index.json`; 221 records
> across essays/answers/glossary; "🔍 Search" added to the canonical nav on 180 pages). Did a
> **Logos Bible Software** competitive assessment (quick wins: #1 search ✅ DONE; #2 cite-button +
> "Reviewed" byline; #3 Factbook entity hubs — both NOT built). Built a **public-domain source
> library** (`/sources` + `sources/README.md` + `tools/build-sources-index.mjs` →
> `sources-index.json`): a searchable corpus of PD primary texts (creeds + Church Fathers) the
> content agents quote+cite when drafting. **Rules: PD work AND PD translation only; never store
> copyrighted books (owned books = research pointing to primaries, in our own words); nothing
> quotable until `verified:true` (apologia-citations confirms vs source).** A citations pass
> **caught 2 real defects** (Apostles' Creed was copyrighted ELLC-1988 mislabeled PD → fixed to PD
> BCP 1662; a Smyrnaeans quote was a spliced composite → fixed) and **verified 4 Ignatius
> passages**; **6 pending** (creeds + Athanasius §54) because the clean hosts (CCEL/ANF/Wikisource)
> are **network-blocked in the web sandbox**. **NEXT: a local/web-enabled session verifies the 6
> against clean primaries + expands the library** (steps in the handoff). Also still open: run
> `docs/STUDY_GROUPS_DISPLAY_NAME_FIX.md` (M4) in Supabase.
>
> **2026-07-12 (security hardening pass — handoff: `docs/SESSION_HANDOFF_2026-07-12-security.md`).**
> Full security audit (two adversarial agents over `api/*.js` + client/RLS/config) then **fixed every
> finding, Critical→Medium; all deployed to `main`.** Highlights: **Study Groups RLS takeover** closed
> (`gm_insert` only checked `user_id`; any user could self-assign `host` — now creator-only host + public-only
> member join; `docs/STUDY_GROUPS_RLS_FIX.md`, **RUN**); **published cron secret** removed from `vercel.json`
> + hardcoded fallbacks in `weekly-email.js`/`push.js` (now require `CRON_SECRET`, fail closed — **SET in
> Vercel + verified**); **`/api/logs`** locked behind a secret; **rate limiting** on every Claude endpoint via
> shared `lib/ratelimit.js` (per-IP/day counter, degrades to in-memory, never fails open; migration
> `docs/ASK_RATE_LIMIT.md`, **RUN**) + **413 input-size caps**; **push SSRF** allowlist; **open redirect**
> (`?next=//evil.com`) closed; **CDN SRI** pinned on all non-gated pages (supabase-js `@2.110.2`, canary-
> verified; ~103 gated essays deferred to next content review); **security headers + CSP** added to
> `vercel.json`; **email HTML-injection** + **error-body leaks** fixed; **PostHog no longer gets user email**
> (`analytics.js` id-only). **ONE human step left: run `docs/STUDY_GROUPS_DISPLAY_NAME_FIX.md`** (M4 anti-spoof
> trigger) in Supabase. Open: browser-verify the CSP; SRI the gated essays later; optional strip email from
> `new-signup.js` PostHog event. Rate limit is IP-based (not distributed-attack proof).
>
> **2026-07-11 (web session — Groups / UX / SEO / Coach — handoff:
> `docs/SESSION_HANDOFF_2026-07-11-groups-ux.md`).** Product/UX, not doctrine. **Study Groups is now a
> real feature** (Supabase migration RAN by the user; `docs/STUDY_GROUPS_SPEC.md`): reframed for everyone,
> realtime chat, team pulse, working invite/join (`join.html` + `?next=` on login/signup), group result
> share-card. **Email + fall-behind nudges are LIVE** — `RESEND_API_KEY` is confirmed set (the long-standing
> "unset" open item is RESOLVED); nudges fold into `api/weekly-email.js` (`?do=group-nudge`, plus a no-send
> `?do=status` diagnostic). **Games unified** (`games-common.js` = one `ad_streak` + Coach + universal share
> card; cut Argument-or-Fallacy; Memory Palace folded into the ev-m mastery track and removed from nav).
> **Plans ↔ Groups** are one loop ("Study this with a group", group "do today's day" + host day controls,
> plan-day pings `group_activity`). **SEO**: crawlable static index on `evidence-library.html`, `ev-m` →
> essay canonicals (67), per-card deep links (`?arg=<slug>` + `id="arg-*"` anchors), sitemap lastmod
> regenerator (`tools/update-sitemap-lastmod.mjs`), study-plan reading-popup title-drift fix. **Nav is now a
> build step**: `tools/sync-nav.mjs` (single-source menu, CI `--check`, gated pages excluded) + a **rich
> "More" mega-menu LIVE on 179 non-gated pages** (mobile-aware; gated pages keep the simple dropdown — NOT
> browser-tested, verify). **Coach Skill Map**: `Coach.renderSkillMap()` on `coach.html` (all 63 arguments as
> a mastery-coloured grid) + `renderSkillStrip()` on the dashboard + Coach added to the nav mega. Top open
> items: bring the mega to the gated pages via a stamp pass; browser-verify the mega desktop+mobile.
>
> **2026-07-11 (Trinity "world-class" session — handoff: `docs/SESSION_HANDOFF_2026-07-11-trinity.md`).**
> Rebuilt the **Trinity tab (`ev-s6`) from 10 cards to 15**, plus a guided-pathway intro box and a new
> interactive **"Name the Heresy"** diagnostic (`name-the-heresy.html`, in `games.html`). Five new gated
> cards: **04 The Deity of the Son** (bridge → gated `jesus_as_god_nt`), **05 The Deity and Personhood of the
> Holy Spirit** (new essay `library/holy_spirit.html` + mastery), **08 Why Every Trinity Analogy Fails** (new
> essay `library/analogies.html` + mastery), **09 Did the Church Invent the Trinity?** (bridge → the
> `early_church_trinity` essay, which gained a gated "Was It Borrowed from Paganism?" section), and **15 What
> Distinguishes the Persons?** (relations of origin / perichoresis / inseparable operations — new essay
> `library/relations.html` + mastery). Every new essay/section + card cleared citations → argument →
> orthodoxy **CLEAN (0 heresy)**; the recurring catches were paraphrase-as-quote and compression overreach
> (e.g. "perichoresis *secures*" vs *manifests* the unity). All 13 Trinity mastery pages now read "N of 13"
> (also fixed pre-existing stale dial-counter drift). **Top open item: human/pastoral sign-off on this new
> Christology is still owed** (automated gate CLEAN, but every stamp says so).
>
> **2026-07-11 (web session) — latest handoff: `docs/SESSION_HANDOFF_2026-07-11.md`.** Shipped this
> session: the **Philippians 2 deity reels** (`phil2-deity` + Isaiah-recut `phil2-everyknee`) and the
> **Gospel-names onomastic reel** (`gospel-names`), all gated CLEAN/SOUND; the **`signup_completed`**
> analytics event; **Coach → `/today` adaptivity** (daily Learn step now targets the user's weakest
> argument); the footer **About-link** fix; and a three-agent **growth/SEO/learning strategy roadmap**
> (captured in the 07-11 handoff). **Tab-recheck status is now: all six argument card tiers
> `ev-s1`–`ev-s6` are four-agent-swept** (God's Existence + Science & Faith were finished by the LOCAL
> session on `main`, commits `bed086b`/`841faa3`); only Conversion Stories (`ev-s7`) is intentionally
> unswept. **Top open item: the `ask_rate_limit` Supabase migration is still un-run (human step) — do
> it before any traffic/reels push.**
>
> **2026-07-09 (web session) — handoff: `docs/SESSION_HANDOFF_2026-07-09.md`.** Shipped:
> a full four-agent recheck (citations + argument + **new `apologia-neutrality`** red-team + orthodoxy)
> of **five** card tiers — **Trinity, Jesus, Islam, Resurrection (`ev-s2`), and Biblical Reliability
> (`ev-s4`)** — all CLEAN, 0 heresy; the real defect everywhere was
> *paraphrases dressed as verbatim scholar quotes* + overstatement in the compressed cards (fixed;
> the Resurrection/Bible-Reliability pass also fixed one empty-tomb argument BREAK, the Meier-brackets-
> resurrection misattribution, a false Cyrus/Deutero-Isaiah dating claim, the Tyre overstatement, and
> reconciled discredited Caesar/Plato manuscript counts). (`ev-s1`/`ev-s5` were later swept by the
> LOCAL session — see the 2026-07-11 note above; only `ev-s7` Conversion Stories remains, intentionally.)
> Plus a Trinity-essay
> clarifier sweep, Asked & Answered follow-up questions, `parents.html` upgrades, the site-wide
> "Ask Anything → Asked & Answered" rename, MK/ES index nav, and a creed-dating audit (no change needed —
> our voice already says "~2–5 years"; "within months" is always attributed to Dunn). **Del Rosario demo
> is NOT part of this web session — it was built straight from the book in a separate LOCAL session and is
> current on `main`; its live status is `docs/DEL_ROSARIO_READING_CLUB.md`. Do not re-open, re-summarise, or
> treat it as paused.**
>
> **2026-07-04 — NEW POLICY (read the guardrails below):** **"Orthodoxy outranks charity"**
> is now a hard tiebreak in every place content is written/checked — `api/ask.js` (the live
> AI), the guardrails below, and the `apologia-orthodoxy` + `apologia-argument` agents.
> Concede only accurate facts + sincerity; **never** the opponent's frame, a mistaken
> inference's soundness, or an unearned symmetry (concede the *observation*, not the
> *inference*). Pull-quote test: if a concession, screenshotted alone, could read as
> dignifying heterodoxy, rewrite it — err toward the stronger, clearer orthodox statement.
> This came from finding real **over-concession** on the JW/Mormon/Islam **answer** pages
> (e.g. "real biblical reasoning," "the parallels are real," "same God"). ALL 56 `/answers/`
> were swept (argument + orthodoxy) and fixed; the offenders are corrected + live. **The
> answers layer is NOT a lighter tier** — `answers/_data.json` now carries a structured
> `reviewed: {argument, orthodoxy, by}` and **`tools/gen-answers.mjs` refuses to build a new
> answer unless both gate-dates are stamped.** Same pipeline as essays. Also found + fixed
> **visible↔`_data.json`↔JSON-LD drift**: each answer lives in 3 copies that must agree, and 6
> Bible-reliability pages had live text hand-edited without updating the other two (so the gate
> certified a stale copy). All 6 reconciled + re-gated (orthodoxy CLEAN, 2 WEAK argument flags
> fixed: honest Synoptic dependence in `contradictions`, false "Pilate was doubted" removed from
> `archaeology`), and **`gen-answers.mjs` now runs a drift audit every run** so it can't recur.
> Detail: `HANDOFF.md`.
>
> **2026-07-04:** in-house short-form **reel generator** (`tools/reel/gen_reel.py` + the
> **`make-reel`** skill) — brand-styled vertical MP4s from `/answers/` pages via Pillow +
> bundled ffmpeg, no Canva/network/TTS (silent + captioned; 9 specs); **pricing integrity
> fix** (Pro card → "Coming soon"; Stripe still not live); **accuracy fix** (Sean McDowell is
> a *Christian apologist*, not a historian — corrected across the answer page, `_data.json`,
> and `library/postres.html` + `disciplesbelief.html`); Bible Chat growth teardown. Full
> detail for all four in `HANDOFF.md` (2026-07-04 session section).
>
> **Live on `main` (recent work):** dashboard "Due today" SR hook; intent-capture
> onboarding; Debate Arena voice mode; "Related arguments" panel on essays; "send this
> answer to a skeptic" referral; "Was Jesus a Muslim?" card + essay; the **Answers
> flywheel** (`api/submit-question.js` + `tools/gen-answers.mjs` + `answers/_data.json`);
> the **Macedonian pilot** (`library/mk/*` — 10 essays + index) and the **bilingual
> Evidence Library hub** (EN/МК toggle in `evidence-library.html` + `ev-sN.mk.html`); the
> **Spanish pilot** (`library/es/*` — 10 essays + index, tri-lingual EN/МК/ES switchers +
> hreflang + sitemap, all 10 orthodoxy-gated CLEAN); the **`/today` daily loop**
> (`today.html` + `/today` rewrite in `vercel.json` + dashboard practice-row card — a 5-min
> composed session: due-card review reusing the flashcards SM-2 maths → day's argument from
> `daily_arguments` → **`daily-args.json` (63 orthodoxy-gated entries covering all 6 tabs,
> also the push-teaser rotation; the old standalone `daily-argument.html` is RETIRED —
> deleted, 301 → `/today`, all links repointed)** → built-in fallbacks,
> w/ TTS listen → active-recall self-rate feeding
> `Coach.recordQuiz` + auto-seeding a flashcard on a miss → `ad_streak` mark +
> `ad_today_done` belt point; Sat=Arena/Sun=devotional bonus cards; orthodoxy-gated CLEAN);
> the **"The Case, Plainly" tier** — a
> warm, plain-English, positive-case walkthrough (~850–950 words) inlined as the FIRST paid
> block in each argument card (under the Upgrade gate, before the deep dive), live across 7
> tabs / **77 arguments, all orthodoxy-gated CLEAN**: Jesus (`ev-s3`, 15), Resurrection
> (`ev-s2`, 8), Biblical Reliability (`ev-s4`, 11), Trinity (`ev-s6`, 10 at this rollout &mdash; now **15**, see the 2026-07-11 Trinity session note above), God's Existence
> (`ev-s1`, 12), Science & Faith (`ev-s5`, 7), and Islam in Worldviews (`worldviews.html`,
> 14 — incl. the new **"Contradictions in the Qur'an" card 07 + `library/islam-contradictions.html`**,
> full pipeline run 2026-07-02: author → citations [0 blockers] → argument [blockers fixed] →
> orthodoxy CLEAN). **How it's built** (repeatable): a drafter (`apologia-evidence`, grounded in each
> already-certified essay) writes body prose as `<p class="psl">`/`<p class="pt">` lines to
> a scratch file; a per-tab build script wraps it in a second `.pro` block (or `.wv-pro` for
> worldviews — psl→`wv-pro-section-label`, pt→`wv-pro-text`) and splices it in *before* the
> deep-dive `.pro`, anchored on that argument's unique `.prot`/`.wv-pro-subtitle` tagline
> (worldviews build is scoped to the Islam section only, 0 leakage); then a batched
> `apologia-orthodoxy` gate on every article before deploy. Positive case ONLY — objections
> deferred to the deep dive with one gentle closing line. Scripts + all scratch bodies are
> under the session scratchpad. NOT yet done: Conversion Stories (`ev-s7`, intentionally
> skipped) and the incomplete Worldviews pages (JW/Mormon/Atheism).
>
> **Open work:** (1) native Macedonian **and Spanish** doctrinal review of the mk/es
> essays + hub fragments (AI-translated, orthodoxy-gated, not yet human-checked; the es
> gate also flagged one non-doctrinal note — Moltmann patripassianism boundary in
> `es/evil.html`, matching the certified EN original); (2) set `RESEND_API_KEY` in Vercel so `api/submit-question.js` emails captured
> questions; (3) **monetization is a stub** — `isPro` hardcoded, Stripe not live, a dead
> "$8/mo + 7-day trial" is advertised: decide the model, don't run paid acquisition into
> it, and never wire real prices/payments without human sign-off; (4) PostHog is
> under-instrumented (full event/funnel plan in `docs/MARKETING_PLAN.md`); (5) the **"The
> Case, Plainly" tier** passed the automated `apologia-orthodoxy` gate on all 76 articles
> but still needs eventual **human/pastoral sign-off** before high-stakes acquisition — most
> relevant on the Trinity and Islam tabs; the gates left a short list of non-blocking notes
> for that pass (e.g. the Surah 10:94 "doubt" reading on the islam-dilemma Case; a couple of
> Islamic-studies attributions on islam-eternalword). Candidate next
> steps: roll the Case tier across Conversion Stories / the remaining Worldviews once those
> pages are complete; extend the Spanish/Macedonian pilots beyond 10 essays (+ a Spanish hub
> via `ev-sN.es.html` fragments); more `/answers/` pages via the flywheel; execute the
> marketing plan.
>
> **Deep-dive essay audit — COMPLETE, all 7 tabs / ~78 essays (2026-07-03):** every
> `library/*.html` deep-dive behind all seven Evidence Library tabs got a full
> `apologia-citations` fact-check, in three waves (Bible+God's-Existence+Science = 30;
> Resurrection 11 + Jesus 12 + Trinity 10 + Islam 13 = 46; plus islam-contradictions/
> islam-jesusmuslim pipelined earlier). **Result: ZERO fabrications and ZERO doctrinal
> blockers across every essay** — the essays are the trustworthy layer; the earlier
> fabricated quotes lived only in the *card* layer (already fixed). Only minor quote/citation-
> precision fixes were applied + deployed (commits `893a1a3`, `becb070`, `49ad2aa`, `7a71004`,
> `3a4fceb`, `0ceca2a`, `027c76e`, `0a532a1`); the one substantive catch was a backwards
> probability comparison in `originlife.html` (now correct). Trinity tab held strict Nicene
> with 0 drift; `shema`/`ot_trinity` correctly REFUTE the retired echad overreach; the Islam
> tab held "charity is accuracy" throughout. MK mirrors updated where essays exist (kalam,
> evil, minimalfacts, emptytomb, paulconv). Exemplary templates to reuse: `archaeology`,
> `finetuning`, `cosmic`, `moral`, `laws`, `shema`, `phil2`, `messianic-prophecy`, `islam-naskh`.
> **Still open:** MK essay translations beyond the 5 mirrored; ~a dozen CHECK-level page-cites
> for a human-with-the-books pass; non-blocking human/pastoral sign-off items on the Trinity +
> Islam tabs (incl. the `evil.html` Moltmann line and the `islam-dilemma` 10:94 gloss). Full
> detail in `HANDOFF.md`.

Apologia Daily (apologiadaily.com) is a commercial Christian apologetics platform: a
static HTML/CSS/JS site on Vercel, with Supabase (auth/db) and Claude-powered AI
features (`/api/*.js`). The **Evidence Library** (`/library/*.html`) is the heart of the
site: long-form, fully-cited deep-dive essays.

## MANDATORY content pipeline (ALL written content, no exceptions)

Every piece of written content **must** pass through this pipeline, in order. Do not
deploy content that has skipped a stage. **This explicitly includes: deep-dive essays,
Evidence Library fragments, `/answers/*` pages (the flywheel), short-form reel scripts
(`tools/reel/specs/*`), and the live AI system prompts (`api/ask.js`, `api/*.js`).** The
"answers" layer is NOT a lighter tier — the over-concession defects found on the JW/deity
answer pages (2026-07-04) reached production precisely because the answers were treated as
lower-stakes and shipped without the gate. There is no such thing as content too small to
gate. At minimum, argument-soundness (step 4) + orthodoxy (step 7) run on **every** answer
and reel before it goes live; record it (see the `reviewed` provenance in
`answers/_data.json`, enforced by `tools/gen-answers.mjs`).

**SHORT-FORM ANSWER RULE (mandatory for every `/answers/*` entry; the argument gate enforces
it, and `tools/gen-answers.mjs`'s header documents it).** A short answer's *job* is to **answer
the question** — directly, from our own convictional footing, inside the guardrails and the
mission — and then **point to the fuller study** (the linked essay) for the deep engagement. It
is **not** an essay, and it must **not** carry an essay's heavy steelman.
- **Lead with the answer.** The **first sentence must answer the question** from our own footing (a
  direct "No —" / "Yes —" / clear assertion), not open on the objection. Do **not** open by
  steelmanning, amplifying, "granting the force of," or even neutrally *restating* the objection. A
  **front-loaded opening is a defect even when every word of it is factually accurate** — the defect is
  the *placement and weight* (answering the objection before you've answered the reader), not the
  accuracy. "It's a fair question," "This is a serious/common objection," "Honestly, this is hard,"
  "Let's not soften this," "At first glance X seems true" are all front-loaded openings to rewrite.
  A front-loaded concession fails the pull-quote test and can leave a believer nearer to doubt. (This
  was the 2026-07-16 sweeps' finding: first 11 over-concession openings, then a full opening-rewrite
  pass — the earlier over-concession gate had *passed* factually-honest-but-front-loaded openings, so
  the rule is: front-loading is a defect regardless of factual accuracy.)
- **Concede the observation, never the inference.** Concede only accurate facts and the person's
  sincerity — never the opponent's frame, the soundness of a mistaken inference, or an unearned
  symmetry. Keep any acknowledgment **brief and fact-bound**.
- **Close with the "go deeper" pointer.** The full "steelman the strongest objection at length"
  work belongs in the deep-dive essay, not the short answer.
- Pastoral empathy (validating the *emotion* of a doubt or a hard question) is allowed and good;
  conceding the *intellectual* case to the skeptic is not.
- **Pastoral / crisis exception — the referral IS the answer.** A small set of questions are cries
  for help, not queries: self-harm or suicidal thoughts, abuse or danger, acute despair, "should I
  stop my medication and just pray?" For these the faithful response is **not** a confident
  apologetics answer (and not the lead-with-the-answer format) but **compassion + a referral** to a
  real person — a trusted friend, a pastor, or a professional counsellor (and a crisis line via
  findahelpline.com / local emergency services if there's any danger). Affirm the person's worth
  (made in God's image, loved by God), offer Christ as comfort and presence rather than as an
  argument, and point them toward care. **Never diagnose, never give medical or legal advice, never
  try to argue anyone out of a clinical condition.** This is the loving answer, not a refusal. It is
  live in `api/ask.js` (the PASTORAL CARE block, which takes priority over the normal format) and is
  the one place a non-answer-plus-referral is correct.

The argument + orthodoxy passes must actively hunt **over-concession**, not only
overstatement or heresy-in-our-own-voice: a steelman that grants the opponent's frame, the
soundness of a mistaken inference, or an unearned symmetry is a defect even when the body
later refutes it. See the "Orthodoxy outranks charity" guardrail below.

Every essay or substantive page added to the site **must** pass through this pipeline,
in order. Do not deploy content that has skipped a stage.

1. **Draft** — `apologia-author` (or `apologia-evidence`) writes it in the house format
   (numbered footnotes + bibliography), inside the guardrails below.
2. **Scholar-editor review** — `apologia-evidence`: scholarly accuracy, rigor, sourcing,
   completeness, steelmanning.
3. **Citation fact-check** — `apologia-citations` (read-only): every scripture/Qur'an
   reference exists and is quoted accurately; every scholar/source/date/venue is real and
   correctly attributed; no fabricated quotes or statistics.
4. **Argument-soundness review** — `apologia-argument` (read-only): logical validity,
   premise strength, fair steelmanning of the strongest objection, no overstatement,
   honest concession.
5. **Copy-edit** — `apologia-editor`: typos, grammar, tone consistency, broken markup/links.
6. **Apply fixes + verify footnote integrity** — every `<sup>N</sup>` must map to exactly
   one `<li>`; preserve that mapping across all edits.
7. **FINAL GATE — `apologia-orthodoxy`** (read-only): doctrinal certification. **This is
   always the last check before deploy.** Content is not deployed until it is certified
   CLEAN (or flags are resolved). A single [HERESY]-level flag blocks deploy.
   **Standing sub-step (every run): the gate MUST return a "Clarifier candidates" verdict —
   even when it is "none."** For every piece of content it scans for phrases that are orthodox
   but a compressed reader could misread as heterodox and gives each a disposition (add
   `orthonote` clarifier / rewrite / leave-as-is with reason). The *consideration is mandatory
   and on-record*; the *application stays selective* — never add a clarifier where the wording is
   plainly unambiguous (the ＊ works because it's rare). Non-interactive formats (reel specs,
   push/teaser copy) can't host the ＊ box, so a candidate there routes to a **wording** fix
   instead. See the `orthonote` STANDARD section below and the registry `docs/clarifiers.md`.
8. **Deploy** (see deploy workflow below).

Read-only agents (citations, argument, orthodoxy) report; a human-supervised step applies
their fixes. The orthodoxy agent is an automated gate, **not** a substitute for eventual
human/pastoral doctrinal sign-off on high-stakes content.

## EXPLICIT-VERDICT RULE — Islam and every rival-worldview refutation (mandatory; `apologia-argument` enforces it)

**Any content whose job is to answer a rival-worldview claim — every Islam card, essay, and
`/answers/*` entry (and JW / Mormon / atheism content) — MUST explicitly LAND ITS VERDICT in
our own voice.** After presenting and fairly steelmanning the claim, it must plainly state that
the Islamic (or other) position **does not hold / the answer is _no_ / the specific claim is
false** — stated, not merely set up. This is the "higher bar" the 2026-07-18 Islam sweep applied
to the cards, essays, and answers; hold **all future Islam / rival-worldview content** to it.
Two failure modes are defects even when the body is excellent:

- **Implying the verdict is NOT landing it.** "Each text keeps pointing to Christ" *implies*
  Muhammad isn't predicted but never *states* it; "the transmission looks ordinary" *implies* the
  perfect-preservation claim fails but never *says so*. The reader must not have to infer the
  conclusion. Model fix (Muhammad card): **"So the honest answer to the question is no… none of the
  passages Islam appeals to predicts Muhammad."**
- **Usage-guidance is NOT a substitute for the verdict.** A close / "Where this leaves us" /
  "an open door" section that tells the reader *how to use the argument graciously* ("you can say a
  wholehearted 'yes, let's read it'") **without first plainly stating the conclusion** is a defect.
  State the conclusion **first**, then the gracious guidance.
- **The verdict is bounded and honest, never overclaimed.** Falsify only the specific claim the
  evidence reaches ("the perfect-preservation slogan is not true"; "the crucifixion denial runs
  against the clearest evidence"). Where a claim is a *metaphysical framing* rather than a factual
  error (wahy vs. Incarnation), land the bounded verdict the evidence supports ("the objection can
  no longer simply be _presumed_") rather than overstating "false."
- Charity governs **tone** (1 Peter 3:15), never the scoreboard: "not a hostile verdict, just what
  the text says once it's allowed to finish its own sentence" is the right frame — softening into
  *no* verdict is not. (Companion to the SHORT-FORM ANSWER RULE above, which requires answers to
  *lead* with the verdict; this rule requires every falsification piece to *state* it explicitly,
  cards and essays included.)

## The mission — a check every agent applies

Apologia Daily exists to **strengthen Christians' confidence in the faith and equip them to give a
reason for the hope they have** (1 Peter 3:15), and to reach seekers honestly. So every piece of
content should *build the reader up* — leave a believer more confident and better equipped, and
never nearer to doubt. **But confidence must be EARNED by truth.** Never manufacture it with
overstatement, hype, a fabricated show of strength, or by hiding a real difficulty: that produces
*brittle* confidence that shatters the first time the reader meets a serious objection in the wild,
and it does more damage than an honestly-faced hard question ever could. Durable confidence rests on
the case being *genuinely* strong and *honestly* told. This is why honesty and confidence-building
never actually conflict here — the accurate, well-defended, non-overstated case is precisely the one
that holds a believer's faith under pressure. Each agent serves this within its own lane, and each
agent's definition states how.

## NON-NEGOTIABLE guardrails (mirror `api/ask.js`; enforced by every agent)

> **Canonical anchor: [`docs/STATEMENT_OF_FAITH.md`](docs/STATEMENT_OF_FAITH.md).** That file is
> the single source of truth for what the site believes — the Nicene and Apostles' Creeds
> (verbatim from the verified `sources/creeds.json`) plus the operational boundaries and the
> rejected-heresies list. The guardrails below are the same commitments in working form; the
> `apologia-orthodoxy` gate certifies against the Statement. **Faithfulness to Jesus Christ and
> Nicene orthodoxy outranks the platform's reach, growth, or success — every time.**

- **Classical orthodoxy** (Apostles'/Nicene Creed): full deity AND humanity of Christ;
  Trinity (one God, three co-equal co-eternal persons — never modalism, tritheism, or
  Arian/subordinationist drift); bodily resurrection; authority of Scripture; salvation
  through Christ alone. Never affirm heterodoxy in the site's own voice.
- **Orthodoxy outranks charity (HARD TIEBREAK).** Whenever gentleness/steelmanning and
  doctrinal safety pull apart, orthodoxy wins — every time. Charity governs *tone*, never
  the doctrinal scoreboard. When steelmanning or conceding, concede only (a) accurate
  facts and (b) the sincerity of the person — **never** the opponent's *frame*, the
  *soundness* of a mistaken inference, or a *symmetry* the evidence doesn't establish.
  **Concede the observation, never the inference.** Never phrase a concession so that a
  single sentence, lifted out of context as a pull-quote, could read as affirming,
  dignifying, or granting legitimacy to a heterodox claim (denial of Christ's full deity
  or humanity, subordinationism, modalism, tritheism, Arianism, works-salvation,
  universalism-as-certain, or any departure from Nicene orthodoxy). Red-flag words applied
  to a heterodox or skeptical claim: "careful," "coherent," "sound," "reasonable," "not
  baseless," "deserves its due," "the parallels are real." If any sentence has *any*
  plausible reading that hints at heresy, rewrite it until it doesn't — **even at the cost
  of sounding less charitable or less balanced. When in doubt, err toward the stronger,
  clearer orthodox statement.** A little too firm beats any hint of heresy left standing.
- **Denominational neutrality**: defend the faith common to Catholics, Orthodox, and
  Protestants; do NOT adjudicate intra-Christian disputes (baptism, predestination,
  papacy, sacraments, Marian doctrine, end-times) as settled.
- **Tone — 1 Peter 3:15**: gentleness and respect; steelman every objection in its
  strongest form before answering; never triumphalist, strawman, or condescending;
  represent other faiths (Judaism, Islam, JW, Mormonism, atheism) charitably.
  **Calibration cuts both ways**: charity is *accuracy*, not concession. Steelman means
  the opposing case in its strongest *accurate* form — never inflate the other side's
  evidence, grant symmetries that don't exist, or concede more than the evidence
  requires. Gentleness governs the tone, not the scoreboard. (Caught example: a line
  granting Bible and Qur'an face "the same standard" when Surah 4:82's no-contradiction
  test is the Qur'an's own, stricter, self-issued standard.)
- **No fabrication**: no invented quotes, citations, dates, or statistics.
- **Argument-specific rules**:
  - Kalam: "whatever **begins to exist** has a cause," never "everything has a cause."
  - Bible reliability: manuscripts prove **accurate preservation**, not that the content
    is true — argue truth separately.
  - Fine-tuning: the **data** is conceded by atheist physicists; **design** is the inferred,
    contested conclusion — never "scientists agree the universe is designed."
  - Suffering/evil: concede the mystery first; no tidy complete theodicy; Plantinga is a
    *defense* (consistency), not a proof.
  - Morality: never "atheists can't be moral"; objective moral **duties need a ground**.
  - Resurrection: lead with the 1 Corinthians 15:3–7 early creed (within ~2–5 years);
    never frame the evidence as "merely written decades later."

## The agent fleet

| Agent | Role | Access |
|---|---|---|
| `apologia-author` | Writes long-form deep-dive essays | write |
| `apologia-evidence` | Scholar-editor: accuracy, rigor, sourcing, steelmanning | write |
| `apologia-citations` | Fact-checks every scripture/source citation | read-only |
| `apologia-argument` | Judges argument soundness / steelmanning / overstatement | read-only |
| `apologia-editor` | Copy-edit: typos, grammar, markup, links | write |
| `apologia-orthodoxy` | **Final doctrinal gate** — runs last, certifies orthodoxy | read-only |
| `apologia-engineer` | **Code-quality & security reviewer** — api/*.js, RLS, tools, paywall (correctness, security, DRY smells); runs the test suite | read-only |
| `apologia-strategist` / `-research` / `-product` / `-growth` / `-seo` / `-social` | Growth/strategy/content research (not part of essay QA) | varies |

**Code health (distinct from the content pipeline).** `apologia-engineer` reviews *code* the way the
orthodoxy agent reviews *content*: run it on changes touching `api/`, `tools/`, Supabase RLS, or the
client auth/paywall JS. Backing it: a dependency-free **test suite** (`tests/*.test.mjs`, run with
`node --test tests/*.test.mjs`) that guards the nav single-source-of-truth, `answers/_data.json`
integrity, content-review-stamp JSON validity, the `api/ask.js` guardrail presence, and static
security invariants (service-role key never client-shipped; cron endpoints fail closed). CI runs it on
every push (`content-gate.yml` → `tests` job) and monthly (`monthly-code-audit.yml`). The
**agent-driven** monthly security sweep of `api/*.js` + RLS still needs a fresh-session Routine
(create it when `create_trigger` is reachable).

**Crisis-routing harness (`tools/test-crisis-routing.mjs`).** End-to-end guard for the `api/ask.js`
PASTORAL CARE path (a crisis message must never get the normal answer or the canned off-topic/denom
brush-off — see the pastoral/crisis exception above). Two modes: **offline** (default, CI-safe) extracts
the live `crisisBackstop` regex from `api/ask.js` and asserts it against a labeled corpus — this is
wired into `tests/content-integrity.test.mjs` so a regex regression fails CI; **`--live [baseUrl]`**
POSTs every case to the deployed `/api/ask` and classifies the real response by route (crisis / answer /
offtopic / denom), exercising the Haiku PASTORAL classifier too (abuse / harm-to-others cases the regex
can't catch). Live spends tokens and is IP-rate-limited (40/day) — run it sparingly from a web-enabled
session (the sandbox can't reach the endpoint). Add new crisis phrasings to the `CASES` corpus as they
come up.

## Evidence Library structure
- Hub: `evidence-library.html` (tabs fetch `ev-sN.html` fragments via JS).
- Mastery pages: `ev-m-*.html`. Deep-dive essays: `library/*.html`
  (template: `library/manuscript.html`). Index: `library/index.html`; also wire new
  essays into `sitemap.xml` and the relevant `ev-sN.html` section.

## Public-domain source library (`/sources`)
A searchable corpus of **public-domain** primary texts (creeds, Church Fathers, pre-1929
works) for grounding content in real, quotable sources. See `sources/README.md` for the
full rules. In short:
- **PD only** — the work *and* its translation must be public domain (19th-c. Schaff
  ANF/NPNF, Roberts–Donaldson, Robertson, etc.). Never store modern copyrighted
  translations or any copyrighted book here; use owned copyrighted books only as *research*
  that points to primary sources, in our own words.
- **Drafting:** `apologia-author`/`apologia-evidence` should `Grep`/`Read` `sources/*.json`
  (or `sources-index.json`) for on-topic passages and quote the **verified** ones with the
  entry's `section` + `translation` as the citation.
- **Gate:** an entry with `verified: false` may NOT be quoted in published content until
  `apologia-citations` confirms its exact wording against `source_url` and flips it to `true`
  — same "nothing ships unverified" discipline as the rest of the pipeline.
- **LIVE consumer (raises the stakes on `verified`):** the live `/api/ask` endpoint now
  **retrieves** the most relevant `verified:true` passages at answer-time and lets the model quote
  them with attribution (build emits `lib/sources-verified.js` = verified-only; `lib/retrieve-sources.js`
  scores them; `api/ask.js` injects them as a second system segment under a gated instruction block
  that keeps them "quotation-accurate historic witnesses, not Scripture," fences denominational
  disputes, and hard-blocks fabrication — "quote ONLY from the provided list"). So flipping an entry
  to `verified:true` now also puts its exact wording into live answers — hold the citations bar
  accordingly. Any change to that instruction block must re-clear argument + orthodoxy (it's a gated
  file). **Open follow-up:** the per-passage curator `note` fields (which fence delicate Trinity
  relation-of-origin/taxis readings) are NOT sent to the model — a block-level Trinity co-equality
  safeguard covers it, but a citations pass should fold the "the Godhead is one" conclusion into the
  `text`/a context field for the taxis-clause entries (e.g. Gregory of Nyssa "Not Three Gods").
- Rebuild the index after edits: `node tools/build-sources-index.mjs` (CI runs `--check`; emits both
  `sources-index.json` and `lib/sources-verified.js`).

## Argument briefs (`/briefs`) — a SECOND live-consumed gated retrieval layer
Sibling of `/sources`, but for **our-own-words argument framing** instead of verbatim quotes (see
`briefs/README.md`). Each brief is the core move + the strongest objection + the honest concession for a
topic, **distilled from our already-certified essays** (and, for structure only, the `docs/book-research/*`
maps). The live `/api/ask` endpoint retrieves the single best-matching brief and offers it to the model as
**OPTIONAL background framing** — a helper, not a leash: the instruction block keeps it optional,
non-quotable (not a source, not Scripture, not attributed to a scholar), and subordinate to every
guardrail, so the model still weighs its own knowledge and the pastoral path always wins.
- **Trust boundary (why it's safe):** `docs/book-research/*` (unverified leads) → a **certified essay**
  and/or a **gated brief** → `lib/briefs-verified.js` (gated-only) → live answer. The runtime never reads
  the raw notes; only twice-gated, our-own-words framing reaches a visitor.
- **Gate:** a brief reaches the live module ONLY when its `reviewed` object stamps BOTH `argument` and
  `orthodoxy` dates; `tools/build-briefs-index.mjs` enforces this (un-stamped → excluded, like `/sources`
  `verified:true`). The brief text is DOCTRINAL content — it passes `apologia-argument` + `apologia-orthodoxy`
  (+ `apologia-neutrality` for the resurrection/deity set) like any content, and **any change to the
  `buildBriefsBlock` instruction in `api/ask.js` re-clears argument + orthodoxy** (gated file).
- Rebuild after edits: `node tools/build-briefs-index.mjs` (CI runs `--check`; emits `briefs-index.json`
  + `lib/briefs-verified.js`). Guarded by `tests/content-integrity.test.mjs` (gated-only + block-stays-optional).

## Owned-book research notes (`docs/book-research/`)
In-our-own-words **research maps of owned copyrighted apologetics books** — the argument
structure plus an index of the **primary sources** the book cites (Scripture, Fathers,
scholars, dates) to chase down. **Distinct from `/sources`:** these are *maps of copyrighted
books*, not quotable text.
- **START HERE — the topical index:** [`docs/book-research/INDEX.md`](docs/book-research/INDEX.md) routes
  a topic (resurrection / minimal facts / empty tomb / creed dating / deity of Christ / naturalism / etc.)
  → the right note + section + the strongest **already-identified primaries** + any "do not use" flag.
- **Drafting (ALL content — essays, `ev-s*` cards, AND `/answers/*`):** before writing on a topic these
  books cover, `Grep`/`Read` `INDEX.md` (then the mapped note) to get the argument's shape, the strongest
  objections, and *which primary sources to cite directly* — then quote the **primaries**, verified, in
  our own voice. **The answers flywheel is explicitly in scope:** `tools/gen-answers.mjs`'s header names
  this as the "GROUNDING STEP" before drafting a new answer. (It's a documented convention, not a machine
  gate — a build script can't verify a file was read; the point is the chokepoint now names the step.)
- **Hard rule:** never reproduce the book's prose, and treat **every** citation in these notes as
  **unverified** until confirmed against the primary source and run through the normal pipeline
  (citations → argument → orthodoxy). The note is a lead, not a source.
- **⚠ The live `/api/ask` endpoint does NOT (and cannot) read this folder.** It's a deployed serverless
  function — it can't reach `docs/` (not deployed/served), and these are unverified copyrighted-book leads
  anyway. The ONLY path from an owned-book note to a *live* answer is: lead → verify the primary → add it
  to `/sources` as `verified:true` → it compiles into `lib/sources-verified.js`, which `api/ask.js`
  retrieves. So "make a book inform live answers" = promote its verified primaries into `/sources`, never
  point the runtime at `docs/book-research/`.
- **Current notes:** `i-dont-have-enough-faith-to-be-an-atheist.md` (Geisler & Turek — complete;
  covers the cosmological/teleological/moral arguments, NT reliability, resurrection, deity of
  Christ, miracles, and the anti-skepticism material); `body-of-proof.md` (Jeremiah Johnston —
  resurrection: the 7 reasons, 1 Cor 15 creed [Dunn 855 / Habermas 153], empty-tomb/burial archaeology
  [Magness], skeptic conversions [Paul/James, the Flew close], resurrection-vs-resuscitation,
  suffering/hope, and the Gospel-of-Peter / ancient-critics apparatus — **complete** [Intro + Chs. 1,
  3–12 + full Notes pp. 163–172; only the Ch. 2 body + copyright page deferred]; watch its popular-level
  overstatement, and **two hard flags: Ch. 4's Islam-slavery material is Bill-Warner/CSPI-sourced → DO
  NOT USE; Ch. 7 has no endnotes**); `did-jesus-really-say-he-was-god.md` (Mikel Del Rosario — deity of
  Christ argued *from Mark, via the enemies' reaction*: the two blasphemy scenes, ten data points,
  five best-explanation criteria; built from the already-gated reading behind the reading-club demo,
  and distinct from it); `case-for-the-resurrection-of-jesus.md` (Habermas & Licona — the flagship
  "minimal facts" book, and our own "Further study" rec on the resurrection answers; **mapped pp. 23–150
  + the complete A–Z bibliography + all 70 Chapter-3 numbered notes** — the full positive+defensive case
  with page-precise citations for Facts 1–2, incl. the creed-dating chain, the Ignatius=*Smyrnaeans* 3
  locus, and the Habermas survey; other chapters' numbered notes are the only nice-to-have gap);
  `in-defense-of-the-bible.md` (Cowan & Wilder, eds. — **ch. 6 only, COMPLETE**: Daniel B. Wallace, "Has
  the New Testament Text Been Hopelessly Corrupted?", pp. 140–163, all 51 footnotes indexed — the NT
  textual-reliability case: two ditches [radical skepticism vs. KJV-Only], the four-category
  viability/meaningfulness variant taxonomy [meaningful-AND-viable variants are <1%], and no cardinal
  doctrine on a disputed variant [incl. Ehrman's own concession]; feeds Biblical Reliability `ev-s4` —
  **used 2026-07-17 to strengthen `library/manuscript.html`** with the taxonomy + worked examples [Rom
  5:1, Jesus Barabbas, Mark 1:41, John 1:18], dual-consensus re-gated CLEAN; only this one chapter of the
  multi-author volume is captured). See each note's header for its own usage rules and citation-precision
  flags, and `INDEX.md` for topic routing.
- **Adding a book from page photos** (the user may do this from a phone session — upload ~5–10
  legible photos of a book they **own**, incl. footnote/bibliography pages): follow
  `docs/book-research/README.md`, which has the full workflow + copyright rules and points to the
  Geisler–Turek note as the format template. Owned books only — never Perlego or any service whose
  terms forbid automated extraction.

## Deploy workflow (security-critical)
- Work on the feature branch; **never `git checkout main`** (a stale local main lacks
  `.claude/agents/` and de-registers the agent fleet).
- Deploy by fast-forward push: `git push origin <branch>:main`.
- Apply edits with assert-guarded scripts (verify exact-match counts) and re-verify
  footnote `<sup>↔<li>` integrity before deploying.
- **Content-review gate (enforced):** any new/changed essay, `ev-s*` fragment,
  `worldviews.html`, reel spec, or `api/ask.js` must carry a review stamp recording that
  the argument + orthodoxy gates ran:
  `<!-- content-review: {"argument":"<date>","orthodoxy":"<date>","by":"<name>"} -->`
  (HTML/JS) or a top-level `"reviewed": {argument, orthodoxy, by}` (reel-spec JSON).
  Verify before deploy: `node tools/check-content-review.mjs --changed` (checks files
  changed vs `origin/main`); `--audit` lists everything unstamped. CI runs it on every
  push/PR (`.github/workflows/content-gate.yml`) — only CHANGED files are gated, so
  existing content is stamped as it's next touched. Same honest caveat as the answers
  gate: the stamp is an auditable human assertion, not proof the agents ran — never stamp
  a check you didn't run. (`/answers/*` keep their own gate in `tools/gen-answers.mjs`.)
- **Orthodoxy tripwire scan (whole-corpus regression guard):**
  `node tools/check-orthodoxy-tripwires.mjs` scans **every** live page (not just changed ones)
  for a curated set of heterodox phrasings ("the Word was a god," "Jesus became God," "we worship
  the same God" of Allah, modalist "God is one person," works-salvation, universalism-as-certain,
  etc.). It uses a **baseline allowlist** (`tools/orthodoxy-tripwires-baseline.json`) so it only
  fails on a *newly introduced* match — legitimate refutation/attribution context is baselined.
  A new match is either real drift (fix the wording) or legitimate new refutation context (accept
  on-record with `--update`, commit the baseline diff). Coarse net, not a doctrinal judge — the
  orthodoxy agent is that. CI-blocking.
- **Answer-openings lint (lead-with-the-answer guard):**
  `node tools/check-answer-openings.mjs` scans every `/answers/*` opening for known front-loaded
  tells (charitable throat-clearing / conceding before answering — "It's a fair question," "This is
  a serious objection," "Let's not soften this," "The honest place to begin is with a concession,"
  etc.) and **fails the build** on any non-baselined hit. Baseline allowlist:
  `tools/answer-openings-baseline.json` (accept a deliberate exception with `--update`). Coarse
  regex net, NOT a judge — it complements the `apologia-argument` gate (which catches front-loading
  that has no fixed opening phrase). Enforces the SHORT-FORM ANSWER RULE mechanically so a
  front-loaded opening can't ship even if a future session's gate is sloppy. CI-blocking, plus a
  `node:test` case in `tests/content-integrity.test.mjs`.
- **Answer over-concession lint (unearned-symmetry guard):**
  `node tools/check-answer-concessions.mjs` is the companion to the openings lint: it scans the
  **whole answer AND the `meta` subtitle** (not just the opening) for known over-concession /
  unearned-symmetry tells toward a rival or heterodox view ("in a warmer/looser sense," "it would be
  ungracious to pretend otherwise," "grant that warmly," "the parallels are real," "X love Jesus
  and…," the "person at your door qualifies," etc.) and **fails the build** on any non-baselined hit.
  Baseline allowlist: `tools/answer-concessions-baseline.json` (accept a genuinely-defended
  in-refutation exception with `--update`; `--audit` shows every hit with context). **This closes the
  exact gap that let the "Are Mormons/JWs Christians?" over-concessions ship** — they *led* with the
  correct "no," so the openings lint (first-sentence only) passed them while the concession sat in
  sentence 2 / the close / the meta, and the semantic pull-quote catch only runs in periodic agent
  sweeps. Coarse regex net, NOT a judge — it complements the `apologia-argument` + `apologia-neutrality`
  + `apologia-orthodoxy` pull-quote test (which catches context-dependent over-concession no fixed
  phrase can). CI-blocking, plus a `node:test` in `tests/content-integrity.test.mjs`.
- **Stamp-integrity check (certified-then-edited guard):**
  `node tools/check-stamp-integrity.mjs` flags any gated file whose *doctrinal* lines were changed
  by a commit **after** its `content-review` stamp without a re-stamp (nav/OG/sitemap/boilerplate
  edits are filtered out and do not trip it). Closes the "gate certifies a version that no longer
  exists" hole. Runs `--warn` (non-blocking report) in CI; a flag means: re-run argument +
  orthodoxy on that file, then bump the stamp date.
- **Dual-consensus for the highest-stakes content (Trinity, deity/person of Christ, salvation,
  world-religions).** For these pages, one orthodoxy pass is not enough: require **both**
  `apologia-orthodoxy` AND the adversarial `apologia-neutrality` red-team to certify CLEAN (two
  independent lenses must agree) before deploy. Record both in the stamp `by` note. For all other
  content the single orthodoxy gate remains the bar.
- **Doctrinal clarifiers (`orthonote`) — STANDARD for delicate-but-orthodox phrases.** When a
  phrase is orthodox but a compressed reader could misread it as heterodox (subordination,
  modalism, tritheism, partialism, patripassianism, works-salvation, universalism-as-certain,
  "same God," the retired echad overreach, etc.), fence it on the page with a clarifier: a gold
  ＊ that opens an "Is saying / Not saying" box. This is exactly where the `apologia-orthodoxy`
  gate leaves a NOTE-level "delicate but orthodox" flag — turn those NOTEs into clarifiers rather
  than leaving them for a later human pass. **How:** essays/fragments — inline the markup pattern
  documented at the top of `library/orthonote.js` and add `<script src="/library/orthonote.js"
  defer></script>`; answer pages — add a `clarifiers` array to the `_data.json` entry (drift-safe,
  data-driven; the generator injects it into the visible answer only, never the JSON-LD/`"a"`).
  The clarifier's box text is DOCTRINAL content and must pass the argument + orthodoxy gates like
  any content. Registry of every live clarifier: `docs/clarifiers.md` (regenerate with
  `node tools/list-clarifiers.mjs`).
