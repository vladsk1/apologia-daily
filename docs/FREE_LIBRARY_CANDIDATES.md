# Free library candidates: books, essays and articles we could legally carry

*Written 2026-09-23. A shortlist, not a to-do list: nothing here has been added, and every item still
goes through the normal rules below before it is published.*

Chosen for the site's goals: help Christians give a reason for their hope (1 Peter 3:15), reach
honest seekers, cover the faith common to Catholic, Orthodox and Protestant Christians, and state
the other side fairly. Items are grouped by the Evidence Library tab they serve.

## The two legal kinds

- **HOST.** Public domain, or an open licence that allows commercial use (e.g. CC BY). We can put
  the full text on the site.
- **LINK.** Free to read online but still copyrighted, or under a "non-commercial" (NC) licence.
  ⚠ **Most modern open-access scholarship is NC, and we are a commercial site**, so we link to it and
  write our own guide (the book-page model); we do not host it.

## Rules that apply to every item

1. **Check the translation, not just the work.** An ancient text in a modern translation is
   copyrighted. Every HOST item below names a public-domain translation.
2. **Public domain differs by country.** In the US the line is roughly publication 95+ years ago
   (1930 works entered the public domain in January 2026). In the UK, EU and Australia it is
   generally the author's or translator's death + 70 years. The HOST items were chosen to clear both
   tests as far as could be established. The ones not fully confirmed say **"confirm"**.
3. **Old scholarship is old.** Pre-1930 history, archaeology and textual criticism is valuable as a
   primary witness or classic argument, but can be outdated. Label it "classic" and link to our
   current essay.
4. **Hosting is not quoting.** A hosted book is reading material. Only passages verified and flipped
   to `verified:true` in `/sources` can reach the live AI, same as today.
5. Every guide page, summary or introduction we write goes through the normal content pipeline.

## 🔴 Church Fathers library: hosting rules (owner ruling, 2026-11-18)

The owner approved building a section that hosts the Church Fathers' books **in full**, each with a short
guide, linked Bible references and links to our essays. The best lines from each also go into `/sources`
for the live AI. These rules bind every book in that section.

**Scope (owner, 2026-11-18): the Church Fathers only, Trinity books first.** The rest of this document
(the other tabs' books: Anselm, Aquinas, Josephus, Chesterton, the critics, the Qur'an, the Book of Mormon)
is **NOT approved**. It stays a shortlist and an option for later; do not start it without the owner.

**Where it lives: inside the existing "Church Fathers & Creeds" page (`sources.html`), not a new tab.**
That page already presents "the early church in its own words, verified" as searchable passages. The full
works sit beside them as a second view (passages / full works), each book on its own page, and every
passage gets a "read it in context" link to its exact place in the full text. No new menu item and no
new Evidence Library tab. They exist to protect **denominational
neutrality** (see `CLAUDE.md`): the Fathers are the shared inheritance of Catholics, Orthodox and
Protestants, and the section must stay that way.

**1. Strip the old editors' notes.** The public-domain English translations come from the 19th-century
Schaff ANF/NPNF series, whose Protestant editors added introductions, prefaces and footnotes. Some take
sides, at times with remarks against Catholic teaching. **Remove all of them.** Keep only the Father's
own text, the translation itself (including words the translator supplied in brackets or italics to make
the sense run), and the book/chapter/section numbers needed for citation. Removing notes must never
change one word of the Father's text: the copy-check compares the hosted text against the source
edition. Each book page states in its colophon: *"Translation: [translator], [series and volume, year].
The editors' introductions and footnotes are omitted."*

**2. Keep the disputed passages, and mark each with a short neutral note.** Hosting a book in full means
hosting all of it. Where a passage touches a question the Christian traditions answer differently, add a
short note at that point: *"Christian traditions read this passage differently."* The note may say
**what** the question is. It must never say which reading is right. Known cases so far:
- Basil, *On the Holy Spirit* (esp. ch. 27): unwritten church tradition alongside Scripture.
- Augustine, *On the Trinity*: the Spirit's procession from the Father *and the Son* (the filioque,
  disputed between East and West).
- Gregory of Nazianzus, *Oration* 40 (on baptism): what baptism does.

Expect more as books are added: the Eucharist, Mary, Peter and the papacy, prayer for the dead,
predestination, the end times. These are the disputes the neutrality guardrail names, and the same rule
covers each. The note's wording is doctrinal content, so it is gated (rule 6) before first use.

