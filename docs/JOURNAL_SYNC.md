# Conversation Journal — cross-device sync (RUN THIS to activate)

**Why:** the Conversation Journal (`conversation-journal.html`) let a user record real
faith conversations and get AI coaching, but entries were **`localStorage`-only** — so a
user's most personal, hand-written content vanished when they cleared their browser or
switched phone↔laptop. That is the worst kind of retention loss (irreplaceable user
writing, not a regenerable counter).

**Why a dedicated table (not the `user_progress` blob):** journal entries are heavy — long
free text plus a ~900-token AI-coaching block each. `progress-sync.js` pushes *all* progress
in **one row with a 90 KB cap**; folding a growing journal into that blob would eventually
blow the cap and silently kill sync for *everything* (streaks, mastery, decks). So the
journal gets its own table, exactly like Study Plans uses `study_plans_progress`.

**Status:** the client code (`conversation-journal.html`) is deployed and is a **strict
no-op until this migration is run** — until the table exists every request 404s and the
page stays local-only, exactly as before. Run the SQL below in **Supabase → SQL Editor**
to activate.

```sql
-- One row per user; RLS ensures a user can only ever touch THEIR OWN row.
create table if not exists public.journal_entries (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  entries    jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

-- Own-row-only access. Without a valid signed-in JWT, auth.uid() is null and every
-- policy fails closed — the public anon key alone can read/write NOTHING here.
drop policy if exists je_select on public.journal_entries;
drop policy if exists je_insert on public.journal_entries;
drop policy if exists je_update on public.journal_entries;

create policy je_select on public.journal_entries
  for select using (auth.uid() = user_id);
create policy je_insert on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy je_update on public.journal_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- (No delete policy: on-account-delete the row cascades automatically.)
```

## How to verify after running
1. Sign in, record a conversation, save it. Wait a moment (save pushes immediately).
2. In Supabase → Table editor → `journal_entries`, you should see **one row for your user
   id** with an `entries` array holding your entry.
3. Sign in on a **second device/browser**; your entries should appear after the page loads.
4. Security check: signed out (anon key only), `select * from journal_entries` via the REST
   API must return **nothing** — RLS blocks it.

## Design notes (for the next engineer)
- **Local-first with a private cloud mirror.** The page still reads/writes `localStorage`
  (`apologia_journal`) exactly as before, so it works offline and signed-out. When a signed-in
  session + the table are present, it **pulls + merges** on load and **upserts** on every
  save/delete. On any error (offline, table missing, RLS) it silently stays local-only.
- **Merge is union-by-`id`, grow-only.** Entries are immutable once saved (the UI only adds
  or deletes), so the merge unions local + server entries by their millisecond `id`,
  preferring the copy that carries AI `coaching`, and sorts by `date`. Two devices converge
  without losing an entry.
- **Deletions are eventually-consistent (documented caveat).** Like `user_progress`, a delete
  on one device can be resurrected from the server on another device's next pull, because the
  merge is a union. Acceptable for a personal journal; a hard tombstone is a future nicety.
- **Privacy.** Entries can name real people and hold private reflections. The table is
  own-row RLS-only, so the content is visible to that user alone — never to other users and
  never to the anon key. It is not sent anywhere except this per-user private row (and to
  `/api/feedback` at coaching time, which is server-side and not stored).
