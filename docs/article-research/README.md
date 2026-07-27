# Article-research notes — mining modern journal articles & essays for leads (sibling of `book-research/` and `video-research/`)

This folder holds **in-our-own-words research maps of copyrighted modern apologetics journal
articles and essays** (open-access journals, scholars' own posted papers, reference-encyclopedia
entries) — the argument's current shape plus an index of the **primary sources** the article cites
(Scripture, dated scholarship, data, named scholars) to chase down and cite *from the primaries*. It
is the exact sibling of `docs/book-research/` (owned books) and `docs/video-research/` (talks): a
**map of leads**, never a copy of the source.

> **Want to mine an article/essay?** Read this file, then follow the workflow below. Same discipline
> that produced the book- and video-research notes.

## The hard copyright + ToS rules (never bend these)
- **An article is a copyrighted LEAD, not quotable text.** The author's words belong to the author.
  Capture the argument's *shape* and its *citations* in **our own words** — no stored article
  excerpts, no quoting the essay as if it were our content or a source. The note points at quotable
  **primaries**; it is not a copy of the paper. **We never write "an essay/article said X"** — we
  cite the **primary** the article pointed us to, verified.
- **Use only genuinely-legal, free sources.** Allowed: **publisher-hosted open-access journals**
  (Themelios, JETS free archive, Tyndale Bulletin, etc.), **authors' / ministries' own posted PDFs**
  (garyhabermas.com, reasonablefaith.org, ntwrightpage.com), **permission-based legal aggregators**
  (BiblicalStudies.org.uk / "Theology on the Web"), and **peer-reviewed reference encyclopedias**
  (SEP, IEP). For a **partly-paywalled** journal (e.g. Philosophia Christi, Bulletin for Biblical
  Research), use **only the free portion** and say so in the note.
- **Never use piracy or gray-area copies.** **Sci-Hub = piracy, never.** On **academia.edu /
  ResearchGate**, a paper is usable **only if it is the author's own upload**, and even then prefer
  the publisher/author-site copy; if you can't confirm it's the author's own posting, treat it as
  unverified and don't use it. If the only free copy anywhere is a pirated one, the work is an
  **owned/paywalled-book-or-article candidate** (buy legitimate access), not a source — say so.
