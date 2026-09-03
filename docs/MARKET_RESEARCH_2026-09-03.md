# Apologia Daily — Market research & the path to #1 (2026-09-03)

_Four parallel research passes run 2026-09-03 — (1) competitor apps, (2) incumbents & what
"authority" requires in 2026, (3) audience & distribution, (4) a read-only audit of the repo
against the July roadmap — synthesised into one options document. Supersedes nothing: it
EXTENDS `docs/NUMBER_ONE_ROADMAP.md` (2026-07-02) and `docs/COMPETITIVE_LANDSCAPE.md`
(2026-07-31). Every count marked **[repo]** was measured today at commit `76600d0`; every claim
marked **[web]** carries a dated source in §9. Where a figure could not be verified it says so.
Nothing here changes pricing, payments, or doctrine — those remain owner decisions._

---

## 0. The verdict, in one paragraph

The #1 position the July research named — **"the citable reference layer of apologetics"** —
is still open, and the market has moved in a way that makes it *more* winnable, not less: the
incumbent's moat (GotQuestions' SEO breadth) is the one being eroded by AI search, and the
industry story of 2026 is "AI misquotes the Bible," which is precisely the failure mode
Apologia's grounded, gated architecture was built to prevent. But three facts were missed or
have changed since July, and each one reshapes the plan: **a free, large-scale nonprofit AI
apologetics competitor already exists** (§1); **ranking on Google no longer reliably converts
to being seen** — citation inside AI answers is now the game, and it rewards a page format
Apologia does not yet use (§2); and **"rigorous" and "neutral" are now claims competitors make
too**, so the moat has to become *visible* — which means a **named human** (§3). Internally, the
audit found the site is closer to the roadmap than the roadmap thinks in some places (`/today`,
instrumentation, schema, review badges are done) and further in others (no paywall exists, the
Android deadline has passed, nine months of analytics remain unread). **The single highest-
leverage move is not a feature. It is recruiting two or three named reviewers across
traditions and putting their names on the essays.** Everything else on this list is cheaper.

---

## 1. What changed since July — five findings that reframe the plan

### 1.1 A free, large nonprofit AI apologetics product exists, and July never saw it

**The Apologist Project / "Apologist Agent" (apologist.ai)** — a 501(c)(3), free forever,
claims **1.5 million faith questions answered, 400,000+ gospel conversations, 190+ countries,
~200 languages, 10 officially supported**. Content partners it names: **GotQuestions, Stand to
Reason, Ligonier, Reasons to Believe, Bible Project, Discovery Institute, Answering Islam**,
and it ships a dedicated Muslim-ministry agent ("Alim") that overlaps the Islam cluster
directly. It also sells the plumbing — an embeddable widget, an OpenAI-compatible API, a
corpus tool for ministries. [web: apologistproject.org, faith.tools — checked 2026-09-03]

This is not a "since July" launch; it pre-dates the July doc and was simply not surfaced. It
matters more than Logetics and Ark combined because it answers the question a visitor who hits
Apologia's free-tier AI cap will ask — *"why pay for AI apologetics?"* — with a free, unlimited,
institutionally-partnered alternative one search away.

