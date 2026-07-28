# Meta ads plan — verdict, prerequisites, and a costed test

*Companion to [`MARKETING_PLAN.md`](MARKETING_PLAN.md) (whole-funnel strategy) and
[`SOCIAL_GROWTH_PLAN.md`](SOCIAL_GROWTH_PLAN.md) (organic IG + X).*

**Written 2026-07-28.**

Research by `apologia-growth`; every repo-level claim was independently re-verified against the
working tree before being written down (see *Verified facts* at the end).

> 📄 **Want the short version?** [`GROWTH_PLAN_SIMPLE.md`](GROWTH_PLAN_SIMPLE.md) — one page, plain
> English, covering Instagram, X and ads together, with **A$20/day and A$100/day modelled**.

---

## Verdict: don't spend yet. The blocker is arithmetic, not tooling.

The missing Meta Pixel is a one-day fix and is **not** the reason to hold. Two things are:

1. **The unit economics don't close at any plausible Meta CAC** — and wouldn't close even if Stripe
   went live tomorrow.
2. **`privacy.html` currently promises users the opposite of what a Pixel does.**

**One-line answer: Meta is not our acquisition channel. It is a cheap creative lab now, a
retargeting tool at app launch, and a real channel only if we build a higher-value offer to sell
into it.**

---

## ⚠ Currency note — read before using any number below

**All figures below are in pounds sterling (GBP)**, because the cost-side benchmarks (CPM, CPC, CPL)
come from 2026 **UK** Meta data, which is the best-documented set available. **The site is operated
from Australia** (`privacy.html`), so none of these are in the owner's home currency.

**The `$8` price is treated as USD** in the LTV table (converted at ~£6.30). ⚠ **This is an
assumption, not a fact from the repo:** `index.html:1408` renders a bare `$8` with no currency code,
and there is no `USD`/`AUD`/`currency` marker anywhere in the codebase. **If `$8` means AUD, every
LTV figure below is ~35% too high** (A$8/mo vs. ~A$12.40 for US$8/mo) — i.e. the case against
spending gets *stronger*, not weaker.

Indicative AUD restatement (approximate rates ~2.0 AUD/GBP, ~1.55 AUD/USD — **verify against live
rates before quoting**):

| | CAC | LTV (conservative → heroic) |
|---|---|---|
| If `$8` = USD | ~A$60–120 | A$3 → A$36 |
| If `$8` = AUD | ~A$60–120 | A$1.92 → A$23 |

Learning-phase wall in AUD: ~**A$570/day/ad set (~A$17,000/month)** to optimise to signup;
~A$6,000/month for the proxy-event version; ~A$420–600 for the Option 1 creative test.

**The verdict is currency-invariant** — CAC-vs-LTV is a ratio, so converting both sides consistently
doesn't change the conclusion. Only the absolute budget figures move.

**Separate live issue this surfaced:** a bare `$8` on the pricing card is ambiguous to *readers*, not
just to this document — an Australian visitor reads AUD, an American reads USD. Harmless while
nothing can transact; a billing-expectation problem the day Stripe goes live. **Owner decision:
which dollar?**

---

## The arithmetic

**Cost side** (2026 UK benchmarks, Reels-heavy buy — where our creative fits):

| Step | Assumed rate | Cumulative |
|---|---|---|
| CPM (UK Reels £5.50–9) | £9 | £0.009/impression |
| Outbound CTR (good video) | 1.2% | £0.75/click |
| Landing-page-view rate | 80% | £0.94/LPV |
| LPV → asks a question (`first_ai_answer`) | 8–20% | **£4.70–11.75 per aha** |
| aha → *confirmed* signup | 10–25% | **£19–118 per signup** |

Planning range: **£30–60 per confirmed signup**, wide error bars. (Sanity check: the 2026
all-industry Facebook CPL is ~$27.66 — and that's for on-platform lead forms, which convert far
better than a website signup behind a double opt-in.)

**Value side**, at the currently advertised $8/mo (~£6.30):

| Scenario | Free→paid | Months retained | LTV | Net at £40 CAC |
|---|---|---|---|---|
| Conservative | 3% | 8 | £1.51 | **−£38** |
| Optimistic | 8% | 18 | £9.07 | **−£31** |
| Heroic | 12% | 24 | £18.14 | **−£22** |

