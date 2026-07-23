# Cross-device progress sync — Supabase migration (RUN THIS to activate)

**Why:** learning progress (`ad_streak`, `ad_mastery`, challenge/quiz/deck progress) was
**`localStorage`-only** — so it evaporated when a user cleared their browser or switched
phone↔laptop. That was the biggest retention leak in the app (per the 2026-07-23 growth
audit) and made server-side retention unmeasurable. `progress-sync.js` fixes it: one
RLS-protected row per user holds a JSON snapshot of their progress; it pulls+merges on load
and pushes on change.

**Status:** the client code (`progress-sync.js`, wired via `analytics.js`) is deployed and is a
**strict no-op until this migration is run** (every request 404s and the app stays local-only,
exactly as before). Run the SQL below in **Supabase → SQL Editor** to activate.

```sql
-- One row per user; RLS ensures a user can only ever touch THEIR OWN row.
create table if not exists public.user_progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

-- Own-row-only access. Without a valid signed-in JWT, auth.uid() is null and every
-- policy fails closed — the public anon key alone can read/write NOTHING here.
drop policy if exists up_select on public.user_progress;
drop policy if exists up_insert on public.user_progress;
drop policy if exists up_update on public.user_progress;

create policy up_select on public.user_progress
  for select using (auth.uid() = user_id);
create policy up_insert on public.user_progress
  for insert with check (auth.uid() = user_id);
create policy up_update on public.user_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- (No delete policy: on-account-delete the row cascades automatically.)
```

## How to verify after running
1. Sign in on the site, earn a streak / complete a mastery, wait ~10s (or navigate away).
2. In Supabase → Table editor → `user_progress`, you should see **one row for your user id** with a `data` blob.
3. Sign in on a **second device/browser**, and your streak/mastery should appear after load.
4. Security check: with only the anon key (signed out), `select * from user_progress` via the REST API must return **nothing** — RLS blocks it.

## Design notes (for the next engineer)
- **No `localStorage` monkey-patching.** The module snapshots an **allow-list** of progress keys,
  pulls+merges on load, and pushes on a debounce + `pagehide`/visibility-hidden. On any error
  (offline, table missing, RLS) it silently stays local-only.
- **Merge is per-key and monotonic where it matters:** `ad_streak` → the record with the later
  `last` date wins (tie → higher `count`); `ad_mastery` and other `{slug:…}` maps → deep union with
  "once `done`, always `done`"; numeric counters → `max`; history arrays → capped union. Two devices
  converge without losing progress. Last-writer-wins only for opaque scalar flags (harmless).
- **What is NOT synced (by design):** prefs, dismissals, caches, one-off "seen" flags, and
  device-local analytics counters. Edit `KEYS` / `PREFIXES` in `progress-sync.js` to change scope.
- **Retention payoff:** this both (a) stops the self-destructing streak and (b) makes D7/D30 retention
  measurable server-side, and (c) becomes the flagship **Pro "your progress, everywhere"** benefit.
