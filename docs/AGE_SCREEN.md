# Age screen — 2026-10-08 legal/security audit, item 3

**Status: SQL WRITTEN, NOT YET RUN.** The owner runs this in the Supabase SQL editor
(Dashboard → SQL Editor → New query). Until it runs, the site still works: the pages fall
back to the old "Press OK if you are 18+" confirm, and nothing below is enforced.

## What it does

| Age (from the month + year asked at signup) | What happens |
|---|---|
| Under 13 | Signup is refused in the browser. **Nothing is sent or stored.** |
| 13–17 | Account works; **Study Groups are blocked in the database** (create, join, post, check in). |
| 18+ | Everything. |

What is stored, in a table only the server can write (`public.user_age`):

- `age_band`: `13-17` or `18+`.
- `adult_from`: for 13–17 only, the first day of the month the person turns 18, so the group
  block lifts on its own. Adults have no date stored.

Nothing else about age is kept: no birth date, no birth year.

The band is written **once**. It comes from signup (a trigger copies it from the signup
metadata), or for accounts made before this change, from a one-time question on the Study
Groups page. A user cannot change it afterwards through the API: there is no insert/update
grant, and the setter function refuses when a row already exists. To correct a genuine
mistake, edit the row in the dashboard.

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
  age_band   text not null check (age_band in ('13-17', '18+')),
  adult_from date,
  set_at     timestamptz not null default now()
);
alter table public.user_age enable row level security;
drop policy if exists ua_select on public.user_age;
create policy ua_select on public.user_age for select to authenticated using (auth.uid() = user_id);
revoke all on public.user_age from anon, authenticated;
grant select on public.user_age to authenticated;
grant all on public.user_age to service_role;

-- ── 2. Is this user an adult right now?
create or replace function public.is_adult(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.user_age a
    where a.user_id = uid
      and (a.age_band = '18+' or (a.adult_from is not null and a.adult_from <= current_date))
  );
$$;

-- ── 3. Copy the band from signup metadata when the account is created.
--    signup.html sends age_band ('13-17' | '18+') and, for 13-17, adult_from ('YYYY-MM').
create or replace function public.copy_signup_age()
returns trigger language plpgsql security definer set search_path = public as $$
declare band text := new.raw_user_meta_data->>'age_band';
        af   text := new.raw_user_meta_data->>'adult_from';
begin
  if band in ('13-17', '18+') then
    insert into public.user_age(user_id, age_band, adult_from)
    values (new.id, band,
            case when band = '13-17' and af ~ '^\d{4}-\d{2}$' then (af || '-01')::date end)
    on conflict (user_id) do nothing;
  end if;
  return new;
end; $$;
drop trigger if exists trg_copy_signup_age on auth.users;
create trigger trg_copy_signup_age after insert on auth.users
  for each row execute function public.copy_signup_age();

-- ── 4. One-time setter for accounts made before this change.
--    Returns '18+', '13-17', or 'under_13' (under-13: NOTHING is stored).
--    If a band already exists it is returned unchanged.
create or replace function public.set_my_age(birth_year int, birth_month int)
returns text language plpgsql security definer set search_path = public as $$
declare existing text; turns18 date; age_years int;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select age_band into existing from public.user_age where user_id = auth.uid();
  if existing is not null then return existing; end if;
  if birth_month not between 1 and 12 or birth_year not between 1900 and extract(year from current_date)::int then
    raise exception 'bad date';
  end if;
  -- whole years, counting a birthday month as already reached (errs toward "older" by < 1 month)
  age_years := extract(year from current_date)::int - birth_year
               - case when extract(month from current_date)::int < birth_month then 1 else 0 end;
  if age_years < 13 then return 'under_13'; end if;
  if age_years >= 18 then
    insert into public.user_age(user_id, age_band) values (auth.uid(), '18+');
    return '18+';
  end if;
  turns18 := make_date(birth_year + 18, birth_month, 1);
  insert into public.user_age(user_id, age_band, adult_from) values (auth.uid(), '13-17', turns18);
  return '13-17';
end; $$;
revoke all on function public.set_my_age(int, int) from public, anon;
grant execute on function public.set_my_age(int, int) to authenticated;

-- ── 5. Enforce 18+ on every Study Groups write.
drop policy if exists groups_insert on public.groups;
create policy groups_insert on public.groups for insert
  with check (auth.uid() = created_by and public.is_adult(auth.uid()));

drop policy if exists gm_insert on public.group_members;
create policy gm_insert on public.group_members for insert
  with check (
    user_id = auth.uid()
    and public.is_adult(auth.uid())
    and (
      (role = 'host'   and public.is_group_creator(group_id, auth.uid()))
      or (role = 'member' and public.is_group_public(group_id))
    )
  );

drop policy if exists gmsg_insert on public.group_messages;
create policy gmsg_insert on public.group_messages for insert
  with check (user_id = auth.uid() and public.is_adult(auth.uid()) and public.is_group_member(group_id, auth.uid()));

drop policy if exists gact_insert on public.group_activity;
create policy gact_insert on public.group_activity for insert
  with check (user_id = auth.uid() and public.is_adult(auth.uid()) and public.is_group_member(group_id, auth.uid()));

-- The invite-link path (join.html) goes through this security-definer RPC, which
-- bypasses the policies above — so it checks too.
create or replace function public.join_group_by_code(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare gid uuid; dname text;
begin
  if not public.is_adult(auth.uid()) then raise exception 'adults_only'; end if;
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

> ⚠ **Existing members are blocked from posting until they answer the one-time age question.**
> The Study Groups page asks it as soon as it opens, so this is one tap for adults. Expected,
> not a bug.
>
> ⚠ The `join_group_by_code` body above is the one from `docs/STUDY_GROUPS_SPEC.md` plus the
> first `if` line. If the live function has been changed since, compare it first
> (`select pg_get_functiondef('public.join_group_by_code(text)'::regprocedure);`).

## Step 2 — check it worked

```sql
-- table + RLS
select relrowsecurity from pg_class where relname = 'user_age';            -- true
-- the four insert policies now mention is_adult
select tablename, policyname, with_check from pg_policies
where schemaname = 'public' and policyname in ('groups_insert','gm_insert','gmsg_insert','gact_insert');
-- anon/authenticated cannot write the table
select grantee, privilege_type from information_schema.role_table_grants
where table_name = 'user_age' and grantee in ('anon','authenticated');     -- only authenticated / SELECT
```

Then, in the site: sign in → **Study Groups** → answer the age question once → open a group
and post a message. It should work. (A 13–17 test account should see the "for adults" note
and be unable to join.)

## Afterwards

Replace "NOT YET RUN" above with the date you ran it.