Then knock 15–30% off any app-originated subscription for Apple/Google's cut.

**Every scenario is underwater by 2×–26×.** Breaking even at £40 CAC would need roughly £28/month
pricing at heroic conversion — not an appropriate price for this ministry.

### The learning-phase wall

Meta needs ~50 optimisation events per ad set per week. Minimum daily budget = target CPA × 50 ÷ 7.

- Optimising to **confirmed signup** at £40 CPA → **£286/day/ad set = £8,600/month for one ad set.**
  Out of reach; the ad set stays permanently "Learning Limited," which means delivery never optimises
  and CPA sits at the bad end of the range.
- Optimising to **`first_ai_answer`** at £7 → £50/day/ad set. Two ad sets = **£3,000/month.** Reachable,
  but not a small budget, and it buys upper-funnel events rather than users.

So the choice is binary: either ~£3,000/month to optimise toward a proxy event, or no statistically
meaningful conversion test at all. **There is no middle setting where a small budget produces
trustworthy conversion data.**

### The "build an audience ahead of launch" argument — and why it fails

The strongest case for spending anyway is seeding a retargeting pool and a lookalike source before
the app ships. It doesn't survive contact:

**A retargeting pool is built by the Pixel, not by the budget.** Install the Pixel, spend £0, and the
pool fills from existing organic and SEO traffic. Spend only buys *speed* — and there is no launch
date to be early for (Apple/Play accounts not created, iOS Archive never run, account deletion never
tested against live Supabase).

Lookalike seeds need 100 users minimum and 1,000–5,000 for quality. **Count `auth.users` before
planning any lookalike** — under 500 and it isn't viable, which is an independent reason to wait.

### Spend when all four are true

1. **A live conversion path** — Stripe wired with a real `isPro`, or a live app in at least one store.
   Something a click can become.
2. **An offer worth ≥£30 LTV** (see below).
3. **Pixel + CAPI live and verified for ≥30 days**, so Meta has signal on day 1 of spend.
4. **Signup friction reduced.** Today it's email + password + confirm-password + a confirmation email,
   with **no OAuth at all** — verified: `signInWithOAuth` appears nowhere in `login.html` or
   `signup.html`. Cold paid traffic dies at a double opt-in. **Adding Google/Apple sign-in is worth
   more than every targeting decision in this document combined.**

### The real lever

**If paid acquisition is ever going to work here, the fix is the offer, not the ads.** A **£99/yr
church / small-group / homeschool-co-op licence** turns a £40 CAC from a 20× loss into a same-quarter
profit. The infrastructure already exists — `study-groups.html`, `join.html`, and the "bring it to
your small group" kit sketched as move #7 in `MARKETING_PLAN.md`. One group leader is worth 20–60
individual free signups. **That** is an audience Meta can be bought for.

*Pricing/packaging decision — owner sign-off required.*

---

## Blockers found in the repo

### 1. Trust/legal — the Pixel contradicts a written promise

`privacy.html:202` says, verbatim:

> "We may use cookies for authentication purposes (to keep you logged in) and for basic analytics.
> **We do not use advertising cookies or third-party tracking cookies.**"

Installing the Pixel makes that sentence false. There is also **no cookie consent mechanism anywhere
in the repo** (verified: zero hits for `cookieconsent`, `cookie-banner`, `acceptCookies`,
`consent-banner`), while the site declares it is operated from Australia and serves UK/EU visitors
where PECR/UK-GDPR require *prior* consent for non-essential advertising cookies.

Pixel installation therefore requires, in order: a privacy-policy amendment, a consent mechanism for
UK/EU traffic, and a decision that the owner is comfortable putting Meta's tracking on a site whose
entire brand asset is trustworthiness. **Given the audience — seekers, doubters, people asking about
faith — weight the trust cost higher than a normal SaaS would.** Owner decision, not an agent decision.

### 2. Measurement defect — `signup_completed` fires too early

`signup.html:200`:

```js
window.adTrack && window.adTrack('signup_completed', {
  referred: !!referredBy,
  confirmed: !!(data && data.session)     // false whenever email confirmation is on
});
```

It fires at form-submit success, **before email confirmation**. Map that to Meta's
`CompleteRegistration` and **Meta will optimise toward people who abandon at the confirmation email** —
we'd be paying to find non-users.

