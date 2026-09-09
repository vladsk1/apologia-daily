# Usability, navigation & learning-design assessment — 2026-09-07

_A read-of-the-code usability audit, plus a competitive scan of comparable learning and faith
apps. **Every number below was measured on 2026-09-07 at branch `claude/website-usability-assessment-qzlkck`**
(base `4c2499b`); the command that produced each is named so it can be re-run. Where something
could not be verified from the repo it says so._

> **Scope note — this is deliberately NOT another strategy document.** `docs/NUMBER_ONE_ROADMAP.md`
> (2026-07-02), `docs/COMPETITIVE_LANDSCAPE.md` (2026-07-31) and `docs/MARKET_RESEARCH_2026-09-03.md`
> (four days ago) already cover market position, pricing and acquisition. This one covers only what
> those three do not: **what it is actually like to use the site, find things on it, and learn from
> it.** Where a finding here duplicates one of those docs it is marked ⟳ and credited, so nothing is
> presented as new that is not.

---

## 0. The verdict in one paragraph

The content is not the problem and the design is not the problem — **the wayfinding is.** Apologia
Daily has 38 distinct user-facing destinations and a navigation menu that exposes 18 of them, with no
signal about which one to use first. It has already built the exact thing that fixes this — `/today`,
a four-step, ~4½-minute guided daily session with a real SM-2 spaced-repetition scheduler behind it —
and **the homepage contains zero links to it.** Meanwhile three discovery surfaces are quietly broken:
site search was missing 15 published pages, the What's New feed was two months stale, and the
Evidence Library's argument cards cannot be opened with a keyboard at all. The first two are fixed in
this branch. The rest are listed below in the order I would do them.

---

## 1. What I measured

| Thing | Count | How |
|---|---|---|
| Root HTML pages | 141 | `ls *.html` |
| — of which mastery pages (`ev-m-*`) | 75 | |
| — of which hub fragments (`ev-s*`) | 16 | |
| — of which utility (login/legal/redirects) | 12 | |
| **Distinct user-facing destinations** | **38** | remainder |
| Destinations exposed in the nav | 18 functional (+5 legal/social) | `tools/sync-nav.mjs` CANON |
| Deep-dive essays | 92 (+ index + a redirect stub) | `library/*.html` |
| — median length | **4,691 words** | text-only word count |
| — over 5,000 words | 38 | |
| — over 8,000 words | 5 (longest: `john11.html`, 10,620) | |
| Answer pages | 111 | `answers/*.html` |
| Clickable non-button elements site-wide | **654** | `grep -E '<(div\|span\|li\|td\|tr)[^>]*onclick='` |
| — of those with `tabindex` or `role="button"` | **0** | same |

---

## 2. Fixed in this branch (verified defects, mechanical fixes, no doctrinal content touched)

### 2.1 🔴 Site search was missing 15 published pages

`search-index.json` was **stale by 15 records**. Seven live, sitemapped deep-dive essays and eight
answer pages were published, linked from `library/index.html`, crawlable by Google — and returned
**nothing** in the site's own search box:

- Essays: `abolition`, `compassion`, `equality`, `persecution`, `progress`, `riseofchurch`,
  `science-history` — which includes two thirds of the "Church in History" cluster shipped 2026-08-22.
- Answers: `did-christianity-end-slavery`, `how-did-christianity-take-over-rome`,
  `were-early-christians-really-persecuted`, `where-do-human-rights-come-from`,
  `did-christianity-invent-hospitals`, `are-science-and-christianity-enemies`,
  `are-the-speeches-in-acts-made-up`, `was-there-writing-in-early-israel`.

**Fixed:** `node tools/build-search-index.mjs` → 252 → **267 records**.

⚠ **The part worth acting on is not the staleness, it is that CI caught it and nobody saw.**
`.github/workflows/content-gate.yml` line 68 runs `build-search-index.mjs --check`, and that check
correctly exits 1 on the committed index — I confirmed it. The `nav-consistency` job has therefore
been **red on `main` since those essays shipped**. The workflow's own header explains why nothing
happened: _"To make it BLOCKING, enable branch protection on `main` and mark 'Content review gate' a
required check."_ That was never done. **This is the same failure mode `CLAUDE.md` already records for
`check-stamp-integrity` (59 unread flags) — a guard that cries into a void gets ignored.**
→ **Recommended: turn on branch protection, or add a `--check` sweep to the pre-deploy routine.**