**3. Balance East and West.** The section must not tilt toward one tradition's favourites. The Trinity
set is balanced: **East** — Athanasius, Basil, Gregory of Nazianzus, Gregory of Nyssa; **West** — Hilary,
Augustine, Novatian. Every later addition is checked against this balance and the tally is kept current
here. Hosting Augustine without the Cappadocians, for example, would tilt the library West.

**4. Say plainly when a Father is not fully orthodox by later standards.** Writers before Nicaea had not
yet settled the vocabulary, and some later broke with the church. Their guides say so clearly, so the page
never reads as if the site endorses every line. **Novatian** is the first case: he later led a schism,
and parts of his *On the Trinity* sound as if they rank the Son below the Father. His guide carries a
clear note in this sense: *"A valuable early witness to Christ's deity; some of his wording was later
corrected at Nicaea."* (draft wording, to be gated). The same applies to any other pre-Nicene writer
whose wording was later refined (e.g. Origen, Tertullian, Justin).

**5. One line at the top of the section.** The section's landing page opens with: *"These are historic
witnesses, not Scripture. We present them complete, including passages that Christian traditions read
differently."* This matches the rule the live AI already follows for the same texts (`api/ask.js`
tells it these passages "are historic human witnesses, not Scripture"). Hosting a book is
not endorsing every sentence, and this line says so. The line is gated like any other content.

**6. Every guide gets the full review, including neutrality.** These are Trinity texts, the dual-consensus
tier, so each guide, each rule-2 note and each rule-4 note passes **argument + orthodoxy + neutrality**,
run as read-only agents, before it goes live. The neutrality review is where rules 1–5 are checked for
each book: no editors' notes left, every disputed passage noted without taking a side, the East/West
balance kept, and no unfenced endorsement of a Father's imprecise wording. The Fathers' own text is not
doctrinally gated (it is theirs, not ours); it only needs the word-for-word copy-check.

Also standing: **no Trinity diagram anywhere in the section**, including any image inside a hosted book
(owner rule, 2026-08-29).

**7. Every hosted book is also checked against our site, like a mine.** Hosting a Father's full text is a
chance to test our own work against him. Two checks run on every book before it is called finished:
- **(a) The quote-check (a script, automatic).** Every place our site quotes or cites this Father (essays,
  `ev-s*` cards, `ev-m-*` mastery pages, `/answers`, briefs, `/sources`) is compared against the hosted
  text: are the words right, and does the section number point to the right place? A mismatch is a
  backlog row (P1 if the misquote is live). It keeps running in CI afterwards, so a future edit cannot
  reintroduce a misquote.
- **(b) The error-and-improvement pass (judgement, like a mine).** Read-only review agents read the
  Father's text against our pages that use him and return findings in the mine's six verdicts
  (`CLAUDE.md`): ② **error in ours** — we misdescribe what he argued, or quote him out of context (always
  P1); ③ **weaker in ours** — he makes our point better than we do, so a stronger line should be quoted;
  ④ **missing** — he answers an objection our essays leave open; ⑤ **ours is better** — a passage not to
  lean on (e.g. imprecise pre-Nicene wording); ⑥ **leave alone** — with the reason. Run as two passes, an
  error-hunter and an improvement-finder, on different models where possible, and never handed each
  other's conclusions. Findings go to `docs/content-backlog.md`; the best new lines become verified
  `/sources` passages; the run gets a row in `docs/MINE_SCOREBOARD.md`.
- One difference from mining a copyrighted book: here the text is public domain, so a strong find can be
  **quoted directly** (once verified), not just used as a lead.

**Status and tallies (keep current).**
- **Pilot — Gregory of Nazianzus, *Theological Orations* 27–31: built 2026-11-18.** Pages `fathers/nazianzus-orations.html`
  + `fathers/nazianzus-oration-27.html` … `-31.html`, generated by `tools/build-fathers.mjs` from `fathers/_data/`.
  Copy-check and rule-7 record: `docs/audits/fathers-nazianzus-copycheck-2026-11-18.md` (incl. the G-1…G-16 rows
  for our essays). ⚠ Lesson from the pilot: the base text is **CCEL's transcription of the 1894 printing**, not
  New Advent, which modernises the English ("hath"→"has", "thou"→"you"); hosting New Advent would have hosted its
  editor's revision. Use New Advent only to locate passages.
