# Session handoff — 2026-07-11 (Trinity "world-class" session)

_Read this + `CLAUDE.md`. Everything below is **deployed to `main`** (work on a feature branch,
**never `git checkout main`**; deploy by `git push origin <branch>:main`). This session was a single
sustained push to make the **Trinity tab (`ev-s6`) the best Trinity-defense resource on the open web.**
Separate from the other `docs/SESSION_HANDOFF_2026-07-11.md` (that was the reels/analytics web session)._

## TL;DR — the Trinity tab went from 10 cards to 15 + a guided pathway + an interactive diagnostic

Every new artifact cleared the full mandatory pipeline — **apologia-citations (0 blockers) → apologia-argument
(SOUND, 0 BREAK) → apologia-orthodoxy (CLEAN, 0 heresy)** — with the recurring guardrails actively enforced
(subordinationism, filioque neutrality, "orthodoxy outranks charity," no paraphrase-as-verbatim-quote).

### The 5 new cards (tab is now 15, renumbered 01–15)
Final order: 01 Shema · 02 NT Trinity · 03 OT Foundations · **04 The Deity of the Son** · **05 The Deity
and Personhood of the Holy Spirit** · 06 Early Church · 07 Philosophical Defence · **08 Why Every Trinity
Analogy Fails** · **09 Did the Church Invent the Trinity?** · 10 Muslims · 11 JW · 12 Mormons · 13 Modalism ·
14 Eternal Generation · **15 What Distinguishes the Persons?**

1. **05 The Deity and Personhood of the Holy Spirit** — the #1 audit gap (the tab defended "three persons"
   but the Spirit had no card/essay). New: card + deep-dive essay `library/holy_spirit.html` (~2,900w) +
   mastery `ev-m-holy_spirit.html`. Person-vs-"active force" (JW) + full deity + Constantinople 381.
2. **04 The Deity of the Son** — a **bridge card** (no new essay): states the deity of the Son as the
   load-bearing Trinitarian premise; deep links reuse the gated Jesus-tab `jesus_as_god_nt` essay +
   mastery + tutor slug. Answers John 14:28 ("greater than I") with an orthonote + Col 1:15 ("firstborn").
3. **08 Why Every Trinity Analogy Fails** — the top learning/short-form topic. New: card + essay
   `library/analogies.html` (~2,750w) + mastery `ev-m-analogies.html`. Water/egg/shamrock/sun → each mapped
   to the heresy it commits; the Shield of the Trinity; the being/person "lockstep"; what to say instead.
4. **09 Did the Church Invent the Trinity?** — the viral secular objection. **Bridge card** to the
   `early_church_trinity` essay, which **gained a new gated section "Was It Borrowed from Paganism?"**
   (footnotes integrated 19→22, 6 new sources) so the bridge actually covers the pagan-copy claim. Answers
   "Constantine invented it at Nicaea 325" + "it's a pagan copy" (Isis-Osiris-Horus/Capitoline = separate
   gods vs. one *ousia* in three *hypostaseis*; parallelomania).
5. **15 What Distinguishes the Persons?** — the capstone advanced card. New: card + essay
   `library/relations.html` (~3,050w) + mastery `ev-m-relations.html`. The three classical rules: relations
   of origin, perichoresis, inseparable operations.

### The interactive diagnostic
- **`name-the-heresy.html`** — a "name the heresy" self-check (14 statements → Modalism/Arianism/Tritheism/
  Partialism/Orthodox), 1:1 with the analogies card's heresies. Timer, streak, shareable 1080×1080 result-card
  PNG. Cloned from `argument-or-fallacy.html`. Wired into `games.html` (game-card) + `sitemap.xml`; linked
  from the analogies essay CTA (which the game links back to). Question set gated (orthodoxy CLEAN 14/14,
  argument SOUND, citations 0-blockers). **Not in the content-gate CI scope** but stamped for provenance.

### Guided pathway + on-ramp
- A **"Where to start — a suggested path"** box added to the `ev-s6` intro (Start here → the three givens →
  answer the objections → go deeper), with a Name-the-Heresy link. Gated CLEAN.

