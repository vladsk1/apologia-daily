#!/usr/bin/env python3
"""
Apologia Daily — narrated, animated ARGUMENT EXPLAINER generator (16:9, 5–8 min).

The long-form sibling of gen_reel.py. Where a reel is a silent 30–60 s caption slideshow,
an explainer is a fully VOICED walk through one argument, with animated diagrams timed to
the narration and burned-in captions — our own take on the "animated argument" format.

    python3 gen_explainer.py specs/explainer-kalam.json            # full render
    python3 gen_explainer.py specs/explainer-kalam.json --preview  # 1 still per scene
    python3 gen_explainer.py specs/explainer-kalam.json --voice bm_george --no-burn-captions

Output (tools/reel/output/, git-ignored): <spec>.mp4 plus <spec>.srt and <spec>.vtt
(the .vtt is for a <track> element on the web embed).

NARRATION — fully offline text-to-speech, no API key, no per-use cost:
  Kokoro-82M (Apache-2.0 weights AND voices) run through onnxruntime via `kokoro-onnx`.
  First run fetches both from the npm registry (the only model host reachable from the
  cloud sandbox): `kokoro-js` ships the voice packs, `kokoro-q8-shards` ships the q8 ONNX
  model split in six parts. The joined model is checked against a pinned sha256 before
  use. Everything is cached in tools/reel/.tts/ (git-ignored). Voices: am_michael (default),
  am_adam, am_fenrir, bm_george, bm_fable, bm_lewis, af_heart, bf_emma, … (en-US = a*, en-GB = b*).

CONTENT RULES — an explainer is GATED CONTENT like any reel (see CLAUDE.md and the
make-reel skill): it lives in tools/reel/specs/, carries a `reviewed` block, and its
narration should be PORTED from the paired certified essay, never freshly authored.
Unlike a reel it MAY state an objection and answer it — that is the format — but every
concession the essay makes must survive the compression. A video cannot host an
`orthonote` box, so any clarifier candidate must be fixed in the WORDING.

Spec: see specs/explainer-kalam.json. Each scene = {kicker?, visual{type,…}, say[…]}.
Visual elements reveal on sentence cues: `"at": k` = when sentence k of that scene starts.
"""
import os, sys, re, json, math, random, hashlib, argparse, subprocess, tarfile, wave
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gen_reel as R  # brand fonts, themes, background, ffmpeg bootstrap
from PIL import Image, ImageDraw

np = R._ensure("numpy")
FF = R.FF
ROOT = os.path.dirname(os.path.dirname(HERE))
TTS_DIR = os.environ.get("EXPLAINER_TTS_DIR", os.path.join(HERE, ".tts"))
SR = 24000

# ---------------------------------------------------------------- TTS bootstrap
MODEL_SHA256 = "fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478"
NPM_MODEL, NPM_VOICES = "kokoro-q8-shards@1.0.0", "kokoro-js@1.2.1"

def _npm_extract(spec, dest):
    os.makedirs(dest, exist_ok=True)
    tgz = subprocess.run(["npm", "pack", spec, "--silent"], cwd=dest, capture_output=True,
                         text=True, check=True).stdout.strip().splitlines()[-1]
    with tarfile.open(os.path.join(dest, tgz)) as t:
        t.extractall(os.path.join(dest, spec.split("@")[0]), filter="data")
    os.remove(os.path.join(dest, tgz))
    return os.path.join(dest, spec.split("@")[0], "package")

def ensure_tts():
    model, voices = os.path.join(TTS_DIR, "kokoro-q8.onnx"), os.path.join(TTS_DIR, "voices.npz")
    if not os.path.exists(model):
        pkg = _npm_extract(NPM_MODEL, TTS_DIR)
        parts = sorted(p for p in os.listdir(pkg) if p.endswith(".bin"))
        h = hashlib.sha256()
        with open(model + ".part", "wb") as out:
            for p in parts:
                b = open(os.path.join(pkg, p), "rb").read(); h.update(b); out.write(b)
        if h.hexdigest() != MODEL_SHA256:
            os.remove(model + ".part"); sys.exit("Kokoro model sha256 mismatch — refusing to use it.")
        os.rename(model + ".part", model)
    if not os.path.exists(voices):
        pkg = _npm_extract(NPM_VOICES, TTS_DIR)
        vd = os.path.join(pkg, "voices"); packs = {}
        for f in os.listdir(vd):
            if f[:1] in "ab" and f.endswith(".bin"):
                packs[f[:-4]] = np.fromfile(os.path.join(vd, f), dtype=np.float32).reshape(-1, 1, 256)
        np.savez(voices, **packs)
    R._ensure("kokoro-onnx", "kokoro_onnx")
    from kokoro_onnx import Kokoro
    return Kokoro(model, voices)

