# Supabase RLS hardening — 2026-10-08 security audit, items 1–4

**Status: RUN by the owner, reported 2026-10-09 ("checked and it worked"; owner-reported, not independently verified from a session). Whether the optional Step 4 cleanup was run was not stated.** The owner runs this in the Supabase SQL editor
(Dashboard → SQL Editor → New query). Nothing here has been applied to the live database
from a session — a session cannot reach it. Run **Step 1 first** and keep its output: it
tells you what the live database actually looks like before anything changes.

## Why this exists

A read-only audit (2026-10-08) found five tables with **no row-level-security setup
anywhere in the repo**:

| Table | Who touches it | Risk if RLS is off |
|---|---|---|
| `push_subscriptions` | server only (`api/push.js`, service-role key) | 🔴 anyone holding the public anon key (it is in every page) can read every subscriber's push endpoint + keys, send them notifications, or delete/insert rows |
| `flashcards` | browser, own rows (`today.html`, `dashboard.html`) | 🟠 one user could read or edit another user's cards |
| `study_plans_progress` | browser, own row (`study-plans.html`) | 🟠 same |
| `explain_sessions` | browser inserts own rows (`explain-it-back.html`) — stores the user's own written explanation | 🟠 one user could read another's free-text explanations |
| `daily_arguments` | browser reads (`today.html`); shared content | 🟡 an anon write policy would let anyone edit the daily content |

These tables may already be protected — they could have been set up in the dashboard,
where the repo cannot see it. Step 1 answers that.

## Step 1 — check what is live (read-only, changes nothing)

```sql
-- 1a. Every table in the public schema, and whether RLS is on.
--     Every row should say rls_enabled = true.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relrowsecurity, c.relname;

-- 1b. Every policy on those tables. Look for anything granting anon write access,
--     or "using (true)" on a table that holds user data.
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public'
order by tablename, policyname;

-- 1c. What the two public API roles are granted on each table.
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
group by table_name, grantee order by table_name, grantee;
```

**Also, from any terminal** (uses only the public anon key, which is already on every page;
replace `ANON_KEY` with the key from `login.html`):

```bash
curl -s "https://noprgxkwniouukmrfozc.supabase.co/rest/v1/push_subscriptions?select=endpoint&limit=1" \
  -H "apikey: ANON_KEY" -H "Authorization: Bearer ANON_KEY"
```

`[]` or a permission error = safe. **Any row returned = live exposure — run Step 2 now.**

## Step 2 — the fix (idempotent: safe to run more than once, safe if already protected)

It changes **access rules only**. It does not create, drop or alter any column, and it does
not delete data. The column names in the policies are the ones the site's code already uses
(`user_id`; `day_number` for `daily_arguments`).

