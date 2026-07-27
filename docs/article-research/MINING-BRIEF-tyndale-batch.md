# Mining brief — Tyndale/evangelical batch (✅ **EXECUTED 2026-07-26** — kept for the audit trail)

> ✅ **STATUS: ALL 7 SOURCES MINED, 2026-07-26, from a local web-enabled session.** Ten source texts were
> harvested and read in full; **six article notes** and **four book notes** were written; every lead was
> cross-checked against the live site; **eleven backlog rows** were logged. The brief below is left
> unchanged as the record of what was asked for. **Read the notes, not this file, for what was found.**
>
> **Notes produced —** `article-research/`: `lanier-critical-editions-stability.md` ·
> `acts-historicity-bruce-hemer-seccombe.md` · `millard-daniel-and-scribal-culture.md` ·
> `head-williams-q-review.md` · `gathercole-i-have-come-sayings.md` ·
> `kitchen-historical-method-hebrew-tradition.md`. `book-research/`:
> `gathercole-preexistent-son-and-thomas.md` · `can-we-trust-the-gospels.md` ·
> `jesus-and-the-eyewitnesses.md` · `on-the-reliability-of-the-old-testament.md`.
>
> **Corrections to this brief, found by executing it (do not propagate the originals):**
> - **§1 is NOT by Dirk Jongkind.** The author of the *TynBul* 71.1 (2020) stability article is **Gregory
>   R. Lanier** (RTS); Jongkind appears *inside* it as co-editor of the THGNT. Cite **Lanier**.
> - **§7's "bonus" Dating Luke-Acts article is by David Seccombe**, not Bruce or Hemer. Bruce's *Speeches
>   in the Acts of the Apostles* lecture was **delivered Dec 1942**; the pamphlet's title page reads
>   **1942**, not 1943.
> - **§2 resolved BOTH ways.** Williams's onomastics/geography/undesigned-coincidences case is in the
>   **book** (→ `book-research/can-we-trust-the-gospels.md`), but he *does* have a substantive
>   open-access *TynBul* article, co-authored with **Peter M. Head**, on Q (→ `head-williams-q-review.md`).
> - **§6's suggested free Bauckham article is NOT legitimately free** — the only free full text found is a
>   **Scribd** third-party upload of a copyrighted Brill article. **Not usable.** (`richardbauckham.co.uk`
>   was unreachable: expired TLS certificate.) The book note was built from the **open-access *Themelios*
>   review** instead.
> - **§3 Kitchen has more free material than the brief knew:** an open-access *TynBul* article (mined in
>   full) **plus his complete *Ancient Orient and Old Testament* (1966) hosted with his own permission.**
>
> **Verdicts vs. the pre-scan:** the pre-scan was right on every count. **#5 Gathercole is the real gap**
> (P2, the batch's top row — Synoptic preexistence returns *zero* hits site-wide). **#6 Bauckham** was the
> purest corroboration. The batch also surfaced improvements the pre-scan did not predict: the **Acts
> 27–28 voyage epigraphy**, the **speeches-in-Acts** topic, **Iron-Age literacy**, the **Merneptah Stele**,
> and the **Greek OT/Septuagint** half of the text-stability story. One **deliberate non-recommendation**
> is on the record: Kitchen's Nuzi/patriarchal-customs material (overturned by Thompson 1974 / Van Seters
> 1975) is a **trap, not a gap**.

