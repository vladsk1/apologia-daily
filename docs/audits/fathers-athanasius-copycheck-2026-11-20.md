# Church Fathers library — Athanasius of Alexandria, *Against the Arians* (Discourses I–III): copy-check and rule-7 record

*2026-11-20. The fifth book of the Church Fathers "Full works" section (rules in `docs/FREE_LIBRARY_CANDIDATES.md`
→ "Church Fathers library: hosting rules"). East/West tally after it: East 3 (Gregory of Nazianzus, Basil, Athanasius) ·
West 2 (Hilary, Augustine). This file is the record behind the copy-check claim on the book page, and the rule-7
findings logged for later work. Same method as Augustine (`docs/audits/fathers-augustine-copycheck-2026-11-18.md`),
with the changes this text forced, recorded below.*

## 1. Where the text came from

| | |
|---|---|
| Translation | John Henry Newman's translation (Oxford, 1842–44), revised by Archibald Robertson, *Four Discourses against the Arians*, in *Nicene and Post-Nicene Fathers*, 2nd series, vol. 4, ed. Philip Schaff and Henry Wace (New York: The Christian Literature Company, 1892). |
| Public domain | Published 1892 (public domain in the US). |
| Base text hosted | CCEL's proofed transcription (`https://www.ccel.org/ccel/s/schaff/npnf204/cache/npnf204.txt`, "Rights: Public Domain"). Discourses I–III run from "Discourse I" (line 37495) to the notes of Chapter XXX; CCEL prints them in 30 chapter blocks, whose measured line ranges are in `tools/fathers/athanasius-config.json`, with the chapter-to-Discourse map in `tools/fathers/athanasius-map.json`. |
| Not hosted | **Discourse IV.** The 1892 volume prints it, but its editor notes that it "stands on a footing of its own": unlike the first three it is not quoted in antiquity as part of the work, and its place beside them is uncertain. The guide says so. |
| Not used | New Advent (modernises the English: the 1.58 passage already in `/sources` had "shows" where 1892 prints "shews", §5). CCEL's XML and HTML editions are JavaScript-rendered and could not be fetched. |
| Checked against | Archive.org scans of the 1892 printing: **A** `niceneandpostnic04unknuoft` (Toronto; curly quotation marks), **B** `selectlibraryofn04schauoft` (Toronto), **C** `selectlibraryofn04scha` (BYU), **D** `cu31924096463454` (Cornell), and **H** `selectlibraryofn0004henr` (Allen County; curly quotation marks; its OCR is broken by line and lacks pp. 306–310), used for the quotation marks only. |

## 2. What was removed (rule 1)

- The 1892 editors' introduction and table of contents, and **Newman's chapter headings** (summaries such as
  "Introduction. Reason for writing; certain persons indifferent about Arianism…"). The Discourses are divided by the
  numbered sections only.
- **Chapters are not sections (as in Augustine).** A chapter often begins in the middle of a section; the 1892 printing
  marks that with "22 (continued)." (or, three times, a repeated section number followed by "(continued)."). The
  prep script joins the chapter blocks into Discourses, drops the titles and the "(continued)" markers, and appends
  the paragraphs to the section they continue (9 places). Section counts after the join: **64, 82, 67**, no gaps.
- **The translator's secondary numbering** "(3.)" … "(12.)" printed inside Discourse I §§55–62 (it numbers the steps of
  the argument on Hebrews 1:4) is omitted: 10 markers. The transcription prints the seventh as "(7).", with the full stop
  outside the bracket; the first script missed it, and round 1 of the review caught it.
