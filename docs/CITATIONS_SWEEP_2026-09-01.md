# Citations sweep — the 28 never-fact-checked essays

**Run 2026-09-01.** `apologia-citations` on the 28 `library/*.html` essays that carried **no record of a
citations run anywhere** — not a dated field, not a mention in the stamp's `by` note. Seven read-only
`Explore` agents (no edit tools, per the write-access hazard rule), four essays each, every essay read in
full rather than grepped.

**This is the run `editorial-standards.html` stage 2 has been promising.** It had never happened on these
files. Root cause: `tools/check-content-review.mjs:152` requires only `['argument','orthodoxy']`, so CI
enforced two of the five promised stages; and the `citations` key did not exist in the stamp schema until
~2026-08-06. 26 of the 28 were stamped on a single day, **2026-07-14**, in a bulk retroactive pass whose
purpose was to get argument+orthodoxy on record so a nav pass could proceed.

---

## Result

| | |
|---|---|
| Essays gated | **28** |
| Citations VERIFIED | **~500** |
| **ERROR (must fix)** | **61** |
| CHECK (imprecise / needs a locus / needs softening) | ~90 |
| UNVERIFIABLE-HERE (blocked by egress; needs a human or a book) | ~40 |
| Essays clean, zero errors | **2** — `consciousness.html`, `islam-wahy.html` |

⚠ **Coverage is partial and must not be described otherwise.** This environment's network policy 403'd
almost every primary host — SEP, IEP, sunnah.com, quran.com, plato.stanford.edu, archive.org, CCEL,
Wikipedia, NCSE, publisher PDFs. `WebSearch` worked; `WebFetch` mostly did not. Every agent was
instructed never to mark VERIFIED what it could not actually read, and the UNVERIFIABLE-HERE column is
the honest residue. **An essay stamped from this run has had its citations checked as far as this
environment allows — not exhaustively.**

---

## The two systemic findings

### ① A scholar recruited for a position he rejects — found independently in **five** essays

This is the Francis Collins shape CLAUDE.md already records, and it is the dominant defect class:

| Essay | Scholar | What went wrong |
|---|---|---|
| `laws.html:152` | **John Hedley Brooke** | Cited as arguing the theological-origins-of-natural-law thesis. He launched the **"complexity thesis"**, which treats conflict *and harmony* narratives alike as oversimplifications. He is that field's leading sceptic of such claims. |
| `jesuschar.html:181` | **Bart Ehrman** | *"A minimalist camp (Ehrman…) holds that exalted Christology is a later development."* This is retired claim `ehrman-preexistence-is-late`, live under a green CI check. |
| `respred.html:169` | **Bart Ehrman** | A semicolon hands him the conclusion "a Jesus who expected to suffer and be vindicated is not a Christian back-projection." He holds the passion predictions to be later constructions. |
| `islam.html:204` | **Sidney Griffith** | Cited *for* the heretical-sect explanation of Q 5:116. He argues the Qur'an's audience were mainstream Christians and its polemics deliberate inversions. |
| `daniel70.html:241` | **J. Paul Tanner** | Cited as supplying the critique of the Anderson–Hoehner calculations. He *defends* the messianic reading on essentially that framework. |
| `thomistic.html:184` | **Graham Oppy** | Credited with granting the per se/per accidens distinction "more than most", sourced to a whole book with no page; the published critique says he makes no use of it. |

### ② Footnote substrate — load-bearing claims resting on Wikipedia, blogs and aggregators

On pages that badge themselves *"fully sourced"*:

