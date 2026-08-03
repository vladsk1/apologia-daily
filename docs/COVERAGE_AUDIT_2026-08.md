# Coverage audit — what a world-class apologetics site still owes its reader

_2026-08-03. Complement to [`NUMBER_ONE_ROADMAP.md`](NUMBER_ONE_ROADMAP.md) (2026-07-02), which
covers growth, features and distribution. **This file is about the content itself** — what the
library actually contains, measured, and what it does not. Nothing here changes live content._

---

## Method

Counted, not estimated. All figures generated from the repo on 2026-08-03:

- 86 essays in `library/` (+11 MK, +11 ES translations)
- 67 mastery pages (`ev-m-*.html`), 14 hub fragments (`ev-s*.html`)
- 102 answer pages, 12 API endpoints, 45 feature pages, 61 reel specs
- 22 source files, 25 registered retired claims

Essays were bucketed by subject and word-counted with tags stripped.

---

## 1. The finding

| Cluster | Essays | Words |
|---|---:|---:|
| Trinity / deity of Christ | 20 | 105,021 |
| Bible reliability | 18 | 96,051 |
| Natural theology | 19 | 95,926 |
| **Islam** | **17** | **92,183** |
| Resurrection | 10 | 48,542 |
| **Suffering and evil** | **1** | **4,947** |

**There are 92,183 words on Islam and 4,947 on suffering.** Eighteen times more on a religion
most Anglophone readers will never be asked about than on the objection every reader has already
been asked, usually by themselves, usually at a funeral.

That ratio is the audit. Everything below is detail.

---

## 2. What this site is, versus what it says it is

The site describes itself as an apologetics platform. Measured by its contents it is something
narrower and, in that lane, genuinely excellent: **an evidential apologetics platform.** It
answers *is it true?* — did Jesus exist, did he rise, was the text preserved, does the universe
require a cause, is the Trinity coherent, does Islam's case hold. On those questions the depth,
sourcing and review discipline are at or above anything else publicly available.

It has almost nothing on the other half of the discipline: **is it good?**

