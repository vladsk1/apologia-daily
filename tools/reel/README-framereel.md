# framereel — "one idea, one picture" reels

`gen_framereel.py` turns a `specs/frame-*.json` spec into a voiced 1080×1920 MP4. A frame
reel is built around **one central picture that stays on screen and changes as the point
develops**, under a short, large headline, on the brand navy starfield, narrated with
Kokoro `am_michael`. Modelled on the plain-background reels of Instagram
`@frames.of.quran` (never their picture-backed ones — owner ruling 2026-11-13).

It reuses the recording machinery of the older `gen_webreel.py` (Kokoro voice,
`capture-webreel.mjs`, ffmpeg) with a new template, `web/frame.html`.

## Run

```
python tools/reel/gen_framereel.py tools/reel/specs/frame-<name>.json            # voiced MP4
python tools/reel/gen_framereel.py tools/reel/specs/frame-<name>.json --draft    # no voice: contact sheet only, ~20s
```

Outputs, all in `tools/reel/output/` (git-ignored):

| File | What it is |
|---|---|
| `<name>.mp4` | the finished reel |
| `<name>.sheet.png` | 24 stills across the reel — **look at this before delivering** |
| `<name>.captions.txt` | Instagram + X captions from the spec |

Flags: `--draft`, `--voice`, `--speed`, `--fps`, `--lead` / `--hold` (pause before / after
the voice on each beat), `--keep` (keep the `.frame_<name>` work dir), `--out`.

The generator prints warnings (⚠) for anything that makes the type shrink or the reel run
long. Fix the warnings rather than ignoring them; they are how the big-text look is kept.

Needs Node 22+ and Chrome or Edge (set `CHROME_PATH` if not found). To preview by hand,
open `web/frame.html` in a browser and press Play.

## Spec format

```jsonc
{
  "format": "framereel",
  "reviewed": { "argument": "…", "orthodoxy": "…", "by": "…" },   // gated content, like every reel
  "source": "library/<essay>.html",
  "voice": "am_michael", "speed": 1.0,
  "lexicon": { "1 Cor": "First Corinthians" },                    // optional pronunciation swaps
  "caption_ig": "…", "caption_x": "…",
  "scenes": [
    { "figure": { "type": "timeline", "points": [ … ] },
      "beats": [
        { "say": "The hook.", "kick": "Small eyebrow", "head": "Two or three\nshort lines\n*gold payload.*", "form": true,
          "show": { "lit": [2], "cur": 2 }, "echo": "GOSPELS" },
        { "say": "Narration for this beat.", "head": "Start at\n*the cross.*", "show": { "lit": [2, 0], "cur": 0 }, "echo": "AD 30" },
        { "say": "…", "head": "…", "note": "Source or Scripture reference", "show": { "lit": [0, 1], "cur": 1 } }
      ] }
  ],
  "end": { "line": "Read the full case — free", "say": "Read the full case, for free, at Apolojia Daily." }
}
```

- A **scene** is one picture. **Most reels are ONE figure scene**, with the picture on screen
  from the first frame and the hook as its first beat. A scene with no `figure` is a plain
  statement screen; use one only when a line needs the whole frame to itself. The end card
  is added automatically from `end`.
- A **beat** is one narrated step. Per beat:
  - `say` — the narration (required).
  - `head` — the headline. `*word*` = gold, `~word~` = sky blue. **Break the lines yourself
    with `\n`**: about 24 characters a line, three lines at most, about 12 words in total.
    Longer lines force smaller type.
    A colour run cannot cross a line break: mark each line (`*line one*\n*line two*`), or
    the whole run prints cream.
  - `sub` — one smaller line under the headline. `kick` — a small gold eyebrow above it.
  - `note` — the source line under the picture (a Scripture reference or a named scholar).
  - `show` — what the picture shows on this beat (see below).
  - `echo` — one huge, faint outlined word behind the picture for this beat (`"AD 30"`,
    `"~DECADES"` — a leading `~` makes it sky blue). Use the beat's own key word; it is content.
  - `form` — `true` makes the headline's coloured words form out of converging dust. Use it
    on the opening beat and the verdict, not on every beat.
  - `hold` — extra seconds after the voice.
