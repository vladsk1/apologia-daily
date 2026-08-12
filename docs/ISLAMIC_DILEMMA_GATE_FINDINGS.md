# Gate findings — the Islamic Dilemma reading club (2026-08-11/12)

**Scope of this file.** This is the *findings and dispositions* record: what each lens found, what
was done about it, and why. It is written to the same shape as
[`ETERNAL_GENERATION_GATE_FINDINGS.md`](ETERNAL_GENERATION_GATE_FINDINGS.md).

⚠ **It is NOT a byte-level changelog and does not claim to be.** The authoritative record of what
changed is `git diff` on `claude/islamic-dilemma-reading-club-536nq0` (6 commits, 12 files,
**104 content edits** — 50 in round 1, 24 in round 2, 21 in round 3, 8 in round 4, 1 in round 5;
counts measured 2026-08-12 by tallying the applied edit lists, not estimated). The page's own `content-review` stamp carries the
round-by-round account. This file exists because the *reasons* would otherwise live only in a
session that is about to end.

**File:** `reading-club-islamic-dilemma.html` (was `demo/frost-islamic-dilemma-companion-study.html`)
**Subject:** Christopher W. Frost, *The Islamic Dilemma* (2026). Research map:
[`book-research/islamic-dilemma.md`](book-research/islamic-dilemma.md).
**Tier:** highest scrutiny — Islam + deity of Christ, dual consensus required.

---

## Why the page needed gating at all

Built 2026-08-03 and checked by `apologia-citations` (CLEAN across ~40 references) plus
**`apologia-evidence` standing in** for the other three lenses. The stamp recorded the position
plainly: the dedicated `apologia-orthodoxy`, `apologia-neutrality` and `apologia-argument` gates
*"are NOT registered in this session, so they have NOT run"*, and were owed *"before this is sent to
the author or made public."*

So one general-purpose reviewer had read it once and called it clean; three specialist adversarial
lenses had never seen it. The author then gave permission to publish, which made the debt due.

| Lens | Round 1 | Round 2 | Round 3 |
|---|---|---|---|
| `apologia-argument` | 5 BREAK · 12 WEAK | 4 BREAK · 9 WEAK | **0 BREAK — SOUND** |
| `apologia-orthodoxy` | 4 DRIFT · 6 NOTE | 4 DRIFT · 5 NOTE | 1 DRIFT · 4 NOTE |
| `apologia-neutrality` | 5 BREAK · 13 CONCERN | 5 BREAK · 6 WEAK | 2 BREAK · 3 WEAK |

**0 HERESY in every round.** Rounds 4 and 5 followed; the page was **CERTIFIED on 2026-08-12** with dual consensus — `apologia-orthodoxy` STAMPABLE (0 heresy, 0 drift, 1 note) and `apologia-neutrality` STAMPABLE, unconditional.

⚠ **Round 4's orthodoxy blocker was NOT one of the fix-pass edits** — it was pre-existing text that survived rounds 1–3 precisely because those rounds were reading what had changed. Session 9's *"it explains why a Muslim need not become a Jew or a Christian"* pull-quotes, on a page read aloud, as granting strength to religious indifferentism. **The identical clause is still live on the certified essay `library/islam-dilemma.html:176`** — backlog P2.

⚠⚠ **THREE PROVENANCE CLAIMS WRITTEN INTO EARLIER STAMPS AND BRIEFS WERE DISPROVED BY GREP.** A hadith reported as de-quoted that was not (there were two, and only one had been caught); an "all ports, nothing authored" claim falsified by a sentence taken from a gate's *suggested* wording; and a source line cited as `:176` that was a `:174`+`:176` splice, alongside a paragraph reported as ending on a port whose closing sentence was authored. **Never stamp a check you did not run — and a provenance claim is a check. Verify it with a command before writing it down.**

---

## ⭐ The two lessons worth carrying forward

**1. Every blocker in rounds 2 and 3 sat in a string that was authored rather than ported.** Every
sentence carried verbatim from a certified essay survived all three reads, without exception. This
is the pattern `CLAUDE.md` already records from `titles.html` and `ev-s3.html`; it held here with no
counter-example across ~104 edits, and rounds 4 and 5 held it too.

**2. ⚠ A VERBATIM PORT CAN STILL BREAK IF THE STRUCTURE IT REFERENCES DIFFERS. This is new, and it
is not covered by "port, don't author."** Session 1 ended *"which lands him back on the second
horn"* — word-for-word from `library/islam-dilemma.html:156`. But the **essay** numbers Horn 1 =
corruption and Horn 2 = intact-and-contradicting, while **this page** states the fork the other way
round (session 0 and card 02: *"Affirm … or deny"*). So the second horn here is *deny*, and the
sentence pointed at the wrong one. The word `horn` appears **exactly once** on the page, so the
ordinal had no definition at all. `apologia-neutrality` and `apologia-argument` found it
independently. **Fix: port the essay's *destination description*, not its *label*.**
**A port carries its scaffolding with it — check that the scaffolding came too.**

