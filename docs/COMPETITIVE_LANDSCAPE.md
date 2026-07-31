# Competitive landscape — Apologia Daily vs. Logetics vs. Apologetics Ark

**Snapshot date: 2026-07-31.** Two direct competitors appeared in the App Store in the last ten weeks.
This is the side-by-side, and the decisions it forces.

> **How this was gathered, and what is NOT verified.** Everything below comes from public sources:
> Apple's App Store lookup API, the Google Play listing, and each product's own website. **Neither
> competitor app has been installed or used** — this session runs on Windows, both are iOS-first, and
> Logetics has no web or Android build. So **feature lists are their claims, not observations**, and
> **content quality is entirely unassessed.** Where that gap matters most, it is flagged. Apologia Daily's
> own figures are read from `index.html` and the repo.

---

## 1. The three at a glance

| | **Apologia Daily** | **Logetics** | **Apologetics Ark** |
|---|---|---|---|
| **Maker** | (you) | Lead Pamp LLC | Sam Ramey / Apologetics Ark LLC — "one developer" |
| **First shipped** | web, live | **App Store 30 Jul 2026** | **App Store 22 May 2026** |
| **Version** | — | 1.0 | **3.0.0** (updated 25 Jul) |
| **Platforms** | web (native scaffolded, **not submitted**) | iOS only (Android "coming soon") | **iOS + Android + web** |
| **Traction** | 9 months of PostHog data, **unread** | **0 ratings** | iOS **29 ratings, 4.97** · Android **50+ installs** |
| **Price** | **$8/mo "planned · launching soon"** | **Free, no paywall, no sign-up** | Free → **$2.99/mo or $19.99/yr** |
| **Store category** | — | Reference / Education | Reference / Education |
| **Age rating** | — | 12+ (violence, mature themes) | 4+ / 3+ |
| **Languages** | EN + partial MK, ES | EN | EN |

**Scale check first, so the rest is read correctly.** 29 ratings and 50+ Android installs is hobby scale.
Logetics has zero. **Neither is an incumbent and nobody has won this category.** The pressure they create
is not competitive displacement — it is *price anchoring* and *shipping cadence*.

---

## 2. Pricing, side by side

| | Monthly | Yearly | Effective /mo |
|---|---|---|---|
| **Apologia Daily (planned)** | **$8.00** | — | **$8.00** |
| Apologetics Ark | $2.99 | $19.99 | **$1.67** |
| Logetics | — | — | **$0.00** (today) |
| *PrayArch — same dev as Logetics, for reference* | $9.99 | $49.99 | $4.17 |

Your planned price is **2.7× Ark's monthly and 4.8× its effective annual rate**.

⚠ **Do not read Logetics' $0 as permanent.** The same developer's other app, **PrayArch** (shipped 3 Jul
2026), is free-to-download and then **$9.99/mo, $49.99/yr, or $2.99/week** behind a 7-day trial — weekly
billing being a high-pressure pattern. Logetics' landing page already runs on GoHighLevel, a sales-funnel
platform, with email capture wired. The most likely reading: **"free, no paywall" is a launch-phase
land-grab, not a business model.** Expect a paywall.

⚠ **Currency.** Ark's Play listing served A$4.59 / A$30.99, matching US $2.99 / $19.99. Your own `$8` is
rendered with **no currency code anywhere in the repo** — an Australian reader sees AUD, an American USD.
Harmless while nothing can transact; a billing-expectation problem the day checkout goes live. This is
already an open item; the comparables make it urgent.

---

## 3. ⭐ What each one puts behind the paywall — the most useful finding

This is where the three genuinely diverge, and it is the thing to decide about.

| | **Free** | **Paid** |
|---|---|---|
| **Apologia Daily** | Evidence Library **summaries** of all 63 arguments · Glossary (66) · devotional (365) · 10 study plans · **1 AI question/week** · **1 debate/week** · 2 games | the **deep-dive essays**, unlimited AI, the rest |
| **Apologetics Ark** | **full digital Bible · verse-by-verse breakdowns of the whole Bible · all apologetics articles** · 3 study cards/day | **tools**: unlimited cards, cross-reference library, **dark mode & themes**, bookmarks/history/stats, verse highlighting |
| **Logetics** | everything | — |

**Ark gives the content away and charges for utility. You give summaries away and charge for the
content.** Ark charges $2.99 for dark mode and unlimited flashcards; you propose $8 for the essays.

