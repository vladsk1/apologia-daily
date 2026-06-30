# Apologia Daily — Session Handoff

_Last updated: 2026-06-30. Read this together with `CLAUDE.md` to resume with full
context at minimal token cost. Everything below is already committed to git; the chat
that produced it can be discarded._

## Ground rules (unchanged)
- Develop on branch **`claude/agents-visibility-calling-n5d1ml`**.
- Deploy by fast-forward: **`git push origin claude/agents-visibility-calling-n5d1ml:main`**. **Never `git checkout main`.**
- Mandatory content pipeline + non-negotiable guardrails: see `CLAUDE.md`. Any **public, doctrinal** content must pass the **orthodoxy gate** before deploy.
- Use assert-guarded edits; re-verify footnote `<sup>↔<li>` integrity after any essay edit.
- **Never** implement real prices/payments/Stripe or change auth/pricing without explicit human sign-off.

## Shipped & live on `main` (this session)
1. **Dashboard "Due today"** spaced-repetition return hook (`dashboard.html`).
2. **Intent-capture onboarding** (dashboard) — "What brings you here?", reflected in greeting, persisted to Supabase `user_metadata`.
3. **Voice / speak-out-loud mode** in Debate Arena (Web Speech API; mic dictation + read-aloud) — `debate-arena.html`.
4. **Semantic "Related arguments" panel** on all 76 deep-dive essays — `library/related.json` + `library/related.js`.
5. **"Send this answer to a skeptic" referral loop** — `ask-anything.html` + `shared-answer.html` + `?ref=` capture in `signup.html`.
6. **New Islam card + essay**: "Was Jesus a Muslim? The Christian Response" — worldviews Islam tab card + `library/islam-jesusmuslim.html` (+ `/answers/was-jesus-a-muslim.html`).
7. Worldviews Islam: reordered cards, and moved each essay link **inside** the card's Pro deep-dive.
8. **Answers flywheel**: `api/submit-question.js` (capture via Resend) + submit box on `answers/index.html` + capture on `ask-anything.html` + generator `tools/gen-answers.mjs` + 3 new Islam-cluster answer pages.
9. **Macedonian pilot (10 essays)**: `library/mk/*.html` + `library/mk/index.html`; EN/MK switchers + `hreflang` on the 10 English essays.
10. **Bilingual Evidence Library hub**: EN/МК toggle in `evidence-library.html` (LANG/I18N/setLang + fragment routing) + 7 translated tab fragments `ev-s1…s7.mk.html`.

## Open threads / known issues (priority order)
1. **Native Macedonian doctrinal review is still outstanding.** All MK content (10 essays + 7 hub fragments) is AI-translated and passed the automated orthodoxy gate, but a fluent Macedonian-speaking believer should confirm before heavy promotion. Specific spots the gate flagged to eyeball: `ev-s3.mk.html` (~functional-submission gloss, Isaiah 9:6 "Everlasting Father" gloss), `ev-s6.mk.html` (filioque lines, procession of the Spirit). Terminology consistency to tidy: "fine-tuning" is rendered both **фино подесување** and **фина наместеност**; also "Mastery Track", "transworld depravity", "criterion of embarrassment", "soul-making". Rule used: translate the *language*, not the *theology*; keep denominational neutrality (small-o "orthodox" → **ортодоксни**, never **православни**).
2. **English `ev-s4.html` has a factual error** (the Macedonian `ev-s4.mk.html` was already corrected): Luke 4:25 famine is given as "153 years and four months" (conflated with John 21's 153 fish) — should be **"three years and six months."** Fix the English via a citations/editor pass.
3. **Question capture needs an env var:** `api/submit-question.js` only emails submitted questions if **`RESEND_API_KEY`** (and optional `QUESTION_NOTIFY_TO`) is set in Vercel. Until then they still log a PostHog `question_submitted` event.
4. **Monetization is a stub (integrity + decision needed):** `isPro = true` is hardcoded site-wide, Stripe is not live, yet the site advertises **"$8/mo" + "7-day free trial"** on a flow that cannot charge. Don't drive paid acquisition into it. Pending interim fix: soften/relabel the dead trial button. Pending decision: **free + donations/Patron** (à la GotQuestions; implies 501(c)(3) for tax-deductible giving) **vs paywall**. See `docs/MARKETING_PLAN.md`.
5. **Analytics under-instrumented:** PostHog is live but only ~5 events. Added this session: `question_submitted` (server), `question_asked` (ask-anything). Full event/funnel list to add is in `docs/MARKETING_PLAN.md`.

## Proposed next steps (not started)
- **Spanish essay translation** — far larger reach than Macedonian; reuse the exact pipeline (translate → orthodoxy gate → `hreflang`/switcher → deploy).
- **Marketing plan execution** (`docs/MARKETING_PLAN.md`): repoint the homepage hero CTA off the dead `#pricing` to the free AI tool; add the activation/retention/referral PostHog events; `/answers/` SEO pass; creator (YouTube) outreach.
- **More `/answers/` pages** via the flywheel (resurrection + Bible-reliability clusters are the next best SEO targets).
- **Extend the hub toggle** to additional languages (toggle infra now exists).

## Key files & how to use them
- **Answers flywheel:** edit `answers/_data.json` (append an entry) → run `node tools/gen-answers.mjs` → paste the printed index + sitemap snippets → deploy. Public answers are doctrinal → orthodoxy-gate new ones first.
- **Related panel:** `library/related.json` (+ `library/related.js`). Regenerate after adding essays: `python3 tools/build-related.py`.
- **Macedonian:** `library/mk/*.html` (10 essays) + `library/mk/index.html`; `ev-s{1..7}.mk.html` (hub fragments). Toggle logic lives in `evidence-library.html` (`LANG`, `I18N`, `setLang`, `applyChrome`, and the `loadSection` fetch suffix).
- **Capture endpoint:** `api/submit-question.js` (mirrors the Resend/PostHog setup in `api/new-signup.js`).
- **Agent fleet & pipeline:** `.claude/agents/*.md` + the pipeline table in `CLAUDE.md`.

## A reusable check before deploying translated content
For any AI-translated page, verify: (a) `<sup>`↔`<li>` footnote parity vs the English; (b) no scripts altered and the Supabase key / API URLs are ASCII-clean; (c) **no mixed Cyrillic+Latin words** (Latin look-alikes a/e/o/c/p/x slipping into Cyrillic words — this happened several times this session); (d) run the orthodoxy gate for neutrality (no Eastern-Orthodox drift).