- `messianic-prophecy.html` — **6 of 10 footnotes** on Wikipedia, GotQuestions.org or blogs, including fn 7 sending the reader to GotQuestions for Daniel 9 while our own certified `daniel70.html` sits one link away.
- `deadseascrolls.html` — three footnotes on Wikipedia, a hobbyist site, and `bible.ca`, carrying the manuscript count, the 2,600-variant figure and the non-Qumran claim.
- `islam-naskh.html:213` — the inflammatory "124 abrogated verses" figure sourced to Wikipedia and attributed to no named scholar.
- `islam-sira.html:203` — the **Michael Cook retraction quote** cited to Wikipedia. It traces to a single unpublished phone conversation reported by a law professor, with a disputed page cite. It carries the essay's whole "the revisionists retracted" paragraph.
- `coincidences.html:225` — Wikipedia cited for the essay's second-most-important objection.

---

## ERRORS by file

Fixes below are the gate's own supplied wording unless marked. **⚠ Not yet applied except where noted.**

### Applied and stamped `citations: 2026-09-01`
- **`laws.html`** — Brooke misattribution (above); PhilPapers fn 18 said "no majority for Humean or non-Humean views" when 2020 is **54.3% non-Humean / 31.3% Humean** (false *against* our own case); Swinburne ch. 8 titled "Arguments from the Beauty and Order of the World" — invented, it is **"Teleological Arguments"**; quasar/fine-structure claim said observation "confirms" constants "were the same", overstating a live dispute.
- **`cosmic.html`** — the same invented Swinburne title in a second disguise ("Arguments from Design"); SEP "Fine-Tuning" cited as "substantive revision 2023" when 2023 was a minor correction and the last substantive revision was **2021**; Gonzalez & Richards cited without disclosing both authors are Discovery Institute fellows.
- **`mathematics.html`** — Wigner's "gift" line cited as the "closing sentence"; it is the penultimate, and `laws.html` fn 19 already said "closing paragraph", so the two essays disagreed. Putnam's later distancing from the argument bearing his name now recorded.
- **`consciousness.html`** — ⭐ **CLEAN, zero errors, no edit made.** Its fn 9 pre-empts misattribution in the sentence itself (*"Strawson is himself a naturalist (and panpsychist), not a theist"*). **This is the model the other 27 should be edited toward.**

### Applied, not yet stamped
- **`jesuschar.html:181`** — retired claim `ehrman-preexistence-is-late`, fixed to the registry's own `instead` framing (dispute is about **kind, not date**); `:159` now records that Ehrman dates an exaltation Christology to the early 30s and finds a pre-existent Christ in pre-Pauline Philippians 2; bibliography credited a TGC blog post to a co-author who did not write it.
- **`islam-naskh.html:156`** — 🔴 **Q 9:5 was quoted at half length and the half dropped was the mitigating half.** The verse continues *"But if they should repent, establish prayer, and give zakah, let them [go] on their way. Indeed, Allah is Forgiving and Merciful."* Closed with a full stop and no ellipsis. The essay reached for mitigation in the *neighbouring* verses while silently dropping the mitigation *inside the verse it had just quoted* — on the site's highest-stakes Islam surface, and the easiest thing for a Muslim reader to catch. **Restored in full.**

