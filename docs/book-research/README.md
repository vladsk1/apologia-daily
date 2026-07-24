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
1. Read each page carefully. If a photo is too blurry to read a citation cleanly, **say so and ask
   for a re-shot** — never guess a source, date, or page number.
2. Build one note per book at `docs/book-research/<slug>.md`, mirroring the Geisler–Turek note:
   a short header (title/author/copyright line + usage rules), the book's thesis/spine, a
   chapter-by-chapter map (thesis → argument beats in our own words → **primary-source leads to
   verify**), a per-chapter "Guardrail fit" note, a Capture-status table, and a cross-map to our
   Evidence Library tabs/essays.
3. Keep a running **Capture-status** table so a later session can resume mid-book.
4. The agents are already wired to find this folder (see the `docs/book-research/` section of
   `CLAUDE.md` and the pointers in `apologia-author.md` / `apologia-evidence.md`) — no extra wiring
   needed per book.
5. Deploy per the repo rule: commit the note and **fast-forward push to `main`** (never
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

**See [`INDEX.md`](INDEX.md) for the topical index** — it routes a topic → the right note + section + the
strongest primaries, and is the file a content session should consult first.