Run down the 102 answer pages. There is no answer to *why does God allow suffering* — the most
asked religious question on earth. There is one essay (`library/evil.html`, 4,947 words,
Plantinga's free-will defense), and no short answer routing to it. Also absent, entirely:

| Missing | Why it matters |
|---|---|
| **Hell / eternal punishment** | The most common stated reason educated Westerners give for rejecting Christianity outright |
| **The Canaanite conquest** | Named in [`ANSWERS_BACKLOG.md`](ANSWERS_BACKLOG.md) as the **highest-demand cluster on the site**, with "no backing essay" |
| **Slavery in the Bible** | Same cluster, same status |
| **Divine hiddenness** | Schellenberg's argument is one of the two live arguments for atheism in academic philosophy today. We answer the other one (evil) with a single essay |
| **Unanswered prayer** | Universal experience; zero pages |
| **Those who never heard** | Standard objection, standard curriculum item, absent |
| **Church abuse and hypocrisy** | The objection with the most emotional force in 2026, and the one most likely to be raised by someone leaving |
| **Deconstruction** | The roadmap's own audience research ranks deconstructing Christians as **segment #2** (42% of US adults). There is not one page addressed to them |
| **Genesis and science** | 45 files mention evolution; none addresses Adam and Eve, the flood, or the age of the earth. Two answer pages touch evolution and neither harmonises the text |
| **Jewish objections to Jesus** | `messianic-prophecy.html` is a flagship essay, and there is no engagement with the counter-missionary case (Singer et al.) that exists specifically to rebut it |
| **Sexuality and gender** | Correctly flagged HOLD-for-human in the backlog. Still the most common first objection a Gen Z reader brings |
| **Buddhism, Hinduism, New Age** | Three religions, roughly two billion people, a handful of passing mentions |

Every one of these was deferred for a defensible reason — higher doctrinal stakes, needs a human,
no backing essay, harder to write. Those reasons were right at the time. Collectively they have
produced a library that is superb at defending propositions and silent on the things that
actually make people leave.

**The evidential case answers the objection a stranger raises. The moral case answers the
objection a believer wakes up with at 3am.** The site's own mission statement is about the second
reader — "strengthen Christians' confidence… never nearer to doubt" — and the library is built for
the first.

---

## 3. What is already world-class (do not touch it)

Worth stating plainly, because the recommendations below are all about gaps and that skews the
picture.

**The review infrastructure is the best thing here and probably the real moat.** Nothing else in
Christian publishing has: a five-stage mandatory pipeline; dual-consensus for high-stakes tiers;
a CI-blocking retired-claims registry so a retracted argument cannot reappear on any surface; a
stamp-integrity checker for certified-then-edited drift; orthodoxy tripwires across the whole
corpus; and a public corrections page. Competitors have editors. This has a *test suite for
doctrine*, and 93 passing tests.

**The per-essay apparatus** — numbered footnotes, real bibliography, verified public-domain source
library, steelmanned objections — is at academic-adjacent quality and far above the category norm.

**The feature layer is finished.** 45 pages: memory palace, flashcards, speed round, debate arena
with voice, AI tutor, coach, objection catcher, argument maps, study groups, reading club,
conversation journal, games, daily mix. Twelve API endpoints. This is more product than most
funded startups ship.

That last point cuts both ways, and leads to the main recommendation.

---

## 4. Recommendations, in order

### ① Stop building features. Build the missing half of the content.

The constraint is not capability, it is coverage. A reader in doubt about the goodness of God
cannot be helped by a memory palace.

**Proposed tier: "The Hard Questions" — 10 essays**, each with a paired answer page and mastery
page, built in the existing format:

1. Why does God allow suffering? *(pastoral companion to `evil.html`, not a second philosophy paper)*
2. Hell — what Christians actually hold, and the range within orthodoxy
3. The Canaanite conquest
4. Slavery in the Bible
5. Divine hiddenness
6. Unanswered prayer
7. Those who never heard
8. Church abuse and the hypocrisy objection
9. Deconstruction — read charitably and answered honestly
10. Genesis and science — Adam, the flood, the age of the earth

**Three of these are harder than anything in the library**, and the difficulty is doctrinal, not
scholarly. Hell, Genesis/Adam, and to a lesser extent the conquest all divide Catholics, Orthodox
and Protestants — which means the denominational-neutrality guardrail binds hardest exactly where
demand is highest. The format that works is the one `library/evil.html` already uses: **present
the range of faithful views, adjudicate none, and be explicit that the range exists.** That is
harder to write than a verdict and is the only version that ships.

**This tier needs the pastoral reviewer more than any content yet written**, because several of
these questions are asked by people in real pain rather than real debate. See ③.

### ② Close the open debt before opening more.

"Always improving" cannot mean a debt list that only grows. Currently outstanding, from
`CLAUDE.md`:

- **Pastoral sign-off on all 67 mastery pages** — `docs/STATEMENT_OF_FAITH.md` still logs the
  reviewer as `_pending_`. Every stamp on the site says the gate is automated.
- `pocket-cards.html`, `flashcards.html`, `explain-it-back.html` — the memorised/recall layer,
  none stamped, none inside `CONTENT_PATTERNS`
- `ev-s7.html` / `ev-s7.mk.html` — ~4,400 words, never gated
- 6 source passages still `verified:false`
- `worldviews.html` Pro tiers are not actually paywalled — owner decision, still open
- `library/evil.html` track-vs-essay mismatch — owner decision, still open

Nothing here is large. All of it is the difference between a site that claims a standard and one
that meets it.

### ③ Get a named human on the masthead.

The roadmap identified this on 2026-07-02 and it is still the sharpest ceiling on the whole
project. `editorial-standards.html` honourably discloses that the reviewers are AI under human
supervision. That honesty is right, and it is also the reason a seminary will not cite this site
and a serious reader will discount it.

One named advisor with a relevant doctorate, listed, who signs the doctrinal tier, changes the
site's category. It is worth more than any ten features and probably more than the Hard Questions
tier, because it is what makes that tier trustworthy on the questions where trust is the whole
product.

### ④ Rebalance, and stop expanding Islam for now.

Seventeen Islam essays is a world-class specialist collection, and it is disproportionate to
almost any real audience. It is also the cluster with the most outstanding doctrinal debt (the
neutrality pass owed on `islam-eternalword.html`, the unverified al-Tabari and Wahb b. Munabbih
citations, `trinity_islam` still needing gates). **Finish it, do not extend it**, and route new
comparative-religion effort to Judaism first — where a flagship essay currently stands unopposed
by the tradition that exists to answer it.

### ⑤ Make "always improving" structural rather than heroic.

Improvement currently happens when a session decides to do it. Three cheap mechanisms:

- **Visible `dateModified` on every essay** — the roadmap notes Perplexity rewards freshness for
  AI-search citation, and it is true anyway
- **A standing quarterly sweep** of one cluster at a time, using the cross-check step the research
  libraries already mandate. The monthly agent Routine was never created — `create_trigger` is now
  reachable
- **Read the PostHog data.** Nine months of events across 34 event types, never reviewed. The
  cheapest available source of truth about which content matters, and nobody has opened it

---

## 5. What I would not do

- **Do not build a Skool community.** Assessed 2026-08-03: the largest Christian communities there
  are 1.5k–15k members, and the median paid community has single-digit membership. The platform
  supplies no demand; the creator does, and we have no following. Partner with the rooms that
  exist instead.
- **Do not add features.** See §3.
- **Do not widen the public "Checked Before Published" claim** past essays until the recall layer
  is stamped. A named standard that overstates is worse than an unnamed one.

---

## Summary

The site has built one half of apologetics to a standard nothing else publicly matches, and has
not yet started the other half. The gap is not quality, breadth of features, or rigour — all three
are ahead of the category. It is that a reader who doubts whether Christianity is *true* is served
better here than anywhere, and a reader who doubts whether it is *good* is served almost not at
all.

Ten essays and a named reviewer would close it.
