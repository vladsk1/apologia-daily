# Session handoff — 2026-07-11 (web session: Groups, UX, SEO, Coach)

Continues after the Trinity "world-class" session (`docs/SESSION_HANDOFF_2026-07-11-trinity.md`)
and the earlier 07-11 web session (`docs/SESSION_HANDOFF_2026-07-11.md`). This session was
product/UX/SEO, not doctrinal content. Everything below is **deployed to `main`**.

## 1. Games — one system

New shared module **`games-common.js`** (`window.ADGame`) — single source of truth for:
- **One streak**: every game marks the same `ad_streak` key as `/today` + the dashboard
  (identical freeze-banking rules; also keeps the legacy `quizCompleted` in sync).
- **Coach wiring**: finished games record accuracy to `Coach` by argument category.
- **Universal share card**: one brand 1080×1080 result card + spoiler grid + native-share/download.

Wired all six games: daily-quiz, who-said-it, name-the-heresy, objection-catcher (per-topic →
Coach cats + share button added), speed-round (per-category → Coach + share button added),
conversation-journal (logging marks streak). **Cut "Argument or Fallacy?"** (card + sitemap +
file removed; 301 → `/games.html` in `vercel.json`). **Folded Memory Palace into the mastery
track**: `palace.html` deep-links via `palace.html#<argId>`; each of the 30 mastery pages with a
room gained a "Drill 4 · Memory Palace" card; removed Memory Palace from the primary nav (dropdown
+ footers, 107 entries / 98 files).

## 2. Study Groups — real, for everyone (was a front-end demo)

**Backend migration RAN by the user** (spec: `docs/STUDY_GROUPS_SPEC.md`). Tables `groups`,
`group_members`, `group_messages`, `group_activity`; RLS via security-definer helpers
(`is_group_member` / `is_group_host` — avoids the group_members recursion); `join_group_by_code`
RPC; realtime on messages + activity.

**`study-groups.html` fully rewritten**: reframed for everyone (kind templates — Just us two /
Friends / Family / Me + a skeptic / Campus / Church / Online / Something else; creator = **host**,
peers equal). Real persistent create, realtime discussion (General/Plan/Prayer), live roster,
**team pulse** ("I studied today" → one `group_activity` ping/day → "N of M studied this week" +
active dots), working invite link, browse/join public, leave. Graceful "being switched on" notice
if the migration weren't run. `group_created`/`group_joined` analytics.

- **Invite/join flow**: `join.html` + `/join` rewrite in `vercel.json`; `/join?g=<code>` → RPC join
  → drop into the group. `login.html` + `signup.html` gained safe `?next=` (relative-only) so
  invite links survive auth.
- **Group result share-card**: "Share" on the pulse bar → branded 1080×1080 card (celebratory on
  plan completion). Function `buildGroupShareCanvas()` / `shareGroupCard()` in study-groups.html.
- **Bug fixed**: invite-only create failed ("Could not create the group") because
  `insert().select()` hit RLS on the RETURNING row before the host membership existed. Fixed by
  generating the id client-side (`crypto.randomUUID` + uuidv4 fallback) and skipping the read-back;
  orphan cleanup on membership failure.

## 3. Email nudges + weekly email (RESEND is configured)

Confirmed via `GET /api/weekly-email?do=status&secret=apologia-cron-2026` (no-send diagnostic added
this session): **`resend_api_key_set: true`** and service key set — so weekly email + nudges are
**live**, not dormant. The long-standing "RESEND_API_KEY unset" open item is **resolved**.

