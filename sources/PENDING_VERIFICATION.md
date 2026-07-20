# Expansion plan — deity-of-Christ & Trinity passages (drafted 2026-07-20)

A curated worklist for growing the public-domain source library **from short quotes
to fuller passages** on the **divinity of Christ** and the **Trinity**.

## Why this is a plan, not seeded text
Every passage in `/sources` is quoted **verbatim** and confirmed character-by-character
against a public-domain source (`verified: true`), because the live `/api/ask`
endpoint retrieves `verified:true` passages and lets the model quote them. Adding a
passage therefore requires reading it in its **public-domain translation** (ANF =
Ante-Nicene Fathers; NPNF = Nicene & Post-Nicene Fathers — the 19th-century Schaff /
Roberts–Donaldson / Holmes editions, whose translations are old enough to be PD) and
copying it exactly.

The canonical PD hosts (**CCEL, New Advent, Wikisource, archive.org**) are **blocked by
this session's network policy**, so the wording cannot be confirmed here. Rather than
paste patristic text from memory (which would defeat the corpus's verbatim discipline),
the targets below are staged for a **web-enabled / local session**, or for
`apologia-citations` once the hosts are reachable.

## How to execute (one clean pass, web-enabled session or `apologia-citations`)
For each target:
1. Open the PD source, read the passage in the stated translation.
2. Copy the **fuller passage verbatim** — enough context that the deity/Trinity claim
   stands on its own (this is the "quotes → passages" upgrade).
3. Create the entry in the per-author `sources/*.json` file, following the schema in
   `sources/README.md` (`id, author, work, year, section, translation, pd, source_url,
   verified, tags, note, text`).
4. Add a **DELICACY note** wherever a subordination-/modalism-sounding clause appears —
   quote it *with* its resolving clause, never in isolation (see the exemplars
   `tertullian-praxeas-2` and `gregory-nyssa-nothreegods`).
5. Set `verified: true` with a stamp (`verified verbatim … <date>`), then
   `node tools/build-sources-index.mjs` (compiles into `lib/sources-verified.js` →
   live-quotable) and `--check` in CI stays green.

## Priority 1 — new Fathers (breadth gaps) — ✅ **DONE 2026-07-20, deployed**
All five verified verbatim by `apologia-citations` against **two independent PD hosts each**
(0 fabrications, 0 misattributions, 0 modern-copyright contamination) and shipped with
DELICACY notes. Library 102 → **107 verified passages**.

| id (as shipped) | Father / work | § | Status |
|---|---|---|---|
| ✅ `hippolytus-noetus-14` | Hippolytus of Rome, *Against Noetus* | 14 | verified · `sources/hippolytus.json` |
| ✅ `novatian-trinity-11` | Novatian, *On the Trinity* | 11 | verified · `sources/novatian.json` |
| ✅ `novatian-trinity-29` | Novatian, *On the Trinity* | 29 | verified · `sources/novatian.json` |
| ✅ `clement-alex-protr-1` | Clement of Alexandria, *Exhortation to the Heathen* | 1 | verified · `sources/clement-alexandria.json` |
| ✅ `clement-alex-paed-1-2` | Clement of Alexandria, *The Instructor* | Bk I, ch. 2 | verified (id took a `-2` suffix for the chapter) |

**Corrections found while executing — three of this plan's URLs were wrong:**
- `newadvent.org/fathers/0612.htm` is **Fragments of Dionysius**, not Novatian. Novatian's
  treatise is `0511.htm`; the per-chapter Wikisource ANF pages were used instead (cleaner).
- `0208.htm` / `0209.htm` are **table-of-contents pages**, not text; chapters live at leaf
  URLs (`020801.htm`) or the Wikisource work pages.
- For Hippolytus, **do not cite New Advent `0521.htm`** — its site-wide boilerplate credits
  J. H. MacMahon, who translated only the *Refutation*; ANF v.5 credits **S. D. F. Salmond**
  for *Against Noetus*. Cite the Wikisource/CCEL ANF page.

## Priority 2 — fuller passages from Fathers already in the corpus (depth)
| id (proposed) | Father / work | § | Role | PD source |
|---|---|---|---|---|
| `tertullian-praxeas-27` | Tertullian, *Against Praxeas* | 27 | Two substances, one Person (Christ God and man) | ANF v.3 · ccel.org anf03 |
| `tertullian-praxeas-8` | Tertullian, *Against Praxeas* | 8 | Son from Father as ray from sun — distinct, not divided | ANF v.3 · ccel.org anf03 |
| `irenaeus-ah-1-10-1` | Irenaeus, *Against Heresies* | 1.10.1 | The triadic Rule of Faith (Father, Son, Spirit) | ANF v.1 · newadvent.org/fathers/0103110.htm |
| `irenaeus-ah-3-19-1` | Irenaeus, *Against Heresies* | 3.19.1 | The "exchange": the Word became man that man might become son of God | ANF v.1 · newadvent.org/fathers/0103319.htm |
| `athanasius-arians-1-39` | Athanasius, *Orations Against the Arians* | 1.39 | Son eternal, proper offspring of the Father's essence (anti-Arian) | NPNF2 v.4 · newadvent.org/fathers/2816.htm |
| `athanasius-decrees-19` | Athanasius, *On the Decrees of Nicaea* | ~19–20 | Why "homoousios" (of one essence) guards the faith | NPNF2 v.4 · newadvent.org/fathers/2809.htm |
| `augustine-trinity-1-4-7` | Augustine, *On the Trinity* | 1.4.7 | Father, Son, Spirit — one substance, co-equal, inseparable | NPNF1 v.3 · newadvent.org/fathers/130101.htm |
| `basil-holyspirit-conjoined` | Basil, *On the Holy Spirit* | ~16/27 | The Spirit glorified *with* Father and Son (fuller doxology passage) | NPNF2 v.8 · newadvent.org/fathers/3203.htm |
| `gregory-naz-or31-splendour` | Gregory of Nazianzus, *Oration 31* | 31.14 | "No sooner do I conceive of the One than I am encompassed by the splendour of the Three" | NPNF2 v.7 · newadvent.org/fathers/310231.htm |

## ✅ Seed backlog — **DONE 2026-07-20, deployed** (26 of 27 shipped, 1 dropped, 1 held)
All five files verified by `apologia-citations` and moved into `sources/`; `_pending/` is empty
and removed. **Library: 107 → 132 verified passages.**

| file | shipped | outcome |
|---|---|---|
| ✅ `origen.json` | 4 of 5 | **De Principiis Preface DROPPED** — see Delicacy watch below |
| ✅ `chrysostom.json` | 5 of 6 | 1 **HELD** at `false`: the Eucharist quote is a hybrid of two recensions + truncated mid-sentence |
| ✅ `leo-great.json` | 6 of 6 | all exact on 3 hosts; "possible nature" is genuinely what NPNF prints |
| ✅ `councils.json` | 5 of 5 | 2 needed verbatim fixes; "Canon X" relabelled "Capitulum X" |
| ✅ `cyril-alexandria.json` | 5 of 5 | fragment-stitching confirmed **seam-free**; 3 needed small fixes |

**Why the Origen Preface was dropped** (the plan predicted this): its *wording* was fine, but
the problem is what the citation points **at**. *De Principiis* survives only in Rufinus's
Latin — and he admitted "correcting" the Trinitarian passages, so the witness is weakest
exactly where our quote was strongest. The ANF's own footnote records Jerome reading "made or
unmade" where Rufinus has "born or innate" (i.e. whether the Spirit is a *creature*). And Book
I's adjacent chapters teach pre-existence of souls and apokatastasis. **A DELICACY note can
fence a clause; it cannot fence a hyperlink** — and `/api/ask` publishes that hyperlink as the
attribution. The four *Contra Celsum* passages differ in kind: Greek, Origen's own words, no
Rufinus problem. The rule-of-faith slot should be filled by `irenaeus-ah-1-10-1` (Priority 2).

**Two entries were re-fenced STRUCTURALLY** rather than by advice, because a note cannot travel
with a pull-quote: Chrysostom's bare "He emptied Himself… form of a servant" (indistinguishable
from kenoticism alone) now carries his own "while He remained what He was, He took that which He
was not"; and his bare "saved us by grace… no man may boast" now opens with "Hath He Himself
hindered our being justified by works? By no means."

