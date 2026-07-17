# Book-research — topical index (consult this BEFORE drafting any resurrection / deity / apologetics content)

**Purpose.** This folder holds in-our-own-words maps of *owned copyrighted* apologetics books. This
index routes a topic → the note(s) + section + the strongest **already-identified primary sources** to
cite. **Workflow for any content session (essay, `ev-s*` card, `/answers/*`):** before drafting on one of
these topics, `Grep`/`Read` the mapped note, take the *argument shape + the primaries to cite*, then quote
the **primaries** (verified), never the book's prose.

**Hard rules (see `README.md`):** every citation in these notes is an **unverified lead** until confirmed
against the primary and run through `apologia-citations → apologia-argument → apologia-orthodoxy`.
Copyrighted-book text never enters `/sources` or a live answer. The live `api/ask.js` endpoint does **not**
read this folder (it can't — not deployed/served, and these are unverified leads); the only path from
these books to a *live* answer is: lead → verify the primary → add it to `/sources` as `verified:true`.

Notes: **CFR** = `case-for-the-resurrection-of-jesus.md` (Habermas & Licona) · **BOP** = `body-of-proof.md`
(Johnston) · **IDHEF** = `i-dont-have-enough-faith-to-be-an-atheist.md` (Geisler & Turek) · **DJRS** =
`did-jesus-really-say-he-was-god.md` (Del Rosario).

| Topic | Note → section | Strongest primaries to chase (all still unverified until the pipeline confirms) |
|---|---|---|
| **Minimal-facts method** | CFR Part 2 intro; BOP | the two criteria (strongly-evidenced + granted by ~all critical scholars); Habermas survey (CFR n70) |
| **1 Cor 15:3–7 creed + "~2–5 yrs" dating** | **CFR Ch. 3 n23–25** (the dating chain); BOP; IDHEF | Kloppenborg, *CBQ* 40 (1978): 351–67; W.L. Craig, *Assessing the NT Evidence* (1989), 1–6; Gal 1:18–19; *historēsai* |
| **Empty tomb** | CFR Ch. 4 Fact 5; BOP | Jerusalem factor; enemy attestation (Matt 28:12–13; Justin *Dial.* 108; Tertullian *De Spect.* 30); women-witness embarrassment; Wand, *Christianity: A Historical Religion?* (1972); Magness (burial archaeology, BOP) |
| **Death of Jesus / swoon (medical)** | CFR Ch. 5 (swoon) + Ch. 3 n3–11 | **JAMA 1986** (Edwards, Gabel & Hosmer, *JAMA* 255.11: 1455–63); Strauss, *A New Life of Jesus* (1879); Hengel, *Crucifixion*; Sloyan |
| **Extra-biblical crucifixion witnesses** | CFR Ch. 3 n4–12 (Fact 1) | Josephus (Feldman Loeb); Tacitus *Annals* 15.44; Lucian *Peregrinus* 11–13; Mara Bar-Serapion (BM Syriac 14,658); Talmud *Sanhedrin* 43a; Crossan, *Jesus: A Revolutionary Biography*, 145 |
| **Disciples' transformation & martyrdom** | CFR Fact 2 + Ch. 3 n33–70 | 1 Clement 5:2–7; **Ignatius, *Smyrnaeans* 3:2 & 3:4** (n48–49 — the pinned locus for "handle me"/"despised death"); Polycarp *Phil.* ⚠ **NOT** the Hippolytus/Foxe apostle-fates lists (CFR n59/n63 flags them legendary) — keep martyrdom-precision (Peter, Paul, James-of-Jesus, James-of-John only) |
| **Paul's conversion** | CFR Fact 3; BOP | Gal 1:13–24 (esp. 1:23); Acts 9/22/26; Reginald Fuller (necessity of an appearance) |
| **James's conversion** | CFR Fact 4 | Mark 3:21/6:3; John 7:5; 1 Cor 15:7; **Josephus *Ant.* 20** (authentic passage — NOT the disputed Testimonium); ⚠ James Ossuary is authenticity-disputed — don't lean on it |
| **Hallucination / vision theories** | CFR Ch. 6; BOP | 1 Cor 15:5–7 group appearances; Lüdemann, *What Really Happened to Jesus?* (1995), 80 (CFR n68); illusion/delusion/hallucination distinctions |
| **Legend / "copycat" pagan myths** | CFR Ch. 5 (copycat) | Metzger, *Historical & Literary Studies* (1968); Remus (1983); Wagner, *Pauline Baptism and the Pagan Mysteries*; Philostratus, *Life of Apollonius*; Rodinson, *Muhammad*. ⚠ Cross-check our recalibrated `/answers` **pagan-myths** page |
| **Extra-biblical Jesus (Josephus/Tacitus)** | CFR Ch. 3 n42/n53; IDHEF | Van Voorst, *Jesus Outside the NT* (2000); the Testimonium = disputed/partly-interpolated → use only the neutral core / the *Ant.* 20 James passage (matches our `hist_jesus`/`ev-s3` recalibration) |
| **Deity of Christ** | **DJRS** (from Mark, via the enemies' reaction); IDHEF | Mark 2 (forgive-on-earth) / Mark 14 (judge-from-heaven) blasphemy scenes; ten data points + five best-explanation criteria |
| **Naturalism / miracles / "science" objections** | CFR Ch. 8 | Behe, *Darwin's Black Box* (the elephant); Swinburne, "Violation of a Law of Nature," in *Miracles* (1989); Hume, *Enquiry*; Yamauchi (rival-religion miracles). ⚠ fine-tuning/ID: *data* conceded, *design* is the contested inference — never "science proves design" |
| **Kalam / fine-tuning / moral argument / NT reliability** | **IDHEF** (Geisler & Turek — the broad-apologetics map) | per that note's chapter map; hold the argument-specific rules (Kalam "begins to exist"; fine-tuning data-vs-design; moral duties-need-a-ground) |
| **Suffering / hope** | BOP (the suffering chapter) | concede the mystery first; Plantinga is a *defense*, not a proof |

## ⚠ Standing "do not use / high-caution" flags (carry these into any pull)
- **BOP Ch. 4 Islam-slavery material** is Bill-Warner/CSPI-sourced → **DO NOT USE.**
- **BOP Ch. 7** has no endnotes → its demographic claims have **no citation trail**; don't cite.
- **CFR NDE section (pp. 146–147)** — the book's most contestable leg; keep it OFF the minimal-facts case,
  and note **A.J. Ayer did not convert** (don't cite him as an afterlife witness).
- **CFR p. 131 fine-tuning "1:10²⁵"** figure is unsourced in the body → verify before any use.
- **CFR p. 148 "Muslim must reject… Muhammad a deceiver"** line → neutrality gate; state Islam's actual
  reason (Qur'an 4:157) accurately, never as a swipe.
- General: **popular-level overstatement** in BOP/CFR — hold every pull to the `CLAUDE.md` argument rules.

_Regenerate/expand this table when a note is added or materially updated._