```sql
begin;

-- ── push_subscriptions: server-only. The browser never touches it (api/push.js uses the
--    service-role key, which bypasses RLS). RLS on + NO policies = anon/authenticated see nothing.
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;
grant  all on public.push_subscriptions to service_role;

-- ── flashcards: each signed-in user reads and writes only their own cards.
alter table public.flashcards enable row level security;
drop policy if exists fc_select on public.flashcards;
drop policy if exists fc_insert on public.flashcards;
drop policy if exists fc_update on public.flashcards;
drop policy if exists fc_delete on public.flashcards;
create policy fc_select on public.flashcards for select to authenticated using (auth.uid() = user_id);
create policy fc_insert on public.flashcards for insert to authenticated with check (auth.uid() = user_id);
create policy fc_update on public.flashcards for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy fc_delete on public.flashcards for delete to authenticated using (auth.uid() = user_id);
revoke all on public.flashcards from anon;
grant select, insert, update, delete on public.flashcards to authenticated;
grant all on public.flashcards to service_role;

-- ── study_plans_progress: one row per user, written with upsert (needs insert + update).
alter table public.study_plans_progress enable row level security;
drop policy if exists spp_select on public.study_plans_progress;
drop policy if exists spp_insert on public.study_plans_progress;
drop policy if exists spp_update on public.study_plans_progress;
create policy spp_select on public.study_plans_progress for select to authenticated using (auth.uid() = user_id);
create policy spp_insert on public.study_plans_progress for insert to authenticated with check (auth.uid() = user_id);
create policy spp_update on public.study_plans_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
revoke all on public.study_plans_progress from anon;
grant select, insert, update on public.study_plans_progress to authenticated;
grant all on public.study_plans_progress to service_role;

-- ── explain_sessions: the browser only inserts its own row; reading is for the user's own rows.
--    The weekly email and the metrics page read it with the service-role key (bypasses RLS).
alter table public.explain_sessions enable row level security;
drop policy if exists es_select on public.explain_sessions;
drop policy if exists es_insert on public.explain_sessions;
create policy es_select on public.explain_sessions for select to authenticated using (auth.uid() = user_id);
create policy es_insert on public.explain_sessions for insert to authenticated with check (auth.uid() = user_id);
revoke all on public.explain_sessions from anon;
grant select, insert on public.explain_sessions to authenticated;
grant all on public.explain_sessions to service_role;

-- ── daily_arguments: shared, public, READ-ONLY content. Anyone may read; nobody writes
--    through the API (edit it in the dashboard, which uses the service role).
alter table public.daily_arguments enable row level security;
drop policy if exists da_read on public.daily_arguments;
create policy da_read on public.daily_arguments for select to anon, authenticated using (true);
revoke insert, update, delete, truncate on public.daily_arguments from anon, authenticated;
grant select on public.daily_arguments to anon, authenticated;
grant all on public.daily_arguments to service_role;

-- ── coach_signals: already has RLS + an own-row policy (coach.js). Add the explicit grants
--    Supabase stops creating automatically for new tables from 2026-10-30.
revoke all on public.coach_signals from anon;
grant select, insert, update, delete on public.coach_signals to authenticated;
grant all on public.coach_signals to service_role;

commit;
```

> ⚠ **If a statement errors with "relation does not exist"**, that table was never created
> on this project — the whole transaction rolls back, nothing is half-applied. Delete that
> table's block and run it again.
>
> ⚠ **If you already had your own policies on these tables** (Step 1b shows them under
> different names), they stay in place — `drop policy if exists` only removes the names
> above. Policies are OR-ed, so an older, broader policy would still let rows through.
> Compare against Step 1b and drop any that grant more than own-row access.

## Step 3 — check it worked

1. Re-run **Step 1a**: all five tables should show `rls_enabled = true`.
2. Re-run the **curl** above: it must return `[]` or a permission error.
3. In the site, signed in: open **Today** (flashcard review), **Study Plans** (tick a day,
   reload), and **Explain It Back** (submit once). All three should still work. If one fails,
   the browser console will show a `403` / "new row violates row-level security policy" —
   send me the message.

## Step 4 (optional) — clear old Explain It Back text

Since 2026-10-08 Explain It Back stores only the score (`explain-it-back.html`); the
written explanation and AI feedback are no longer saved. Rows from before that date
still hold the text. To clear it (keeps the scores):

```sql
update public.explain_sessions set user_explanation = null, ai_feedback = null
where user_explanation is not null or ai_feedback is not null;
```

If this errors with "null value violates not-null constraint", run
`alter table public.explain_sessions alter column user_explanation drop not null, alter column ai_feedback drop not null;`
first — and note new inserts would already be failing in that case (the page now omits
both columns), so check Explain It Back still saves a score after Step 2.

## Afterwards

- Note the date you ran it at the top of this file (replace "NOT YET RUN").
- `tests/security.test.mjs` now fails if any `create table` in the repo's setup SQL is not
  followed by `enable row level security` for the same table, so a new table can't ship
  without it.
