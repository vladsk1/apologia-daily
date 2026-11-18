# Church Fathers library — Basil of Caesarea, *On the Holy Spirit* (chapters 1–30): copy-check and rule-7 record

*2026-11-18. The third book of the Church Fathers "Full works" section (rules in `docs/FREE_LIBRARY_CANDIDATES.md`
→ "Church Fathers library: hosting rules"). East/West tally after it: East 2 (Gregory of Nazianzus, Basil) ·
West 1 (Hilary). This file is the record behind the copy-check claim on the book page, and the rule-7 findings
logged for later work. Same method as Hilary (`docs/audits/fathers-hilary-copycheck-2026-11-18.md`), with the
changes this text forced, recorded below.*

## 1. Where the text came from

| | |
|---|---|
| Translation | Blomfield Jackson, *The Treatise De Spiritu Sancto*, in *Nicene and Post-Nicene Fathers*, 2nd series, vol. 8, ed. Philip Schaff and Henry Wace (Oxford and London: Parker; New York: The Christian Literature Company, 1895). |
| Public domain | Published 1895 (public domain in the US). Translator's dates: see §6 (citations check). |
| Base text hosted | CCEL's proofed transcription (`https://www.ccel.org/ccel/s/schaff/npnf208/cache/npnf208.txt`, "Rights: Public Domain"). The treatise is lines 7339–12963 (Chapter I heading to the end of Chapter XXX's notes); measured block ranges per chapter are in `tools/fathers/basil-config.json`. |
| Not used | New Advent's copy (modernised English; it was the source of the three Basil passages already in `/sources`, which this book corrects, §5). Two "Sage Digital Library" uploads on archive.org (`St.BasilLettersAndSelectedWorks`, `st-basil-letters-and-selected-works`) are modern retypesets, not scans of the printing, so they are not independent witnesses and were not used. |
| Checked against | Three archive.org scans of the 1895 printing: **A** `selectlibraryofn08scha`, **B** `cu31924103070102` (Cornell; best OCR, and the only one that reads Greek), **C** `selectlibraryofn08schauoft` (Toronto; weakest OCR). Imprint on A and B: "New York: The Christian Literature Company. Oxford and London: Parker & Company. 1895." |

## 2. What was removed (rule 1)

- The 1895 editors' preface to the treatise and their chapter headings (summaries such as "Prefatory remarks on
  the need of exact investigation…"); the chapters are numbered only.
- All 656 editors' footnotes in chapters 1–30 were read by script (`tools/fathers/extract-ccel.cjs` with
  `tools/fathers/basil-config.json`; no parser change was needed). **460 reference footnotes were kept, reference
  only** (472 individual references); **196 were dropped entirely** as editorial commentary.
