# Content checks & live-AI architecture — one-page overview

**What this is.** The single place that consolidates *everything* new content passes before it reaches
the live site, plus how the live AI (`api/ask.js`) is guarded and what it's allowed to draw on. It
gathers what was previously spread across `CLAUDE.md`, `briefs/README.md`, `sources/README.md`,
`docs/book-research/README.md`, and the code itself. Those remain the detailed sources of truth; this is
the map. If anything here conflicts with `CLAUDE.md` or a `README`, those win — update this file to match.

---

## 1. The mandatory content pipeline (every essay, card, answer, reel, and the AI prompts)

Runs in order; nothing deploys having skipped a stage.

| # | Stage | Agent | Access |
|---|---|---|---|
| 1 | **Draft** in house format, inside the guardrails | `apologia-author` / `apologia-evidence` | write |
| 2 | **Scholar-editor review** — accuracy, rigor, sourcing, steelmanning | `apologia-evidence` | write |
| 3 | **Citation fact-check** — every Scripture/Qur'an ref exists & is quoted right; every scholar/date/source real & correctly attributed; no fabricated quotes/stats | `apologia-citations` | read-only |
| 4 | **Argument soundness** — validity, premise strength, fair steelman, no overstatement, **hunts over-concession**; enforces the short-form answer rule | `apologia-argument` | read-only |
| 5 | **Copy-edit** — typos, grammar, tone, broken markup/links | `apologia-editor` | write |
| 6 | **Apply fixes + footnote integrity** — every `<sup>N</sup>` maps to exactly one `<li>` | human-supervised | — |
| 7 | **FINAL GATE — orthodoxy** — certifies vs `docs/STATEMENT_OF_FAITH.md` / Nicene orthodoxy; a single **[HERESY] flag blocks deploy**; mandatory "clarifier candidates" sub-step | `apologia-orthodoxy` | read-only |
| 8 | **Deploy** — fast-forward push to `main` | — | — |

**Dual-consensus (highest-stakes: Trinity, deity/person of Christ, salvation, world-religions):** both
`apologia-orthodoxy` **and** the adversarial `apologia-neutrality` red-team must certify CLEAN. Record both
in the stamp.

Read-only agents (citations, argument, orthodoxy, neutrality) **report**; a human applies fixes. The
orthodoxy agent is an automated gate, **not** a substitute for eventual human/pastoral sign-off.

---

## 2. Automated CI gates (`.github/workflows/content-gate.yml`, every push/PR)

Blocking unless noted:

- `node tools/check-content-review.mjs --changed <base>` — every changed essay / `ev-s*` / `worldviews.html`
  / reel spec / `api/ask.js` must carry a `content-review` stamp (argument + orthodoxy dates + reviewer).
- `node tools/sync-nav.mjs --check` — nav single-source-of-truth is in sync.
- `node tools/build-search-index.mjs --check` — search index in sync.
- `node tools/build-sources-index.mjs --check` — `/sources` index + `lib/sources-verified.js` in sync.
- `node tools/build-briefs-index.mjs --check` — `/briefs` index + `lib/briefs-verified.js` in sync.
- `node tools/check-orthodoxy-tripwires.mjs` — whole-corpus scan for heterodox phrasings vs a baseline
  allowlist (`tools/orthodoxy-tripwires-baseline.json`); a *newly introduced* match fails.
- `node tools/check-answer-openings.mjs` — front-loaded/concede-first opening guard for `/answers/*`
  (baseline `tools/answer-openings-baseline.json`).
- `node tools/check-answer-concessions.mjs` — whole-answer + meta over-concession / unearned-symmetry guard
  (baseline `tools/answer-concessions-baseline.json`).
- `node tools/check-stamp-integrity.mjs --warn` — **non-blocking** report: gated file edited after its
  stamp without a re-stamp.
- `node --test tests/*.test.mjs` — the suite: `nav`, `answers-data`, `content-integrity`, `security`,
  `require-secret`. Guards nav, `answers/_data.json` integrity, stamp JSON validity, `api/ask.js` guardrail
  presence, the crisis-routing regex (via `content-integrity`), and static security invariants
  (service-role key never client-shipped; cron endpoints fail closed).

