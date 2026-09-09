# BibleProject → Apologia Daily: competitive study — 2026-09-09

**Produced by:** the `apologia-product` research agent (read-only), grounded in `CLAUDE.md` and
`docs/LEARNING_ROADMAP_2026-09-09.md` (this extends that roadmap; it deliberately repeats none of its items).
**Companion to:** the roadmap (learning mechanics). This report covers BibleProject-specific patterns — content
architecture, free courseware, the donor funnel, localization, and pain-point homepage copy.

> ⚠ **Method limitation — read first.** Direct page-fetch (`WebFetch`) was blocked by the sandbox egress policy for
> every domain tried (`bibleproject.com` and all subdomains, plus wikipedia, the app stores, ministrywatch and others).
> **Everything below comes from `WebSearch` synthesis of live page content**, not a click-through crawl. Exact copy is
> marked *confirmed* (page title/headline) vs *paraphrased*. Items WebSearch could not resolve are marked
> **unverified**. Treat this as a reliable map with soft edges; a session with working WebFetch should spot-check the
> flagged items.

---

## 1. Page-by-page map

| Page | What it is | Mechanic | Copy pattern |
|---|---|---|---|
| **Homepage** | Front door to the ecosystem | *Confirmed* page title: **"Study the Story of the Bible With Free Tools"** (H1 not independently confirmed). Routes to Explore, Classroom, Podcast, App, Give. "Free" and "tools" up front. | Value-led on the homepage; the pain-point framing appears lower in the funnel (reading-plan and article titles), not in the hero. |
| **Explore / Videos** | The video library hub | Organized on **three axes at once**: (a) OT/NT book-by-book overviews; (b) cross-cutting **Themes** (justice, the city, water of life…); (c) **"How to Read the Bible"** — a meta-series teaching *skills* (design patterns, poetry, metaphor) rather than content. | Titles are one word or a short phrase ("The City," "Justice"), never a sentence. |
| **Classroom** | Free, self-paced "seminary-level" video courses | Classes run **4–16 hours** in **20–30-minute sessions** (flagship *Introduction to the Hebrew Bible* = 5 modules, 29 sessions, 5 quizzes). Each session = video + downloadable **teacher's notes** + **quiz** + **reflection questions**, saved to account and synced web/app. Completion earns a **digital certificate** (explicitly *not* accredited; a Northern Seminary partnership can convert a class into up to 6 real credits). Free account to save progress; self-serve enrolment. | "Graduate-level depth, YouTube-level accessibility" (*paraphrased*). The help centre tells newcomers **which class to start with** — one recommended default. |
| **Podcast** | Long-form founder conversation | Organized into **named series tied to video/theme releases**, not numbered seasons. ~525 episodes over 11 years (**unverified count**). Explicitly the *deep* layer behind the *shallow* video layer. | — |
| **App** | Free companion, no paywall anywhere | Four tabs: Home (continue where you left off across video/podcast/class), Search, Bible (5 translations), Me. Reading plans pair Scripture with the matching video at the relevant chapter. Offline downloads; push for new releases. **No subscription tier exists in-app** — monetization is 100% off-app. | "100% free" repeated everywhere — a brand pillar. |
| **Reading plans** | The conversion funnel from "watch" to "read the Bible" | **30+ plans hosted on YouVersion** (not their own reader), from 5-day topical to a full year. Flagship *One Story That Leads to Jesus* (refreshed 2026, 150+ paired videos) — described by a third party as the most-completed serious plan online (**unverified**). | The clearest "next concrete step" on the whole site: "read chapter X today, here's the 6-minute video." |
| **Guides** | Printable study companions | Same book/theme taxonomy as Explore. Each pairs a video with **study notes, discussion questions, and annotated transcripts** — built explicitly for **small-group/church use**. | "Good for individuals **and small groups**" — group use is first-class. |
| **About / mission** | Origin + funding pitch | Founded 2014, Portland, by Tim Mackie (scholar) + Jon Collins (storyteller). Mission: the Bible as **one unified story leading to Jesus** (*paraphrased*). 501(c)(3), donor-funded from day one. | The scholar-plus-storyteller founding story is itself the marketing. |
| **Give / patrons** | The entire monetization surface | Framed as joining **"a crowd of generous supporters."** Average gift reported under $20/month. Revenue reported <$900K (2015) → >$9M (2019) → $14.5M (2022) → $26.7M (2023) via MinistryWatch (**unverified at primary source**). Patron perks are gratitude extras; **nothing is ever gated.** | The ask is never "pay for what you use" — it's "keep this free **for someone else**." |
| **Articles / blog** | Text companion to the videos | **One taxonomy across four content types** (video, podcast, guide, article) — not four separate structures. | — |
| **Languages** | Full non-English product | ~55 languages, each with translators, voice artists, re-animation and a **language advisor reviewing every video**. Spanish runs on its own domain, `proyectobiblia.com`. | — |
| **Onboarding** | First-visit routing | "Where do I start?" is a **named, findable FAQ with one recommended default** (Intro to the Hebrew Bible; the flagship reading plan) — not the full catalogue. | — |
| **Design** | Visual identity | Hand-drawn whiteboard-style 2D illustration, warm muted palette, animated maps/timelines, calm two-voice narration, 5–10-minute videos. | The style *is* the differentiation claim: depth without looking academic. |