### Wiring + housekeeping (all done)
- `sitemap.xml`: +3 essays (holy_spirit, analogies, relations) + ev-m-relations + name-the-heresy.
- `library/index.html`: Trinity section 10→13 essays, 3 new libcards, ItemList schema pos 71–73.
- `library/related.json`: 3 new entries + cross-linked into siblings.
- **All 13 Trinity mastery pages now read "N of 13" consistently** — this also fixed **pre-existing stale
  dial-counter drift** (an earlier of-10→of-12 bump had only fixed the libnote, not the JS dial strings).
- `ev-s6.html` content-review stamp refreshed to 2026-07-11 (records all 5 new cards + pathway).

## Method notes (repeatable — this is how the whole session ran)
- **New essay** → `apologia-author`/`apologia-evidence` drafts in the house template (copy an existing
  `library/*.html` scaffold; numbered footnotes + bibliography; `orthonote.js`) → parallel
  citations+argument gates → apply fixes → `apologia-orthodoxy` final gate → stamp → wire → deploy.
- **Card** → `apologia-evidence` compresses the *gated* essay into the exact `ev-s6` card DOM (study two
  existing cards; copy boilerplate; unique slug for tutor/pocket/DOM ids) → gate the compressed card content
  (argument + orthodoxy — card content is NOT exempt) → splice + renumber `cnum` via script → re-stamp.
- **Bridge cards** (04, 09) reuse an existing gated essay+mastery for their deep links (no duplication) but
  get a **unique tutor slug** (`jesus_as_god_nt` is fine to reuse for links; `constantine_myth` is a new
  slug) to avoid inline-tutor DOM-id collisions within the one fragment. Bridge cards are NOT counted in the
  Trinity mastery track (they route mastery to the Jesus / early-church track), which is why the track is 13,
  not 15. `api/tutor.js` builds its prompt generically from `data-arg`, so any new slug is safe.
- **Splice pattern:** anchor on a unique header string (NOT a title that also appears in the line-1 stamp —
  that bit me once), insert, then `re.sub` renumber all `<div class="cnum">NN</div>` in document order.
- The recurring real defect the gates caught, again and again: **paraphrases dressed as verbatim quotes**
  and **compression overreach** (e.g. "perichoresis *secures* the unity" — classically the one essence
  grounds it, perichoresis *manifests* it; this snuck into a share-card PNG and had to be fixed).

## Open / owed (carry forward)
- **Human/pastoral + scholarly sign-off** on all this Christology — the automated orthodoxy gate is CLEAN
  across every artifact, but the stamps all say sign-off is still owed. Most relevant: the deity/Holy-Spirit/
  relations essays and the delicate orthonotes (John 5:26 "granted… life"; procession "from the Father";
  the John 5:26 autotheos/Reformed nuance flagged by the gate).
- Non-blocking NOTEs deferred: the ev-s2 Card 08 / ev-s4 Card 07 orthonote candidates (from the 07-09
  session) are still open; the relations essay's John 5:26 clarifier touches the *autotheos* discussion.
- The site-wide **"$8/mo → index.html#pricing"** CTA is NOT broken (I mis-flagged it early; the #pricing
  section is honest — "Coming soon / planned price"). The only nit is the button says "$8/mo" while the
  section says "planned price · launching soon" — a wording inconsistency **identical across all 7 tabs**;
  fix site-wide or not at all, never piecemeal.
- Still owed from the other 07-11 session: the **`ask_rate_limit` Supabase migration** (human step) before
  any traffic push; `RESEND_API_KEY` in Vercel; monetization is still a stub.
- **Conversion Stories (`ev-s7`)** remains intentionally unswept.

## Candidate next steps
- Human/pastoral pass on the new Trinity Christology (highest priority before acquisition).
- Roll the same treatment to the remaining Worldviews pages (JW/Mormon/Atheism) if desired.
- Produce short-form reels from the new cards (analogies "name the heresy", "did Constantine invent it",
  the Holy Spirit "shy person") — the diagnostic's shareable result-card is already a growth asset.
- Extend the guided-pathway idea (per-card anchors so the pathway links deep-link into cards).

## Deploy
`git push origin claude/session-handoff-2026-07-11-zhcjdx:main` (fast-forward). Tab head at handoff: 15 cards,
`ev-s6` + all Trinity essays/mastery stamped, `node tools/check-content-review.mjs --changed` passing.
