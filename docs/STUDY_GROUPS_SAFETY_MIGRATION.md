# Study Groups safety migration (2026-09-30)

**Status: RUN 2026-09-30 by the owner via Claude in Chrome in the Supabase SQL Editor ("Success. No rows returned").** The two verify queries below were reported by Claude in Chrome as passing (invite-only constraint + `gmsg_delete` policy in place) but were not independently seen from a session. The site code only ever inserts `privacy = 'invite'` (`study-groups.html`), so nothing in the app conflicts with the new constraint. Still owed: the throwaway-account test of Delete / Report / Remove.

## Why

The 2026-09-30 critical review (`docs/SITE_CRITICAL_REVIEW_2026-09-30.md`, top-10 #1) found three problems with Study Groups:
- It was open chat between strangers.
- Public groups were listed for anyone to join.
- Accounts are allowed from age 13, and there was no report, remove or delete control.

## What already shipped in the site code (works without this SQL)

- Public-group browsing and public-group creation were removed from `study-groups.html`. A non-member can no longer join a group from the page, only by invite link (`join.html` → `join_group_by_code`).
- There is an adults-only (18+) confirmation before creating or joining a group, plus a notice on the page and in `terms.html` / `privacy.html`.
- **Report** is on every message from someone else. It opens an email to contact@apologiadaily.com with the group, message and author ids and the message text.
- **Remove** is on each member, for the host. This works now, because the existing `gm_delete` policy already lets a host delete member rows.
- **Delete** is on messages, for the author or the host. **This only works after the SQL below runs.** Until then it shows "Could not delete the message yet. Please use Report and we will remove it."

## What this SQL does

1. Turns every existing public group into an invite-only group, so strangers can no longer discover or join it through the database API.
2. Stops new public groups at the database level. The client no longer offers the option, but the API would still have accepted it.
3. Lets a message's author, or the group's host, delete it.

```sql
-- 1) Existing public groups become invite-only.
update public.groups set privacy = 'invite' where privacy = 'public';

-- 2) No new public groups (defence in depth; the UI no longer offers it).
alter table public.groups drop constraint if exists groups_privacy_invite_only;
alter table public.groups add constraint groups_privacy_invite_only check (privacy = 'invite');

-- 3) Author or host may delete a message.
drop policy if exists gmsg_delete on public.group_messages;
create policy gmsg_delete on public.group_messages for delete
  using (user_id = auth.uid() or public.is_group_host(group_id, auth.uid()));
grant delete on public.group_messages to authenticated;
```

## Verify after running

```sql
select count(*) as public_groups from public.groups where privacy = 'public';   -- expect 0
select polname from pg_policy where polrelid = 'public.group_messages'::regclass; -- includes gmsg_delete
```

Then, with a throwaway account, post a message in a group you host and press **Delete**. It should disappear.

## Still open (not done here)

- There is no in-app review queue for reports. Reports arrive by email, and removal is manual. Delete the row in the Supabase table editor, or ask the group's host to delete it.
- Age is self-declared. There is no verification.
- Other members see a deleted message disappear only when they reload. The realtime channel listens for INSERT only.
