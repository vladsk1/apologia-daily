#!/usr/bin/env python3
"""
gen_framereel.py — the Apologia Daily reel generator ("one idea, one picture").

A reel is built around ONE central animated FIGURE that stays on screen and changes
beat by beat, under a short, LARGE headline, on the brand navy starfield, narrated
with Kokoro (am_michael). It replaces gen_webreel.py as the default way to make a reel.

Pipeline (same machinery as gen_webreel.py — offline, no API keys):
  1. lint the spec (words on screen, narration length, captions, review stamp)
  2. Kokoro voices each beat's `say`              -> narration.wav + per-beat timings
  3. capture-webreel.mjs steps web/frame.html     -> PNG frames, timed to the narration
  4. ffmpeg muxes frames + narration              -> output/<name>.mp4
  5. writes output/<name>.captions.txt (Instagram + X) and output/<name>.sheet.png (QA contact sheet)

    python tools/reel/gen_framereel.py tools/reel/specs/frame-<name>.json
    python tools/reel/gen_framereel.py <spec> --draft        # no voice: a contact sheet in seconds, to check layout
    python tools/reel/gen_framereel.py <spec> --voice am_michael --fps 30 --keep

Spec format + figure types: README-framereel.md.   Content rules: .claude/skills/make-reel/SKILL.md.
GATED CONTENT like every reel: carry a `reviewed` block; PORT `say`/`head` from the certified essay.
"""
import os, sys, re, json, wave, argparse, subprocess, shutil, math, time
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

try:
    sys.stdout.reconfigure(encoding="utf-8"); sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

TEMPLATE = os.path.join(HERE, "web", "frame.html")
CAPTURE = os.path.join(HERE, "capture-webreel.mjs")
FIGURES = {"grid", "number", "bars", "steps", "timeline", "ring", "verse", "scroll", "scale", "map", "stack", "hand", "phone"}
DEFAULT_END = {"line": "Read the full case — free", "say": "Read the full case, for free, at Apolojia Daily.", "url": "apologiadaily.com"}

# on-screen / narration budgets (warnings, not errors — the owner may ask for a longer reel)
MAX_HEAD_WORDS = 12
MAX_LINE_CHARS = 24            # a headline line longer than this forces smaller type
MAX_SAY_WORDS = 190
TARGET_SECONDS = (45, 80)


def which(x):
    return shutil.which(x) or (x + ".cmd" if os.name == "nt" else x)


def plain(s):
    return re.sub(r"[*~]", "", s or "").replace("\n", " ")


def norm_scenes(spec):
    """Mirror of frame.html normScenes(): the end card is appended as a final scene."""
    scenes = list(spec.get("scenes") or [])
    if spec.get("end") is not False and not (scenes and scenes[-1].get("end")):
        e = dict(DEFAULT_END); e.update(spec.get("end") or {})
        scenes.append({"end": True, "line": e["line"], "url": e["url"], "beats": [{"say": e["say"]}]})
    return scenes


def lint(spec, scenes):
    errs, warns = [], []
    if spec.get("format") != "framereel":
        errs.append('not a framereel spec (expected "format": "framereel")')
    if not spec.get("scenes"):
        errs.append("no scenes")
    figs = 0
    for si, sc in enumerate(scenes):
        if sc.get("end"):
            continue
        fig = sc.get("figure")
        if fig:
            figs += 1
            if fig.get("type") not in FIGURES:
                errs.append(f"scene {si+1}: unknown figure type {fig.get('type')!r} (have: {', '.join(sorted(FIGURES))})")
        if not sc.get("beats"):
            errs.append(f"scene {si+1}: no beats"); continue
        for bi, b in enumerate(sc["beats"]):
            where = f"scene {si+1} beat {bi+1}"
            if len(re.sub(r"[*~]", "", b.get("echo") or "")) > 9:
                warns.append(f"{where}: echo word is long — it is scaled to fit the frame, so over ~9 characters it gets small; use one short word")
            if not (b.get("say") or "").strip():
                errs.append(f"{where}: missing `say` (the narration)")
            head = b.get("head") or ""
            n = len(plain(head).split())
            if n > MAX_HEAD_WORDS:
                warns.append(f"{where}: headline is {n} words — keep it to about {MAX_HEAD_WORDS} so it stays large")
            NL = chr(10)
            longest = max((len(re.sub(r"[*~]", "", ln)) for ln in head.split(NL)), default=0)
            limit = MAX_LINE_CHARS + (0 if fig else -2)
            if NL in head and longest > limit:
                warns.append(f"{where}: a headline line is {longest} characters — over ~{limit} the type shrinks; break the line or cut words")
            if head and NL not in head and len(plain(head)) > limit:
                warns.append(f"{where}: headline has no line breaks — add a line break so YOU choose where it splits (about {limit} characters a line)")
    if figs == 0:
        warns.append("no figure in any scene — a frame reel is built around one central picture")
    if figs > 2:
        warns.append(f"{figs} different figures — the form is ONE picture that evolves; use more only when the material demands it")
    total_words = sum(len((b.get("say") or "").split()) for sc in scenes for b in sc.get("beats", []))
    if total_words > MAX_SAY_WORDS:
        warns.append(f"narration is {total_words} words (~{round(total_words/2.5)}s) — the default target is {TARGET_SECONDS[0]}–{TARGET_SECONDS[1]}s")
    rv = spec.get("reviewed") or {}
    if not (rv.get("argument") and rv.get("orthodoxy")) or "pending" in json.dumps(rv).lower():
        warns.append("`reviewed` stamp is missing or pending — NOT cleared to post until the gate round has run")
    if not spec.get("caption_ig") or not spec.get("caption_x"):
        warns.append("caption_ig / caption_x missing — every reel ships both (gated, ported from the essay)")
    return errs, warns, total_words


