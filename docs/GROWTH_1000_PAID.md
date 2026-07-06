# Road to 1,000 paid users — execution plan

_Companion to `docs/MARKETING_PLAN.md` (strategy + channel research), `docs/REEL_POSTING_PLAN.md`
(posting calendar), `docs/ONBOARDING_SPEC.md` (activation), `docs/GAME_IDEAS.md` (product
differentiators). This document is the execution layer: funnel math, phases, weekly cadence,
decision rules, and owner per action. Written 2026-07-06._

---

## 1. The goal, translated into math

1,000 paid ≈ **$8,000 MRR / ~$96k ARR** at the advertised $8/mo (more with an annual tier).
Working backwards through a standard freemium funnel (assumptions labeled, to be replaced by
real PostHog numbers within 30 days):

| Step | Assumed rate | Needed for 1,000 paid |
|---|---|---|
| Trial → paid (7-day trial) | 35% (norm 25–50%) | ~2,900 trials |
| Signup → trial start | 12% (norm 8–20%) | ~24,000 signups |
| Visitor → signup | 6% (norm 3–10% for content sites) | **~400,000 cumulative visitors** |

Two levers change this picture dramatically:
- **Group/church seats** (Phase 3): one church group = 10–50 seats. 15–20 group deals could
  supply 300–500 of the 1,000 with a fraction of the traffic.
- **Annual plans**: an annual tier (~$59/yr) both anchors the monthly price and typically
  lifts trial→paid by several points.

**Honest scale-check:** 400k visitors organically is a 9–12-month compounding project, not a
90-day sprint. The plan below is phased accordingly: 50 payers by week 6, 250 by month 4,
1,000 by month 9–12 — with group sales and Spanish as the accelerants.

---

## 2. The blunt truth: nothing counts until the till is on

Right now `isPro` is hardcoded `true` (every Pro feature is free for everyone), Stripe is not
live, and the homepage Pro card says "Coming soon." **Every visitor arriving today is
un-monetizable.** Traffic work before payments work is pouring water into a bucket with no
bottom. Phase 0 is therefore the only thing that matters this week.

---

## Phase 0 — Turn the till on (Week 1–2) · Target: payments live

These are human-only decisions (per house policy, no prices/payments wired without sign-off):

**0.1 Pricing decision (recommended):**
- **$8/mo** (already advertised — keep it)
- **$59/yr** ("2 months free" anchor — most buyers should land here)
- **Founding Member: $199 lifetime, first 100 only** — launch-window urgency, instant cash,
  creates 100 invested evangelists. Retire it permanently at 100.
- 7-day free trial, card required (card-required trials convert 3–5× better than cardless).

