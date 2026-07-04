# Apologia Daily — Session Handoff

_Last updated: 2026-07-04. Read this together with `CLAUDE.md` to resume with full
context at minimal token cost. Everything below is already committed to git; the chat
that produced it can be discarded._

## Session 2026-07-04b — orthodoxy-over-charity policy + answers integrity sweep

**Trigger:** review of a few `/answers/` openings surfaced **over-concession** — steelman
openings that granted the opponent's *frame/legitimacy*, not just facts, on the highest-stakes
pages: JW ("hold, sincerely and on real biblical reasoning… a coherent picture"), John 1:1 NWT
("its reasoning should be granted"), "same God" ("Both faiths worship the one Creator God"),
pagan myths ("The parallels are real"), Mormon ("breathtaking dignity and destiny… honored"),
canon ("the winners… deserves its due"). All corrected + live (grant the *observation*, not the
*inference*; "same God" reframed as contested with the triune God primary + 1 John 2:23).

**NEW POLICY — "Orthodoxy outranks charity" (hard tiebreak), applied everywhere content is
generated or checked:**
- `api/ask.js` (live "Ask Anything" AI) — added to THEOLOGICAL BOUNDARIES: concede only
  accurate facts + the person's sincerity; never the frame / a mistaken inference's soundness /
  an unearned symmetry; concede the observation not the inference; err toward the stronger,
  clearer orthodox statement. (Real behavior change to live answers.)
- `CLAUDE.md` guardrails — new NON-NEGOTIABLE bullet with the red-flag word list ("careful,"
  "coherent," "not baseless," "deserves its due," "the parallels are real"…) + the **pull-quote
  test** (a concession that, screenshotted alone, dignifies heterodoxy → rewrite).
- `apologia-orthodoxy` agent — over-concession is now a first-class HIGH-PRIORITY test
  ([DRIFT]+ , never [NOTE]); `apologia-argument` — pull-quote + self-contradiction tells,
  [BREAK] when a concession shades doctrinal.
- `CLAUDE.md` pipeline section — now explicitly covers `/answers/*`, reel scripts, and
  `api/*.js`. Answers are NOT a lighter tier.

