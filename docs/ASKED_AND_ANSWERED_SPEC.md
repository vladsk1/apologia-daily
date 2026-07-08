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

## Prototype status
`demo/asked-and-answered.html` — static sample answers (4, fully gated: citations 0
fabrications, argument 0 BREAK, orthodoxy 0 heresy), the timeline, the trust panel, and a
**Free/Pro preview toggle** demonstrating the model: retrieval-HIT (already-answered) = free
for everyone; retrieval-MISS (your own objection) = Pro gate. Unlisted, noindex, not on nav/
sitemap. Content-review stamped.
