# Lean onboarding spec — front-loaded, 3 questions, routes to a first action

_Companion to `docs/MARKETING_PLAN.md`. Source insight: the Bible Chat teardown (HANDOFF.md,
2026-07-04) — their ~20-step quiz is a **commitment device**: front-loading a few questions
before the user gets value creates investment (sunk cost) and personalizes the payoff, which
lifts activation and retention. We do the lean **3-question** version, not the 20-step one._

## The one thing to change

We already have an onboarding modal (`dashboard.html`, `OB_STEPS` at ~line 926) with **4
questions** (intent, level, goal, mode) that persists to `localStorage.ad_prefs` +
Supabase `user_metadata` and reflects intent in the greeting (`applyIntent`). It captures
preferences well. **What it does not do — and the single highest-leverage fix — is end on a
concrete, personalized first action.** Right now onboarding finishes silently and drops the
user on the generic dashboard. A commitment device only pays off if the investment buys the
user something specific: _"Based on that, start here → [one tailored thing]."_

So this spec is a **refinement, not a rebuild**: trim 4→3 questions, front-load Q1 onto the
signup page, and add a routing "first step" screen at the end.

---

## The lean 3 questions

Keep the two most *motivating* questions (why + level), replace the two overlapping/utility
ones (goal, mode) with one **routing** question that maps straight to content. Default `mode`
to `guided` (it's a settings pref, changeable later — not worth a step).

**Q1 — Why are you here?** (unchanged; the strongest, most self-defining question — front-load it)
- Defending my faith · Working through doubts · Helping someone skeptical · Academic interest
- _(existing `intent` values: `defend` / `doubts` / `skeptic` / `academic`)_

**Q2 — What do you most want answered first?** (NEW — this is the router; replaces `goal`)
- Does God exist? → `god`
- Can we trust the Bible? → `bible`
- Did Jesus really rise? → `resurrection`
- Islam & other faiths → `islam`
- Faith & science → `science`
- I'm just exploring → `explore`

**Q3 — Where are you starting?** (unchanged `level`)
- Complete beginner → `beginner` · Some knowledge → `some` · More advanced → `advanced`

Store as `{ intent, topic, level }`. Keep persisting to `ad_prefs` + `user_metadata` exactly as
`finishOnboarding` does now (just swap `goal`→`topic`, drop `mode`).

---

## Front-loading (the commitment-device move)

Ask **Q1 on the signup page itself**, before the account exists — one tap of investment before
any value. Concretely (`signup.html`):
- Above the name/email/password form, show Q1 as four tappable cards ("What brings you here?").
- On tap: store to `localStorage.ad_prefs.intent`, highlight the card, reveal the form ("One
  more step — create your free account"). It's not a hard gate; a user can still scroll to the
  form, but the default flow taps first.
- Carry the choice into the account: pass it in the signup `data` (`user_metadata.intent`) so it
  survives, and so the dashboard modal opens on **Q2** (not Q1) — the user already feels underway.

Q2 + Q3 then run in the existing dashboard modal on first visit (the modal, reduced to these two
if Q1 was answered at signup, or all three if the user arrived some other way).

---

## The payoff: a routing "first step" screen

Replace the silent `finishOnboarding` close with a final screen:

> **"Here's your first step, {name}."**
> [ Primary button → the tailored first action ]
> _or_ "explore everything" → dashboard

**Routing map** (`topic × level` → first action). Depth scales with level: beginners get the
short answer page; advanced get the deep-dive essay / hub tab. All targets already exist and are
clarifier-hardened.

| topic | beginner / some | advanced |
|---|---|---|
| `god` | `/answers/does-god-exist.html` | `/library/kalam.html` |
| `bible` | `/answers/can-we-trust-the-new-testament-manuscripts.html` | `/library/manuscript.html` |
| `resurrection` | `/answers/is-there-evidence-jesus-rose-from-the-dead.html` | `/library/minimalfacts.html` |
| `islam` | `/answers/do-muslims-and-christians-worship-the-same-god.html` | `/worldviews.html` |
| `science` | `/answers/doesnt-science-disprove-god.html` | `/library/finetuning.html` |
| `explore` | `/today` (the daily loop) | `/today` |

**Intent shades the copy, not the destination** — reuse the existing `INTENT_COPY` tone:
- `defend` → "Start getting ready to give a reason:"
- `doubts` → "Let's take your honest question seriously:"
- `skeptic` → "Here's what to bring to that conversation:"
- `academic` → "Straight to the rigorous case:"

Button label = the target's question, e.g. "Can we trust the Bible? →". One clear action beats a
menu.

---

## Why this works (and the guardrails)

- **Commitment before value** (Q1 at signup) = investment → higher completion and D1 return.
- **Personalized payoff** (routing screen) = the investment buys something specific → activation.
- **3 questions, ~15 seconds** = lean enough not to bounce; the length is *not* the mechanism (that
  was Bible Chat's dark pattern) — the *front-loading + payoff* is.

**Do NOT copy from the teardown:** no fake progress bars ("Step 4 of 20"), no artificial length,
no "we're building your personalized plan…" loading theater, no forced answers before the user can
see anything. Honest, short, and it hands them something real.

---

## Analytics (wire alongside `docs/MARKETING_PLAN.md` events)

- `onboarding_started` (Q1 shown, at signup)
- `onboarding_step_completed { step, value }` (per tap — reveals drop-off between Q1→Q2→Q3)
- `onboarding_completed { intent, topic, level }`
- `first_action_clicked { topic, level, target }` (the routing button — the activation event)
- `first_action_skipped` (chose "explore everything")

`onboarding_completed → first_action_clicked` is the funnel that tells us the routing screen is
earning its keep.

---

## Implementation notes (files/functions to touch)

- `dashboard.html` — `OB_STEPS` (~926): drop `goal` + `mode`, add `topic`; `finishOnboarding`
  (~979): store `topic` not `goal`, default `mode:'guided'`, and call a new `showFirstStep()` that
  renders the routing screen from the map above instead of closing silently; skip Q1 if
  `user_metadata.intent` already set.
- `signup.html` — add the Q1 card row above the form; store to `ad_prefs.intent`; include
  `intent` in the Supabase signup `data`.
- `applyIntent`/`INTENT_COPY` (~995) — reuse for the routing-screen copy.
- Routing map — a small `FIRST_STEP[topic][levelBand]` object; `levelBand = level==='advanced' ?
  'advanced' : 'basic'`.

No backend/schema change (uses existing `user_metadata` + `localStorage`). No payments/auth
touched. Ship behind the existing modal so it degrades gracefully if JS is off.
