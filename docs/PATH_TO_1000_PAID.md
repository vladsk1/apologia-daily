# Apologia Daily — The Path to 1,000 Paid Subscribers

_Research date: 2026-07-02. Synthesis of three parallel research passes: funnel math &
free/paid packaging (grounded in this repo), first-1,000-customers case studies (Hallow,
Truthly, Dwell, She Reads Truth, First 5, Logos, Blinkist, Brilliant, Readwise), and
pricing/trial-design benchmarks. Companion to `docs/NUMBER_ONE_ROADMAP.md` and
`docs/MARKETING_PLAN.md`. **Planning only — nothing here wires payments; every price and
model choice below requires human sign-off before implementation (CLAUDE.md guardrail).**_

## The honest headline

**1,000 paid is an 18–30 month goal, not a 90-day goal.** The 90-day goal once Stripe is
live is **100 founding members** — worth ~$6k at founding pricing, and far more
importantly it replaces every modeled ratio below with real data.

**What 1,000 paid is worth:** roughly **$30K–$130K ARR depending purely on the model
chosen** — Truthly-style $30/yr = $30K; the currently advertised $8/mo-billed-annually =
$96K; a two-SKU model (lower Pro tier + a $149 curriculum/certificate SKU) ≈ $75K on a
smaller base; 1,000 recurring donors ≈ $120K but requires far more traffic to reach.

## The funnel math (Scenario C — hybrid, recommended)

| Stage | Rate (benchmark, cited in research) | Needed for 1,000 net paid |
|---|---|---|
| Cumulative unique visitors | — | **~830,000** |
| Visitor → free signup | ~3.5% (content-site standard 2–5%) | **~29,000 registered users** |
| Signup → paid (freemium + opt-in trial uplift) | ~4.5% ("good" band is 3–5%; the AI limits create honest upgrade moments) | **~1,300 gross subscriptions** |
| Gross → net after churn (annual-heavy mix, ~5%/mo effective) | RevenueCat: annual plans retain 33.9% at 1 yr vs 13.8% monthly | **1,000 net** |

Timeline at a realistic organic curve: **~20–26 months organic-only; ~18–24 with creator
seeding + email + seasonal challenges.** Monthly-only pricing would need ~2,100 gross
(15%/mo churn) — annual-first roughly cuts the acquisition burden by a third.
Sustaining 1,000 means replacing 50–150 cancels **every month, forever** — which is why
the retention roadmap (`/today` loop, auto-seeded flashcards, audio, streak emails) is
revenue infrastructure, not polish.

