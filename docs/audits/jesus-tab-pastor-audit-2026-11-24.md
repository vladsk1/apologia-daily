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

## What was fixed 2026-11-26 (PEW-3 batch A: six of the "word of guidance" cards)

Third stage of the owner's order (critics' framing → the six weakest cards → the rest of the tab), first of three batches. Scope frozen to the eight defect kinds of the READER-IN-THE-PEW RULE. English first, mirrored to Macedonian and Spanish in the same change. All six were already rated "hand it over with a word of guidance" and still are; the pastor lens rates each one better than what was live.

| Card | Net edits | What changed |
|---|---|---|
| `arg-hands` | 5 | The reply to Ehrman no longer waves at "the reading … that is influential, arguably dominant, and genuinely contested": it carries the four-sentence 1 Corinthians 8:6 answer from `arg-john11`, with McGrath named once and answered. The critic list is out of the verdict box; a limit paragraph is out of The Case, Plainly; two bare "itself debated" flags are gone. |
| `arg-messianic_prophecy` | 13 | Psalm 22:16 ("they pierced") and its caveat are out of the free tier; the three plain-tier copies of "sung centuries before crucifixion was a Roman practice" are cut; the objection that the evangelists wrote the details in is answered from the essay (Tacitus, Josephus, Deuteronomy 21:23, 1 Corinthians 1:23); "or an author could stage" is gone from our own voice; The Case, Plainly no longer closes on a list of doubts; two limit paragraphs are out of the verdict box. Hedge density 2.6 → 2.1 per 1,000 words. |
| `arg-multiatt` | 13 | The Tacitus caveat is said once instead of four times, with the essay's "either way" answer; the explain scripts no longer open on "that is not independent attestation; it is copying"; the Meier caveat is said once; The Case, Plainly no longer ends by listing three doubts; "a baptism for sins" (which can read as if Christ had sins) is replaced by the essay's "Jesus' submission to John's baptism of repentance". The John "debated" flag went from four copies to two. |
| `arg-jesuschar` | 10 | Lewis's point is no longer called "a moral nudge, not a proof"; the reply to the Legend objection no longer ends on a "conditional" limit; the repeated Ehrman block is out of the Research verdict box (he is stated once, in the Deep Dive, and answered); "the Jerusalem church of the 30s" now reads as the essay does, "the earliest Aramaic-speaking churches"; "The debate is live, but it is not evenly balanced" is gone (a concession and an overclaim in one clause). |
| `arg-respred` | 9 | "In veiled terms" is out of the subtitle and verdict (Mark 8:32: "he said this plainly"); the after-the-fact objection is stated once instead of five times; the Two-Source note is said once, with the creed point beside it; the verdict box now ends on the verdict. |
| `arg-typology` | 26 | The control-(1) caveat is said once instead of four times, with the essay's answer; "We are not claiming Moses foresaw Calvary" is gone (it sat against John 5:46); the explain script now carries the Emmaus sentence (Luke 24:27) and no longer tells the believer what the argument does not prove; The Case, Plainly ends on John 1:29. The floor stays: typology is not a stand-alone probability proof (Deep Dive, verdict box). |

Gate: two rounds. Round 1 (67 edits; nine read-only reviewers — argument, orthodoxy, neutrality and pastor each split across two groups of three cards, plus citations): orthodoxy CERTIFIED CLEAN, argument and citations STAMPABLE, pastor "hand it over with a word of guidance" on all six, neutrality STAMPABLE on five cards and NOT STAMPABLE on `messianic_prophecy` until two free-tier cuts landed. Round 2 (one merged pass of 17 edits — four of them reversals of round-1 edits, the rest cuts and verbatim ports): all five lenses pass, 17 of 17 confirmed by orthodoxy, citations, argument and neutrality; the pastor lens confirmed 14 outright and passed the other three with non-blocking notes. No third pass was made; what the lenses listed is PEW-11. Measured: 76 net edits against the live text (hands 5, messianic_prophecy 13, multiatt 13, jesuschar 10, respred 9, typology 26); tab hedges 138 → 128; defenders 176 → 174; dissent 95 → 93.

