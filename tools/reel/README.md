# tools/reel — Apologia Daily short-form video generator

Render a finished, brand-styled vertical video (Reel / TikTok / YouTube Short) from a JSON
spec. Slides are drawn with Pillow; encoding uses a bundled static ffmpeg. No Canva, no
network, no API keys. Output is **silent + fully captioned** — add a voiceover afterward in
any editor using the spec's `voiceover` text.

For the end-to-end authoring workflow (including the orthodoxy guardrails every reel must
follow), use the **`make-reel`** skill (`.claude/skills/make-reel/`). This README documents
the generator and the spec format.

## Run

```bash
cd tools/reel
python3 gen_reel.py specs/was-jesus-a-muslim.json                 # spec defaults
python3 gen_reel.py specs/was-jesus-a-muslim.json --theme parchment
python3 gen_reel.py specs/was-jesus-a-muslim.json --aspect square --out /tmp/out.mp4
```

First run pip-installs `Pillow` and `imageio-ffmpeg` if missing. Renders in seconds.

Flags (override the spec): `--theme navy|parchment` · `--aspect vertical|square|wide` ·
`--out <path>` · `--workdir <dir>` (scratch for frames/clips).

## Spec format

```jsonc
{
  "aspect": "vertical",         // vertical 1080x1920 | square 1080x1080 | wide 1920x1080
  "theme": "navy",              // navy (dark) | parchment (light "manuscript")
  "fps": 30,
  "crossfade": 0.6,             // seconds of fade between scenes
  "voiceover": "full narration…",// carried for the editor voiceover pass; not rendered
  "source": "answers/xyz.html", // provenance (optional)
  "scenes": [
    // TITLE scene — large centered lines + optional subtitle:
    { "dur": 2.6,
      "big": [ {"t": "Was Jesus", "c": "gold", "s": 118}, {"t": "a Muslim?", "c": "cream", "s": 118} ],
      "sub": [ {"t": "The question, answered honestly.", "c": "dim", "f": "serif", "s": 44} ] },

    // BODY scene — a section kicker + centered lines:
    { "kicker": "THE CLAIM", "dur": 3.4, "lines": [
      {"t": "Muslims often say", "c": "cream", "s": 62},
      {"t": "Jesus was a Muslim.", "c": "cream", "s": 62},
      {"t": "", "s": 20},                       // blank spacer line
      {"t": "He wasn't.", "c": "gold", "f": "serifb", "s": 84}
    ] }
  ]
}
```

Per-line fields: `t` text · `c` color name (`gold` `cream` `dim`) · `f` font
(`serif` `serifb` bold · `sans`) · `s` pixel size · `gap` extra px below (optional).
An empty `t` inserts vertical space.

### Conventions that read well
- ~9–11 scenes, ~35–45s total. Hook → claim → pivot → 2–4 evidence beats → turn →
  confident answer → CTA.
- Gold-highlight the payload line of each beat; keep everything else cream/dim.
- Lines do **not** auto-wrap — break long lines yourself so nothing runs off the frame.
- Kickers auto-shrink to fit width. Keep body font sizes ≤ ~66 for multi-line scenes.

## Themes
- **navy** — deep navy→blue gradient, gold + cream text, gold radial glow, vignette.
  The default; matches the site header/Evidence Library.
- **parchment** — ivory gradient, navy ink text, muted-gold accents. A calm "manuscript"
  look; good as an alternate cut or for quote-style posts.

## How it works (and the one gotcha)
Each scene → PNG → a short clip with a subtle Ken Burns zoom → clips chained with `xfade`.
The zoom uses `zoompan` with `-frames:v N` to cap the output length. Do **not** add `-t`
back to the per-clip ffmpeg call: `zoompan` emits `d` frames *per input frame*, so a looped
`-t` input multiplies the frame count (an early build produced a 7:47 video instead of 38s).
