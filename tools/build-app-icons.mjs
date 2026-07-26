#!/usr/bin/env node
/**
 * build-app-icons.mjs — generate the SOURCE art for native app icons/splash.
 *
 * Produces app/assets/{icon.png, splash.png, splash-dark.png} from the existing
 * brand icon, then `npm run assets` (@capacitor/assets) fans those out into every
 * iOS/Android size. Run: node tools/build-app-icons.mjs
 *
 * NOTE ON SOURCE RESOLUTION: the best brand art in the repo is 512x512
 * (pwa-icon-512.png), and the stores want a 1024x1024 icon, so this upscales
 * with Lanczos. That is fine for a flat vector-style mark but a true 1024x1024
 * (or SVG) export from the original design file would be sharper — see
 * docs/APP_STORE.md. Delegates the pixel work to Pillow (already used by the
 * reel generator).
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PY = `
import os
from PIL import Image, ImageDraw

ROOT = ${JSON.stringify(ROOT)}
OUT  = os.path.join(ROOT, 'app', 'assets')
os.makedirs(OUT, exist_ok=True)

NAVY = (10, 22, 40)          # #0a1628 — brand background / theme color
src  = Image.open(os.path.join(ROOT, 'pwa-icon-512.png')).convert('RGB')

# ---- 1) App icon: 1024x1024, fully opaque, no alpha (App Store requirement) ----
icon = src.resize((1024, 1024), Image.LANCZOS)
flat = Image.new('RGB', (1024, 1024), NAVY)
flat.paste(icon, (0, 0))
flat.save(os.path.join(OUT, 'icon.png'), 'PNG')

# ---- 2) Splash: 2732x2732 (Capacitor's required source size) ----
# The icon art carries its own navy panel, a lighter inner oval, corner brackets
# and a stray speck, so pasting it flat leaves a visible square patch on the
# splash. Instead LIFT JUST THE ARTWORK off its background by luminance: the
# gold/white marks measure ~169-255 while the navy panel, oval and artifacts sit
# at ~20-32, so a soft ramp between those bands keeps the shield, cross and
# wordmark and drops everything else cleanly onto the brand navy.
LO, HI = 55, 95           # alpha ramp bounds in luminance

def artwork_rgba(size):
    art = src.resize((size, size), Image.LANCZOS)
    lum = art.convert('L')
    alpha = lum.point(lambda v: 0 if v <= LO else (255 if v >= HI else int(255 * (v - LO) / (HI - LO))))
    art = art.copy()
    art.putalpha(alpha)
    return art

def splash(bg, art_px=900):
    S = 2732
    canvas = Image.new('RGB', (S, S), bg)
    art = artwork_rgba(art_px)
    canvas.paste(art, ((S - art_px) // 2, (S - art_px) // 2), art)
    return canvas

splash(NAVY).save(os.path.join(OUT, 'splash.png'), 'PNG')
splash(NAVY).save(os.path.join(OUT, 'splash-dark.png'), 'PNG')   # brand is already dark

for f in ('icon.png', 'splash.png', 'splash-dark.png'):
    p = os.path.join(OUT, f)
    print('  %-16s %s  %.0f KB' % (f, Image.open(p).size, os.path.getsize(p) / 1024))
print('OK')
`;

const r = spawnSync('python3', ['-c', PY], { encoding: 'utf8' });
process.stdout.write(r.stdout || '');
if (r.status !== 0) {
  process.stderr.write(r.stderr || '');
  console.error('ERROR: icon generation failed (is Pillow installed?)');
  process.exit(1);
}
console.log('✓ source art written to app/assets — now run: npm run assets');