- **New for this book: ten bracketed notes printed inside the text.** The translator compares his wording with
  the King James Version ("I live through [by, A.V.] the Father", 8.19 ×3; "[can, A.V.]", "[by whom, A.V.]",
  8.19; '["by" A.V.]', 8.18; "[A.V., of]", "[A.V., by]" and '(A.V., "of" instead of "through a woman")', 5.12)
  and once with the Greek Old Testament ("[lxx., known]", 5.7). These are editorial notes, not Basil's words and
  not words supplied to make the sense run, so they are omitted (`OMIT` in `tools/fathers/prep-basil.cjs`; the
  test `tests/fathers.test.mjs` caught the first build, which still carried them). Brackets that render a word
  are the translation and are kept: "[the Father's]" 8.20, "[the Spirit]" 16.38, "[or by]" and "[or in]" 25.58,
  "[or by,]" 26.63 (Basil's one Greek word ἐν, which English needs two words for).

## 3. Word-for-word comparison

- Script: `tools/fathers/compare-scan-chunked.cjs` (new). The section-level comparer used for Hilary
  (`compare-scan-robust.cjs`) reached only 88.6% / 89.8% here, with sections as low as 24%: this volume's footnotes
  are long and run into the text across whole pages, so a 300-word alignment loses its place. The new script
  locates every 60-word run of a section separately (4-word votes near the previous run, or across the whole
  scan if lost).
- **Result against the unaltered transcription: 95.8% of words match scan A, 96.2% scan B, 93.6% scan C**
  (34,760 words). What remains is footnote text inside the alignment windows and OCR noise.
- **Changed words:** every difference of up to four words on each side that two or more scans agreed on (172)
  was tested in context by `tools/fathers/check-candidates-context.cjs` (three words either side, all three
  scans) and read by hand. Most were OCR errors ("zz" for "in", run-together words, line-end hyphens).
- **Dropped words (new check):** `tools/fathers/check-dropped-words.cjs` tested every one- or two-word run that
  two scans print and the transcription lacks, or the reverse, in context (four words either side). This found
  seven words the transcription dropped, one of which reverses the sense (14.32).
- **Modernised spellings:** `tools/fathers/check-spellings.cjs` over all three scans. Unlike Hilary's text, this
  transcription had modernised nothing: "show" ×8, "naught" ×5, "judgment" ×6, "shows" ×1 and "spoke" ×2 are
  all printed so in 1895. (18.46 "shall show it unto you" was flagged both ways; the printing has "shew" at 5.9
  and "show" at 18.46, as the transcription does.)
- **Greek:** the printing gives a few words in Greek type; the transcription spells them in Latin letters.
  Scan B's OCR reads the Greek, which settled each one.
- **Punctuation** was not compared, except opening quotation marks: a search for closing marks with no opening
  mark found six the transcription had dropped.
- **Page image checked:** 17.41 "the individual Peter", where all three OCRs read "individua." — the scan image
  (B, leaf 113) shows a broken "l" in the type. The transcription's "individual" is kept.

**Corrections to Basil's text — 31, each confirmed in at least two of the three scans** (`CORR` in
`tools/fathers/prep-basil.cjs`; all listed on the book page)

| Kind | Where | Transcription → 1895 printing |
|---|---|---|
| Changed word | 4.6 | limitation → imitation |
| | 8.17 | pastare → pasture |
| | 15.36 | hereof → whereof |
| | 26.61 | the Spirit of our Father → your Father (Matthew 10:20) |
| | 27.66 | who is thence → who is there |
| | 27.66 | contempt stretches → contempt attaches |
| | 29.73 | The washing or water → of water |
| | 30.76 | the scenes so → the scene, so |
| | 30.79 | reeking not → recking not |
| Dropped word | 14.32 | they did "bear about in the body the dying of Jesus" → they did **not** … (the transcription reverses the sense) |
| | 14.33 | devised means → devised as means |
| | 19.48 | get demonstrations → get our demonstrations |
| | 22.53 | deep in lust → deep in the lust |
| | 26.62 | there is place → there is a place (Exodus 33:21) |
| | 27.66 | abroad random → abroad at random |
| | 29.73 | impels men → impels the men |
| Spelling | 17.41–18.47 | sub-numeration → subnumeration (×4 sections; the printing hyphenates it only in a chapter heading) |
| Stray mark | 5.10 | "^" before "Isaiah" removed (the printing has a footnote number there) |
| Greek | 5.9, 5.10, 5.11, 27.66 | (ek), (di' ou), (dia) ×5, (en) ×3, anastasis → ἐκ, δι' οὗ, διά, ἐν, ἀνάστασις (eleven words) |
| Opening quote | 2.4 ×2, 18.46 ×2, 21.52 ×2 | e.g. the term of whom' → the term 'of whom' |

**Left as the transcription has them:** two misprints in the 1895 printing itself, in all three scans:
11.27 "trangressors" and 16.39 "partriarchs" (hosted "transgressors", "patriarchs").

## 4. Bible references

`tools/fathers/check-refs.cjs` compared every reference with the BSB wording of its verse and the 40 words of
Basil's text before it: 472 references; 5 to verses that do not exist and 32 sharing no words with the text were
read by hand (3 more point to Baruch, Judith and Wisdom, which the BSB does not include). Each wrong reference
was then looked for in the scans' printed footnotes. **18 corrected** (`REF_CORR`, each with its reason on the
book page):

