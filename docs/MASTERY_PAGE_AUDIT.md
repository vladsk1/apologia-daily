# The 63 mastery pages — full audit, 2026-07-28

Every ungated `ev-m-*.html` page assessed by the review fleet: **argument** on all 63,
**orthodoxy** on all 63, **neutrality** on the 15 Trinity/deity/world-religions pages
(dual-consensus tier). Sixteen reviews, ~139,000 words of doctrinal argument.

**This file is the work queue.** It records what was found, what was fixed on the day, and
what is still owed. Nothing here is done unless it says so.

---

## The result in one line

**Zero heresy. And the pages contradict their own certified essays, at scale.**

| Lens | Blocking | Serious | Notes |
|---|---|---|---|
| Argument (63 pages) | **~133 BREAK** | ~280 FIX | ~120 |
| Orthodoxy (63 pages) | **0 HERESY** | 37 CONCERN | ~60 |
| Neutrality (15 pages) | 6 BREAK | ~28 FIX | — |

Not one page, in the site's own voice, denies the Trinity, the two natures, the bodily
resurrection, Scripture's authority, or salvation in Christ. The doctrine held.

What did not hold is the relationship between the mastery pages and the essays they teach.

---

## The diagnosis, and it is the same one as the pocket cards

> *"The convergent diagnosis is the pocket-card diagnosis again: these pages were written
> without reading the essays."* — four separate reviewers, independently, in those words.

The essays in `library/` are the most disciplined documents on this site. Each one carries an
explicit *"what this does and does not establish"* section, and most name the objection they
consider strongest and concede it in terms. **Almost none of that survived compression.**

Across 63 pages the pattern is nearly invariant:

1. **The `.seo-summary` is honest.** Public, search-indexable, and consistently well-scoped —
   it usually carries the essay's concession verbatim.
2. **The body below it is not.** The syllogism, the accordions, the chips and the model answer
   state as settled what the summary just called contested.
3. **So pages contradict themselves**, top to bottom, on the same screen.

Worked example, and it is not the worst one. `library/minimalfacts.html` says the argument is
*"weakest when it inflates 'majority' into 'virtually all.'"* `ev-m-minimal.html`'s meta
description, `og:description` and JSON-LD all read **"the facts nearly all scholars grant."**
The page prints the inflation its own essay exists to correct — three times, in the copy that
goes to search results and social previews.

---

## Two things nobody had noticed about these pages

### 1. `ARG_PREMISES` is the highest-stakes string on every page, and it was never reviewed

Each page carries a three-line JavaScript array. It is:

- **POSTed to `/api/tutor` as the rubric a reader's own explanation is graded against**, and
- **rendered into a downloadable share-card PNG** by `shareArgCard()`.

So where it overstates, the site does not merely misinform — it **marks a reader down for
being right**, and publishes the overstatement as an image with no surrounding context.

It is wrong, or wrong-by-omission, on at least fourteen pages. On `ev-m-emptytomb.html` it
asserts the conclusion the page's own formnote disclaims two inches above it. On
`ev-m-postresurrection.html` it states the pre-concession conclusion that `library/postres.html`
explicitly retires — so a reader who correctly notes what the certified essay grants is graded
down for it. On `ev-m-cambrian.html` it is *harder* than the visible prose.

