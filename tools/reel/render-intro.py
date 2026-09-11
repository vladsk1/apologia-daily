#!/usr/bin/env python3
"""
render-intro.py — render a tab-intro reel SCENE-LOCKED: each scene's own narration
is laid down exactly when that scene appears, so the voice always matches the page.

Unlike render-lessons.py (one continuous voice track over a whole essay reel), an
intro spec carries a per-scene "vo" field (the narration for that scene). This tool:
  1. synthesises each scene's vo with edge-tts and measures its spoken length;
  2. sets each scene's dur = speech + crossfade + pad (+ a small lead on scene 0),
     writing the durations back INTO the spec (timing only — no wording change, so
     no re-gate; the spec's top-level `voiceover` is left untouched and must already
     equal the concatenation of the scene `vo`s);
  3. renders the silent captioned video with gen_reel.py at the chosen aspect;
  4. builds the audio by concatenating: lead-silence, seg0, pad-silence, seg1, …
     — because dur[i]-crossfade == speech[i]+pad, each segment starts exactly at its
     scene's start on the crossfaded timeline;
  5. muxes, padding the audio tail so the final card holds while the last words finish.

Needs internet for edge-tts (blocked in the cloud sandbox; run locally). Output MP4 is
git-ignored. Usage:
    python tools/reel/render-intro.py tools/reel/specs/intro-god.json \
        --out tools/reel/output/lessons/intro-god.mp4
    [--aspect wide|vertical|square] [--voice-name en-GB-RyanNeural] [--rate +15%]
    [--pad 0.5] [--lead 0.3]
"""
import argparse, os, sys, json, subprocess, re, asyncio
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(HERE, "gen_reel.py")


def ff_bin():
    return imageio_ffmpeg.get_ffmpeg_exe()


def dur_of(path, ff):
    s = subprocess.run([ff, "-i", path], capture_output=True, text=True).stderr
    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", s)
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3)) if m else 0.0


def synth(text, out_mp3, voice, rate):
    import edge_tts

    async def go():
        kw = {"rate": rate} if rate else {}
        await edge_tts.Communicate(text, voice, **kw).save(out_mp3)
    asyncio.run(go())
    return os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--out", required=True)
    ap.add_argument("--aspect", default="wide")
    ap.add_argument("--voice-name", default="en-GB-RyanNeural")
    ap.add_argument("--rate", default="+15%")
    ap.add_argument("--pad", type=float, default=0.5)
    ap.add_argument("--lead", type=float, default=0.3)
    a = ap.parse_args()

    ff = ff_bin()
    spec = json.load(open(a.spec, encoding="utf-8"))
    scenes = spec["scenes"]
    XF = float(spec.get("crossfade", 0.5))
    # guard: top-level voiceover must equal the concatenation of scene vos (no drift)
    joined = " ".join(s.get("vo", "").strip() for s in scenes).strip()
    if re.sub(r"\s+", " ", joined) != re.sub(r"\s+", " ", spec.get("voiceover", "").strip()):
        sys.exit("ABORT: top-level voiceover != concatenation of scene `vo` fields")

    work = os.path.join(os.environ.get("TEMP", "/tmp"), "introrender", os.path.basename(a.spec))
    os.makedirs(work, exist_ok=True)

    print("synthesising %d scene narrations (%s %s)..." % (len(scenes), a.voice_name, a.rate), flush=True)
    spk = []
    for i, sc in enumerate(scenes):
        vo = (sc.get("vo") or "").strip()
        if not vo:
            spk.append(0.0)
            continue
        mp3 = os.path.join(work, "seg_%02d.mp3" % i)
        if not synth(vo, mp3, a.voice_name, a.rate):
            sys.exit("edge-tts failed on scene %d (needs internet)" % i)
        spk.append(dur_of(mp3, ff))

    # per-scene durations: speech + crossfade + pad (+ lead on scene 0)
    durs = [round(s + XF + a.pad, 3) for s in spk]
    durs[0] = round(durs[0] + a.lead, 3)
    for sc, d in zip(scenes, durs):
        sc["dur"] = round(d, 1)
    json.dump(spec, open(a.spec, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(a.spec, "a", encoding="utf-8").write("\n")

    # silent captioned video
    silent = os.path.join(work, "silent.mp4")
    print("rendering silent %s..." % a.aspect, flush=True)
    r = subprocess.run([sys.executable, GEN, a.spec, "--aspect", a.aspect, "--out", silent, "--no-kit"],
                       capture_output=True, text=True)
    if r.returncode or not os.path.exists(silent):
        sys.exit("gen_reel failed:\n" + r.stdout[-400:] + r.stderr[-1500:])
    vtot = dur_of(silent, ff)

    # scene-locked audio: [lead][seg0][pad][seg1][pad]...[segN]
    inputs, parts, k = [], [], 0
    def add_sil(t):
        nonlocal k
        inputs.extend(["-f", "lavfi", "-t", "%.3f" % t, "-i", "anullsrc=r=24000:cl=mono"]); parts.append(k); k += 1
    def add_seg(i):
        nonlocal k
        inputs.extend(["-i", os.path.join(work, "seg_%02d.mp3" % i)]); parts.append(k); k += 1
    add_sil(a.lead)
    for i, sc in enumerate(scenes):
        if (sc.get("vo") or "").strip():
            add_seg(i)
        if i < len(scenes) - 1:
            add_sil(a.pad)
    fc = "".join("[%d:a]aformat=sample_fmts=fltp:channel_layouts=mono:sample_rates=24000[a%d];" % (idx, j)
                 for j, idx in enumerate(parts))
    fc += "".join("[a%d]" % j for j in range(len(parts))) + "concat=n=%d:v=0:a=1[out]" % len(parts)
    audio = os.path.join(work, "audio.aac")
    r = subprocess.run([ff, "-y"] + inputs + ["-filter_complex", fc, "-map", "[out]",
                        "-c:a", "aac", "-b:a", "160k", audio], capture_output=True, text=True)
    if r.returncode or not os.path.exists(audio):
        sys.exit("audio build failed:\n" + r.stderr[-1500:])
    atot = dur_of(audio, ff)

    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    # Cap the output at the VIDEO length. Because each scene's dur = speech + crossfade
    # + pad, the last scene's narration always finishes ~0.7s before the video ends, so
    # capping at vtot keeps every spoken word and trims only trailing silence. (The
    # concatenated audio.aac can report a much longer duration than the real speech —
    # spurious trailing silence — so DON'T size the output to it, or the final card
    # freezes on dead air.) apad guarantees a full-length audio track to the cap.
    r = subprocess.run([ff, "-y", "-i", silent, "-i", audio, "-filter_complex", "[1:a]apad[a]",
                        "-map", "0:v", "-map", "[a]", "-t", "%.3f" % vtot, "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", a.out],
                       capture_output=True, text=True)
    if r.returncode or not os.path.exists(a.out):
        sys.exit("mux failed:\n" + r.stderr[-1500:])
    print("DONE -> %s  video=%.1fs narration=%.1fs" % (a.out, vtot, atot), flush=True)


if __name__ == "__main__":
    main()