### 2.2 🟠 The "What's New" feed was two months stale

`whats-new.html` — reachable from the nav mega-menu as _"Latest essays, features & reels"_ — had not
been rebuilt since 2026-07-24. **Fixed:** `node tools/build-whats-new.mjs` → newest entry now 2026-09-06.

⚠ **One caveat, on record.** The builder dates entries by each page's `content-review` **orthodoxy
stamp**, i.e. last *certified*, not first *published* (`tools/build-whats-new.mjs:12–19` says so
deliberately, and words the page as "added and updated"). So the August/September Islam re-gate sweep
now dominates the feed and pushed genuinely-newer content down. That is the documented intended
behaviour, not a regression — but if the page is meant to answer _"what should I read that I haven't?"_,
a first-published date would serve the reader better. **Owner call; not changed here.**

**Verification after both fixes:** 117/117 tests pass; `check-retired-claims` 0 alive on 493 files;
`check-orthodoxy-tripwires` 0 new; all six index `--check` guards green.

---

## 3. The headline finding: the fix is already built and unreachable

`today.html` is the best learning surface on the site and it is close to what the category leaders do:

| Step | Label | Budget |
|---|---|---|
| 1 | Review — make yesterday stick | ~90 sec |
| 2 | Learn — today's argument | ~90 sec |
| 3 | Prove it — say it from memory | ~60 sec |
| 4 | Done — streak & tomorrow | ~30 sec |

Progress dots, a per-step time budget, a model answer, a conversation starter, a completion state, a
streak — and step 1 runs **real SM-2 spaced repetition** against the Supabase `flashcards` table
(`today.html:504`, ease factor / reps / interval, identical maths to `flashcards.html:584`).

**Exactly five pages link to it — `dashboard`, `daily-quiz`, `debate-arena`, `explain-it-back`,
`flashcards` — every one of which you can only reach if you already know your way around.** The
homepage links it zero times and the nav CANON does not contain it.
⟳ *`docs/MARKET_RESEARCH_2026-09-03.md` §4 A2 already logged this on 2026-09-03 and it is still true.*

Three things compound it, and the third is new here:

1. ⟳ **A2** — `/today` is absent from the homepage and nav.
2. ⟳ **A4** — a new user's deck is empty, so step 1 of their very first session reads _"Nothing due
   today"_ (`today.html:473`). Nothing seeds a starter deck; the proposed `deck-seeds.json` does not
   exist and is not referenced anywhere — it is a *proposal*, not a broken dependency.
3. **NEW — `flashcards.html` is missing from the games hub.** `games.html` links seven games and
   omits `flashcards`, `daily-mix` and `explain-it-back`. So the spaced-repetition system — on the
   evidence the highest-value learning mechanic on the site — is absent from the nav *and* from the
   page that exists to list practice activities. Six pages link it; none is the nav, the homepage or
   the games hub.

---

## 4. Navigation & information architecture

**The structural problem:** 38 destinations, 18 in the nav, all presented as co-equal, with nothing
marking one as "the thing to do today." The homepage is currently *both* the daily surface and the
browse-everything surface, which is precisely the failure mode the comparable apps designed their way
out of (§8).

Specific, verified issues:

- **Nearly-orphaned learning surfaces.** Measured inbound-link counts across all HTML/JS/JSON:
  `daily-mix` **1** · `objection-deck` 2 · `explain-it-back` 2 (outside the 67 mastery pages that
  embed its grader) · `speed-round` 3 · `who-said-it` 3 · `today` 5 · `palace` 5 (outside `ev-m-*`) ·
  `flashcards` 6 · `daily-quiz` 9 · `pocket-cards` 16. Every nav page, by contrast, sits at
  **319–334**. The distribution is bimodal: you are either in the nav and on every page, or you are
  effectively invisible.