def speakable(text, lexicon):
    t = text
    for k in sorted(lexicon, key=len, reverse=True):
        t = t.replace(k, lexicon[k])
    return t.replace("—", ", ").replace("–", "-").replace("“", '"').replace("”", '"')

def synth_all(spec, voice, speed):
    """Synthesize every sentence (cached by content hash). Returns {text: np.float32 array}."""
    lex = spec.get("lexicon", {}); cache = os.path.join(TTS_DIR, "cache"); os.makedirs(cache, exist_ok=True)
    out, todo = {}, []
    for sc in spec["scenes"]:
        for s in sc["say"]:
            key = hashlib.sha1(f"{voice}|{speed}|{speakable(s, lex)}".encode()).hexdigest()
            p = os.path.join(cache, key + ".npy")
            if os.path.exists(p): out[s] = np.load(p)
            else: todo.append((s, p))
    if todo:
        k = ensure_tts(); lang = "en-gb" if voice.startswith("b") else "en-us"
        for i, (s, p) in enumerate(todo):
            a, sr = k.create(speakable(s, lex), voice=voice, speed=speed, lang=lang)
            assert sr == SR, sr
            a = a.astype(np.float32); np.save(p, a); out[s] = a
            print(f"  tts {i+1}/{len(todo)}  {len(a)/SR:5.1f}s  {s[:60]}")
    return out

# ---------------------------------------------------------------- timing
LEAD, GAP, TAIL, SILENT_SCENE = 0.7, 0.45, 1.1, 3.6

def build_timeline(spec, audio):
    """Scene start/end + per-sentence cue times (absolute seconds)."""
    t, scenes = 0.0, []
    for sc in spec["scenes"]:
        start, cues = t, []
        if not sc["say"]:
            t += float(sc.get("dur", SILENT_SCENE))
        else:
            t += LEAD
            for s in sc["say"]:
                d = len(audio[s]) / SR; cues.append((t, t + d, s)); t += d + GAP
            t += TAIL - GAP
        scenes.append(dict(start=start, end=t, cues=cues))
    return scenes, t

