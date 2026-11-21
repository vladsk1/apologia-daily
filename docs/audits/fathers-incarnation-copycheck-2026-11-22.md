# Church Fathers library — Athanasius of Alexandria, *On the Incarnation of the Word*: copy-check and rule-7 record

*2026-11-22. The sixth book of the Church Fathers "Full works" section (rules in `docs/FREE_LIBRARY_CANDIDATES.md`
→ "Church Fathers library: hosting rules"), and the first outside the Trinity set: the owner chose it on 2026-11-22
from a list of non-Trinity candidates. East/West tally after it: East 4 (Gregory of Nazianzus, Basil, Athanasius ×2) ·
West 2 (Hilary, Augustine), so the next books should be Western (rule 3). This file is the record behind the
copy-check claim on the book page, and the rule-7 findings logged for later work. Same method as the Arians
(`docs/audits/fathers-athanasius-copycheck-2026-11-20.md`), with the changes this text needed, recorded below.*

## 1. Where the text came from

| | |
|---|---|
| Translation | Archibald Robertson, *On the Incarnation of the Word*, in *Nicene and Post-Nicene Fathers*, 2nd series, vol. 4, ed. Philip Schaff and Henry Wace (New York: The Christian Literature Company, 1892). |
| Public domain | Published 1892 (public domain in the US). |
| Base text hosted | CCEL's proofed transcription (`https://www.ccel.org/ccel/s/schaff/npnf204/cache/npnf204.txt`, "Rights: Public Domain"), lines 12193–15080: 57 blocks, one per numbered section. Measured line ranges in `tools/fathers/incarnation-config.json`. |
| Not used | New Advent (modernises the English). |
| Checked against | Archive.org scans of the 1892 printing: **A** `niceneandpostnic04unknuoft` (Toronto), **B** `selectlibraryofn04schauoft` (Toronto), **C** `selectlibraryofn04scha` (BYU), **D** `cu31924096463454` (Cornell). The same four as for the Arians. |
| Date | Disputed. The 1892 editor placed this work and its companion, *Against the Gentiles*, before 319 (his chronological table gives 318); later scholars have argued for the 330s. The guide and every `/sources` note say so. The book does not mention Arius. |

## 2. What was removed (rule 1)

- The 1892 editor's introduction, his synopsis, and **his summary heading over each section** ("§1. Introductory.—The
  subject of this treatise …"): 56 headings. **Section 5 has none**: its first paragraph is Athanasius's text and is kept.
  The prep script tests that each block opens with its own "§N." and stops if not.
- The editor's 160 footnotes were read by script (`tools/fathers/extract-ccel.cjs`): **73 kept as Bible references only**
  (80 references); 87 dropped as editorial commentary.
  ⚠ **The script first missed six footnotes holding eight references**: this volume abbreviates Luke, John and Mark as
  "Luc.", "Joh." and "Marc.", and opens some notes with "See" ("See John iii. 3, 5"). The extractor now takes
  `bookAliases` and `seePrefix` from a book's config; both are off unless a config asks, so earlier books are unchanged.
- **Kept, as numbering:** the small numbers inside each section ("2.", "3." …). They are the 1892 printing's
  subdivisions and are how the work is cited ("54.3"). They are left as printed, slips included: section 5 runs 2, 3, 4,
  8 (all four scans print "8."), and section 10 begins its count at "1.".
- The translator's words in square brackets ("[He teaches them]", 14.8; "[His glory]", 17.5; "[begin to]", 27.2) are the
  translation and are kept.

## 3. Word-for-word comparison

