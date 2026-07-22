# Video-research notes — mining apologetics talks for leads (the sibling of `book-research/`)

This folder holds **in-our-own-words research maps of copyrighted apologetics videos** (lectures,
debates, talks) — the argument's structure plus an index of the **primary sources** the speaker cites
(Scripture, Church Fathers, named scholars, dates) to chase down and quote *from the primaries*. It is
the exact sibling of `docs/book-research/`: a **map of leads**, never a copy of the source.

> **New session (local / web-enabled) and the user wants to mine a video?** Read this file, then
> follow the workflow below. Same discipline that produced the Geisler–Turek / Habermas–Licona book notes.

## The hard copyright + ToS rules (never bend these)
- **A transcript is a copyrighted LEAD, not quotable text.** The spoken words belong to the speaker.
  Capture the argument's *shape* and its *citations* in **our own words** — no stored transcript
  excerpts, no quoting the video as if it were our content or a source. The note points at quotable
  **primaries**; it is not a copy of the talk.
- **Accuracy depends on the caption track (the fetcher prefers the good one).** Highest → lowest:
  (1) **human/manual captions** — accurate, correct names/dates; (2) **Whisper (large) run on the
  audio** — usually better than YouTube's auto-captions if you want a higher-fidelity transcript
  (extra setup: `yt-dlp` the audio + run `faster-whisper` locally); (3) **auto/ASR captions** — the
  default when there's no manual track; they mishear exactly what we cite (scholar names, dates,
  numbers, Greek/Hebrew). `tools/fetch-transcript.py` **prefers the manual track and stamps
  `caption source: MANUAL / AUTO` in the header** so you know how much to distrust it. Either way, treat
  **everything** in a transcript as an **unverified lead** until confirmed against the primary and run
  through `apologia-citations → apologia-argument → apologia-orthodoxy`. Never cite a figure or a scholar
  attribution straight off a transcript — the accuracy that matters is the *primary's*, which we verify.
- **Never store or commit the transcript.** `tools/fetch-transcript.py` writes to
  `docs/video-research/_transcripts/`, which is **git-ignored**. Mine it, then let it be. Only the
  our-own-words *note* (leads + argument map) is committed.
- **Fetch specific videos, not a scrape.** Pull the handful of talks you actually intend to mine.
  YouTube's Terms frown on bulk/automated extraction — a few targeted research fetches is the low-risk
  path; industrial scraping is not. Owner's call, but keep it small and purposeful.
- **The video itself never becomes a citation.** We do not cite "so-and-so said X in a YouTube video."
  We cite the **primary** the video pointed us to, verified. Copyrighted video text never enters
  `/sources` (that corpus is public-domain verbatim only) and never reaches a live answer directly.
- **Stay inside the guardrails** in `CLAUDE.md` (classical/Nicene orthodoxy, denominational neutrality,
  the argument-specific rules, "orthodoxy outranks charity"). Flag popular-level overstatement for our
  own calibration — apologetics YouTube overstates constantly.

## Where this library is used (the two questions this answers)
- **Writing new content — YES, assess it per topic.** When drafting an essay, `ev-s*` card, or
  `/answers/*` entry, the INDEX is the **"what's the best source for this topic?"** router: `Grep`/`Read`
  `docs/video-research/INDEX.md`, get the argument shape + the strongest **primaries to verify** from the
  mapped note, then quote the **primaries** (verified) in our own voice. This sits *alongside*
  `book-research/INDEX.md` and the `/sources` corpus — consult whichever has the best material for the
  topic (a note may say "book X covers this better; skip"). Documented drafting convention, like the
  book notes.
- **Answering questions LIVE (`/api/ask`) — NO, not directly** (identical to the book notes: the live
  serverless endpoint **cannot** read `docs/`, and these are unverified copyrighted leads). But
  video-mined material **can** reach the live AI through the **same two gated doors any research lead
  uses** — never as a raw "video brief":
  1. **`/sources`** (verbatim quotes): **lead → verify the primary → add it to `/sources` as
     `verified:true`** → compiles into `lib/sources-verified.js`, which `api/ask.js` retrieves and lets
     the model quote with attribution.
  2. **`/briefs`** (our-own-words framing — *the "option the AI looks at before answering"*):
     **lead → verify the primaries → write/strengthen a CERTIFIED essay → distil a brief** in
     `briefs/_data.json` (its `reviewed` object must stamp BOTH `argument` and `orthodoxy`, +neutrality
     for the resurrection/deity set) → `node tools/build-briefs-index.mjs` compiles it into
     `lib/briefs-verified.js`, which `api/ask.js` retrieves as **optional background framing**.
  The brief is **our own words, twice-gated, and provenance-traced to the certified essay** — never to
  the transcript, never attributed to the video or the speaker. The video is only the upstream lead.

## Trust boundary (why it's safe)
`YouTube transcript` (copyrighted, error-prone lead) → an **our-own-words note** here → a **certified
essay/answer**, a **verified `/sources` primary**, and/or a **gated `/briefs` entry distilled from that
certified essay** → (only then) a live answer. The runtime never reads the raw transcript; only
twice-checked, our-own-words material (or a verified verbatim primary) reaches a visitor.

## Workflow — mining a video
1. **Fetch the transcript** (local session):
   `python3 tools/fetch-transcript.py <youtube-url-or-id>` → writes `_transcripts/<id>.txt` (git-ignored;
   self-installs `youtube-transcript-api`, falls back to `yt-dlp`).
