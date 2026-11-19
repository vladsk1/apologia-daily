# Church Fathers library — Augustine of Hippo, *On the Trinity* (Books 1–15): copy-check and rule-7 record

*2026-11-18. The fourth book of the Church Fathers "Full works" section (rules in `docs/FREE_LIBRARY_CANDIDATES.md`
→ "Church Fathers library: hosting rules"). East/West tally after it: East 2 (Gregory of Nazianzus, Basil) ·
West 2 (Hilary, Augustine). This file is the record behind the copy-check claim on the book page, and the rule-7
findings logged for later work. Same method as Basil (`docs/audits/fathers-basil-copycheck-2026-11-18.md`), with the
changes this text forced, recorded below.*

## 1. Where the text came from

| | |
|---|---|
| Translation | Arthur West Haddan, revised and annotated by William G. T. Shedd, *On the Holy Trinity*, in *Nicene and Post-Nicene Fathers*, 1st series, vol. 3, ed. Philip Schaff (Buffalo: The Christian Literature Company, 1887). |
| Public domain | Published 1887 (public domain in the US). Translators' dates: see §6 (citations check). |
| Base text hosted | CCEL's proofed transcription (`https://www.ccel.org/ccel/s/schaff/npnf103/cache/npnf103.txt`, "Rights: Public Domain"). The treatise runs from Book I, Chapter 1 to the notes of Book XV, Chapter 28; CCEL prints it in 226 blocks (one per chapter or preface), whose measured line ranges are in `tools/fathers/augustine-config.json`, with the block-to-book map in `tools/fathers/augustine-map.json`. |
| Not used | Wikisource and New Advent copies (the 1.7 passage already in `/sources` had been verified against Wikisource; it is now cut from the hosted text, §5). Four other archive.org items (`aselectlibraryn00augugoog` … `n03augugoog`, `onholytrinitydoc0003augu`) were looked at; the comparison used the three below. |
| Checked against | Three archive.org scans of the 1887 printing: **A** `selectlibraryofn03auguuoft` (Toronto), **B** `aselectlibrary03unknuoft` (Toronto), **C** `11517981bsb` (Bavarian State Library). |

## 2. What was removed (rule 1)

- The 1887 editors' introductory essay and their chapter headings (summaries such as "This Work is Written Against
  Those Who Sophistically Assail the Faith of the Trinity…"). The treatise is divided by the numbered sections only.
- **New for this book: chapters are not sections.** CCEL prints the text chapter by chapter, and a chapter often
  begins in the middle of a section; some books open with an unnumbered preface, which is that book's section 1.
  `tools/fathers/merge-chapters.cjs` (new) joins the chapter blocks into books, drops the chapter titles, makes each
  preface section 1, and appends the paragraphs that open a chapter before its first section number to the section
  they continue.
- The editors' 1,079 footnotes were read by script (`tools/fathers/extract-ccel.cjs`): **825 kept as Bible
  references only** (938 references in all); the rest dropped as editorial commentary.
- The translators' words in square brackets ("[completely]", "[the Latins]", "[sensuously]") render or fill out the
  sense; they are the translation and are kept. No in-text notes comparing the King James Version were found.
- ⑥ **Not hosted: Augustine's letter to Aurelius (Letter 174)**, which he asked to be set at the head of the work.
  The 1887 edition prints it inside the editors' introduction, not as part of the text. The guide quotes and cites
  it, and says it is not reproduced. Hosting it would need its own copy-check; an owner call.

## 3. Word-for-word comparison

- Scripts: `tools/fathers/compare-scan-chunked.cjs` (every 60-word run located in the scan separately),
  `check-candidates-context.cjs`, `check-dropped-words.cjs` and `check-spellings.cjs`, as for Basil. The first two
  now take their file names from the environment (`TEXT`, `SCANS`, `REPORTS`).
- **`check-dropped-words.cjs` rewritten for speed (same results):** it searched the whole of each scan for every
  candidate gap, which on a book this size ran for over half an hour without finishing. It now indexes each scan
  once as a set of 8–10-word runs, and finished in 15 seconds.
- **Result against the transcription: 99.4% of words match scan A, 96.2% scan B, 98.8% scan C** (178,185 words).
- **Changed words:** every difference that two or more scans agreed on (132) was tested in context in all three
  scans and read by hand. Uncertain readings were settled by a normalised search of the OCR ("distinction",
  "unknown", "towards us").
