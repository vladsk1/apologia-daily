# Video-research — topical index (consult this BEFORE drafting; sibling of `book-research/INDEX.md`)

**Purpose.** This folder holds in-our-own-words maps of *copyrighted apologetics videos* (lectures,
debates, talks). This index is the **"what's the best source for this topic?"** router for a content
session: topic → the note(s) + section + the strongest **already-identified primary sources** to cite.

**Workflow for any content session (essay, `ev-s*` card, `/answers/*`):** before drafting on one of these
topics, `Grep`/`Read` the mapped note, take the *argument shape + the primaries to cite*, then quote the
**primaries** (verified) — never the transcript. Consult this **alongside** `book-research/INDEX.md` and
the `/sources` corpus and use whichever has the best material for the topic (the notes will say when a
book or a PD source covers it better).

**Hard rules (see `README.md`):** every citation in these notes is an **unverified lead** (transcripts
mishear names/dates/numbers) until confirmed against the primary and run through
`apologia-citations → apologia-argument → apologia-orthodoxy`. Transcript text never enters `/sources` or a
live answer. The live `api/ask.js` endpoint does **not** read this folder (it can't — not deployed/served,
and these are unverified leads). A video reaches a *live* answer only through the two gated doors any
research lead uses: (1) lead → verify the primary → `/sources` as `verified:true` (verbatim quotes), or
(2) lead → verified primaries → a **certified essay** → a gated **`/briefs`** entry the live AI weighs as
optional our-own-words framing. Never a raw "video brief," never attributed to the video.

## Topic → note routing
_(Add a row per note as the library grows. Template kept at bottom.)_

| Topic | Note → section | Strongest primaries to chase (all unverified until the pipeline confirms) |
|---|---|---|
| Early creed / pre-NT tradition dating | `habermas-early-high-christology.md` §Argument map 1–3 | 1 Cor 15:1–7; 1 Cor 11:23–26; Gal 1:18–19 & 2:1–2; Acts 1–5, 10, 13, 17; Josephus *Ant.* 20 (James, ~62 AD) |
| Deity of Christ in the earliest sources ("Early High Christology") | `habermas-early-high-christology.md` §5 | Phil 2:6–11 + **Isa 45:23**; Rom 10:9,13 + **Joel 2:32**; **1 Cor 16:22 (maranatha)**; Mark 14:61–64 + Dan 7:13–14; Rom 9:5 |
| The Sanhedrin trial as a blasphemy/deity scene | `habermas-early-high-christology.md` §5(ii) | Mark 14:61–64; Dan 7:13–14; Ps 110:1; **lead: Darrell Bock, *Blasphemy and Exaltation in Judaism*** |
| Resurrection timeline / "everything within ~5–6 years of the cross" | `habermas-six-facts-before-36ad.md` §Argument map | 1 Cor 15:3–7; **Gal 1:18–19 (*historeō*)**; Gal 2:2, 2:9; 1 Cor 15:11; Acts 9; Rom 10:9; Rom 1:3–4 — *note: all already live in `earlycreed`/`paulconv`/`minimalfacts`* |
| Paul as early + eyewitness (the fact-finding Jerusalem visit) | `habermas-six-facts-before-36ad.md` §Set 3 | **Gal 1:18–19** (*historeō* = "visit to inquire"); 1 Cor 15:8–11; cross-check `book-research/case-for-the-resurrection-of-jesus.md` |
| James the brother of Jesus: sceptic → believer → martyr | `habermas-six-facts-before-36ad.md` §Set 1 | 1 Cor 15:7; Mark 3:21/6:3; John 7:5; Acts 1:14; Josephus *Ant.* 20.200; *(minor: Gospel of the Hebrews fragment via Jerome)* |
| _template: Topic_ | _`note.md` §N_ | _primary A; primary B; cross-check `book-research` X_ |

## ⚠ Standing "do not use / high-caution" flags (carry these into any pull)
- **Apologetics YouTube overstates.** Popular talks round numbers up, compress scholarship, and drop
  the honest concessions our guardrails require. Hold every pull to the `CLAUDE.md` argument-specific
  rules (Kalam "begins to exist"; fine-tuning *data* conceded / *design* the contested inference;
  resurrection leads with the early creed; morality = duties-need-a-ground; "orthodoxy outranks charity").
- **Never cite the video.** If a talk is the *only* place a claim appears, it isn't verified — find the
  primary or drop it.
- **Debate clips especially** compress the opponent unfairly — re-steelman the other side from its own
  best sources before we answer it (1 Peter 3:15 + the neutrality gate).
