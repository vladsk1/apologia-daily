# Jesus tab — pastor's-eye audit, 2026-11-24

**What this is.** The owner asked for the Jesus tab (`ev-s3.html`, 26 cards) to be read as a pastor deciding
whether to hand it to his congregation: where would it trip up ordinary Christians, and where does it concede
too much to critical scholarship or to the case against Christianity? This file is the record of that read, so
the findings survive the session that produced them. It is the work queue behind `PEW-1 … PEW-8` in
`docs/content-backlog.md`. The rule it led to is `CLAUDE.md` → **READER-IN-THE-PEW RULE**.

**How it was done.** All 26 cards were read cover to cover, every tier: one by the session itself, 25 by five
independent read-only reviewers (Opus). About 45 of their quoted sentences were then checked to exist in the
text, and the full context of the 17 most serious was read. The ratings for those 25 cards are the reviewers';
the session checked the worst and agreed. Eight cards were re-read in full later the same day by the new
`apologia-pastor` lens (Fable) during the scholar-bench round. **Not checked:** the paired essays, the `ev-m-*`
mastery pages, the Macedonian and Spanish mirrors, and every other tab.

**Headline.** No doctrinal error on any card. The problem is weight and placement: too many caveats, in the
wrong tiers, with critical scholarship as the default frame and the wrong voices leading.

## Measured on the day (before any fix)

| Measure | Figure | How measured |
|---|---|---|
| Cards rated HAND IT OVER / WITH A WORD OF GUIDANCE / NOT YET | 4 / 16 / 6 | reviewers' ratings |
| "contested" / "debated" / "disputed" | 83 / 54 / 45 | grep over the stripped card text |
| "honest", "honesty", "honestly" | 157 | grep |
| Named defence v named dissent (+ hostile-witness uses) | 153 v 129 (+42) | `tools/check-scholar-balance.mjs`, first version |
| Share of named defence carried by Bauckham, Hurtado, Wright, Fee | 82% (38, 37, 29, 22) | same |
| Blomberg, Keener, Craig, Habermas, Licona, Köstenberger | 0 each (Bock, Carson, Wallace 2 each) | same |
| Cards naming more dissent than defence | 8 of 26 | same |
| Cards naming a dissenter in a plain tier | 7 (19 mentions) | same |

The counter matches surnames and is a coarse net; treat the figures as close, not exact.

## What was fixed the same day (the scholar-bench round)

Scope was frozen to one defect — named dissent outweighing named defence — on the eight cards
(`hist_jesus`, `john11`, `titles`, `virginbirth`, `typology`, `jesus-is-yahweh`, `christ-before-bethlehem`,
`jesus-messiah-claim`), plus the `hist_jesus` sentence "Concede the genuine debates at the edges", which the
owner raised by name. Four gate rounds; method and outcome are in the `ev-s3.html` review stamp. **Outcome,
counted honestly: seven of the eight now name at least as much defence as dissent. The eighth,
`arg-jesus-messiah-claim`, went from 1 named defence against 8 named dissent to 3 against 5** (Wright,
Dunn-against-Wrede, Bird; against them Wrede ×3, Fredriksen ×2 — the gap of 2 includes a heading that no
longer repeats her name) — improved, still short, and recorded as open debt in
`tools/scholar-balance-baseline.json` rather than passed. It could not be levelled without adding a name to
move the number: neither the card nor its essay yet carries another scholar who argues its thesis. That is
`PEW-1` + `PEW-3`. (An earlier draft of this round's count showed that card as level; the pastor lens caught
that the counter was leaving out its headline critic, Paula Fredriksen, and counting Ulrich Luz, who is cited
only for a distinction. Both were corrected.) Measured with the final registry, live site against the edited
file: named defence 171 → 174, named dissent 120 → 99, dissenters named in a plain tier 17 → 10, cards naming
more dissent than defence 6 → 1. (The first count of 8 such cards included two counting artefacts — `john11`,
where Ehrman agreeing with us was read as dissent, and `typology`, where Sandmel's caution is one the card
adopts.) **Everything below is still open.**

## The six NOT-YET cards (first in the queue)

