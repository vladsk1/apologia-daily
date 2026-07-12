# Study Groups — RLS privilege-escalation fix (run once)

> **Status: human step (you).** Run the SQL below in the Supabase SQL editor,
> same as the original Study Groups migration. It is **idempotent** and safe to
> re-run. **No front-end deploy is needed** — the fix is backward-compatible with
> the current `study-groups.html` (group creation, public join, and invite-code
> join all keep working unchanged).

## The vulnerability (C1, critical)

The original `group_members` insert policy was:

```sql
create policy gm_insert on public.group_members for insert
  with check (user_id = auth.uid());
```

The only constraint was "the row is about me." It did **not** constrain `role`
and did **not** require the group be public or that the caller hold a valid
invite. So any authenticated user could, straight from the browser anon client:

- **Join any private/invite-only group** by inserting their own `member` row for
  any `group_id` they could learn (public UUIDs are freely selectable; private
  UUIDs leak via invite/share links or `?open=<gid>`). Once the row exists,
  `is_group_member()` is true → they can **read the group's entire private chat**.
- **Self-assign `host`**: `insert({group_id, user_id: me, role: 'host'})` passed
  the check, unlocking `groups_update` (rename / re-key / flip privacy) and
  `gm_delete` (**kick every other member, including the real host**). A normal
  member could promote themselves the same way.

That collapses the whole group access model — confidentiality, integrity, and
availability — for any logged-in user.

## The fix

Two `security definer` helpers (they bypass RLS the same way `is_group_member`
already does, so the checks work even for invite-only groups the caller can't yet
`SELECT`), plus a hardened insert policy:

- inserting a **`host`** row is allowed **only** for the group's `created_by`
  (i.e. the creator bootstrapping their own host membership at create time);
- inserting a **`member`** row is allowed **only** for **public** groups;
- private groups can therefore only be joined through the existing
  `join_group_by_code` RPC (`security definer`) — *knowing the code is the
  permission*, exactly as intended;
- `user_id = auth.uid()` still holds, so you can only ever insert your **own**
  membership (no adding other users);
- there is deliberately **no UPDATE policy** on `group_members`, so RLS denies all
  updates — a member cannot flip their own `role` to `host` after the fact.

```sql
-- ========== C1 FIX: harden group_members insert ==========

-- security-definer helpers (bypass RLS, like is_group_member) so the policy can
-- read groups.created_by / groups.privacy even for invite-only groups.
create or replace function public.is_group_creator(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.groups g where g.id = gid and g.created_by = uid);
$$;

create or replace function public.is_group_public(gid uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.groups g where g.id = gid and g.privacy = 'public');
$$;

-- replace the over-permissive insert policy
drop policy if exists gm_insert on public.group_members;
create policy gm_insert on public.group_members for insert
  with check (
    user_id = auth.uid()
    and (
      -- creator bootstrapping their own host row at create time
      (role = 'host'   and public.is_group_creator(group_id, auth.uid()))
      -- anyone joining a PUBLIC group as a member (private = RPC only)
      or (role = 'member' and public.is_group_public(group_id))
    )
  );
```

## Verify it worked

Run these in the SQL editor after applying the fix.

```sql
-- 1) The policy is in place:
select polname, pg_get_expr(polwithcheck, polrelid) as with_check
from pg_policy
where polrelid = 'public.group_members'::regclass and polname = 'gm_insert';

-- 2) There is NO update policy on group_members (role can't be escalated):
select count(*) as update_policies
from pg_policy
where polrelid = 'public.group_members'::regclass and polcmd = 'w';  -- expect 0
```

Manual end-to-end check (two accounts, in the app):
- Account A creates an **invite-only** group → A is host, sees the group. ✅
- Account B, **not** invited, tries to open it / cannot read its chat. ✅
- B can still join a **public** group and join A's group via the **invite link**. ✅
- Neither B nor any member can become host of a group they didn't create.

## Not covered here (follow-ups)
- **M1 · display_name spoofing** — `group_messages` / `group_activity` still let
  the client choose `display_name`, so a member can post under any name. It's
  rendered through `esc()` (no XSS) — this is impersonation only. Fix later by
  populating `display_name` from `auth.users` in a `security definer` trigger and
  dropping it from client-supplied inserts.
- **groups_update** has no `WITH CHECK` (host-only via `USING`); a host could in
  principle rewrite `created_by`. It's their own group, so this is low-risk
  hardening, not a boundary — can add a `WITH CHECK` later if desired.
