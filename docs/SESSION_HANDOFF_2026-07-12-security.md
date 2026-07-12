# Session handoff — 2026-07-12 (security hardening pass)

A full security + code-quality audit of the site (static HTML/JS on Vercel + Supabase +
Claude `/api/*` functions), followed by fixing **every** finding — Critical through Medium.
All code is **deployed to `main`**. Three DB migrations + one env var are the human steps;
status of each is tracked below.

## How the audit ran
Two parallel adversarial audits (a general-purpose agent on the 12 `api/*.js` functions; a
second on client JS / Supabase RLS / config), plus direct verification of every headline
finding. Theme: the content pipeline is rigorous, but the **serverless API + Study-Groups
RLS** were the soft spots — the risks were account/group takeover, wallet-DoS on the
Anthropic/Resend bills, and info disclosure, **not** a raw data breach (service-role keys
stay server-side; the browser anon key is correct-by-design).

## Everything fixed (all live on `main`)

### Critical
- **C1 — Study Groups RLS privilege escalation.** `group_members` insert policy only checked
  `user_id = auth.uid()`, so any logged-in user could self-insert as `host` of any group →
  read private chats, rename/re-key, kick members. **Fixed** via `is_group_creator` /
  `is_group_public` security-definer helpers + hardened `gm_insert` (host row only for the
  creator; member row only into public groups; private = RPC-only). Migration:
  `docs/STUDY_GROUPS_RLS_FIX.md`. **RUN by the user.** ✅
