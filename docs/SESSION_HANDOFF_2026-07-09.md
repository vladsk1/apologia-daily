# Session handoff — 2026-07-09 (WEB session)

_Read this + `CLAUDE.md` + `HANDOFF.md` to resume. Everything below is **deployed to `main`**.
This was a **web** session on `claude/short-form-reels-generator-tjpymt`; deploy rule unchanged
(work on a feature branch, **never `git checkout main`**, deploy by `git push origin <branch>:main`)._

## ⚠️ READ FIRST — scope, and what NOT to re-do

This handoff covers **only the web-session work below.** It deliberately does **not** restate the
**Dr. Del Rosario reading-club demo**, because that was **built straight from the book in a
separate LOCAL session** and is already on `main` and current.

- **Del Rosario demo — DONE FROM THE BOOK (local session, do NOT re-open or regress).**
  `demo/del-rosario-companion-study.html` was rewritten/verified against a **complete page-by-page
  read of the actual book** (commits `497acb9`, `815adff`). Its live status + remaining steps live
  in **`docs/DEL_ROSARIO_READING_CLUB.md`** and in that file's own `content-review` stamp — treat
  those as the source of truth. **Do not re-summarise, re-build, or "resume from the book" as if it
  were still paused.** The only change to that file in THIS web session was a one-word cosmetic
  rename ("Ask Anything" → "Asked & Answered") in its optional-resources line, as part of the
  site-wide rename below. Its remaining owed items (dedicated `apologia-argument` +
  `apologia-orthodoxy` gates before public launch; swap the Get-the-book link for his
  apologeticsguy.com affiliate link; optional orthonote clarifier; human/pastoral + author review)
  are tracked in `DEL_ROSARIO_READING_CLUB.md`, not here.

## What this WEB session shipped (all live on `main`)

### 1. Evidence Library recheck — Trinity, Jesus, Islam, Resurrection, Biblical Reliability (four-agent pipeline)
Ran the full pipeline — **`apologia-citations` + `apologia-argument` + `apologia-neutrality` +
`apologia-orthodoxy`** — on **five** tabs' **card tier** (the compressed
"Case, Plainly" / mastery boxes / daily-args), benchmarked against the already-audited essays.
**Result across all five: zero BREAK, zero heresy; every final orthodoxy gate CLEAN.** The
essays were already clean; the drift lived only in the compressed card tier, and it was
quotation-precision + overstatement, never heterodoxy.

- **Trinity tab** (`ev-s6.html` + `daily-args.json` Trinity entries): un-grouped
  Plantinga/Craig/Swinburne (dropped the ambiguous bare "Plantinga" — Alvin has no Trinity model;
  the social trinitarian is Cornelius Plantinga Jr.); removed two **unsourced JW scholar quotes**
  (F.F. Bruce, Metzger) → paraphrase; neutralised the one-sided burden-of-proof framing; fixed
  "fully contains" → "fully indwells… one undivided divine life"; softened proskuneo/allon/echad;
  corrected "175 years" → 218, the Lorenzo Snow couplet, Athanasius "Letters" → "Orations".
- **Jesus tab** (`ev-s3.html` + `daily-args.json` Jesus entries): corrected **5 misquoted
  scholars** — composite **N.T. Wright** quote → his genuine wording; fabricated **James Dunn**
  "historical bedrock" (×2) → his real "formulated as tradition within months of Jesus' death";
  altered **C.S. Lewis** line restored; **Wallace** John 1:1 restored; **Mantey** tightened with
  the second clause attributed to **Metzger**. Reframed two overstated headers (Daniel 70 Weeks →
  the durable *sequence*; Virgin Birth → the two independent traditions). Flagged Psalm 22:16
  "pierced" as the Greek/DSS reading vs Masoretic "like a lion"; softened
  "dissolves"/"empty-tomb-acknowledged-by-enemies"; fixed John 10:39, the Pliny framing, the
  Mark-has-no-appearances point; hardened the John 1:1 anarthrous concession (pull-quote test).
