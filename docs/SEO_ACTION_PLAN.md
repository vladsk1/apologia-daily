# SEO Action Plan — Apologia Daily

**Prepared:** 2026-08-14 · **Based on:** Google Search Console (last 3 months, captured 2026-08-14) + a read of the live repo.
**Audience:** the owner (non-developer). Every recommendation names the exact page and the exact change.

> **Read this first — the one thing that governs everything below.**
> The site is ~7 weeks indexed, has **727 impressions / 6 clicks / avg position 43** in 3 months, and — this is the key fact — **almost no inbound links from other websites.** Google ranks pages mostly on *authority* (who links to you) and *relevance* (what's on the page). We can fix relevance today; authority takes months and is mostly off-page (other sites linking to us). So be honest about the ceiling: **on-page tweaks move a page from position 55 to maybe 35–45; they do NOT move it to page 1 on their own.** Page 1 for competitive terms like "fine tuning argument" needs backlinks, which is a separate, slower effort. This plan front-loads the cheap on-page wins *and* flags where the real bottleneck is links, so you don't over-invest in title tweaks expecting a miracle.
>
> **Also:** the www-vs-non-www canonical bug was only fixed on 2026-08-14, and ~16 answer pages were just submitted for indexing. **A lot of the "we rank badly" picture is really "we weren't indexed yet."** Give it 3–4 weeks and re-pull GSC before drawing conclusions — many answer pages have never had a fair chance to rank.

---

## Quick wins (do these first — highest impact for least effort)

1. **Fix a wrong internal link on the Kalam essay.** `library/kalam.html` line ~138 — the "Short on time? Read the quick answer →" link points to `/answers/does-god-exist.html`, but it should point to `/answers/what-is-the-kalam-cosmological-argument.html`. It's sending readers (and Google) to the wrong answer. One-line fix, not gated content. **(Non-doctrinal edit — safe.)**
2. **Create a "Why does God allow natural disasters?" answer page.** We have real, repeated demand for this exact phrasing (see cluster #6) and **no page that targets it** — only the long essay `library/evil.html`, which is about the whole problem of evil and doesn't match the query. This is the single clearest content gap in the whole dataset. (Gated — goes through the normal answer pipeline.)
3. **Re-pull GSC in ~3 weeks.** The canonical fix + re-indexing on 2026-08-14 should surface the `/answers/` section, which was invisible before. Don't act on the current "answers rank badly" signal — they mostly weren't indexed.
4. **Add the missing "practice it" link on the Kalam answer** for consistency with the other answer pages (see Internal Linking, item C). Trivial, non-doctrinal.

Everything else is a slower build. The rest of this document explains what to expect and in what order.

---

## 1. "Winnable now" list

Honest reality: the queries where we're genuinely *close* (position under 25) are almost all **1–2 impression, tiny-volume** terms. The realistic near-term wins are **clusters sitting at position 40–50 with combined volume**, where consolidation + a handful of links could reach page 2 and eventually page 1.

| Query | Impr | Pos | Target page (confirmed in repo) | The specific move |
|---|---|---|---|---|
| **brent nongbri** | 2 | **5.5** | `library/manuscript.html` (only page mentioning Nongbri) | **Already page 1 — leave it.** Low volume, a scholar-name search. Nothing to do except note we have topical authority on manuscript-dating. |
| minimal facts argument gary habermas resurrection | 1 | **15** | `library/minimalfacts.html` | Already page 2. Make sure "Gary Habermas" + "Michael Licona" appear in an `<h2>` or early paragraph (they're in the meta — confirm they're in visible body headings). Small nudge only. |
| kalam theory | 1 | **20** | `answers/what-is-the-kalam-cosmological-argument.html` | Page 2. Add "kalam theory" naturally once in body (people mis-call it a "theory"). Tiny. |
| was jesus buried | 1 | 33 | `answers/was-jesus-really-buried-in-a-tomb.html` | Confirm indexed post-fix; add internal links from the resurrection answers (see linking section). |
| jesus of nazareth historicity | 1 | 36 | `library/hist_jesus.html` | Already targeted well; needs links/indexing, not on-page change. |
| **the fine-tuning cluster** | ~40 combined | 40–50 | `library/finetuning.html` + `answers/is-the-universe-fine-tuned-for-life.html` | **The best aggregate bet.** ~15+ distinct variants all at pos 40–50 pointing at two strong pages. Consolidation + 3–5 backlinks could pull the whole cluster onto page 2, then page 1. See cluster #1. |
| **the jesus-historicity cluster** | ~21 combined | 46–56 | `answers/did-jesus-really-exist.html` + `library/hist_jesus.html` | Multiple phrasings ("did jesus exist", "was jesus of nazareth a real person") at pos 47–56. Good pages already exist; needs indexing + links. See cluster #3. |

**Bottom line:** there is no single "tweak this title and jump to page 1" opportunity in the data. The winnable play is **the fine-tuning and Jesus-historicity clusters**, because we already have strong, well-titled pages there and a lot of aggregated impressions — they just need indexing time and a few links.

---

## 2. Opportunity clusters, ranked by total impression volume

For each: do we have a page, is it well-targeted, and what is the *single* highest-leverage move.

### Cluster 1 — Fine-tuning (~100+ impressions, the largest) · positions 40–63
- **Pages:** ✅ `library/finetuning.html` (essay), ✅ `answers/is-the-universe-fine-tuned-for-life.html` (short answer), ✅ `answers/does-the-multiverse-explain-fine-tuning.html`, ✅ `ev-m-finetuning.html` (practice). Strong coverage.
- **Titles already contain the keyword** ("The Fine-Tuning Argument for God"). Good.
- **Highest-leverage move:** this is a **links problem, not a content problem.** The page competes with GotQuestions, Catholic Answers, 1000-Word Philosophy, Reasonable Faith, and academic PDFs — all high-authority. On-page is already good. The move is (a) make sure both pages are indexed post-fix, (b) earn 3–5 relevant backlinks (Christian blogs, apologetics forums, Reddit r/apologetics answers linking the essay), (c) consolidate the many long-tail variants by keeping ONE canonical strong essay rather than splitting. Do **not** create more fine-tuning pages — you'd cannibalize yourself.
- **Note:** de-prioritize the "penrose formula finely tuned universe valid" and "stanford encyclopedia fine-tuning" variants — those searchers want Penrose's math or the SEP article specifically, not us.

### Cluster 2 — Kalam / cosmological argument (~108 impressions) · positions 58–87
- **Pages:** ✅ `library/kalam.html`, ✅ `answers/what-is-the-kalam-cosmological-argument.html`, ✅ `answers/what-caused-the-universe.html`, ✅ `answers/did-the-universe-have-a-beginning.html`, ✅ `ev-m-kalam.html`. Excellent coverage.
- **Problem:** "kalam argument" (64 impressions, the biggest single query on the whole site) sits at **position 74.6** — page 7–8. That's deep. "kalam cosmological argument" is at 58. These are high-competition (Wikipedia, Reasonable Faith / William Lane Craig own them).
- **Highest-leverage move:** **fix the broken internal link** (kalam essay → wrong answer page; see Quick Wins #1), then treat this as a **long-term authority play**, not a quick win. Position 74 → page 1 is not happening on-page alone. Make the essay the strongest single resource, interlink the three kalam answers tightly, and pursue links. Realistic near-term goal: 74 → ~40s.

### Cluster 3 — Jesus historicity (~21 impressions) · positions 46–56
- **Pages:** ✅ `answers/did-jesus-really-exist.html`, ✅ `library/hist_jesus.html`, ✅ `answers/is-there-evidence-for-jesus-outside-the-bible.html`. Well covered.
- **Highest-leverage move:** this is **more winnable than kalam** — lower competition, we have a page titled exactly for the query, and we're already at pos 47–56 (page 5, but the pages are strong). Priority: confirm indexing post-canonical-fix, then interlink with the resurrection/burial answers. A few links here go further than in fine-tuning/kalam because the SERP is less dominated by mega-sites. **De-prioritize** the "did jesus exist? the historical argument for jesus of nazareth" variant — that's people looking for Bart Ehrman's *book* by that title.

### Cluster 4 — Minimal facts / resurrection (~21 impressions) · positions 41–68
- **Pages:** ✅ `library/minimalfacts.html`, ✅ `answers/what-is-the-minimal-facts-argument.html`, ✅ `ev-m-minimal.html`, plus the whole resurrection answer set (`is-there-evidence-jesus-rose-from-the-dead`, `did-jesus-really-rise-from-the-dead`, etc.).
- **Highest-leverage move:** ensure "Gary Habermas" and "Michael Licona" appear in a **visible heading or first paragraph** of `minimalfacts.html`, not just the meta description (the query "minimal facts argument gary habermas resurrection" is already at pos 15 — a name-anchored near-win). Then interlink the resurrection cluster (see linking section).

### Cluster 5 — NT manuscripts (~12 impressions) · positions 58–62
- **Pages:** ✅ `library/manuscript.html`, ✅ `answers/can-we-trust-the-new-testament-manuscripts.html`, ✅ `answers/has-the-bible-been-changed-over-time.html`.
- **Highest-leverage move:** the queries are "new testament manuscripts", "biblical manuscript evidence", "bible manuscript evidence". The essay title is "Are the New Testament Manuscripts Reliable?" — good, but consider whether the visible H1/early copy contains the noun phrase "manuscript evidence" (people search the evidence, not just "reliable"). Minor. Otherwise a links problem. We already rank #5 for "brent nongbri" here, which shows the page has *some* topical trust.

### Cluster 6 — Problem of evil / natural disasters (~6 impressions) · positions 43–61 — **FLAGGED GAP**
- **Queries:** "why does god allow natural disasters" (3), "why does god allow natural disasters to happen" (2), "why did god create earthquakes" (1).
- **Pages:** ❌ **No page targets this phrasing.** `library/evil.html` (the problem-of-evil essay) mentions natural disasters only 3 times in passing (tsunami, earthquakes) and is titled "Why Would a Good God Allow So Much Suffering?" — it does **not** match the query. There is **no short answer page for suffering OR for natural disasters at all** — the entire problem-of-evil topic has an essay but zero `/answers/` entries.
- **Highest-leverage move — the clearest new-content opportunity in the dataset:** commission **one new answer page** targeting the exact phrasing, e.g. `answers/why-does-god-allow-natural-disasters.html`, with an H1/title like "Why does God allow natural disasters?" It links up to `library/evil.html` for the deep dive. This is a lower-competition, high-empathy query where a *direct-match* short answer can rank faster than a broad essay. **Also worth a companion** `answers/why-does-god-allow-suffering.html` (the parent topic — searched heavily everywhere, and we have zero answer coverage of it). Both go through the full gated content pipeline (they touch the problem of evil — hand to the evidence/author agents).

---

## 3. Title / meta rewrite batch — PREPARED, NOT TO SHIP BLIND

> ⚠ **Every essay and answer is gated content.** Titles and meta descriptions live in the same file as doctrinal copy, and changing them still requires the file to pass the **argument + orthodoxy gates** (and, for answers, the **answer-openings + answer-concessions lints**) before deploy. So treat this as a **prepared batch for a future gated pass**, not a set of edits to push today. I have **not** edited any live file.
>
> Honest caveat: most current titles are *already* keyword-aligned and good. These rewrites are marginal CTR/relevance nudges, not ranking levers. Prioritize them low.

**1. `library/finetuning.html`** — current is already strong; leave as-is unless testing.
- Keep: `Is the Universe Fine-Tuned for Life? The Fine-Tuning Argument for God | Apologia Daily` (58 chars before brand — good, contains the query "fine-tuning argument for god").

**2. `answers/is-the-universe-fine-tuned-for-life.html`**
- Current title: `Is the universe fine-tuned for life? | Apologia Daily`
- Suggested: `Is the Universe Fine-Tuned for Life? A Clear Answer | Apologia Daily` — minor; current is fine.

**3. `library/kalam.html`**
- Current: `Did the Universe Begin? The Kalam Cosmological Argument | Apologia Daily`
- Suggested: `The Kalam Cosmological Argument: Did the Universe Begin? | Apologia Daily` — **lead with the exact keyword phrase** "Kalam Cosmological Argument" (the query), since the current title buries it after a question. Low-cost relevance nudge.

**4. `answers/what-is-the-kalam-cosmological-argument.html`** — current `What is the Kalam cosmological argument?` is exact-match to the query. **Leave as-is.**

**5. `library/hist_jesus.html`** — current `Did Jesus of Nazareth Really Exist? The Historical Evidence` matches "did jesus of nazareth really exist" and "the historical evidence." **Leave as-is** (strong).

**6. `answers/did-jesus-really-exist.html`** — current `Did Jesus really exist?` is exact-match. Consider `Did Jesus Really Exist? What Historians Actually Say | Apologia Daily` to widen match to "was jesus of nazareth a real person" intent and improve CTR. Optional.

**7. `library/minimalfacts.html`**
- Current: `The Minimal Facts Argument for the Resurrection | Apologia Daily`
- Suggested: `The Minimal Facts Argument (Habermas & Licona) | Apologia Daily` — put the scholar names in the title to capture "minimal facts argument gary habermas resurrection" (already pos 15). Judgement call — "for the Resurrection" is also valuable; could do `The Minimal Facts Argument for the Resurrection — Habermas & Licona`.

**8. `library/manuscript.html`**
- Current: `Are the New Testament Manuscripts Reliable? | Apologia Daily`
- Suggested: `New Testament Manuscript Evidence: Are the Copies Reliable? | Apologia Daily` — leads with the noun phrase "New Testament Manuscript Evidence" that people actually search ("new testament manuscripts", "manuscript evidence"), while keeping the reliability question.

**None of these will move a page more than a few positions.** They're worth doing *when a gated pass is already touching the file* for other reasons, not as a standalone project.

---

## 4. Internal-linking gaps (concrete, from reading the repo)

Good news: the structure is mostly sound — answers have a "Go deeper" link to the essay + a "practice it" link, essays have a "Short on time? quick answer" link and a JS-injected "Related arguments" panel. The gaps:

**A. Kalam essay links to the wrong answer.** `library/kalam.html` (~line 138): "Short on time? Read the quick answer" → `/answers/does-god-exist.html`. **Should be** `/answers/what-is-the-kalam-cosmological-argument.html`. This is a real relevance leak — the Kalam essay's own short-answer link doesn't go to the Kalam answer. **Fix (non-doctrinal, safe).**

**B. The "Related arguments" panel is JavaScript-injected (`library/related.js` → `related.json`).** Google *can* render it, but client-side-injected links carry **less crawl/authority weight** than plain HTML `<a>` links, and the panel **only links essay→essay — never to the `/answers/` pages or mastery pages.** Consider: (1) adding a small **static** (plain-HTML) "Related" block of 3–4 hand-picked links to the highest-value essays, and (2) including the matching `/answers/` page in each essay's related set. This is the biggest *systematic* linking weakness — the answer layer and essay layer are only loosely cross-woven, and the cross-weaving that exists is JS-dependent.

**C. Kalam answer is missing its "practice it" link.** `answers/what-is-the-kalam-cosmological-argument.html` (~line 91) has "Go deeper: … full essay →" but **no** "practice it →" link to `ev-m-kalam.html` — whereas `answers/is-the-universe-fine-tuned-for-life.html` and `answers/did-jesus-really-exist.html` both link to their `ev-m-*` page. Add it for parity (helps crawl depth into the mastery pages). **Non-doctrinal.**

**D. Cluster interlinking is thin.** Within a topic cluster, the sibling answers don't consistently point at each other in body copy. Concrete adds worth making (in the "Related questions" lists that already exist):
- Resurrection cluster: `was-jesus-really-buried-in-a-tomb`, `is-there-evidence-for-the-empty-tomb`, `did-jesus-really-rise-from-the-dead`, `what-is-the-minimal-facts-argument` should each list the others. ("was jesus buried" sits at pos 33 with no strong internal support.)
- Jesus-historicity cluster: `did-jesus-really-exist` ↔ `is-there-evidence-for-jesus-outside-the-bible` ↔ `was-jesus-copied-from-pagan-myths`.
- Fine-tuning cluster: `is-the-universe-fine-tuned-for-life` ↔ `does-the-multiverse-explain-fine-tuning` ↔ `is-earth-specially-designed-for-life`.

**E. When the natural-disasters answer is built (cluster #6), wire it both ways** to `library/evil.html` and to a future `why-does-god-allow-suffering` answer.

> All linking edits except A and C touch files that also contain doctrinal copy in some cases; the "Related questions" lists in answers are data-driven (`answers/_data.json`) and regenerated by `tools/gen-answers.mjs` — adding related links there is low-risk but still runs through the answers gate. A and C are plain navigation links and are safe.

---

## 5. De-prioritize list (do NOT spend effort here)

| Query / effort | Why skip it |
|---|---|
| **"apologia curriculum"** (pos 30, 6 impr) and bare "apologia" searches | Brand collision with **Apologia Educational Ministries** (apologia.com) — the "#1 publisher of creation-based homeschool science curriculum," a large, decades-old, high-authority brand. Searchers want *their* curriculum, not our Q&A. We will not, and should not try to, rank for their brand. See brand note below. |
| "stanford encyclopedia fine-tuning…" (pos 8–10) | Navigational — people want the SEP article specifically. Our pos-8 ranking here converts near zero. Ignore. |
| "is penrose formula for finely tuned universe valid" (6 impr) | Wants Penrose's specific math/critique, not an intro apologetics page. Low fit. |
| "did jesus exist? the historical argument for jesus of nazareth" | Bart Ehrman **book title** — book-buyers, not us. |
| "site:apologiadaily.com" (41 impr, pos 18) | Self/brand navigation. Not a ranking signal; ignore in analysis. |
| "kalam argument" chasing page 1 short-term | Pos 74 vs. Wikipedia + William Lane Craig. Real, but a **long-term links** play — don't expect on-page work to crack it this quarter. |
| Creating MORE fine-tuning or kalam pages | Cannibalization risk. We already have essay + multiple answers + mastery page per topic. Strengthen and link the existing ones; don't dilute. |

---

## Brand collision assessment ("Apologia" overlap)

**Cost:** modest but real. Anyone searching bare **"apologia"** or **"apologia curriculum"** wants the homeschool-science company (apologia.com), which massively out-authorities us on that name. We captured 6 impressions at pos 30 for "apologia curriculum" — those are essentially wasted (wrong intent) and we'll never win them. The overlap mainly costs us the ability to build a bare-"apologia" brand presence; it does **not** hurt our topic pages ("fine tuning", "kalam", etc.), which is where our real traffic is.

**What to do:** Not much, and don't fight it.
- **Always use the full brand "Apologia Daily"** consistently (title tags already do — good). Never market as just "Apologia."
- The site is Australia-based and the owner is Vlado Kiparizov — there's no legal issue (different sector: apologetics content vs. homeschool curriculum), just a search-visibility overlap.
- Long term, brand searches for **"apologia daily"** specifically are clean and ours — encourage those (in social bios, reel captions, any print). Don't try to rank for "apologia" alone.
- **Do not** create "apologia curriculum"-style pages to capture that traffic — wrong audience, and it muddies our topical focus.

---

## 6. "Do this in order" — a plain-English checklist for the owner

1. **Wait ~3 weeks, then re-pull Search Console.** The canonical bug was only fixed on 2026-08-14 and the answer pages were just submitted for indexing. Half the current "bad rankings" are really "not indexed yet." Re-measure before deciding anything.
2. **Fix two small links** (safe, non-doctrinal, ask the developer/agent):
   - Kalam essay's "quick answer" link → point it to the Kalam answer, not "does God exist."
   - Add the missing "practice it →" link on the Kalam answer page.
3. **Commission one new answer page: "Why does God allow natural disasters?"** — real demand, zero current coverage. And strongly consider a companion "Why does God allow suffering?" answer. These go through the normal review pipeline (hand to the content/evidence team).
4. **Tighten internal links within each topic cluster** (resurrection, Jesus-historicity, fine-tuning) so the sibling answers point at each other, and add the matching `/answers/` page into each essay's related set. This helps Google find and trust the whole cluster.
5. **Start earning backlinks — this is the real ceiling.** Nothing above gets us to page 1 for competitive terms without other sites linking to us. Practical, honest options: answer questions on Reddit (r/Christianity, r/apologetics) and link the relevant essay when genuinely helpful; get listed in Christian apologetics directories and blogrolls; guest-post or get a mention from an established apologetics blog; ask any ministry partners to link. Even 5–10 quality links would visibly lift the fine-tuning and Jesus-historicity clusters.
6. **Only then** batch the title/meta tweaks (section 3) into a gated content pass — they're marginal and not worth a standalone effort.
7. **Ignore** the "apologia curriculum" brand-collision traffic entirely. Focus all energy on topic queries, where the intent actually matches what we offer.

---

### Honest expectation-setting
- The fastest visible wins will come from **indexing catching up** (weeks 1–4) and the **new natural-disasters/suffering answer** (a fresh, well-targeted page in a low-competition, high-empathy niche can rank faster than our essays did).
- The fine-tuning and Jesus-historicity clusters are **winnable to page 1–2 over a few months** *if* a handful of backlinks land — they're already well-built on-page.
- Kalam ("kalam argument", pos 74) and bare "apologia" are **not** near-term wins; don't judge the plan by them.
- The single biggest lever for *all* of these is **off-page authority (links)**, not more on-page tweaking. Budget accordingly.

*Sources checked for competition/intent: [Apologia homeschool curriculum](https://www.apologia.com/), [Catholic Answers — Fine-Tuning](https://www.catholic.com/magazine/online-edition/the-fine-tuning-argument), [GotQuestions — Fine-Tuning](https://www.gotquestions.org/fine-tuning-argument.html).*
