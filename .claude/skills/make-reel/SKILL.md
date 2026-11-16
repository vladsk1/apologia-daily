---
name: make-reel
description: >-
  Generate a finished, brand-styled short-form vertical video (Reel / TikTok / Short)
  for Apologia Daily from a topic, an Evidence Library card, or an existing answer/essay
  page. Output is an ANIMATED, VOICED 1080x1920 MP4 in the "one idea, one picture" frame
  style: one central picture that stays on screen and changes as the point develops, on
  the brand navy starfield, narrated with Kokoro (am_michael), rendered locally with no
  Canva/API keys. Every reel ships with an Instagram caption, an X caption and an X
  share-card. Use when the user asks to "make a reel / short / video / TikTok", "do a
  reel on X", turn a card, answer or essay into a video, or make a product/feature reel
  from screenshots of the live site.
model: opus
---

# make-reel — Apologia Daily frame-reel generator

"Make a reel" means a **frame reel**: `tools/reel/gen_framereel.py` + `tools/reel/web/frame.html`.
It replaced the older webreel look on the owner's instruction (2026-11-16). The full spec
format, the thirteen picture types and the budgets are in **`tools/reel/README-framereel.md`:
read it before writing a spec.** This file is the workflow and the rules.

## Which model does what

| Job | Model | How it is set |
|---|---|---|
| Reading the essay, writing the spec, fixing, rendering | **Opus** | this skill's `model: opus` (applies to the turn that invokes the skill) |
| Argument reviewer | **Opus** | Agent tool `model: "opus"` |
| Doctrine (orthodoxy) reviewer | **Fable** | Agent tool `model: "fable"` |
| Neutrality reviewer (deity / Trinity / resurrection / Islam / salvation only) | **Fable** | Agent tool `model: "fable"` |
| Citations reviewer | **Sonnet** | Agent tool `model: "sonnet"` |

- **Always pass `model` explicitly on every reviewer you start.** A reviewer started without it
  inherits the session's model, which defeats the point.
- Argument and doctrine sit on **different** model families on purpose (`CLAUDE.md`, A3): two
  reviewers on one model share blind spots. If a family is unavailable, say so in the stamp.
- The rendering itself uses no AI model (Python + headless Chrome + Kokoro + ffmpeg).
- ⚠ The skill's `model: opus` lasts for the turn that invoked it. A later message in the same
  session ("continue", "apply that") runs on the session's own model again. That is harmless:
  the reviewer models are set per reviewer and do not depend on it.

## Workflow

1. **Find the source and read it in full.** A reel is ported from a **certified essay as it
   stands today** (`library/*.html`), found from the topic, the card (`ev-sN.html`,
   `id="arg-…"`), or the answer page. Read the whole essay, not excerpts.
   - **Port from the current essay, never from an older reel.** An essay re-hedged after an old
     reel was certified made a "verbatim port" fail its gate (HANDS, 2026-11-14).
   - Check `docs/scholar-labels.md` for every named scholar and `docs/known-traps.md` for the topic.
   - An older reel on the same topic stays untouched: write a new `frame-<name>.json`.

2. **Write the spec** `tools/reel/specs/frame-<name>.json` (format in the README;
   `specs/frame-gospel-names.json` and `specs/frame-james-brother.json` are good references).
   - **One persistent picture per scene**, chosen because the material is really shaped like it
     (dates → `timeline`; quantities → `bars`; one decisive figure → `number`; a text whose words
     are the point → `verse`; independent voices → `ring`; evidence building → `stack`; a
     five-point mnemonic → `hand`; a feature tour → `phone`). A hook or a verdict that needs the
     whole frame is a scene with no `figure`.
   - **Never leave a picture empty under the headline for several beats.** If the first beats
     have nothing to light, make them a statement scene, or light the baseline first.
   - Narration ("say") is the essay's wording, trimmed. Headlines and eyebrows are yours:
     keep them few-worded and **list them for the reviewers as your own strings**.
   - Add `caption_ig`, `caption_x` (≤280 with the link counted as 23; recount any caption a
     reviewer hands you) and write the X card spec `tools/reel/xcards/x-<name>.json`.
   - Length: the owner is fine with reels over a minute; do not cut content to hit 30 seconds.
     Around 1:00–2:00 is normal. Say so if it runs past 2:00.