**0.2 Draw the paywall line.** Everything is currently free in practice. Recommended split —
free tier stays genuinely valuable (it's the top of the referral/SEO funnel), Pro gates depth:

| FREE (the funnel) | PRO (the product) |
|---|---|
| All `/answers/` pages (SEO) | "The Case, Plainly" tier (77 arguments) |
| Card summaries + "In plain English" | Pro Deep Dives on cards |
| Deep-dive essays (keep free — they're the trust engine + SEO) | Mastery Tracks (16 Jesus + all tabs) |
| Daily Quiz, Who Said It, Argument-or-Fallacy | Objection Catcher, Speed Round, Conversation Journal, Memory Palace |
| `/today` basic loop, 5-day Beginner's Path | AI Tutor + Debate Arena voice, flashcard sync across devices |

**0.3 Stripe live** (user said it's imminent): products for the 3 SKUs, webhook →
Supabase `user_metadata.isPro`, replace the hardcoded `isPro = true` in ~30 pages with the
real check, flip the homepage Pro card from "Coming soon" to live checkout. *(I can wire all
the code the moment you give sign-off + keys; the price IDs and the go-live click are yours.)*

**0.4 Instrumentation before launch** — the PostHog events from `MARKETING_PLAN.md` §Measurement
plus: `checkout_started`, `trial_started`, `trial_converted`, `subscription_cancelled`,
`paywall_viewed{source}`. Without these, Phases 1–3 fly blind. *(I can wire this now.)*

**Exit criteria:** a stranger can pay you. Every paywall touch and payment step emits an event.

---

## Phase 1 — First 50 payers (Weeks 2–6) · Prove the funnel

Goal is NOT volume; it's a measured funnel and the first cohort of true fans.

**1.1 Founding-member launch to the warm list.** Existing signups get the one email that
matters: "We're turning on Pro — first 100 founding members get lifetime access for $199 /
or lock $59/yr forever." Warm lists convert 5–20×  cold traffic; this alone should produce
the first 20–40 payers and validate willingness-to-pay within days.

**1.2 Reels: run the machine that's already built.** Execute `REEL_POSTING_PLAN.md` exactly:
5×/week, TikTok + IG Reels + YouTube Shorts native uploads, voiceover pass, register
rotation. 20 reels are finished; the calendar is written. Every reel CTA →
`apologiadaily.com` → matching answer page → paywall touchpoints now instrumented.
*(You post; I keep producing 2–3 new gated reels/week from the answer backlog.)*

**1.3 Ship the onboarding payoff screen** (`ONBOARDING_SPEC.md`): Q1 on signup page, 3
questions, ends on a personalized first action. This is the single highest-leverage
activation fix already specced. *(I can build it now.)*

**1.4 Trial-to-paid engine v1:** day-0/2/5/7 email sequence (welcome → the argument that
matches their onboarding topic → "your streak/mastery so far" → trial-ending note). Resend
key is already an open TODO — this is the moment it becomes mandatory.

**Exit criteria / decision rules:**
- **50 paid**, and real numbers for every funnel step.
- If trial→paid < 20% → the product/paywall line is wrong; fix before buying traffic.
- If visitor→signup < 3% → landing/onboarding problem; iterate 1.3 before scaling reels.
- Note the reel with the highest watch-through — that topic is your acquisition wedge.

---

## Phase 2 — 50 → 250 (Months 2–4) · Double down on what worked

**2.1 Concentrate on the winning channel.** By now one of {TikTok, Shorts, SEO} is visibly
outperforming. Move to daily posting on the winner; drop the laggard to 2×/week. Recycle the
top 3 reels with new hooks (per posting plan week-4+ protocol).

**2.2 SEO flywheel: 57 → 120 answers.** The flywheel (`api/submit-question.js` →
`gen-answers.mjs`) is built and gated. 5 new answers/week targeting question-format keywords
(Shorts titles double as the keyword research — questions that pop on video have search
demand). Each new answer = a rung of compounding traffic + a reel candidate.

**2.3 Referral loop v1.** "Send this answer to a skeptic" exists — add the incentive:
sender gets +1 week Pro per activated friend (3 friends = 1 month). Faith content has
built-in share intent; this converts it into acquisition. *(I can build; no payment risk.)*

**2.4 Ship ONE flagship Pro game: Crossroads** (`GAME_IDEAS.md` #1). Free: one 3-scene demo
conversation. Pro: the full 7-day "Sam" run. This gives the paywall a *want* (not just more
text), gives reels a new format ("Can you keep both meters alive?" gameplay clips), and no
competitor has it. Build ≈ a weekend of engine + gated scenario content.

**2.5 Win-back + churn plumbing:** cancellation survey (one question), dunning emails,
pause-instead-of-cancel offer. At 250 subs, every 1% monthly churn ≈ 30 saved users/year.

**Exit criteria:** 250 paid; CAC per channel known (even if $0 + hours); monthly churn < 6%;
one repeatable content→trial motion documented.

---

## Phase 3 — 250 → 1,000 (Months 4–9/12) · Add engines, not effort

**3.1 Groups & churches (the shortcut).** The study-groups feature exists. Package it:
**$149/yr per group of 10 seats** ("Equip your small group"), youth-pastor one-pager, a
6-week "Case for Christ" group track assembled from existing mastery content. Outreach:
youth ministry networks, apologetics conferences, homeschool co-ops, seminary student groups.
20 groups ≈ 200–400 seats. This is the highest-leverage sales motion in the plan.

**3.2 Spanish engine.** The `library/es/` pilot (10 essays, gated CLEAN) is proof of
capability. Bible Chat's growth was heavily LATAM. Expand: 20 Spanish answers + 5 Spanish
reels (same specs re-rendered with translated text) + `es` hub. Spanish CPMs and competition
are far lower; the same reel effort reaches a much less contested feed.

**3.3 Creator partnerships.** 10–20 mid-tier apologetics creators (10k–100k): free Pro +
rev-share code (30% first year). One good partnership can outproduce a month of posting.
The pitch asset already exists: the orthodoxy-gated, source-verified content itself —
"the apologetics app whose every claim is fact-checked" is the differentiator no one else
can honestly say.

**3.4 Paid acquisition — only now, and only if LTV:CAC ≥ 3.** With funnel numbers from
Phases 1–2, run $500–1,000/mo tests: TikTok Spark ads on the proven-best reels; Google
Search on question keywords where our answers already rank 5–15. Kill anything above
CAC = 1/3 × LTV (at $8/mo, 12-month retention → LTV ≈ $70–90 → max CAC ≈ $25).

**3.5 Annual-plan push + founding cohort activation:** yearly-upgrade campaign each quarter;
founding members get a "bring your church" group discount code.

**Milestone track:** 400 paid by month 6 → 650 by month 8 → 1,000 by month 9–12
(individual funnel ~600–700, groups ~250–350, Spanish/partnerships fill the gap).

---

## 4. Weekly operating cadence (once Phase 1 starts)

| Day | Action | Owner |
|---|---|---|
| Mon–Fri | Post 1 reel/day (native, per calendar) | You |
| Mon | Review dashboard: MRR, trials, funnel rates, churn, per-reel watch-through | You + me |
| Tue | Ship 5 new answers (flywheel, gated) | Me |
| Wed | Produce 2–3 new reels (gated) + captions | Me |
| Thu | 1 funnel experiment (headline, paywall copy, email subject — one at a time) | Me builds, you approve |
| Fri | Reply to every comment; 5 partnership/group outreach messages | You |
| Sat | Re-share best performer to Stories; pin winner | You |

## 5. The dashboard (the only numbers that matter)

Weekly, in one place: **MRR · new trials · trial→paid % · visitor→signup % · D7 retention ·
monthly churn · reels posted / best watch-through % · answers live · group deals in pipeline.**
North star: **weekly new trials** (everything upstream feeds it; everything downstream
converts it).

## 6. Division of labour

**Only you can:** approve pricing + flip Stripe live (house policy), post to social accounts,
send the founding-member email, do group/partnership outreach calls, give pastoral sign-off
where flagged.

**I can execute on request:** all Stripe/paywall wiring (after sign-off), PostHog events,
onboarding build, referral mechanic, Crossroads game, email sequences (once
`RESEND_API_KEY` is set), 5 answers + 3 reels per week through the full gate pipeline,
Spanish expansion, dashboards, and every funnel experiment.

## 7. Risks & honest caveats

- **The whole plan gates on Phase 0.** Every week payments stay off, warm demand decays.
- Benchmarks above are industry-typical, not measured — replace with PostHog truth by week 4
  and re-forecast.
- The "$8/mo" was a placeholder never validated; the founding-member launch doubles as the
  price test.
- Content pipeline rule stands: every new answer, reel, and game scenario goes through the
  argument + orthodoxy gates. Growth never outruns the guardrails — the fact-checked-ness IS
  the brand moat.
- Trinity/Islam "Case, Plainly" human-pastoral sign-off (open item) should land before any
  paid acquisition sends cold traffic to those pages.
