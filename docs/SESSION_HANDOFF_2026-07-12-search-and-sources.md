# Session handoff — 2026-07-12 (site search, Logos assessment, PD source library)

Continues the 2026-07-12 security pass (`docs/SESSION_HANDOFF_2026-07-12-security.md`).
Everything below is **deployed to `main`**. The headline open item is at the bottom:
**a web-enabled (local) session should verify + expand the `/sources` library** — this
build sandbox has the clean patristic hosts network-blocked.

## 1. Site-wide search (LIVE) — Logos quick-win #1
New **`/search`** page searches the whole site — 81 essays + 74 answers + 66 glossary
terms (221 records), client-side, no serverless function.
- `search.html` — live-as-you-type ranked search, type-filter chips, match highlighting,
  `?q=` deep-linking. Matching normalizes apostrophes + HTML entities (so "quran" finds
  "Qur'an", "gods" finds "God's").
- `tools/build-search-index.mjs` → `search-index.json` from certified sources
  (`library/index.html`, `answers/_data.json`, `glossary.html`). `--check` in CI.
- Discoverable: "🔍 Search" added to the canonical nav (`tools/sync-nav.mjs`, re-synced 180
  non-gated pages) + `/search` rewrite in `vercel.json`.
- **Known limit:** the index holds title + short description, not full essay bodies — a
  scholar named only *inside* an essay surfaces only where they appear in a title/blurb.
  Deeper recall = index more body text, or build Factbook hubs (#3).

## 2. Logos Bible Software assessment (product research)
Full assessment done (agent `apologia-product`). Logos = research suite for pastors/
seminarians; **not** built for skeptics/new believers — so adapt patterns, don't imitate.
Apologia already has the learner-equivalents of its crown jewels (Coach Skill Map ≈ Passage
Guide; Study Groups ≈ Faithlife community). Prioritized quick wins:
1. **Site-wide search** — ✅ DONE (above).
2. **Cite-this button + "Reviewed · Updated" byline** — surfaces data you already have
   (content-review stamps / `answers/_data.json` `reviewed`), + schema.org metadata for
   AI-search citability. Easiest on Answers (gen-answers template) + new-essay template;
   existing gated essays via a shared `cite.js` on their next content-review pass. NOT built.
3. **Factbook-style entity hubs** (Ehrman, Dawkins, Bauckham, Habermas, Ibn Warraq…) —
   auto-aggregate every essay/card/answer mentioning a name + a short sourced bio. Reuses the
   search-index engine; bios are new content → must pass the citation+orthodoxy gates.
   Generalizes the planned "Ehrman hub". NOT built.
Do NOT copy from Logos: original-language/interlinear tools, a buy-the-books marketplace,
its dense multi-panel UI, or AI features with "few safeguards".

## 3. Public-domain source library (`/sources`) — NEW SYSTEM, seeded
The "Logos library" idea, scoped to what's legal to reproduce: a searchable corpus of
**public-domain** primary texts (creeds, Church Fathers) the content agents quote + cite when
drafting. Full rules in `sources/README.md`.

**Legal line (important):**
- Store a text ONLY if the work **and its translation** are public domain (19th-c. Schaff
  ANF/NPNF, Roberts-Donaldson, Robertson; BCP 1662; pre-1929 works). Modern translations
  (e.g. Popular Patristics, ELLC 1988) are copyrighted even when the original is ancient — NOT
  allowed.
- **Never store any copyrighted book** (modern apologetics titles), even "internal use". Owned
  copyrighted books are used only as *research that points to primary sources*, expressed in our
  own words (ideas/facts aren't copyrightable; specific wording is). For the user's own books:
  photograph a chapter → extract the argument + the primary-source citations into notes → chase
  those primaries into `/sources` — do NOT store the book's text.

**Files:** `sources/README.md` (rules + schema), `sources/creeds.json`, `sources/patristics.json`,
`tools/build-sources-index.mjs` → `sources-index.json` (validates PD flag + fields + unique ids;
`--check` in CI). CLAUDE.md documents it under "Public-domain source library".

**The `verified` gate:** an entry is quotable in published content ONLY when `verified: true`
(exact wording confirmed against `source_url` by `apologia-citations`). Seeds start `false`.

**Current status (after a citations pass this session):**
| verified: true (quotable) | verified: false (pending clean primary) |
|---|---|
| Ignatius, Eph. salutation | Apostles' Creed (BCP 1662) |
| Ignatius, Eph. 7 ("one physician… made flesh, yet God") | Nicene Creed 325 |
| Ignatius, Eph. 18-19 | Niceno-Constantinopolitan 381 (no filioque) |
| Ignatius, Smyrn. 1-3 (corrected) | Chalcedonian Definition 451 |
| | Athanasian Creed (Trinity clauses) |
| | Athanasius, *On the Incarnation* §54 |

The 4 Ignatius passages were **verbatim-confirmed** against the reachable GitHub Clementson
1827 text. The citations pass also **caught + fixed two real defects**: the Apostles' Creed was
the copyrighted ELLC 1988 text mislabeled PD (→ swapped to PD BCP 1662); and Smyrn. 1-3 was a
composite splicing Roberts-Donaldson into a "Clementson" quote (→ corrected to clean
single-translation text). Good demonstration that the pipeline catches AI-drafting errors.

**Why the 6 are still pending — and the environment finding:** the clean canonical hosts
(ccel.org, newadvent.org, en.wikisource.org, earlychristianwritings.com) are **network-blocked
in this build sandbox** (403), and the only reachable copy is an OCR-damaged 1827 scan. So
citation-grade patristic text cannot be produced from here.

---

## ✅ DONE 2026-07-11 (web-enabled local session)
Action items 1–2 complete; item 3 begun (Ignatius + Athanasius ingested); 4–5 in place.
- **All 6 pending entries verified → `verified: true`** against clean PD primaries
  (CCEL Schaff, CCEL NPNF, traditional BCP). Two real defects caught + fixed: the
  Apostles' Creed `source_url` pointed at Gutenberg 45108 (**"P. T. Barnum's Menagerie"**,
  not the BCP) → fixed to 1662 BCP + exact 1662 caps restored; and the **381 creed text
  was a modern ecumenical (ICET/ELLC) rendering — copyright-risky**, the same trap as the
  Apostles' Creed → swapped to Schaff's verbatim PD text (filioque kept absent). Chalcedon
  got a "God the Word" comma fix; source_urls tightened to leaf pages.
- **Expanded (all PD, verbatim, verified):** `sources/ignatius-anf.json` — 17 passages,
  the 7 genuine (short-recension) Ignatian letters in Roberts–Donaldson (ANF); and
  `sources/athanasius-on-the-incarnation.json` — 9 passages of *On the Incarnation* in
  Robertson (NPNF), complementing §54 (which stays in `patristics.json`). Drafted by
  apologia-evidence, verbatim-verified by apologia-citations (3 corrections applied:
  Smyrn. 3 dropped-sentence, Smyrn. 1 editorial brackets, Eph. 7 connector).
- **`build-sources-index.mjs`** also had a win32 path bug (`import.meta.url.pathname`) fixed →
  `fileURLToPath`, so the build + `--check` run on Windows. Index rebuilt; CI `--check` passes.

## ✅ DONE 2026-07-11 (continued) — /sources browse page + 5 more Fathers
- **`/sources` browse page** (`sources.html`) — searchable, groups the library by author with
  dynamic chips (chronological), per-passage "Copy quote", source links, verified badges.
  Added "Source Library" to the canonical nav (`tools/sync-nav.mjs`, re-synced 180 pages) +
  the `/sources` rewrite in `vercel.json`.
- **Item 3 expansion done (5 authors, +30 verified passages):** `sources/irenaeus.json` (7,
  Roberts & Rambaut ANF), `sources/justin-martyr.json` (6, Dods & Reith ANF),
  `sources/tertullian.json` (6, Holmes/Thelwall ANF), `sources/augustine.json` (6, NPNF1
  Pilkington/Dods/Haddan/Gibb), `sources/eusebius.json` (5, McGiffert NPNF2). Drafted by
  apologia-evidence, verbatim-verified by apologia-citations (0 mismatches; it confirmed the
  Augustine text is genuine NPNF, not the Pusey paraphrase everyone quotes). Delicate-but-
  orthodox lines (Justin's taxis, Tertullian's Praxeas "in degree", Irenaeus/Athanasius
  deification, Augustine avoided predestination) are flagged in each entry's note for a future
  `orthonote` clarifier when quoted.
## ✅ DONE 2026-07-13 — 5 more Fathers + Athanasius deepened (library = 102)
- **+36 verified passages**, drafted by apologia-evidence, verbatim-verified by apologia-citations
  (5 archaic-form corrections applied — modernized web hosts had regressed pronouns; 0 fabrications):
  `sources/clement-rome.json` (6), `sources/polycarp.json` (5, incl. the Martyrdom), `sources/didache.json`
  (6), `sources/cyprian.json` (5), `sources/cappadocians.json` (7 — Basil, Gregory of Nazianzus, Gregory
  of Nyssa), and **Athanasius *On the Incarnation* expanded +7** (§3-5 creation/Fall, §33 prophecy, §47/§50
  Gentile-refutation + changed-lives, §57 conclusion), now 17 total.
- **COPYRIGHT NOTE:** the user supplied a PDF of *On the Incarnation* — it is the **Sister Penelope /
  C.S.M.V. 1944 translation with the C. S. Lewis introduction, still under copyright**. Not stored; used
  only as a reading guide. The 7 new Athanasius passages come from the PD Robertson (NPNF) text. Same
  trap as the ELLC/ICET creeds — modern translations of ancient works are copyrighted.
- **Delicacy flags** recorded in-entry for a future orthonote pass: Cappadocian generation/procession
  clauses (never quote the taxis clause alone), Cyprian's almsgiving/merit + "baptism of blood",
  Clement's justification (not a settled sola-fide proof) + apostolic succession, Didache baptism/eucharist
  (antiquity, not mode/efficacy). The Gregory-of-Nyssa excerpt is marked mid-sentence with a leading ellipsis.
- **`sources.html`** groups the new authors correctly (explicit rules so "The Didache", the two Gregories,
  and Polycarp+Martyrdom render cleanly), chronologically. **Library now = 102 verified passages.**
- **STILL TO EXPAND:** the remaining councils, plus Origen (with care), John Chrysostom, Cyril of
  Alexandria, Leo the Great, Vincent of Lérins — same PD-only, verify-before-quote discipline.

## ▶ ACTION FOR THE WEB-ENABLED (LOCAL) SESSION
Do this where CCEL/ANF/Wikisource are reachable:

1. **Verify the 6 pending entries** against clean public-domain primaries, then flip
   `verified: true` only on those confirmed exactly:
   - Apostles' Creed → BCP 1662 (Gutenberg/CCEL).
   - Nicene 325, Niceno-Constantinopolitan 381, Chalcedonian Definition → Schaff, *Creeds of
     Christendom* (`ccel.org/ccel/schaff/creeds1.html` / `creeds2.html`). Keep the 381 creed
     **without the filioque** (denominational neutrality — see its note).
   - Athanasian Creed → BCP Quicunque Vult.
   - Athanasius §54 → NPNF ser. 2 vol. 4 (`ccel.org/ccel/schaff/npnf204…`).
   Run `apologia-citations` (it has WebSearch/WebFetch) to confirm wording + section + PD status.
2. **Prefer Roberts-Donaldson (ANF) for Ignatius** in published citations — swap the Clementson
   text for the clean ANF wording once reachable (the Clementson entries note this).
3. **Expand** (all PD): full Athanasius *On the Incarnation*; the 7 genuine Ignatian letters
   (Ephesians, Magnesians, Trallians, Romans, Philadelphians, Smyrnaeans, Polycarp); then
   Irenaeus *Against Heresies*, Augustine, Justin Martyr, Tertullian, Eusebius, the creeds/
   councils. One `sources/<name>.json` per author/work, schema in `sources/README.md`.
4. After edits: `node tools/build-sources-index.mjs`, confirm `--check`, deploy (push branch →
   `main`). CI gates the index freshness.
5. Then the agents (`apologia-author`/`apologia-evidence`) can quote the **verified** passages
   with citations when writing Evidence Library essays + Answers.

## Other open items (unchanged from prior handoffs)
- Security pass: run `docs/STUDY_GROUPS_DISPLAY_NAME_FIX.md` (M4) in Supabase — last security step.
- Logos #2 (cite/byline) and #3 (Factbook hubs) not built.
- Trinity Memory Palace room for `early_church_trinity` (offered, not built).
- Monetization still a stub; don't run paid acquisition into it.