def mix_audio(scenes, audio, total, path):
    buf = np.zeros(int(math.ceil(total * SR)) + SR, dtype=np.float32)
    for sc in scenes:
        for a0, _, s in sc["cues"]:
            i = int(a0 * SR); buf[i:i + len(audio[s])] += audio[s]
    peak = float(np.max(np.abs(buf))) or 1.0
    pcm = (np.clip(buf / peak * 0.89, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

# ---------------------------------------------------------------- drawing helpers
def ease(x):
    x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)

class Ctx:
    def __init__(self, W, H, th, t, cues, dur):
        self.W, self.H, self.th, self.t, self.cues, self.dur = W, H, th, t, cues, dur
    def cue(self, k):
        if not self.cues: return 0.0
        return self.cues[min(k, len(self.cues) - 1)][0] if k >= 0 else 0.0
    def p(self, k, d=0.7, delay=0.0):
        """0→1 progress of an element revealed at sentence k."""
        return ease((self.t - self.cue(k) - delay) / d)

def layer(W, H): return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def comp(base, lay, a):
    if a <= 0: return
    if a < 1: lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
    base.alpha_composite(lay)

def text_c(d, cx, y, text, font, fill, shadow=(0, 0, 0, 160)):
    w = d.textlength(text, font=font); x = cx - w / 2
    d.text((x + 2, y + 2), text, font=font, fill=shadow); d.text((x, y), text, font=font, fill=fill)
    return w

def rgba(c, a=255): return (c[0], c[1], c[2], a)

def wrapped_c(d, cx, y, text, font, fill, max_w, lh=None):
    lines = R.wrap(d, text, font, max_w); asc, desc = font.getmetrics(); lh = lh or (asc + desc + 10)
    for i, ln in enumerate(lines): text_c(d, cx, y + i * lh, ln, font, fill)
    return len(lines) * lh

def draw_fade(base, ctx, a, fn):
    lay = layer(ctx.W, ctx.H); fn(ImageDraw.Draw(lay)); comp(base, lay, a)

def rrect(d, box, fill=None, outline=None, width=3, r=22):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

GOLD = lambda th, a=255: rgba(th["gold"], a)
CREAM = lambda th, a=255: rgba(th["cream"], a)
DIM = lambda th, a=255: rgba(th["dim"], a)
RED = (196, 92, 78, 255)
PANEL = (255, 255, 255, 14)

def verdict(base, ctx, text, k, y=None):
    a = ctx.p(k)
    if a <= 0: return
    th = ctx.th; y = y if y is not None else 760
    def f(d):
        font = R.F("serifb", 44); lines = R.wrap(d, text, font, 1400); lh = 58
        w = max(d.textlength(l, font=font) for l in lines)
        rrect(d, [ctx.W / 2 - w / 2 - 40, y - 18, ctx.W / 2 + w / 2 + 40, y + lh * len(lines) + 12],
              fill=(10, 20, 36, 225), outline=GOLD(th), width=2, r=16)
        for i, l in enumerate(lines): text_c(d, ctx.W / 2, y + i * lh, l, font, GOLD(th))
    draw_fade(base, ctx, a, f)

# ---------------------------------------------------------------- scene visuals
def v_title(base, ctx, v):
    th = ctx.th
    for i, ln in enumerate(v["big"]):
        a = ease((ctx.t - 0.3 - i * 0.5) / 0.8)
        draw_fade(base, ctx, a, lambda d, i=i, ln=ln: text_c(d, ctx.W / 2, 330 + i * 150 - 20 * (1 - a) , ln,
                                                           R.F("serifb", 130), GOLD(th) if i else CREAM(th)))
    a = ease((ctx.t - 1.6) / 0.8)
    def f(d):
        d.line([(ctx.W / 2 - 90, 650), (ctx.W / 2 + 90, 650)], fill=GOLD(th), width=3)
        text_c(d, ctx.W / 2, 685, v.get("sub", ""), R.F("serif", 50), DIM(th))
    draw_fade(base, ctx, a, f)

v_end = v_title

def v_fork(base, ctx, v):
    th = ctx.th; W = ctx.W
    for side, (lab, sub, delay) in enumerate([(v["left"], v["left_sub"], 0.4), (v["right"], v["right_sub"], 3.2)]):
        a = ctx.p(0, 0.9, delay)
        def f(d, side=side, lab=lab, sub=sub):
            cx = W * (0.29 if side == 0 else 0.71); x0, x1 = cx - 380, cx + 380
            rrect(d, [x0, 200, x1, 620], fill=PANEL, outline=DIM(th, 90), width=2)
            if side == 0:  # an endless line of moments fading into the past
                for i in range(18):
                    x = x1 - 70 - i * 36; al = int(255 * max(0, 1 - i / 18))
                    d.ellipse([x - 7, 330 - 7, x + 7, 330 + 7], fill=CREAM(th, al))
                text_c(d, x0 + 60, 300, "…", R.F("serif", 60), DIM(th))
            else:  # a first moment, with rays
                cxx, cy = cx, 330
                for k in range(16):
                    ang = k * math.pi / 8; r0, r1 = 26, 70 + 10 * math.sin(ctx.t * 2 + k)
                    d.line([(cxx + r0 * math.cos(ang), cy + r0 * math.sin(ang)),
                            (cxx + r1 * math.cos(ang), cy + r1 * math.sin(ang))], fill=GOLD(th, 170), width=3)
                d.ellipse([cxx - 16, cy - 16, cxx + 16, cy + 16], fill=GOLD(th))
            text_c(d, cx, 440, lab, R.F("serifb", 56), CREAM(th))
            wrapped_c(d, cx, 520, sub, R.F("serif", 34), DIM(th), 680)
        draw_fade(base, ctx, a, f)
    a = ctx.p(1, 0.8)
    draw_fade(base, ctx, a, lambda d: text_c(d, W / 2, 380, "or", R.F("serif", 44), DIM(th)))
    qa = ctx.p(v.get("question_at", 2), 0.9, 2.5)
    draw_fade(base, ctx, qa, lambda d: text_c(d, W / 2, 680, "What brought it into being?", R.F("serifb", 58), GOLD(th)))

def _seg_text(d, x, y, text, font, fill, hl, hl_fill):
    if hl and hl in text:
        pre, post = text.split(hl, 1)
        for part, col in [(pre, fill), (hl, hl_fill), (post, fill)]:
            d.text((x, y), part, font=font, fill=col); x += d.textlength(part, font=font)
    else:
        d.text((x, y), text, font=font, fill=fill)

def v_syllogism(base, ctx, v):
    th = ctx.th; W = ctx.W; x0, x1 = 260, W - 260
    for i, it in enumerate(v["items"]):
        a = ctx.p(it["at"], 0.8)
        dx = 60 * (1 - a)
        def f(d, i=i, it=it, dx=dx):
            y = 200 + i * 170
            rrect(d, [x0 + dx, y, x1 + dx, y + 140], fill=(255, 255, 255, 18),
                  outline=GOLD(th) if it.get("gold") else DIM(th, 110), width=3 if it.get("gold") else 2)
            d.text((x0 + 44 + dx, y + 20), it["label"], font=R.F("sans", 26), fill=GOLD(th))
            _seg_text(d, x0 + 44 + dx, y + 62, it["text"], R.F("serifb" if it.get("gold") else "serif", 46),
                      GOLD(th) if it.get("gold") else CREAM(th), it.get("highlight"), GOLD(th))
        draw_fade(base, ctx, a, f)
    s = v.get("strike")
    if s:
        a = ctx.p(s["at"], 0.6); lw = ctx.p(s["at"], 0.6, 0.2)
        def f(d):
            font = R.F("serif", 46); w = d.textlength(s["text"], font=font); y = 725
            text_c(d, W / 2, y, s["text"], font, DIM(th))
            d.line([(W / 2 - w / 2 - 10, y + 30), (W / 2 - w / 2 - 10 + (w + 20) * lw, y + 30)], fill=RED, width=5)
        draw_fade(base, ctx, a, f)

_PARTS = [(random.Random(i).random(), random.Random(i * 7 + 3).random(), random.Random(i * 13 + 1).random() * 6.28)
          for i in range(140)]

def v_vacuum(base, ctx, v):
    th = ctx.th; W = ctx.W; k = v.get("split_at", 2)
    split = ctx.p(k, 1.0) if ctx.cues else 0
    a1 = ease(ctx.t / 0.8) * (1 - split)
    def m(d):
        text_c(d, W / 2, 300, v["motto"], R.F("serifb", 110), GOLD(th))
        text_c(d, W / 2, 470, v["motto_sub"], R.F("serif", 52), DIM(th))
    draw_fade(base, ctx, a1, m)
    if split <= 0: return
    def f(d):
        for side in (0, 1):
            cx = W * (0.29 if side == 0 else 0.71); bx = [cx - 380, 200, cx + 380, 600]
            if side == 0:
                rrect(d, bx, fill=(30, 52, 92, 120), outline=DIM(th, 110), width=2)
                for (px, py, ph) in _PARTS:
                    x = bx[0] + 20 + px * 720; y = bx[1] + 20 + py * 360
                    al = int(255 * max(0, math.sin(ctx.t * 2.4 + ph)) ** 3)
                    if al > 8: d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=CREAM(th, al))
            else:
                rrect(d, bx, fill=(0, 0, 0, 255), outline=DIM(th, 60), width=1)
            text_c(d, cx, 630, v["left"] if side == 0 else v["right"], R.F("serifb", 50),
                   CREAM(th) if side == 0 else GOLD(th))
            text_c(d, cx, 700, v["left_sub"] if side == 0 else v["right_sub"], R.F("serif", 32), DIM(th))
    draw_fade(base, ctx, split, f)

