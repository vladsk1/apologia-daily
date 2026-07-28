# Apologia Daily — Growth & Marketing Plan
*Proven strategies, modeled on proven apps, grounded in what the site already has.*

> 📄 **Short version of everything:** [`GROWTH_PLAN_SIMPLE.md`](GROWTH_PLAN_SIMPLE.md) — one page, plain English.
>
> **Companion plans (2026-07-28).** Two channel-specific plans now sit alongside this one:
> **[`SOCIAL_GROWTH_PLAN.md`](SOCIAL_GROWTH_PLAN.md)** (organic Instagram + X) and
> **[`META_ADS_PLAN.md`](META_ADS_PLAN.md)** (paid). Both correct facts that were stale here — see
> the ⚠ notes below. The single biggest correction: **the site links to no social profile from any of
> its 319 pages** — including an Instagram account that DOES exist (owner-confirmed 2026-07-28) — so
> the organic plan starts by wiring the links, not by optimising posts.

## The one-sentence strategy
Win **organic search + creator-driven word of mouth** among people who are *already asking the questions our 77 essays answer* — then convert them with the free AI tool and keep them with the spaced-repetition daily habit we've already built. Concentrate, instrument, compound. (Paid ads and original video production are deliberately *later*.)

## Why now (the tailwind)
The "aggressive atheism" era is over; Gen Z spiritual curiosity is rising (Barna: 54% express curiosity). Wesley Huff went 1,200 → 450,000 YouTube subs in a month after Joe Rogan (Jan 2025). Christian–Muslim debate is the most viral interfaith content online. Our differentiators line up perfectly: a **steelman-first ethos** (exactly what doubters say apologists never do) and a **rare-depth Islam module** (13+ essays) almost no one else publishes free.

---

## Who we're targeting (5 segments)
1. **Doubting/deconstructing Christians (18–30)** — TikTok, r/Deconstruction, YouTube. Convert with intellectual honesty ("here's the *strongest* version of your objection…").
2. **Young men from the Rogan/podcast funnel (18–35)** — YouTube, X, Spotify. Convert with evidence-first, non-churchy, "cold-case detective" framing.
3. **Christians in Muslim dialogue (all ages)** — YouTube debate, TikTok. Our Islam module is a genuine competitive moat.
4. **Parents arming kids against campus atheism (35–55)** — Facebook groups, Christian podcasts. Motivated, will pay later.
5. **Skeptics/seekers mid-investigation (any age)** — Google search. Best CTA is "read the full argument," not "sign up."

---

## The 7 highest-leverage moves (do these first)
Ranked by impact ÷ effort for a small team with no live payments.

| # | Move | Type | Effort | Models |
|---|------|------|--------|--------|
| 1 | ⚠ **SUPERSEDED — instrumentation is largely DONE.** There are now **34 distinct PostHog events**, `signup_completed` among them (`signup.html:200`). The real gap is that **nobody has read nine months of data.** Replacement move: build the three funnels in `META_ADS_PLAN.md` §B step 0. (One live defect: `signup_completed` fires *before* email confirmation — see that plan.) | Measure | S | Duolingo (metric-driven growth) |
| 2 | ⚠ **DONE.** Hero CTA is now "Ask Your Hardest Question" → `#homechat` | Activation | S | Brilliant (free-tool aha) |
| 3 | **`/answers/` SEO push** — title = exact Google question, FAQ schema, two-way internal links to essays + AI chat | Acquisition | S | GotQuestions (13M visits/mo, ~58% organic) |
| 4 | **Creator sponsorships** — 5–10 apologetics YouTubers (10K–200K), free access code + 60-sec end-of-video mention, per-creator landing URL | Acquisition | S | Brilliant; Wesley Huff funnel |
| 5 | **Post-completion share prompt** — auto-surface a Pocket Card ("You just defended the Kalam — share it") after flashcards/debate/explain-it-back; instrument the existing "send to a skeptic" loop | Referral | S | YouVersion verse images (1.8M in weeks) |
| 6 | **Streak-defense push** at ~8:30pm to users with a 3+ day streak who haven't trained today, naming the count + a weekly leaderboard | Retention | S | Duolingo (streaks = top retention lever) |
| 7 | **"40 Questions Before Easter" Lent challenge** — a named 40-day Study Plan + a free "bring to your small group" PDF/QR kit, emailed to pastors/campus ministers/homeschool co-ops | Acquisition+Retention | S–M | Hallow (parish challenge playbook) |