**Other new entrants found** (all with a dated source in §9): **Scriptured** ($7/mo; markets
itself as *"the only apologetics app with Practice Mode"* — speak/type an answer, get AI
feedback — which Apologia's Debate Arena + Explain-It-Back already do); **forge./IXI Academy**
(paid tiers, a named in-house rigor standard it calls "VERITAS"); **MagisAI** (Catholic, free);
**Truthly** (Catholic, free + Pro). Pattern: three of four are confessional, and two market a
*rigor* claim by name. **The claim that Apologia is uniquely rigorous or uniquely neutral is now
contested on both axes.**

**Logetics / Apologetics Ark:** no verified change since July. Logetics still says "free, no
paywall." App Store pages are egress-blocked from this sandbox; a five-minute phone check
closes this gap.

### 1.2 AI search has structurally broken the pure-SEO bet

Neither July doc mentions AI answer engines. The 2026 numbers [web, §9]:
- Zero-click results run **60–93%**, rising to **83%** on queries that trigger an AI Overview.
- ChatGPT/Perplexity send **~95% less referral traffic** than classic Google (<1% CTR).
- **GotQuestions — the closest comparable to the Evidence Library — is a live casualty:** traffic
  down ~15% month-on-month by May 2026 and another ~58K visits July→August (Similarweb), and its
  own site now carries a page admitting "a significant amount" of Google traffic lost to AI
  Overviews since early 2025.
- The overlap between top-10 Google rankings and AI-Overview citations collapsed from ~75%
  (mid-2025) to **17–38%** (early 2026).

The flip side is precise and actionable. What gets a page *cited* inside an AI answer:
- **Position** — 44.2% of ChatGPT citations come from the **first 30% of the page**.
- **Definitive, sourced language** — cited passages are ~2× likelier to use it (36% vs 20%).
- **Freshness** — 83% of AI citations come from pages updated in the past 12 months.
- **Corroboration** — brands are **6.5× more likely** to be cited via third parties (Reddit,
  YouTube, Wikipedia, publications) than via their own site; Reddit ≈40% of all AI citations.
- **Named-person authority** in schema (`author` as `Person`, `reviewedBy`).
- Engines barely overlap (89% of what ChatGPT cites, Perplexity never touches) — optimise per
  engine, not "for AI." `llms.txt` has no measurable effect — Apologia correctly has none.

Apologia has the hard part — the footnoted, gated body — and lacks all five cheap wrappers.

### 1.3 The industry story of 2026 is "AI misquotes the Bible" — free positioning ammunition

YouVersion's CEO has said publicly that the best AI models **misquote the Bible 15% of the time,
some as much as 60%**, and has deliberately *not* shipped a Scripture-answering chatbot. A
public benchmark testing seven frontier models against one denomination's theology scored the
best model **45/100** and rated **68% of responses "Unreliable."** 64% of pastors are "very
concerned" about inaccurate AI theology. [web, §9 — the benchmark's publication year is
ambiguous, 2025 or 2026; the figure is real.]

Apologia's `/api/ask` retrieves from **156 verified primary-source passages** and **97 gated
briefs** [repo], routes crisis messages to a human, and refuses fabrication in its instruction
block. **Nobody else can document that.** Today `editorial-standards.html` makes the case in
Apologia's own voice only; the external validation is sitting in the news cycle unused.

### 1.4 The Gen-Z revival is real, US-measured, and male-skewed — but one famous stat is retracted

**Do not cite the UK Bible Society "Quiet Revival" figure (young men 4%→21%).** It was
withdrawn in March 2026 after YouGov found the survey data compromised. [web: Premier
Christianity; Christianity Today, Apr 2026] The US data holds: Barna (Feb 2026) — Gen Z church
visits up from ~1/month (2020) to ~1.9/month; commitment to Jesus among **Gen Z men +15 points,
Millennial men +19 points** (2019–2025); Bible sales +36% YoY in Sept 2025, buyers skewing
18–34. Pew still puts under-30s at 45% Christian / 44% unaffiliated. Read: real, concentrated,
and the "newly curious young man" front door matters.

### 1.5 The creator tier confirms the structural disadvantage — and points at the workaround

Wesley Huff (~700K IG / ~780K YT), the Knechtles (~950K YT), Turek (~845K YT), Alex O'Connor as
the skeptic foil everyone grows by engaging (~1.9M YT) [web, dated in §9]. The mechanism is
identical in every case — a face, a voice, and a debate/reaction format or a big-podcast slot —
and none of it transfers to a faceless brand. The August Instagram research already named this
honestly. What the new data adds: **none of these voices has a written, footnoted library**, and
the questions they make viral (Huff → Nephilim/Enoch/"Ethiopian Bible" after Shawn Ryan in Feb
2026; Hijab vs GodLogic on the Islamic Dilemma in May; Paulogia's minimal-facts critique in
June; Ortlund–Horn in May) **have no footnoted home anywhere.** A faceless brand cannot be the
face; it can be the place the faces link to.

---

## 2. What the repo actually looks like today (audit, all [repo])

The July roadmap checked against the tree. Full table in the audit; the shape:

**Done, and better than the roadmap knows:** `/today` (the composed daily loop — Review /
Learn / Prove / Close, SM-2, Coach pick, Saturday→Arena, Sunday→devotional, TTS); one streak
(`ad_streak`, 242 hits); PostHog instrumentation (**255** `adTrack` sites, event inventory
documented); `Article` schema on 93/93 essays, `FAQPage` on 91/93; visible "Reviewed & current"
badge on 92 essays; the miracles/Hume essay; the 40-Day and Advent challenges; weekly-email
handler fully built; `user_progress` sync fully coded; 110 answers; 97 briefs; 156 verified
passages; hero CTA re-aimed to the free chat; "7-day trial" copy gone site-wide.

**Built but switched off (the cheapest wins on the whole list):**
- `/today` is **orphaned** — `index.html` has **zero** links to it and the shared nav has none.
  Push points at it; the homepage of a site called Apologia *Daily* does not.