def v_hotel(base, ctx, v):
    th = ctx.th; W = ctx.W; n = v.get("rooms", 9); rw, gap = 130, 26
    total = n * rw + (n - 1) * gap; x0 = (W - total) / 2 - 60; y0 = 300
    a = ctx.p(2, 0.9)
    shift = ctx.p(v.get("shift_at", 3), 2.4, 3.0)       # guests move one room right
    drop = ctx.p(v.get("shift_at", 3), 1.0, 6.0)        # new guest takes room 1
    def f(d):
        text_c(d, W / 2, 200, "Hilbert's Hotel", R.F("sans", 34), GOLD(th))
        for i in range(n):
            x = x0 + i * (rw + gap)
            rrect(d, [x, y0, x + rw, y0 + 240], fill=(255, 255, 255, 16), outline=DIM(th, 120), width=2, r=10)
            text_c(d, x + rw / 2, y0 + 250, str(i + 1), R.F("sans", 26), DIM(th))
        text_c(d, x0 + total + 90, y0 + 90, "… ∞", R.F("serifb", 56), DIM(th))
        for i in range(n):
            gx = x0 + (i + shift) * (rw + gap) + rw / 2
            if gx > x0 + total: continue
            d.ellipse([gx - 22, y0 + 80, gx + 22, y0 + 124], fill=CREAM(th))
            d.rounded_rectangle([gx - 30, y0 + 132, gx + 30, y0 + 200], radius=18, fill=CREAM(th))
        if drop > 0:
            gx = x0 + rw / 2; yy = y0 - 120 * (1 - drop)
            d.ellipse([gx - 22, yy + 80, gx + 22, yy + 124], fill=GOLD(th, int(255 * drop)))
            d.rounded_rectangle([gx - 30, yy + 132, gx + 30, yy + 200], radius=18, fill=GOLD(th, int(255 * drop)))
    draw_fade(base, ctx, a, f)
    if a <= 0:  # opening sentences: the two lines of defence
        a0 = ease(ctx.t / 0.8) * (1 - ctx.p(2, 0.6))
        def g(d):
            text_c(d, W / 2, 300, "Premise 2 · The universe began to exist.", R.F("serifb", 58), CREAM(th))
            a1 = ctx.p(1, 0.7)
            if a1 > 0:
                for j, lab in enumerate(["Philosophical", "Scientific"]):
                    cx = W / 2 + (-260 if j == 0 else 260)
                    rrect(d, [cx - 210, 470, cx + 210, 570], fill=PANEL, outline=GOLD(th, int(200 * a1)), width=2)
                    text_c(d, cx, 492, lab, R.F("serif", 46), GOLD(th, int(255 * a1)))
        draw_fade(base, ctx, a0, g)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 4), y=680)

