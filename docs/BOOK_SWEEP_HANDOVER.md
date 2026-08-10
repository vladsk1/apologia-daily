# Book-sweep handover — where the research-library cross-check stands

> **Written 2026-08-08 for a fresh session.** Read this before touching
> `docs/book-research/`. It records what has been checked, to what standard, what is still owed, and
> the failures worth not repeating. Companion to `docs/SWEEP_HANDOVER.md` (which is about gating
> content, not mining sources).

---

## 1. How the check works

The method is written into `CLAUDE.md` (§ *MANDATORY CROSS-CHECK STEP* and the Step Zero box). In short:

1. **Step Zero — read the paired essay(s) start to finish, BEFORE opening the source.** Not grep, not
   headings. Order matters: reading the essay first means mismatches surface on contact; reading it
   afterwards means you only find what the source told you to look for.
2. **Read the research note cover to cover.** *(Added 2026-08-08, owner-directed — see §4.)*
3. **Walk the source's own section list.** Every section gets one of six verdicts, **including
   sections with no counterpart at all** — the dangerous miss is not a wrong verdict, it is *no*
   verdict.

   | | Verdict | Action |
   |---|---|---|
   | 1 | Corroboration — we say it, at least as well | No row; record the comparison |
   | 2 | ⚠ **Error in ours** | P1 correction row |
   | 3 | ⚠ **Weaker in ours** | Row to improve the wording |
   | 4 | Missing from ours | Row |
   | 5 | ✅ **Hazard — ours is better** | No row. **Flag it** so nobody improves us backwards |
   | 6 | Non-recommendation | Log it **with the reason** |

4. **Mandatory standing output:** *"Is the source better than our essay anywhere? Where, and how?"* —
   answered explicitly every time, even when the answer is no.
5. **Re-test the note's own ledger against the live site.** Has anything already shipped? Do its
   do-not-use flags still hold?
6. **Coverage limits stated, never glossed.** Any essay not read in full is named and its verdicts
   marked PROVISIONAL. **Never write "read in full" unless you did.**

---

## 2. Status — 7 of 14 notes checked

| # | Note | Checked | Standard met |
|---|---|---|---|
| 1 | `islamic-dilemma.md` | ✅ 2026-08-06 | **Full** — essay read start to finish (7,348 w) |
| 2 | `case-for-the-resurrection-of-jesus.md` | ✅ 2026-08-07 | **Full** — 3 essays read start to finish; *refused to log* a finding until `disciplesbelief.html` is read |
| 3 | `did-jesus-really-say-he-was-god.md` | ✅ 2026-08-08 | **Full** — 3 essays + note cover to cover |
| 4 | `in-defense-of-the-bible.md` | ✅ 2026-08-08 | **Full** — 3 essays + note cover to cover; `eyewitnesses.html` named as unread |
| 5 | `body-of-proof.md` | ✅ 2026-08-08 | **Partial** — 5 essays read in full, 6 search-only (declared PROVISIONAL). ⬜ **Note not yet read cover to cover (1,261 lines)** |
| 6 | `i-dont-have-enough-faith-to-be-an-atheist.md` | ✅ 2026-08-08 | **Full, after a correction** — see §4. Essays + note both now read in full |
| 7 | `josephus-and-jesus.md` | ✅ 2026-08-08 (redone) | **Full check, partial source** — see §3 |
| 8 | `raised-on-the-third-day.md` | ⬜ | Not started. PARTIAL note (chs. 11 + 16); already has 6 open rows from 2026-08-05 |
| 9 | `islamic-dilemma-enrichments.md` | ⬜ | Not started |
| 10 | `return-of-the-god-hypothesis.md` | 🔴 **BLOCKED** | Owner is supplying endnote photographs. ~15 factual flags need them before a scoped citations pass |
| 11–14 | `can-we-trust-the-gospels.md` · `jesus-and-the-eyewitnesses.md` · `on-the-reliability-of-the-old-testament.md` · `gathercole-preexistent-son-and-thomas.md` | ⬜ | **Deliberately last.** Books we do not own, mapped from open-access material only — a cross-check would compare our essays against a map that is itself unverified |

### Immediately owed
- ⬜ **Read `body-of-proof.md` cover to cover** (book 5). Its verdicts stand, but they were written
  from headings; the other two notes read that way both yielded findings on a full read.
