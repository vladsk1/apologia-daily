# Handoff — Dr. Mikel Del Rosario reading-club companion study

**Status: paused, waiting on the book.** Resume this in a **local** Claude Code session
that can drive a browser (so it can read the book in Kindle Cloud Reader,
read.amazon.com, while logged into the user's Amazon account). Everything below is
already committed and deployed. Deploy rule unchanged: work on the feature branch,
**never `git checkout main`**, deploy by `git push origin <branch>:main`.

## The opportunity
Dr. Mikel Del Rosario (@apologeticsguy — PhD, host of the *Table Podcast*, foreword by
Darrell L. Bock) wrote **_Did Jesus Really Say He Was God? Making Sense of His Historical
Claims_** (IVP Academic, 2024). The user reached out via Instagram to build an interactive
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

## THE NEXT TASK (why we paused) — verify against the actual book
The **chapter titles + the two Mark passages are verified**; the **per-session `summary` prose and
the `questions` are my inferences from the titles + public info — NOT checked against the book's
actual pages.** A scholar will spot a misread instantly, so before sending:

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