**`arg-jesus_claims` — Did Jesus Claim to Be God?** The Case, Plainly is the best writing on the tab; the free tier is the problem.
- Free trilemma box: "the concession is real: if the divine self-understanding of Jesus is entirely a Johannine overlay, the trilemma does not survive as a proof." Jargon and an announced concession in the first words a reader meets. Answer at once from Mark (forgiving sins, the trial claim).
- Free Q&A "Wasn't Jesus wrong about the end of the world?": names Dale Allison and lists "the hardest texts" for the reader to look up. Lead with the answer; move the rest to the Deep Dive.
- Deep Dive, the tenants parable: "many read it as an allegory the church composed after the crucifixion, and some argue that the Gospel of Thomas's shorter version … is nearer the original". Nothing defends the parable. Defend it or cut it.
- Deep Dive and Research, the trial: "the historicity of Mark's night trial before the Sanhedrin is itself disputed". The Research tier ends on the doubt; the transmission-route answer exists in the Deep Dive and should travel with it.
- "The 'sincerely mistaken sage' is a live possibility".

**`arg-titles` — The Titles of Jesus.**
- Deep Dive: "If the scene is reported rather than composed" and "though critics argue the exchange itself is Mark's shaping" — our own voice leaves open that Mark composed the trial; the second is unanswered. (Inspiration-safe rule.)
- Deep Dive: "Ehrman and others dispute whether that hearing happened as Mark describes; the disciples had fled, and no follower is placed inside the chamber. The case does not stand or fall with it." No reason is given for trusting the scene; the essay has the same shape, so there is no certified sentence to port — route to `apologia-author` + citations.
- Free summary: "exactly why this counted as blasphemy is itself debated" (three times on the card); "however exactly they construed it".
- Explain scripts coach the limit: "Each title can be used in a weaker sense…"; "Any one of them a sceptic can soften, and a good one will". The same limit recurs about eight times.
- The Case, Plainly: "What it had become in Greek-speaking Judaism is more disputed than apologetic summaries usually admit." (three times); "Who the figure stands for in Daniel's own vision is genuinely debated…"; "as the weaker and more contested tie, 'I AM WHO I AM'".
- Research: McGrath's reading of 1 Corinthians 8:6 named twice with no reason given (the reason exists on `arg-jesus-is-yahweh`).
- The *pelach* parenthesis is opaque to a lay reader.

**`arg-daniel70` — Daniel's 70 Weeks.**
- Works from "Most critical scholars date Daniel to the 2nd century BC" in four places and never says who holds the traditional sixth-century date or why (Jesus calls him "Daniel the prophet", Matthew 24:15). "Even on the critics' date" is a good move; it needs the traditional view beside it.
- Says about ten times that the arithmetic is contested or not a proof; "invites the charge of rigging the dials, a charge that sometimes sticks"; closes "a suggestive strand, not a proof … to whisper — not shout — a name", undercutting its own strong claim that no other candidate answers the prophecy's whole shape.
- Unanswered asides: the weekday parenthesis about Anderson's count; "critics reply that the 'word to restore and rebuild Jerusalem' may be God's word through Jeremiah"; "Whether you read it through Onias III or through Jesus, the shape is the same".
- Free tier carries "Masoretic accent" jargon and implies the reader's NIV departs from the Hebrew; the answer ("The accent does not move the death") is three tiers away.

**`arg-virginbirth` — The Virgin Birth and Isaiah 7:14.** The most over-conceding card.
- "though in fairness that shared stream need not reach all the way back to the event itself" — three times, twice as a closing line, never answered.
- Research: "Matthew and Luke do not merely differ; in places they pull against each other … Proposed harmonizations exist … but they are reconstructions … and a fair reader should label them contested." A new objection conceded in our own voice. Send to `apologia-orthodoxy` too (Scripture).
- "Its absence from Paul and Mark is a real weight on the other side of the scale, and the honest reply does not make it vanish" — three times, an argument from silence the card itself answers.
- Fulfilment put as Matthew's impression: "Matthew hears Isaiah as scriptural resonance, not as the load-bearing proof"; "its full weight, Matthew came to believe, landed on a child named Immanuel". Matthew 1:22 says the Lord spoke it. For `apologia-orthodoxy`.
- The Case, Plainly: "It does not, by itself, mean 'virgin' the way a technical word would; Hebrew has a more specific term for that." The essay's footnote (Oswalt) has the fact that *'almah* is nowhere used of a married woman; it is not on the card.
- The "In conversation" script ends "they do not amount to proof."