- 🔴 **`josephus-and-jesus.md` needs a web-enabled session.** Its six appendices and bibliography were
  **never read** — `academic.oup.com` is egress-denied here. App. 1 (the Ken Olson "Eusebius forged
  it" rebuttal) is ranked by the note itself as "the strongest live challenge to everything above."
- 🔴 **`return-of-the-god-hypothesis.md`** — waiting on the owner's endnote photos.

---

## 3. What the sweeps actually produced

**One live content change** (everything else is records and rows): `ev-s3.html` card 08, the
"Son of Man / Daniel 7" subsection, rebuilt across all three tiers and **dual-consensus stamped
2026-08-08**. It took **six gate rounds**. Its stamp carries the full account — read it before
touching that card.

⚠ **`ev-s3.html`'s `citations` date is deliberately still 2026-08-02.** That gate did **not** run on
the rebuild, and several references added during it (Tobit 12:16–22; Ps 104:3 / Isa 19:1; Owen &
Shepherd *JSNT* 2001 with Casey's 2002 reply; Mark 14:61) are gate-verified but **not**
citations-gated. **This is the one real gap today's work left open.**

**~30 backlog rows** were added across the seven sweeps. The highest-value open items:

- 🔴 **The Daniel 7:13 corporate/angelic readings (J. J. Collins)** are missing from `ev-s3.html`'s
  objections section **and** from `library/titles.html`. Its value **rose** on 2026-08-08, because the
  fix moved the argument's weight onto the cloud plank — which is exactly what that objection attacks.
- 🔴 **`library/titles.html` fn 3 cites Daniel 3:12 backwards** — it offers 3:12 as evidence that
  *pelach* denotes service to God, when that is the verse where *pelach* is used of Nebuchadnezzar's
  gods. Owed since 2026-08-02.
- 🔴 **The `/sources` live-door for `library/miracles.html` was never completed** — Hume and Spinoza
  are PD and flagged twice as `/sources` candidates; neither is there. This is the only route by which
  that material can reach a **live AI answer**.
- **`library/earlycreed.html` never cites Dunn — `ev-s3.html` cites him four times.** The card rests
  on a scholar the essay never establishes, and a *fabricated* Dunn quote was removed from that card
  on 2026-08-01.
- **`library/hist_jesus.html` names only one flank of the Testimonium debate** — Schmidt (more
  authenticity) and no one arguing the other way. Bermejo-Rubio does.

---

## 4. Failures worth not repeating

**① The stale-ledger failure — three of seven notes.** `islamic-dilemma.md`,
`in-defense-of-the-bible.md` and `i-dont-have-enough-faith-to-be-an-atheist.md` all advertised work
that had **already shipped**, in one case an entire essay (`library/miracles.html`, created from
Geisler & Turek ch. 8). A session reading those notes would have redone finished work. **`CLAUDE.md`
now requires a Done row and its note to ship in the same commit.**

**② "Read in full" written when it wasn't.** The book-6 note claimed two essays were read in full when
about a quarter of each had been. The verdicts survived the full read — **which is luck, not method.**
A verdict that turns out right is not the same as a verdict that was grounded when it was made. Same
discipline as a `content-review` stamp: never stamp a check you did not run.

**③ Heading-reading produced a wrong finding about the note's own contents.** The first Josephus
addendum claimed the earlier pass "walked past the six appendices." Read cover to cover, the note says
the opposite in two places — it declared them unread and ranked them by priority. **This is why rule 2
exists**, and it was committed while writing up the very book that produced the rule.

**④ What cover-to-cover reading actually buys.** Every finding below sits in a "To confirm on use" or
guardrail-fit block — in no heading, reachable by no search:
- Bermejo-Rubio dissenting from the neutral-Testimonium reading (a steelman gap).
- The `/sources` live-door for Hume and Spinoza, flagged twice and never done.
- Simon Greenleaf — PD, absent site-wide, and the one famous jurist behind the courtroom analogy
  `library/consistency.html` already makes.
- A **retired claim** sitting in the Geisler & Turek chapter map (Daniel 7:13–14 as "a divine,
  worshipped figure") that would trip our own CI guard if ported.

**⑤ A source that is *worse* than us is a finding, not a null result.** Three notes now carry
"✅ hazard — ours is better" flags: `consistency.html` is a generation ahead of *In Defense of the
Bible* ch. 11 (it is built on Licona 2017, which the 2013 volume predates); `canon.html` honours
denominational neutrality **better than its own source**; `evil.html` implements the *Body of Proof*
theodicy guardrail more carefully than that book does. **Do not mine those chapters.**

---

## 5. Safety checks already run — do not relax them

- **`body-of-proof.md` ch. 4's Islam-slavery material is Bill-Warner/CSPI-sourced.** Verified
  **absent** from the whole served corpus on 2026-08-08 (`Bill Warner`, `CSPI`, `Center for the Study
  of Political Islam` — all zero). So are its "chauvinistic" (of Paul) and "hell on earth" framings.
- **`in-defense-of-the-bible.md` ch. 16's Apocrypha argument** must never be used in our voice.
  `canon.html` currently handles Jerome/Trent correctly as "a real and reasonable disagreement… not
  the burden of this essay to settle it."
- **`i-dont-have-enough-faith-to-be-an-atheist.md` ch. 6 (macroevolution)** stays declined — micro/macro
  definitional point and the information argument only, never "evolution is false" rhetoric.
- **The full Testimonium** is never reproduced; neutral core only.

---

## 6. Concurrency note

Another session was working `tools/reel/specs/jesus-titles.json` on the **same material** on
2026-08-08. Its reel was checked against every phrase corrected in the `ev-s3` rebuild and is clean,
having independently reached the same fix. ⭐ Its round also caught something none of the gate rounds
here did: the reel's **wording** was clean while its **typography** delivered a retired inference —
gold emphasis staged on "the service of all nations." **A retired claim can be re-delivered by layout
alone.** Expect concurrent sessions; `git fetch origin main` and merge before deploying.
