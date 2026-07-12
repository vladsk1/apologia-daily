# Study Groups — display-name spoofing fix (M4, run once)

> **Status: human step (you).** Run the SQL in the Supabase SQL editor.
> Idempotent, **no front-end deploy needed** (backward-compatible — the client
> keeps sending a name; the database now ignores it and stamps the real one).

## The issue (M4, medium)

`group_members`, `group_messages`, and `group_activity` all take a
`display_name` **from the browser**. RLS constrains `user_id = auth.uid()` but
never constrains `display_name`, so a member can post a chat message, appear in
the roster, or log activity under **any name** — e.g. impersonate the host or
another member. It's rendered through `esc()`, so this is impersonation /
social-engineering, **not** XSS. Still worth closing before real groups form.

## The fix

A `BEFORE INSERT` trigger on all three tables overwrites `display_name` with the
inserting user's real name from `auth.users` (their `full_name`, falling back to
the local part of their email, then `'Member'`). Whatever the client sends is
discarded, so the stored/broadcast name is always authentic.

```sql
create or replace function public.set_member_display_name()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select coalesce(
           nullif(u.raw_user_meta_data->>'full_name', ''),
           nullif(split_part(u.email, '@', 1), ''),
           'Member')
    into new.display_name
    from auth.users u
    where u.id = new.user_id;
  if new.display_name is null then new.display_name := 'Member'; end if;
  return new;
end; $$;

drop trigger if exists trg_gm_dname   on public.group_members;
drop trigger if exists trg_gmsg_dname on public.group_messages;
drop trigger if exists trg_gact_dname on public.group_activity;

create trigger trg_gm_dname   before insert on public.group_members
  for each row execute function public.set_member_display_name();
create trigger trg_gmsg_dname before insert on public.group_messages
  for each row execute function public.set_member_display_name();
create trigger trg_gact_dname before insert on public.group_activity
  for each row execute function public.set_member_display_name();
```

Because insert RLS already forces `user_id = auth.uid()`, `new.user_id` is always
the authenticated caller, so the trigger stamps *their* name — no way to forge
someone else's. The existing `join_group_by_code` RPC inserts pass through the
same trigger, so names stay consistent there too.

## Verify

After applying, in the app: post a chat message — it should appear under your
real name even if you tamper with the client. Or in SQL, confirm the triggers
exist:

```sql
select tgname, tgrelid::regclass as table_name
from pg_trigger
where tgname in ('trg_gm_dname','trg_gmsg_dname','trg_gact_dname');
-- expect 3 rows
```