- The editors' 1,451 footnotes were read by script (`tools/fathers/extract-ccel.cjs`): **614 kept as Bible references
  only** (744 references in all); 837 dropped as editorial commentary (Newman's notes are long and doctrinal).
- The translator's words in square brackets ("[not]", 1.22) are the translation and are kept.

## 3. Word-for-word comparison

- Scripts: `tools/fathers/compare-scan-chunked.cjs`, `check-candidates-context.cjs`, `check-dropped-words.cjs`,
  `check-spellings.cjs`, as for Augustine; plus a new whole-text test (every run of six words of the hosted text looked
  up in the scans' word index), which found no unconfirmed run of more than eight words except at footnote numbers,
  page breaks and the letter æ.
- **Result against the transcription: 97.3% of words match scan A, 96.3% B, 96.6% C, 96.4% D** (95,900 words).
- **Changed words:** every difference two or more scans agreed on (929) was tested in context in all four scans and read
  by hand. ⚠ **Lesson for this volume: a superscript footnote number OCRs as "s"** ("salvation⁵" → "salvations", "sense⁵"
  → "senses"), so most "X → Xs" candidates were noise; each was settled by checking for a footnote marker at that point in
  the transcription.
- **Dropped words:** one (1.19, "through whom are **all** things"). The rest of the hits were section openings, footnote
  numbers and OCR noise.
- **Modernised spellings:** eight, listed below. The transcription otherwise keeps the 1892 spellings ("spake",
  "judgment" and "clothed" are printed so).
- **Quotation marks (new for this book).** The transcription had lost the opening single quotation mark of almost every
  quotation (Newman marks quotations with single marks; it kept only the closing one: "to unrip the folds of its
  breast-plate,' and"). They were restored from the scans (`tools/fathers/athanasius-quotes.json`, applied by the prep
  script with a check string at each position):
  1. For each word, the three words before and after form a key; a position was taken where scan A prints ‘ before the
     word and scan H or a straight-quote scan (B, C) agrees (1,854).
  2. Positions where only A had a mark were kept when they supplied the opening for a closing mark that otherwise had
     none (6), plus back-to-back quotations (11).
  3. For each closing mark still without an opening, scan A was read back to its opening mark and the place found in the
     text (19).
  4. The remaining 48 were placed by hand from the scans.
  5. **Every position was then re-tested in the raw OCR:** 1,887 are printed in two or more scans; the other 26 were read
     by hand. **17 were removed as false:** superscript footnote numbers that the OCR reads as ‘ or ' ("names‘:",
     "Gods‘,"), found because each sat right after a footnote marker in the transcription; three were moved to the right
     word (2.54, 2.61, 3.34); one duplicate was dropped.
  **Result: 1,913 opening marks restored.** A balance check (each opening paired with the next closing in its paragraph)
  leaves 12 closings and about 40 openings unpaired; these are quotations that run over a paragraph break (the Thalia,
  Asterius), nested quotations, and closing marks the 1892 printing itself places without a matching opening (3.11).
  Other punctuation was not compared.

**Corrections to Athanasius's text — 17, each confirmed in at least two scans** (`CORR` in
`tools/fathers/prep-athanasius.cjs`; all listed on the book page)

