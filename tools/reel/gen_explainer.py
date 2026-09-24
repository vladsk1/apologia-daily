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

def stretch(a, tempo):
    if abs(tempo - 1.0) < 1e-3: return a
    r = subprocess.run([FF, "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                        "-filter:a", f"atempo={tempo}", "-f", "f32le", "-"], input=a.tobytes(), capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).copy()

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
LEAD, GAP, TAIL, SILENT_SCENE = 0.6, 0.38, 1.0, 3.4

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

def verdict(base, ctx, text, k, y=None, max_w=1400):
    a = ctx.p(k)
    if a <= 0: return
    th = ctx.th; y = y if y is not None else 760
    def f(d):
        font = R.F("serifb", 44); lines = R.wrap(d, text, font, max_w); lh = 58
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
            cx = W * (0.27 if side == 0 else 0.73); x0, x1 = cx - 350, cx + 350
            rrect(d, [x0, 200, x1, 640], fill=PANEL, outline=DIM(th, 90), width=2)
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
            wrapped_c(d, cx, 520, sub, R.F("serif", 34), DIM(th), 640)
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
        lab = "Still to add before an infinite collection is complete:"; fl = R.F("sans", 30)
        d.text((260, y + 150), lab, font=fl, fill=DIM(th))
        d.text((260 + d.textlength(lab, font=fl) + 20, y + 132), "∞", font=R.F("serifb", 52), fill=GOLD(th))
        text_c(d, W / 2, 210, "Built up one event at a time", R.F("serif", 46), CREAM(th))
    draw_fade(base, ctx, a, f)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 3), y=770)

_STARS = [(random.Random(i + 900).random(), random.Random(i + 1900).random() * 2 - 1,
           random.Random(i + 2900).random()) for i in range(220)]

def v_timeline(base, ctx, v):
    th = ctx.th; W = ctx.W; xl, xr, cy = 250, W - 250, 510
    grow = ease((ctx.t - 0.3) / 3.0)
    def half(x):  # cone half-height at x
        u = (x - xl) / (xr - xl); return 10 + 150 * (u ** 0.7)
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
        text_c(d, xl, cy + 185, "past boundary", R.F("sans", 28), GOLD(th))
        if grow > 0.95:
            text_c(d, xr, cy + 185, "today", R.F("sans", 28), CREAM(th))
            d.line([(xl + 140, cy + 205), (xr - 90, cy + 205)], fill=DIM(th, 160), width=2)
            text_c(d, (xl + xr) / 2, cy + 225, v["age"], R.F("serif", 34), DIM(th))
        # scan marker tracing the expansion back
        sm = ctx.p(1, 4.0, 0.5)
        if 0 < sm < 1:
            x = xr - (xr - xl) * sm; d.line([(x, cy - half(x) - 20), (x, cy + half(x) + 20)], fill=GOLD(th), width=3)
    draw_fade(base, ctx, ease(ctx.t / 0.6), f)
    b = ctx.p(v.get("bgv_at", 2), 0.8)
    def g(d):
        rrect(d, [W / 2 - 520, 165, W / 2 + 520, 265], fill=(10, 20, 36, 220), outline=GOLD(th), width=2, r=14)
        text_c(d, W / 2, 175, v["bgv"], R.F("serifb", 40), GOLD(th))
        text_c(d, W / 2, 225, v["bgv_sub"], R.F("serif", 28), CREAM(th))
    draw_fade(base, ctx, b * (1 - ctx.p(v.get("verdict_at", 5), 0.6)), g)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 5), y=175)

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
            fs = 44
            while d.textlength(it["t"], font=R.F("serifb", fs)) > tw - 60: fs -= 2
            text_c(d, x + tw / 2, y + 60 - fs * 0.62, it["t"], R.F("serifb", fs), CREAM(th))
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
    th = ctx.th; W = ctx.W; cx, cy, R0 = W / 2, 480, 300
    items = v["items"]; n = len(items)
    def c(d):
        d.ellipse([cx - 235, cy - 62, cx + 235, cy + 62], fill=(10, 20, 36, 240), outline=GOLD(th), width=3)
        text_c(d, cx, cy - 24, v["center"], R.F("serifb", 38), GOLD(th))
    for i, it in enumerate(items):
        ang = -math.pi / 2 + i * 2 * math.pi / n; x = cx + R0 * 1.55 * math.cos(ang); y = cy + R0 * 0.78 * math.sin(ang)
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
                  lambda d: text_c(d, cx + 330, cy + 70, v["dest"], R.F("serif", 34), CREAM(th)))

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


# ================================================================ MOTION PACK (fine-tuning+)
# Continuously-moving visuals: nothing on screen is ever fully still. Every element
# is a function of ctx.t, so dials sweep, bubbles rise, bullets fly, ropes twist.
def _rnd(i, k=0): return random.Random(i * 7919 + k * 104729).random()

def gauge(d, cx, cy, r, th, needle, win=(0.47, 0.53), lab=None, glow=0.0, arc_w=10):
    """Semicircular dial. needle/win in 0..1 across the arc (left→right)."""
    a0, a1 = math.pi, 2 * math.pi
    ang = lambda u: a0 + (a1 - a0) * u
    box = [cx - r, cy - r, cx + r, cy + r]
    d.arc(box, 180, 360, fill=(90, 40, 40, 200), width=arc_w)            # lethal range
    d.arc(box, 180 + 180 * win[0], 180 + 180 * win[1], fill=GOLD(th), width=arc_w + 4)  # the window
    for k in range(11):
        u = k / 10; x0 = cx + (r - 22) * math.cos(ang(u)); y0 = cy + (r - 22) * math.sin(ang(u))
        x1 = cx + (r - 8) * math.cos(ang(u)); y1 = cy + (r - 8) * math.sin(ang(u))
        d.line([(x0, y0), (x1, y1)], fill=DIM(th, 150), width=2)
    inside = win[0] <= needle <= win[1]
    col = GOLD(th) if inside else (220, 110, 96, 255)
    if glow > 0:
        for g in range(3):
            rr = 16 + g * 10; d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=GOLD(th, int(70 * glow / (g + 1))), width=3)
    nx = cx + (r - 30) * math.cos(ang(needle)); ny = cy + (r - 30) * math.sin(ang(needle))
    d.line([(cx, cy), (nx, ny)], fill=col, width=5)
    d.ellipse([cx - 11, cy - 11, cx + 11, cy + 11], fill=CREAM(th))
    if lab: text_c(d, cx, cy + 22, lab, R.F("sans", 24), DIM(th))
    return inside

