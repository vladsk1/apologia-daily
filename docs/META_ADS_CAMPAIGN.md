# Meta ads campaign — creative, copy, and the buy

**Written 2026-09-01.** Companion to [`META_ADS_PLAN.md`](META_ADS_PLAN.md) (2026-07-28), which answered
*should we spend and what must be true first*. **That document's verdict still stands and this one does
not overturn it.** This document answers the questions it left open: **what to say, what to show, and
how to structure the buy** — plus three corrections that the intervening five weeks have forced.

**Currency: AUD throughout**, stated because `META_ADS_PLAN.md` is in GBP and CLAUDE.md records that its
figures *assume* USD. Benchmark sources publish in USD; conversions here use ≈1 USD = 1.55 AUD and are
marked. The AUD-vs-USD product decision is still open (CLAUDE.md, OPEN items).

**Basis for every number:** repo figures were measured on 2026-09-01 by counting the source of truth
(named at each point). Market figures are cited to their source and are third-party medians, not our
data — they are marked as such, because we have never run a Meta ad and have nothing of our own.

---

## Part 0 — Three corrections to `META_ADS_PLAN.md`

These change the plan's conclusions, so they come first.

### ① The learning-phase wall is roughly half as tall as we recorded

`META_ADS_PLAN.md` builds its central "you cannot afford to optimise for conversions" argument on Meta's
**50 conversions per week** learning threshold. Multiple 2026 sources report Advantage+ campaigns now
exiting learning at **25 conversions/week**, explicitly framed as making AI campaigns reachable for
smaller advertisers.

That halves the wall. At a A$25 cost per signup, 25/week is **A$625/week ≈ A$89/day** — a number a
serious test could reach — where the old plan's arithmetic implied roughly A$570/day. It does **not**
make the campaign profitable (the LTV problem is untouched), but the old plan's "this is arithmetically
impossible at any budget you would spend" is now too strong.

⚠ **Verify this in Ads Manager before relying on it.** It is a secondary source. Meta does not publish
learning-phase thresholds prominently and they vary by optimisation event. **Free to check:** create a
draft campaign, set the event, and read what the delivery estimate says. Twenty minutes.

### ② Costs rose sharply, and the direction is against us

2026 all-industry Meta medians: **CPM ≈ US$14.19 (≈A$22), CPC ≈ US$0.78 (≈A$1.21), CPA ≈ US$38 (≈A$59)**,
CTR 1.5–2.2%. Year on year that is **CPM +20.1%, CPC +11.4%, CPA +38.1%**.

Two things pull our numbers below those medians: **nonprofit CPC runs ≈58% below market** (≈US$0.36 ≈
A$0.56), and **education CPA averages ≈US$8 (≈A$12)**. Two pull against: **education CTR is 0.73%**,
less than half the all-industry average, attributed to narrow low-intent audiences — which is exactly
our shape; and we cannot use the nonprofit ad-account benefits without being a registered nonprofit.

**Plan on A$0.80–1.50 per link click.** Anything better is upside.

### ③ The existing ad creative is real, and none of it is gated

`META_ADS_PLAN.md` says the creative advantage is the 54 reel specs. Since then a session built
**`tools/reel/gen_adcard.py`** — a proper feed-ratio creative generator (4:5 / 1:1 / 9:16, same brand
furniture as the X card, and with a deliberate no-app-store-badge rule) — plus **four ad-card specs in
`tools/reel/adcards/`**. This is further along than the plan records.

But, measured 2026-09-01:

| | count |
|---|---|
| reel specs total | **61** |
| reel specs gated (dated `argument` + `orthodoxy`) | **58** |
| ad-card specs in `adcards/` | **4** |
| ad-card specs gated | **0 — none carries a `reviewed` block at all** |

And `adcards/library-checked.json` advertises **"85 cited deep dives. 102 short answers. 133 primary
sources"**. The true figures are **92 / 110 / 156**. It was written against a snapshot and never
updated — the same drift `tools/update-trust-numbers.mjs` exists to prevent on the site, with no
equivalent guard over `adcards/`.

