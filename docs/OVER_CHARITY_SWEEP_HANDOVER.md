# Over-charity + fact-check sweep: handover (written 2026-09-29)

This is an owner-directed, tab-by-tab sweep of the Evidence Library. Read this file before continuing the sweep.

## The standard (owner's words, applied to every page)
- **Nothing too charitable to the other side, and no praise beyond sincerity.** Concede sincerity and accurate facts only. Never concede the opponent's frame, the soundness of a mistaken inference, or an unearned symmetry. No "same Jesus", "same God" or "common ground" (see the CLAUDE.md FALSE-COMMON-GROUND rule).
- **Every objection answered at full strength.** State the strongest form first, then answer it.
- **An own-voice verdict that the historic Christian position is true, honestly bounded.** The model is: "this argument clears the charge; the positive case rests on revelation and the resurrection". For resurrection content that means a bounded "Jesus rose bodily" verdict. Never overclaim.
- **Added by the owner for every tab from the Jesus tab onward:**
  1. A whole-page **web fact-check** of every quotation, citation, date and number (verified, wrong, or unverifiable with a fallback). Never keep an unverifiable claim.
  2. A **research-library cross-check** against docs/book-research, video-research and article-research notes. It looks for conflicts, "do not use" or hazard sources, stale ledgers and stronger material. Notes are leads, not authorities.
  3. A **copy-edit and broken-link pass**.
- **When an objection is added**, the owner requires it to be stated fairly, answered thoroughly and clearly refuted, ending in an explicit verdict. Gates must rate every refutation STRONG.
- **Fix before moving on.** Before starting the next tab, the owner wants that tab's logged issues fixed, apart from low-priority objections. Ask whether to proceed rather than assume.

## Status

### Done and live
| Tab | Essays | Cards | Mastery | Mirrors |
|---|---|---|---|---|
| Trinity (ev-s6) | 16 | 17 | 15 | MK cards; ES cards 10–13 |
| Islam | 16 | 15 (worldviews.html) | (trinity_islam, done with Trinity) | — |
| Jesus (ev-s3) | 21 | 22 (+ev-s3.mk) | 21 | MK+ES essays hist_jesus, jesus_claims |
| Resurrection (ev-s2) | 8 | 8 (+mk, +es) | 8 | MK+ES essays minimalfacts, emptytomb, paulconv |

The following were also done:
- 9 new objection sections plus 2 sources (commit 850a934e).
- Full rebuilds of 5 MK essays and the ES Resurrection cards (00607a9e).
- Stale-note fixes.
- Citation fixes.

Key commits: e1d48130, 8837947f, a943383c (Jesus); 790641b4, 42d06b8f, 51589c4c (Resurrection).

### Next, in the owner's order
1. ~~**Biblical Reliability (ev-s4)**~~ — ✅ COMPLETE 2026-10-01 (essays 185d2045; cards + MK/ES mirrors + 11 mastery pages in the 2026-10-01 commit). Leftovers: docs/BIBLICAL_RELIABILITY_SWEEP_BACKLOG_2026-09-29.md
2. ~~**God's Existence (ev-s1)**~~ — ✅ COMPLETE 2026-10-02 (essays b33206c0; cards + MK/ES rebuilt 0575b1ab; 12 mastery pages acfbfbb6). Leftovers: docs/GODS_EXISTENCE_SWEEP_BACKLOG_2026-10-01.md
3. **Science & Faith (ev-s5)**
4. **The Christian Revolution (ev-s8)**

ev-s7 has no cards. For each tab work in this order: **essays → cards (+ ev-sN.mk.html / .es.html) → mastery pages (ev-m-*)**. Find a tab's essays and mastery pages from the card links in ev-sN.html. Resolve each mastery page's essay by its `<link rel="canonical">`, not by filename.

### Offered, not yet requested
Trinity and Islam never got the whole-page web fact-check or the library cross-check. Offer to run them.

### Open, deliberately not done
- **Book-only page checks:** Brown, *Death of the Messiah* 2:1207; Maier, *In the Fullness of Time* p. 203; and others in docs/JESUS_TAB_SWEEP_BACKLOG_2026-09-29.md.
- **Low-priority objections:** the owner said **do not do these**.
- **Native MK/ES doctrinal review and pastoral sign-off** are still pending, as they are site-wide.

## Method that worked (per tab)
1. **Hash every target file first** (`md5sum ... > $TEMP/md5_x.txt`) and re-check after each read-only round.
2. **Essays, round 1:** run three read-only **Explore** agents per group of about 3 essays, in parallel:
   - **(a) four-lens review.** Read `.claude/agents/apologia-citations.md`, `apologia-argument.md`, `apologia-orthodoxy.md` and `apologia-neutrality.md`, plus the CLAUDE.md guardrails.
   - **(b) live web fact-check.**
   - **(c) library cross-check, copy-edit and links.**

   **Never use general-purpose agents for gates.** They have write access (CLAUDE.md 2026-08-17 hazard).