**Enforced review gate (process fix so this can't recur silently):**
- `answers/_data.json` entries now carry `reviewed: { argument: "<date>", orthodoxy: "<date>",
  by: "<name>" }` (was: nothing — the flywheel's checks were manual + unrecorded).
- `tools/gen-answers.mjs` **refuses to generate a new answer page unless both dates are
  stamped** (names which is missing). A bare `true` no longer passes. Caveat: the flag can't
  *prove* the agents ran — it's an explicit, dated, auditable human assertion; integrity still
  required. Never stamp a check you didn't run.

**Full sweep result (all 56 answers, argument + orthodoxy gates):** 0 [HERESY], 0 [BREAK].
Fixed 5 over-concessions (JW-Michael, canon, pagan-myths, John-1:1-NWT, do-JW-believe) + 2 more
(both Mormon pages) + reframed "same God" + applied 7 argument-quality fixes (morality overstate,
did-Jesus-claim → Synoptic anchor, good-moral-teacher → legend horn, Kalam hedge, empty-tomb
caveat, Qur'an *ahruf* steelman, Muslim-Jesus *tahrif* steelman). Two Christology edits re-gated
CLEAN. **All 56 now stamped reviewed {argument, orthodoxy} 2026-07-04; 0 pending.**

**Visible↔_data↔JSON-LD drift — FOUND + RECONCILED + guarded (the "do all four"):** each
answer's text lives in THREE places that must agree — the visible `<div class="ad-answer">`,
the QAPage JSON-LD `acceptedAnswer.text`, and `_data.json "a"` (the gate reads `_data.json`).
On **6 Bible-reliability pages** the live visible text had been hand-edited without updating the
other two, so the gate had certified a stale copy — meaning the live text was effectively
**un-reviewed**. (1) Reconciled all three to the corrected visible text on all 6
(`are-there-contradictions-in-the-bible`, `can-we-trust-the-new-testament-manuscripts`,
`has-the-bible-been-changed-over-time`, `is-there-archaeological-evidence-for-the-bible`,
`is-there-evidence-jesus-rose-from-the-dead`, `were-the-gospels-written-by-eyewitnesses`);
JSON-LD rebuilt from visible via `json.dumps`, all parse, all three copies verified MATCH.
(2) Re-gated the live visible text (argument + orthodoxy): **orthodoxy CLEAN 6/6**, argument
0 BREAK / 2 WEAK / 3 POLISH. (3) Fixed the 2 WEAK: `contradictions` now states Synoptic
dependence honestly (Matthew/Luke draw on Mark; John independent — no longer implies four
fully independent Gospels); `archaeology` drops the false "Pilate was once doubted" claim
(Pilate/Caiaphas were known from Roman+Jewish writers, later confirmed epigraphically). The
3 POLISH left as defensible (resurrection martyrdom phrasing, gospel-titles "early",
hostile-witness line). (4) **`tools/gen-answers.mjs` now runs a DRIFT AUDIT on every
invocation** — normalizes visible `ad-answer` vs `_data "a"` and loudly warns on any page
that has diverged, so this class of silent drift can't recur. Deployed (commit on `main`,
2026-07-04b). Broader cleanup now effectively closed for the answers layer.

Open pastoral item (unchanged by me): the hell answer leans on the Lewisian free-will model
(orthodox, but one model).

## Session 2026-07-04 — short-form video engine, growth research, two fixes

**New: in-house short-form reel generator + `make-reel` skill (committed, on `main`).**
- `tools/reel/gen_reel.py` renders a finished, brand-styled vertical MP4 from a JSON spec
  using **Pillow + a bundled static ffmpeg** — no Canva, no network, no API keys. Themes
  `navy`/`parchment`; aspects `vertical`/`square`/`wide`; `--pace` multiplies scene time;
  kicker (gold section label) is top-anchored close to the body text. Output → **`tools/reel/output/`**
  (git-ignored, **ephemeral** — download finished MP4s, they don't persist).
  Regenerate: `cd tools/reel && python3 gen_reel.py specs/<slug>.json [--theme parchment] [--aspect square] [--pace 1.4]`.
- Skill: `.claude/skills/make-reel/SKILL.md` (invoke by asking "make a reel for answers/<x>.html").
  Spec format in `tools/reel/README.md`. **Videos are silent + fully captioned by design**
  (no TTS is reachable in this env — Google TTS + HuggingFace both policy-blocked; Canva AI
  Voice is editor-only). Add voiceover **and a trending sound** in CapCut/TikTok/IG after.
- **9 specs exist**, all sourced from already-orthodoxy-gated `/answers/` pages, all `pace 1.4`
  (~45–53s): `was-jesus-a-muslim`, `was-jesus-a-muslim-evidence`, `why-were-women-the-first-witnesses`,
  `why-did-the-disciples-die-for-their-faith`, `was-jesus-copied-from-pagan-myths`,
  `did-the-church-invent-jesus-divinity-at-nicaea`, `where-is-god-when-im-hurting`,
  `is-the-quran-corrupted`, `who-made-god`. House pattern: discovery-gap hook (open with a
  curiosity gap, not a claim) → evidence beats (gold-highlight the payload line) → confident
  close → `apologiadaily.com`; rotate the emotional register across a posting week.
- **Canva note:** the Canva Connect MCP works for READ + MP4 export, but every WRITE
  (finalize candidate, resize, edit, AI Voice) is blocked by an approval gate in this
  headless env — that's why reels are built locally instead.

**Fix 1 — pricing integrity (deployed):** `index.html` Pro card advertised a "Start 7-day free
trial / billed annually / cancel anytime" that Stripe can't fulfil. Reframed to **"Coming soon"**
(planned price + "Create a free account" CTA that captures email). No trial promises remain sitewide.
Monetization is still a stub — do NOT wire Stripe/prices without human sign-off.

**Fix 2 — accuracy (deployed):** Sean McDowell was mislabeled **"historian"**; he is a **Christian
apologist** (Assoc. Prof. of Christian Apologetics, Talbot/Biola; PhD Apologetics & Worldview
Studies). Corrected in `answers/why-did-the-disciples-die-for-their-faith.html` (visible + JSON-LD),
`answers/_data.json`, `library/postres.html`, `library/disciplesbelief.html`, and the disciples reel.
(The bibliography entries citing *The Fate of the Apostles* were already fine.)

**Growth research (Bible Chat teardown, product + marketing).** Bible Chat = a paid-acquisition
**volume** business (~10M users, ~$15M ARR, **97% never pay / ~3% convert**); don't try to out-spend
it. Copyable levers for us: (1) **organic short-form** with discovery-gap hooks + weekly register
rotation (our reel tool is exactly this — a small account is fine; format beats follower count);
(2) **front-loaded onboarding** (their ~20-step quiz is a commitment device — we can do a lean 2–3
question version with the existing dashboard modal + `/today`); (3) **SEO is our "ASO"** (their real
paid spend was Apple Search Ads keywords, not video ads). Do NOT copy: auto-converting trials,
"subscription = mission gift" reframing, fake-organic personas, $7/wk dark-pattern pricing.
**Screenshot evidence from the user's own accounts:** a branded reel got **147 IG views** vs **0–22**
for website screen-recordings → post reels (not screenshots), add a trending sound, upload the
watermark-free file natively to each platform, post ~daily, re-pin the best reel on TikTok.

**Still open from this session:** (a) run `apologia-citations` over the reel scripts (offered, not
yet run — the McDowell catch shows why); (b) no square/16:9 cuts yet; (c) next reel batch not drafted;
(d) PostHog still missing `signup_completed`, `reel_link_click{slug}`, `answers_page_viewed` (needed to
measure reel→signup); (e) **commits show "Unverified"** because the signing key was never provisioned
in this env (`/home/claude/.ssh/commit_signing_key.pub` is empty, no private key) — cosmetic, needs a
re-sign from an env that has the key.

## Ground rules (unchanged)
- Develop on branch **`claude/agents-visibility-calling-n5d1ml`**.
- Deploy by fast-forward: **`git push origin claude/agents-visibility-calling-n5d1ml:main`**. **Never `git checkout main`.**
- Mandatory content pipeline + non-negotiable guardrails: see `CLAUDE.md`. Any **public, doctrinal** content must pass the **orthodoxy gate** before deploy.
- Use assert-guarded edits; re-verify footnote `<sup>↔<li>` integrity after any essay edit.
- **Never** implement real prices/payments/Stripe or change auth/pricing without explicit human sign-off.

## Shipped & live on `main` (this session)
1. **Dashboard "Due today"** spaced-repetition return hook (`dashboard.html`).
2. **Intent-capture onboarding** (dashboard) — "What brings you here?", reflected in greeting, persisted to Supabase `user_metadata`.
3. **Voice / speak-out-loud mode** in Debate Arena (Web Speech API; mic dictation + read-aloud) — `debate-arena.html`.
4. **Semantic "Related arguments" panel** on all 76 deep-dive essays — `library/related.json` + `library/related.js`.
5. **"Send this answer to a skeptic" referral loop** — `ask-anything.html` + `shared-answer.html` + `?ref=` capture in `signup.html`.
6. **New Islam card + essay**: "Was Jesus a Muslim? The Christian Response" — worldviews Islam tab card + `library/islam-jesusmuslim.html` (+ `/answers/was-jesus-a-muslim.html`).
7. Worldviews Islam: reordered cards, and moved each essay link **inside** the card's Pro deep-dive.
8. **Answers flywheel**: `api/submit-question.js` (capture via Resend) + submit box on `answers/index.html` + capture on `ask-anything.html` + generator `tools/gen-answers.mjs` + 3 new Islam-cluster answer pages.
9. **Macedonian pilot (10 essays)**: `library/mk/*.html` + `library/mk/index.html`; EN/MK switchers + `hreflang` on the 10 English essays.
10. **Bilingual Evidence Library hub**: EN/МК toggle in `evidence-library.html` (LANG/I18N/setLang + fragment routing) + 7 translated tab fragments `ev-s1…s7.mk.html`.
11. **Spanish pilot (10 essays)**: `library/es/*.html` + `library/es/index.html`; tri-lingual EN/МК/ES switchers + `hreflang` + sitemap; `Español` added to the hub toggle (links to `/library/es/`). All 10 orthodoxy-gated CLEAN.
12. **"The Case, Plainly" tier (77 arguments, 7 tabs)** — a warm plain-English positive-case walkthrough (~850–950 words) inlined as the FIRST paid block in every argument card, under the Upgrade gate and before the deep dive. Tabs: Jesus (`ev-s3`, 15), Resurrection (`ev-s2`, 8), Biblical Reliability (`ev-s4`, 11), Trinity (`ev-s6`, 10), God's Existence (`ev-s1`, 12), Science & Faith (`ev-s5`, 7), Islam in Worldviews (`worldviews.html` Islam section, 14). All 77 orthodoxy-gated CLEAN.
    - **Repeatable build:** `apologia-evidence` drafts body prose as `<p class="psl">`/`<p class="pt">` lines → a scratch file; a per-tab build script (`build-cases-s{1,2,4,5,6}.mjs` / `build-cases-islam.mjs`, in the session scratchpad) wraps it in a *second* `.pro` block (worldviews: `.wv-pro`, with psl→`wv-pro-section-label`, pt→`wv-pro-text`) and splices it in **before** the deep-dive `.pro`, anchored on that argument's unique `.prot`/`.wv-pro-subtitle` tagline. The worldviews build is scoped to the Islam section only. Each build is assert-guarded (unique anchor, no wrapper leakage, div-balance unchanged) and idempotency-checked — but the check keys off the line just above the anchor, so **run each build once from a pristine file** (re-running after a partial inline can double-insert; reset with `git checkout origin/main -- <file>` then run once). Then batch `apologia-orthodoxy` on every article before deploy.
    - **Voice/guardrails:** positive case ONLY, objections deferred to the deep dive with one gentle closing line; every argument reads as an inference/pointer, not a proof. The gate specifically verified: Kalam "begins to exist" (never "everything"); fine-tuning data-conceded/design-contested (never "scientists agree designed"); moral grounding-not-conduct + Euthyphro third horn (never "atheists can't be moral"); evil concede-mystery/Plantinga-is-a-defense; preservation/provenance≠truth on the Bible-reliability tab; canon denominational neutrality; strict Nicene Trinity (no modalism/tritheism/subordinationism, every broken analogy named); 1 Peter 3:15 charity + accurate non-strawman representation on Islam; contested design/ID (cambrian/privileged/cosmic/originlife) kept explicitly non-consensus.

## Open threads / known issues (priority order)
1. **Native Macedonian doctrinal review is still outstanding.** All MK content (10 essays + 7 hub fragments) is AI-translated and passed the automated orthodoxy gate, but a fluent Macedonian-speaking believer should confirm before heavy promotion. Specific spots the gate flagged to eyeball: `ev-s3.mk.html` (~functional-submission gloss, Isaiah 9:6 "Everlasting Father" gloss), `ev-s6.mk.html` (filioque lines, procession of the Spirit). Terminology consistency to tidy: "fine-tuning" is rendered both **фино подесување** and **фина наместеност**; also "Mastery Track", "transworld depravity", "criterion of embarrassment", "soul-making". Rule used: translate the *language*, not the *theology*; keep denominational neutrality (small-o "orthodox" → **ортодоксни**, never **православни**).
2. **English `ev-s4.html` has a factual error** (the Macedonian `ev-s4.mk.html` was already corrected): Luke 4:25 famine is given as "153 years and four months" (conflated with John 21's 153 fish) — should be **"three years and six months."** Fix the English via a citations/editor pass.
3. **Question capture needs an env var:** `api/submit-question.js` only emails submitted questions if **`RESEND_API_KEY`** (and optional `QUESTION_NOTIFY_TO`) is set in Vercel. Until then they still log a PostHog `question_submitted` event.
4. **Monetization is a stub (integrity + decision needed):** `isPro = true` is hardcoded site-wide, Stripe is not live, yet the site advertises **"$8/mo" + "7-day free trial"** on a flow that cannot charge. Don't drive paid acquisition into it. Pending interim fix: soften/relabel the dead trial button. Pending decision: **free + donations/Patron** (à la GotQuestions; implies 501(c)(3) for tax-deductible giving) **vs paywall**. See `docs/MARKETING_PLAN.md`.
5. **Analytics under-instrumented:** PostHog is live but only ~5 events. Added this session: `question_submitted` (server), `question_asked` (ask-anything). Full event/funnel list to add is in `docs/MARKETING_PLAN.md`.
6. **"The Case, Plainly" tier needs human/pastoral sign-off.** All 77 articles passed the automated `apologia-orthodoxy` gate but not a human — most important on the Trinity and Islam tabs before any Islam-focused acquisition. Short non-blocking notes the gate left for that pass: the Surah 10:94 "Muhammad in doubt" reading on the islam-dilemma Case (confirm the deep dive steelmans the rhetorical-address reply); a couple of Islamic-studies attributions on the islam-eternalword Case; the Moltmann patripassianism boundary that recurs wherever the cross/suffering is discussed. Positive case ONLY, so the human surface is small and targeted. New for that pass (2026-07-02): the **islam-contradictions** card/essay — the gate certified both CLEAN but flagged the essay's characterization that "Muslim orthodoxy's operative standard [for contradiction] is zero" as its most contestable representation of the opposing position; worth a knowledgeable human's eye. Also new (2026-07-02): a dedicated **over-concession audit** of all 14 Islam cards + the 3 warmest essays (charity-is-accuracy rule, now codified in CLAUDE.md and the agent definitions) found 0 break-level issues; 7 calibration fixes + 3 follow-ons were applied and re-gated CLEAN. Pattern for future drafting: the "Case, Plainly" tier tends to concede more warmly than its own deep dive supports — drafters and reviewers should check the Case against the card's certified calibration. The same both-directions audit then ran on the **Jesus (ev-s3), Resurrection (ev-s2), and Trinity (ev-s6) tabs** (2026-07-02): ~45 calibration fixes applied and orthodoxy-gated CLEAN — dominant failure mode there was OVERSTATEMENT (free tiers and "How to explain" paragraphs overclaiming past their own deep dives: false consensus claims, a wrong Julius Caesar comparison, a reversed BeDuhn citation, the echad compound-unity argument, a backwards Dinah example, DSS/LXX parthenos conflation, contested Napoleon quote as fact). Patterns for future drafting: (a) the free tier / "How to explain" text is consistently the least calibrated layer; (b) the newer Case tier is usually the best calibrated. The gate's 7 non-blocking notes are for the human pass.

**Retroactive audit now covers ALL 7 Evidence Library tabs (2026-07-03).** The three never-audited tabs — God's Existence (`ev-s1`), Biblical Reliability (`ev-s4`), Science & Faith (`ev-s5`) — each got BOTH a both-directions calibration audit AND a citations fact-check. ~89 fixes applied, all orthodoxy-gated CLEAN. The worst finds (why the Luke 4:25 famine bug was not isolated): **fabricated/misattributed quotes in quotation marks** — a nonexistent scholar "Christoph Leitgeb", a made-up C.S. Lewis "most dangerous argument" line, phantom Daniel Wallace ("99.5% stable"), Ehrman, and Millar Burrows quotes, and one "carrier of meaning" sentence attributed to BOTH Lennox and Polkinghorne; the **debunked Ebla/Sodom** archaeology claim stated as fact; the **garbled Isaiah statistic** (the famous "17 differences" belongs to Isaiah 53 alone, not 66 chapters); and **1940s-era manuscript counts** (Caesar "10", now ~250) the apologetics community itself retired. Every fabricated/unverifiable quote was deleted or de-quoted to attributed paraphrase — never replaced with invented wording. Systemic pattern (all 7 tabs): the newer "Case, Plainly" tier is well-calibrated; the older free-tier and "How to explain" text overclaims past it — that legacy layer is where drift and stale facts live.

**Follow-up from the s1/s4/s5 audit (open):** (a) the Bible-tab factual errors very likely propagate to the **Macedonian mirror `ev-s4.mk.html`** and to the **linked deep-dive essays** (`library/manuscript.html`, `library/prophecy.html`, `library/canon.html`, etc.) — same fixes needed, out of this pass's scope; (b) ~20 **CHECK-level unverified quotes** on `ev-s1`/`ev-s5` (Churchland, Chalmers, Feser, Scruton, Collins, Koonin, etc.) were made safe by de-quoting to paraphrase, but a human with the source books should source-or-cut them; (c) new load-bearing factual claims to spot-confirm: the updated manuscript counts, the Wheeler-foreword attribution, the Isaiah-53 letters statistic, the Benzmüller/Woltzenlogel Gödel verification, and the Gregor-Blais/Wilson-van-de-Weghe onomastics exchange. PROCESS FIX adopted: known factual errors are fixed on discovery, never backlogged; the pipeline had only ever run on NEW content, leaving these legacy tabs unchecked for years.

**Macedonian mirror sweep done (2026-07-03).** The three MK hub fragments (`ev-s1.mk`, `ev-s4.mk`, `ev-s5.mk`) carried the same errors as their English originals and were corrected to match — fabricated quotes deleted/de-quoted in Macedonian (Wallace, Ehrman, Burrows, Lennox/Polkinghorne, Yockey, the nonexistent "Кристоф Лајтгеб", the made-up C.S. Lewis line), the Ебла/Содом claim deleted, stale manuscript counts updated, overclaims pulled to the inference register; plus a Card 06 gap the MK-s4 agent first missed (Јован 8:6 removed from the eyewitness list, Bauckham names list corrected). All three orthodoxy-gated CLEAN; MK integrity verified (div balance, scripts/Supabase key untouched, zero Latin-in-Cyrillic contamination). The MK mirrors have no "Case, Plainly" tier (EN-only), so those EN changes had no MK equivalent.

**STILL OPEN after the audit + MK sweep (separate future passes):** (1) the linked English **deep-dive essays** (`library/manuscript.html`, `prophecy.html`, `canon.html`, `bigbang.html`, `kalam.html`, `finetuning.html`, `moral.html`, `evil.html`, etc.) were NEVER audited — they may carry the same quotation-inflation/stale-fact problems as the cards, and the **MK essay translations** (`library/mk/*.html`) mirror them, so both need a citation+calibration audit as their own pass; (2) ~20 CHECK-level unverified quotes on `ev-s1`/`ev-s5` were made safe by de-quoting but a human with the source books should source-or-cut; (3) the standing native-Macedonian fluency/doctrinal review now also covers the new MK phrasings (esp. the longer added paragraphs — the Problem-of-Evil internal-critique reply and the ontological "sharpest modern objection" sentence).

**Deep-dive essay audit DONE for 3 tabs (2026-07-03) — item (1) above now largely resolved for Bible + God's Existence + Science.** All **30** deep-dive essays behind those three tabs got a full `apologia-citations` fact-check: 11 Bible-tab (`manuscript, consistency, prophecy, deadseascrolls, earlydate, eyewitnesses, canon, archaeology, names, coincidences, jewishness`), 12 God's-Existence (`kalam, leibniz, thomistic, finetuning, moral, ontological, consciousness, reason, beauty, religious, desire, evil`), 7 Science (`bigbang, originlife, mathematics, cambrian, cosmic, privileged, laws`). **Headline: ZERO fabrications and ZERO doctrinal blockers across all 30** — the essays went through the full pipeline; the fabricated quotes were confined to the *card* layer (`ev-s1/ev-s4/ev-s5`, already fixed). This is strong evidence the essays are the trustworthy layer and the cards were the drift layer. Only minor quote-precision fixes applied and deployed (commits `893a1a3`, `becb070`, `49ad2aa`): the one substantive catch was a **backwards probability comparison in `originlife.html`** (one-in-10^77 was said to "dwarf" the universe's ~10^97 trial-events — it doesn't; rewritten so the argument rests on the compound integrated-system improbability, which is correct). Other fixes were de-quoting paraphrases-inside-quotation-marks (evil/Mackie, beauty/Wigner-Swinburne-Edwards, deadseascrolls/Burrows, cambrian/Marshall, originlife/Conway-Morris), single-word verbatim corrections (thomistic, desire/Kreeft, mathematics/Hamming, ontological/Descartes, kalam+bigbang/Vilenkin punctuation), two real citation-attribution fixes (canon/Sundberg-Hahneman, reason/Fitelson-Sober-not-in-Beilby, bigbang/Vilenkin-quote-provenance), and one added-objection (`eyewitnesses` now names the Gregor-Blais onomastic critique). MK mirrors: `mk/kalam.html` + `mk/evil.html` got the same two fixes translated. **Several essays flagged as exemplary templates** (hold up for future drafting): `archaeology` (setting-not-proof guardrail), `finetuning` + `cosmic` (explicit data-conceded/design-contested), `moral` (ontology-vs-epistemology), `laws`.

**Deep-dive essay audit COMPLETE — all 7 tabs / ~78 essays done (2026-07-03, Wave 3).** The remaining four tabs got the same full `apologia-citations` fact-check, in four batches, all deployed:
- **Resurrection (11):** `appearances, burial, disciplesbelief, earlycreed, emptytomb, minimalfacts, multiatt, paulconv, postres, respred, sceptics` — 0 blockers/fabrications; 9 minor fixes (commit `7a71004`); MK mirrors `mk/minimalfacts, mk/emptytomb, mk/paulconv` updated (`3a4fceb`).
- **Jesus (12):** `daniel70, hands, hist_jesus, jesus_as_god_nt, jesus_claims, jesuschar, john11, messianic-prophecy, phil2, titles, uniqueness, virginbirth` — 0 blockers/fabrications; 7 minor fixes (`0ceca2a`). Confirmed the earlier "Christopher McGrath" flag was a **misnamed real scholar** (James F. McGrath, the Bauckham divine-identity critic), NOT a fabrication — the same misnaming recurred as "Alister McGrath" in `nt_trinity`; both fixed.
- **Trinity (10):** `early_church_trinity, eternal_generation, modalism, nt_trinity, ot_trinity, philosophical_trinity, shema, trinity_islam, trinity_jw, trinity_mormons` — 0 blockers, 0 fabrications, **0 doctrinal drift** (strict Nicene throughout); 7 minor fixes (`027c76e`). The two highest-risk essays for the retired **echad compound-unity overreach** (`shema`, `ot_trinity`) both explicitly **refute** it — they are the positive template. `trinity_jw` does NOT recur the reversed-BeDuhn problem (BeDuhn isn't cited; rests on Harner qualitative theos).
- **Islam (13):** `islam, islam-dilemma, islam-eternalword, islam-guard, islam-hadith, islam-jesus, islam-naskh, islam-preservation, islam-prophecy, islam-qiraat, islam-sira, islam-tawhid, islam-wahy` — 0 blockers/fabrications; 6 minor fixes (`0a532a1`). Every Qur'an/hadith citation checked was verbatim; "charity is accuracy" held throughout (Islamic positions steelmanned, no false symmetry, double-standard trap avoided). (`islam-contradictions` + `islam-jesusmuslim` were pipelined earlier this session.)

**Grand result across all 3 waves (~78 deep-dive essays, every EL tab): ZERO fabrications, ZERO doctrinal blockers.** This definitively confirms the essays are the trustworthy layer; the fabricated quotes lived only in the *card* layer (already fixed). All fixes were quote/citation precision — de-quoting paraphrases-in-quote-marks, verse-range/scholar-name/date corrections, one backwards-probability rewrite (`originlife`). More exemplary templates from Wave 3: `archaeology`-quality calibration in `shema`/`ot_trinity` (refute-the-overreach), `islam-naskh`/`islam-prophecy`/`islam-sira` (charity=accuracy done right), `phil2` (Chalcedonian kenosis), `messianic-prophecy` (every contested cross-ref gives the Jewish counter-reading).

**Still open on this thread:** (a) **MK essay translations** beyond kalam/evil/minimalfacts/emptytomb/paulconv (`finetuning, hist_jesus, jesus_claims, manuscript, moral`) still want their own citation pass — none had errors mirrored from EN this session because the EN fixes were English-verbatim-specific; (b) a handful of **CHECK-level page-cites** the audits couldn't pin at page level (Craig `Reasonable Faith` pp.172-183 in moral/thomistic; Lüdemann p.38 now applied to earlycreed/paulconv/mk; a few Wright/Meier page ranges) for an eventual human-with-the-books pass; (c) **human/pastoral sign-off items** flagged but non-blocking: the Moltmann/patripassianism line in `evil.html`; the `islam-dilemma` 10:94 literal-vs-rhetorical-doubt gloss (an `apologia-argument` judgment, already noted); a few unverified isnad gradings in `islam-guard`; and — most relevant for high-stakes acquisition — the Trinity and Islam tabs generally.

## Proposed next steps (not started)
- **Spanish essay translation** — far larger reach than Macedonian; reuse the exact pipeline (translate → orthodoxy gate → `hreflang`/switcher → deploy).
- **Marketing plan execution** (`docs/MARKETING_PLAN.md`): repoint the homepage hero CTA off the dead `#pricing` to the free AI tool; add the activation/retention/referral PostHog events; `/answers/` SEO pass; creator (YouTube) outreach.
- **More `/answers/` pages** via the flywheel (resurrection + Bible-reliability clusters are the next best SEO targets).
- **Extend the hub toggle** to additional languages (toggle infra now exists).

## Key files & how to use them
- **Answers flywheel:** edit `answers/_data.json` (append an entry) → run `node tools/gen-answers.mjs` → paste the printed index + sitemap snippets → deploy. Public answers are doctrinal → orthodoxy-gate new ones first.
- **Related panel:** `library/related.json` (+ `library/related.js`). Regenerate after adding essays: `python3 tools/build-related.py`.
- **Macedonian:** `library/mk/*.html` (10 essays) + `library/mk/index.html`; `ev-s{1..7}.mk.html` (hub fragments). Toggle logic lives in `evidence-library.html` (`LANG`, `I18N`, `setLang`, `applyChrome`, and the `loadSection` fetch suffix).
- **Capture endpoint:** `api/submit-question.js` (mirrors the Resend/PostHog setup in `api/new-signup.js`).
- **Agent fleet & pipeline:** `.claude/agents/*.md` + the pipeline table in `CLAUDE.md`.

## A reusable check before deploying translated content
For any AI-translated page, verify: (a) `<sup>`↔`<li>` footnote parity vs the English; (b) no scripts altered and the Supabase key / API URLs are ASCII-clean; (c) **no mixed Cyrillic+Latin words** (Latin look-alikes a/e/o/c/p/x slipping into Cyrillic words — this happened several times this session); (d) run the orthodoxy gate for neutrality (no Eastern-Orthodox drift).