**`arg-god-crucified` — God Crucified.** Doctrinally the most careful card and the most academic.
- The verdict, three times: "while philosophers still debate how fully the two-natures account succeeds, a formal contradiction has not been shown"; and "the charge of formal contradiction is contested, not obvious". Chalcedon defended only as "not disproved", when the card's own "a mystery is not a contradiction" is stronger.
- Research: "Bauckham's 'divine identity,' Hurtado's 'devotional pattern,' and McGrath's agency model are live, competing accounts of the same data" — the low-Christology model left standing as an equal. The same box says "three places" where the card has four witnesses.
- "Nothing here claims that the prophet Isaiah, writing centuries earlier, intended a cross" sits beside John 12:41, which the card cites.
- "One may judge Mark's framing to be theology rather than history"; "it should be presented as one strong reading, not a consensus" (reads like an editor's note).
- The sceptic's case (Hick's square circle, Auschwitz, Ivan Karamazov) is more vivid than the reply.

**`arg-jesus-messiah-claim` — Did Jesus Claim to Be the Messiah?** The gravest of the six.
- Free tier, three times on the card: "(The Nazareth reading of Isaiah 61 … is in this form Luke's alone, and taken by itself could be Luke's theology rather than Jesus' own words.)" An inspiration concession in the free tier.
- "How to explain this to someone": "though Matthew's version is more guarded and the historicity of the trial scene is disputed." The believer is coached to volunteer the doubt. Matthew's "You have said so" is an affirmative idiom.
- Our own voice: "Mark has certainly shaped the secrecy motif, and nothing here rests on any one command being historical"; "may owe something to the evangelist's telling"; "the language of 'My kingdom' and 'My table' is Luke's".
- Free: "The answer is yes, with a qualification that matters. … No one of these strands is decisive by itself, and each has been disputed."
- All four Research lines and the verdict close on "The honest limit"; the card's last sentence is a limit, not the verdict.
- "That is exactly why it is weak evidence of fulfilled prediction and strong evidence of a claim" (Matthew 21:4–5 calls it fulfilment). "On Mark's account" five times as a distancing frame.
- A serious Jewish objection (no ingathering, no temple, no peace) is answered in one clause with no Scripture.

## The sixteen "with a word of guidance" cards (most serious item each)

- `arg-hist_jesus` — Research: "The four Gospels were written between roughly AD 70 and 100", with Q as fact; the Josephus debate told four times; "thinner than some enthusiastic apologetics suggests".
- `arg-hands` — the reply to Ehrman is hedged five ways ("on the reading … influential, arguably dominant, and genuinely contested … on that reading, which we take to be the right one"); John 8:58 and 20:28 are never defended as history; the verdict box lists three critics.
- `arg-messianic_prophecy` — the "shaped narratives" objection is not actually answered for Bethlehem and ancestry; Psalm 22:16 "pierced" is given up in the free tier.
- `arg-isaiah53` — "the burial-fulfilment reading carries the heavier grammatical burden", about the card's own headline exhibit; the verdict box ends on caveats.
- `arg-john11` — "John's Gospel is the latest of the four, written perhaps sixty years after the crucifixion", uncontested; Proverbs 8, Arius's proof text, raised and waved away.
- `arg-phil2` — the headline claim is made conditional about six times on "if Paul is indeed quoting prior material"; the card never says that even as Paul's own words it predates every Gospel.
- `arg-multiatt` — never says the criteria set a floor of what sceptics must grant, not a ceiling on what the Gospels may be trusted for ("the rough shape of his life is recoverable"); Markan priority and Q as settled; the Tacitus and John hedges four times each; "The sinless Son of God undergoing a baptism of repentance is theologically embarrassing" with no pastoral answer.
- `arg-jesuschar` — the Legend reply ends "conditional on the sayings being substantially authentic" (twice); the family's verdict "stays on the critic's side of the scale"; Lewis's argument called a "moral nudge"; Luke 23:34 flagged "a textually disputed saying".
- `arg-respred` — the subtitle and verdict say Jesus foretold his vindication "in veiled terms" (Mark 8:32: "he said this plainly"); "the majority position in critical scholarship" twice; "one source carried forward, not three independent witnesses".
- `arg-humanity` — "The aged apostle John, or a writer close to him" in the free tier; "the letters to Timothy and Titus are the Pauline letters critical scholars most often question" after the free tier has used 1 Timothy 2:5 as Paul's.
- `arg-typology` — the apostles' own reading filed four times as a control that "carries weight chiefly for someone who already grants the apostles' authority"; "these patterns will understandably look like patterns you could draw anywhere" three times; "We are not claiming Moses secretly foresaw Calvary" (John 5:46).
- `arg-paul-divinity` — the capstone "Paul did" rests on a reading the card calls "genuinely contested" and never defends (the defence is on `arg-jesus-is-yahweh`); "Whatever happened on the Damascus road"; Colossians flagged as debated in The Case, Plainly; three scholars named there.
- `arg-worship-of-jesus` — McGrath's "sacrificial worship" rejoinder sits in The Case, Plainly, answered only by "in our judgment", although the card's own definition of the reserved worship lists sacrifice first; a section ends "The devotion is firm; the framing is disputed."
- `arg-jesus-is-yahweh` — the Shema caveat stands five times, including the free key-claims box ("arguably dominant (though contested)"); Move 1 opens by correcting fellow believers on *echad*; "not strictly independent sources" three times.
- `arg-christ-before-bethlehem` — Dunn and Ehrman named in The Case, Plainly; "grant that Colossians is disputed" three times; the Research verdict ends on *harpagmos*, a word explained nowhere on the card.
- `arg-nt-use-of-ot` — Research names Matthew's attribution of a Zechariah passage to Jeremiah as a "long-noted puzzle" and gives no answer; "some such cases remain genuinely contested, which honesty requires naming".