- **Read manually to harvest — do not scrape.** Pull the handful of articles you actually intend to
  mine. No bulk/automated extraction, even from open-access sites (respect each site's ToS; the
  Perlego ban's spirit applies — manual research reading only).
- **Never store or commit the article PDF/text.** If you download an open-access PDF to read it,
  write it to the **git-ignored** `docs/article-research/_pdfs/` and let it be. Only the
  our-own-words *note* (leads + argument map) is committed.
- **The article never becomes a citation, and never enters `/sources`.** `/sources` is
  **public-domain verbatim only** (work AND translation PD). A modern copyrighted article's text
  never goes there and never reaches a live answer directly.
- **Stay inside the guardrails** in `CLAUDE.md` (classical/Nicene orthodoxy, denominational
  neutrality, the argument-specific rules, "orthodoxy outranks charity"). Even peer-reviewed sources
  carry denominational tilt or heterodox drift — flag it in the note (see the standing flags below).

## Where this library is used (the two questions this answers)
- **Writing new content — YES, assess it per topic.** When drafting an essay, `ev-s*` card, or
  `/answers/*` entry, the INDEX is the **"what's the best source for this topic?"** router: `Grep`/`Read`
  `docs/article-research/INDEX.md`, take the argument shape + the strongest **primaries to verify**
  from the mapped note, then quote the **primaries** (verified) in our own voice. Consult this
  **alongside** `book-research/INDEX.md`, `video-research/INDEX.md`, and the `/sources` corpus, and use
  whichever has the best material for the topic.
- **Answering questions LIVE (`/api/ask`) — NO, not directly** (identical to the book/video notes: the
  live serverless endpoint **cannot** read `docs/`, and these are unverified copyrighted leads). But
  article-mined material **can** reach the live AI through the **same two gated doors any research lead
  uses** — never as a raw "article brief":
  1. **`/sources`** (verbatim quotes): only for a **public-domain primary** the article pointed to —
     **lead → verify the PD primary → add it to `/sources` as `verified:true`** → compiles into
     `lib/sources-verified.js`, which `api/ask.js` retrieves. (A modern copyrighted article itself is
     never eligible.)
  2. **`/briefs`** (our-own-words framing): **lead → verify the primaries → write/strengthen a
     CERTIFIED essay → distil a brief** in `briefs/_data.json` (its `reviewed` object must stamp BOTH
     `argument` and `orthodoxy`, +neutrality for the resurrection/deity set) → `node
     tools/build-briefs-index.mjs`. The brief is **our own words, twice-gated, provenance-traced to the
     certified essay** — never to the article, never attributed to the author.

## Trust boundary (why it's safe)
`copyrighted article/essay` (a lead) → an **our-own-words note** here → a **certified essay/answer**, a
**verified `/sources` PD primary**, and/or a **gated `/briefs` entry distilled from that certified
essay** → (only then) a live answer. The runtime never reads the article; only twice-checked,
our-own-words material (or a verified PD primary) reaches a visitor.

## Workflow — mining an article/essay
1. **Read it as a lead** (open-access URL, or download to the git-ignored `_pdfs/`). Pull out (a) the
   argument's spine in our own words and (b) every **primary source** cited — Scripture refs, scholars,
   books, dates, journal/data cites. The citations are the point.
2. **Write one note** per article (or per author/theme cluster) at `docs/article-research/<slug>.md`,
   mirroring the book/video-note format: a short header (title / author / journal or site / URL / access
   status [open-access / author-hosted / free-portion] / date + usage rules), the article's thesis, an
   argument map (beats in our own words → **primaries to verify**), a "Guardrail fit" note (flag
   overstatement / neutrality risk / heterodox drift / denominational tilt), and a cross-map to our
   Evidence Library tabs/essays and existing `/answers`.
3. **Cross-check every lead against our CURRENT live content (mandatory — the point of the library).** The
   mining run is **not finished when the note is written.** For each substantive lead, `Grep`/`Read` the
   on-site home for that topic — the certified `library/*.html` essay, the matching `/answers/*`, the
   `ev-s*` card, and any live `/briefs` or `/sources` entry — and classify it: **corroboration** (already
   covered accurately + current → no row) or **improvement** (corrects an error / updates stale info /
   strengthens with a new verified primary / opens a topic or objection we lack → a backlog row). Make the
   classification **visible in the note** (in "Live-door status") so a reader can see the scan happened. See
   the "MANDATORY CROSS-CHECK STEP" in `CLAUDE.md` § *Content backlog*.
4. **Log it in three places:** (a) a row in the **Mined-articles ledger** below (with live-door
   status); (b) a topic row in `INDEX.md`; and (c) for any lead that step 3 classified as an
   **improvement**, a row in [`docs/content-backlog.md`](../content-backlog.md) — the release map.
   (Corroboration-only leads don't get a backlog row — but the ledger/Live-door status must still record
   that the comparison was made.) Update the ledger's `→ /sources` / `→ /briefs` columns when a primary or
   brief from it later goes live, and mark the backlog row Done.
5. **Verify before anything ships.** A primary from a note is quotable only after `apologia-citations`
   confirms it and it clears `apologia-argument` + `apologia-orthodoxy` — same as everything else.
6. **Deploy** per the repo rule: commit the **note + INDEX row only** (never the article/PDF) and
   fast-forward push to `main` (never `git checkout main`).

## Sources worth mining first (verified free/legal, mission-aligned)
Prioritize sources that *cite their primaries* — those give the richest lead harvest. Legality status
in brackets; carry the flags into every pull.

**Legal aggregator (front door)**
- **BiblicalStudies.org.uk / "Theology on the Web"** — permission-based free mirror of full runs of
  many journals below in one place. [legal — digitized with author/publisher permission]

**Open-access journals**
- **Themelios** (The Gospel Coalition) — free, all issues; broadly evangelical, largely neutral (mild
  Reformed tilt in reviews). Best all-round mine. [open-access]
- **JETS** (Journal of the Evangelical Theological Society) — all but the last ~2 years free as PDFs;
  refereed, cross-denominational authorship. [open-access, rolling embargo]
- **Tyndale Bulletin** (Tyndale House, Cambridge) — fully open access; high rigor; archaeology /
  historicity / text. [open-access]
- **Detroit Baptist Seminary Journal** — free back issues. ⚠ Baptist + often dispensational/cessationist
  — screen out intra-Christian distinctives (baptism, eschatology, ecclesiology) per neutrality. [open-access]
- **Bulletin for Biblical Research** — ⚠ **only vols 1–9 free** (via BiblicalStudies.org.uk); recent
  issues paywalled. [free portion only]
- **Philosophia Christi** (EPS/Biola) — the flagship *philosophical*-apologetics journal. ⚠ **mostly
  paywalled**; use the **free journal section** + the **fully-free EPS web articles**
  (epsociety.org/articles). [free portion only]
- **Eleutheria** (Liberty, Digital Commons) — free. ⚠ substantially *student* scholarship — treat as a
  pointer to primaries, not an authority. [open-access, low tier]

**Author / organization free archives**
- **garyhabermas.com** (Articles) — Habermas posts his **own** peer-reviewed journal PDFs free — a
  resurrection-primary goldmine. Mine the **footnotes/citations** (the dated scholarship the videos only
  gesture at). [author-hosted — legal]
- **ReasonableFaith.org — Scholarly Writings** — Craig's peer-reviewed articles, free. Target the
  **non-kalam** text (divine aseity/eternity, historical-Jesus, particularism) — fills the thin
  divine-attributes gap. [org-hosted — legal]
- **NTWrightPage.com** — Wright's essays, free by permission; world-class resurrection historiography.
  ⚠ **Do not import his justification / New-Perspective-on-Paul distinctives** — mine the resurrection +
  Second-Temple primaries only. [author-permitted — legal]
- **Stand to Reason (str.org)** — large free archive (Koukl). Popular, not scholarly (few citable
  primaries); best as a **tone/framing model** for `/answers/*`. ⚠ Reformed tilt, occasional
  anti-Catholic/-Orthodox framing — screen for neutrality. [org-hosted — legal]

**Reference encyclopedias (peer-reviewed, free — highest-trust background)**
- **Stanford Encyclopedia of Philosophy (SEP)** — free, peer-reviewed, current, authoritative
  bibliographies; the best neutral place to confirm our arguments are in their strongest form + harvest
  primaries. ⚠ presents objections at full strength — hold to the explicit-verdict rule. [open-access]
- **Internet Encyclopedia of Philosophy (IEP)** — free, peer-reviewed, more introductory; good for the
  "popular-scholarly" tier + checking we haven't overstated. [open-access]

**Never / avoid:** Sci-Hub (piracy); academia.edu & ResearchGate uploads unless verifiably the
author's own; any "free full-text" of a still-copyrighted book/article on an aggregator that isn't the
publisher/author — that's an owned-access candidate, not a source.

## Mined-articles ledger (the running list — update it every time)
The canonical list of which articles have been mined — plus whether each reached the live doors.
Every mining run MUST add a row here (and an `INDEX.md` topic row). Status keys: **note** = our-own-words
map written · **✓sources** = a verified PD primary from it is live in `/sources` · **✓briefs** = a gated
brief distilled from its certified-essay tie-in is live in `/briefs` · **—** = not (yet).

| Article (author · title · venue) | Access | URL | Note file | → /sources | → /briefs | Date |
|---|---|---|---|---|---|---|
| Bergeron **&** Habermas · "The Resurrection of Jesus: A Clinical Review of Psychiatric Hypotheses…" · *Irish Theological Quarterly* 80.2 (2015) | author-hosted (Liberty DigitalCommons `lts_fac_pubs/402`) | digitalcommons.liberty.edu /lts_fac_pubs/402 | `bergeron-habermas-psychiatric-hypotheses.md` | — | — (note **COMPLETE** 2026-07-24 — full text mined, all clinical citations extracted; **backlog row un-blocked** → strengthen `appearances.html` w/ the clinical layer, dual-consensus) | 2026-07-24 |
| Gary Habermas (solo) · "Resurrection Research from 1975 to the Present" · *JSHJ* 3.2 (2005) | author-hosted | garyhabermas.com /articles/J_Study_Historical_Jesus_3-2_2005/ | `habermas-resurrection-research-1975.md` | — | — (note **COMPLETE** 2026-07-24 — full text mined; corroboration-only, no backlog row; topic already served by the live resurrection briefs) | 2026-07-24 |
| **Gregory R. Lanier** · "The Critical Editions of the Greek NT and OT: Stability, Change, and Implications" · *Tyndale Bulletin* 71.1 (2020) 43–63 | publisher OA | tyndalebulletin.org /article/27734-…pdf | `lanier-critical-editions-stability.md` | — | — (note **COMPLETE** 2026-07-26 — ⚠ the mining brief mis-attributed this to *Dirk Jongkind*; the author is **Lanier**. **IMPROVEMENT ×2** → backlog: edition-level stability layer + a Greek-OT/Septuagint paragraph for `manuscript.html`) | 2026-07-26 |
| **Colin J. Hemer** ×3 (*TynBul* 36 [1985] 79–109; 40.1 [1989] 77–85; 40.2 [1989] 239–59) **+ David Seccombe** (*TynBul* 71.2 [2020] 207–27) **+ F. F. Bruce**, *The Speeches in the Acts of the Apostles* (Tyndale Press, 1942) | publisher OA ×4; Bruce via permission-based mirror (© Bruce, "reproduced by permission") | tyndalebulletin.org ×4; biblicalstudies.org.uk /pdf/tp/speeches_bruce.pdf | `acts-historicity-bruce-hemer-seccombe.md` | — | — (note **COMPLETE** 2026-07-26, 5 full texts. **IMPROVEMENT ×3** → backlog: the Acts 27–28 voyage epigraphy for `archaeology.html`; Seccombe's three non-silence arguments for `earlydate.html`; NEW coverage of "are the speeches in Acts invented?") | 2026-07-26 |
| **Alan R. Millard** ×2 · "Daniel in Babylon: An Accurate Record?" (in Hoffmeier & Magary, eds., *Do Historical Matters Matter to Faith?*, Crossway 2012, 263–80) · "The Knowledge of Writing in Iron Age Palestine" (*TynBul* 46.2 [1995] 207–17) | permission-based mirror (Crossway-permitted) / publisher OA | biblicalstudies.org.uk /pdf/crossway/daniel_millard.pdf; tyndalebulletin.org /article/30407-…pdf | `millard-daniel-and-scribal-culture.md` | — | — (note **COMPLETE** 2026-07-26. Belshazzar = **corroboration** [already live]. **IMPROVEMENT ×2** → backlog: a bounded Darius-the-Mede + Sargon II line for `archaeology.html`; NEW coverage of Iron-Age writing/literacy) | 2026-07-26 |
| **Peter M. Head & P. J. Williams** · "Q Review" · *Tyndale Bulletin* 54.1 (2003) 119–44 | publisher OA | tyndalebulletin.org /article/30227-q-review.pdf | `head-williams-q-review.md` | — | — (note **COMPLETE** 2026-07-26 — the brief's "Williams article" search resolved here; his onomastics/geography case is in the **book** → `book-research/can-we-trust-the-gospels.md`. **IMPROVEMENT ×1** → backlog: a specialist caveat on the Casey footnote in `jewishness.html`) | 2026-07-26 |
| ⭐ **Simon Gathercole** · "Another 'I Have Come' Saying from Ancient Judaism: A Note on *De Sampsone* 13" · *Tyndale Bulletin* 75 (2024) 101–6 | publisher OA | tyndalebulletin.org /article/122350-…pdf | `gathercole-i-have-come-sayings.md` | — | — (note **COMPLETE** 2026-07-26 — §1 restates *The Preexistent Son*'s thesis in the author's own words. **⭐ THE BATCH'S TOP IMPROVEMENT (P2)** → backlog: Synoptic preexistence is **entirely absent** from `jesus_as_god_nt.html`/`titles.html`. **Dual-consensus + a mandatory `orthonote`** — the angelic parallel is to the FORM of the saying, never the NATURE of the speaker) | 2026-07-26 |
| **K. A. Kitchen** · "Historical Method and Early Hebrew Tradition" · *Tyndale Bulletin* 17 (1966) 63–97 | publisher OA | tyndalebulletin.org /article/30688-…pdf | `kitchen-historical-method-hebrew-tradition.md` | — | — (note **COMPLETE** 2026-07-26. ⚠ **1966 — pre-dates the Thompson/Van Seters critique.** Treaty-form argument = **corroboration** (already live + already labelled contested). **IMPROVEMENT ×1** → backlog: the **Merneptah Stele** for `archaeology.html`. Plus a deliberate **NON-recommendation** on the Nuzi material, recorded on purpose) | 2026-07-26 |

**Rule of thumb:** an article isn't "briefed" until a row shows **✓briefs** (or **✓sources**). A row
with only **note** means it's mined but nothing has cleared the gates into the live AI yet.