**Nothing in `adcards/` may run until it is gated.** CLAUDE.md puts reel specs and X cards inside the
mandatory pipeline; ad cards are the same class of object and are the one that gets *paid* distribution.

---

## Part 1 — The constraint nobody has written down: Meta's "you" rule

**This is the single highest-value finding in this document, and it is not in any existing repo file.**

Meta's Advertising Standards prohibit ads that **assert or imply personal attributes** — including
"direct or indirect assertions or implications about a person's religion or beliefs." The most common
way advertisers trip it is **second-person pronouns combined with a protected attribute**: the
violation is not the topic, it is assigning the trait to the reader through "you."

The permitted form is explicit: **you may discuss the category in the abstract, or describe who the
product is for — you may not assign the trait to the reader.**

For an apologetics product this governs almost every natural line we would write. Applied to the current
inventory:

| Existing copy | Risk | Why |
|---|---|---|
| `give-a-reason.json` — **"Give a reason / for the hope you have."** | 🔴 **High** | Second person + assigns *the hope* (a religious belief) to the viewer. This is the textbook shape. |
| `ad-answer-if-asked.json` — **"Could you answer / if they asked?"** | 🟠 **Medium** | "You" plus an implied faith the viewer would be defending. Contextual rather than explicit, but automated review is pattern-based. |
| `what-apologia-daily-is` reel — **"Someone asked. / You froze."** | 🟠 **Medium** | Implies the viewer was asked why *they* believe. |
| `x-what-apologia-daily-is` card — **"Know the reason for the hope you have."** | 🔴 **High as an ad** | Fine as an organic X post. As paid copy it assigns the hope to the reader. |
| `library-checked.json` — **"The internet has answers. / Ours are checked."** | 🟢 **Clean** | No second person, no attribute. Describes the product. |
| `arguments-that-hold.json` — **"Some arguments don't hold. / We'll tell you which."** | 🟢 **Clean** | "You" is absent; "we'll tell you which" assigns nothing. |

**Two of the four existing ad cards, and the reel I built this session, carry the risk. Two are already
clean.** That is not a coincidence — the two clean ones are the two written about *the product* rather
than *the reader*.

### The rewrite pattern

Move the subject from the viewer to the situation, the product, or a third party. It costs almost
nothing in persuasive force and it removes the rejection risk entirely.

| Risky | Compliant |
|---|---|
| "You froze." | "The room goes quiet." |
| "You just weren't carrying them." | "Most people were never handed them." |
| "Give a reason for the hope you have." | "A reason for the hope — set out in full." |
| "Could you answer if they asked?" | "The questions that stop a conversation dead." |
| "Know why you believe." | "Where the answers actually come from." |

⚠ This is a **risk assessment, not a legal determination.** Meta's automated review is opaque and
inconsistent, and ads in this shape are sometimes approved. But a rejection on a young ad account is
expensive — `META_ADS_PLAN.md` already flags account survival as the reason not to run the Islam
cluster, and the same logic applies here. **Run the compliant variants; keep the second-person versions
for organic, where the rule does not apply.**

---

## Part 2 — The creative problem, measured

`docs/INSTAGRAM_GROWTH_STRATEGY.md` records the retention curve across 5 organic reels / 713 views:
**100% → under 10% within about three seconds, then a flat line.**

Set that against the 2026 benchmark. Cold-feed hook rate (3-second views ÷ impressions) runs **18–28%,
median 22–23%**; Reels run **24–36%**; and **below 20% is described as "basically invisible."**

**So our measured opening performance is at roughly a third to a half of the floor.** That is the finding
that should govern the whole buy. Two consequences:

1. **Do not run a conversion campaign first.** Paying to send traffic through an opening that loses 90%
   in three seconds is buying the same failure at a higher price.
2. **The flat tail is the good news, and it is genuinely good.** The 5–7% who clear second three
   *finish*. The arguments work. The opening does not. That is a fixable problem and a cheap one.

