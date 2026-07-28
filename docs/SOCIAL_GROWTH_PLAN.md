# Organic social growth plan — Instagram + X

*Companion to [`MARKETING_PLAN.md`](MARKETING_PLAN.md) (the whole-funnel strategy) and
[`META_ADS_PLAN.md`](META_ADS_PLAN.md) (paid). This file covers organic Instagram and X only.*

**Written 2026-07-28.**

Research by `apologia-research`; every repo claim below was independently re-verified against the
working tree before being written down (see *Verified facts* at the end).

> 📄 **Want the short version?** [`GROWTH_PLAN_SIMPLE.md`](GROWTH_PLAN_SIMPLE.md) — one page, plain
> English, covering Instagram, X and ads together.

---

## ⚠ CORRECTION (2026-07-28, from the owner) — an Instagram account DOES exist

The research pass below concluded that neither account existed. **That was wrong for Instagram: the
owner confirms an Instagram account exists — it is simply not linked from anywhere.** The web search
that missed it looked for `@apologiadaily` and found nothing indexed; a differently-named, new, or
low-content account would not have shown up. **Lesson for future sessions: absence from search is
not absence of an account — ask the owner before asserting a brand asset doesn't exist.**

**What this changes:** step 0.1 below is *register X + supply the existing IG handle*, not "register
both." **What it does not change — and in fact sharpens:** every other step-zero item stands, and
the linking work becomes *more* urgent, not less. An account that exists and is unlinked is worse
than one that doesn't: the audience-building is already happening, and all 319 pages still point
nowhere, so none of it compounds. The `twitter:site` finding is unaffected (that's about X).

**Still needed from the owner: the actual Instagram handle**, so the footer icons, the `sameAs`
schema property, and the bio-link destination can be wired.

---

## The finding that reorders everything: the site points at nothing

**The site does not link to any social profile from any of its 319 pages** — including the
Instagram account that does exist.

Concretely, verified in the repo:

- **Zero** `instagram.com` / `twitter.com/apologia` / `x.com/apologia` links anywhere on the site
  (the existing Instagram account included — see the correction above).
  The footer (`index.html`) carries Features / Pricing / About / What We Believe / Blog / Privacy /
  Terms / Videos — no social icons.
- **1,108 pages carry a `twitter:card` meta tag** — so every link shared to X already renders a
  proper image card — but **0 pages carry `twitter:site`**, so none of that attribution reaches an
  account. Every share to X is free advertising that credits nobody.
- **No `sameAs` property in any structured data**, so Google has no link between the site and any
  social profile either.

Name-collision risk to settle at registration, not after: **@apologiastudios** (Jeff Durbin's
Apologia Christian Ministries, ~103K IG) and **@apologiaworld** (the Apologia homeschool curriculum
brand) both exist and are much larger. Pick handles and bio wording that disambiguate deliberately.

**So X is a from-zero launch; Instagram is an existing account that has never been connected to the
site.** Either way the sequencing is the same — wire the links before optimising anything. The
upside is real: 54 already-gated reel specs and 85 essays are a running head start.

### Step zero — before a single post

| # | Task | Owner | Effort |
|---|------|-------|--------|
| 0.1 | **Supply the existing Instagram handle**; register the X handle to match; write bios that disambiguate from the two "Apologia" collisions | Owner | 30 min |
| 0.2 | Add `twitter:site` site-wide once the X handle exists | Dev session | trivial, templated |
| 0.3 | Add social icons to the footer + `sameAs` to the site schema | Dev session | trivial |
| 0.4 | Decide the bio-link destination **before** posting — a static `/links` page on our own domain beats Linktree (free, on-brand, and the traffic is ours). Point it at the Ask-Anything tool + a rotating essay, not the bare homepage | Owner + dev | small |

Post #1 is worthless without somewhere for a curious viewer to land. 0.4 is not optional.

### One real pre-launch content task

**6 of the 7 X-card specs are ungated.** Verified by reading each file:

| Spec | Stamp |
|---|---|
| `x-honor-the-son.json` | ✅ argument + orthodoxy + neutrality (2026-07-25) |
| `x-jesus-god-mark.json` | ❌ none — **deity tier → needs dual-consensus** |
| `x-nicene-creed.json` | ❌ none — **Trinity tier → needs dual-consensus** |
| `x-luckhoo.json` | ❌ none |
| `x-mathematics-god.json` | ❌ none |
| `x-scripture-one-story.json` | ❌ none |
| `x-study-plans.json` | ❌ none |

Per CLAUDE.md, X cards are explicitly named gated content. These six cannot ship until they pass
argument + orthodoxy (+ neutrality for the two deity/Trinity ones). Cheap — they reuse certified
essay framing — but not zero.

By contrast **all 54 reel specs in `tools/reel/specs/` are stamped**. At 3 posts/week that is
**~18 weeks of Instagram runway with no new scripting**. Distribution, not production, is the
bottleneck now — which is the opposite of what `MARKETING_PLAN.md` assumes.

---

## Instagram

### The structural disadvantage, named honestly

Every account actually growing in this niche is **personality-led, with a face and a voice**:
CrossExamined/Frank Turek (~663K), Wesley Huff (~718K IG — built off the Jan 2025 Rogan appearance,
1,200 → 450K YouTube subs in a month), Redeemed Zoomer (~58K IG / 702K YT, first-person
deconstruction narrative), GodLogic/Avery Austin (~180K IG, live street debate).

Our reel pipeline is deliberately **silent and captioned** — no TTS, voiceover only if the owner
records it. A faceless captioned card reads to the algorithm as *content*, not *creator*, and IG
increasingly ranks on relatability signals (saves, shares, DM-shares). **Expect materially slower
growth than a face-led account posting the same quality.** Two honest options:

- **(a)** Accept it. Run as a brand/library account and lean into shareability — the argument is the
  hook, not a personality.
- **(b)** The owner records **10–15 seconds** of on-camera intro stitched before the existing silent
  card. Far smaller a lift than full voiceover, and disproportionately helps ranking. *Recommended
  if the owner is willing to be on camera at all.*

### 2026 mechanics that actually matter here

- **Shares and saves now outrank likes**; DM-shares reportedly weight 3–5× higher. So the caption CTA
  matters more than follower count. Reuse the site's own **"send this to a skeptic"** framing verbatim —
  it is already the strongest lever we have and it is already written.
- **Hashtags categorise, they don't boost.** Cap is 5. Use a **fixed pool of 3–5**, held constant
  post-to-post, and stay in one semantic cluster for the first 10–12 posts so the algorithm can
  establish topical authority. Do not post an apologetics reel Monday and a lifestyle-devotional
  Tuesday in week one.
- **Collabs are the highest-leverage unpaid lever** for a zero-follower account (reported ~2.3× reach
  vs. a solo post). Realistic targets are **peer-tier micro-accounts (5–50K)** — apologetics pages,
  campus ministries — not CrossExamined. Our 13+ Islam essays and `worldviews.html` are a genuine
  pitch differentiator.
- **Carousels: not buildable today.** `tools/reel/` has only the reel MP4 generator and the single-image
  X card. Carousels would be new tooling *and* every slide would need gating. Don't promise them in
  month one.
- **Stories** are the cheap daily-touch layer: polls ("which question next?"), resharing the day's
  reel, process shots. Kept to process/engagement rather than new truth-claims, they don't need gating.

### Hook patterns that travel in this niche

1. **The Reversal** — "Everyone assumes X. The evidence says the opposite." → `arent-there-contradictions-in-the-bible`, `did-the-church-invent-jesus-divinity-at-nicaea`
2. **The Hostile Witness** — "Even the atheist historian admits…" (strongest hook in the whole niche)
3. **The Embarrassment Test** — "No one inventing this would include this detail." → `why-were-women-the-first-witnesses`
4. **The Wordplay Trap** — "Same word. Not the same claim." → `was-jesus-a-muslim`
5. **The Timeline Shock** — "Not decades later. Within *this* many years." → `how-soon-did-people-say-jesus-rose`
6. **The Dilemma** — "Either A or B. There is no third option." → `why-uthman-burned-the-other-qurans`
7. **The Switched Side** — third-person conversion narrative → `paul-the-enemy-who-switched-sides`, `nabeel-qureshi-conversion`

---

## X / Twitter

A genuinely different platform, and the one our differentiators fit best — X has the live debate
scene that steelman-first apologetics is built for.

- **Replies carry far more algorithmic weight than original posts.** A good reply under a large
  account can outperform anything a 0-follower account posts. The standard cold-start advice is the
  **70/30 rule** — 70% of time on quality replies, 30% on originals — capped around 15–20 replies/day
  (50+/day risks spam flags).
- **Long single posts (1,000–4,000 chars) now often outperform threads** for impressions, a real
  shift from the thread-culture assumption in `MARKETING_PLAN.md` line 47. Practical read: post the
  X-card image **with one well-written long caption** as the default; reserve full threads for the
  weekly high-effort essay distillation.
- **The existing X-card format is right for this platform** — 1600×900 matches X's native preview
  aspect ratio exactly, and the italic-serif headline reads at feed-thumbnail size. The standing house
  rule (`gen_xcard.py` only, never a reel frame) is correct on the merits, not just for brand consistency.
- **Accounts to know and engage respectfully:** InspiringPhilosophy (@InspiringPhilos), Gavin Ortlund /
  Truth Unites, Wesley Huff (@WesleyLHuff) — and the atheist/Muslim side that makes reply engagement
  viable at all (Alex O'Connor, Mohammed Hijab and the debate-adjacent orbit).
- **Cadence: research says 3–5 posts/day. That will not survive contact with a solo operator's actual
  backlog.** Do **1 original post/day + 15–20 min of genuine reply engagement**. The 70/30 research
  says the replies are the higher-leverage half anyway.
- **Never bare link-drop in a reply.** Fastest route to looking like spam and getting suppressed.

**Starting posting windows** (test against real analytics as soon as there are any): X weekday
mornings 9–11am and the Tue–Thu 12–6pm block; IG Wed 12pm / Thu 9am plus the Wed–Thu 6–11pm cluster.

---

## 30-day starting schedule

Both platforms launch together in week 1, once step zero is done. Everything below reuses existing
certified assets — **no new reel scripting is scheduled**.

### Instagram — 3 reels/week (Mon / Wed / Fri)

| Week | Reels |
|---|---|
| 1 | `was-jesus-a-muslim` · `why-were-women-the-first-witnesses` · `kalam-cosmological` |
| 2 | `is-the-universe-fine-tuned-for-life` · `did-the-disciples-hallucinate` · `paul-the-enemy-who-switched-sides` |
| 3 | `were-the-gospels-written-by-eyewitnesses` · `isnt-the-trinity-a-contradiction` · `why-uthman-burned-the-other-qurans` |
| 4 | `if-god-is-good-why-suffering` · `undesigned-coincidences` · `can-we-trust-the-new-testament-manuscripts` |

Plus 1–2 Stories/day. **Pre-work needed: none** — every one of these is already gated.

### X — 1 post/day + daily reply time + 1 thread/week

- **Daily:** alternate (a) the certified `x-honor-the-son` card with fresh caption variants and
  (b) a long-form single post distilling one of the 102 answer pages, no image needed.
- **Weekly thread:** Wk1 "5 facts even atheist historians accept about Easter" · Wk2 the Islamic
  Dilemma · Wk3 fine-tuning · Wk4 the minimal-facts case. All map to existing essays.
- **Daily 15–20 min** of substantive replies in the apologetics/debate orbit.
- **Before using the other 6 X cards:** run them through the gate (see the table above).

---

## Honest expectations

- **Month 1:** near-zero measurable site traffic. Low hundreds of followers combined *if* posting is
  consistent. This is normal for a cold start and is **not** a signal to change strategy.
- **Months 2–3:** growth in this niche is lumpy, not linear. If one or two pieces hit a nerve — the
  Islamic Dilemma and the resurrection cluster are the likeliest — a single reel or reply outperforms
  everything else combined. Budget for consistency that lets a lucky hit happen; don't budget on averages.
- **90-day realistic floor:** low thousands of followers combined, meaningful as a distribution list
  rather than a traffic source. **Meaningful site traffic from social is a 4–6+ month horizon** at this
  cadence — and only if the bio link is actually wired (step zero).
- **Do not** pay for boosts, pay influencers, or pitch Collabs to accounts >100K in the first 90 days.
  There is no track record yet to justify their time. Creator sponsorships (`MARKETING_PLAN.md` move #4)
  should wait until this organic base exists to point at.
- The real differentiators — steelman-first tone, the deep Islam module — are genuine advantages, but
  they compound slowly against personality-led competitors with a multi-year head start. Read this plan
  as *"build a credible account that compounds,"* not *"catch a 700K channel in a quarter."*

---

## Corrections this makes to `MARKETING_PLAN.md`

- Its "Organic social, by platform" section (lines 44–50) lumps TikTok/Reels/Shorts together, gives X
  a glancing mention, and **never says the accounts don't exist**. That is the load-bearing fact, and
  it changes the sequencing — step zero comes before everything.
- Its "Ten ready content briefs" (lines 52–64) assume content still needs scripting. It doesn't;
  all 54 specs are certified.
- Its thread-first assumption for X (line 47) is now outdated.

Fold these in when the owner has acted on step zero.

---

## Verified facts (re-checked in the working tree 2026-07-28, not taken on the agent's word)

| Claim | Check | Result |
|---|---|---|
| No social profile links on the site | grep across all `*.html` | confirmed — 0 |
| ~~Neither account exists~~ | **owner correction** | ⚠ **WRONG for Instagram** — an IG account exists, unlinked. X unconfirmed |
| `twitter:card` present, `twitter:site` absent | `grep -rl` | 1,108 pages vs **0** |
| No `sameAs` structured data | `grep -rn sameAs` | 0 hits |
| 6 of 7 X cards ungated | read each JSON's `reviewed` key | confirmed |
| All 54 reel specs gated | `grep -L '"reviewed"'` | 0 unstamped |