2. **Read it as a lead.** Pull out (a) the argument's spine in our own words and (b) every **primary
   source** named — Scripture refs, scholars, books, dates, journal cites. The citations are the point.
3. **Write one note** per video (or per speaker/series) at `docs/video-research/<slug>.md`, mirroring the
   book-note format: a short header (title / channel / speaker / URL / date + usage rules), the talk's
   thesis, an argument map (beats in our own words → **primaries to verify**), a "Guardrail fit" note
   (flag any overstatement / neutrality risk / heterodox drift), and a cross-map to our Evidence Library
   tabs/essays and existing `/answers`.
4. **Log it in three places:** (a) a row in the **Mined-videos ledger** below (with its live-door status);
   (b) a topic row in `INDEX.md` so the next content session can route a topic → this note; and (c) for any
   lead that would **correct, update, strengthen (new primary), or open a topic/objection we lack**, a row
   in **[`docs/content-backlog.md`](../content-backlog.md)** — the release map. (Corroboration-only leads
   don't get a backlog row.) Update the ledger's `→ /sources` / `→ /briefs` columns whenever a primary or
   brief from it later goes live, and mark the backlog row Done.
5. **Verify before anything ships.** A primary from a note is quotable only after `apologia-citations`
   confirms it and it clears `apologia-argument` + `apologia-orthodoxy` — same as everything else.
6. **Deploy** per the repo rule: commit the **note + INDEX row only** (never the transcript) and
   fast-forward push to `main` (never `git checkout main`).

## Quickstart — testing this from a local session
You do **not** open YouTube or copy any transcript yourself. Just paste a link and ask. In a **local
(or web-enabled) Claude Code session** — one whose machine can reach youtube.com — say something like:

> **"Mine this video for the apologetics library, following `docs/video-research/README.md`:
> `<paste YouTube URL>`. Fetch the transcript, pull the argument shape + the primary sources it cites,
> write the note + an INDEX row, verify the primaries, and — if it strengthens a topic — draft a
> `/sources` entry and/or a gated `/briefs` brief so the live AI can use it."**

Claude then runs `python3 tools/fetch-transcript.py <url>` itself (the transcript lands in the
git-ignored `_transcripts/`), reads it, and does the rest. Your only job is choosing the video and the
final review. (This remote/CI sandbox can't reach YouTube — run the test from your local machine.)

## Channels worth mining first (trustworthy, primary-source-heavy)
Start with talks that *cite their sources* — those give the richest lead harvest:
- **Reasonable Faith** (William Lane Craig) — kalam, fine-tuning, resurrection, moral argument.
- **Truth Unites** (Gavin Ortlund) — historical theology, early church, gracious tone (a good model).
- **Mike Licona / Risen Jesus** — resurrection, minimal facts, Gospel reliability, NT scholarship.
- **Testify** (Erik Manning) — Gospel reliability, undesigned coincidences, historical Jesus.
- **Cold-Case Christianity** (J. Warner Wallace) — evidential method, eyewitness reliability.
- **Inspiring Philosophy** — fine-tuning, consciousness, Trinity, philosophy of religion.
- **Capturing Christianity** — interviews with scholars (Craig, Swinburne, etc.).
Cross-check every claim against the primary regardless of channel; even careful channels round numbers.

## Mined-videos ledger (the running list — update it every time)
Like the book library's "Current notes," this is the canonical list of which videos have been mined —
plus, unique to video, **whether each one actually reached the live doors** (`/sources` / `/briefs`).
Every mining run MUST add a row here (and an `INDEX.md` topic row). Status keys: **note** = our-own-words
map written · **✓sources** = a verified primary from it is live in `/sources` · **✓briefs** = a gated
brief distilled from its certified-essay tie-in is live in `/briefs` · **—** = not (yet).

| Video (speaker · title) | id / URL | Note file | → /sources | → /briefs | Date |
|---|---|---|---|---|---|
| Gary Habermas · "CORE Christian Confessions BEFORE the New Testament" | `6C3uO-50YUw` | `habermas-early-high-christology.md` | — | ✓ `deity-of-christ-nt` | 2026-07-21 |
| Gary Habermas · "Six Facts Before 36 AD" (resurrection timeline sliver) | `WkAAK57JuEw` | `habermas-six-facts-before-36ad.md` | — | — (already fully served by the live resurrection briefs) | 2026-07-22 |
| Gary Habermas · full "Minimal Facts" lecture (two texts: 1 Cor 15 + Gal 1–2) | `-cbgVDj81fY` | `habermas-minimal-facts-two-texts.md` | — | — (topic fully served by the live resurrection briefs) | 2026-07-22 |
| Christopher Frost · "The Islamic Dilemma" | `trWm75yjY-8` | `frost-islamic-dilemma.md` | — | ✓ `islamic-dilemma` (new brief, from certified `islam-dilemma.html`) | 2026-07-22 |
| "Michael" · "Is Muhammad in the Bible? (the Biblical Prophet Dilemma)" | `ftjCI-xyCw0` | `muhammad-in-the-bible-prophet-dilemma.md` | — | — (answer already certified; leads flagged for a future strengthening pass — ⚠ toxic-tone source) | 2026-07-22 |
| _example: Craig · "The Kalam Cosmological Argument"_ | _`dQw4w9WgXcQ`_ | _`craig-kalam.md`_ | _—_ | _✓ `kalam-cause-of-universe`_ | _2026-07-22_ |

**Rule of thumb:** a video isn't "briefed" until a row shows **✓briefs** (or **✓sources**). A row with only
**note** means it's mined but nothing has cleared the gates into the live AI yet.