---

## Round 1 — the pre-existing defects

The dominant shape, named independently by all three lenses: **the compressed study asserted as
settled what our own certified essays deliberately concede.**

| # | Finding | Disposition |
|---|---|---|
| 1 | **Ibn Hazm chronology.** The page said textual-corruption doctrine began with Ibn Hazm; `islam-dilemma.html:158` says that claim *"has overstated the case"* (Whittingham dates the charges to the 9th c., probably the 8th). | Rebuilt on 4 surfaces from `:158`; the concession is now made up front. |
| 2 | **The *muhaymin* reply dismissed.** Our essay calls it *"the best response on offer"* with *"a genuine foothold in the word"*. The capstone never mentioned it at all. | Stated at full strength, then answered and bounded, from `:170`/`:176`. Reached card 02. |
| 3 | **The "even if the Bible was changed" move** is refuted by the *standard* tahrīf position (corruption predates Muhammad), not a clever one. | Rebuilt around the 7th-c. qualifier from `:166`/`:186`. |
| 4 | **The divine-love contrast** — `retired-claims.json` → `unmerited-love-comparative`, retired 2026-07-29, alive in wording the guard could not see. | Replaced with essence-vs-activity from `islam-tawhid.html:179`. Registry widened (see below). |
| 5 | **The Chalcedon gap.** `human`/`humanity`/`incarnate` appeared **zero times** across 16 sessions, 16 takeaways, 8 flashcards — in an *Islam* context, where the standing charge is that Christians deified a man. | Affirmed in session 11, the clarifier, and card 06. |
| 6 | **"Son of God" reduced to a caricature.** The page implied clearing up the *walad* misunderstanding dissolves the objection. It does not. | Corrected on 3 surfaces from `trinity_islam.html:171` + `islam-jesus.html:145`. |
| 7 | **The study's modesty credited to Frost by name** on 6 surfaces, while the research note records the book as triumphalist and the author self-describing as *"a polemicist."* | Re-attributed to us. ⭐ The abductive *probability-not-proof* **form** is genuinely the book's method per the note, and was kept — the adjudication was to split virtue from content. |
| 8 | **Factual:** *musaddiq* count; five pillars vs six articles; Garima dated to "Muhammad's own era" (contested 390–660); "sharing God's throne" attributed to the Gospels; clay-birds "drawn from". | All corrected; see round 2/3 for the throne, which took two attempts. |

---

## Round 2 — mostly self-inflicted

| # | Finding | Note |
|---|---|---|
| 1 | ⚠ **The throne fix reintroduced a retired claim.** "Sharing God's throne" → "seated at the right hand of Power (Mark 14:62)" is the **enthronement plank `ev-s3.html` card 08 spent six gate rounds removing** — Psalm 110:1 seats *David's lord*, a human, there. | Ported to cloud-coming from `ev-s3.html:876`. |
| 2 | ⚠ **The clarifier would not have rendered.** `library/orthonote.js` line 13 documents an `<h4>` heading; **line 46 of the same file** says it must be an inline `<span class="on-h">` or the block element auto-closes the `<p>` and ejects the box. The doctrinal fence would have appeared as raw prose mid-sentence. | Fixed, **and the doc-comment corrected** so the next reader doesn't repeat it. |
| 3 | ⚠ **The clarifier dropped the Arian fence.** The `eternal_generation.html:139` port kept the derivation language but swapped its *Arian* denial for a Chalcedon one — on the one page where the charge is that Christians deify a creature. | Both fences now present. |
| 4 | ⚠ **John 16:27 misquoted into works-righteousness.** Written as *"the Father loves you because you have loved him"*; the verse says *loved **me***. As written it stated in our own voice that God's love is caused by our performance. | Verse **removed** — its provenance was an internal registry `why` field, never certified prose, so it was never a port. |
| 5 | ⚠ **Card 05 overreached** ("the text did not change", flat) against TAKE[6]'s *"never 'perfectly preserved'"* on the same page. | Scoped to the post-7th-century window. |
| 6 | **Sessions 6, 9 and 10 each ended on the Muslim reply with nothing said back.** | Each now concedes, then closes, with ported verdicts. |

---

## Round 3 — convergence

Argument returned **SOUND**. The remaining findings were the "second horn" ordinal (above), card 02's
verdict verbs attached to the wrong object (*what the reply relocates is the **difficulty**, not
Q 10:94*), and the sidebar port having lost its subject noun (*"**It** preserves a great deal"*,
leaving *"denies that he is God incarnate"* on an unresolved pronoun — both dual-consensus lenses
flagged it).

