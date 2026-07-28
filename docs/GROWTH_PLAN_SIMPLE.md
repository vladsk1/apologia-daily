# Growth plan — the short version

*One page, plain English. The detail lives in [`SOCIAL_GROWTH_PLAN.md`](SOCIAL_GROWTH_PLAN.md)
(Instagram + X), [`META_ADS_PLAN.md`](META_ADS_PLAN.md) (paid ads) and
[`MARKETING_PLAN.md`](MARKETING_PLAN.md) (the whole funnel). Read this first; go there for the
working.*

**Written 2026-07-28.**

---

## Where we actually are

We have a lot of content and almost no distribution.

- **85 essays, 102 answer pages, 54 finished videos** — all checked and ready to post.
- **No page on the site links to any social account**, including the Instagram account we have.
- **Nobody has read nine months of PostHog data.** We're collecting it and not looking at it.

So the bottleneck is not making things. It's that nothing points anywhere.

---

## The three things only you can decide

| # | Decision | Why it's blocking |
|---|---|---|
| 1 | **What's the Instagram handle?** (and is there an X account?) | Until I have it I can't add the footer links, the Google `sameAs` tag, or build the bio-link page. Everything else on Instagram is ready to go. |
| 2 | **Where should the bio link send people?** | Recommend a simple `/links` page on our own site — free, on-brand, and the traffic stays ours. First post is wasted without it. |
| 3 | **Do we spend on ads, and with what goal?** | See the ads section below. This one changes with *why* you're spending. |

---

## Instagram — ready to start

**We can post three reels a week for four months without making anything new.** All 54 videos are already checked.

Four things to know:

1. **The accounts that grow in this niche all have a face.** Ours doesn't — our videos are silent with captions on screen. That works, but it grows slower. If you're willing to film even 10–15 seconds of yourself talking before each video, it helps a lot more than it costs.
2. **Shares matter more than likes now.** So the caption should ask people to send it to someone — we already have that line written ("send this to a skeptic").
3. **Use the same 3–5 hashtags every time**, and stick to apologetics only for the first month. Hashtags sort you into a category now; they don't get you reach.
4. **Stories are free and easy** — polls, "what should I answer next," resharing the day's reel.

**Honest expectation:** month one, almost nothing. That's normal and not a reason to stop. Growth here comes in jumps, not a steady climb — one video hits and everything changes. Real traffic to the site is a 4–6 month horizon.

---

## X (Twitter) — a different game

**Replying beats posting.** On X, a good reply under a big account reaches more people than anything a new account can post on its own. Aim for **one post a day plus 15–20 minutes of genuine replies**. Never just drop a link — that reads as spam and gets you buried.

**One job before we start:** we have 7 branded X images and **only 1 has been through the content check**. I've reviewed the other six and found three that need wording fixes first (details in `SOCIAL_GROWTH_PLAN.md`). Small job, but it has to happen before they're posted.

---

## Meta ads — what A$20/day and A$100/day actually buy

Per month, roughly:

| | **A$20/day** (A$600/mo) | **A$100/day** (A$3,000/mo) |
|---|---|---|
| People who see an ad | ~33,000 | ~167,000 |
| People who click through | ~400 | ~2,000 |
| People who ask the AI a question | ~26–64 | ~130–320 |
| **People who finish signing up** | **~3–16** | **~13–80** |
| Cost per signup | ~A$37–A$234 | ~A$37–A$234 |
| Retargeting audience usable after | ~27 weeks | ~5 weeks |