def v_succession(base, ctx, v):
    th = ctx.th; W = ctx.W; y = 420; xr = W - 300
    a = ease(ctx.t / 0.8)
    def f(d):
        d.line([(160, y), (xr, y)], fill=DIM(th, 140), width=3)
        d.line([(xr, y - 50), (xr, y + 50)], fill=GOLD(th), width=5)
        text_c(d, xr, y - 110, v.get("now", "TODAY"), R.F("sans", 34), GOLD(th))
        text_c(d, 170, y - 30, "∞ ?", R.F("serifb", 52), DIM(th))
        # events added one at a time, marching toward today
        step, speed = 44, 1.6
        off = (ctx.t * speed * step) % step
        for i in range(40):
            x = xr - 30 - i * step + off
            if x < 260: break
            al = int(255 * max(0.15, 1 - i / 30))
            d.ellipse([x - 9, y - 9, x + 9, y + 9], fill=CREAM(th, al))
        n_added = int(ctx.t * speed)
        d.text((260, y + 90), "Moments added so far:", font=R.F("sans", 30), fill=DIM(th))
        d.text((690, y + 84), f"{n_added:,}", font=R.F("serifb", 40), fill=CREAM(th))
        d.text((260, y + 150), "Still to add before an infinite collection is complete:", font=R.F("sans", 30), fill=DIM(th))
        d.text((1140, y + 140), "∞", font=R.F("serifb", 52), fill=GOLD(th))
        text_c(d, W / 2, 210, "Built up one event at a time", R.F("serif", 46), CREAM(th))
    draw_fade(base, ctx, a, f)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 3), y=770)

_STARS = [(random.Random(i + 900).random(), random.Random(i + 1900).random() * 2 - 1,
           random.Random(i + 2900).random()) for i in range(220)]

def v_timeline(base, ctx, v):
    th = ctx.th; W = ctx.W; xl, xr, cy = 250, W - 250, 440
    grow = ease((ctx.t - 0.3) / 3.0)
    def half(x):  # cone half-height at x
        u = (x - xl) / (xr - xl); return 12 + 190 * (u ** 0.7)
    def f(d):
        xe = xl + (xr - xl) * grow
        pts_top = [(x, cy - half(x)) for x in range(int(xl), int(xe) + 1, 12)]
        pts_bot = [(x, cy + half(x)) for x in range(int(xe), int(xl) - 1, -12)]
        if len(pts_top) > 1:
            d.polygon(pts_top + pts_bot, fill=(40, 64, 110, 150), outline=GOLD(th, 150))
            for (u, vv, b) in _STARS:
                x = xl + u * (xe - xl); yy = cy + vv * half(x) * 0.9
                d.ellipse([x - 2, yy - 2, x + 2, yy + 2], fill=CREAM(th, int(90 + 140 * b)))
        d.ellipse([xl - 10, cy - 10, xl + 10, cy + 10], fill=GOLD(th))
        text_c(d, xl, cy + 240, "past boundary", R.F("sans", 28), GOLD(th))
        if grow > 0.95:
            text_c(d, xr, cy + 240, "today", R.F("sans", 28), CREAM(th))
            d.line([(xl + 20, cy + 300), (xr - 20, cy + 300)], fill=DIM(th, 160), width=2)
            text_c(d, (xl + xr) / 2, cy + 275, v["age"], R.F("serif", 34), DIM(th))
        # scan marker tracing the expansion back
        sm = ctx.p(1, 4.0, 0.5)
        if 0 < sm < 1:
            x = xr - (xr - xl) * sm; d.line([(x, cy - half(x) - 20), (x, cy + half(x) + 20)], fill=GOLD(th), width=3)
    draw_fade(base, ctx, ease(ctx.t / 0.6), f)
    b = ctx.p(v.get("bgv_at", 2), 0.8)
    def g(d):
        rrect(d, [W / 2 - 520, 130, W / 2 + 520, 230], fill=(10, 20, 36, 220), outline=GOLD(th), width=2, r=14)
        text_c(d, W / 2, 140, v["bgv"], R.F("serifb", 40), GOLD(th))
        text_c(d, W / 2, 190, v["bgv_sub"], R.F("serif", 28), CREAM(th))
    draw_fade(base, ctx, b * (1 - ctx.p(v.get("verdict_at", 5), 0.6)), g)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 5), y=140)