**Q 9:111 was removed** on `apologia-argument`'s ruling: the clause conceded that what the Qur'an
calls binding is a **promise**, then contrasted it against a claim about **warfare**. No certified
essay covers the verse anywhere on the site, so it could not be fixed by porting. Logged as backlog
P2 rather than published weak.

**The quoted hadith and the quoted Q 3:93 were de-quoted** on all four surfaces. Both carried
identical argumentative weight as paraphrase, and quoting scripture we have not verified — on a page
under a living author's name — was the sharpest citations exposure. This defuses it without waiting
for a web-enabled session; the verification is still owed (backlog P1).

---

## Tooling defects found and fixed

1. **`tools/retired-claims.json` was half blind.** Two patterns spelled the anchor `Qur'?an` with a
   raw apostrophe, so they could never match `Qur&rsquo;an` — how every page on the site spells it.
   They survived only on the `Islam|Muslim|Allah` alternates. Fixed, with executable corpus coverage
   added in both directions.
   ⚠ **My first widening was dead on arrival** and matched nothing, including the wording it was
   written to catch. Caught only by testing the net against the OLD strings — *re-running the scan
   and seeing green proves nothing about a pattern that matches nothing.*
   ⚠ **My second widening produced two false positives**, one of them on certified text
   (`worldviews.html` quoting the Qur'an accurately to make the opposite point). Partly reverted.
   ⭐ **The rule: the test is provenance of the noun, not synonymy.** `unbeliever|sinner|wrongdoer`
   are the retired comparative's own vocabulary; `transgressor|arrogant|unjust` are Yusuf
   Ali/Pickthall rendering vocabulary, so netting them catches translation, not the claim.
2. **`tools/list-clarifiers.mjs` could not see this page** — its glob excluded the file, and its
   regex could not match a clarifier written inside a JavaScript string literal (which must use
   escaped double quotes). Both fixed; the clarifier is now in `docs/clarifiers.md`.
3. **`library/orthonote.js`'s own doc-comment was wrong** (see round 2 #2).
4. **`docs/book-research/islamic-dilemma.md` still labelled the retired divine-love contrast
   "A MODEL of honest argument."** Sessions are pointed at the note, not at the guard, so the next
   mining run would have reintroduced it. Corrected in place with the retirement recorded.
5. ⚠ **`tools/check-content-review.mjs` tests only that stamp fields are NON-EMPTY** — so a stamp
   reading `"orthodoxy": "NOT STAMPABLE (round 4 in flight)"` **passes CI**. The disclosure that
   should stop a deploy is invisible to the checker; only human discipline is holding it. **Not
   fixed** — route to `apologia-engineer` (validate ISO `YYYY-MM-DD`), and check no existing stamp
   relies on free text first.

---

## Standing notes for any future pass

- ⚠ **Do not reorder the clause before "Christ died for sinners."** What keeps that sentence out of
  the retired unmerited-love comparative is *"not 'Islam has a needy God,' which is false"*
  immediately preceding it (`apologia-orthodoxy`, round 3).
- ⚠ **Do not "correct" the sidebar's Qur'anic-Jesus sentence** — it is a verbatim port from
  `library/islam-jesus.html:181` and reads as a false-common-ground candidate without being one.
- ⚠ **`wrongdoer` and `disbeliev` are latent translation-vocabulary collisions** in the narrowed
  verb net, dormant only because Sahih International renders those clauses "does not like" rather
  than "loves not." A page quoting Pickthall on 3:57 or 2:276 will trip it.

## Still owed

| Item | Where |
|---|---|
| ~~Round 4~~ / Round 5 | ✅ **DONE — CERTIFIED 2026-08-12.** orthodoxy STAMPABLE (0 heresy, 0 drift); neutrality STAMPABLE, unconditional. Five rounds total. |
| Session 7's dropped balancing clause (`islam-dilemma.html:164`) | `apologia-neutrality` round 5, POLISH — scope-frozen |
| The *muhaymin* foothold stated twice, two sentences apart (session 9) | pre-existing; fix is a pure deletion, not a rewrite |
| Sidebar: "**the** two things the Gospel cannot do without" | `apologia-orthodoxy` round 5 NOTE — one-word fix; card 06 rests everything on the resurrection |
| The other-directed-love clarifier (box text drafted by orthodoxy, ready to gate) | recommended, not blocking |
| `apologia-citations` on ~a dozen new references | `content-backlog.md` P1 |
| Q 9:111 exegesis, or leave it dropped | `content-backlog.md` P2 |
| The Q 10:94 corpus gap (the "rhetorical address to doubters" reading) | `content-backlog.md` P3 |
| Ibn Kathir on *muhaymin* — verify or drop | `content-backlog.md` P3 |
| Human/pastoral sign-off | `STATEMENT_OF_FAITH.md`, still `_pending_` |
| The "Get the book" button is the placeholder Amazon ASIN | owner decision |
