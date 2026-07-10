#!/usr/bin/env python3
"""
Apologia Daily — branded quote-card generator (single still images).

Same navy/gold (or parchment) look as the reels, rendered to ONE PNG each — for
X / Instagram / Facebook feed posts. Reuses the reel engine's drawing + themes;
omits the progress dots (a still card is not a sequence). Keeps the footer.

Usage:
    python3 gen_card.py <spec.json> [--theme navy|parchment] [--aspect portrait|square|vertical|wide]

Spec: { "theme": "navy", "aspect": "portrait", "cards": [ <card>, ... ] }
A <card> is one scene in the reel-spec shape: either {"kicker","lines":[...]} or
{"big":[...],"sub":[...]}, plus an optional "name" for the output filename.
Output PNGs → tools/reel/output/cards/ by default.
"""
import os, json, argparse
import gen_reel as R
from PIL import ImageDraw

ASPECTS = dict(R.ASPECTS); ASPECTS["portrait"] = (1080, 1350)  # 4:5 — best for X + IG feed

def render_card(card, theme, aspect, out_path):
    W, H = ASPECTS[aspect]
    th = R.THEMES[theme]
    img = R.gradient_bg(W, H, th)
    d = ImageDraw.Draw(img)
    cy = int(H * 0.47)
    has_k = bool(card.get("kicker"))
    if "big" in card:
        if has_k:
            f, spaced, w = R.measure_kicker(d, W, card["kicker"])
            R.kicker_at(d, W, f, spaced, w, int(0.12 * H), th)
        big = [(x["t"], R.F(x.get("f", "serifb"), x.get("s", 108)),
                th.get(x.get("c", "cream"), th["cream"]), 18) for x in card["big"]]
        R.center_block(d, W, big, cy - 30, th["shadow"])
        if card.get("sub"):
            sub = [(x["t"], R.F(x.get("f", "serif"), x.get("s", 44)),
                    th.get(x.get("c", "dim"), th["dim"]), 14) for x in card["sub"]]
            R.center_block(d, W, sub, cy + int(H * 0.17), th["shadow"])
    else:
        blocks = R.line_blocks(card["lines"], th)
        if has_k:
            f, spaced, w = R.measure_kicker(d, W, card["kicker"])
            gap_under = int(H * 0.035)
            total_h = R.KICKER_H + gap_under + R.blocks_height(blocks)
            ky = int(H * 0.46) - total_h // 2
            underline_y = R.kicker_at(d, W, f, spaced, w, ky, th)
            R.center_block(d, W, blocks, cy, th["shadow"], top=underline_y + gap_under)
        else:
            R.center_block(d, W, blocks, cy, th["shadow"])
    R.footer(d, W, H, th)
    img.save(out_path)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--theme")
    ap.add_argument("--aspect", choices=list(ASPECTS))
    ap.add_argument("--outdir")
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding="utf-8"))
    theme = a.theme or spec.get("theme", "navy")
    aspect = a.aspect or spec.get("aspect", "portrait")
    outdir = a.outdir or os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", "cards")
    os.makedirs(outdir, exist_ok=True)
    for i, card in enumerate(spec["cards"]):
        name = card.get("name", "card-%02d" % (i + 1))
        out = os.path.join(outdir, "%s-%s-%s.png" % (name, aspect, theme))
        render_card(card, theme, aspect, out)
        print("OK  " + out)

if __name__ == "__main__":
    main()