3. **Fix scripts:** use one **general-purpose** agent per essay. It writes an assert-guarded Python script (`R(old,new,count)`, `io.open(..., encoding='utf-8', newline='')`) and tests it on a **scratch copy only**, with an explicit "do NOT edit the repo; no git" rule. It must use the gate's replacement text VERBATIM, port certified wording wherever it can, and list every AUTHORED string.
4. **Apply the script yourself** after confirming the repo file still matches the snapshot. Then confirm the result is byte-identical to the agent's tested copy (`cmp`).
5. **Mechanical checks:**
   - `node tools/check-orthodoxy-tripwires.mjs`, `check-retired-claims.mjs`, `check-unquoted-attributions.mjs`, `check-footnote-integrity.mjs` and `check-mirror-parity.mjs`.
   - `node --test tests/inline-script-syntax.test.mjs`
   - The full suite `node --test tests/*.test.mjs`. **12 failures are known and Windows-only** (CORS, verifyUser, deleteAccount); any other failure is real.
   - Ehrman's *How Jesus Became God* title keeps tripping `jesus-became-god`. Accept it with `--update` after confirming it is a book title.
6. **Confirmation round:** read-only Explore agents review the changed hunks (word-diffs vs the snapshot). A fix pass always re-opens the gate. Repeat with a narrow final gate until everything is STAMPABLE with 0 HERESY. Expect 3 rounds.
7. **Stamp** each file's `<!-- content-review: {...} -->` JSON. Set citations, argument, orthodoxy and neutrality to today's date, and prepend a factual note that also says what did NOT run.
8. **Regenerate:**
   - `node tools/build-essay-index.mjs`, `build-our-sources.mjs`, `update-trust-numbers.mjs`, `list-clarifiers.mjs`
   - `build-briefs-index.mjs` if briefs changed
   - The dateModified sync. **Gotcha:** `tools/sync-date-modified.mjs` finds 0 files on Windows because of its quoted `git ls-files`. Import its `syncHtml` and `latestReviewDate` and run them over `git ls-files *.html` yourself.
9. **Mirrors in the same commit** (CLAUDE.md standing rule):
   - **Cards:** `ev-s3.mk` and `ev-s2.mk` matched the English tag structure exactly, so rebuild by **segment alignment**:
     1. Map old-EN text runs to MK runs.
     2. Translate only the new EN runs with agents (JSON in, JSON out).
     3. Rebuild on the new EN tag structure.
     4. Run a fidelity and orthodoxy check; it always finds tag-join grammar slips such as dropped negations.
   - **Essays and older ES files** have different structures. Use targeted passage sync scripts, or a full rebuild from the certified English followed by a fidelity check.
   - Stamp every mirror "AI-translated, pending native-{lang} doctrinal gate".
   - Log any gap you do not fix in docs/content-backlog.md.
10. **Mastery pages:** diff the GRADED layers first: `ARG_PREMISES`, the flashcard `cards`, the `checks` regexes, drill model answers, chips, and SEO/meta/JSON-LD. Test every changed regex with node: the corrected answer must score, and a retired or overclaimed answer must not. In single-quoted JS strings write apostrophes as `’`.
11. **Commit and push:**
    - Commit per surface with a factual message that ends with the Co-Authored-By line.
    - Run `git fetch && git rebase origin/main`, then `git push origin HEAD:<branch> HEAD:main`. **Avoid `--autostash`.** It once rewrote line endings; restore exact bytes if that happens.
    - After a rebase, re-check that the in-progress files are byte-identical to your tested copies.
12. **Save every agent report** from the workflow journal to the scratchpad. Use the full label as the file name so reports with the same number do not overwrite each other.

## Recurring findings to look for
- Consensus overclaims: "virtually all", "near-universal", "nearly everyone" should become "the great majority".
- Pull-quote concessions: "fair", "serious", "deserves", "reasonably", "defended by serious people".
- Implied rather than landed verdicts.
- Retired claims (`node tools/check-retired-claims.mjs --list`), including the new `agent-never-shared-throne-or-name`.
- Ehrman answered on date instead of rank (retired `ehrman-preexistence-is-late`).
- The Moss martyrdom bound: martyrdom shows sincerity, not truth ("willing to suffer").
- Scripture quoted in a translation other than the one cited, e.g. NIV wording under an ESV citation.
- Misattributed quotes, e.g. "historical bedrock" is Licona's, not Sanders'.
- 1 Peter 3:15 credited to Paul.
- Fixes that land in one tier (free / plain English / how to explain / in conversation / Pro / research rows / FAQ + JSON-LD twin) and not in the others. Grep every tier.
- Stray orphan `</div>` tags in card files. Check per-card div balance and browser-verify the tab with the Browser preview.
