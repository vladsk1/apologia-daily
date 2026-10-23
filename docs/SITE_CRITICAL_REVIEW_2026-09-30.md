# Apologia Daily: critical site review (2026-09-30)

The owner asked for a critical review covering four things: what isn't a good idea, where we lack against the market, where the site falls short of its goal, and where usability and design fall down. **Pricing, the paywall and Pro features are excluded** because they are still coming.

**How it was done.** Four independent read-only reviews ran in parallel:
1. Market and competitors (repo plus web research).
2. Mission and goal.
3. A hands-on usability and design test. Playwright at 390px and 1440px, about 317 screenshots, and scripted checks across all 156 top-level pages and 101 essays.
4. A feature-by-feature critique.

The highest-impact claims were spot-checked against the code by the coordinating session: the homepage date, `shared-answer.html`, the invented scores, the Study Groups moderation gap, the Worldviews "Coming soon" labels, and the reminder pill covering text.

**No site file was changed.** Figures are measured from the repo on 2026-09-30 unless marked *(est.)* or quoted from an earlier doc.

**What this review does NOT say.** The content's accuracy, orthodoxy, tone and learning design are strengths, and all four reviewers said so independently. The problems below are about **reach, focus, safety, and the experience around the content**, not the content itself.

---

## Top 10: fix these first

