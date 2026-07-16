#!/usr/bin/env python3
"""
Apologia Daily — branded short-form reel generator.

Turns a JSON spec (a title + a list of caption scenes) into a finished, brand-styled
MP4 (deep-navy/gold or light "manuscript" theme) at vertical / square / wide sizes,
with crossfades and a subtle Ken Burns zoom. No Canva, no network, no voiceover engine
required — it renders slides with Pillow and encodes with a bundled static ffmpeg.

Usage:
    python3 gen_reel.py <spec.json> [--out path.mp4] [--aspect vertical|square|wide]
                                     [--theme navy|parchment]

By default the finished MP4 is written to tools/reel/output/ (one predictable folder,
git-ignored); pass --out to override the location/name.

CLI flags override the matching keys in the spec. See tools/reel/README.md and
tools/reel/specs/*.json for the spec format. Add a voiceover afterward in any editor
using the "voiceover" text in the spec (this tool renders silent, fully-captioned video).

Alongside each MP4 the tool also writes a CapCut kit (disable with --no-kit):
  <base>.srt           — captions timed to the scenes (import into CapCut)
  <base>.voiceover.txt — the voiceover script + a per-scene timing sheet
so a silent, made-elsewhere reel becomes a native, voiced video in one editor pass —
which performs far better than a silent static upload.
"""
import os, sys, json, subprocess, argparse, importlib

# ---- dependency bootstrap (Pillow + a static ffmpeg) ----
def _ensure(pkg, imp=None):
    try:
        return importlib.import_module(imp or pkg)
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", pkg], check=True)
        return importlib.import_module(imp or pkg)

Image = _ensure("Pillow", "PIL.Image"); from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
imageio_ffmpeg = _ensure("imageio-ffmpeg", "imageio_ffmpeg")
FF = imageio_ffmpeg.get_ffmpeg_exe()

# ---- fonts ----
# Prefer an env override (REEL_SERIF/REEL_SERIFB/REEL_SANS), else the first font
# that actually exists — DejaVu on Debian/Ubuntu, Georgia/Arial on Windows, the
# Supplemental faces on macOS. Keeps the tool working cross-platform out of the box.
def _pick(env, candidates):
    p = os.environ.get(env)
    if p:
        return p
    for c in candidates:
        if os.path.exists(c):
            return c
    return candidates[0]  # best effort; may still raise, surfacing a clear error

FONTS = {
    "serif":  _pick("REEL_SERIF", [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "C:/Windows/Fonts/georgia.ttf", "C:/Windows/Fonts/constan.ttf", "C:/Windows/Fonts/times.ttf",
        "/System/Library/Fonts/Supplemental/Georgia.ttf", "/Library/Fonts/Georgia.ttf"]),
    "serifb": _pick("REEL_SERIFB", [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "C:/Windows/Fonts/georgiab.ttf", "C:/Windows/Fonts/constanb.ttf", "C:/Windows/Fonts/timesbd.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"]),
    "sans":   _pick("REEL_SANS", [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/segoeuib.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf"]),
}
def F(name, size): return ImageFont.truetype(FONTS.get(name, FONTS["serif"]), size)

# ---- themes ----
THEMES = {
    "navy": dict(
        top=(5, 13, 26), mid=(10, 22, 40), bot=(15, 32, 64),
        gold=(200, 169, 81), cream=(250, 238, 218), dim=(196, 188, 173),
        glow=(120, 96, 40), vignette=0.55, shadow=(0, 0, 0),
    ),
    "parchment": dict(
        top=(247, 244, 238), mid=(240, 235, 224), bot=(228, 220, 203),
        gold=(160, 126, 44), cream=(20, 30, 52), dim=(92, 84, 68),
        glow=(210, 190, 140), vignette=0.22, shadow=(200, 190, 168),
    ),
}
ASPECTS = {"vertical": (1080, 1920), "square": (1080, 1080), "wide": (1920, 1080)}

def color(spec_theme, name):
    t = THEMES[spec_theme]
    return t.get(name, t["cream"])

# ---- background ----
def gradient_bg(W, H, th):
    img = Image.new("RGB", (W, H), th["top"]); px = img.load()
    for y in range(H):
        t = y / (H - 1)
        if t < 0.55:
            u = t / 0.55; a, b = th["top"], th["mid"]
        else:
            u = (t - 0.55) / 0.45; a, b = th["mid"], th["bot"]
        c = tuple(int(a[i] + (b[i] - a[i]) * u) for i in range(3))
        for x in range(W): px[x, y] = c
    # soft radial glow
    glow = Image.new("L", (W, H), 0); gd = ImageDraw.Draw(glow)
    cx, cy, r = W // 2, int(H * 0.42), int(min(W, H) * 0.6)
    for rr in range(r, 0, -8):
        gd.ellipse([cx - rr, cy - int(rr * 1.15), cx + rr, cy + int(rr * 1.15)],
                   fill=int(46 * (1 - rr / r)))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.composite(Image.new("RGB", (W, H), th["glow"]), img, glow)
    # vignette
    vig = Image.new("L", (W, H), 255); v = ImageDraw.Draw(vig)
    m = int(min(W, H) * 0.08); v.rectangle([m, m, W - m, H - m], fill=0)
    vig = vig.filter(ImageFilter.GaussianBlur(120))
    img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0) if sum(th["top"]) < 200 else (120, 110, 90)),
                          img, vig.point(lambda p: int(p * th["vignette"])))
    return img