**✅ FIXED 2026-07-28.** `dashboard.html` now emits **`signup_confirmed`** on first authenticated load —
the true conversion event. Two guards, both deliberate: a per-user `localStorage` key so a returning
user can't re-fire it, and a **7-day `created_at` window** — without which shipping the event would have
fired it for *every existing user* on their next visit and manufactured a false conversion spike in
exactly the data this fixes. `signup_completed` stays as a form-completion metric and now carries an
in-place warning against mapping it to `CompleteRegistration`. Guarded by `tests/signup-conversion-event.test.mjs`.
**Use `signup_confirmed` for the CAPI mapping, never `signup_completed`.**

### 3. Landing-page policy risk today

`index.html` advertises "$8 / planned price · launching soon" with a "Coming soon" badge on a flow
that cannot transact, while `isPro` is hardcoded `true`. The page is honest about it, which is good —
but Meta disallows ads whose landing page is misleading or non-functional. **Never run an ad whose
copy implies purchase while that's the state.**

---

## Measurement prerequisites, in strict order

**Steps 0–2 cost nothing and are worth doing whether or not we ever advertise.**

**0. Read the nine months of PostHog we already have.** Build three funnels: `campaign_landing` →
`first_ai_answer` → `signup_completed{confirmed:true}` → `onboarding_completed`; signup → D1/D7/D30;
`share_click` → `shared_answer_viewed` → signup. **You cannot set a target CPA without knowing the
organic conversion rate.** Every benchmark number above is an estimate our own data would replace for free.

**1. UTM discipline — zero code, highest value.** `analytics.js` already captures
`utm_source/medium/campaign/content/term` + `ref` + referrer into `campaign_landing`. Append to every
ad URL:

