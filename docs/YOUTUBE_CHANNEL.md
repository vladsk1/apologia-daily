# YouTube channel — copy kit

Ready-to-paste text for the Apologia Daily YouTube channel. Keep the voice honest and
gentle (1 Peter 3:15): evidence-first, no sensational/clickbait framing. Channel art is
made by `tools/reel/gen_youtube_art.py` (banner + avatar + logo); the videos come from
`tools/reel/render-lessons.py` (see `docs/VIDEO_LESSONS.md`).

## Channel description

**Search line** (first ~150 chars, shown in search results):
> Reasons for the hope you have. Honest, fully-cited answers to the hardest questions about the Christian faith.

**Full "About" text:**
> **Apologia Daily** — reasons for the hope you have (1 Peter 3:15).
>
> Short, honest answers to the hardest questions about the Christian faith: Did Jesus really
> exist? Did he rise from the dead? Isn't the Trinity a contradiction? Can we trust the New
> Testament?
>
> Every claim is sourced. Every objection is answered at its strongest — never a strawman. And
> nothing is published until it's been reviewed: our "Checked Before Published" standard. No
> hype, just the evidence, told straight.
>
> 🔗 Go deeper with 90+ fully-cited deep-dive essays and an AI study tutor at **apologiadaily.com**
>
> New videos regularly. Reason. Evidence. The hope of the gospel.

## Video titles

**Formula:** `[the exact question people search] — [2–4 word hook]`
- Question first — that is what people type into search.
- Front-load the keyword; keep under ~65 characters so YouTube doesn't truncate it.
- Sentence/Title case, consistent.
- **Honest titles, never sensational.** "Did Jesus Rise? The Case" — yes. "Atheists HATE This
  Argument" — no: it wins clicks and loses the trust the brand is built on.

Examples (from the real reels):
- Did Jesus Really Exist? — What the Evidence Shows
- Isn't the Trinity a Contradiction?
- Can We Trust the New Testament Manuscripts?
- Why Did the Disciples Die for a Lie? — The Minimal Facts
- Is the Universe Fine-Tuned for Life?
- Was Jesus Copied From Pagan Myths?
- How Soon Did People Say Jesus Rose?
- Did Jesus Claim to Be God?

## Per-video description template

```
[One plain sentence answering the question — the verdict, taken from the essay, not authored fresh.]

📖 Read the full, fully-cited case: [essay link, e.g. https://apologiadaily.com/library/hist_jesus.html]
💬 Ask our AI tutor about it: apologiadaily.com

Every claim sourced. Every objection answered at its strongest.
Checked before published.

#Shorts #Apologetics #Christianity #[topic]
```

Notes:
- Drop `#Shorts` on the wide/landscape (16:9) videos — only the vertical (9:16) uploads are Shorts.
- The opening verdict line is public claim-bearing copy: take it from the essay's own certified
  wording rather than writing a new claim (same "port, don't author" discipline as the rest of the
  site). The essay link for each video is in the MANIFEST.csv the render tool produces.

## Upload settings (recommended)
- **Wide 16:9 videos** → the website embeds. Upload **Unlisted** (they still play when embedded).
- **Vertical 9:16 videos** → **Public** Shorts, for YouTube's own discovery.
- Reuse the essay title (in MANIFEST.csv) as the video title, trimmed to the formula above.
