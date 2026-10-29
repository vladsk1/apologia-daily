# webreel — animated, voiced reels (the default)

`gen_webreel.py` turns a `specs/webreel-*.json` spec into a real, voiced MP4 in the
cinematic navy/gold "Frames of Quran" style. It is the default way to make a reel for
Apologia Daily. (The silent, static-caption generator `gen_reel.py` is the quick
alternative — see `README.md`.)

## Pipeline

1. **Kokoro TTS** (default voice `am_michael`) voices each scene's `vo` — reuses the
   offline engine in `gen_explainer.py` (no API key, cached in `.tts/`).
2. Per-scene audio → `narration.wav` + a per-scene timing sheet (ms).
3. **`capture-webreel.mjs`** steps `web/reel.html` through `window.__seek(t)` frame by
   frame over headless Chrome (DevTools protocol, no npm deps), timed to the narration.
4. **ffmpeg** muxes frames + narration into `output/<name>.mp4` (H.264, faststart) and
   writes `output/<name>.captions.txt` (Instagram + X).

Requirements: Node 22+ and a Chrome/Edge install (set `CHROME_PATH` if not auto-found);
Python with the same deps `gen_reel.py` installs. All output lands in `tools/reel/output/`
(git-ignored).

## Run

```
python tools/reel/gen_webreel.py tools/reel/specs/webreel-jesus-god-nt.json
python tools/reel/gen_webreel.py <spec> --voice am_michael --fps 30 --keep
```

Flags: `--voice` (any Kokoro voice; `am_michael` default), `--speed`, `--fps`,
`--lead` (motion before the voice each scene), `--tail` (hold after), `--xfade`
(scene crossfade), `--keep` (keep the `.web_<name>` work dir for inspection), `--out`.

## Spec format (`format: "webreel"`)

```jsonc
{
  "format": "webreel",
  "reviewed": { "argument": "...", "orthodoxy": "...", "by": "..." },  // gated content
  "aspect": "vertical",                 // vertical | square | wide  (1080x1920 default)
  "theme": "navy",
  "fps": 30,
  "voice": "am_michael",                // en-US = a*, en-GB = b*
  "speed": 1.0,
  "footer": "Apologia Daily · apologiadaily.com",
  "caption_ig": "…",                    // Instagram caption (gated, ported from the essay)
  "caption_x": "…",                     // X caption, <=280 incl. a live .html link
  "scenes": [
    {
      "kicker": "A week after the cross",          // optional uppercase eyebrow
      "lines": [
        { "t": "Thomas reached for the wounds", "size": "md" },
        { "gap": true },                            // vertical spacer
        { "t": "“My Lord and my God.”", "size": "lg", "color": "gold",
          "style": "verse", "kinetic": true },      // kinetic = word-by-word reveal
        { "t": "— John 20:28", "cite": true }  // small dim citation line
      ],
      "structure": {                                // optional animated "structure reveal"
        "rows": ["John", "Colossians", "Hebrews"],
        "verdict": "God’s throne. Name. Worship."
      },
      "vo": "A week after the cross, Thomas reached toward the wounds…",  // narration
      "hold": 1.2                                   // optional extra seconds after the voice
    }
  ],
  "lexicon": { "1 Cor": "First Corinthians" }       // optional TTS pronunciation swaps
}
```

Line fields: `size` = `sm | md | lg | xl`; `color` = `gold` (default cream);
`style` = `verse` (italic); `kinetic` = true (word-by-word); `cite` = true (small citation).

## Content rules

A webreel is **gated content** exactly like any reel: positive-case only, no steelmanning,
no scope disclaimers, doctrinal fences stay, `reviewed` block required, `vo` and captions
**ported from the paired certified essay**. See `.claude/skills/make-reel/SKILL.md` and
`CLAUDE.md`. Don't commit the spec / MP4 / captions — deliver the files and stop.