**One reel already beat the field:** *"One question → a death sentence"* — 10s average watch, **11.9%
watch-through, roughly double every other reel.** It is the only one that opens a curiosity gap rather
than making an assertion. That is the template, and the campaign should be built to confirm or refute it
with money rather than with 713 organic views.

---

## Part 3 — What to run: static vs reel

**Run both, and expect the static to win at this budget.** Reasoning, in order:

1. **A static needs no watch time.** Our whole measured deficit is in the first three seconds. A 4:5
   card delivers its full message in one impression, so it routes around the exact failure we have.
2. **`gen_adcard.py` already produces the right asset** — 1080×1350 default, which is the
   best-performing feed ratio, with brand furniture matching the X cards.
3. **The reels are the wrong length.** Measured across the 61 specs, the six recommended ad topics run
   **31.0–52.9s**. `META_ADS_PLAN.md` and the Instagram strategy both call for 20–30s. Trimming is
   re-compressing gated content and **needs a re-gate**, which is the expensive path.
4. ⚠ **`gen_reel.py` still has no 4:5 output.** `ASPECTS` at line 83 is `vertical / square / wide`.
   `gen_card.py` already added `portrait: (1080, 1350)`; `gen_reel.py` did not. One line, no re-gate,
   and it unlocks the best feed ratio for video.

**Placement split:** 4:5 statics → Feed. 9:16 reels → Reels + Stories. Do not let Advantage+ placements
stretch a 9:16 into feed; it crops the captions, and captions are the entire message in a silent creative.

---

## Part 4 — The copy

Six angles. Each is **policy-compliant under Part 1** (no second-person + attribute), each rests on a
claim the repo supports, and each is written to a different buyer motivation. Copy is drafted here;
**every line still owes the gate before it runs** (Part 7).

### Angle 1 — Verifiability. *Our actual differentiator.*

> **Primary:** Most apologetics content asks for trust. This library shows its work. Every historic
> quotation is checked word for word against the original, and every essay carries a dated record of the
> reviews it passed.
> 92 cited deep dives. 110 short answers. Free to read, no account needed.
>
> **Headline:** Checked before published
> **Description:** 92 cited essays. Free.

*Why it should work:* it is the one claim no competitor in this category makes, it is true, and it is
verifiable by the reader in one click. It is also the claim our own reviewers have repeatedly had to
narrow — which is itself the proof.

### Angle 2 — The curiosity gap. *The template our best organic reel established.*

> **Primary:** Around AD 112 a Roman governor offered Christians a way out: curse Christ, and go free.
> The records of what happened next survive — on papyrus, and in the letters of men who had no reason to
> flatter the church.
> The full account, every source cited, free at Apologia Daily.
>
> **Headline:** What the early church actually faced
> **Description:** Sources, dates, and the sceptics' replies.

⚠ Requires `the-weakest-link-held` reel spec to clear its gate (currently `_pending_`).

### Angle 3 — The named objection. *Highest search-intent match.*

> **Primary:** "Jesus never even existed." It is the one claim almost no working historian defends — Bart
> Ehrman, an agnostic, calls it fringe.
> The evidence, laid out with every source cited and the strongest counter-arguments answered in full.
> Free to read.
>
> **Headline:** Did Jesus really exist?
> **Description:** The evidence, every source cited.

*Pairs with:* the gated `did-jesus-really-exist` reel.

### Angle 4 — Honesty as the hook. *Counter-positioning.*

> **Primary:** Some apologetics arguments do not hold up. This library says which ones, and why.
> Confidence that survives the pushback — because nothing in it was overstated in the first place.
> 92 cited deep dives. Free.
>
> **Headline:** Some arguments don't hold
> **Description:** We'll tell you which.

*Ported from the existing `arguments-that-hold.json` card, which is already policy-clean.* This angle is
uniquely defensible for us: the repo is full of retired claims we removed on our own initiative, so the
claim is not marketing.

