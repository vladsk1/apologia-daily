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
