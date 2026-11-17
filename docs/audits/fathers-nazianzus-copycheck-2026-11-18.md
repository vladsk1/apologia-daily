# Church Fathers library — Gregory of Nazianzus, *Theological Orations* (27–31): copy-check and rule-7 record

*2026-11-18. The pilot book of the Church Fathers "Full works" section (owner ruling 2026-11-18;
rules in `docs/FREE_LIBRARY_CANDIDATES.md` → "Church Fathers library: hosting rules"). This file is the
record behind the copy-check claim on the book page, and the rule-7 findings logged for later work.*

## 1. Where the text came from

| | |
|---|---|
| Translation | Charles Gordon Browne & James Edward Swallow, *Nicene and Post-Nicene Fathers*, 2nd series, vol. 7 (New York: Christian Literature Company, 1894). Public domain. |
| Base text hosted | CCEL's proofed transcription of that volume (`https://www.ccel.org/ccel/s/schaff/npnf207/cache/npnf207.txt`, header "Rights: Public Domain"). |
| Not used | New Advent's copy. It is "revised and edited for New Advent by Kevin Knight" and modernises the 1894 English throughout ("hath"→"has", "thee/thou"→"you", "shew"→"show", "begat"→"begot", "for ever"→"forever", "unguents"→"ointments"). Hosting it would have hosted Knight's revision, not the public-domain translation. |
| Checked against | Two independent archive.org scans of the 1894 printing (both University of Toronto physical copies): `selectlibraryofn07schauoft` and `selectlibraryof07scha`. |

## 2. What was removed (rule 1)