The four rated HAND IT OVER: `arg-jesus_as_god_nt`, `arg-earlycreed`, `arg-uniqueness`, `arg-crucified-messiah`
(small items only — e.g. the empty tomb called "the more disputed half of the case" four times on `uniqueness`;
"moral influence" listed among the orthodox accounts of the atonement on `crucified-messiah`).

## The critical-default frame (PEW-2)

| Critical default, used without "even granting…" and without the traditional view beside it | Cards |
|---|---|
| Gospels dated AD 70–100 | hist_jesus |
| Mark first, Matthew and Luke copying; "Q" | multiatt, hist_jesus, respred, jesuschar, jesus-messiah-claim |
| Daniel in the second century BC | daniel70 (four places) |
| Colossians doubtful | paul-divinity, christ-before-bethlehem |
| 1–2 Timothy and Titus doubtful | humanity |
| "John, or a writer close to him" | humanity (two places) |
| John late and not an eyewitness | john11 |

## What was fixed 2026-11-25 (PEW-2, the critical-default frame)

Scope frozen to the table above. 13 cards in `ev-s3.html`, mirrored to Macedonian and Spanish in the same change.

| Critical default | What the cards say now |
|---|---|
| Gospels dated AD 70–100 | "on the standard dating", with the pre-70 dating of Robinson and Hemer named beside it as "a respected minority position"; the point holds "on either dating" (`hist_jesus`, Research) |
| Mark first | "the earliest Gospel" cut where the date does no work (four places); elsewhere "the Gospel most scholars date earliest" (five places) |
| Matthew and Luke copying Mark | framed "on the dominant 'Two-Source' hypothesis" (`multiatt` ×2, `respred` ×2) |
| Daniel in the second century BC | free tier states the traditional sixth-century date first; Deep Dive says it "is still defended", gives the grounds, and adds how Jesus received the book (Matthew 24:15); "even a second-century-BC author" |
| Colossians doubtful | said once per card in the Deep Dive as "even granting", with Douglas J. Moo named as a defender; cut from two plain tiers and two Research boxes |
| Pastorals doubtful | "A word of candor" replaced by "even granting that doubt for the sake of argument", with the defence stated in the same sentence |
| "John, or a writer close to him" | cut from both plain tiers ("John's first letter draws…") |
| John late and not an eyewitness | NOT fixed — the added sentence broke its paragraph and was withdrawn (PEW-9 item 2) |

Gate: two rounds, five lenses each (citations, argument, orthodoxy, neutrality, pastor), read-only, file hashed before and after. Round 1 failed four of five lenses; every cut passed and nearly every finding was on a sentence that had been added. Round 2, which mostly withdrew those additions, passed all five. The pastor lens's answer to "did the change make this card worse?" was no on all 13. Counter after the round: defenders 177, dissent 99, hedges 171 (was 176 / 99 / 172). What the round left is `docs/content-backlog.md` PEW-9.

## What was fixed 2026-11-25 (PEW-1, the six NOT-YET cards)

Scope frozen to the findings above and same-kind defects on the same six cards. English first, mirrored to Macedonian and Spanish in the same change.