---

## 2. The most transferable things — ranked by impact ÷ effort

"Gate" = touches `apologia-argument` / `apologia-orthodoxy` (+ `apologia-neutrality` for deity/Trinity/Islam).

1. **A single, named "where do I start" answer outside onboarding.** BibleProject answers it as a findable FAQ with one default. Apologia's onboarding picker personalizes, but someone landing cold on `library/index.html` or `evidence-library.html` meets 92 essays and 8 tabs with no default. *Change:* one "New here? Start with [X]" banner on those two hubs pointing at one essay (candidates: `earlycreed.html`, `kalam.html`). *Effort:* Small. *Gate:* none — a routing decision.

2. **The "Guides" pattern → a printable discussion guide per essay, framed for group use.** Study Groups exists, but there is no artifact designed to be printed and taken to an in-person group. *Change:* a print view per essay with 3–5 discussion questions **ported verbatim** from the essay's certified objections section + its pocket card. *Effort:* Medium. *Gate:* small (ported text, new surface).

3. **One taxonomy across formats.** BibleProject cross-shelves video, podcast, guide and article under the same categories. Apologia's essays, `/answers/*`, reels and pocket cards each have their own organization. *Change:* a "More on this topic" rail at the foot of each essay linking its mastery page, pocket card, Debate Arena persona (if any), and reel/X card — all already certified. *Effort:* Small–Medium. *Gate:* none if pure linking.

4. **Classroom's per-session shape, bundled into a named multi-session class.** Apologia has the pieces (essay + mastery page + flashcards + Explain It Back) but no named, ordered course. *Change:* bundle 4–6 certified essays + mastery pages into one named class (e.g. "The Case for the Resurrection: a 5-session course") with next/previous flow and a completion share-card. Study Plans may already be most of this — cheap to validate. *Effort:* Medium. *Gate:* none for sequencing; small on intro/certificate copy.

5. **The reading-plan pattern: one concrete task today, not "browse."** `/today` is the analog and is already in the nav. The BibleProject-specific lesson is that their plan is *the* headline action; Apologia's hero still sells identity. *Change:* pull `/today`'s first task into the hero's visible next step (see §4). *Effort:* Small. *Gate:* small — hero copy is public claim-bearing text.

6. **A canonical "new to apologetics entirely? start here" plan**, named in onboarding. `beginners-path.html` may already be this — then it's a discoverability fix. *Effort:* Small. *Gate:* none if unchanged.

