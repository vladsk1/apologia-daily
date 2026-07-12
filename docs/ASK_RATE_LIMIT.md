# AI rate limit — `bump_ask_rate` migration (run once)

> **Status: human step (you).** Run the SQL in the Supabase SQL editor, same as
> the other migrations. It is **idempotent**. Until it runs, the Claude-calling
> endpoints still throttle via a per-instance in-memory fallback (best-effort),
> but the durable, cross-instance cap only kicks in once this is applied.

## Why

`api/ask.js`, `debate.js`, `tutor.js`, `devotional.js`, and `feedback.js` all call
the Anthropic API. Without a cap, wildcard-CORS + no-auth means anyone can script
them into an unmetered LLM proxy on your bill (wallet-DoS). All five now call a
shared limiter (`lib/ratelimit.js`) that counts requests per IP per day in the
`ask_rate` table via the `bump_ask_rate` RPC and returns HTTP 429 over the cap.

Per-endpoint daily caps (generous for humans, ruinous for bots):
`ask` 40 · `debate` 150 · `tutor` 80 · `devotional` 60 · `feedback` 80 — each a
separate per-IP budget.

## Migration

```sql
create table if not exists public.ask_rate (
  ip  text not null,
  day date not null default current_date,
  n   int  not null default 0,
  primary key (ip, day)
);

-- Only the service role (which bypasses RLS) ever touches this table; enabling
-- RLS with no policies blocks direct anon/authenticated access.
alter table public.ask_rate enable row level security;

create or replace function public.bump_ask_rate(p_ip text)
returns int language plpgsql security definer set search_path = public as $$
declare cnt int;
begin
  insert into public.ask_rate (ip, day, n) values (p_ip, current_date, 1)
    on conflict (ip, day) do update set n = ask_rate.n + 1
    returning n into cnt;
  return cnt;
end; $$;

-- The endpoints call this with the service key; keep it off the public API surface
-- so a user with the anon key can't call it to grief counters.
revoke execute on function public.bump_ask_rate(text) from public, anon, authenticated;
grant  execute on function public.bump_ask_rate(text) to service_role;
```

## Verify

```sql
-- returns an incrementing integer each call:
select public.bump_ask_rate('test:1.2.3.4');
select public.bump_ask_rate('test:1.2.3.4');   -- should be 2
select n from public.ask_rate where ip = 'test:1.2.3.4' and day = current_date;  -- 2
delete from public.ask_rate where ip = 'test:1.2.3.4';   -- cleanup
```

## Optional housekeeping

Old daily rows are harmless but accumulate. If you want, prune occasionally:

```sql
delete from public.ask_rate where day < current_date - interval '7 days';
```

## Env

The limiter uses the existing `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_KEY`)
— no new env var. If neither is set, it falls back to the in-memory per-instance cap.