- `user_progress` sync — the SQL in `docs/PROGRESS_SYNC.md` was never run; progress dies with
  the device.
- `deck-seeds.json` was never shipped, so **"Due today" opens on "Nothing due" for every new
  user** — the daily loop's first step is empty for exactly the cohort retention depends on.
- Resend: `HANDOFF.md:216` says the key is set; four other docs say unset. Resolve with one call:
  `GET /api/weekly-email?do=status`.
- PostHog: instrumented, **never read**. Nine months of data. Every growth doc restates the gap.

**Advertised but absent:**
- **The paywall does not exist.** **191 files** hardcode `isPro = true` (78 root + 93 library +
  10 es + 10 mk), up from 176 at the 2026-08-11 audit — the debt is growing. Every "Pro" tier is
  publicly served and indexed. `video-library.html:720` still renders a live "Unlock Pro — $8/mo"
  button.
- `worldviews.html` advertises **three** "Coming soon" tabs (JW `:1941`, Mormonism `:1968`,
  Atheism `:1995`) — while JW and Mormon doctrinal essays, mastery pages and five answers already
  exist elsewhere. Partly a linking bug.
- No named reviewer: `reviewedBy` 0 hits; no review-board page; `STATEMENT_OF_FAITH.md:133`
  still `_pending_ | _unassigned_`. "How to cite this essay": **0** occurrences.
- **Freshness-signal bug:** 46 essays carry Aug/Sep review stamps but only 14 carry a matching
  JSON-LD `dateModified` — e.g. `library/manuscript.html` stamp `2026-08-29`, schema
  `"dateModified":"2026-06-28"`. At least **32 essays tell AI crawlers they are older than they
  are**, on the one signal (freshness) AI citation weights most. Mechanical fix.
- Tier-1 objection essays: **divine hiddenness 0 hits, Canaanite conquest 1 passing mention,
  biblical slavery none (only "did Christianity end slavery"), hell none, "never heard" none,
  Ehrman hub none, evolution-positions survey none.** Only miracles/Hume shipped.
- **Android `targetSdkVersion = 34`; Google Play required 36 from 2026-08-31 — the deadline
  passed three days ago** with the fix (Capacitor 6→8) uncommitted. All six App Store §1.5
  blockers untouched.
- Audio: zero `.mp3` in the tree. Bible reader: none. Argument gym / persona simulator / share-
  card auto-surface / Apologia Track / certificates / citable PDFs: none.

---

## 3. What "#1" requires in 2026 — the four things nobody combines

| | Named credentialed review | Footnoted, steelman-first essays | Denominational neutrality | Citable, versioned format |
|---|---|---|---|---|
| GotQuestions | ✗ anonymous **by policy** (its own authors page gives four reasons) | ✗ | ✗ (dispensational Baptist) | ✗ |
| Reasonable Faith | ✓ one PhD | ✓ Craig's positions, not a survey | ✗ | ✗ |
| STR / CARM / CrossExamined | ✗ | ✗ | ✗ | ✗ |
| Huff / Knechtle / IP / O'Connor-foil tier | — | ✗ no written library | — | ✗ |
| Ortlund / Bertuzzi / Horn | ✓ | partial | ✗ **adjudicate the disputes we refuse** | ✗ |
| SEP / Oxford Research Encyclopedia (the scholarly tier) | ✓ | ✓ | n/a | ✓ fixed editions, DOIs, cite blocks |
| **Apologia Daily today** | **✗ (`_pending_`)** | ✓ 92 essays | ✓ enforced by gate | **✗ (no cite block, no versions, `dateModified` drift)** |

Read across the row: Apologia already holds the two hardest columns. The two it lacks are the
two cheapest — and they are the two that make the moat *visible* at the point of decision,
which the July competitive doc correctly said it currently is not. The scholarly tier shows the
target format: SEP archives a fixed edition every quarter and never modifies it; ORE mints a
permanent DOI per article and exports APA/MLA/Chicago. A scholar cites what will not move under
them.

**Where GotQuestions is beatable on its own turf:** it is losing the traffic its moat was built
on, it is anonymous by choice, it has no apparatus, and its `.chat` AI runs over unfootnoted
articles. Apologia's answers→essay architecture (111 short answers each wired to a footnoted
deep dive) is the thing neither GotQuestions nor Reasonable Faith has.