def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w: cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def center_block(draw, W, blocks, cy, shadow, top=None):
    heights = []
    for _, font, _, gap in blocks:
        asc, desc = font.getmetrics(); heights.append(asc + desc + gap)
    # top-anchor when given (keeps a tight, consistent gap under the kicker);
    # otherwise vertically center around cy
    y = top if top is not None else cy - sum(heights) // 2
    for (text, font, col, gap), hh in zip(blocks, heights):
        w = draw.textlength(text, font=font); x = (W - w) // 2
        draw.text((x + 2, y + 2), text, font=font, fill=shadow)
        draw.text((x, y), text, font=font, fill=col)
        y += hh

def measure_kicker(draw, W, text):
    max_w = W - 180
    for size, sep in [(34, "  "), (32, "  "), (30, " "), (28, " "), (26, " "), (24, " ")]:
        f = F("sans", size); spaced = sep.join(list(text)); w = draw.textlength(spaced, font=f)
        if w <= max_w: break
    return f, spaced, w

# height from the kicker text's top to its underline (used to center the whole group)
KICKER_H = 70

def kicker_at(draw, W, f, spaced, w, y, th):
    # draw an already-measured kicker with its text top at y; underline a fixed gap below
    draw.text(((W - w) // 2, y), spaced, font=f, fill=th["gold"])
    underline_y = y + KICKER_H
    draw.line([(W // 2 - 70, underline_y), (W // 2 + 70, underline_y)], fill=th["gold"], width=3)
    return underline_y  # so callers can place body text a fixed, tight gap below

def blocks_height(blocks):
    total = 0
    for _, font, _, gap in blocks:
        asc, desc = font.getmetrics(); total += asc + desc + gap
    return total

def footer(draw, W, H, th):
    f = F("sans", 30); text = "A P O L O G I A   D A I L Y"
    w = draw.textlength(text, font=f); draw.text(((W - w) // 2, H - 190), text, font=f, fill=th["gold"])
    f2 = F("serif", 30); t2 = "apologiadaily.com"; w2 = draw.textlength(t2, font=f2)
    draw.text(((W - w2) // 2, H - 145), t2, font=f2, fill=th["dim"])

def progress(draw, W, H, idx, n, th):
    r, gap = 7, 30; total = n * gap; x0 = (W - total) // 2 + gap // 2; y = H - 250
    for i in range(n):
        c = th["gold"] if i == idx else (70, 84, 110) if sum(th["top"]) < 200 else (180, 170, 150)
        draw.ellipse([x0 + i * gap - r, y - r, x0 + i * gap + r, y + r], fill=c)

def line_blocks(lines, th):
    out = []
    for ln in lines:
        if ln.get("t", "") == "":
            out.append((" ", F("serif", ln.get("s", 20)), th["top"], 0)); continue
        out.append((ln["t"], F(ln.get("f", "serif"), ln.get("s", 56)),
                    th.get(ln.get("c", "cream"), th["cream"]), ln.get("gap", 16)))
    return out

# ---- render all scenes ----
def render(spec, W, H, theme, frames_dir):
    th = THEMES[theme]; os.makedirs(frames_dir, exist_ok=True)
    scenes = spec["scenes"]; n = len(scenes); durs = []
    talkbg = spec.get("layout") == "talkbg"
    # optional full-bleed background image (cover-fit, darkened for caption legibility)
    base_bg = None
    bg_path = spec.get("bg_image")
    if bg_path:
        if not os.path.isabs(bg_path):
            bg_path = os.path.join(os.path.dirname(os.path.abspath(spec["__path__"])), bg_path) \
                if spec.get("__path__") else bg_path
        raw = ImageOps.fit(Image.open(bg_path).convert("RGB"), (W, H), Image.LANCZOS)
        base_bg = Image.blend(raw, Image.new("RGB", (W, H), th["top"]), spec.get("bg_dim", 0.5))
    for i, sc in enumerate(scenes):
        img = base_bg.copy() if base_bg is not None else gradient_bg(W, H, th)
        d = ImageDraw.Draw(img)
        has_k = bool(sc.get("kicker"))
        cy = int(H * 0.47)
        if talkbg:
            # single "talk-over" card: slogan anchored HIGH, lower two-thirds left
            # clear so the creator's own TikTok/CapCut captions have room. No
            # progress dots (you read a voiceover over one steady background).
            if sc.get("kicker"):
                f, spaced, w = measure_kicker(d, W, sc["kicker"])
                kicker_at(d, W, f, spaced, w, int(H * 0.10), th)
            big = [(x["t"], F(x.get("f", "serifb"), x.get("s", 92)),
                    th.get(x.get("c", "cream"), th["cream"]), 20) for x in sc.get("big", [])]
            top = int(H * (0.20 if sc.get("kicker") else 0.15))
            if big: center_block(d, W, big, cy, th["shadow"], top=top)
            if sc.get("sub"):
                sub = [(x["t"], F(x.get("f", "serif"), x.get("s", 42)),
                        th.get(x.get("c", "dim"), th["dim"]), 14) for x in sc["sub"]]
                center_block(d, W, sub, cy, th["shadow"], top=top + blocks_height(big) + int(H * 0.03))
            footer(d, W, H, th)
            img.save(os.path.join(frames_dir, f"scene_{i:02d}.png"))
            durs.append(float(sc.get("dur", 3.5)))
            continue
        if "big" in sc:
            if has_k:  # rare; keep the kicker at the top for full-bleed title cards
                f, spaced, w = measure_kicker(d, W, sc["kicker"])
                kicker_at(d, W, f, spaced, w, int(0.13 * H) if W < 1300 else 150, th)
            big = [(x["t"], F(x.get("f", "serifb"), x.get("s", 110)),
                    th.get(x.get("c", "cream"), th["cream"]), 18) for x in sc["big"]]
            center_block(d, W, big, cy - 60, th["shadow"])
            if sc.get("sub"):
                sub = [(x["t"], F(x.get("f", "serif"), x.get("s", 44)),
                        th.get(x.get("c", "dim"), th["dim"]), 14) for x in sc["sub"]]
                center_block(d, W, sub, cy + int(H * 0.14), th["shadow"])
        else:
            blocks = line_blocks(sc["lines"], th)
            if has_k:
                # center the WHOLE group (kicker -> underline -> body) so every scene's
                # content sits in the same central band as the title cards; the kicker
                # stays tight above its text (gap preserved), the unit just moves down
                f, spaced, w = measure_kicker(d, W, sc["kicker"])
                gap_under = int(H * 0.035)
                total_h = KICKER_H + gap_under + blocks_height(blocks)
                ky = int(H * 0.46) - total_h // 2
                underline_y = kicker_at(d, W, f, spaced, w, ky, th)
                center_block(d, W, blocks, cy, th["shadow"], top=underline_y + gap_under)
            else:
                center_block(d, W, blocks, cy, th["shadow"])
        footer(d, W, H, th); progress(d, W, H, i, n, th)
        img.save(os.path.join(frames_dir, f"scene_{i:02d}.png"))
        durs.append(float(sc.get("dur", 3.5)))
    return durs, n

# ---- encode ----
def encode(spec, W, H, frames_dir, clips_dir, out_path):
    os.makedirs(clips_dir, exist_ok=True)
    FPS = int(spec.get("fps", 30)); XF = float(spec.get("crossfade", 0.6))
    durs = spec["_durs"]; n = spec["_n"]
    clips = []
    for i, dsec in enumerate(durs):
        fr = int(round(dsec * FPS)); src = os.path.join(frames_dir, f"scene_{i:02d}.png")
        out = os.path.join(clips_dir, f"clip_{i:02d}.mp4")
        vf = (f"scale={W*2}:{H*2},zoompan=z='min(1+0.05*on/{fr},1.05)':"
              f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s={W}x{H}:fps={FPS},format=yuv420p")
        r = subprocess.run([FF, "-y", "-loop", "1", "-i", src, "-vf", vf, "-frames:v", str(fr),
                            "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                            "-pix_fmt", "yuv420p", "-r", str(FPS), out], capture_output=True, text=True)
        if r.returncode: sys.exit(f"clip {i} failed:\n{r.stderr[-1200:]}")
        clips.append((out, dsec))
    inputs, fc, prev, cum = [], [], "0:v", clips[0][1]
    for out, _ in clips: inputs += ["-i", out]
    for i in range(1, n):
        off = cum - XF; lbl = f"x{i}"
        fc.append(f"[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[{lbl}]")
        prev = lbl; cum = cum - XF + clips[i][1]
    cmd = [FF, "-y"] + inputs + (["-filter_complex", ";".join(fc), "-map", f"[{prev}]"] if n > 1
                                 else ["-map", "0:v"])
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", "-r", str(FPS), out_path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: sys.exit(f"xfade failed:\n{r.stderr[-1800:]}")
    return round(cum, 1)

# ---- CapCut kit: synced .srt captions + a voiceover script/timing sheet ----
# So a silent, made-elsewhere reel becomes a NATIVE, voiced video in one CapCut pass:
# drop the MP4 in, import the .srt as captions (already timed to the scenes), and run
# text-to-speech / record from the voiceover script. Native + spoken = far better reach
# than a silent static upload.
def _srt_ts(sec):
    if sec < 0: sec = 0
    ms = int(round(sec * 1000)); h = ms // 3600000; ms -= h * 3600000
    m = ms // 60000; ms -= m * 60000; s = ms // 1000; ms -= s * 1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def _mmss(sec):
    sec = int(round(sec)); return f"{sec // 60}:{sec % 60:02d}"

def _scene_caption(sc):
    parts = []
    if "big" in sc:
        parts += [b.get("t", "") for b in sc.get("big", [])]
        parts += [s.get("t", "") for s in sc.get("sub", [])]
    else:
        parts += [l.get("t", "") for l in sc.get("lines", [])]
    parts = [p.strip() for p in parts if p and p.strip()]
    return " ".join(parts)

def _scene_offsets(durs, xf):
    # start times on the crossfaded timeline (mirrors encode()'s xfade offsets)
    n = len(durs); offs = [0.0] * n; run = durs[0] if durs else 0.0
    for i in range(1, n):
        offs[i] = max(0.0, run - xf); run = run - xf + durs[i]
    return offs, run  # run == total length

def write_kit(spec, base, outdir, durs, xf):
    scenes = spec["scenes"]; n = len(scenes)
    offs, total = _scene_offsets(durs, xf)
    ends = [offs[i + 1] if i < n - 1 else total for i in range(n)]

    srt_path = os.path.join(outdir, f"{base}.srt")
    with open(srt_path, "w", encoding="utf-8") as f:
        for i in range(n):
            cap = _scene_caption(scenes[i]) or " "
            f.write(f"{i+1}\n{_srt_ts(offs[i])} --> {_srt_ts(ends[i])}\n{cap}\n\n")

    vo = (spec.get("voiceover") or "").strip()
    vo_path = os.path.join(outdir, f"{base}.voiceover.txt")
    with open(vo_path, "w", encoding="utf-8") as f:
        f.write("APOLOGIA DAILY — REEL VOICEOVER KIT\n")
        f.write(f"reel: {base}   ·   length: {_mmss(total)} ({total:.1f}s)   ·   {n} scenes\n")
        f.write("=" * 64 + "\n\n")
        f.write("HOW TO USE (makes the video NATIVE + spoken, which TikTok rewards):\n")
        f.write("  1. Open CapCut, drop in the MP4.\n")
        f.write("  2. Text-to-speech: paste the script below (or record it yourself).\n")
        f.write("  3. Captions: import the matching .srt (already timed to the scenes),\n")
        f.write("     or use CapCut Auto-captions once the voiceover is added.\n")
        f.write("  4. Add a trending sound low under the voice, then export to TikTok.\n\n")
        f.write("FULL VOICEOVER SCRIPT\n" + "-" * 64 + "\n")
        f.write((vo if vo else "(no voiceover text in this spec)") + "\n\n")
        f.write("SCENE TIMING (match your delivery to these windows)\n" + "-" * 64 + "\n")
        for i in range(n):
            f.write(f"[{i+1:2d}]  {_mmss(offs[i])}–{_mmss(ends[i])}   {_scene_caption(scenes[i])}\n")
    return srt_path, vo_path

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--out")
    ap.add_argument("--aspect", choices=list(ASPECTS))
    ap.add_argument("--theme", choices=list(THEMES))
    ap.add_argument("--pace", type=float, default=None,
                    help="multiply every scene's on-screen time (1.0 = spec; 1.5 = 50%% slower)")
    ap.add_argument("--no-kit", action="store_true",
                    help="skip writing the .srt + .voiceover.txt CapCut kit")
    ap.add_argument("--workdir")
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding="utf-8"))
    spec["__path__"] = a.spec  # so relative bg_image paths resolve against the spec's directory
    aspect = a.aspect or spec.get("aspect", "vertical")
    theme = a.theme or spec.get("theme", "navy")
    W, H = ASPECTS[aspect]
    base = os.path.splitext(os.path.basename(a.spec))[0]
    # default: save all finished reels into tools/reel/output/ (one predictable folder)
    outdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
    os.makedirs(outdir, exist_ok=True)
    out = a.out or os.path.join(outdir, f"{base}-{aspect}-{theme}.mp4")
    work = a.workdir or os.path.join(outdir, f".build_{base}_{aspect}_{theme}")
    frames_dir = os.path.join(work, "frames"); clips_dir = os.path.join(work, "clips")
    durs, n = render(spec, W, H, theme, frames_dir)
    pace = a.pace if a.pace is not None else float(spec.get("pace", 1.0))
    if pace != 1.0:
        durs = [round(d * pace, 3) for d in durs]
    spec["_durs"], spec["_n"] = durs, n
    total = encode(spec, W, H, frames_dir, clips_dir, out)
    print(f"OK  {out}  {W}x{H}  {theme}  {total}s  ({n} scenes)")
    if not a.no_kit:
        srt_path, vo_path = write_kit(spec, base, outdir, durs, float(spec.get("crossfade", 0.6)))
        print(f"KIT {srt_path}")
        print(f"KIT {vo_path}")

if __name__ == "__main__":
    main()