That is not automatically wrong — see §6 — but note the exposure plainly: **on content access, your free
tier is the least generous of the three, while your per-unit production cost is by far the highest.** A
visitor comparing the three on a phone cannot see your five review gates. They can see who lets them read
the article.

---

## 4. Features

| | Apologia Daily | Logetics | Apologetics Ark |
|---|---|---|---|
| Long-form cited essays | ✅ **86 essays, 132 verified sources** | "hundreds of entries, 24 topics" | "apologetics articles" |
| Short answers | ✅ 103 answer pages | ✅ 30-second answer + full breakdown | ✅ |
| AI assistant | ✅ `/api/ask`, retrieval over gated sources + briefs | ✅ **"Lo"** — *library-only, refuses if not covered* | ❌ |
| Daily habit + streak | ✅ devotional | ✅ daily question | ❌ |
| Multi-day courses | ✅ 10 study plans | ✅ Learning Tracks ("Trinity in 7 Days") | ❌ |
| Flashcards / drilling | ✅ pocket cards, flashcards, mastery | ✅ Drill Mode | ✅ **"The Armory"** cards |
| **Built-in Bible reader** | ❌ | ✅ verses link app-wide | ✅ **whole-Bible verse-by-verse** |
| **Quran / hadith inline** | ❌ | ✅ tap any ref | ❌ |
| Video, timestamp deep-links | ✅ video library | ✅ **jump to the exact minute in-app** | ❌ |
| Share-image cards | ✅ generator | ✅ | ✅ verse ranges |
| Offline | app-bundled | ✅ full library offline | — |
| Folders / bookmarks | — | ✅ user-named | ✅ "My Ark" (paid) |
| **Debate practice** | ✅ **Debate Arena** | ❌ | ❌ |
| **Study groups / community** | ✅ groups, reading clubs, journal | ❌ | ❌ |
| **Pastoral / crisis routing** | ✅ **PASTORAL CARE path in `api/ask.js`** | ❌ not advertised | ❌ not advertised |
| **Published editorial standard** | ✅ **"Checked Before Published" + corrections log** | ❌ | ❌ |
| Denominational neutrality | ✅ enforced by gate | implied ("argued honestly") | ❌ **explicitly not** — see §5 |

**They have that you don't:** a real Bible reader (both), inline Quran/hadith (Logetics), timestamped
video deep-links (Logetics), user folders.

**You have that neither does:** Debate Arena, study groups/reading clubs/journal, the pastoral-crisis
path, a published review standard with a corrections record, and translated content.

---

## 5. Positioning — they are not all aiming at the same reader

**Logetics — the neutral reference desk.** *"Answer. Train. Study."* Its pitch is the blank-mind moment:
someone asks a hard question and you freeze. It handles "Christian, Muslim, and Jewish sources the same
way," and says it is "built for study and for better conversations, not for winning comment sections."
Its headline differentiator is a *restraint* claim about its AI: **"Lo only works from the library. If
nothing in there covers your question, he'll tell you so instead of making something up. That rule is
the whole point of him."**

**Apologetics Ark — discernment and Bible study.** Verse-by-verse through the whole Bible, plus articles
on "**false teachers and prophets**… examined using their own sources," and worldview comparison "always
represented fairly, always answered **from Scripture**." Its website describes itself as a "**directory**…
of reliable **recommended** Christian content," with a disclaimer that recommendations are "purely from
our own opinion."

**Apologia Daily — the cited case, denominationally neutral.** Original long-form scholarship, five review
gates, primary sources verified word-for-word, arguments that hold under a sceptic's pressure.

Two consequences worth naming:

- **Ark occupies ground you have ruled out on principle.** "False teachers" content adjudicates
  intra-Christian disputes; `CLAUDE.md` forbids that outright. They can serve an audience you cannot —
  **and you can claim a neutrality they cannot.** That is a clean differentiator in both directions, not
  a defeat.
- **Ark's "answered from Scripture" is a different epistemology from yours.** You argue from manuscripts,
  history and philosophy, and are careful that manuscripts prove *preservation, not truth*. Yours is the
  register that travels to someone who does not already accept Scripture. Theirs is for someone who does.
  **Different products; the overlap in the store category overstates the overlap in purpose.**

⚠ **One uncomfortable convergence.** Logetics is *marketing* the discipline you actually built — an AI
that will not invent beyond its sources. And you made the deliberate **opposite** design choice:
`api/ask.js` treats briefs as **optional** framing so the model still weighs its own knowledge and the
pastoral path can always win. That is defensible and arguably right for a ministry — but it is now a
distinction you must *explain*, not one you can claim.

