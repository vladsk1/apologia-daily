# Age screen — 2026-10-08 legal/security audit, item 3

**Status: SQL WRITTEN, NOT YET RUN.** The owner runs this in the Supabase SQL editor
(Dashboard → SQL Editor → New query). Until it runs, the site still works: the pages fall
back to the old "Press OK if you are 18+" confirm, and nothing below is enforced.

## What it does

| Age (from the month + year asked at signup) | What happens |
|---|---|
| Under 13 | Signup is refused in the browser. **Nothing is sent or stored.** |
| 13–17 | Account works; **Study Groups are blocked in the database**: no reading, posting, joining, creating or checking in. |
| 18+ | Everything. |

What is stored, in a table only the server can write (`public.user_age`):

- **Adults:** `age_band = '18+'`, nothing else. Signup also leaves `age_band: "18+"` in the
  account profile (`auth.users.raw_user_meta_data`); no date goes there.
- **13–17:** signup sends nothing about age. The first time they open Study Groups they are
  asked month + year once, and the table keeps `age_band = '13-17'` plus `adult_from`, the
  first day of the month they turn 18. ⚠ **That date is equivalent to their birth month and
  year**, and the privacy policy says so. The weekly cron (`api/weekly-email.js`) turns the
  row into a plain `18+` and clears the date once it has passed.
- **Under 13 on an existing account:** a row `age_band = 'under_13'` so the answer cannot be
  retried with a different year, and the weekly cron deletes the account once the row is 7
  days old (privacy.html §9).

The band is written **once** (by the signup trigger or by the one-time question). A user
cannot change it through the API: there is no insert/update grant, and the setter returns the
existing row. To correct a genuine mistake, edit or delete the row in the dashboard.

> ⚠ Honesty check: this is a **neutral age screen**, not age verification. Someone can type
> a false year. The point is that the site asks neutrally (it does not hint at the "right"
> answer), refuses under-13s, and enforces the 18+ rule where it can't be bypassed from the
> browser.

## Step 1 — the SQL (idempotent: safe to run twice)