- **Inheritance:** a beat that leaves out `head`, `sub`, `kick` or `note` keeps the previous
  beat's (so the headline does not re-animate). Set it to `""` to clear it. `show` is merged
  over the previous beat's `show`, so only write what changes; set a key to `null` to clear it.

## What moves, and why (all automatic)

Nothing here needs configuring; it follows from `head`, `show` and `cur`.

| Motion | What triggers it |
|---|---|
| Words wipe in left to right through a soft edge, then coloured words catch a glint every few seconds | every headline |
| **A spark leaves the headline's coloured words, flies to the part of the picture the beat is about, and ignites it** (flash, rings, embers, a small camera punch) | any beat whose `show` lights something new or moves `cur` |
| On a timeline the spark travels **along the line** from the point it was on | `cur` moving between timeline points |
| The camera eases toward the item in focus and the rest softens; it pulls back when `cur` is `null` | `cur` |
| Slow rings and orbiting motes around the item in focus; light running down a timeline | `cur`, for as long as the beat lasts — so a held picture is never still |
| Big numbers and bracket labels form out of dust | a new `readout` / `num` / `spanNum` |
| The sky surges forward (stars streak) | every scene change, including into the end card |

The picture changes **when the spark lands**, about 0.8s after the headline starts, so the
viewer reads the words, follows the light, and sees the picture answer.

## The thirteen figures

Pick the one the material is really shaped like. `lit` lists which items are visible;
`cur` is the one in focus (the rest dim); `"cur": null` brings everything back up.

| `type` | Use it for | Figure definition | `show` per beat |
|---|---|---|---|
| `timeline` | dates, gaps, "how early?" | `points:[{yr, year, t, sub}]` — `year` only positions the point; `yr` is the printed label | `lit`, `cur`, `span:[a,b]`, `spanNum`, `spanUnit`, `spanC` — changing `span` makes the bracket travel, so a gap visibly collapses |
| `bars` | 2–5 quantities compared | `rows:[{label, value, display, c}]`, optional `max` (the value a full-width bar stands for; bars are drawn to scale) and `labSize` (label size in px, default 35; a label takes `\n` for a second line) | `lit`, `cur` |
| `grid` | "each dot is one …" counts | `total`, `scatter` | `lit: n` or `[{n,c},…]`, `readout:[{num,label,c}]`, `op` |
| `number` | one figure that carries the point, or a matched pair | optional `h`, and `zeros: {top, rows}` for rows of zeros that keep being written under the number | `num`, `label`, `c` — or `readout:[…two…]` + `op:"="`. A `num` with `^` (`"10^10^123"`) is typeset as a stacked power, each level popping in after the one below (`twAt:[ms, ms]` to time them). `zeros: true` starts the rows of zeros |
| `steps` | 2–5 short points in order | `items:["…" or {t, sub}]` | `lit`, `cur` |
| `ring` | several independent voices, one claim | `center`, `nodes:[{t, sub}]` (3–8) | `lit`, `cur`, `center:true` |
| `verse` | a text whose own words are the point | `text`, `cite` | `hi:["phrase to light up"]` |
| `scroll` | a passage or manuscript, read line by line | `title`, `cite`, and either `lines:["real text", …]` or `rows: 9` (wordless script strokes) | `lit` (lines written so far), `cur` (the line that lights up) |
| `scale` | two sides weighed against each other | `left:{label, c}`, `right:{label, c}` | `left:["chip", …]`, `right:["chip", {t, w: 2}]` — chips drop onto the pans and the beam tilts to the heavier side |
| `map` | where things happened, and the route between | `places:["Jerusalem", {t, lat, lon, sub}]` | `lit`, `cur`, `routes:[[from, to], …]` — light travels each new route |
| `stack` | evidence that builds to a conclusion | `items:["…"]` (bottom first, up to 6), `cap:"the conclusion"` | `lit`, `cur`, `cap: true` |
| `hand` | a five-point mnemonic (HANDS) | `items:[{mark:"H", t:"Honors"}, …]` — exactly five, thumb first | `lit`, `cur` (that finger floods with light and its word shows in the palm), `count: true` (sparks count off the five fingers once), `rays: true` (light behind the hand, for the verdict). All five lit with `"cur": null` fills the whole hand |
| `phone` | a feature tour: screenshots of the live site, one per beat | `shots:["../shots/<set>/01-home.png", …]` (paths relative to `web/`; capture them with `capture-screens.mjs`), optional `w` (phone width, default 500), `aspect` (screen height ÷ width; 2.1 looks like a real phone, so capture the screenshots at that shape, e.g. 360×756), `dots: false` (drop the progress dots under the phone to give it more height) | `cur` — the new screen swipes up into the phone |

