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

def swipe_cue(d, W, H, th, text="S W I P E  \u2192"):
    """Carousel affordance. Same placement/treatment as gen_reel.keep_watching — the
    'there is more coming' nudge — so a carousel reads as one house artefact with the
    reels. Drawn on every card EXCEPT the last: a swipe arrow on the final slide
    points at nothing."""
    f = R.F("sans", 30)
    w = d.textlength(text, font=f)
    d.text(((W - w) // 2, H - 268), text, font=f, fill=th["gold"])

def render_card(card, theme, aspect, out_path, swipe=False):
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
    if swipe:
        swipe_cue(d, W, H, th)
    R.footer(d, W, H, th)
    img.save(out_path)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--theme")
    ap.add_argument("--aspect", choices=list(ASPECTS))
    ap.add_argument("--outdir")
    ap.add_argument("--swipe", action="store_true",
                    help="carousel mode: draw a SWIPE cue on every card except the last")
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding="utf-8"))
    theme = a.theme or spec.get("theme", "navy")
    aspect = a.aspect or spec.get("aspect", "portrait")
    outdir = a.outdir or os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", "cards")
    os.makedirs(outdir, exist_ok=True)
    cards = spec["cards"]
    # Spec-level "swipe": true marks the file as a carousel; --swipe forces it.
    carousel = a.swipe or bool(spec.get("swipe"))
    for i, card in enumerate(cards):
        name = card.get("name", "card-%02d" % (i + 1))
        out = os.path.join(outdir, "%s-%s-%s.png" % (name, aspect, theme))
        # last card never gets the cue; a per-card "swipe" key overrides either way
        sw = card.get("swipe", carousel and i < len(cards) - 1)
        render_card(card, theme, aspect, out, swipe=sw)
        print("OK  %s%s" % (out, "   [swipe]" if sw else ""))

if __name__ == "__main__":
    main()