```
?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

This is Meta-independent ground truth, and it works today.

**2. ~~Fix `signup_completed`~~ ✅ DONE 2026-07-28** — `signup_confirmed` now exists (see blocker 2).
⚠ It only fires for accounts created after the fix shipped, so it has **no history**: PostHog funnels
covering earlier periods must still use `signup_completed` **filtered on `confirmed: true`**.

**3. 🛑 Owner sign-off gate: privacy policy + consent.** Do not proceed past here without an explicit decision.

**4. Business Manager + domain verification** — use the **DNS TXT** method, not the meta-tag method
(the tag would mean touching all 317 `<head>` blocks; the nav is single-sourced but `<head>` is not).
Note: Meta removed the 8-event AEM limit and the prioritisation requirement in June 2025, so the old
"pick your 8 events" ritual no longer applies.

**5. Pixel** — home is `analytics.js` (loads on every page, and already has the `?nocount=1`
self-exclusion the Pixel should respect so owner traffic doesn't pollute the retargeting pool).

**6. Conversions API via PostHog, not Vercel.** PostHog ships a first-party Meta Ads Conversions
destination. This matters concretely: **Vercel Hobby caps us at 12 functions and we are at the cap** —
a hand-rolled CAPI endpoint would force another `?do=` fold. The PostHog destination is server-side and
needs no new client code.

**Event map:**

| Meta event | Source | Role |
|---|---|---|
| `Lead` | `first_ai_answer` | **Optimisation workhorse** — 5–15× the volume of signup; the only event that makes 50/week affordable |
| `CompleteRegistration` | `signup_confirmed` (new) | True conversion. Report on it; don't optimise to it until volume supports it |
| `ViewContent` | `read_complete` | Retargeting-pool quality signal |
| `Purchase` | — | **Doesn't exist. Do not create a placeholder.** |

**The proxy-metric trap, named:** optimising to `first_ai_answer` finds people who ask a question,
not people who sign up. Guard it — watch `first_ai_answer → signup_confirmed` weekly against the
organic baseline. **If the paid ratio is under half the organic ratio, Meta is buying tourists and the
campaign stops, however good the CPA looks.**

**7. Don't send email addresses.** `analytics.js` deliberately withholds user email from PostHog
("do NOT ship the user's email (PII) to a third-party analytics vendor"). Sending hashed emails to
*Meta* is a materially larger step. Launch CAPI with `fbp`/`fbc`/IP/UA only, accept lower match
quality, use `event_id` deduplication between Pixel and CAPI. Customer-list upload is a separate
owner decision — **recommendation: no.**

**8. Set the ATT expectation before spending.** Even with CAPI, expect 15–30% under-reporting of iOS
web conversions plus modelled data with delay. Standing rule: **trust PostHog for truth, trust Meta
for optimisation, never try to reconcile them.**

---

## Targeting after the religion removal

**Verified:** Meta removed "religious practices and groups" detailed targeting (alongside health,
sexual orientation, political beliefs, race/ethnicity) on **19 January 2022**. It has not been
reversed. Separately, Meta later removed the religion/politics fields from Facebook profiles, so the
underlying data is thinner too.

1. **Broad + Advantage+ is right in principle, wrong for our budget.** Broad needs a dense conversion
   signal; below ~50 conversions/week it's a money furnace. Use interest-stacked ad sets while volume
   is low, graduate to broad only if volume supports it. Most guides get this backwards.
2. **Adjacent non-sensitive interest proxies.** Every published list of "interests that still work" is
   unverifiable secondhand and the taxonomy changes silently — so **the definitive next step is free:
   20 minutes in the Ads Manager audience tool typing candidate terms and screenshotting what
   returns.** Candidates: *The Chosen* · C.S. Lewis · Lee Strobel · Tim Keller · N.T. Wright · Bible
   Gateway · YouVersion · Christianity Today · Zondervan · Thomas Nelson · K-LOVE · Hillsong /
   Elevation Worship · Alpha Course · **Jordan Peterson** and **Joe Rogan** (closest proxy to the
   "young men from the podcast funnel" segment) · Alex O'Connor · philosophy of religion · theology ·
   church history · biblical archaeology · ancient history.
3. **Lookalikes from Pixel behaviour, not from the email list.** Seed 1–3% LALs from on-site value
   audiences (`first_ai_answer` firers, `read_complete` on essays). **Do not upload the Supabase
   member list.** Behavioural on-site audiences are what a user would reasonably expect; handing an
   apologetics site's member emails to an advertising company is not, and it sits badly against
   `privacy.html`. LAL quality is somewhat lower; the trust cost is zero. That trade is correct here.
4. **Geography — useful tactic, severe caveat.** For *hook-rate ranking only*, lower-CPM
   English-speaking markets buy 5–10× the impressions per pound. Run them in a **completely separate
   campaign**, exclude them from every retargeting audience and lookalike seed, and never read
   conversion data from them. **Additionally, exclude Muslim-majority and religiously-tense markets
   entirely** for anything touching Islam — a harm and backlash judgement before it is a policy one.

---

## Creative — our genuine advantage

54 gated specs render via `gen_reel.py` as **silent, fully-captioned** MP4 (1080×1920 / 1080×1080 /
1920×1080), plus `gen_card.py` statics at 1080×1350. Silent-with-burnt-in-captions is exactly right
for Meta, where most feed video is watched muted.

**Two small gaps, no content change:**
- `gen_reel.py:83` has no 4:5 option — verified: `ASPECTS = {"vertical", "square", "wide"}`. Adding
  `"feed": (1080, 1350)` is one line and needs no re-gate. 4:5 is the best-performing feed ratio.
- The specs end on an `apologiadaily.com` text card. Fine for web ads; wrong for a future App Install campaign.

### Keeping the gating cost near zero

CLAUDE.md is unambiguous — *"There is no such thing as content too small to gate,"* naming reel specs
and social cards explicitly. So:

- **An unchanged, already-stamped spec run as an ad = near-zero gating cost.** This is the whole advantage.
- **A hook cut is a NEW content artifact and needs a re-gate.** Dropping scenes changes what the piece
  concedes and whether the verdict lands — a cut that opens on the objection and stops before the answer
  is exactly the front-loaded-concession defect the SHORT-FORM ANSWER RULE exists to catch, and for any
  rival-worldview cut it breaks the EXPLICIT-VERDICT RULE.
- **Ad copy is new written content** in the house voice → gate it.

**Recommendation: for the first test run only UNCUT, already-stamped specs.** Accept slightly worse
hook performance for zero content risk and zero gating labour. Gate cuts later, only for topics that win.

### First six topics

Chosen for curiosity gap in ≤2s, no prior belief assumed, doctrinally robust when compressed, low policy risk:

1. `who-made-god` — universal, non-tribal, philosophically neutral opening
2. `did-jesus-really-exist` — highest search intent, hostile-source framing
3. `why-were-women-the-first-witnesses` — counterintuitive, narrative, travels furthest
4. `paul-the-enemy-who-switched-sides` — story shape, no doctrine needed to follow
5. `is-the-universe-fine-tuned-for-life` — reaches beyond the base (guardrail already in the spec: data
   conceded, design contested — never "scientists agree the universe is designed")
6. `did-the-church-invent-jesus-divinity-at-nicaea` — high search intent, myth-busting shape

**Tier 2:** `can-we-trust-the-new-testament-manuscripts` · `how-soon-did-people-say-jesus-rose` ·
`was-jesus-copied-from-pagan-myths` · `arent-there-contradictions-in-the-bible` · `did-the-disciples-hallucinate`.

### Do NOT run as paid ads

The whole **Islam cluster** (`is-the-quran-corrupted`, `was-the-quran-perfectly-preserved`,
`why-uthman-burned-the-other-qurans`, `was-jesus-a-muslim`, `was-jesus-a-muslim-evidence`) and, with
lower heat, the JW/Mormon cluster. Three reasons, in order of weight:

1. **Ministry.** Paid distribution puts a refutation of Islam in front of Muslims who did not seek it.
   That is categorically different from an essay someone *chose* to open. Our own EXPLICIT-VERDICT and
   FALSE-COMMON-GROUND rules require the verdict to land plainly — right for a reader who came asking,
   but in a 15-second interruption it reads as bare polemic stripped of the charity that makes it right.
   **The Islam module is a real moat — an organic-search and chosen-reader moat, not a paid-interruption one.**
2. **Account survival.** Ad review is automated, and religiously-critical content aimed at a protected
   group is exactly the shape that triggers restriction. On a young account that can be effectively
   permanent — and would cost the entire channel, including the app-launch campaign we actually want it for.
3. **Brand.** Paid reach on this content invites brigading that makes us look like an attack channel
   rather than an answer channel.

### Discipline

3–6 creatives per ad set; refresh when frequency exceeds ~2.0 or the 3-second-view rate falls.
**At these budgets there is exactly one variable: test *topic*, hold format constant.** Cross-testing
hooks × topics can't be afforded and would produce noise we'd then act on.

---

## The costed plan

### Option 1 — the only spend I'd endorse today: a creative-signal test (£200–300)

**Not an acquisition campaign.** You are buying a *ranking of our 54 topics by hook strength*, which
transfers to the organic IG/X work, to creator outreach, to YouTube, and to future paid.

| | |
|---|---|
| **Budget** | £10/day × 21–30 days = **£210–300** |
| **Objective** | ThruPlay / video views — deliberately **not** conversions; needs no mature Pixel |
| **Structure** | 1 campaign · 1 ad set (broad, 25–55, English) · 6 uncut stamped reels, vertical |
| **Placement** | Reels + Stories only (cheapest inventory) |
| **Prerequisite** | UTM tags. Pixel optional at this stage |
| **Success** | 3-sec-view rate ≥25% and ThruPlay ≥8% on at least 2 of 6 |
| **Kill** | Any creative below 15% 3-sec-view after 8,000 impressions — pause it, don't "optimise" it |
| **Gating cost** | ~0 (uncut stamped specs) + one ad-copy set through argument + orthodoxy |

**Honest limit:** paid hook-rate is interruption; organic hook-rate is recommendation. The transfer is
partial — maybe 60–70% correlated. It's still the cheapest creative lab available.

### Option 2 — the real conversion test, once the four triggers are met

| | |
|---|---|
| **Budget** | £50/day/ad set × 2 ad sets × 30 days = **£3,000** |
| **Objective** | Leads, optimising `Lead` (= `first_ai_answer`) |
| **Structure** | Advantage+ campaign budget **OFF** (we need per-ad-set reads) · **A:** interest stack · **B:** 1–3% LAL from the `first_ai_answer` value audience · 6 creatives each |
| **Destination** | `/` — the homepage AI chat gives 3 free questions before the wall, so there's a real value moment before any signup ask |
| **Success @ 30d** | Cost per `first_ai_answer` ≤ £7 **and** paid `first_ai_answer→signup_confirmed` ≥ 50% of the organic baseline |
| **Kill @ 14d** | Cost per `first_ai_answer` > £12, or either ad set still Learning Limited |
| **Kill @ 30d** | Cost per confirmed signup > £45, or downstream ratio < 50% of organic |
| **Retargeting** | Add a third ad set (£15/day) only once the pool exceeds 2,000 |

### What it costs to learn nothing — stated plainly

- **£600 over 30 days** buys ~66,000 impressions, ~800 clicks, **10–20 signups**. Detecting a
  difference between 5% and 7.5% conversion at 80% power needs ~1,100 observations *per arm*. You will
  never get there. **£600 buys a hook-rate ranking of 6 creatives and literally nothing else** — spend
  it expecting a conversion read and you have paid £600 for noise you will then mistake for a finding.
- **£3,000 over 30 days** buys one statistically shaky read on an upper-funnel proxy event. Not a
  trustworthy signup CPA.
- **Optimising to signup is arithmetically impossible for us:** £8,600/month for one ad set.

---

## Compliance

**1. Personal attributes — the rule most likely to bite.** Meta prohibits ad copy that asserts *or
implies* a person's religion. Banned patterns: "As a Christian, you…" · "Struggling with your faith?"
· "Are you a believer who…" · "Doubting your faith?" · "Your church…" · "Muslims: the truth about…"

The compliant pattern is **describe the content, not the viewer**:
- ✗ "Meet Christian parents here" → ✓ "The historical case for the resurrection, in ten minutes."
- ✓ "Seventy-seven fully-cited essays on the hardest questions about Christianity."

**Good news: our house voice — serious, warm, no hype, no second person — is already compliant by
construction.** The style guide is the policy-safe style.

**2. Special Ad Categories.** Religion is **not** one — religious content can be advertised freely.
But "Social Issues, Elections or Politics" **is**, and it catches immigration, education policy,
healthcare and social-cause advocacy. Getting flagged means identity verification, a "Paid for by"
disclaimer, and **losing lookalike targeting in that ad set**. Our content is mostly historical and
philosophical and should be clear — keep anything from the moral/cultural end out of paid.

**3. Account-restriction risk.** Review is automated (~24h) and repeated violations restrict accounts.
**The most expensive available mistake is losing the ad account before the app launch.** Verify
business and domain early; start with the safest six creatives to build account history; don't appeal
repeatedly and aggressively; never run the Islam/JW/Mormon cluster on a young account.

**4. Data/privacy.** UK GDPR + PECR require prior consent for the Pixel, and Meta's Business Tools
Terms put the notice-and-consent obligation on the advertiser. With the site operated from Australia,
the Privacy Act 1988 (Cth) also applies. **Legal item — owner sign-off.**

---

## Needs owner sign-off

| Item | Why |
|---|---|
| Amending `privacy.html:202` ("we do not use advertising cookies") | Legal + a direct promise to users |
| Adding a consent mechanism for UK/EU traffic | Legal |
| Whether to put Meta tracking on this site at all | Brand/trust judgement |
| Pricing/packaging — especially a group/church licence | Touches money |
| Uploading any member email list to Meta | Recommendation: **no** |
| Any spend at all | Money |

---

## Corrections this makes to `MARKETING_PLAN.md`

| Claim in the plan | Status |
|---|---|
| "PostHog is live but only ~5 events; no `signup_completed`" | **Stale — wrong.** Verified: `signup_completed` exists (`signup.html:200`) and there are **34 distinct events** |
| Move #1 "instrument the funnel" | **Reframe:** instrumentation is largely done. The gap is that **nobody has read the data** |
| Move #2 "repoint the hero CTA off dead `#pricing`" | **Done** — hero is now "Ask Your Hardest Question" → `#homechat` |
| "Deprioritise paid ads (no working checkout)" | **Confirmed and strengthened** — not "not yet"; structurally underwater at $8/mo |

---

## Verified facts (re-checked in the working tree 2026-07-28)

| Claim | Result |
|---|---|
| `signup_completed` exists, fires pre-confirmation | confirmed, `signup.html:200` |
| `privacy.html` promises no advertising cookies | confirmed, line 202, verbatim |
| No OAuth anywhere in signup/login | confirmed — 0 hits for `signInWithOAuth` |
| No cookie consent mechanism in the repo | confirmed — 0 hits |
| `gen_reel.py` has no 4:5 aspect | confirmed, line 83 |
| PostHog distinct event count | **34** |
