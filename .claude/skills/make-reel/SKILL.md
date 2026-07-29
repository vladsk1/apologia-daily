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
   1 Peter 3:15 tone, and "charity is accuracy, not concession."
   - **REELS ARE POSITIVE-CASE ONLY — NO STEELMANNING (hard rule, all reels).** The
     `voiceover` **and** the on-screen scenes must NOT steelman, restate, or give the
     opposing objection any airtime. State the case confidently from open to close. Do not
     add an "objection scene" or a "now, skeptics argue…" beat, even briefly.
   - This does **not** license overstatement. Keep the honest *scope bounds* the
     argument/orthodoxy gates require (e.g. "this corroborates — it doesn't by itself prove
     X," or the deity-vs-metaphysics distinction) — those are **accuracy, not
     steelmanning**, and stay. The banned thing is voicing the other side's counter-case;
     the required thing is not claiming more than the evidence shows.
   - No fabricated quotes/citations/stats. For a brand-new argument (not derived from an
     already-certified page), run it past the `apologia-orthodoxy` agent before delivering.

1b. **Pick the gate tier — do NOT run the full stack by default.** Established 2026-07-29 after a
   from-scratch reel cost five rounds and a from-scratch X thread another three. Re-checking a claim
   the Evidence Library has already certified tells you nothing; what compression actually breaks is
   different. Tier by what the reel *does*, not by how important it feels:

   | The reel… | Gates |
   |---|---|
   | Compresses a certified page, no new claims | **source-diff + `apologia-orthodoxy`** |
   | Adds a fact not in the source (date, number, name, quotation) | **+ `apologia-citations`, on that fact only** |
   | Makes an inference the source does not make | **+ `apologia-argument`** |

   **The source-diff is the one that matters and it is not a normal gate — do it yourself, first.**
   Open the certified source beside the spec and check every claim appears there *and that the
   compression preserved its bounds*. This is the failure mode: the essay says "the earliest
   **recoverable** Jewish response"; a reel that says "the earliest answer" has silently dropped the
   bound. The 2026-07-28 mastery audit found this across 63 pages — *"written without reading the
   essays."*

   **Three defects belong to the FORMAT and no content gate catches them. Check all three by eye:**
   - **Typography carrying the wrong voice.** Gold `serifb` is the brand's *affirmation* type. A
     quoted opponent's claim set in it reads as ours. Fence it in the `kicker`
     (e.g. `MATTHEW 28 — THE COUNTER-STORY`), which cannot be cropped away.
   - **Pronouns across a scene cut.** A frame is screenshotted alone and a crossfade is not a
     paragraph. An unmoored "they"/"it" in a Christian post defaults to *the Gospels / the church*.
     Name the subject on every frame that has one.
   - **A fix landing in one layer only.** The `voiceover` and the `lines[]` are two surfaces. Change
     one and you must change the other, or the concession survives in the audio and dies on the layer
     people screenshot.

   ⚠ **Entities render literally.** `gen_reel.py` and `gen_xcard.py` draw spec strings straight into
   PIL with no HTML unescaping, and the kicker is letter-spaced per character. `&amp;` printed as
   `Asked &amp;amp; Answered` on a title frame. **Use literal `&`.**

   ⚠ **Check the runtime against the voiceover.** ~150 wpm: a 190-word `voiceover` needs ~76s. A reel
   timed at 39s cannot carry its own narration. Budget ~2.0 words/sec of on-screen text
   (`dur = 1.0 + words/2.0`, floor 3.5s) — 3.5+ words/sec is too fast to read.

2. **Write the spec.** Copy `specs/was-jesus-a-muslim.json` as the template and adapt it.
   ~9–11 scenes, ~35–45s total. Structure that works: hook title → the claim → the pivot
   → 2–4 evidence beats (gold-highlight the payload line of each) → the dilemma/turn →
   the confident answer → CTA title with `apologiadaily.com`. Keep body lines short enough
   to fit ~one line at the given font size (the renderer centers but does not auto-wrap
   long single lines — break them yourself across `lines[]`). Put the full narration in the
   `voiceover` field so the user can add AI voice in one pass.

3. **Render.** From `tools/reel/`:
   ```
   python3 gen_reel.py specs/<name>.json --theme navy       # → tools/reel/output/
   python3 gen_reel.py specs/<name>.json --theme parchment
   python3 gen_reel.py specs/<name>.json --aspect square
   python3 gen_reel.py specs/<name>.json --aspect wide
   ```
   `--theme` (navy|parchment), `--aspect` (vertical|square|wide) override the spec.
   Finished MP4s save to **`tools/reel/output/`** by default (git-ignored); pass `--out`
   only if you need a different location.

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

## X / social share-cards — THE standard X-image style (use for EVERY X post image)
When a thread or post needs an image, **always generate it with `tools/reel/gen_xcard.py`** — the
brand card: a night-sky navy scene (soft moon + glow top-right, mountain silhouettes), a gold
underlined kicker, an *italic-serif* headline (a cream line + a gold line), a sans sub-line, and the
shield logo + apologiadaily.com bottom-left, 1600×900. **NEVER ship a flat frame extracted from the
reel MP4 as the X image** — that plain title frame is not the brand style and must not be used.
- **Spec:** a small JSON in `tools/reel/xcards/` — `{ "name", "kicker", "headline":[{t,c}], "sub":[...] }`
  (`c` is `cream`/`gold`/`dim`). Keep the headline two short parallel lines (cream then gold).
- **Render:** `python3 gen_xcard.py xcards/<name>.json` → `tools/reel/output/cards/<name>-xcard.png`.
- **Exemplars (match these):** `xcards/x-scripture-one-story.json` ("Forty voices. / One Author.")
  and `xcards/x-honor-the-son.json` ("Honor the Son. / Just as the Father.").
- **It's content — gate it** (argument + orthodoxy; **+ neutrality** for deity/Trinity/Islam), reusing
  the reel/essay's already-certified framing, and record the gate in the spec's `reviewed` field.

## Notes / limits
- No TTS in this environment (Canva AI Voice is editor-only; external/neural TTS hosts are
  policy-blocked). Ship silent+captioned; the user adds voice in CapCut/Canva/InShot.
- Fonts default to DejaVu Serif/Sans (present on Debian/Ubuntu). Override with env vars
  `REEL_SERIF` / `REEL_SERIFB` / `REEL_SANS` if the box lacks them.
- Rendering is fast (seconds). If you hit a slow/huge encode, it's the zoompan bug from the
  first build — `gen_reel.py` already caps frames with `-frames:v`; don't reintroduce `-t`.
