#!/usr/bin/env python3
"""
gen_thumbnails.py — a branded YouTube thumbnail (1280x720) for each mapped video
lesson, in the Apologia Daily night-sky navy/gold style. The headline is the
reel's own opening question; a small shield + wordmark sits above it, the domain
below.

Reads ../../library/video-lessons.json for the essay->reel map and each reel's
opening scene text from specs/. Writes to tools/reel/output/lessons/<essay>-thumb.png
(git-ignored). Upload one as a video's custom thumbnail; it also becomes the
poster image the on-site essay card shows before play.

    python3 tools/reel/gen_thumbnails.py [--only essay1,essay2]
"""
import argparse
import json
import os
import sys

from PIL import ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gen_youtube_art as art  # scene(), real_shield(), fonts, colours

ROOT = art.ROOT
SPECS = os.path.join(HERE, "specs")
MAP = os.path.join(ROOT, "library", "video-lessons.json")
OUT = os.path.join(HERE, "output", "lessons")

COL = {"cream": art.CREAM, "gold": art.GOLD, "sub": art.SUB, "dim": (150, 160, 176)}


def headline_lines(spec):
    """The reel's opening on-screen text, as 1-3 short headline lines."""
    sc = spec["scenes"][0]
    items = sc.get("big") or sc.get("lines") or []
    out = []
    for it in items:
        t = (it.get("t") or "").strip()
        if t:
            out.append((t, it.get("c", "cream")))
    return out[:3]


def make(slug, reel):
    spec_path = os.path.join(SPECS, reel + ".json")
    if not os.path.exists(spec_path):
        sys.stderr.write("  ! no spec: %s\n" % spec_path); return None
    with open(spec_path, encoding="utf-8") as f:
        spec = json.load(f)
    W, H = 1280, 720
    img = art.scene(W, H)
    d = ImageDraw.Draw(img)
    cx = W // 2

    # shield + wordmark, top
    sh = art.real_shield(96)
    img.paste(sh, (cx - sh.width // 2, 44), sh); d = ImageDraw.Draw(img)
    f = art.Fsans(26)
    spaced = "   ".join(list("APOLOGIA DAILY"))
    w = d.textlength(spaced, font=f)
    d.text((cx - w / 2, 150), spaced, font=f, fill=art.GOLD)

    # headline (italic serif, big, centred block)
    lines = headline_lines(spec)
    if not lines:
        lines = [(spec.get("source", "Apologia Daily")[:28], "cream")]
    fs = 92 if len(lines) <= 2 else 76
    fnt = art.Fserif(fs, bold=True)
    # shrink to fit width if needed
    while fs > 48 and max(d.textlength(t, font=fnt) for t, _ in lines) > W - 150:
        fs -= 6; fnt = art.Fserif(fs, bold=True)
    block_h = len(lines) * (fs + 14)
    y = (H - block_h) // 2 + 40
    for t, c in lines:
        tw = d.textlength(t, font=fnt)
        col = COL.get(c, art.CREAM)
        d.text((cx - tw / 2 + 2, y + 3), t, font=fnt, fill=(0, 0, 0))       # shadow
        d.text((cx - tw / 2, y), t, font=fnt, fill=col)
        y += fs + 14

    # domain, bottom
    f2 = art.Fsans(28)
    u = "APOLOGIADAILY.COM"
    w2 = d.textlength(u, font=f2)
    d.text((cx - w2 / 2, H - 66), u, font=f2, fill=art.GOLD)

    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, slug + "-thumb.png")
    img.save(p)
    return p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    with open(MAP, encoding="utf-8") as f:
        lessons = json.load(f)["lessons"]
    only = set(s.strip() for s in a.only.split(",") if s.strip())
    if only:
        lessons = {k: v for k, v in lessons.items() if k in only}
    n = 0
    for slug, e in sorted(lessons.items()):
        p = make(slug, e["reel"])
        if p:
            print("→", os.path.basename(p)); n += 1
    print("Done: %d thumbnail(s) → %s" % (n, OUT))


if __name__ == "__main__":
    main()