- **Search does not cover the product.** `tools/build-search-index.mjs` indexes essays, answers and
  glossary terms only — **not** the 67 mastery pages, the 70 pocket cards, or any feature page.
  Searching "flashcards", "debate", "spaced repetition" or "practice" returns nothing. For a site
  whose core problem is discovery, the search box cannot find the features.
- **A phantom label in the onboarding copy.** The homepage "Where do you start?" picker tells users
  in two of five paths to _"Read the 'Explain it Simply' section of the relevant argument"_ and _"The
  'Explain it Simply' sections in the Evidence Library translate each argument into natural
  conversation language"_ (`index.html:1644, 1656`). **"Explain it Simply" appears nowhere in the
  Evidence Library** — the tiers are called "The Case, Plainly" and "Pro — Deep Dive". Users are sent
  looking for a section that does not exist under that name. *(Cheap copy fix.)*
- **`challenge.html`** — "40 Questions Before Easter", 21KB, in the sitemap — is reachable only from
  `dashboard` and `study-plans`. Seasonal content with no season and no home.
- **`argument-map.html`** is a 974-byte meta-refresh stub redirecting to `palace.html`. It works, but
  it belongs in `vercel.json`'s `redirects` block with the other eleven, not as a served page.

**Recommendation (small, one file):** restructure the nav around **frequency of use**, not content
taxonomy. A daily tier (Search · Today · Evidence Library · Debate Arena) and one "More" menu for
everything else. `tools/sync-nav.mjs` is the single source of truth and propagates to all 320 nav
pages in one edit, so this is a genuinely low-risk change. The current three mega-menu column headings
("Go deeper", "Practice & community", "For you") group by *what a thing is*; users choose by *how
often they need it*.

---

## 5. The reading experience of the essays

The essays are the heart of the site and they have **no in-page navigation whatsoever.**

Measured across all 92 essays:

| Reading aid | Present on |
|---|---|
| Table of contents / jump links | **0 / 92** |
| Reading-time estimate | **0 / 92** |
| Reading-progress indicator | **0 / 92** |
| Back-to-top control | **0 / 92** |
| "Related deep dives" | 85 / 92 ✅ |
| "Listen to this essay" (TTS) | present ✅ |
| "Short on time? Read the quick answer →" | present ✅ |

`library/kalam.html` is 9,503 words across ten `<h2>` sections — roughly a 45-minute read — and offers
the reader no way to see its structure or jump within it. On a phone that is a very long scroll with
no map. The two escape hatches that *do* exist (the quick-answer link and the TTS button) are good and
should stay; they solve "I don't have time", not "where in this am I, and what's coming".

**This is the highest-value/lowest-risk improvement available, and there is a precedent that makes it
gate-free.** `library/reviewed-badge.js` was rolled out to all 92 essays on 2026-08-26 as an
assert-guarded script include, and `check-stamp-integrity` classifies such an include as **plumbing**,
so no essay was flagged and no re-gate was owed. A `library/toc.js` that builds a sticky contents list
and a progress bar **from the page's own existing `<h2>` elements at runtime** would follow that exact
pattern: it authors no prose, makes no claim, and adds no content — so it needs no doctrinal gate.

**Not built here** — it is a visual design decision across 92 pages and should be the owner's call.
Happy to build it on request.

---

## 6. Onboarding: two personalisation systems that do not talk to each other

A new visitor is asked what they want **twice**, and the first answer is thrown away.

1. **Homepage** — "Where do *you* start?", 5 options (`index.html:1050`). The answer is **not
   persisted** — `selectStart()` writes no `localStorage` and no cookie, so it is lost on refresh and
   invisible to every other page.
2. **Dashboard, after signup** — a 5-question modal: `intent → level → focus → goal → mode`
   (`dashboard.html` `OB_STEPS`). None of it reuses the homepage answer.

That is six questions before any content, and ⟳ per `docs/ONBOARDING_SPEC.md` the modal _"finishes
silently and drops the user on the generic dashboard"_ — the spec to fix that was written and never
shipped. Two further points that spec does not make:

