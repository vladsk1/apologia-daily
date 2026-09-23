/* card-video.js — the SAME certified "short version" video, shown INSIDE an
   Evidence Library argument card when that card is expanded.

   Today the video only appears at the top of each deep-dive essay
   (library/video-lesson.js). This puts the identical video inside the argument's
   card in the tab (ev-s1..ev-s8, loaded into evidence-library.html), so a reader
   who never opens the essay still sees it.

   PLUMBING, NOT CONTENT: it reuses library/video-lessons.json and the essay link
   the fragment already carries. No new wording, no doctrinal claim — the video is
   already-gated content and this only places it. No gate.

   HOW IT'S WIRED: fragments are injected with innerHTML, and <script> tags inside
   injected HTML never run — so a fragment cannot enhance itself. evidence-library
   .html's enhanceSection() calls window.ADCardVideo.apply(container) over each
   freshly loaded fragment, the same runtime route ADCrossLink / ADDiagram /
   reviewed-badge.js use. It runs BEFORE ADCrossLink, so at scan time the only
   /library/*.html link in a card is the essay CTA the fragment shipped with (one
   per card) — never a cross-link ADCrossLink would later inject.

   LONG FORM: when the lesson entry also carries a "full" youtube id (the narrated,
   animated explainer from tools/reel/gen_explainer.py), a second box — "The full
   explainer" — goes at the top of the card's Pro Deep Dive tier. Same data file,
   same click-to-load privacy, dark until the id is filled in.

   PRIVACY: identical to video-lesson.js — click-to-load. The card body is
   display:none until the card is expanded, so the single cookieless poster image
   (i.ytimg.com, loading="lazy") is not fetched until the reader opens the card;
   the player iframe (youtube-nocookie.com, privacy-enhanced) is created only when
   the reader taps play. No video cookies are set unless the reader chooses to
   watch — consistent with privacy.html. */