### Angle 5 — The situation, not the reader. *The compliant rewrite of the strongest emotional angle.*

> **Primary:** A question lands in the middle of a conversation, and the room goes quiet. Not because
> there is no answer — because nobody was carrying one.
> Apologia Daily is where the answers live: 92 cited deep dives, 110 short answers, and an assistant
> that names its sources as it answers.
> Free to start.
>
> **Headline:** The answers, ready to hand
> **Description:** 92 cited essays. Start free.

### Angle 6 — The small group. *The only angle with a business model behind it.*

> **Primary:** Running a small group, a youth group, or a homeschool co-op? Apologia Daily has study
> plans, shared progress, and 92 cited deep dives — so the hard questions get a real answer instead of
> a deflection.
> Free to start.
>
> **Headline:** For groups that ask hard questions
> **Description:** Study plans and shared progress.

⚠ `META_ADS_PLAN.md` names the **A$99/yr group licence** as the one thing that would make paid
acquisition solvent: one group leader is worth 20–60 individual free signups. **That offer does not
exist yet.** Run this angle only to measure whether group-shaped demand responds — never implying a
product we cannot sell.

### Copy rules for any new variant

- **No second person plus a religious attribute** (Part 1). This is the hard one.
- **No claim the repo does not support.** The gates blocked three in one session on the brand reel
  alone, including a five-stage review claim true of only 31 of 92 essays.
- **Never imply purchase** while `isPro` is hardcoded `true` and `video-library.html:720` advertises a
  dead "$8/mo" — `META_ADS_PLAN.md` blocker 3: Meta disallows ads whose landing page is misleading.
- **Lead with the answer, not the objection** — the SHORT-FORM ANSWER RULE applies to ad copy as much as
  to `/answers/*`. A front-loaded concession in an ad is worse, not better: there is no body text to
  recover it.

---

## Part 5 — Targeting

Detailed targeting **exclusions** were removed from ad sets on 31 March 2025 and from boosted posts on
10 June 2025, and from **15 January 2026 any ad set still relying on removed options stopped delivering
entirely.** Religion targeting has been gone since 19 January 2022. So:

**You cannot target Christians. Plan the creative to do the qualifying.**

This is the strongest argument for Angles 2 and 3: a named objection or a historical hook self-selects
the interested reader in the first line and costs nothing to show to everyone else.

1. **Interest-stacked ad sets while volume is low**, broad/Advantage+ only once conversion volume
   supports it. `META_ADS_PLAN.md` is right that most guides get this backwards.
2. **Verify the interest taxonomy yourself — 20 minutes, free.** Type the candidates into the Ads Manager
   audience tool and screenshot what returns. Every published list is unverifiable secondhand and the
   taxonomy changes silently. Candidates are listed in `META_ADS_PLAN.md` §Targeting.