**Where Reasonable Faith is beatable:** one confession, one voice, no versioned format, no
representation of the field (Apologia's essays already name Oppy, Morriston, Carroll, Allison,
Carrier as the strongest living critics; RF argues Craig's side). RF's one asset without a
counterpart is *Defenders* — the 12-week "Apologia Track" from July remains the answer, built
from the 67 mastery pages that already exist.

---

## 4. The options, ranked by impact ÷ cost

Grouped in the order they should be done. **A** costs days and unblocks everything; **B** is
copy; **C** is the authority layer that wins the position; **D** is content; **E** are owner
decisions with product work behind them. Distribution is §5.

### A. Switch on what is already built (days, no doctrinal content, no gate)

| # | Option | Why | Evidence |
|---|---|---|---|
| A1 | **Read the PostHog data** — build the three funnels `docs/FUNNEL_EVENTS.md` already specifies | 255 events, nine months, never opened. Gates the pricing decision (E1) and every acquisition target. Cheapest item on the list. | [repo] every growth doc |
| A2 | **Put `/today` in the nav and the hero** | The best-built retention feature on the site has zero inbound links from the homepage. | [repo] `index.html` grep → 0 |
| A3 | **Fix `dateModified` drift** — derive it from the `content-review` stamp at build time, as the badge already does | 32+ essays under-report freshness; freshness is a top-3 AI-citation signal (83% of citations from pages updated <12 mo). | [repo] `manuscript.html:2` vs `:21`; [web] AirOps/CXL 2026 |
| A4 | **Ship `deck-seeds.json`** (2–4 cards per argument, ported from the certified `ARG_PREMISES`/`cards` that already exist on each mastery page) | "Due today" is empty for every new user. | [repo] `today.html:470-475` |
| A5 | **Run the `user_progress` migration** | Sync is code-complete and dormant; progress dies with the device. | [repo] `docs/PROGRESS_SYNC.md:16-34` |
| A6 | **Resolve Resend** with `GET /api/weekly-email?do=status`; then point the weekly email at `/today` | Faith-content email opens run ~37–41% [web]; the flywheel is built and the docs contradict each other on whether it is on. | [repo] `weekly-email.js:38` |
| A7 | **Kill the live "$8/mo" button** on `video-library.html:720`; point "Try the Arena" (`index.html:1285`) at the Arena, not signup | The two remaining dead-end CTAs. Named in July; still live. | [repo] |
| A8 | **Link the JW/Mormon content that already exists** into the three "Coming soon" worldviews tabs | Credibility bug that is mostly a linking problem. | [repo] `worldviews.html:1941,1968,1995` |
| A9 | **Make `robots.txt` explicit** for GPTBot / PerplexityBot / ClaudeBot / Google-Extended (allow) and reconsider the `ev-s*` disallow, which blocks the Case tier from AI crawlers along with search | Allowed by default today, never explicitly welcomed. | [repo] `robots.txt` |

### B. Say out loud what is already true (small — copy, one gated page)

| # | Option | Why | Evidence |
|---|---|---|---|
| B1 | **Lead with the "AI misquotes the Bible" story** as third-party validation for Checked Before Published — homepage trust card, `editorial-standards.html`, the future store listing | YouVersion CEO 15–60%; benchmark 68% "Unreliable"; 64% of pastors very concerned. External evidence for an architecture you already built. | [web] §1.3 |
| B2 | **A plain-English "How our AI is grounded" page** — 156 verified passages, 97 gated briefs, the pastoral-crisis override, the fabrication block — linked from `editorial-standards.html` | Logetics is *marketing* a restraint you built more carefully; the July doc said "explain it or be compared unfavourably." Nothing user-facing describes the crisis path today. | [repo] `api/ask.js`; [web] Logetics copy |
| B3 | **Name the practice loop "Practice Mode"** on the Arena / Explain-It-Back landing copy | A $7/mo competitor claims to be "the only apologetics app with Practice Mode" for a capability Apologia already has. Naming, not building. | [web] scriptured.app |
| B4 | **Hold the scope of the public standard** — keep "no *essay* published until…" until `pocket-cards`, `flashcards`, `explain-it-back` are stamped | If a critic finds ungated content behind a trust claim, the standard becomes the attack surface. Now that competitors also claim rigor, this matters more. | [repo] `CLAUDE.md` standing rule |

### C. The authority layer — the moves that win the position (medium)

| # | Option | Why | Effort / owner |
|---|---|---|---|
| **C1** | ⭐ **Recruit 2–3 named reviewers across traditions** (e.g. a philosophy PhD, an NT/OT PhD, a pastor — from *different* traditions, so neutrality is visible) → `/review-board.html`, "Reviewed by [name] — [date]" on the badge, `author`→`Person` + `reviewedBy` in JSON-LD. **Start on the dual-consensus tier** (Trinity / deity / Islam), where the pastoral debt sits. | Every research pass — July and today — names this as the one missing moat. Google's raters rate AI-only content Lowest but do not penalise human-added value; the medical "reviewed by" pattern is the template; **no Christian apologetics site publishes a named per-article review board** — white space. It closes the `_pending_` row that every stamp on the site currently confesses. It is also the precondition for Wikipedia-grade citability (C4). | **Owner recruits** (Medium); markup is Small. **Never populate `reviewedBy` before a review actually runs.** |
| C2 | **Citable apparatus** — (a) "Cite this essay" block (APA/Chicago/BibTeX) on all 92; (b) `citation` + `isPartOf` in schema; (c) a frozen `/library/archive/<essay>/<YYYY-MM>/` copy on each re-stamp with a version line, so a scholar can cite a text that will not change; (d) optional DOIs via a free repository (verify Zenodo's terms first) | The SEP/ORE pattern. 0 cite blocks exist today. | Small for (a)(b); Medium for (c)(d). Engineer/SEO agents; no doctrinal change. |
| C3 | **Answer-first passage architecture** — a 60–100-word "The answer" block at the top of every essay and answer, with one sourced number, **ported from the essay's own certified text, never authored** | 44% of ChatGPT citations from the first 30% of the page; definitive sourced language cited 2×. The house rule survives: definitive where the evidence is, hedged where it isn't ("widely accepted," never "scientists agree"). | Medium — 92 gated edits, but port-only so one round each. |
| C4 | **Be cited elsewhere** — Wikipedia references where essays meet WP:RS (needs C1 first); a standing, genuine Reddit presence (r/DebateReligion, r/Christianity, r/apologetics); per-creator seeded-access URLs; Debate Arena transcripts as shareable/embeddable artifacts | 6.5× more AI citations via third parties; Reddit ≈40%; ChatGPT weighs cross-source agreement. The only move that fixes `SEO_ACTION_PLAN.md`'s "almost no inbound links." | Medium, ongoing. Growth/social + owner. |
| C5 | **The living "current critiques" layer** — a `/current/` section: one ~800-word gated explainer within 7–14 days of each viral trigger, linking to the deep dive; plus a permanent **sceptics hub** (Ehrman, Carrier, Paulogia, O'Connor, McClellan — one page each, ported from the certified essays that already answer them) | Perplexity rewards freshness; the 2026 calendar shows a monthly viral trigger with no footnoted responder (Huff/Nephilim Feb, Ehrman *Love Thy Stranger* Mar, Knechtles May, Hijab–GodLogic May, Paulogia Jun, Ortlund–Horn May). People search critics by name — `SEO_ACTION_PLAN.md` shows name-anchored queries already rank. Ehrman is engaged in 46 files and has no hub. | Medium per month. Port rule applies hardest here — these are the pages most at risk of authored prose. |

### D. Content — the coverage gaps, ranked by demand × gap × fit (large; full pipeline)

1. **Divine hiddenness (Schellenberg)** — 0 hits in `library/`; "the most prominent single
   argument for atheism in the current literature" (Cambridge). The one high-demand objection
   class with literally zero coverage.
2. **Canaanite conquest + biblical slavery** (two essays) — the answers backlog already queues
   seven tone-critical short answers here with no essay under them, which violates the site's
   own answer→essay architecture. Pastoral sign-off advisable.
3. **Hell — a neutral map** (ECT / conditionalism / universalism-as-hope vs certain). Neutrality
   rule: map, don't adjudicate. Orthodoxy rule: universalism-as-certain is out. Dual-consensus.
4. **The sceptics hub** (see C5) — cheapest of the content items because it is port-only.
5. **"What can critical scholarship actually establish?"** — Dan McClellan (~994K TikTok, PhD,
   0 hits site-wide) is the largest scholar-sceptic voice reaching Gen Z. Not a rebuttal page: a
   meta-page on the historical-critical method — what it can and cannot conclude — and where
   the essays already concede its findings. Argument gate must hunt over-concession.
6. **Islam-dawah 2026 explainer** — Hijab vs GodLogic went viral; Uthman ibn Farooq's channel is
   at 1.36M subs / 705M views. `islam-dilemma.html` is certified and strong; a timely "what the
   Islamic Dilemma actually claims and what the debate got wrong on both sides" ports from it.
   EXPLICIT-VERDICT + FALSE-COMMON-GROUND rules apply. Small–Medium.
7. **Nephilim / 1 Enoch / "the Ethiopian Bible" / lost books** — mainstream Gen-Z question since
   Huff on Shawn Ryan; 0 Nephilim hits; extends `canon.html`.
8. **Evolution / age-of-earth positions — neutral survey** (YEC/OEC/EC, historical Adam,
   Galileo myth). July said the science tab tilts ID; still true. Dual-consensus for neutrality.
9. **"Which church?" — the Nicene common-ground map.** The hottest intra-Christian argument of
   2026 (Ortlund–Horn, Bertuzzi's conversion) and every voice in it is partisan. A page that
   states what all three confess (creeds verbatim from `sources/creeds.json`) and maps where
   they differ *without ruling* is a resource none of them can write. Dual-consensus.
10. **"Can I trust an AI with theology?"** — the answer is already queued; the addition is B2.

### E. Product & business — owner decisions with build work behind them

| # | Decision / option | The evidence now on the table | Recommendation |
|---|---|---|---|
| **E1** | **Pricing and what the paywall gates.** Options: (a) hold $8 for the essays; (b) ~$3–5; (c) **content free, charge for practice/community/audio/app** (Ark's model, plus the "Practice Mode" Scriptured charges $7 for) | Free AI competitor at scale (§1.1); AI citation requires content to be open and crawlable (§1.2); a paywall that charges for the essays is the *only* model among the comparables; **and no paywall exists today anyway** (191 files) — the site is already running model (c) without saying so. Every comparable offers an **annual tier**; Apologia has none. | **(c), with an annual tier, once A1's data is read.** The essays are the citation asset — gating them fights the #1 strategy. Charge for the loop (Arena, Practice, audio, sync, app, groups). Owner call. |
| E2 | **Free AI quota** (currently ~1 question/week) | A free, unlimited, 1.5M-question competitor is one search away. | Raise it, or make Ask free and gate the practice tools instead — consistent with E1(c). |
| E3 | **Ship the app** — Capacitor 6→8 (Android SDK 36, deadline passed 2026-08-31), Turnstile bypass, `PrivacyInfo.xcprivacy`, reset-link, push strip-or-wire, the paywall stub | Two apologetics competitors shipped as apps in 2026; widgets, offline audio and push are all downstream of it. Cannot be compile-verified from Linux — needs the iMac. | Highest-leverage *unblocked* large item, unchanged from July. |
| E4 | **Bible verse popover, not a Bible reader** — tap any Scripture citation in the 92 essays to see the verse inline (public-domain translation; own citation gate) | Both rivals have a full reader; a full reader is off-mission scope. The popover captures most of the reader's value. | Medium. |
| E5 | **Audio narration** — TTS of already-gated text (no new claims), background-playable, on essays + devotional | Table-stakes across 2026 Bible/devotional roundups; zero `.mp3` in the tree; Hallow/Glorify's #1 cited retention driver. | Medium; a natural Pro feature under E1(c). |
| E6 | **The Apologia Track** — sequence the 67 mastery pages into a named 12-week course with a certificate | Reasonable Faith's *Defenders* is its one asset without a counterpart here. | Medium; content already exists. |
| E7 | Argument gym (graded 3-objection ladders, free-text scored by `/api/tutor`), persona simulator from onboarding intent, share-card auto-surface after completions | July items; all still absent; all pure composition of existing engines. | Medium each; after A and C. |

---

## 5. Distribution — for a faceless, scholarly, text-led brand (ranked by reach per hour)

1. **Answer-first / citation formatting on the existing ~1,100 pages** (= C3 + A3). No new
   content; leverages the real differentiator; scriptable.
2. **Turn on the email flywheel** (A6). Faith-content opens ~37–41% [web]; built, dormant.
3. **YouTube Shorts titled verbatim from `/answers/` questions.** YouTube added a Shorts-only
   search filter in 2026 — Shorts are now search-indexed, so an evergreen question-answering
   Short compounds for months. Reuse the 55 gated reel specs *after* the August trim-and-re-gate.
4. **X: long single posts + 15–20 min/day of substantive replies** (already the August plan;
   still right).
5. **Threads cross-post of the X output.** Threads passed X on mobile DAU in Jan 2026 (141.5M vs
   125M), skews 18–34 and 57% male — the Barna demographic. Neither August doc mentions it.
   Near-zero incremental cost.
6. **TikTok — only natively re-cut, never a straight cross-post.** The faith niche is huge
   (~86M views/30 days, ~20% engagement) but ~81% of it sits with three accounts running a
   relational/lifestyle aesthetic, and Instagram now fingerprints unmodified TikTok reposts and
   gives original content up to 3× the distribution — which complicates the August "post the
   same file everywhere" advice.
7. **Reddit** — real answers in-thread citing the library where genuinely responsive; doubles as
   AI-citation infrastructure (C4). Self-promo rules are strict.
8. **Institutional** — Ratio Christi (campus apologetics clubs; stated goal 150→300→1,000
   chapters — *unverified*) is the best-fit partner: offer the library (esp. the 13-essay Islam
   cluster) as a free citable resource for chapter leaders. Cru/RUF/InterVarsity as leads.
   Homeschool publishers are a real channel — **⚠ name-collision: Apologia.com is a dominant
   Christian homeschool curriculum brand; disambiguate first or don't enter that market.**
   Sequence institutional outreach *after* A6 and C3 — a partner evaluating "recommend this"
   wants to see an active, dated, citable resource.

**Confirmed, not changed:** Instagram's 2026 ranking puts watch-time/completion first — the
August 3-second-hook diagnosis stands. Reels now allow 20 minutes and long-form is recommended
in Explore — a later-stage lever, not one to chase before the hook is fixed.

---

## 6. Do not do

1. **Do not cite the "Quiet Revival" 4%→21% stat.** Retracted March 2026.
2. **Do not touch the William Lane Craig / Nicene "eternally begotten" controversy** (Aug 2026)
   as a hook — or any apologist-vs-apologist dispute. It is adjacent to the site's own open
   `ETERNAL_GENERATION_GATE_FINDINGS.md` and squarely inside the neutrality rule's "do not
   adjudicate."
3. **Do not chase TikTok's "creed streak" / relational-aesthetic format.** It is the top format
   in the niche and the brand has no structural advantage in it.
4. **Do not treat the 1,100-page SEO footprint as a stable channel.** GotQuestions is the live
   casualty. Reformat for citation (C3) rather than assuming rankings keep converting.
5. **Do not widen the "Checked Before Published" claim** past essays until the three unstamped
   memorised-layer surfaces are gated (B4).
6. **Do not build a full Bible reader** (E4 instead) or copy Truthly's card-required trial.
7. **Do not populate `reviewedBy` or a byline before a named human actually reviews** — the
   stamp discipline applies to people exactly as it applies to gates.

---

## 7. A 90-day sequence

**Weeks 1–2 — switch it on (A1–A9, B1–B3).** Read PostHog. `/today` into nav + hero. Fix
`dateModified`. Ship `deck-seeds.json`. Run the progress migration. Settle Resend and point the
weekly email at `/today`. Kill the $8 button and re-aim the Arena CTA. Link the JW/Mormon
content into worldviews. Explicit `robots.txt`. Homepage + standards page lead with the
AI-accuracy story; "Practice Mode" naming; the grounding page (gated). **Owner in parallel:**
start the reviewer conversations (C1) — this is the long pole.

**Weeks 3–6 — the citable layer (C2, C3, C5-spine).** Cite-this block + schema on all 92.
Answer-first blocks, port-only, one gate round each, starting with the resurrection and deity
essays (highest citation value). Build the sceptics hub from certified text. Begin the frozen
archive on re-stamp. **Owner:** pricing decision (E1) against the PostHog read; iMac session for
the app (E3).

**Weeks 7–12 — authority + first gaps (C1 landing, C4, D1–D2, E5–E6).** First named reviews on
the dual-consensus tier; `/review-board.html`; `reviewedBy` only where a review ran. Wikipedia +
Reddit presence begins (needs C1). Divine hiddenness and the OT-ethics pair enter the pipeline.
TTS audio on essays + devotional. Sequence the Apologia Track from the mastery pages. Email
flywheel → Shorts → X/Threads in that order, per §5.

**Standing rule throughout:** every essay, answer-first block, hub page, seed card and current-
critique explainer is public doctrinal content and runs the full `CLAUDE.md` pipeline with the
orthodoxy gate last — port, don't author; a fix pass re-opens the gate.

---

## 8. Could not verify (merged from all four passes)

- Any change to Logetics' or Ark's ratings, versions or paywall since July — App Store pages
  egress-blocked; a phone check closes it.
- Publication year of the "68% Unreliable" AI-theology benchmark (PDF filename suggests Sept
  2025); the figure is real.
- Whether GotQuestions dominates AI citations for theology — no category-level study exists.
  Recommend the owner run 20 representative prompts across ChatGPT / Perplexity / AI Overviews
  and log cited domains as a baseline; also the only way to learn whether Apologia is cited at
  all today.
- Ratio Christi current chapter count; Cru / RUF / InterVarsity reach; current r/DebateReligion
  threads.
- Exact pricing for forge. and Truthly Pro+; whether MagisAI / Truthly / forge. have web builds.
- Sean McDowell, Inspiring Philosophy (dated), Licona and Apologetics315 audience sizes;
  Reasonable Faith site traffic (estimates contradict its "70M engagements").
- TikTok niche figures (single aggregator, Hooked.so) and the faith-email open-rate band
  (marketing-blog aggregations; 25–55% across sources) — directionally sound, not load-bearing.
- Whether `RESEND_API_KEY` is set in Vercel (docs contradict; `?do=status` resolves it).
- Zenodo's DOI terms for non-academic publishers; the vendor claim that `reviewedBy` raises AI
  Overview citation rates (no data shown).

---

## 9. Sources (dated as found, 2026-09-03)

**Competitors / apps:** apologistproject.org (about, products, documentation); faith.tools/app/113-apologist-agent-ai;
navtheway.com; scriptured.app/pricing; blog.scriptured.app/alternatives/apologetics-apps; apps.apple.com forge-apologetics
id6759392772; ixi.academy; ewtn.co.uk (MagisAI); catholicvote.org (MagisAI); play.google.com com.truthly; donate/download.logeticsapp.com;
christianpost.com "AI's Bible misquotes range from 15% to 60%: YouVersion CEO" (2026); blog.youversion.com May 2026;
thegospelcoalition.org/ai-christian-benchmark; rotation.org AI-Christian-Benchmark PDF; faithlife.com/logos-bible-software;
prayforge.app hallow comparison; learnofchrist.com glorify; adapty.io State of In-App Subscriptions; warmpeach.com offline Bible apps.
**Incumbents / authority:** similarweb.com gotquestions.org; ahrefstop.com gotquestions.org; semrush.com gotquestions.org;
ministrywatch.com 13M; gotquestions.org/GotQuestions-replaced-by-AI.html; gotquestions.org/authors.html; gotquestions.chat;
podcast.show Reasonable Faith QoW #1000; reasonablefaith.org Defenders; str.org; learnofchrist.com carm; vidiq.com CrossExamined;
pluggedin.com Alisa Childers; truthunites.org; faithonview.com Huff/Rogan; opentheword.org Huff Nephilim (2026-02-13);
contently.com 2026-04-29 and 2026-02-25; everything-pr.com citation index 2026; searchengineland.com (Reddit/YouTube study; ChatGPT
citations study); wellows.com overlap study; pewresearch.org 2025-07-22; searchengineland.com QRG AI; originality.ai QRG;
limy.ai llms.txt 2026; digitalapplied.com llms.txt adoption; developers.google.com Article structured data; thestacc.com reviewedBy;
christianity.com/about-christianity; plato.stanford.edu/cite.html; oxfordre.com/religion FAQs; premierchristianity.com Hijab/GodLogic
(2026-05-28); en.wikipedia.org Uthman ibn Farooq; tiktok.com/@maklelan; simonandschuster.com Love Thy Stranger; paulogia.buzzsprout.com;
christianpost.com Knechtles; catholic.com Ortlund; cambridge.org Divine Hiddenness; churchtechtoday.com 2026 State of AI;
christiantoday.com AI Bible chatbots.
**Audience / distribution:** premierchristianity.com Quiet Revival withdrawal; christianitytoday.com "The Revival That Wasn't" (Apr 2026);
barna.com young-adults resurgence; barna.com belief-in-Jesus rises; dallasexpress.com Barna/Pew aggregation; billygraham.org Decision
Bible sales; digitalapplied.com zero-click 2026; higoodie.com AI search traffic 2026; xseek.io AI traffic decline 2026; airops.com AEO;
socialpilot.co Reels algorithm 2026; creatorflow.so; heropost.io Instagram 2026; miraflow.ai Shorts search 2026; sproutsocial.com Threads
stats 2026; notta.ai Threads; rottenwifi.com TikTok timeline 2026; hooked.so TikTok religion; religionunplugged.com 2026 trends;
christianpost.com Craig/Nicene backlash (Aug 2026); apologist.com Wes Huff; en.wikipedia.org Cliffe Knechtle, Alex O'Connor;
neonone.com nonprofit email benchmarks; webfx.com 2026 email benchmarks; sonlight.com; masterbooks.com; answersingenesis.org homeschool;
challies.com 30 Substacks 2026; timothypauljones.substack.com.