- **Book 2 — Hilary of Poitiers, *On the Trinity* (Books 1–12): built 2026-11-18.** Pages `fathers/hilary-trinity.html`
  + `fathers/hilary-trinity-book-1.html` … `-12.html`. Record: `docs/audits/fathers-hilary-copycheck-2026-11-18.md`
  (incl. H-1…H-11 for our essays). ⚠ Lessons: (1) CCEL's npnf209 transcription departs from print far more than
  npnf207 did — 36 slips (three turned "passible"/"impassible" into "possible"/"impossible") and 27 modernised
  spellings ("begat"→"begot", "spake"→"spoke"); check every modernisable spelling, not only the comparison's
  diff list. (2) The volume is **1899** (CCEL says 1898, the preface's date). (3) "Ib." in the editors' notes means the
  previous *footnote's* book. (4) **12.55's 1899 English reverses Hilary's Latin** on whether the Spirit is "begotten";
  check the Latin wherever a translation reads oddly on a relation of origin.
- **East/West tally (rule 3): East 1 (Gregory of Nazianzus) · West 1 (Hilary).** Either side may come next.
- **English only.** The Macedonian/Spanish mirror rule in `CLAUDE.md` covers the Evidence Library (`library/`,
  `ev-s*`), not `/fathers`; an AI translation of a Father's own words would no longer be his words.

**Trust figure — APPROVED by the owner, 2026-11-18.** The site may state a counted figure such as *"N
early-church works hosted in full."* This is a new trust claim; the owner approved it for this section
specifically (it is **not** the general "books & articles studied" counter declined on 2026-09-27, which
stays declined). Build it with the first published book, not before (a figure of 0 says nothing):
- Generated by `tools/update-trust-numbers.mjs` from the repo, never hand-typed, and CI-checked with
  `--check` like the other figures.
- **Count only finished books**: the full text has passed the word-for-word copy-check and its guide has
  passed the rule-6 review. A book still in progress does not count (same discipline as counting only
  gated briefs).
- Count works, not pages or chapters, and keep the wording exact about what is counted.

**Already in `/sources` (156 verified passages):** creeds and councils; Athanasius *On the
Incarnation*; Irenaeus; Clement of Rome; Justin Martyr; the Didache; Ignatius; Cyril of
Alexandria; Eusebius *Church History*; Leo's Tome; Origen *Against Celsus*; the Cappadocians;
Augustine (a few passages); Chrysostom; Tertullian; Aristides; Athenagoras; Diognetus; Polycarp;
Perpetua; Minucius Felix; Novatian; Hilary; Hippolytus; Cyprian; Vincent of Lérins. These are
excerpts. The first step is to host the **full texts** they come from (all from the Schaff
ANF/NPNF translations, which are public domain).

---

## 1. God's existence (ev-s1)

| Work | Why it fits | Translation / edition | Kind |
|---|---|---|---|
| Anselm, *Proslogion* | The original ontological argument | Deane, 1903 | HOST |
| Aquinas, *Summa Theologiae* I q.2 (the Five Ways) | The classic cosmological arguments | English Dominican Fathers, 1911–25 | HOST (confirm per volume) |
| Boethius, *Consolation of Philosophy* | God's eternity and timelessness. ⚠ Our `kalam.html` work needed this and `/sources` has none | H. R. James, 1897 | HOST |
| Leibniz, *Monadology* and *Principles of Nature and Grace* | The contingency argument's source | Latta, 1898 | HOST |
| Paley, *Natural Theology* (1802) | The classic design argument (pair with our fine-tuning essay's data-vs-design line) | Original English | HOST |
| Butler, *The Analogy of Religion* (1736) | Probability-based reasoning for faith | Original English | HOST |
| Pascal, *Pensées* | The wager, the heart's reasons, the human condition | Trotter, 1910 | HOST (confirm translator dates) |
| Newton, *General Scholium* (Principia) | A founding scientist's design reasoning | Motte, 1729 | HOST |

## 2. The resurrection (ev-s2)

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| Frank Morison, *Who Moved the Stone?* (1930) | The best-known sceptic-turned-believer investigation | Original | HOST (US PD since 2026; author d. 1950). Label "classic" |
| Simon Greenleaf, *The Testimony of the Evangelists* (1846) | A Harvard law professor weighs the Gospel witnesses | Original | HOST |
| B. F. Westcott, *The Gospel of the Resurrection* (1866) | A major Anglican scholar's case | Original | HOST |
| James Orr, *The Resurrection of Jesus* (1908) | Early-20th-c. answer to the naturalistic theories | Original | HOST |
| Andrew Loke, *Investigating the Resurrection of Jesus Christ* (2020) | Current peer-reviewed scholarship; we have already mined it | Routledge open-access edition | **LINK** (licence to confirm; likely NC) |
| Gary Habermas's articles | The minimal-facts method, from the author | garyhabermas.com | LINK |

## 3. Jesus: history and identity (ev-s3)

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| Josephus, *Antiquities* 18.3.3 and 20.9.1 | Non-Christian witness to Jesus and James | Whiston, 1737 | HOST |
| Tacitus, *Annals* 15.44 | Roman witness to the crucifixion under Pilate | Church & Brodribb, 1876 | HOST |
| Pliny the Younger, *Letters* 10.96–97 | Christians worshipping Christ "as to a god," c. AD 112 | Firth, 1900 | HOST |
| Suetonius, *Claudius* 25 and *Nero* 16 | Roman references to Christians | Rolfe, 1914 | HOST |
| Lucian, *The Passing of Peregrinus* | A 2nd-c. satirist's hostile witness | Fowler, 1905 | HOST |
| Mara bar Serapion's letter | Possible early non-Christian reference (dating debated) | Cureton, 1855 | HOST |
| Justin Martyr, *Dialogue with Trypho* | Early Christian–Jewish debate on the Messiah; includes Justin's conversion | ANF (Schaff) | HOST |

## 4. Can we trust the Bible? (ev-s4)

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| **Berean Standard Bible (BSB)** | A modern translation released to the public domain (2023); would power a Bible reader | Official | HOST |
| World English Bible, ASV (1901), KJV | More free translations for comparison | Official | HOST (⚠ KJV is under Crown patent in the UK) |
| Westcott & Hort, Greek New Testament (1881) | The classic critical Greek text | Original | HOST (a modern Greek text's licence to check) |
| F. G. Kenyon, *Our Bible and the Ancient Manuscripts* (1895) | A readable classic on textual transmission | Original | HOST, labelled "classic" (superseded by later discoveries) |
| W. M. Ramsay, *The Bearing of Recent Discovery on the Trustworthiness of the NT* (1915) | Luke as historian, from archaeology | Original | HOST, labelled "classic" |
| Center for the Study of NT Manuscripts (CSNTM); Dead Sea Scrolls digital library | Real manuscript images | Their websites | LINK |
| Themelios, Tyndale Bulletin, JETS archive | Free evangelical scholarship (Hemer and others) | Publisher sites | LINK |

## 5. Science and faith (ev-s5)

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| Galileo, *Letter to the Grand Duchess Christina* (1615) | The founding text on Scripture and science; for the Galileo myth | Salusbury, 1661 | HOST (confirm) |
| Kepler and Boyle selections | Scientists of faith in their own words | Period English | HOST |
| Luke Barnes, "The Fine-Tuning of the Universe for Intelligent Life" (2012) | The data behind fine-tuning, including his reply to Stenger | arXiv | LINK |

⚠ Keep this tab neutral: do not add material that settles young-earth vs old-earth or evolution
debates. Where a debate exists, present it rather than pick a side.

## 6. The Trinity (ev-s6)

Mostly already in `/sources` as excerpts. Host the full texts:

| Work | Edition | Kind |
|---|---|---|
| Gregory of Nazianzus, *Theological Orations* (27–31) | NPNF (Schaff) | HOST |
| Basil, *On the Holy Spirit* | NPNF | HOST |
| Gregory of Nyssa, *On "Not Three Gods"* | NPNF | HOST |
| Augustine, *On the Trinity* | NPNF (Haddan) | HOST |
| Hilary, *On the Trinity* | NPNF | HOST |
| Novatian, *On the Trinity* | ANF | HOST (guide needs the rule-4 note) |
| Athanasius, *Against the Arians* (Discourses I–III) | NPNF (Newman/Robertson) | HOST. ⭐ Added 2026-11-18: his main Trinity work; `/sources` has none of it |
| Athanasius, *Letters to Serapion* (the Spirit's deity) | ⚠ **Check first.** Probably not in the Schaff series; the standard English translation (Shapland, 1951) is still under copyright | Do not host until a public-domain English translation is confirmed |
| Schaff, *The Creeds of Christendom* (1877) | Original | HOST (confirm creed wordings match `sources/creeds.json`) |

⚠ No Trinity diagrams anywhere, including in any hosted book's images (owner rule).

## 7. Conversion stories (ev-s7)

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| Augustine, *Confessions* | The classic conversion story | Pusey, 1838 | HOST |
| G. K. Chesterton, *Orthodoxy* (1908) | A journalist reasons his way to faith | Original | HOST |
| Chesterton, *The Everlasting Man* (1925) | Christ and history; C. S. Lewis credited it in his own conversion | Original | HOST |
| Justin Martyr, *Dialogue with Trypho* chs. 1–8 | A philosopher's conversion (also in §3) | ANF | HOST |

## 8. The church in history (ev-s8)

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| Eusebius, *Church History* (full) | Main source for the early church | McGiffert, NPNF | HOST |
| Lightfoot, *The Apostolic Fathers* (1891) | Clement, Ignatius, Polycarp, the Didache in one volume | Original | HOST |
| *Martyrdom of Polycarp*; *Passion of Perpetua* | The persecution era in its own words | ANF | HOST |
| Harnack, *The Mission and Expansion of Christianity* (1908) | Classic account of the early church's growth | Moffatt | HOST, labelled "classic" |
| Julian, *Fragment of a Letter to a Priest* | A hostile emperor on Christian charity. ⚠ Use this, **not** the *Letter to Arsacius*, whose authenticity is disputed | Wright, Loeb 1923 | HOST |

## 9. Other worldviews

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| The Qur'an in English | To quote the Qur'an accurately in the Islam cluster | Palmer, 1880; Pickthall, 1930 | HOST (Pickthall: US PD since 2026, UK since 2007) |
| John of Damascus, "On the Heresy of the Ishmaelites" | The earliest Christian response to Islam (c. 740s) | Older translation | **Confirm** a PD translation exists before use |
| Book of Mormon (1830) | Primary source for the Mormonism essays | Original | HOST (link the current official edition too) |
| Jehovah's Witness materials | Quote only in fair short excerpts from their own site | — | LINK |

## 10. The other side, in their own words (steelman primaries)

Our essays promise to state objections in their strongest form. Hosting the classic sceptics shows
we mean it.

| Work | Why it fits | Edition | Kind |
|---|---|---|---|
| Celsus, via Origen's *Against Celsus* | The earliest surviving pagan attack on Christianity | ANF | HOST (already partly in `/sources`) |
| David Hume, *Enquiry* §X "Of Miracles" and *Dialogues Concerning Natural Religion* | The classic case against miracles and design | Original | HOST |
| Thomas Paine, *The Age of Reason* (1794) | The classic deist attack on the Bible | Original | HOST |
| D. F. Strauss, *The Life of Jesus Critically Examined* | The myth theory's source | George Eliot, 1846 | HOST |
| J. S. Mill, *Three Essays on Religion* (1874) | A sceptic who takes the design argument seriously | Original | HOST |
| Dostoevsky, *The Brothers Karamazov*, "Rebellion" and "The Grand Inquisitor" | The most powerful literary statement of the problem of evil | Garnett, 1912 | HOST |

## Free to read, link only

- **Stanford Encyclopedia of Philosophy** and **Internet Encyclopedia of Philosophy**: the best
  neutral overviews of each argument. Copyrighted; link from every relevant essay.
- **TheoLogica** (CC BY-NC-ND), **AGATHEOS** (European Journal for Philosophy of Religion), the
  **Journal of Analytic Theology**: current peer-reviewed philosophy of religion, free to read.
- **Theological Commons** (130,000+ items) and **CCEL**: places to find more public-domain texts.

---

## Where to start (recommended first 20)

These give each Evidence Library tab its key free text, in rough order of value:

1. Josephus (the Jesus passages) · 2. Tacitus *Annals* 15.44 · 3. Pliny *Letters* 10.96–97
4. Augustine *Confessions* · 5. Chesterton *Orthodoxy* · 6. Anselm *Proslogion*
7. Aquinas, the Five Ways · 8. Boethius *Consolation* · 9. Pascal *Pensées*
10. Morison *Who Moved the Stone?* · 11. Greenleaf *Testimony of the Evangelists*
12. Hume "Of Miracles" · 13. Eusebius *Church History* (full) · 14. Lightfoot *Apostolic Fathers*
15. Gregory of Nazianzus *Theological Orations* · 16. Athanasius *On the Incarnation* (full)
17. Justin Martyr *Dialogue with Trypho* · 18. The Qur'an (Palmer or Pickthall)
19. Paley *Natural Theology* · 20. The Berean Standard Bible (the base for a Bible reader)

Estimated effort (a guess, not measured): the text for most of these already exists in clean digital
form (CCEL, Project Gutenberg, Wikisource). The work is checking each translation's status,
formatting, linking Bible references, and writing a short guide per book. That is days per book,
not weeks.
