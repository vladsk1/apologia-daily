#!/usr/bin/env python3
"""
gen_youtube_art.py — the Apologia Daily YouTube channel look, in the site's own
night-sky navy / gold brand (same scene language as gen_xcard.py: navy gradient,
warm moon glow top-right, dark mountain silhouettes, shield logo, gold accents).

Outputs (to tools/reel/output/youtube/):
  youtube-banner.png   2560x1440  — channel banner. All essential text/logo sits
                                     inside the centred 1546x423 "safe area" that
                                     shows on phones; the wider frame fills out
                                     desktop and TV.
  youtube-avatar.png    800x800    — channel picture (displays as a circle).

Text uses the site's existing live wording only (name + the homepage tagline +
the domain), so no new copy is introduced. Regenerate any time; the PNGs are
git-ignored, the script is the source of truth.

    python3 tools/reel/gen_youtube_art.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(HERE, "output", "youtube")

GOLD  = (201, 168, 80)
CREAM = (247, 242, 231)
SUB   = (206, 212, 222)


def _find(*c):
    for p in c:
        if os.path.exists(p):
            return p
    return c[-1]


SERIF_IT  = _find("/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf")
SERIF_BIT = _find("/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf", SERIF_IT)
SERIF_B   = _find("/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf")
SANS      = _find("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
SANS_B    = _find("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")


def Fserif(sz, bold=True): return ImageFont.truetype(SERIF_BIT if bold else SERIF_IT, sz)
def Fserifup(sz):          return ImageFont.truetype(SERIF_B, sz)   # upright bold serif (the wordmark)
def Fsans(sz, bold=True):  return ImageFont.truetype(SANS_B if bold else SANS, sz)


def scene(W, H, moon=(0.81, 0.20)):
    """Navy gradient + lower glow + moon + mountains, scaled to any 16:9-ish size."""
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
    gd.ellipse([-int(.19 * W), H - int(.58 * H), int(.45 * W), H + int(.29 * H)], fill=42)
    glow = glow.filter(ImageFilter.GaussianBlur(int(.1 * W)))
    img = Image.composite(Image.new("RGB", (W, H), (30, 48, 84)), img, glow)
    # moon glow, warm white, top-right
    mx, my = int(moon[0] * W), int(moon[1] * H)
    R = int(.16 * W)
    mg = Image.new("L", (W, H), 0); md = ImageDraw.Draw(mg)
    for rr in range(R, 0, -max(1, R // 40)):
        md.ellipse([mx - rr, my - rr, mx + rr, my + rr], fill=int(60 * (1 - rr / R)))
    mg = mg.filter(ImageFilter.GaussianBlur(int(.045 * W)))
    img = Image.composite(Image.new("RGB", (W, H), (232, 226, 198)), img, mg)
    d = ImageDraw.Draw(img)
    r = max(8, int(.009 * W))
    d.ellipse([mx - r, my - r, mx + r, my + r], fill=(244, 238, 214))
    # mountains
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    od.polygon([(int(.09 * W), H), (int(.29 * W), int(.60 * H)), (int(.48 * W), H)], fill=(5, 11, 22, 255))
    od.polygon([(int(.35 * W), H), (int(.61 * W), int(.52 * H)), (int(.85 * W), H)], fill=(4, 9, 18, 255))
    od.polygon([(int(.77 * W), H), (int(.77 * W), int(.70 * H)), (int(.875 * W), int(.66 * H)),
                (W, int(.72 * H)), (W, H)], fill=(3, 8, 16, 255))
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")


def _shield_pts(cx, ty, sw, sh):
    l, r = cx - sw / 2, cx + sw / 2
    shoulder = ty + 0.52 * sh
    return [(l, ty + 0.07 * sh), (l, ty), (r, ty), (r, ty + 0.07 * sh),
            (r, shoulder), (cx, ty + sh), (l, shoulder)]


def draw_shield(img, cx, ty, sw, sh):
    """The Apologia Daily gold shield-and-cross, matching the social logo:
    a double-outlined shield with a slender cross, drawn vector so it stays
    crisp and composites seamlessly on the navy scene."""
    d = ImageDraw.Draw(img, "RGBA")
    d.polygon(_shield_pts(cx, ty, sw, sh), fill=(19, 34, 62, 255),
              outline=GOLD, width=max(3, int(sw * .042)))
    # inner hairline border, inset
    ins = sw * 0.11
    d.polygon(_shield_pts(cx, ty + 0.055 * sh, sw - 2 * ins, sh - 2.1 * ins),
              outline=(176, 149, 84, 255), width=max(2, int(sw * .016)))
    # slender cross, upper-weighted
    vw = sw * 0.115
    d.rectangle([cx - vw / 2, ty + 0.155 * sh, cx + vw / 2, ty + 0.82 * sh], fill=GOLD)
    hy = ty + 0.33 * sh
    d.rectangle([cx - sw * 0.205, hy, cx + sw * 0.205, hy + vw], fill=GOLD)


def centered(d, cx, y, text, font, fill):
    w = d.textlength(text, font=font)
    d.text((cx - w / 2, y), text, font=font, fill=fill)
    return w


def banner():
    W, H = 2560, 1440
    img = scene(W, H)
    d = ImageDraw.Draw(img)
    cx = W // 2
    # everything below sits inside the centred 1546x423 mobile-safe box (y 508..931)
    y = 500
    sh = real_shield(190)
    img.paste(sh, (cx - sh.width // 2, y), sh); d = ImageDraw.Draw(img)
    y += 214
    # wordmark: "Apologia" cream + " Daily" gold, centred as one line
    f = Fserif(118)
    a, b = "Apologia", " Daily"
    wa, wb = d.textlength(a, font=f), d.textlength(b, font=f)
    x0 = cx - (wa + wb) / 2
    d.text((x0, y), a, font=f, fill=CREAM)
    d.text((x0 + wa, y), b, font=f, fill=GOLD)
    y += 150
    # gold rule
    d.rectangle([cx - 120, y, cx + 120, y + 3], fill=GOLD)
    y += 34
    centered(d, cx, y, "Defend Your Faith with Reason & Evidence", Fsans(40, bold=False), SUB)
    y += 70
    centered(d, cx, y, "APOLOGIADAILY.COM", Fsans(30), GOLD)
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, "youtube-banner.png")
    img.save(p); return p


def real_shield(target_h):
    """The ACTUAL gold shield-and-cross from the social logo (pwa-icon-512.png),
    lifted out of its navy background by luminance so only the gold linework
    remains on transparency — the exact mark used on X/Instagram, ready to sit on
    the banner scene. The shield's interior stays open, so the scene shows through
    it just as the navy does in the logo."""
    ic = Image.open(os.path.join(ROOT, "pwa-icon-512.png")).convert("RGB")
    crop = ic.crop((140, 55, 372, 345))              # shield only (above the wordmark, inside the brackets)
    lum = crop.convert("L")
    lo, hi = 62, 112                                  # navy < lo -> transparent; gold > hi -> opaque
    alpha = lum.point(lambda v: 0 if v < lo else (255 if v > hi else int((v - lo) / (hi - lo) * 255)))
    rgba = crop.convert("RGBA"); rgba.putalpha(alpha)
    w, h = rgba.size
    return rgba.resize((int(w * target_h / h), target_h), Image.LANCZOS)


def clean_icon(S):
    """The real social logo (pwa-icon-512.png), scaled to S and with the four
    corner registration brackets painted out in the icon's own corner-navy — so
    it reads as a clean square logo. This is literally the mark used on X and
    Instagram, tidied for a profile picture."""
    ic = Image.open(os.path.join(ROOT, "pwa-icon-512.png")).convert("RGB")
    corner = ic.getpixel((5, 5))            # flat navy in the very corner
    ic = ic.resize((S, S), Image.LANCZOS)
    d = ImageDraw.Draw(ic)
    m = int(S * 0.135)
    for x0, y0, x1, y1 in [(0, 0, m, m), (S - m, 0, S, m), (0, S - m, m, S), (S - m, S - m, S, S)]:
        d.rectangle([x0, y0, x1, y1], fill=corner)
    return ic


def avatar():
    S = 800
    img = clean_icon(S)          # the genuine logo, brackets removed
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, "youtube-avatar.png")
    img.save(p)
    # circular preview so you see what YouTube crops the square to
    mask = Image.new("L", (S, S), 0); ImageDraw.Draw(mask).ellipse([0, 0, S, S], fill=255)
    circ = Image.new("RGBA", (S, S), (0, 0, 0, 0)); circ.paste(img.convert("RGB"), (0, 0), mask)
    circ.save(os.path.join(OUT, "youtube-avatar-circle-preview.png"))
    return p


def clean_logo():
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, "apologia-logo.png")
    clean_icon(1024).save(p)
    return p


if __name__ == "__main__":
    print("banner :", banner())
    print("avatar :", avatar())
    print("logo   :", clean_logo())