> **Why this file exists.** These 7 sources were queued for the journal library (`article-research`),
> but the **web-session egress policy blocks the source hosts** (`tyndalebulletin.org`,
> `biblicalstudies.org.uk`, `ffbruce.com`, `garyhabermas.com` all return 403/000 through the agent
> proxy — an org egress denial, not routable-around). So this batch must be mined from a
> **local / web-enabled session**, exactly like the first two notes were. This brief carries
> everything a local session needs: confirmed metadata, the fetch URLs, the on-site cross-check
> target (from a live-library scan done 2026-07-25), and the per-source guardrail flag.
>
> **Goal (owner's intent): mine all 7 to build the library strong for future builds — even where the
> scan says the topic is already well-covered on-site.** Still classify each lead corroboration-vs-
> improvement in the note (mandatory), but write a full note for every source regardless.

## Before you start (read these first — they define the format + rules)
1. `docs/article-research/README.md` — the hard copyright/ToS rules + the 6-step workflow.
2. `docs/article-research/INDEX.md` — the topic router; add a row per note.
3. The two existing **completed** notes as format templates:
   `bergeron-habermas-psychiatric-hypotheses.md` and `habermas-resurrection-research-1975.md`.
4. `CLAUDE.md` guardrails (Nicene orthodoxy, denominational neutrality, argument-specific rules,
   "orthodoxy outranks charity", explicit-verdict, no fabrication).

## Non-negotiables (from README — do not bend)
- **Every citation is an UNVERIFIED LEAD** until confirmed against the primary and run through
  `apologia-citations → apologia-argument → apologia-orthodoxy`. Never write "an article said X" —
  cite the **primary** the article points to, verified.
- **Our-own-words only.** No stored article excerpts. Downloaded PDFs go to the git-ignored
  `docs/article-research/_pdfs/` — never commit them. Commit only the note + INDEX/ledger rows.
- **Legality:** open-access / author-hosted / permission-aggregator only. No Sci-Hub; academia.edu
  only if the author's own upload.
- **MANDATORY cross-check (step 3 of the README):** after each note, `Grep`/`Read` the on-site home
  (the target below), classify the lead **corroboration** (no backlog row) or **improvement**
  (→ a `docs/content-backlog.md` row), and make the classification visible in the note's
  "Live-door status."
- **Some of these are BOOKS, not articles** — for those, write the note in `docs/book-research/`
  instead (format template: `book-research/*.md`), not here. Flagged per source below.

## The 7 sources

### 1. Dirk Jongkind — NT/OT text stability  ·  ARTICLE ✅ open-access
- **"The Critical Edition of the Greek OT & NT: Stability, Change and Implications,"** *Tyndale Bulletin* 71.1 (2020) 43–63.
- URL: `https://www.tyndalebulletin.org/article/27734-the-critical-edition-of-the-greek-ot-and-nt-stability-change-and-implications.pdf`
- **Cross-check target:** `library/manuscript.html` (already covers Tregelles/THGNT/critical-edition/stability — likely **corroboration**; mine any fresh stability stats / worked textual examples).
- **Guardrail:** manuscripts prove **accurate preservation, not truth**. Bounded.

### 2. Peter J. Williams — Gospel reliability  ·  VERIFY (article vs book)
- Mine his **undesigned-coincidences / onomastics / geography** case. Search the *Tyndale Bulletin* author index for a Williams article; if the best material is *Can We Trust the Gospels?* (Crossway, 2018), write it as a **`book-research/` note** instead.
- Start points: `https://www.tyndalebulletin.org/` (author search); `https://tyndalehouse.com/`.
- **Cross-check target:** `library/eyewitnesses.html`, `library/coincidences.html`, `library/names.html` (already saturated — likely **corroboration**).
- **Guardrail:** preservation-not-truth; tone-model clean.

### 3. Kenneth Kitchen — OT historicity  ·  likely BOOK → `book-research/`
- Flagship is the **book** *On the Reliability of the Old Testament* (Eerdmans, 2003) → write as a `book-research/` note. If you find a genuine open-access *Tyndale Bulletin* Kitchen article (OT chronology / exodus / patriarchs), mine that here instead.
- **Cross-check target:** `library/archaeology.html` (already rich in OT-historicity, incl. Belshazzar/Nabonidus).
- **Guardrail:** avowed "maximalist" → keep verdicts **bounded** (archaeology corroborates the *setting*, not the *message*); keep OT-canon/Apocrypha scope **denominationally neutral**.

### 4. Alan Millard — Daniel historicity + scribal culture  ·  ARTICLE/HOSTED ✅
- (a) **"The Historical Accuracy of Daniel"** — `https://biblicalstudies.org.uk/blog/alan-r-millard-on-the-historical-accuracy-of-daniel/`
- (b) his **ancient-literacy / scribal-culture** work (e.g. *Reading and Writing in the Time of Jesus*) — verify an open-access article form.
- **Cross-check target:** `library/daniel70.html` is the *Seventy-Weeks prophecy* (NOT historicity); Daniel historicity (Belshazzar/Nabonidus/Darius) is partly on `library/archaeology.html`. **Possible improvement:** Darius-the-Mede + scribal-culture leads → enrich `archaeology.html` (or a new Daniel-historicity section).
- **Guardrail:** cautious, low-overstatement source; keep bounded.

### 5. Simon Gathercole — Synoptic preexistence + Gospel of Thomas  ·  (a) BOOK → `book-research/`, (b) ARTICLE
- (a) ***The Preexistent Son*** (Eerdmans, 2006) — the **"I have come" sayings** as Synoptic evidence of Christ's preexistence → **`book-research/` note.** **⭐ This is the one genuine GAP the scan found:** `library/jesus_as_god_nt.html` and `library/titles.html` have **nothing** on Synoptic preexistence → a real **improvement** (→ backlog row → strengthen the deity essay, dual-consensus).
- (b) his **Gospel of Thomas** lateness/composition work (articles exist) — cross-check `library/canon.html` (already covers Thomas → likely corroboration).
- **Guardrail:** deity tab = **dual-consensus** (orthodoxy + neutrality). Both angles solidly orthodox.

### 6. Richard Bauckham — eyewitnesses + onomastics  ·  BOOK → `book-research/`
- Core data is in the **book** *Jesus and the Eyewitnesses* (Eerdmans; 2nd ed. 2017) → `book-research/` note. The closest article is **"The Eyewitnesses and the Gospel Traditions,"** *JSHJ* 1.1 (2003) — verify free access before using.
- **Cross-check target:** `library/eyewitnesses.html`, `library/names.html` (already saturated with onomastics/Papias → **corroboration**).
- **⚠ Guardrail (important):** **fence his universalism** — mine ONLY the eyewitness/onomastics historiography; import none of his eschatology. "Universalism-as-certain" is a hard guardrail violation.

### 7. F. F. Bruce + Colin Hemer — Acts historicity  ·  ARTICLES ✅ open-access
- **Hemer:** "First-Person Narrative in Acts 27–28," *TynBul* 36 (1985) — `https://www.tyndalebulletin.org/article/30571-first-person-narrative-in-acts-27-28.pdf`
- **Hemer:** "The Speeches of Acts I: The Ephesian Elders at Miletus," *TynBul* 40.1 (1989) — `https://www.tyndalebulletin.org/article/30536-the-speeches-of-acts-i-the-ephesian-elders-at-miletus.pdf`
- **Hemer:** "The Speeches of Acts II: The Areopagus Address," *TynBul* 40.2 (1989).
- **Bruce:** "The Speeches in the Acts of the Apostles" (Tyndale Press, 1943) — via `https://biblicalstudies.org.uk/` and `https://www.ffbruce.com/books-and-articles/`.
- **Bonus (confirmed OA):** "Dating Luke-Acts: Further Arguments for an Early Date," *TynBul* 71.2 (2020) — `https://www.tyndalebulletin.org/article/27747-dating-luke-acts-further-arguments-for-an-early-date.pdf`
- **Cross-check target:** `library/archaeology.html` (Gallio/Erastus/Sergius — covered), `library/earlycreed.html` (Gallio anchor — covered), `library/earlydate.html` (Luke-Acts dating — covered) → mostly **corroboration**; `library/hist_jesus.html` is **thin** on "Luke the careful historian" → **possible improvement**.
- **Guardrail:** Acts historicity = *setting corroborated*, not doctrine proven; both authors mainstream evangelical.

## Live-coverage pre-scan (done 2026-07-25 from the web session — informs the cross-check)
| # | Source | Live coverage now | Likely verdict |
|---|---|---|---|
| 1 | Jongkind | manuscript.html covers editions/stability | corroboration |
| 2 | Williams | eyewitnesses/names saturated | corroboration |
| 3 | Kitchen | archaeology rich (book) | corroboration → book-research |
| 4 | Millard | daniel70 = prophecy not historicity; archaeology has Belshazzar | partial → possible enrichment |
| 5 | **Gathercole** | jesus_as_god_nt/titles = 0 on Synoptic preexistence | **improvement (real gap)** |
| 6 | Bauckham | onomastics saturated (book) | corroboration → book-research |
| 7 | Bruce/Hemer | archaeology/earlycreed/earlydate covered; hist_jesus thin | mostly corroboration; possible hist_jesus enrichment |

## When done
- Add a **Mined-articles ledger** row (README) + an **INDEX.md** topic row per note.
- Add a `docs/content-backlog.md` row only for leads classified **improvement** (esp. #5 Gathercole).
- If executing improvements: run the full pipeline (citations → argument → orthodoxy;
  **dual-consensus** for the deity/#5 material), then rebuild any brief/index and mark the backlog row Done.
- Commit **notes + INDEX/ledger/backlog only** (never PDFs); deploy by fast-forward push to `main`
  (never `git checkout main`).
