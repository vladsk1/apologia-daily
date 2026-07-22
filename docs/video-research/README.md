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
- **Auto-captions are error-prone.** Auto-generated captions mishear names, dates, and numbers. Treat
  **everything** in a transcript as an **unverified lead** until confirmed against the primary source
  and run through `apologia-citations → apologia-argument → apologia-orthodoxy`. Never cite a figure or
  a scholar attribution straight off a transcript.
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
4. **Add a row to `INDEX.md`** so the next content session can route a topic → this note.
5. **Verify before anything ships.** A primary from a note is quotable only after `apologia-citations`
   confirms it and it clears `apologia-argument` + `apologia-orthodoxy` — same as everything else.
6. **Deploy** per the repo rule: commit the **note + INDEX row only** (never the transcript) and
   fast-forward push to `main` (never `git checkout main`).

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

## Current notes
_(none yet — this scaffold is fresh. Mine a video and add the first note + an INDEX row.)_