- **Dropped words:** found two (3.6 and 4.12; the second loses the "I" of "He might have said, I and they are, not
  one thing"). The rest of its hits were section openings (where the four-word context is empty), footnote numbers
  and Bible references printed in the scans' text, and OCR noise.
- **Modernised spellings:** none, except the forms listed below. This transcription, unlike Hilary's, uses the
  1887 American spellings ("labor", "honor", "show", "judgment"), which all three scans print.
- **Drop capitals:** the opening words of Books 3, 4 and 6 are printed in capitals; the transcription had run two
  of them together ("Theknowledge", "Somethink") and left "I Would".
- **Punctuation** was not compared.

**Corrections to Augustine's text — 28, each confirmed in at least two of the three scans** (`CORR` in
`tools/fathers/prep-augustine.cjs`; all listed on the book page)

| Kind | Where | Transcription → 1887 printing |
|---|---|---|
| Changed word | 3.8 | distraction → distinction |
| | 3.20 | more known → more unknown |
| | 3.27 | equal and eternal → equal and coeternal |
| | 4.21 | profiled → profited |
| | 4.22 | theHoly → the Holy |
| | 5.17 | find them; then → find Him, then |
| | 6.4 | maybe → may be |
| | 7.7 | He is altered → He is uttered |
| | 10.9 | corpustules → corpuscules |
| | 12.11 | schismstics → schismatics |
| | 12.23 | rumiuate → ruminate |
| | 13.14 | towards as → towards us |
| | 14.22 | former passages → former passage |
| | 15.13 | by all unstable → by an unstable |
| | 15.33 | whose shall drink → whoso shall drink |
| Dropped word | 3.6 | the creature serveth → the creature **that** serveth (Wisdom 16:24–25) |
| | 4.12 | He might have said, and they are → He might have said, **I** and they are |
| Opening capitals | 3.1, 4.1, 6.1 | I Would → I would; Theknowledge → The knowledge; Somethink → Some think |
| Older spelling | 1.2, 2.19, 5.3, 10.9, 13.16 | shall → shalt (×5) |
| | 15.26 | another → an other |
| | 15.38 | begot → begat |
| Misprint in 1887, corrected | 4.4 | comdemnation → condemnation (all three scans print the misprint; the book page says so) |

**Left as the transcription has them:** two misprints in the 1887 printing itself, in all three scans: 13.11 "they do
no will" and 15.21 "choses" (hosted "not", "chooses").

**Section numbering fixed (`NUMBER_FIX`):** 1.23 (the printing sets "—23." in the middle of a paragraph); 2.27 (the
printing numbers two sections "26"); 4.22 (the transcription runs "22.--" into the text). After the fixes every book's
sections run without a gap: 31, 35, 27, 32, 17, 12, 12, 14, 18, 19, 18, 25, 26, 26, 51.

## 4. Bible references

`tools/fathers/check-refs.cjs` compared every reference with the BSB wording of its verse and the 40 words of
Augustine's text before it: 938 references; none to verses that do not exist; the 63 sharing no words with the text
were read by hand; 43 point to Wisdom, Sirach and other books the BSB does not include and were not checked this way.
**13 corrected** (`REF_CORR`, each with its reason on the book page):