- **Islam Case tier** (`worldviews.html`, Islam section only — JW/Mormon/Atheism untouched):
  fixed the **Josephus citation** (Antiquities 20.9.1 → **18.3.3**, the Testimonium); card count
  13 → **14**; renumbered **6 stale cross-references**; steelmanned the rhetorical Surah 10:94
  reading (card 01); added the 11:81 grammarian-merge concession (card 07); softened the hadith
  600k/"99%" overstatement (card 09, "exclusion ≠ forgery"); restored **denominational neutrality**
  on Surah 5:116 ("folk Catholic practice" → a heterodox sect, the Collyridians). The **4:82
  self-issued-standard framing and all deity/Trinity cards were confirmed CLEAN.**
- **Resurrection tab** (`ev-s2.html` + `daily-args.json` Resurrection entries): de-quoted the
  recurring paraphrase-as-verbatim defect — **Licona** ("most plausible" → *best historical
  explanation*), **two Raymond Brown** quotes → his real "very probable / almost inexplicable,"
  **two Meier** quotes, and a phantom **Dunn** "historical bedrock." Corrected a real
  **misattribution**: the tab had **Meier applying multiple attestation to the resurrection**, but
  Meier deliberately *brackets* the resurrection out of historical method → now flagged as our
  inference. The one argument **BREAK**: the empty-tomb card asserted "the tomb was empty —
  conceded by enemies" while omitting the strongest sceptical thesis, so **imported the
  Crossan/Ehrman "no honourable tomb at all" objection + reply** from `emptytomb.html` and reframed
  to "*if* the tomb was empty." Softened the "cannot hallucinate" absolutes and **added Dale
  Allison** as the serious visionary-hypothesis critic; qualified the martyrdom traditions ("by
  strong early tradition"); **cut the uncertified Shroud of Turin deep-dive down to a neutral
  we-take-no-position note**; softened Sabbath→Sunday. Creed dating already correct (own voice
  "~2–5 years"; Dunn's "within months" attributed only to Dunn).
- **Biblical Reliability tab** (`ev-s4.html` + `daily-args.json` Bible-reliability entries): fixed
  a genuine **factual error** — "a 6th-century Deutero-Isaiah would still be writing before Cyrus's
  birth" is false (Cyrus b. ~600 BC) → rewrote to rest on the traditional dating + the
  naming-in-advance point that holds either way. Added the honest **Tyre caveat** (Ezek 29:18 —
  Nebuchadnezzar got no plunder; a settlement at Tyre exists today); **scoped the Dead Sea Scrolls
  point to *dating*, not the Servant's identity**; softened "could not have been invented" /
  "cannot be a coincidence" / "strongly confirmatory"; noted the Muratorian minority late-dating;
  made **preservation ≠ truth** explicit in the category intro; softened the Da Vinci Code
  "historically illiterate" tone. In `daily-args.json`: reconciled the **discredited Caesar/Plato
  manuscript counts** (10/7 → ~250/~210, matching the card), restored dropped words in the
  **Albright** quote, de-quoted the **Ehrman** canon paraphrase.
- Both `ev-s2.html` and `ev-s4.html` newly stamped (they had no `content-review` stamp before);
  `ev-s3.html` and `worldviews.html` re-stamped recording all four passes.
- **Two optional `orthonote` clarifier candidates deferred to the human/pastoral pass** (both gate-
  judged CLEAN, "not needed for deploy"): `ev-s2` Card 08 high-Christology clause; `ev-s4` Card 07
  Servant-identity clause. Same treatment as the Trinity/Islam NOTE items.

### 2. New permanent fleet agent — `apologia-neutrality`
`.claude/agents/apologia-neutrality.md` — an adversarial red-team reviewer for high-stakes pages
that hunts the failure modes a single automated pass misses: **false grouping of distinct
scholars, one-sided burden-of-proof framing, over-warmth toward a doctrinally risky model,
overstated consensus, and compressed-tier drift from the vetted essay.** Read-only. Built after two
external reviews caught exactly these on the Trinity card. It's now registered and was used in the
Jesus/Islam rechecks.

### 3. Trinity-essay clarifier sweep (all 10 deep-dive essays)
Ran `apologia-orthodoxy` in clarifier-mode across the 10 Trinity essays. The 6 already-clarified
essays are correctly fenced; `ot_trinity` + `early_church_trinity` are genuinely self-fenced (need
none); **2 clarifiers added** (gated CLEAN): `philosophical_trinity.html` (monarchy-of-the-Father /
"derive their personal origin from the Father", filioque-neutral) and `trinity_islam.html`
(fencing the conclusion's "two people who both love the one God" against a "same God" reading). Also
tightened `philosophical_trinity` (monarchy wording + added the *opera ad extra indivisa* paragraph)
and added an orthonote on the Card-10 "aseity granted by the Father" line in `ev-s6.html`.
Registry regenerated: `docs/clarifiers.md`.

### 4. Asked & Answered — follow-up questions + scroll fix
`asked-and-answered.html`: added **follow-up questions** (after an answer, "Ask a follow-up" jumps
back to the top ask box with the prior question shown as context; the prior Q+A is folded into the
`/api/ask` request so the AI continues the thread — no `api/ask.js` change). Fixed the mobile scroll
so a new/follow-up answer lands at the top, and the button shows an "Answering…" state.

### 5. `parents.html` improvements
Added the standard **AI disclaimer** under the "how do I explain this to my kid?" tool; reframed the
3–6 & 7–9 "Go deeper" links as **parent-prep** (not "go deeper together" with a toddler); added a
one-tap **example**; rewrote the college-prep CTA to lead with what exists today; **linked 13 of the
age-band questions to matching `/answers/` pages**; and **fact-checked + fixed** the worldview-stats
block (removed a misattributed "~85% set" figure; softened the 8–12 label).

### 6. Site-wide "Ask Anything" → "Asked & Answered" cleanup + localized nav
Renamed the lingering "Ask Anything" name/links across non-gated pages (index, beginners-path,
daily-quiz, study-plans, dashboard, signup, terms, privacy, the Del Rosario demo's optional line);
gated essays are relabeled at runtime by `ad-nav.js`. Added the standard site nav to the **Spanish
and Macedonian library index pages** (`library/es/index.html`, `library/mk/index.html`) — they had
no way back to the main site — and gated their localized titles (orthodoxy CLEAN + argument sound).

### 7. Pastoral "see a pastor" note on every AI answer
Added a light, muted note at the **top of every live answer** on `asked-and-answered.html` and the
homepage hard-question modal: for study, not personal/pastoral/medical/legal advice — for real
doubt, talk with a pastor. Full disclaimer stays at the bottom.

### 8. Creed-dating audit (no change needed)
Audited how the site dates the **1 Corinthians 15:3–7 creed**. Conclusion: our **own voice already
says "within a few years / ~2–5 years"** everywhere (essays, `api/ask.js`, cards, games, the
guardrail); **"within months" is always attributed to Dunn** as his early-end position (accurate).
There is **no** unattributed "months" claim in our own voice — the one that looked like it
(`ev-m-earlycreed.html` line 427) is the **Dunn row of a scholar table**. So nothing changed. For
the Del Rosario demo: represent **his** ~5-year framing from the book, keep our own voice at "a few
years."

### 9. Philippians 2 "deity of Christ" reels (make-reel) — 2 specs, gated CLEAN
Built two short-form vertical reels from the certified `library/phil2.html` essay via the `make-reel`
skill (`tools/reel/gen_reel.py`). Both passed **apologia-argument + apologia-orthodoxy** (CLEAN /
SOUND) and carry a `reviewed` stamp:
- **`tools/reel/specs/phil2-deity.json`** — the "four hidden Greek words" cut (morphē, harpagmos,
  ekenōsen/kenosis, Kyrios). NOTE: the user hand-edited this spec (hook → "worships Jesus as God";
  the Kyrios scene states "is the divine name itself" flatly) — **that edit is intentional, keep it.**
- **`tools/reel/specs/phil2-everyknee.json`** — the user's preferred recut: **Isaiah 45:23 as the
  centerpiece** ("every knee shall bow" — YHWH's exclusive-worship oath applied to Jesus), other
  Greek words trimmed to one nod, **slower pacing** (~67s, longer holds, 0.9s crossfades). The
  "name above every name" scene was deliberately reworded to route confidence through the
  **uncontested facts** (Jesus is confessed *Kyrios*; *Kyrios* is the LXX word for YHWH) instead of
  the hedged "almost certainly the divine name" — a change both gates rated an *improvement* (states
  Christ's deity confidently while staying honest about the one contested exegetical sub-point).
- **⚠️ The rendered MP4s do NOT travel through git** — `tools/reel/output/` is git-ignored. Only the
  **specs** are committed. To recreate the videos locally: `cd tools/reel && python3 gen_reel.py
  specs/phil2-everyknee.json --theme navy` (also `--theme parchment`, `--aspect square|wide`). The
  finished MP4s were delivered to the user in-chat. A ready-to-post **TikTok caption + voiceover**
  script for the everyknee cut was written in-chat (not committed) — regenerate or ask if needed.

### 10. Footer "About" link fix (homepage)
`index.html` footer linked **About → `index.html#about`** (a non-existent anchor → dead click);
repointed to the real **`about.html`**. All other footer links verified working. (Root page, not
content-gated.)

## Standing rules / guardrails (carry forward — see `CLAUDE.md`)
- Mandatory pipeline for ALL written/AI content: draft → citations → argument → editor → footnote
  integrity → **orthodoxy gate (must be CLEAN)** → deploy. Answers + reels + card + api prompts included.
- "Orthodoxy outranks charity" (hard tiebreak); concede the observation, never the inference; pull-quote
  test. Nicene orthodoxy; denominational neutrality; 1 Peter 3:15 tone; charity is accuracy (esp. Islam —
  never grant the 4:82 "same standard" symmetry). No fabrication — the recurring real defect this session
  was **paraphrases dressed as verbatim scholar quotes** in the compressed card tier; hunt those.
- Content-gate (`tools/check-content-review.mjs`, CI) requires a `content-review` stamp on changed
  `library/*.html`, `ev-s*.html`, `worldviews.html`, reel specs, `api/ask.js`. `ev-m-*.html` and root
  pages (except worldviews) are NOT gated. Never stamp a check you didn't run.
- Deploy: `git push origin claude/short-form-reels-generator-tjpymt:main`.

## Open / candidate next steps (web side)
- **Same four-agent recheck on the remaining two card tiers** not yet swept: **God's Existence
  (`ev-s1`)** and **Science & Faith (`ev-s5`)** — same method (Trinity/Jesus/Islam/Resurrection/
  Bible-Reliability are now done). The fabricated-quote / overstatement failure mode is what to hunt.
- Human/pastoral sign-off on the Trinity + Islam tabs (the orthodoxy gate left a short NOTE list of
  delicate-but-orthodox phrases, mostly already fenced with clarifiers).
- (Unchanged, owed by user) run the `ask_rate_limit` SQL in Supabase (see
  `docs/ASKED_AND_ANSWERED_SPEC.md`); native MK/ES doctrinal review.

## NOT in scope of this handoff (see their own docs)
- **Del Rosario demo** → `docs/DEL_ROSARIO_READING_CLUB.md` (done from the book in the local session).
- Prior web work → `docs/SESSION_HANDOFF_2026-07-08.md` (Asked & Answered launch, +8 answers, reels).
