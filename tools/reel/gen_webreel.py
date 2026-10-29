#!/usr/bin/env python3
"""
gen_webreel.py — render an animated "Frames of Quran"-style reel to a real MP4.

This is the animated, voiced sibling of gen_reel.py (which paints STATIC caption
frames). It is the standard way to "make a reel" for Apologia Daily: cinematic
navy/gold motion + Kokoro narration, from one JSON spec.

Pipeline:
  1. Kokoro TTS (default voice am_michael) voices each scene's `vo`
       — reuses gen_explainer.py's offline engine, so no API key / no per-use cost.
  2. per-scene audio -> narration.wav + a per-scene timing sheet (ms).
  3. capture-webreel.mjs steps web/reel.html through window.__seek(t) frame by frame
     to a PNG sequence (headless Chrome, no npm deps) — timed to the narration.
  4. ffmpeg muxes the frames + narration.wav into <spec>.mp4 (H.264, faststart).

    python tools/reel/gen_webreel.py tools/reel/specs/webreel-jesus-god-nt.json
    python tools/reel/gen_webreel.py <spec> --voice am_michael --fps 30 --keep

Spec: tools/reel/specs/webreel-*.json  (format: "webreel"). Each scene =
  { kicker?, lines:[ {t,size,color,style,kinetic} | {gap:true} | {t,cite:true} ],
    structure?:{rows:[…], verdict}, vo:"spoken narration", hold?:seconds }
  sizes: sm|md|lg|xl · colors: gold (default cream) · style: verse · kinetic: word-by-word

GATED CONTENT like every reel: carry a `reviewed` block and PORT the `vo` from the
paired certified essay — never freshly author claims here. See CLAUDE.md.
"""
import os, sys, re, json, wave, argparse, subprocess, hashlib, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gen_reel as R          # fonts/themes/aspects + ffmpeg (R.FF) + _ensure
import gen_explainer as E     # Kokoro TTS engine (ensure_tts, speakable, TTS_DIR, SR)
np = R._ensure("numpy")
FF = R.FF
SR = E.SR                     # 24000
TEMPLATE = os.path.join(HERE, "web", "reel.html")
CAPTURE  = os.path.join(HERE, "capture-webreel.mjs")

# Windows consoles default to cp1252 and choke on ✓ / ⚠ / — in our prints
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

_SENT = re.compile(r"[^.!?]+[.!?]*")
def sentences(text):
    return [s.strip() for s in _SENT.findall(text or "") if s.strip()]

def which(x):
    return shutil.which(x) or (x + ".cmd" if os.name == "nt" else x)