### Outstanding — prophecy & text
- **`daniel70.html:197,207`** — Collins's overshoot is *"roughly a century"*; his actual arithmetic is **67 years** (587→164 BC = 423 actual vs 490 schematic). Overstating the critic's own number makes his case look weaker than it is. → *"by some seventy years"*.
- **`daniel70.html:241`** — Tanner inverted (above).
- **`daniel70.html:177`** — Calvin, Hengstenberg and E. J. Young collapsed into one "venerable view" running "from a Persian decree". Young starts from the **divine word through Jeremiah**, not a Persian edict; Calvin from Cyrus. And `:205` calls the Jeremiah-word reading "the critical default" — a conservative the essay has just enlisted holds it.
- **`deadseascrolls.html:154`** — Tucson radiocarbon given as "second to first century BC"; the published calibrated ranges are **335–324 BC and 202–107 BC**, dropping the fourth-century tail.
- **`deadseascrolls.html:208`** — journal is **Biblica**, not "Biblíca".
- **`deadseascrolls.html:214,215,218`** — three footnotes on Wikipedia / a hobbyist site / `bible.ca`.
- **`messianic-prophecy.html:185`** — 🔴 the Targum defect, and it is one word. *"even where later interpreters redirected the suffering elsewhere"* — **it is Targum Jonathan itself** that redirects, in the same passage: Messiah at 52:13, disfigurement transferred to Israel at 52:14, sufferings reassigned to the hostile nations at 53:3 and 53:7. As written it implies the Targum witnesses a *suffering* Messiah that later hands spoiled — the single most common misuse of this text, and a counter-missionary will produce the Aramaic.
- **`messianic-prophecy.html:151,161`** — three quotations declared ESV that are not: *"wounded for our transgressions"* (ESV: **"pierced"** — and the essay's own passion argument turns on piercing), *"makes his soul an offering for guilt"*, *"origin is from of old"* (ESV: **"whose coming forth is"**).
- **`messianic-prophecy.html:189`** — internal contradiction: *Science Speaks* "from the late 1950s" vs "it has circulated for eighty years". Edition history is **1944–1976**.
- **`messianic-prophecy.html`** — the Wikipedia/GotQuestions footnote substrate (above).
  ⭐ **The Stoner hazard is CLEAN and this page is the model case** — it *is* the retirement (`:191` "It should be retired… pseudo-mathematics"), and it satisfies the registry's `instead` field almost to the letter.
- **`jesuschar.html:196`** — fn 3, the single most load-bearing critical source on the page, has no page or chapter.

### Outstanding — Islam
- **`islam.html:204`** — Griffith inverted (above); also *Panarion* **79** is the Collyridians (78 is the Antidicomarians).
- **`islam.html:145`** — Ayoub paraphrase inside quotation marks.
- **`islam.html:193,194`** — the Ehrman *Great Courses* p. 162 cite is a **live citation cascade** of the Dunn-855 shape (every attestation downstream of the Habermas/Licona chain that is the neighbouring footnote's own source); Lüdemann cited with no page and **dropping his own upper bound**, where our certified `earlycreed.html:153` has the full quotation and p. 38.
- **`islam-guard.html:213,156`** — the Ibn Majah 1944 quotation says *"under my bed"*; Sunnah.com, which the footnote itself names as the source, reads **"under my pillow"**.
- **`islam-guard.html:160`** — two separate reports merged: the ~200-verse report is **'A'isha's**, the "as long as al-Baqara" report is **Ubayy ibn Ka'b's**. Their gradings differ in opposite directions ('A'isha's runs through Ibn Lahi'a and is commonly rejected; Ibn Hajar graded Ubayy's *hasan*), so merging attaches the stronger name to the weaker report.
- **`islam-hadith.html:198–213`** — **nine Brown chapter citations are systematically off by one**: every "ch. 4" points at material in **ch. 3**, every "ch. 9" at **ch. 8**. Plus `:203` gives a chapter title — "The Beginnings of the Hadith Tradition" — that **does not exist in the book**, and `:199` cites Bruce Fudge for a "Hadith" reference article he did not write.
- **`islam-naskh.html:213`** — the "124" figure (above).
- **`islam-naskh.html:216`** — a compression quoted as Sahih International; SI reads *"No change is there in the words of Allah."*
- **`islam-qiraat.html:219`** — the "roughly forty opinions" figure attributed to **Ibn al-Jazari**; the thirty-five is **Ibn Hibban's** and the ~forty is **al-Suyuti's**. The essay's "the system is humanly constructed" argument hangs on it.
- **`islam-sira.html:208`** — fn 18 points *"the early creed of 1 Corinthians 15"* at `/library/islam-prophecy.html`, which is the **Muhammad-in-the-Bible** essay. Correct target is `earlycreed.html`.
- **`islam-wahy.html`** — ⭐ **CLEAN, zero errors.** Its *ruh min-hu* handling attaches the *kun* gloss to **kalima**, not to *ruh* — the precise error a 2026-07-29 fix pass introduced elsewhere and had to reverse.
  ⭐ **Both deliberate citation debts confirmed ABSENT from all eight Islam essays** — no al-Tabari enumeration at Q 4:171, no Wahb b. Munabbih three-hours report at Q 3:55, no Q 58:22.

### Outstanding — philosophy
- **`evil.html:136,195`** — the Dostoevsky "return the ticket" line is **Constance Garnett's wording cited to Pevear & Volokhonsky**; the P&V rendering is different. The 1990 P&V first edition was **North Point Press**, not FSG.
- **`evil.html:206`** — fn 12 supports the over-skepticism critique with Draper's **1989 "Pain and Pleasure"**, which is his own evidential argument, a different thing.
- **`evil.html:160`** — Rowe's premise (2) restated with its load-bearing *unless* clause deleted, in a numbered argument attributed to him with a page cite.
  ⭐ **The guardrail HELD on all three counts** — mystery conceded first, Plantinga scoped as a **defense not a proof** in prose *and* FAQ *and* JSON-LD, logical problem failed / evidential live.
- **`ontological.html:188,212`** — Plantinga's own closing verdict quoted **verbatim** but cited to *God, Freedom, and Evil* 112; it is ***The Nature of Necessity*, 221**. The whole "What Plantinga Actually Claimed" section rests on it.
- **`ontological.html:170`** — a **modern defence put in Anselm's mouth**: the "no intrinsic maximum to island-greatness" reply is Plantinga's and the analytic literature's, not the *Responsio*'s, which argues by challenge. ⚠ **Live in three places** — `:170`, the FAQ at `:246`, and byte-identically in the FAQPage JSON-LD at `:253`.
- **`thomistic.html:184`** — Oppy (above). ⚠ The gate flagged its own source here as Feser, this essay's principal defender, and declined to assert the inverse — correct discipline.
- **`thomistic.html:209–214`** — every substantive footnote cites a whole book or chapter with no page, including fn 9's *"Feser's published replies on inertia"*, which names no publication.
- **`leibniz.html:175`** — Schopenhauer's **"hired cab"** targets the **law of causality**, not the PSR; and the entire Taxicab Fallacy section carries **no footnote at all** — the only body section across these four with a direct quotation and zero citation.

### Outstanding — natural theology & remainder
- **`privileged.html:169`** — 🔴 the receding-Moon objection is **stated backwards**, and it is a *critic's* argument. A closer Moon has a *larger* angular diameter, so total eclipses were deeper and more frequent in the deep past; what was impossible then is the **annular** eclipse. The time-bound thing is the near-exact disc match.
- **`privileged.html:214`** — wrong ISBN for the 2000 *Rare Earth* first edition (`0-387-95289-6` is the later paperback; first is `0-387-98701-0`).
  ⭐ All three hazards the brief feared **PASS**: critics fairly represented, **no astronomer quoted for a design conclusion he rejects**, consensus overclaim refused three times.
- **`reason.html:143`** — the **Haldane** quotation altered inside the quotation marks (*"no reason for supposing"* → his text reads *"no reason to suppose"*).
- **`religious.html:131`** — 🔴 **Pascal's *Memorial* quoted with its lines reversed and the repeated word misidentified.** *FEU* appears **once**; the repeated words are "Certitude. Certitude." and "Joie, joie, joie." The order runs Fire → God of Abraham → Certitude. And there is **no footnote** for it.
- **`religious.html:143`** — the **Swinburne** Principle of Credulity rearranged inside its quotation marks.
- **`religious.html:145`** — *"as he put it"* on an **Alston** string that circulates as a third-person catalogue description, not his sentence; fn 6 renders the same claim with "physical" where the body has "external".
- **`religious.html:157`** — body and fn 9 give **two non-overlapping accounts of the same published exchange**, and cite no article.
- **`religious.html:155`** — Persinger called a "Canadian psychologist"; he was American-Canadian and a **neuroscientist**.
- **`respred.html:169`** — Ehrman (above). **`:191`** — Ehrman's *New Testament* 6th ed. is **2015**, not 2016.
- **`holy_spirit.html:138,182`** — the Nicene Creed quoted in the **ICET/ELLC modern ecumenical wording our own `sources/creeds.json` explicitly retired as copyright-risky**, contradicting the essay's own fn 3. Schaff reads *"the Lord and Giver of life"*.
- **`holy_spirit.html:214`** — a text attributed to **Schaff** that differs from our verified corpus in five places.
- **`holy_spirit.html:180,218`** — Gregory's Fifth Theological Oration is **380**, not 381 — which also stops it making him a commentator on the council rather than a cause of it.
- **`holy_spirit.html:178`** — Nicaea 325 does not "close with" the Spirit clause; it continues into the anathemas.
- **`desire.html:141 vs :173`** — the **same Kreeft sentence quoted two different ways** twelve paragraphs apart.
- **`desire.html:163`** — *"still the only book-length philosophical critique of Lewis's apologetics"* is false (Wielenberg, CUP 2008). Publisher-blurb exclusivity a critic disproves in one search.
- **`desire.html:197,149`** — the *Sophia* article misdated and unnamed; the Aquinas quotation matches no cited translation.
  ⭐ **Every C. S. Lewis quotation across `desire.html` and `beauty.html` traced verbatim to the right work and chapter** — the site's highest-risk author is its cleanest.
- **`coincidences.html:173,224`** — the **Carrier** quotation reordered inside quotation marks, *and* the truncation deletes the clause in which he pre-empts our central reply ("and when it contradicts them it does so deliberately").
- **`coincidences.html:224`** — the JETS author is **Joe Morgado, Jr.**, not "Joseph J. Morgado Jr."
- **`beauty.html:193`** — Edwards's "The Mind" is in **vol. 6** (*Scientific and Philosophical Writings*), not vol. 8.

---

## What to do next, in order

1. **Fix the six scholar-misattributions first.** They are the class most likely to be caught by a reader who knows the field, and each one costs the page its authority.
2. **Then the quotation defects** — Pascal, Haldane, Swinburne, Carrier, Kreeft, Dostoevsky, the three false-ESV strings, Q 9:5 (done). A quotation altered inside its own quotation marks is the cheapest possible thing to be caught doing.
3. **Then the footnote substrate.** `messianic-prophecy.html` cannot carry a "fully sourced" badge on 6-of-10 Wikipedia/GotQuestions footnotes.
4. **⚠ Propagate every fix to the FAQ and the FAQPage JSON-LD.** `ontological.html`'s Anselm defect is live in three copies; `islam-naskh` and `islam-qiraat` each have three. CLAUDE.md's standing lesson: a prose fix is not a fix.
5. **Stamp only what was actually checked.** Where a file's findings include UNVERIFIABLE-HERE items, the `by` note must say so. Do **not** back-date stamps to close the gap — that is the fabricated-stamp failure already on record.
6. **Then, and only then, reword `editorial-standards.html:110,112` and the homepage.** The claim becomes defensible once the errors are fixed and each stamp records its own coverage.

## Two structural recommendations

- **Add `citations` to `tools/check-content-review.mjs:152`.** CI enforces two of five promised stages. Adding it would fail 28 files today, so it is a decision rather than a patch — but until it is enforced, the gap recurs.
- **There is no Islamic-sources record in the repo.** `sources/` holds patristics and creeds only, so ~60 Qur'an, hadith, sira and qira'at citations across eight essays have nothing repo-side to check against. A `sources/quran-sahih-international.json` and a `sources/hadith.json` covering only the verses and hadith these essays actually use would make the next run cheap and survive an egress blackout.