Prefer `hand` to `steps` for any five-point acronym. Do not pair it with an `echo` word: a
list plus a background word was rejected as messy (owner, 2026-11-14).

`c` is `gold` or `sky`. Use the pair deliberately: sky for the thing being set aside, gold
for the payload.

Three of these make a claim just by how they are drawn, so they are gated like one:

- **`scale` tilts.** The tilt is a verdict about which side is heavier. Use it only where the
  certified essay itself weighs the two sides that way, and never to show a rival view's
  evidence as weightless when the essay grants it some.
- **`map` positions are real.** Places are plotted from latitude and longitude, with a
  distance bar, and **no coastline is drawn**. These names need no coordinates: Jerusalem,
  Bethlehem, Nazareth, Capernaum, Caesarea, Qumran, Damascus, Antioch, Tarsus, Edessa,
  Ephesus, Smyrna, Nicaea, Constantinople, Philippi, Thessalonica, Athens, Corinth, Rome,
  Lyon, Carthage, Hippo, Cyrene, Alexandria, Oxyrhynchus, Babylon. Any other place needs
  `lat` and `lon`, checked against a reference. A `route` says someone or something went
  from one place to the other, so it needs a source.
- **`scroll` with `lines` quotes a text.** Quote it exactly and name the translation in `cite`.

**No Trinity diagram.** None of these may be used to depict the divine persons or their
relations (owner ruling 2026-08-29, `CLAUDE.md`). A Trinity or deity reel uses `verse`,
`steps` or a statement scene and lets the words carry it. The `hand` is a memory aid for
five points of evidence; its fingers must never be labelled as the divine persons.

**Adding a figure type:** add a `FIG.<name>` factory in `web/frame.html` (it receives the
definition and returns its height plus a `render` that is a pure function of time), add the
name to `FIGURES` in `gen_framereel.py`, and document it in this table.

## Budgets the generator checks

| Thing | Default | Why |
|---|---|---|
| Headline | ≤ 12 words, ≤ ~24 characters a line | keeps the type large |
| Narration | ≤ 190 words | about 45–80 seconds |
| Figures | 1 (2 at most) | the form is one picture that evolves |
| `reviewed` | stamped, not pending | nothing posts un-gated |
| Captions | both present | every reel ships Instagram + X captions |

These are warnings, not blocks. A longer reel is fine when the owner asks for one.

## Content rules

Unchanged from every other reel, and enforced by the gate rather than by this tool:
positive case only, no steelmanning, no scope disclaimers, doctrinal fences stay, wording
ported from the paired certified essay, `reviewed` block required. See
`.claude/skills/make-reel/SKILL.md` and `CLAUDE.md`. Do not commit the spec, MP4 or
captions: deliver the files and stop.
