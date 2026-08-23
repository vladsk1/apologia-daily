# Book-research notes — how to add a book (incl. from phone photos)

This folder holds **in-our-own-words research maps of owned copyrighted apologetics books** — the
argument structure plus an index of the **primary sources** the book cites (Scripture, Church
Fathers, named scholars, dates) to chase down and quote *from the primaries*. See the completed
`i-dont-have-enough-faith-to-be-an-atheist.md` (Geisler & Turek) as the **format template**.

> **If you're a new session (phone or desktop) and the user says they're uploading book photos:**
> read this file, then follow the workflow below. This is the same process that produced the
> Geisler–Turek note.

## The hard copyright rules (never bend these)
- **Owned books only.** The user must own the physical/Kindle copy they're photographing. Do **not**
  use subscription services whose terms forbid automated extraction (e.g. **Perlego** — its Terms
  prohibit "scraping… or any similar software" and "mass, automated, or systematic extractions";
  don't drive its reader). Photos of a book the user owns are fine.
- **Never reproduce the book's prose.** Capture the argument's *shape* and its *citations* in **our
  own words**. No stored excerpts, no long quotations of the book. The note is a *map that points at
  quotable primaries*, not a copy of the book.
- **Nothing is quotable until verified.** Treat **every** citation in these notes as **unverified**
  until it's confirmed against the **primary source** and run through the normal pipeline
  (`apologia-citations` → `apologia-argument` → `apologia-orthodoxy`). The note is a *lead*, not a
  source. Copyrighted books never go into `/sources` (that corpus is public-domain verbatim only).
- **Stay inside the guardrails** in `CLAUDE.md` (classical/Nicene orthodoxy, denominational
  neutrality, the argument-specific rules, "orthodoxy outranks charity"). Flag popular-level
  overstatement for our own calibration.

## What the user does (photo guidance)
- Photograph pages of a book **they own**, straight-on and flat, good light, **no glare**, whole page
  in frame, text **legible** — especially **footnotes / endnotes / bibliography**, where the real
  primary-source leads live.
- **~5–10 photos per message** (small batches read far more accurately than big dumps).
- Go in **reading order**, and with each batch say the **book title + author** and roughly **which
  chapter/pages** these are.
- Send both the **argument pages** and the **notes/bibliography pages** — the citations are the point.

## What the session (Claude) does

> ### ⭐ STEP ZERO — READ THE PAIRED ESSAY(S) IN FULL, BEFORE OPENING THE SOURCE. (Mandatory, 2026-08-06.)
>
> Before mining a single page, work out which certified `library/*.html` essay(s) this source is the
> counterpart of — usually 1, at most about 5; use the topic router in `INDEX.md` — and **read each one
> start to finish.** Not `Grep`. Not headings and a snippet either side of a hit. **Read it.**
>
> **The order is the whole point.** Reading the essay *afterwards* means you search it for whatever the
> source made you look for, and "we already cover this" becomes a guess. Reading it *first* means you
> already hold the argument, its concessions, and its deliberate refusals in mind, so mismatches surface
> on contact — before you have formed an impression from the source.
>
> **Searching is the safety net, not the method.** Use it at the end to confirm that what you believe is
> missing really is missing across every served surface — not to decide what is missing.
>
> **This is cheap.** The 85 essays have a median of ~5,200 words; most books pair with 1–3 of them, so
> step zero is normally under 20,000 words against a whole book of mining.
>
> **Record it in the note** — a "Paired essays read in full" line naming each essay — so a later reader
> can see the step happened, exactly as the cross-check classification must be visible (step 4).
>
> **Why this rule exists.** Two failures, one shape. (a) `CLAUDE.md` records four reviewers independently
> concluding of the 67 mastery pages that *"these pages were written without reading the essays"* — that is
> this same failure, one stage downstream. (b) On 2026-08-06 a `Lemaître` search returned **zero hits** in
> `library/bigbang.html` and was nearly filed as a gap; he appears **eight times** and opens the essay — the
> file stores him as `Lema&icirc;tre`. A search pattern cannot see what it cannot spell. Reading can.
>
> ⚠ **AND READ THE RESEARCH NOTE COVER TO COVER TOO. (Added 2026-08-08, owner-directed.)** Not its
> headings, not its cross-map, not the sections a search surfaced — **the whole file, top to bottom.**
> The section list you must walk is only as complete as your reading of it, and a heading tells you a
> section exists without telling you what it claims. Two failures in one run came straight out of
> skimming a note: a pass classified a book's leads and never noticed its six appendices existed as a
> checklist, and another note turned out to contain a **retired claim** sitting quietly in a chapter map
> nobody had read closely.
>
> ⚠⚠ **NEVER WRITE "READ IN FULL" UNLESS YOU READ IT IN FULL.** A note once recorded two essays as
> "read in full" when a quarter of each had been read. The verdicts survived the full read — which is
> luck, not method. **A verdict that turns out right is not the same as a verdict that was grounded when
> it was made.** Same discipline as a `content-review` stamp: never stamp a check you did not run. If
> you read part of it, say which part.

1. Read each page carefully. If a photo is too blurry to read a citation cleanly, **say so and ask
   for a re-shot** — never guess a source, date, or page number.
2. Build one note per book at `docs/book-research/<slug>.md`, mirroring the Geisler–Turek note:
   a short header (title/author/copyright line + usage rules), the book's thesis/spine, a
   chapter-by-chapter map (thesis → argument beats in our own words → **primary-source leads to
   verify**), a per-chapter "Guardrail fit" note, a Capture-status table, and a cross-map to our
   Evidence Library tabs/essays.
3. Keep a running **Capture-status** table so a later session can resume mid-book.
> ### ⭐⭐ THE CHECK IS A QUALITY COMPARISON, NOT A COVERAGE CHECK. (2026-08-06.)
> "Does our site mention this?" is only one question. Every lead **and every section of the source** gets one
> of six verdicts — three of which are about *quality*, not presence:
> **1. Corroboration** (we say it, accurately, and at least as well) · **2. ⚠ Error in ours** (P1 correction) ·
> **3. ⚠ Weaker in ours** — we make the point but the source makes it **better**: clearer, better ordered,
> better evidenced, more persuasive, or answering an objection we leave open → **a row to improve the WORDING**,
> not merely to add content · **4. Missing from ours** · **5. ✅ Hazard — ours is better** (flag it, so nobody
> "improves" us backwards) · **6. Non-recommendation** (a real gap we deliberately leave, with the reason).
>
> **Verdict 3 is the one that keeps getting skipped and is often the most valuable** — a search can only answer
> "present or absent"; whether the source argues something *better than we do* is visible only by reading both.
>
> **STANDING OUTPUT — the note MUST answer this explicitly every time, even when the answer is "no":**
> **"Is the source better than our essay anywhere? Where, and how?"** Nobody should have to ask.
>
> Full statement: `CLAUDE.md` § *Content backlog* → the six-verdict table.

4. **Cross-check every lead against our CURRENT live content (mandatory — the point of the library).**
   Mining a book is **not finished when the note is written.** For each substantive lead, `Grep`/`Read`
   the on-site home for that topic — the certified `library/*.html` essay, the matching `/answers/*`, the
   `ev-s*` card, and any live `/briefs` or `/sources` entry — and classify it: **corroboration** (already
   covered accurately + current → no action) or **improvement** (corrects an error / updates stale info /
   strengthens with a new verified primary / opens a topic or objection we lack → log a row in
   [`docs/content-backlog.md`](../content-backlog.md), the release map, with the target page + priority).
   Make the classification **visible in the note** (in its cross-map / "Live-door status") so a reader can
   see the scan happened. See the "MANDATORY CROSS-CHECK STEP" in `CLAUDE.md` § *Content backlog*.
   (Corroboration-only leads don't get a backlog row — but the note must still show the comparison was made.)
5. The agents are already wired to find this folder (see the `docs/book-research/` section of
   `CLAUDE.md` and the pointers in `apologia-author.md` / `apologia-evidence.md`) — no extra wiring
   needed per book.
6. Deploy per the repo rule: commit the note and **fast-forward push to `main`** (never
   `git checkout main`).

## Current notes
- `i-dont-have-enough-faith-to-be-an-atheist.md` — Geisler & Turek (**complete**): cosmological /
  teleological / moral arguments, NT reliability, resurrection, deity of Christ, miracles, and the
  anti-skepticism (logic / Hume / Kant) material. Its header carries its own usage rules + a couple
  of citation-precision flags.
- `body-of-proof.md` — Jeremiah J. Johnston, *Body of Proof* (**complete**; Intro + Chs. 1, 3–12 +
  the full Notes/endnotes pp. 163–172 captured — Ch. 2 body pp. 33–42 and the copyright page are the
  only intentionally-deferred gaps): the resurrection — the 7 reasons, the 1 Cor 15 early creed
  (Dunn 855 / Habermas 153), the empty-tomb/burial archaeology (honorable-vs-wretched burial, Magness),
  skeptic conversions (Paul/James, the Flew close via Baggett-ed. IVP 2009), resurrection-vs-resuscitation,
  the suffering/hope chapter, and the Gospel-of-Peter / ancient-critics apparatus (Vaganay/Henderson/
  Evans/Keener/Bowersock + Contra Celsum/Porphyry). **Watch its popular-level overstatement, and note
  two hard flags: Ch. 4's Islam-slavery material is Bill-Warner/CSPI-sourced → DO NOT USE; Ch. 7 has no
  endnotes (its demographic claims have no citation trail).**
- `did-jesus-really-say-he-was-god.md` — Mikel Del Rosario, *Did Jesus Really Say He Was God?*
  (**complete map**): a historical-Jesus / deity-of-Christ argument built **from Mark, weighing the
  enemies' reaction** — the two blasphemy scenes (Mark 2 forgive-on-earth / Mark 14 judge-from-heaven),
  the ten data points + five best-explanation criteria, and the critics (Hägerland/Ehrman/Casey/Kirk).
  Built from the already-gated reading behind the live reading-club demo; distinct from that demo.
- `in-defense-of-the-bible.md` — Steven B. Cowan & Terry L. Wilder, eds., *In Defense of the Bible*
  (B&H Academic, 2013) — **four chapters captured, all COMPLETE.** (1) **ch. 6, Daniel B. Wallace,** "Has
  the New Testament Text Been Hopelessly Corrupted?" (pp. 140–163, 51 footnotes): NT textual reliability —
  the two ditches, ~400,000-variants-because-of-manuscript-riches, the four-category viability/meaningfulness
  taxonomy (meaningful-AND-viable variants <1%), no cardinal doctrine on a disputed variant. (2) **ch. 10,
  Paul W. Barnett,** "Is the New Testament Historically Reliable?" (pp. 223–265, 93 footnotes): historical
  reliability as **eight theses** — early texts (Papias/Bauckham), NT vs. the Roman Caesars, hostile
  witnesses (Josephus/Tacitus/Pliny), archaeology, the Acts matrix, answering objections (1 Cor 15 creed +
  miracle chart), Spirit-guided authorship/canon. (3) **ch. 11, Douglas S. Huffman,** "Are There
  Contradictions in the Bible?" (pp. 267–293, 75 footnotes): the harmonization method — three cautionary
  principles (Selection≠Denial, etc.) applied to the resurrection narratives (8-segment coordination;
  Wenham's *Easter Enigma*). (4) **ch. 16, Wegner/Wilder/Bock,** "Do We Have the Right Canon?" (pp. 393–428,
  98 footnotes): OT canon, NT canon (criteria of canonicity), and the extrabiblical/"lost" gospels (Da Vinci
  Code / Ehrman refutation). **Only these four chapters of the multi-author volume are captured.** Feeds
  Biblical Reliability (`ev-s4`), Resurrection (`ev-s2`), extra-biblical Jesus (`hist_jesus`), canon
  (`library/canon.html`). **Flags:** popular-level overstatement throughout; **ch. 10** — do NOT reproduce
  the full Testimonium Flavianum (neutral core only), census/Quirinius is contested, Star-of-Bethlehem
  astronomy is speculative, reframe the Qur'an lines; **ch. 11** — keep the "possible solution / mystery"
  humility, don't overclaim; **ch. 16 (biggest flag)** — the **OT-canon/Apocrypha scope is denominationally
  sensitive**, use shared-tradition parts only and never assert "the Apocrypha is not Scripture" in our own
  voice.
- `case-for-the-resurrection-of-jesus.md` — Gary R. Habermas & Michael R. Licona, *The Case for the
  Resurrection of Jesus* (Kregel, 2004) — **mapped pp. 23–150 (the full positive + defensive case) + the
  complete A–Z bibliography (pp. 335–345) + all 70 Chapter-3 numbered notes (pp. 256–279)**: the
  minimal-facts method, the "4+1" quintet, every naturalistic-theory refutation (Chs. 5–8), and
  page-precise citations for Facts 1–2 (the 1 Cor 15 creed-dating chain, the Ignatius=*Smyrnaeans* 3
  locus, the Bultmann/Lüdemann concession pin-cites, the Habermas survey). The only nice-to-have gap is
  the numbered notes for the *other* chapters (Ch. 4 begins p. 279). The flagship "minimal facts" book
  and our own "Further study" rec on the resurrection answers.

- `josephus-and-jesus.md` — T. C. Schmidt, *Josephus and Jesus: New Evidence for the One Called Christ*
  (Oxford University Press, 2025; **open access**, CC BY-NC-ND) — a rigorous academic monograph on the
  **Testimonium Flavianum** (*Antiquities* 18.63–64). Part 1 argues the TF has an **authentic Josephan core**
  whose original wording was **neutral/ambiguous** (from the patristic reception history, the Jerome/Syriac
  "*believed to be* the Christ" reading, and a stylometric analysis — 90 words/62 lexemes almost all
  characteristic of Josephus); Part 2 argues Josephus had **first-hand sources near Jesus' trial** ("first men
  *among us*" = personal acquaintance in Josephus's idiom; prime candidate **Ananus II**, who executed James
  [*Ant.* 20.200] and whose father Ananus I + brother-in-law Caiaphas tried Jesus). **⭐ Key for us:** the
  authentic TF *reports* the disciples' resurrection belief as **their claim** rather than affirming it — the
  ideal neutral-core reading; pair with the *Ant.* 20.200 James passage and Tacitus. Feeds `library/hist_jesus.html`
  (extra-biblical Jesus), Biblical Reliability (`ev-s4`), and the resurrection minimal-facts case (`ev-s2`).
  **Flags:** distinguish Schmidt's *novel* source-theses (the Ananus II identification etc. — "one scholar's
  case") from the mainstream authenticity claim; **never** write "Josephus attests the resurrection" (he
  reports the disciples' claim); *Toledot Yeshu* (App. 4) is late polemic; the six Appendices + the full
  ancient-source bibliography are an intentional nice-to-have deeper pass.

- `islamic-dilemma.md` — Christopher W. Frost, *The Islamic Dilemma* (2026; Kindle, **read cover-to-cover**) —
  the "Islamic Dilemma": the Qur'an affirms the Torah (Tawrat) & Gospel (Injil), *as the actual 7th-c. biblical
  texts*, are inspired and authoritative, yet contradicts them on core doctrines (crucifixion, deity of Christ,
  God as Father, Muhammad-in-the-Bible, holy war, God's love, heaven/hell, prophet stories) — so either the
  Qur'an is incoherent or denying it contradicts the Qur'an. Maps the full argument (Parts 1–4), the *taḥrīf
  maʿna* vs *lafẓ* distinction, the corruption verses (Q 2:79 etc.), the Qur'an's Syriac/apocryphal sources, the
  complete Qur'an Passage Index, and the full bibliography. **⚠ POPULAR ONLINE COUNTER-APOLOGETICS** (David Wood
  foreword) — its value is the **mainstream academics it routes to** (Reynolds, Sinai, Griffith, Whittingham,
  Nickel, Witztum) and the **Muslim scholars who concede its premise** (Saeed, Ayoub, Galadari, Accad); **cite
  those, never the polemics layer, and drop the triumphalism.** ⚠⚠⚠ **Highest-scrutiny Islam tier**
  (dual-consensus + explicit-verdict + false-common-ground); the **lexical "Word of God"/*kalimatullāh* bridge in
  it is RETIRED on our site** (`tools/retired-claims.json`) — use the **structural** framing of
  `library/islam-eternalword.html`. ⭐ **The spine is already LIVE + certified** (`library/islam-dilemma.html`
  names Frost's book), so the note is mostly corroboration; the genuine gaps (apocryphal-source plank; Nickel/
  Witztum/Griffith/Sinai; the Garima Gospels) are logged P3 in `docs/content-backlog.md`.

- `is-god-real.md` — Lee Strobel, *Is God Real? Exploring the Ultimate Question of Life* (**Zondervan, 2023**;
  ⚠ **PARTIAL — pp. 17–91 captured continuously from the owner's own copy, plus the complete
  Introduction/chs. 1–4 endnotes at pp. 229–243; ch. 5 onward not yet captured**). Strobel's interview format: **ch. 1 William Lane Craig** on the kalam (the three
  steps, the actual-infinite marbles, the quantum-vacuum reply, the personhood inferences),
  **ch. 2 Michael G. Strauss** on fine-tuning (parameters, habitability, the multiverse),
  **ch. 3 Stephen C. Meyer** on biological information, **ch. 4 Michael Licona** on the resurrection
  (the historian's three Rs and the five minimal facts; captured to p. 85). ⚠⚠ **THE HEADLINE IS THAT
  OUR OWN ESSAYS ARE BETTER:** most classified leads came back *verdict 5 — hazard, ours is more
  accurate*, because our essays name the live critics (Morriston, Oppy, Carroll, Guth, the McGrews,
  Sober, Allison, Carrier, Cavin) and this book does not. Mine it for **four** things only: the
  *"isn't God infinitely old?"* objection, **Lewis & Barnes's *A Fortunate Universe*** as the citation
  for "the data is conceded", **Hossenfelder** as a non-theist multiverse critic, and the **"why so
  much wasted space?"** reply. 🔴🔴🔴 **The one verdict pointing the other way: ch. 4 p. 72 runs a claim
  this site RETIRED** — the Son of Man as "the divine figure in Daniel 7:13–14… sovereign, eternal, and
  worshiped," which trips both `daniel7-figure-is-divine` and `pelach-only-to-God`, and which is the
  **second** book-note found carrying that phrase. 🔴 **Other hard do-not-use flags:** Hugh Ross's
  **concordism** (Isa 40:22 etc. as cosmic expansion) and his **322-parameters/10⁻³⁰⁴** figure; the
  **multiverse dismissed rather than steelmanned**; the **steady-state-had-no-evidence** history, which
  contradicts our certified `bigbang.html`; **Fazale Rana** and the **Francis Collins landmine** in
  ch. 3; and the **"modern-day Islamic terrorist"** comparison in ch. 4. ⚠ Three factual slips our
  essays already get right (Philoponus in the *fourth* century; the CMB at 3.7 K; Lemaître as merely
  "the Belgium astronomer"). 🔴🔴 **The copyright page confirms the interviews are RECYCLED** from *The Case for a Creator* and four
  other Strobel books and "edited for content, conciseness, and clarity" — so nothing here is verbatim,
  and a "recent years" claim in ch. 1 may be reporting cosmology as of **2004**. Date-check everything.
  ⭐ **And one methodological lesson recorded in the note itself:** a verdict
  written on a partial capture ("the book never raises god-of-the-gaps") turned out to be wrong once
  the rest of the chapter arrived, and is corrected in place rather than silently fixed.

- `the-air-we-breathe.md` — Glen Scrivener, *The Air We Breathe: How We All Came to Believe in Freedom,
  Kindness, Progress, and Equality* (**The Good Book Company, © 2022**, reprinted 2022/2023; ISBN
  9781784987497; Scripture = **NIV 2011**) — ⚠ **PARTIAL, from the owner's own copy: cover, copyright page,
  Introduction (pp. 11–21) and ch. 1 (pp. 23–39) captured with their footnotes; ch. 2 onward NOT captured,
  and the table of contents has not been photographed.** The thesis: seven modern values — equality,
  compassion, consent, enlightenment, science, freedom, progress — are a minority report in world history
  that reached us through the Jesus revolution, invisible because we are breathing them; and the seven
  standard *accusations* against Christianity are those seven values reversed. ⭐ **The spine is already LIVE
  and CERTIFIED** — `library/legacy.html` cites this book at fn 5 — so the note is largely corroboration.
  **Its value is the ancient-world half our essay is thinnest on:** the pagan origin myths (*Enuma Elish*,
  *Atrahasis* — humanity made from a murdered god's blood **to carry the gods' workload**, which is the
  anthropology imago Dei was carried *against*, and the batch's top find), the Ciceronian crucifixion-shame
  texts (*Pro Rabirio* 5.16; *Against Verres* 2.5.169–170), Pedanius Secundus (*Annals* 14.42–45 — 400 slaves
  crucified, argued for on **greater-good** grounds), the **Alexamenos graffito**, and ancient justice as the
  *enforcement* of inequality (Siedentop p. 51 — a page-precise quotation from a source we already cite).
  Also worth more than the book itself: **the scholarly reading list it routes to**, one book per value
  (Siedentop, Hurtado, Kyle Harper, Seb Falk, Hardin ed., David Brion Davis, Alec Ryrie). **8 backlog rows
  logged** (1 P2, 5 P3, 2 P4). 🔴🔴 **Hard do-not-use: the p. 30 epigraph attributes CALLICLES (*Gorgias*
  483c–d) to PLATO** — a view Socrates refutes — with a backwards date; and its "nobody in antiquity attacked
  slavery" line is **weaker than what our essay already says correctly**, so it is a hazard, not a gap.
  🔴 Also do-not-use: the HuffPost-sourced "more Christians in China than the US by 2030" projection.
  ⚠ Any port of "God himself hung on a cross" **must carry `legacy.html`'s `orthonote` fence**.

### ⚠ PARTIAL notes — books NOT owned, NOT read (added 2026-07-26, Tyndale/evangelical mining batch)
These four were queued as books by `docs/article-research/MINING-BRIEF-tyndale-batch.md`. Because we do
**not** own them, each is mapped only at **thesis/chapter level**, and only from legitimate non-book
sources: the author's own open-access articles, a published **open-access** review, publisher frontmatter,
and our own already-certified on-site citations. **Every page number in them is *reported*, not verified.**
Each carries a "**TO COMPLETE (human action)**" instruction — acquire a legitimate copy and map it
properly per the workflow above. **Perlego is forbidden.**
- `gathercole-preexistent-son-and-thomas.md` — Simon Gathercole, ***The Preexistent Son*** (Eerdmans,
  2006) + ***The Composition of the Gospel of Thomas*** (SNTSMS 151, CUP, 2012). ⭐ **The most valuable
  lead in the batch:** the Synoptic "I have come" sayings as evidence that Matthew, Mark and Luke already
  presuppose Christ's preexistence — a topic **entirely absent** from our deity essays. The argument is
  fully mined in the *article* library, from Gathercole's own open-access *TynBul* 75 (2024) restatement:
  [`article-research/gathercole-i-have-come-sayings.md`](../article-research/gathercole-i-have-come-sayings.md).
  ⚠⚠⚠ **The angelic parallel is to the FORM of the saying, never the NATURE of the speaker** —
  dual-consensus + a mandatory `orthonote`.
- `can-we-trust-the-gospels.md` — Peter J. Williams (Crossway, 2018). Chapter map from a published review;
  **almost entirely corroboration** — `library/names.html` already cites ch. 3 by name. One small lead
  (Luke's *limnē* vs. *thalassa*) and one PD `/sources` candidate (**Blunt, 1847**).
- `jesus-and-the-eyewitnesses.md` — Richard Bauckham (Eerdmans, 2006; 2nd ed. 2017). Chapter map from the
  **open-access *Themelios* review**. **Corroboration across the board** — the strongest "already covered"
  result in the batch. ⚠⚠⚠ **Carries the standing UNIVERSALISM FENCE:** mine the historiography only, cite
  him as a historian on a historical question, never as a theological authority.
- `on-the-reliability-of-the-old-testament.md` — K. A. Kitchen (Eerdmans, 2003). Thesis-level only;
  **corroboration** (his treaty-form argument is already live on `library/archaeology.html` with
  McConville's caution attached — the model for every Kitchen pull). ⚠⚠ Avowed maximalist; the
  **Nuzi/patriarchal-customs** material is a **trap, not a gap**. The genuinely free and *fully mined*
  Kitchen is
  [`article-research/kitchen-historical-method-hebrew-tradition.md`](../article-research/kitchen-historical-method-hebrew-tradition.md).

**See [`INDEX.md`](INDEX.md) for the topical index** — it routes a topic → the right note + section + the
strongest primaries, and is the file a content session should consult first.
