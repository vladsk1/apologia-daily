# Becoming "the Logos of apologetics": market assessment, what to build, and what it takes

*Written 2026-09-23. Strategy only; no live content or code changed.*

**This builds on earlier research and does not redo it.** Read it alongside
`docs/NUMBER_ONE_ROADMAP.md` (2026-07-02), `docs/COMPETITIVE_LANDSCAPE.md` (2026-07-31),
`docs/MARKET_RESEARCH_2026-09-03.md`, `docs/LEARNING_ROADMAP_2026-09-09.md` and
`docs/APOLOGETICS_CERTIFICATE_BENCHMARK.md`. What is new here is the **Logos lens**: what Logos
actually is, which parts of it an apologetics product should copy, and a costed plan.

**How the facts were checked:**
- **[repo]** figures were measured today in this checkout.
- **[web]** facts come from search-engine summaries. Vendor pages were egress-blocked from this
  sandbox, so re-check every price before quoting it.
- Anything marked **estimate** is a planning estimate, not a measurement.

---

## 0. The verdict

**Logos is not a Bible app. It is a *research platform over a structured library*.** It has five
layers:

1. an enormous licensed library;
2. **datasets** that tag that library (people, places, events, topics);
3. **guides** that fan one query out across everything;
4. **workflow tools** that turn research into something you deliver (sermons);
5. courses, AI search and sync, which keep a professional paying $100–200 a year for a decade.

**Nobody has built this for apologetics.** The field today is:
- blogs and ministry apps (Reasonable Faith, STR, CrossExamined, the SES app);
- Q&A sites (GotQuestions);
- chatbots (Apologist Project, Scriptured, Logetics);
- a 36-volume "Apologetics Collection" sold **inside** Logos as ordinary books.

None of these treats the **argument** as its basic unit of data. Logos is organised around the book
and the passage. An apologetics platform should be organised around the **claim, the objection,
the scholar who holds each view, and the primary source**.

**We are closer to that than it looks.** Much of the raw material already exists [repo]:
- 92 footnoted essays;
- 75 mastery pages;
- 111 answer pages;
- 156 verified primary-source passages;
- 97 gated argument briefs;
- "Source / Who holds it" evidence panels on 13 essays;
- a registry of **29 retired claims**.

That last item is something Logos cannot offer at any price: **a maintained list of apologetics
arguments that do not survive scrutiny.** The problem is that all of it is stored as **prose inside
HTML pages**, not as data. The central project is to **turn the library into a graph, then build
guides and a workflow tool on top of it.**

**Before any of that, the foundations have to be real.** The paywall, named reviewers, the app
and the freshness bug (§5 Phase 0) are all still open, and several have been open since July.
A platform built on them inherits their problems.

---

## 1. What Logos actually is (the model we are copying)

| Layer | What Logos has [web] | Why it matters |
|---|---|---|
| **Library** | 120,000+ ebooks from 500+ publishers; a 36-volume Apologetics Collection (McGrath, Geisler, Kreeft, Habermas) | Breadth. Everything in one place |
| **Datasets** | The Factbook: 20,000+ pages of tagged people, places, events, topics and theologians; manuscript explorers | The library becomes **data** that can be queried, not just text |
| **Guides** | Passage Guide: type a reference and get commentaries, cross-references, atlas and media together | **One question fans out** to everything relevant |
| **Workflow** | Sermon Builder, now with AI-suggested outlines, questions and illustrations | Turns research into the thing the user has to **deliver** |
| **Courses** | Mobile Ed: 270+ video courses (including *AP101 Introducing Apologetics*) with searchable transcripts, activities and retake-friendly quizzes | Education inside the tool |
| **AI** | AI search and synopses over **the user's own library** | Answers grounded in trusted sources |
| **Business** | Subscriptions at about **$99.99 / $149.99 / $199.99 a year** (Premium/Pro/Max) plus book sales. About **$71.8M revenue**, about 500–640 staff, owned by a private-equity firm (Cove Hill) | Serious users pay serious money for serious study |

**The closest niche analogue is Magisterium AI** (Catholic, built by Longbeard). It is "Logos + AI"
for one tradition: 30,000+ Church documents, **footnotes to the exact paragraph** in every answer,
Chicago-style citation export, a Scholarly Mode over 4,800+ works, and a 3D map of the corpus. It
shows that a **source-grounded, citation-first AI over a curated corpus** is buildable and wanted.
Ours would be the cross-tradition version, over our own certified corpus.

