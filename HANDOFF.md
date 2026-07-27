# Apologia Daily — Session Handoff

_Last updated: 2026-07-26. Read this together with `CLAUDE.md` to resume with full
context at minimal token cost. Everything below is already committed to git; the chat
that produced it can be discarded._

## Archived project-guide status entries (2026-07-03 → 2026-07-25)

These are the dated status entries that used to sit at the top of `CLAUDE.md`. They were moved here
on 2026-07-26 because `CLAUDE.md` is auto-loaded into **every** session, and roughly half of it had
become superseded history — context spent on archaeology rather than on the task at hand.

**Nothing was discarded.** Every entry is reproduced verbatim below, in its original order. Every
standing RULE they introduced already lives in the rules half of `CLAUDE.md` (the guardrails, the
mandatory pipeline, the explicit-verdict rule, the false-common-ground rule, the research-library
cross-check step), and every OPEN item they contained was consolidated into the
"OPEN — needs a human" section at the top of `CLAUDE.md`, so nothing outstanding got quieter by
being moved.

Read these for the *why* behind a past decision. For current state, read `CLAUDE.md`.

---

> **2026-07-25 (live-AI routing + answer-format fixes + mathematics reel rebuild).** Three shipped, all
> gated + live on `main`. (1) **Topic-classifier fix** (`api/ask.js`, dual-consensus CLEAN): a core Trinity
> coherence question ("the sending of the Son by the Father looks like a hierarchy") was misclassified DENOM
> (filioque/procession collision) and given the denominational brush-off — now routes subordination /
> "hierarchy in the Trinity" / eternal-generation / sending-of-the-Son / monarchy-of-the-Father / taxis
> worries to ONTOPIC as core Nicene anti-Arian defense, while DENOM still fires on actual East-West procession
> side-taking (orthodoxy + neutrality both CLEAN; classifier routing only, answer generator/guardrails
> unchanged). (2) **Origin-of-objection answer element** (`api/ask.js`, orthodoxy CLEAN): the Asked & Answered
> hero promised "the skeptic who raised it first (often centuries ago)" but the format never delivered it —
> added a conditional "WHERE THE OBJECTION CAME FROM" one-liner (Hume 1748, Celsus ~AD 178, etc.) with an
> ABSOLUTE no-fabrication limit (OMIT rather than guess; "engaged ever since" not "answered" to avoid
> tidy-theodicy overstatement). (3) **Mathematics reel rebuilt** (`tools/reel/specs/mathematics-god.json`,
> argument SOUND + orthodoxy CLEAN) to foreground the argument explicitly ("AN ARGUMENT FOR GOD / Is
> mathematics evidence for God?" → states the inference at scene 7 → "signpost, not the whole map" bound),
> + matching X card + X thread + IG caption. Tests 47/47. (Parallel local session shipped the Bible-unity
> "one story" reel + card alongside.)

>
> **2026-07-24 (Active-Reading curated takeaways — COMPLETE, 85/85 essays).** Finished the curated
> version of the Active-Reading Layer: every deep-dive essay's recall checkpoint now reveals a
> **hand-curated one-line "key point"** for that section (in our own words, distilled from the
> already-certified prose) instead of the first-sentence memory-jog. Shipped in 7 gated batches —
> **632/632 sections across all 85 essays** now curated (`library/active-reading-data.json`;
> `active-reading.js` still falls back to the section's opening sentence for any sub-threshold or
> future section, so there's no gap or upkeep). Every batch ran the full content pipeline; the
> high-stakes tiers (Jesus/deity, Trinity, Islam, Paul's conversion) got **dual-consensus +
> neutrality** (argument + orthodoxy + apologia-neutrality all CLEAN). This session landed the last
> two: **batch 6 Trinity** (14 essays, 113 takeaways, `d954cb3` — 3 fixes) and **batch 7 Islam
> cluster + paulconv** (17 essays, 130 takeaways, `00b1eaf` — 7 fixes). Zero HERESY/BREAK/MAJOR
> across both; every fix stripped a standalone-pull-quote risk while keeping the essay's own bounded
> verdict (concede the observation not the inference; "shared words, not shared belief"; explicit
> verdict landed). Per-batch provenance (dates, gates, each fix) is in
> `active-reading-data.json` → `_meta.batches`. Browser-verified live. Spec: `docs/ACTIVE_READING_SPEC.md`.
> (The two standing stamp-integrity flags — `evil.html` category-pull, `worldviews.html` SEO schema —
> are pre-existing, not from this work.)

>
> **2026-07-24 (video-research mining run + NEW mandatory cross-check rule + archaeology enrichment).**
> Mined **5 apologetics videos** into `docs/video-research/` (notes + INDEX/ledger rows; transcripts stay
> git-ignored): the **Peterson Academy OT-canon lecture** (`pkSoTR_vhmg` — ⚠ denominational-neutrality zone,
> mine the shared history NOT the "Jerome is right" verdict; corroboration of the already-neutral
> `canon.html`); the **Sean McDowell × Rob Bowman deity-of-Christ two-parter** (`dXxVS2B96Ns` + `72LX8_zwiVw`
> — the HANDS framework; corroboration of our most-developed area, which already cites Bowman & Komoszewski);
> **McDowell × Titus Kennedy "People of the Bible"** (`-4RwBPrsXVU` — 10 attested biblical figures); and
> **McDowell × Spencer Klavan "Light of the Mind"** (`-gHic1q-0qg` — science/God). **Instituted a standing
> process rule:** a **MANDATORY live-content cross-check** is now part of every mining run (book/video/article)
> — encoded in `CLAUDE.md` § *Content backlog* + wired into all three research-library READMEs — so a mined
> source is classified corroboration-vs-improvement against the live site, on-record, instead of sitting in a
> note. The cross-checks surfaced **3 backlog items**: a **John 17:22 "shared glory" objection** gap (P3,
> open); the **quantum-mechanics-→-Mind argument** (logged then **DECLINED** by owner — too contested to build
> safely); and a **P3 archaeology enrichment, now DONE + LIVE** — [`library/archaeology.html`](library/archaeology.html)
> now names two concrete *doubted-then-confirmed* figures (**Ahab** on the Kurkh Monolith; **Belshazzar** via
> the Nabonidus Cylinder/Chronicle/Verse Account → co-regent → explains Dan 5:16's "third place"), new fn 8,
> sup-li 16/16, all gates passed (citations 0 errors, argument SOUND + 3 scope/honesty refinements, orthodoxy
> CLEAN; setting-not-truth rule held). ⚠ **This session the dedicated `apologia-argument`/`-orthodoxy` agents
> were de-registered**, so those two lanes ran via general-purpose agents primed with the CLAUDE.md guardrails
> (recorded in the essay's stamp). **Open (human):** the John 17:22 P3 row awaits execution.

>
> **2026-07-24 (research-library audit execution + new miracles essay + Islam cluster + reel + 3rd research library).**
> Executed the owned-library audit batch, all dual-consensus/gated + deployed: **resurrection-audit essay
> enrichments** (Cook→`appearances`, Gallio/Delphi + Lapide + Kloppenborg→`earlycreed`, Burridge→`earlydate`,
> Michael Martin→`paulconv`) + a **new `/answers/did-jesus-really-die-on-the-cross`** (medical/swoon) + a
> **live nav-bug fix** (raw `<a>` in two answer bodies were esc()'d to literal text → moved to the go-deeper
> row via new gen-answers `essay2` support); **`bigbang.html`** agnostic-Jastrow "band of theologians" close;
> a **NEW Science-&-Faith deep-dive [`library/miracles.html`](library/miracles.html)** "Can Miracles Happen?
> Answering Hume & Spinoza" (Hume *Enquiry* §10 + Spinoza *TTP* ch.6, both PD-verified; miracles-rule held;
> wired into library index/sitemap/search — **`ev-s5` argument card still TODO**); and the **Islam cluster**
> (dual-consensus+neutrality CLEAN): `islam-preservation` "Material once recited, now absent" (Muslim
> 1050/1452a, Bukhari 4944/4992; laḥn narration NOT used), `islam-prophecy` (Isaiah 21 + Daniel 2, ʿalam via
> BDB), `islam-dilemma` (accountability argument + Waraqah + 2:79; "Allah is evil" horn dropped). The
> `jesus_claims` Caiaphas/judge-from-heaven items were **DECLINED as redundant** ("no unnecessary updates").
> **Also:** a **Nabeel Qureshi conversion-story reel** (`tools/reel/specs/nabeel-qureshi-conversion.json`,
> orthodoxy+tone gated CLEAN, from the certified `ev-s7` card); and a **NEW third research library**
> [`docs/article-research/`](docs/article-research/) (sibling of book/video-research, for modern
> open-access journal articles/essays — ToS/legality rules baked in) with its first **two PARTIAL notes**
> (Bergeron&Habermas *ITQ* 2015 hallucination-clinical; Habermas *JSHJ* 2005 survey) — full-text mining
> **blocked by sandbox egress**, flagged PENDING for a web-enabled finish. Fixed a stale-`search-index.json`
> CI red (self-healed by the miracles-batch rebuild). **Open (human):** finish the two article-research
> notes' full-text mining locally; pastoral/elder sign-off still owed on the new deity/Islam Christology.

>
> **2026-07-23 (book-research: In Defense of the Bible +3 chapters; + CI baseline fix).** Expanded the
> owned-book note [`docs/book-research/in-defense-of-the-bible.md`](docs/book-research/in-defense-of-the-bible.md)
> from 1 to **4 mapped chapters** of the Cowan & Wilder volume (all from owner photos): **ch. 10 Barnett**
> "Is the NT Historically Reliable?" (8 theses; 93 fns), **ch. 11 Huffman** "Are There Contradictions in the
> Bible?" (3 cautionary principles + resurrection coordination; 75 fns), **ch. 16 Wegner/Wilder/Bock** "Do We
> Have the Right Canon?" (OT/NT canon + "lost gospels"; 98 fns), alongside the pre-existing **ch. 6 Wallace**.
> Wired into `INDEX.md` + `README.md`; logged the additive leads to `content-backlog.md`. **Every citation is
> an unverified lead** until run through the pipeline. Key flags recorded in the note: ch. 10 — do NOT
> reproduce the full Testimonium Flavianum (neutral core only), census/Quirinius contested, Star-of-Bethlehem
> speculative, Qur'an lines need neutrality reframe; ch. 16 — **the OT-canon/Apocrypha scope is
> denominationally sensitive** (use shared-tradition parts only). Also logged a **P2 backlog row** to
> pastorally redesign + re-add the "Suffering & Evil" answer category (pulled from main 2026-07-22 by
> `573421c`/`5efdafc`, pending pastoral redesign). **Separately fixed a red `orthodoxy-guards` CI job on
> main:** the tripwire baseline had drifted (52 already-reviewed refutation/attribution matches re-hashed
> after later HTML edits — same file+pattern set, no new content); regenerated with `--update` (verified
> identical pair-set) → all guards green again.

>
> **2026-07-23 (Nicene Creed tab treatment + kalam essay strengthening + video mining).** Shipped a
> **NEW Nicene Creed deep-dive** — [`library/nicene-creed.html`](library/nicene-creed.html), a
> phrase-by-phrase walk through the Niceno-Constantinopolitan (325/381) creed (complements
> `early_church_trinity.html`: that answers "was it invented," this reads what the text *means*) — plus its
> full Trinity-tab treatment: **`ev-s6` card 16** (a bridge card, no separate mastery page — a creed
> walkthrough is expository, not a single-syllogism argument), the gated **`nicene-creed-explained` brief**
> so the live `/api/ask` AI draws on it, and wiring (sitemap, `library/index.html`, search index).
> **Dual-consensus CLEAN** (argument + orthodoxy + neutrality) + citations; the **filioque is handled with
> strict denominational neutrality** (the page takes no side). **Orthodoxy-tripwire baseline pass:** reviewed
> all 52 previously-unbaselined whole-corpus matches (every one legitimate refutation/attribution context —
> Ehrman *How Jesus Became God* book-title cites, the "do Muslims/Christians worship the same God?" refutation
> pages, NWT/Mormon quotes-to-refute), accepted them on-record → `check-orthodoxy-tripwires` clean again.
> **Video-research:** mined the six-part W. L. Craig "Defenders" **kalam** lecture series into one note
> ([`docs/video-research/craig-kalam-defenders-series.md`](docs/video-research/craig-kalam-defenders-series.md))
> + ledger/INDEX/backlog rows (a citations pass caught + fixed 2 note-only errors), then **executed the
> backlog row to strengthen [`library/kalam.html`](library/kalam.html)** with four additions — the Grim
> Reaper paradox (Pruss/Koons), Tolman + Aron Wall's 2013 generalized-2nd-law thermodynamics, and
> Swinburne's personal-explanation route to the cause's personhood (Vilenkin-2015 was already fn7).
> Footnotes renumbered 11→15 (sup↔li integrity 15/15); all gates CLEAN; **divine-temporality neutrality
> kept** (Craig's own temporalism deliberately *not* adopted). **Open (human):** pastoral/elder sign-off is
> still owed on the new Nicene Christology (the automated gates certify CLEAN, but the stamp says so).

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



---

## Session 2026-07-26 — native app scaffolding, account deletion, monitoring truthfulness

**All deployed to `main`** (`42d5c32`). Tests **47 → 70**. Two `apologia-engineer` reviews drove most of it.

### What shipped
1. **Native app scaffolding (Capacitor)** — `ios/` + `android/` committed, `capacitor.config.json`
   (appId `com.apologiadaily.app`), `tools/build-app-bundle.mjs` → the git-ignored `app/www` (372 files,
   **allowlisted** dirs so `api/`/`lib/`/`sources/`/`briefs/`/`tools/`/`docs/`/`tests/` can never ship in a
   public binary), `tools/build-app-icons.mjs` → 113 icon/splash sizes. Assets ship **inside** the binary
   (offline-capable; a remote-URL webview is rejected under Apple 4.2). A **Capacitor-only `fetch` shim** in
   `analytics.js` rewrites `/api/*` → `https://apologiadaily.com/api/*`; strict no-op on the web, guarded by
   `tests/app-bridge.test.mjs`. RevenueCat plumbing (`app-purchases.js`, entitlement `pro`) is **INERT** — no
   keys, no paywall wired, cannot charge anyone. Runbook: `docs/APP_STORE.md`.
2. **In-app account deletion** (Apple 5.1.1(v)) — see CLAUDE.md header for the full design. Key structural
   fact: **Vercel Hobby caps the project at 12 serverless functions and `api/` is AT the cap**, so the route
   is folded in as `api/new-signup.js?do=delete-account`. That file now has **two auth models** (shared-secret
   webhook + user token); the user-authed branch returns before the secret gate.
3. **Monitoring made truthful** — `/api/health` now returns **503 when degraded** (it always returned 200,
   so the owner's UptimeRobot would have stayed green through a database outage — false reassurance).
   `monitor.html` stopped counting deliberately-skipped LLM pings as failures, and stays usable when
   `METRICS_SECRET` is unset.

### Two mistakes worth remembering
- **Over-rated a security finding.** The hardcoded `'Apologia2026!'` in the public `monitor.html` was called
  CRITICAL and the owner was told to rotate urgently. **`METRICS_SECRET` had never been set**, and
  `requireSecret` fails closed, so nothing was ever reachable. Correct severity: *latent*. **Check that an
  env var exists before rating a hardcoded secret.**
- **Wrote a docstring and a test for an invariant the code didn't implement.** `lib/delete-account.js` claimed
  the auth user was deleted last "so a mid-way failure cannot orphan data" — but it never *aborted*, so a
  failed table delete still destroyed the login while rows survived. The test asserted call *ordering*, not
  the skip, which is how it passed review. **Assert the behaviour that makes the invariant true, not a proxy.**

### Trust page (`editorial-standards.html`) — rebuilt, gated, live

Extended the existing page rather than adding `/how-we-check`: it was already linked from ~100 pages, so a
second page would have split authority for nothing. Three new sections — repo-counted figures, what the AI
can and cannot do, and six published corrections. Wired from the pricing block and the answers footer (the
"Reviewed for accuracy & orthodoxy" badge is now a link, so the assertion is checkable).

**`tools/update-trust-numbers.mjs`** regenerates the figures into a marked block and runs `--check` in CI.
It counts only **gated** briefs — `briefs-index.json` lists all of them and only `lib/briefs-verified.js` is
filtered, so counting the index would have made the page assert a review that had not happened the moment an
ungated brief landed.

**What the gates caught (both were worth their cost):**
- *argument* — 5 BREAK. The load-bearing one was an **implicature, not a sentence**: flagging only the
  doctrinal stage as automated invited the reader to assume the rest were human, so a critic discovering
  otherwise would re-read every figure as a model marking its own homework. The page now discloses the AI
  reviewers outright, framed as how a tiny team gates everything rather than spot-checking. Also killed three
  false guarantees — **"it cannot be quoted" is a non-sequitur** (the model knows the Fathers independently
  of retrieval; the real guarantee is verified-only retrieval *plus* instruction), "answers from our reviewed
  material" (contradicted by `retrieve-briefs.js`: at most one brief, high threshold, usually none), and
  "every page before it ships" (the gate's globs are essays/answers/tabs).
- *orthodoxy* ×2 — 0 HERESY both passes. The re-gate caught that, to make the confession vivid, the page had
  published **the two exact strings `tools/check-answer-concessions.mjs` exists to catch**. One removed
  entirely; the other kept with "wrongly" bound inside the same clause so the retraction survives a crop.
  A later self-check found the phrase a third time — inside the review stamp documenting its removal.

**Highest-value change, eight words:** the page said reviews run to "a fixed brief" without saying what the
brief *is*, which let a wary reader imagine a machine improvising doctrine. It now names the standard (the
creeds + `what-we-believe`) and links it.

**Standing rule this reinforces:** claims on that page must be *mechanically* true. Where a claim was
overstated we made the claim true rather than softening it — `demo/` was added to the tripwire globs so
"every published page" is literal, and the CI check was wired so "a build check fails if this drifts" is real.

### Owner actions completed this session
`SUPABASE_ANON_KEY` set in Vercel (**required** for deletion). UptimeRobot repointed from
`apologia-daily.vercel.app` (wrong host — green through a DNS/domain failure) to `https://apologiadaily.com`,
plus a new monitor on `/api/health`. `METRICS_SECRET` deliberately **not** set (PostHog + the Supabase
dashboard already give user counts).

### Open
- ⚠ **Account deletion has never run against live Supabase.** Test with a throwaway account before submitting.
- `push_subscriptions` has no `user_id` → other devices' subs linger until they expire. Fix: add the column,
  then add `['push_subscriptions','user_id']` to `USER_TABLES`.
- Pricing/paywall undecided; Apple ($99/yr) + Play ($25) accounts not created; **iOS `pod install` + Archive
  must run on the owner's iMac** — never attempted on Linux, neither native project has been compiled or
  device-tested.

---

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
2. ~~**English `ev-s4.html` has a factual error**: Luke 4:25 famine given as "153 years and four months" (conflated with John 21's 153 fish) — should be "three years and six months."~~ **RESOLVED** (commit `0fe1b25`): the line now reads "three years and six months" for the famine (Luke 4:25), with 153 correctly kept for John 21:11's fish; verified the bad string exists nowhere in the repo (EN + MK both correct).
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