| | Where | Printed → corrected |
|---|---|---|
| Misprinted in 1895 (confirmed in the scans) | 5.7 | Rom. xi. 38 → Romans 11:36 |
| | 8.18 | Eph. v. 29 → Ephesians 5:27 |
| | 8.18 | 1 Cor. iv. 6 → 2 Corinthians 4:6 |
| | 12.28 | Rev. xxi. 18, 19 → Revelation 22:18–19 |
| | 18.46 | 2 Cor. i. 12 → 1 Corinthians 2:12 |
| | 19.48 | 1 John i. 20 → 1 John 2:20 |
| | 19.49 | Is. lxii. 14 → Isaiah 63:14 |
| | 23.54 | Ps. xxxix. 7 → Psalm 139:7 |
| | 30.78 | Ezek. xxiii. 5 → Exodus 23:5 |
| Slip in the transcription (scans print it right) | 5.9 | "1 John xvi. 15" → John 16:15 (scans: "John xvi. 15") |
| | 26.61 | "Gal. vi. 4" → Galatians 4:6 (scans: "Gal. iv. 6") |
| Wrong as transcribed; scans' footnote not read | 12.28 | Isaiah 60:1 → 61:1 |
| | 16.38 | Psalm 14:4 → 104:4 |
| Greek or Prayer Book numbering | 5.11 | Ps. cvii. 13 → Psalm 108:13 |
| | 6.15 | Ps. cxxxix. 7, P.B. → Psalm 139:8 |
| | 15.35 | Ps. li. 9 → Psalm 51:7 |
| | 24.55 | Ps. xxix. 12 → Psalm 30:12 |
| | 25.59 | 2 Cor. xiii. 13 → 2 Corinthians 13:14 |

The remaining 21 zero-overlap references were read and kept: they are loose allusions, Greek Old Testament
wording (Isaiah 3:3, Psalm 119:85, Isaiah 40:13), or the King James wording against the BSB's (1 Corinthians 11:12
"All things of God").

## 5. `/sources`

