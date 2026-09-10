# Next local session — video work (start here)

Open a local Claude Code session on this repo and say: **"Read `docs/NEXT_LOCAL_SESSION.md` and start on
Task 2."** This file has everything: the plan, the exact prompts, and the rules. Do the tasks in order.

## Where things stand (context)

- **Video lessons are live.** Short brand-styled videos (from the certified reel specs in
  `tools/reel/specs/*.json`) play at the top of each deep-dive essay via `library/video-lesson.js`, driven
  by `library/video-lessons.json` (essay-slug → `{ reel, youtube }`; a non-empty `youtube` id = live).
- **13 videos uploaded + wired so far.** Live ids in `video-lessons.json`: hist_jesus, kalam, finetuning,
  manuscript, minimalfacts (the first 5), plus the Jesus-tab batch was rendered and handed over
  (earlycreed, hands, jesus_as_god_nt, jesus_claims, messianic-prophecy, titles, typology, uniqueness) —
  those get their ids once uploaded.
- **Tooling that exists:** `tools/reel/render-lessons.py` (renders mapped videos wide/vertical, optional
  `--voice` via edge-tts, MANIFEST.csv), `tools/reel/gen_thumbnails.py` (branded 1280×720 thumbnails),
  `tools/reel/gen_youtube_art.py` (channel banner/avatar/logo). Full runbook: `docs/VIDEO_LESSONS.md`.

## Standing rules (apply to every task below)

- **Deploy by pushing the working branch to `main`** (`git push origin <branch>:main`). **Never
  `git checkout main`.** Keep the working branch in sync (`git fetch origin main` + rebase if it moved).
- **Rendered MP4s are git-ignored** (`tools/reel/output/`) — never commit them.
- **Never change any reel/essay wording** unless a task says so — it's gated content. A wording change
  re-opens the gate (`apologia-argument` + `apologia-orthodoxy`, + `apologia-neutrality` for
  deity/Trinity/resurrection/Islam) and needs a `reviewed`/stamp bump.
- Run `node --test tests/*.test.mjs` and the content checks before deploying.

---

## Task 2 — argument-card videos (do this first; UI plumbing, no gate)

Add the matching short video to each argument **inside the Evidence Library tabs**, reusing
`library/video-lessons.json`. Today the video only shows at the top of each essay.

Goal: when an argument **card** is expanded in a tab (`ev-s1`…`ev-s8.html`, loaded into
`evidence-library.html`), show that argument's video inside the card — only for arguments whose essay has
an uploaded `youtube` id.

Steps:
1. Read `evidence-library.html` and `ev-s3.html` to learn the card markup — how each card is identified,
   how it links to its `library/*.html` essay, and how expand/collapse works.
2. Build the card → essay-slug → youtube-id mapping (use the essay link already in each card +
   `video-lessons.json`).
3. Inject the video with the **same privacy-safe pattern as `library/video-lesson.js`**: click-to-load,
   `youtube-nocookie.com`, a cookieless `i.ytimg.com` poster, iframe created only on tap. Style it to
   match the essay's navy "watch the short version" box.
4. Prefer **one small shared script** (like `video-lesson.js`) that runs on the Evidence Library and wires
   all the cards, rather than editing each fragment by hand.
5. Reuses already-gated videos → **no content gate.** Run the tests + content checks, deploy, and report
   exactly what changed. Placement only — no wording changes.

---

## Task 2b — render the voiced videos (whenever you want spoken versions)

The cloud sandbox blocks the voice network; a local session doesn't. This produces spoken versions of the
videos to (re-)upload.

```
pip install edge-tts pillow imageio-ffmpeg
# test one voice first:
python3 tools/reel/render-lessons.py --only kalam --voice
# try a few voices if you like: --voice-name en-US-AndrewNeural | en-GB-SoniaNeural | en-US-AriaNeural
# then the whole set, both aspect ratios, + thumbnails:
python3 tools/reel/render-lessons.py --voice --vertical
python3 tools/reel/gen_thumbnails.py
```
Then show MANIFEST.csv and the output folder. Don't commit the MP4s. If the voice is slightly off-pace on a
video, adjust that spec's `pace` (wording unchanged = no re-gate).

---

## Task 3 — tab intro videos (pilot the Jesus tab AFTER Task 2)

New, purpose-made orientation video per Evidence Library tab. **This is new content → full gate.** The
complete brief + step-by-step pilot build is in **`docs/VIDEO_LESSONS.md`** under
"Video placement plan" → "#3". In short:

- **Lean on the subject + its arguments** (evergreen) and give a **detailed, clear tour of the features**
  (essays, AI tutor, mastery/Explain-It-Back, daily practice, pocket cards, Debate Arena, tiered reading,
  read-aloud) — described by **capability, not screen position**, so a UI change doesn't date it. Honest
  framing: **"makes the case," never "proves."**
- Write `tools/reel/specs/intro-jesus.json`, **gate it** (argument + orthodoxy + neutrality, deity tier),
  render + voice, upload, and place a **"▶ New here? Start with the 1-minute overview"** card at the TOP of
  the `ev-s3` tab fragment. Review the feel with the owner before doing the other 7 tabs.

(The owner may already have a drafted Jesus-intro script — check with them before writing a new one.)