---

## 6. ⭐ Where the gated standard is a real moat — and where it is just slower

The honest answer is: **it is a moat for exactly two things, and pure cost for everything else.**

### It is a genuine moat when…

1. **The reader is going to be challenged and needs to not be embarrassed.** A four-week build cannot
   produce content that survives an informed opponent. Your five gates exist because compressed,
   confident, wrong material is worse than nothing. *That* is the product.
2. **The topic is contested and high-stakes** — deity of Christ, the Trinity, Islam. This session's own
   work is the proof: drafting Synoptic-preexistence material, the citations gate caught a **fabricated
   quotation** (a Matthew 5:17 splice presented as ESV) and a **wrong Greek claim**; the neutrality gate
   caught that a fence protecting against Arian misreading existed only inside a tooltip. **Four
   independent lenses caught four defects in one short passage.** Nobody shipping a v1.0 in four weeks is
   running that, and a reader who checks will eventually find out.
3. **Trust is the purchase decision.** You are the only one of the three with a published standard and a
   corrections log. That is a real asset — but see the warning below.

### It is just slower when…

1. **The content is uncontested.** A Bible reader, a verse-by-verse breakdown, a glossary, dark mode, a
   folder feature — none of these need a doctrinal gate, and gating them buys nothing. **Ark shipped a
   whole-Bible reader; you don't have one.** That gap is not a standards gap, it is a scope gap.
2. **It blocks shipping the app at all.** Two competitors reached the App Store while your iOS build has
   still never been compiled or device-tested. The standard did not cause that, but the standard is what
   the time went into.
3. **It is invisible at the point of decision.** In a store listing, five review stages look exactly like
   zero review stages. **A moat nobody can see is not doing competitive work** — it is doing integrity
   work, which is worth doing for its own sake but should not be mistaken for marketing.

⚠ **The one thing that would turn the moat into a liability.** Your public claim is currently scoped to
essays — *"no essay published until it clears five review stages"* — because `pocket-cards.html`,
`flashcards.html` and `explain-it-back.html` are still unstamped and outside `CONTENT_PATTERNS`. If a
competitor or a critic ever finds ungated content behind a trust claim, the standard becomes the
attack surface. **Close those three before widening the claim.** The scope discipline already in
`CLAUDE.md` is exactly right; hold it.

---

## 7. What this forces a decision on

| # | Decision | Why now |
|---|---|---|
| **1** | **Price.** Is $8 defensible against $2.99 and $0? | Two live comparables where there were none. Options: hold $8 and justify by depth/community; move toward ~$3–5; or make content free and charge for community/coaching, as Ark charges for tools. **Owner call — this doc does not make it.** |
| **2** | **What the paywall gates.** Essays, or utility? | You are the only one gating the *content*. Also the only one whose content costs five gates to make. Both facts are true; they point opposite ways. |
| **3** | **Ship the iOS app.** | The `pod install` + Archive step on your iMac is now the single highest-leverage unblocked task. Two competitors shipped during the wait. |
| **4** | **Read the PostHog data.** | Nine months, unread. You are about to make a pricing decision against competitors with 29 ratings between them while holding better data than either. |
| **5** | **Consider a Bible reader.** | The one feature both competitors have and you lack. No doctrinal gate needed. |
| **6** | **Decide whether to say the AI restraint thing out loud.** | Logetics is selling it. You built something more careful and deliberately less restrictive. Either explain it or expect to be compared unfavourably on a point where you are actually ahead. |

---

## 8. The next concrete step, if you want evidence rather than inference

Nothing above assesses **content quality**, which is the axis where you are strongest and where a
fast-shipped competitor is most likely thin.

On an iPhone, ~20 minutes: open Logetics, pull 3–4 entries from the **Islam cluster** (they advertise
even-handed Christian/Muslim/Jewish sourcing, so it is their claim to defend) plus two deity-of-Christ
entries. Screenshot the short answer, the full breakdown, and **the source list**. Send them over and they
can go through `apologia-citations` exactly as this session's own material did.

Two one-question tests worth running while in there:
- Ask **Lo** something the library plainly does not cover. Their whole differentiator is that he refuses.
- Ask **Lo** a pastoral question — something in the register of *"I don't think I can keep going."* Your
  `api/ask.js` overrides everything and routes to a real person. If Logetics answers that with
  apologetics, it is a serious gap, and not one closed by shipping features.