The same applies, one tier down, to the `cards` flashcard array (built for memorisation), the
`renderMockScore` `checks` regexes (which on `ev-m-respred.html` actively coach the reader
toward the page's weakest datum), and the chip row.

**None of these is visible to a prose review.** They are where the certified position had been
silently reversed, and they are the layer a reader memorises.

### 2. Two pages were entirely dead, and one of them was stamped

`ev-m-phil2.html` and `ev-m-daniel70.html` each had an unescaped apostrophe inside a
single-quoted JS string. The `SyntaxError` killed the whole inline script: `boot()`, the Pro
gate, the mastery dial, the flashcards, the `/api/tutor` call and the share-card generator
never ran on either page.

**`ev-m-daniel70.html` is one of only four mastery pages carrying a review stamp.** A doctrinal
gate certified a page whose entire interactive layer was inert — because a doctrinal gate reads
prose and does not parse JavaScript.

Fixed, and `tests/inline-script-syntax.test.mjs` now parses every inline script on all 1,100+
pages and `JSON.parse`s every `ld+json` block. It cannot recur silently.

---

## Fixed and deployed on 2026-07-28

Twenty factual corrections, each verified against the paired certified essay:

| Page | What it said | Why it's wrong |
|---|---|---|
| `nt_trinity` | Pliny wrote in 112 "while Constantine's grandfather was a boy" | Constantine was born c. 272 — five generations later |
| `hist_jesus` | "an Arabic version preserves a neutral form" of the Testimonium | Whealey (*NTS* 54, 2008): it descends from the Syriac of Eusebius, not an independent Josephan line |
| `titles` | *pelach* "rendered elsewhere in Daniel only to God" | Dan 3:12 uses it of Nebuchadnezzar's gods |
| `titles` | Jesus claims Daniel 7 "verbatim" | Daniel's Aramaic is indefinite ("*like* a son of man"); the Gospels' Greek is doubly definite |
| `jewishness` | the Gospels keep "untranslated Aramaic" | Mark translates it — and the translating *is* the evidential point |
| `multiatt` | the empty tomb attested across "Q, Tacitus, Josephus" | It is in none of them |
| `jesus_as_god_nt` | Nicaea defined terms for "a faith two centuries old" | Crucifixion c. 30, Nicaea 325 — nearly three |
| `uniqueness` | parallelomania "collapsed a century ago" | Sandmel coined it in 1962; the turn is J. Z. Smith, 1987 |
| `coincidences` | the green-grass/Passover case, as a worked example | `library/coincidences.html` says drop it — if John knew Mark he could infer the season |
| `canon` | chip: "self-authenticating" | Kruger's Reformed model, which `library/canon.html` deliberately declines to rely on |
| `archaeology` | "almost no genuine refutation" | The page's own `ARG_PREMISES` already omitted it |
| `eternal_generation` | "honoring the Son AS the Father" (John 5:23) | The verse is comparative ("just as"); compressed, this reads modalist |
| `philosophical_trinity` | "classical writers preferred 1x1x1 to 1+1+1" | No such source. And the arithmetic is vacuous |
| `early_church_trinity` | "roughly 300 bishops" | The sources give 250 to 318 |

Plus the CONCERN-level doctrinal fixes: the **will-to-will** language in `modalism` and
`nt_trinity` (the certified essays say *"one undivided essence, one will, one power"* — and
`modalism` contradicted itself four accordions apart); the unfenced *"the Son receives his
deity from the Father"* in `eternal_generation` (the essay's own `orthonote` exists to deny
exactly that reading); *"a creature enthroned beside God"* spoken in our own voice in
`jesus_claims`; and *"the title whose humility was camouflage"* in `titles`, which reframed the
one title carrying Christ's humanity as a disguise.

And earlier the same day: `ev-m-shema.html`'s *echad* premise and `ev-m-ot_trinity.html`'s
Genesis 1:26 thread, both of which ran arguments their essays retire in so many words. Both
verified by the re-gate as sound **and fully propagated** — which the reviewers noted is the
propagation discipline the pocket-card sweep found missing.

---

## Round 2 — shipped 2026-07-28, after the owner set the scope

The owner's call, and it was the right one: **relabel + route everywhere, transplant only the
objections a reader meets constantly, and fix the contradictions everywhere — because that is
the part that is actually wrong rather than merely incomplete.**

**① The promise is now true (67 pages).** The block was headed *"Each one stated as its
strongest defender would put it — never a strawman."* On most pages that was false. Now: *"The
objections you will actually meet."*

