# How to launch the ad test — a one-page checklist

**Scope.** This is the click-by-click runbook for the *only* paid spend
`docs/META_ADS_PLAN.md` endorses today: **Option 1, a creative-signal test.**
You are **not** buying signups. You are buying a ranking of which creatives and
which audiences earn the cheapest attention, so you're ready the day there is
something to sell. Read `META_ADS_PLAN.md` for the *why*; this file is the *how*.

> ⚠ **This runbook assumes NO Meta Pixel.** That is deliberate and it is what
> keeps the test clean (see §Privacy). The moment a Pixel is added, this file no
> longer applies and the four triggers in `META_ADS_PLAN.md` must be met first.

---

## Privacy — the finding, and why nothing needs editing yet

A no-Pixel test sets **no advertising cookie on our site**. Meta serves the ad
and counts views/clicks on *its* platform; a visitor who clicks arrives via a
normal link. So the live sentence in `privacy.html` §7 —

> "We do not use advertising cookies or third-party tracking cookies."

— **stays true, and must not be changed for this test.** Editing it now to
permit advertising cookies would make the policy falsely claim tracking we do
not do. **Leave it exactly as it is.**

**Staged for the day a Pixel is ever installed** (do NOT apply before then, and
never without also shipping a cookie-consent banner for UK/EU/AU visitors):

> *Replacement for the §7 sentence:* "With your consent, we use the Meta Pixel
> and similar advertising technologies to measure the effectiveness of our ads
> and to show them to relevant audiences. You can decline these at any time
> through our cookie settings; declining does not affect your use of the site."

That wording is doctrinally neutral but it is a **legal** change — have the
owner (and ideally a lawyer, given AU + UK/EU exposure) approve it, not a gate.

---

## Before you open Ads Manager (one-time setup)

- [ ] **Facebook Page** exists for Apologia Daily (a Page, not a personal profile).
- [ ] **@apologiadaily Instagram** linked to the Page in Meta Business Suite.
- [ ] **Meta Business Suite** account created (business.facebook.com), payment
      method added. Currency set — **owner is in Australia**, so this bills in
      **AUD**; the £ figures below are ~**A$1.9/£**, i.e. £10/day ≈ **A$19/day**.
- [ ] **UTM tags** on every destination link (this is the only hard prerequisite):
      `https://apologiadaily.com/?utm_source=meta&utm_medium=paid&utm_campaign=signal_test&utm_content=<creative-name>`
      PostHog already captures UTMs, so this is how you read results without a Pixel.

---

## Build the campaign (Ads Manager → Create)

**Campaign level**
- [ ] Objective: **Video views / ThruPlay** if running the reels;
      **Traffic** if running the static ad-cards. **Never** Sales or App
      Promotion — there is no Pixel and no app.
- [ ] Advantage campaign budget: **off** (you want to compare ad sets by hand).

**Ad-set level**
- [ ] Budget: **£10/day (~A$19)**, run **21–30 days** → total **£210–300 (~A$400–570)**.
- [ ] Audience: **interest-stacked, NOT broad.** Below ~50 conversions/week
      broad is a money furnace (plan §Targeting.1). First, spend **20 minutes in
      the audience tool** typing these and screenshotting what returns:
      *The Chosen · C.S. Lewis · Lee Strobel · Tim Keller · N.T. Wright · Bible
      Gateway · YouVersion · Christianity Today · Alpha Course · Jordan Peterson ·
      Alex O'Connor · philosophy of religion · church history · biblical archaeology.*
- [ ] Age 25–55, English. (Meta removed religion targeting in Jan 2022 — you
      reach this audience through the interest proxies above, not a "Christian" checkbox.)
- [ ] Placement: **Manual → Reels + Stories only** (cheapest inventory).
- [ ] ⚠ **Exclude** Muslim-majority and religiously-tense markets (ministry +
      brand-safety reason in the plan). If you add cheap-CPM English markets to
      buy more impressions, run them as a **separate campaign** you never read
      conversion data from.

**Ad level**
- [ ] Upload creative. Test **two at once, same audience**:
      `give-a-reason` vs `library-checked` (the two positive cards), **or** the
      two lengthened reels. Give each a distinct `utm_content`.
- [ ] Primary text: the copy already written for each creative.
- [ ] Destination: the UTM link above.
- [ ] Publish → Meta review (a few hours).

---

## Read it / kill it (don't "optimise")

| | Threshold |
|---|---|
| **Success (video)** | 3-sec-view ≥ **25%** and ThruPlay ≥ **8%** on ≥2 creatives |
| **Success (static)** | CTR (link) ≥ **1%** / CPC at or below market on ≥2 creatives |
| **Kill a creative** | below **15%** 3-sec-view (or <0.5% CTR) after **8,000 impressions** — pause it, do not tweak it |
| **What you learn** | which hook + which audience is cheapest. **Not** whether clicks convert — that needs a Pixel and a product, i.e. Option 2 |

⚠ **Honest limit (plan's words):** paid hook-rate is *interruption*; organic
hook-rate is *recommendation*. The transfer is ~60–70% correlated. This is a
creative lab, not an acquisition channel.

---

## Do NOT

- [ ] Upload the Supabase member list as a custom audience. Handing an
      apologetics site's member emails to an advertising company sits badly
      against `privacy.html`; behavioural on-site audiences are the only
      acceptable seed, and those need a Pixel (i.e. later).
- [ ] Map any Meta conversion event to `signup_completed` — it fires **before**
      email confirmation, so it would optimise toward people who abandon.
- [ ] Read this as permission to start Option 2. That still needs the four
      triggers in `META_ADS_PLAN.md` and a paywall decision.
