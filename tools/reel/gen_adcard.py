#!/usr/bin/env python3
"""
gen_adcard.py — paid-social / feed CREATIVE generator for Apologia Daily.

Sibling of gen_xcard.py (1600x900 X landscape). This one builds FEED-RATIO
creatives for Meta / Instagram placements:

    --ratio 4x5      1080x1350   (default; best-performing feed ratio)
    --ratio 1x1      1080x1080
    --ratio 9x16     1080x1920   (story / reel cover)

Same brand furniture as the X card so the two read as one family: night-sky
navy gradient, soft moon + glow, mountain silhouettes, gold underlined kicker,
italic-serif headline (cream line + gold line), sans sub-lines, and the shield
logo + apologiadaily.com.

⚠ DELIBERATELY NO APP-STORE BADGES. Apologia Daily has no app in either store
(ios/ and android/ are scaffolded but unsubmitted — see docs/APP_STORE.md), so
a creative may not imply one exists. The call to action is the website.

Usage:
    python3 gen_adcard.py <spec.json> [--ratio 4x5|1x1|9x16] [--outdir DIR]

Spec (JSON), in tools/reel/adcards/:
  {
    "name": "library-free",
    "kicker": "FREE. NO ACCOUNT NEEDED.",
    "headline": [ {"t": "Someone asked you", "c": "cream"},
                  {"t": "a question.",       "c": "gold"} ],
    "sub":   [ "85 cited deep dives. 102 short answers.",
               "133 primary sources, checked word for word." ],
    "points": [ "Every essay reviewed before it is published",
                "The creeds and Church Fathers, verified",
                "Free to read — nothing behind a paywall" ],
    "cta": "apologiadaily.com"
  }

Output → tools/reel/output/cards/<name>-<ratio>-ad.png
"""
import os, json, argparse, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))

RATIOS = {"4x5": (1080, 1350), "1x1": (1080, 1080), "9x16": (1080, 1920)}

GOLD  = (201, 168, 80)
CREAM = (247, 242, 231)
SUB   = (206, 212, 222)
DIM   = (150, 160, 176)
COL   = {"gold": GOLD, "cream": CREAM, "sub": SUB, "dim": DIM}


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


def background(W, H):
    """Night sky: vertical navy gradient, moon + glow upper-right, mountains along the base."""
    img = Image.new("RGB", (W, H))
    px = img.load()
    top, bot = (8, 16, 31), (17, 30, 55)
    for y in range(H):
        t = y / max(1, H - 1)
        r = int(top[0] + (bot[0] - top[0]) * t)
        g = int(top[1] + (bot[1] - top[1]) * t)
        b = int(top[2] + (bot[2] - top[2]) * t)
        for x in range(W):
            px[x, y] = (r, g, b)

    # moon glow
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    mx, my = int(W * 0.80), int(H * 0.14)
    gd.ellipse([mx - 230, my - 230, mx + 230, my + 230], fill=(62, 76, 106))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    img = Image.blend(img, Image.blend(img, glow, 0.55), 0.75)

    d = ImageDraw.Draw(img)
    d.ellipse([mx - 17, my - 17, mx + 17, my + 17], fill=(242, 238, 226))

    # mountain silhouettes, proportional to canvas
    base = H
    d.polygon([(0, base), (0, H * 0.70), (W * 0.30, H * 0.555),
               (W * 0.60, base)], fill=(10, 17, 30))
    d.polygon([(W * 0.36, base), (W * 0.66, H * 0.595), (W * 0.94, base)],
              fill=(7, 13, 24))
    d.polygon([(W * 0.74, base), (W * 0.92, H * 0.655), (W, H * 0.70), (W, base)],
              fill=(6, 10, 20))
    return img


def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= maxw:
            cur = trial
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines


def render(spec, W, H, out_path):
    img = background(W, H)
    d = ImageDraw.Draw(img)
    M = int(W * 0.089)                      # margin, ~96 at 1080
    maxw = W - 2 * M
    y = int(H * 0.115)

    # kicker + underline
    if spec.get("kicker"):
        t = " ".join(spec["kicker"].upper())
        sz = int(W * 0.0255)                       # auto-shrink so it never clips the frame
        f = Fsans(sz, bold=True)
        while sz > 10 and d.textlength(t, font=f) > maxw:
            sz -= 1
            f = Fsans(sz, bold=True)
        d.text((M, y), t, font=f, fill=GOLD)
        y += int(W * 0.040)
        d.line([(M, y), (M + int(W * 0.20), y)], fill=GOLD, width=2)
        y += int(W * 0.055)

    # headline — italic serif, one cream line then one gold line
    # one line per headline entry: shrink to fit rather than wrap, so the
    # cream/gold pairing always reads as two balanced lines.
    hsz = int(W * 0.078)
    hf = Fserif(hsz, bold=False)
    while hsz > 28 and any(d.textlength(ln["t"], font=hf) > maxw for ln in spec["headline"]):
        hsz -= 2
        hf = Fserif(hsz, bold=False)
    for ln in spec["headline"]:
        d.text((M, y), ln["t"], font=hf, fill=COL.get(ln.get("c", "cream"), CREAM))
        y += int(hsz * 1.18)
    y += int(H * 0.020)

    # sub-lines
    sf = Fsans(int(W * 0.0295), bold=False)
    for s in spec.get("sub", []):
        d.text((M, y), s, font=sf, fill=SUB)
        y += int(W * 0.046)

    # bullet points, gold rule + text
    if spec.get("points"):
        y += int(H * 0.022)
        pf = Fsans(int(W * 0.0275), bold=False)
        for p in spec["points"]:
            d.line([(M, y + int(W * 0.017)), (M + int(W * 0.028), y + int(W * 0.017))],
                   fill=GOLD, width=3)
            d.text((M + int(W * 0.045), y), p, font=pf, fill=CREAM)
            y += int(W * 0.052)

    # footer: shield logo + call to action
    ly = H - int(H * 0.105)
    try:
        logo = Image.open(os.path.join(ROOT, "apple-touch-icon.png")).convert("RGBA")
        sz = int(W * 0.085)
        logo = logo.resize((sz, sz), Image.LANCZOS)
        img.paste(logo, (M, ly - int(sz * 0.22)), logo)
        tx = M + sz + int(W * 0.028)
    except Exception:
        tx = M

    cf = Fserif(int(W * 0.040), bold=True)
    d.text((tx, ly), spec.get("cta", "apologiadaily.com"), font=cf, fill=GOLD)

    img.save(out_path, "PNG")
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--ratio", choices=list(RATIOS), default="4x5")
    ap.add_argument("--outdir", default=os.path.join(HERE, "output", "cards"))
    a = ap.parse_args()

    spec = json.load(open(a.spec, encoding="utf-8"))
    W, H = RATIOS[a.ratio]
    os.makedirs(a.outdir, exist_ok=True)
    name = spec.get("name") or os.path.splitext(os.path.basename(a.spec))[0]
    out = os.path.join(a.outdir, f"{name}-{a.ratio}-ad.png")
    render(spec, W, H, out)
    print(f"OK  {out}  {W}x{H}")


if __name__ == "__main__":
    main()
