# Debate Breakdowns: proposal

*Written 2026-09-23. Idea only; nothing built. Companion to `docs/LOGOS_OF_APOLOGETICS.md` and the
Objection Guide mockup in `docs/mockups/`.*

## What it is

A **reviewed, public page for each major online debate** between a Christian and a Muslim, JW,
atheist or other sceptic. It is the curated tier of the "paste a debate link" idea. The private
AI tier (any link, a timestamp, unreviewed and labelled as such) can come later.

## Page anatomy

1. **Header:** title, speakers (with a neutral one-line description of each), date, venue,
   length, a link to the video (linked, never hosted; YouTube's own embed if allowed), topic tags.
2. **In two minutes:** what was debated, each side's thesis in their own best terms, and how the
   exchange went, with no "winner" declared.
3. **Timeline:** 6–12 key moments with clickable timestamps, e.g. "42:10: the claim that the
   Gospels are anonymous."
4. **The other side's strongest points, answered.** For each: the point stated fairly, our answer,
   and a link to the Objection Guide page or essay. Answers are **ported from certified essays**.
5. **Claims worth checking (either side):** each with what the evidence actually shows and the
   source. "Claims worth checking", never "lies" or "errors by X".
6. **Where the Christian case was weak:** honestly. Includes any argument on our retired-claims
   list, with what to say instead.
7. **Our verdict, bounded:** required for Islam/JW/rival-worldview debates by the EXPLICIT-VERDICT
   rule. State plainly which specific claims don't hold, without claiming a knockout.
8. **Go deeper:** the related essays, Objection Guide pages, a practice round in the Debate Arena,
   and a pocket card.
9. **Troubled by a moment?** A link into Asked & Answered with the timestamp pre-filled. This
   passes through the crisis check like every free-text box.

## How each one is made

1. **Pick** the debate (criteria below).
2. **Transcript:** `tools/fetch-transcript.py` into the git-ignored `_transcripts/`. Never commit or
   republish the transcript. Captions mishear names, verses and dates, so check every quoted claim
   against the video.
3. **Research note** in `docs/video-research/` (existing format and rules): the arguments, the
   primaries cited, Step Zero (read the paired essays in full first), the six-verdict cross-check.
4. **Draft the page** by **porting from certified essays** wherever possible; any authored sentence
   is declared to the reviewers (rules 5 and 8).
5. **Review:** citations → argument → orthodoxy, plus **neutrality** for Islam/deity/Trinity
   debates (dual-consensus), run as read-only Explore agents. Extra checks for this format: fair
   representation of named people, and the Christian speaker's weak spots stated honestly.
6. **Publish** with a `content-review` stamp; add to the sitemap and the debate index.

**Estimated effort (a guess, not measured):** 1–3 days per debate, mostly review rounds. AI cost is
small.

## Choosing debates

- **High views, or currently viral** (search demand and relevance).
- **Covers a topic where we already have certified essays**, so the answers can be ported.
- **Across rival worldviews:** Islam, atheism, JW, Mormonism, the historical Jesus.
- **Mix of classic and recent.**
- **Skip** Christian-vs-Christian debates (denominational neutrality), unless the page presents both
  sides without a verdict.

**First pilot, already identified in `docs/MARKET_RESEARCH_2026-09-03.md` §6:** the viral
**Hijab vs GodLogic** exchange on the Islamic Dilemma (May 2026). `library/islam-dilemma.html` is
certified and dual-consensus stamped, and `docs/video-research/frost-islamic-dilemma.md` exists, so
most answers can be ported. The page's promise, "what the Islamic Dilemma actually claims and what
the debate got wrong on both sides", fits this format exactly. (Confirm the video, date and
speakers before starting.)

Other candidate types to confirm individually: a classic Craig resurrection debate (e.g. with Bart
Ehrman), a Craig cosmology debate (e.g. with Sean Carroll), a major Christian–Muslim debate on the
crucifixion or Jesus' deity, a JW debate on John 1:1, and a recent viral historical-Jesus or
minimal-facts exchange.

## Guardrails specific to this format

- **Named real people:** describe arguments, not motives. No mockery, no "destroyed" or "owned".
  Quote only short, accurate, timestamped lines.
- **Fairness both ways:** the other side's strongest points at full strength; the Christian
  speaker's weak moments named.
- **Explicit, bounded verdict** for rival-worldview debates; **no verdict** between Christian
  traditions.
- **False-common-ground rule** applies to Christian–Muslim debates.
- **Copyright/YouTube:** link or official embed only; no rehosting; no transcript published; short
  quotes for commentary. Legal check before launch.
- **Freshness:** if a speaker later changes their view, update the page.

## Where it sits

- A **Debates** section in the Evidence Library (a debate index filterable by worldview and topic),
  linked from each topic tab ("Debates on this topic").
- Each debate's answers link into the **Objection Guide**, and each Objection Guide page lists
  "Debates where this came up".
- Later: the private "paste any link / timestamp" tool in Asked & Answered, which checks first
  whether we already have a reviewed breakdown.

## Why it is worth it

- **Search demand:** people search debate titles and "who won X vs Y".
- **Timeliness:** viral debates are when believers feel most shaken.
- **Trust:** a fair, sourced breakdown that admits weak points on our side is rare.
- **Reuse:** every breakdown strengthens the Objection Guide and scholar pages, and supplies
  short-form reel material, which is also gated.
- **Low risk:** everything public is reviewed, unlike a live AI tool.
