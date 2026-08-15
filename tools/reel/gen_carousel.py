#!/usr/bin/env python3
"""
Apologia Daily — Instagram / LinkedIn CAROUSEL generator (a numbered card sequence).

Sits between gen_reel.py (a video) and gen_card.py (one still): a carousel is an
ORDERED set of stills, so unlike a single card it carries a slide counter, and
unlike a reel it has no timing. Everything else — the navy/parchment themes, the
gold underlined kicker, the serif blocks, the footer — is the reel engine's, so a
carousel is visually the same brand object as every other Apologia Daily asset.

Usage:
    python3 gen_carousel.py <spec.json> [--theme navy|parchment]
                                        [--aspect portrait|square|vertical|wide]
                                        [--outdir DIR]

Spec (JSON):
  {
    "reviewed": {"argument": "<date>", "orthodoxy": "<date>", "by": "..."},
    "name": "messianic-prophecy",
    "theme": "navy", "aspect": "portrait",
    "slides": [ <slide>, ... ]
  }
A <slide> is one scene in the reel-spec shape — either {"kicker","lines":[...]}
or {"big":[...],"sub":[...]} — plus an optional "ref" (a small gold scripture
citation under the block). Slides are numbered in order; the last one gets no
swipe cue.

Carousel specs live in tools/reel/carousels/ and are DOCTRINAL CONTENT: they
carry the same compressed argument a reel or a pocket card does, so they go
through the mandatory pipeline (argument + orthodoxy, + neutrality on the
deity/Trinity/Islam tier) and record it in "reviewed", exactly like a reel spec.

Output PNGs → tools/reel/output/carousels/<name>/<nn>.png (git-ignored).
"""
import os, json, argparse
import gen_reel as R
from PIL import ImageDraw

ASPECTS = dict(R.ASPECTS)
ASPECTS["portrait"] = (1080, 1350)   # 4:5 — the tallest frame Instagram will show in-feed


def slide_counter(d, W, H, idx, n, th):
    """'03 / 10' bottom-right, and a swipe cue bottom-left on every slide but the last."""
    f = R.F("sans", 28)
    txt = "%02d / %02d" % (idx + 1, n)
    w = d.textlength(txt, font=f)
    d.text((W - w - 64, H - 190), txt, font=f, fill=th["gold"])
    if idx < n - 1:
        cue = "SWIPE  →"
        d.text((64, H - 190), cue, font=f, fill=th["dim"])


def render_slide(slide, theme, aspect, idx, n, out_path):
    W, H = ASPECTS[aspect]
    th = R.THEMES[theme]
    img = R.gradient_bg(W, H, th)
    d = ImageDraw.Draw(img)
    cy = int(H * 0.47)
    has_k = bool(slide.get("kicker"))

    if "big" in slide:
        if has_k:
            f, spaced, w = R.measure_kicker(d, W, slide["kicker"])
            R.kicker_at(d, W, f, spaced, w, int(0.12 * H), th)
        big = [(x["t"], R.F(x.get("f", "serifb"), x.get("s", 96)),
                th.get(x.get("c", "cream"), th["cream"]), 18) for x in slide["big"]]
        R.center_block(d, W, big, cy - 30, th["shadow"])
        if slide.get("sub"):
            sub = [(x["t"], R.F(x.get("f", "serif"), x.get("s", 40)),
                    th.get(x.get("c", "dim"), th["dim"]), 14) for x in slide["sub"]]
            R.center_block(d, W, sub, cy + int(H * 0.17), th["shadow"])
    else:
        blocks = R.line_blocks(slide["lines"], th)
        if has_k:
            f, spaced, w = R.measure_kicker(d, W, slide["kicker"])
            gap_under = int(H * 0.035)
            total_h = R.KICKER_H + gap_under + R.blocks_height(blocks)
            ky = int(H * 0.46) - total_h // 2
            underline_y = R.kicker_at(d, W, f, spaced, w, ky, th)
            R.center_block(d, W, blocks, cy, th["shadow"], top=underline_y + gap_under)
        else:
            R.center_block(d, W, blocks, cy, th["shadow"])

    if slide.get("ref"):
        R.ref_line(d, W, H, slide["ref"], th)
    slide_counter(d, W, H, idx, n, th)
    R.footer(d, W, H, th)
    img.save(out_path)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--theme", choices=list(R.THEMES))
    ap.add_argument("--aspect", choices=list(ASPECTS))
    ap.add_argument("--outdir")
    a = ap.parse_args()

    spec = json.load(open(a.spec, encoding="utf-8"))
    theme = a.theme or spec.get("theme", "navy")
    aspect = a.aspect or spec.get("aspect", "portrait")
    name = spec.get("name") or os.path.splitext(os.path.basename(a.spec))[0]
    outdir = a.outdir or os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                      "output", "carousels", name)
    os.makedirs(outdir, exist_ok=True)

    slides = spec["slides"]
    for i, slide in enumerate(slides):
        out = os.path.join(outdir, "%02d.png" % (i + 1))
        render_slide(slide, theme, aspect, i, len(slides), out)
        print("OK  " + out)


if __name__ == "__main__":
    main()
