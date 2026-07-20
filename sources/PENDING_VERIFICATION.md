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

## Priority 1 — new Fathers (breadth gaps; not yet in the corpus)
| id (proposed) | Father / work | § | Role | PD source |
|---|---|---|---|---|
| `hippolytus-noetus-14` | Hippolytus of Rome, *Against Noetus* | 14 | Anti-modalist Trinity — one God confessed as Father, Son, Spirit | ANF v.5 · newadvent.org/fathers/0521.htm |
| `novatian-trinity-11` | Novatian, *On the Trinity* | ~11–13 | Christ is announced as God *and* as man | ANF v.5 · newadvent.org/fathers/0612.htm |
| `novatian-trinity-29` | Novatian, *On the Trinity* | ~29 | Person/work of the Holy Spirit | ANF v.5 · newadvent.org/fathers/0612.htm |
| `clement-alex-protr-1` | Clement of Alexandria, *Exhortation to the Heathen* | 1 | The Word "is God and man" | ANF v.2 · newadvent.org/fathers/0208.htm |
| `clement-alex-paed-1` | Clement of Alexandria, *The Instructor* | 1.ii | The Word as God, our Instructor/Saviour | ANF v.2 · newadvent.org/fathers/0209.htm |

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
