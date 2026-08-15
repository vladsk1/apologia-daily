# Gate coverage — what is reviewed, what isn't, and why

**Created 2026-07-28** after an audit found that the content-review gate covered far less
of the site than anyone had assumed. This file is the triage: every user-facing file is
either **stamped**, **exempt with a reason**, or **on the queue below**. Nothing is
allowed to be simply unaccounted for again.

Live status at any time: `node tools/check-content-review.mjs --audit-all`
(non-blocking; runs in CI on every push).

---

## How this happened

`tools/check-content-review.mjs` enforced a list — `CONTENT_PATTERNS` — naming six kinds
of content. CLAUDE.md's actual rule is broader: *"There is no such thing as content too
small to gate."* **The gap between the rule and the list is where the ungated content
lived.**

Two holes, compounding:

1. **The list was an enumeration.** Anything nobody remembered to add was invisible.
   `pocket-cards.html` — 70 compressed doctrinal arguments, designed to be exported as
   shareable images — was never on it. Gating it on 2026-07-28 produced **23 blocking
   findings** across three review lenses.
2. **CI only ran `--changed`.** So even files *inside* the patterns were checked only when
   someone next edited them. `ev-s7.html` matches the pattern and is still unstamped for
   exactly this reason. An `--audit` mode existed and was never wired to CI.

The result: `--audit` reported **2** files missing stamps while **95** user-facing files
actually had none.

**The fix is an inverted default.** `USER_FACING` now matches everything served to a
reader; `EXEMPT` names the exceptions *with a reason each*. Adding a page no longer
requires anyone to remember. Skipping one requires writing down why.

---

## Queue — needs gating

Ordered by risk: how doctrinal the content is × how far it travels.

### P1 — doctrinal prose, substantial, ungated

| Files | What | Why it's P1 |
|---|---|---|
| **63 × `ev-m-*.html`** | Evidence Library **mastery pages**, median ~2,100 words each | ⭐ **ASSESSED 2026-07-28, RE-GATED 2026-07-29 — see [`MASTERY_PAGE_AUDIT.md`](MASTERY_PAGE_AUDIT.md).** Four rounds: 16 reviews on the audit (argument ×63, orthodoxy ×63, neutrality ×15) → three fix rounds → 16 reviews on the re-gate. **0 heresy throughout.** Three pages were found to be dead JavaScript (one of them *stamped*, one killed by our own fix pass). ✅ **STAMPED 2026-07-29** after a confirmation pass of both doctrinal lenses over every page the re-gate blocked — which caught three further unpropagated fixes and one factual error introduced by the fix itself. 16 pages carry a dual-consensus stamp (orthodoxy + neutrality); 51 carry argument + orthodoxy. `ev-m-*` is now in `CONTENT_PATTERNS`, so CI sees all 67. **Never pastoral sign-off** — start the human reviewer on `ev-m-trinity_islam.html`. |
| `ev-s7.html`, `ev-s7.mk.html` | Evidence Library hub fragment (Conversion Stories), ~4,400 words | **Already inside `CONTENT_PATTERNS`** — unstamped only because CI never audited, just diffed. Proof of hole #2. |
| `scholars.html` | ~5,000 words on named apologists and their arguments | Longest ungated page on the site. Characterises living scholars — a citations risk as well as a doctrinal one. |
| `library/index.html` | Library hub, ~3,400 words | Explicitly excluded by the `(?!index\.html$)` clause in `CONTENT_PATTERNS`. Carries framing prose, not just links. |
| `beginners-path.html` | ~1,900 words, the 5-day onboarding path | First substantial content a new visitor reads. |

### P2 — thin HTML, doctrinal content in JS/data

The body-word count is misleading for these: the doctrine lives in a JavaScript object or
a fetched JSON file, exactly as it did in `pocket-cards.html` (161 body words, 70 cards).

`pocket-cards.html` (⚠ gated 2026-07-28, **fixes applied, stamp still owed**) ·
`objection-deck.html` · `objection-catcher.html` · `glossary.html` · `argument-map.html` ·
`daily-quiz.html` · `who-said-it.html` · `speed-round.html` · `daily-mix.html` ·
`daily-devotional.html` · `challenge.html`

