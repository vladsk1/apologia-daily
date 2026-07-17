# Verified argument briefs (`/briefs`) — a gated retrieval layer for the live AI

**What this is.** A small, curated set of **argument *briefs* in our own words** — the core move + the
strongest objection + the honest concession for a topic — that the live `/api/ask` endpoint can retrieve
as **optional background framing** when a visitor's question matches. It is the sibling of `/sources`:
where `/sources` supplies **verbatim public-domain quotes** (Church Fathers, creeds), `/briefs` supplies
**our-own-words argument shape**. Neither replaces the model's own judgement — a brief is a helper, never a
leash. The live instruction tells the model it MAY use a fitting brief and must otherwise ignore it and
answer normally.

**Why it exists.** So the substance of our certified essays (and, upstream, the owned-book research maps)
can shape live answers — without the runtime ever reading unverified notes. The trust boundary is the
whole point (see below).

## The rules (non-negotiable, mirror the rest of the pipeline)
- **Briefs are distilled from ALREADY-CERTIFIED content** — our gated essays (`library/*.html`) and, for
  structure only, the `docs/book-research/*` maps. A brief must NOT assert a specific claim (a date, a
  number, a quotation) that isn't already carried by a certified source. The `from` field records the
  provenance.
- **Our own words, never quotes.** A brief is argument *framing*, not a quotable source. It must never put
  words in a scholar's or a Father's mouth. (For a verbatim quote, that belongs in `/sources`.)
- **Gated before it can go live.** A brief reaches the deployable module (`lib/briefs-verified.js`) ONLY
  when its `reviewed` object stamps BOTH `argument` and `orthodoxy` dates. `tools/build-briefs-index.mjs`
  enforces this: an un-stamped brief is silently excluded from the live module (exactly like `/sources`
  `verified:true`). Never stamp a check you did not run.
- **Every guardrail still governs.** Briefs carry the same argument-specific rules as any content
  (resurrection: lead with the 1 Cor 15:3-7 creed, ~2-5 years; "sincerely believed," not "proven"; the
  empty tomb is the soft point; concede the observation, never the inference; orthodoxy outranks charity).
  The brief text is DOCTRINAL content and passes `apologia-argument` + `apologia-orthodoxy` like an essay.
- **Any change to the `api/ask.js` briefs instruction block re-clears argument + orthodoxy** (`api/ask.js`
  is a gated file).

## Entry shape (`briefs/_data.json`, an array)
```
{
  "id": "resurrection-empty-tomb",          // unique, kebab-case
  "topic": "…",                              // short human label
  "tags": ["resurrection", "empty tomb", …], // retrieval labels — weigh most in scoring
  "framing": "…our own words…",              // the injected text: core move + strongest objection + honest concession + a "see the essay" pointer
  "from": ["library/emptytomb.html", …],     // provenance: the certified source(s) it was distilled from
  "reviewed": { "argument": "<date>", "orthodoxy": "<date>", "by": "<note>" }  // BOTH dates required to go live
}
```

## Build / consume
- Rebuild after any edit: `node tools/build-briefs-index.mjs` → emits `briefs-index.json` (all briefs, for
  reference) + `lib/briefs-verified.js` (gated-only, the live module). CI runs `--check`.
- Live path: `lib/retrieve-briefs.js` scores `VERIFIED_BRIEFS` against the question and returns the top
  matches; `api/ask.js` injects them under an instruction block that keeps them optional, our-own-words,
  and subordinate to every guardrail.

## The trust boundary (why this is safe)
`docs/book-research/*` (unverified, copyrighted-book leads) → distilled into a **certified essay** and/or a
**gated brief** → `lib/briefs-verified.js` (gated-only) → live answer. The runtime never reads the raw
notes; only twice-gated, our-own-words framing can reach a visitor.
