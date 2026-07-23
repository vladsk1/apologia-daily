# Content backlog — the release map surfaced by the research libraries

**Purpose.** One prioritized place for every **content update or addition** the research libraries
(`docs/book-research/`, `docs/video-research/`, and the `/sources` corpus) have surfaced but not yet
shipped — so accuracy/currency improvements actually reach the site and **nothing gets lost between a
mining run and a release.** This is the "map for future content releases."

**Why it exists.** A big reason for the book + video libraries is keeping our content **current and
accurate** with the latest scholarship. A mining run surfaces leads; this backlog is where they queue
until a content session executes them through the pipeline.

## The flow (how a row moves)
1. A note (book/video) surfaces a lead → **log a row here** (and keep it in the note's cross-map).
2. A content session executes it:
   - **Update/create the certified essay** → re-run `citations → argument → orthodoxy` (dual-consensus
     for deity/resurrection/salvation/world-religions) → bump the `content-review` stamp.
   - **Then** update/add the **brief** (distilled from the essay) → `node tools/build-briefs-index.mjs`.
   - If a verified verbatim quote is involved, add/flip the `/sources` entry (`verified:true`) →
     `node tools/build-sources-index.mjs`.
3. Mark the row **Done**, and flip the source note's ledger (`→ /sources` / `→ /briefs`) to ✓.

**Types:** `new-essay` · `update-essay` · `new-answer` · `correction` · `new-brief` · `update-brief` ·
`new-source`. **Priority:** P1 (accuracy fix / correction) > P2 (new topic/objection we lack) >
P3 (stronger primary / enrichment) > P4 (corroboration only — usually skip).

## Open backlog
| P | What to do | Type | Surfaced by | Target file(s) | Gate | Status |
|---|---|---|---|---|---|---|
| P2 | Write a NEW deep-dive essay walking through the **Nicene Creed** phrase-by-phrase (history: Arius/325→381; terms: homoousios, begotten, procession; incarnation; the articles) — the site has no dedicated Nicene-Creed essay | **new-essay** → then brief + link from `what-we-believe.html`/Trinity tab | `video-research/ortlund-nicene-creed-commentary.md` | NEW `library/nicene-creed.html` (+ strengthen `answers/did-the-church-invent-jesus-divinity-at-nicaea.html`, `answers/did-jesus-empty-himself-of-his-deity.html`) | citations + **dual-consensus** + **strict denom-neutrality on the filioque** | **DONE 2026-07-23** (NEW `library/nicene-creed.html` shipped dual-consensus CLEAN; also Trinity-tab card 16 + `nicene-creed-explained` brief. The two optional `answers/*` strengthenings were NOT part of this and remain available as follow-up.) |
| **P2** | **Pastorally redesign + re-add the "Suffering & Evil" answer category (11 pages)** — pulled from `main` on 2026-07-22 "pending pastoral redesign" (commit `573421c` removed the 7 Suffering & Evil answers; `5efdafc` removed 4 pastoral-adjacent ones). Rebuild each so the **pastoral/crisis path leads** (compassion + referral where apt, per the CLAUDE.md PASTORAL CARE exception — not a debate-style answer), then re-register in `_data.json` and regenerate. Pre-pull versions are recoverable for reference via `git show 573421c^:answers/<slug>.html` (and `5efdafc^:…`). | new-answer (redesign) | this session's branch audit + `main` commits `573421c` / `5efdafc` (2026-07-22) | `answers/_data.json` + `tools/gen-answers.mjs` → regenerate: `why-does-god-allow-suffering`, `where-is-god-when-im-hurting`, `how-can-a-loving-god-send-people-to-hell`, `is-the-problem-of-evil-evidence-for-god`, `why-do-bad-things-happen-to-good-people`, `why-does-god-allow-natural-disasters`, `why-doesnt-god-heal-everyone-or-answer-every-prayer`, `does-the-bible-condone-slavery`, `is-it-ok-to-have-doubts-as-a-christian`, `what-about-those-who-never-heard-of-jesus`, `if-god-is-real-why-does-he-seem-hidden` | argument + orthodoxy + **pastoral-care framing** (SHORT-FORM + PASTORAL CARE rules) + answer-openings/concessions lints; ideally **human/pastoral sign-off** | TODO |
| P3 | Add **1 Cor 16:22 (*maranatha*)** as Aramaic-early evidence of earliest devotion to Jesus | update-essay → update-brief | `video-research/habermas-early-high-christology.md` §5 | `library/jesus_as_god_nt.html` → then `deity-of-christ-nt` brief | citations + dual-consensus (orthodoxy+neutrality) | TODO |
| P3 | Optionally **strengthen the (already-comprehensive) kalam essay** with material the Craig "Defenders" series surfaced — ENHANCEMENT, not a correction: (a) a **second scientific confirmation, thermodynamics/heat death** (Boltzmann Many-Worlds + Boltzmann Brains + Tolman oscillating-entropy + **Aron Wall 2013** generalized-2nd-law singularity theorem); (b) **Swinburne's personal-explanation "kettle"** argument as a *second independent* route to the cause's personhood; (c) the **Grim Reaper Paradox** (Pruss/Koons); (d) citation upgrade — **Vilenkin's 2015 *Inference* "The Beginning of the Universe"** (agnostic cosmologist affirms P2, disputes P1) | update-essay → (later) refresh brief | `video-research/craig-kalam-defenders-series.md` §Strengthening leads | `library/kalam.html` → then `kalam-cause-of-universe` brief | citations + argument + orthodoxy (single-gate) — **keep divine-temporality NEUTRAL** (Craig's "in time with the universe" is his contested view, not dogma) | TODO |
| P3 | Add **Rom 10:13 → Joel 2:32** as a second Yahweh-text applied to Jesus | update-essay → update-brief | `video-research/habermas-early-high-christology.md` §5(iv) | `library/jesus_as_god_nt.html` → then `deity-of-christ-nt` brief | citations + dual-consensus | **DONE 2026-07-22** |
| P3 | Add the **"public reading in church = canonical recognition"** argument to the canon case — early Christians read their texts aloud in worship on a par with the synagogue's Law/Prophets/Writings, conferring canonical status; a distinctive angle beyond the usual councils framing | update-essay (→ update-brief if a canon brief exists) | `book-research/in-defense-of-the-bible.md` ch. 10 Thesis 8 (Barnett) | `library/canon.html` (+ maybe `answers/who-decided-which-books-are-in-the-bible.html`) | citations + orthodoxy (denom-neutral on canon scope) | TODO |
| P3 | Enrich the NT-reliability case with Barnett's **NT-vs-Roman-Caesars *temporal-gap*** comparison (Tacitus c.116 / Suetonius c.120 wrote further from their subjects than the evangelists did from Jesus) — the disciplined form of the comparison, NOT raw manuscript counts | update-essay | `book-research/in-defense-of-the-bible.md` ch. 10 Thesis 3 (Barnett) | `library/manuscript.html` or `library/hist_jesus.html` | citations + argument (avoid count triumphalism) | TODO |

## Done (shipped — kept for the audit trail)
_(none yet)_

## Notes
- **Corroboration-only leads (P4) don't get a row** — they add nothing a visitor sees. Log a lead here
  only if it corrects, updates, strengthens with a new primary, or opens a topic/objection we lack.
- Book-note "open items" (e.g. the CHECK-level page-cites, the pending human/pastoral sign-offs) can be
  rolled in here too as they're actioned, so the whole content pipeline has one queue.