What the trimming got wrong this time (four round-1 edits reversed): (1) **the same shape as the Daniel day-count, again** — cutting Psalm 22:16 and its caveat from the free tier left two sentences beside it still claiming the psalm describes a crucifixion, and cutting the same verse from the Research tier left that tier's "a crucifixion described" and "the secure details" with nothing behind them; (2) **a moved note took its "here" with it** — the Isaiah 53:9 parenthesis, moved into a paragraph about Psalm 22:16, read as a note on the wrong verse; (3) **a flag was kept where it bore no load and cut where it did** — John's independence was flagged on a list of five streams and unflagged on the one example that rests on Mark and John alone; (4) **a cut can leave a cold opener** — removing the first sentence of the multiatt explain script left it opening on a restriction ("The criterion only does work where…").

## What was fixed 2026-11-27 (PEW-3 batch B: six more "word of guidance" cards, and Psalm 22)

Second of three batches of the rest of the tab, plus the one P1 item batch A logged and did not fix. Scope frozen to the eight defect kinds of the READER-IN-THE-PEW RULE. English first, mirrored to Macedonian and Spanish in the same change (the `nt-use-of-ot` card does not exist in either mirror). All seven cards are rated "hand it over with a word of guidance" by the pastor lens, each better than what was live.

| Card | Places changed | What changed |
|---|---|---|
| `arg-messianic_prophecy` | 11 | **The card no longer says Psalm 22 describes a crucifixion, in any tier** (the psalm's one crucifixion-specific verse, 22:16, is textually contested, and the essay's own gate retired the claim on 2026-10-09). It says what the essay says: the cry on Jesus' lips, the mockery, the thirst, the garments and lots, written centuries before, with the manner of death resting on Isaiah 53:9. The 22:16 caveat stands once, in the Deep Dive. The Isaiah 53:9 "contrast or parallel" note left The Case, Plainly for Research. "No broken bones" now has its verse. |
| `arg-hist_jesus` | 5 | "Thinner than some enthusiastic apologetics suggests" is gone from both places; The Case, Plainly no longer ends on three doubts, one of which the card never answered; "Q" is "the hypothetical sayings source"; the Deep Dive answer on Josephus rests on the James notice. The Testimonium caveat stays three times (the free tier itself asks "couldn't these be forgeries?"). |
| `arg-john11` | 4 | "Perhaps sixty years after the crucifixion" is gone (twice); Proverbs 8, "the text Arius built on", now has its answer ("The New Testament nowhere cites Proverbs 8:22 to teach that the Son was created…"); the conversation script lost a conditional; a second "genuinely contested" in one paragraph is gone. |
| `arg-phil2` | 8 | "If Paul is indeed quoting prior material" and its variants went from about twelve copies to three (free tier, Deep Dive, Research); the Deep Dive copy is now answered from the essay (Fee: Paul everywhere assumes pre-existence; 2 Corinthians 8:9; "even if the hymn were set aside entirely…"); The Case, Plainly no longer ends by volunteering three doubts; a bare, repeated dissent is out of Research. |
| `arg-isaiah53` | 5 | The Isaiah 53:9 "contrast or synonym" caveat stands twice instead of four times; the verdict box no longer ends on a paragraph of caveats; "No single line is a mathematical proof" is out of The Case, Plainly; the conversation script no longer coaches a caveat. |
| `arg-humanity` | 4 | The Case, Plainly no longer ends by raising the "promoted to divinity" objection and sending the reader away with it (it is stated in full and answered in the Deep Dive); the Romans 8:3 grammar note is out of the plain tier; "the Jerusalem church of the 30s" reads "the earliest Aramaic-speaking churches". |
| `arg-nt-use-of-ot` | 4 | Matthew 27:9 is no longer a bare "puzzle" (it is "usually explained by scroll-naming convention or a composite citation"); the Septuagint limit now comes before its answer; the conversation script no longer says "Then be honest: … it doesn't by itself prove Jesus". |

