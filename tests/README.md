# tests/ — deterministic code & content invariants

Dependency-free tests (Node's built-in `node:test`, no `package.json` needed). They guard the
regressions and invariants that no content agent watches for.

## Run

```
node --test tests/*.test.mjs
```

CI runs this on every push (`.github/workflows/content-gate.yml` → `tests` job) and monthly
(`.github/workflows/monthly-code-audit.yml`).

## What's covered

- **`nav.test.mjs`** — the nav single source of truth. `gen-answers.mjs` must import `CANON` from
  `sync-nav.mjs` (not keep its own copy), and `sync-nav --check` must report zero drift. Guards the
  2026-07-16 CI regression where the two nav copies diverged.
- **`answers-data.test.mjs`** — `answers/_data.json`: no duplicate slugs, URL-safe slugs, valid
  categories, both review dates present, and every clarifier phrase appears verbatim in its answer.
- **`content-integrity.test.mjs`** — every `content-review` stamp parses as valid JSON (an unescaped
  inner quote silently breaks the gate parser), and `api/ask.js` still contains its core orthodoxy
  guardrails (so an edit can't silently gut the live-AI prompt).
- **`security.test.mjs`** — the Supabase service-role key never appears in a client-shipped file, and
  cron endpoints read `CRON_SECRET` from env with no hardcoded fallback (fail closed).

## Scope

These are cheap backstops, **not** a substitute for the `apologia-engineer` review agent or a real
security audit — they catch the known, mechanical failure modes. When a test fails it is either a real
regression (fix the code) or a stale test (fix the test, on-record in the diff).