---

## 2. The market, summarised (details in the earlier docs)

| Player | What it is | Its moat | Where it is weak |
|---|---|---|---|
| **Logos** | Bible-study research platform | Licensed library + datasets | Apologetics is only books on a shelf. No argument-level tools, no practice |
| **Magisterium AI** | Catholic source-grounded AI | Paragraph-level citations | One tradition. Answers, but does not teach practice |
| **Apologist Project** | Free nonprofit AI apologist; partners with GotQuestions, STR, Ligonier, RTB and others | Free, huge reach, 190+ countries | Aggregated content, no editorial standard of its own, confessional mix |
| **GotQuestions** | Q&A encyclopedia | SEO breadth | Losing traffic to AI answers; anonymous by policy; no footnotes; one confession |
| **Reasonable Faith** | One scholar's ministry + *Defenders* class | A named PhD | One voice; argues Craig's side rather than surveying the field |
| **STR / CrossExamined / SES app** | Ministry media apps | Named personalities, audio/video libraries | Media archives, not research tools |
| **Scriptured, Logetics, Apologetics Ark** | New apps | Practice mode / library-only AI / Bible reader | Small, and content quality unverified |
| **Hallow / YouVersion / BibleProject** | Devotional and Bible apps | Habit loops, production quality | Not apologetics. They are the UX benchmark |

**Our distinctive assets** [repo]:
- steelman-first footnoted essays;
- an enforced denominational neutrality gate;
- a published review standard and corrections log;
- the Debate Arena and Explain-It-Back practice tools;
- a pastoral crisis path;
- the retired-claims registry.

**Our gaps** [repo, measured today]:
- **0** named reviewers (`reviewedBy` appears nowhere);
- **0** "how to cite" blocks;
- **no Bible reader**;
- **no audio files**;
- **191 files hardcode `isPro = true`**;
- JSON-LD `dateModified` drift. For example, `library/manuscript.html` still tells crawlers
  `2026-06-28` although it was reviewed on 2026-08-29.

---

## 3. Our layers against Logos's layers

| Logos layer | Our equivalent today | Gap |
|---|---|---|
| Library | 92 essays, 111 answers, 156 verified PD passages, glossary, 75 mastery pages | Small, but **deeper per topic**. Missing: a Bible text, wider public-domain primaries (Aquinas, Pascal, Paley, Josephus, Tacitus), the Tier-1 objection essays (hiddenness, Canaanites, slavery, hell) |
| **Datasets** | Present only **implicitly**: footnotes, evidence panels, `retired-claims.json`, briefs, `scholars.html` | 🔴 **The biggest gap. Nothing is stored as queryable data** |
| **Guides** | None. `search.html` is a flat keyword index over `search-index.json` | 🔴 No "Objection Guide", "Verse Guide" or "Scholar page" |
| **Workflow** | None | 🔴 No way to turn research into a talk, a lesson, or preparation for a specific conversation |
| Courses | Study plans, `/today`, mastery tracks; a certificate plan (see the benchmark doc) | 🟡 Machinery missing, content present |
| AI | `/api/ask` with retrieval over verified sources and briefs; `/api/tutor`; Debate Arena | 🟡 Strong, but answers do not **cite to paragraph anchors**, and there is no research mode |
| Sync / user layer | `user_progress`, journal sync (SQL run 2026-09-08, owner-reported) | 🟡 No highlights, notes or collections across the library |
| Trust | "Checked Before Published", corrections log | 🟡 Invisible without **named humans** |

---

## 4. What to build: the "argument graph" platform

### 4.1 The core idea: our basic unit is the *claim*, not the book

Logos tags **people, places and passages**. We should tag **arguments, objections, claims (each with
a status), scholars' positions, primary sources and verses**, and link them together:

```
Argument ──has premise──▶ Claim ──supported by──▶ Primary source (verified)
   │                        │  └─status: live | contested | RETIRED (+ what to say instead)
   │                        └─disputed by──▶ Objection ──strongest form──▶ Essay § anchor
   └─uses verse──▶ Scripture ref ◀──misused in── Retired claim
Scholar ──grants / denies──▶ Claim   (the "Who holds it" rows, as data)
```

