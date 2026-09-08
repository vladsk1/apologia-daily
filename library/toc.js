/* toc.js — reading aids for the deep-dive essays (usability item 12). Pure
   display of what the page already contains: it builds
     1. a thin reading-PROGRESS bar pinned to the top of the viewport,
     2. an estimated READING TIME appended to the .art-meta line,
     3. a sticky "On this page" TABLE OF CONTENTS built from the essay's own
        <h2>/<h3> section headings.
   It introduces no new claim or content, so it needs no doctrinal gate — same
   class as reviewed-badge.js / evidence.js.

   Usage: add one include near the end of an essay —
     <script src="/library/toc.js" defer></script>

   Layout: the TOC renders TWO ways, chosen by CSS media query — a fixed sidebar
   in the left margin on wide screens, and a collapsible "On this page" panel
   inline under the title on narrow screens. Both are keyboard-accessible and
   the active section is highlighted as you scroll. Nothing in the essay's HTML
   is restructured; ids are generated at runtime for headings that lack them. */
(function () {
  if (window.__essayToc) return; window.__essayToc = true;

  var WPM = 220;          // reading speed for the estimate
  var MIN_HEADINGS = 3;   // below this, a TOC is noise — skip it (bar + time still show)
  var NAV_OFFSET = 84;    // px cleared under the fixed top nav for anchor jumps / spy

  function run() {
    var body = document.querySelector('.art-body') || document.querySelector('main.art');
    if (!body) return;

    injectCss();
    addReadingTime(body);
    var bar = addProgressBar();

    // Section headings = the essay's own argument spine (excludes the paywall
    // overlay, footnotes, bibliography and FAQ, which live outside .art-body).
    var heads = [].slice.call(body.querySelectorAll('h2, h3'))
      .filter(function (h) { return (h.textContent || '').trim().length > 1; });

    var links = [];
    if (heads.length >= MIN_HEADINGS) {
      var items = heads.map(function (h) {
        if (!h.id) h.id = uniqueId(slug(h.textContent));
        return { id: h.id, text: (h.textContent || '').trim(), sub: h.tagName === 'H3' };
      });
      links = buildTocs(items);
    }

    // One rAF-throttled scroll handler drives both the progress bar and the
    // active-section highlight.
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateProgress(bar, body);
        if (links.length) updateActive(heads, links);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  // ── reading time ──────────────────────────────────────────────────────────
  function addReadingTime(body) {
    var words = (body.innerText || body.textContent || '').trim().split(/\s+/).filter(Boolean).length;
    if (!words) return;
    var mins = Math.max(1, Math.round(words / WPM));
    var meta = document.querySelector('.art-meta');
    var span = document.createElement('span');
    span.className = 'toc-time';
    if (meta) {
      span.innerHTML = ' &middot; ' + mins + ' min read';
      meta.appendChild(span);
    }
  }

  // ── progress bar ──────────────────────────────────────────────────────────
  function addProgressBar() {
    var wrap = document.createElement('div');
    wrap.className = 'toc-progress'; wrap.setAttribute('aria-hidden', 'true');
    var fill = document.createElement('div');
    wrap.appendChild(fill);
    document.body.appendChild(wrap);
    return fill;
  }
  function updateProgress(fill, body) {
    var top = body.getBoundingClientRect().top + window.pageYOffset;
    var denom = body.offsetHeight - window.innerHeight;
    var p = denom > 0 ? (window.pageYOffset - top) / denom : 1;
    fill.style.width = Math.max(0, Math.min(1, p)) * 100 + '%';
  }

  // ── table of contents (sidebar + inline) ──────────────────────────────────
  function buildTocs(items) {
    function list() {
      var ul = document.createElement('ul');
      items.forEach(function (it) {
        var li = document.createElement('li');
        if (it.sub) li.className = 'toc-sub';
        var a = document.createElement('a');
        a.href = '#' + it.id; a.textContent = it.text; a.dataset.id = it.id;
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var t = document.getElementById(it.id);
          if (!t) return;
          var y = t.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
          var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
          if (history.replaceState) history.replaceState(null, '', '#' + it.id);
          if (inlineWrap) inlineWrap.open = false;   // close the mobile panel after a jump
        });
        li.appendChild(a); ul.appendChild(li);
      });
      return ul;
    }

    // (a) fixed sidebar — shown on wide screens by CSS
    var side = document.createElement('nav');
    side.className = 'toc-side'; side.setAttribute('aria-label', 'On this page');
    var sh = document.createElement('div'); sh.className = 'toc-h'; sh.textContent = 'On this page';
    side.appendChild(sh); side.appendChild(list());

    // (b) inline collapsible — shown on narrow screens by CSS. A native <details>
    //     is keyboard-accessible and needs no ARIA wiring.
    var inlineWrap = document.createElement('details');
    inlineWrap.className = 'toc-inline';
    var sum = document.createElement('summary');
    sum.innerHTML = '<span>On this page</span><span class="toc-chev" aria-hidden="true">&#9662;</span>';
    inlineWrap.appendChild(sum); inlineWrap.appendChild(list());

    document.body.appendChild(side);
    var anchor = document.querySelector('.art-meta') || document.querySelector('main h1') || document.querySelector('h1');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(inlineWrap, anchor.nextSibling);
    else document.body.appendChild(inlineWrap);

    return [].slice.call(document.querySelectorAll('.toc-side a, .toc-inline a'));
  }

  function updateActive(heads, links) {
    var active = heads[0].id, mark = NAV_OFFSET + 12;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= mark) active = heads[i].id;
      else break;
    }
    links.forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.id === active);
    });
  }

  // ── helpers ───────────────────────────────────────────────────────────────
  function slug(s) {
    return (s || '').toLowerCase().replace(/&[a-z#0-9]+;/g, ' ')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
  }
  function uniqueId(base) {
    var id = base, n = 2;
    while (document.getElementById(id)) id = base + '-' + n++;
    return id;
  }

  function injectCss() {
    var css = [
      // progress bar
      '.toc-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;background:transparent;pointer-events:none}',
      '.toc-progress>div{height:100%;width:0;background:#c8a951;transition:width .1s linear}',
      // shared list styling
      ".toc-side,.toc-inline{font-family:'DM Sans',sans-serif}",
      '.toc-side ul,.toc-inline ul{list-style:none;margin:0;padding:0}',
      '.toc-side a,.toc-inline a{display:block;text-decoration:none;color:#5a6b82;',
      'font-size:.82rem;line-height:1.4;padding:.34em 0;border-left:2px solid transparent;',
      'padding-left:.7em;transition:color .12s,border-color .12s}',
      '.toc-side a:hover,.toc-inline a:hover{color:#0a1628}',
      '.toc-side li.toc-sub a,.toc-inline li.toc-sub a{padding-left:1.5em;font-size:.78rem;color:#7a8ba0}',
      '.toc-side a.is-active,.toc-inline a.is-active{color:#0a1628;border-left-color:#c8a951;font-weight:600}',
      '.toc-side a:focus-visible,.toc-inline a:focus-visible,.toc-inline summary:focus-visible{',
      'outline:2px solid #c8a951;outline-offset:2px;border-radius:2px}',
      '.toc-h{font-family:"DM Sans",sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.12em;',
      'text-transform:uppercase;color:#8a6d1f;margin:0 0 .6em .7em}',
      // fixed sidebar (wide screens)
      '.toc-side{position:fixed;top:110px;left:max(16px,calc(50vw - 580px));width:190px;',
      'max-height:calc(100vh - 150px);overflow:auto;z-index:20;display:none;',
      'padding-right:6px;-webkit-overflow-scrolling:touch}',
      // inline collapsible (narrow screens)
      '.toc-inline{display:block;background:#fff;border:1px solid #e8e2d8;border-radius:10px;',
      'margin:-6px 0 26px;padding:0 14px;overflow:hidden}',
      '.toc-inline summary{list-style:none;cursor:pointer;display:flex;align-items:center;',
      'justify-content:space-between;gap:.5em;padding:.7em 0;font-size:.72rem;font-weight:700;',
      'letter-spacing:.1em;text-transform:uppercase;color:#8a6d1f}',
      '.toc-inline summary::-webkit-details-marker{display:none}',
      '.toc-inline .toc-chev{transition:transform .18s;font-size:.9em}',
      '.toc-inline[open] .toc-chev{transform:rotate(180deg)}',
      '.toc-inline ul{padding:0 0 .6em}',
      '.toc-inline a{padding-left:.9em;border-left-width:2px}',
      // scroll-margin so both anchor jumps and #hash loads clear the fixed nav
      '.art-body h2,.art-body h3{scroll-margin-top:' + NAV_OFFSET + 'px}',
      // breakpoints: sidebar only where the centred 720px column leaves room
      '@media (min-width:1200px){.toc-side{display:block}.toc-inline{display:none}}',
      '@media (prefers-reduced-motion:reduce){.toc-progress>div,.toc-inline .toc-chev{transition:none}}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'essay-toc-css'; style.textContent = css;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
