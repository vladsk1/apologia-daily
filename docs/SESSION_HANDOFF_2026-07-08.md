# Session handoff — 2026-07-08

_Read this + `CLAUDE.md` + `HANDOFF.md` to resume. Everything below is **deployed to `main`**,
so a new chat on any branch already has it. Deploy rule unchanged: work on a feature branch,
**never `git checkout main`**, deploy by `git push origin <branch>:main`. This session ran on
`claude/short-form-reels-generator-tjpymt`._

## ⚠️ ONE MANUAL STEP OWED BY THE USER
The live "Asked & Answered" AI has a per-IP daily cap that needs a one-time Supabase table.
Until it's run, the endpoint still works (the cap just fails open). SQL is in
`docs/ASKED_AND_ANSWERED_SPEC.md` (creates `public.ask_rate_limit` + `bump_ask_rate` RPC).

## What shipped this session (all live on `main`)

### 1. "Asked & Answered" — NEW live feature that REPLACED Ask Anything
`asked-and-answered.html` (root, indexed). One smart box: type a question, paste an objection,
or **drop/paste a screenshot** (free client-side `tesseract.js` OCR). **Pure live AI** — every
question goes to `/api/ask` and is answered under the existing orthodoxy guardrails (Nicene,
no-fabrication, steelman-first, topic-classifier that declines OFFTOPIC + defers DENOM intra-
Christian disputes). Framed by a **2,000-year timeline** of skeptics (Celsus→New Atheists).
- **"Go deeper"** links are FIXED (Evidence Library + Browse all answers) — NOT keyword-matched.
  (An earlier keyword-retrieval approach mis-served answers, e.g. "Did God die on the cross?" →
  the Islam page; it was fully removed. `answers/search-index.json` + `tools/gen-answers-index.mjs`
  exist but are now UNUSED — left for a possible future *semantic* retrieval.)
- **Trust panel** is honest: "How these answers are made" — AI-generated, **not individually
  reviewed**; only the linked library is human-review-gated. Plus a **disclaimer** (not personal/
  pastoral/medical/legal advice → see a pastor). Per-answer label says the same.
- **Pro gate built but DORMANT** — `isPro` hardcoded `true` (open to all). When Stripe is live,
  flip the one commented line in `asked-and-answered.html` to make live answers paid-only
  (retrieval/library stays free). This was the user's chosen sequence.
- **api/ask.js** changes (content-review stamped, re-gated CLEAN): added objection-statement
  handling to the system prompt + a per-IP daily cap (`DAILY_IP_CAP=40`, fail-open) via the
  Supabase RPC above. The whole orthodoxy guardrail block is UNCHANGED.
- **Replaced Ask Anything everywhere:** nav label swapped on non-gated pages + body links cleaned;
  gated essays were left untouched (so the content-gate isn't tripped by a cosmetic change) and
  are **relabeled at runtime by `ad-nav.js`**; `/ask-anything.html` **301 →** `/asked-and-answered.html`
  (vercel.json); sitemap updated. `ask-anything.html` file remains but is 301'd.
- Full plan + build spec: `docs/ASKED_AND_ANSWERED_SPEC.md`.
- **Open follow-ups:** run the SQL; verify OCR on a real device; free-taste metering (later);
  a batch review sweep that promotes good live answers into `/answers/`; Claude-vision OCR fallback;
  port the old "share this answer to a skeptic" feature.

### 2. Answers library 66 → 74 (SEO gap-fill, fully gated)
8 new `/answers/` pages filling the thinnest categories, each grounded in certified essays and
run through citations + argument + orthodoxy (a real BREAK was caught + fixed on the slavery one):
- **Suffering & Evil (→7):** why-do-bad-things-happen-to-good-people, why-doesnt-god-heal-everyone-
  or-answer-every-prayer, why-does-god-allow-natural-disasters.
- **Faith & Doubt (→6):** isnt-christianity-just-what-you-were-raised-to-believe, if-god-is-real-
  why-does-he-seem-hidden, what-about-those-who-never-heard-of-jesus (+ orthonote clarifier).
- **Science & Faith (→4):** can-a-christian-believe-in-evolution (neutral on the intra-Christian debate).
- **Bible Reliability (+1):** does-the-bible-condone-slavery (concedes Leviticus 25:44-46 honestly).
- SEO reality (relayed to user): helps via long-tail intent + topical authority + internal linking;
  QAPage/FAQ schema is NOT a ranking lever (Google deprecated FAQ rich results 2023); slow compounding
  play; external links are the untouched lever.
- **Next answers batch candidate:** Science & Faith is still thin — evolution/Adam, age of the
  universe, miracles vs science, does the Bible contradict science.

### 3. Paul-conversion reel — recut
`tools/reel/specs/paul-the-enemy-who-switched-sides.json` (+ rendered MP4 in `tools/reel/output/`).
Cut the steelman/skeptic/honest-limit scenes (11→8) for a punchier short; the close now NAMES Jesus
as the enemy's confession ("he met the risen Jesus") rather than "met something." Re-gated: argument
PASS, orthodoxy CLEAN. There's a ready posting caption/kit (in chat history).

### 4. Dr. Mikel Del Rosario reading-club demo — PAUSED, waiting on the book
`demo/del-rosario-companion-study.html` (live but UNLISTED: noindex, not in nav/list/sitemap).
A companion study for his book *Did Jesus Really Say He Was God?*, in the Reading Clubs skin,
mapped to his real table of contents. Book-first design (his content is the spine; our resources
are optional/"not endorsed"), prominent "Get the book" band. **Next step needs a local browser
session to read the book (Kindle) and verify/correct each session summary against the real chapters,
then re-gate + swap the buy link for his affiliate link + draft the DM.** Full detail:
`docs/DEL_ROSARIO_READING_CLUB.md`.

## Standing rules / guardrails (carry forward — see CLAUDE.md for full)
- Mandatory pipeline for ALL written/AI content: draft → citations → argument → editor → footnote
  integrity → **orthodoxy gate (must be CLEAN)** → deploy. Answers + reels + card + api prompts included.
- "Orthodoxy outranks charity" (hard tiebreak); concede the observation, never the inference;
  pull-quote test. Nicene orthodoxy; denominational neutrality; 1 Peter 3:15 tone. Argument-specific
  rules (Kalam "begins to exist"; manuscripts=preservation-not-truth; fine-tuning data-conceded-design-
  inferred; resurrection lead with 1 Cor 15 creed; Plantinga=defense; morality=duties-need-a-ground).
- **Monetization is a STUB** — `isPro` hardcoded true, Stripe not live, Pro = "Coming soon". Do NOT
  wire real prices/payments or run paid acquisition without human sign-off + keys.
- **Content-gate** (`tools/check-content-review.mjs`, CI `.github/workflows/content-gate.yml`) requires a
  `content-review` stamp on changed `library/*.html`, `ev-s*.html`, `worldviews.html`, reel specs,
  `api/ask.js`. Cosmetic edits to those files trip it — prefer NOT touching gated files for site-wide
  changes (e.g. do it in `ad-nav.js` at runtime, as the Ask-Anything nav swap did). `/answers/*` have
  their own gate in `tools/gen-answers.mjs` (refuses to build unstamped; runs a drift audit).
- Deploy: `git push origin claude/short-form-reels-generator-tjpymt:main`. Never stamp a check you didn't run.
