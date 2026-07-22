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
    """Return (kind, body). PREFERS human/manual captions (accurate); falls back
    to auto-generated (ASR) captions, which mishear names/dates/numbers — labeled
    so the miner knows how much to distrust it."""
    from youtube_transcript_api import YouTubeTranscriptApi as YTA
    langs = [lang, "en", "en-US", "en-GB"]
    kind, tr = "unknown", None
    # youtube-transcript-api >=1.0 replaced the classmethods list_transcripts()/
    # get_transcript() with instance methods .list()/.fetch(); older 0.6.x used the
    # classmethods. Support both so the fetcher keeps working across versions.
    api = YTA()
    listing = getattr(api, "list", None) or getattr(YTA, "list_transcripts", None)
    try:
        tl = listing(vid)
        try:
            tr = tl.find_manually_created_transcript(langs).fetch()
            kind = "MANUAL (human captions — high accuracy)"
        except Exception:
            tr = tl.find_generated_transcript(langs).fetch()
            kind = "AUTO / ASR (mishears names, dates, numbers — verify EVERY one)"
    except Exception:
        fetch = getattr(api, "fetch", None) or getattr(YTA, "get_transcript", None)
        tr = fetch(vid, languages=langs)
        kind = "unknown (could not tell manual vs auto — treat as auto)"
    lines = []
    for seg in tr:
        start = seg.get("start", 0) if isinstance(seg, dict) else getattr(seg, "start", 0)
        text = seg.get("text", "") if isinstance(seg, dict) else getattr(seg, "text", "")
        t = int(start or 0)
        lines.append("[%02d:%02d] %s" % (t // 60, t % 60, (text or "").strip()))
    return kind, "\n".join(lines)


def via_ytdlp(vid, lang, outdir):
    # Fallback: needs yt-dlp on PATH. Requests manual subs first (more accurate),
    # then auto — yt-dlp writes whichever exist. Returns (kind, body).
    url = "https://www.youtube.com/watch?v=" + vid
    subprocess.check_call([
        "yt-dlp", "--skip-download", "--write-sub", "--write-auto-sub",
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
    # yt-dlp doesn't cleanly tell us manual vs auto from the filename; flag conservatively.
    return "yt-dlp captions (verify names/dates — may be auto-generated)", "\n".join(text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", help="YouTube URL or 11-char id")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--out", default=DEFAULT_OUT)
    a = ap.parse_args()

    vid = video_id(a.video)
    os.makedirs(a.out, exist_ok=True)
    kind, body = None, None

    if ensure_pkg():
        try:
            kind, body = via_api(vid, a.lang)
        except Exception as e:
            print("youtube-transcript-api failed (%s) — trying yt-dlp…" % e, file=sys.stderr)
    if body is None:
        try:
            kind, body = via_ytdlp(vid, a.lang, a.out)
        except FileNotFoundError:
            raise SystemExit("No transcript method worked. Install one:\n"
                             "  pip install youtube-transcript-api   (or)   pip install yt-dlp")

    out_path = os.path.join(a.out, vid + ".txt")
    header = (REMINDER
              + "\ncaption source: " + (kind or "unknown")
              + "\nsource: https://www.youtube.com/watch?v=" + vid + "\n\n")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header + (body or ""))
    print("OK  " + out_path)
    print("    caption source: " + (kind or "unknown"))
    print("    (%d chars) — mine for argument shape + primaries; do not commit or quote." % len(body or ""))
    if kind and ("AUTO" in kind or "auto" in kind or "unknown" in kind):
        # ASCII-only (Windows consoles default to cp1252 and choke on non-ASCII).
        print("    ! Not human captions - distrust every name/date/number; verify against the primary.")


if __name__ == "__main__":
    main()
