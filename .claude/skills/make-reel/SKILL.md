---
name: make-reel
description: >-
  Generate a finished, brand-styled short-form vertical video (Reel / TikTok / Short)
  for Apologia Daily from a topic or an existing answer/essay page. Renders a
  fully-captioned 1080x1920 (or square/wide) MP4 locally with Pillow + ffmpeg — no
  Canva, no network, no API keys. Use when the user asks to "make a reel / short /
  video / TikTok", turn an answer or essay into a video, or wants another version /
  aspect ratio / theme of an existing reel.
---

# make-reel — Apologia Daily short-form video generator

Turns a script into a finished, on-brand vertical video: deep-navy/gold ("navy") or light
"manuscript" ("parchment") theme, gold-accented section kickers, crossfades, a subtle Ken
Burns zoom, scene progress dots, and the `apologiadaily.com` footer. The tool renders
**silent, fully-captioned** video (every line is on screen). Voiceover, if wanted, is added
afterward in any editor using the `voiceover` text carried in the spec.

Tooling lives in `tools/reel/`:
- `gen_reel.py` — the generator (self-installs Pillow + a static ffmpeg on first run).
- `specs/*.json` — reel specs (`specs/was-jesus-a-muslim.json` is the reference example).
- `README.md` — the spec format in full.

## Workflow

1. **Get the content — and keep it orthodox.** If the user names an existing page
   (e.g. `answers/*.html`, `library/*.html`), Read it and pull the vetted claims from
   there. Otherwise draft a script. **Every reel is site content and must obey the same
   guardrails in `CLAUDE.md`**: classical Nicene orthodoxy, denominational neutrality,
   1 Peter 3:15 tone, and "charity is accuracy, not concession" — steelman the other side
   accurately, but open and close **confidently**, never with a concession as the hook.
   No fabricated quotes/citations/stats. For a brand-new argument (not derived from an
   already-certified page), run it past the `apologia-orthodoxy` agent before delivering.

2. **Write the spec.** Copy `specs/was-jesus-a-muslim.json` as the template and adapt it.
   ~9–11 scenes, ~35–45s total. Structure that works: hook title → the claim → the pivot
   → 2–4 evidence beats (gold-highlight the payload line of each) → the dilemma/turn →
   the confident answer → CTA title with `apologiadaily.com`. Keep body lines short enough
   to fit ~one line at the given font size (the renderer centers but does not auto-wrap
   long single lines — break them yourself across `lines[]`). Put the full narration in the
   `voiceover` field so the user can add AI voice in one pass.

3. **Render.** From `tools/reel/`:
   ```
   python3 gen_reel.py specs/<name>.json --theme navy      --out /abs/out/<name>-navy.mp4
   python3 gen_reel.py specs/<name>.json --theme parchment  --aspect vertical
   python3 gen_reel.py specs/<name>.json --aspect square
   python3 gen_reel.py specs/<name>.json --aspect wide
   ```
   `--theme` (navy|parchment), `--aspect` (vertical|square|wide) override the spec.
   Write outputs to the session scratchpad, not the repo.

4. **QA before delivering.** Probe duration/size and extract a couple of frames to eyeball
   for overflow/typos (ffmpeg is at `python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`):
   ```
   FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
   $FF -ss 10 -i out.mp4 -frames:v 1 frame.png   # then Read frame.png
   ```
   If a kicker or line overflows the frame edge, shorten the text or split the line.

5. **Deliver** the MP4(s) to the user with `SendUserFile` (display: render). Include a short
   kit: the `voiceover` script, a caption + hashtags, and a one-line note that the video is
   silent-but-captioned and voiceover is a one-pass editor step.

## Notes / limits
- No TTS in this environment (Canva AI Voice is editor-only; external/neural TTS hosts are
  policy-blocked). Ship silent+captioned; the user adds voice in CapCut/Canva/InShot.
- Fonts default to DejaVu Serif/Sans (present on Debian/Ubuntu). Override with env vars
  `REEL_SERIF` / `REEL_SERIFB` / `REEL_SANS` if the box lacks them.
- Rendering is fast (seconds). If you hit a slow/huge encode, it's the zoompan bug from the
  first build — `gen_reel.py` already caps frames with `-frames:v`; don't reintroduce `-t`.
