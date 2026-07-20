#!/usr/bin/env python3
"""
Apologia Daily — X / social share-card generator (THE standard style).

The bespoke look established for X posts: a night-sky navy scene (soft moon + glow
top-right, dark mountain silhouettes along the bottom), a left-aligned gold kicker
with an underline, an *italic serif* headline (a cream line + a gold line), a sans
sub-line, and the shield logo + apologiadaily.com bottom-left. 1600x900 (X landscape).

Usage:
    python3 gen_xcard.py <spec.json> [--outdir DIR]

Spec (JSON):
  {
    "name": "luckhoo",
    "kicker": "245 STRAIGHT ACQUITTALS",
    "headline": [ {"t": "He put the resurrection", "c": "cream"},
                  {"t": "on trial.",               "c": "gold"} ],
    "sub": [ "History's most successful lawyer weighed the case",
             "for the resurrection — and returned his verdict." ]
  }
X-card specs live in tools/reel/xcards/ (NOT tools/reel/specs/, which the
content-review gate treats as doctrinal reel scripts). Output → tools/reel/output/cards/<name>-xcard.png
"""
import os, sys, json, argparse, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))

W, H = 1600, 900
MARGIN = 96

GOLD  = (201, 168, 80)
CREAM = (247, 242, 231)
SUB   = (206, 212, 222)
DIM   = (150, 160, 176)

# fonts (Liberation Serif Italic ≈ an elegant italic serif; DejaVu Sans for the kicker/sub)
def _find(*cands):
    for c in cands:
        if os.path.exists(c):
            return c
    return cands[-1]
SERIF_IT  = _find("/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf")
SERIF_BIT = _find("/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf", SERIF_IT)
SANS      = _find("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
SANS_B    = _find("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
def Fserif(sz, bold=False): return ImageFont.truetype(SERIF_BIT if bold else SERIF_IT, sz)
def Fsans(sz, bold=True):   return ImageFont.truetype(SANS_B if bold else SANS, sz)

COL = {"gold": GOLD, "cream": CREAM, "sub": SUB, "dim": DIM}


def background():
    # vertical navy gradient, a touch lighter toward the lower-left
    img = Image.new("RGB", (W, H))
    px = img.load()
    top, bot = (8, 16, 31), (17, 30, 55)
    for y in range(H):
        u = y / (H - 1)
        c = tuple(int(top[i] + (bot[i] - top[i]) * u) for i in range(3))
        for x in range(W):
            px[x, y] = c
    # lower-left cool glow
    glow = Image.new("L", (W, H), 0); gd = ImageDraw.Draw(glow)
    gd.ellipse([-300, H - 520, 720, H + 260], fill=42)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img = Image.composite(Image.new("RGB", (W, H), (30, 48, 84)), img, glow)

    # moon glow (top-right), warm white
    mg = Image.new("L", (W, H), 0); md = ImageDraw.Draw(mg)
    mx, my = 1300, 176
    for rr in range(230, 0, -6):
        md.ellipse([mx - rr, my - rr, mx + rr, my + rr], fill=int(60 * (1 - rr / 230)))
    mg = mg.filter(ImageFilter.GaussianBlur(70))
    img = Image.composite(Image.new("RGB", (W, H), (232, 226, 198)), img, mg)
    d = ImageDraw.Draw(img)
    d.ellipse([mx - 15, my - 15, mx + 15, my + 15], fill=(244, 238, 214))       # moon disc
    d.ellipse([1052, 556, 1060, 564], fill=(210, 214, 224))                     # faint star

    # mountain silhouettes (dark navy), right-weighted
    dark = (5, 11, 22)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    od.polygon([(150, H), (470, 545), (760, H)], fill=dark + (255,))            # left-center peak
    od.polygon([(560, H), (980, 470), (1360, H)], fill=(4, 9, 18, 255))          # tall central peak
    od.polygon([(1230, H), (1230, 628), (1400, 596), (1600, 648), (1600, H)],    # right mass
               fill=(3, 8, 16, 255))
    img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")
    return img


def draw_kicker(d, text, y):
    f = Fsans(27)
    spaced = "  ".join(list(text.upper()))
    d.text((MARGIN, y), spaced, font=f, fill=GOLD)
    ky = y + 44
    d.line([(MARGIN, ky), (MARGIN + 300, ky)], fill=GOLD, width=3)
    return ky


def render(spec, out_path):
    img = background()
    d = ImageDraw.Draw(img)

    y = 118
    if spec.get("kicker"):
        draw_kicker(d, spec["kicker"], y)
    # headline (italic serif, left-aligned, big)
    hy = 250
    for ln in spec["headline"]:
        f = Fserif(108)
        d.text((MARGIN + 2, hy + 3), ln["t"], font=f, fill=(0, 0, 0))           # shadow
        d.text((MARGIN, hy), ln["t"], font=f, fill=COL.get(ln.get("c", "cream"), CREAM))
        hy += 128
    # sub (sans, lighter)
    sy = hy + 22
    for s in spec.get("sub", []):
        f = Fsans(34, bold=False)
        d.text((MARGIN, sy), s, font=f, fill=SUB)
        sy += 50

    # logo + url, bottom-left
    try:
        logo = Image.open(os.path.join(ROOT, "apple-touch-icon.png")).convert("RGBA")
        logo = logo.resize((96, 96), Image.LANCZOS)
        img.paste(logo, (MARGIN, H - 168), logo)
        d = ImageDraw.Draw(img)
    except Exception:
        pass
    d.text((MARGIN + 120, H - 148), "apologiadaily.com", font=Fserif(44), fill=GOLD)

    img.save(out_path)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--outdir", default=os.path.join(HERE, "output", "cards"))
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding="utf-8"))
    os.makedirs(a.outdir, exist_ok=True)
    name = spec.get("name", "xcard")
    out = os.path.join(a.outdir, f"{name}-xcard.png")
    render(spec, out)
    print("OK  " + out)


if __name__ == "__main__":
    main()
