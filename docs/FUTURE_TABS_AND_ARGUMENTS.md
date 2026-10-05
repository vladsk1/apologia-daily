# Future tabs & new arguments — parked ideas (owner will build later)

> **Status: PARKED by owner, 2026-10-05.** "I will do these, just not now."
> This note records (A) the net-new tab/essay/argument opportunities the research
> library supports, and (B) a simple list of the ~54 open content-backlog rows as of
> 2026-10-05. Nothing here is built. When one is picked up, run it through the full
> MANDATORY content pipeline in `CLAUDE.md` and move the row to Done in
> `docs/content-backlog.md`.

---

## A. Net-new build opportunities (the actual answer to "can we add tabs/arguments?")

**Headline finding from the whole research corpus:** most mined books came back
**corroboration / "ours is already better"** — the popular-level books (Strobel *Is God
Real?*, Craig *On Guard*, Geisler–Turek) yield ≈ **zero** new arguments. The genuinely
new material is in the **scholarly monographs** (Bauckham, Loke, Gathercole, Schmidt) and
the **open-access journals**. So the corpus gives a *handful* of real new arguments, one
real new essay, and one real new tab.

### What "fully built" means (architecture reminder)
A **tab** (ev-s1…s8) is a whole *category*. One **argument** inside a tab = four artifacts:
1. deep-dive **essay** — `library/<slug>.html`
2. **tab card** on the tab fragment — `ev-sN.html`
3. **mastery page** — `ev-m-<slug>.html`
4. wiring — `sitemap.xml`, `library/index.html`, `ARG_TAB`, EN→MK/ES mirror, (optional) pocket card

### A1 — The one true NEW TAB: "World Religions"
- **Why it's a tab:** it's a whole category, and the content **already exists and is certified** —
  ~18 `library/islam-*.html` essays + `trinity_jw.html`, `trinity_mormons.html`,
  `religious.html`, `uniqueness.html`, `sceptics.html`. They currently have **no tab**
  (reachable only via `worldviews.html` + the library index).
- **Work:** assemble a tab from existing essays + write tab cards (ported from the essays) +
  mastery pages + wiring. Same move as the ev-s8 "Christian Revolution" tab. **Low research
  cost, high reach.** Highest-stakes tier (Islam/deity) → dual-consensus on every card.