| Card | 24 Nov | Now | What changed |
|---|---|---|---|
| `arg-jesus_claims` | NOT YET | with a word of guidance | The announced concession and the "Johannine overlay" jargon are out of the free box, answered from Mark; Allison and his answer moved to the Deep Dive; the tenants parable now has a named defender (Snodgrass) and ends on its point; McGrath's reading is answered; the verdict box no longer says Paul "sets Jesus alongside the one God". |
| `arg-titles` | NOT YET | with a word of guidance | "If the scene is reported rather than composed" and "critics argue the exchange is Mark's shaping" are gone; Ehrman's doubt about the hearing has its answer; the blasphemy, *kyrios*, Daniel-figure and weaker-sense caveats are each said once, in the Deep Dive, with the answer; the *pelach* parenthesis is three plain sentences; the verdict box ends on the confession. |
| `arg-daniel70` | NOT YET | with a word of guidance | 25 repeats of "contested / not a proof" cut (hedge density 3.5 → 1.6 per 1,000 words); the Masoretic-accent jargon is out of the free tier; three tiers that ended on doubt now end on the claim. The day-count limit is still stated plainly (Deep Dive, verdict paragraph, verdict box). Four cuts were REVERSED by the gate, one of them because the famous equation is two days out. |
| `arg-virginbirth` | NOT YET | with a word of guidance | All three copies of "though in fairness that shared stream need not reach all the way back to the event itself" are gone; "pull against each other", "a fair reader should label them contested" and "each elaborated in its own way" are gone; "Matthew came to believe" and four "Matthew hears Isaiah as resonance" frames are gone; the *betulah* point is answered from the essay; the verdict box ends "the virgin birth is true". |
| `arg-god-crucified` | NOT YET | with a word of guidance | "While philosophers still debate…" is said once instead of five times and no longer is the verdict; "live, competing accounts", "One may judge Mark's framing to be theology rather than history" and the editor's-note sentences are gone; two defenders of the classical view (Gavrilyuk, Weinandy) stand beside Hick and Moltmann. No fence or person/nature sentence was touched. |
| `arg-jesus-messiah-claim` | NOT YET | with a word of guidance | "Could be Luke's theology rather than Jesus' own words" is gone from all three places; "Mark has certainly shaped the secrecy motif", "may owe something to the evangelist's telling" and "the language … is Luke's" are gone; the explain script no longer coaches a doubt; "yes, with a qualification that matters" is "yes"; every tier and the verdict box end on the confession. **Still in bench debt (3 named for, 5 against) — not fixed.** |

Gate: two rounds. Round 1 (nine read-only reviewers: argument, orthodoxy, neutrality and pastor each split across two groups of three cards, plus citations) found no heresy, no retired claim restored and no fence broken, and failed the change on one citation ERROR, one orthodoxy DRIFT (a pre-existing sentence a new port contradicted) and a list of WEAKs. Round 2 (one merged pass of 35 edits — restores, cuts, moves and verbatim ports) passed all five lenses: orthodoxy CERTIFIED CLEAN, citations STAMPABLE, argument STAMPABLE, neutrality STAMPABLE, pastor "no card is NOT YET". Three further cut/restore edits were applied afterwards on wording the lenses supplied. Measured: 117 edits in round 1, of which four were reversed in full and one in part in round 2; tab hedges 171 → 138; defenders 176, dissent 95.

What the trimming got wrong, so the next card does not repeat it: (1) **a cut can remove the only flag on a claim that is false** — the Daniel day-count sentence "From March 14, 445 BC to April 6, AD 32 = 173,880 days" lost its "disputed" clause, and the citations and neutrality lenses each computed the interval independently as 173,882 days (the clause is back, and now sits directly after the equation; before, it trailed the next sentence); (2) **a cut can strand the half it leaves** — an answer cut in one tier left its question standing in another (the Matthew "more oblique" parenthesis; the trial doubt without its reason); (3) **a port needs its premise** — the 1 Corinthians 8:6 answer leaned on "an anti-idolatry argument" that only its original card had stated; (4) the three sentences this session added itself were, again, the ones sent back.
What the round left: `docs/content-backlog.md` PEW-10.

## What should stay

Retiring the probability figures and the *echad* argument; "even on the critics' date, Daniel predates Jesus"
(once the traditional view is stated beside it); the hostile-witness bench on `hist_jesus`; the three typology
controls and the "coherence, not probability" guardrail, said once; every `orthonote` fence; the Nicene and
Chalcedonian verdict sentences; the "In conversation" one-liners; and the free summaries, which are nearly
hedge-free. The Case, Plainly tiers are consistently the best writing on the site.
