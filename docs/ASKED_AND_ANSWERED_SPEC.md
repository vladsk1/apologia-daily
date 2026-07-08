# Build spec — "Asked & Answered" (objection-answering feature)

**Status:** approved model, prototype built. This documents how to build the LIVE version.
Prototype (static, gated, unlisted): `demo/asked-and-answered.html` →
https://apologiadaily.com/demo/asked-and-answered.html

## What it is
Paste a tweet / objection → get a plain, reviewed answer + "you're in good company" (the
skeptic who raised it first) + "go deeper" links to certified pages. Framed by a
**2,000-year timeline** of skeptics (Celsus → Porphyry → Hume → Russell → New Atheists) to
make the point: **almost every objection is old and has been seriously engaged.**

## The decision (user-approved)
- **Pro-gated:** pasting your *own* objection for a live answer = **Pro**.
- **Public / free (for reach + SEO):** the 2,000-year **timeline** and the **static
  already-answered objections** (the `/answers/` library).
- **Free taste:** TBD — optionally give free/anonymous users 1–2 live answers before the
  gate, to keep the viral loop. Decide later.

## Where it lives (recommended)
- **Rebuild `ask-anything.html` INTO this.** Ask Anything and this are the same engine
  (`api/ask.js`); running both = two live-AI surfaces (double cost + split users). The
  objection/2,000-year framing is stronger positioning than a generic "ask anything" box.
- **Keep `/answers/` as the static, indexable SEO library** — do NOT convert it to live AI.
- **Cross-link:** live tool's "go deeper" → `/answers/` pages (already does); `/answers/`
  hub gets "Didn't find yours? Paste it here →" → the live tool.

## Architecture — retrieval-first (this is the key to cost AND to the review standard)
1. User submits objection (Pro, authenticated).
2. **Retrieve:** match it against the existing gated `/answers/` + Evidence Library set
   (embedding search or keyword+category). 
   - **HIT → serve the static, already-gated answer. $0 API. Already passed the agents.**
   - MISS → fall through to the live LLM.
3. **Live answer (miss only):** call the model with the `api/ask.js` guardrail system prompt
   (Nicene orthodoxy, steelman-first, no fabrication, argument-specific rules, "orthodoxy
   outranks charity"). Return answer + retrieved "go deeper" links (never let the model
   invent URLs — links come from the retrieval index).
4. **Log** every live answer for the review sweep (below).

## The review standard for a DYNAMIC feature (honest limitation)
The Claude Code agents (citations/argument/orthodoxy) are a human-supervised build-time
pipeline — they **cannot run per-query at runtime.** So we approximate the standard three ways:
1. **Retrieval-first** means most answers are pre-gated static content (fully passed the agents).
2. **Guardrails baked into the system prompt** (mirror `api/ask.js`) for genuine live answers,
   optionally + a second-pass self-critique LLM call ("does this violate any guardrail?").
3. **Batch review sweep:** periodically run `apologia-orthodoxy` (+ argument) over a sample of
   logged live answers to catch drift; **promote good live answers into the static `/answers/`
   library**, where they get the full agent pass and become $0 + indexable.