| | Where | Printed → corrected |
|---|---|---|
| Misprinted in 1887 | 1.23 | John 17:15 → John 16:15 |
| | 8.10 | 1 John 4:6 → 1 John 4:16 |
| | 13.24 | Romans 1:23 ↔ Romans 1:18 (the two footnotes printed in each other's place) |
| | 15.21 | 1 John 3:4 → 1 John 3:2 |
| | 15.45 | John 20:23 → John 20:22 |
| Latin verse numbering | 1.17 | Psalm 5:5 → 5:3 |
| | 1.31 | Psalm 31:21 → 31:20 |
| | 2.33 | Psalm 8:8 → 8:6 |
| | 4.6 | Psalm 15:3 → 15:2 |
| | 14.6 | Psalm 39:7 → 39:6 |
| Wrong as transcribed | 7.4 | John 5:2 → John 5:26 |
| | 14.25 | John 3:2 → 1 John 3:2 |

The other zero-overlap references were read and kept: they are lists of verses, allusions, or the Latin Bible's
wording against the BSB's.

## 5. `/sources`

`sources/augustine.json` held one passage from this work, `augustine-trin-1-4-7`, verified against Wikisource and
cited "On the Trinity I.4.7". It is now cut from the hosted 1887 text (wording unchanged), cites section 1.7, links
to its place on the book page, and its source is the archive.org scan. Five new passages, each cut so that it names
its own subject (the live AI sees only author, work, section, translation and text): 1.14 (the form of a servant),
5.6 (relation, not substance), 5.10 ("three persons"), 15.43 (the image is one person, the Trinity three) and 15.51
(the closing prayer). Each note gives the traditional book.chapter.section form too. All six pass
`tools/check-father-quotes.mjs --strict`.

## 6. Rule 7 — the book checked against our own site

### 7(a) Quote-check (`tools/check-father-quotes.mjs --strict`)
All six `/sources` passages match the hosted text at the section they claim. One phrase is quoted word for word on
served pages: "not according to substance, but according to relation" (`library/relations.html`, `ev-s6.html`,
`ev-m-relations.html`), which matches 5.6.

### 7(b) Error-hunter and improvement-finder (Sonnet, read-only)
**Claims on our pages not supported by the book (②) or weaker than the book (③): logged, not built (rule 9).** Each
quotation below was re-checked against the hosted text before logging. Mirrors (`.mk`, `.es`) and port files move
with their English pages when a row is fixed.

| Row | Verdict | Where | Finding | Fix |
|---|---|---|---|---|
| A-1 ✅ FIXED 2026-11-19 | ② | `library/analogies.html:194`; `ev-s6.html` ~1221, 1233, 1287; `ev-m-analogies.html` ~392, 457, 553, 1021 | We present "the mind knows itself and loves itself" as Augustine's image of God. At 14.15 he says the opposite: "This trinity, then, of the mind is not therefore the image of God, because the mind remembers itself, and understands and loves itself; but because it can also remember, understand, and love Him by whom it was made." | Say Books 9–10 find the triad in the mind's knowing and loving itself, and Book 14 that it is the image when the mind turns to God (14.15; 14.11). Add Book 14 to the "esp. Books VIII–X and XV" citations. |
| A-2 ✅ FIXED 2026-11-19 (ev-m-philosophical_trinity closed, see 7(d)) | ② | `ev-s6.html` ~1073, 1118; `ev-m-philosophical_trinity.html` ~391, 469, 566, 1103; `library/philosophical_trinity.html:156`; `library/relations.html:177` | "Subsistent relations" and "persons distinguished by relation alone" attributed to Augustine, or to "Augustine and Aquinas" together. Augustine never uses "subsistent relation"; at 7.11 "person" is said "in respect to Himself", and at 7.9 "it is absurd that substance should be spoken relatively". | Attribute "subsistent relations" to Aquinas. For Augustine: the three are named by relative terms (Father, Son, Gift; 5.6, 5.12, 8.1), and "person" is not itself a relative word (7.11). |
| A-3 ✅ FIXED 2026-11-19 | ② | `library/philosophical_trinity.html:156`; `ev-m-philosophical_trinity.html` ~391, 469 | "the mind's memory, understanding, and will as a created **trace**". Augustine keeps "trace" for the outward-sense triads (11.1 "some trace, however slight, of the Trinity, not that itself also is in the same manner the image of God") and calls the mind's triad the image (14.11). | "created image". |
| A-4 ✅ FIXED 2026-11-19 | ② | `library/relations.html:206`; `ev-m-relations.html` ~567 | Footnote: Book V chs. 5–6 say "not according to substance, but according to relation", "and in God nothing is greater or lesser". The quotation is 5.6 (and concerns Father and Son); "nothing greater or lesser" is not in Book 5 chs. 5–6 but at 8.2–8.3 and 15.5. | Cite 5.6 for the quotation; 8.2 and 15.5 for equality; link the hosted page instead of newadvent. |
| A-5 ✅ FIXED 2026-11-19 | ② | `library/relations.html:145`; `ev-s6.html` ~2407; `ev-m-relations.html` ~439 | "the names Father, Son, and **Spirit** are said … according to relation". At 5.12 the relation "is not itself apparent in that name, but it is apparent when He is called the gift of God". | Father and Son named by relation (5.6); the Spirit's relation shows in "Gift" (5.12, 8.1). |
| A-6 ✅ FIXED 2026-11-19 | ③ | `library/relations.html` 145, 177 | Relation as the only distinction, without Augustine's own fence that the relation is not an accident (5.5–5.6). | Add 5.6 "which relation, however, is not accident, because it is not changeable". |
| A-7 ✅ FIXED 2026-11-19 | ② | `library/analogies.html` 194, 219; `ev-m-analogies.html` ~553 | Augustine "well aware that it leaned toward the modalist side". The book never says so. What it says is 15.42–43: the three in a man belong to one person, and the Trinity is three persons. | Quote 15.42–43; treat "modalist" as our label for the limit. |
| A-8 ✅ FIXED 2026-11-19 | ③ | `library/analogies.html:194`; `ev-m-analogies.html` ~457, 459 | Our paraphrases of his confession of inadequacy, with no section. | Quote 15.42 ("it is I that remember, I that understand, I that love, who am neither memory, nor understanding, nor love, but who have them"), 15.43, 15.45, 15.28. |
| A-9 ✅ FIXED 2026-11-19 | ② | `library/analogies.html:218` | "written c. AD 400–428", and the lover / beloved / love triad placed in Book IX. The triad first appears at 8.14 (repeated 9.2, retreated from at 15.10). The dates conflict with the book page; the end date is uncertain (see 7(c)). | Cite 8.14; align the dates with the book page. |
| A-10 ✅ FIXED 2026-11-19 | ③ | `library/relations.html` 165, 211; `ev-s6.html` ~2410; `ev-m-relations.html` ~389, 448 | The maxim *opera ad extra indivisa* "traceable to Augustine, Books I–II". The Latin maxim is later; the book says "as they are indivisible, so work indivisibly" (1.7), and 2.18 "the invisible Trinity wrought the visible person of the Son alone". | Cite 1.7, 2.9, 2.18, 4.30; call the Latin formula a later summary. |
| A-11 ✅ FIXED 2026-11-19 (nt_trinity closed, see 7(d)) | ③ | `library/trinity_jw.html:185`; `library/nt_trinity.html:181` | "the sender is greater than the sent" / "greater in position" as the classical answer to John 14:28. Augustine argues the reverse at 4.27: "Not because the one is greater, the other less; but because the one is Father, the other Son"; his rule is 1.14. | Use 1.14 + 4.27. Doctrinal surface: re-gate. |
| A-12 ✅ FIXED 2026-11-19 (Augustine dropped) | ② | `ev-s6.html` ~2255 | "the Fathers (Origen, then Augustine) read the divine 'today' [Psalm 2:7] as the eternal present". Not in *On the Trinity* (2.33 reads Ps 2:7 of the Son as man). It may be in his other works (not hosted). | Cite the other work, or drop "then Augustine". |
| A-13 ✅ FIXED 2026-11-19 | ③ | `ev-s6.html` ~1287; `ev-m-analogies.html` ~457, 1021 | "The Spirit as mere 'love between' shrinks…" reads as a rebuttal of Augustine, who does call the Spirit love and "a certain unutterable communion of the Father and the Son" (5.12; 6.7), with his own fence at 15.37 ("not alone therein love"). | Say Augustine calls the Spirit love and communion and fences it (15.37). Doctrinal surface: re-gate. |
| A-14 ✅ FIXED in this build | ② | `sources/augustine.json` 15.43 note | Said "memory, understanding, will"; 15.43 names memory, understanding and love. | Fixed before publishing; the year on all six passages is now 420, matching the book page. |

**Improvements (④), quotes copied from the hosted text:** 15.28 (the persons are not the memory, understanding and love
"of all three"), 15.45 ("endeavor rather than accomplishment"), 14.15, 2.18, 5.12 (Gift), 4.27, 1.14 — for
`analogies.html`, `relations.html`, `ev-s6.html`, the "greater than I" pages.

**Passages NOT to lean on (⑤):** 1.22 ("less than the Holy Spirit", form-of-a-servant frame needed); 5.14–5.15 and
15.29, 15.45–48 on procession (filioque; 15.47 builds it on the mind analogy); 15.37, 6.7, 5.12 ("the Spirit is
love/communion") without 15.37's fence; 7.9 and 7.11 for "persons distinguished by relation" (they say the opposite);
8.14 / 9.2 beside Richard of St Victor's argument (9.2 asks "what if I love none except myself?"); Book 5's
categories (5.8) and 7.11's genus/species as stand-alone summaries.

### 7(c) Review (rule 6)
Guide, topics, description, notes, `/sources` texts and copy-check prose: citations (Sonnet, web), argument (Opus),
orthodoxy (Opus) and neutrality (Fable), each a read-only agent, files md5-verified unchanged after every round; four
rounds, 0 HERESY throughout. The round-by-round account is in the stamp (`fathers/_data/augustine-trinity.json` →
`reviewed`). Two lessons:

- **Check a reviewer's suggested wording against the text before using it.** Round 1's argument lens proposed saying
  that texts such as John 5:19 show the Son "neither less nor equal" and cited 2.2; 2.2 says "not indeed less than, but
  equal to the Father". The phrase is Augustine's, but at 2.3, and only with its context ("only to intimate that He is of
  the Father"). Round 3 built the sentence from both sections, each for what it says.
- **Verify that a fix reached the file.** The script that writes `/sources` added new passages but did not replace
  existing ones, so round 1's fixes to five passages were reported as made and were not on disk. Three lenses caught it
  in round 2. The script was fixed to replace entries by id, and round 3 read all six entries as they stand on disk.

Translators: Arthur West Haddan (d. 1873) and William G. T. Shedd (d. 1894), so the translation is public domain in
life+70 countries as well as the US. The title page of all three scans reads "Buffalo: The Christian Literature Company,
1887".

### 7(d) Rows A-1..A-13 fixed (2026-11-19)
Every row was fixed on its English page, its `ev-s6` card and its `ev-m-*` page, with `library/mk/analogies.html`,
`ev-s6.mk.html` and `ev-s6.es.html` moved in the same change. Each quotation is from the hosted 1887 text, with an inline
link to the section on the English essays, and was machine-checked at its section.

- **A-1, A-7, A-8** (analogies): 8.14 for the love triad; 14.15 for where the image lies; 15.42 ("it is I that remember … but
  who have them") and 15.45 ("three things belonging to one person … cannot suit those Three Persons") for the limit, with
  "modalist" kept as our label. Compressed tiers carry "God's image because it can also remember, understand, and love God".
- **A-2**: "subsistent relations" now credited to Aquinas, "building on Augustine", on `ev-s6` and `relations.html`.
  `ev-m-philosophical_trinity.html` (391, 469, 566, 1103) **closed without change**: it already credits subsistent
  relations to Aquinas, and what it gives Augustine (relations of origin; a relation adds no component) matches 5.6
  ("not accident") and 8.1.
- **A-3**: "created trace" → "created image" (`philosophical_trinity.html`). The `ev-m` page never said "trace".
- **A-4, A-5, A-6** (relations): 5.6 with its not-accident fence for Father and Son; 5.12 for the Spirit as Gift;
  footnote 5 now cites 5.6, 5.12, 8.1–8.2, 15.5 and links the hosted text.
- **A-9**: "begun c. AD 400 and finished c. 420 or later"; the love triad "first appears at 8.14 (and again at 9.2)".
- **A-10**: 1.7 "as they are indivisible, so work indivisibly", given as Augustine summing up the writers before him; the
  Latin maxim called "its later summary"; footnotes cite 1.7, 2.9, 2.18, 4.30.
- **A-11**: "the sender is greater than the sent" removed from `trinity_jw.html`, `ev-m-trinity_jw.html`, the mastery
  port, and five copies on the `ev-s6` cards (EN 3, MK 3, ES 1 — the round-1 gate found the card copies, which this row
  had not listed). Augustine's 1.14 ("equal to God the Father in nature, but less in 'fashion'") and 4.27 added on the JW
  pages; "as he prays and is sent" → "as he prays" (sending in the human register clashed with 4.27).
  `library/nt_trinity.html:181` **closed without change**: "greater in position, within the incarnate mission" is the
  form-of-a-servant reading of 1.14, with no sender clause.
- **A-12**: "the Fathers (Origen, then Augustine)" → "Fathers such as Origen" (EN/MK/ES). Augustine's *Exposition of Psalm 2*
  may carry the reading but is not hosted and was not verified, so it was not cited.
- **A-13**: the "love between" warning now carries Augustine's own fences (6.7, 15.37; 15.42 on the essay).
  `ev-s6.html`'s compressed "Pointers, not pictures" line and the `ev-m-analogies` flashcard **closed without change**:
  both already say the Spirit is "the third divine person", which Augustine also holds.
- **Found by the gate, fixed in the same change:** `ev-s6.es.html`'s Latin-model card still stated the filioque in the
  site's voice ("relación de espiración (proceder del Padre y del Hijo)") and called the persons "aspectos/polos
  relacionales". Ported from the certified English card (procession; West adds "and the Son", East "from the Father",
  reported, not adjudicated).