*(Estimates from UK benchmarks — our own PostHog data would tighten them for free. The range is wide
because we have never measured our own conversion rate. **Note the cost per signup is identical** —
spending more doesn't make each signup cheaper, it just buys more of them.)*

### The honest read

Meta needs about **50 conversions a week** before its system learns who to show your ads to. Below
that it never really starts working. That single fact separates these two budgets:

**A$20/day — too small to optimise, but not useless.** It misses the learning threshold badly (~26–64
a month against ~214 needed), so Meta never gets going and you sit at the expensive end of every
range. What it *is* good for: **finding out which of our 54 videos people actually stop and watch.**
That's a real answer, it costs A$600, and it makes the free Instagram and X work better too. Just
don't expect signups, and don't read anything into the conversion numbers — at 3–16 a month they're
noise, not data.

**A$100/day — exactly the minimum that works, for one ad set aimed at one goal.**
- Aiming at *"asked a question"* — lands at or just under the line. Workable, barely.
- Aiming at *"signed up"* — nowhere near. That needs about **A$570/day**. Not an option.
- Only affords **one ad set**, so we still can't test two audiences against each other.

**Neither pays for itself.** A signup costs A$37–234 and is worth roughly A$3–36 at the current price.
That gap is too big to close with better targeting or better ads — which is why the fix is the offer,
not the advertising.

One thing A$100/day *does* buy quietly: a retargeting audience big enough to be useful in about
**five weeks** — handy when the app launches. At A$20/day that takes about **six months**, so if the
retargeting pool is the point, the small budget doesn't really deliver it.

### So should you spend it?

**It depends entirely on what you want, and these are different questions:**

**If you want customers — no.** Not yet. Nothing can take payment, signups need email confirmation with no Google/Apple login, and the maths doesn't work. Fix the offer first: a **church or small-group licence at ~A$150/year** turns this from a heavy loss into a profit, because one group leader is worth 20–60 individual signups.

**If you want reach — that's a different question, and it's a fair one.** A$100/day puts serious
apologetics in front of **167,000 people a month**, gets **2,000 of them** reading, and has **130–320**
asking their hardest question and getting a real, sourced answer. A$20/day is a fifth of that —
**33,000 seeing it, 400 reading, 26–64 asking.** If you think of that as ministry rather than
marketing, you're not buying customers, you're buying a hearing — and on that measure the money is
not wasted at either level. That's a legitimate reason to spend, and I'd rather say it plainly than
bury it under a return-on-investment table that was measuring the wrong thing.

**What I'd suggest either way: start at A$20/day for one month (A$600).** Not for signups — to rank
our 54 videos by which ones people actually stop and watch. That's the one thing a small budget
genuinely buys, and the answer carries straight over to the free Instagram and X work. If a couple of
videos clearly win, *then* A$100/day has something worth pushing behind it.

### Two things to fix before any money is spent

1. **✅ Fixed — our signup tracking used to fire too early**, before people confirmed their email. If
   we'd handed that to Meta it would have gone looking for people who never finish signing up. There's
   now a proper `signup_confirmed` event. One catch: it only counts people who joined *after* 28 July,
   so it has no history yet.
2. **⏳ Still needs your decision — the privacy policy.** `privacy.html` currently tells readers we
   don't use advertising cookies. **That is true today** — there's no tracking pixel on the site. It
   only becomes a problem *if* you decide to install Meta's pixel, and then it has to change first,
   along with adding a cookie consent banner for UK/EU visitors. **Nothing to fix until you make that
   call** — and on a site whose whole asset is being trustworthy, "we don't track you for ads" is
   worth something.

### One thing not to advertise

**Don't run the Islam content as paid ads.** Not because it's wrong — it's some of our best work — but paid ads push it in front of Muslims who didn't go looking for it, which is a different thing from someone choosing to read an essay. It's also the fastest way to get the ad account shut down, which would cost us the app launch too. Keep it where it works: search, and people who came asking.

---

## What happens next

**Waiting on you:** the Instagram handle · the bio-link destination · whether to spend anything on ads.

**Ready when you say go:** fix the three X image captions and run them through the checks · add the footer social links and `twitter:site` tag (needs the handles) · read the PostHog data and replace every estimate above with our real numbers.

**The free one worth doing first:** reading nine months of PostHog. It costs nothing and it makes every number on this page more accurate.
