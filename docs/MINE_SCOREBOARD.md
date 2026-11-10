# Mine scoreboard — what each mining run actually produced

**Purpose.** One at-a-glance ledger of every mining run and its *yield*, so the libraries earn their
keep visibly. A mine is not "done" because a note exists — it is done when the six-verdict cross-check
has run against the live site and its rows are logged. This table records that outcome per run:
which verdicts it produced, how many backlog rows it logged, how many shipped, and any **verdict-5
hazards** routed into a mechanical guard. It makes the pattern legible — e.g. "most mines of books we
already cover come back pure corroboration," or "this source produced three live corrections."

> **Measure, don't estimate.** Every cell is counted from the run's own note (its six-verdict
> cross-check) and the backlog, at the time the row is written — never recalled. Append a row at the
> end of each mine; don't retro-score old runs from memory (their yield is in each note's ledger).

## The verdicts (from the cross-check standard in CLAUDE.md)
① corroboration · ② error in ours (**always P1**) · ③ weaker in ours · ④ missing · ⑤ hazard — ours is
better (no row; flag / route to a guard) · ⑥ non-recommendation (logged with reason).

## Scoreboard

| Date | Source | Kind | Yield (①–⑥) | Rows logged | Shipped | Hazards → guard | Passes run |
|---|---|---|---|---|---|---|---|
| 2026-11-09 | Carson, "Historical Tradition in the Fourth Gospel: After Dodd, What?" | article | ① dominant · ⑤ ×2 · rest 0 | 0 | — | 2 → `docs/known-traps.md` (don't prove John's independence from Dodd/Carson; don't assert Johannine son-of-Zebedee authorship) | single-pass (pre-standard) |
| 2026-11-09 | Craig, reasonablefaith.org (kalam/Oppy + empty tomb Q&As) | article | ① dominant · ⑤ ×1 · ⑥ ×1 · rest 0 | 0 | — | 1 flagged in note (don't import Craig's "in fact, the actual tomb" wording); kept in the Craig note, not a global guard | single-pass (pre-standard) |
| 2026-11-10 | Resurrection cluster — retro-audit of ~20 existing notes (CFR/BOP/IRJC/RSG/ROTD + 5 Habermas videos + 8 Habermas/Bergeron/Shaw/Allison articles) | book+video+article | ① dominant · ② ×1 · ③ ×7 · ④ ×5 · ⑤ ×~11 · ⑥ ×1 | 6 logged (A6 deferred + B1–B5) | **8 shipped** (A1–A8: 1 live-AI ② fix + 7 ③ ports, across `d9dbfa8`/`1c389a5`/`f206a13`) | 2 → `docs/known-traps.md` (Allison-collective-hallucination enlistment; empty-tomb-not-a-minimal-fact tier) | **FULL standard**: triangulation (×3, Sonnet) + error-hunter (Opus) + argument-upgrade/gap (Sonnet), cross-family; every fix dual-consensus re-gated (argument/orthodoxy/neutrality) + confirmation. Error-hunter found 0 ②/0 ③ on live EN surfaces (the ② was a brief the argument-upgrade pass caught). Batch audit, not a single-source mine. |

**"Passes run"** records which review passes the mine used. From 2026-11-09 the per-mine standard is the
two read-only agent passes (**error-hunter** + **argument-upgrade**) plus the lighter every-mine checks
(triangulation · coverage/objection register · skeptic red-team · currency scan) — see CLAUDE.md. The
two runs above predate that standard and were single confirming passes; they are marked honestly rather
than back-dated as if the new standard had run.

## How to add a row
1. Finish the mine's six-verdict cross-check + the two standard passes.
2. Count the verdicts from the note; count rows from `docs/content-backlog.md` (or
   `node tools/backlog-open.mjs`).
3. Append one row here in the same commit as the note. If a ⑤ hazard was strong enough to guard
   mechanically, name where it went (`retired-claims.json` / `docs/known-traps.md`).
4. Earlier mines (pre-scoreboard) are not retro-scored — their yield lives in each note's ledger and
   the backlog's "Surfaced by" column.