def v_attributes(base, ctx, v):
    th = ctx.th; W = ctx.W
    draw_fade(base, ctx, ease(ctx.t / 0.8),
              lambda d: text_c(d, W / 2, 190, "The cause of the universe is…", R.F("serif", 50), CREAM(th)))
    cols, tw, th_, gx, gy = 3, 440, 120, 50, 70
    x0 = (W - (cols * tw + (cols - 1) * gx)) / 2
    for i, it in enumerate(v["items"]):
        a = ctx.p(it["at"], 0.7, 0.5 * (i % 3) if it["at"] == 2 else 0)
        def f(d, i=i, it=it):
            r, c = divmod(i, cols); x = x0 + c * (tw + gx); y = 320 + r * (th_ + gy)
            rrect(d, [x, y, x + tw, y + th_], fill=(255, 255, 255, 18), outline=GOLD(th, 200), width=2, r=60)
            text_c(d, x + tw / 2, y + 32, it["t"], R.F("serifb", 44), CREAM(th))
            if it.get("tag"): text_c(d, x + tw / 2, y + th_ + 14, it["tag"], R.F("serif", 30), GOLD(th))
        draw_fade(base, ctx, a, f)
    if v.get("footnote"):
        draw_fade(base, ctx, ctx.p(v.get("footnote_at", 0), 0.8),
                  lambda d: text_c(d, W / 2, 720, v["footnote"], R.F("serifb", 44), GOLD(th)))

def v_contrast(base, ctx, v):
    th = ctx.th; W = ctx.W
    a = ease(ctx.t / 0.8); lw = 1.0
    def f(d):
        font = R.F("serif", 60); w = d.textlength(v["wrong"], font=font); y = 300
        text_c(d, W / 2, y, v["wrong"], font, DIM(th))
        d.line([(W / 2 - w / 2 - 12, y + 38), (W / 2 + w / 2 + 12, y + 38)], fill=RED, width=6)
    draw_fade(base, ctx, a, f)
    draw_fade(base, ctx, ctx.p(v.get("right_at", 2), 0.9),
              lambda d: text_c(d, W / 2, 480, v["right"], R.F("serifb", 66), GOLD(th)))
    draw_fade(base, ctx, ctx.p(3, 0.9),
              lambda d: text_c(d, W / 2, 640, "God did not begin to exist.", R.F("serif", 50), CREAM(th)))

def v_strands(base, ctx, v):
    th = ctx.th; W = ctx.W; cx, cy, R0 = W / 2, 470, 300
    items = v["items"]; n = len(items)
    def c(d):
        d.ellipse([cx - 150, cy - 70, cx + 150, cy + 70], fill=(10, 20, 36, 230), outline=GOLD(th), width=3)
        wrapped_c(d, cx, cy - 44, v["center"], R.F("serifb", 38), GOLD(th), 260, lh=46)
    for i, it in enumerate(items):
        ang = -math.pi / 2 + i * 2 * math.pi / n; x = cx + R0 * 1.55 * math.cos(ang); y = cy + R0 * 0.95 * math.sin(ang)
        a = ctx.p(it["at"], 0.8, 0.35 * i if it["at"] else 0.3)
        def f(d, it=it, x=x, y=y):
            d.line([(cx, cy), (x, y)], fill=GOLD(th, 120), width=2)
            font = R.F("serifb" if it.get("gold") else "serif", 44); w = d.textlength(it["t"], font=font)
            rrect(d, [x - w / 2 - 34, y - 40, x + w / 2 + 34, y + 44], fill=(20, 34, 60, 240),
                  outline=GOLD(th) if it.get("gold") else DIM(th, 140), width=2, r=40)
            d.text((x - w / 2, y - 28), it["t"], font=font, fill=GOLD(th) if it.get("gold") else CREAM(th))
        draw_fade(base, ctx, a, f)
    draw_fade(base, ctx, ctx.p(v.get("dest_at", 2), 0.8), c)
    if v.get("dest"):
        draw_fade(base, ctx, ctx.p(v.get("dest_at", 2), 0.8, 1.5),
                  lambda d: text_c(d, cx, cy + 90, v["dest"], R.F("serif", 36), CREAM(th)))