def synth_scene(k, text, voice, speed, lex, cache):
    """float32 mono @ SR for a scene's narration (sentences joined by a short gap, cached)."""
    lang = "en-gb" if voice.startswith("b") else "en-us"
    gap = np.zeros(int(SR * 0.28), dtype=np.float32)
    chunks = []
    for s in sentences(text):
        key = hashlib.sha1(f"{voice}|{speed}|{E.speakable(s, lex)}".encode()).hexdigest()
        p = os.path.join(cache, key + ".npy")
        if os.path.exists(p):
            a = np.load(p)
        else:
            a, sr = k.create(E.speakable(s, lex), voice=voice, speed=speed, lang=lang)
            assert sr == SR, sr
            a = a.astype(np.float32); np.save(p, a)
        chunks.append(a); chunks.append(gap)
    return np.concatenate(chunks) if chunks else np.zeros(1, dtype=np.float32)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--out"); ap.add_argument("--voice"); ap.add_argument("--speed", type=float)
    ap.add_argument("--fps", type=int)
    ap.add_argument("--lead", type=float, default=0.7, help="seconds of motion before the voice starts each scene")
    ap.add_argument("--tail", type=float, default=0.8, help="seconds to hold after the voice ends each scene")
    ap.add_argument("--xfade", type=float, default=0.5, help="scene crossfade overlap (seconds)")
    ap.add_argument("--keep", action="store_true", help="keep the .web_<name> work dir (frames, wav, timings)")
    a = ap.parse_args()

    spec = json.load(open(a.spec, encoding="utf-8"))
    assert spec.get("format") == "webreel", "not a webreel spec (expected format:\"webreel\")"
    voice = a.voice or spec.get("voice", "am_michael")
    speed = a.speed or float(spec.get("speed", 1.0))
    fps = a.fps or int(spec.get("fps", 30))
    W, H = R.ASPECTS.get(spec.get("aspect", "vertical"), (1080, 1920))
    name = os.path.splitext(os.path.basename(a.spec))[0]
    outdir = os.path.join(HERE, "output"); os.makedirs(outdir, exist_ok=True)
    out = a.out or os.path.join(outdir, f"{name}.mp4")
    work = os.path.join(HERE, f".web_{name}"); os.makedirs(work, exist_ok=True)
    frames = os.path.join(work, "frames")
    cache = os.path.join(E.TTS_DIR, "cache"); os.makedirs(cache, exist_ok=True)
    lex = spec.get("lexicon", {})
    scenes = spec["scenes"]

    print(f"narration ({voice}, speed {speed})…")
    k = E.ensure_tts()
    LEAD, XF = a.lead, a.xfade

    # flatten scenes -> beats (a scene is one beat unless it carries a `beats` list)
    beats = []
    for si, sc in enumerate(scenes):
        bl = sc.get("beats")
        if bl:
            for b in bl:
                beats.append({"scene": si, "vo": b.get("vo", ""), "hold": b.get("hold", sc.get("hold", a.tail))})
        else:
            beats.append({"scene": si, "vo": sc.get("vo", ""), "hold": sc.get("hold", a.tail)})

    # synth each beat and lay beats end-to-end with an xfade overlap
    starts, durs, audio, t = [], [], [], 0.0
    for i, b in enumerate(beats):
        au = synth_scene(k, b["vo"], voice, speed, lex, cache)
        audio.append(au)
        dur = LEAD + len(au) / SR + float(b["hold"])
        starts.append(t); durs.append(dur); t += dur - XF
        print(f"  beat {i+1}/{len(beats)} (scene {b['scene']+1})  {len(au)/SR:5.1f}s  {b['vo'][:48]}")
    total = starts[-1] + durs[-1]

    # narration.wav — each beat's audio at its beat start + lead
    track = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for i, au in enumerate(audio):
        s = int((starts[i] + LEAD) * SR)
        track[s:s + len(au)] += au
    track = np.clip(track, -1, 1)
    wavp = os.path.join(work, "narration.wav")
    with wave.open(wavp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((track * 32767).astype("<i2").tobytes())

    # per-beat windows, and scene windows that span their beats (the template keeps a
    # scene's persistent structure visible while any of its beats is active)
    beat_tim = [{"start": round(starts[i] * 1000), "dur": round(durs[i] * 1000), "scene": beats[i]["scene"]}
                for i in range(len(beats))]
    scene_tim = []
    for si in range(len(scenes)):
        bw = [bt for bt in beat_tim if bt["scene"] == si]
        scene_tim.append({"start": bw[0]["start"], "dur": bw[-1]["start"] + bw[-1]["dur"] - bw[0]["start"]})
    tim = {"fps": fps, "width": W, "height": H, "total": round(total * 1000), "beats": beat_tim, "scenes": scene_tim}
    timp = os.path.join(work, "timings.json")
    json.dump(tim, open(timp, "w"))
    print(f"runtime {int(total // 60)}:{int(total % 60):02d} · {len(scenes)} scenes · {W}x{H} @ {fps}fps")

    r = subprocess.run([which("node"), CAPTURE, TEMPLATE, os.path.abspath(a.spec), timp, "--out", frames])
    if r.returncode: sys.exit("frame capture failed")

    r = subprocess.run([FF, "-y", "-loglevel", "error", "-framerate", str(fps),
                        "-i", os.path.join(frames, "%06d.png"), "-i", wavp,
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(fps),
                        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out])
    if r.returncode: sys.exit("final mux failed")
    print(f"✓ {out}")

    # captions (owner rule: every reel ships IG + X captions, ported from the certified essay)
    ig, xc = spec.get("caption_ig"), spec.get("caption_x")
    cap_path = os.path.join(outdir, f"{name}.captions.txt")
    with open(cap_path, "w", encoding="utf-8") as f:
        f.write("=== INSTAGRAM CAPTION ===\n\n" + (ig or "(add caption_ig to the spec — gated, ported from the essay)") + "\n\n")
        f.write("=== X / TWITTER CAPTION ===\n\n" + (xc or "(add caption_x to the spec — <=280 chars incl. a live .html link)") + "\n")
    print(f"✓ {cap_path}")
    if ig: print("\n--- Instagram ---\n" + ig)
    if xc: print("\n--- X ---\n" + xc)
    if not (ig and xc):
        print("\n⚠ captions incomplete: add caption_ig / caption_x to the spec (gated, ported from the essay; check the X link returns 200).")
    if not a.keep:
        shutil.rmtree(work, ignore_errors=True)

if __name__ == "__main__":
    main()
