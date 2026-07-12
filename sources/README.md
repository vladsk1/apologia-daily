# `/sources` — the public-domain source library

A searchable corpus of **public-domain** primary texts — the creeds, the Church
Fathers, and pre-1929 works — that the content agents (`apologia-author`,
`apologia-evidence`) and the live pipeline can quote and cite when drafting
Evidence Library essays and Answers. Think of it as Logos's library, scoped to
what is legally free to reproduce and to what an apologetics platform actually
needs.

## Why it exists
Quoting the fathers **directly** ("Ignatius calls Jesus 'our God' in AD 107") is
some of the strongest, most on-brand apologetics there is. A committed, searchable
corpus lets every drafter reach for the real words with an exact citation instead
of paraphrasing from memory — and lets `apologia-citations` verify a patristic
quote against a stored text.

## What may live here — and what may NOT
| Source | Allowed? |
|---|---|
| Church Fathers (original texts — ancient) | ✅ yes |
| **Public-domain translations** (e.g. the 19th-c. Schaff ANF/NPNF, Roberts–Donaldson, Robertson) | ✅ yes |
| Creeds & conciliar definitions | ✅ yes |
| Pre-1929 works (Aquinas old translations, Paley, Butler, Josephus/Whiston, Eusebius) | ✅ yes |
| **Modern copyrighted translations** (e.g. Popular Patristics, most post-1929) | ❌ NO — the underlying text is ancient but the *translation* is under copyright |
| **Any copyrighted book** (modern apologetics titles), even "internal use" | ❌ NO — do not store full text here; use it only as *research* that points to primary sources, expressed in our own words (ideas/facts aren't copyrightable; specific wording is) |

**Rule of thumb:** store a text here only if both the work *and the specific
translation* are public domain. When in doubt, leave it out.

## Entry schema (one object per passage)
Each `*.json` file is an array of entries:
```json
{
  "id": "ignatius-eph-7",            // stable slug
  "author": "Ignatius of Antioch",
  "work": "Epistle to the Ephesians",
  "year": 107,                        // approx. composition year
  "section": "ch. 7",                // chapter/section as cited
  "translation": "Roberts–Donaldson (ANF), public domain",
  "pd": true,                         // work AND translation are public domain
  "source_url": "https://…",         // where the PD text can be verified
  "verified": false,                  // exact wording confirmed vs source_url in-pipeline?
  "tags": ["deity of christ", "incarnation"],
  "text": "There is one Physician…"  // the quotable passage, verbatim
}
```

## The `verified` flag (important)
`verified: true` means the exact wording has been confirmed against `source_url`
by `apologia-citations` (or a human with the source). Until then it is `false`.
**A passage may not be quoted in published content while `verified: false`** — same
discipline as the rest of the site: nothing ships unverified. (Some of the clean
canonical PD hosts — CCEL, New Advent, Wikisource — are unreachable from the
build sandbox, so seed entries land as `false` and are verified as a deliberate
gate step, not auto-trusted.)

## How it's used
- **Drafting:** `apologia-author` / `apologia-evidence` `Grep`/`Read` these files (or
  `sources-index.json`) for on-topic passages and quote the *verified* ones with the
  entry's `section` + `translation` as the citation.
- **Fact-check:** `apologia-citations` confirms a quoted father against the stored
  `text` + `source_url`, flipping `verified` to `true`.
- **Search:** `node tools/build-sources-index.mjs` regenerates `sources-index.json`
  (used by the site search and by agents); a CI `--check` keeps it fresh.

## Adding a work
Drop a clean PD text (or paste passages) into a new/existing `sources/<name>.json`
following the schema, run the build script, and have `apologia-citations` verify.
Full clean texts are best ingested from a session with web access to CCEL/ANF, or
by committing a PD text file the script can chunk.