3. **Draft and look** before any review:
   ```
   python tools/reel/gen_framereel.py tools/reel/specs/frame-<name>.json --draft --keep
   ```
   Read `tools/reel/output/<name>.sheet.png` (24 stills), then open two or three full-size
   frames from `tools/reel/.frame_<name>/frames/`. Check: nothing overlaps the headline, labels
   are not cut off, the picture's main mass is centred under the headline, no long empty
   stretch. Fix the generator's ⚠ warnings rather than ignoring them. Always run from the repo
   root (a shell left inside `.frame_<name>` locks the folder and the next run crashes).

4. **Mechanical checks:** `node tools/check-orthodoxy-tripwires.mjs` and
   `node tools/check-retired-claims.mjs`.

5. **Review round (the gate).** One round = every applicable reviewer **in parallel on the same
   text**, then **one** fix pass.
   - Start each reviewer with the **Agent tool, `subagent_type: "Explore"`** (it has no edit
     tools) and the model from the table above. Brief it to read its own definition in
     `.claude/agents/apologia-<lens>.md`, the two ledgers, and **the essay in full**; tell it the
     reel rules below so it does not ask for disclaimers; name every string that is yours.
   - Which reviewers: **argument + orthodoxy on every reel**; **+ citations** when the reel
     states numbers, dates, quotations or scholars; **+ neutrality** (dual consensus) for
     deity / Trinity / resurrection / salvation / Islam and other rival-worldview reels. A
     product or feature reel: argument (is every claim true of the site?) + orthodoxy (copy,
     and a pull-quote test on every screenshot).
   - **Hash the spec, X card, essay and both ledgers before and after each round** (`md5sum`)
     and confirm the reviewers changed nothing. Other sessions edit site files in this folder,
     so judge by the files under review, not by `git status` alone.
   - **Fix pass: merge all reports, then paste the reviewers' replacement wording verbatim.**
     Where two reviewers pull one line in different directions, choose a different premise from
     the essay, not a blend of their wordings. Optional polish may be declined: record it.
   - **A fix pass re-opens the gate.** Re-run argument and orthodoxy on the corrected text. A
     final change of one or two reviewer-supplied strings can be confirmed by a narrow pass.
   - Never stamp a review that did not run. Stop widening if a round finds mostly your own
     new wording: port instead.

6. **Stamp** `reviewed` in the spec and the X card: the dates per lens, and a `by` note saying
   what each round found, what was declined, which strings are yours, which model ran each
   lens, and what nobody checked (the rendered video, the voice).

