/* tab-intro.js — the "▶ New here? Start with the 1-minute overview" card at the
   TOP of an Evidence Library tab fragment (ev-s1..ev-s8, loaded into
   evidence-library.html).

   Unlike card-video.js (which reuses an argument's OWN essay reel inside its
   card), this places a NEW, purpose-made orientation video for the whole tab —
   one that names the tab's subject + arguments and tours the site's features.
   Those intro videos ARE new content and are gated (argument + orthodoxy +
   neutrality) as their reel spec; this script is only the placement.

   HOW IT'S WIRED: evidence-library.html's enhanceSection(container, id) calls
   window.ADTabIntro.apply(container, id) over each freshly loaded fragment (the
   same runtime route as ADCardVideo / ADCrossLink / ADDiagram — fragment <script>
   tags never run on innerHTML injection).

   DATA: library/video-lessons.json → "intros" map, keyed by fragment name:
     "intros": { "ev-s3": { "spec": "intro-jesus", "youtube": "<id>" } }
   The card appears ONLY when that tab's entry has a non-empty, plausible youtube
   id — so the whole layer stays dark until the owner uploads the intro and pastes
   its id, exactly like the essay/card videos.

   PRIVACY: identical click-to-load pattern — one cookieless i.ytimg.com poster on
   view, the youtube-nocookie.com player iframe only on tap. */
(function () {
  var mapPromise = null;

  function getIntros() {
    if (mapPromise) return mapPromise;
    mapPromise = fetch('/library/video-lessons.json', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return (d && d.intros) || {}; })
      .catch(function () { return {}; });   // offline / missing / no intros → nothing renders
    return mapPromise;
  }

  function apply(container, id) {
    if (!container || !id) return;
    if (container.querySelector('.tabintro')) return;   // idempotent
    getIntros().then(function (intros) {
      var e = intros['ev-' + id];                        // id is like "s3" → key "ev-s3"
      if (!e || !e.youtube) return;                      // no intro / not uploaded yet
      if (!/^[A-Za-z0-9_-]{6,20}$/.test(e.youtube)) return;
      if (container.querySelector('.tabintro')) return;
      injectCss();
      insert(container, e.youtube);
    });
  }

  function insert(container, ytid) {
    var card = document.createElement('aside');
    card.className = 'tabintro';
    card.setAttribute('aria-label', 'New here? Watch the 1-minute overview of this section');
    var poster = 'https://i.ytimg.com/vi/' + ytid + '/hqdefault.jpg';
    card.innerHTML =
      '<button type="button" class="ti-frame" aria-label="Play the overview video">' +
        '<img class="ti-poster" src="' + poster + '" alt="" loading="lazy" width="480" height="270">' +
        '<span class="ti-play" aria-hidden="true"><span class="ti-tri"></span></span>' +
      '</button>' +
      '<div class="ti-copy">' +
        '<span class="ti-eyebrow">&#9654;&nbsp;New here?</span>' +
        '<span class="ti-title">Start with the 1-minute overview</span>' +
        '<span class="ti-note">What this section covers, and how to use it&mdash;before you dive in.</span>' +
      '</div>';
    container.insertBefore(card, container.firstChild);

    var btn = card.querySelector('.ti-frame');
    btn.addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.className = 'ti-embed';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + ytid + '?autoplay=1&rel=0&modestbranding=1';
      f.title = 'Section overview';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      wrap.appendChild(f);
      this.replaceWith(wrap);
      if (window.adTrack) { try { window.adTrack('tab_intro_play', { id: ytid }); } catch (e) {} }
    });
  }

  function injectCss() {
    if (document.getElementById('tab-intro-css')) return;
    var css = [
      '.tabintro{display:flex;gap:16px;align-items:center;margin:0 0 1.75rem;padding:14px;',
      'background:#0a1628;border:1px solid rgba(200,169,81,.4);border-radius:12px;',
      'box-shadow:0 14px 40px rgba(10,22,40,.16)}',
      '.tabintro .ti-frame{flex:0 0 42%;max-width:320px;display:block;padding:0;border:0;cursor:pointer;',
      'position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}',
      '.tabintro .ti-poster{width:100%;height:100%;object-fit:cover;display:block;opacity:.88;transition:opacity .15s}',
      '.tabintro .ti-frame:hover .ti-poster{opacity:1}',
      '.tabintro .ti-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;',
      'border-radius:50%;background:rgba(200,169,81,.94);display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 6px 20px rgba(0,0,0,.4);transition:transform .15s}',
      '.tabintro .ti-frame:hover .ti-play{transform:translate(-50%,-50%) scale(1.06)}',
      '.tabintro .ti-tri{width:0;height:0;margin-left:4px;border-style:solid;border-width:10px 0 10px 17px;',
      'border-color:transparent transparent transparent #0a1628}',
      '.tabintro .ti-frame:focus-visible{outline:2px solid #c8a951;outline-offset:3px}',
      '.tabintro .ti-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}',
      ".tabintro .ti-eyebrow{font-family:'DM Sans',system-ui,sans-serif;font-size:.7rem;font-weight:700;",
      'letter-spacing:.12em;text-transform:uppercase;color:#c8a951}',
      ".tabintro .ti-title{font-family:Georgia,'Times New Roman',serif;font-size:1.05rem;font-weight:700;color:#fff;line-height:1.25}",
      ".tabintro .ti-note{font-family:'DM Sans',system-ui,sans-serif;font-size:.8rem;line-height:1.5;color:rgba(255,255,255,.6)}",
      '.tabintro .ti-embed{flex:0 0 42%;max-width:320px;position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}',
      '.tabintro .ti-embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0}',
      '@media(max-width:640px){.tabintro{flex-direction:column;align-items:stretch}',
      '.tabintro .ti-frame,.tabintro .ti-embed{flex:none;max-width:none;width:100%}}'
    ].join('');
    var st = document.createElement('style'); st.id = 'tab-intro-css'; st.textContent = css;
    document.head.appendChild(st);
  }

  window.ADTabIntro = { apply: apply };
})();