## Seed files — original staging note (`sources/_pending/`, now cleared)
Five files drafted in an earlier round were left **unverified** (`verified: false`) and were
sitting loose in `sources/`, where `build-sources-index.mjs` globs them — they would have
leaked into `sources-index.json` **and the live `/api/ask` retrieval set** before verification,
and broken CI (they are untracked). Moved to `sources/_pending/`, which the glob ignores.
They enter `sources/` only once verified.

| file | passages | notes |
|---|---|---|
| `councils.json` | 5 | Ephesus 431, Formula of Reunion 433, Const. II 553, Const. III 681 |
| `cyril-alexandria.json` | 5 | Second Letter to Nestorius — **highest verbatim risk** (stitched from ~125-char fragments) |
| `chrysostom.json` | 6 | New Advent serves a *modernized* NPNF ("you" for "thou") — stored text vs cited URL must agree |
| `leo-great.json` | 6 | check "possible"/"passible" print quirk; several source_urls known wrong |
| `origen.json` | 5 | see Delicacy watch below — plan says exclude; under doctrinal screen |

## Delicacy watch (fence with the resolving clause; may warrant an `orthonote` if surfaced)
- **Justin Martyr** (Dial. 61; 1 Apol. 63): the Logos as "another" God/Lord — pre-Nicene
  idiom that reads subordinationist in isolation. Only add with the co-eternal /
  same-worship context; heavy note. (Already have 6 Justin entries — extend cautiously.)
- **Hippolytus / Novatian / Tertullian**: pre-Nicene "economy" language orders the
  Persons (taxis) without ranking their being. Always carry the "one God / one power /
  one substance" clause.
- **Origen** (*De Principiis*): explicitly excluded for now — genuine subordinationist
  passages make him a poor fit for a *deity-confirming* collection without extensive
  fencing.

## Hard exclusions (translation NOT public domain — do NOT add)
- **Melito of Sardis, *On Pascha*** ("He who hung the earth is hanging… God has been
  murdered"). The homily was rediscovered in the 20th century; every English translation
  (Bonner 1940; Hall; Stewart) is **copyrighted**. No PD translation exists, so despite
  being one of the most striking 2nd-century deity texts, it cannot be quoted here.
- **Athanasius, *Letters to Serapion*** (deity of the Spirit): the standard English
  (Shapland, 1951) is copyrighted — use the PD *Orations* / *De Decretis* instead.
- Any **modern translation** (Popular Patristics, Fathers of the Church series, etc.) —
  ancient author, copyrighted wording.