(function () {
  var mapPromise = null;

  function getLessons() {
    if (mapPromise) return mapPromise;
    mapPromise = fetch('/library/video-lessons.json', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return (d && d.lessons) || {}; })
      .catch(function () { return {}; });   // offline / missing → no cards, tab unaffected
    return mapPromise;
  }

  /* The essay slug = the filename of the /library/*.html CTA the card ships with.
     video-lessons.json is keyed by that same essay slug (so a card whose id is
     arg-messianic_prophecy still resolves via its /library/messianic-prophecy.html
     link). */
  function slugFor(card) {
    var a = card.querySelector('a[href*="/library/"][href$=".html"]');
    if (!a) return '';
    var m = (a.getAttribute('href') || '').match(/\/library\/([A-Za-z0-9_-]+)\.html/);
    return m ? m[1] : '';
  }

  function apply(container) {
    if (!container) return;
    getLessons().then(function (lessons) {
      var cards = container.querySelectorAll('.card');
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var e = lessons[slugFor(card)];
        if (!e) continue;
        var cb = card.querySelector('.cb');
        if (!cb) continue;
        var titleEl = card.querySelector('.ct');
        var title = titleEl ? (titleEl.textContent || '').trim() : '';
        // 1. the ~1-minute reel, at the top of the card body
        if (okId(e.youtube) && !card.querySelector('.cardvid-short')) {
          injectCss();
          insert(cb, cb.firstChild, e.youtube, {
            cls: 'cardvid-short', label: 'Watch the short version of this argument',
            eyebrow: '&#9654;&nbsp;The short version', title: title, event: 'card_video_play',
            note: 'A ~1-minute, captioned overview of this argument. Watch first, then read the case below.' });
        }
        // 2. the long-form narrated explainer, at the top of the Pro Deep Dive tier
        var deep = okId(e.full) && !card.querySelector('.cardvid-full') && deepDive(card);
        if (deep) {
          injectCss();
          insert(deep, deep.firstChild, e.full, {
            cls: 'cardvid-full', label: 'Watch the full explainer of this argument',
            eyebrow: '&#9654;&nbsp;The full explainer' + (e.full_dur ? ' &middot; ' + esc(e.full_dur) : ''),
            title: title, event: 'card_video_full_play',
            note: 'An animated, narrated walk through the whole case: both premises, the evidence, and the ' +
                  'strongest objections. Captioned. The deep dive below goes further still.' });
        }
      }
    });
  }

  function okId(id) { return !!id && /^[A-Za-z0-9_-]{6,20}$/.test(id); }  // plausible YouTube id only

  /* The card's "Pro — Deep Dive" tier: the .pro block whose badge says "Deep Dive"
     (not "The Case, Plainly"). Returns its .pro-explain body, or null. */
  function deepDive(card) {
    var pros = card.querySelectorAll('.pro');
    for (var i = 0; i < pros.length; i++) {
      var b = pros[i].querySelector('.prob');
      if (b && /deep dive/i.test(b.textContent || '')) return pros[i].querySelector('.pro-explain');
    }
    return null;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function insert(parent, before, ytid, o) {
    var card = document.createElement('aside');
    card.className = 'cardvid cardvid-c ' + o.cls;
    card.setAttribute('aria-label', o.label);
    var poster = 'https://i.ytimg.com/vi/' + ytid + '/hqdefault.jpg';
    card.innerHTML =
      '<button type="button" class="cv-frame" aria-label="Play the video">' +
        '<img class="cv-poster" src="' + poster + '" alt="" loading="lazy" width="480" height="270">' +
        '<span class="cv-play" aria-hidden="true"><span class="cv-tri"></span></span>' +
      '</button>' +
      '<div class="cv-copy">' +
        '<span class="cv-eyebrow">' + o.eyebrow + '</span>' +
        (o.title ? '<span class="cv-title">' + esc(o.title) + '</span>' : '') +
        '<span class="cv-note2">' + o.note + '</span>' +
      '</div>';
    parent.insertBefore(card, before);

    var btn = card.querySelector('.cv-frame');
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();   // don't let the click bubble up and collapse the card
      var wrap = document.createElement('div');
      wrap.className = 'cv-embed';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + ytid + '?autoplay=1&rel=0&modestbranding=1';
      f.title = 'Video lesson';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      wrap.appendChild(f);
      this.replaceWith(wrap);
      if (window.adTrack) { try { window.adTrack(o.event, { id: ytid }); } catch (e) {} }
    });
  }

  function injectCss() {
    if (document.getElementById('card-video-css')) return;
    var css = [
      '.cardvid{margin:1.25rem 0 1.5rem;padding:12px 12px 4px;background:#0a1628;',
      'border:1px solid rgba(200,169,81,.35);border-radius:12px;box-shadow:0 14px 40px rgba(10,22,40,.16)}',
      '.cardvid .cv-head{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin:0 4px 10px}',
      ".cardvid .cv-eyebrow{font-family:'DM Sans',system-ui,sans-serif;font-size:.7rem;font-weight:700;",
      'letter-spacing:.12em;text-transform:uppercase;color:#c8a951}',
      ".cardvid .cv-note{font-family:'DM Sans',system-ui,sans-serif;font-size:.76rem;color:rgba(255,255,255,.55)}",
      '.cardvid .cv-frame{display:block;width:100%;padding:0;border:0;cursor:pointer;position:relative;',
      'aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}',
      '.cardvid .cv-poster{width:100%;height:100%;object-fit:cover;display:block;opacity:.86;transition:opacity .15s}',
      '.cardvid .cv-frame:hover .cv-poster{opacity:1}',
      '.cardvid .cv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:66px;height:66px;',
      'border-radius:50%;background:rgba(200,169,81,.94);display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 6px 20px rgba(0,0,0,.4);transition:transform .15s}',
      '.cardvid .cv-frame:hover .cv-play{transform:translate(-50%,-50%) scale(1.06)}',
      '.cardvid .cv-tri{width:0;height:0;margin-left:5px;border-style:solid;border-width:12px 0 12px 20px;',
      'border-color:transparent transparent transparent #0a1628}',
      '.cardvid .cv-frame:focus-visible{outline:2px solid #c8a951;outline-offset:3px}',
      ".cardvid .cv-cap{font-family:'DM Sans',system-ui,sans-serif;font-size:.78rem;line-height:1.5;",
      'color:rgba(255,255,255,.62);margin:9px 4px 8px}',
      '.cardvid .cv-embed{position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}',
      '.cardvid .cv-embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0}',
      /* compact (intro-style) layout: smaller video left, title + note right */
      '.cardvid-c{display:flex;gap:16px;align-items:center;padding:14px}',
      '.cardvid-c .cv-frame{flex:0 0 42%;max-width:320px;width:auto}',
      '.cardvid-c .cv-play{width:56px;height:56px}',
      '.cardvid-c .cv-tri{margin-left:4px;border-width:10px 0 10px 17px}',
      '.cardvid-c .cv-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}',
      ".cardvid-c .cv-title{font-family:Georgia,'Times New Roman',serif;font-size:1.05rem;font-weight:700;color:#fff;line-height:1.25}",
      ".cardvid-c .cv-note2{font-family:'DM Sans',system-ui,sans-serif;font-size:.8rem;line-height:1.5;color:rgba(255,255,255,.62)}",
      '.cardvid-c .cv-embed{flex:0 0 42%;max-width:320px}',
      '@media(max-width:640px){.cardvid-c{flex-direction:column;align-items:stretch}',
      '.cardvid-c .cv-frame,.cardvid-c .cv-embed{flex:none;max-width:none;width:100%}}'
    ].join('');
    var st = document.createElement('style'); st.id = 'card-video-css'; st.textContent = css;
    document.head.appendChild(st);
  }

  window.ADCardVideo = { apply: apply };
})();