- Scripts: `tools/fathers/compare-scan-chunked.cjs` (each 60-word run of a section located in the scan separately),
  `check-candidates-context.cjs`, `check-dropped-words.cjs`, `check-spellings.cjs`, and the whole-text test (every run of
  six words of the hosted text looked up in the scans' word index).
- **Result against the transcription: 99.0% of words match scan A, 98.4% B, 98.9% C, 98.8% D** (26,014 words). Far
  cleaner than the Arians (96–97%): Robertson's footnotes are shorter than Newman's.
- **Changed words:** every difference two or more scans agreed on (56) was tested in context in all four scans and read by
  hand. As in the Arians, most were superscript footnote numbers read by the OCR as "s" ("corruptions", "behelds",
  "partakes") or as a quotation mark; each was settled by finding a footnote marker at that point in the transcription.
  The rest were compound words split at a line end ("loving-kindness", "first-fruits"), which the transcription prints
  with a hyphen and are left so, and the letter æ ("Judæa").
- **Dropped words:** none. Every hit of `check-dropped-words.cjs` (15) was a footnote number or a section edge.
- **Long runs:** four runs of 14+ words unconfirmed in two scans: three were footnote numbers and page breaks
  (4, 20, 40); the fourth held the changed word "erected" (46).
- **Modernised spellings:** five, listed below. The transcription otherwise keeps the 1892 spellings ("spake",
  "judgment", "clothed", "recognise" are printed so).
- **Quotation marks.** Unlike the Arians, nothing was lost: Robertson quotes with double marks, the transcription has
  them (164), and they pair up in every section. A sample was compared with the straight-quote scans (B, C, D: "Have ye
  not read", 2.6; "But we behold Him", 10.2; "Forasmuch then as the children", 10.4), which print double marks too.
  Other punctuation was not compared.

**Corrections to Athanasius's text — 9, each confirmed in all four scans** (`CORR` in
`tools/fathers/prep-incarnation.cjs`; all listed on the book page)

| Kind | Where | Transcription → 1892 printing |
|---|---|---|
| Changed word | 39.4 | prophets were prophesying: God and Asaph → **Gad** and Asaph |
| | 46.2 | the Lord erected His conquest of death → **effected** |
| | 48.5 | all whom even themselves bold to be gods → **hold** |
| | 54.3 | being impossible and incorruptible → **impassible** (the `/sources` 54 passage already had "impassible") |
| Older spelling | 10.4, 13.5, 30.1 | naught → nought (×3) |
| | 34.2 | evilly entreated → intreated |
| | 41.2 | if they show themselves → shew |

## 4. Bible references

- `tools/fathers/check-refs.cjs` compared each of the 80 references with the BSB verse. 29 share no word with the words
  before them; all 29 were read by hand against the words after them: in this volume the footnote marker usually sits
  after the first word of the quotation ("I have[Psalm 82:6] said ye are gods"), so the check sees almost nothing. All
  are right except one.
- **One corrected** (`REF_CORR`): 6.2 Genesis 2:15 → **Genesis 2:17**. The 1892 footnote reads "Gen. ii. 15" (all
  scans), which is Adam placed in the garden; the law of death Athanasius means ("it had been laid down by God") is
  2:17, the verse he quotes at 3.5.
- Psalm references (82:6, 24:7, 55:4, 22:16, 118:27, 107:20) were each checked against the words that follow: all use
  the English numbering already.
- The 2 references to Wisdom (4.6, 5.2) were not checked this way.

## 5. `/sources`

- **All 17 existing passages** (16 in `sources/athanasius-on-the-incarnation.json`, captured 2026-07-11/13 from CCEL's
  leaf pages; §54 in `sources/patristics.json`) pass `tools/check-father-quotes.mjs --strict` against the hosted text.
  Each now carries a `context_url` to its hosted section and a note stating the date is disputed.
- ⚠ **One was wrong, and fixed: `athanasius-inc-47`.** Its first sentence joined the opening of 47.1 ("And whereas
  formerly every place was full of the deceit of the oracles,") to the middle of 47.2 ("and demons used to deceive men's
  fancy …") **with no mark of the 55 or so words left out between them**, so the live AI was quoting a sentence Athanasius
  never wrote. It now begins at 47.2 ("And whereas formerly demons used to deceive …"), which is exactly as printed. The
  strict check only caught it because it now compares against the whole hosted text; it had been "verified verbatim"
  against CCEL's leaf page on 2026-07-13.

## 6. Rule 7 — the book checked against our own site

### 6(a) Quote-check (`tools/check-father-quotes.mjs --strict`)
All 17 `/sources` passages match the hosted text at the section they claim (after the inc-47 fix in §5). One served
page quotes this work and does not match: `library/trinity_mormons.html` ("He became man that we might be made god";
INC-1 below). ⚠ **Tool gap:** the script only looks at quotations near a citation of the work, so it does not see the
same misquote on `ev-m-trinity_mormons.html`, the mastery port or `pocket-cards`. The error-hunter found those by reading.

### 6(b) Error-hunter (Opus) and improvement-finder (Sonnet), read-only, never handed each other's conclusions
**All closed 2026-11-22, see §8** (INC-5 was fixed with the book). Every Athanasius quotation below was re-checked
by script against the hosted text. ② = error in ours, ③ = weaker in ours, ④ = missing. No row exists in the MK/ES
mirrors (there is no MK/ES `trinity_mormons` page or pocket-cards file, and the MK/ES theosis card names no Father).

| Row | Verdict | Our page | Finding | Athanasius |
|---|---|---|---|---|
| INC-1 ✅ 2026-11-22 | ② P1 | `library/trinity_mormons.html` :170 (steelman) and :224 (fn 9); same quote on `ev-m-trinity_mormons.html` :491 and :1104, `docs/mastery-ports/trinity_mormons.json`, `pocket-cards.json` (+ the rendered `pocket-cards.html`) | Quotes Athanasius as saying the Word "became man that we might be made god", cites "§54 … (or 'divine')" and a 2011 translation in the bibliography. The words are not the 1892 text and no translation is named at the quote. Re-quote 54.3 exactly and link it; drop "(or 'divine')". | 54.3 "For He was made man that we might be made God" |
| INC-2 ✅ 2026-11-22 | ② P1 | `ev-m-trinity_mormons.html` :526 | "Athanasius — in the very treatise — insists … we become 'partakers of the divine nature' by grace, glorified creatures forever, never … creators of worlds". The treatise never quotes 2 Peter 1:4 and never uses "divine nature"; the rest is our own wording put in his mouth. Keep 2 Peter 1:4 as Scripture's; give him his own words. | 4.6 "man is by nature mortal, inasmuch as he is made out of what is not"; 5.1 "destined, by the grace following from partaking of the Word, to have escaped their natural state" |
| INC-3 ✅ 2026-11-22 | ③ | `library/trinity_mormons.html` :184 and fn 9 ("insists relentlessly … the uncreated Creator"; "insists throughout"); shorter copies on `ev-m-trinity_mormons.html` :493, :1020, :1104, the mastery port, `objections.json` | Overstated and uncited: the line is in the text at specific places, not "relentlessly"; "uncreated" does not occur. Pinpoint it. ⭐ **4.6 reads Psalm 82:6 itself** ("I have said ye are gods … but ye die like men") of man made for incorruption by grace, which bears directly on this essay's Psalm 82 argument. Check it sits with the essay's own reading of Psalm 82 before using it. | 4.6; 5.1; 17.1 "distinct in being from the universe"; 43.6 |
| INC-4 ✅ 2026-11-22 | ② low | `ev-m-trinity_mormons.html` :521 (objection heading) | The objector's paraphrase in quotation marks: "Athanasius said God became man that man might become god". Quote 54.3, or drop the marks. | 54.3 |
| INC-5 ✅ 2026-11-22 | ② | `sources/athanasius-on-the-incarnation.json`, note on inc-4 | Said "corruption gaining mastery 'as king'"; it is death. **Fixed with the book** (note only; the passage text was right). | 4.4 "death had the mastery over them as king" |
| INC-6 ✅ 2026-11-22 | ④ | `library/trinity_mormons.html` :230 (bibliography); `our-sources.json` (generated) | Cites the 2011 translation only. Once INC-1 quotes 1892, cite Robertson (NPNF2 4, 1892), link the hosted text, rebuild `our-sources.json`. | — |
| INC-7 ✅ 2026-11-22 | ④ | `ev-m-trinity_mormons.html` :592 (reading list) | Entry has no link. Link `/fathers/athanasius-incarnation-text.html#s54`. | 54.3; 4.6; 5.1 |
| INC-8 ✅ 2026-11-22 | ② P2 (owner call) | `library/virginbirth.html`, closing paragraph | Says the early church "did not think the virginal conception proved Jesus' divinity". Athanasius is a fourth-century counter-example: the virgin birth is "no small proof of His Godhead" (18.5). Narrow the sentence; do not quote 18.5 in support of the essay's argument, which it contradicts. | 18.5; 35.7 |
| INC-9 ✅ 2026-11-22 | ③ | `library/nicene-creed.html`, "Came down from heaven" paragraph | Rests on Augustine; Athanasius said it first. Quote 17.1 (and 17.5). ⚠ Not 17.4 ("wielding") or "instrument", which read Apollinarian out of context. | 17.1; 17.5 |
| INC-10 ✅ 2026-11-22 | ③ | `library/humanity.html`, the docetism paragraph (beside Ignatius) | "to shew Him to have a body in truth, and not in seeming" is exactly the essay's point. Quote from "the actual body" on only. | 18.1; 8.3 |
| INC-11 ⏹ closed 2026-11-22 | ③ | `library/humanity.html`, "Second, a real death" | Why a mortal body was needed. ⚠ Pair "impossible for the Word to suffer death" with 20.2 and 18.1, or it reads as the Son not dying. | 9.1; 20.2 |
| INC-12 ✅ 2026-11-22 | ③ | `library/god-crucified.html`, the Cyril "his own body" paragraph | The "his own body" grammar is already in Athanasius a century before Cyril. ⚠ Not 54.3 "impassible" alone. | 18.1; 20.2 |
| INC-13 ✅ 2026-11-22 | ③ | `library/god-crucified.html`, the 1 Corinthians 1:25 paragraph (also `crucified-messiah.html`) | He answers "why not an honourable death?" by refusing "fitting" as a merely human measure. Quote as his answer, not his proof. | 21.3–4; 24.4 |
| INC-14 ✅ 2026-11-22 | ③ | `library/crucified-messiah.html`, the Galatians 3:13 / Deuteronomy 21:23 paragraph | The same two verses, and why only the cross fits. ⚠ Stop at 25.2; not the debt language of 9.2/20.2 (the essay declines to adjudicate atonement models). | 25.2 |
| INC-15 ✅ 2026-11-22 | ③ | `library/minimalfacts.html` (the swoon paragraph) or `library/burial.html` ("First, it certifies the death") | He already meets "He had not died at all" with a public, witnessed death and the third day. ⚠ Frame as the church reasoning from a public death, not as independent evidence. | 26.2; 23.1 |
| INC-16 ✅ 2026-11-22 | ④ | `library/worship-of-jesus.html`, the Pliny / graffito paragraph | The fourth-century continuation of "mocked as crucified, worshipped as God". ⚠ c. 318 or later: a coda only, never part of the early-date case. | 53.2; 46.4 |
| INC-17 ⏹ closed 2026-11-22 | ③ | `library/persecution.html`, "Notice what the hostile sources concede" | Descriptive clauses only; he argues from the martyrs to the truth of the resurrection (27.1), which the essay deliberately does not. | 27.2; 28.4 |
| INC-18 ⏹ closed 2026-11-22 | ③ | `library/evil.html`, the "God did not remain a spectator" paragraph | "What was God in His goodness to do?" and his answer. ⚠ His frame is death and corruption, not suffering; keep to the solidarity paragraph. | 6.7; 8.2 |
| INC-19 ⏹ closed 2026-11-22 | ③ | `library/humanity.html`, the "grows, tires, hungers" paragraph (or the opening) | 21.7 on hunger, or 43.1–2 ("came not to make a display, but to heal and teach"). ⚠ "the Lord that wore it" and "instrument" (43.4) read as Christ in a costume; prefer 43.1–2. | 21.7; 43.1–2 |
| INC-20 ✅ 2026-11-22 | ④ (separate gated change) | `api/ask.js`, the `/sources` instruction block | The 54.3 passage reaches the live AI with no fence (notes are not sent), and the block has no "by grace, not by nature" safeguard to match its Trinity one. Add a one-line theosis safeguard, ported from `trinity_mormons`'s certified box ("Deified by grace, not gods by nature"). `api/ask.js` is a gated file. (Orthodoxy lens, round 1.) | 54.3 |
| INC-21 ✅ 2026-11-22 | ③ (display only) | `sources/athanasius-on-the-incarnation.json`, note on inc-7 | "nor satisfy God's just claim": the text says repentance would "fail to guard the just claim of God" (7.3); "satisfy" is a later Western gloss. Notes are not sent to the AI. (Neutrality lens, round 1.) | 7.3 |
| INC-22 ✅ 2026-11-22 | tool | `tools/check-father-quotes.mjs` | Misses quotations of a Father that sit away from a citation of the work (INC-1 on four surfaces). Consider a second pass that searches every served page for each hosted work's best-known lines. | — |

## 7. Review gate (rule 6)

Guide, notes, copy-check text and the `/sources` changes, gated by READ-ONLY Explore lenses; the reviewed files were
md5-verified unchanged after every round. 0 HERESY in every round. The full record is the stamp's `by` note in
`fathers/_data/athanasius-incarnation.json`; in short:

- **R1** — argument (Opus): NOT STAMPABLE, 1 BREAK (an *Against the Arians* 3.19 quotation linked to 1.39) + 5 WEAK.
  Orthodoxy (Opus): NOT CLEAN, 1 DRIFT (the heading "Truly God, and truly in a body" dropped "man"; now "Truly God, and
  truly made man", Athanasius's own "He was made man", 54.3) + 1 PRECISION (17.5 clipped so "walking as man" was lost;
  now quoted whole); clarifier: a note at 54. Neutrality (Fable): STAMPABLE on 3 WEAK. One merged fix pass; two notes
  added (20, 54), four rewritten.
- **R2** — all three lenses (Fable) on the changes: 0 BREAK; 1 WEAK (note 20 quoted "for all", which is not in
  section 20; now "on behalf of all", 20.2) + 5 POLISH, applied in the reviewer's words.
- **R3** (Opus): one antecedent ("He says that 'the Jews are trifling'" right after "the coming of Christ") → "Athanasius
  says". **R4** (Sonnet): confirmed.
- **Not run:** the citations lens (web). The later dating (335–337, Kannengiesser) rests on the neutrality lens's web
  search; Robertson's "before 319" is from the 1892 volume itself. Biography facts are ported from the certified book-5
  guide. Pastoral sign-off is still owed, as site-wide.

## 8. The rows, closed (2026-11-22, owner: "fix the rows")

**Built (17):** INC-1–4, 6, 7 (the `trinity_mormons` family: 54.3 quoted as printed on every surface; fn 9 cites Robertson
1892 with a gloss on the capital "God"; the reply now quotes 54.3, 4.6 and *Against the Arians* 3.19 instead of the uncited
"insists relentlessly on the absolute divide"; 2 Peter 1:4 kept as Scripture's; bibliography and reading list point to the
hosted text); INC-8 (the claim "the early church did not think the virginal conception proved Jesus' divinity" removed from
`library/virginbirth.html` **and from every surface that carried it**: `ev-s3.html` + its MK/ES mirrors, `ev-m-virginbirth.html`,
and the live-AI brief `virgin-birth-isaiah-7-14` — round 1 found it surviving on those after the essay alone was fixed);
INC-9, 10, 12–16 (one ported quotation each in `nicene-creed`, `humanity`, `god-crucified` ×2, `crucified-messiah`,
`burial`, `worship-of-jesus`); INC-20 (`api/ask.js` THEOSIS SAFEGUARD); INC-21 (`/sources` note); INC-22
(`tools/check-father-quotes.mjs` now also checks a work's watched lines anywhere on the site — `quoteCheck.watchRe`; it
would have caught INC-1 on all four surfaces).

**Closed without change (4), reasons confirmed by all three lenses:** INC-11 (the "real death" paragraph already quotes
Athanasius 2.70; 9.1 brings "impossible for the Word to suffer death" and the debt language of 9.2); INC-17 (the paragraph is
built on hostile witnesses; 27.1 argues from the martyrs to the truth of the resurrection, which the essay refuses); INC-18
(his frame is death and corruption; set beside Moltmann, his "impassible" (54.3) would open a passibility dispute; would need
MK/ES mirrors); INC-19 (21.7 "the Lord that wore it" collides with the essay's "not God in a costume"; 43.1–2 opens on "some
nobler instrument" and runs into 43.4 "instrument", and says nothing about growing, tiring or hungering; he is now quoted twice
on the page).

**Gate:** R1 argument (Opus) STAMPABLE with 3 WEAK; orthodoxy (Opus) CLEAN, 0 HERESY; neutrality (Fable) 1 BREAK (the
virgin-birth claim alive on sibling surfaces) + 3 WEAK. One merged fix pass in the lenses' wording. R2 (Fable, all three):
STAMPABLE / CLEAN / STAMPABLE. Three optional POLISH declined (burial "reasoned the same way" → "made the kindred point"; name
*On the Incarnation* at the first bare "(54.3)" on the mastery page's prose and model answer).

**New row from the gate (pre-existing text; built 2026-11-22, owner go-ahead, gated by all three lenses):**

| Row | Verdict | Our page | Finding |
|---|---|---|---|
| INC-23 ✅ 2026-11-22 | ③ (orthodoxy NOTE, both rounds) | `ev-m-trinity_mormons.html` :526 (accordion reply) | "and GOD NEVER WAS A MAN who progressed": clipped at the capitals it reads against the incarnation. Suggested: "and GOD THE FATHER NEVER WAS A MAN who progressed to deity", matching the essay. Compressed surface: re-gate argument + orthodoxy + neutrality. |
