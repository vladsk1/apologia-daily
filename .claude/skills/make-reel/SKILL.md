---
name: make-reel
description: >-
  Generate a finished, brand-styled short-form vertical video (Reel / TikTok / Short)
  for Apologia Daily from a topic or an existing answer/essay page. Default output is an
  ANIMATED, VOICED 1080x1920 MP4 in the cinematic navy/gold "Frames of Quran" style,
  narrated with Kokoro (am_michael) — rendered locally, no Canva/API keys; a silent
  fully-captioned Pillow render stays as the quick alternative. Use when the user asks to
  "make a reel / short / video / TikTok", turn an answer or essay into a video, or wants
  another version / aspect ratio / theme of an existing reel.
---

# make-reel — Apologia Daily short-form video generator

Two render paths. **Default = the animated, voiced "webreel":** cinematic navy/gold motion
(drifting nebula, rising gold embers, a light sweep, a slow Ken Burns push-in, line-by-line
and word-by-word reveals, an animated "structure reveal"), narrated with Kokoro **am_michael**,
in the Instagram @frames.of.quran style. **This is what "make a reel" means now.** The older
**silent, fully-captioned** path (`gen_reel.py`, static Pillow frames) stays for a quick
caption-only cut or when no voice is wanted. Both end on the stacked `APOLOGIA DAILY` /
`apologiadaily.com` footer with scene pager dots.

Tooling lives in `tools/reel/`:
- **`gen_webreel.py` — the default generator.** Kokoro voices each scene (am_michael), then
  `capture-webreel.mjs` steps `web/reel.html` frame-by-frame over headless Chrome (no npm
  deps) timed to the narration, and ffmpeg muxes a real voiced MP4 — plus it writes
  `output/<name>.captions.txt` (Instagram + X). Needs Node 22+ and Chrome/Edge. Specs:
  `specs/webreel-*.json` (`specs/webreel-jesus-god-nt.json` is the reference); format in
  `README-webreel.md`.
- `web/reel.html` — the deterministic animated template (all motion is a pure function of
  time via `window.__seek`, so capture is exact). Open it directly to preview with sound.