- **C2 — Published cron secret.** `vercel.json` shipped `?secret=apologia-cron-2026` and it was
  the hardcoded fallback in `weekly-email.js`/`push.js` → unauth mass-mailer / push / config
  leak. **Fixed:** removed the fallback + the published query; endpoints now require
  `CRON_SECRET` (accept Vercel's native `Authorization: Bearer $CRON_SECRET`), fail closed.
  **`CRON_SECRET` SET in Vercel + verified live via `?do=status`.** ✅
- **C3 — Public `/api/logs`.** Returned prod deploy metadata + function error logs to anyone.
  **Fixed:** requires `LOGS_SECRET` (or `METRICS_SECRET`), fails closed. ✅

### High
- **H1 — No rate limiting on Claude endpoints** (ask's cap failed open, its RPC un-migrated).
  **Fixed:** shared `lib/ratelimit.js` — per-(endpoint, IP)/day counter via the `bump_ask_rate`
  RPC, **degrades to an in-memory per-instance cap** if the DB is down (never fully open).
  Caps: ask 40 · debate 150 · tutor 80 · devotional 60 · feedback 80. Migration:
  `docs/ASK_RATE_LIMIT.md`. **RUN by the user.** ✅
- **H2 — Blind SSRF in `push.js`.** Stored+fetched an attacker-supplied `endpoint`. **Fixed:**
  `isAllowedPushEndpoint()` allowlist (FCM/Apple/Mozilla/Windows push hosts) on store + send. ✅
- **H3 — Open redirect** on login/signup (`?next=//evil.com`). **Fixed:** `nextDest()` regex now
  rejects a leading `//` or `\`. ✅
- **H4 — CDN scripts without SRI** (supabase-js floating `@2`, html2canvas, tesseract).
  **Fixed:** pinned + Subresource-Integrity on all **non-gated** pages (supabase-js →
  `@2.110.2/dist/umd/supabase.js`, html2canvas `@1.4.1`, tesseract `@5.1.1`). Hashes computed
  from the exact npm files jsdelivr mirrors byte-for-byte; **canary-verified** (login works).
  The ~103 **content-gated** library essays keep the plain tag (editing them trips the
  doctrinal review gate) — they get SRI on their next content review; CSP already blocks
  non-jsdelivr script origins there. ⚠️ (see Open items)
- **H5 — No security headers / CSP.** **Fixed:** `vercel.json` `headers` block — CSP
  (`script-src` locked to self + jsdelivr/unpkg/posthog, `frame-ancestors 'none'`, etc.),
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy. ✅

### Medium
- **M1 — HTML injection** into the founder's signup email (`new-signup.js`). **Fixed:** escape
  record-derived email/timestamp. ✅
- **M2 — Internal error bodies** returned to clients (`ask/debate/devotional/feedback/tutor`).
  **Fixed:** log server-side, return generic (502 upstream / 500 server). ✅
- **M3 — No input length caps.** **Fixed:** `inputTooLong()` (in `lib/ratelimit.js`) rejects
  oversized payloads with 413 before the Claude call. Caps: ask 5k · tutor 8k · devotional 5k ·
  debate 30k (messages) · feedback 20k chars. ✅
- **M4 — display_name spoofing** in group tables (impersonation, not XSS). **Fix READY:** a
  `BEFORE INSERT` trigger stamps the real name from `auth.users`. Migration:
  `docs/STUDY_GROUPS_DISPLAY_NAME_FIX.md`. **NOT yet run — the one remaining human step.** ⏳
- **M5 — User email shipped to PostHog** on every load (`analytics.js`). **Fixed:** identify by
  `user.id` only. ✅

## Human steps — status
| Step | Where | Status |
|---|---|---|
| C1 RLS migration | Supabase SQL editor (`STUDY_GROUPS_RLS_FIX.md`) | ✅ run |
| Rate-limit migration | Supabase (`ASK_RATE_LIMIT.md`) | ✅ run |
| `CRON_SECRET` | Vercel env → redeploy | ✅ set + verified |
| **M4 display-name migration** | Supabase (`STUDY_GROUPS_DISPLAY_NAME_FIX.md`) | ⏳ **TODO** |
| `LOGS_SECRET`/`METRICS_SECRET` | Vercel env (only if the admin monitor is used) | optional |

## Open items / follow-ups
- **M4 migration still to run** (only outstanding required step).
- **Browser-verify the CSP** — click through the live site once and watch the console: confirm
  PostHog, Google Fonts, Supabase realtime group chat, YouTube embeds (video-library), and the
  tesseract OCR page (asked-and-answered) all work. Any block names its origin → one-line
  `vercel.json` fix.
- **SRI on the ~103 gated library essays** — deferred; apply on their next content review (when
  they'll be stamped anyway), or via a dedicated stamp+SRI pass.
- **Optional:** strip the email property from `new-signup.js`'s PostHog `signup_completed`
  event too (a funnel-visibility choice, not a leak — analytics.js already stopped sending it).
- **Rate-limit caveat:** IP-based — stops single-source abuse + runaway loops, not a large
  distributed attack (that needs Cloudflare/WAF). Shared-NAT users share a budget (caps are set
  high enough that this is unlikely to bite).

## Files
- **New:** `lib/ratelimit.js`; `docs/STUDY_GROUPS_RLS_FIX.md`; `docs/ASK_RATE_LIMIT.md`;
  `docs/STUDY_GROUPS_DISPLAY_NAME_FIX.md`; this handoff.
- **Changed:** `vercel.json`; `api/logs.js`, `weekly-email.js`, `push.js`, `new-signup.js`,
  `ask.js`, `debate.js`, `tutor.js`, `devotional.js`, `feedback.js`; `login.html`, `signup.html`
  (+ ~99 non-gated `.html` for SRI); `analytics.js`; `docs/STUDY_GROUPS_SPEC.md` (hardened
  policy + anti-spoof trigger folded into the canonical schema).

## Also this session (non-security)
- **Review PDF** built for the user: all 82 Evidence Library essays + 74 Answers extracted
  (title/prose/footnotes/bibliography/FAQ, no chrome) into one ~575-page HTML → PDF via the
  bundled chromium, grouped by category with a TOC, for offline human/doctrinal review. Build
  script: session scratchpad `build_review_pdf.py` (re-run to regenerate).
- **Trinity tab note:** the early-church/Athanasius argument exists as card #06 + essay
  `library/early_church_trinity.html` + mastery `ev-m-early_church_trinity.html`, but has **no
  Memory Palace room** (Trinity wing has 5 rooms; this isn't one). Offered to build it — not done.
