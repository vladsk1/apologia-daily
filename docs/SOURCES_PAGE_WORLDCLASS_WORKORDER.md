# Work-order — make `/sources` (Church Fathers & Creeds) a world-class resource

> **✅ STATUS: EXECUTED 2026-08-24 (local session, hosts reachable) — LIVE on `main` (commit
> `03b67d7`).** Both parts shipped.
> **Part A (all of A1–A5) done in `sources.html`:** hero breadth line (JS-computed
> `146 passages · 37 voices · from AD 96`), era pills with the gold pre-Nicaea cue, shareable
> `#p-<id>` deep-links (Link button + on-load scroll/highlight), static `CollectionPage` +
> runtime `ItemList` structured data, and the 7 topic intros. **Intros GATED** (argument +
> orthodoxy on all 7, + neutrality on Church & Worship) — all STAMPABLE, 0 HERESY/DRIFT; a
> fix pass (Cross intro re-matched to the bucket's real motifs; "breaking of bread" / "a
> Sunday gathering" for neutrality; absolutes softened) re-opened the gate and came back CLEAN.
> **Part B: +13 verified pre-Nicene passages over three passes (133 → 146; 32 → 37 authors).**
> *Pass 3 (same day)* added the Epistle to Diognetus 9 (the "sweet exchange" atonement, new
> author), Irenaeus *AH* V.7.1 (bodily resurrection), and Justin *Dialogue with Trypho* 8 (his
> conversion) — citation-gated (the gate caught a wrong translator credit on the Justin Dialogue
> and confirmed the Irenaeus quote was the numbered section, not the ANF editorial summary).
> Also fixed the search-bar placeholder ("Eucharist" → "the cross"). *Pass 2* added Minucius Felix
> (*Octavius* 18, monotheism) and Aristides of Athens (*Apology* 2, a c. AD 125 deity-of-Christ
> witness; *Apology* 15, Christian love), citation-gated (the gate caught a dropped "and in God" in
> Aristides 15, now restored). *Pass 1* was: Theophilus,
> *To Autolycus* II.15 (earliest "Trinity"/trias, new file); Athenagoras, *Plea* 10 +
> *On the Resurrection* 3 (new file); Irenaeus, *AH* III.6.1 (deity); Justin, *1 Apol.* 19
> (resurrection); Tertullian, *On the Resurrection of the Flesh* 63 + *Against Praxeas* 27.
> Resurrection bucket 9 → 12. All PD/PD, citation-verified word-for-word, then `verified:true`;
> index + `lib/sources-verified.js` rebuilt. **Melito HELD** — the only PD Melito is
> disputed-attribution fragments that would weaken the pre-Nicaea provenance stat.
> **Next-session lead:** more can still be added (target was +6–10; shipped +7 at the high-
> quality end). Good next adds: more pre-Nicene deity (Hippolytus, Origen, Novatian *On the
> Trinity* has punchy lines that took fishing), a Muratorian-fragment / canon entry, and — if a
> defensible PD text is found — Melito's *Peri Pascha* (no PD translation exists today).
> ⚠ Note the local Windows test harness fails 12 pre-existing `delete-account`/`cors`/`verify-
> user` tests with `ERR_UNSUPPORTED_ESM_URL_SCHEME` (a `c:`-path import bug); these are NOT
> from this work and pass on Linux CI. And `build-sources-index.mjs --check` reports "stale"
> locally purely from CRLF line-endings — `git diff HEAD` shows no real change.
>
> ---
> *Original hand-off note (kept for the record):*
> **Status: HANDED OFF to a local / web-enabled session (2026-08-24).**
> A remote web session **cannot** finish this: the content-expansion half needs to fetch and
> verify public-domain source texts, and this sandbox's egress is **blocked** from every
> primary-source host. Measured 2026-08-24 — `curl` to `www.ccel.org`, `en.wikisource.org`,
> and `www.newadvent.org` all returned `000` (no connection). So the citation gate cannot
> verify a new passage here. Do the whole build from a session that can reach those hosts.

## Where things stand (already LIVE on `main`)
- `sources.html` was **retitled** (eyebrow "Source Library" → "Church Fathers & Creeds"; `<title>`
  and the site-wide nav menu label updated to match via `tools/sync-nav.mjs`).
- Passages are now **grouped by doctrinal TOPIC** (7 buckets), not by author. The grouping logic
  lives in `sources.html` (`TOPIC_CATS`, `groupKey`, `groupLabel`, `GROUPS`).
- Data source unchanged: the page fetches `/sources-index.json` at runtime (built by
  `node tools/build-sources-index.mjs` from `sources/*.json`; CI runs `--check`).

## The corpus today (measured 2026-08-24 from `sources-index.json`, verified-only)
- **133 passages · 32 authors · AD 96 – 1662** (the 1662 outlier is the Book of Common Prayer;
  the patristic core runs AD 96–451).
- Topic distribution (primary bucket): Deity of Christ **46**, The Trinity **14**, The Incarnation
  & Two Natures **17**, The Cross & Salvation **15**, Resurrection & Eternal Life **9**, The Church
  & Worship **17**, The Christian Life **15**.
- Era distribution: Apostolic Fathers (to 150) **36** · Ante-Nicene (150–325) **52** · Nicene
  (325–381) **12** · Post-Nicene (after 381) **33**.
- ⭐ **The crown-jewel apologetic stat:** of the passages tagged `deity of christ`, **25 of 42 were
  written BEFORE the Council of Nicaea (325).** This is the receipt for "the divinity of Jesus was
  invented at Nicaea." Ignatius calls Jesus "our God" c. AD 107 — two centuries early. **Re-measure
  the exact live numbers before quoting them in copy** (they move as the corpus grows).

---

## PART A — Design / framing / UX upgrades (no web access needed; could even be done remotely)

All of these are edits to `sources.html` only. None changes a quoted passage, so **no content
re-gate is required** — EXCEPT the topic intros (A5), which are authored doctrinal/historical prose
and MUST pass `apologia-argument` + `apologia-orthodoxy` (+ `apologia-neutrality` for the Church &
Worship intro, which touches the sacraments). Run `node --test tests/*.test.mjs` after (the
inline-script-syntax test parses the page's JS).

### A1 — Hero "breadth" line (authority at a glance)
Add under `.hero-sub` a JS-filled line: `<p class="hero-stats" id="hero-stats"></p>`, populated in
the `fetch('/sources-index.json')` handler so it never drifts, e.g.
`<b>133</b> passages<span class="dot">·</span><b>32</b> voices<span class="dot">·</span>from <b>AD 96</b>`.
Compute the counts from `INDEX.length`, `new Set(INDEX.map(r=>r.author)).size`, and the min year.

### A2 — Era label on every passage (watch doctrine develop; SEE the pre-Nicaea witnesses)
Add an `eraOf(year)` helper and render a small pill in the `.psg-top` row next to the author.
Pre-Nicaea eras get the gold `.pre` style — that is the visual apologetic cue.
```js
function eraOf(rec){
  var y = parseInt(rec.year,10); if(!y) return null;
  if(y<150)  return {label:'Apostolic Father', pre:true};
  if(y<325)  return {label:'Ante-Nicene',      pre:true};   // written BEFORE Nicaea
  if(y<=381) return {label:'Nicene era',        pre:false};
  if(y<600)  return {label:'Post-Nicene',       pre:false};
  return {label:'Later witness', pre:false};                 // BCP 1662 etc.
}
```
In `card()`, wrap the author + era pill in a `.psg-head-tags` flex; give the `.pre` pill a
`title="Written before the Council of Nicaea (AD 325)"`. Add the era label into the searchable
blob `_b` so a reader can type "ante-nicene".

### A3 — Shareable passages (the "paste it into the argument" use case — highest utility)
- Give each `<article class="psg">` a stable `id="p-"+rec.id`.
- Add a **"Link"** button to `.psg-actions` that copies `location.origin+location.pathname+'#p-'+id`
  and shows the existing toast ("Link copied").
- On load (end of the fetch handler, after `render()`), if `location.hash` matches `#p-<id>`,
  `scrollIntoView` it and add a `.psg.target` highlight for ~2.5s.

### A4 — Structured data (SEO reach)
Add a static `<script type="application/ld+json">` in `<head>`: a `CollectionPage` describing the
resource (name "Church Fathers & Creeds", about the early church, isPartOf apologiadaily.com).
Optionally build a runtime `ItemList` of `Quotation` objects from `INDEX` and inject it (Googlebot
renders JS) — each `{"@type":"Quotation","text":…,"citation":author+work+section,"creator":author}`.
Keep the static block for reliability.

### A5 — Topic intros (the intellectual spine — GATE THESE as doctrinal prose)
Render a 1–2 sentence intro under each topic heading (`.grp-intro`, only when `filter==='all'`).
DRAFTS below — **frame each cluster as the answer to a skeptic's claim**, stay honest (no
overstatement; the intro says what the quotes *show*, not that they *prove* the whole faith).
Verify every factual number against the live index before shipping.

- **Deity of Christ:** "Was the divinity of Jesus voted into existence at the Council of Nicaea in
  325? These are the receipts. Most of these passages were written *before* Nicaea — Ignatius calls
  Jesus 'our God' around AD 107, two centuries early. The doctrine was not invented at the council;
  it was defended there." *(Re-check "most … before Nicaea" against the data.)*
- **The Trinity:** "Critics call the Trinity a fourth-century invention. Yet Father after Father —
  long before the creeds fixed the vocabulary — names the one God as Father, Son, and Spirit. Watch
  the *language* sharpen over time; the reality it describes is here from the start."
- **The Incarnation & Two Natures:** "How can one person be fully God and fully man? The early church
  worked this out in the open, against real rivals — that Jesus only *seemed* human, or was secretly
  two sons. This is that hard-won clarity: one Christ, in two natures, unconfused."
- **The Cross & Salvation:** "What did the first Christians believe the cross actually *did*? Here
  they say it in their own words — ransom, victory, healing, and the great exchange."
- **Resurrection & Eternal Life:** "The resurrection was never a metaphor to the early church. They
  expected their own bodies to rise, and said so — often on the way to the executioner."
- **The Church & Worship:** "Baptism, the Lord's Supper, the reading of the apostles' writings — this
  is what Sunday looked like in the second century, described by the people who were there."
  *(⚠ NEUTRALITY LENS: describe, do not adjudicate the baptism/eucharist disputes the denominational-
  neutrality guardrail names.)*
- **The Christian Life:** "Before it was a system of doctrine, the faith was a way of dying well and
  living generously — the martyrs, the converts, and the pastors, on courage, prayer, and love."

### Drafted CSS (ready to paste before `</style>` in `sources.html`)
```css
.hero-stats { font-family: var(--ui); font-size: 0.82rem; color: rgba(255,255,255,0.5); margin-top: 1rem; letter-spacing: 0.02em; }
.hero-stats b { color: var(--g); font-weight: 600; font-variant-numeric: tabular-nums; }
.hero-stats .dot { color: rgba(255,255,255,0.25); margin: 0 0.55rem; }
.psg-era { font-family: var(--ui); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--n3); background: var(--n4); border: 1px solid var(--b); border-radius: 4px; padding: 3px 8px; white-space: nowrap; }
.psg-era.pre { color: #8a6d1f; background: #fbf6e6; border-color: #e6d9a8; }
.psg-head-tags { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.grp-intro { font-family: var(--bo); font-size: 0.95rem; color: var(--m); line-height: 1.7; margin: -0.3rem 0 1.1rem; max-width: 680px; }
.grp-intro b { color: var(--n); font-weight: 600; }
.psg.target { border-left-color: var(--n3); box-shadow: 0 0 0 2px rgba(30,66,120,0.22); }
```

---

## PART B — Content expansion (the biggest lever; REQUIRES web access to verify)

Going from 133 → 250+ verified passages, broader across Fathers and topics, is what makes a
patristics library truly world-class. **Every new passage follows the `/sources` discipline** (see
`sources/README.md` and CLAUDE.md `/sources` section): PD work AND PD translation only (19th-c.
Schaff ANF/NPNF, Roberts–Donaldson, etc.); add it to the right `sources/<author>.json` with
`verified:false`; `apologia-citations` confirms the exact wording against `source_url` and flips it
to `verified:true`; then `node tools/build-sources-index.mjs`. ⚠ Flipping to `verified:true` also
puts the passage into LIVE `/api/ask` answers (`lib/sources-verified.js`), so hold the bar high.

**Legit PD source hosts** (the ones blocked here, reachable locally): `ccel.org` (Schaff's ANF/NPNF —
the workhorse), `newadvent.org/fathers`, `en.wikisource.org`, `earlychristianwritings.com`,
`tertullian.org`, `documentacatholicaomnia.eu`.

**Where the corpus is thin / high-value additions (gap analysis, 2026-08-24):**
- **Resurrection & Eternal Life** is the smallest bucket (9) on a *resurrection*-centred apologetics
  site — expand it: Tertullian *On the Resurrection of the Flesh*, Athenagoras *On the Resurrection*,
  Irenaeus *Adv. Haer.* V, Justin *First Apology* 18–19, Ignatius *Smyrnaeans* 3 (already? check).
- **Authors absent from the corpus** worth adding: **Athenagoras, Melito of Sardis** (*Peri Pascha* —
  stunning deity-of-Christ material), **Theophilus of Antioch** (first to use *trias*/"Trinity",
  *To Autolycus* II.15 — huge for the Trinity intro's "before the creeds" point), **Lactantius,
  Ambrose of Milan, Jerome, Vincent of Lérins** (*Commonitorium* — the rule of faith), **Aristides**
  (early apology). Melito and Theophilus are the two highest-value adds.
- **Deity of Christ pre-Nicaea**: more Melito, Hippolytus, Origen — every pre-325 deity quote
  strengthens the crown-jewel stat.
- **Scripture / canon**: Muratorian Fragment, more Irenaeus on the four Gospels.

**Suggested target:** +6 to +10 verified passages per session, prioritising (1) Resurrection depth,
(2) Melito + Theophilus, (3) more pre-Nicene deity. Keep each `sources/<author>.json` entry's `tags`
aligned to the 7 topic buckets in `sources.html`'s `TOPIC_CATS` so it files correctly.

---

## Definition of done
- Parts A1–A5 shipped in `sources.html`; topic intros gated (argument+orthodoxy, +neutrality on
  Church & Worship) and stamped in the file's provenance; `node --test tests/*.test.mjs` green.
- At least one batch of Part B verified passages added, index rebuilt, live.
- Deploy the usual way: push the working branch to `main` (never `git checkout main`).
- Re-measure and update the hero/intro numbers so they match the grown corpus.