- **The homepage picker's payoff is a set of instructions, not a destination.** Choosing "Someone
  challenged my faith" returns _"Step 1: Go to the Evidence Library and find the section that
  matches… Step 2: Read the 'Explain it Simply' section… Step 3: Practice in the Debate Arena"_ — a
  three-surface manual procedure, one step of which names a section that does not exist (§4). Every
  comparable app answers this question by *doing the first step for you*, not by describing it.
- **Persisting the homepage answer is nearly free and would let the dashboard drop a question.** One
  `localStorage` write in `selectStart()`, read by `dashboard.html`'s `OB_STEPS` to pre-fill or skip
  `intent`. Small change; removes the "I already told you that" moment.

**Also on the homepage: five different phrasings of one action** — "Start Free", "Get started free",
"Create a free account", "Start for Free", "Create your free account →" — across 12 CTAs, plus
"Explore the Platform", "See All Features", "Try the Arena", "Ask Your Hardest Question" and "Upgrade
to Pro". No single action dominates. Pick one verb and one primary action per screen.

---

## 7. Accessibility — one real barrier, and it is on the flagship section

| Check | Result |
|---|---|
| Clickable non-button elements | **654** |
| — with `tabindex` or `role="button"` | **0** |
| Skip-to-content links | **0 pages** |
| `:focus-visible` styles | **0 pages** |
| `prefers-reduced-motion` handling | **0 pages** |
| `<img>` missing `alt` | 1 of 9 ✅ (near-clean) |
| `<html lang>` present | 330 / 346 ✅ |