7. **Render the voiced reel, detached**, so a dropped session does not kill it. First check no
   other render is running (other sessions share the capture script; never kill node or
   chrome by a broad pattern).
   ```powershell
   $root = (Get-Location).Path; $env:PYTHONIOENCODING = "utf-8"
   $p = Start-Process python -ArgumentList @("tools/reel/gen_framereel.py","tools/reel/specs/frame-<name>.json") `
        -WorkingDirectory $root -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput "tools\reel\.frame_render_<name>.log" -RedirectStandardError "tools\reel\.frame_render_<name>.err.log"
   $p.Id | Out-File -Encoding ascii "tools\reel\.frame_render_<name>.pid"
   ```
   Then wait for it in a background command (`Wait-Process -Id <pid>`, then print the log's
   last lines) so you are notified when it ends.
   When it finishes, read the final contact sheet. **The file must be under 30 MiB** or it will
   not reach the owner's phone: a reel near two minutes needs a delivery copy re-encoded with
   ffmpeg at `-crf 25` to `27` (`-preset slow`, audio copied); keep the original as
   `<name>-master.mp4`.

8. **X card:** `python tools/reel/gen_xcard.py tools/reel/xcards/x-<name>.json` →
   `tools/reel/output/cards/<name>-xcard.png`. Read the PNG: a kicker over about 40 characters
   runs off the card.

9. **Deliver** the MP4 and the X card with `SendUserFile`, and paste the Instagram caption and
   the X caption, each in its own fenced block. Say plainly what was and was not checked
   (stills are checked; the voice and motion are not, unless you played it).

## Content rules (owner rules; the reviewers are briefed with these)

- **Positive case only. No steelmanning.** Neither the narration nor the screen gives the
  opposing objection airtime.
- **No scope disclaimers** ("this doesn't prove…", "it clears the ground", "corroborates, not
  proves"). The reel ends on a **confident verdict ported from the essay**.
- **Not a licence to overclaim: honour the bound by omission.** The verdict is the one the
  essay lands, at the essay's strength. If a claim needs a hedge to be true, leave it out.
  Never "this proves he rose", "scientists agree the universe is designed", "everything has a
  cause", "virtually all scholars".
- **Doctrinal fences are not disclaimers and always stay**, inside the sentence, because a reel
  cannot host the site's ＊ clarifier box. Trinity and deity reels must be extra clear and avoid
  compressible metaphors.
- **No Trinity diagram**, on any picture type (owner ruling 2026-08-29).
- **Every frame can be screenshotted alone.** A headline must keep its subject and its date:
  "Traditions that trace back to people who lived there", not "From people who actually lived
  there"; "First-century Palestine, not the diaspora", not "Palestine, not the diaspora".
- **Our navy starfield only.** No photo or illustration backgrounds. No list stacked over a
  huge background word.
- No fabricated quotes, citations or statistics. Name scholars as `docs/scholar-labels.md` allows.
- **Every reel ends with the call to action**, which the generator adds from `end`:
  `{"line": "Read the full case — free", "say": "Read the full case, for free, at Apolojia Daily."}`.
  Spell the brand "Apolojia" in anything spoken (or set `"lexicon": {"Apologia": "Apolojia"}`);
  keep "Apologia Daily" on screen. Respell other names the voice gets wrong in `lexicon`
  ("Qur'an", "Nicaea", "Ignatius", "Didache" are known problems: avoid speaking them).
- **Every reel ships both captions and the X card**, gated in the same round as the reel.
  X link must be a live `.html` URL.
- **Do not commit or push** the reel spec, X-card spec, screenshots or MP4s. Write them
  locally, gate, render, deliver, and stop. Do not rewrite older reels.

## Lessons that keep recurring

- Science: say "estimated" for Penrose's figure and never call him an atheist; keep "our own
  judgment" on the same screen as a design conclusion; never "the physics is not in dispute"
  beside the verdict.
- Resurrection: the "most scholars, within a few years" date belongs to the creed's core
  (1 Cor 15:3–5), never to verse 7 or the five hundred. A scholar's quotation that reads
  backwards when cropped needs its conditional on screen and the essay's gloss straight after.
- Statistics: say whose sample a percentage is from ("of the Jewish men in that catalogue"),
  draw bars to scale, and keep any contrast the verdict relies on (for example the diaspora).
- A gold run in a headline cannot cross a line break: mark each line.
- Screenshots in a `phone` reel are gated too: no "Pro" badge, price, empty streak counter or
  cookie banner; no Scripture verse the page prints cut short; keep the Kalam card's "Built by
  … Islamic kalām tradition" box out of a frame that also shows "sounds a lot like God".

## Product / feature reels (screenshots of the live site)

Use the `phone` picture (`"w": 500, "aspect": 2.1, "dots": false`). Capture the screens with
`node tools/reel/capture-screens.mjs tools/reel/shots/<set>.json --out tools/reel/shots/<set>`
at a 360×756 viewport (`shots/site-showcase-v2.json` is the reference recipe, with helpers to
hide the cookie banner and floating buttons). Build a contact sheet and read every shot. Each
headline must match its screen, and every claim about the site must be checked against the
page source ("everything is free" is the homepage's own sentence; do not go beyond it).

## X / social share-cards — the standard X-image style

Every X post image is made with `tools/reel/gen_xcard.py`: a night-sky navy scene, a gold
underlined kicker, an italic-serif headline (a cream line and a gold line), a sans sub-line,
the shield logo and apologiadaily.com, 1600×900. **Never ship a frame pulled from the reel MP4
as the X image.**
- Spec in `tools/reel/xcards/`: `{ "name", "kicker", "headline":[{t,c}], "sub":[...] }`
  (`c` is `cream` / `gold` / `dim`). Two short parallel headline lines.
- Exemplars: `xcards/x-scripture-one-story.json`, `xcards/x-honor-the-son.json`.
- It is content: gate it with the reel and record the gate in its `reviewed` field.

## Older generators (kept, not the default)

- `gen_webreel.py` + `web/reel.html` — the previous animated look (`README-webreel.md`,
  `specs/webreel-*.json`). Use only if the owner asks for that style or for a new version of
  an existing webreel.
- `gen_reel.py` — silent, fully-captioned Pillow frames (`README.md`). Use for a quick
  caption-only cut when no voice is wanted.
- `gen_explainer.py` — the long-form "The Case" explainers; not a reel.

## Notes / limits

- Needs Node 22+ and Chrome or Edge (set `CHROME_PATH` if not found). The first voiced run
  downloads the Kokoro model into `.tts/`.
- A full voiced render takes roughly 15–30 minutes depending on length; a `--draft` takes
  about 20 seconds.
- ffmpeg: `python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`.
- Adding a picture type: a `FIG.<name>` factory in `web/frame.html`, the name in `FIGURES` in
  `gen_framereel.py`, a row in the README table. Source notes already shrink to fit: do not add
  a second fitting pass.