### A2 — NEW ESSAYS / ARGUMENTS (each lives *inside an existing tab*, not a new tab)
| # | Argument | Source | Tab | Full build? | Guardrail |
|---|---|---|---|---|---|
| 1 | **"God Crucified" — the cross as revelation of the divine identity** (cry of dereliction, Mark 15:34/Ps 22:1; Isa 52:13↔6:1↔57:15) | Bauckham, *Jesus and the God of Israel* (mined 2026-10-05; "biggest GAP vs our site," rows JGI-1/JGI-2) | **Jesus (s3)** / cross-link Trinity (s6) | New essay + card + mastery | ⚠ patripassianism — Son *in his human nature* suffers, not the divine nature/Father. `orthonote` + dual-consensus |
| 2 | **Synoptic preexistence — the "I have come" sayings** (Mark 2:17, Matt 5:17, Luke 12:49) | Gathercole, *The Preexistent Son* / `gathercole-i-have-come-sayings.md` | **Jesus (s3)** | New essay + card + mastery | ⚠ `christ-before-bethlehem.html` **deliberately omitted** it: parallel is to the *form* of the saying, not the *nature* of the speaker ("speaks like an angel" = Arian/JW). Dual-consensus + `orthonote` |
| 3 | **The Testimonium Flavianum done properly** (authenticity, neutral reconstruction, Josephus's first-hand family link via Ananus II) | Schmidt, *Josephus and Jesus* (OUP 2025) — owned, mapped, barely surfaced | **Jesus (s3)** or **Biblical Reliability (s4)** | Either a new essay+mastery **or** enrich `hist_jesus.html` | Schmidt's novel source-theses = "one scholar's case"; authentic core *reports* the belief, doesn't affirm it |
| 4 | **"It just got exaggerated in the retelling" (telephone-game / memory distortion)** answered from oral-tradition + memory science (Vansina, Rubin) | Loke, *Investigating the Resurrection* ch. 7 | **Resurrection (s2)** | Most likely an **expanded section in `disciplesbelief.html`**, not a standalone essay | Partly shipped already; sincerity ≠ truth fence |
| 5 | **"Properly basic belief in God" (Reformed epistemology / Plantinga)** | Craig Defenders series — the one genuine gap in the six-argument set (backlog L181) | **God's Existence (s1)** | New essay + card + mastery | denominational-neutral; properly-basic ≠ a proof |

**Recommended order when resumed:** (1) World Religions tab → (2) "God Crucified" essay →
(3) Plantinga essay. #3/#4 (Josephus, telephone-game) are "essay-or-enrichment" judgement calls.

Weaker / deferred candidates (don't build on our own initiative): the 1 Cor 15:15
anti-hoax lever (a plank, not an essay); Klavan's quantum-mechanics → Mind → God (contested
minority interpretation; owner decision; `consciousness.html` already exists).

---

## B. The open content-backlog (~54 rows as of 2026-10-05)

Measured by a full sweep of `docs/content-backlog.md` on 2026-10-05 (rows referenced by
line number `L###`; P1–P4 = priority). These are **enrichments and fixes to existing
essays + mirror lag** — NOT new arguments or tabs.

### s1 — God's Existence (7)
- **L81 (P3)** `finetuning.html`: add Barnes 2018 Bayesian reply to the measure problem at the "unfinished business" line.
- **L85 (P3)** Add neutral SEP state-of-field links (Cosmological Argument → `kalam`/`bigbang`; Moral Arguments → `moral`).
- **L86 (P4)** `evil.html`: optional paragraph on Draper's "Hypothesis of Indifference" (Noûs 1989).
- **L90 (P3)** Deferred ports/hedges on `ev-s1` cards 04 (moral) + 09 (religious) + `diagram.js` (redo as proper ports).
- **L91 (P3)** Deferred POLISH from the Kalam figure gate: `ev-s1` card 01 scope-box wording + `diagram.js`.
- **L214 (P2)** Propagate the patripassianism/Moltmann fence to the Spanish mirror `library/es/evil.html`.
- **L304 (P3)** `kalam.html`: use the published BGV title; EN fixed, mirrors (`es`/`mk`) + `ev-m-kalam` still owed.

### s2 — The Resurrection (13)
- **L56 (P3)** `burial.html`/`minimalfacts.html`: Quintilian *Decl. mai.* 6:9 spear-thrust/death-assurance corroboration.
- **L57 (P3)** `burial.html`/`emptytomb.html`: Crossan burial concession (Jehohanan) against "left to rot."
- **L58 (P4)** `appearances.html`: add Acts-vs-Paul source-layer hedge to the Acts 10:41 point.
- **L76 (P3)** `ev-s2` card 01: soften the "women's testimony not accepted in legal proceedings" overstatement.
- **L77 (P3)** `ev-s2` card 01: reword subtitle + "In plain English" that under-tier the empty tomb.
- **L82 (P3)** `respred.html`/`earlycreed.html`: add Pickup on "on the third day" as a chronological datum (JETS 2013).
- **L225 (P4)** `disciplesbelief.html`: add the martyrdom apparatus (1 Clement 5; Ignatius *Smyrn.* 3:2/3:4; Polycarp) — legendary lists out.
- **L343 (P3)** Nils Dahl *Jesus the Christ* p.15 in the crucified-Messiah paragraph of `paulconv`/`disciplesbelief`.
- **L369 (P3)** `earlycreed.html`: Habermas's "forty-one early creeds" framing (verify count).
- **L371 (P4, BLOCKED)** James Ware *NTS* 2014 on *egeirō*/*anastasis* as bodily — needs the article.
- **L385 (P3, PARTLY DONE)** `disciplesbelief.html` modern messianic parallels: **Chabad half still open** (Sabbatai Zevi done).
- **L386 (P3, BLOCKED)** `emptytomb.html`: steelman Crossley's objection to the women-witness argument.
- **L183 (P4, CANDIDATE)** Mine NTWrightPage (Second-Temple "resurrection") into `appearances.html` — no New-Perspective import.

### s3 — Jesus (11)
- **L68 (P4)** `hist_jesus.html`: siblings multiply attested (Mark 3:21/31–32); attribute "sublunary crucifixion" to Doherty.
- **L309 (P3)** `ev-s3.html`: name the Granville Sharp rule for Titus 2:13 / 2 Pet 1:1.
- **L341 (P3)** `jesus_as_god_nt.html`: Theos/Christos interchange as a presupposition-marker (Fee; not the unverified 599/536 stat).
- **L342 (P3)** `hands.html`: add Isa 40:13 → 1 Cor 2:16 ("the mind of Christ").
- **L344 (P4)** `jesus_as_god_nt.html`: the *Abba* + *Marana tha* Aramaic-fingerprint (Hengel p.77) — *Abba*/Hengel still absent.
- **L345 (P4)** `phil2.html`/`jesus_as_god_nt.html`: 1 Cor 10:4 "the rock was Christ" as a non-hymn preexistence datum.
- **L346 (P4)** `hands.html`: Paul applies Isa 45:23 to Christ twice (Phil 2:10 + Rom 14:10–11).
- **L355 (P2, PARTIAL)** 21 Jesus-tab essays: remaining gaps + book-only cite checks from the 2026-09-29 over-charity sweep (see `docs/JESUS_TAB_SWEEP_BACKLOG_2026-09-29.md`).
- **L361 (P2, PARTIAL)** Islam cluster swept; **only `john11.html` still owed** the over-charity review-and-fix.
- **L368 (P3)** `hist_jesus.html`: Eusebius's restrained use of the Testimonium as positive evidence for a neutral core.
- **L127 (P3)** Reel spec `tools/reel/specs/jesus-titles.json`: review spoken "enthroned beside God" before posting.

### s4 — Biblical Reliability (2)
- **L319 (P4)** `ev-m-deadseascrolls.html`: port the rubric P2 (pluriformity concession) into the visible syllogism + mock-scorer.
- **L321 (P4)** Two Dead Sea Scrolls wording polishes (`deadseascrolls.html` ~line 138; `ev-m` checks[] hit string).

### s5 — Science & Faith (1)
- **L130 (P2, BLOCKED — owner call)** `miracles.html` `/sources` live-door for Hume/Spinoza: (a) leave out of live retrieval, or (b) distil an our-own-words objection+reply into a gated `/briefs` entry. (See `docs/SCIENCE_FAITH_SWEEP_BACKLOG_2026-10-04.md`.)

### s6 — The Trinity (7)
- **L308 (P3)** `ev-s6.html`: add Rev 3:14 *archē*=origin/source as the third rebuttal leg (re-gate; pending stamp debt).
- **L340 (P3)** `nt_trinity.html`: add the 4 missing Fee Pauline triads + a Pauline "one God" list.
- **L350 (P3, PARTIAL)** `ev-s6` card 11 (JW): open — "only major translation…'a god'" overclaim, "highest word…" overstatement, missing Great Apostasy objection.
- **L358 (P3)** 16 Trinity-tab essays: gate-accepted backlog from the 2026-09-28 sweep (see that doc).
- **L362 (P3)** Add a retired-claims entry for the JW *meizōn*/*kreittōn* argument.
- **L363 (P3)** `ev-s6.html` + `.mk` cards 01–09,14–17: gate-accepted structural backlog (steelmans, Matt 28:19 note, Chalcedon, EFS wording, etc.).
- **L364 (P3)** 15 `ev-m-*` Trinity mastery pages: gate-accepted backlog (track-order labels, scorer redesigns, R-prong checks).

### s7 — Conversion Stories (0)
- None open. (`paulconv.html` lives in the s2 hub, not here.)

### s8 — The Christian Revolution (2)
- **L92(d) (P3)** Pastoral sign-off owed on all seven ev-s8 essays (see `docs/CHRISTIAN_REVOLUTION_SWEEP_BACKLOG_2026-10-04.md`).
- **L290 (P3)** `equality.html`: add Berman's Gregorian "papal revolution" framing (*Law and Revolution*, 1983); Siedentop p.249 unconfirmed.

### Cross-tab / mirror-wide (3)
- **L40 (P2)** 8 Spanish hub mirrors + `library/es/*` lag English ~6,560 lines — re-translate + two-lens gate + native-Spanish sign-off (spans all 8 tabs).
- **L333 (P3)** English-source defects surfaced by the MK re-translation, items (a)–(k) still open (ev-s2/3/4/5/6 + MK mirrors).
- **L334 (P4)** Macedonian mirror residual lag (`library/mk/*`, `ev-s4.mk`, stray strings, native MK review).

### Not under any current tab (6)
**World religions / Islam** (no tab today — see A1):
- **L83 (P3, BLOCKED: acquire Nickel 2011)** `islam-dilemma.html`: Muqatil ibn Sulayman grounding for *taḥrīf al-maʿnā*.
- **L84 (P3)** `islam-jesus.html` fn 196: upgrade the *rūḥ* anchor to a scholarly lexicon (Sinai).
- **L226 (P2, PARTLY DONE)** `islam-dilemma.html` antiquity witnesses: *Apology of al-Kindi*, George of Be'eltan, Leo III/ʿUmar II (John of Damascus done).
- **L365 (P3)** 16 `library/islam*.html` essays: gate-accepted backlog (Q 5:116–117 & 43:63–64 gap flagged most important; Abu Dawud 4449; CHECKs).
- **L366 (P3)** `worldviews.html` Islam cards 1–15: gate-accepted backlog ("lost verses" wording, retired-claims entry, citation swaps).

### Other layers (not tabs) (3)
- **L147 (P2, ON HOLD — owner says do NOT pick up)** Pastorally redesign + re-add the "Suffering & Evil" answer category (11 answer pages).
- **L271 (P3, PARTIAL)** `speed-round.html`/`daily-mix.html`: answer-length "tell" still open (correct answer systematically longest); rescope the P1 row to the whole quiz layer.
- **L88 (P3, PARKED — owner)** Sticky card-header option for long Evidence Library cards (prototype unserved).

### Candidate source-mining programs (enrichment, not new essays)
- **L182 (P3)** Mine Tyndale Bulletin (OA) to citation-upgrade Biblical-Reliability / archaeology / historical-Jesus / Gospels essays.
- **L181 (P3)** → counted in A2 as the Plantinga new essay (s1).

**Totals (measured 2026-10-05):** 54 open rows — s1:7 · s2:13 · s3:11 · s4:2 · s5:1 · s6:7 · s7:0 · s8:2 · cross-tab:3 · world-religions:5 · other-layers:3.
Finer-grained open items live in the per-tab sweep docs: `JESUS_TAB_SWEEP_BACKLOG_2026-09-29.md`,
`BIBLICAL_RELIABILITY_SWEEP_BACKLOG_2026-09-29.md`, `GODS_EXISTENCE_SWEEP_BACKLOG_2026-10-01.md`,
`SCIENCE_FAITH_SWEEP_BACKLOG_2026-10-04.md`, `CHRISTIAN_REVOLUTION_SWEEP_BACKLOG_2026-10-04.md`.
