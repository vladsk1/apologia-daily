# Apologia Daily — The Path to #1

_Research date: 2026-07-02. Synthesis of four parallel research passes: competitive app
research (Truthly, Hallow, Glorify, YouVersion, Abide, Duolingo, Brilliant), audience &
distribution research, incumbent benchmark (GotQuestions, Reasonable Faith, Stand to
Reason, CARM, etc.), and a code-level learning-product audit of this repo. Companion to
`docs/MARKETING_PLAN.md`. Nothing here changes pricing/payments — that remains a human
decision (see CLAUDE.md guardrails)._

## The verdict

The idea is sound and the timing is unusually good. Apologetics interest is in a
documented upswing (Gen Z men returning to church, US Bible sales at a 21-year high,
the Wesley Huff/Rogan effect: 1,200 → 450,000 subscribers off one podcast). No incumbent
combines all four of: **GotQuestions' breadth, Reasonable Faith's rigor, Duolingo's habit
loop, and AI-native practice.** Apologia Daily already has real pieces of all four — the
per-essay scholarly apparatus is already near the #1 bar, and the Debate Arena (voice
mode) and inline AI tutor are capabilities **no competitor studied has**.

The winnable position: **"the citable reference layer of apologetics, with a habit loop"**
— GotQuestions plus footnotes plus a daily practice engine.

Three blockers stand between today's site and that position:
1. **The front door routes to a dead end** — the hero CTA and Arena CTA go to `#pricing`,
   which advertises an unstartable "$8/mo, 7-day trial" (Stripe not live). Trust liability
   that gets worse with every new visitor.
2. **The retention engine has a cold-start problem** — "Due today" (the flagship daily
   hook) only fires if a user manually created flashcards; nothing they read or master
   auto-creates cards, so most users never see it.
3. **No named human credibility layer** — world-class apparatus, no face. Reasonable
   Faith's moat is a named PhD; ours is currently anonymous.

---

## 1. What to adopt from the viral apps

| Adopt | From | Why / evidence | Build cost here |
|---|---|---|---|
| **Premium narrated audio (upgrade of the existing Listen feature)** | Glorify, Abide, Hallow | Narration is the #1 cited retention driver in all three. CORRECTION (2026-07-02): browser-TTS "Listen to this essay" ALREADY EXISTS free on all 77 essays + all MK/ES translations. The remaining gap: pre-generated high-quality narrated audio (background-playable, lock-screen controls, downloadable — podcast-grade) as a Pro tier, keeping browser TTS free; plus porting the player to the devotional/daily pages | **Medium** — generate narrated files per essay; player upgrade |
| **Email streak-defense nudge** (warm tone, never guilt) | Duolingo (7-day-streak users are 2.4× likelier to return next day) | Streak system already exists in `dashboard.html`; this closes the loop | **Small** — Resend already wired; needs `RESEND_API_KEY` + a scheduled function |
| **Named seasonal challenge** ("40 Days Before Easter") | Hallow's Pray40/Lent challenge — tied to its biggest growth spike ever (briefly #1 on the App Store) | `study-plans.html` engine exists; this is packaging + a landing page | **Small–Medium** |
| **Post-completion share-card auto-surface** | YouVersion verse images (its most viral loop) | `pocket-cards.html` + referral loop exist; this is wiring | **Small** |
| **Opt-in weekly leaderboard** | Duolingo leagues | Dashboard already tracks streak/belt/reviews | **Medium** (Supabase view + UI) |
| **Visible unlock-chain path** | Duolingo path, Brilliant onboarding | `beginners-path.html` exists but is flat; new users land on a huge tab library instead of a guided sequence | **Medium** (UI reorg, no new content) |
| **Creator seeded-access program** | Brilliant creator funnel + the Huff effect | `?ref=` capture already in `signup.html`; 5–10 mid-tier apologetics YouTubers/podcasters with per-creator URLs | **Small–Medium** (mostly outreach) |

**Do NOT copy:** Truthly's zero-free-tier card-required trial (its #1 review complaint);
Duolingo's guilt-trip notification escalation (violates our 1 Peter 3:15 tone rule);
Hallow's Super Bowl budget (take the playbook, not the price tag); Abide's kids'
bedtime-content vertical (dilutes the serious-apologetics position); Brilliant's rationed
free tier (reads stingy in a category whose incumbent moat is generous free); native
home-screen widget (requires a native app — PWA + email gets most of the value).

## 2. Audience & distribution (next 12 months)

**Segments, ranked by size × winnability:**
1. **Gen Z men, spiritually curious, unchurched** — the highest-momentum segment; they
   want "receipts," which is exactly our positioning.
2. **Doubting/deconstructing Christians** (Barna: 42% of US adults say they've
   deconstructed) — needs our steelman-first, non-triumphalist voice; high payoff if the
   tone lands.
