# Church Fathers library — Hilary of Poitiers, *On the Trinity* (Books 1–12): copy-check and rule-7 record

*2026-11-18. The second book of the Church Fathers "Full works" section and the first from the West
(rules in `docs/FREE_LIBRARY_CANDIDATES.md` → "Church Fathers library: hosting rules"). This file is the
record behind the copy-check claim on the book page, and the rule-7 findings logged for later work.
Same method as the Gregory pilot (`docs/audits/fathers-nazianzus-copycheck-2026-11-18.md`), with three
changes forced by this text, all recorded below.*

## 1. Where the text came from

| | |
|---|---|
| Translation | *Nicene and Post-Nicene Fathers*, 2nd series, vol. 9, ed. Philip Schaff and Henry Wace, volume editor W. Sanday (Oxford and London: Parker; New York: Scribner's, 1899; Sanday's preface is dated 12 July 1898). *On the Trinity*: Books 1–7 by E. W. Watson, Books 8 and 12 by E. N. Bennett, Books 9–11 by S. C. Gayford (Sanday's preface). L. Pullan, named on the title page, translated *De Synodis*, not this work. |
| Public domain | Published 1899. Watson died 1936, Bennett 1947, Gayford 1945: more than 70 years have passed for each, so the translation is public domain in life+70 countries as well as in the US. |
| Base text hosted | CCEL's proofed transcription (`https://www.ccel.org/ccel/s/schaff/npnf209/cache/npnf209.txt`, header "Rights: Public Domain"; CCEL gives its print basis as "Edinburgh: T&T Clark, 1898", a later reprint of the same pages). *On the Trinity* starts at line 10311. |
| Not used | New Advent's copy, which modernises the English (see the Gregory record). |
| Checked against | Three archive.org scans, page for page the same (the same page break, "220 DE TRINITATE", falls at the same words in all three): **B** `cu31924103070110` (Cornell copy, imprint dated 1899), **A** `selectlibraryofn09scha` (1908 Scribner's reissue), **C** `bwb_KS-420-200_9` (Parker printing; best OCR of the three). A fourth, `aselectlibraryn09wacegoog`, was downloaded as a reserve and not needed. |

**Edition year.** CCEL and some catalogues give 1898; the volume's own imprint (scan B) is 1899, and the
1898 date is the preface's. The site says 1899 throughout.

## 2. What was removed (rule 1)

All 850 editors' footnotes in Books 1–12 were read by script. **630 reference footnotes were kept,
reference only** (680 individual references; some footnotes carry several) — any commentary attached to a
reference was dropped. **220 were dropped entirely** as editorial commentary (Latin readings, Benedictine
notes, cross-references to other books of the work, doctrinal comment). The editors' introductions are not hosted.

**Parser fixes made for this book** (`tools/fathers/extract-ccel.cjs`; Gregory's extraction re-run
byte-identical after each, verified with `cmp`):
- "Ib." means the book of the previous *footnote*. The parser had been carrying the book from the previous
  reference in the *text*, which differs where the editors cite out of order; it now resolves notes in footnote order.
- A double psalm number ("Ps. civ. (ciii.) 4") gives the Greek/Latin and the English number in either order;
  the parser now takes the larger, which is the English one. (It had taken the bracketed one, so "civ. (ciii.)" became Psalm 103.)
- With `verseLists` on (Hilary's config only, so Gregory's output cannot change), ", 28" and ", 4–6" after the
  first verse are kept — as a range when consecutive (1 Cor 15:27–28), else as separate references — and a range
  across chapters ("Matt. xvi. 28–xvii. 2") is kept as its first verse. Before this, "St. Matt. xvi. 28–xvii. 2"
  failed to parse, so the next note's "Ib. xiii. 40–43" fell back to 1 Corinthians.

## 3. Word-for-word comparison

- Script: `tools/fathers/compare-scan-robust.cjs` (new). The sequential comparer used for Gregory lost its place
  in Hilary (81.7% and 45.7%), because the scans interleave long footnotes with the text. The new one locates each
  section by voting (every 4-word run of the section votes for a start position in the scan), then aligns by
  longest common subsequence in 300-word chunks.
- **Result against the unaltered transcription: 99.2% of words match scan A, 97.1% scan B, 98.1% scan C**
  (174,721 words). Sections below 90% were all footnote interleave, read by hand: 9.22, 9.55, 10.42 (which
  turned up one real dropped word, below) and 11.3 in A/B; 2.8–2.11, 3.13, 5.38, 8.20, 9.39, 9.45, 10.13,
  10.50, 10.52, 12.56 in C.
- **Candidates:** every real-word difference that two scans agreed on (111 between A and B; 141 more between C
  and A or B). Each was re-located and tested by script in context (three words either side, in all three scans),
  then read by hand. Most were page headings, footnotes, a neighbouring section's text across a column break,
  or shared OCR errors (italic "shalt" read as "shall" in A and B but "shalt" in C; "earnest" for "camest";
  footnote superscripts read as a final "s").
- **Modernised spellings:** every occurrence of the forms CCEL is known to modernise (begot/begat, spoke/spake,
  honor/honour, showing/shewing, naught/nought, recognize/recognise, fullness/fulness, wrath/wroth and 18 more
  pairs) was tested against all three scans. Where the printing has the older form at that place in two or more
  scans, it is restored; where it has the modern form ("judgment" ×41, "spoke" ×45, "show" ×7), it is kept.

**Corrections to Hilary's text — 63, each confirmed in at least two of the three scans**
(`tools/fathers/prep-hilary.cjs`, which asserts each matches exactly once):

| Section | Transcription | 1899 printing |
|---|---|---|
| 1.5 | found in these words | found in them words |
| 1.13 | limits which barred | limits which bound |
| 1.13 | rudiments of the word | rudiments of the world |
| 2.15 | that Which was in the beginning | that That Which was in the beginning |
| 2.22 | the Sun was begotten | the Son was begotten |
| 2.27 | and that Son shall be named | and that that Son shall be named |
| **3.3** | **only a possible and embodied being** | **only a passible and embodied being** |
| 3.22 | orThou | or Thou |
| 4.4 | a nature pro-existent | a nature pre-existent |
| 4.27 | do this things | do this thing |
| 4.30 | clear that demand | clear that that demand |
| 6.46 | the dating which | the daring which |
| 7.3 | by experience holy brigands | by experience how brigands |
| 7.7 | adversaries are ranted | adversaries are routed |
| 7.22 | us know that nature | us know that that nature |
| 7.24 | of the seal of David | of the seed of David |
| 8.44 | wholly whoever | wholly whatever |
| 8.46 | the nature of Gods— | the nature of God— |
| 9.53 | and I came unto you | and I come unto you |
| 9.70 | the mystery His birth | the mystery of His birth |
| 9.70 | being unskilled statement | being unskilled in statement |
| 10.2 | some shall away | some shall fall away |
| **10.9** | **the impossible nature of God** | **the impassible nature of God** |
| 10.10 | is not worth of Me | is not worthy of Me |
| 10.11 | the drought of vinegar | the draught of vinegar |
| 10.41 | the reality all His body | the reality of His body |
| 10.42 | while I was them | while I was with them |
| 10.54 | pry into secrets | pry into the secrets |
| 11.28 | but fulfil it | but to fulfil it |
| 11.31 | which is to came | which is to come |
| 11.34 | the covenant firm Me | the covenant from Me |
| 11.40 | through dissolutions | through dissolution |
| 12.1 | venture out trusty bark | venture our trusty bark |
| 12.20 | which hit themselves | which lift themselves |
| 12.34 | His is name is | His name is |
| **12.50** | **His impossible birth** | **His impassible birth** |
| 27 places | begot, spoke, wrath, honor, showing, naught, recognize, fullness | begat (10), spake (9), wroth, honour, shewing, nought (2), recognise (2), fulness |

The three in bold matter doctrinally: the transcription made Hilary say God's nature is "impossible" and Christ's
birth "impossible" where he wrote "impassible" (not subject to suffering).

**Kept as the transcription has them, against a misprint in the printing itself** (all three scans):
4.41 "these words God" (printed; the transcription's "these words of God" kept) and 5.37 "their is no novel
element" (printed; "there" kept).

**Not changed:** 4.17 "It you do not understand" (two scans; a misprint or OCR, "If" kept); 7.21, 9.30, 9.34,
10.34, 10.40 (footnote superscripts read as letters); the doubled phrases at section starts (4.32, 10.26, 12.28,
12.40, 4.9), which are neighbouring-section text.

- **Translation crux, not a copy error:** 12.55 reads in all three scans "will I refuse to say that the Holy
  Spirit was begotten". It is printed so, and it reverses Hilary. The Latin (la.wikisource, `De_Trinitate_(Hilarius)/12`, a Migne-based
  text, fetched raw 2026-11-18) reads: "Neque, quia te solum innascibilem, et unigenitum ex te natum sciens,
  genitum tamen Spiritum sanctum non dicturus sim, dicam umquam creatum" — though he will not call the Spirit
  begotten, he will never call him created. Joey Newton, "Hilary of Poitiers' View of the Holy Spirit",
  *Churchman* 129/1, reads it the same way (Hilary's "refusal to say that the Holy Spirit was begotten"). The note on
  the page says so and quotes the Latin. The critical edition (Smulders, CCL 62A) was not consulted.
- Stray spaces left before punctuation where a footnote marker was removed were closed up (whitespace only).

## 4. Bible references (the editors' references, not Hilary's words)

All 680 references were checked by `tools/fathers/check-refs.cjs` (now taking the text path as an argument)
against the BSB wording of the verse they point to. Six pointed to verses that do not exist; 37 shared no words
with the 40 words of Hilary's text before them. Each was read by hand. **Nineteen are corrected:**

| Section | 1899 | Corrected | Why |
|---|---|---|---|
| 1.30 | Mark 14:28 | John 14:28 | the edition prints "Ib." after a Mark note; the words are John 14:28 |
| 2.33 | John 14:13–14 | John 16:13–14 | misprint |
| 4.8 | Psalm 7:12 | Psalm 7:11 | Greek/Latin verse number |
| 4.8 | Psalm 139:6–9 | Psalm 139:7–10 | misprint (printed "cxxxix. 6-9 (cxxxviii. 7-10)") |
| 4.16 | Psalm 168:5 | Psalm 148:5 | misprint (there is no Psalm 168) |
| 6.44 | 1 John 8:3 | Romans 8:3 | misprint (1 John has five chapters; seen in one scan) |
| 7.30 | John 2:6 | John 3:6 | misprint |
| 8.1 | Titus 1:9 | Titus 1:10 | misprint |
| 8.25 | Psalm 2:8 | Psalm 2:7 | misprint ("Thou art My Son") |
| 9.24 | Mark 12:52 | Mark 12:32 | misprint (Mark 12 has 44 verses; printed "xii. 52, 33") |
| 10.12 | Psalm 15:10 | Psalm 16:10 | Greek/Latin psalm number |
| 10.12 | Matthew 26:16 | Matthew 26:61 | misprint |
| 10.68 | Genesis 15:16 | Genesis 15:6 | misprint (seen in one scan) |
| 11.23 | 1 Timothy 5:11 | 1 Timothy 6:11 | wrong as the transcription gives it; the scans' footnote is too faint to say whose slip |
| 12.3 | Romans 1:23 | Romans 1:25 | wrong as the transcription gives it; the scans' footnote is too faint to say whose slip |
| 12.8 | Psalm 109:3 | Psalm 110:3 | Greek/Latin psalm number (printed "(LXX.)") |
| 12.14 | Psalm 21:32 | Psalm 22:31 | Greek/Latin psalm number (printed "(LXX.)") |
| 12.34 | Psalm 71:17 | Psalm 72:17 | Greek/Latin psalm number (printed "(in LXX.)") |
| 12.39 | Psalm 32:6 | Psalm 33:6 | Greek/Latin psalm number (printed "(LXX.)") |

Each printed form was looked for in the three scans' footnotes. **Eleven are misprints in the 1899 edition, two are wrong as the transcription gives them, and six use the Greek/Latin numbering (five psalm numbers, one verse number).**

The other 24 with no shared words are correct: Greek-Old-Testament wording (Isa 53:8, Isa 65:16, Jer 17:9,
Hos 13:4, Prov 8:21, Deut 30:13), the first verse of a list whose later verse matches (Exod 3:2, Eph 4:7,
2 Tim 4:6), or loose allusions (Matt 1:23 "Emmanuel", John 11:35, Mal 3:6, the three "offended" texts at 10.37).
Four point to Wisdom, Baruch and 2 Maccabees, which the tap-to-read feature does not cover.

## 5. Scripts and integrity guard

New or changed in `tools/fathers/`: `hilary-config.json` (line ranges, measured), `prep-hilary.cjs`,
`compare-scan-robust.cjs`, `verify-candidates.cjs` (each candidate tested in context in three scans),
`check-spellings.cjs` (every modernisable spelling against three scans), and the parser fixes in `extract-ccel.cjs` (§2). `tools/build-fathers.mjs` no longer
hard-codes Gregory (place, print year and author short name come from the book's data; Gregory's pages rebuilt
byte-identical). `tools/check-father-quotes.mjs` now reads one-digit book numbers in citations. The CCEL text and
the scans are not stored in the repo; their URLs are above.

The hosted text's SHA-256 is recorded in `fathers/_data/hilary-trinity.json` → `copyCheck.textSha256`.

## 6. Rule 7 — the book checked against our own site

### 7(a) Quote-check (`tools/check-father-quotes.mjs --strict`)
All 6 `/sources` passages for this work match the hosted text at the section they claim (five new — 3.3, 9.56,
10.22, 12.32, 12.56 — and the existing 2.1 passage, re-verified against the 1899 text, extended by one sentence,
its translator corrected from "Watson & Pullan" to Watson and its source moved off New Advent). A 12.31 excerpt
("So He was born and yet has always existed…") was replaced by 12.32 in review: the live AI sees only author, work,
section, translation and text, and 12.31 never names its subject. No served page quotes Hilary's *On the Trinity*
(the only "Hilary" in the essays is Hilary Putnam, `library/mathematics.html`).

### 7(b) Error-hunter and improvement-finder (Sonnet, read-only, md5-verified)
**Errors in OUR pages (verdict ②): none.** Every served surface was searched for "Hilary", "Poitiers", "Hilarius"
and "De Trinitate"; the only Hilary of Poitiers content is `sources/hilary.json`. No essay, card, mastery page,
answer, brief, daily argument, pocket card or worldview names him, and no "De Trinitate" on the site is
misattributed to him (those are Augustine's, or Richard of St Victor's).

**Improvements (verdicts ③ / ④): logged, not built (rule 9).** Each would re-open its essay's review. The pass
string-matched each quotation to the hosted text; re-check when used.

| Row | Verdict | Essay (after the sentence named) | Hilary | Why |
|---|---|---|---|---|
| H-1 | ③ | `library/relations.html` ("the persons are distinguished by order, never by rank") | 9.56 "The Father therefore is greater, because He is Father: but the Son, because He is Son, is not less." | the essay's rule, stated c. 360 of John 14:28; strongest fit |
| H-2 | ④ | `library/eternal_generation.html`, "How the Doctrine Developed" (after Athanasius on "no 'when'") | 12.32 "whatever period of time is denied to the Son, to make His sonship non-eternal, just so much the Father lacks of having been always a Father" | no Western, pre-381 witness in the essay; now a `/sources` passage |
| H-3 | ④ | same paragraph (optional) | 3.3 "Thus He is the Only-begotten, perfect, eternal Son of the unbegotten, perfect, eternal Father." | plain "begotten, not made" |
| H-4 | ③ | `library/trinity_jw.html` (after "the Father in unveiled glory greater than the Son veiled in flesh") | 9.54 "The Giver is greater: but the Receiver is not less, for to Him it is given to be one with the Giver." | ⚠ Hilary's main reading is origin, not the essay's incarnation reading; add that the fathers gave both |
| H-5 | ④ | `library/holy_spirit.html` (after "…then a creature is doing the work of God in salvation.") | 12.56 "shall I count the nature of the Spirit among created things, and limit Him by fixing the time of His origin?" | Spirit not a creature, before Basil and 381; avoids the "through Him" wording |
| H-6 | ③ | `library/nicene-creed.html`, "emptied himself" paragraph | 10.22 "Thus it was just as true, that He received the form of a slave, as that He remained in the form of God." | supports "nothing set aside"; never pair with 9.51 |
| H-7 | ③ | `library/humanity.html` (after "Two full natures, one person…") | 9.15 "the only true faith lies in the confession of Jesus Christ as Word and flesh, that is, God and Man" | two natures, 91 years before Chalcedon |
| H-8 | ④ | `library/nicene-creed.html`, homoousios section | 3.3 "not as a piece of Himself cut or torn off or stretched out, for God is passionless and bodiless" | answers "begetting means dividing"; first confirm the essay states that objection |
| H-9 | ③ | `library/modalism.html` ("ancient response" paragraph) | 7.7 "against Sabellius, her assertion that the Son exists; against Arius, that He is God by nature" | both errors in one sentence; medium value |
| H-10 | — | `library/early_church_trinity.html` | 2.1 | **not recommended**: that paragraph is "pre-Nicene" and Hilary is post-325 |
| H-11 | — | `library/nt_trinity.html` (1 Cor 15:28) | 11.41 | **not recommended**: the sentence continues "…now altogether God"; a cut would hide it |

**Passages NOT to lean on (verdict ⑤):** 10.9–10.48 on Christ's pain (noted at 10.23); 11.40–42 ("obtain the
nature of God… God only", "no trace of the nature of His earthly body may remain"); 9.51 and 9.54 on the form of
God "departed" / "restores to Him equality of form" (against `nicene-creed.html` and Hilary's own 10.22); 2.29,
8.20 and 12.55–57 on the Spirit's origin (filioque; noted); 12.35–37 on Proverbs 8:22 (`trinity_jw.html`
deliberately does not let Prov 8:22 carry Christology); Peter and the rock 6.36–38; the Lord's Supper 8.13–17;
baptism 9.9. **Never call Hilary "pre-Nicene":** he wrote c. 356–360, after Nicaea (325), before Constantinople (381).

### 7(c) Review (rule 6)
Guide, notes, `/sources` texts, topics, description and copy-check prose: argument (Opus), orthodoxy (Opus) and
neutrality (Fable), each a read-only Explore agent, files md5-verified unchanged after every round. The
round-by-round account is in the stamp, `fathers/_data/hilary-trinity.json` → `reviewed`.
