# Funnel events & PostHog funnels (Tier-1 growth work, 2026-07-21)

Companion to `MARKETING_PLAN.md`. Records the analytics events wired into the site so the
activation / referral funnels can be **built in the PostHog UI** (funnels are a dashboard
step, not code). Everything below is emitted via `window.adTrack(name, props)` (defined in
`analytics.js`, which forwards to PostHog).

## New events added this pass

| Event | Where it fires | Props | Why |
|---|---|---|---|
| `ai_answer` | `index.html` homechat — every successful `/api/ask` answer | `{source:'homechat', loggedIn}` | Volume of the on-landing AI aha |
| `first_ai_answer` | `index.html` homechat — first ever answer for this browser (localStorage `ad_first_ai_answer`) | `{source:'homechat'}` | **The activation "aha."** The single event the landing redesign is meant to move |
| `homechat_wall_hit` | `index.html` `hcShowLimit()` — visitor hits the free-question limit | `{loggedIn}` | The moment to convert to signup / (later) Pro |
| `share_click` | every `/answers/*` page — user taps "Share this answer" | `{slug}` | Numerator of k-factor; the share is now tagged `?utm_source=share&utm_medium=answer&utm_campaign=<slug>` |
| `shared_answer_viewed` | every `/answers/*` page — load with `?utm_source=share` | `{slug}` | Denominator side of the referral loop: a shared link actually got opened |

Already present before this pass (verified live): `campaign_landing`, `scroll_depth`,
`read_complete`, `faq_viewed`, `ask_click`, `signup_submit`, `signup_completed`, and the
`pwa_*` / `push_*` suites (incl. the new `pwa_ios_install_offered/_dismissed`).

## The 3 funnels to build in PostHog (UI step — do this in the dashboard)

1. **Activation (land → aha → signup)**
   `campaign_landing` → `ask_click` → `first_ai_answer` → `signup_completed`
   - Watch: does lifting the homechat above the fold + repointing the hero CTA raise
     `campaign_landing → first_ai_answer`?

2. **Signup → habit (retention)**
   `signup_completed` → (D1) `first_ai_answer`/`ask_click` → (D7) any practice event → (D30) return
   - Use PostHog retention/cohorts; this is the D1/D7/D30 view.

3. **Referral loop (share → view → signup)**
   `share_click` → `shared_answer_viewed` → `signup_completed`
   - k-factor ≈ `shared_answer_viewed` per `share_click`; conversion = signups attributed to
     `utm_source=share` (PostHog can filter on the `$current_url` utm params).

## Still-missing events (next pass, lower priority)

Scattered across other files, deferred to keep this batch tight:
`streak_incremented` (coach.js / dashboard), `review_completed` (today.html),
`first_debate_started` (debate-arena.html), `share_to_signup` (attribution stitch — mostly
achievable in PostHog from the utm params without new code).

> Note: the pricing / paywall funnel (`upgrade_clicked` → checkout → paid) is intentionally
> **not** wired here — it belongs to the Stripe work landing this week, which owns the
> `#pricing` CTAs, the dashboard upgrade buttons, and `isPro` gating.