The three Basil passages already in `sources/cappadocians.json` came from New Advent and cited "ch. 9", "ch. 12",
"ch. 18". They are now cut from the hosted 1895 text and cite the section: `basil-holyspirit-9` → 9.22 (wording
changed: "which proceeds" → the printed "which proceedeth", with the printing's quotation marks),
`basil-holyspirit-12` → 12.28, `basil-holyspirit-18` → 18.47; source moved to the archive.org scan. Five new
passages: 11.27, 13.30, 16.37, 18.45, 19.49, each cut so that it names its own subject (the live AI sees only
author, work, section, translation and text). All eight pass `tools/check-father-quotes.mjs --strict`. In review,
9.22 was extended by two sentences (so it states that the Spirit is not "at all like the creature") and 18.45 by one
("The majesty is not cloven in two, nor the glory divided."); 11.27 now begins with the sentence that names its
subject, with an ellipsis over two Scripture quotations.

## 6. Rule 7 — the book checked against our own site

### 7(a) Quote-check (`tools/check-father-quotes.mjs --strict`)
All eight `/sources` passages for this work match the hosted text at the section they claim. No served page quotes
*On the Holy Spirit* word for word; the essays paraphrase it.

### 7(b) Error-hunter and improvement-finder (Sonnet, read-only)
**Claims on our pages not supported by the book (②) or weaker than the book (③): logged, not built (rule 9).**

| Row | Verdict | Where | Finding | Fix |
|---|---|---|---|---|
| B-1 | ② | `library/holy_spirit.html:182`; `ev-s6.html` ~720, 733, 790, 2609; `ev-m-holy_spirit.html` ~410, 477; ES mirror `ev-s6.es.html` ~447, 460 | "If the Spirit is worshiped with the Father and the Son, Basil argued, the Spirit shares their nature, for God alone is worshiped." "Shares their nature" is Basil's (13.30, 18.46); the premise "God alone is worshiped" is stated nowhere in the book. It is our inference, attributed to him. | Attribute the premise to the essay, or use 13.30 ("ranked together with God … on account of the natural fellowship"). Mirrors move with the English. |
| B-2 | ② (minor) | `library/holy_spirit.html:182` | "a grammar that quietly demoted the Spirit to an instrument": in the book the opponents call the **Son** the instrument and the Spirit "place" (4.6). | "…demoted the Spirit to a place or sphere, and the Son to an instrument" |
| B-3 | ③ | `library/holy_spirit.html:182` + fn 7; `ev-s6.html` ~720; `ev-m-holy_spirit.html` ~477 | "for pastoral reasons, avoided the bare formula": the book indeed has no "the Spirit is God" sentence, but the motive comes from Gregory of Nazianzus (Letter 58), not the book, and is uncited; read alone it can suggest Basil withheld the doctrine. | Cite Gregory for the motive; add 23.54 "in His nature divine" (the book page now does both). |
| B-4 | ③ | `library/nicene-creed.html:157`; `ev-s6.html` ~2553; `ev-m-holy_spirit.html` ~497 | The Pneumatomachi "granted the Son's deity … Basil answered them in On the Holy Spirit": the book's opponents also include a strand that put the Son "after" the Father (2.4, 6.13, 17.43). | Add the second strand. |
| B-5 | ③ | `library/holy_spirit.html:196`; `ev-s6.html` ~699, 736; `ev-m-holy_spirit.html` ~489, 542; `objections.json` ~2560 | "the very point Basil pressed" about prayer addressed to the Spirit: Basil argues about glory "with" the Spirit (25.58, 28.70), never about prayer to him. | "Basil's point about glory"; or quote 11.27 / 28.70. |
| B-6 | ③ | `library/holy_spirit.html:182` | "built his case less on a single proof-text than on the shape of Christian worship": chapters 16–24 are a long scriptural dossier. | Say he argues from Scripture, above all Matthew 28:19 as lived in worship (the book page now does). |
| B-7 | ③ | `library/holy_spirit.html:182` | The doxology sentence never says Basil also used "through the Son in the Holy Ghost" (1.3, 25.59). | Add 25.59. |

**Improvements (④), each a quote copied from the hosted text; each would re-open its essay's review:**
17.43 "the relation of the Spirit to the Son is the same as that of the Son to the Father" (holy_spirit, coordinate
rank); 19.49 "He existed; He pre-existed; He co-existed with the Father and the Son before the ages" (holy_spirit,
the "made, later, or lesser" clarifier); 18.46 "proceeding out of God, not by generation, like the Son, but as Breath
of His mouth" (holy_spirit, procession); 16.37 "sins against the Holy Spirit and against God are the same"
(holy_spirit, Acts 5); 21.52 the "temple" sentence (holy_spirit, 1 Cor 3:16); 29.73 "We praise Father, Son, and God's
Holy Spirit" and 29.72 Dionysius' doxology, "as Basil reports" (early_church_trinity); 24.55 "Where then are we to
take Him and rank Him? With the creature?" (nicene-creed); 18.44–45 (philosophical_trinity).

**Passages NOT to lean on (⑤):** 9.23 "the being made God" without a fence; 16.38 on angels' bodies; 20.51 on
slavery; 27.66 and 10.25 on unwritten tradition in our own voice; 18.45's image line for icons; 10.26, 12.28 and 15.35
on what baptism does; 29.73 on Origen without Basil's own fence ("not always and everywhere sound"); 8.19 "without
beginning" without the gloss. 29.74's "great Gregory" is Gregory the Wonderworker, not Nazianzus.

### 7(c) Review (rule 6)
Guide, topics, description, notes, `/sources` texts and copy-check prose: citations (Sonnet, web), argument (Opus),
orthodoxy (Opus) and neutrality (Fable), each a read-only agent, files md5-verified unchanged after every round. The
round-by-round account is in the stamp (`fathers/_data/basil-spirit.json` → `reviewed`). Translator: Blomfield
Jackson (1839–1905; UK National Archives), so the translation is public domain in life+70 countries as well as the US.