Do **#1 and #2 this week** — #1 is the precondition for honestly judging everything else; #2 is the single highest-confidence change (right now the main "Begin Your Journey" button sends first-time intent to a pricing page that can't even transact).

---

## Channels — concentrate, don't spread
- **Primary: Organic search on `/answers/` + the Islam cluster.** Content already exists; this is optimization, not creation. The Islam essays ("is the Quran corrupted," "how to answer tawhid") are low-competition with real, growing volume — make them the 90-day SEO priority. Metric: *organic activated sessions* (not raw traffic).
- **Secondary/compounding: the share loop** ("send this to a skeptic" + share cards). Every shared answer is zero-cost distribution to exactly the right person. Metric: *k-factor* and *share→signup*.
- **Catalytic: creator mentions** (move #4) — the highest-intent audience there is.
- **Deprioritize for now:** paid ads (no working checkout), broad low-intent posting, original podcast/video production (compete *through* creators, not against them).

### Organic social, by platform (what's working in the niche)
> ⚠ **Superseded for Instagram and X by [`SOCIAL_GROWTH_PLAN.md`](SOCIAL_GROWTH_PLAN.md)**, which
> starts from the fact that no page links to a social profile (the existing Instagram account
> included). Two specifics below are now outdated: X is no
> longer thread-first (long single posts and replies out-perform threads), and the "ten ready content
> briefs" assume scripting is needed — all **54 reel specs are already gated**, so distribution, not
> production, is the bottleneck.
- **TikTok / Reels / Shorts:** 45–90s, pattern-interrupt in 1.5s, cuts every 2–3s, claim in first frame. 3–7×/week. Model: Wesley Huff, Testify, Inspiring Philosophy, CrossExamined, GodLogic (Islam). 75% of Shorts views are from non-subscribers → discovery engine.
- **YouTube long-form:** our 77 essays are ready-made 20–40 min scripts. The "hostile sources only" and debate formats travel.
- **Reddit/X:** value-first; r/Christianity, r/DebateAChristian, r/DebateReligion (Islam), r/Apologetics, r/OpenChristian. Build comment credibility for weeks *before* ever linking. X: 7–10 tweet evidence threads.

### The reusable hook bank (apply to any essay)
Hostile Witness ("Ehrman isn't a Christian, yet he says…") · Counterintuitive Reversal · Threshold Question ("you don't have to trust the Bible first — just: did this man rise?") · Hostile Expert's Concession (fine-tuning) · Investigator's Frame (cold case) · The Dilemma (Islam) · The Rule Change ("resurrection using only hostile sources") · Embarrassment Test (women at the tomb) · Historian's Standard ("better-attested than Caesar") · Question Behind the Question.

### Ten ready content briefs (highest reach first)
1. "The man who tried to destroy Christianity became its greatest defender" (Paul) → `paulconv.html`
2. "Even atheist historians agree Jesus existed" (Ehrman) → `hist_jesus.html`
3. "The Quran says the Bible is true. That's a problem." (Islamic Dilemma) → `islam-dilemma.html`
4. "The evidence that convinced a homicide detective" → `minimalfacts.html`
5. "Why women? The detail that proves it wasn't invented" → `emptytomb.html`
6. "An atheist physicist admits the fine-tuning is 'embarrassingly precise'" → `finetuning.html`
7. "What a Roman governor's letter tells us about the first Christians" (Pliny) → `hist_jesus.html`
8. X thread: "5 facts even atheist historians accept about Easter" → `minimalfacts.html`
9. "I let an AI ask me the hardest questions about Christianity" (demo the Ask-Anything tool) → ask-anything
10. Long-form: "The case for the resurrection using *only* hostile sources" → resurrection cluster

Start with **1, 2, 5, 9** (broadest reach, lowest production) + **3** as a dedicated Islam series.

---

## Fix the funnel (so the traffic converts)
Apologia Daily has a *content/feature surplus* and a *measurement/sequencing deficit*. Almost nothing here is new building — it's pointing existing CTAs at the right next step and instrumenting what exists.
- **Activation aha (first 5 min):** "I asked my hardest question and got a serious, sourced answer in seconds." Pull the homepage AI chat above the fold; carry context into the signup wall ("create an account to keep asking — we'll save this conversation"); capture the "Where do I start?" intent and route the first 7 days to it.
- **Retention ritual:** make **"Due today"** the single daily destination across dashboard + push + weekly email; offer the push bell *at the aha moment*, not passively; keep streak freezes gentle (never shame).
- **Referral:** add "send to a skeptic" to `/answers/` and mastery pages too; build a *curated, orthodoxy-checked, indexable* "best answers" gallery (keep raw user shares `noindex`).

## Measurement — exact events to add (PostHog `adTrack` one-liners)
- **Activation:** `signup_completed {ref}` (the #1 missing event), `onboarding_intent_selected {path}`, `homechat_question_asked`, `homechat_wall_hit`, `first_ai_answer`, `first_debate_started`, `first_review_done`
- **Retention:** `streak_incremented {count}`, `review_session_started {due}`, `review_completed`, `devotional_opened`, `push_open`, `email_click`
- **Referral:** `share_initiated {method}`, `shared_answer_viewed`, `shared_answer_cta_click`
- **Build 3 funnels:** Landing→ask→signup→first_review; signup→D1→D7→D30; share→view→signup.

---

## 90-day plan
**Days 0–30 — Measure & fix the top of funnel.** *Move: activation rate.* Add events + signup_completed; repoint hero/arena/CTA off dead `#pricing`; pull chat above fold; start `/answers/` + Islam SEO; soften the non-functional "7-day free trial" button (integrity).
**Days 31–60 — Close the loops.** *Move: D7 retention.* Instrument retention+referral; unify the daily ritual (push+email+dashboard → "Due today"); streak-defense push + leaderboard; ship 8–10 short-form pieces from the brief bank; open creator outreach.
**Days 61–90 — Amplify what's working.** *Move: k-factor + organic activated sessions.* Double down on the better of {answers-SEO, share loop}; launch the Lent/seasonal challenge + church kit; 1–2 ministry partnership pilots; A/B share-card copy and the activation sequence.

## North-Star + KPIs
- **North-Star: Weekly Active Defenders** — users who in a week asked an AI question, completed a review, debated, or read a deep dive.
- Acquisition: organic activated sessions/wk + k-factor · Activation: visitor→first-aha, signup→first-review · Retention: D7, WAU/MAU · Referral: share→signup · Revenue: *deferred* (track `upgrade_clicked` as latent demand only).

## Honest caveats (need your decision)
- **Monetization is a stub:** `isPro = true` is hardcoded site-wide, Stripe isn't live, and the site advertises "$8/mo" + a "7-day free trial" on a flow that can't charge. **Don't drive paid acquisition into that.** Interim integrity fix: soften/remove the dead trial button. Real decision (separate, human sign-off): wire Stripe + real `isPro`, and decide what to gate — keeping the core gospel/answers generously free.
- Several top moves (hero CTA, signup_completed event, share prompts) are **draftable now** as review-ready changes. The pricing/billing ones are not — those are yours to call.
