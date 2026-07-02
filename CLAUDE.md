# Apologia Daily — project guide

> **Resuming / new session?** Every chat auto-loads this file, so the live status lives
> here. All work is deployed to `main`, so a new session on **any** branch already has it
> (web sessions get different branch suffixes — that's fine). Full detail: `HANDOFF.md`
> (repo root; committed but not web-served). Deploy rule unchanged: push your working
> branch to `main`, never `git checkout main`.
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
> tabs / **76 arguments, all orthodoxy-gated CLEAN**: Jesus (`ev-s3`, 15), Resurrection
> (`ev-s2`, 8), Biblical Reliability (`ev-s4`, 11), Trinity (`ev-s6`, 10), God's Existence
> (`ev-s1`, 12), Science & Faith (`ev-s5`, 7), and Islam in Worldviews (`worldviews.html`,
> 13). **How it's built** (repeatable): a drafter (`apologia-evidence`, grounded in each
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
> `es/evil.html`, matching the certified EN original); (2) fix the English
> `ev-s4.html` famine number (Luke 4:25 → "three years and six months"; the mk is already
> right); (3) set `RESEND_API_KEY` in Vercel so `api/submit-question.js` emails captured
> questions; (4) **monetization is a stub** — `isPro` hardcoded, Stripe not live, a dead
> "$8/mo + 7-day trial" is advertised: decide the model, don't run paid acquisition into
> it, and never wire real prices/payments without human sign-off; (5) PostHog is
> under-instrumented (full event/funnel plan in `docs/MARKETING_PLAN.md`); (6) the **"The
> Case, Plainly" tier** passed the automated `apologia-orthodoxy` gate on all 76 articles
> but still needs eventual **human/pastoral sign-off** before high-stakes acquisition — most
> relevant on the Trinity and Islam tabs; the gates left a short list of non-blocking notes
> for that pass (e.g. the Surah 10:94 "doubt" reading on the islam-dilemma Case; a couple of
> Islamic-studies attributions on islam-eternalword). Candidate next
> steps: roll the Case tier across Conversion Stories / the remaining Worldviews once those
> pages are complete; extend the Spanish/Macedonian pilots beyond 10 essays (+ a Spanish hub
> via `ev-sN.es.html` fragments); more `/answers/` pages via the flywheel; execute the
> marketing plan.

Apologia Daily (apologiadaily.com) is a commercial Christian apologetics platform: a
static HTML/CSS/JS site on Vercel, with Supabase (auth/db) and Claude-powered AI
features (`/api/*.js`). The **Evidence Library** (`/library/*.html`) is the heart of the
site: long-form, fully-cited deep-dive essays.

## MANDATORY content pipeline (any new essay or substantive content)

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
8. **Deploy** (see deploy workflow below).

Read-only agents (citations, argument, orthodoxy) report; a human-supervised step applies
their fixes. The orthodoxy agent is an automated gate, **not** a substitute for eventual
human/pastoral doctrinal sign-off on high-stakes content.

## NON-NEGOTIABLE guardrails (mirror `api/ask.js`; enforced by every agent)

- **Classical orthodoxy** (Apostles'/Nicene Creed): full deity AND humanity of Christ;
  Trinity (one God, three co-equal co-eternal persons — never modalism, tritheism, or
  Arian/subordinationist drift); bodily resurrection; authority of Scripture; salvation
  through Christ alone. Never affirm heterodoxy in the site's own voice.
- **Denominational neutrality**: defend the faith common to Catholics, Orthodox, and
  Protestants; do NOT adjudicate intra-Christian disputes (baptism, predestination,
  papacy, sacraments, Marian doctrine, end-times) as settled.
- **Tone — 1 Peter 3:15**: gentleness and respect; steelman every objection in its
  strongest form before answering; never triumphalist, strawman, or condescending;
  represent other faiths (Judaism, Islam, JW, Mormonism, atheism) charitably.
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
| `apologia-strategist` / `-research` / `-product` / `-growth` / `-seo` / `-social` | Growth/strategy/content research (not part of essay QA) | varies |

## Evidence Library structure
- Hub: `evidence-library.html` (tabs fetch `ev-sN.html` fragments via JS).
- Mastery pages: `ev-m-*.html`. Deep-dive essays: `library/*.html`
  (template: `library/manuscript.html`). Index: `library/index.html`; also wire new
  essays into `sitemap.xml` and the relevant `ev-sN.html` section.

## Deploy workflow (security-critical)
- Work on the feature branch; **never `git checkout main`** (a stale local main lacks
  `.claude/agents/` and de-registers the agent fleet).
- Deploy by fast-forward push: `git push origin <branch>:main`.
- Apply edits with assert-guarded scripts (verify exact-match counts) and re-verify
  footnote `<sup>↔<li>` integrity before deploying.