| # | Problem | Why it matters | Fix |
|---|---|---|---|
| 1 | **Study Groups is open chat between strangers with no report, block, remove-member or delete-message control.** There are public groups (`study-groups.html:679`) and realtime messages (`:1015`). Accounts are allowed from **age 13** (`terms.html:161`). The privacy policy never mentions group messages. | Child-safety and reputational risk for a faith app that tells parents to send their kids. | Make groups invite-only now. Add report/remove and owner moderation, and an 18+ rule or parent-link rule. Otherwise pull the feature until those exist. |
| 2 | **Anyone can forge a branded answer.** `shared-answer.html:174-190` renders any question and answer encoded in the URL as "A friend shared this answer with you \| Apologia Daily". Nothing checks that we produced it. | Someone can put heresy or abuse under our logo and share it. | Share by a server-stored ID, or only allow sharing the gated `/answers/*` pages. |
| 3 | **Invented scores.** `debate-arena.html:1483` falls back to `\|\| 70`, and `explain-it-back.html:393` to `\|\| 5`, when the AI's reply is malformed. A genuine 0 also shows as 70 or 5. | This is the "manufactured confidence" the site's own standard forbids. | Show "—" whenever the score isn't a number. |
| 4 | **Homepage "Today" card is frozen.** It says "Today · Wednesday, 4 June 2026" (`index.html:1323`), shows pre-filled M–F streak dots for a first-time visitor, and its Listen/Pray/Share buttons have no handlers (`:1328-1339`). | Reads as abandoned or dishonest, and undercuts "Daily", the word in our name. | Render the date and today's argument live from `daily-args.json`, or delete the section. |
| 5 | ~~**31 of 101 essays scroll sideways on mobile.**~~ **WITHDRAWN 2026-09-30: the owner checked on a real iPhone and there is no sideways scroll; the measurement came from desktop Chromium emulation.** Closed `orthonote` / `evidence` popovers (374px wide, absolutely positioned) sit off-screen and widen the page, e.g. `kalam` by +150px and `islam` by +173px. The Macedonian hub tabs overflow by up to 505px. | The flagship content feels broken on the device most people use. | Hide closed boxes (`display:none`) in `orthonote.js` and `evidence.js`, and add `overflow-x:clip` on `body`. |
| 6 | **Floating widgets cover the content.** The "🔔 Daily reminder" pill sits over body text: it cuts off mid-sentence on `ev-m-emptytomb` and covers the Ask textarea. The "Ask AI Tutor" / "Teach me this" edge tabs cover the hero copy on `worldviews`, the Evidence Library and the essays. | That makes three fixed overlays on a phone screen. | Move the reminder into the dashboard or nav, and collapse the tutor tabs into one small icon on mobile. |
| 7 | **There is no path for seekers.** The hero says "Defend **Your** Faith" (`index.html:980`). All five picker options and all three onboarding intents assume a believer (`dashboard.html:1168-1172`). A search of root, answer and library pages for "follow Jesus", "find a church" or "talk to someone" matched only `library/islam.html`. | The mission is to "reach seekers honestly", yet a persuaded seeker has nowhere to go next. | Add an "I'm exploring, not sure I believe" option, plus one gated "Where do I go from here?" page (Christ, Scripture, a local church, a person to talk to), linked from the foot of every answer. |
| 8 | **No one knows who, if anyone, is being served.** PostHog has about 9 months of data that has never been read (`MARKET_RESEARCH_2026-09-03.md`). The only audience data we have is from Instagram: 19 followers, 0 saves, ~7% watch-through. Against that are about 100 essays, 110 answers, 82 mastery pages and 3 language versions. | Effort is being allocated blind. Review cost per edit is very high: 9 rounds for five sentences, ~1.2M tokens for a two-paragraph fix (`CLAUDE.md`). | Read the three funnels in `docs/FUNNEL_EVENTS.md` this week. Make "people served per week" a standing top line, and slow new content until measurement and distribution catch up. |
| 9 | **Quiz games teach contested claims as flat facts, against a timer.** On `speed-round.html`: "What does the BGV theorem **prove**" (`:333`), Isaiah 53 "700 years" before Christ (`:339`), a single fine-tuning figure (`:324`), and a strawman of the moral argument (`:341`). `objection-catcher.html:298,303` (unstamped) says group hallucinations are "not documented", a verdict our own mastery page had to soften. | The graded, memorised layer contradicts our own certified essays, the "retired claim as the correct answer" failure again. | Gate Daily Quiz, Objection Catcher and Who Said It. Pull contested-number questions out of timed formats. |
| 10 | **Too many overlapping tools, several of them half-built.** About 9 "start here / daily" surfaces (Today, Daily Mix, Dashboard, Coach, Daily Quiz, Devotional, Challenge, Study Plans, Beginners' Path). 4 memorisation tools over one argument list (Flashcards, Objection Deck, Palace, Pocket Cards). A "Reading Club" with no members (`readers_list: []`, hardcoded progress). "Coming soon" for JW, Mormonism and Atheism on `worldviews.html:1941/1968/1995` although that content already exists. A dead "Argument Matcher". A "Save" button that just alerts "coming soon" (`video-library.html:925`). | Visitors can't tell where to start, the placeholders read as unfinished, and every surface is one more thing to keep in sync. | Keep one daily entry (Today) and one spaced-repetition deck. Turn the club into book-companion pages, link the worldviews cards to existing content, and delete every "coming soon". |

---

## 1. Features that aren't a good idea

The top-10 items above (1, 2, 3, 9, 10) are the most serious. The rest:

- **A small AI model grades believers out of 100 on contested material.** `api/feedback.js:146` gives Haiku a ~3,000-character rubric about which "virtually all scholars" claims are allowed. Its own header says **neither review lens has read the final text**. The Coach also records a debate against a Muslim as Trinity mastery, and maps `jw` / `mormon` opponents that `debate.js` doesn't have (`debate-arena.html:1496`). → Replace numbers with written coaching, or a three-level band at most, and do the owed confirmation read.
- **Share cards compress arguments into overclaims.** `pocket-cards.html:396-397`: "Naturalism has no explanation"; "Everything that exists has an explanation", a flat version our own grader marks down. Once the image is shared it can't be corrected. → Re-gate every card and put the essay link on each card image.
- **The Conversation Journal records third parties' religious views** ("Muslim friend… they said…"). It syncs to the cloud and is sent to Anthropic via `/api/feedback`. `privacy.html:191` doesn't list the Journal, Devotional or Parents as AI processors. → Tell users not to name people, strip the "who" field before the AI call, and update the privacy policy (GDPR exposure).
- **Maintenance out of proportion to value.** One argument lives on up to six surfaces plus games and cards; 120 files mention the Kalam. There are 82 mastery pages of ~5,700 words each that largely restate their essays, and 8 hub tabs × 3 languages, with the Macedonian and Spanish versions never human-checked. → Generate mastery pages from the essays or cut them to a quiz layer. Freeze the MK/ES expansion until a native reviewer exists. *(This conflicts with the 2026-09-11 "always mirror MK" owner rule, so it is the owner's call.)*
- **Debate Arena personas.** The atheist persona names living people (Dawkins, Harris) without the "don't attribute claims to named people" rule the Muslim persona has. The "teenager" and "student" personas are aimed at a 13+ audience. → Add that attribution rule.
- **Pages that shouldn't be public:**
  - `ask-anything.html` is 301-redirected but still linked from 102 pages.
  - `homepage-v2.html` (noindex) and `monitor.html` (admin) are served publicly.

  → Remove the first two, and move `monitor.html` off the public site.
- **Parents page** shows pop-Barna figures as research-backed stats (`parents.html:182-185`), and the page has no review stamp.
- **Over-promising copy:**
  - `asked-and-answered.html:8` promises a "reviewed answer" for live AI output.
  - `index.html:9` claims five review stages while pastoral sign-off is still `_pending_` everywhere.
  - The homepage says two free questions (`:994`); the widget says 3 (`:1804`).

---

## 2. Where we lack against the market

- **No named human authority.** 0 `reviewedBy` / "How to cite" hits in `/library`, and pastoral sign-off is still pending. Every competitor that wins on trust has a face or a 20-year brand. → Recruit 2-3 named cross-tradition reviewers and put their names on the Trinity/deity/Islam tier first. *All four reviews point to this as the single biggest trust lever.*
- **No owned audio or video.** There are no `.mp3` files. The video library is other people's YouTube, and the essays only offer browser text-to-speech. The apologetics audience lives on YouTube and podcasts. → Record narration of the already-gated essays (no new claims), and publish one weekly audio "answer" to podcast platforms as a distribution channel.
- **No face, no creator distribution.** Every growing voice in this space grows through a person and a debate or reaction format. → Position the site as the "footnoted home" creators link to, with a written outreach kit.
- **Not in the app stores while small rivals are.** Logetics went from 0 to 35 ratings (5.0★) since July, and Apologetics Ark ships quickly. Our Android build missed the Play deadline of 2026-08-31, and iOS has never been compiled. In-app push is wired to nothing.
- **AI Q&A is now a commodity.** Apologist Agent is free and partnered with GotQuestions, Ligonier and others; Bible.ai, FaithTime and Scriptured are all in the space. Our real difference (grounded retrieval, gated briefs, crisis routing) is **invisible in the answer UI**. → Show source cards and "reviewed" badges beside the claims in each answer.
- **Search is shifting to AI Overviews** (GotQuestions traffic is falling). → Answer-first blocks, a named author, and `dateModified` on every page.
- **Positioning is too wide.** Essays, quizzes, a devotional, debate, groups, video, worldviews and an app is a lot for one owner to support, and it's hard to say in one line what the site is for. → Pick one hero promise.
- **Content gaps against the questions people actually ask** (from the 2026-09-03 research, not re-verified here): divine hiddenness, the Canaanite conquest, slavery and hell.
- **No offering for leaders.** Nothing targets youth leaders, campus groups or pastors, even though they are the cheapest way to reach many people. → Offer a free 4–6 week small-group kit built from the existing essays.

**Where we genuinely lead:** depth plus verification (about 100 footnoted essays, a published corrections log), crisis routing in the AI, denominational neutrality enforced by process, and practice tools tied to a certified library.

---

## 3. Where the site falls short of its goal

Goal (from `CLAUDE.md`): strengthen believers' confidence, equip them to give a reason (1 Peter 3:15), and reach seekers honestly.

1. **Seekers.** There is no path at all; see top-10 #7.
2. **Equipping breaks at the last step.** Essay → mastery page works (75 essays link to a mastery page). But the mastery page ends with "Next: the Fine-Tuning Argument" (`ev-m-kalam.html:566`), i.e. the next topic, not the next skill.
   - The Debate Arena reads no URL parameter, so "now defend this against a sceptic" can't be one click.
   - Mastery progress is browser-only, with a single 30-day timer that doesn't feed the `/today` spaced-repetition deck.
   - Nothing loops back from a real conversation into review.

   → End each mastery page with a "Defend it live" button that opens the Arena preloaded with that argument, and add its cards to the `/today` deck automatically.
3. **The five-second test.** The page is clear to a Christian and unclear to anyone else.
   - The subheading sells our review process ("five review stages") instead of what the visitor gets.
   - The homepage is **~19 phone screens long** (15,941px, 12 sections), with 6+ competing actions ("Ask", "See today's session", Beginner's Path, homechat, "Start Free" ×3, "Try the Arena").
   - The page contradicts its own figures: "82 in-depth arguments" in one place, "100 cited deep dives" two screens up.
4. **Audience.** It pitches at a complete beginner and at Greek/Hebrew depth at the same time; the median essay is ~4,700 words.
   - Onboarding maps "I'm answering another worldview" to "Helping someone sceptical" (`dashboard.html:1203`), so someone preparing to talk with a Muslim friend gets atheist-oriented welcome copy.

   → Name one primary person (a lay adult believer who has just been challenged) and one distribution partner (a small-group or youth leader).
5. **Retention.** `/today` is a good daily loop, but the review step and streak need an account. An anonymous visitor's daily hook is the frozen homepage mock-up. Whether web push or the weekly email bring anyone back is unknown (see top-10 #8).

---

## 4. Usability and design

The problems below are ranked by harm. Top-10 items 4–6 are the three most visible and aren't repeated here.

1. **Evidence Library and Worldviews accordions are crushed on mobile.** Number, title, description, badge and chevron share one row, so titles wrap into a ~100px column ("Was Jesus a / Muslim? / The / Christian / Response"). → Under 600px, move the badge below the title, drop the big number, and use the full width.
2. **Essay text starts one to two screens down.** Before the first sentence there are a Pro badge, review badge, table of contents, quick-answer link, a 16:9 video, a 7-line "Read it with the AI tutor" box and a Listen bar. The first paragraph begins at about 1,450px on desktop and 1,700px on mobile. → Collapse the tutor box to one line and shrink the video to a thumbnail row.
3. **Navigation sprawl.** There are about 27 destinations (8 top-level items, 13 under "More", 6 in the footer).
   - The AI Q&A has four names: "Asked & Answered", Ask Anything, the homepage chat widget, and "Answers" (hidden under More).
   - The games hub lists 12+ overlapping drills.
   - "Objection Deck… Free, no sign-up" sits under a "PRO GAMES" heading.
4. **Tap targets.** The hamburger is 35×28px and "Sign in" is 45×15px. 130 of 132 pages have targets under 40px. → Enforce a 44×44 minimum in `ad-nav.css`, which fixes the header on every page at once.
5. **Small type and low contrast.**
   - 123 of 132 pages have text under 12px; `sources.html` has 1,149 elements at 9.6–11.2px, and the reading-club pages use 8px labels.
   - 129 pages have text below AA contrast: gold on cream, a 2.7:1 "Soon" pill, and the faint 1 Peter 3:15 line under the hero.

   → Set a 12px floor for labels and 16px for body text, and use a darker gold on light backgrounds.
6. **Pages hang if the Supabase CDN is blocked** (ad-blockers, school or church firewalls). `today.html` polls `window.supabase` forever, so a logged-out visitor sees "Checking your deck…" permanently. `dashboard.html` stays on "Loading…". 9 other pages throw errors. → Give up after about 3 seconds and fall back to the anonymous path.
7. **Dashboard on a phone, logged out.** An 8-step tour opens automatically. The tools grid squeezes 3 columns into 390px and clips the third card, and there's no side margin. → Use a single column under 480px and skip the tour before sign-in.
8. **Inconsistent gutters and dead space.** The `games.html` community cards touch the screen edge. `ask-anything` has about 900px of empty space on mobile.
9. **Smaller items:**
   - `ev-m-legacy.html` has no site nav, so it's a dead end.
   - A keyboard user needs 26 Tab presses to reach the first card, and only 1 page has a skip link.
   - 972 clickable `div`s have no role (up from 654).
   - Answer pages use " - " where em-dashes are meant.
   - The ⚖ glyph renders blank.

**Fixed since the 2026-09-07 usability review (verified):** the "Explain it Simply" label pointing at nothing, games linking to flashcards, daily-mix and explain-it-back, `/today` in the nav, the starter deck, the table of contents on essays, keyboard-operable Evidence Library cards, search indexing mastery pages, and `:focus-visible` / reduced-motion support. Desktop layouts are the site's strongest state, and homepage weight is fine (11 requests, ~132KB).

---

## Suggested order

1. **This week, safety and trust:** Study Groups (#1), forged share links (#2), invented scores (#3), frozen homepage card (#4), "coming soon" labels, conflicting copy.
2. **Next, mobile polish:** sideways scroll (#5), overlays (#6), accordions, tap targets, contrast. Most of these are fixes to one shared CSS or JS file each.
3. **Then read PostHog** (#8) before building anything else. Let the numbers decide which of the overlapping tools (#10) to merge or cut.
4. **Then mission gaps:** seeker path (#7), "Defend it live" loop, one hero promise, named reviewers, audio.

---

## Status update (2026-09-30, same day)

- **Shipped:** top-10 #1–4 (Study Groups safety, forged share links, invented scores, frozen homepage card); the Video Library placeholder Save button removed; the free-question copy made consistent; header tap areas; full-width argument cards on phones; darker gold text on light backgrounds.
- **Withdrawn after checking on a real phone:** top-10 #5 (sideways scroll).
- **Declined by the owner:** shrinking the AI Tutor tabs (part of #6).
- **Owner action still owed:** run `docs/STUDY_GROUPS_SAFETY_MIGRATION.md`.