**Scheduled:** `.github/workflows/monthly-orthodoxy-audit.yml` (whole-corpus orthodoxy sweep) and
`monthly-code-audit.yml` (test suite + code checks). An agent-driven monthly `api/*.js` + RLS security sweep
still needs a fresh-session Routine when `create_trigger` is reachable.

**Honest caveat:** the stamp is an *auditable human assertion*, not proof the agents ran. Never stamp a
check you didn't run.

---

## 3. The `/answers/*` extra gate

`tools/gen-answers.mjs` refuses to build a new answer unless its `_data.json` entry stamps **both**
`reviewed.argument` and `reviewed.orthodoxy` dates, and runs a **drift audit** (visible text ↔ `_data.json`
↔ JSON-LD must agree). Grounding step: consult `docs/book-research/INDEX.md` before drafting.

---

## 4. The live AI (`api/ask.js`) — guarded at build time AND runtime

**Build time.** `api/ask.js` is itself gated content: it carries a `content-review` stamp, and any change to
its guardrail/instruction blocks (including the sources block and the briefs block) must re-clear argument +
orthodoxy and be re-stamped.

**Runtime, baked into the system prompt:**
- The full **non-negotiable guardrails** — classical Nicene orthodoxy; *orthodoxy outranks charity*;
  denominational neutrality; 1 Peter 3:15 tone; no fabrication; the argument-specific rules (Kalam "begins
  to exist"; fine-tuning data-vs-design; resurrection leads with the 1 Cor 15:3-7 creed; morality = duties
  need a ground; manuscripts = accurate preservation, not proof of truth).
- A **runtime FINAL SELF-CHECK** — the model re-audits its own drafted answer against the non-negotiables
  before returning it.
- A **PASTORAL CARE block that takes priority over the normal format** — a first-person crisis signal
  (suicidal ideation/self-harm, abuse/danger, acute despair, "stop my meds and just pray") routes to a
  brief, warm response that affirms worth (imago Dei), points to a real person + findahelpline.com + local
  emergency services, offers Christ as comfort not argument, and never diagnoses. Backed by a Haiku
  classifier verdict **and** a deterministic `crisisBackstop` regex (crisis routing never rests on the
  classifier alone). Guarded end-to-end by `tools/test-crisis-routing.mjs`.

**Operational:** per-IP/day **rate limiting** (`lib/ratelimit.js`, fails closed), input-size caps (413),
security headers/CSP. (IP-based; not distributed-attack-proof.)

---

## 5. What the live AI is allowed to draw on — three layers

The model answers from **three** information sources; the last two are retrieved per-question and are BOTH
twice-gated so nothing unverified reaches a visitor.

1. **Its own trained knowledge — always primary.** Every guardrail governs it.

2. **`/sources` — verbatim public-domain quotes** (creeds, Church Fathers). Only `verified:true` entries
   compile into `lib/sources-verified.js`; `lib/retrieve-sources.js` scores them; `api/ask.js` injects them
   under an instruction that says quote **only** from the provided list, fenced as *"quotation-accurate
   historic witnesses, not Scripture,"* fabrication hard-blocked. PD work **and** PD translation only.

3. **`/briefs` — our-own-words argument framing** (core move + strongest objection + honest concession).
   Retrieved as **at most one** matching brief and offered as **OPTIONAL background** — the live instruction
   (`buildBriefsBlock`) tells the model: *"Use it ONLY if it fits. If your own knowledge yields a better
   answer, IGNORE it entirely and answer normally."* Not quotable, not attributed, subordinate to every
   guardrail, and it yields to the pastoral path. A brief compiles into `lib/briefs-verified.js` only when
   its `reviewed` object stamps **both** argument + orthodoxy.

### Where `docs/book-research/` fits — the trust boundary

