# Gate sweep — handover for a local (web-enabled) session

**Written 2026-07-29, at the end of the `worldviews.html` Islam-card re-certification.**
Start here, then read [`GATE_COVERAGE.md`](GATE_COVERAGE.md) for the full unstamped queue and
[`MASTERY_PAGE_AUDIT.md`](MASTERY_PAGE_AUDIT.md) for the outstanding page-specific findings.

Scope agreed with the owner: **sweep the Evidence Library first, then work outward through the
whole site.**

---

## PROGRESS LOG — per-card Evidence Library re-gate

> **2026-08-04 — ev-s4 (Biblical Reliability tab) COMPLETE. 4 of 14 tab fragments now fully re-gated.**
> The per-card **faster-mode** method (self-read card + paired certified essay → `apologia-citations`
> in discovery → `apologia-orthodoxy` + `apologia-neutrality` for verification; dual-consensus on the
> deity/Trinity/resurrection/rival-worldview tiers; re-gate after every fix pass) has cleared:
> - **`ev-s1.html`** — 12/12 cards ✅ stamped + live
> - **`ev-s2.html`** — 8/8 cards ✅ stamped + live (commit `1a1f89b`)
> - **`ev-s3.html`** — 16/16 cards ✅ stamped + live (final commit `6bad980`) — the Jesus/deity tab.
> - **`ev-s4.html`** — 11/11 cards ✅ stamped + live (final commit `b480b6c`) — Biblical Reliability
>   (manuscript, archaeology, canon, prophecy, consistency, eyewitnesses, deadseascrolls, earlydate,
>   jewishness, coincidences, names). Per-card records in the `by` note at the top of `ev-s4.html`.
>
> **NEXT, in order:** `ev-s5` Science (~7 cards), **`ev-s6` Trinity (~15 — hardest; has a known open
> BREAK re "needed the world in order to love")**, `ev-s7` Conversion (9 biographical profiles — lighter,
> citation-heavy, not argument cards), then the `.mk` mirrors. Each `ev-sN.html` carries its own
> `content-review` stamp; append per-card records to its `by` note exactly as ev-s1/2/3/4 do (⚠ use
> SINGLE quotes inside the JSON `by` string — double-quotes break the stamp JSON), and push each fragment
> to `main` as it clears.
>
> **⚠ ev-s4 lessons worth carrying:** (1) the **deadseascrolls** card ran the retired "virtually
> identical / the OT is essentially unchanged" slogan in EVERY tier including the graded premises and the
> spoken conversation script — scope all DSS stability claims to Isaiah-as-test-case / the proto-Masoretic
> STREAM, never the whole OT, and give pluriformity (Jeremiah's two editions) its due. (2) **archaeology**
> re-committed the Nuzi/patriarchal-customs trap (Thompson 1974 / Van Seters 1975) — drop it. (3) The
> **prophecy** card's Psalm 22:16 "pierced ... supported by the DSS" is the same Nahal-Hever landmine as
> ev-s3 (that fragment is ~1st-c AD, not pre-Christian; pre-Christian support is the Greek LXX only), and
> its DSS-dating test is the WRONG test for the BC-fulfilled Tyre prophecy (judge Tyre by Ezekiel's 6th-c
> composition date). (4) **Bauckham universalism fence** recurs on eyewitnesses + names — cite him as a
> historian only. **OWNER FOLLOW-UP:** the prophecy card's "read the full essay" link points to the
> MESSIANIC-prophecy essay, not its nations-prophecy subject.
>
> **Recurring landmines the sweep keeps catching** (check these first on every card): the Daniel 7:14
> *pelach* "worship" overclaim (it is homage to a sovereign — Dan 3:12 uses it of serving
> Nebuchadnezzar's gods); Colwell's rule misused to "prove" John 1:1c (it is about definiteness — the
> qualitative reading is Harner/Wallace); Markan priority (Matthew/Luke are NOT independent of Mark, so
> "multiple attestation" and "third day across all three Synoptics" over-count one source as three);
> "virtually all scholars" overstatement; fabricated skeptic-praise quotes; Stoner-style prophecy odds.
> **ESSAY-LEVEL FOLLOW-UP owed:** `library/titles.html:185` still states the *pelach* claim backwards
> (flagged on ev-s3 CARD 08). **Human/pastoral sign-off remains PENDING on all re-gated cards.**

---

## 0. Read this first — what a local session does and does not buy you

Tested from the sandbox on 2026-07-29. Every primary-source host answers **403 to CONNECT**
(organisation egress policy, *not* a TLS or config problem — do not retry, do not touch
`HTTPS_PROXY`):

```
ccel.org · en.wikisource.org · sunnah.com · quran.com
biblegateway.com · plato.stanford.edu · biblicalstudies.org.uk · tyndalehouse.com
```

**But the agents are not blind here.** `WebSearch` worked throughout today's sixteen rounds and did
real work — it established that *sabaqat raḥmatī* is Bukhārī 3194/7422, Muslim 2751 and the first of
the Forty Ḥadīth Qudsī, and that the Hidden Treasure tradition is judged *lā aṣla lahu* by
al-Sakhāwī. Both findings changed the page.

**The line that matters is VERIFICATION vs RESEARCH.** A search snippet establishes that a passage
exists and roughly what it says. It does not confirm wording byte-for-byte against `source_url`,
which is the bar `/sources` sets for flipping `verified:false` → `true`. That is exactly why
`apologia-citations` refused on 2026-07-29 and its material was **kept off the page** rather than
published.

So: **run the doctrinal sweep anywhere — it only reads repo files.** Save the local session for a
single batched citations pass over everything the sweep accumulates. Switching early means doing the
doctrinal work in an environment with no advantage for it, and hitting citation questions piecemeal.

⚠ **Verify one URL from the local machine before planning around it.** If it is the same corporate
network, it will hit the same 403s.

### What genuinely needs the web-enabled session

| Debt | Why |
|---|---|
| **6 `/sources` passages still `verified:false`** (creeds + Athanasius §54) | CCEL/Wikisource blocked. **Live-consumed** — `verified:true` puts wording into `/api/ask` answers. |
| **al-Ṭabarī on *rūḥ min-hu*, Surah 4:171** | Deliberately unpublished 2026-07-29. |
| **Wahb b. Munabbih / Ibn Isḥāq three-hours death report, 3:55** | Same. |
| **Surah 58:22 pre-emption** (the only other *rūḥin minhu*, said of believers) | A reader may raise it; we cannot answer it unverified. Best single source: Neal Robinson, *Christ in Islam and Christianity* (SUNY 1991). |
| **`scholars.html`** — 32 named, mostly living people | Characterising a living scholar's position must not rest on snippets. |
| **The P2 continuity-and-cost argument** | `apologia-citations` runs on all five Qur'anic references **before drafting, not after**. |
| **~a dozen CHECK-level page-cites** | Need a human with the physical books. |

---

## 1. State at handover

`worldviews.html` is **stamped** — dual consensus complete on all fifteen Islam cards, 0 heresy,
sixteen fix rounds. It has cleared `check-stamp-integrity`.

All mechanical gates green: **suite 93/93** · retired claims **24 registered, 0 alive on 437 files**
· orthodoxy tripwires 0 new · answer-openings clean · answer-concessions clean.

Three files remain flagged by `check-stamp-integrity` — all known, all edited past their stamps
during the cross-surface fixes:

```
ev-s6.html · ev-m-trinity_islam.html · library/islam-preservation.html
```

### ⚠ Correction to CLAUDE.md's OPEN list

CLAUDE.md still says `library/islam-eternalword.html` owes a neutrality pass. **It does not.** Its
stamp records that `apologia-neutrality` ran **three times on 2026-07-29**, returned NOT STAMPABLE
twice, and certified on the third — catching that the essay ran the *kalām*/*kalima* equivocation its
own Reply 3 disclaims, and that the Ashʿarī formula had been silently upgraded from "neither He nor
other than He" to "neither God nor other than God."

**But its `argument` and `orthodoxy` date fields still read `2026-07-14`** — the note was appended
without bumping the dates. Fix that when the file is next opened, and treat it as the general
warning: *a date field and a `by` note can disagree, and the tooling only reads the dates.*

---

## 2. The Evidence Library sweep — ordered

The Evidence Library is four layers: the hub (`evidence-library.html`), 14 tab fragments (`ev-s*`),
67 mastery pages (`ev-m-*`), and 86 essays (`library/*`).

### P1 — start here

| # | Target | State | Why first |
|---|---|---|---|
| 1 | **`ev-s6.html`** (40,018 words) | Stamped 2026-07-23, **edited past it**, and `apologia-neutrality` returned **BREAK** on 2026-07-29 | Free, indexed Trinity tab. It asserts the neediness charge card 14 *explicitly disclaims* ("He would have needed the world in order to love"), carries **no** contested-hinge caveat, answers only the **weakest** Muslim reply (omitting al-Ghazālī's self-love, which the essay calls the strongest), and runs unreframed shared-monotheism at `:954`. Two free indexed pages, one argument, flat contradiction. |
| 2 | **`ev-s7.html` + `ev-s7.mk.html`** (~4,400 words each) | **NO STAMP** | Already inside `CONTENT_PATTERNS` — unstamped only because CI diffs rather than audits. The last two files failing `--audit`. Conversion stories: `apologia-citations` matters as much as orthodoxy. |
| 3 | **`ev-m-trinity_islam.html`** | Stamped, **edited past it** | Two lenses converged on it in the 07-28 audit. Two rewrites still owed with the essay open: `:368` ("The verse does **not** say Jesus was created BY a word") contradicts what `library/islam-jesus.html:166` and worldviews card 04 both grant as the standard *kun*/3:59 reading; `:395` runs the lexical move card 04 forbids. |
| 4 | **`library/islam-preservation.html`** | Stamped 2026-07-23, **edited past it** | Four-word fix on 2026-07-29 closed the last `allow` entry in the retired-claims registry. |
| 5 | **`library/index.html`** (~3,400 words) | **NO STAMP** | Explicitly excluded by the `(?!index\.html$)` clause in `CONTENT_PATTERNS`. Carries framing prose, not just links. **The exclusion must be removed in the same commit as the stamp.** |
| 6 | **`evidence-library.html`** (981 words) | **NO STAMP** | The hub itself. Small; decide stamp-vs-exempt and record the reason in `EXEMPT`. |

### P2 — never red-teamed, and all are dual-consensus tier

Six files carry `argument` + `orthodoxy` but **no neutrality pass**, confirmed by reading their `by`
notes:

```
library/islam-contradictions.html   (2026-07-14)
library/islam-guard.html            (2026-07-14)
library/islam-hadith.html           (2026-07-14)
library/islam-naskh.html            (2026-07-14)
library/islam-sira.html             (2026-07-14)
library/trinity_jw.html             (2026-07-16)
```

`library/islam-eternalword.html` was in this list until 2026-07-29 — and when the red-team finally
ran it took **three rounds** and found a live equivocation. Assume the same of these six.

### P3 — the Macedonian mirrors

`ev-s1.mk` … `ev-s6.mk` (~98,000 words total) are stamped `argument` + `orthodoxy` but **none has a
neutrality pass**, and per CLAUDE.md **none has ever been read by a native speaker**. They are
AI-translated. Do not treat a stamp on a translation as covering the translation's *fidelity* — the
gate read the doctrine, not the Macedonian.

### Stamp-date staleness (context, not a queue)

`ev-s1` and `ev-s5` are stamped **2026-07-09**; `ev-s2`/`ev-s3`/`ev-s4` **2026-07-16**. Everything
retired on 07-28 and 07-29 post-dates them. `ev-s3` (49,598 words, the largest file in the Library)
also has **no neutrality mention** in its note.

---

## 3. Then outward — the rest of the site

Ordered by risk = how doctrinal × how far it travels. Full detail in `GATE_COVERAGE.md`.

1. **`scholars.html`** (5,214 words, no stamp) — the longest ungated page. 32 profiles of named,
   mostly living people, including **Ehrman and Dawkins** (how we describe opponents) and **Francis
   Collins** (recruited on the pocket cards as a premise in an ID argument he founded BioLogos to
   oppose — check whether this page repeats it) and **Bauckham** (standing universalism fence: cite
   as a historian on a historical question, never as a theological authority, never in a
   further-reading list without naming the specific work).
2. **`pocket-cards.html`, `flashcards.html`, `explain-it-back.html`** — the memorised/recall layer.
   `pocket-cards` was gated 2026-07-28 with fixes applied and **the stamp never landed**. For each:
   **the stamp and the `CONTENT_PATTERNS` entry must land in the same commit**, or CI fails on the
   missing stamp.
3. **The game/quiz layer** — `daily-mix`, `daily-quiz`, `speed-round`, `who-said-it`, `challenge`,
   `objection-deck`, `objection-catcher`, `argument-map`, `glossary`, `palace`. Highest surprise
   value: `daily-mix.html` was running a retired argument as the **graded correct answer**, so a
   reader was marked wrong for not reciting it. Body-word counts lie here — the doctrine is in a JS
   object or a fetched JSON file.
4. **Feature pages** — `about`, `parents`, `beginners-path`, `debate-arena`, `games`, `study-plans`.
5. **The 6 unstamped X share-cards** (`tools/reel/xcards/*.json`). Fast. Three need wording fixes
   first (recorded in `SOCIAL_GROWTH_PLAN.md`); `x-jesus-god-mark` and `x-nicene-creed` are
   dual-consensus.

---

## 4. Method — what the 2026-07-29 rounds actually proved

### Per-file for doctrinal prose; batch for data-shaped pages

**Per-file** = one agent invocation per file, reading it in full **alongside its paired certified
essay** as the benchmark. **Batch** = one invocation over several related files.

The single highest-value finding class all session was *"the compressed page asserts what its own
certified essay concedes."* That needs the essay open beside the page, and a batched agent holding
eight benchmark essays flattens to generic doctrinal review — which finds heresy but not drift.
Per-file agents also did things batched ones don't: neutrality **read the CSS** to confirm a
"(see premise 5)" pointer resolved to a visibly-numbered list item; orthodoxy **checked all four
listed objections had matching rows** before accepting a claim that they did.

So: **per-file for P1 and for anything with a benchmark essay. Batch the P2/P3 data-shaped pages**,
where the job is largely "diff this JS object against the certified source."

### The third pass neither mode gives you: sibling-surface checks

Card 12 was certified by a per-file round **earlier the same day** and still carried a false promise.
It was found only by grepping a phrase across the page after deleting it from card 14. Budget a
cheap, mechanical, grep-driven pass over the whole corpus for: retired claims, false promises,
overstated consensus, and the phrases the sweep retires as it goes.

### Resolve the paired essay by `<link rel="canonical">`, NOT by filename

This cost three agents' work on 2026-07-28:
`minimal`→`minimalfacts` · `paul`→`paulconv` · `postresurrection`→`postres` ·
`messianic_prophecy`→`messianic-prophecy`.

### Diff the four invisible layers BEFORE reading the prose

Nine parts make up a mastery page and **four are invisible to a doctrinal gate**: `ARG_PREMISES`
(POSTed to `/api/tutor` as the rubric a reader is **graded against**, and rendered into a
downloadable share-card PNG), the `cards` flashcard deck, the mock-scorer `checks` regexes, and the
drill model answers. A prose fix is not a fix.

### A fix pass re-opens the gate, and cannot be its own verifier

On 2026-07-29 this was violated five times and the next lens found something every time. **Eight
consecutive rounds produced their successor's findings** — including a factual claim about the NWT
invented while correcting a different factual claim, and the *kalima*/*rūḥ min-hu* conflation
returning eight rounds later inside a clarifier box written to fix something else.

### Stop condition

Not "a round with zero findings" — on a dense file that round may never come, and waiting for it is
how you stamp out of fatigue. **Stop when a round returns nothing doctrinal and nothing factual —
only NOTE-level polish.**

### When the two lenses disagree, decide and record it

They did today, on the same sentence: orthodoxy wanted Romans 5:8 **added** to the gracious close;
neutrality had ruled that same contrast retired and wanted it **deleted** elsewhere. Taking
orthodoxy's structural fix without its replacement sentence satisfied both — and orthodoxy later
withdrew its own proposal: *"Neutrality's reasoning holds and I should have caught it myself."*
**Do not average the two lenses. Resolve, apply, and put the resolution in the commit message.**

### Two traps that cost real time today

- **Python cannot compile variable-length lookbehind.** The retired-claims patterns are JS-only.
  Verify with `node`, never `python3 -c "re.compile(...)"`.
- **Narrow greps lie.** My card-12 grep for "dignity" returned zero because the deep dive words it
  "beneath God" and "majestic." The same failure is on record for `ev-m-kalam.html`. Grep the
  *concept* in three wordings before concluding something is absent.

---

## 5. Commands

```bash
# after EVERY content edit pass — a stray apostrophe in a single-quoted JS string
# has killed an entire inline block three times
node --test tests/*.test.mjs

# the blocking gates
node tools/check-content-review.mjs --changed origin/main
node tools/check-orthodoxy-tripwires.mjs
node tools/check-retired-claims.mjs          # --list to read the registry
node tools/check-answer-openings.mjs
node tools/check-answer-concessions.mjs

# coverage + drift reports (non-blocking)
node tools/check-content-review.mjs --audit-all
node tools/check-stamp-integrity.mjs --warn

# after retiring a claim: add it to tools/retired-claims.json WITH a
# corpus.must_fire / corpus.must_not_fire, which the suite executes
```

**Deploy:** work on the feature branch; **never `git checkout main`** (a stale local main lacks
`.claude/agents/` and de-registers the agent fleet). Ship with
`git push origin <branch>:main`.

---

## 6. Two owner decisions the sweep will keep hitting

- **`.wv-pro` on `worldviews.html` is not paywalled.** `toggleArg()` only opens and closes — no
  `isPro` check, no `display:none` — so every "Pro — Deep Dive" tier on that page is publicly served
  and indexed behind a decorative "launching soon" prompt. Product decision or paywall defect. Until
  it is settled, **gate those tiers at free-surface stakes** (every 2026-07-29 round did).
- **Pastoral / elder sign-off is still `_pending_`** in `STATEMENT_OF_FAITH.md`, on all 67 mastery
  pages and the whole Islam cluster. Both gates are automated and neither is that sign-off; the
  stamps say so, and `editorial-standards.html` discloses it publicly. Start the human reviewer on
  **`ev-m-trinity_islam.html`**.