Any NEW seed answers added to the static set (like the prototype's 4 samples) must pass
citations + argument + orthodoxy before shipping — same as every `/answers/` page. Be honest:
the runtime guardrail is a strong prompt + retrieval, not the human-supervised gate.

## Cost model
Per live text answer (rough, verify current pricing): ~3k input + ~500 output.
- Haiku-class ≈ ½¢ · Sonnet-class ≈ 1.5–2¢ · Opus-class ≈ 8¢. (10k/mo ≈ $50 / $170 / $800.)
Levers: **retrieval-first** (most answers $0), **prompt caching** (guardrail prompt is constant,
~90% off cached input), **cheap first-pass model** (reserve premium for hard ones).

## Screenshot input (OCR)
- **Default: `tesseract.js` client-side — free**, extracts tweet text in-browser, feeds the
  text engine. $0 marginal cost.
- **Fallback: Claude vision** (send the image) — more accurate but +~1–1.6k image tokens/call;
  use only when OCR confidence is low.

## Guardrails / must-haves before live
- **Rate-limiting + daily cap per user/IP** — the #1 cost/abuse control. Non-negotiable for a
  public or freemium box.
- **Pro-gate on `isPro`** (Supabase auth) for the live box. NOTE: **monetization is a stub** —
  `isPro` is hardcoded `true`, Stripe not live, Pro = "Coming soon". So we can *gate* on `isPro`
  now, but it is **not a real paywall and earns nothing** until Stripe is turned on (human
  sign-off + keys required — never wire real prices/payments without it). Don't advertise/price
  the feature until then.
- Input moderation (drop junk/abuse), and a refusal path for out-of-scope inputs.

## Build checklist
- [ ] Rebuild `ask-anything.html` → "Asked & Answered" front-end (reuse `demo/asked-and-answered.html`).
- [ ] Retrieval index over `/answers/` + Evidence Library (embeddings or keyword+category).
- [ ] `api/*.js` endpoint: auth + isPro gate → retrieve → (hit: static | miss: LLM w/ guardrail
      prompt + caching) → return answer + retrieved links; log the result.
- [ ] `tesseract.js` client-side OCR for screenshots; vision fallback.
- [ ] Rate-limit + daily cap + moderation.
- [ ] Keep timeline + `/answers/` public; cross-link both ways.
- [ ] Batch review sweep job + "promote to /answers/" flow.
- [ ] (Later) free-taste metering; (later) real Stripe paywall.

## SHIPPED (2026-07-08) — live version

Built and deployed:
- **`asked-and-answered.html`** (root, live, indexed) — one smart box (typed question / pasted
  objection / screenshot), 2,000-year timeline, trust panel, curated sample answers, dormant
  Pro gate. Loads the standard `adn-nav` + `/ad-nav.js` + `/analytics.js` + Supabase.
- **Screenshot OCR** — `tesseract.js` (CDN), client-side, free: upload / drop / paste an image →
  OCR → fills the box → answers.
- **Retrieval-first** — `tools/gen-answers-index.mjs` → `answers/search-index.json` (66 answers
  with `a` text). The page (1) matches curated SAMPLES, then (2) an index hit renders the
  pre-gated `/answers/` answer inline (free, $0), then (3) falls through to live `/api/ask`.
- **`api/ask.js`** — added objection-handling to the (already-gated) system prompt + a
  per-IP daily cap (`DAILY_IP_CAP = 40`, fail-open). Re-gated: argument sound, orthodoxy CLEAN.
- **Replaced Ask Anything** — nav label swapped on non-gated pages; gated essays reverted (so the
  content gate isn't tripped by a cosmetic change) and relabeled at runtime by `ad-nav.js`;
  `/ask-anything.html` 301 → `/asked-and-answered.html` (vercel.json); sitemap updated.
- **Pro gate dormant** — `isPro` hardcoded `true` (open to all now). When Stripe is live, set
  `var isPro = !!(session.user.user_metadata.is_pro===true)` in `asked-and-answered.html` to make
  live answers paid-only; retrieval-hit library answers stay free.

### ⚠️ ONE MANUAL STEP — run this SQL once in Supabase (enables the IP rate limit)
Until this runs, the per-IP cap fails open (endpoint still works, just less protected):
```sql
create table if not exists public.ask_rate_limit (
  ip  text not null,
  day date not null default current_date,
  n   int  not null default 0,
  primary key (ip, day)
);
alter table public.ask_rate_limit enable row level security; -- service role bypasses RLS

create or replace function public.bump_ask_rate(p_ip text)
returns int language plpgsql security definer as $$
declare cur int;
begin
  insert into public.ask_rate_limit(ip, day, n) values (p_ip, current_date, 1)
  on conflict (ip, day) do update set n = public.ask_rate_limit.n + 1
  returning n into cur;
  return cur;
end; $$;
```
`api/ask.js` POSTs to `/rest/v1/rpc/bump_ask_rate` with the service-role key
(`SUPABASE_SERVICE_ROLE_KEY`), and returns HTTP 429 once an IP exceeds 40/day.

### Still open (follow-ups)
- Run the SQL above (you). · Verify OCR on a real device (CDN blocked in CI sandbox).
- Later: free-taste metering; the batch review sweep that promotes good live answers into
  `/answers/`; Claude-vision OCR fallback; port the old "share this answer to a skeptic" feature.

## Prototype status (superseded)
`demo/asked-and-answered.html` — the original unlisted prototype with the Free/Pro preview
toggle. Superseded by the live root page above; kept for reference.