The concentration matters more than the total. The heaviest counts are the Evidence Library hub
fragments — `ev-s3.html` 48, `ev-s6.html` 47, `ev-s1.html` 36 — and those are the **argument cards
themselves**: `<div class="card" id="arg-titles" onclick="tog(this)">`, with no `tabindex`, no
`role`, no `aria-expanded`, and no keyboard handler (the `keydown` hits in those files are all on the
tutor's text input, not the cards).

The tabs *are* real `<button>`s, so a keyboard user can switch between the eight tabs — and then
**cannot open a single argument on any of them.** For a site whose audience includes people doing
sustained study, and which is heading for an app-store submission, that is the one accessibility
finding I would treat as a defect rather than a polish item.

**The fix is small and mechanical**: `role="button" tabindex="0"` plus a shared
`keydown` → Enter/Space handler. ⚠ But `ev-s*.html` files **are** in `CONTENT_PATTERNS`, so an edit
trips the content-review gate. Two clean routes: (a) add the attributes and the handler **from JS at
runtime** in the existing shared script, touching no gated markup at all — the same plumbing route
§5 uses; or (b) edit the markup and take a stamp round. **(a) is the cheaper and safer one.**

---

## 8. What comparable apps do — and what would be wrong here

Competitive scan (Duolingo, Hallow, YouVersion, Brilliant, Blinkist, BibleProject) run 2026-09-07.
Its top three recommendations independently re-derived ⟳ A2, A4 and A5 from
`docs/MARKET_RESEARCH_2026-09-03.md`, which is itself a useful signal: **an outside pass looking only
at usability lands on the same three items the market pass did.** They are the right next moves.

**Worth adopting (not already logged elsewhere):**

- **The two-mode split (BibleProject).** Two top-level destinations: *Home* = continue what you're
  doing; *Explore* = browse everything. Apologia Daily's problem is that the homepage is currently
  both. Mapping: make `/today` (or a resume card) the daily surface and leave
  `evidence-library.html` / `library/index.html` as browse. **Medium, UI only, no new content.**
- **Sequential unlock on the free tier (Brilliant).** Brilliant gates course units in order for free
  users; paid unlocks any order. `beginners-path.html` is currently a flat list of links — turning it
  into a visible unlock chain costs no content. **Medium.**
- **Confidence calibration before scoring.** Ask "how confident are you that you could explain this to
  a sceptic? (1–5)" *before* `explain-it-back` grades the answer, then show the gap. The
  self-explanation effect is well evidenced (~0.55 SD across 64 studies); confidence-calibration
  feedback is a small addition on top of a grader that already exists. No comparable app in the scan
  does this, so it is a differentiator rather than catch-up. **Small.** ⚠ Frame the gap gently — "you
  were more confident than the score; here's the one part worth revisiting" — never as a
  you-overestimated-yourself callout. On doctrinal content that reads as shaming.
- **Promote `explain-it-back` structurally**, not as one destination among 38. On the learning
  evidence it is the strongest mechanic on the site; it should be the natural next step at the foot
  of every answer and mastery page. **Small.**

**Deliberately NOT recommended — these are effective elsewhere and wrong here:**

1. **Guilt-framed streak notifications.** Duolingo's owl works via loss aversion and draws sustained
   criticism for it. A "you failed today" push about whether someone thought about their faith is a
   direct conflict with the site's own 1 Peter 3:15 tone rule, turned inward on the reader. Keep the
   streak; keep streak-freezes; frame recovery warmly.
2. **Global leaderboards ranked on speed.** Ranking people by how fast they get through arguments
   about the resurrection rewards glibness — the precise opposite of the site's differentiator
   (rigor, honest concession, steelmanning). If a leaderboard is ever built, score accuracy or
   explain-it-back quality, never response time.
3. **Points/badges layered on top of doctrinal scoring.** The overjustification literature (Hanus &
   Fox 2015) found badges and leaderboards *reduced* motivation on already-intrinsically-motivating
   activity. This audience is intrinsically motivated by definition.
4. **A long commitment-device onboarding quiz.** ⟳ `docs/ONBOARDING_SPEC.md` already rejects the
   ~20-step Bible Chat pattern. That judgement is correct and should stand — it is the *payoff*, not
   the question count, that does the work.

---

## 9. What I would do, in order

**Now — cheap, mechanical, no doctrinal content, no gate round:**

1. ✅ **Rebuild the stale indexes** — done in this branch (§2). 15 pages findable again.
2. **Enable branch protection on `main`** so `nav-consistency` can't go red unnoticed again (§2.1).
3. **Make the Evidence Library cards keyboard-operable** via runtime attributes in the shared script,
   touching no gated markup (§7).
4. **Fix the "Explain it Simply" phantom label** in the homepage picker copy (§4).
5. **Add `flashcards`, `daily-mix` and `explain-it-back` to `games.html`** (§3).
6. **Move `argument-map.html` into `vercel.json` redirects** and delete the stub (§4).

**Next — small, but they are product decisions:**

7. ⟳ **Put `/today` in the nav and the homepage hero** (A2). The single highest impact-to-effort item
   on the site.
8. ⟳ **Ship `deck-seeds.json`** (A4) so a new user's first session isn't "Nothing due today".
9. ⟳ **Run the `user_progress` migration** (A5) so progress survives a device switch. *(I could not
   verify from the repo whether this has been run — `progress-sync.js` is correctly wired via
   `analytics.js` and no-ops silently until the table exists. Needs owner confirmation in Supabase.)*
10. **Persist the homepage picker answer** and let the dashboard skip the duplicate question (§6).
11. **Reduce the homepage to one dominant CTA** (§6).

**Then — worth doing, needs a design decision:**

12. **`library/toc.js`** — sticky contents + reading progress + reading time on all 92 essays, built
    from existing `<h2>`s at runtime. Gate-free by the `reviewed-badge.js` precedent (§5).
13. **Index the mastery pages and feature pages in site search** (§4).
14. **Restructure the nav by frequency of use** (§4).
15. **Adopt the two-mode Home/Explore split** (§8).

---

## 10. Explicitly not verified

- Whether the `user_progress` migration has been run in Supabase (item 9). Not knowable from the repo.
- Whether `daily-mix.html` interleaves *argument types* or only *question formats* — the learning
  value differs, and I did not read the rotation logic closely enough to say.
- Whether `study-plans.html` suppresses competing CTAs while a plan is active.
- Real-user behaviour of any kind. There are nine months of unread PostHog data (⟳ A1) and **no
  finding in this document is based on analytics** — it is all code-reading and measurement. A1
  remains the cheapest item on any list in this repo.