3. **Skeptic/debate-content viewers** — treat as a *distribution engine* (shares,
   comments, algorithmic reach), not a conversion target.
4. Existing believers wanting to defend the faith — retain, don't chase (crowded lane).
5. Muslim–Christian dialogue viewers — high passion; our Islam cluster is under-leveraged.
6. Parents/homeschool — durable, slow; retention segment.

**Channel priority:** (1) short-form video — *reaction format* (respond to specific viral
atheist/debate clips using Evidence Library arguments) and *product-demo format*
(screen-record a real Ask Anything exchange or a voice debate in the Arena — content no
creator can copy because they don't have the tool); (2) SEO + **AI-search readiness**;
(3) Reddit (r/Christianity ~672k, r/DebateReligion ~186k — genuine participation, and it
doubles as AI-citation infrastructure); (4) long-form podcast guesting (the Huff lesson:
one credible long-form appearance, chopped into clips, beats months of native
short-form); (5) email flywheel (blocked on `RESEND_API_KEY`); (6) creator collabs;
(7) church/small-group distribution.

**AI-search citation playbook** (how ChatGPT/Perplexity/Gemini decide whom to cite):
Perplexity rewards *freshness* (visible updated dates, quarterly refresh); Gemini favors
*structured brand-owned pages* (FAQ/Article schema); ChatGPT weighs *cross-source
agreement* (site + Reddit + YouTube saying the same thing). Precise quantified claims
("the 1 Cor 15 creed dates within 2–5 years") get cited over vague ones — our house
style already does this. Action: verify GPTBot/PerplexityBot crawler access, add schema
to `/answers/`, show last-reviewed dates.

**Three link-worthy assets** that would make us the site everyone cites:
1. The Evidence Library positioned explicitly as the **citable reference layer** (stable
   URLs, visible review dates, schema, "how to cite this essay" block) — 90% built.
2. A **living viral-claims tracker** — 24–48h explainer pages on claims from trending
   debates/podcasts, each linking back to the relevant deep dive. No evergreen incumbent
   is fast enough to own this.
3. The **Debate Arena as a shareable/embeddable artifact** (public debate transcripts,
   "share this exchange") — the product itself becomes the backlink magnet.

## 3. Content gaps between here and #1

Coverage scorecard: God's Existence / Resurrection / Jesus / Trinity / Biblical
Reliability / Islam = **strong** (Trinity is likely the best cited set on the internet).
The gaps, in priority order:

**Tier 1 — the missing objection classes (top skeptic search demand):**
Canaanite conquest ("did God command genocide?"), slavery in the Bible, hell deep-dive
(present ECT/conditionalism/universalism as the honest intra-Christian landscape —
neutrality rule applies), miracles & Hume (the upstream gate to the whole resurrection
case), divine hiddenness (Schellenberg — the #2 atheist argument after evil), "those who
never heard."

**Tier 2 — science-tab neutrality repair:** a neutral survey of evolution positions
(YEC/OEC/EC, do NOT adjudicate), historical Adam options, Galileo/conflict-thesis myth.
The tab currently tilts ID; a #1 resource must serve BioLogos-leaning and ID-leaning
readers alike.

**Tier 3 — the deconstruction front:** a "Doubting? Start here" hub + essays on purity
culture, church hurt, "the Bible was used to justify X"; progressive Christianity
examined charitably (nobody does this with footnotes); women in the Bible; sexuality
(highest-demand missing topic — run LAST, with mandatory human/pastoral sign-off,
gentlest register on the site); Crusades/Inquisition/"religion causes war."

**Tier 4 — finish the Worldviews promise:** JW and Mormonism tabs (the page advertises
them as "coming soon" today — a live credibility bug; the Islam build is the repeatable
template), atheism/naturalism as a positive worldview, Buddhism/Hinduism primers, New Age.

**Tier 5:** an "Ehrman hub" — one "Bart Ehrman, steelmanned" page cross-linking the six
essays that already answer him. Cheap, high SEO, high trust.

**Structural credibility moves (bigger than any single essay):**
1. **Named human review layer** — "Reviewed by [name, credentials] · Last updated [date]"
   byline on every essay + a public review-board page + `reviewedBy` in the JSON-LD. Even
   2–3 adjunct reviewers (philosophy PhD, NT PhD, pastor) at 5 essays/month converts the
   whole library, satisfies the standing human-sign-off debt, and hardens E-E-A-T.
2. **Curriculum + citable packaging** — sequence the mastery tracks into a named 12-week
   course ("The Apologia Track") with a completion certificate (Reasonable Faith's
   Defenders proves demand); downloadable citable PDFs with a "how to cite" block.
3. **Answers flywheel at GotQuestions cadence** — 56 → 300+ pages in 12 months via the
   existing pipeline, each cross-linked to its deep dive ("the short answer, with the
   full scholarly case one click away" — an architecture neither GotQuestions nor RF has).

## 4. The learning tool (code-level audit findings)

**The three journey breaks** (see verdict) and the fixes, ranked by retention impact ÷ cost:

1. **Auto-seed the SR deck from everything a learner touches** — ship a static
   `deck-seeds.json` (2–4 cards per argument, generated offline via the flywheel +
   orthodoxy gate); hook Supabase inserts into mastery checkpoints, quiz misses, and
   Case-Plainly expansion. Makes "Due today" fire for every active user within 2 days.
2. **Instrument the funnel** — call the existing unused `window.adTrack` hook on
   onboarding-complete, first checkpoint, mastery-gold, card review, quiz finish, debate
   scored. One afternoon; unblocks measuring everything else. Do first.
3. **One streak to rule them all** — every daily surface marks the same `ad_streak`;
   flame in the shared nav; mirror to Supabase; kill the parallel quiz streak.
4. **A `/today` page — the composed 5-minute daily loop** (the site is called Apologia
   *Daily*; there is currently no single daily thing). Minute 0–0.5 open (streak, Day N);
   0.5–2 review due cards (reuse the SM-2 engine); 2–3.5 learn today's argument (summary +
   Case-Plainly excerpt + inline tutor, same dayNum rotation `api/push.js` uses); 3.5–4.5
   prove it (3-question mini-quiz or one objection drill scored by `/api/tutor`, feeding
   the Coach); 4.5–5 close (streak, points, tomorrow-teaser, gentle share prompt). Day 6 =
   one Arena round on your weakest argument; day 7 = devotional. Pure composition of
   existing engines. Make it the push/email deep-link target.
5. **Re-aim the front door** — hero CTA → free homepage chat or Beginner's Path; "Try the
   Arena" → the actual Arena. Flag for human sign-off: soften/remove the dead trial copy.
6. **Session-1 activation = first argument mastered** — after onboarding, route into a
   10-minute "master your first argument" run (Kalam for defenders, suffering for
   doubters), ending in the gold-shelf celebration + auto-seeded cards.
7. **Turn on the outbound loops** — set `RESEND_API_KEY`; weekly email reports streak +
   due-card count + Coach's top weak spot; expand push rotation from 15 to all 76
   arguments, deep-linking to `/today`.
8. **Objection drills / "argument gym"** — per argument, a graded ladder of 3 objections
   (easy→hard), generated offline into static JSON (orthodoxy-gated), free-text answers
   scored via the existing `/api/tutor` pattern, feeding the Coach. Active-recall applied
   practice no faith app has.
9. **Sync progress to Supabase** — one `user_progress` JSONB row (mastery, streak, coach
   signals); progress currently dies with the device.
10. **Persona conversation simulator** — extend the Arena's "gentle conversation" mode
    with personas mapped from onboarding intent (skeptic friend, Muslim colleague,
    deconstructing teen), assigned by the Coach against your weakest argument.

## 5. Sequenced roadmap

**Prerequisite decision (human, blocks paid acquisition only):** the monetization model —
free+donations (GotQuestions model) vs real paywall. Everything below works either way;
none of it should wire real payments without sign-off.

**Now (days–2 weeks, all small):**
- Re-aim hero/Arena CTAs off dead `#pricing`; soften the dead-trial copy (sign-off).
- Set `RESEND_API_KEY` (ops); fix `ev-s4.html` Luke 4:25 ("three years and six months").
- Instrument PostHog via `window.adTrack`.
- Auto-seed flashcards + unify the streak.
- Add "How to cite this essay" block + FAQ/Article schema + visible review dates; verify
  AI-crawler access.
- Share-card auto-surface after completions.

**Next (month 1–2):**
- Build `/today` (the daily loop) and point push + weekly email at it.
- Premium narrated audio tier (browser-TTS Listen already exists free on every essay;
  the upgrade is podcast-grade narrated files + devotional/daily-page coverage).
- Ship JW + Mormonism worldview tabs (kills the "coming soon" credibility bug; Islam
  template is repeatable).
- OT ethics trio: Canaanites, slavery, hell (full mandatory pipeline).
- "40 Days" seasonal challenge packaging (timed to the next liturgical window).
- Session-1 "master your first argument" activation flow.

**Later (quarter):**
- Named reviewer board + bylines (recruit 2–3; start with Trinity/Islam Case tier).
- "The Apologia Track" 12-week curriculum + certificates + citable PDFs.
- Argument gym (objection drills) + persona simulator + Supabase progress sync.
- Evolution-positions survey + divine hiddenness + miracles/Hume essays.
- Answers flywheel scale-up toward 300 pages; viral-claims tracker; creator seeded-access
  program; opt-in leaderboard; deepen study-groups into a real activity feed.

**Standing rule:** every new drill/card/quiz/essay/answer is public doctrinal content —
it runs the full CLAUDE.md pipeline with the orthodoxy gate last, no exceptions.