Gate: two rounds. Round 1 (48 edits; nine read-only reviewers): orthodoxy CERTIFIED CLEAN on all seven cards; citations STAMPABLE; argument STAMPABLE on six and NOT STAMPABLE on `phil2` until one port; neutrality STAMPABLE on five with one WEAK each on `hist_jesus` and `phil2`, and NOT STAMPABLE on `isaiah53` for one WEAK; pastor "hand it over with a word of guidance" on all seven. Round 2 (one merged pass of 7 edits — cuts, one restore, verbatim ports): all five lenses pass, 7 of 7 confirmed by each. No third pass; what the lenses listed is PEW-12. Measured: 41 places changed against the previous text; tab hedges 128 → 120; defenders 174 → 172; dissent 93 → 92.

What was different this time. (1) **The session declined six planner edits before any reviewer saw them**, each for the reason the gate had reversed cuts in the two earlier batches — a flag would have gone while its claim stayed, or an answer while its question stayed. Every lens that addressed them agreed, and the neutrality lens said of one that it "would have been a BREAK" had it gone through. No round-1 cut was reversed. (2) **The round-1 findings were about what was added or left exposed, not about what was cut:** a ported passage carried without its lead-in and its example (`phil2`); a scholar ported in as a witness under a sentence asserting the opposite of his published view (`phil2`: Fee holds Paul composed the passage); a clause that only made sense beside two readings a cut had removed (`hist_jesus`); a true statement that became a half-truth once its qualifier went (`isaiah53`: the Targum names the Servant Messiah — and keeps the suffering off him). (3) **When two lenses offer different sentences for the same gap, check each against the third lens before choosing** — the sentence two lenses offered for the Psalm 22 Research line was one the third had flagged as stated flat where the essay attributes it.

## What was fixed 2026-11-27 (PEW-3 batch C: the last eight cards)

Third and last batch of the rest of the tab. With it, every one of the 26 Jesus-tab cards has been through the reader-in-the-pew pass. Scope frozen to the eight defect kinds of the READER-IN-THE-PEW RULE. English first, mirrored to Macedonian and Spanish in the same change. Pastor lens, after round 2: "hand it over" on `jesus_as_god_nt`, `earlycreed`, `uniqueness` and `crucified-messiah`; "hand it over with a word of guidance" on `paul-divinity`, `worship-of-jesus`, `christ-before-bethlehem` and `jesus-is-yahweh` (which was NOT YET in round 1 for one sentence in the free tier).

| Card | Places changed | What changed |
|---|---|---|
| `arg-paul-divinity` | 5 | The audit's finding — the card's capstone, 1 Corinthians 8:6, rested on a reading the card itself called "genuinely contested" and never defended — is closed: the Deep Dive now carries the certified answer already on the sibling cards (the "alongside" reading, in an argument against idolatry, yields a second divine power, which is what it set out to avoid). The flag and James F. McGrath's name left The Case, Plainly, which keeps its scope words ("Taken as Bauckham and many others take it"); the "itself debated" sentence naming Hurtado and McGrath left the plain tier; "Whatever happened on the Damascus road," is gone from both places. |
| `arg-worship-of-jesus` | 6 | McGrath's "sacrificial worship" rejoinder, which sat in The Case, Plainly answered only by "in our judgment", stands once, in the Deep Dive; Move 7 no longer ends "The devotion is firm; the framing is disputed."; a bare named dissent is out of the Research verdict box; "the Jerusalem church of the 30s" reads "the earliest Aramaic-speaking churches", and "in Jerusalem in the 30s" is cut from two more tiers. |
| `arg-jesus-is-yahweh` | 4 | The free key-claims box reads "Not a second god added; on the influential reading, Jesus is placed within the one God, not beside it." (was "on the influential, arguably dominant (though contested) reading"), and lost its note about the earliest Greek copies; The Case, Plainly no longer opens "One honesty up front, because popular apologetics most often overreaches here"; the Shema caveat is no longer repeated in the Deep Dive's closing limit; a Research row repeating "not strictly independent sources" for the third time, with an editor's aside, is cut. |
| `arg-christ-before-bethlehem` | 3 | Dunn is no longer named in The Case, Plainly (his objection stays there, unnamed, and is answered in the next move; his name and book are in the Deep Dive); the verdict box reads "This does not, by itself, prove full deity." and no longer ends on *harpagmos*, a word the card never explains. |
| `arg-jesus_as_god_nt` | 3 | The Case, Plainly no longer ends by listing three doubts; the Deep Dive on 1 Corinthians 8:6 used to name McGrath's reading and assert ours with no reason ("we take that reading to be the right one") — it now gives the reason, in the certified wording of the `titles` card; "arguably dominant" is gone; a Research item no longer ends on the dissent. |
| `arg-earlycreed` | 3 | "The claim of an Aramaic original is contested" stood three times and now stands once, in the Deep Dive with its answer; The Case, Plainly ends on its verdict ("…bodily raised from the dead, as this creed confesses."), not on a paragraph of doubts placed after it; the Research "Semitic fingerprint" item is cut. |
| `arg-uniqueness` | 5 | "The empty tomb is the more disputed half of the case" went from four copies to two; The Case, Plainly ends on its verdict; the verdict box no longer says "does not prove" in two adjacent rows; Mettinger carries the label his ledger row asks for ("arguing against the prevailing view"). |
| `arg-crucified-messiah` | 2 | The verdict box no longer ends on an "honest limit" row repeating two limits stated above it; in the list of orthodox accounts of the atonement, "moral influence" reads, as in the essay, "the transforming power of self-giving love". |