**Fall-behind nudges** folded into `api/weekly-email.js` (can't add a 13th function — Hobby limit):
`sendGroupNudges()` scans groups; members of an "alive" group (≥2 members, ≥1 active in 7 days) who
joined >3 days ago but haven't studied in 7 days get one gentle email (Proverbs 27:17, jump-back-in
CTA), via their most-active group. Runs in the Monday weekly cron (nudged users skipped from that
morning's summary — no double email). Also `?do=group-nudge` for manual/testing. Cadence is weekly
(didn't add a 3rd cron — Hobby cron limit + a bad `vercel.json` fails the whole prod deploy).

## 4. Study Plans — visual refresh (cosmetic only)

Pulled the newer Study Groups look into `study-plans.html`: tighter hero, a hero chip row, and the
gradient "continue where you left off" banner with a gold eyebrow. No logic change.

## 5. Plans ↔ Groups integration (one shared loop)

- study-plans.html: "**Study this with a group →**" on every plan modal → `study-groups.html?create=1&plan=<id>`
  (opens create with the plan preselected). Deep-link `?plan=<id>` opens that plan.
  **Completing a plan day pings `group_activity`** for your groups on that plan (`pingGroupsForPlan`).
- study-groups.html: group plan panel gains "**Do today's day →**" (into the real plan flow) + host
  **◀ / Advance day ▶** controls (RLS host-only; progress bar + completion + share-card reflect it).
  Group plans expanded from 6 → **all 10** Study Plans (both dropdowns generated from one list;
  labels/day-counts mirror study-plans.html).

## 6. SEO / P0 cleanup

- **Crawlable Evidence Library**: `evidence-library.html` was 100% JS-tab-gated. Added an always-in-DOM
  crawlable index (69 essay links, 6 categories, titles from `library/index.html`) + a `<noscript>`.
- **Sitemap lastmod** was frozen (102 URLs at 2026-06-24). New `tools/update-sitemap-lastmod.mjs`
  sets every `<lastmod>` from the file's real git-commit date. (All read 2026-07-11 now because the
  nav sweep touched every file today; re-run any time to diversify.)
- **Mastery canonicals → essays**: the 67 `ev-m-*.html` had self-referential canonicals (cannibalizing
  the essays). Repointed each to its essay (paired from the fragment cards, incl. minimal→minimalfacts,
  paul→paulconv, postresurrection→postres, messianic_prophecy→messianic-prophecy).
- **Per-card deep links**: added `id="arg-<slug>"` to all 69 fragment cards + deep-link handling in
  `evidence-library.html` — `?arg=<slug>` (or `#arg-<slug>`) opens the right tab and scrolls to/opens
  the card. `ARG_TAB` map embedded in the hub. Answers/reels/emails can now link a single argument.
- **#4 (14 pages missing `<meta viewport>`) was a false positive** — those are the headless `ev-sN`
  tab fragments; every real page has viewport.
- **Study-plan reading popup fix** (`study-plan-popup.js`): "Could not load this argument" was
  title-drift (card retitled "…the Statistical Case" → "…Foretold and Fulfilled"). Matcher now falls
  back to the main title before the dash; verified zero pre-dash head collisions across all 6 fragments.

## 7. Nav — build step + rich "More" mega-menu

- **`tools/sync-nav.mjs`**: single source of truth for the nav MENU. The nav had drifted into 15
  variants across 284 pages. Canonical `.adn-links` defined once, written into all **non-gated** pages
  (excludes `library/**`, `ev-s*`, `worldviews.html` so it can't trip the content gate; gated pages
  keep their existing nav). **Only touches the menu, never `.adn-right`** (187 pages lack `signOut()`
  and run a lighter auth nav). CI gate added (`nav-consistency` job in `content-gate.yml`, runs
  `--check`, whitespace-tolerant). Run `node tools/sync-nav.mjs` after any menu change.
- **Rich "More" mega-menu (LIVE, 179 non-gated pages)**: `ad-nav.css` gained opt-in `.adn-mega`
  styles (full-width fixed panel, click-to-open on desktop; unfolds into grouped stacked sections in
  the burger drawer on mobile). Three columns — Go deeper / Practice & community / For you — rich
  icon+title+desc cards; About · What We Believe · Editorial Standards in a footer strip. All 11
  destinations preserved. Scoped to `li.adn-has-mega` so gated pages' simple `.adn-drop` is untouched.
  **Not browser-tested here** (no live browser) — worth a manual check on desktop + mobile.

## 8. Coach — the Skill Map (see competence grow)

- `Coach.renderSkillMap()` on **coach.html** (between prescription and training log): the whole
  territory — all 63 arguments grouped by the 6 categories as a grid of squares, each lit + coloured
  by mastery (green solid / gold shaky / red weak / grey not-started), ▲ on improving skills, dark
  header with overall mastery ring + "N of 63 unlocked", every square links to its `ev-m-` drill.
  Built purely from `Coach.profile()` — no new plumbing.
- `Coach.renderSkillStrip()` — compact dark strip in the **dashboard** coach card ("N/63 unlocked ·
  NN% mastery" + 6 per-category coverage bars → link to the map).
- Added **Coach** to the nav mega (Practice & community).

## Tooling added this session
- `tools/sync-nav.mjs` (+ CI job) — nav menu single source; `--check` in CI.
- `tools/update-sitemap-lastmod.mjs` — git-date sitemap lastmod.
- `games-common.js` (`window.ADGame`) — shared game engine.
- `join.html`, `docs/STUDY_GROUPS_SPEC.md`.
- `Coach.renderSkillMap` / `renderSkillStrip` in `coach.js`.
- `api/weekly-email.js` — `?do=group-nudge` + `?do=status` routes.

## Open items / next
- **Gated pages keep the SIMPLE dropdown, not the mega** (library essays, worldviews, ev-s). Bring
  them over later with a stamp pass if full consistency is wanted.
- **Mega nav is not browser-tested** — verify desktop + mobile; one-file revert (`ad-nav.css`) if off.
- `ARG_TAB` map + card `id="arg-*"` anchors + mega items will drift as new cards are added — a small
  regen tool (like the sitemap one) could be gated in CI alongside the nav check.
- Human/pastoral sign-off on the new Christology still owed (Trinity session).
- Monetization stub (`isPro` hardcoded, Stripe not live) — unchanged; don't run paid acquisition into it.
- Study Groups follow-ups: verify create→invite→join→chat on two real accounts now that the migration
  is run; optional realtime presence dots, group nudge cadence (mid-week needs a plan upgrade or
  trading a cron).