| Kind | Where | Transcription → 1892 printing |
|---|---|---|
| Changed word | 1.3 | and other, Cataphrygians → and others, Cataphrygians |
| | 1.50 | the Word Himself, hast spoken → had spoken |
| | 2.27 | but man out of their whole number → but many |
| | 2.32 | This it My Son → This is My Son |
| | 2.36 | such daring recurs a sentence → incurs |
| | 3.10 | among the sons of Gods → of God |
| | 3.57 | that so-called tenor → terror |
| | 1.30 | spirit out their own venom → spirt (the print's verb, "spurt") |
| Dropped word | 1.19 | through whom are things → through whom are **all** things |
| Older spelling | 1.45, 1.51, 1.59 | show → shew (×3) |
| | 1.46, 3.11 | shown → shewn (×2) |
| | 1.58, 3.15 | shows → shews (×2) |
| | 3.42 | stupefied → stupified |

(Counted on the book page as eight changed words, one dropped word and eight older spellings.)

**Left as the transcription has it:** one misprint in the 1892 printing itself, in all five scans: 1.38 "deifed men"
(hosted "deified").

## 4. Bible references

- `tools/fathers/check-refs.cjs` compared each of the 744 references with the BSB verse; a new sweep tested every Psalm
  reference against the neighbouring verses and the next psalm (the Greek numbering).
- **Eleven corrected** (`REF_CORR`): 1.36 Psalm 102:26–28 → 102:25–27; 1.57 Psalm 89:7 → 89:6; 2.46 Psalm 51:12 → 51:10;
  2.66 Psalm 22:32 → 22:31 (Greek and Hebrew verse numbering); 1.62 Psalm 30:3 → 31:2 (Greek psalm number); 2.6 Psalm
  145:14 → 145:13 (the line "The Lord is faithful in all His words"); 2.31 Psalm 168:5 → 148:5 (no Psalm 168); 2.71
  1 Corinthians 8:9 → 8:6; 2.81 "1 John 8:27" → Proverbs 8:27; 3.17 John 8:44 → John 17:22 (the 1892 footnote reads
  "John viii. 44", which does not fit "that they may be one as We are"); 3.59 Philippians 2:26 → 2:6.
- The 54 references that still share no word with their verse were read by hand: lists of several references at one
  marker (the check compares only the words before the marker), and Septuagint wording (Job 41:13 "the folds of its
  breast-plate", Proverbs 18:1, Isaiah 26:13, 9:6 "possessed of power"). Left as they are.
- The 8 references to Baruch, Wisdom and Sirach were not checked this way.

## 5. `/sources`

- **New file `sources/athanasius-against-arians.json`, four passages**, each cut by script from the hosted text and
  standing alone with a named subject: 1.9 (the statement of faith: "very God, existing one in essence with the very
  Father … He ever was and is and never was not"), 2.70 (why the Saviour must be truly God and truly man), 3.4 (Father and
  Son two, the nature one; Sabellius named), 3.30 ("He became man, and did not come into man").
- **Existing `athanasius-against-arians-1-58`** (in `sources/patristics.json`, captured 2026-10-09 from New Advent):
  re-verified against the hosted text. **New Advent had modernised "shews" to "shows"; the text now follows 1892.** Section
  changed from "Discourse I, §58" to "Discourse 1.58" so the quote-check can locate it; source URL now the scan, with a
  `context_url` to the hosted section.
- All five pass `tools/check-father-quotes.mjs --strict`.

## 6. Rule 7 — the book checked against our own site

### 7(a) Quote-check (`tools/check-father-quotes.mjs --strict`)
All five `/sources` passages match the hosted text at the section they claim. No served page quotes Athanasius's own
words from this work; the quotations the script finds near citations of it are Scripture or the Arian slogan "there was
when he was not" (1.13), correctly attributed.

### 7(b) Error-hunter (Sonnet) and improvement-finder (Fable), read-only, never handed each other's conclusions
Every Athanasius quotation below was re-checked by script against the hosted text (all exact). **All thirteen closed 2026-11-20, see 7(d)**; each re-opened its page's review. ② = error in ours (P1), ③ = weaker in ours, ④ = missing.

| Row | Verdict | Our page | Finding | Athanasius |
|---|---|---|---|---|
| AT-1 ✅ 2026-11-20 | ② P1 | `library/islam-jesusmuslim.html` ~174 (body) and ~201 (footnote) | Says Athanasius read John 14:28 of the Son's "humble station in the incarnation… esp. Book III". In this work he reads it by generation: "greater … not indeed in greatness, nor in time, but because of His generation from the Father Himself" (1.58). Book III gives the incarnate reading for *other* texts (3.26–50: John 17:5, "Glorify Thy Son", Mark 13:32); 14:28 appears there only in a list (3.7). | 1.58; 3.7; 3.38; 3.42–50 |
| AT-2 ✅ 2026-11-20 | ③ | `library/eternal_generation.html` fn 5 | Dates the work "c. 339–343" as settled; the date is disputed (the 1892 editor: 356–360; the hosted guide says so). Cites only "esp. Book I"; the radiance argument is at 1.12–14 and again 2.32–33. | 1.12, 1.14, 2.32 |
| AT-3 ✅ 2026-11-20 | ③ | `library/trinity_mormons.html` fn 9; `objections.json`; `briefs/_data.json` (deification by grace) | Cite only *On the Incarnation* 54. The Discourses state the line more sharply: "we too become sons, not as He in nature and truth, but according to the grace of Him that calleth … called gods, not as the True God or His Word". | 3.19; 1.39; 2.70 |
| AT-4 ✅ 2026-11-20 | ③ | `library/trinity_jw.html` ~187; `ev-m-trinity_jw.html` ~520 (Mark 13:32) | Give the reading to "the orthodox tradition" and Gregory only; Athanasius argues it at length: "so with men as man He knows not" (3.46); "not the Word's deficiency, but of that human nature whose property it is to be ignorant" (3.43). | 3.42–50 |
| AT-5 ✅ 2026-11-20 | ④ | `library/trinity_jw.html` (Proverbs 8:22); ev-s6 JW card | Answers by *qanah* and genre only; a Witness who insists Wisdom is Christ gets no reply. Athanasius's fallback from the same poem: "creature and offspring are not the same … 'But before all the hills He begat me'" (2.60, Prov 8:25). ⑤ Do **not** adopt his main answer (that "created" means the incarnation, 2.51). Keep our *qanah*/genre points, which are better. | 2.44, 2.60 |
| AT-6 ✅ 2026-11-20 | ③ | `library/john11.html` fn 14; `ev-s3.html` ~1217, ~1272 | "A creature cannot be the agent through whom all things were made" is cited "esp. Book II" only; pinpoint 2.5 ("by what word then and by what wisdom was He made Himself?") and 2.21 ("none of things which are brought to be is an efficient cause"). | 1.19, 2.5, 2.21, 2.24 |
| AT-7 ✅ 2026-11-20 | ③ | `ev-s6.html` ~2253, ~2307; `daily-args.json` ~816 (God "once not a Father") | Gives the change-in-God argument with Malachi 3:6 as if his; his own words: "nor is the character of Father adventitious to God, lest He seem alterable" (1.28); and his stronger immutability argument is about the Son: "the Image of the unalterable God must be unchangeable" (1.36). | 1.28, 1.35–36 |
| AT-8 ✅ 2026-11-20 | ③ | `library/trinity_jw.html` (worship); `library/jesus_as_god_nt.html` ("relative homage") | He names the principle: "for creature does not worship creature, but servant Lord, and creature God" (2.23), and answers the "homage to a superior" reading in the same section; adds Peter and Cornelius (Acts 10:26). ⑤ Not the Manoah line (a loose paraphrase of Judges 13:16). | 2.23 |
| AT-9 ✅ 2026-11-20 | ④ | `library/trinity_jw.html`, `library/jesus_as_god_nt.html`, `library/proto-trinitarian.html` (Phil 2:9) | The retort "if he was exalted and given the name, he was not God before" is unanswered on the page. "The exaltation is of the manhood" (1.41); "so, as man, is He said to take what, as God, He ever had" (1.42). ⑤ Not 1.43's "flesh which was enslaved to sin"; frame as one person. | 1.37–45 |
| AT-10 ✅ 2026-11-20 | ④ | `library/trinity_jw.html` (Michael section) | Hebrews 1:4 ("having become so much better than the angels") is the Witness counter-text in the chapter we use, never mentioned. "So when become man, He became by so much better in His ministry" (1.62); "become" follows the purging of sins (1.55). ⑤ Not his lexical claim that "better" marks a difference of nature. | 1.53–64 |
| AT-11 ✅ 2026-11-20 | ④ | `library/eternal_generation.html` ("A Reply—and What It Can Carry") | The will-or-necessity dilemma is untouched: "what is according to nature transcends and precedes counselling" (3.62); "as the Father is always good by nature, so He is always generative by nature" (3.66). Our "freely-willed generation" in the Craig summary sits against 3.66. ⑤ He does not answer Craig's aseity objection; our Calvin/autotheos paragraph is more careful. | 3.59–67 |
| AT-12 ✅ 2026-11-20 | ③ | `library/modalism.html` (John 10:30); `library/relations.html` (Rule Two) | modalism.html says "one in unity, power, and purpose… how the church has always read it" with no witness ("purpose" is also the Witness gloss); 3.4 rules out Sabellius by name and says "the nature is one". relations.html's earliest named source for mutual indwelling is John of Damascus; 3.3 gives the fourth-century ground ("it follows that the Son is in the Father and the Father in the Son"). ⑤ He never uses the word *perichoresis*. | 3.3–4 |
| AT-13 ✅ 2026-11-20 | ④ | `library/humanity.html` ("Why it matters") | A both-natures line to sit beside Gregory's "not assumed, not healed": "for in neither case had it been of profit to us men, whether the Word were not true and naturally Son of God, or the flesh not true which He assumed" (2.70; trim before "Mary Ever-Virgin" and "Ario-maniacs"). | 2.70 |

**Checked and correct:** `trinity_jw.html` and `ev-m-trinity_jw.html` on 1.58; `eternal_generation.html` and its `ev-m`
page on the radiance / "no 'when'" argument; `ev-s6.html` on "once not a Father, once without his Word"; "not from our
fathers" (1.8); `trinity_islam.html` on timeless generation; the `ev-m` flashcards for eternal_generation and john11;
*On the Incarnation* 54 correctly attributed wherever "made God" is quoted.

**Raised and not a finding:** the error-hunter flagged `library/nicene-creed.html` ~148 and `ev-s6.html` ~2591 ("'Similar'
would have left the door open… 'same' slammed it shut"), since *homoousios* does not occur in Discourses I–III (checked:
"one in essence" at 1.9 and 2.28 only). Those pages cite *De Decretis* and *De Synodis* for it, not this work, and these are
not hosted, so this check cannot test them.

**⑤ Ours is better (do not "improve" backwards):** Mark 13:32 / Luke 2:52 (our "human mind" account vs his "flesh" /
"instrument" language, 3.31–33, 3.52); Proverbs 8 (our Hebrew and genre handling); `eternal_generation.html` on Craig and
aseity; the essays' tone (never quote "Ario-maniacs", "a Jewish pretence" 1.14, "the present Jews" 1.38).

### 7(c) Review (rule 6)
The guide, the eight rule-2 notes, the copy-check text and the five `/sources` passages, gated by READ-ONLY Explore agents;
every reviewed file md5-verified unchanged after each round.
- **Round 1:** argument (Opus) NOT STAMPABLE — 1 BREAK (the copy-check text said the translator's "(3.)…(12.)" numbering
  was omitted, but "(7)." at 1.59 had survived) + 7 WEAK + 5 POLISH; orthodoxy (Opus) CLEAN, 0 HERESY, 8 NOTE; neutrality
  (Fable) NOT STAMPABLE — 1 BREAK (the canon sentence "Athanasius quotes them as Scripture", which also sat against
  `library/canon.html`) + 7 WEAK (three disputed questions with no note: images 3.5, the Spirit and the Son 3.24, falling
  from grace 3.25; the 3.12 note's side-taking second sentence; the Discourse IV sentence putting authorship doubt in the
  1892 editor's mouth; "Four Discourses" and an undisclosed date on `/sources`) + 5 POLISH. One merged fix pass.
- **Round 2:** neutrality STAMPABLE (all round-1 findings resolved; 3 POLISH). Orthodoxy + argument (Opus, one pass):
  1 DRIFT — "Like every image of God, it … is not a picture of God", which, with "Image" a title of the Son in this book,
  could be lifted as saying the Son is not truly God; and 2 WEAK — the new Triad sentence implied 1.18 names the Spirit (it
  does not), and the guide said the 1892 editors wrote the headings and notes (they are largely Newman's). Fixed, with
  the 1.34 baptismal formula supplying the Spirit.
- **Round 3** (narrow, the changed sentences in context; Fable, all three lenses): CLEAN / STAMPABLE / STAMPABLE, one
  argument POLISH on the 3.5 note (the illustration's image is the Emperor's portrait; "worshipped with the Father" is in
  3.6, not 3.5), fixed with its 3.6 quotation. **Round 4:** that note read by the same combined pass.
- **0 HERESY throughout.** Declined on record: a 3.33 note on sinlessness (the text says nothing of Mary's sinlessness, and
  the 1892 editor's own polemical use of 3.33 is what rule 1 strips); an optional 2.9 note on Christ's one sacrifice and
  the Eucharist (close paraphrase of Hebrews); citing Festal Letter 39 in the canon sentence (unverified here, and either
  way it would tip the question); "most later scholars date them around 340" (not verified; the guide says only that later
  scholars have argued for earlier dates).
- **Not run:** a web-enabled `apologia-citations` pass. The guide's biographical facts (born c. 296, bishop from 328, deacon
  at Nicaea, five exiles) are standard but were not source-checked from a session; the Chalcedon and Athanasian-Creed
  claims were checked against `sources/creeds.json`, the 1892 editor's dating and Discourse IV wording against CCEL by the
  neutrality lens.

### 7(d) Rows AT-1..AT-13 closed (2026-11-20)
Each fix quotes the hosted 1892 text with an inline link to the section, and was machine-checked at that section
(`tools/check-father-quotes.mjs`). Only `ev-s6` has a mirror touched by these rows (`ev-s6.mk.html`, AI-translated;
`ev-s6.es.html` has no equivalent line); no edited essay has an MK/ES mirror.

- **AT-1** (`islam-jesusmuslim.html` fn 14): the incarnate reading of John 14:28 is now "the one Augustine gives" (*On the
  Trinity* 1.14); Athanasius's generation reading quoted from 1.58 in full ("nay, in saying 'greater' He again shews that
  He is proper to His essence"), his incarnate reading pointed to Mark 13:32 (3.42–50), and the certified fence from
  `trinity_jw.html` ported ("a relation of origin is never an inequality"). The body sentence (~174) was left: it credits
  Athanasius with *homoousios* only. Bibliography now links the hosted book.
- **AT-2** (`eternal_generation.html` fn 5): "c. 339–343" → the date is disputed (the 1892 editor: 356–360; others
  earlier); pinpoints 1.12–14 and 2.32–33; links to the hosted book.
- **AT-3** (`trinity_mormons.html` fn 9): 3.19 added ("called gods, not as the True God or His Word").
  `objections.json` and `briefs/_data.json` **closed without change**: accurate as they stand (*On the Incarnation* 54,
  correctly attributed), and compressed.
- **AT-4** (`trinity_jw.html`, `ev-m-trinity_jw.html`): 3.43 added before Gregory's 380 answer on Mark 13:32.
- **AT-5** (`trinity_jw.html`): the "even granting Wisdom is the Son" reply: "brought forth" before the hills (8:25), "the
  language of birth, not of making", with 2.60 "creature and offspring are not the same". His own reading of "created"
  as the incarnation (2.51) was deliberately not adopted. The `ev-s6` card **closed without change**: its Proverbs 8
  material is the Old Testament card's positive use of Wisdom, not a reply to the Witness reading.
- **AT-6** (`john11.html` fn 14): pinpoints 2.5 and 2.21 with their words. `ev-s3.html` **closed without change**: a
  compressed list item whose claim is accurate; the essay carries the citation.
- **AT-7** (`ev-s6.html` + `ev-s6.mk.html`, "Line 4"): Malachi 3:6, presented as Athanasius's point, replaced by his own
  words, "He is ever Father, nor is the character of Father adventitious to God, lest He seem alterable" (1.28).
  `ev-s6.html` ~2253 and `daily-args.json` **closed without change**: accurate (error-hunter, "checked and correct").
- **AT-8** (`trinity_jw.html`): 2.23 "creature does not worship creature, but servant Lord, and creature God".
  `jesus_as_god_nt.html` **closed without change**: its altar argument already makes the point, more fully.
- **AT-9** (`trinity_jw.html`): the Witness appeal to Philippians 2:9 answered with 1.41–42 ("as man, is He said to take
  what, as God, He ever had"). `jesus_as_god_nt.html` and `proto-trinitarian.html` **closed without change**: they use
  2:9–11 only as positive evidence.
- **AT-10** (`trinity_jw.html`): Hebrews 1:4 "having become" read with 1:3 and 1.62.
- **AT-11** (`eternal_generation.html`): by will or by nature, 3.62 and 3.66 (both halves: "not 'from will'" yet "not
  without His pleasure or against His purpose"). "Freely-willed" in the Craig summary **left**: it states Craig's premise.
- **AT-12** (`modalism.html`, `relations.html`): 3.4 on John 10:30 (Sabellius named as Athanasius's own note, not as a
  label for readers); 3.3 for coinherence, with "the idea is older than the word". "One in unity, power, and purpose" and
  "always read it" on `modalism.html` are pre-existing wording, **logged, not changed** (rule 9; the new sentence no longer
  presents Athanasius as endorsing "purpose").
- **AT-13** (`humanity.html`): 2.70, "true Son and true flesh".
- **Review:** R1 argument (Opus) 10/11 STAMPABLE, 1 BREAK (relations.html: the insertion made "he describes" in the next
  sentence, John of Damascus, read as Athanasius); orthodoxy (Opus) CLEAN, 0 HERESY, 5 NOTE (the same slip, and fences on
  1.58, 1.62, 1.28 and Proverbs 8); neutrality (Fable) 1 BREAK (same) + 5 WEAK. One merged fix pass. R2: one combined
  pass (Fable) on the changed sentences.