### P3 — feature pages with framing prose

`about.html` · `parents.html` · `evidence-library.html` · `debate-arena.html` ·
`explain-it-back.html` · `flashcards.html` · `games.html` · `palace.html` ·
`study-plans.html`

### P4 — the 6 unstamped X share-cards

`tools/reel/xcards/*.json` — already named in CLAUDE.md's mandatory pipeline, never
stamped. Three need wording fixes first (recorded in `docs/SOCIAL_GROWTH_PLAN.md`);
`x-jesus-god-mark` and `x-nicene-creed` are deity/Trinity tier and need dual-consensus.
**Now 7:** `x-messianic-prophecy.json` was added 2026-08-15 (see P5).

### P5 — the first carousel deck and the first X thread (added 2026-08-15)

Two new social surfaces, each with exactly one file, and **neither has been gated**:

- `tools/reel/carousels/messianic-prophecy.json` — 10 slides, rendered by the new
  `tools/reel/gen_carousel.py`.
- `tools/reel/threads/x-messianic-prophecy.json` — 11 posts, with
  `tools/reel/xcards/x-messianic-prophecy.json` as its lead image.

All three are drafted from `ev-s3.html` card 05 and its certified paired essay
`library/messianic-prophecy.html` (read cover to cover first), and every doctrinal line is
ported from one of those two rather than authored — but **a port is not a gate**, and the
compression is new. Each file carries a `gate_status` object, deliberately **not** a
`reviewed` one, so `check-content-review.mjs` reports them as unstamped instead of reading a
`_pending_` placeholder as a date. Owed: `apologia-argument` + `apologia-orthodoxy` on all
three; `apologia-neutrality` is advisable — this argument's compressed forms have a history
of asserting what the essay retires (the probability figures; Psalm 22:16 as though it were
secure), which is exactly what that lens exists to catch.

Both directories are in `USER_FACING` (so `--audit-all` counts them) and deliberately **not**
in `CONTENT_PATTERNS` (CI-blocking) — the pattern entry and the stamp must land in the same
commit, so they go in when the gates actually run.

---

## Exempt — and the reason

Kept in code (`EXEMPT` in `tools/check-content-review.mjs`) so it cannot drift from what
the tool enforces. The test is simple: **a page that RENDERS gated content is exempt; a
page that ASSERTS something is not.**

| Page | Reason |
|---|---|
| `privacy.html`, `terms.html` | Legal text. Needs human accuracy review, not a doctrinal gate. |
| `login`, `signup`, `update-password`, `join` | Auth forms. |
| `monitor.html` | Operator dashboard; excluded from the app bundle, not publicly linked. |
| `dashboard`, `today` | App shells; everything they display is gated at source. |
| `search.html` | Renders `search-index.json`, generated from gated pages. |
| `shared-answer.html` | Renders a gated `/answers` entry. |
| `sources.html` | Renders the `/sources` corpus, gated by `verified:true`. |
| `ask-anything.html` | Shell for `api/ask.js`, which is itself gated. |
| `coach`, `conversation-journal`, `study-groups` | Shells; user-authored or `api/*` content. |
| `video-library.html` | Catalogue of third-party videos. |

**Challenge these.** Several are judgement calls — `about.html` and `parents.html` were
*considered* for exemption and deliberately left in the queue, because both make claims in
our own voice about what we believe and how to raise children in it.

---

## Not covered here

- **`/answers/*`** gate separately and correctly through `answers/_data.json`'s `reviewed`
  object, enforced by `tools/gen-answers.mjs`. Verified 2026-07-28.
- **`app/www/`, `ios/`, `android/`** are build outputs. Gating their sources covers them.
- **Macedonian and Spanish mirrors** inherit their source essay's stamp, and carry the
  standing caveat that they are AI-translated and await native doctrinal review.

---

## The rule going forward

1. New user-facing file → it needs a stamp, or an `EXEMPT` entry with a reason.
2. `--audit-all` runs in CI on every push. The number is visible; it should only go down.
3. **Never stamp a check you did not run.** The stamp is an auditable assertion, not proof.