def v_objection(base, ctx, v):
    th = ctx.th; W = ctx.W
    def f(d):
        text_c(d, W / 2, 210, v["who"], R.F("serifb", 64), CREAM(th))
        a1 = ctx.p(1, 0.8)
        if a1 > 0:  # causal intuitions are formed INSIDE time and space…
            for i in range(7):
                x = W / 2 - 330 + i * 110
                d.ellipse([x - 10, 400 - 10, x + 10, 400 + 10], fill=CREAM(th, int(255 * a1)))
                if i < 6: d.line([(x + 14, 400), (x + 96, 400)], fill=GOLD(th, int(200 * a1)), width=3)
            text_c(d, W / 2, 440, "events within time and space", R.F("serif", 34), DIM(th, int(255 * a1)))
    draw_fade(base, ctx, ease(ctx.t / 0.8), f)
    draw_fade(base, ctx, ctx.p(v.get("q_at", 3), 0.8),
              lambda d: text_c(d, W / 2, 560, v["q"], R.F("serifb", 58), GOLD(th)))
    draw_fade(base, ctx, ctx.p(v.get("burden_at", 4), 0.8),
              lambda d: wrapped_c(d, W / 2, 680, v["burden"], R.F("serif", 40), CREAM(th), 1300))

def v_close(base, ctx, v):
    th = ctx.th; W = ctx.W
    k = v.get("close_at", 1); gone = 1 - ctx.p(k, 0.6)
    draw_fade(base, ctx, ease(ctx.t / 0.8) * gone, lambda d: text_c(d, W / 2, 280, "A serious, defensible case",
                                                                    R.F("serifb", 68), GOLD(th)))
    draw_fade(base, ctx, ctx.p(1, 0.8) * gone, lambda d: text_c(d, W / 2, 420, "The best critics remain in the field.",
                                                                R.F("serif", 52), CREAM(th)))
    a1 = ctx.p(k, 0.9)
    def f(d):
        text_c(d, W / 2, 260, "Not the whole house —", R.F("serif", 62), CREAM(th))
        text_c(d, W / 2, 350, "a load-bearing wall.", R.F("serifb", 72), GOLD(th))
        d.line([(W / 2 - 90, 490), (W / 2 + 90, 490)], fill=GOLD(th), width=3)
        text_c(d, W / 2, 520, "“with gentleness and respect”", R.F("serif", 44), DIM(th))
        text_c(d, W / 2, 585, v.get("ref", ""), R.F("sans", 30), GOLD(th))
    draw_fade(base, ctx, a1, f)

VISUALS = dict(title=v_title, end=v_end, fork=v_fork, syllogism=v_syllogism, vacuum=v_vacuum, hotel=v_hotel,
               succession=v_succession, timeline=v_timeline, attributes=v_attributes, contrast=v_contrast,
               strands=v_strands, objection=v_objection, close=v_close)

# ---------------------------------------------------------------- captions
def caption_chunks(cues, d, font, max_w):
    """Split each sentence into ≤2-line chunks, timed in proportion to word count."""
    out = []
    for a0, a1, s in cues:
        lines = R.wrap(d, s, font, max_w); groups = [lines[i:i + 2] for i in range(0, len(lines), 2)]
        words = [sum(len(l.split()) for l in g) for g in groups]; tot = sum(words); t = a0
        for g, wc in zip(groups, words):
            dt = (a1 - a0) * wc / tot; out.append((t, t + dt, g)); t += dt
    return out

