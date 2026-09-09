# Video lessons — runbook

Short "watch the 1-minute version" videos at the top of each deep-dive essay, made from the
site's own certified reel specs. This is the operator guide: how to render the videos, put a
voice on them, upload them, and switch them on.

## What it is, and where the videos appear

- The **reel specs** in `tools/reel/specs/*.json` are already gated, brand-styled short scripts.
  We render each one in **16:9** (wide, for a web page) instead of the vertical 9:16 used for socials.
  Same wording — no re-review needed to change only the shape.
- Each essay that has a matching reel gets a navy **"▶ The short version — watch first, then read"**
  card at the top of the article, playing that video. It is a **hook, not the lesson** — the card
  says so; the essay still does the teaching.
- The essay↔reel map lives in **`library/video-lessons.json`**. `library/video-lesson.js` reads it
  and shows the card **only when that essay's entry has a non-empty `youtube` id**. Empty id = the
  card stays dark. So the whole layer is invisible on the live site until you do the steps below.

## The three steps

### 1. Render the videos (on your Mac, not the cloud session)

From the repo root:

```bash
# one-time: the renderer's Python deps
pip install pillow imageio-ffmpeg

# render every mapped essay's video in 16:9 (silent, fully captioned)
python3 tools/reel/render-lessons.py

# …or also produce the 9:16 socials cut at the same time
python3 tools/reel/render-lessons.py --vertical
```

Output lands in `tools/reel/output/lessons/` (git-ignored) with a **`MANIFEST.csv`** listing, for
each video, the essay slug, the essay title, the reel it came from, and the filename. Keep that CSV
open for step 3.

### 2. (Optional) Add a voice

The videos work silent-with-captions — most people watch muted — but a spoken track makes them
feel like real lessons. The renderer can generate one for free with Microsoft's `edge-tts`
(no account) and mux it on automatically:

```bash
pip install edge-tts
python3 tools/reel/render-lessons.py --voice                    # default voice en-GB-RyanNeural
python3 tools/reel/render-lessons.py --voice --voice-name en-US-AndrewNeural   # pick another
```

Good voice names: `en-GB-RyanNeural`, `en-US-AndrewNeural`, `en-GB-SoniaNeural`, `en-US-AriaNeural`.

> **Why not in the Claude cloud session?** That sandbox blocks outbound network, so `edge-tts` can't
> reach Microsoft there and `--voice` falls back to silent. On your own Mac the network is open and it
> works. (The length-matching is handled: if the narration is shorter than the video the audio is
> padded; if it's longer the last frame is held — the voice is never cut off. That logic is tested.)

Prefer your own voice, or a premium AI voice? Record/generate the audio however you like, then this
same script can mux any `.mp3` you drop next to a silent render — or just add the voice in CapCut/Canva
using the `.voiceover.txt` script each reel already ships.

### 3. Upload to YouTube and switch it on

1. Create (or reuse) a YouTube channel. Upload each finished `tools/reel/output/lessons/<essay>.mp4`.
   **Unlisted is fine** if you don't want a public channel yet — the embed still plays.
   A good title/description is in `MANIFEST.csv` (the essay title) — reuse it.
2. Each upload gets an id (the `abc123XYZ_-` part of its URL).
3. Paste each id into **`library/video-lessons.json`** — the `"youtube": ""` for that essay.
4. Commit and deploy. The card goes live on each essay the moment its id is filled in — you can do
   them a few at a time.

## Privacy

Playback is **click-to-load** and uses **`youtube-nocookie.com`**: on page view nothing loads from
YouTube except one cookieless thumbnail image; the player (and any YouTube cookies) only load when a
reader actually taps play. This keeps the promise on `privacy.html` that the site sets no advertising
cookies without the visitor's action. ⚠ If you later want the card to appear on EU/UK traffic with no
click at all, that would need a consent banner first — the click-to-load design avoids that.

## Mapping more reels

`video-lessons.json` seeds **31 high-confidence** essay↔reel pairs. The `_unassigned` block lists the
rest, in three groups:

- **duplicate/alt of a mapped topic** — a second reel covering something already mapped; pick the better one.
- **needs an essay decision** — a real reel with no obvious single essay (e.g. `who-made-god`,
  `air-we-breathe`); you choose the target essay, or leave it for the Video Library page only.
- **feature promos** — `study-plans`, `games-and-debate-arena`, etc.; no essay home, leave unmapped.

To add one: put `"<essay-slug>": { "reel": "<reel-name>", "youtube": "<id>" }` in `lessons`, render it
(`--only <essay-slug>`), upload, done.

## If you edit a reel's wording

The reels are **gated content**. Changing any spoken/on-screen wording re-opens the gate: re-run
`apologia-argument` + `apologia-orthodoxy` (+ `apologia-neutrality` for deity/Trinity/Islam reels) and
bump the spec's `reviewed` dates before rendering. Changing only the **aspect ratio** (9:16 → 16:9)
changes no words and needs no re-gate.

## Not built yet (easy follow-ups)

- **A "Apologia originals" grid on `video-library.html`** listing all the uploaded lessons in one place.
  It would read the same `video-lessons.json`; a small addition once ids exist.
- The `air-we-breathe` reel's Holland line was de-staled and re-gated 2026-09-09 (it had called him "the
  secular historian," inaccurate since his 2025 Salisbury Canon Historian appointment).