`docs/book-research/*` are in-our-own-words **maps of owned copyrighted books** — unverified leads, NOT
quotable text. **The live AI never reads this folder** (it's a serverless function that can't reach `docs/`,
and the notes are unverified). Its influence reaches live answers only *upstream*, after a human distills it
into gated, our-own-words content:

```
docs/book-research/*        unverified copyrighted-book leads — runtime NEVER reads this
        │  a human distills it (structure/leads only; every claim must trace to a certified source)
        ▼
a CERTIFIED essay  and/or  a GATED brief     our own words; passes argument + orthodoxy
        │  build compiles the gated-only subset into…
        ▼
lib/briefs-verified.js  /  lib/sources-verified.js
        │  retrieved per question, offered as OPTIONAL / quote-only input
        ▼
the live AI            also uses its own knowledge; may ignore the retrieved material
```

So a brief **is** book-research made safe: a book map can shape *how* a brief is framed, but every actual
claim in it must already be carried by a certified essay or a verified source. The only path from a book to
a *live* answer is: verify its primary source → add to `/sources` as `verified:true`, or distill it into a
certified essay/gated brief — never point the runtime at `docs/book-research/`.

---

## 6. Where everything is stored (file map)

| Topic | File(s) |
|---|---|
| Master project guide (auto-loaded) + guardrails | `CLAUDE.md` |
| Doctrinal anchor the orthodoxy gate certifies against | `docs/STATEMENT_OF_FAITH.md` |
| This overview | `docs/CONTENT_CHECKS_OVERVIEW.md` |
| Briefs rules + trust boundary | `briefs/README.md`, `briefs/_data.json` |
| Sources rules | `sources/README.md`, `sources/*.json` |
| Book-research rules + topic index | `docs/book-research/README.md`, `docs/book-research/INDEX.md` |
| Live AI code + runtime stamp | `api/ask.js`, `lib/retrieve-briefs.js`, `lib/retrieve-sources.js`, `lib/briefs-verified.js`, `lib/sources-verified.js`, `lib/ratelimit.js` |
| CI gates | `.github/workflows/content-gate.yml`, `monthly-orthodoxy-audit.yml`, `monthly-code-audit.yml` |
| Check/build scripts | `tools/check-*.mjs`, `tools/build-*.mjs`, `tools/gen-answers.mjs`, `tools/test-crisis-routing.mjs` |
| Test suite | `tests/*.test.mjs` |
| Agent definitions | `.claude/agents/apologia-*.md` |
| Clarifier registry | `docs/clarifiers.md` |
| Session history | `HANDOFF.md` |

---

## 7. Quick command reference

```
# before deploy — verify stamps on changed files
node tools/check-content-review.mjs --changed
node tools/check-content-review.mjs --audit        # list everything unstamped

# the CI gates, run locally
node tools/check-orthodoxy-tripwires.mjs           # + --update to re-baseline legit refutation context
node tools/check-answer-openings.mjs               # + --update to accept a deliberate exception
node tools/check-answer-concessions.mjs            # + --audit to see every hit with context
node tools/check-stamp-integrity.mjs               # certified-then-edited guard
node --test tests/*.test.mjs                        # the suite

# rebuild retrieval indexes after editing /sources or /briefs
node tools/build-sources-index.mjs                 # emits sources-index.json + lib/sources-verified.js
node tools/build-briefs-index.mjs                  # emits briefs-index.json + lib/briefs-verified.js

# crisis-routing harness
node tools/test-crisis-routing.mjs                 # offline (CI-safe); --live [baseUrl] hits the endpoint
```

---

## 8. In one line

Every piece of content gets **citation + argument + orthodoxy** review (dual-consensus for the riskiest
topics); **CI blocks** anything unstamped or tripping the heterodoxy / over-concession / front-loading
scanners; and the **live AI** adds runtime guardrails + a self-check + crisis routing, answering from its
own knowledge plus, optionally, **twice-gated** verified quotes (`/sources`) and our-own-words framing
(`/briefs`) — with `docs/book-research/` sitting one distillation step behind the briefs, never read by the
runtime directly.
