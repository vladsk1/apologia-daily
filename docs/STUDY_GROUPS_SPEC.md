# Study Groups — real backend spec

Study Groups is a first-class, **for-everyone** community feature: anyone can start or
join a group (friends, family, a couple, a campus fellowship, a church small group, an
online group, or just an accountability pair) and study the faith together — a shared
Study Plan, realtime discussion (General / Plan / Prayer), a working invite link, and a
weekly "who showed up" activity rollup that turns the solo `/today` loop into a team loop.

**Not** leader-centric. The person who creates a group is just the **host**; everyone is an
equal participant. Roles exist only so the host can assign the group's plan and manage the
group — they are not a hierarchy.

## Status

- Front end: **live** (`study-groups.html` + `join.html`), written against the real tables
  below. Until the migration runs, the page degrades gracefully to a "being set up" notice
  instead of showing fake data.
- Backend: **migration below is a human step (you).** Run it in the Supabase SQL editor.
  Nothing goes live for real groups until it's run — same situation as `ask_rate_limit`.

## Migration (run once, in the Supabase SQL editor)

```sql
-- ========== TABLES ==========
create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text default '',
  icon        text default '👥',
  kind        text default 'friends',      -- friends|family|couple|skeptic|campus|church|online|pair
  privacy     text not null default 'invite', -- public|invite
  plan        text,                         -- study-plan id (nullable)
  plan_day    int  not null default 1,
  join_code   text not null unique,         -- short code used by /join?g=<code>
  created_by  uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.group_members (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.groups(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  display_name text default 'Member',
  role         text not null default 'member', -- host|member
  joined_at    timestamptz not null default now(),
  unique (group_id, user_id)
);
create index if not exists group_members_user_idx  on public.group_members(user_id);
create index if not exists group_members_group_idx on public.group_members(group_id);

create table if not exists public.group_messages (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.groups(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  display_name text default 'Member',
  channel      text not null default 'general', -- general|plan|prayer
  body         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists group_messages_group_idx on public.group_messages(group_id, channel, created_at);

-- one lightweight "I showed up" ping per member per day (progress rollup, no full sync)
create table if not exists public.group_activity (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.groups(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  display_name text default 'Member',
  kind         text not null default 'today',  -- today|plan_day
  detail       text default '',
  day          date not null default current_date,
  created_at   timestamptz not null default now(),
  unique (group_id, user_id, day, kind)
);
create index if not exists group_activity_group_idx on public.group_activity(group_id, day);

-- ========== HELPERS (security definer — avoid RLS recursion) ==========
create or replace function public.is_group_member(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.group_members m where m.group_id = gid and m.user_id = uid);
$$;

create or replace function public.is_group_host(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.group_members m
                where m.group_id = gid and m.user_id = uid and m.role = 'host');
$$;

-- used by the hardened gm_insert policy (bypass RLS so the check can read
-- groups.created_by / groups.privacy even for not-yet-visible invite-only groups)
create or replace function public.is_group_creator(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.groups g where g.id = gid and g.created_by = uid);
$$;

create or replace function public.is_group_public(gid uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.groups g where g.id = gid and g.privacy = 'public');
$$;

-- join (or public-browse join) by code, bypassing RLS on the lookup
create or replace function public.join_group_by_code(code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare gid uuid; dname text;
begin
  select id into gid from public.groups where join_code = code;
  if gid is null then return null; end if;
  select coalesce(raw_user_meta_data->>'full_name', 'Member') into dname
    from auth.users where id = auth.uid();
  insert into public.group_members(group_id, user_id, display_name, role)
    values (gid, auth.uid(), dname, 'member')
    on conflict (group_id, user_id) do nothing;
  return gid;
end; $$;

-- ========== RLS ==========
alter table public.groups         enable row level security;
alter table public.group_members  enable row level security;
alter table public.group_messages enable row level security;
alter table public.group_activity enable row level security;

-- groups: public groups are discoverable; members always see their groups
create policy groups_select on public.groups for select
  using (privacy = 'public' or public.is_group_member(id, auth.uid()));
create policy groups_insert on public.groups for insert
  with check (auth.uid() = created_by);
create policy groups_update on public.groups for update
  using (public.is_group_host(id, auth.uid()));
create policy groups_delete on public.groups for delete
  using (auth.uid() = created_by);

-- group_members: members see their group's roster; a user manages their own membership.
-- INSERT is hardened (see docs/STUDY_GROUPS_RLS_FIX.md): you may insert a `host` row
-- only for a group you created, and a `member` row only into a PUBLIC group. Private
-- groups are joined only via the join_group_by_code RPC. No UPDATE policy exists, so
-- RLS denies all updates — a member cannot escalate their own role to host.
create policy gm_select on public.group_members for select
  using (public.is_group_member(group_id, auth.uid()));
create policy gm_insert on public.group_members for insert
  with check (
    user_id = auth.uid()
    and (
      (role = 'host'   and public.is_group_creator(group_id, auth.uid()))
      or (role = 'member' and public.is_group_public(group_id))
    )
  );
create policy gm_delete on public.group_members for delete
  using (user_id = auth.uid() or public.is_group_host(group_id, auth.uid()));

-- messages: members read + post (as themselves)
create policy gmsg_select on public.group_messages for select
  using (public.is_group_member(group_id, auth.uid()));
create policy gmsg_insert on public.group_messages for insert
  with check (user_id = auth.uid() and public.is_group_member(group_id, auth.uid()));

-- activity: members read + ping (as themselves)
create policy gact_select on public.group_activity for select
  using (public.is_group_member(group_id, auth.uid()));
create policy gact_insert on public.group_activity for insert
  with check (user_id = auth.uid() and public.is_group_member(group_id, auth.uid()));

-- ========== REALTIME ==========
alter publication supabase_realtime add table public.group_messages;
alter publication supabase_realtime add table public.group_activity;
```

### Notes / design decisions
- **RLS recursion** is avoided by routing every membership check through the
  `security definer` helper `is_group_member` (a policy on `group_members` that queried
  `group_members` directly would recurse).
- **Invite groups** are not publicly `SELECT`-able, so joining by code goes through the
  `join_group_by_code` RPC (security definer) — knowing the code is the permission.
- **Progress rollup is intentionally lightweight**: a member taps "I studied today" which
  writes one `group_activity` row per day (localStorage progress is never force-synced to
  the server). The group view shows "N of M active this week" from those pings.
- **Host** is set on the creator's own membership row at create time (role `host`); it only
  gates plan-assign + manage, never participation.

## Follow-ups (after the migration)
- Verify create → invite link → join → chat on two accounts.
- Optional later: email/notification on new group activity; group result share-card;
  soft "nudge a member who's fallen behind"; realtime presence dots.