All 371 editors' footnotes in Orations 27–31 were read by script. **100 were dropped entirely**: 99 of editorial commentary (e.g. "i.e. in Confirmation" at 31.29; a long note on
Mary as Mother of God at 29.19; Benedictine, Petavius, Billius and Elias Cretensis readings; classical
background) and one invalid reference (below). **271 reference footnotes were kept (287 individual references; some footnotes carry several),
reference only** — any commentary attached to a reference was dropped. The invalid reference ("Galat. vii.
7–17"; Galatians has six chapters) is the hundredth dropped footnote. The editors' introductions are not hosted.

## 3. Word-for-word comparison

- Script: tokenise the hosted text (letters only, case-folded) and the first scan's OCR; locate each section
  in reading order; align by longest common subsequence.
- **Result: 36,982 of 37,530 words (98.5%) match the OCR directly** (37,530 is the count before the two
  restored words "as" and "that"). The 548 unmatched words were reviewed as a list; the 25 differences that
  involve real words were each checked by hand against both scans; the rest are OCR damage (non-words, split
  words, column interleaving). Punctuation was not compared.
- The difference list first showed only short runs (up to 4 hosted and 6 scan words), so a line dropped from
  the transcription would not have appeared in it. The 97 longer runs were then listed and checked (argument
  review, round 3): 90 are scan-only text, every one a footnote, a page heading, or text from a neighbouring
  section across a column break; the other 7 are hosted words split by such interruptions (e.g. "pas[…]sions",
  31.7's column interleave). **No text is missing from the transcription.**
- Nearly all differences were OCR damage ("tlie", "lie" for "he", "be" for "he", two-column interleaving,
  page-foot footnotes running into the text). Five needed the second scan to settle; four were real:

| Section | Transcription | 1894 printing (both scans) | Action |
|---|---|---|---|
| 27.9 | "spider's web, if it were" | "spider's web, **as** if it were" | corrected |
| 28.6 | "the deep thing of God" | "the deep thing**s** of God" | corrected |
| 29.13 | "Their assertion, then, that which" | "…then, **that** that which" | corrected |
| 29.18 | "letter be cleaned away" | "letter be **cleansed** away" | corrected |
| 28.8 | "independent drift … ; for I will not" | first scan's OCR reads "independent for drift … ; I will not" | **kept**: the second scan reads exactly as the transcription; the first was a column-merge artefact |

- **Section 29.18** has no numeral in the 1894 printing (both scans) or in the transcription. The paragraph
  beginning "But in opposition to all these" is given the standard number 18, shown in brackets.
- **31.29** has an unmatched ")" ("…His consubstantiality);"). It is in the 1894 printing; kept as printed.
- Stray spaces left before punctuation where a footnote marker was removed were closed up (whitespace only).

## 4. Bible references corrected (the editors' references, not Gregory's words)

| Section | 1894 / transcription | Corrected | Why |
|---|---|---|---|
| 29.17 | John 7:12 | John 8:12 | 1894 misprint ("I am the Light of the World") |
| 29.19 | Luke 2:41 | Luke 2:7 | 1894 misprint (the swaddling clothes) |
| 29.20 | Isaiah 53:23 | Matthew 4:23 | 1894 misprint; Isaiah 53 has 12 verses ("He healeth every disease and every infirmity") |
| 30.2 | Psalm 14:7 | Psalm 45:7 | transcription slip; the 1894 printing reads "Ps. xlv. 7" |
| 30.16 | Luke 12:44 | Luke 22:44 | 1894 misprint (the Agony and Bloody Sweat) |

A script also checked every remaining reference exists (chapter and verse within range, against the BSB
index); none other failed. ⚠ That check cannot catch a reference that exists but points at the wrong verse;
a full citations pass over all 287 references is a backlog item (row G-REF below).

## 5. Scripts and integrity guard

The scripts that did this are committed in `tools/fathers/`: `extract-ccel.cjs` (extract + strip notes),
`compare-scan.cjs` (word-by-word comparison with a scan's OCR), `prep-nazianzus.cjs` (section 29.18, the
corrections, whitespace). The CCEL text and the scans are not stored in the repo; their URLs are above.


The hosted text's SHA-256 is recorded in `fathers/_data/nazianzus-orations.json` → `copyCheck.textSha256`.
`tools/build-fathers.mjs` (and CI via `tests/fathers.test.mjs`) fails if the text changes without the
copy-check being re-run.

## 6. Rule 7 — the book checked against our own site

### 7(a) Quote-check (`tools/check-father-quotes.mjs`)
All 7 `/sources` passages from these orations match the hosted text at the section they claim. Every
Gregory quotation found on a served page matches (31.26 ×2, 29.19 ×2). The tool found one essay the book
page had not listed (`library/phil2.html`, 29.19); it is now linked.

### 7(b) Error-hunter (Sonnet) and improvement-finder (Fable), read-only
**Errors and weaknesses in OUR pages (verdicts ② / ③):**

| Row | Verdict | Page(s) | Finding | Fix |
|---|---|---|---|---|
| G-1 | **② P1** | `library/nicene-creed.html:157`, `ev-s6.html` (same wording) | "Gregory of Nazianzus pressed the point at the council itself", cited only to Oration 31 (380), a year before the council; the 381 creed is more reserved than Gregory's 31.10 | e.g. "and Gregory of Nazianzus defended the Spirit's deity in his fifth Theological Oration (Constantinople, 380), a year before the council" (the guide now uses the creed-vs-31.10 contrast) |
| G-2 | ③ | `ev-s3.html` ×3, `ev-m-humanity.html` ×3, `library/humanity.html:261` | "that which He has not assumed He has not healed" given without a source; it is Epistle 101, not the Orations | add "(Epistle 101)"; soften "the most important single sentence in the whole debate" / "the debate's decisive sentence" |
| G-3 | ③ | `library/nicene-creed.html:152`, `ev-s6.html` ×3, `library/phil2.html:159`, `ev-m-phil2.html:420` | Gregory credited with "fencing" a later kenotic misreading of Phil 2:7; 29.19 answers Arian contempt | "Gregory, answering Arian contempt for the Son's lowly passages, put the point this way:"; keep the anti-kenotic sentence as ours |
| G-4 | ③ | `library/relations.html:143`, `ev-m-relations.html:439`, `ev-m-modalism.html:606`, `ev-s6.html:2407` | "fixed the vocabulary … he insisted" omits his refusal to explain how (31.8) | add "though he refused to explain how (31.8)"; the guide now does |
| G-5 | ③ | `library/nicene-creed.html:157`, `ev-s6.html:2553` | Pneumatomachi "treating him as a created force or an exalted angel" — Gregory (31.5) lists Activity / Creature / God / undecided | attribute "exalted angel" to later description, or use 31.5 |
| G-6 | ③ | short forms: `answers/_data.json` (John 14:28 answer), `ev-s6.html:546,614`, `ev-m-trinity_jw.html:589`, popover in `library/trinity_jw.html` | John 14:28 given only the "as man" reading, which Gregory calls true but "no great thing" (30.7); the essay already gives both | add the origin reading to the short forms |
| G-7 | ③ | `library/trinity_jw.html:187`, `library/humanity.html:186`, `ev-m-trinity_jw.html`, `ev-s6.html:1727`, `library/nt_trinity.html:185` | Mark 13:32 ("nor the Son") asserted and half-apologised for | add Gregory's argument (30.15, the "wall" sentence) + `/sources` passage |
| G-8 | ④ | `library/trinity_jw.html` | "the Son can do nothing of himself" (John 5:19) unanswered | Gregory 30.10–11 ("Can and Cannot are not words with only one meaning") |
| G-9 | ③ | `library/nt_trinity.html:183`, `library/jesus_as_god_nt.html:180` | John 17:3 "only true God" asserted, not argued | Gregory's reductio, 30.13 ("only wise … only hath Immortality"); NOT the Baruch half |
| G-10 | ③ | `library/holy_spirit.html:194–200`, `ev-m-holy_spirit.html`, `ev-s6.html:736` | "no prayer to the Spirit" conceded without Gregory's answer | 31.12 (worship *in* the Spirit), 31.28 "golden chain", 31.29 "swarm of testimonies" |
| G-11 | ③ | `library/eternal_generation.html:171–183` | aseity objection ("from another = lesser") | 31.9 "Sonship is not a deficiency" symmetry; 29.3 "from Him, though not after Him" |
| G-12 | ④ | `library/analogies.html` | the father who tried and dropped the analogies is not cited | 31.31–33 "let the images and the shadows go" |
| G-13 | ③/④ | `library/philosophical_trinity.html:170`, `answers` three-gods answer | "three men" analogy / tritheism charge | 31.15–16, 31.13 tu quoque, 31.18 on counting |
| G-14 | ③ | `answers/_data.json` "not in the Bible" answer, `library/holy_spirit.html:200` | "not in so many words" | 31.23–24 "twice five … Ten" (drop "partisan of the Jewish wisdom") |
| G-15 | ④ | `library/trinity_jw.html`, `library/nt_trinity.html:185` | 1 Cor 15:28 "until"; Heb 5:8 "learned obedience" (⚠ EFS-adjacent: report, don't adjudicate) | 30.4 "Until is not always exclusive"; 30.6 |
| G-16 | ③ | `sources/cappadocians.json` or31-10 note | "the Cappadocian settlement" (Basil avoided the formula) | **fixed in this pilot** (note only) |
| G-SRC | — | `sources/cappadocians.json` | ~12 strong new verified-quote candidates surfaced: 30.15 (wall), 29.18 (lofty/lowly rule), 30.13 (reductio), 31.29 (testimonies), 30.10–11 (can/cannot), 31.9 (sonship), 29.16 (name of the Relation), 31.15–16 (unity), 31.33 (images), 31.23–24 (twice five), 30.4 (until), 29.13 (picture of an animal) | add each with the usual gate; each must be safe read alone |
| G-REF | — | `fathers/_data/nazianzus-orations.text.json` | the 1894 references were only checked for existence | full `apologia-citations` pass on all 287 |

**Passages NOT to lean on (verdict ⑤, ours is better):** 30.2 on Proverbs 8:22; 30.12 on John 6:38 /
Gethsemane (human will, refined at Constantinople III); 30.16's second answer on Mark 13:32; the Baruch
3:35 half of 30.13; "Cause" compressions alone (29.15 "in respect of being the Cause the Father is greater",
29.3, 30.11, 31.14 "First Cause", 31.30, 30.20); 31.14's "three suns"; the mixture/deification wording
(29.19, 30.3, 30.6, 30.14, 30.21, 31.4, 31.28) without a fence; 30.5 on the cry of dereliction beside our
"the forsakenness is real"; 31.26–27 beyond the excerpt; 29.17's list of Revelation 1:8 as "clearly" of the Son.

These rows are logged here rather than in `docs/content-backlog.md` because that file had uncommitted edits
from another session on 2026-11-18. Each essay change re-opens that essay's review (rule 9: not bundled into
the pilot).