def v_ft_title(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    def dials(d):
        for i in range(5):
            cx = W / 2 + (i - 2) * 330; cy = 860
            gauge(d, cx, cy, 110, th, 0.5 + 0.45 * math.sin(t * (0.9 + 0.23 * i) + i), arc_w=8)
    draw_fade(base, ctx, 0.55 * ease(t / 1.0), dials)
    v_title(base, ctx, v)

_DIAL_NAMES = ["Cosmological constant", "Gravity", "Electromagnetism", "Strong force", "Initial entropy", "Carbon resonance"]
def v_dials(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t; n = v.get("n", 6); cols = 3
    k = v.get("settle_at", 3)
    def f(d):
        for i in range(n):
            r_, c_ = divmod(i, cols); cx = W / 2 + (c_ - 1) * 520; cy = 380 + r_ * 330
            wild = 0.5 + 0.48 * math.sin(t * (1.3 + 0.37 * i) + i * 1.7) * math.cos(t * 0.41 + i)
            settle = ctx.p(k, 1.2, 0.55 * i)
            needle = wild * (1 - settle) + 0.5 * settle + 0.01 * math.sin(t * 6 + i) * settle
            gauge(d, cx, cy, 125, th, needle, glow=settle, lab=_DIAL_NAMES[i % 6])
    draw_fade(base, ctx, ease(t / 0.8), f)

def v_split(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t; H = ctx.H
    line = ease(t / 1.4)
    def f(d):
        d.line([(W / 2, 170), (W / 2, 170 + 560 * line)], fill=GOLD(th), width=4)
    draw_fade(base, ctx, 1.0, f)
    for side, key in ((0, "left"), (1, "right")):
        a = ctx.p(v[key + "_at"], 0.9); dx = (-1 if side == 0 else 1) * 120 * (1 - a)
        def g(d, side=side, key=key, dx=dx):
            cx = W * (0.27 if side == 0 else 0.73) + dx
            rrect(d, [cx - 380, 220, cx + 380, 640], fill=PANEL, outline=(GOLD(th, 150) if side else DIM(th, 110)), width=2)
            text_c(d, cx, 250, v[key], R.F("sans", 34), GOLD(th) if side else CREAM(th))
            if side == 0:   # a measurement: bars that keep re-measuring and land on the same value
                for b in range(9):
                    hgt = 120 + 20 * math.sin(t * 2 + b) * max(0, 1 - (t - ctx.cue(1)) / 4) + 30 * (b % 3)
                    x = cx - 250 + b * 60; d.rectangle([x, 470 - hgt, x + 34, 470], fill=CREAM(th, 170))
                d.line([(cx - 270, 470), (cx + 270, 470)], fill=DIM(th), width=2)
            else:           # an inference: a dotted arrow still being drawn, ending in a question
                prog = (t * 0.35) % 1.0
                for q in range(14):
                    if q / 14 > prog + 0.35: break
                    x = cx - 260 + q * 34; d.ellipse([x - 5, 395, x + 5, 405], fill=GOLD(th, 200))
                text_c(d, cx + 250, 350, "?", R.F("serifb", 96), GOLD(th))
            wrapped_c(d, cx, 520, v[key + "_sub"], R.F("serif", 34), CREAM(th) if side == 0 else GOLD(th), 680)
        draw_fade(base, ctx, a, g)

def v_window_dial(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    sweep = 0.5 + 0.46 * math.sin(t * 0.85)
    def f(d):
        inside = gauge(d, 640, 640, 330, th, sweep, win=(0.485, 0.515), arc_w=16)
        text_c(d, 640, 700, "a constant of nature", R.F("sans", 30), DIM(th))
        # the universe that value produces
        cx, cy, r = 1370, 440, 230
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(8, 14, 26, 255), outline=DIM(th, 120), width=2)
        if inside:
            for i in range(90):
                a = _rnd(i) * 6.283 + t * 0.15; rr = r * math.sqrt(_rnd(i, 1)) * 0.92
                x = cx + rr * math.cos(a); y = cy + rr * math.sin(a); s_ = 1 + 3 * _rnd(i, 2)
                d.ellipse([x - s_, y - s_, x + s_, y + s_], fill=CREAM(th, int(120 + 130 * _rnd(i, 3))))
            text_c(d, cx, cy + r + 24, "stars · carbon · chemistry", R.F("sans", 30), GOLD(th))
        else:
            text_c(d, cx, cy + r + 24, "no stars · no chemistry", R.F("sans", 30), (220, 110, 96, 255))
    draw_fade(base, ctx, ease(t / 0.8), f)

def v_cancel(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    g = ctx.p(v.get("gap_at", 1), 2.0)
    def f(d):
        base_y = 700
        d.line([(200, base_y), (860, base_y)], fill=DIM(th), width=2)
        hp = 430 * g; d.rectangle([300, base_y - hp, 440, base_y], fill=(220, 110, 96, 220))
        text_c(d, 370, base_y + 14, "predicted", R.F("sans", 28), DIM(th))
        d.rectangle([620, base_y - 4, 760, base_y], fill=GOLD(th)); text_c(d, 690, base_y + 14, "observed", R.F("sans", 28), DIM(th))
        if g > 0.9:
            d.line([(470, base_y - hp), (470, base_y)], fill=CREAM(th, 180), width=2)
            text_c(d, 560, base_y - hp / 2 - 40, "~10¹²⁰", R.F("serifb", 64), CREAM(th))
        text_c(d, 530, 150, "Λ — the energy of empty space", R.F("serif", 44), CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    wa = ctx.p(v.get("weinberg_at", 2), 0.8) * (1 - ctx.p(v.get("digits_at", 3), 0.6))
    draw_fade(base, ctx, wa, lambda d: wrapped_c(d, 1390, 330, "Weinberg, 1987: Λ must be vanishingly small — or no galaxies",
                                                  R.F("serif", 40), GOLD(th), 760))
    da = ctx.p(v.get("digits_at", 3), 0.7)
    if da > 0:
        tt = max(0.0, t - ctx.cue(v.get("digits_at", 3)))
        cancelled = min(119, int(tt * 22))
        def g2(d):
            text_c(d, 1390, 200, "0.", R.F("serifb", 40), CREAM(th))
            font = R.F("serif", 30)
            for i in range(120):
                r_, c_ = divmod(i, 20); x = 1030 + c_ * 36; y = 260 + r_ * 56
                ch = "0" if i < cancelled else str(int(_rnd(i, int(t * 8)) * 10))
                d.text((x, y), ch, font=font, fill=GOLD(th) if i < cancelled else DIM(th, 200))
            text_c(d, 1390, 620, f"{cancelled} decimal places cancel", R.F("sans", 30), CREAM(th))
            if v.get("cite"): wrapped_c(d, 1390, 680, v["cite"], R.F("serif", 26), DIM(th), 780, lh=32)
        draw_fade(base, ctx, da, g2)
    verdict(base, ctx, v["label"], v.get("label_at", 4), y=770)

def v_penrose(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    fa = ctx.p(v.get("figure_at", 2), 1.0)
    def order(d):   # low entropy: a perfectly ordered lattice, trembling slightly
        for i in range(12):
            for j in range(7):
                x = W / 2 - 330 + i * 60 + 2 * math.sin(t * 3 + i); y = 250 + j * 60 + 2 * math.cos(t * 3 + j)
                d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=CREAM(th, 200))
        text_c(d, W / 2, 700, "extraordinarily low entropy — extraordinarily ordered", R.F("serif", 40), CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8) * (1 - fa), order)
    if fa > 0:
        tt = t - ctx.cue(v.get("figure_at", 2))
        def zeros(d):   # a river of zeros that never finishes
            font = R.F("serif", 28)
            for row in range(16):
                y = 140 + row * 44; off = (int(tt * 30) * (1 + row % 3)) % 40
                for c_ in range(52):
                    x = -40 + c_ * 40 + off
                    d.text((x, y), "0", font=font, fill=DIM(th, 40 + int(40 * _rnd(row, c_))))
            rrect(d, [W / 2 - 520, 300, W / 2 + 520, 560], fill=(8, 16, 30, 235), outline=GOLD(th), width=2)
            text_c(d, W / 2 - 150, 350, "1 in 10", R.F("serifb", 110), GOLD(th))
            text_c(d, W / 2 + 135, 320, "10", R.F("serifb", 64), GOLD(th))
            text_c(d, W / 2 + 225, 300, "123", R.F("serifb", 40), GOLD(th))
            text_c(d, W / 2, 490, "the precision of the Big Bang's initial state (Penrose)", R.F("sans", 28), CREAM(th))
        draw_fade(base, ctx, fa, zeros)
    na = ctx.p(v.get("note_at", 3), 0.8)
    draw_fade(base, ctx, na, lambda d: text_c(d, W / 2, 640, v["note"], R.F("serifb", 44), CREAM(th)))

def _nucleus(d, cx, cy, n, th, seed, scale=1.0):
    for i in range(n):
        a = _rnd(seed, i) * 6.283; rr = 14 * scale * math.sqrt(i + 0.5) * 0.9
        x = cx + rr * math.cos(a); y = cy + rr * math.sin(a); r_ = 13 * scale
        col = (214, 96, 84, 255) if i % 2 == 0 else (170, 178, 196, 255)
        d.ellipse([x - r_, y - r_, x + r_, y + r_], fill=col, outline=(20, 20, 30, 160))

def v_carbon(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    cyc = (t % 6.0) / 6.0              # the fusion loops every 6 s
    def f(d):
        cx, cy = 620, 380
        if cyc < 0.6:
            u = ease(cyc / 0.6)
            for k in range(3):
                a = k * 2.094 + t * 0.6; R_ = 230 * (1 - u) + 40
                _nucleus(d, cx + R_ * math.cos(a), cy + R_ * math.sin(a), 4, th, k)
            text_c(d, cx, 600, "three helium nuclei", R.F("sans", 30), DIM(th))
        else:
            u = (cyc - 0.6) / 0.4; fl = max(0, 1 - u * 3)
            if fl > 0:
                for g in range(6):
                    rr = 60 + g * 30 * (1 - fl); d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=GOLD(th, int(160 * fl)), width=4)
            _nucleus(d, cx, cy, 12, th, 99, 1.2)
            text_c(d, cx, 600, "carbon-12", R.F("serifb", 40), GOLD(th))
        # the energy-level ladder
        x0, x1 = 1180, 1600
        levels = [(0.0, "ground"), (4.44, ""), (7.65, "7.65 MeV"), (9.64, "")]
        found = ctx.p(v.get("found_at", 1), 0.8)
        for e, lab in levels:
            y = 600 - e * 44
            hot = (e == 7.65); col = GOLD(th, int(255 * found)) if hot else DIM(th, 160)
            if hot and found < 0.05: col = DIM(th, 90)
            d.line([(x0, y), (x1, y)], fill=col, width=6 if hot else 3)
            if lab: d.text((x1 + 16, y - 18), lab, font=R.F("sans", 28), fill=col if hot else DIM(th))
        if found > 0:
            pulse = 0.5 + 0.5 * math.sin(t * 4)
            d.ellipse([x0 - 22, 600 - 7.65 * 44 - 11, x0, 600 - 7.65 * 44 + 11], fill=GOLD(th, int(150 + 100 * pulse)))
        text_c(d, (x0 + x1) / 2, 150, "the Hoyle state", R.F("sans", 30), GOLD(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    qa = ctx.p(v.get("quote_at", 2), 0.8) * (1 - ctx.p(v.get("caution_at", 3), 0.6))
    draw_fade(base, ctx, qa, lambda d: (rrect(d, [210, 690, W - 210, 760], fill=(10, 20, 36, 225), outline=DIM(th, 120), width=1, r=12),
                                        text_c(d, W / 2, 702, "Hoyle: “a superintellect has monkeyed with physics”", R.F("serif", 36), CREAM(th))))
    verdict(base, ctx, v["caution"], v.get("caution_at", 3), y=680)

def v_forces(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    ra = ctx.p(v.get("ratio_at", 1), 1.4)
    def f(d):
        text_c(d, W / 2, 170, "Gravity vs electromagnetism (between protons)", R.F("sans", 30), DIM(th))
        d.rectangle([260, 240, 260 + 6, 290], fill=CREAM(th)); d.text((280, 244), "gravity", font=R.F("serif", 34), fill=CREAM(th))
        wEM = 1400 * ra; d.rectangle([260, 320, 260 + wEM, 370], fill=GOLD(th))
        d.text((280, 324), "electromagnetism", font=R.F("serif", 34), fill=(10, 20, 36, 255) if wEM > 400 else CREAM(th))
        if ra > 0.95: text_c(d, 1500, 250, "×10³⁶", R.F("serifb", 64), GOLD(th))
        # strong-force slider: a knob that drifts, and the world it makes
        sa = ctx.p(v.get("slider_at", 1), 0.8, 2.0)
        if sa > 0:
            y = 560; d.line([(360, y), (1560, y)], fill=DIM(th, 160), width=6)
            d.rectangle([930, y - 16, 990, y + 16], fill=GOLD(th, int(200 * sa)))
            u = 0.5 + 0.42 * math.sin(t * 0.9); x = 360 + 1200 * u
            d.ellipse([x - 20, y - 20, x + 20, y + 20], fill=CREAM(th))
            text_c(d, W / 2, 470, "strong nuclear force", R.F("sans", 30), DIM(th))
            ok = 930 <= x <= 990
            msg = "hydrogen and heavy elements both form" if ok else ("no heavier elements" if x < 930 else "no hydrogen")
            text_c(d, W / 2, 610, msg, R.F("serifb", 40), GOLD(th) if ok else (220, 110, 96, 255))
    draw_fade(base, ctx, ease(t / 0.8), f)

def v_doors(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    labels = v["labels"]; op = ctx.p(v.get("open_at", 1), 1.4)
    focus = None
    for k, idx in v.get("focus", []):
        if ctx.cues and t >= ctx.cue(k): focus = idx
    def f(d):
        for i, lab in enumerate(labels):
            cx = W / 2 + (i - 1) * 470; x0, x1, y0, y1 = cx - 150, cx + 150, 220, 700
            hi = (focus == i)
            # light spilling from the doorway
            glow = int((90 if hi else 40) * op)
            d.polygon([(x0, y1), (x1, y1), (x1 + 120, y1 + 110), (x0 - 120, y1 + 110)], fill=GOLD(th, glow))
            d.rectangle([x0, y0, x1, y1], fill=(240, 220, 160, int((160 if hi else 70) * op)))
            # the door leaf, swinging open (its outer edge narrows)
            sw = (1 - 0.82 * op) if not hi else (1 - 0.9 * op)
            xe = x0 + (x1 - x0) * sw
            d.polygon([(x0, y0), (xe, y0 + 26 * (1 - sw)), (xe, y1 - 26 * (1 - sw)), (x0, y1)], fill=(24, 40, 70, 255), outline=DIM(th, 160))
            d.rectangle([x0 - 10, y0 - 10, x1 + 10, y1], outline=GOLD(th) if hi else DIM(th, 160), width=4 if hi else 2)
            text_c(d, cx, y1 + 40, lab, R.F("serifb", 50), GOLD(th) if hi else CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8), f)

def v_scales(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    tip = ctx.p(v.get("tip_at", 2), 2.0)
    ang = -0.11 * tip + 0.012 * math.sin(t * 1.3)      # a modest tilt, never slammed down
    def f(d):
        cx, cy, L = W / 2, 300, 520
        d.polygon([(cx - 60, 720), (cx + 60, 720), (cx, cy)], fill=DIM(th, 120))
        lx, ly = cx - L * math.cos(ang), cy - L * math.sin(ang); rx, ry = cx + L * math.cos(ang), cy + L * math.sin(ang)
        d.line([(lx, ly), (rx, ry)], fill=CREAM(th), width=8)
        d.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=GOLD(th))
        for (px, py, lab, gold) in ((lx, ly, v["left"], False), (rx, ry, v["right"], True)):
            d.line([(px, py), (px - 110, py + 170)], fill=DIM(th), width=2); d.line([(px, py), (px + 110, py + 170)], fill=DIM(th), width=2)
            d.arc([px - 140, py + 120, px + 140, py + 230], 0, 180, fill=GOLD(th) if gold else CREAM(th), width=6)
            wrapped_c(d, px, py + 250, lab, R.F("serif", 36), GOLD(th) if gold else CREAM(th), 420)
        if tip > 0:   # the evidence settles into the right-hand pan
            yy = ry + 150 - 260 * (1 - min(1, tip * 1.4))
            d.ellipse([rx - 30, yy - 30, rx + 30, yy + 30], fill=GOLD(th)); text_c(d, rx, yy - 78, "the fine-tuning data", R.F("sans", 26), GOLD(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 3), y=150)

def v_multiverse(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    def f(d):
        gx, gy = 560, 800
        d.ellipse([gx - 70, gy - 30, gx + 70, gy + 30], fill=(40, 60, 100, 255), outline=GOLD(th, 160), width=2)
        for i in range(24):
            life = (t * 0.22 + _rnd(i)) % 1.0
            x = int(gx + (_rnd(i, 1) - 0.5) * 900 * life + 12 * math.sin(t * 0.5 + i))
            y = int(gy - 40 - life * 700); r_ = int(18 + 50 * _rnd(i, 2) * min(1, life * 3))
            gold = (i % 11 == 3)
            a = int(220 * min(1, life * 4) * (1 - max(0, life - 0.85) / 0.15))
            col = GOLD(th, a) if gold else (120, 140, 180, a // 2)
            d.ellipse([x - r_, y - r_, x + r_, y + r_], outline=col, width=3)
            if gold and life > 0.3:
                d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=GOLD(th, a))
        if ctx.cues and t >= ctx.cue(v.get("landscape_at", 3)):
            text_c(d, gx, 170, "string landscape: perhaps 10⁵⁰⁰ vacua", R.F("serif", 38), CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    for j, (lab, k) in enumerate(v.get("diffs", [])):
        a = ctx.p(k, 0.7)
        draw_fade(base, ctx, a, lambda d, j=j, lab=lab: (
            rrect(d, [1080, 250 + j * 110, 1820, 330 + j * 110], fill=(10, 20, 36, 230), outline=GOLD(th, 170), width=2, r=14),
            d.text((1110, 272 + j * 110), f"{j + 1}.  {lab}", font=R.F("serifb", 30), fill=CREAM(th))))
    ha = ctx.p(v.get("hoss_at", 10), 0.8) * (1 - ctx.p(v.get("verdict_at", 12), 0.6))
    draw_fade(base, ctx, ha, lambda d: (rrect(d, [1080, 590, 1820, 790], fill=(10, 20, 36, 235), outline=DIM(th, 150), width=1, r=14),
                                        wrapped_c(d, 1450, 606, v["hoss"], R.F("serif", 29), CREAM(th), 690, lh=36)))
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 12), y=600)

def _marksman(d, x, y, th, flash):
    d.ellipse([x - 16, y - 96, x + 16, y - 64], fill=(150, 160, 185, 255))
    d.rounded_rectangle([x - 24, y - 60, x + 24, y + 30], radius=10, fill=(110, 122, 150, 255))
    d.line([(x + 10, y - 40), (x + 96, y - 52)], fill=(200, 205, 215, 255), width=6)
    if flash > 0:
        d.ellipse([x + 92, y - 66, x + 124, y - 38], fill=GOLD(th, int(255 * flash)))

def v_firing(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    sq = ctx.p(v.get("squad_at", 3), 0.8)
    def puddle(d):
        sx = 300 + ((t * 40) % 1400); d.ellipse([sx - 50, 170, sx + 50, 270], fill=GOLD(th, 220))
        for k in range(12):
            a = k * 0.52; d.line([(sx + 60 * math.cos(a), 220 + 60 * math.sin(a)), (sx + 85 * math.cos(a), 220 + 85 * math.sin(a))], fill=GOLD(th, 160), width=3)
        d.rectangle([0, 640, W, 1080], fill=(34, 30, 26, 255))
        shrink = 1 - 0.7 * min(1, t / 25)
        w_ = 380 * shrink; d.chord([W / 2 - 400, 560, W / 2 + 400, 760], 0, 180, fill=(18, 16, 14, 255))
        d.chord([W / 2 - w_, 640 - 6 + 4 * math.sin(t * 3), W / 2 + w_, 640 + 90 * shrink], 0, 180, fill=(80, 120, 180, 230))
        text_c(d, W / 2, 800, "“How perfectly my hole fits me!”", R.F("serif", 40), CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8) * (1 - sq), puddle)
    if sq > 0:
        tf = t - ctx.cue(v.get("fire_at", 4)) if ctx.cues else -1
        def squad(d):
            tx, ty = 1500, 640
            for i in range(7):
                x = 250 + i * 110; y = 520 + (i % 2) * 150
                fl = 0.0
                if tf > 0:
                    ph = (tf - i * 0.18) % 2.4; fl = max(0.0, 1 - ph * 5) if ph >= 0 else 0.0
                _marksman(d, x, y, th, fl)
                if tf > 0:
                    ph = (tf - i * 0.18) % 2.4
                    if 0 <= ph < 0.5:   # the shot streaks past — and misses
                        u = ph / 0.5; mx = (x + 124) + (tx + 300 - (x + 124)) * u
                        miss = -150 + 300 * _rnd(i, int(tf / 2.4))
                        my = (y - 52) + (ty - 60 + miss - (y - 52)) * u
                        d.line([(mx - 40, my), (mx, my)], fill=CREAM(th, 220), width=3)
            d.ellipse([tx - 22, ty - 150, tx + 22, ty - 106], fill=CREAM(th))
            d.rounded_rectangle([tx - 32, ty - 100, tx + 32, ty + 20], radius=14, fill=CREAM(th))
            text_c(d, 700, 830, "fifty marksmen · every one misses", R.F("sans", 30), DIM(th))
        draw_fade(base, ctx, sq, squad)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 6), y=170)

def v_measure(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    z = ctx.p(v.get("zoom_at", 2), 5.0) * (1 - ctx.p(v.get("planck_at", 5), 1.5))   # zoom out, then back
    span = 10 ** (1 + 7 * z)
    def f(d):
        y = 460; x0, x1 = 160, W - 160
        d.line([(x0, y), (x1, y)], fill=CREAM(th, 200), width=3)
        for k in range(11):
            x = x0 + (x1 - x0) * k / 10; d.line([(x, y - 14), (x, y + 14)], fill=DIM(th), width=2)
            val = span * k / 10
            lab = f"{val:.0f}" if val < 1e4 else f"{val:.0e}".replace("e+0", "e").replace("e+", "e")
            text_c(d, x, y + 26, lab, R.F("sans", 22), DIM(th))
        wpx = max(2.0, 60 * 10 / span)          # the same life-permitting window, at this scale
        cx = x0 + (x1 - x0) * 0.43
        d.rectangle([cx, y - 40, cx + wpx, y + 40], fill=GOLD(th))
        text_c(d, cx + wpx / 2, y - 100, "life-permitting window", R.F("sans", 28), GOLD(th))
        if z > 0.6: text_c(d, x1 + 60, y - 30, "∞", R.F("serifb", 64), CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    qa = ctx.p(v.get("q_at", 3), 0.8) * (1 - ctx.p(v.get("planck_at", 5), 0.6))
    draw_fade(base, ctx, qa, lambda d: text_c(d, W / 2, 190, "“Narrow” relative to what?", R.F("serifb", 58), GOLD(th)))
    pa = ctx.p(v.get("planck_at", 5), 0.8)
    draw_fade(base, ctx, pa, lambda d: (d.line([(160, 590), (160, 620), (W - 160, 620), (W - 160, 590)], fill=CREAM(th, 200), width=3),
                                        text_c(d, W / 2, 640, "a finite, physically motivated range (e.g. Planck scale)", R.F("serif", 34), CREAM(th))))
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 9), y=190)

def v_survey(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    def f(d):
        bx, by = W / 2, 330
        rrect(d, [bx - 160, by - 110, bx + 160, by + 110], fill=(30, 48, 84, 255), outline=GOLD(th), width=3, r=10)
        wrapped_c(d, bx, by - 40, v["book"], R.F("serifb", 34), GOLD(th), 280)
        for side in (0, 1):
            a = ctx.p(0, 1.0, 1.0 + side * 0.6)
            sx = bx + (-1 if side == 0 else 1) * 520; sy = 330
            ex = bx + (-1 if side == 0 else 1) * 170
            d.line([(ex, by), (ex + (sx - ex) * a * 0.62, by)], fill=GOLD(th, 200), width=3)
            if a > 0.9:
                text_c(d, sx, sy - 60, v["left" if side == 0 else "right"], R.F("serifb", 44), CREAM(th))
                text_c(d, sx, sy, v[("left" if side == 0 else "right") + "_sub"], R.F("serif", 34), GOLD(th))
                if side == 0:
                    for i in range(6):
                        rr = 16 + 6 * math.sin(t * 2 + i); x = sx - 150 + i * 60; y = sy + 90
                        d.ellipse([x - rr, y - rr, x + rr, y + rr], outline=CREAM(th, 170), width=2)
                else:
                    gauge(d, sx, sy + 150, 60, th, 0.5 + 0.02 * math.sin(t * 5), arc_w=5)
    draw_fade(base, ctx, ease(t / 0.8), f)
    sa = ctx.p(v.get("stenger_at", 1), 0.8) * (1 - ctx.p(v.get("sep_at", 4), 0.6)); dx = 200 * (1 - ctx.p(v.get("stenger_at", 1), 0.8))
    draw_fade(base, ctx, sa, lambda d: (rrect(d, [260 + dx, 600, W - 260 + dx, 690], fill=(10, 20, 36, 235), outline=DIM(th, 160), width=2, r=14),
                                        text_c(d, W / 2 + dx, 622, v["stenger"], R.F("serif", 36), CREAM(th))))
    verdict(base, ctx, v["sep"], v.get("sep_at", 4), y=620)

def v_table(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    seats = v["seats"]; ba = v.get("bills_at", 1); sa = ctx.p(v.get("seat_at", 3), 1.0)
    def f(d):
        d.rounded_rectangle([200, 600, W - 200, 660], radius=10, fill=(92, 70, 44, 255))
        for i, (lab, bill) in enumerate(seats):
            cx = 390 + i * 380
            hi = (i == 0 and sa > 0)
            d.rounded_rectangle([cx - 80, 420, cx + 80, 600], radius=14, outline=GOLD(th) if hi else DIM(th, 170), width=4 if hi else 2)
            if hi:
                for g in range(3):
                    rr = 110 + g * 26 + 6 * math.sin(t * 3); d.ellipse([cx - rr, 510 - rr, cx + rr, 510 + rr], outline=GOLD(th, int(60 * sa / (g + 1))), width=3)
            text_c(d, cx, 690, lab, R.F("serifb", 44), GOLD(th) if hi else CREAM(th))
            if bill:
                a = ctx.p(ba, 0.8, 0.5 * i)
                if a > 0:
                    yy = 370 - 200 * (1 - a) + 6 * math.sin(t * 2 + i)
                    rrect(d, [cx - 160, yy - 80, cx + 160, yy + 20], fill=(236, 228, 208, int(240 * a)), outline=(120, 100, 70, int(255 * a)), width=1, r=4)
                    wrapped_c(d, cx, yy - 70, bill, R.F("serif", 25), (40, 34, 26, int(255 * a)), 290, lh=29)
        text_c(d, W / 2, 160, "Rival explanations — and their unpaid bills", R.F("serif", 44), CREAM(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    draw_fade(base, ctx, sa, lambda d: text_c(d, W / 2, 780, "A seat at the table", R.F("serifb", 56), GOLD(th)))

def v_rope(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    names = v["strands"]; n = len(names); wv = ctx.p(v.get("weave_at", 3), 2.0)
    def f(d):
        x0, x1, cy = 520, 1700, 430
        for i, nm in enumerate(names):
            a = ctx.p(0, 0.8, 0.4 * i) if i else ease(t / 0.8)
            if a <= 0: continue
            y0 = cy + (i - (n - 1) / 2) * 80
            pts = []
            for k in range(0, 121):
                u = k / 120; x = x0 + (x1 - x0) * u
                merge = ease(min(1, max(0, (u - 0.25) / 0.6))) * wv
                y = y0 * (1 - merge) + (cy + 18 * math.sin(u * 30 - t * 3 + i * 2 * math.pi / n)) * merge
                pts.append((x, y))
            col = GOLD(th, int(255 * a)) if i == 0 else CREAM(th, int(200 * a))
            d.line(pts, fill=col, width=7 if i == 0 else 5)
            d.text((x0 - 20 - d.textlength(nm, font=R.F("serif", 36)), y0 - 22), nm, font=R.F("serifb" if i == 0 else "serif", 36),
                   fill=GOLD(th, int(255 * a)) if i == 0 else CREAM(th, int(230 * a)))
        text_c(d, W / 2, 170, v.get("title", "One strand — not the whole rope"), R.F("serif", 44), CREAM(th))
    draw_fade(base, ctx, 1.0, f)
    verdict(base, ctx, v["note"], v.get("note_at", 4), y=680)

def v_ft_close(base, ctx, v):
    th = ctx.th; W = ctx.W; t = ctx.t
    a0 = ease(t / 0.8) * (1 - ctx.p(2, 0.6))
    def f0(d):
        font = R.F("serif", 58); s_ = "“Scientists agree the universe is designed”"; w = d.textlength(s_, font=font)
        text_c(d, W / 2, 330, s_, font, DIM(th)); lw = ctx.p(1, 0.6)
        d.line([(W / 2 - w / 2 - 10, 366), (W / 2 - w / 2 - 10 + (w + 20) * lw, 366)], fill=(196, 92, 78, 255), width=6)
    draw_fade(base, ctx, a0, f0)
    a1 = ctx.p(2, 0.8) * (1 - ctx.p(5, 0.6))
    def f1(d):
        for i in range(3):
            gauge(d, W / 2 + (i - 1) * 300, 520, 90, th, 0.5 + 0.015 * math.sin(t * 4 + i), arc_w=6)
        text_c(d, W / 2, 230, "A mind behind the dials?", R.F("serifb", 64), GOLD(th))
        if ctx.cues and t >= ctx.cue(3): text_c(d, W / 2, 640, "Defensible — and, honestly, resistible.", R.F("serif", 46), CREAM(th))
        if ctx.cues and t >= ctx.cue(4): text_c(d, W / 2, 720, "It invites; it does not coerce.", R.F("serif", 46), CREAM(th))
    draw_fade(base, ctx, a1, f1)
    a2 = ctx.p(5, 0.9)
    def f2(d):
        text_c(d, W / 2, 330, "“with gentleness and respect”", R.F("serifb", 64), GOLD(th))
        text_c(d, W / 2, 430, v.get("ref", ""), R.F("sans", 32), CREAM(th))
    draw_fade(base, ctx, a2, f2)

def v_cosmic_cost(base, ctx, v):
    """Stars live, die, and seed the next generation; the cosmos keeps expanding."""
    th = ctx.th; W = ctx.W; t = ctx.t
    fa = ctx.p(v.get("forge_at", 3), 1.0)
    def f(d):
        cx, cy = 700, 590; R_ = 160 + 24 * t   # the expanding universe
        R_ = min(R_, 360)
        d.ellipse([cx - R_, cy - R_ * 0.62, cx + R_, cy + R_ * 0.62], outline=DIM(th, 110), width=2)
        for i in range(160):
            a = _rnd(i, 21) * 6.283; rr = math.sqrt(_rnd(i, 22)) * R_ * 0.95
            x = cx + rr * math.cos(a); y = cy + rr * math.sin(a) * 0.62
            d.ellipse([x - 1.5, y - 1.5, x + 1.5, y + 1.5], fill=CREAM(th, 90 + int(80 * _rnd(i, 23))))
        if fa > 0:      # a stellar life cycle, looping: burn → explode → seed a new star
            for k in range(3):
                ph = ((t - ctx.cue(v.get("forge_at", 3))) * 0.35 + k / 3) % 1.0
                sx = cx + (k - 1) * 230; sy = cy + (k % 2) * 70 - 35
                if ph < 0.55:
                    r_ = 18 + 8 * math.sin(t * 5 + k); d.ellipse([sx - r_, sy - r_, sx + r_, sy + r_], fill=GOLD(th, int(230 * fa)))
                elif ph < 0.8:
                    u = (ph - 0.55) / 0.25
                    for j in range(14):
                        aa = j * 0.449; rr = 20 + 110 * u
                        d.ellipse([sx + rr * math.cos(aa) - 4, sy + rr * math.sin(aa) - 4, sx + rr * math.cos(aa) + 4, sy + rr * math.sin(aa) + 4],
                                  fill=(230, 150, 90, int(255 * (1 - u) * fa)))
                else:
                    u = (ph - 0.8) / 0.2
                    d.ellipse([sx - 6 * u, sy - 6 * u, sx + 6 * u, sy + 6 * u], fill=CREAM(th, int(220 * fa)))
            for j, el in enumerate(["carbon", "oxygen", "iron"]):
                d.text((1300, 480 + j * 64), "•  " + el, font=R.F("serif", 40), fill=GOLD(th, int(255 * ctx.p(v.get("forge_at", 3), 0.6, 0.5 * j))))
            text_c(d, 1450, 420, "forged inside stars", R.F("sans", 28), DIM(th))
        yrs = min(13.8, t * 0.9)
        text_c(d, cx, 810, f"{yrs:4.1f} billion years", R.F("serif", 36), DIM(th))
    draw_fade(base, ctx, ease(t / 0.8), f)
    verdict(base, ctx, v["verdict"], v.get("verdict_at", 5), y=150, max_w=1700)

MOTION_VISUALS = dict(cosmic_cost=v_cosmic_cost, ft_title=v_ft_title, dials=v_dials, split=v_split, window_dial=v_window_dial, cancel=v_cancel,
                      penrose=v_penrose, carbon=v_carbon, forces=v_forces, doors=v_doors, scales=v_scales,
                      multiverse=v_multiverse, firing=v_firing, measure=v_measure, survey=v_survey, table=v_table,
                      rope=v_rope, ft_close=v_ft_close)

# drifting two-layer starfield behind every frame (spec "motion": true)
_SKY = [(_rnd(i, 11), _rnd(i, 12), _rnd(i, 13)) for i in range(260)]
def starfield(img, gt, th):
    d = ImageDraw.Draw(img); W, H = img.size
    for i, (u, v_, b) in enumerate(_SKY):
        layer_ = 1 if i % 3 else 2
        # steady brightness (no twinkle) and whole-pixel steps: frames stay near-identical
        # between moves, which keeps long videos small enough to share
        x = int((u * W - gt * (4 if layer_ == 1 else 11)) % W); y = int(v_ * H)
        a = int(0.75 * (40 + 90 * b)) if layer_ == 1 else int(0.75 * (90 + 120 * b))
        r_ = 1 if layer_ == 1 else 2
        d.ellipse([x - r_, y - r_, x + r_, y + r_], fill=(250, 238, 218, a))

VISUALS = dict(title=v_title, end=v_end, fork=v_fork, syllogism=v_syllogism, vacuum=v_vacuum, hotel=v_hotel,
               succession=v_succession, timeline=v_timeline, attributes=v_attributes, contrast=v_contrast,
               strands=v_strands, objection=v_objection, close=v_close, **MOTION_VISUALS)

# ---------------------------------------------------------------- captions
def caption_chunks(cues, d, font, max_w, cmap=None):
    """Split each sentence into ≤2-line chunks, timed in proportion to word count.
    cmap: spec "caption_map" — display-only rewrites (e.g. 10^500 → 10⁵⁰⁰); the narration
    and the TTS cache key always use the spec's original sentence."""
    out = []
    for a0, a1, s in cues:
        for k, v in (cmap or {}).items(): s = s.replace(k, v)
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
    motion = bool(spec.get("motion"))
    def frame(t):
        img = bg.copy(); ctx = Ctx(W, H, th, t, rel, dur)
        if motion: starfield(img, tl["start"] + t, th)
        lay = layer(W, H); fn(lay, ctx, sc["visual"])
        fin, fout = ease(t / 0.55), ease((t - (dur - 0.5)) / 0.5)
        fade = fin * (1 - fout)
        if motion and fade < 1:     # content slides in from the right and out to the left
            dx = int(110 * (1 - fin) - 110 * fout)
            if fade > 0:
                lay.putalpha(lay.getchannel("A").point(lambda q: int(q * fade)))
                img.paste(lay, (dx, 0), lay)
        else:
            comp(img, lay, fade)
        chrome(img, ctx, sc, tl["start"] + t, total, caps, burn)
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
def _still_time(rel, dur):  # preview: just after the last sentence starts (everything revealed)
    return (rel[-1][0] + 1.5) if rel else dur * 0.6

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec"); ap.add_argument("--out"); ap.add_argument("--voice"); ap.add_argument("--speed", type=float)
    ap.add_argument("--fps", type=int); ap.add_argument("--jobs", type=int, default=os.cpu_count() or 2)
    ap.add_argument("--no-burn-captions", action="store_true"); ap.add_argument("--preview", action="store_true")
    ap.add_argument("--no-tts", action="store_true", help="preview only: time scenes from word counts, skip synthesis")
    a = ap.parse_args()
    spec = json.load(open(a.spec)); assert spec.get("format") == "explainer", "not an explainer spec"
    W, H = R.ASPECTS[spec.get("aspect", "wide")]; fps = a.fps or int(spec.get("fps", 30))
    voice = a.voice or spec.get("voice", "am_michael"); speed = a.speed or float(spec.get("speed", 1.0))
    name = os.path.splitext(os.path.basename(a.spec))[0]
    outdir = os.path.join(HERE, "output"); os.makedirs(outdir, exist_ok=True)
    out = a.out or os.path.join(outdir, f"{name}-{voice}.mp4"); base = os.path.splitext(out)[0]
    work = os.path.join(HERE, f".build_{name}"); os.makedirs(work, exist_ok=True)
    print(f"narration ({voice}, speed {speed})…")
    if a.no_tts:
        assert a.preview, "--no-tts is for layout previews only"
        audio = {x: np.zeros(int(SR * len(x.split()) / 2.7), dtype=np.float32) for sc in spec["scenes"] for x in sc["say"]}
    else:
        audio = synth_all(spec, voice, speed)
    tempo = float(spec.get("tempo", 1.0))
    if tempo != 1.0: audio = {k: stretch(v, tempo) for k, v in audio.items()}
    tl, total = build_timeline(spec, audio)
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    caps = []
    for t in tl: caps += caption_chunks(t["cues"], probe, R.F("sans", CAP_FONT), W - 360, spec.get("caption_map"))
    write_subs(caps, base)
    print(f"runtime {int(total // 60)}:{int(total % 60):02d} · {len(spec['scenes'])} scenes · {len(caps)} captions")
    burn = not a.no_burn_captions
    if a.preview:
        still = _still_time
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
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "64k", "-shortest", "-movflags", "+faststart", out])
    if r.returncode: sys.exit("final mux failed")
    print(f"✓ {out}\n✓ {base}.srt / .vtt")

if __name__ == "__main__":
    main()