3. **No lookalikes yet** — they need Pixel behaviour, and there is no Pixel. **Do not upload the Supabase
   member list** (that plan's reasoning holds and is a trust judgement, not a performance one).
4. **Geography:** for hook-rate ranking only, run lower-CPM English-speaking markets in a *separate*
   campaign, excluded from every future audience, and never read conversion data from them.

---

## Part 6 — The buy

### Phase 1 — Creative-signal test. A$600, 14 days. **Run this one.**

**Objective:** Traffic (link clicks). Not conversions — there is no conversion event worth optimising to,
and pretending otherwise trains the algorithm on noise.

**What you are buying:** a ranking of angles and formats by **hook rate and CTR**, which transfers to the
organic Instagram work, to creator outreach, to YouTube, and to any future paid campaign. It is the one
purchase that is worth making before the four triggers are met.

| | |
|---|---|
| Structure | 1 campaign · 2 ad sets (Feed-static / Reels-video) · 3 ads each |
| Budget | A$45/day × 14 days ≈ A$630 |
| Ad set A — statics | Angles 1, 4, 5 as 4:5 cards via `gen_adcard.py` |
| Ad set B — reels | Angles 2, 3 + the brand reel, 9:16 |
| Expected volume | at A$0.80–1.50/click ≈ **420–790 clicks** |
| Read | hook rate per creative; CTR; cost per click; landing-page bounce |

**Do not read signup numbers from this.** With no Pixel there is no attribution, and the sample is far
too small. If a variant's hook rate clears 20% it is worth building on; below 15%, kill it.

### Phase 2 — Conversion test. Do not run yet.

Gated on `META_ADS_PLAN.md`'s four triggers, all still open, all re-verified on disk today:

1. ❌ **Live conversion path** — `isPro` hardcoded `true` (`explain-it-back.html:310`,
   `debate-arena.html:1054`); Stripe unwired.
2. ❌ **An offer worth ≥A$45 LTV** — the A$99/yr group licence is the candidate and does not exist.
3. ❌ **Pixel + CAPI live 30 days** — and installing a Pixel makes `privacy.html:203` false
   (*"We do not use advertising cookies or third-party tracking cookies"*), with no consent mechanism
   for UK/EU traffic. **Owner decision, and weight the trust cost higher than a normal SaaS would.**
4. ❌ **Signup friction** — email + password + confirm + confirmation email, **no OAuth anywhere**.
   That plan's judgement stands and is worth repeating: *adding Google/Apple sign-in is worth more than
   every targeting decision in this document combined.*

### What this costs if it teaches us nothing

A$630 and two weeks. Stated plainly because it is a real possibility: at this budget a 3-way creative
test will rarely reach 95% significance, so treat the output as **directional ranking, not proof.**
Meta's own A/B test tool gives cleaner reads than eyeballing across ad sets — use it.

---

## Part 7 — What must happen before a single dollar is spent

In order. The first three are free and are worth doing whether or not we ever advertise.

1. **Read the nine months of PostHog.** 34 events, never reviewed. **You cannot set a target CPA without
   knowing the organic landing→signup rate.** Every benchmark in this document is a third-party median
   our own data would replace for nothing.
2. **Gate the four `adcards/` specs and fix the stale counts.** None carries a `reviewed` block; one
   advertises 85/102/133 against a real 92/110/156. Add a `reviewed` block to each, run argument +
   orthodoxy, and record the result — same discipline as the reel specs.
3. **Verify the interest taxonomy and the learning threshold in Ads Manager.** 20 minutes, no spend.
4. **Gate the new copy in Part 4.** It is doctrinal content under paid distribution — the highest-stakes
   compression on the site. Not one line of it has been through a gate.
5. **Decide the landing page.** `apologiadaily.com` (homepage: AI chat + trust strip) is the strongest
   cold destination. **Not `/join`** — that is the study-group invite page.
6. **Add `"portrait": (1080, 1350)` to `gen_reel.py:83`.** One line, no re-gate.

### Still binding, and nothing here lifts it

`META_ADS_PLAN.md`'s **do-not-run list** — the whole Islam cluster and, with lower heat, the JW/Mormon
cluster — stands unchanged, on ministry, account-survival and brand grounds in that order. None of the
angles above touches it, and none should.

---

## Part 8 — A competitor's ad, torn down (added 2026-09-01)

The owner captured a **sponsored Instagram Reel** for **Memorise.bible** — a Bible-memorisation app —
in the wild. It is the single most useful artefact in this document, because it is a real Christian app
buying installs in the exact channel, placement and format this plan proposes.

### What could and could not be established

⚠ **Read this before using anything below.** The app itself has **no findable public footprint**: it does
not appear in app-store search results, in any 2026 "best Bible memory apps" roundup, or in any press.
Separately, **this environment's network policy blocked every primary source** — `memorise.bible`,
`apps.apple.com`, `play.google.com`, `remem.me` and `faith.tools` all returned egress denials, confirmed
against the proxy status endpoint. So:

- **First-hand and high confidence:** everything visible in the screenshot itself.
- **Search-snippet sourced, not verified against the primary:** every category figure below.
- **Not established at all:** Memorise.bible's own downloads, ratings, revenue, pricing, or developer.

**The absence is itself the finding.** An app with zero organic footprint running paid installs is buying
its first users — the same position Apologia Daily would be in. Its ad showed **10 likes**, which is
consistent with a small or very new campaign.

### The ad, feature by feature

| Element | What they did | What it tells us |
|---|---|---|
| **Format** | A single phone mockup on plain white, showing the real UI — a "Select Verses" grid of all 66 books | **Product demo, not narrative.** No talking head, no scene sequence. The whole message lands in one frame with no watch-time required — which is exactly the argument in Part 3 for statics over reels at low budget. |
| **Headline** | **"Know the Bible by Heart"** — four words, elegant italic serif, top of frame | ⭐ **This is a better headline than the one I wrote for us, and it is safer.** It is an imperative with **no second person and no attribute assigned to the viewer**, so it clears the Part 1 "you" rule cleanly, while our `"Know the reason for the hope you have."` does not. Four words, one benefit, zero setup. |
| **Caption** | Opens with a Scripture quote — *"Humbly receive the implanted word, whic… more"* (James 1:21) | The verse **is** the hook. No sales sentence, no feature list above the fold. It self-selects the audience Meta can no longer target by religion — precisely the workaround Part 5 argues the creative has to perform. |
| **CTA** | A green **"Download"** button | App-install objective. Not available to us: `ios/` and `android/` are scaffolded but unsubmitted, so our CTA stays the website. |
| **Placement** | Reels tab, `Sponsored` label | Matches our own organic data, where **79.7% of reach came from the Reels tab**. |

### The category, and the number that should change a decision

Search-sourced; primaries unreachable.

| App | Scale | Price |
|---|---|---|
| **Remember Me** (Poimena, Switzerland) | **2.2M downloads** across both stores | **Free forever** — open source, no ads, no premium tier. 44 languages, 284 translations |
| **The Bible Memory App** / ScriptureTyper | **2M+ users, 30M+ verses memorised** | Free tier, or **$9.99/year**; lifetime plans |
| **Versify** | **35,000+ monthly users**, 700,000+ verses memorised | — |
| **Verses** | — | **$4.99/yr** basic, **$9.99/yr** pro |
| **MemoryVerses** | — | Free; 6 practice methods, 7 games, family accounts |

🔴 **The pricing anchor is the finding that reaches outside this document.** The category leader has
**2M+ users at US$9.99 a *year*** and the download leader is **free forever**. Apologia Daily's
provisional **$8 a *month*** is roughly **12× the annual price** of the most successful paid app in an
adjacent Christian-app category.

⚠ **This is an adjacency argument, not a like-for-like one, and it should not be over-read.** Memorisation
is a utility with near-zero marginal content cost; we publish gated long-form scholarship, which is
genuinely more expensive to make. Hallow and Glorify charge US$70–90/yr and sustain it. But it is a real
data point on what Christians in the app market are *conditioned* to pay, and the pricing/currency
decision is still open (CLAUDE.md, OPEN items). It belongs in that decision.

### Features worth taking — and the one I was wrong about

**⚠ Checked against the repo before claiming anything, and my first instinct was wrong.** I assumed
spaced repetition would be our gap. It is not: `flashcards.html:586` already implements **SM-2**, with
`reps`/`interval` mastery tracking at `:507` and the schedule persisted to the account.

Genuine gaps, in order of value:

1. **Audio and speech recognition — a real absence.** Zero hits for `SpeechRecognition`,
   `SpeechSynthesis` or audio across `flashcards.html`, `explain-it-back.html` and `palace.html`. The
   category leader's paid tier is built on **speech recognition and audio recording**. For us the
   equivalent is obvious and better: `explain-it-back.html` already grades a typed explanation — letting
   a reader *say* the argument aloud is nearer to the actual use case, since the product's whole premise
   is a conversation. ⚠ It is also a content-gate surface: whatever a grader marks is a rubric, and this
   repo has already recorded a case where 67 pages scored a reader's own words with a fabricated mark.
2. **The book-grid selector is a genuinely good pattern.** All 66 books, one tappable screen, no scroll,
   no search box. Our equivalent — 8 categories and 92 essays — is currently reached through tabs and a
   hub. A single dense grid is worth prototyping for the library index; it is presentation-only, so it
   costs no gate.
3. **Family accounts** (MemoryVerses) map directly onto the **A$99/yr group licence** that
   `META_ADS_PLAN.md` names as the only offer that makes paid acquisition solvent. `study-groups.html`
   already has the group infrastructure; what is missing is the *packaging*, not the plumbing.

**Not worth taking:** first-letter mode. It is the category's core mechanic and it suits verbatim recall
of a fixed text. Our unit is an *argument*, where the point is that the reader can reconstruct it in their
own words — `explain-it-back.html` is already the right shape, and a first-letter scaffold would train the
wrong skill.

### The one line to steal

**"Know the Bible by Heart."** Not the words — the *shape*: **a four-word imperative naming a benefit,
assigning nothing to the viewer.** Ours in that shape would be *"Know why the faith holds"* or
*"Answer the hard questions"* — both policy-clean under Part 1, both shorter than anything in Part 4.
Any such line is doctrinal compression and owes the gate before it runs.

---

## Sources

Market figures are third-party medians, not our data.

- Meta for Business — [Preparing for Upcoming Removal of Certain Ad Targeting Options](https://www.facebook.com/business/ads/review-policy-guidelines) (religion removed 19 Jan 2022)
- Meta Transparency Center — [Privacy Violations and Personal Attributes](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes) (the "you" rule)
- Meta Transparency Center — [Advertising Standards](https://transparency.meta.com/policies/ad-standards/)
- [Meta detailed targeting removed: what works in 2026](https://pixelmovers.co/blog/meta-detailed-targeting-removed-what-works-2026) (exclusion-removal dates; 15 Jan 2026 delivery stop)
- [Advantage+ 2026 updates](https://benly.ai/learn/meta-ads/advantage-plus-updates-2026) (25 conversions/week — ⚠ verify in Ads Manager)
- [Meta ads benchmarks 2026: CPM, CPC, CPA by industry](https://www.get-ryze.ai/blog/meta-ads-cost-benchmarks-by-industry-2026)
- [Thumbstop rate: 18–28% Meta hook benchmark](https://www.adsights.ai/resources/glossary/metrics/thumbstop-rate-tsr)
- [Facebook Ads CPC benchmarks for nonprofit](https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click/nonprofit)
- [12 advanced Meta ads strategies profitable brands use in 2026](https://www.modernmarketinginstitute.com/blog/12-advanced-meta-ads-strategies-that-profitable-brands-are-using-in-2026) (creative testing order; refresh cadence)

Part 8 — the competitor teardown. ⚠ Every one of these was reached only through **search snippets**; the
primary pages are blocked by this environment's egress policy, so no figure below was verified against
the source. Re-check them from an unrestricted session before acting on the pricing argument.

- [Remember Me — Bible memory app](https://www.remem.me/) (2.2M downloads; free forever, open source) — *primary blocked*
- [The Bible Memory App](https://biblememory.com/) (2M+ users, 30M+ verses; $9.99/yr) — *primary blocked*
- [Verses](https://www.getverses.com/) ($4.99/yr basic, $9.99/yr pro) — *primary blocked*
- [7 best Bible memory apps for 2026, compared](https://www.biblememorygoal.com/memory-methods/best-bible-memory-apps/)
- [faith.tools — Bible memory apps](https://faith.tools/bible-memory) — *primary blocked*
- **Memorise.bible** — the app in the captured ad. **No findable public footprint**; `memorise.bible` is
  egress-blocked here. Nothing about it is established beyond what the screenshot shows.