- `gen_reel.py` — the silent/captioned generator (self-installs Pillow + a static ffmpeg).
- `specs/*.json` — reel specs (`specs/was-jesus-a-muslim.json` is the silent reference).
- `README.md` — the silent spec format in full.

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
   - **OWNER RULE (2026-10-09) — NO SCOPE DISCLAIMERS IN REELS.** Do not add "this doesn't
     prove X", "it clears the ground", "corroborates, not proves", "not yet the full God of
     Christianity" or similar hedge lines to a reel's voiceover, on-screen text or captions.
     Reels state the case positively and close on a confident, ported verdict (e.g. the
     essay's own "we say it with them…" line), never on a limitation. The full honest scope
     lives in the linked essay, not the reel. (This supersedes the earlier "keep the scope
     bounds" instruction for reels.)
   - **This is still not a licence to overclaim — honour the bound by OMISSION, not by
     disclaimer.** If a claim would need a "doesn't prove" hedge to be accurate, leave the
     claim out rather than state it unhedged. Never write "this proves he rose", "scientists
     agree the universe is designed", "everything has a cause", "virtually all scholars", etc.
   - **DOCTRINAL FENCES ARE NOT DISCLAIMERS — they always stay.** Wording that keeps a line
     orthodox (e.g. "the Son, truly God, died in his human nature — not the Father, not the
     divine nature"; "in the form of God… therefore"; distinct persons on Trinity/deity
     reels) is required, because a reel cannot host the site's ＊ orthonote box. Gate briefs
     for reels must tell the lenses about this rule so they do not demand scope hedges.
   - No fabricated quotes/citations/stats. For a brand-new argument (not derived from an
     already-certified page), run it past the `apologia-orthodoxy` agent before delivering.
   - **OWNER RULE (2026-10-26) — EVERY reel ends with a spoken + on-screen CALL TO ACTION.**
     After the confident verdict, add a final CTA scene inviting the viewer to **read the full
     case for free at Apologia Daily**. Spoken `vo`: "Read the full case, for free, at Apolojia
     Daily." ⚠ **Spell it "Apolojia" in the `vo`** (Kokoro says the bare word "Apologia" wrong —
     /a-PAH-luh-juh/; "Apolojia" → /ap-uh-LOH-jee-uh/, correct; verified via the kokoro-onnx
     Tokenizer). On-screen keep "Apologia Daily" + "apologiadaily.com". Example CTA scene:
     `{"beats":[{"center":true,"lines":[{"t":"Read the full case — free —","size":"sm"},{"gap":true},{"t":"at Apologia Daily.","size":"lg","c":"gold","anim":"pop"},{"t":"apologiadaily.com","cite":true}],"vo":"Read the full case, for free, at Apolojia Daily.","hold":1.8}]}`

2. **Write the spec.** Copy `specs/was-jesus-a-muslim.json` as the template and adapt it.
   ~9–11 scenes, ~35–45s total. Structure that works: hook title → the claim → the pivot
   → 2–4 evidence beats (gold-highlight the payload line of each) → the dilemma/turn →
   the confident answer → CTA title with `apologiadaily.com`. Keep body lines short enough
   to fit ~one line at the given font size (the renderer centers but does not auto-wrap
   long single lines — break them yourself across `lines[]`). Put the full narration in the
   `voiceover` field so the user can add AI voice in one pass.

   **For the default animated webreel, write a `webreel-*.json` spec instead** (copy
   `specs/webreel-jesus-god-nt.json`; full format in `README-webreel.md`). Same content
   rules as above. Each scene carries its own spoken `vo` line plus `lines[]` with
   `size`/`color`/`kinetic`; an evidence beat can use a `structure` block for the animated
   reveal. Add `caption_ig` and `caption_x` to the spec (gated, ported from the essay) — the
   renderer emits them for copy-paste when the MP4 is done.

3. **Render.** Default (animated + voiced), from the repo root:
   ```
   python tools/reel/gen_webreel.py tools/reel/specs/webreel-<name>.json   # voiced MP4 → tools/reel/output/
   python tools/reel/gen_webreel.py <spec> --voice am_michael --fps 30 --keep
   ```
   First run fetches the Kokoro model (cached in `.tts/`); needs Node 22+ and Chrome/Edge.
   It also writes `output/<name>.captions.txt` (Instagram + X) from the spec's caption fields.

   Silent / captioned alternative (`gen_reel.py`, from `tools/reel/`):
   ```
   python3 gen_reel.py specs/<name>.json --theme navy|parchment   # → tools/reel/output/
   python3 gen_reel.py specs/<name>.json --aspect square|wide
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

5. **Deliver** the MP4(s) to the user with `SendUserFile` (display: render). For a webreel the
   renderer already wrote `output/<name>.captions.txt` from the spec's `caption_ig`/`caption_x`;
   present those (still gated — see below), and also paste them into the reply.
   **OWNER RULE (2026-10-09) — every reel ALWAYS ships with BOTH captions, even if not asked:**
   - an **Instagram caption** (hook line, short body, "link in bio" CTA, hashtags), and
   - an **X post caption** (≤280 characters with the link counted as 23; the link must be a
     live URL — check it returns 200, and use `.html` paths, since `/library/foo` without
     `.html` 404s), plus an **X share-card image** made with `gen_xcard.py` (see below).
   Both captions and the X card are gated content: run them through the same gate round as the
   reel spec, and port their wording from the certified essay/reel rather than authoring it.
   Present each caption in its own fenced block so it can be copied.
   **OWNER RULE (2026-10-09) — DON'T COMMIT REELS.** Do not commit or push the reel spec,
   X-card spec or screenshots to the repo; the owner keeps the delivered files. Write them
   locally (the renderer needs them), gate them as usual, render, deliver — and stop there.
   Do not rewrite older reels either.

## Webreel visual form — a PALETTE, not a template
The webreel engine (`tools/reel/web/reel.html`) is a VOCABULARY of motion devices, not a fixed
layout. The whole point is that **no two reels should feel the same.** The creative act is
finding the structure the material is secretly asking for, then building the reel around it.

**Available structure types** (a scene's `structure` block; full format in `README-webreel.md`):
- `stats` — a row of big numbers with labels (27 books · ~9 authors · 2 languages)
- `bignum` — one giant count-up number (`"count": true`)
- `list` — stacked rows that reveal / highlight per beat
- `constellation` — nodes that light up in sequence with a connecting line
- `chiasm` — mirrored bars (A B C … C' B' A') with labels + bracket, for a real chiastic text

Plus per-word highlight colours (`"c":"gold"` / `"c":"sky"`), a depth `"stage":"arch"` backdrop,
free placement, and `beats` (a fixed structure while the headline cycles over it).

**Match the form to the content — as INSPIRATION, never a lookup table:**
- Manuscripts / dating / counts → `bignum` count-up, a bar or stat comparison, a timeline
- Fulfilled prophecy → a `list` lighting up, or an odds count-up
- A passage built as a mirror → `chiasm`
- "One claim runs through many books / witnesses" → `constellation`
- A plain, weighty statement → **no structure at all**; let the words carry it

**The rules of form:**
1. **Find the form, don't apply one.** Ask what is genuinely structured in this material. If
   nothing is, don't bolt on a diagram — a quiet, well-set line beats a meaningless chart.
2. **The structure must be TRUE.** A chiasm reel needs a real chiasm; a count reel real counts.
   A device that looks impressive but says nothing is a defect (and an overclaim risk).
3. **Invent when nothing fits.** The engine is open — add a new structure type to `reel.html`
   when a topic deserves one (the reels we studied invent a bespoke device per post). This is
   encouraged, not a last resort. (Not yet built, add when needed: dot-matrix "each dot = one
   unit" grid, particle-formed numbers, two-column comparison.)
4. **Vary deliberately.** Before reusing a device, check the recent reels didn't just use it —
   sameness across the feed is the failure mode to avoid.

This governs FORM only. The content guardrails (positive-case, ported-from-the-essay, gated,
no new claims) govern CLAIMS and are never relaxed for the sake of a visual.

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
- TTS: the default webreel path voices locally with Kokoro **am_michael** (offline, no API
  key) via `gen_explainer.py`'s engine — set each scene's `vo`. The silent `gen_reel.py` path
  has no voice; there the user adds it from the `voiceover` text in CapCut/Canva/InShot.
- Webreel needs Node 22+ and a Chrome/Edge install (frame capture over the DevTools protocol,
  no npm deps). Set `CHROME_PATH` if the browser isn't auto-found.
- Fonts default to DejaVu Serif/Sans (present on Debian/Ubuntu). Override with env vars
  `REEL_SERIF` / `REEL_SERIFB` / `REEL_SANS` if the box lacks them.
- Rendering is fast (seconds). If you hit a slow/huge encode, it's the zoompan bug from the
  first build — `gen_reel.py` already caps frames with `-frames:v`; don't reintroduce `-t`.