def beats_of(scenes, default_hold):
    out = []
    for si, sc in enumerate(scenes):
        for bi, b in enumerate(sc["beats"]):
            out.append({"scene": si, "first": bi == 0, "say": b.get("say", ""), "hold": float(b.get("hold", default_hold))})
    return out


def capture(specp, timp, frames, n_frames, jobs):
    """Record the frames. seek(t) is a pure function of t, so the reel is split into `jobs`
    slices captured by parallel headless browsers (each on its own pinned DevTools port)."""
    jobs = max(1, min(jobs, n_frames // 60 or 1))
    cmd = [which("node"), CAPTURE, TEMPLATE, specp, timp, "--out", frames]
    if jobs == 1:
        if subprocess.run(cmd).returncode: sys.exit("frame capture failed")
        return
    print(f"capturing {n_frames} frames with {jobs} parallel browsers…", flush=True)
    step, procs = math.ceil(n_frames / jobs), []
    for j in range(jobs):
        env = dict(os.environ, REEL_START=str(j * step), REEL_END=str(min(n_frames, (j + 1) * step)), REEL_PORT=str(9340 + j * 20))
        procs.append(subprocess.Popen(cmd, env=env, stdout=subprocess.DEVNULL))
    last = -1
    while any(p.poll() is None for p in procs):
        time.sleep(5)
        done = len([f for f in os.listdir(frames) if f.endswith(".png")]) if os.path.isdir(frames) else 0
        if done != last: print(f"  {done}/{n_frames}", flush=True); last = done
    if any(p.returncode for p in procs): sys.exit("frame capture failed")
    have = len([f for f in os.listdir(frames) if f.endswith(".png")])
    if have < n_frames: sys.exit(f"frame capture incomplete: {have}/{n_frames}")


def contact_sheet(FF, frames_dir, n, out, cols=6):
    rows = max(1, math.ceil(n / cols))
    r = subprocess.run([FF, "-y", "-loglevel", "error", "-framerate", "1", "-i", os.path.join(frames_dir, "%06d.png"),
                        "-vf", f"scale=270:480,tile={cols}x{rows}:padding=6:color=black", "-frames:v", "1", out])
    return r.returncode == 0


def main():
    ap = argparse.ArgumentParser(description="Render a framereel spec to a voiced MP4.")
    ap.add_argument("spec")
    ap.add_argument("--out"); ap.add_argument("--voice"); ap.add_argument("--speed", type=float)
    ap.add_argument("--fps", type=int)
    ap.add_argument("--lead", type=float, default=0.38, help="seconds of motion before the voice starts each beat")
    ap.add_argument("--hold", type=float, default=0.32, help="seconds to hold after the voice ends each beat")
    ap.add_argument("--draft", action="store_true", help="skip the voice; write only a contact sheet (fast layout check)")
    ap.add_argument("--jobs", type=int, default=max(1, min(4, (os.cpu_count() or 2) // 2)), help="parallel browsers for frame capture")
    ap.add_argument("--keep", action="store_true", help="keep the .frame_<name> work dir")
    a = ap.parse_args()

    spec = json.load(open(a.spec, encoding="utf-8"))
    scenes = norm_scenes(spec)
    errs, warns, total_words = lint(spec, scenes)
    for w in warns: print(f"⚠ {w}")
    if errs:
        for e in errs: print(f"✗ {e}")
        sys.exit(1)

    import gen_reel as R                     # fonts/aspects + static ffmpeg (R.FF)
    FF = R.FF
    name = os.path.splitext(os.path.basename(a.spec))[0]
    outdir = os.path.join(HERE, "output"); os.makedirs(outdir, exist_ok=True)
    out = a.out or os.path.join(outdir, f"{name}.mp4")
    work = os.path.join(HERE, f".frame_{name}"); shutil.rmtree(work, ignore_errors=True); os.makedirs(work)
    frames = os.path.join(work, "frames")
    fps = a.fps or int(spec.get("fps", 30))
    W, H = 1080, 1920
    XF = 0.4                                  # must match XF in web/frame.html
    beats = beats_of(scenes, a.hold)

    # ---- narration (or an estimate, for --draft) ----
    audio = []
    if a.draft:
        lens = [0.35 + len(b["say"].split()) * 0.36 for b in beats]
    else:
        import gen_webreel as WR             # synth_scene (Kokoro, sentence-cached) + numpy
        import gen_explainer as E
        np, SR = WR.np, E.SR
        voice = a.voice or spec.get("voice", "am_michael")
        speed = a.speed or float(spec.get("speed", 1.0))
        cache = os.path.join(E.TTS_DIR, "cache"); os.makedirs(cache, exist_ok=True)
        print(f"narration ({voice}, speed {speed}, {total_words} words)…")
        k = E.ensure_tts()
        for i, b in enumerate(beats):
            au = WR.synth_scene(k, b["say"], voice, speed, spec.get("lexicon", {}), cache)
            au = au[: max(1, len(au) - int(SR * 0.28))]          # drop the trailing inter-sentence gap
            audio.append(au)
            print(f"  beat {i+1}/{len(beats)} (scene {b['scene']+1})  {len(au)/SR:5.1f}s  {b['say'][:56]}")
        lens = [len(au) / SR for au in audio]

    # ---- timeline: beats laid end to end with an XF overlap; a scene's first beat gets a longer lead ----
    starts, durs, leads, t = [], [], [], 0.0
    for i, b in enumerate(beats):
        lead = a.lead + (0.35 if b["first"] else 0.0)
        dur = lead + lens[i] + b["hold"] + XF
        starts.append(t); durs.append(dur); leads.append(lead); t += dur - XF
    durs[-1] += 1.4                           # let the end card sit
    total = starts[-1] + durs[-1]

    beat_tim = [{"start": round(starts[i] * 1000), "dur": round(durs[i] * 1000), "scene": beats[i]["scene"]} for i in range(len(beats))]
    scene_tim = []
    for si in range(len(scenes)):
        bw = [bt for bt in beat_tim if bt["scene"] == si]
        scene_tim.append({"start": bw[0]["start"], "dur": bw[-1]["start"] + bw[-1]["dur"] - bw[0]["start"]})
    cap_fps = fps if not a.draft else 1.0 / max(1.0, total / 24.0)        # draft: ~24 stills across the reel
    tim = {"fps": cap_fps, "width": W, "height": H, "total": round(total * 1000), "beats": beat_tim, "scenes": scene_tim}
    timp = os.path.join(work, "timings.json"); json.dump(tim, open(timp, "w"))
    specp = os.path.join(work, "spec.json"); json.dump(spec, open(specp, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"runtime {int(total // 60)}:{int(total % 60):02d} · {len(beats)} beats · {W}x{H}" + (" · DRAFT (no voice)" if a.draft else f" @ {fps}fps"))
    if not a.draft and not (TARGET_SECONDS[0] <= total <= TARGET_SECONDS[1] + 10):
        print(f"⚠ runtime {total:.0f}s is outside the default {TARGET_SECONDS[0]}–{TARGET_SECONDS[1]}s target (fine if that was asked for)")

    capture(specp, timp, frames, max(1, round(total * cap_fps)), 1 if a.draft else a.jobs)

    sheet = os.path.join(outdir, f"{name}.sheet.png")
    if a.draft:
        n = len([f for f in os.listdir(frames) if f.endswith(".png")])
        if contact_sheet(FF, frames, n, sheet): print(f"✓ {sheet}  (draft — no MP4 written)")
        if not a.keep: shutil.rmtree(work, ignore_errors=True)
        return

    # ---- narration.wav ----
    track = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for i, au in enumerate(audio):
        s = int((starts[i] + leads[i]) * SR)
        track[s:s + len(au)] += au
    track = np.clip(track, -1, 1)
    wavp = os.path.join(work, "narration.wav")
    with wave.open(wavp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((track * 32767).astype("<i2").tobytes())

    r = subprocess.run([FF, "-y", "-loglevel", "error", "-framerate", str(fps),
                        "-i", os.path.join(frames, "%06d.png"), "-i", wavp,
                        "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-pix_fmt", "yuv420p",   # ~20 MB a minute: under the 30 MB phone-delivery limit "-r", str(fps),
                        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out])
    if r.returncode: sys.exit("final mux failed")
    print(f"✓ {out}")

    # QA contact sheet straight from the finished MP4 (one still every ~1/24 of the reel)
    step = max(1.0, total / 24.0)
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", out, "-vf", f"fps=1/{step:.3f},scale=270:480,tile=6x4:padding=6:color=black",
                    "-frames:v", "1", sheet])
    if os.path.exists(sheet): print(f"✓ {sheet}")

    # captions (owner rule: every reel ships IG + X captions, ported from the certified essay)
    ig, xc = spec.get("caption_ig"), spec.get("caption_x")
    cap_path = os.path.join(outdir, f"{name}.captions.txt")
    with open(cap_path, "w", encoding="utf-8") as f:
        f.write("=== INSTAGRAM CAPTION ===\n\n" + (ig or "(add caption_ig to the spec — gated, ported from the essay)") + "\n\n")
        f.write("=== X / TWITTER CAPTION ===\n\n" + (xc or "(add caption_x to the spec — <=280 chars incl. a live .html link)") + "\n")
    print(f"✓ {cap_path}")
    if not a.keep:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    main()
