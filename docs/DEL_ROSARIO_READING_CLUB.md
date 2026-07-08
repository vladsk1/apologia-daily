# Handoff — Dr. Mikel Del Rosario reading-club companion study

**Status (updated 2026-07-09): the ENTIRE book has now been read page by page, and all 13 session
summaries + questions are CONFIRMED against it with ZERO changes.** The copy was first written
(2026-07-08) from a partial read; it was then verified (2026-07-09) against a **complete
page-by-page read of the entire main text** (Introduction + all 12 chapters, pp. 1–203; back matter
not needed) — every previously-skimmed chapter middle was read, and **every summary and every
question was confirmed with no changes required.** Directly verified against the book: the certainty
scale (−4..+4); the ten data points (two +4 "certainly historical" = miracle-worker reputation &
rejection/crucifixion-under-Rome, eight +3 "very probable"); the five best-explanation criteria; the
five critics (Hägerland/Ehrman/Casey/Borg/Kirk); 1 Enoch 37–71 (Son of Man as heavenly judge); and
**Table 11.1 exactly** (Hägerland P/F/F/F/—, Ehrman F/F/F/F/—, Kirk P/P/F/F/P, divine hypothesis
P/P/P/P/P — Kirk's illumination legitimately updates from "—" in ch. 10's Table 10.3 to "P" in
ch. 11's Table 11.1, and the demo cites the final table, so its values are correct). The book's own
conclusion lands on **classical Nicene orthodoxy** (it quotes the Nicene Creed) and the **1 Cor 15:3–5
early creed** (Dunn: "within months" of the crucifixion) — fully aligned with the site's guardrails.
Per-page reading notes: session scratchpad `delrosario-book-notes.md`. Gates run: **apologia-citations CLEAN** (all scripture
quotes match ESV; Hägerland/Casey/Ehrman/Kirk/1 Enoch correctly attributed); **apologia-evidence**
(standing in for the dedicated gates, which are NOT registered in this session) — orthodoxy CLEAN,
argument PASS after one detail-hero overstatement was re-hedged. **Still to do before public launch:**
(a) run the dedicated **apologia-argument + apologia-orthodoxy** gates in a session where they load;
(b) swap the "Get the book" link for the author's affiliate link; (c) optional orthonote clarifier;
(d) human/pastoral sign-off + the author's own review; (e) draft + send the DM. NOT yet
deployed/committed — the rewrite currently lives in the local working tree only. Deploy rule
unchanged: work on the feature branch, **never `git checkout main`**, deploy by
`git push origin <branch>:main`.

## The opportunity
Dr. Mikel Del Rosario (@apologeticsguy — PhD, host of the *Table Podcast*, foreword by
Darrell L. Bock) wrote **_Did Jesus Really Say He Was God? Making Sense of His Historical
Claims_** (IVP Academic, 2025). The user reached out via Instagram to build an interactive
**study on Apologia Daily based on his book**; he replied he's **willing to look at a demo**.
This is a credibility + traffic partnership (see `docs/CREATOR_OUTREACH.md`).

## What's built (DONE)
- **`demo/del-rosario-companion-study.html`** — a self-contained demo in the **Reading Clubs**
  skin (`reading-club.html` look), styled as a "featured club" for his book.
- **Live, UNLISTED:** https://apologiadaily.com/demo/del-rosario-companion-study.html
  — `noindex,nofollow`, its own minimal nav, **not** wired into the Reading Clubs list,
  site nav, or `sitemap.xml`. Reachable only by direct link. Deployed to `main`.
- **Structure = his real table of contents** (13 sessions: Intro + 12 chapters, 4 parts).
- **Book-first design** (important — see "association concern" below): each session leads with
  **"Read from the book"** (his chapter) + **Discussion** (3 questions). Our essays/drills sit
  in a separated, dashed-off **"Optional — go further · Apologia Daily resources"** block with the
  disclaimer: *"Our own material, offered as a bonus. Not part of the book, and not endorsed by
  the author."*
- Prominent gold **"Get the book" band** (one buy button) → currently the Amazon listing
  `https://www.amazon.com/Did-Jesus-Really-Say-Was/dp/1514011018`.
- Author refered to as **"Dr. Mikel Del Rosario" / "Dr. Del Rosario"** throughout (incl. cover placeholders).
- Sessions render as separated cards; the open one lifts with a shadow + dark header bar.
- **Gated:** argument (0 BREAK) + orthodoxy (0 heresy/0 drift) ran on the copy; flags fixed;
  content-review stamp is in the file `<head>`.

## The book's real table of contents (from the user's Kindle screenshots)
- **Introduction: More Than a Man?**
- **Part One — Person of Interest: Investigating Jesus as a Figure in Ancient History**
  - 1. Let's Make History: How Historians Discover Past Events
  - 2. Rules of Evidence: Investigating the Historical Jesus
- **Part Two — The First Blasphemy Accusation Scene: How Jesus Claimed to Have Divine Authority
  to Forgive Sins** _(The Healing of the Paralytic, Mark 2:1–12)_
  - 3. The Core Scene: A Miraculous Healing
  - 4. A Blasphemy Accusation: Who Can Forgive Sins?
  - 5. A Divine Claim: Authority to Forgive on Earth
- **Part Three — The Second Blasphemy Accusation Scene: How Jesus Claimed to Have Divine Authority
  to Judge Sins** _(Jesus' Jewish Examination, Mark 14:53–65)_
  - 6. The Core Scene: A Legal Investigation
  - 7. Questioning Jesus: Who Do You Think You Are?
  - 8. A Blasphemy Accusation: You Can't Judge Me!
  - 9. A Divine Claim: Authority to Judge in Heaven
- **Part Four — Battle of the Views: Testing Key Explanations of Jesus' Claims in the Blasphemy
  Accusation Scenes**
  - 10. Limited Power: Authority over Some of Reality
  - 11. Total Power: Authority over All of Reality
  - 12. Conclusion: How Jesus Said He Was God
- Back matter: Glossary · Notes · Bibliography · General Index · Scripture Index · About the Author

## THE NEXT TASK — ✅ DONE 2026-07-08, then FULLY VERIFIED 2026-07-09 (page by page)
~~The per-session `summary` prose and `questions` are inferences from the titles + public info —
NOT checked against the book's actual pages.~~ **RESOLVED and now FULLY VERIFIED:** the book was
read directly in Kindle Cloud Reader. All 13 `summary` + `questions` were first rewritten (07-08)
to match Del Rosario's real content, then (07-09) checked against a **complete page-by-page read of
the entire main text** — every chapter middle included — and **confirmed with zero changes.**
Real errors that were fixed vs. the old inferred copy: Ch 2 no longer ties the chapter to the
1 Cor 15 creed (it's actually about historical *method* — best-explanation reasoning + criteria of
authenticity); Ch 5 now centers Tobias Hägerland's challenge to Mark 2:10 + the five questions;
Ch 8 now names Casey/Ehrman's "three-pronged" argument that it *wasn't* blasphemy; Ch 10/11 now
reflect the real ten-data-points / five-criteria contest and J. R. Daniel Kirk's "idealized human"
view; the book's actual engine (argue from **Mark not John**, focus on the **enemies'** reaction)
now runs through the copy. Detailed per-chapter reading notes: session scratchpad
`delrosario-book-notes.md`. The original steps are kept below for reference; steps 1–3 are done,
steps 4–6 remain:

1. **Read the book** in Kindle Cloud Reader (local browser session; the sandboxed cloud session
   here could not). Work chapter by chapter.
2. For each of the 13 sessions in the `CH` array in `demo/del-rosario-companion-study.html`:
   - Correct the `summary` so it matches what he **actually argues** in that chapter (emphasis,
     examples, conclusion). Watch the inferred ones: Ch 5 ("doubles down"), Ch 6–9 framing,
     Ch 10 ("delegated authority" steelman) → Ch 11 ("total power") → Ch 12 (conclusion).
   - Make sure the 3 `questions` track his actual content.
   - **Do NOT reproduce his copyrighted text.** Summaries stay in our words; represent, don't quote.
3. Re-run the **argument + orthodoxy gates** (`apologia-argument`, `apologia-orthodoxy`) on the
   revised copy; fix flags; update the `content-review` stamp date.
4. Swap the **"Get the book" Amazon link** for **his preferred store / affiliate link** (ask the user).
5. Optional polish: give the drills their own "Practice" sub-label inside the optional block if wanted.
6. Redeploy: `git push origin <branch>:main`. Keep it unlisted (do not add to nav/list/sitemap)
   until he approves a public launch.

## Guardrails specific to this work
- **Association concern (the user's, and it's right):** the author must not appear to endorse our
  content and can't be expected to vet it. Keep the **book-first structure** and the "optional /
  ours / not endorsed" disclaimer. A reader can complete the club without opening any of our links.
- Standard site pipeline still applies (draft → citations → argument → editor → **orthodoxy gate** →
  deploy). It's partner-facing + doctrinal, so gate before any redeploy and get eventual human sign-off.
- Monetization is a stub — do not wire real payments. The "Join this reading club" button is a demo stub.

## Current session → Apologia Daily "go further" mapping (all certified pages)
| Session | Optional read(s) | Drill |
|---|---|---|
| Intro | ev-m-hist_jesus | — |
| 1 Let's Make History | ev-m-multiatt | — |
| 2 Rules of Evidence | ev-m-hist_jesus, ev-m-earlycreed | — |
| 3 Core Scene: Healing | library/jesus_claims.html | — |
| 4 Who Can Forgive Sins? | ev-m-jesus_claims | Ask Anything |
| 5 Authority to Forgive | library/jesus_as_god_nt.html | — |
| 6 Legal Investigation | library/jesus_as_god_nt.html | — |
| 7 Who Do You Think You Are? | ev-m-jesus_as_god_nt, ev-m-daniel70 | Debate Arena |
| 8 You Can't Judge Me! | ev-m-jesus_claims | Objection Catcher |
| 9 Authority to Judge in Heaven | ev-m-daniel70, ev-m-phil2 | Ask Anything |
| 10 Limited Power | ev-m-jesus_claims | Ask Anything |
| 11 Total Power | library/jesus_as_god_nt.html, ev-m-phil2 | Debate Arena |
| 12 Conclusion | ev-m-jesus_claims | Ask Anything |

## Where it would live once approved
Home = **Reading Clubs** (`reading-club.html`), added as a `BOOKS[]` entry (its own chapter-by-chapter
detail view) alongside *Mere Christianity* / *The Case for Christ*. The current demo is a standalone
page; final integration would fold it into that page's data model.

## DM to send him (still to draft) — lead with:
1. The study follows **his own table of contents**, and **he gets edit approval** on every summary/question.
2. The **"Get the book" button points wherever he wants** (his affiliate link) — sales credit to him.
3. It's book-first; our resources are optional and clearly not his endorsement.