def _ts(sec, sep):
    ms = int(round(max(0, sec) * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"

def write_subs(chunks, base):
    with open(base + ".srt", "w") as f:
        for i, (a, b, g) in enumerate(chunks, 1): f.write(f"{i}\n{_ts(a, ',')} --> {_ts(b, ',')}\n" + "\n".join(g) + "\n\n")
    with open(base + ".vtt", "w") as f:
        f.write("WEBVTT\n\n")
        for a, b, g in chunks: f.write(f"{_ts(a, '.')} --> {_ts(b, '.')}\n" + "\n".join(g) + "\n\n")

# ---------------------------------------------------------------- frame compositor
CAP_FONT = 38

def chrome(img, ctx, sc_spec, gt, total, caps, burn):
    d = ImageDraw.Draw(img); th = ctx.th; W, H = ctx.W, ctx.H
    k = sc_spec.get("kicker")
    if k:
        a = ease(ctx.t / 0.6) * (1 - ease((ctx.t - (ctx.dur - 0.5)) / 0.5))
        lay = layer(W, H); ld = ImageDraw.Draw(lay)
        f, spaced, w = R.measure_kicker(ld, W, k); ld.text(((W - w) // 2, 70), spaced, font=f, fill=GOLD(th))
        ld.line([(W // 2 - 70, 130), (W // 2 + 70, 130)], fill=GOLD(th), width=3); comp(img, lay, a)
    if burn:
        for a0, a1, g in caps:
            if a0 <= gt < a1:
                font = R.F("sans", CAP_FONT); lh = CAP_FONT + 14; y = H - 60 - lh * len(g) - 40
                lay = layer(W, H); ld = ImageDraw.Draw(lay)
                wmax = max(ld.textlength(l, font=font) for l in g)
                ld.rounded_rectangle([W / 2 - wmax / 2 - 28, y - 16, W / 2 + wmax / 2 + 28, y + lh * len(g) + 8],
                                     radius=12, fill=(0, 0, 0, 150))
                for i, l in enumerate(g): text_c(ld, W / 2, y + i * lh, l, font, (255, 255, 255, 255), (0, 0, 0, 0))
                img.alpha_composite(lay); break
    d.text((W - 360, H - 50), "A P O L O G I A   D A I L Y", font=R.F("sans", 20), fill=GOLD(th, 170))
    d.rectangle([0, H - 6, W * gt / total, H], fill=GOLD(th, 200))

def render_scene(job):
    (i, spec, sc, tl, total, caps, W, H, fps, burn, out, still_at) = job
    th = R.THEMES[spec.get("theme", "navy")]
    bg = R.gradient_bg(W, H, th).convert("RGBA")
    dur = tl["end"] - tl["start"]; rel = [(a - tl["start"], b - tl["start"], s) for a, b, s in tl["cues"]]
    fn = VISUALS[sc["visual"]["type"]]
    def frame(t):
        img = bg.copy(); ctx = Ctx(W, H, th, t, rel, dur)
        lay = layer(W, H); fn(lay, ctx, sc["visual"])
        fade = ease(t / 0.45) * (1 - ease((t - (dur - 0.45)) / 0.45))
        comp(img, lay, fade); chrome(img, ctx, sc, tl["start"] + t, total, caps, burn)
        return img.convert("RGB")
    if still_at is not None:
        frame(min(dur - 0.5, still_at(rel, dur))).save(out); return out
    n = int(round(dur * fps))
    p = subprocess.Popen([FF, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(fps), "-i", "-", "-frames:v", str(n), "-c:v", "libx264", "-preset", "medium",
                          "-crf", "20", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for f in range(n): p.stdin.write(frame(f / fps).tobytes())
    p.stdin.close(); p.wait()
    if p.returncode: raise RuntimeError(f"scene {i} encode failed")
    print(f"  scene {i:02d} done ({dur:.1f}s)", flush=True); return out

# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec"); ap.add_argument("--out"); ap.add_argument("--voice"); ap.add_argument("--speed", type=float)
    ap.add_argument("--fps", type=int); ap.add_argument("--jobs", type=int, default=os.cpu_count() or 2)
    ap.add_argument("--no-burn-captions", action="store_true"); ap.add_argument("--preview", action="store_true")
    a = ap.parse_args()
    spec = json.load(open(a.spec)); assert spec.get("format") == "explainer", "not an explainer spec"
    W, H = R.ASPECTS[spec.get("aspect", "wide")]; fps = a.fps or int(spec.get("fps", 30))
    voice = a.voice or spec.get("voice", "am_michael"); speed = a.speed or float(spec.get("speed", 1.0))
    name = os.path.splitext(os.path.basename(a.spec))[0]
    outdir = os.path.join(HERE, "output"); os.makedirs(outdir, exist_ok=True)
    out = a.out or os.path.join(outdir, f"{name}-{voice}.mp4"); base = os.path.splitext(out)[0]
    work = os.path.join(HERE, f".build_{name}"); os.makedirs(work, exist_ok=True)
    print(f"narration ({voice}, speed {speed})…")
    audio = synth_all(spec, voice, speed)
    tl, total = build_timeline(spec, audio)
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    caps = []
    for t in tl: caps += caption_chunks(t["cues"], probe, R.F("sans", CAP_FONT), W - 360)
    write_subs(caps, base)
    print(f"runtime {int(total // 60)}:{int(total % 60):02d} · {len(spec['scenes'])} scenes · {len(caps)} captions")
    burn = not a.no_burn_captions
    if a.preview:
        still = lambda rel, dur: (rel[-1][0] + 1.5) if rel else dur * 0.6
        jobs = [(i, spec, sc, tl[i], total, caps, W, H, fps, burn, os.path.join(work, f"still_{i:02d}.png"), still)
                for i, sc in enumerate(spec["scenes"])]
        with Pool(a.jobs) as p: print("\n".join(p.map(render_scene, jobs))); return
    wav = os.path.join(work, "narration.wav"); mix_audio(tl, audio, total, wav)
    jobs = [(i, spec, sc, tl[i], total, caps, W, H, fps, burn, os.path.join(work, f"scene_{i:02d}.mp4"), None)
            for i, sc in enumerate(spec["scenes"])]
    with Pool(a.jobs) as p: parts = p.map(render_scene, jobs)
    lst = os.path.join(work, "parts.txt")
    open(lst, "w").write("".join(f"file '{x}'\n" for x in parts))
    r = subprocess.run([FF, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-i", wav,
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out])
    if r.returncode: sys.exit("final mux failed")
    print(f"✓ {out}\n✓ {base}.srt / .vtt")

if __name__ == "__main__":
    main()