```sql
begin;

-- ── 1. Where the band lives. Server-written only.
create table if not exists public.user_age (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  age_band   text not null check (age_band in ('under_13', '13-17', '18+')),
  adult_from date,
  set_at     timestamptz not null default now()
);
alter table public.user_age enable row level security;
drop policy if exists ua_select on public.user_age;
create policy ua_select on public.user_age for select to authenticated using (auth.uid() = user_id);
revoke all on public.user_age from anon, authenticated;
grant select on public.user_age to authenticated;
grant all on public.user_age to service_role;

-- ── 2. Is the CALLER an adult right now? (No argument, so nobody can ask about someone else.)
drop function if exists public.is_adult(uuid);
create or replace function public.is_adult()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.user_age a
    where a.user_id = auth.uid()
      and (a.age_band = '18+' or (a.age_band = '13-17' and a.adult_from <= current_date))
  );
$$;
revoke all on function public.is_adult() from public, anon;
grant execute on function public.is_adult() to authenticated;

-- ── 3. Signup: copy an adult band from the signup metadata. Only '18+' is ever sent
--    (13-17 are asked later), and this can NEVER make account creation fail.
create or replace function public.copy_signup_age()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  begin
    if new.raw_user_meta_data->>'age_band' = '18+' then
      insert into public.user_age(user_id, age_band) values (new.id, '18+')
      on conflict (user_id) do nothing;
    end if;
  exception when others then null;   -- an age problem must never block a signup
  end;
  return new;
end; $$;
drop trigger if exists trg_copy_signup_age on auth.users;
create trigger trg_copy_signup_age after insert on auth.users
  for each row execute function public.copy_signup_age();

-- ── 4. One-time question (Study Groups page). Returns '18+', '13-17' or 'under_13'.
--    If a row already exists, its band is returned unchanged.
create or replace function public.set_my_age(birth_year int, birth_month int)
returns text language plpgsql security definer set search_path = public as $$
declare existing text; age_years int; band text; af date;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select age_band into existing from public.user_age where user_id = auth.uid();
  if existing is not null then return existing; end if;
  if birth_year is null or birth_month is null
     or birth_month not between 1 and 12
     or birth_year not between 1900 and extract(year from current_date)::int then
    raise exception 'bad date';
  end if;
  -- whole years, counting the birth month as the birthday (errs older by < 1 month)
  age_years := extract(year from current_date)::int - birth_year
               - case when extract(month from current_date)::int < birth_month then 1 else 0 end;
  if age_years < 13 then band := 'under_13';
  elsif age_years >= 18 then band := '18+';
  else band := '13-17'; af := make_date(birth_year + 18, birth_month, 1);
  end if;
  insert into public.user_age(user_id, age_band, adult_from) values (auth.uid(), band, af)
  on conflict (user_id) do nothing;
  select age_band into band from public.user_age where user_id = auth.uid();
  return band;
end; $$;
revoke all on function public.set_my_age(int, int) from public, anon;
grant execute on function public.set_my_age(int, int) to authenticated;

-- ── 5. Enforce 18+ on every Study Groups read AND write.
drop policy if exists groups_insert on public.groups;
create policy groups_insert on public.groups for insert
  with check (auth.uid() = created_by and public.is_adult());

drop policy if exists gm_select on public.group_members;
create policy gm_select on public.group_members for select
  using (public.is_adult() and public.is_group_member(group_id, auth.uid()));

drop policy if exists gm_insert on public.group_members;
create policy gm_insert on public.group_members for insert
  with check (
    user_id = auth.uid()
    and public.is_adult()
    and (
      (role = 'host'   and public.is_group_creator(group_id, auth.uid()))
      or (role = 'member' and public.is_group_public(group_id))
    )
  );

drop policy if exists gmsg_select on public.group_messages;
create policy gmsg_select on public.group_messages for select
  using (public.is_adult() and public.is_group_member(group_id, auth.uid()));
drop policy if exists gmsg_insert on public.group_messages;
create policy gmsg_insert on public.group_messages for insert
  with check (user_id = auth.uid() and public.is_adult() and public.is_group_member(group_id, auth.uid()));

drop policy if exists gact_select on public.group_activity;
create policy gact_select on public.group_activity for select
  using (public.is_adult() and public.is_group_member(group_id, auth.uid()));
drop policy if exists gact_insert on public.group_activity;
create policy gact_insert on public.group_activity for insert
  with check (user_id = auth.uid() and public.is_adult() and public.is_group_member(group_id, auth.uid()));

-- The invite-link path (join.html) goes through this security-definer RPC, which
-- bypasses the policies above — so it checks too.
create or replace function public.join_group_by_code(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare gid uuid; dname text;
begin
  if not public.is_adult() then raise exception 'adults_only'; end if;
  select id into gid from public.groups where join_code = code;
  if gid is null then return null; end if;
  select coalesce(raw_user_meta_data->>'full_name', 'Member') into dname
    from auth.users where id = auth.uid();
  insert into public.group_members(group_id, user_id, display_name, role)
    values (gid, auth.uid(), dname, 'member')
    on conflict (group_id, user_id) do nothing;
  return gid;
end; $$;

commit;
```

> ⚠ **Every existing member must answer the one-time question before their groups show
> again.** The Study Groups page asks it when it opens, so for adults this is one tap. Until
> they answer, the group list and chat read as empty. Expected, not a bug.
>
> ⚠ `groups_select` (public groups are discoverable; members see their own) is left as it
> is: group names and descriptions are not chat, and every group is invite-only now. A
> minor who is still listed as a member sees their group's name but no members, messages or
> check-ins.
>
> ⚠ The `join_group_by_code` body above is the one from `docs/STUDY_GROUPS_SPEC.md` plus the
> first `if` line. If the live function has been changed since, compare it first
> (`select pg_get_functiondef('public.join_group_by_code(text)'::regprocedure);`).

## Step 2 — check it worked

```sql
-- table + RLS
select relrowsecurity from pg_class where relname = 'user_age';            -- true
-- the policies now mention is_adult
select tablename, policyname, qual, with_check from pg_policies
where schemaname = 'public' and policyname in
  ('groups_insert','gm_select','gm_insert','gmsg_select','gmsg_insert','gact_select','gact_insert');
-- anon/authenticated cannot write the table
select grantee, privilege_type from information_schema.role_table_grants
where table_name = 'user_age' and grantee in ('anon','authenticated');     -- only authenticated / SELECT
```

Then, in the site: sign in → **Study Groups** → answer the age question once → open a group
and post a message. It should work. (A 13–17 test account should see the "for adults" note
and be unable to join.)

## Afterwards

Replace "NOT YET RUN" above with the date you ran it.
