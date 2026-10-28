# Scroll the Evidence — feature reference & handoff

**Status as of 2026-10-28: LIVE on `main` (deployed).** A vertical swipe feed
("TikTok/Scroll-the-Bible for the pocket-card deck") plus a bio-link landing page.
Built this session; latest commit on `main` at handoff: `ba0941d7`.

This is the durable record (the "measure, don't estimate" handover rule applies —
every count/path below was verified at write time). Read `CLAUDE.md` first for the
site-wide rules; this file is only the feature.

## What it is
- **`scroll.html`** (repo root) — a full-screen, swipe-up feed. One pocket card per
  screen: category eyebrow → title → tagline → points → an "In conversation" question
  → **See the evidence →** (links to that card's certified essay) → save (★, localStorage,
  per-device) → share (↗, native share / clipboard). Intro slide uses the already-validated
  reel hook *"Saw an objection online? It's been asked before."* 77 cards, day-shuffled
  (stable within a day). Self-contained; loads only `/fonts/fonts.css` + `/analytics.js`.
- **`links.html`** (repo root) — standalone bio-link landing page (no site nav) for the
  **Instagram "link in bio"** destination, matching the navy/gold reel aesthetic. Leads
  with a gold **Scroll the Evidence** button, then Library / Asked & Answered / essays /
  Instagram. Logo is a **text-free inline SVG shield+cross** (matches the app icon — do
  NOT use a Unicode cross glyph `&#10013;`; iOS renders it as a purple emoji).

## How the data flows (single source of truth)
- **`pocket-cards.html` is the ONLY source of card content** (gated/certified). Do not
  author card text in the feed.
- **`tools/build-pocket-data.mjs`** reads it (read-only, byte-identical) → emits
  **`pocket-cards.json`** (77 cards, essay links from `lib/pocket-qr.js`). Run after any
  pocket-card edit and commit the JSON. `--check` mode is wired into CI
  (`.github/workflows/content-gate.yml`) so the JSON can never drift from the deck.
- `scroll.html` fetches `pocket-cards.json` at runtime.

## Wiring already done
- **Nav** (`tools/sync-nav.mjs` CANON): `Scroll` added as a top-level item next to
  Evidence Library, and `Scroll the Evidence` leads a renamed **"Start here"** mega-menu
  column above the essays. Synced to all 348 nav pages. (Edit the CANON, then
  `node tools/sync-nav.mjs`; `--check` in CI.)
- **App bundle**: automatic — `tools/build-app-bundle.mjs` auto-includes root `.html`/`.json`,
  so `scroll.html`, `links.html`, `pocket-cards.json` already ship in the iOS/Android app.
- **Vercel serving**: automatic — root files aren't in `.vercelignore`.
- **Sitemap**: `/scroll.html` added (priority 0.8). `links.html` deliberately left out
  (direct-traffic bio page, not for search).
- **Analytics** (PostHog via `window.adTrack`, loaded from `/analytics.js`):
  `scroll_feed_opened {total}` · `scroll_card_viewed {card, category, position}` (per-card
  reach + scroll depth, IntersectionObserver ≥60%) · `scroll_evidence_clicked` ·
  `scroll_card_saved` · `scroll_card_shared` (all `{card, category}`). `track()` is guarded
  (no-ops if analytics/consent absent).

## Design decisions (don't silently reverse these)
- **Full-length content stays** — the reels that convert followers are 1:20–2:00; the
  depth is the product. The feed is the shallow top; essays are the depth, one tap away.
- **No "n / 77" counter** — a finite-feed finish line kills the endless-scroll feel. Only
  the subtle top progress rail remains.
- **Card text is injected via `textContent`, never innerHTML** (XSS discipline the
  pocket-card page already learned).
- Saves are `localStorage` (per-device). Cross-device sync would require an account.

## Known open items / improvement surface
- **Per-card "objection" hook line** — the top content improvement: one short line per card
  naming the doubt it answers, in the words people hear online (matches the feed's frame and
  the best reels). ⚠ This is NEW gated content — 1 line × 77 cards must pass
  `apologia-argument` + `apologia-orthodoxy` (+ `apologia-neutrality` for deity/resurrection)
  and be stamped before shipping. Everything built so far only *re-displays* certified text,
  so nothing needed a gate; hook lines DO.
- **Looping the feed** — currently finite (77 then stops); reshuffle-and-continue would give
  a truly bottomless feel.
- **Analytics-driven ordering** — once `scroll_card_viewed` data accrues, order/seed cards by
  what retains.
- **Cross-device synced saves + a "saved" view** — needs an account.
- Monetization for this (free-model / donations vs paywall) is a separate, undecided track.

## Rules any session touching this MUST follow
- **Deploy**: never `git checkout main`. Work on a branch; deploy by fast-forward
  `git push origin <branch>:main` (Vercel auto-deploys from `main`). Web sessions often start
  detached at `origin/main` — create a branch first.
- **Regenerate + commit `pocket-cards.json`** (via `build-pocket-data.mjs`) in the same commit
  as any pocket-card change.
- **Run `node --test tests/*.test.mjs`** after edits; keep the mechanical checks green.
- Framing/marketing copy on `scroll.html`/`links.html` is not gated; **card content and any
  new doctrinal line is.**
- Commit attribution footer per the session's system reminder.