**Scenarios rejected:** pure freemium with no trial (~1.7M visitors needed; month
33–40); Truthly-style hard paywall (fastest on paper at ~300k visitors, but it's
Truthly's #1 review complaint, it walls the content off from the seekers the ministry
exists for, and it kills the SEO/AI-citation engine — crawlers can't cite what they
can't read).

**Biggest unknown:** current traffic and visitor→signup rate are unmeasured (PostHog
under-instrumented). Re-base this whole model on 30 days of real funnel data — that
instrumentation is already in the NUMBER_ONE_ROADMAP "Now" bundle.

## Recommended model (pending owner sign-off)

1. **All reading free, forever** — `/answers/`, the library essays, Evidence Library
   summaries. Free content is the acquisition engine and the AI-citation moat
   (GotQuestions' whole position is generous-free). Make "what stays free forever" a
   selling point on the pricing page — a stated differentiator vs Truthly.
2. **Pro = the trainer**: unlimited Ask Anything (free: 3/day), daily Debate Arena + all
   opponents + voice (free: 1/week), Coach, mastery tracks (first track free — it IS the
   session-1 activation), full audio library when built (free: ~5 flagship essays),
   in-card deep dives. The gate is *economically honest*: "Pro pays for the AI and keeps
   the library free for everyone."
3. **Never gate**: flashcards/SR/streaks/"Due today" (the habit that later converts —
   Duolingo monetizes around the streak, never the streak itself), Pocket Cards (the
   referral loop), a user's own created cards/progress.
4. **Price in the $6–8/mo effective-annual band** (~$60–96/yr; monthly $9–11). Category
   median annual discount is ~46–50%. This matches what's already advertised.
5. **Trial: opt-in (no card), 14 days** — opt-in converts lower per-trial (~18–25% vs
   ~48% card-up-front) but generates 3–4× more trials and fits a trust-first ministry
   brand; RevenueCat data shows 17–32-day trials convert ~70% better than short ones.
6. **"Request free access" honor path** (the Hallow/Glorify pattern — Hallow gives
   clergy free access and runs "buy one, sponsor one"). On-mission, cheap to build,
   removes the worst PR risk: a doubting seeker blocked from the content meant for them.
7. **Later, a second SKU**: "The Apologia Track" curriculum + certificate at **$99–199**
   — Logos proves this exact audience pays $100–200/yr for *structured serious study*
   (with only a ~17% annual discount) even though devotional apps must discount ~50%.
   Course framing beats app-subscription framing on willingness to pay in this niche.

**⚠️ One recommendation reverses an existing design decision and is explicitly the
owner's call:** the research recommends moving **"The Case, Plainly" above the upgrade
gate (making it free)** — it is the warmest evangelistic on-ramp on the site and
arguably shouldn't be walled. But it was deliberately built as the first *paid* block.
Options: keep it paid (current design); make it free (research recommendation); or free
on a handful of flagship arguments as a sampler. Decide before launch copy is written.

## How the first 1,000 actually get acquired (case-study evidence)

**The five transferable plays, ranked by evidence strength:**
1. **Content-first funnel — never send cold traffic to a paywall.** Blinkist burned 9
   months and nearly died learning this; readers must be captured in "questioning mode"
   via free content first. Our short-form video → free essay → upgrade path is exactly
   this. (Also quantified: web payment forms complete at 44% vs 71% in-app — minimize
   checkout friction, one-click, few fields.)
2. **Founder-led, narrow-niche engagement.** Readwise's founders answered every email
   personally for 3 years; Blinkist's first users came from founder PR and personal
   networks. Personally engage TikTok/Reddit comments, DMs, Ask Anything follow-ups.
3. **Mid-tier creator content-swaps, not cash sponsorships.** Hallow's pre-celebrity
   playbook: invite 10K–100K-follower creators to co-create content on the platform
   (their own series) which they promote to their audience — content-for-reach, not
   cash-first. Our version: invite apologetics creators to debate the AI, curate an
   Evidence Library list, or voice an audio series. Truthly's smaller version (Paul Kim,
   Lila Rose endorsements) confirms it works at bootstrap scale.
4. **Founding-member / mission-investment pre-sale.** Dwell's Kickstarter: 2,262 backers,
   $128,859, **$57 average pledge** — faith audiences pay upfront for a mission, priced
   well above utility. Our version: the founding-member window (below), or a
   "fund the Spanish expansion / next worldview tab" campaign.
5. **Affiliate/promo revenue share with micro-creators.** Christian-space standard:
   5–15% recurring or ~$15–17 flat per converted subscriber. Performance-only — near-zero
   CAC risk. The `?ref=` plumbing already exists in `signup.html`.

**What consistently fails (don't burn money):** cold paid-social straight to a paywall
(CAC per *paying* user ≈ $50–250 vs a sustainable ceiling of ~$15–40 at $8/mo); broad
paid social before the funnel is tuned; celebrity buys before mid-tier traction (Hallow
earned the Super Bowl ad with years of compounding first); copying First 5's launch
(100K downloads in 2 days rode a pre-existing ministry list we don't have); hard paywall
on an unknown brand in a trust-sensitive category (Truthly: ~50K downloads total, modest
growth).

**Channels with cost signals:** podcast host-reads ~$15–25 CPM in this niche (proxy);
church/B2B2C tiers exist (Study Gateway: churches from $79.99/mo) but no public proof of
volume — treat as later experiment. Web-only is a real but survivable tax (~33% relative
drop at trial start vs app stores), partly offset by keeping the full margin (no 15–30%
store cut); invest the difference in checkout friction reduction.

## Trust bugs to fix BEFORE charging anyone (verified in repo)

1. **Dead trial button** — `index.html` advertises "Start 7-day free trial" with no
   checkout behind it.
2. **Contradictory limits** — pricing page says Ask Anything "1 AI question per week";
   `ask-anything.html` banner says "3 free questions a day"; the actual code checks 3
   *per week*. A paywall that miscounts is a trust wound.
3. **The Pro gates are cosmetic** — all "paid" card content is fully served in the HTML;
   `isPro = true /* TEMP */` everywhere. The real Supabase check is already written and
   commented out in every `ev-m-*.html` — flip it when Stripe is live.
4. **Stale copy** — "83 more arguments" banner in `ev-s1.html`; "Full video library
   (coming soon)" promised on the paid card. Remove promises we can't keep.
5. **No revenue analytics** — add `paywall_viewed`, `trial_started`, `trial_converted`,
   `subscription_cancelled {reason}` via the existing `window.adTrack`.

## The 90-day launch sequence (once Stripe is approved and live)

**Prerequisites:** pricing decision signed off; pastoral sign-off on the Case tier
(standing debt, esp. Trinity/Islam); Stripe + real `isPro` wiring; trust bugs fixed;
paywall events instrumented; `RESEND_API_KEY` set.

- **Days −30 to 0 — announce with gratitude.** Email + dashboard notice: "Everything you
  can read stays free, forever. On [date] the practice tools become Pro — Pro pays for
  the AI and keeps the library free for every seeker." Every existing beta account gets
  **30 more days of full Pro as a thank-you** (they've had Pro free — never punish the
  loyal cohort; never lock anything a user created).
- **Days 1–14 — founding members (existing users only).** Founding annual price
  **locked for life** (~$49–59/yr vs $96 list — real permanent benefit, honestly limited
  to the pre-launch cohort). Target: 100. Channels: email + dashboard banner only.
  (Founding-forever pricing yes; *lifetime one-time* deals no — they cannibalize
  15–20% of would-be subscribers and block future pricing moves.)
- **Days 15–45 — public launch.** Rebuilt pricing section (annual-first: "$96/yr — less
  than one apologetics book"; "what stays free forever" block); 14-day opt-in trial;
  gates actually enforced; launch channels in order: answers/Islam SEO CTAs → share
  loop → first 5–10 creator codes via `?ref=`.
- **Days 46–90 — loops + learning.** Trial lifecycle emails (day 0 welcome, day 3 value
  story, **day 13 plain "trial ends tomorrow" reminder** — the anti-dark-pattern move);
  first win-back cohort; tie the next seasonal challenge to a Pro trial ("do the 40 days
  with the Coach"); A/B the two best paywalls (post-debate panel vs Ask limit banner);
  **re-base the whole model on 90 days of real PostHog data.**
- **Decision gate at day 90:** founding members < 40 and trial→paid < 10% → the problem
  is value perception or price; fix packaging before spending on acquisition. ≥ 100 →
  the model holds; scale acquisition per `docs/MARKETING_PLAN.md`.

## Conversion surfaces (all mapped to existing files)

Best moments already built: the **post-debate upgrade panel** (`debate-arena.html` —
user just scored 61/100 and *feels* the need for reps) and the **Ask Anything limit
banner**. To build/wire: pricing section rebuild (`index.html`), dashboard guided-journey
day-7 upsell → trial (not dead `#pricing`), in-card gate copy naming exactly what's paid
(deep dive + tutor) and what's free (the full essay — link it), trial emails via Resend,
and a one-click cancellation flow with a single respectful save offer (pause or free
tier — never a maze), exit survey feeding analytics.

## Open decisions only the owner can make

1. **The model itself**: paywall vs donations vs the recommended hybrid (paid Pro + free
   reading + request-free-access). Mission question as much as revenue.
2. **"The Case, Plainly" free vs paid** — research says free (it's the on-ramp); current
   design says paid. Reverses an explicit design decision; owner's call.
3. **Founding-member pricing** ($49–59/yr locked-for-life proposal) and timing.
4. **501(c)(3) / nonprofit structure** — gates tax-deductible giving and grant
   eligibility (GotQuestions: $1.58M/yr from 6,000+ donors as a nonprofit); a legal
   decision outside any growth plan.
5. **Pastoral sign-off** on the Case tier before any paid acquisition (standing
   CLAUDE.md debt).
