/* video-lesson.js — the "watch the short version" card at the top of a deep-dive
   essay. Reads /library/video-lessons.json; if THIS essay has an entry with a
   non-empty youtube id, it injects a navy lesson card holding a 16:9 video —
   the essay's own certified reel, rendered wide and uploaded to YouTube.

   HOOK, NOT LESSON: the reels are ~50-second openers; the essay does the
   teaching. The card copy says exactly that, so the short video never poses as
   the full case.

   PRIVACY: click-to-load. On page view nothing loads from YouTube except a
   single cookieless still image (i.ytimg.com). The player iframe
   (youtube-nocookie.com, privacy-enhanced mode) is created only when the reader
   taps play — so no video cookies are set unless the reader chooses to watch,
   consistent with privacy.html. No new content and no doctrinal claim — the
   card is plumbing around already-certified video. No gate.

   Usage: one include per essay — <script src="/library/video-lesson.js" defer></script>
   Inert until video-lessons.json carries a youtube id for the essay. */
(function () {
  if (window.__videoLesson) return; window.__videoLesson = true;

  function slug() {
    var parts = location.pathname.split('/').filter(Boolean);
    var last = parts.length ? parts[parts.length - 1] : '';
    return last.replace(/\.html$/, '');
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var body = document.querySelector('.art-body');
    if (!body || document.querySelector('.vlesson')) return;
    var id = slug();
    if (!id) return;

    fetch('/library/video-lessons.json', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var e = data && data.lessons && data.lessons[id];
        if (!e || !e.youtube) return;               // no video, or not uploaded yet → stay dark
        if (!/^[A-Za-z0-9_-]{6,20}$/.test(e.youtube)) return; // guard: only a plausible YouTube id
        injectCss();
        insert(body, e.youtube);
      })
      .catch(function () { /* offline / missing file → no card, essay unaffected */ });
  });

  function insert(body, ytid) {
    var card = document.createElement('aside');
    card.className = 'vlesson';
    card.setAttribute('aria-label', 'Watch the short version of this argument');
    var poster = 'https://i.ytimg.com/vi/' + ytid + '/hqdefault.jpg';
    card.innerHTML =
      '<div class="vl-head">' +
        '<span class="vl-eyebrow">&#9654;&nbsp;The short version</span>' +
        '<span class="vl-note">Watch first, then read the full case below</span>' +
      '</div>' +
      '<button type="button" class="vl-frame" aria-label="Play the video">' +
        '<img class="vl-poster" src="' + poster + '" alt="" loading="lazy" width="480" height="270">' +
        '<span class="vl-play" aria-hidden="true"><span class="vl-tri"></span></span>' +
      '</button>' +
      '<p class="vl-cap">A ~1-minute, fully-captioned summary&mdash;the same argument as the essay, compressed. ' +
        'It&rsquo;s a starting point; the essay below is where the case is actually made.</p>';
    body.insertBefore(card, body.firstChild);

    card.querySelector('.vl-frame').addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.className = 'vl-embed';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + ytid + '?autoplay=1&rel=0&modestbranding=1';
      f.title = 'Video lesson';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      wrap.appendChild(f);
      this.replaceWith(wrap);
      if (window.adTrack) { try { window.adTrack('essay_video_play', { id: ytid }); } catch (e) {} }
    });
  }

  function injectCss() {
    var css = [
      '.vlesson{margin:0 0 1.9rem;padding:12px 12px 4px;background:#0a1628;',
      'border:1px solid rgba(200,169,81,.35);border-radius:12px;box-shadow:0 14px 40px rgba(10,22,40,.16)}',
      '.vlesson .vl-head{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin:0 4px 10px}',
      ".vlesson .vl-eyebrow{font-family:'DM Sans',system-ui,sans-serif;font-size:.7rem;font-weight:700;",
      'letter-spacing:.12em;text-transform:uppercase;color:#c8a951}',
      ".vlesson .vl-note{font-family:'DM Sans',system-ui,sans-serif;font-size:.76rem;color:rgba(255,255,255,.55)}",
      '.vlesson .vl-frame{display:block;width:100%;padding:0;border:0;cursor:pointer;position:relative;',
      'aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}',
      '.vlesson .vl-poster{width:100%;height:100%;object-fit:cover;display:block;opacity:.86;transition:opacity .15s}',
      '.vlesson .vl-frame:hover .vl-poster{opacity:1}',
      '.vlesson .vl-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:66px;height:66px;',
      'border-radius:50%;background:rgba(200,169,81,.94);display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 6px 20px rgba(0,0,0,.4);transition:transform .15s}',
      '.vlesson .vl-frame:hover .vl-play{transform:translate(-50%,-50%) scale(1.06)}',
      '.vlesson .vl-tri{width:0;height:0;margin-left:5px;border-style:solid;border-width:12px 0 12px 20px;',
      'border-color:transparent transparent transparent #0a1628}',
      '.vlesson .vl-frame:focus-visible{outline:2px solid #c8a951;outline-offset:3px}',
      ".vlesson .vl-cap{font-family:'DM Sans',system-ui,sans-serif;font-size:.78rem;line-height:1.5;",
      'color:rgba(255,255,255,.62);margin:9px 4px 8px}',
      '.vlesson .vl-embed{position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}',
      '.vlesson .vl-embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
    ].join('');
    var st = document.createElement('style'); st.id = 'video-lesson-css'; st.textContent = css;
    document.head.appendChild(st);
  }
})();