7. **Annotated, exportable transcript** — a printable/audio-synced document of an essay with its evidence callouts inline, for offline study or handing to someone. Read-along + "See the evidence" already exist; this is repackaging. *Effort:* Medium. *Gate:* none (port, don't author).

8. **Content-specific discussion prompts inside Study Groups** — a weekly prompt tied to the group's current argument, ported from the essay's "objection you will actually meet." *Effort:* Small–Medium. *Gate:* small.

9. **Localization as a real pipeline — external confirmation of an existing policy.** BibleProject uses a human language advisor per language, never a translation API. This *validates* `CLAUDE.md`'s standing rule (absent beats wrong; never hand-write translated doctrine no native reviewer will gate). Not a build item.

10. **Certificates as a completion artifact**, reusing the share-card generator. *Effort:* Small. *Gate:* small — must never imply accreditation or theological authority; be at least as careful as BibleProject, which says theirs isn't accredited.

---

## 3. What NOT to copy — and the honest donor-model assessment

**Don't copy video-first production.** BibleProject's brand is custom animation with a real art-and-writing pipeline funded by a ~$27M/year budget. Apologia's text-first, AI-tutor-first model fits its team size. Take the **information architecture and habit mechanics**, not the medium.

**Don't copy the donor/patron model — and here is why it is a trap if misread.** "BibleProject makes everything free and thrives" is *not* evidence that the Pro paywall is wrong:
1. **Their donor base took years and a structural advantage.** Revenue went <$900K → >$9M in four years on viral YouTube reach a text platform is unlikely to replicate, and as a **501(c)(3)** US donors deduct gifts — an incentive a commercial product cannot offer.
2. **"Free + donor-funded" is a full-time fundraising operation**, not an absence of monetization: patron perks, a patron event, relationship-based cultivation. Arguably harder to run solo than a checkout flow.
3. **It contradicts Apologia's own economics.** `docs/META_ADS_PLAN.md` / `docs/GROWTH_PLAN_SIMPLE.md` already show the CAC/LTV math doesn't support free-plus-ads; free-plus-donors has the same problem in reverse — it needs a large existing audience or continuous solicitation.

**Verdict:** BibleProject is a lesson in *architecture and habit design*, and a trap if read as "make it all free and donors will come." The instinct worth keeping is *free-tier generosity builds trust* — inside the paywall that already exists. Apologia's correct reference class is Brilliant/Duolingo (freemium), not a nonprofit.

**Don't claim "100% free, nothing gated"** while a Pro tier exists — `editorial-standards.html` exists precisely to prevent that kind of contradiction.

**Don't chase per-language branded domains.** `proyectobiblia.com` sits downstream of a dedicated localization team. The current MK/ES situation is resolved by doing *less, more carefully*.

---

## 4. Homepage hero rewrites — BibleProject pain-point style (DRAFTS, ungated)

Current hero (`index.html` ~976–985): eyebrow "Christian Apologetics Platform" · H1 **"Defend Your Faith with Reason & Evidence"** · sub: "Fully-cited answers to the hardest questions about Christianity. Every citation verified, every objection answered at its strongest, and no essay published until it clears five review stages."

BibleProject's pattern is need-led, not identity-led. **None of these may ship without the content pipeline** — hero copy is public claim-bearing text and is not exempt under the "no content too small to gate" rule.

**Draft 1 — doubt-led (deconstructing audience)**
> H1: *Doubting something you used to believe?*
> Sub: *Start with the one objection that's actually bothering you — get a straight, fully-cited answer, not a brush-off.*
> ⚠ Gate check: must not route someone in genuine crisis past the pastoral-care carve-out; "straight answer" must not imply a false symmetry.

**Draft 2 — question-led (seeker)**
> H1: *Can you actually defend what you believe?*
> Sub: *92 cited essays, an AI tutor that pushes back, and a daily 10-minute practice — so the next hard question doesn't catch you off guard.*
> ⚠ Gate check: the "92" must come from `tools/update-trust-numbers.mjs`; "pushes back" must match what `api/tutor.js` actually does.

**Draft 3 — friction-named (practising believer)**
> H1: *Someone's going to ask you the hard question. Are you ready?*
> Sub: *Practice the actual objection — Islam, atheism, "aren't all religions the same?" — against an AI opponent, then see exactly what a real scholar would say.*
> ⚠ Hardest gate check: naming Islam in a hero risks reading adversarial; must clear the EXPLICIT-VERDICT / FALSE-COMMON-GROUND *tone* rules even as marketing copy.

**The trade-off, stated plainly:** all three swap the current hero's dignified, non-defensive tone for a concrete friction point. That is a real loss to weigh against 1 Peter 3:15's gentleness — which is why these are drafts, not a recommendation to ship.

---

## 5. The one thing to do first

**Item 3 — the "More on this topic" cross-format rail at the foot of each of the 92 essays**, linking its mastery page, pocket card, Debate Arena persona, and reel/X card. It is the direct analog of BibleProject's one-taxonomy-across-formats pattern; it needs zero new doctrinal prose (pure linking of already-certified content); no gate round beyond confirming link labels don't overclaim; touches no paywall decision; and it makes everything already built and gated work harder before any bigger bet. A natural companion to the roadmap's own first pick (confidence calibration) — both near-zero-cost plumbing.

---

## 6. Sources

**Reached via WebSearch synthesis (direct fetch blocked on all):**
[Homepage](https://bibleproject.com/) · [Explore](https://bibleproject.com/explore/) · [Videos](https://bibleproject.com/videos/all/) · [Themes](https://bibleproject.com/videos/collections/themes/) · [How to Read the Bible](https://bibleproject.com/explore/how-to-read-the-bible/) · [Classroom](https://bibleproject.com/classroom/) · [Intro to the Hebrew Bible](https://bibleproject.com/classroom/introduction-to-the-hebrew-bible/overview) · [Teacher notes PDF](https://documents.bibleproject.com/classroom/teacher-notes/introduction-to-the-hebrew-bible-teacher-notes.pdf) · [Northern Seminary partnership](https://www.seminary.edu/news/bibleproject-classroom/) · [Help: free classes](https://help.bibleproject.com/hc/en-us/articles/4478988494743-Free-online-Bible-classes) · [Help: which class first](https://help.bibleproject.com/hc/en-us/articles/8276751740567-What-class-should-I-start-with) · [Podcast](https://bibleproject.com/podcast/) · [App](https://bibleproject.com/app/) · [App Store](https://apps.apple.com/us/app/bibleproject/id1523687027) · [Google Play](https://play.google.com/store/apps/details?id=com.bibleproject) · [Reading plans](https://bibleproject.com/reading-plans/) · [Flagship plan](https://www.bible.com/reading-plans/22273-bibleproject-one-story-that-leads-to-jesus) · [Guides](https://bibleproject.com/guides/) · [Help: printable notes](https://help.bibleproject.com/hc/en-us/articles/5607919672471-Printable-study-notes-and-annotated-video-scripts) · [Help: groups](https://help.bibleproject.com/hc/en-us/articles/5586269406871-Bible-resources-for-groups) · [About](https://bibleproject.com/about/) · [Give](https://bibleproject.com/give/) · [Patron FAQ](https://help.bibleproject.com/hc/en-us/articles/25114471570583-What-s-a-BibleProject-patron) · [MinistryWatch](https://ministrywatch.com/bibleproject-experiences-rapid-growth-going-into-seventh-year/) (revenue figures unverified at primary) · [Languages](https://bibleproject.com/languages/) · [proyectobiblia.com](https://proyectobiblia.com/articles/) · [Help: new to the app](https://help.bibleproject.com/hc/en-us/articles/4478975400727-I-m-new-to-the-app-Where-should-I-start)

**Could not reach directly** (WebSearch-synthesized only, marked unverified above): wikipedia, faith.tools, the app stores, ministrywatch.com, movieguide.org, grokipedia.com, psephizo.com, `web.` / `help.bibleproject.com` subpaths.
