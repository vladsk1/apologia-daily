> **⛔ SUPERSEDED / DETAIL APPENDIX — demoted 2026-11-13.** This is a point-in-time audit, **not** the
> live backlog, and it predates this session's RES-B2/B3/B4 work. Its "FIX FIRST (P1)" retired
> "500-in-the-creed" item is **already fixed** on the live surfaces (verified 2026-11-13: the answer page
> says "Paul himself adds… (1 Cor 15:6)" and ev-s2 uses "within the early tradition Paul received and
> passed on"). **The single authoritative list is [`docs/content-backlog.md`](content-backlog.md)** — see
> its RES-* resurrection rows. Verify anything below against the live page before acting; Part B/C
> new-card ideas remain useful as options.

# Resurrection cluster — surface-by-surface audit + new-card options (2026-10-27)

**What this is.** A read-only audit of the whole **Resurrection (ev-s2)** cluster — every surface, not just the essays — plus a ranked list of **new cards/essays/answers** the already-mined resurrection books support. Produced by three parallel read-only agents against the *current live* site (origin/main, incl. the RSG-1/2/3 additions shipped today), cross-referenced to `docs/content-backlog.md`. **Nothing was changed on the live site.** All book page-cites below are **unverified leads** (they still owe the normal citations → argument → orthodoxy → neutrality gate before use).

**Surfaces audited per topic:** deep-dive essay (`library/*.html`) · mastery page (`ev-m-*.html`) · tab card (`ev-s2.html`) · answer page (`answers/*.html`) · and cross-checked against `/briefs`, `/sources`, and the backlog.

---

## Executive summary (plain English)

- **The essays, mastery pages, and tab cards are in very good shape.** The 2026-10-11/18/25 fix sweeps clearly propagated the bounded verdicts across those three layers; the "memorised" surfaces (the premises a reader is graded against, the flashcards, the quiz checks) faithfully match the certified essays. Most of the cluster checked out **clean**.
- **The weak layer is the `/answers/*` pages.** They carry a "Fact-checked & reviewed" badge but **no `content-review` stamp**, and they were **not touched by the recent resurrection sweeps** — so older, stronger-than-the-essay phrasings survive there on public, high-traffic pages.
- **One retired phrasing leaked past a sweep that claimed to remove it "everywhere."** The idea that *"the 500 witnesses were inside the creed Paul received"* was officially retired on 2026-10-18 (the 500 is Paul's own addition in v.6, not the received core, vv.3b–5) — but it survives in **three spots on the ev-s2 tab card** and **one answer page**. This is the single highest-priority fix (a retired claim must not survive on any served surface).
- **No real structural gap** where I thought there was one: the "missing" `ev-m-paulconv` actually exists under a non-standard filename (`ev-m-paul.html`). The one genuine structural gap is **`miracles.html` has no mastery page** (`ev-m-miracles`).
- **Best new-card opportunities:** a **"Was the resurrection physical, or just spiritual?"** card/answer (rich essay material, no dedicated home — a top reader objection) and a net-new **"Can history prove a miracle?"** (the "history can't study miracles" methodological objection has no home).

---

# PART A — Surface audit (fixes to existing pages)

### A1 — FIX FIRST (P1): the retired "500-in-the-creed" phrasing survives on public surfaces
The 2026-10-18 neutrality pass retired *"the 500 inside the creed Paul received"* everywhere (the 500 is 1 Cor 15:6 = Paul's own addition; the received creed is vv.3b–5). It survives, un-logged, on:
- **`ev-s2.html` line 631** (Appearances card, Pro tier): *"the five hundred stand already **in the creed Paul received**…"* — and the **same card** uses the corrected form twice (lines 622, 659), so it's self-inconsistent.
- **`ev-s2.html` lines 111 and 481**: both fold the 500 **and** Paul (v.8) into "the creed."
- **`answers/wasnt-the-resurrection-a-legend.html` ¶2**: *"the creed says, more than five hundred witnesses."* Its sibling answer (`is-there-evidence-jesus-rose-from-the-dead.html`) handles it correctly, so the two answers also disagree.
- **Fix:** reword each to *"within the early tradition Paul received and passed on"* / attribute the 500 to Paul, not "the creed" (the wording already certified on the essay + the other card spots). Partially covered by backlog **RES-RB-8** (which names `appearances.html`/`sceptics.html`, not these ev-s2/answer spots).

### A2 — The `/answers` layer is the un-swept layer (P2): overstatements to bound
- **`answers/is-there-evidence-for-the-empty-tomb.html`** closes *"the empty tomb is **a stubborn historical fact**"* and opens "accepted by a majority of scholars." Every other surface is bounded ("a strong, well-defended position… **noticeably less secure than the near-consensus** on the appearances"). **Fix:** soften to the house formula ("more probable than not; more contested than the appearances"). Appears in the body **and** the FAQPage JSON-LD.
- Same page states the women's-testimony legal claim **flatly** (*"a woman's testimony carried little legal weight"*), dropping the **disputed-legal-bar hedge** the essay/mastery/burial-card all now carry ("whether women were *formally barred* is itself disputed; the point rests only on Josephus's aside"). **Fix:** add the hedge.
- **`answers/why-do-the-gospel-resurrection-accounts-differ.html`** folds the empty tomb into the **"rock-solid core"** on par with the appearances (*"the tomb was empty… the center is rock-solid"*). **Fix:** keep the empty tomb as *narrated-by-all-four* but reserve "rock-solid core" for the crucifixion/appearances.
- **`answers/wasnt-the-resurrection-a-legend.html`** is **thin and understates the date**: only two paragraphs, **no Related-questions, no FAQPage schema**, and says the creed is *"within about five years"* (the loosest figure in the cluster) — yet it's the "quick answer" target for **two** essays (`earlycreed`, `postres`) and engages none of their strongest objections. **Fix:** rebuild to parity (tighten the date, add schema + related-Qs, gesture at the objection replies).
- **Structural:** the resurrection `/answers` pages should get their own **content-review sweep** (they're the one layer the recent fix phases skipped — which is *why* A1/A2 persist there).

### A3 — Drift & cleanups (P3)
- **`ev-m-emptytomb.html` flashcard (card 7, line 1014)** is **garbled/ungrammatical** (*"…for a first-century Jew on the mainstream first-century Jewish usage Wright describes…"*) — a churned fix that reads as broken text on a memorised surface. **Fix:** rewrite the sentence.
- **Creed citation + date drift** across (and *within*) pages: `1 Cor 15:3–5` vs `15:3–7`, and *"a few years"* vs *"two to five years"* vary in the burial mastery, empty-tomb mastery, and appearances surfaces. All are within scholarly range (not contradictions) but inconsistent house wording. **Fix:** pick one canonical form (e.g. "within roughly two to five years"; cite the *burial* clause as 15:3–5 and the *appearance list* as 15:3–7). (Backlog "theme B" intended one form.)
- **"entail" vs "imply" drift** on the creed-presupposes-empty-grave point: the 2026-10-18 "entail→imply" softening reached the ev-s2 card but **not** the empty-tomb mastery (still "entail", lines 463/494). **Fix:** harmonize to "imply."
- **`ev-m-earlycreed.html` chip (line 407)** — a bare "500 at once" chip sits among creed-content chips, mildly implying the 500 is creedal (the page's own cards reconcile it). **Fix (optional):** relabel the chip.

### A4 — Minor routing/label bugs (P4)
- **`ev-s2.html` line 486** (Paul card): link **label** says *"Research the early creed in full →"* but the **href** is `/library/paulconv.html`. Copy-paste from the earlycreed card. **Fix:** relabel to "Research Paul's conversion in full."
- **`ev-s2.html` line 324** (empty-tomb card, burial strand): "Research the burial in full →" points to `/library/emptytomb.html` though a dedicated `library/burial.html` exists and is linked correctly everywhere else. **Fix:** repoint to `/library/burial.html`.
- **Navigation:** two appearances-cluster answers route "Go deeper" away from the appearances essay (`did-jesus-appear-to-500-witnesses` → earlycreed; `why-do-the-gospel-resurrection-accounts-differ` → consistency). Reasonable, but add a cross-link to `appearances.html` so the cluster is navigable.
- **McDowell edition mismatch:** `disciplesbelief.html` bibliography cites *The Fate of the Apostles* (Ashgate, 2015, 1st ed.); `why-did-the-disciples-die-for-their-faith.html` cites the 2024 Routledge 2nd ed. (verified real). Not wrong, but a visible mismatch — freshen the essay to the 2nd ed.

### A5 — Already-logged backlog rows confirmed still live (no new row needed; just not yet done)
- **RES-RB-7** — `ev-m-disciplesbelief` "two to five years" vs essay "a few years" + James-unbelief essay/`sceptics` inconsistency.
- **RES-RB-1** — `ev-m-postresurrection` kept Drill-3/accordion carries a hallucination verdict + "six behaviours" count the essay doesn't make.
- **RES-RB-2** — `ev-m-paul` kept accordions ("guilt-driven hallucination", "Acts contradicts itself", "wanted power", temporal-lobe) have no sentence beneath them in `paulconv.html`.
- **RES-RB-8** — essay-level slips (`postres` Ehrman reply missing the "of one man, mid-history" qualifier; `paulconv` "wounds probed"; the appearances v.8/500 slip).
- Also: `burial.html`/`minimalfacts.html` Quintilian death-assurance (OPEN) and `burial.html`/`emptytomb.html` Crossan-burial-concession (OPEN) from the 2026-09-18 crucifixion mining.

### Surfaces that checked out CLEAN
Minimal facts, respred/predictions, uniqueness/pagan-myths, disciples/martyrdom, Paul (subject to RES-RB-2/8), postres (subject to RES-RB-1), and the matching mastery pages + tab cards were all found consistent and current. The `could-the-disciples-have-stolen-the-body`, `was-jesus-really-buried-in-a-tomb`, and `did-the-disciples-just-hallucinate-jesus` answers are aligned with their essays.

---

# PART B — New card / essay / answer options (ranked)

> Format: **Title** — reader question · core argument · source(s) · net-new vs consolidation · priority · guardrail.

### B1 (P2, TOP PICK) — "Was the resurrection physical, or just a spiritual vision?"  *(consolidation)*
- **Reader question:** "Paul only says Jesus rose as a 'spiritual body' — the first Christians meant a spiritual/visionary resurrection, and the physical-body stories are later legend" (Carrier's two-body reading; the common skeptic/Muslim move).
- **Core argument:** *sōma pneumatikon* = a body *animated by* the Spirit, not *made of* spirit (the `-ikos` suffix; `psychikos/pneumatikos` in 1 Cor 2:14–15; "flesh and blood" = perishability). Paul taught a *transformation of the corpse* — the same reality the Gospels narrate — so Paul and the Gospels agree; the "spiritual-only" reading is the 2nd-century Gnostic innovation (2 Tim 2:18; Gospel of Thomas; Rheginos) that Irenaeus/Tertullian fought.
- **Sources:** Wright RSG 340–356, 200–206; Licona in *Raised on the Third Day* 310–313; Loke IRJC 134–138; James Ware, *NTS* 60 (2014) 475–498; John Granger Cook. Routes: 1 Cor 15:35–54; 2 Cor 5:1–4; Luke 24:39; 2 Tim 2:18.
- **Why:** rich material lives *inside* `appearances`/`emptytomb` (the note calls the anti-Carrier treatment there "a model") but there is **no dedicated card or `/answers` page** for one of the most common resurrection objections readers actually meet.
- **Guardrail:** keep `paulconv`'s cautious *ōphthē* register (don't upgrade Paul's "seeing" to "bodily" as Wright does); never adjudicate Licona's intra-evangelical Matt 27:52–53 reading.

### B2 (P2, NET-NEW) — "Can a historian ever conclude a miracle happened?"
- **Reader question:** "History can only study natural events; a miracle like the resurrection is off-limits to historical method" (Troeltsch's analogy principle; a-priori naturalism).
- **Core argument:** the "no analogy / no access" bar is smuggled naturalism, not a neutral rule. A low *prior* is compatible with a high *posterior* once the naturalistic explanations fail; infrequency excludes impersonal causes, not the free act of a personal agent. A historian can reach "best explanation" and leave the theological identification as a further step.
- **Sources:** Wright RSG ch. 1; Loke IRJC ch. 8 (166–198); Habermas & Licona *Case* ch. 8 (132–150).
- **Why:** `miracles.html` + `/answers/do-miracles-really-happen` are narrowed to the *in-principle* Hume question; the distinct *historiographical* objection ("history can't go there even if miracles can") has **no home**.
- **Guardrail:** hold the house register — stop at "best explanation / more probable than not"; do **not** import Loke's "historical certainty" or Wright's "compelled," or Loke's fabricated-precision figures; cite McGrew, not Earman.

### B3–B6 (P3) — consolidations with no reader-facing home
- **B3 "Didn't the story grow in the retelling (telephone game)?"** — Loke IRJC ch. 7 (oral tradition is a self-correcting *net*, not a *chain*; Vansina, Rubin, Kirk 2017). Shipped as a *subsection* of `disciplesbelief`, but no `/answers` page. ⚠ Don't over-attribute net-vs-chain to Rubin.
- **B4 "Why is there no eyewitness account of the rising itself?"** (restraint argument) — Johnston BOP ch. 12 (Dudrey; *Gospel of Peter*'s giant Christo + talking cross as the contrast). Shipped into `postres` as "A Restraint the Legends Could Not Manage" but buried; no `/answers`. ⚠⚠ Jewish-sensitivity fence: use *Gospel of Peter* only as a lateness marker, never its Pilate-exoneration framing.
- **B5 "Other messianic movements outlived their leaders too"** — the modern-parallel objection (Sabbatai Zevi, the Lubavitcher Rebbe). Principle is on `postres`/`disciplesbelief`; the modern/Chabad half is only partly handled. ⚠ Chabad half is an unshipped lead (see Part C) — don't characterize Chabad belief until the source is read properly.
- **B6 "Is the Church of the Holy Sepulchre really Jesus' tomb?"** — Johnston BOP ch. 11 (Agrippa's wall; Hadrian; Helena/Constantine; the 2016–17 Edicule bench; Garden Tomb disqualified by Iron-Age date). Essay-level material already shipped; this is packaging it into an `/answers` page. ⚠ strict denominational neutrality.

### Structural build (independent of the books)
- **`ev-m-miracles.html` mastery page** — `miracles.html` is the only ev-s2 essay with **no** mastery page. Confirm whether that's intentional; if not, it's a straightforward build.
- The **`docs/mockups/resurrection-objection-guide.html`** mockup is a natural landing vehicle if B1/B3/B4/B5 become a card cluster.

### Do-NOT-build (so these aren't re-proposed)
Pagan-copycat and the Zoroastrian/Persian-origin refutation (already covered), failed-messianic catalogue + cognitive-dissonance (`postres`), martyrdom "sincerity-not-truth" + Candida Moss (`disciplesbelief`), the swoon/JAMA case (`minimalfacts`). Fringe (1 Cor 15 interpolation defence, twin-brother), Marian-apparition debunking (denominational tripwire), and Islamic substitution material (belongs to the Islam cluster).

---

# PART C — Logged-but-unshipped leads worth executing
- **IRJC-B (P3, OPEN)** — the Chabad/Schneerson + Baal Shem Tov half of the modern-messiah parallel (Marcus 2001 seen only at abstract level). Feeds B5. Needs the source read properly first.
- **IRJC-C (BLOCKED)** — steelman James Crossley on the women-witnesses (the chapter couldn't be obtained). Would strengthen `emptytomb`'s women line; Osiek *HTS* 1997 could anchor it.
- **James Ware, *NTS* 60 (2014) 475–498 (P4, OPEN)** — *egeirō/anastasis* = bodily revivification; a peer-reviewed reinforcement for `appearances`/`emptytomb` and a natural primary for B1.
- **Minor Loke P4 leads** — Kalish & Reynolds 1973 (~2% report a *shared* post-death encounter, sharpens the anti-hallucination point); Ehrman 2014 p.149 (a bodily appearance is "in theory possible" for a historian — a hostile concession for B2); Licona 2010 407–8 (*psychikon* ≠ "material", supports B1).
- **RSG P4** — a one-line `earlycreed → respred` cross-link so the "according to the Scriptures / third day" reader reaches the Hosea 6:2 / Jonah treatment.

---

# Recommended order of work
1. **Quick, high-value corrections (small, bounded, same discipline as today's work):** A1 (the retired "500-in-the-creed" on 3 ev-s2 spots + the legend answer) → A2 (the three `/answers` overstatements + the women-bar hedge) → A3/A4 (the garbled flashcard, the two link bugs, the "entail/imply" + date harmonization). These are de-overclaim / consistency fixes; the `/answers` ones also want a content-review stamp added.
2. **One new card, if you want to build:** B1 ("physical or spiritual resurrection?") — highest reader value, mostly consolidation of already-certified material (lower risk), dual-consensus gated.
3. **Then** B2 (net-new "can history prove a miracle?") and the B3–B6 consolidations / the `ev-m-miracles` build, as appetite allows.

*(This is a planning document — internal, not web-served. No live content was changed in producing it.)*