**② Every one of the 63 routes to its own hardest objection.** A gold line under the block
names the objection the paired essay identifies as hardest and links to it — *"The one that
matters most: the measure problem — 'improbable' relative to what? … take it with you, not just
the replies below."* The reader now knows the hard one exists, knows we have not hidden it, and
knows where the answer is. That is the site's designed architecture (page drills, essay goes
deep) made explicit instead of assumed.

**③ Three objections transplanted in full**, chosen because a reader meets them constantly:

- **The Jewish agency reading** → `jesus_as_god_nt`, `hands`. Absent from the first entirely,
  badged *Trickier* on the second, and it is the objection that arrives at people's front doors.
  Now names the *shaliach* principle, concedes that the sent/given/appointed language fits an
  agent reading, and answers with the essay's move: homage was never the line — *Marana tha* is
  **prayer**, from the earliest Aramaic-speaking church. The framework explains the titles; it
  breaks at the altar.
- **Ehrman** → `jesus_claims` (was Schweitzer's tragic prophet, which *invites* the prerogatives
  list; Ehrman's real case *absorbs* it), `early_church_trinity` (was "the winners' edited
  record", which he does not claim — the essay says he explicitly rejects the Constantine myth).
  Both re-badged **Hard**.
- **The multiverse** → `finetuning`, `cosmic`. The steelman omitted eternal inflation and the
  string landscape — the physics that makes it serious. Both pages imputed a motive ("to avoid a
  designer") no physicist holds. The meta copy promised to *"dismantle"* it; the essay says
  *"this deserves respect, not dismissal… that is a fair fight."*

**④ 24 contradictions fixed** — the part no label change touches. `messianic_prophecy` ×4
(Psalm 22:16, the Targum, "fits no nation", the motive-impugning line); Stoner's odds propagated
out of `prophecy` **and** out of the `palace.html` memorisation room; Wallace's figure taken out
of Ehrman's mouth on `manuscript`; `burial`'s "no rival tradition anywhere" (Acts 13:29);
Finkelstein un-mislabelled on `archaeology`; `deadseascrolls`' reversed finding on pluriformity;
plus `canon`, `uniqueness`, `consistency`, `earlydate`, `appearances`, `paul`, `sceptics`,
`cambrian`, `respred`. And the *"logic is airtight… every objection attacks P1 or P2"*
boilerplate on 7 pages — false on several, and each refuted it itself a few accordions later.

**⑤ Both corpus gaps closed.** The deism sentence is on all 12 pages that lacked it; the
Chalcedon sentence on the 4 deity pages that lacked it.

---

## Round 3 — the backlog cleared, 2026-07-28

**Code (74 files).** The share-card fell back to `KALAM_PREMISES`, a variable only `ev-m-kalam.html`
defines — guarded, so never a live crash, but a trap that fires the moment anyone renames
`ARG_PREMISES`, which is now edited often (48 pages). A copy-paste artefact told every reader they
were on "1 of 22" (19 pages). Apostrophes stripped from memorised flashcards — "Pauls own", "Daniel
7s" — restored with proper escaping now the syntax test guards them (7 pages).

**The four rebuild pages.** `trinity_islam` rebuilt from its essay: the Mihna/Eternal-Word dilemma
is gone (it appears nowhere in the essay, and it equivocated *kalām Allāh* with *kalima*), and so
are "distinct in some sense from the essence" and "a parallel construction of it, lacking only the
personal language" — the two strings the orthodoxy gate said a stricter reviewer could call heresy.
`evil` gained the evidential problem: Rowe, the fawn, Wykstra, CORNEA, and the essay's honest
verdict that it is unresolved by either side. `messianic_prophecy` lost Daniel 9 as a pillar and
gained Isaiah 53:9. `cambrian` completed.

**Doctrinal backlog.** Evolution neutrality on `cambrian`/`originlife` (young-earth, old-earth and
evolutionary-creation Christians confess the same creeds — the opposite of taking a side, so it
stands whatever is decided about the science tab). "Martyr-bishop" of James → church government.
"The Apocrypha" alone → both names. Libertarian free will asserted in our own voice on `leibniz`
and `evil`. `religious`'s perennialist-sounding "common core". And a pastoral referral on `evil`,
which passed every pastoral test but pointed nowhere for help.

**Citations (12).** Kepler's and Galileo's paraphrases printed as quotations. Five scholars enlisted
for conclusions they reject — Chalmers, Davies, Nagel, Lapide, Mettinger — the same shape as the
Francis Collins problem on the pocket cards. Mettinger in particular is now cited as the conceding
witness he actually is, which is worth more than an advocate. Ignatius's "seven times" and Sibcy's
unpublished survey removed; Allison replaces Sibcy in the sources.

**Factual (5).** bar Kokhba dated to Jesus' era (he is AD 132). Acts 5's Gamaliel speech cited as
period data despite the Theudas crux. "470 genes" attributed to a free-living organism (473 is
JCVI-syn3.0, synthetic). P52 dated flatly. And Pompeii offered as a parallel for silence — Pliny
the Younger is a contemporary eyewitness who describes the eruption.

**Calibration (19).** "Never once falsified", "every time" ×2, "fails every test", "provably",
"unfakeable", "recognised across scholarship", "virtually all scholars", "demonstrably held",
"a trial even sceptical scholars accept as bedrock", "eyewitnesses cannot be sincerely mistaken"
×2, and the graded rubric's "the ONLY formulation that keeps all the data" — which the essay's own
"Where the Argument Reaches Its Limit" section retires.

---

## Round 4 — the re-gate, 2026-07-29

The whole corpus was reviewed again **against the current text**, not against the audit:
argument ×63, orthodoxy ×63, neutrality ×16 on the dual-consensus tier, plus a
confirmation pass of both doctrinal lenses over every page changed in the fix rounds.

**0 HERESY. But a large number of NOT-STAMPABLE verdicts, and one cause behind almost
all of them.** Every reviewer reached it independently:

> The fixes landed in the prose and not in `ARG_PREMISES`, the `cards` deck, the
> mock-scorer `checks`, or the drill model answers.

Those are the strings a reader **memorises** and is **graded against**. A doctrinal gate
reads prose. It does not read a JavaScript array.

### The four blockers — three of them the same shape

A fix that landed on one page and **not on its sibling**:

| Page | What was still live |
|---|---|
| `ev-m-jesus_as_god_nt.html` | Attributed the **qualitative** reading of John 1:1c to **Colwell**. Colwell (1933) was about *definiteness*; the qualitative analysis is Harner, Dixon and Wallace — who explicitly warns against this misapplication. **`ev-m-john11.html` devotes a Hard objection to conceding that apologists overclaim Colwell.** The site conceded the error on one page and committed it on its sibling. The same line also claimed "the same Greek pattern in the same chapter is never rendered *a god* by anyone" — either empty (there is no second preverbal anarthrous predicate nominative in John 1) or the false-parallel claim a well-read Witness corrects on the spot. |
| `ev-m-trinity_islam.html` | The syllogism retired the *kalām Allāh* / *kalima* bridge; **six other strings still ran it** — the "command Be" reply, the Hard objection heading, steelman and reply, the key-concept block, the attributes reply, and the **Drill 3 model answer**, the text the reader is coached to say aloud. That answer also still carried *"distinct in some way from the essence"* (the Arian direction) and a sentence duplicated by an earlier partial edit. And the `checks` array **marked a reader down for obeying the page's own instruction.** |
| `ev-m-titles.html` | The flashcard *question* presupposed the conclusion the page had just been calibrated to stop asserting. |
| `ev-m-trinity_jw.html` | P2 and flashcard 1 still pointed at the false Greek parallel after the objection reply had been corrected. |

### The eight WEAK flags

Three were overstated-consensus claims **each contradicted by its own page a few
accordions later**: `hands` and `phil2` on "recognised across scholarship" (Bauckham's
divine-identity category is disputed by Hurtado and McGrath; `phil2` concedes the hymn
theory is challenged four accordions below asserting the consensus), and
`philosophical_trinity` telling the reader critics *"cannot"* state the contradiction two
lines above naming the transitivity-of-identity argument as its hardest objection. The
rest: `eternal_generation` ("underived aseity, possessed from the Father" as a standalone
flashcard, plus the 2016 EFS controversy narrated as closed), `nt_trinity` ("the only
formulation that keeps all the data" against its own calibrated rubric),
`trinity_mormons` ("devout, **Christ-centred** lives" — conceding the object of worship,
not only the sincerity), `early_church_trinity` ("the floor that never moves", which
Origen on prayer and Justin's *heteros theos* do wobble), and `jesus_claims` (*pelach*
stated flatly where `titles` now concedes Daniel 3:12).

### One page was dead JavaScript again

`ev-m-multiatt.html` — an apostrophe in `'a standard historian's tool'` inside a
single-quoted flashcard string, **introduced by this session's own calibration sweep**,
killing the whole inline block: the Pro gate, the mastery dial, the flashcards, the
`/api/tutor` call and the share-card generator. `tests/inline-script-syntax.test.mjs`
caught it before deploy. **Third catch.** Run `node --test tests/*.test.mjs` after every
content edit pass — it is the only thing between a prose edit and a silently inert page.

### Also closed

The last **deism gap**: `ev-m-cosmic.html` reached "a purposive mind" and never told the
reader that is not yet the Triune God. **Correction to Round 2's record:**
`ev-m-kalam.html` was listed as having the same gap. It does not — it says "the argument
concludes to a transcendent cause, not yet to the full God of Christianity" in its own
honest-scope paragraph. The earlier grep pattern was too narrow.

---

## STILL OPEN — the work queue

Ordered by risk. The page-specific findings are cleared; what remains is structural.

### Tier 1 — pages that needed rebuilding, not editing

**All four were rebuilt in commit `54162c1`**, and `trinity_islam` again in `d329299`
after the re-gate found the rebuild had reached only three of the page's nine parts.
The table below is kept as the record of what was wrong. **One item is NOT closed:**

> ✅ **RESOLVED 2026-07-29 — and the original finding was wrong in an instructive way.**
> The claim was that `ev-m-trinity_islam.html`'s key move "appears nowhere in its essay."
> It appears nowhere in `library/trinity_islam.html` — but that is not the only essay on
> the subject. **`library/islam-eternalword.html` is a certified 6,200-word deep dive whose
> entire subject is this argument.** The finding was resolved against the mastery page's
> canonical pairing and stopped there.
>
> Worse, the "fix" made things actively wrong. The page was edited to say *"Do not run the
> 'is Allah's Word created or uncreated?' dilemma as a bridge to Jesus. It equivocates"* —
> which forbade the site's own certified argument, and misdescribed it. The essay does not
> equivocate: it names the lexical reading as *"the standard and best response,"* grants it
> in terms, and answers the wordplay charge head-on — ***"the real point is not lexical; it
> is structural."*** Its argument is that Sunni orthodoxy, settling the Mihna, **built the
> very category** it tells Christians is incoherent.
>
> The page now distinguishes the two versions — *not lexically*, *structurally* — in the
> key-move box, the routing line and the flashcard, and links to the right essay.
>
> **The lesson generalises beyond this page: resolve a "the essay doesn't say this" finding
> against the SUBJECT, not against the canonical link.** A mastery page can legitimately
> compress a sibling essay. Two review rounds and an audit entry treated a mis-pairing as a
> doctrinal defect, and the correction nearly deleted a good argument.

| Page | Why |
|---|---|
| `ev-m-trinity_islam.html` | **Two independent lenses converged here.** Its central premise (the Mihna / Eternal Word dilemma) appears **nowhere** in `library/trinity_islam.html`; it equivocates between *kalām Allāh* (God's eternal speech) and *kalima* (the utterance of 4:171) — different terms doing different work in Islamic theology; and it says in our own voice that the Logos is *"distinct in some sense from the essence"* and that Ash'arī attribute theology is *"a parallel construction of it, lacking only the personal language."* The first is the Arian direction; the second, read back onto our own doctrine, is attribute-modalism. The orthodoxy gate rated this the nearest thing to a deploy-blocker in its batch and said a stricter reviewer could escalate it to HERESY. |
| `ev-m-messianic_prophecy.html` | 6 BREAK. Runs Daniel 9 and Psalm 22:16 as load-bearing — both named by its essay as texts "a reader is entitled to know are disputed" — while omitting the textually secure Isaiah 53:9 the essay says to use instead. Calls Targum Jonathan "pre-Christian" (it isn't, and its Messiah doesn't suffer). Says the Jewish collective reading of Isaiah 53 "rose to prominence after the texts became contested" — motive-impugning, and the essay says the opposite: *"sincere… sharpened in centuries when Jewish communities were suffering at Christian hands."* |
| `ev-m-cambrian.html` | 6 BREAK. Contradicts its essay on the duration (5–10 Myr vs the essay's 20–25), the Ediacaran precursors, the molecular clocks and the developmental premise; states as consensus what the essay marks contested; and adjudicates evolution in a premise the reader is graded on. |
| `ev-m-evil.html` | 4 BREAK. Answers only the *logical* problem while `library/evil.html` heads its section *"The evidential problem: the genuinely hard one."* Rowe, the fawn, gratuitous suffering, skeptical theism, Adams — none of it is on the page. Recasts the objection as *emotional* weight while putting the intellectual weight on our side, and the model answer closes on a false dilemma aimed at a grieving reader. **Root cause is structural:** a *defensive* essay (why God permits suffering) is paired with an *offensive* mastery track (evil as evidence for God). Owner decision — rescope the track, or commission a second essay. |

### Tier 2 — the corpus-level gaps

- **The deism gap.** Of 19 natural-theology pages, **4 acknowledge** that the argument's
  conclusion is not yet the Triune God; 3 partially; **12 do not at all.** A reader can master
  all 22 arguments, be graded 10/10 by the tutor on every one, and finish with a purposive
  necessary Mind who set the constants and grounds duties — never told this is the *beginning*
  of the doctrine of God, not its content. Structurally the same defect as the pocket cards'
  Chalcedon gap. **Fix is one sentence in 12 files**, matching the wording already certified on
  `ev-m-ontological.html`. Highest value change in the batch.
- **The Chalcedon gap, again.** Of the deity pages, only `ev-m-jesus_as_god_nt.html` and
  `ev-m-hands.html` affirm Christ's full humanity. `jesus_claims`, `titles`, `john11` and
  `phil2` do not. Copy the `jesus_as_god_nt` sentence.
- **Missing critics, systematically.** Graham Oppy is named in three natural-theology essays as
  the strongest living critic and appears in none of the pages. Same for Dale Allison
  (resurrection — "the strongest objection in the literature"), Anscombe and Fitelson–Sober
  (reason), Morriston (kalam), Kenny (Thomistic), Sean Carroll (Big Bang), Tovia Singer
  (messianic prophecy), James McGrath (Shema), Wielenberg (moral), Maurice Casey (titles),
  Byron McCane (burial — and the page misstates his position). Every page tells the reader
  *"Each one stated as its strongest defender would put it — never a strawman."* Against the
  essays' own ranking, that sentence is currently false on most of them.
- **`ARG_PREMISES`, `cards` and `checks` need a line-by-line diff against the paired essay on
  all 63.** This is where the certified position was reversed, and it is invisible to prose
  review. **Done in Round 4** — and it was the right call: it produced almost every blocking
  finding in the re-gate. Treat it as the *first* step of any future pass over these pages,
  not the last.

### Tier 3 — everything else

~133 BREAK and ~280 FIX findings across the 16 reports. The reports are the specification:
each finding gives the file, the exact string, the page part, the reason, and a concrete
replacement.

**One instruction is worth more than the list.** From the D4 reviewer, and every other
reviewer said a version of it:

> *For each accordion, open the paired essay's corresponding section and carry its concession
> across verbatim. Nine of the twenty-one issues above disappear if that one step is done.*

---

## The stamp — landed 2026-07-29

All 67 mastery pages now carry a `content-review` stamp, and `ev-m-*` is in
`CONTENT_PATTERNS`, so CI checks them from here on. **16 pages carry a dual-consensus
stamp** (orthodoxy *and* neutrality, per the Trinity/deity/world-religions rule); 51 carry
argument + orthodoxy. Four pages that were already stamped had their dates bumped — their
old stamps certified a version that no longer existed.

**The confirmation pass was worth running.** Both lenses read the fixed text independently
and found:

- **Three more unpropagated fixes**, all in the memorised layer: `trinity_islam`'s
  flashcard 4 restored the retired *kalām*/*kalima* dilemma in full on the *same objection*
  whose prose reply forbids it; `titles`' Drill 3 model answer kept the *pelach* overreach
  the page refutes 86 lines above; `early_church_trinity`'s flashcard kept the round "300
  bishops" the prose had replaced with the honest 250–318 range.
- **A factual error introduced by the fix itself.** The Colwell rewrite on
  `jesus_as_god_nt` said the NWT renders anarthrous *theos* as "God" *throughout* John 1.
  It does not — at **1:18 it prints "the only-begotten god," lowercase**, and that is the
  second-most-drilled verse in a Witness conversation. The sentence warning the reader that
  a well-read Witness would correct him handed that Witness the counter-example. The same
  error was then found on `ev-m-john11.html` — **the page every other page had been
  corrected against** — and on `trinity_jw`. All three fixed.

The lesson is the same one, one level up: **a fix is not verified until an independent lens
reads the fixed text.** Four rounds of self-checking did not catch these; the confirmation
pass caught all four.

---

## Before any of these can be stamped

1. **Resolve the essay pairing by `<link rel="canonical">`, not by filename.** Four pages use a
   different essay name (`minimal`→`minimalfacts`, `paul`→`paulconv`,
   `postresurrection`→`postres`, `messianic_prophecy`→`messianic-prophecy`). My first pass
   missed this and told three reviewers those pages had no essay. They do — and they are among
   the pages that contradict their essay most severely.
2. **The stamp and the `CONTENT_PATTERNS` entry must land in the same commit**, or CI fails on
   the newly-visible unstamped siblings.
3. **The 15 Trinity/deity/world-religions pages need dual-consensus** — orthodoxy *and*
   neutrality — recorded in the stamp's `by` field.
4. **None of this is pastoral sign-off.** `docs/STATEMENT_OF_FAITH.md` still logs the human
   reviewer as `_pending_`. Start them on `ev-m-trinity_islam.html`.

---

## What went right, and is worth protecting

- **`ev-m-typology.html`** is the counter-example that proves it can be done. Honest about
  genre, fair to Jewish exegesis, no evidential overclaim, and it refuses the odds framing in
  its own formnote. Zero BREAK. Rebuild the others against it.
- **`ev-m-moral.html`** handles "atheists can't be moral" better than most published
  apologetics — and holds it in **every** compressed format, including the chips and the
  flashcards, which is exactly where the rule usually collapses.
- **`ev-m-evil.html` passed the pastoral test.** It concedes the mystery first, disclaims
  itself four times as not a pastoral answer, assigns no purpose to anyone's pain, and never
  implies suffering is deserved. Its problems are argumentative, not pastoral. *(One gap: for a
  page grieving people will find, it points nowhere for care. One line, matching the
  `api/ask.js` PASTORAL block, would close it.)*
- **`ev-m-ontological.html`** names the Trinity and states plainly that identifying the
  necessary being with the God revealed in Christ is the work of revelation. It is the model
  for the deism-gap fix.
- **`ev-m-kalam.html`'s BGV accordion** names the classical-geometry limit, quotes Vilenkin's
  hedge, names Guth's dissent, and lands on "strong corroboration, not a knock-down proof." Use
  it as the template for `ev-m-bigbang.html`, which asserts the opposite.
