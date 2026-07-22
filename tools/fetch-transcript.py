#!/usr/bin/env python3
"""
Apologia Daily — YouTube transcript fetcher (RESEARCH LEADS ONLY).

Pulls the caption track for one video so a content session can MINE it for
(a) the argument's shape and (b) the PRIMARY SOURCES it cites — never to
reproduce the speaker's words. The transcript is a copyrighted LEAD, exactly
like the owned-book notes in docs/book-research/. It is written to a
git-ignored scratch folder and MUST NOT be committed or pasted into content.

    Usage:
        python3 tools/fetch-transcript.py <youtube-url-or-id> [--lang en] [--out DIR]

    Methods (tried in order, both local-network only):
      1. youtube-transcript-api  (pip; self-installed on first run)
      2. yt-dlp --write-auto-sub --skip-download   (if yt-dlp is on PATH)

Output → docs/video-research/_transcripts/<id>.txt  (git-ignored).
Runs locally / in a web-enabled session; the CI/remote sandbox usually can't
reach YouTube.

⚠ COPYRIGHT + ToS: fetch a handful of SPECIFIC videos you intend to mine as
research. Do not bulk-scrape. Auto-generated captions are ERROR-PRONE (misheard
names, wrong dates/numbers) — treat every name/figure as UNVERIFIED until you
confirm it against the primary source and run the normal pipeline.
"""
import os, sys, re, json, subprocess, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
DEFAULT_OUT = os.path.join(ROOT, "docs", "video-research", "_transcripts")

REMINDER = (
    "==============================================================\n"
    " RESEARCH LEAD — copyrighted transcript. DO NOT paste into content.\n"
    " Mine it for: (1) the argument's SHAPE, (2) the PRIMARY SOURCES it\n"
    " cites (Scripture, scholars, dates). Verify every one against the\n"
    " primary + run citations -> argument -> orthodoxy before anything ships.\n"
    " Auto-captions mishear names/numbers — trust nothing here as a citation.\n"
    "==============================================================\n"
)


def video_id(s):
    s = s.strip()
    m = re.search(r"(?:v=|/shorts/|youtu\.be/|/embed/)([A-Za-z0-9_-]{11})", s)
    if m:
        return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", s):
        return s
    raise SystemExit("Could not parse a YouTube video id from: " + s)


def ensure_pkg():
    try:
        import youtube_transcript_api  # noqa: F401
        return True
    except Exception:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-q",
                                   "youtube-transcript-api"])
            return True
        except Exception:
            return False


def via_api(vid, lang):
    from youtube_transcript_api import YouTubeTranscriptApi
    tr = YouTubeTranscriptApi.get_transcript(vid, languages=[lang, "en", "en-US"])
    lines = []
    for seg in tr:
        t = int(seg.get("start", 0))
        stamp = "%02d:%02d" % (t // 60, t % 60)
        lines.append("[%s] %s" % (stamp, seg.get("text", "").strip()))
    return "\n".join(lines)


def via_ytdlp(vid, lang, outdir):
    # Fallback: needs yt-dlp on PATH. Writes a .vtt we flatten to text.
    url = "https://www.youtube.com/watch?v=" + vid
    subprocess.check_call([
        "yt-dlp", "--skip-download", "--write-auto-sub", "--write-sub",
        "--sub-lang", lang, "--sub-format", "vtt",
        "-o", os.path.join(outdir, "%(id)s.%(ext)s"), url,
    ])
    vtt = None
    for f in os.listdir(outdir):
        if f.startswith(vid) and f.endswith(".vtt"):
            vtt = os.path.join(outdir, f)
            break
    if not vtt:
        raise SystemExit("yt-dlp wrote no .vtt (no captions available?)")
    text, seen = [], set()
    for ln in open(vtt, encoding="utf-8"):
        ln = ln.strip()
        if not ln or "-->" in ln or ln.upper().startswith("WEBVTT") or ln.isdigit():
            continue
        ln = re.sub(r"<[^>]+>", "", ln)  # strip inline timing tags
        if ln and ln not in seen:
            seen.add(ln)
            text.append(ln)
    os.remove(vtt)
    return "\n".join(text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", help="YouTube URL or 11-char id")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--out", default=DEFAULT_OUT)
    a = ap.parse_args()

    vid = video_id(a.video)
    os.makedirs(a.out, exist_ok=True)
    body = None

    if ensure_pkg():
        try:
            body = via_api(vid, a.lang)
        except Exception as e:
            print("youtube-transcript-api failed (%s) — trying yt-dlp…" % e, file=sys.stderr)
    if body is None:
        try:
            body = via_ytdlp(vid, a.lang, a.out)
        except FileNotFoundError:
            raise SystemExit("No transcript method worked. Install one:\n"
                             "  pip install youtube-transcript-api   (or)   pip install yt-dlp")

    out_path = os.path.join(a.out, vid + ".txt")
    header = REMINDER + "\nsource: https://www.youtube.com/watch?v=" + vid + "\n\n"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header + (body or ""))
    print("OK  " + out_path)
    print("    (%d chars) — mine for argument shape + primaries; do not commit or quote." % len(body or ""))


if __name__ == "__main__":
    main()
