#!/usr/bin/env python3
"""
render-lessons.py — batch-render every essay's "video lesson" from its certified
reel spec, in 16:9 (and optionally 9:16), ready to upload to YouTube.

It reads ../../library/video-lessons.json for the essay->reel map, renders each
mapped reel with the site's own gen_reel.py (unchanged wording, no re-gate),
and writes:
    tools/reel/output/lessons/<essay>.mp4          (wide 16:9, for the website)
    tools/reel/output/lessons/<essay>-vertical.mp4  (9:16, for socials; --vertical)
    tools/reel/output/lessons/MANIFEST.csv          (essay, title, reel, files)

The MANIFEST tells you which finished file to upload for which essay, so you can
paste each YouTube id back into video-lessons.json afterwards.

VOICE (optional, --voice): adds a spoken track with Microsoft edge-tts (free, no
account) and muxes it onto the silent captioned video, matching lengths so
nothing is clipped. edge-tts NEEDS INTERNET and is blocked inside the Apologia
cloud sandbox, so there --voice quietly falls back to silent. On your own Mac it
works:
    pip install edge-tts
    python3 tools/reel/render-lessons.py --voice
Pick a voice with --voice-name (default en-GB-RyanNeural; try en-US-AndrewNeural,
en-GB-SoniaNeural, en-US-AriaNeural).

Silent-captioned video is perfectly usable on the site on its own — voice is an
upgrade, not a requirement. See docs/VIDEO_LESSONS.md for the full runbook.

Usage:
    python3 tools/reel/render-lessons.py [--vertical] [--voice] [--voice-name NAME]
                                         [--only essay1,essay2] [--outdir DIR]
"""
import argparse
import csv
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SPECS = os.path.join(HERE, "specs")
MAP = os.path.join(ROOT, "library", "video-lessons.json")
GEN = os.path.join(HERE, "gen_reel.py")


def ffmpeg_bin():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


def duration_of(path, ff):
    """Read a media file's duration (seconds) by parsing ffmpeg -i stderr."""
    out = subprocess.run([ff, "-i", path], capture_output=True, text=True).stderr
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", out)
    if not m:
        return None
    h, mm, ss = int(m.group(1)), int(m.group(2)), float(m.group(3))
    return h * 3600 + mm * 60 + ss


def essay_title(slug):
    p = os.path.join(ROOT, "library", slug + ".html")
    try:
        with open(p, encoding="utf-8") as f:
            head = f.read(60000)   # essays carry a large review-stamp comment before <title>
        m = re.search(r"<title>([^<]*)</title>", head)
        if m:
            return m.group(1).split("|")[0].strip()
    except Exception:
        pass
    return slug


def render_silent(spec_path, out_path, aspect):
    r = subprocess.run(
        [sys.executable, GEN, spec_path, "--aspect", aspect, "--out", out_path, "--no-kit"],
        capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out_path):
        sys.stderr.write("  ! render failed for %s\n%s\n" % (spec_path, r.stderr[-600:]))
        return False
    return True


def synth_voice(text, out_mp3, voice_name):
    """Try edge-tts -> mp3. Returns True on success, False if unavailable/offline."""
    try:
        import asyncio
        import edge_tts
    except Exception:
        sys.stderr.write("  (edge-tts not installed — skipping voice; `pip install edge-tts`)\n")
        return False
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")

    async def go():
        kwargs = {"proxy": proxy} if proxy else {}
        c = edge_tts.Communicate(text, voice_name, **kwargs)
        await c.save(out_mp3)

    try:
        asyncio.run(go())
        return os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 0
    except Exception as e:
        sys.stderr.write("  (voice unavailable here — %s: %s — leaving this one silent)\n"
                         % (type(e).__name__, str(e)[:120]))
        return False


def mux(video, audio, out_path, ff):
    """Lay audio over video, padding the shorter stream so neither is clipped."""
    dv = duration_of(video, ff) or 0.0
    da = duration_of(audio, ff) or 0.0
    target = max(dv, da) + 0.25
    vpad = max(0.0, target - dv)
    # hold the last video frame for any shortfall; pad audio with trailing silence
    vf = "tpad=stop_mode=clone:stop_duration=%.3f" % vpad if vpad > 0.01 else "null"
    r = subprocess.run([
        ff, "-y", "-i", video, "-i", audio,
        "-filter_complex", "[0:v]%s[v];[1:a]apad[a]" % vf,
        "-map", "[v]", "-map", "[a]", "-t", "%.3f" % target,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart", out_path], capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out_path):
        sys.stderr.write("  ! mux failed: %s\n" % r.stderr[-400:])
        return False
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vertical", action="store_true", help="also render a 9:16 version")
    ap.add_argument("--voice", action="store_true", help="add a spoken track (needs internet)")
    ap.add_argument("--voice-name", default="en-GB-RyanNeural")
    ap.add_argument("--only", default="", help="comma-separated essay slugs to limit to")
    ap.add_argument("--outdir", default=os.path.join(HERE, "output", "lessons"))
    a = ap.parse_args()

    with open(MAP, encoding="utf-8") as f:
        lessons = json.load(f)["lessons"]
    only = set(s.strip() for s in a.only.split(",") if s.strip())
    if only:
        lessons = {k: v for k, v in lessons.items() if k in only}

    os.makedirs(a.outdir, exist_ok=True)
    ff = ffmpeg_bin()
    rows = []
    ok = voiced = 0
    for slug, e in sorted(lessons.items()):
        reel = e["reel"]
        spec = os.path.join(SPECS, reel + ".json")
        if not os.path.exists(spec):
            sys.stderr.write("  ! no spec: %s\n" % spec)
            continue
        title = essay_title(slug)
        print("→ %-24s  %s" % (slug, reel))
        wide = os.path.join(a.outdir, slug + ".mp4")
        silent = os.path.join(a.outdir, slug + ".silent.mp4") if a.voice else wide
        if not render_silent(spec, silent, "wide"):
            continue

        if a.voice:
            with open(spec, encoding="utf-8") as sf:
                vo = (json.load(sf).get("voiceover") or "").strip()
            mp3 = os.path.join(a.outdir, slug + ".voice.mp3")
            if vo and synth_voice(vo, mp3, a.voice_name) and mux(silent, mp3, wide, ff):
                voiced += 1
                for tmp in (silent, mp3):
                    try: os.remove(tmp)
                    except OSError: pass
            else:
                # voice failed → keep the silent render as the deliverable
                if silent != wide:
                    os.replace(silent, wide)

        if a.vertical:
            vpath = os.path.join(a.outdir, slug + "-vertical.mp4")
            render_silent(spec, vpath, "vertical")

        ok += 1
        rows.append([slug, title, reel, os.path.basename(wide),
                     "voiced" if (a.voice and voiced) else "silent"])

    man = os.path.join(a.outdir, "MANIFEST.csv")
    with open(man, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["essay_slug", "essay_title", "reel", "video_file", "audio"])
        w.writerows(rows)

    print("\nDone: %d video(s) rendered%s → %s" %
          (ok, (", %d voiced" % voiced) if a.voice else " (silent)", a.outdir))
    print("Manifest: %s" % man)
    if a.voice and voiced == 0:
        print("NOTE: no voice was added (edge-tts could not reach the network here). "
              "Run with --voice on a machine with normal internet to get spoken videos.")


if __name__ == "__main__":
    main()
