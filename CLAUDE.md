# Apologia Daily — project guide

> **Resuming / new session?** Every chat auto-loads this file, so the live status lives
> here. All work is deployed to `main`, so a new session on **any** branch already has it
> (web sessions get different branch suffixes — that's fine). Full detail: `HANDOFF.md`
> (repo root; committed but not web-served). Deploy rule unchanged: push your working
> branch to `main`, never `git checkout main`.
>
> **Where the history went (2026-07-26).** This file loads into *every* session, so dated entries
> older than 2026-07-26 now live in `HANDOFF.md` → *Archived project-guide status entries*. Nothing
> was discarded and no rule moved — the standing rules below are byte-identical, and every OPEN item
> those entries held is consolidated under **OPEN — needs a human** below. Read the archive for the
> *why* behind a past decision; read this file for current state. **Keep it that way:** when an entry
> here stops affecting a decision, move it to `HANDOFF.md` rather than letting this file grow back.
>
> **LATEST — 2026-07-29:** ⭐ **The 63 mastery pages were re-gated against the current text, the blockers
> cleared, and the pages stamped.** This closes the work opened by the 2026-07-28 (d) audit. Read the (d)
> and (e) entries below for *what was wrong*; read this one for *where it landed*.
> **What the re-gate found.** 16 reviews again (argument ×63, orthodoxy ×63, neutrality ×16 on the
> dual-consensus tier). **0 HERESY**, but a large number of NOT-STAMPABLE verdicts with a single dominant
> cause, which every reviewer named independently: **the earlier fixes landed in the prose and not in
> `ARG_PREMISES`, the `cards` deck, the mock-scorer `checks`, or the drill model answers.** Those are the
> strings a reader *memorises* and is *graded against*, and no prose review reads them. Four blockers, and
> three of them were the same shape — **a fix that landed on one page and not on its sibling:**
> `john11` concedes that apologists overclaim **Colwell's rule** while `jesus_as_god_nt` committed exactly
> that error (Colwell 1933 is about *definiteness*; the *qualitative* reading is Harner/Dixon/Wallace, who
> warns against this misapplication); `titles` calibrated *pelach* against Daniel 3:12 while `jesus_claims`
> still stated it flatly; `trinity_islam`'s syllogism retired the *kalām Allāh*/*kalima* bridge while **six
> other strings still ran it** — including the Drill 3 model answer the reader is coached to say aloud
> (which also still carried *"distinct in some way from the essence"*, the Arian direction, plus a sentence
> duplicated by an earlier partial edit) and the `checks` array, **which marked a reader down for obeying
> the page's own instruction.** Also cleared: 8 WEAK flags, three of them overstated-consensus claims each
> contradicted by its own page a few accordions later (`hands` and `phil2` on "recognised across
> scholarship"; `philosophical_trinity` telling the reader critics *"cannot"* state the contradiction two
> lines above naming the one serious attempt as its hardest objection).
> ⚠ **THE LESSON, AND IT IS THE ONE TO CARRY FORWARD: a prose fix is not a fix.** Nine parts make up a
> mastery page and four of them are invisible to a doctrinal gate — `ARG_PREMISES`, `cards`, `checks`, and
> the model answers. **Diff those four against the paired essay BEFORE reading the prose**, and resolve the
> essay by **`<link rel="canonical">`, not by filename** (`minimal`→`minimalfacts`, `paul`→`paulconv`,
> `postresurrection`→`postres`, `messianic_prophecy`→`messianic-prophecy` — this cost three reviewers'
> work in the previous round).
> ⚠ **`tests/inline-script-syntax.test.mjs` earned its third catch.** `ev-m-multiatt.html` was **dead
> JavaScript** — an apostrophe in `'a standard historian's tool'` inside a single-quoted flashcard string,
> **introduced by this session's own calibration sweep**, killing the entire inline block (Pro gate, mastery
> dial, flashcards, `/api/tutor` call, share-card generator). It is now the only thing standing between a
> prose edit and a silently inert page. **Run `node --test tests/*.test.mjs` after every content edit pass.**
> **Also closed:** the last **deism gap** — `ev-m-cosmic.html` reached "a purposive mind" and never said that
> is not yet the Triune God. (⚠ **Correction to the 2026-07-28 (e) entry:** `ev-m-kalam.html` was reported as
> having the same gap. **It does not** — it says *"the argument concludes to a transcendent cause, not yet to
> the full God of Christianity"* in its own honest-scope paragraph. The earlier grep was too narrow.)
> ⚠ **KNOWN DEFECT IN A CI TOOL — do not trust `check-stamp-integrity.mjs` output as-is.** It currently
> flags **59 gated essays** as edited-after-stamp, but **58 of them trace to one commit (`0747dca97`)** that
> only changed a `fetch()` call to pass the essay body to the tutor. Non-doctrinal. The tool's boilerplate
> filter does not recognise script-body changes, so its output is noise nobody will read — **and noise is
> where a real flag will hide.** Fixing that filter is a small, high-value job for a code session.
> **⚠ STILL OPEN after this:** the four Tier-1 pages were rebuilt (commit `54162c1`) but
> **`ev-m-trinity_islam.html` still declares a "key move" that appears NOWHERE in
> `library/trinity_islam.html`** — the essay must gain the material and be re-gated, or the mastery page
> must stop presenting it as the key move. **Put that page first in front of the pastoral reviewer.**
> Also still open: `pocket-cards.html` is **still unstamped and still outside `CONTENT_PATTERNS`** (both must
> land in the same commit); the `evil.html` track-vs-essay mismatch is an **owner decision** (rescope the
> track, or commission a second essay); and the "missing critics" gap (Oppy, Allison, Morriston, Singer,
> Wielenberg and others named in the essays as the strongest living critics, absent from the pages).
>
> **LATEST — 2026-07-28 (d):** ⭐ **All 63 ungated mastery pages assessed — the pocket-card diagnosis, at ten
> times the scale.** 16 reviews (argument ×63, orthodoxy ×63, neutrality ×15 on the dual-consensus tier);
> ~139,000 words. **0 HERESY** — no page denies the Trinity, the two natures, the bodily resurrection or
> salvation in Christ. But **~133 BREAK and 37 CONCERN**, and four reviewers independently reached the same
> words: *"these pages were written without reading the essays."* The pattern is near-invariant — the
> `.seo-summary` carries the essay's concession honestly, and the body below it states as settled what the
> summary just called contested, **so pages contradict themselves on one screen.** Worked example:
> `library/minimalfacts.html` says the case is *"weakest when it inflates 'majority' into 'virtually all'"*;
> `ev-m-minimal.html`'s meta description, `og:description` and JSON-LD all print **"nearly all scholars."**
> ⚠⚠ **TWO NEW STRUCTURAL FINDINGS.** (1) **`ARG_PREMISES` is the highest-stakes string on every page and had
> never been reviewed** — it is POSTed to `/api/tutor` as the rubric a reader's explanation is *graded*
> against, **and** rendered into a downloadable share-card PNG. Wrong on ≥14 pages, so the site **marks a
> reader down for being right** (on `ev-m-postresurrection.html` it states the very conclusion
> `library/postres.html` retires). Same for the `cards` flashcard deck, the `checks` quiz regexes and the
> chip row — none visible to a prose review, all memorised. (2) **Two pages were entirely dead JavaScript**
> (`ev-m-phil2.html`, `ev-m-daniel70.html` — an unescaped apostrophe in a single-quoted string killed the
> whole inline block), and **`ev-m-daniel70.html` is one of only four mastery pages that CARRIES A STAMP** —
> a doctrinal gate certified a page whose entire interactive layer was inert, because a doctrinal gate reads
> prose and does not parse JavaScript. **`tests/inline-script-syntax.test.mjs`** now parses every inline
> script on all 1,100+ pages and JSON.parses every `ld+json` block (suite 86 → **89**).
> **SHIPPED:** the two dead pages, plus **20 factual corrections** each verified against the paired essay —
> Constantine's grandfather "a boy" in AD 112 (born c. 272); the **Arabic Testimonium** (Whealey 2008: it
> descends from the Syriac of Eusebius); *pelach* "only to God" in Daniel (3:12 uses it of Nebuchadnezzar's
> gods); the empty tomb "attested across" Q/Tacitus/Josephus (it is in none); "untranslated Aramaic" (Mark
> translates it — that IS the point); Nicaea on a faith "two centuries old" (nearly three); "1x1x1" attributed
> to classical writers (no such source); **John 5:23 compressed to "honoring the Son AS the Father"** — the
> same modalist-reading trap the owner caught on the pocket cards. Plus the CONCERN-level doctrinal fixes:
> **will-to-will** in `modalism`/`nt_trinity` (the essays say *"one undivided essence, one will, one power"*
> — and `modalism` contradicted itself four accordions apart), the unfenced *"receives his deity from the
> Father"*, and *"a creature enthroned beside God"* in our own voice.
> **⚠ STILL OPEN — the queue is [`docs/MASTERY_PAGE_AUDIT.md`](docs/MASTERY_PAGE_AUDIT.md), and nothing in it
> is done.** Four pages need **rebuilding, not editing**: `trinity_islam` (two lenses converged — its central
> premise appears nowhere in its essay, it equivocates *kalām Allāh*/*kalima*, and says in our own voice that
> the Logos is *"distinct… from the essence"* — the Arian direction; the gate said a stricter reviewer could
> call it HERESY, so **put it first in front of the pastoral reviewer**), `messianic_prophecy`, `cambrian`,
> `evil`. Two corpus-level gaps: **the deism gap** (12 of 19 natural-theology pages never say the argument
> reaches a necessary Mind, not yet the Triune God — a reader can be graded 10/10 on all 22 and finish a
> deist; fix is one sentence in 12 files, wording already certified on `ev-m-ontological.html`) and the
> **Chalcedon gap again** (only `jesus_as_god_nt` and `hands` affirm Christ's full humanity).
> **⚠ LESSON THAT COST THREE AGENTS' WORK:** resolve each page's essay by its **`<link rel="canonical">`, not
> its filename** — `minimal`→`minimalfacts`, `paul`→`paulconv`, `postresurrection`→`postres`,
> `messianic_prophecy`→`messianic-prophecy`. I told three reviewers those pages had no essay; they do, and
> they are among the worst contradictors.
>
> **LATEST — 2026-07-28 (e):** ⭐ **Owner set the scope on the mastery-page fix, and it shipped.** The
> question was whether to relabel the objections block instead of fixing it — a real option, not a dodge.
> **The test that settled it:** relabelling fixes *our* exposure and changes nothing for the reader who is
> actually in the conversation. So: **relabel AND route everywhere, transplant only the objections a reader
> meets constantly, fix the contradictions everywhere.**
> **① The promise is true now (67 pages).** *"Each one stated as its strongest defender would put it — never
> a strawman"* was false on most pages → **"The objections you will actually meet."**
> **② All 63 route to their own hardest objection** — a gold line naming the objection the paired essay calls
> hardest, linking to it. The reader knows it exists, knows we didn't hide it, knows where the answer is.
> **③ Three transplanted in full:** the **Jewish agency / *shaliach*** reading (absent from `jesus_as_god_nt`,
> badged *Trickier* on `hands` — the objection that arrives at people's front doors; the reply is the essay's
> ***Marana tha* is prayer** move); **Ehrman** on `jesus_claims` (was Schweitzer's tragic prophet, which
> *invites* the prerogatives list — Ehrman's real case *absorbs* it) and `early_church_trinity` (was "the
> winners' edited record," which he does not claim); the **multiverse** on `finetuning`/`cosmic` (steelman
> omitted eternal inflation and the string landscape; both imputed a motive no physicist holds).
> **④ 24 contradictions fixed** — Psalm 22:16 and the Targum on `messianic_prophecy`; Stoner's odds out of
> `prophecy` **and out of the `palace.html` memorisation room**; Wallace's <1% figure taken out of Ehrman's
> mouth on `manuscript`; "no rival burial tradition anywhere" (Acts 13:29); Finkelstein un-mislabelled;
> `deadseascrolls`' reversed pluriformity finding; and the *"logic is airtight… every objection attacks P1 or
> P2"* boilerplate on 7 pages, which each page refuted itself a few accordions later.
> **⑤ Both corpus gaps closed** — the deism sentence on all 12 pages that lacked it, Chalcedon on the 4.
> **⚠ STILL OPEN:** the four rebuild pages (`trinity_islam` first, and it needs the pastoral reviewer), the
> ~100 remaining page-specific findings in [`docs/MASTERY_PAGE_AUDIT.md`](docs/MASTERY_PAGE_AUDIT.md), the
> `cards`/`checks` diff on all 63, and **no page is stamped yet** — the stamp and the `CONTENT_PATTERNS`
> entry must land in the same commit.
>
> **LATEST — 2026-07-28 (c):** ⭐ **The 70 pocket cards were gated for the first time — and 23 of them were
> blocking.** `pocket-cards.html` had **no review stamp and sat outside `CONTENT_PATTERNS` entirely**, so
> nothing ever flagged it: 70 pieces of compressed doctrinal argument, designed to be screenshotted and
> shared, never reviewed. Three gates ran in parallel (argument 70 · orthodoxy 70 · neutrality on the 39
> dual-consensus cards), then twice more after fixes. **0 heresy**, but the convergent diagnosis was blunt:
> *"the cards were written without reading the essays."* Nine of eleven neutrality BREAKs asserted the exact
> claim their own certified essay retires in so many words — `shema` printed the echad overreach
> (`shema.html`: "honesty requires saying no"); `messianic_prophecy` carried "the Statistical Case" **in its
> title** ("it should be retired… pseudo-mathematics"); `deadseascrolls` said manuscripts "prove" a
> "virtually identical" text ("that slogan is false as stated"); `archaeology` claimed no find ever refuted
> a biblical claim; `ot_trinity` led with Genesis 1:26 ("has overreached, and should stop"). Two hard
> factual errors fixed: **`paul` said Paul *wrote* the creed** (he received it; 1 Cor is c. AD 53–55) and
> **`manuscripts` led on "7 for Plato"** (a discredited figure). **Francis Collins** was recruited as the
> third premise of an intelligent-design argument he founded BioLogos to oppose. All three Islam cards
> failed the EXPLICIT-VERDICT / FALSE-COMMON-GROUND rules and now land their verdicts.
> ⚠⚠ **THREE LESSONS WORTH KEEPING.** (1) **Irony does not survive compression** — a fix borrowed CLAUDE.md's
> own ironic phrasing ("it honours Jesus precisely by refusing him worship") and, stripped of context and of
> the words "as God", it inverted John 5:23. **The owner caught it; two of three gates passed it** — one
> even praised it as a model. (2) **Fixes must propagate to the tagline AND question**, not just `points`:
> five cards ended up contradicting themselves, the headline asserting what the bullet had just retired.
> (3) **Read each card as a whole** — retiring `ot_trinity`'s Gen 1:26 bullet removed the card's only
> oneness anchor, leaving four bullets that read as two YHWHs. Every line defensible, the card ditheist.
> **STILL OPEN:** a final certification pass was running at session end — **the file is NOT yet stamped and
> is NOT yet in `CONTENT_PATTERNS`** (both must land together, or CI fails on the missing stamp). Until then
> the public wording stays scoped to **essays** ("no essay published until it clears five review stages" on
> `index.html`'s hero + meta description); the site-wide "nothing" version unlocks only when the stamp lands.
> **Two owner decisions, not defects:** the **Chalcedon gap** — across 28 deity/Trinity cards **none affirms
> Christ's full humanity**, so a reader working the deck could finish with a functionally monophysite Christ
> (fix = a new "Fully God and Fully Man" card, not an edit); and whether the **science tab** (`bigbang`,
> `dna`, `originlife`, `cambrian`) should keep presenting the intelligent-design inference and old-earth
> cosmology as settled, since that divides Catholics, Orthodox and Protestants alike.
> Also shipped today: the homepage now **leads with the standard instead of the category** — meta
> description, `og:description`, hero sub-headline and a boxed **trust card** under the AI chat (132
> verified sources · 85 cited deep dives · 5 review stages · 102 answer pages), all figures generated by
> `tools/update-trust-numbers.mjs` and CI-checked so they cannot drift; the review method is now formally
> named **"Checked Before Published"** on `editorial-standards.html`; **`signup_confirmed`** replaces the
> pre-confirmation `signup_completed` as the true registration conversion; and the **1 Peter 3:15 hero verse
> stopped running off the side of the screen** (`white-space:nowrap` plus a `fadeUp` keyframe that was
> silently replacing `translateX(-50%)`).
>
> **LATEST — 2026-07-28 (b):** added **[`docs/GROWTH_PLAN_SIMPLE.md`](docs/GROWTH_PLAN_SIMPLE.md)** — a one-page
> plain-English version of all three growth plans, with **A$20/day vs A$100/day Meta scenarios modelled**.
> Key numbers: A$100/day ≈ 167k impressions → ~2,000 clicks → **13–80 confirmed signups/month at A$37–234
> each**; A$20/day is a fifth of that and **misses Meta's 50-conversions/week learning threshold badly**
> (~26–64/mo vs ~214 needed), so it can only buy a **hook-rate ranking of the 54 reels**, never a conversion
> read. Cost-per-signup is **identical at both budgets** — more spend buys more signups, not cheaper ones.
> Optimising to signup would need ~A$570/day. Neither budget pays back at A$3–36 LTV. ⭐ The plan names the
> **ministry-vs-customers** distinction explicitly: as customer acquisition the answer is still no, but as
> *reach* the spend is defensible, and that is the owner's call to make on its own terms.
>
> **LATEST — 2026-07-28:** shipped two channel plans — **[`docs/SOCIAL_GROWTH_PLAN.md`](docs/SOCIAL_GROWTH_PLAN.md)**
> (organic IG + X) and **[`docs/META_ADS_PLAN.md`](docs/META_ADS_PLAN.md)** (paid) — and corrected two stale
> claims in `docs/MARKETING_PLAN.md`. ⭐ **Two findings worth carrying forward.** (1) **No page links to
> any social profile** — including an **Instagram account that DOES exist** (owner-confirmed 2026-07-28;
> the research pass wrongly reported it didn't, because it wasn't findable by web search — *absence from
> search is not absence of an account; ask the owner*). **1,108 pages carry `twitter:card` but ZERO carry
> `twitter:site`**, so every share to X credits nobody. Organic growth starts at wiring the links, not at
> optimising posts. **6 of the 7 X-card specs carry no review stamp** (`x-jesus-god-mark` and
> `x-nicene-creed` are deity/Trinity tier → dual-consensus) while all 54 reel specs are stamped — so
> distribution, not production, is the bottleneck. (2) **Do not run Meta ads yet, and the blocker is
> arithmetic, not the missing Pixel**: £30–60 CAC against £1.51–18 LTV at $8/mo, and optimising to signup
> needs **£8,600/month for one ad set** to clear Meta's learning phase. Two repo blockers found:
> **`privacy.html:202` promises readers we do NOT use advertising cookies** (a Pixel makes that false; there
> is no consent mechanism anywhere in the repo), and **`signup_completed` fires before email confirmation**,
> so mapping it to Meta's `CompleteRegistration` would optimise toward people who abandon at the confirmation
> email. The plan recommends against paid distribution of the **Islam cluster** on ministry, account-survival
> and brand grounds. Docs only — no live content or code changed. Detail in both files.
>
> **LATEST — 2026-07-26 (c):** mined the **Tyndale/evangelical article-research batch** (7 sources,
> 11 texts — 6 read in full, 5 partial; each note states its own page range) + the mandatory live cross-check → 6 article notes, 4 book notes, **11 backlog rows**.
> ⭐ **Top find: Synoptic preexistence is a real gap (P2)** — every preexistence argument on the site runs
> through Paul/Hebrews/John, so the Synoptics sit exactly where the "Christology developed late" objection
> puts them. **Research/docs only; no live content changed.** Detail below.
>
> **LATEST — 2026-07-26:** shipped the **native app scaffolding** (Capacitor: `ios/` + `android/`, inert
> RevenueCat), **in-app account deletion** (Apple 5.1.1(v) blocker — token-authenticated, aborts rather than
> half-deletes), **app-review security fixes** (`lib/cors.js`; secret out of the public `monitor.html`;
> `.vercelignore`), and **truthful monitoring** (`/api/health` now 503s when degraded, so UptimeRobot can
> actually see an outage). Tests 47 → **70**. ⚠ Account deletion has **never run against live Supabase** —
> test with a throwaway account before submitting. Detail below + `HANDOFF.md`.
>
> **LATEST — 2026-07-26 (b):** rebuilt [`editorial-standards.html`](editorial-standards.html) as the public
> **trust page** — repo-counted figures (`tools/update-trust-numbers.mjs`, CI-checked, counts only GATED
> briefs), an honest construction-vs-instruction account of what the AI can and cannot do, six **published
> corrections** incl. the drift that let a review certify a copy readers weren't seeing, and — the gates'
> load-bearing catch — an explicit disclosure that **our reviewers are AI under human supervision, checking
> against the creeds + `what-we-believe`**, since flagging only the doctrinal stage as automated implied the
> rest were human. Linked from the pricing block + the answers footer (the "Reviewed" badge is now a link).
> Gated argument + orthodoxy ×2 (0 HERESY; the re-gate caught that the page had published the two exact
> strings `check-answer-concessions.mjs` exists to catch). **Still no pastoral sign-off — the page declines
> to claim it.**
>
> **STANDING RULE — the named standard is "Checked Before Published."** The review method described in
> this file (the mandatory content pipeline + `/sources` verification + the published corrections) now has
> a public NAME, so it can be referenced consistently in marketing, the app-store listing, and on any
> printed product. Its home is [`editorial-standards.html`](editorial-standards.html) — deliberately NOT a
> second page, so the trust story is not split. The homepage trust card and hero echo it.
> ⚠ **Scope discipline (do not widen it casually):** every public statement of the standard is currently
> scoped to **essays** — "no essay published until it clears five review stages" — because 70 pocket cards
> are still being gated. When that finishes, the site-wide wording becomes true and both the hero and the
> meta description can drop "essay" for "nothing." Not before. A named standard that overstates is worse
> than an unnamed one.
> The name is one find/replace to change while it lives only in the repo; it gets expensive once it is on
> a card box or a store listing.
>
> **STANDING RULE — X / social share-cards.** Every X-post image uses the brand card generator
> `tools/reel/gen_xcard.py` (night-sky navy + gold underlined kicker + italic-serif cream/gold
> headline + shield logo, 1600×900; specs in `tools/reel/xcards/`). **Never ship a flat frame
> pulled from a reel MP4 as the X image.** Exemplars: `xcards/x-scripture-one-story.json`,
> `xcards/x-honor-the-son.json`. It's gated content (argument+orthodoxy; +neutrality for
> deity/Trinity/Islam) — reuse the reel/essay's certified framing; details in the `make-reel` skill.
>
> **2026-07-26 (NATIVE APP scaffolding — iOS + Android via Capacitor; NOT yet submitted).** The site is now
> also packaged as a **native app**: `capacitor.config.json` (appId `com.apologiadaily.app`), committed
> **`ios/`** + **`android/`** projects, `tools/build-app-bundle.mjs` (assembles the git-ignored `app/www`,
> 372 files — allowlisted to root client files + `answers/`/`library/`/`demo/`, so `api/`, `lib/`,
> `sources/`, `briefs/`, `tools/`, `docs/`, `tests/` and dotfiles can never ship in a public binary), and
> `tools/build-app-icons.mjs` → `@capacitor/assets` (113 icon/splash sizes; splash lifts the gold artwork off
> its navy panel by luminance so the old oval/speck artifacts are gone). **Architecture: assets ship INSIDE
> the binary** (offline-capable — deliberately not a remote-URL webview, which Apple rejects under 4.2);
> only `/api/*` + Supabase go to the network, via a **Capacitor-only `fetch` shim** added to `analytics.js`
> that rewrites relative `/api/*` → `https://apologiadaily.com/api/*`. That file loads on all 317 pages, so
> the shim is a **strict no-op on the web** and is now guarded by **`tests/app-bridge.test.mjs`** (suite
> 47→**52**, CI picks it up automatically). Billing plumbing is **RevenueCat** (`app-purchases.js`,
> entitlement `pro`) but is **INERT — no keys, no paywall wired, cannot charge anyone**; prices are still
> undecided (owner). **Full runbook: [`docs/APP_STORE.md`](docs/APP_STORE.md).**
> ⚠ **Open before submission:** pricing/paywall decision + store products; Apple Developer ($99/yr) and
> Play ($25) accounts aren't created; **the iOS `pod install` + Archive must run on the owner's iMac**
> (impossible on Linux — that step was skipped here), and neither native project has been compiled or
> device-tested yet.
>
> **2026-07-26 (app-review security fixes + IN-APP ACCOUNT DELETION + monitoring truthfulness — ALL LIVE on `main`).**
> Two `apologia-engineer` reviews (one of the app work, one of the deletion endpoint) drove this; everything
> below is deployed.
>
> **⚠ CORRECTION — `METRICS_SECRET` was NOT a live breach.** An earlier note in this file said the
> hardcoded `'Apologia2026!'` in the publicly-served `monitor.html` was a CRITICAL live exposure needing
> urgent rotation. **That was wrong, and the claim is withdrawn.** `METRICS_SECRET` had *never been set* in
> Vercel (confirmed from the owner's dashboard + the monitor showing "Unauthorized"), and `requireSecret`
> fails closed — so `/api/metrics` denied **everyone**, including anyone reading the value from page source.
> No data was reachable. The right severity was *latent* (it would have become real the moment someone set
> that variable to that value, and would have been baked permanently into store binaries). **Nothing to
> rotate; no action outstanding.** Lesson for future sessions: **check whether the env var actually exists
> before rating a hardcoded secret.** The removal itself still stands as correct.
>
> **Security fixes (`df8e75d`).** Secret gone from `monitor.html` (operator types it at sign-in, verified
> server-side, held in `sessionStorage`); monitor/logs/admin excluded from the app bundle + a test scans the
> **built** bundle for secrets. **CORS was set only inside the `OPTIONS` branch** on
> `ask`/`debate`/`devotional`/`feedback`, so the preflight passed but the POST response had no
> `Access-Control-Allow-Origin` — invisible same-origin on the web, but it would have **silently killed those
> features in the app**; the 8 drifted hand-copied blocks are now one **`lib/cors.js`** (allowlist replaces
> `'*'`; **`Authorization` is in `Access-Control-Allow-Headers`** — omitting it made the token-authenticated
> delete call unreachable in-app). Added **`.vercelignore`** (`vercel.json` used a hand-maintained redirect
> blocklist that every new top-level dir silently escaped — `tests/` was already exposed).
>
> **In-app account deletion** (Apple 5.1.1(v) blocker) — `lib/verify-user.js` + `lib/delete-account.js` + a
> `?do=delete-account` route folded into `api/new-signup.js` (**Vercel Hobby caps the project at 12 functions
> and we are AT the cap** — hence the `?do=` fold, matching `push.js`/`weekly-email.js`; that file now carries
> **two auth models**, and the user-authed branch returns before the shared-secret gate) + a Dashboard
> "Account" card with a typed-DELETE modal + `privacy.html` + an `index.html?deleted=1` confirmation.
> Identity comes **only** from a verified token. The second review found the first cut **half-deleted**:
> the auth user was removed even when a table delete had failed, and a 400/404 was swallowed as "table
> absent" (so a wrong *column* would report success while every row survived). Both fixed — it now
> **aborts before touching the auth user** if any table failed, and tolerates only genuine undefined-table
> codes (`42P01`/`PGRST205`/`PGRST106`). Also: rate-limit **after** auth keyed on the user (an IP bucket let
> a stranger on shared NAT block someone's deletion), success is audit-logged, `SUPABASE_ANON_KEY` is
> **required** (now set by the owner) and its absence 503s loudly instead of 401-ing every real user.
> ⚠ **STILL NOT exercised against live Supabase** — test with a throwaway account before submitting.
> Known limit: `push_subscriptions` has no `user_id`, so other devices' subs linger until they expire
> (fix: add the column, then add `['push_subscriptions','user_id']` to `USER_TABLES`).
>
> **Monitoring now tells the truth (this was giving false reassurance).** `/api/health` **always returned
> HTTP 200**, even while its body said `"degraded"` — and the owner runs **UptimeRobot**, which judges
> up/down by status code. So the monitor would have stayed green straight through a database outage or an
> expired Anthropic key. It now returns **503 when degraded**, 200 when healthy; a **skipped** check counts
> as fine, so the deliberately-off paid LLM pings can't raise a false alarm. `monitor.html` also stopped
> reporting those skipped pings as failures (it showed a red "Issues — 5 of 10 passing" on a healthy site),
> and stays usable when `METRICS_SECRET` is unset (`/api/metrics` answers `503 not_configured`, the page opens
> in limited mode) — otherwise the new server-side sign-in would have locked the operator out entirely.
> **Owner actions done:** `SUPABASE_ANON_KEY` set in Vercel; UptimeRobot repointed from
> `apologia-daily.vercel.app` (wrong host — it would stay green through a DNS/domain failure) to
> `https://apologiadaily.com`, plus a new monitor on `/api/health`. **Deliberately skipped:** `METRICS_SECRET`
> (PostHog + the Supabase dashboard already give the user counts; the metrics page is redundant).
> Tests **47 → 70**.
>
> **2026-07-26 (article-research: the Tyndale/evangelical mining batch — 7 sources, ALL mined).** Executed
> `docs/article-research/MINING-BRIEF-tyndale-batch.md` from a local web-enabled session (the web sandbox's
> egress policy had blocked these hosts). **Eleven source texts harvested** — all open-access /
> publisher-hosted / author-permitted, never a pirated or third-party copy; PDFs went to the git-ignored
> `_pdfs/` and are **not** committed. ⚠️ **Read-coverage varies and each note's header now states its own
> page range:** six were read cover-to-cover (Lanier; Hemer *TynBul* 36; Hemer 40.1; Seccombe; Millard's
> Daniel chapter; Gathercole); **five are PARTIAL** (Hemer 40.2, Bruce 1942, Head & Williams, Kitchen, and
> — marginally — Millard's literacy article). The notes are sound for what they cover; they are **not**
> complete maps of those five articles. Produced **6 article notes** (`lanier-critical-editions-stability`
> · `acts-historicity-bruce-hemer-seccombe` · `millard-daniel-and-scribal-culture` · `head-williams-q-review`
> · `gathercole-i-have-come-sayings` · `kitchen-historical-method-hebrew-tradition`) and **4 book notes**
> (`gathercole-preexistent-son-and-thomas` · `can-we-trust-the-gospels` · `jesus-and-the-eyewitnesses` ·
> `on-the-reliability-of-the-old-testament` — all four **PARTIAL**: those books are *not owned*, so each is
> mapped only from the author's own OA work, an OA review, publisher frontmatter, and our own certified
> citations, and each carries a "TO COMPLETE (human action)" instruction). Every lead was **cross-checked
> against the live site** per the mandatory rule; **11 backlog rows** logged (+ 1 deliberate
> *non-recommendation*). **⭐ The headline find: Synoptic preexistence is a real gap (P2, the batch's top
> row).** Site-wide, *every* preexistence argument runs through Paul, Hebrews, or John — `jesus_as_god_nt.html`
> and `titles.html` return **zero** hits, which leaves the Synoptics standing exactly where the
> "Christology developed late" objection puts them. Gathercole's "I have come" sayings attack that premise
> directly. **⚠⚠⚠ That row is dual-consensus + a MANDATORY `orthonote`:** the ancient parallel is to the
> **form** of the saying (a heavenly being announcing a mission), **never the nature of the speaker** —
> compressed badly it reads as Arian/JW angel-Christology. Other improvements: the Acts 27–28 voyage
> epigraphy, Seccombe's three *non-silence* arguments for `earlydate.html`, edition-level text stability
> (+ the Greek OT half we don't cover at all), a bounded Darius-the-Mede line, Iron-Age literacy, the
> **Merneptah Stele**, and a specialist caveat on the Casey footnote in `jewishness.html`. **Corroboration**
> (no rows): Bauckham's onomastics/eyewitness case (saturated), Williams's names plank (already cited),
> Kitchen's treaty-form argument, Belshazzar/Nabonidus. **Three standing flags now on the record in the
> libraries rather than only in the brief:** the **Bauckham universalism fence**; Kitchen's
> **Nuzi/patriarchal-customs material is a trap, not a gap** (Thompson 1974 / Van Seters 1975); and the
> **Scribd copy of Bauckham's *JSHJ* article is not a legitimate source**. Also corrected three brief
> errors: the stability article is by **Gregory R. Lanier**, not Jongkind; "Dating Luke-Acts" is by
> **David Seccombe**; Bruce's *Speeches* lecture is **1942**. Notes + ledger/INDEX/backlog only — no live
> content changed, so nothing needed re-gating.
>
> ---
>
> ## OPEN — needs a human (consolidated; nothing here is done)
>
> Previously scattered across nineteen dated entries, which made them easy to miss. Full history for
> any of them: `HANDOFF.md` → *Archived project-guide status entries*.
>
> **Doctrinal / pastoral**
> - **Recruit a standing pastoral/elder reviewer.** The sign-off log in `docs/STATEMENT_OF_FAITH.md`
>   is still `_pending_`. Owed on: the Trinity + deity-of-Christ + Nicene Christology, the Islam
>   cluster, and the "The Case, Plainly" tier (76 articles — automated gate CLEAN, no human pass).
>   Every stamp says the gate is automated; `editorial-standards.html` now says so publicly too.
> - **ELLC creeds licensing:** confirm ELLC permits the commercial use with acknowledgment, and
>   verify the **Nicene** wording byte-exact against the official text (ours was reconstructed).
> - **Native Macedonian + Spanish doctrinal review** of `library/mk/*` and `library/es/*` essays and
>   hub fragments — AI-translated, orthodoxy-gated, never human-checked. MK translations beyond the
>   5 mirrored essays are also outstanding.
> - **~a dozen CHECK-level page-cites** need a human with the physical books.
>
> **App store (before submission)**
> - **Account deletion has NEVER run against live Supabase.** Test with a throwaway account first.
> - **Pricing/paywall decision** + create the store products. `isPro` is still hardcoded `true` and a
>   dead "$8/mo" is advertised. Do not run paid acquisition into it. **Decide AUD vs USD as part of
>   this** (owner, 2026-07-28: deferred until Stripe is wired) — `index.html:1408` renders a bare `$8`
>   with no currency code anywhere in the repo, so an Australian reader sees AUD and an American sees
>   USD. Harmless while nothing can transact; a billing-expectation problem the day checkout goes live.
>   Whichever is chosen, stamp the currency on the pricing card and in `docs/META_ADS_PLAN.md`
>   (its figures are GBP and currently *assume* USD).
> - Apple Developer ($99/yr) and Play ($25) accounts are not created.
> - **iOS `pod install` + Archive must run on the owner's iMac** — impossible on Linux, never done.
>   Neither native project has been compiled or device-tested.
> - `push_subscriptions` has no `user_id`, so a deleted user's subscriptions on *other* devices linger
>   until they expire. Fix: add the column, then add `['push_subscriptions','user_id']` to `USER_TABLES`.
>
> **Infrastructure / verification**
> - **Run `docs/STUDY_GROUPS_DISPLAY_NAME_FIX.md`** (M4 anti-spoof trigger) in Supabase.
> - **6 source passages still `verified:false`** (creeds + Athanasius §54) — the clean hosts
>   (CCEL/ANF/Wikisource) are network-blocked in the sandbox; needs a local/web-enabled session.
>   (A 7th, a Chrysostom eucharist passage, was **removed** 2026-07-26 — see `docs/source-library-held.md`.)
> - **Monthly agent-sweep Routine was never created** (`create_trigger` hit a permission error).
> - **Browser-verify:** the CSP; the nav mega-menu on desktop + mobile; SRI on the gated essays.
> - Bring the nav mega-menu to the gated pages via a stamp pass.
> - Two standing stamp-integrity flags: `evil.html` category-pull, `worldviews.html` SEO schema.
>
> **Content backlog** (full queue: `docs/content-backlog.md`)
> - **Synoptic preexistence is a real gap (P2)** — the top find of the Tyndale batch; every
>   preexistence argument on the site runs through Paul/Hebrews/John. Plus 10 further backlog rows
>   from that batch, and the **John 17:22 "shared glory"** row (P3) from the video-research cross-check.
> - **`ev-s5` argument card** for `library/miracles.html` is still TODO.
> - Five Tyndale-batch article notes are **PARTIAL reads** — each states its own page range; they are
>   not complete maps. PDFs are in the git-ignored `_pdfs/` for a later pass.
> - A **Reasonable Faith** (Craig) book-research note awaits a print/Kindle copy. **Perlego is
>   forbidden** — never extract from it.
>
> **Growth**
> - ⚠ **CORRECTED 2026-07-28 — PostHog is NOT under-instrumented.** It emits **34 distinct events**
>   including `signup_completed`. The real gap is that **it has never been reviewed** — nine months of
>   data, unread. Read it before setting any acquisition target (funnels listed in `META_ADS_PLAN.md` §B).
>   One live defect: **`signup_completed` fires before email confirmation**, so any downstream number
>   built on it overcounts.
> - **Wire the social links** — no page links to any social profile. ⚠ An **Instagram account DOES
>   exist** (owner-confirmed 2026-07-28; an earlier research pass wrongly reported it didn't — absence
>   from web search is not absence of an account). **Owner must supply the IG handle**; X handle status
>   unconfirmed. Then add `twitter:site` + footer icons + `sameAs`, and decide the bio-link
>   destination. Step-zero checklist in `docs/SOCIAL_GROWTH_PLAN.md`.
> - **Gate the 6 unstamped X-card specs** before any of them is posted (`x-jesus-god-mark` and
>   `x-nicene-creed` need dual-consensus).
> - **No Meta Pixel — and installing one requires owner sign-off first**: `privacy.html:202` promises
>   readers we use no advertising cookies, and the site has no consent mechanism for UK/EU traffic.
>   Do not spend on Meta until the four trigger conditions in `docs/META_ADS_PLAN.md` are met.
> - Uptime alerting is the owner's UptimeRobot only.
>

Apologia Daily (apologiadaily.com) is a commercial Christian apologetics platform: a
static HTML/CSS/JS site on Vercel, with Supabase (auth/db) and Claude-powered AI
features (`/api/*.js`). The **Evidence Library** (`/library/*.html`) is the heart of the
site: long-form, fully-cited deep-dive essays.

## MANDATORY content pipeline (ALL written content, no exceptions)

Every piece of written content **must** pass through this pipeline, in order. Do not
deploy content that has skipped a stage. **This explicitly includes: deep-dive essays,
Evidence Library fragments, `/answers/*` pages (the flywheel), short-form reel scripts
(`tools/reel/specs/*`), **X / social share-cards (`tools/reel/xcards/*`)**, and the live AI
system prompts (`api/ask.js`, `api/*.js`).** The
"answers" layer is NOT a lighter tier — the over-concession defects found on the JW/deity
answer pages (2026-07-04) reached production precisely because the answers were treated as
lower-stakes and shipped without the gate. There is no such thing as content too small to
gate. At minimum, argument-soundness (step 4) + orthodoxy (step 7) run on **every** answer
and reel before it goes live; record it (see the `reviewed` provenance in
`answers/_data.json`, enforced by `tools/gen-answers.mjs`).

**SHORT-FORM ANSWER RULE (mandatory for every `/answers/*` entry; the argument gate enforces
it, and `tools/gen-answers.mjs`'s header documents it).** A short answer's *job* is to **answer
the question** — directly, from our own convictional footing, inside the guardrails and the
mission — and then **point to the fuller study** (the linked essay) for the deep engagement. It
is **not** an essay, and it must **not** carry an essay's heavy steelman.
- **Lead with the answer.** The **first sentence must answer the question** from our own footing (a
  direct "No —" / "Yes —" / clear assertion), not open on the objection. Do **not** open by
  steelmanning, amplifying, "granting the force of," or even neutrally *restating* the objection. A
  **front-loaded opening is a defect even when every word of it is factually accurate** — the defect is
  the *placement and weight* (answering the objection before you've answered the reader), not the
  accuracy. "It's a fair question," "This is a serious/common objection," "Honestly, this is hard,"
  "Let's not soften this," "At first glance X seems true" are all front-loaded openings to rewrite.
  A front-loaded concession fails the pull-quote test and can leave a believer nearer to doubt. (This
  was the 2026-07-16 sweeps' finding: first 11 over-concession openings, then a full opening-rewrite
  pass — the earlier over-concession gate had *passed* factually-honest-but-front-loaded openings, so
  the rule is: front-loading is a defect regardless of factual accuracy.)
- **Concede the observation, never the inference.** Concede only accurate facts and the person's
  sincerity — never the opponent's frame, the soundness of a mistaken inference, or an unearned
  symmetry. Keep any acknowledgment **brief and fact-bound**.
- **Close with the "go deeper" pointer.** The full "steelman the strongest objection at length"
  work belongs in the deep-dive essay, not the short answer.
- Pastoral empathy (validating the *emotion* of a doubt or a hard question) is allowed and good;
  conceding the *intellectual* case to the skeptic is not.
- **Pastoral / crisis exception — the referral IS the answer.** A small set of questions are cries
  for help, not queries: self-harm or suicidal thoughts, abuse or danger, acute despair, "should I
  stop my medication and just pray?" For these the faithful response is **not** a confident
  apologetics answer (and not the lead-with-the-answer format) but **compassion + a referral** to a
  real person — a trusted friend, a pastor, or a professional counsellor (and a crisis line via
  findahelpline.com / local emergency services if there's any danger). Affirm the person's worth
  (made in God's image, loved by God), offer Christ as comfort and presence rather than as an
  argument, and point them toward care. **Never diagnose, never give medical or legal advice, never
  try to argue anyone out of a clinical condition.** This is the loving answer, not a refusal. It is
  live in `api/ask.js` (the PASTORAL CARE block, which takes priority over the normal format) and is
  the one place a non-answer-plus-referral is correct.

The argument + orthodoxy passes must actively hunt **over-concession**, not only
overstatement or heresy-in-our-own-voice: a steelman that grants the opponent's frame, the
soundness of a mistaken inference, or an unearned symmetry is a defect even when the body
later refutes it. See the "Orthodoxy outranks charity" guardrail below.

Every essay or substantive page added to the site **must** pass through this pipeline,
in order. Do not deploy content that has skipped a stage.

1. **Draft** — `apologia-author` (or `apologia-evidence`) writes it in the house format
   (numbered footnotes + bibliography), inside the guardrails below.
2. **Scholar-editor review** — `apologia-evidence`: scholarly accuracy, rigor, sourcing,
   completeness, steelmanning.
3. **Citation fact-check** — `apologia-citations` (read-only): every scripture/Qur'an
   reference exists and is quoted accurately; every scholar/source/date/venue is real and
   correctly attributed; no fabricated quotes or statistics.
4. **Argument-soundness review** — `apologia-argument` (read-only): logical validity,
   premise strength, fair steelmanning of the strongest objection, no overstatement,
   honest concession.
5. **Copy-edit** — `apologia-editor`: typos, grammar, tone consistency, broken markup/links.
6. **Apply fixes + verify footnote integrity** — every `<sup>N</sup>` must map to exactly
   one `<li>`; preserve that mapping across all edits.
7. **FINAL GATE — `apologia-orthodoxy`** (read-only): doctrinal certification. **This is
   always the last check before deploy.** Content is not deployed until it is certified
   CLEAN (or flags are resolved). A single [HERESY]-level flag blocks deploy.
   **Standing sub-step (every run): the gate MUST return a "Clarifier candidates" verdict —
   even when it is "none."** For every piece of content it scans for phrases that are orthodox
   but a compressed reader could misread as heterodox and gives each a disposition (add
   `orthonote` clarifier / rewrite / leave-as-is with reason). The *consideration is mandatory
   and on-record*; the *application stays selective* — never add a clarifier where the wording is
   plainly unambiguous (the ＊ works because it's rare). Non-interactive formats (reel specs,
   push/teaser copy) can't host the ＊ box, so a candidate there routes to a **wording** fix
   instead. See the `orthonote` STANDARD section below and the registry `docs/clarifiers.md`.
8. **Deploy** (see deploy workflow below).

Read-only agents (citations, argument, orthodoxy) report; a human-supervised step applies
their fixes. The orthodoxy agent is an automated gate, **not** a substitute for eventual
human/pastoral doctrinal sign-off on high-stakes content.

## EXPLICIT-VERDICT RULE — Islam and every rival-worldview refutation (mandatory; `apologia-argument` enforces it)

**Any content whose job is to answer a rival-worldview claim — every Islam card, essay, and
`/answers/*` entry (and JW / Mormon / atheism content) — MUST explicitly LAND ITS VERDICT in
our own voice.** After presenting and fairly steelmanning the claim, it must plainly state that
the Islamic (or other) position **does not hold / the answer is _no_ / the specific claim is
false** — stated, not merely set up. This is the "higher bar" the 2026-07-18 Islam sweep applied
to the cards, essays, and answers; hold **all future Islam / rival-worldview content** to it.
Two failure modes are defects even when the body is excellent:

- **Implying the verdict is NOT landing it.** "Each text keeps pointing to Christ" *implies*
  Muhammad isn't predicted but never *states* it; "the transmission looks ordinary" *implies* the
  perfect-preservation claim fails but never *says so*. The reader must not have to infer the
  conclusion. Model fix (Muhammad card): **"So the honest answer to the question is no… none of the
  passages Islam appeals to predicts Muhammad."**
- **Usage-guidance is NOT a substitute for the verdict.** A close / "Where this leaves us" /
  "an open door" section that tells the reader *how to use the argument graciously* ("you can say a
  wholehearted 'yes, let's read it'") **without first plainly stating the conclusion** is a defect.
  State the conclusion **first**, then the gracious guidance.
- **The verdict is bounded and honest, never overclaimed.** Falsify only the specific claim the
  evidence reaches ("the perfect-preservation slogan is not true"; "the crucifixion denial runs
  against the clearest evidence"). Where a claim is a *metaphysical framing* rather than a factual
  error (wahy vs. Incarnation), land the bounded verdict the evidence supports ("the objection can
  no longer simply be _presumed_") rather than overstating "false."
- Charity governs **tone** (1 Peter 3:15), never the scoreboard: "not a hostile verdict, just what
  the text says once it's allowed to finish its own sentence" is the right frame — softening into
  *no* verdict is not. (Companion to the SHORT-FORM ANSWER RULE above, which requires answers to
  *lead* with the verdict; this rule requires every falsification piece to *state* it explicitly,
  cards and essays included.)

## FALSE-COMMON-GROUND RULE — shared words are not shared belief (mandatory; `apologia-argument` + `apologia-neutrality` enforce it)

**When a rival worldview uses the same vocabulary we do, never present the shared _words_ as shared
_belief_.** Islam calls Jesus "Messiah" and "a word from God," affirms the virgin birth, "honors" Jesus,
"awaits his return," and calls itself "monotheist" — but empties each term of the content that matters (it
honors Jesus precisely by refusing him worship as God; awaits his return as a Muslim prophet, not as God;
is monotheist while denying the Trinity). So framing this as "common ground worth treasuring," "shared
reverence," "holy ground we stand on together," or "we both honor Jesus" **sells an agreement that does not
exist and works against the page's goal.** It is a specific, high-frequency form of the over-concession /
unearned-symmetry defect (see "Orthodoxy outranks charity" above and the `apologia-neutrality` failure modes).

- **Concede the observation, refuse the inference.** You MAY state, as an accurate fact and a genuine
  conversational on-ramp, that Islam grants Jesus these titles / affirms the virgin birth. You may NOT let
  that stand as "shared faith," "common ground," or "shared reverence for the same Jesus."
- **Name the divergence in the same breath.** After noting a shared term, state plainly that the meaning
  diverges at the decisive point — and, where apt, that the very titles the rival grants actually strain
  against its own frame (the Messiah / Word / virgin-born Jesus that Islam names overflows "merely a
  prophet"). Ground the limit doctrinally where possible (e.g. **John 5:23** — to withhold worship from the
  Son is not to honor him).
- **Tells to rewrite:** "common ground worth treasuring"; "shared reverence/regard … is holy ground / the
  right place to begin"; "we both honor / revere / await"; "we stand on common ground"; "that shared
  reverence is a gift." Reframe to "shared words, not shared belief," "what Islam itself affirms," "how much
  your friend already grants" — always paired with the divergence.
- **Legitimate exceptions (keep):** (a) a shared _premise_ used to run an internal critique — e.g. the
  Qur'an's own praise of the earlier Scriptures driving the Islamic Dilemma — is a real shared premise, not
  false common ground; (b) numerical monotheism stated as a structural fact ("both bow before one Creator,
  not many gods") is acceptable **only** when immediately reframed to "but the two pictures of that one God
  diverge," and never as "the same God." When in doubt, fence with an `orthonote` ("A shared word, not a
  shared doctrine"). (Established by the 2026-07-20 owner-directed Islam sweep.)

## The mission — a check every agent applies

Apologia Daily exists to **strengthen Christians' confidence in the faith and equip them to give a
reason for the hope they have** (1 Peter 3:15), and to reach seekers honestly. So every piece of
content should *build the reader up* — leave a believer more confident and better equipped, and
never nearer to doubt. **But confidence must be EARNED by truth.** Never manufacture it with
overstatement, hype, a fabricated show of strength, or by hiding a real difficulty: that produces
*brittle* confidence that shatters the first time the reader meets a serious objection in the wild,
and it does more damage than an honestly-faced hard question ever could. Durable confidence rests on
the case being *genuinely* strong and *honestly* told. This is why honesty and confidence-building
never actually conflict here — the accurate, well-defended, non-overstated case is precisely the one
that holds a believer's faith under pressure. Each agent serves this within its own lane, and each
agent's definition states how.

## NON-NEGOTIABLE guardrails (mirror `api/ask.js`; enforced by every agent)

> **Canonical anchor: [`docs/STATEMENT_OF_FAITH.md`](docs/STATEMENT_OF_FAITH.md).** That file is
> the single source of truth for what the site believes — the Nicene and Apostles' Creeds
> (verbatim from the verified `sources/creeds.json`) plus the operational boundaries and the
> rejected-heresies list. The guardrails below are the same commitments in working form; the
> `apologia-orthodoxy` gate certifies against the Statement. **Faithfulness to Jesus Christ and
> Nicene orthodoxy outranks the platform's reach, growth, or success — every time.**

- **Classical orthodoxy** (Apostles'/Nicene Creed): full deity AND humanity of Christ;
  Trinity (one God, three co-equal co-eternal persons — never modalism, tritheism, or
  Arian/subordinationist drift); bodily resurrection; authority of Scripture; salvation
  through Christ alone. Never affirm heterodoxy in the site's own voice.
- **Orthodoxy outranks charity (HARD TIEBREAK).** Whenever gentleness/steelmanning and
  doctrinal safety pull apart, orthodoxy wins — every time. Charity governs *tone*, never
  the doctrinal scoreboard. When steelmanning or conceding, concede only (a) accurate
  facts and (b) the sincerity of the person — **never** the opponent's *frame*, the
  *soundness* of a mistaken inference, or a *symmetry* the evidence doesn't establish.
  **Concede the observation, never the inference.** Never phrase a concession so that a
  single sentence, lifted out of context as a pull-quote, could read as affirming,
  dignifying, or granting legitimacy to a heterodox claim (denial of Christ's full deity
  or humanity, subordinationism, modalism, tritheism, Arianism, works-salvation,
  universalism-as-certain, or any departure from Nicene orthodoxy). Red-flag words applied
  to a heterodox or skeptical claim: "careful," "coherent," "sound," "reasonable," "not
  baseless," "deserves its due," "the parallels are real." If any sentence has *any*
  plausible reading that hints at heresy, rewrite it until it doesn't — **even at the cost
  of sounding less charitable or less balanced. When in doubt, err toward the stronger,
  clearer orthodox statement.** A little too firm beats any hint of heresy left standing.
- **Denominational neutrality**: defend the faith common to Catholics, Orthodox, and
  Protestants; do NOT adjudicate intra-Christian disputes (baptism, predestination,
  papacy, sacraments, Marian doctrine, end-times) as settled.
- **Tone — 1 Peter 3:15**: gentleness and respect; steelman every objection in its
  strongest form before answering; never triumphalist, strawman, or condescending;
  represent other faiths (Judaism, Islam, JW, Mormonism, atheism) charitably.
  **Calibration cuts both ways**: charity is *accuracy*, not concession. Steelman means
  the opposing case in its strongest *accurate* form — never inflate the other side's
  evidence, grant symmetries that don't exist, or concede more than the evidence
  requires. Gentleness governs the tone, not the scoreboard. (Caught example: a line
  granting Bible and Qur'an face "the same standard" when Surah 4:82's no-contradiction
  test is the Qur'an's own, stricter, self-issued standard.)
- **No fabrication**: no invented quotes, citations, dates, or statistics.
- **Argument-specific rules**:
  - Kalam: "whatever **begins to exist** has a cause," never "everything has a cause."
  - Bible reliability: manuscripts prove **accurate preservation**, not that the content
    is true — argue truth separately.
  - Fine-tuning: the **data** is conceded by atheist physicists; **design** is the inferred,
    contested conclusion — never "scientists agree the universe is designed."
  - Suffering/evil: concede the mystery first; no tidy complete theodicy; Plantinga is a
    *defense* (consistency), not a proof.
  - Morality: never "atheists can't be moral"; objective moral **duties need a ground**.
  - Resurrection: lead with the 1 Corinthians 15:3–7 early creed (within ~2–5 years);
    never frame the evidence as "merely written decades later."

## The agent fleet

| Agent | Role | Access |
|---|---|---|
| `apologia-author` | Writes long-form deep-dive essays | write |
| `apologia-evidence` | Scholar-editor: accuracy, rigor, sourcing, steelmanning | write |
| `apologia-citations` | Fact-checks every scripture/source citation | read-only |
| `apologia-argument` | Judges argument soundness / steelmanning / overstatement | read-only |
| `apologia-editor` | Copy-edit: typos, grammar, markup, links | write |
| `apologia-orthodoxy` | **Final doctrinal gate** — runs last, certifies orthodoxy | read-only |
| `apologia-engineer` | **Code-quality & security reviewer** — api/*.js, RLS, tools, paywall (correctness, security, DRY smells); runs the test suite | read-only |
| `apologia-strategist` / `-research` / `-product` / `-growth` / `-seo` / `-social` | Growth/strategy/content research (not part of essay QA) | varies |

**Code health (distinct from the content pipeline).** `apologia-engineer` reviews *code* the way the
orthodoxy agent reviews *content*: run it on changes touching `api/`, `tools/`, Supabase RLS, or the
client auth/paywall JS. Backing it: a dependency-free **test suite** (`tests/*.test.mjs`, run with
`node --test tests/*.test.mjs`) that guards the nav single-source-of-truth, `answers/_data.json`
integrity, content-review-stamp JSON validity, the `api/ask.js` guardrail presence, and static
security invariants (service-role key never client-shipped; cron endpoints fail closed). CI runs it on
every push (`content-gate.yml` → `tests` job) and monthly (`monthly-code-audit.yml`). The
**agent-driven** monthly security sweep of `api/*.js` + RLS still needs a fresh-session Routine
(create it when `create_trigger` is reachable).

**Crisis-routing harness (`tools/test-crisis-routing.mjs`).** End-to-end guard for the `api/ask.js`
PASTORAL CARE path (a crisis message must never get the normal answer or the canned off-topic/denom
brush-off — see the pastoral/crisis exception above). Two modes: **offline** (default, CI-safe) extracts
the live `crisisBackstop` regex from `api/ask.js` and asserts it against a labeled corpus — this is
wired into `tests/content-integrity.test.mjs` so a regex regression fails CI; **`--live [baseUrl]`**
POSTs every case to the deployed `/api/ask` and classifies the real response by route (crisis / answer /
offtopic / denom), exercising the Haiku PASTORAL classifier too (abuse / harm-to-others cases the regex
can't catch). Live spends tokens and is IP-rate-limited (40/day) — run it sparingly from a web-enabled
session (the sandbox can't reach the endpoint). Add new crisis phrasings to the `CASES` corpus as they
come up.

## Evidence Library structure
- Hub: `evidence-library.html` (tabs fetch `ev-sN.html` fragments via JS).
- Mastery pages: `ev-m-*.html`. Deep-dive essays: `library/*.html`
  (template: `library/manuscript.html`). Index: `library/index.html`; also wire new
  essays into `sitemap.xml` and the relevant `ev-sN.html` section.

## Public-domain source library (`/sources`)
A searchable corpus of **public-domain** primary texts (creeds, Church Fathers, pre-1929
works) for grounding content in real, quotable sources. See `sources/README.md` for the
full rules. In short:
- **PD only** — the work *and* its translation must be public domain (19th-c. Schaff
  ANF/NPNF, Roberts–Donaldson, Robertson, etc.). Never store modern copyrighted
  translations or any copyrighted book here; use owned copyrighted books only as *research*
  that points to primary sources, in our own words.
- **Drafting:** `apologia-author`/`apologia-evidence` should `Grep`/`Read` `sources/*.json`
  (or `sources-index.json`) for on-topic passages and quote the **verified** ones with the
  entry's `section` + `translation` as the citation.
- **Gate:** an entry with `verified: false` may NOT be quoted in published content until
  `apologia-citations` confirms its exact wording against `source_url` and flips it to `true`
  — same "nothing ships unverified" discipline as the rest of the pipeline.
- **LIVE consumer (raises the stakes on `verified`):** the live `/api/ask` endpoint now
  **retrieves** the most relevant `verified:true` passages at answer-time and lets the model quote
  them with attribution (build emits `lib/sources-verified.js` = verified-only; `lib/retrieve-sources.js`
  scores them; `api/ask.js` injects them as a second system segment under a gated instruction block
  that keeps them "quotation-accurate historic witnesses, not Scripture," fences denominational
  disputes, and hard-blocks fabrication — "quote ONLY from the provided list"). So flipping an entry
  to `verified:true` now also puts its exact wording into live answers — hold the citations bar
  accordingly. Any change to that instruction block must re-clear argument + orthodoxy (it's a gated
  file). **Open follow-up:** the per-passage curator `note` fields (which fence delicate Trinity
  relation-of-origin/taxis readings) are NOT sent to the model — a block-level Trinity co-equality
  safeguard covers it, but a citations pass should fold the "the Godhead is one" conclusion into the
  `text`/a context field for the taxis-clause entries (e.g. Gregory of Nyssa "Not Three Gods").
- Rebuild the index after edits: `node tools/build-sources-index.mjs` (CI runs `--check`; emits both
  `sources-index.json` and `lib/sources-verified.js`).

## Argument briefs (`/briefs`) — a SECOND live-consumed gated retrieval layer
Sibling of `/sources`, but for **our-own-words argument framing** instead of verbatim quotes (see
`briefs/README.md`). Each brief is the core move + the strongest objection + the honest concession for a
topic, **distilled from our already-certified essays** (and, for structure only, the `docs/book-research/*`
maps). The live `/api/ask` endpoint retrieves the single best-matching brief and offers it to the model as
**OPTIONAL background framing** — a helper, not a leash: the instruction block keeps it optional,
non-quotable (not a source, not Scripture, not attributed to a scholar), and subordinate to every
guardrail, so the model still weighs its own knowledge and the pastoral path always wins.
- **Trust boundary (why it's safe):** `docs/book-research/*` (unverified leads) → a **certified essay**
  and/or a **gated brief** → `lib/briefs-verified.js` (gated-only) → live answer. The runtime never reads
  the raw notes; only twice-gated, our-own-words framing reaches a visitor.
- **Gate:** a brief reaches the live module ONLY when its `reviewed` object stamps BOTH `argument` and
  `orthodoxy` dates; `tools/build-briefs-index.mjs` enforces this (un-stamped → excluded, like `/sources`
  `verified:true`). The brief text is DOCTRINAL content — it passes `apologia-argument` + `apologia-orthodoxy`
  (+ `apologia-neutrality` for the resurrection/deity set) like any content, and **any change to the
  `buildBriefsBlock` instruction in `api/ask.js` re-clears argument + orthodoxy** (gated file).
- Rebuild after edits: `node tools/build-briefs-index.mjs` (CI runs `--check`; emits `briefs-index.json`
  + `lib/briefs-verified.js`). Guarded by `tests/content-integrity.test.mjs` (gated-only + block-stays-optional).

## Owned-book research notes (`docs/book-research/`)
In-our-own-words **research maps of owned copyrighted apologetics books** — the argument
structure plus an index of the **primary sources** the book cites (Scripture, Fathers,
scholars, dates) to chase down. **Distinct from `/sources`:** these are *maps of copyrighted
books*, not quotable text.
- **START HERE — the topical index:** [`docs/book-research/INDEX.md`](docs/book-research/INDEX.md) routes
  a topic (resurrection / minimal facts / empty tomb / creed dating / deity of Christ / naturalism / etc.)
  → the right note + section + the strongest **already-identified primaries** + any "do not use" flag.
- **Drafting (ALL content — essays, `ev-s*` cards, AND `/answers/*`):** before writing on a topic these
  books cover, `Grep`/`Read` `INDEX.md` (then the mapped note) to get the argument's shape, the strongest
  objections, and *which primary sources to cite directly* — then quote the **primaries**, verified, in
  our own voice. **The answers flywheel is explicitly in scope:** `tools/gen-answers.mjs`'s header names
  this as the "GROUNDING STEP" before drafting a new answer. (It's a documented convention, not a machine
  gate — a build script can't verify a file was read; the point is the chokepoint now names the step.)
- **Hard rule:** never reproduce the book's prose, and treat **every** citation in these notes as
  **unverified** until confirmed against the primary source and run through the normal pipeline
  (citations → argument → orthodoxy). The note is a lead, not a source.
- **⚠ The live `/api/ask` endpoint does NOT (and cannot) read this folder.** It's a deployed serverless
  function — it can't reach `docs/` (not deployed/served), and these are unverified copyrighted-book leads
  anyway. The ONLY path from an owned-book note to a *live* answer is: lead → verify the primary → add it
  to `/sources` as `verified:true` → it compiles into `lib/sources-verified.js`, which `api/ask.js`
  retrieves. So "make a book inform live answers" = promote its verified primaries into `/sources`, never
  point the runtime at `docs/book-research/`.
- **Current notes:** `i-dont-have-enough-faith-to-be-an-atheist.md` (Geisler & Turek — complete;
  covers the cosmological/teleological/moral arguments, NT reliability, resurrection, deity of
  Christ, miracles, and the anti-skepticism material); `body-of-proof.md` (Jeremiah Johnston —
  resurrection: the 7 reasons, 1 Cor 15 creed [Dunn 855 / Habermas 153], empty-tomb/burial archaeology
  [Magness], skeptic conversions [Paul/James, the Flew close], resurrection-vs-resuscitation,
  suffering/hope, and the Gospel-of-Peter / ancient-critics apparatus — **complete** [Intro + Chs. 1,
  3–12 + full Notes pp. 163–172; only the Ch. 2 body + copyright page deferred]; watch its popular-level
  overstatement, and **two hard flags: Ch. 4's Islam-slavery material is Bill-Warner/CSPI-sourced → DO
  NOT USE; Ch. 7 has no endnotes**); `did-jesus-really-say-he-was-god.md` (Mikel Del Rosario — deity of
  Christ argued *from Mark, via the enemies' reaction*: the two blasphemy scenes, ten data points,
  five best-explanation criteria; built from the already-gated reading behind the reading-club demo,
  and distinct from it); `case-for-the-resurrection-of-jesus.md` (Habermas & Licona — the flagship
  "minimal facts" book, and our own "Further study" rec on the resurrection answers; **mapped pp. 23–150
  + the complete A–Z bibliography + all 70 Chapter-3 numbered notes** — the full positive+defensive case
  with page-precise citations for Facts 1–2, incl. the creed-dating chain, the Ignatius=*Smyrnaeans* 3
  locus, and the Habermas survey; other chapters' numbered notes are the only nice-to-have gap);
  `in-defense-of-the-bible.md` (Cowan & Wilder, eds. — **ch. 6 only, COMPLETE**: Daniel B. Wallace, "Has
  the New Testament Text Been Hopelessly Corrupted?", pp. 140–163, all 51 footnotes indexed — the NT
  textual-reliability case: two ditches [radical skepticism vs. KJV-Only], the four-category
  viability/meaningfulness variant taxonomy [meaningful-AND-viable variants are <1%], and no cardinal
  doctrine on a disputed variant [incl. Ehrman's own concession]; feeds Biblical Reliability `ev-s4` —
  **used 2026-07-17 to strengthen `library/manuscript.html`** with the taxonomy + worked examples [Rom
  5:1, Jesus Barabbas, Mark 1:41, John 1:18], dual-consensus re-gated CLEAN; only this one chapter of the
  multi-author volume is captured).
  **⚠ Four PARTIAL notes added 2026-07-26 (books NOT owned, NOT read — mapped at thesis/chapter level only,
  from the authors' own open-access work, an open-access review, publisher frontmatter, and our own already-
  certified citations; every page number in them is *reported*, not verified; each carries a "TO COMPLETE
  (human action)" instruction to acquire a legitimate copy):** `gathercole-preexistent-son-and-thomas.md`
  (⭐ the Synoptic "I have come" preexistence case — **the top backlog row from the 2026-07-26 batch**;
  ⚠⚠⚠ the ancient angelic parallel is to the **form** of the saying, **never the nature of the speaker** →
  dual-consensus + a mandatory `orthonote`); `can-we-trust-the-gospels.md` (Williams — mostly corroboration;
  `library/names.html` already cites ch. 3 by name); `jesus-and-the-eyewitnesses.md` (Bauckham —
  corroboration throughout; ⚠⚠⚠ carries a standing **universalism fence**: mine the historiography only,
  cite him as a historian on a historical question, never as a theological authority, never in a
  further-reading list without naming the specific work); `on-the-reliability-of-the-old-testament.md`
  (Kitchen — corroboration; ⚠⚠ avowed maximalist, never cite him without his named critic, and the
  **Nuzi/patriarchal-customs argument is a trap, not a gap** — Thompson 1974 / Van Seters 1975).
  See each note's header for its own usage rules and citation-precision
  flags, and `INDEX.md` for topic routing.
- **Adding a book from page photos** (the user may do this from a phone session — upload ~5–10
  legible photos of a book they **own**, incl. footnote/bibliography pages): follow
  `docs/book-research/README.md`, which has the full workflow + copyright rules and points to the
  Geisler–Turek note as the format template. Owned books only — never Perlego or any service whose
  terms forbid automated extraction.

## Owned-video research notes (`docs/video-research/`)
The **sibling of `book-research/`, for apologetics VIDEOS** (lectures, debates, talks). Same idea, same
discipline: an in-our-own-words **map of leads** — the argument's shape + the **primary sources** the
speaker cites — never a copy of the talk. START at [`docs/video-research/INDEX.md`](docs/video-research/INDEX.md)
(the topic router) and read `docs/video-research/README.md` for the full rules.
- **A transcript is a copyrighted LEAD, not quotable text**, and auto-captions **mishear names/dates/
  numbers** — so treat *everything* as unverified until confirmed against the primary and run through
  `apologia-citations → apologia-argument → apologia-orthodoxy`. Never quote the transcript; never cite
  "someone said X in a video." We cite the **primary** the video pointed us to, verified.
- **Fetch helper:** `python3 tools/fetch-transcript.py <youtube-url-or-id>` (local/web-enabled session)
  writes the transcript to the **git-ignored** `docs/video-research/_transcripts/` — mine it, never
  commit or paste it. Commit only the our-own-words note + its INDEX row.
- **Drafting (ALL content — essays, `ev-s*` cards, AND `/answers/*`): assess this library per topic.**
  Before writing on a topic, `Grep`/`Read` `INDEX.md` **alongside** `book-research/INDEX.md`,
  `article-research/INDEX.md`, and the `/sources` corpus, and use whichever has the best material (a note
  may say a book/PD/article source covers it better). Documented drafting convention, like the book notes.
- **⚠ The live `/api/ask` endpoint does NOT (and cannot) read this folder** — same limit as the book
  notes (not deployed/served; unverified copyrighted leads). A video reaches a *live* answer only
  through the **same two gated doors any research lead uses** (never as a raw "video brief"):
  (1) **`/sources`** — lead → verify the primary → `verified:true` → `lib/sources-verified.js` (verbatim
  quotes the AI may quote); and (2) **`/briefs`** — lead → verified primaries → a **certified essay** →
  a gated brief (`reviewed` stamps argument+orthodoxy, +neutrality for resurrection/deity) →
  `lib/briefs-verified.js`, which `api/ask.js` retrieves as **optional our-own-words framing**. Both are
  our-own-words/verified and provenance-traced to certified content — never to the transcript or the
  speaker. So "make a video inform live answers" = promote its verified primaries into `/sources` and/or
  distil a certified-essay brief into `/briefs`; never point the runtime at `docs/video-research/`.

## Article/essay research notes (`docs/article-research/`)
The **third sibling** of `book-research/` and `video-research/`, for **modern copyrighted apologetics
JOURNAL ARTICLES and ESSAYS** (open-access journals, scholars' own posted papers, reference-encyclopedia
entries). Same discipline: an in-our-own-words **map of leads** — the argument's current shape + the
**primary sources** the article cites — never a copy of the article. START at
[`docs/article-research/INDEX.md`](docs/article-research/INDEX.md) (topic router) and read
[`docs/article-research/README.md`](docs/article-research/README.md) for the full rules.
- **An article is a copyrighted LEAD, not quotable text**, and we never cite "an article/essay said X" —
  we cite the **primary** it pointed us to, verified through `apologia-citations → apologia-argument →
  apologia-orthodoxy`.
- **Legality/ToS is the load-bearing rule:** use only genuinely-free sources — publisher-hosted
  **open-access** journals (Themelios, JETS free archive, Tyndale Bulletin), authors'/ministries' **own**
  posted PDFs (garyhabermas.com, reasonablefaith.org, ntwrightpage.com), permission-based aggregators
  (BiblicalStudies.org.uk), and peer-reviewed encyclopedias (SEP, IEP). **Sci-Hub = piracy, never;**
  academia.edu/ResearchGate only if it's the author's **own** upload; **free-portion only** for
  partly-paywalled journals (Philosophia Christi, Bulletin for Biblical Research); **read manually, don't
  scrape**; downloaded PDFs go to the git-ignored `docs/article-research/_pdfs/`, never committed.
- **Drafting (ALL content — essays, `ev-s*` cards, `/answers/*`): assess this library per topic** —
  `Grep`/`Read` its `INDEX.md` alongside the book/video INDEXes and `/sources`, and use whichever has the
  best material. Documented drafting convention, like the book/video notes.
- **⚠ The live `/api/ask` endpoint does NOT (and cannot) read this folder** — same limit as the book/video
  notes. An article reaches a *live* answer only through the same two gated doors: (1) lead → verify a
  **public-domain** primary → `/sources` (`verified:true`); or (2) lead → verified primaries → a
  **certified essay** → a gated **`/briefs`** entry. Never a raw "article brief," never attributed to the
  article or author.

## Content backlog — the release map (`docs/content-backlog.md`)
One prioritized queue for every **content update/addition the research libraries surfaced but haven't
shipped** — so accuracy/currency fixes actually reach the site and nothing is lost between a mining run
and a release.

**MANDATORY CROSS-CHECK STEP — every mining run (book, video, OR article/journal).** Mining a source is
**not finished when the note is written.** Before a mining run is done, it MUST scan our **current live
content** against the source's leads and decide, for each substantive lead, whether the new material can
*improve what we already have*. Concretely: for each substantive lead, `Grep`/`Read` the on-site home for
that topic — the certified essay in `library/*.html`, the matching `/answers/*`, the `ev-s*` card, and any
live `/briefs` or `/sources` entry — then classify it:
- **Corroboration** — the point is already made, accurately and current → **no backlog row**, but record it
  *as corroboration* in the note's "Live-door status" + the source ledger (so the record shows we *checked*
  and found it covered, not that we skipped the comparison).
- **Improvement** — the lead would **correct an error, update stale/superseded info, strengthen the case
  with a new verified primary, or open a topic/objection we lack** → **log a `content-backlog.md` row**
  (topic · the specific improvement · the primary to verify · the target page · priority).

The whole point of the three research libraries is this comparison: a source we mine but never check against
the site can't improve anything. The corroboration-vs-improvement classification must be **visible in the
note** so a later reader can see the scan actually happened. (Standing example: the
`peterson-academy-ot-canon-canonicity.md` note was logged corroboration-only *after* `library/canon.html`
was read and found to already cover it — neutrally — so no row was warranted.)

A content session then executes each backlog row in pipeline order — **update/create the certified essay
(re-gate: citations → argument → orthodoxy, dual-consensus for deity/resurrection) → then the
brief/`/sources` → rebuild the index** — and marks the row Done + flips the source note's ledger. This is
how a "latest book/video/article says X" lead becomes a live, verified answer without skipping the
essay-level citation check.

## Deploy workflow (security-critical)
- Work on the feature branch; **never `git checkout main`** (a stale local main lacks
  `.claude/agents/` and de-registers the agent fleet).
- Deploy by fast-forward push: `git push origin <branch>:main`.
- Apply edits with assert-guarded scripts (verify exact-match counts) and re-verify
  footnote `<sup>↔<li>` integrity before deploying.
- **Content-review gate (enforced):** any new/changed essay, `ev-s*` fragment,
  `worldviews.html`, reel spec, or `api/ask.js` must carry a review stamp recording that
  the argument + orthodoxy gates ran:
  `<!-- content-review: {"argument":"<date>","orthodoxy":"<date>","by":"<name>"} -->`
  (HTML/JS) or a top-level `"reviewed": {argument, orthodoxy, by}` (reel-spec JSON).
  Verify before deploy: `node tools/check-content-review.mjs --changed` (checks files
  changed vs `origin/main`); `--audit` lists everything unstamped. CI runs it on every
  push/PR (`.github/workflows/content-gate.yml`) — only CHANGED files are gated, so
  existing content is stamped as it's next touched. Same honest caveat as the answers
  gate: the stamp is an auditable human assertion, not proof the agents ran — never stamp
  a check you didn't run. (`/answers/*` keep their own gate in `tools/gen-answers.mjs`.)
- **Orthodoxy tripwire scan (whole-corpus regression guard):**
  `node tools/check-orthodoxy-tripwires.mjs` scans **every** live page (not just changed ones)
  for a curated set of heterodox phrasings ("the Word was a god," "Jesus became God," "we worship
  the same God" of Allah, modalist "God is one person," works-salvation, universalism-as-certain,
  etc.). It uses a **baseline allowlist** (`tools/orthodoxy-tripwires-baseline.json`) so it only
  fails on a *newly introduced* match — legitimate refutation/attribution context is baselined.
  A new match is either real drift (fix the wording) or legitimate new refutation context (accept
  on-record with `--update`, commit the baseline diff). Coarse net, not a doctrinal judge — the
  orthodoxy agent is that. CI-blocking.
- **Answer-openings lint (lead-with-the-answer guard):**
  `node tools/check-answer-openings.mjs` scans every `/answers/*` opening for known front-loaded
  tells (charitable throat-clearing / conceding before answering — "It's a fair question," "This is
  a serious objection," "Let's not soften this," "The honest place to begin is with a concession,"
  etc.) and **fails the build** on any non-baselined hit. Baseline allowlist:
  `tools/answer-openings-baseline.json` (accept a deliberate exception with `--update`). Coarse
  regex net, NOT a judge — it complements the `apologia-argument` gate (which catches front-loading
  that has no fixed opening phrase). Enforces the SHORT-FORM ANSWER RULE mechanically so a
  front-loaded opening can't ship even if a future session's gate is sloppy. CI-blocking, plus a
  `node:test` case in `tests/content-integrity.test.mjs`.
- **Answer over-concession lint (unearned-symmetry guard):**
  `node tools/check-answer-concessions.mjs` is the companion to the openings lint: it scans the
  **whole answer AND the `meta` subtitle** (not just the opening) for known over-concession /
  unearned-symmetry tells toward a rival or heterodox view ("in a warmer/looser sense," "it would be
  ungracious to pretend otherwise," "grant that warmly," "the parallels are real," "X love Jesus
  and…," the "person at your door qualifies," etc.) and **fails the build** on any non-baselined hit.
  Baseline allowlist: `tools/answer-concessions-baseline.json` (accept a genuinely-defended
  in-refutation exception with `--update`; `--audit` shows every hit with context). **This closes the
  exact gap that let the "Are Mormons/JWs Christians?" over-concessions ship** — they *led* with the
  correct "no," so the openings lint (first-sentence only) passed them while the concession sat in
  sentence 2 / the close / the meta, and the semantic pull-quote catch only runs in periodic agent
  sweeps. Coarse regex net, NOT a judge — it complements the `apologia-argument` + `apologia-neutrality`
  + `apologia-orthodoxy` pull-quote test (which catches context-dependent over-concession no fixed
  phrase can). CI-blocking, plus a `node:test` in `tests/content-integrity.test.mjs`.
- **Stamp-integrity check (certified-then-edited guard):**
  `node tools/check-stamp-integrity.mjs` flags any gated file whose *doctrinal* lines were changed
  by a commit **after** its `content-review` stamp without a re-stamp (nav/OG/sitemap/boilerplate
  edits are filtered out and do not trip it). Closes the "gate certifies a version that no longer
  exists" hole. Runs `--warn` (non-blocking report) in CI; a flag means: re-run argument +
  orthodoxy on that file, then bump the stamp date.
- **Dual-consensus for the highest-stakes content (Trinity, deity/person of Christ, salvation,
  world-religions).** For these pages, one orthodoxy pass is not enough: require **both**
  `apologia-orthodoxy` AND the adversarial `apologia-neutrality` red-team to certify CLEAN (two
  independent lenses must agree) before deploy. Record both in the stamp `by` note. For all other
  content the single orthodoxy gate remains the bar.
- **Doctrinal clarifiers (`orthonote`) — STANDARD for delicate-but-orthodox phrases.** When a
  phrase is orthodox but a compressed reader could misread it as heterodox (subordination,
  modalism, tritheism, partialism, patripassianism, works-salvation, universalism-as-certain,
  "same God," the retired echad overreach, etc.), fence it on the page with a clarifier: a gold
  ＊ that opens an "Is saying / Not saying" box. This is exactly where the `apologia-orthodoxy`
  gate leaves a NOTE-level "delicate but orthodox" flag — turn those NOTEs into clarifiers rather
  than leaving them for a later human pass. **How:** essays/fragments — inline the markup pattern
  documented at the top of `library/orthonote.js` and add `<script src="/library/orthonote.js"
  defer></script>`; answer pages — add a `clarifiers` array to the `_data.json` entry (drift-safe,
  data-driven; the generator injects it into the visible answer only, never the JSON-LD/`"a"`).
  The clarifier's box text is DOCTRINAL content and must pass the argument + orthodoxy gates like
  any content. Registry of every live clarifier: `docs/clarifiers.md` (regenerate with
  `node tools/list-clarifiers.mjs`).
