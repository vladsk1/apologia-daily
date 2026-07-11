# Apologia Daily — project guide

> **Resuming / new session?** Every chat auto-loads this file, so the live status lives
> here. All work is deployed to `main`, so a new session on **any** branch already has it
> (web sessions get different branch suffixes — that's fine). Full detail: `HANDOFF.md`
> (repo root; committed but not web-served). Deploy rule unchanged: push your working
> branch to `main`, never `git checkout main`.
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
> (`ev-s2`, 8), Biblical Reliability (`ev-s4`, 11), Trinity (`ev-s6`, 10), God's Existence
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
8. **Deploy** (see deploy workflow below).

Read-only agents (citations, argument, orthodoxy) report; a human-supervised step applies
their fixes. The orthodoxy agent is an automated gate, **not** a substitute for eventual
human/pastoral doctrinal sign-off on high-stakes content.

## NON-NEGOTIABLE guardrails (mirror `api/ask.js`; enforced by every agent)

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
