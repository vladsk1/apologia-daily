# Instagram growth strategy — from 19 followers to a real channel

**Written 2026-08-04**, from the account's own numbers (owner screenshot, 30-day dashboard) and a
re-read of the working tree. Companion to [`SOCIAL_GROWTH_PLAN.md`](SOCIAL_GROWTH_PLAN.md) (which
this file **corrects in three places** — see *Corrections* at the end) and
[`REEL_POSTING_PLAN.md`](REEL_POSTING_PLAN.md) (the calendar this file replaces).

---

## 1. What the numbers actually say

| Metric | Value | Read |
|---|---|---|
| Posts | 55 | Supply is not the problem |
| Followers | **19** | The problem |
| Following | 55 | 2.9:1 the wrong way — reads as a bot to humans *and* to ranking |
| Views, last 30 days | 2,400 | ~44 views per post lifetime; ~160/post if ~15 posted in-window |
| Per-reel views (visible) | 172 · 126 · 118 · 117 · 16 · 5 | Almost all die inside the first test batch |

**Two separate failures, and the second one is worse.**

**(a) Reach is capped at the first test audience.** Instagram shows a new reel to a seed batch of
roughly 100–300 accounts and *only* expands if watch-through, replays, saves and shares clear a bar.
Landing at 5–172 views means nearly every post is being shown once and stopped. That is a
**retention** verdict, not a topic verdict.

**(b) Conversion to follow is ~10× below par, and this is the real story.** A reel that is working
converts roughly **1–2%** of non-follower views into follows. At 2,400 views in 30 days, a healthy
account picks up ~24–48 followers *in that month alone*. This account has **19 followers in its
entire life across 55 posts** — call it 0.1–0.3%. So even if reach tripled tomorrow, the account
would still barely grow.

> **The one-sentence diagnosis: the content is good enough to be watched and gives nobody a reason
> to come back.** Each post is a self-contained fact that resolves completely on screen. A viewer
> finishes it satisfied — and satisfied viewers do not follow. Nothing on the profile promises a
> *next* one.

### What the grid already proves — free A/B evidence

Read the six visible posts in order and the account has already run the experiment:

| Post | Views | Type |
|---|---|---|
| "The most **dangerous** sentence Jesus said." | **172** | Curiosity gap — withholds the payoff |
| "Saw an objection online?" *(screen recording)* | **126** | Motion + real UI |
| "There is one seat in the universe that belongs to **God alone**." | 118 | Bold doctrinal claim |
| "The earliest Gospel has Jesus charged with blasphemy. **Twice.**" | 117 | Bold doctrinal claim |
| "The gospel **before the Gospels**." | 16 | Feature/announcement framing |
| "Saw an objection online?" *(static card)* | **5** | Feature/announcement framing |

Three findings, all actionable today:

1. **Curiosity beats assertion.** The top post is the only one that *names a thing and refuses to
   say what it is*. 172 vs. 117 on adjacent posts from the same cluster.
2. **Never post about the product.** The two worst posts (16, 5) are the two that advertise a site
   feature. The identical topic rendered as a screen recording did **126**; as a static
   announcement card it did **5** — a 25× gap on the same idea. Post the argument; let the bio sell.
3. ⚠ **This contradicts `REEL_POSTING_PLAN.md`'s rule #1** ("post the reel, never a
   screen-recording — 147 vs 0–22"). On current data the screen recording *beat* four of the five
   branded cards. The old rule generalised from one early data point. **Corrected rule:** post
   whatever has *motion and a human hand in frame*; the branded card is a good payoff, a poor hook.

### The four numbers I could not see, and that you should pull first

I am working from a profile screenshot. Before spending a month on this, open **Insights → any
reel** and write down, for the last ~10 reels:

1. **Watch-through / average watch time** (my (a) diagnosis stands or falls on this)
2. **Follows from this reel**
3. **Saves + shares** (the two signals that actually expand reach in 2026)
4. **Views from non-followers %**

If watch-through is above ~50% and follows are still ~0, the problem is purely (b) and the fix is
the profile and the series structure, not the video. If watch-through is under ~30%, do the audio
and hook work first. My plan below does both, but that data tells you which half to front-load.

---

## 2. The strategy in one page

**Position:** not "an apologetics page." There are hundreds. The differentiator already exists in
the repo and is not being used: **this is the account that steelmans the other side before answering
it, and shows its work.** 132 verified sources, 85 cited deep dives, a five-stage review standard
with a name ("Checked Before Published"), and 13+ Islam essays no competitor of this size has.
"We fact-check ourselves harder than our critics do" is the hook nobody else in the niche can run.

