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
| Minimal-facts method (skeptic-conceded data only) | `habermas-minimal-facts-two-texts.md` §Argument map 1,3–4,7 | 1 Cor 15:1–8, 11; concessions: Michael Martin, E. P. Sanders (*Historical Figure of Jesus*), Dale Allison, Ehrman, H. C. Kee; cross-check `book-research/case-for-the-resurrection-of-jesus.md` |
| Ancient historiography / source-distance & Gospel genre | `habermas-minimal-facts-two-texts.md` §Argument map 2 | Alexander (Arrian/Plutarch ~+400); Tiberius (Tacitus/Suetonius ~+80, Cassius Dio ~+180); **Richard Burridge, *What Are the Gospels?*** — *note: source-DISTANCE, NOT the retired manuscript-count* |
| 1 Cor 15 creed dating — archaeological anchor | `habermas-minimal-facts-two-texts.md` §Argument map 4 | **Gallio / Delphi inscription** (Paul at Corinth ~51–52 AD) *(net-new lead, not yet on-site)*; 1 Cor 11:23; Gal 1:18–19 (*historeō*) |
| The Islamic Dilemma (Qur'an affirms → contradicts the Bible) | `frost-islamic-dilemma.md` §Argument map | Q 3:3; 5:46–48; 5:68; **10:94**; 4:157; 6:115; the *muṣaddiq* verses — *all already certified in `library/islam-dilemma.html`; live via the new `islamic-dilemma` brief* |
| Tahrif / did Muslims allege the Bible was corrupted? | `frost-islamic-dilemma.md` §Guardrails + Q&A | Q 2:79→2:80 (vs Genesis Rabbah); *tahrif al-maʿnā* vs *al-naṣṣ*; al-Tabari, al-Razi, **Whittingham (De Gruyter 2020)**, Ibn Hazm; early witness **George of Bʿeltan** |
| Is Muhammad prophesied in the Bible? (proof-text rebuttals) | `muhammad-in-the-bible-prophet-dilemma.md` §Argument map 3–9 | Deut 18:15,18 ("brothers"=Israelites; Origen/Vulgate); Isa 42 (Servant=Israel, Kedar); Song of Songs 5:16 (*maḥmad*); Isa 21:7 (Babylon); Dan 2:44; John 16:7 — *all vs Q 7:157; certified home: `answers/does-the-bible-predict-muhammad.html`* |
| Daniel 2 statue ≠ Islam | `muhammad-in-the-bible-prophet-dilemma.md` §Argument map 9 | Dan 2:44 ("in the days of those kings"); *olam*=permanent (**Sacha Stern**); **Buster & Walton**, **N. T. Wright** — *⚠ note's toxic tone; verify + pipeline before use* |
| Was the Qur'an perfectly preserved? (textual transmission) | `avery-gio-quran-textual-preservation.md` §Argument map | Bukhari 4986/4987 (Abu Bakr→Uthman, burning), 4944 (Ibn Masud Q 92:3); Sahih Muslim 1452 (Aisha suckling verse) + Abu Musa's lost surahs; *sabʿa aḥruf* — *core already certified in `library/islam-preservation.html` + live brief `quran-preservation`* |
| Resurrection — cause of death (crucifixion, medical) | `habermas-mcdowell-on-the-resurrection-interview.md` §Fact 1 | **Baylor Univ. Medical Center Proceedings** 34:6 (2021) article (Habermas/Shaw/**Kopel** — asphyxiation); D. F. Strauss's swoon-theory critique; Roman spear/ankle-breaking sources — *→ `library/was-jesus-dead.html`* |
| Resurrection — the bodily-resurrection word study | `habermas-mcdowell-on-the-resurrection-interview.md` §bodily | *anastasis/egeirō*; Phil 3:21 (*sōma* not *pneuma*); N. T. Wright *Resurrection of the Son of God*; **John Granger Cook** — *→ `library/respred.html` (already the backbone)* |
| Naturalistic theories of the resurrection (refutations) | `habermas-mcdowell-alternate-theories-interview.md` §Argument map | swoon (Strauss; Quintilian), stolen body (Reimarus), wrong tomb (Kirsopp Lake), copycat (Mettinger, J. Z. Smith, Pannenberg), hallucination (Lüdemann; Flew) — *all already in the live `resurrection-*` + `pagan-myths-copycat` briefs* |
| Hume / can history study miracles? (meta-critique) | `habermas-mcdowell-alternate-theories-interview.md` §meta-critiques | Hume *Enquiry* §10 (circular-definition critique); CS Lewis; a-priori objection vs rejection — *possible net-new essay topic; not currently on-site* |
| Early creeds — dating + the deity of the earliest layer | `habermas-childers-early-creeds.md` §Argument map | 1 Cor 15:3–7 (Lüdemann, **Pinchas Lapid**); Rom 10:9/10:13→Joel; Phil 2→Isa 45; 1 Cor 8:6 (Shema); Mark 14:61–64 + Dan 7 — *all already in note #1 + certified essays/briefs; leads: **Lapid**, **Vernon Neufeld**, the Habermas/Shaw Cullmann reprint* |
| The Nicene Creed — phrase-by-phrase (history + theology) | `ortlund-nicene-creed-commentary.md` §Argument map | Arius / Nicaea 325 → Constantinople 381; homoousios (vs homoiousios); Athanasius *De Decretis*; Justin *1 Apol.* 6; Ortiz&Keating (Baker 2024), Phillip Cary (Lexham 2023) — *→ candidate NEW `library/nicene-creed.html`* |
| The filioque (East–West) — report NEUTRALLY | `ortlund-nicene-creed-commentary.md` §Filioque | not in the 381 creed; Toledo (Spain); Maximus *Letter to Marinus* ("through the Son"); Turretin (not grounds for schism) — *⚠ denominational-neutrality guardrail: present both, adjudicate neither* |
| The Holy Spirit's deity (381) | `ortlund-nicene-creed-commentary.md` §Holy Spirit | Pneumatomachi ("Macedonians"); Gregory of Nazianzus; **Basil, *On the Holy Spirit*** (~375); "Lord and giver of life" (2 Cor 3; John 6:63) — *→ `library/holy_spirit.html`* |
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