Gate: two rounds. Round 1 (31 edits, 26 of them cuts; nine read-only reviewers): orthodoxy CERTIFIED CLEAN on all eight cards; citations STAMPABLE; argument STAMPABLE on all eight; neutrality STAMPABLE on seven and NOT STAMPABLE on `earlycreed` for one WEAK; pastor "hand it over" on four, "with a word of guidance" on three, NOT YET on `jesus-is-yahweh`. Round 2 (one merged pass of 4 edits — three cuts and one verbatim port with a moved sentence): all five lenses pass, 4 of 4 confirmed by each. No third pass; what the lenses listed is PEW-13. Measured: 31 places changed against the previous text; tab hedges 120 → 100; plain-tier dissent 10 → 2; dissent named 92 → 81; defenders named 172 → 167 (cuts removed some of each; nobody was added).

What was different this time. (1) **Between "cut the flag" and "keep the flag" there is a third course: keep the attribution, cut the doubt-words.** The session declined the planner's cut of the Shema flag from the `jesus-is-yahweh` free box (the sentence left behind asserts the contested reading), and left the item untouched. The pastor lens then blocked on it. Two lenses offered the same cut — ", arguably dominant (though contested)" — which leaves "on the influential reading": the claim is still marked as a reading, the doubt is gone from the free tier, and "arguably dominant", which the neutrality lens could not verify, goes with it. The pastor lens counted what remained as an attribution, not a hedge. (2) **One round-1 cut left its claim standing, and the session's own check missed it.** The Aramaic caveat was cut from the Research "Semitic fingerprint" item on `earlycreed`; the item then stood as evidence that Paul is quoting, while the card's plain tier says the name does not prove that. The fix was to cut the item too: caveat and claim go together. (3) **A port that does not fit in one sibling's wording may fit in another's.** The round-1 planner declined to port the certified answer onto `jesus_as_god_nt` because the `john11` wording presupposes "the creed", which this card never mentions; the `titles` card has the same certified passage opening "The Jewish Shema, Israel's bedrock monotheistic creed…", which supplies the premise. (4) **When two lenses split on a move, leave it and log it** — done twice here (`earlycreed` Move two; the `crucified-messiah` verdict box).

## What should stay

Retiring the probability figures and the *echad* argument; "even on the critics' date, Daniel predates Jesus"
(once the traditional view is stated beside it); the hostile-witness bench on `hist_jesus`; the three typology
controls and the "coherence, not probability" guardrail, said once; every `orthonote` fence; the Nicene and
Chalcedonian verdict sentences; the "In conversation" one-liners; and the free summaries, which are nearly
hedge-free. The Case, Plainly tiers are consistently the best writing on the site.