**Almost every node already exists as certified prose.** Building the graph is mostly **extraction
and linking, not authoring.** That matters because of the rule this repo has proven again and
again: *every ported sentence survives the gates, and nearly every authored one fails.* The graph
**inherits certification from the text it points to**. Any new string attached to a node (a
one-line objection label, a scholar's stance) is gated content and goes through the pipeline.

### 4.2 The products built on the graph

**A. Guides (the equivalent of Logos's Passage Guide)**

- **Objection Guide.** Type "Jesus never claimed to be God" or "the Gospels are anonymous". You get:
  the short answer; the essay section with the strongest form of the objection; which scholars grant
  what; the verified primaries; the drill; the pocket card; and **the arguments we tell you not to
  use** (from the retired-claims registry).
- **Verse Guide.** Type John 1:1, Daniel 7:13 or Qur'an 4:157. You get every argument that uses the
  verse, the rival readings (JW, Islamic, sceptical), our `orthonote` clarifiers, and the
  known **misuses**. Example: *pelach* in Daniel 7:14, which our registry retired and popular books
  still repeat.
- **Scholar pages** (a Factbook-lite). Ehrman, Habermas, Allison, Oppy, Mettinger, Barnes, Lewis and
  others: what each **concedes**, what each **contests**, and verified quotations with page numbers.
  The 13 evidence panels already follow this format. **This also absorbs the "Ehrman hub" backlog
  idea.**
- **"Arguments to stop using."** A public, gated page generated from `retired-claims.json`,
  including *what to say instead*. **No competitor has this.** It is also the strongest trust signal
  we could publish, because it shows the standard in action rather than asserting it.

**B. Argument maps.** Premise trees for single arguments (kalam, minimal facts, the Islamic
Dilemma), rendered from the graph with each premise linked to its evidence. ⚠ **Standing rule:
no Trinity diagram on any surface** (owner ruling, 2026-08-29). Maps of *arguments about* the
Trinity would need an explicit owner ruling first, and the safe default is not to build them.

**C. Workflow: a Talk and Conversation Builder (the Sermon Builder equivalent).**
- *For leaders:* "Build a 30-minute youth talk on the resurrection" **assembles certified blocks**
  (essay excerpts, pocket cards, discussion questions from mastery pages) into a handout, slide
  outline and leader's notes. It never writes new doctrinal prose. It is an assembler, which is the
  port-don't-author rule turned into a product.
- *For individuals:* "I'm having coffee with my Muslim coworker Friday" builds a preparation pack:
  likely questions, gracious openers, the verdict-landing lines, what **not** to say, and a
  practice round in the Debate Arena.
- ⚠ Route through the pastoral path. If the prompt is a crisis, the builder must not produce an
  apologetics pack.

**D. Research-grade AI.** Upgrade `/api/ask` to Magisterium-style citations:
- every factual sentence footnoted to **an essay paragraph anchor or a `/sources` passage**;
- one-click Chicago/APA/MLA export;
- a **"library-only" toggle** (Logetics' selling point, offered as an option, while the default keeps
  today's deliberate design, per `COMPETITIVE_LANDSCAPE.md` §5);
- a **research mode** that returns graph nodes (objection, scholars, sources) instead of prose.

**E. The citable reference layer.**
- A "How to cite this" block on every essay.
- **Versioned editions:** each gate round mints a dated, archived edition; never edit an archived
  edition in place (the Stanford Encyclopedia of Philosophy model).
- A printable PDF per essay.
- `reviewedBy` in the JSON-LD.
- `dateModified` generated from the stamp so it can never drift again (a CI check).

**F. The user layer (Logos sync).** Highlights, notes and "collections" (for example, "My Islam
conversation file") across essays, answers and sources, synced through Supabase. This is what makes
a user's library *theirs* and keeps them subscribed for years.

**G. Library breadth, in order of cost:**
1. **A Bible reader using public-domain texts.** BSB (released to the public domain in 2023) and
   WEB/KJV need no licence. ESV/NIV require licences with volume limits, so check terms before use.
   Both new competitors already have a reader.
2. **Wider public-domain primaries** in `/sources`: Aquinas, Pascal, Paley, Butler, Josephus,
   Tacitus, Pliny, and more Fathers. Each passage must be verified before it is flipped to
   `verified:true`, and every flip now reaches live answers.
3. **Qur'an and hadith references.** Check translation copyright per edition (for example, Sahih
   International is under copyright) and link to licensed readers rather than hosting the text.
4. **Licensed modern books.** Logos's real moat, and **not one we should try to copy at first**.
   It takes years of publisher deals. The practical alternatives are author partnerships, recorded
   scholar interviews, and summaries in our own words through the existing book-research pipeline.

**H. Courses and credentials.** See `APOLOGETICS_CERTIFICATE_BENCHMARK.md`. Mobile Ed proves that
courses belong *inside* the research tool, not beside it.

**I. Distribution surfaces.**
- The native app (still blocked; see `APP_STORE.md` §1.5).
- **Embeds and an API for churches.** Apologist Project already sells this plumbing, and a church
  licence (Faithlife's institutional model) is the obvious revenue line.
- Mirrors in more languages, but only with **native** doctrinal review. The standing preference
  holds: absent beats wrong.

### 4.3 What NOT to build

- **A general Bible-study library to compete with Logos head-on.** We would lose. Stay the
  argument-level layer that Logos lacks. A later "our datasets inside Logos" partnership is
  worth exploring more than competing.
- **Anything that adjudicates intra-Christian disputes.** Logos serves every tradition by selling
  each its own books. Our neutrality is a feature to keep, not a limit to engineer around.
- **Trinity diagrams**, on any surface (owner ruling).
- **AI-authored content presented as certified.** The graph and builder assemble gated material;
  they never generate doctrine.

---

## 5. Roadmap

| Phase | Work | Size | Blocks / gates |
|---|---|---|---|
| **0 — Foundations** (open since July) | Real paywall + decide price; **2–3 named cross-tradition reviewers**; fix `dateModified` drift; Android targetSdk 36 + iOS build; close the three unstamped recall surfaces | Owner decisions + ~1 dev-month (estimate) | Owner, Stripe/RevenueCat, reviewers |
| **1 — Graph schema + extraction** | `graph/*.json` (claims, objections, scholars, verses, sources, arguments), extracted from footnotes, evidence panels, briefs and the registry; build step + CI integrity tests, in the same pattern as `build-sources-index.mjs` | ~1–2 dev-months (estimate) | New labels gated (argument + orthodoxy; + neutrality for deity/Trinity/Islam) |
| **2 — Citable layer** | Cite blocks, versioned editions, PDFs, `reviewedBy` | ~2–4 weeks (estimate) | Reviewers in place for `reviewedBy` |
| **3 — Guides** | Objection Guide, Verse Guide, Scholar pages, "Arguments to stop using"; faceted search replacing the flat index | ~2–3 dev-months (estimate) | Every generated page gated like any content |
| **4 — AI upgrade** | Paragraph-anchored citations, citation export, library-only toggle, research mode | ~1–2 dev-months (estimate) | `api/ask.js` is gated: argument + orthodoxy re-clear; `apologia-engineer` review; crisis-routing harness must stay green |
| **5 — Builder + user layer** | Talk/Conversation Builder; highlights/notes/collections sync | ~2–3 dev-months (estimate) | Engineer review (RLS); pastoral-path routing |
| **6 — Breadth** | Bible reader (public domain); PD primaries expansion; Tier-1 objection essays; certificate machinery | Ongoing | Full content pipeline per essay |
| **7 — Institutional** | Church licence, embeds/API, reviewer-signed course | After Phase 5 | Pricing decision |

**Realistic horizon for a credible v1 (Phases 0–4): about 9–12 months with the lean team below.
About 18 months for the full vision (estimate).**

---

## 6. Resources needed

All figures are **estimates** for planning. None are quotes.

### People

| Role | Why | Lean option | Estimated cost |
|---|---|---|---|
| **Named reviewers** (2–3: philosophy/NT PhD, a pastor; ideally Protestant + Catholic + Orthodox) | Closes the #1 credibility gap and the pastoral sign-off debt; unlocks `reviewedBy`, certificates, church sales | Paid per essay or on retainer | ~US$150–400 per essay review; ~$15k–40k to cover the existing library once, then a small monthly retainer |
| **Full-stack developer** (contract, part-time) | Graph build, guides, AI citations, builder, app release. Current velocity is owner + AI sessions, which suits content but not large product work | 0.5 FTE contractor | ~$40k–100k across Phases 0–5, depending on rate and region |
| **Designer** (contract) | Guides, argument maps and the builder are new interaction patterns; Hallow/BibleProject set the bar | Short engagements | ~$5k–20k |
| **Editor / producer** (part-time) | Runs the content pipeline, answers flywheel, audio, and reviewer liaison | 0.25–0.5 FTE | ~$15k–40k/yr |
| **Narration** | Audio is the #1 retention driver in comparable apps; zero audio files exist | Quality TTS first, human narration for flagship essays later | TTS: low hundreds per year; human: several thousand for a flagship set |

### Infrastructure and services

- **Vercel:** Hobby caps the project at 12 functions and **we are at the cap**. New endpoints
  (guides API, builder, citations) need the **Pro plan** or more consolidation.
- **Supabase Pro** for user notes/collections at scale.
- **Search:** Supabase full-text + `pgvector` is enough at our size. No separate search vendor is
  needed yet.
- **Anthropic API:** costs grow with research mode and the builder. Keep Haiku for classification
  and grading, and a larger model only where quality needs it. Budget against real PostHog usage,
  **which still has not been read**.
- **Store accounts** ($99/yr Apple, $25 Google), already on the list.
- **Licences:** none needed for the public-domain Bible texts. ESV/NIV or modern Qur'an
  translations need permission if we host their text.

### Owner decisions required (nothing above moves without them)

1. **Price and paywall shape.** Logos proves serious users pay $100–200 a year for **tools**;
   Apologetics Ark charges for utility and gives content away. The graph, guides, builder and sync
   are natural *paid tools*, and essays could stay free. This reverses today's plan and deserves a
   deliberate choice.
2. **Recruit reviewers first?** Recommended. It unblocks trust, certificates and church sales at once.
3. **Budget envelope.** The lean plan is roughly **US$75k–200k over 12 months** (estimate, summed
   from the ranges above). A no-budget version exists: owner + AI sessions only, Phases 1–3 done
   slowly, reviewers as the one paid line. It is slower but viable, because the graph is mostly
   extraction.
4. **Partner rather than compete with Logos?** Offering our graph or datasets inside Logos is a
   long shot but cheap to ask.

---

## 7. What to do first (small and reversible)

1. **Fix the `dateModified` drift and add a CI check.** Mechanical, and it affects AI citation
   today.
2. **Draft the graph schema** (`graph/README.md`) and extract **one cluster end to end.** The
   resurrection is the best-stocked, with evidence panels on `earlycreed`, `minimalfacts` and
   `paulconv`. This proves the approach before any UI is built.
3. **Publish "Arguments to stop using"** from `retired-claims.json`, through the full gate.
   Highest trust per hour of any item here.
4. **Start recruiting reviewers.** It is the longest lead-time item, so it should start earliest.

---

## Sources ([web], via search summaries)
- Logos pricing and tiers: <https://scribe-bible.app/blog/logos-bible-software-pricing> ·
  <https://biblebuyingguide.com/logos-subscriptions-a-detailed-look-at-the-new-logos/>
- Faithlife company: <https://en.wikipedia.org/wiki/Faithlife_Corporation> ·
  <https://www.owler.com/company/faithlife>
- Factbook / Guides / Sermon Builder: <https://www.logos.com/product/175509/factbook-collection> ·
  <https://support.logos.com/hc/en-us/articles/360017893592-Using-Guides> · <https://www.logos.com/whats-new>
- Logos apologetics: <https://www.logos.com/product/54299/apologetics-collection> ·
  <https://www.logos.com/product/56236/mobile-ed-ap101-introducing-apologetics> · <https://www.logos.com/mobile-ed>
- Magisterium AI: <https://www.magisterium.com/> · <https://learnofchrist.com/resources/magisterium-ai> ·
  <https://www.forbes.com/sites/sofiachierchio/2026/05/29/this-startup-is-building-chatgpt-for-catholics/>
- Apologetics app landscape: <https://blog.scriptured.app/alternatives/apologetics-apps/> ·
  <https://faith.tools/apologetics> · <https://play.google.com/store/apps/details?id=com.subsplash.thechurchapp.southernevangelicalseminary>
- Earlier sources: see §9 of `MARKET_RESEARCH_2026-09-03.md` and `COMPETITIVE_LANDSCAPE.md`.
