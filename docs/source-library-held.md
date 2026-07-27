# Source-library passages removed or held back

Passages that were drafted for `/sources` but are **not** in the live library. Kept here so the
work behind them is not lost, so a future session does not re-add them naively, and so the reason
is on record.

This file lives in `docs/` deliberately: `tools/build-sources-index.mjs` indexes **every**
`sources/*.json` file, and `docs/` is excluded from the Vercel deploy by `.vercelignore`. Nothing
here is served, indexed, or quotable.

---

## Chrysostom, *Homilies on 1 Corinthians*, Homily XXIV — on approaching the Eucharist

- **Removed:** 2026-07-26, by owner decision.
- **Status when removed:** `verified: false` — it had never been quotable.
- **Why removed:** two independent reasons, either sufficient.

### 1. The citation check failed it

The stored text was **a hybrid of two recensions**, and truncated:

- `say thou to thyself` is the printed CCEL/NPNF reading, grafted onto an otherwise
  New Advent sentence — New Advent reads `say thou to yourself`. So the quotation matched
  **neither** source exactly. This is the same defect class as the spliced Ignatius quotation
  the trust page confesses.
- It was cut mid-sentence at `but free` with **no ellipsis**. The sentence continues:
  `…because of this I hope for heaven, and to receive the good things therein, immortal life,
  the portion of angels, converse with Christ.`
- A third error was corrected earlier: the homily is on **1 Cor. x. 13**, not x. 16–17.

**If it is ever restored, the fix is specific:** re-base the whole quotation on **one** host —
preferably the printed CCEL text at `https://www.ccel.org/ccel/schaff/npnf112.iv.xxv.html`,
keeping its archaic forms (`draw nigh`, `when thou seest`, `say thou to thyself`) — and extend it
through `converse with Christ.` Then run the citations gate against that single source.

### 2. Denominational neutrality

Chrysostom's language here is strongly realist (`Because of this Body am I no longer earth and
ashes`). Apologia Daily does not adjudicate the Catholic/Orthodox/Protestant dispute over the mode
of Christ's presence, and `verified: true` is not a filing decision — it makes a passage
**retrievable by the live AI**, which could then quote strongly realist eucharistic language in an
answer and read as taking a side the site declines to take.

If restored, it should be cited **only** for the antiquity and depth of eucharistic reverence in
the early church — the common ground of awe and self-examination in approaching the Table, echoing
1 Cor 11:28 — and never to settle the mode-of-presence question.

### The text as stored (for reference only — defective, do not quote)

> Let us not, I pray you, let us not slay ourselves by our irreverence, but with all awfulness and
> purity draw near to It; and when you see It set before you, say thou to thyself, Because of this
> Body am I no longer earth and ashes, no longer a prisoner, but free.

---

## Standing rule this illustrates

`verified: false` means **"not yet checked, or checked and found wanting."** It must never be used
as a quiet way to keep a *sound* passage out of circulation — that would corrupt the flag other
parts of the system depend on. If a passage is accurate but unwanted, remove it and record the
reason here instead.