**Four changes, in priority order. Do them in order — 1 and 2 are worth more than 3 and 4 combined.**

### Change 1 — Add a voice. (Biggest single lever.)

`gen_reel.py` renders **silent by design** and writes a `.voiceover.txt` script + a synced `.srt`
for exactly this pass. **55 of the 56 specs already carry a written voiceover script.** If that
CapCut pass is not happening, it is the reason watch-through is dying: a silent wall of text has
nothing holding a viewer except reading speed, and Instagram's ranking is dominated by watch time.

- **Best:** the owner records the voiceover. A real human voice on an apologetics claim is a
  trust signal no TTS matches, and it costs ~4 minutes per reel.
- **Acceptable:** a good TTS voice (ElevenLabs / CapCut's own) while you decide about being on
  camera.
- **Non-negotiable either way:** a quiet trending sound underneath. It is a discovery signal, not
  content.

### Change 2 — Give a reason to follow: ship **series**, not posts.

55 standalone facts = 55 dead ends. Number them and name them, so the profile promises a next one.
Three series, running permanently:

| Series | Format | Cadence | Why it earns the follow |
|---|---|---|---|
| **Objection #N** | Reel — real objection on screen, answered in 30s | 3×/week | Serial. "#14" implies 13 you missed and #15 coming |
| **Even the skeptics grant…** | Carousel, 5–7 slides | 2×/week | The hostile-witness hook is the strongest in this niche, and carousels are the **save** format |
| **The verse they use on you** | Reel — one contested verse, honestly handled | 1×/week | Utility. People save what they expect to need |

The number is the whole trick. It converts "nice fact" into "I am mid-way through something."

### Change 3 — Fix the profile before adding traffic to it.

Every one of these is a compounding multiplier on all future reach, and all are ~30 minutes total:

- **Unfollow down to <20.** Following 55 with 19 followers is the single loudest low-quality signal
  on the profile. Follow back only real accounts.
- **Get past 100 followers this week by hand.** Church, small group, family, friends, the WhatsApp
  group. Under 100, most humans will not follow — the number itself is the objection. This is not a
  vanity move; it removes a real conversion blocker.
- **Rewrite the bio to a promise, not a description.** Current: *"Helping Christians answer the hard
  questions with confidence and grace."* That describes; it does not promise. Try:
  > **The hard questions, answered honestly.**
  > We steelman the objection before we answer it. 85 cited deep dives · 5 review stages.
  > 👇 Start with the one you're actually being asked
- **Add 4 Highlights** — *Start here* · *Islam* · *Resurrection* · *Is Jesus God?*. A new visitor
  currently has nothing to browse.
- **Pin the top 3**: the 172, the 126, and the strongest new one. The profile's first impression
  should be its best work, not its most recent.
- ⚠ **Wire the bio link properly.** `links.html` **does not exist in the repo** and the bio points
  at the bare homepage. A viewer who taps from a resurrection reel should land on the resurrection
  answer, not a generic front page. Build a `/links` page on our own domain (never Linktree — the
  traffic is ours) with 4–5 rotating destinations. *This is a dev task I can do in a follow-up;
  it is still open as `0.4` in `SOCIAL_GROWTH_PLAN.md`.*

### Change 4 — Stop treating Instagram as the main platform.

At 19 followers, Instagram is the *hardest* of the three short-form platforms to grow, because IG
weights follower-graph signals more heavily than TikTok or Shorts. The same MP4 posted natively to
all three costs ~3 extra minutes and will very likely see TikTok and YouTube Shorts out-reach
Instagram 5–20× within a month.

**YouTube Shorts specifically compounds with work we have already done:** Shorts is
search-indexed, and the site has 102 answer pages targeting the exact same questions. Title each
Short with the question **verbatim** from the answer page. That is the only channel here where
month-6 traffic exceeds month-1 traffic from the same upload.

---

## 3. What content to make — formats, ranked for *this* account

| # | Format | Effort | Why it ranks here | Buildable today? |
|---|---|---|---|---|
| 1 | **Hook-on-camera + certified card payoff** — owner delivers 5–8s of hook to camera, cut to the existing card reel with voiceover | Medium | Every account growing in this niche is face-led. Buys the creator-signal without a full talking-head production | Yes — phone + existing MP4 |
| 2 | **Voiced card reel** (current reel + VO + sound) | Low | The straight fix to watch-through. 55 scripts already written | Yes — `gen_reel.py` already emits the VO script + `.srt` |
| 3 | **Carousel** (5–7 portrait cards) | Low | Highest **save** rate of any IG format, and saves are the signal that expands a small account's reach | ✅ Yes — see correction below |
| 4 | **Objection screen-grab response** | Low | Our 126-view post was this. Highest-affinity format in the niche: real objection, real answer | Yes |
| 5 | **Stories** — polls, "which next?", reshares | Trivial | Daily touch; keeps the existing 19 warm and feeds the ranking | Yes, ungated (process only, no new truth-claims) |

⚠ **Correction: carousels ARE buildable today.** `SOCIAL_GROWTH_PLAN.md` says they would need new
tooling. They would not — **`tools/reel/gen_card.py` already takes a `cards` array and already
supports `--aspect portrait` (1080×1350, the correct IG carousel size)**, reusing the reel engine's
themes and fonts. One spec file → N branded PNGs → one carousel upload. The gating requirement
stands (each slide is doctrinal content), but the *tooling* objection is void. **This is the
cheapest unexploited format we have.**

### Hook rules (the first 1.5 seconds decide everything)

- **Withhold the payoff.** "The most dangerous sentence Jesus said" (172) beats "There is one seat…"
  (118) because it names a thing and refuses to say what it is. Convert assertions into gaps.
- **Lead with the hostile witness.** "Even Bart Ehrman admits…" outperforms anything in our own
  voice. We have this material everywhere and under-use it in hooks.
- **Motion in frame from frame one.** A static card that fades in reads as a screenshot and gets
  scrolled. Push in, or open on a hand/face/screen.
- **Never open with the brand.** The logo in the first second costs the whole seed batch.
- **Never post an announcement.** Our own data: 5 views. The product is the destination, never the post.

### Non-negotiable: everything still goes through the gate

Every reel spec, carousel spec and X card is gated content under `CLAUDE.md`. All 56 existing reel
specs are stamped (verified). **New carousels and any new hook line that makes a truth-claim need
argument + orthodoxy** (+ neutrality for deity/Trinity/Islam) *before* posting. Stories that are
process/engagement only — polls, "which question next?", reshares — do not.

⚠ **The compression trap applies double here.** A hook line is the most compressed doctrinal string
we produce. The 2026-07-28 pocket-card sweep is the precedent: a line that was orthodox in an essay
inverted John 5:23 once compressed onto a card, and two of three gates passed it. **Hook lines are
gated content, not marketing copy.**

---

## 4. The daily plan

**Time budget: 40–60 min/day, plus one 2-hour production block on Saturday.** This is built for a
solo operator and is deliberately survivable. Consistency beats volume — a plan you abandon in week
3 is worth less than a smaller one you run for six months.

### The repeating week

| Day | Post (once, ~9am or 7pm local) | Stories | Engagement — 20 min, non-negotiable |
|---|---|---|---|
| **Mon** | **Reel** — *Objection #N* | Poll: "Have you been asked this?" | 10 substantive comments on peer accounts (5–50K) |
| **Tue** | **Carousel** — *Even the skeptics grant…* | Reshare Mon's reel w/ one added line | 10 comments; reply to every comment on Mon+Tue |
| **Wed** | **Reel** — *The verse they use on you* | Behind-the-scenes: a source page, a citation being checked | 10 comments |
| **Thu** | **Carousel** — question breakdown | Poll: "Which should we answer next?" (2 options) | 10 comments; DM-reply anyone who replied to a story |
| **Fri** | **Reel** — *Objection #N+1* | Reshare the week's best | 10 comments |
| **Sat** | *(no post)* | 1 reshare | **Production block, 2h** — see below. Plus reply to every comment of the week |
| **Sun** | **Pastoral post** — reel or carousel, gentler register | "For anyone having a hard week" | Light. Rest genuinely |

**Every posting day, in order (~25 min):**

1. **Post at the same hour** — pick 9am *or* 7pm and hold it for 30 days. Start Wed/Thu; those are
   the strongest windows in this niche.
2. **Cross-post the identical file natively** to TikTok and YouTube Shorts within 10 minutes.
   Never a link, never a watermarked re-share. Shorts title = the question **verbatim** from the
   matching `/answers/` page.
3. **Caption:** hook line restated → one-line promise → **"Send this to the friend who asked you"**
   (DM-shares reportedly weight 3–5× higher than likes; this exact framing is already written into
   the site) → `apologiadaily.com`.
4. **Hashtags: a fixed pool of 4–5, held constant for 30 days.** Rotating them stops the algorithm
   ever establishing topical authority. Suggested fixed set:
   `#apologetics #christianity #jesus #faith` + one topical.
5. **First 60 minutes: reply to every comment.** Early comment velocity is a direct ranking input,
   and at this size you can genuinely reply to all of them.
6. **Log it** — views, watch-through %, saves, shares, follows-from-this-post. One row per post in
   a sheet. Without this, month 2 is guesswork.

**Saturday production block (2 hours) — the whole week, batched:**

| Min | Task |
|---|---|
| 0–20 | Render the week's assets: `python3 tools/reel/gen_reel.py tools/reel/specs/<slug>.json` ×3 · `gen_card.py --aspect portrait` ×2 |
| 20–60 | Voiceover pass on the 3 reels (read the `.voiceover.txt`), add a quiet trending sound, export watermark-free |
| 60–80 | Film 3 × 8-second on-camera hooks, stitch to the front of each reel *(skip if not going on camera — do the VO only)* |
| 80–100 | Write 5 captions + confirm the fixed hashtag set |
| 100–120 | Schedule all five in Meta Business Suite. Review last week's log; pick next week's five |

**A week produced ahead is the difference between this running for six months and stopping in
week 3.** Never post from an empty queue.

### The first 30 days — concrete calendar

Every reel below is an **already-gated spec** in `tools/reel/specs/`. Carousels marked ⚠ need a
gate pass before posting (they are new compressions, even though sourced from certified essays).

**Week 0 (this week — before posting anything):** unfollow to <20 · rewrite the bio · build the 4
Highlights · pin the top 3 · hand-recruit to 100 followers · **pull the four Insights numbers** ·
produce week 1's five assets.

| Day | Slot | Asset | Hook (rewrite the existing card's opener to this) |
|---|---|---|---|
| **W1 Mon** | Objection #1 | `why-were-women-the-first-witnesses` | "A made-up resurrection story would never include this." |
| W1 Tue | Carousel ⚠ | from `library/minimalfacts.html` | "5 facts even atheist historians grant about Easter" |
| W1 Wed | Verse #1 | `did-jesus-claim-to-be-god` | "The verse they'll quote to prove Jesus never claimed it." |
| W1 Thu | Carousel ⚠ | from `library/manuscript.html` | "What 'the Bible was changed' actually means" |
| W1 Fri | Objection #2 | `did-the-church-invent-jesus-divinity-at-nicaea` | "Nobody voted Jesus into being God. Here's the vote count." |
| W1 Sun | Pastoral | `where-is-god-when-im-hurting` | "Not a clever answer. A different kind of one." |
| **W2 Mon** | Objection #3 | `why-did-the-disciples-die-for-their-faith` | "Would you die for something you *knew* was a lie?" |
| W2 Tue | Carousel ⚠ | from `library/jesus_as_god_nt.html` | "4 things Jesus did that only God does" |
| W2 Wed | Verse #2 | `isnt-the-trinity-a-contradiction` | "The verse people think disproves the Trinity." |
| W2 Thu | Carousel ⚠ | from `library/finetuning.html` | "The numbers atheist physicists concede" |
| W2 Fri | Objection #4 | `was-jesus-copied-from-pagan-myths` | "The scholar who buried the Osiris theory wasn't a Christian." |
| W2 Sun | Pastoral | `if-god-is-good-why-suffering` | "We're not going to tidy this one up." |
| **W3 Mon** | Objection #5 | `who-made-god` | "'Who made God?' isn't a checkmate. It's a category error." |
| W3 Tue | Carousel ⚠ | from `library/islam-eternalword.html` | "The question Islam answered about its own book" |
| W3 Wed | Verse #3 | `honor-the-son` | "One sentence in John that decides the whole argument." |
| W3 Thu | Carousel ⚠ | from `library/earlydate.html` | "How fast is the resurrection story, really?" |
| W3 Fri | Objection #6 | `is-the-quran-corrupted` | "Islam's own sources, on Islam's own book." |
| W3 Sun | Pastoral | `nabeel-qureshi-conversion` | "He wasn't argued out of Islam. Not exactly." |
| **W4 Mon** | Objection #7 | `did-the-disciples-hallucinate` | "Groups don't hallucinate. That's not a Christian claim." |
| W4 Tue | Carousel ⚠ | from `library/eyewitnesses.html` | "Who actually wrote the Gospels?" |
| W4 Wed | Verse #4 | `phil2-deity` | "Paul quotes a hymn older than the letter he's writing." |
| W4 Thu | Carousel ⚠ | best-performing W1–W3 topic, re-cut | *(chosen from the log)* |
| W4 Fri | **Re-post the W1–W3 winner**, new hook line, same video | | Winners keep winning; new hook reaches new viewers |
| W4 Sun | Pastoral | `god-pitched-his-tent` | "The word John used was 'camped'." |

**Register rotation is preserved** (bold → evidence → curiosity → steelman → pastoral); never two of
the same register back to back. Islam content is spread, never clustered — clustering it makes the
account read as anti-Muslim rather than pro-honest-comparison, which is neither what we are nor what
the essays do.

---

## 5. Targets, and what to do if they're missed

Set against a cold start with 19 followers. **These are checkpoints, not promises** — growth in
this niche is lumpy: one piece hitting a nerve outperforms three months of averages.

| | Day 30 | Day 60 | Day 90 |
|---|---|---|---|
| Followers | 150–300 | 400–800 | 1,000–2,000 |
| Avg views/reel | 400–800 | 1,000–2,500 | 2,500–6,000 |
| Watch-through | >40% | >45% | >50% |
| Follows per 1,000 views | >5 | >10 | >12 |
| Site clicks/month | ~50 | ~200 | ~500 |

**Read the leading indicators, not the follower count.** In month 1 the number that tells you it is
working is **watch-through**, then **saves + shares**, then follows. Followers are the last to move
and the least useful to steer by.

**If day-30 watch-through is still under 30%:** the audio/hook work did not land. Go to on-camera
hooks — that is the remaining untried lever, and it is the one every growing account in this niche
has pulled.

**If watch-through is fine but follows-per-1,000 is under 3:** the *profile* is the leak, not the
video. The series numbering and the Highlights are the fix — re-do Change 2 and 3 properly.

**Do not**, in the first 90 days: boost posts, pay creators, pitch Collabs to accounts over 100K
(there is no track record yet to justify their time), or run Meta ads. Ads remain blocked for
independent reasons — see `META_ADS_PLAN.md`; the arithmetic does not work, and `privacy.html:202`
promises readers we use no advertising cookies.

**Do**, once there is a track record: pitch Collabs to peer-tier accounts (5–50K) — reportedly ~2.3×
reach vs. a solo post, and the 13+ Islam essays plus `worldviews.html` are a genuine pitch
differentiator at that tier.

---

## 6. Still blocked on the owner

1. **The Instagram handle**, so the site can finally link to it — footer icons, `sameAs` schema, and
   `twitter:site`. **1,108 pages carry a `twitter:card` and 0 carry `twitter:site`**; every share
   credits nobody. Open since 2026-07-28.
2. **The four Insights numbers** in §1 — 15 minutes, and they decide which half of this plan to
   front-load.
3. **On camera or not?** (Change 1/Change 3.) This is the single biggest fork in the plan. Either
   answer is workable; the plan above assumes *voice yes, face optional*.
4. **Who does the daily 20 minutes of engagement.** It cannot be automated and it is the highest-
   leverage unpaid lever a 19-follower account has.

---

## 7. Corrections this file makes

| Doc | Claim | Correction |
|---|---|---|
| `REEL_POSTING_PLAN.md` rule #1 | "Post the reel, never a screen-recording (147 vs 0–22)" | Current data contradicts it — the screen recording did **126** vs 5/16 for two branded cards on the same topic. Rule is now *motion and a human hand beat a static card*; the branded card is a payoff, not a hook |
| `SOCIAL_GROWTH_PLAN.md` | "Carousels: not buildable today — would need new tooling" | **False.** `gen_card.py` already renders N branded portrait (1080×1350) cards from one spec. Gating still required; tooling is not |
| `SOCIAL_GROWTH_PLAN.md` | "3 reels/week is the cadence; 18 weeks of runway" | Runway is right (56 gated specs), cadence is wrong for a cold start. 5 posts/week + daily engagement, and the **engagement** is the growth lever at this size — not the post count |

## Verified in the working tree (2026-08-04)

| Claim | Check | Result |
|---|---|---|
| All reel specs gated | parsed `reviewed` key in all 56 | 56/56 ✅ |
| Specs carry voiceover scripts | `grep -L '"voiceover"'` | 55/56 |
| Reels render silent | `gen_reel.py` header | confirmed — "no voiceover engine"; emits `.srt` + `.voiceover.txt` for an editor pass |
| Carousels buildable | read `gen_card.py` | ✅ `cards` array + `--aspect portrait` (1080×1350) |
| `/links` page exists | `ls links.html` | ❌ does not exist |
| Site links to Instagram | `grep -rl instagram.com --include=*.html` | ❌ 0 hits |
