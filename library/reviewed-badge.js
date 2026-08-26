/* Reviewed-badge — a small "✓ Reviewed & current — Mon YYYY" trust badge that
   reads the date this page ALREADY stores in its hidden `content-review` stamp
   (the HTML comment near the top of the file) and renders it visibly under the
   title. It surfaces existing data — it introduces no new claim and needs no
   doctrinal gate.

   Usage: add one include to an essay/fragment —
     <script src="/library/reviewed-badge.js" defer></script>
   The script self-injects its CSS and places the badge after the first of:
     [data-reviewed-badge]  ->  .art-meta  ->  h1
   The date shown is the MOST RECENT of the stamp's argument/orthodoxy/
   neutrality/citations dates. Deliberately shows only "reviewed + date" — no
   changelog, no per-review detail. Styled for the light "manuscript" essay
   theme (gold #c8a951 / green check). */
(function () {
  if (window.__reviewedBadge) return; window.__reviewedBadge = true;

  function run() {
    // 1. Find the content-review stamp (a comment node anywhere in the document).
    var walker = document.createNodeIterator(document, NodeFilter.SHOW_COMMENT, null);
    var node, payload = null;
    while ((node = walker.nextNode())) {
      var t = node.nodeValue || '';
      var i = t.indexOf('content-review:');
      if (i === -1) continue;
      var jsonStr = t.slice(i + 'content-review:'.length).trim();
      try { payload = JSON.parse(jsonStr); } catch (e) { payload = null; }
      if (payload) break;
    }
    if (!payload) return;

    // 2. The badge date = the most recent ISO date among the review lenses.
    var iso = /^\d{4}-\d{2}-\d{2}$/;
    var latest = '';
    ['argument', 'orthodoxy', 'neutrality', 'citations'].forEach(function (k) {
      var v = payload[k];
      if (typeof v === 'string' && iso.test(v) && v > latest) latest = v;
    });
    if (!latest) return;

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var parts = latest.split('-');
    var label = MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];

    // 3. Inject CSS once.
    var css = [
      '.rev-badge{position:relative;display:inline-flex;align-items:center;gap:.5em;',
      "font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;letter-spacing:.01em;",
      'color:#2f7a48;background:rgba(70,150,95,.10);border:1px solid rgba(70,150,95,.32);',
      'border-radius:999px;padding:.32em .8em .32em .62em;margin:-8px 0 22px;cursor:default}',
      '.rev-badge svg{flex:0 0 auto;width:1.05em;height:1.05em}',
      '.rev-badge .rev-when{color:#1f5a37}',
      '.rev-info{color:#2f7a48;font-weight:800;font-size:.82em;font-style:italic;',
      'border:1.5px solid rgba(70,150,95,.5);border-radius:50%;width:1.35em;height:1.35em;',
      'display:inline-flex;align-items:center;justify-content:center;cursor:help;margin-left:.2em}',
      '.rev-info:focus-visible{outline:2px solid #2f7a48;outline-offset:2px}',
      // styled tooltip (replaces the browser's default grey title box)
      '.rev-tip{position:absolute;left:0;right:auto;top:calc(100% + 9px);z-index:45;',
      'width:min(290px,calc(100vw - 32px));background:#fff;',
      'border:1px solid rgba(70,150,95,.4);border-radius:12px;',
      'box-shadow:0 16px 44px rgba(10,22,40,.20);padding:.8rem .95rem;text-align:left;',
      "font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;line-height:1.5;color:#26364e;letter-spacing:0;",
      'opacity:0;visibility:hidden;pointer-events:none;transform:translateY(6px);',
      'transition:opacity .15s ease,transform .15s ease}',
      '.rev-tip::before{content:"";position:absolute;left:1.1em;top:-7px;width:12px;height:12px;',
      'background:#fff;border-left:1px solid rgba(70,150,95,.4);border-top:1px solid rgba(70,150,95,.4);',
      'transform:rotate(45deg)}',
      '.rev-info:hover + .rev-tip,.rev-info:focus + .rev-tip,.rev-tip.is-open{',
      'opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}',
      '@media (max-width:640px){.rev-badge{font-size:.72rem}}',
      '@media (prefers-reduced-motion:reduce){.rev-tip{transition:none}}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'reviewed-badge-css'; style.textContent = css;
    document.head.appendChild(style);

    // 4. Build the badge.
    var badge = document.createElement('div');
    badge.className = 'rev-badge';
    badge.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="#2f7a48" stroke-width="2.4" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20 6 9 17l-5-5"/></svg>' +
      '<span>Reviewed &amp; current &mdash; <span class="rev-when">' + label + '</span></span>' +
      '<span class="rev-info" tabindex="0" aria-describedby="rev-tip-desc" ' +
        'aria-label="More about this review status">i</span>' +
      '<span class="rev-tip" role="tooltip" id="rev-tip-desc">Every citation, argument, ' +
        'and doctrinal claim on this page was checked through our review process before it ' +
        'was published. This is the date it was last reviewed.</span>';

    // 5. Place it.
    var anchor = document.querySelector('[data-reviewed-badge]') ||
                 document.querySelector('.art-meta') ||
                 document.querySelector('main h1') ||
                 document.querySelector('h1');
    if (!anchor) return;
    if (anchor.nextSibling) anchor.parentNode.insertBefore(badge, anchor.nextSibling);
    else anchor.parentNode.appendChild(badge);

    // 6. Tap-toggle for touch devices (hover/focus already covered by CSS).
    var info = badge.querySelector('.rev-info');
    var tip = badge.querySelector('.rev-tip');
    if (info && tip) {
      info.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        tip.classList.toggle('is-open');
      });
      document.addEventListener('click', function (e) {
        if (!badge.contains(e.target)) tip.classList.remove('is-open');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') tip.classList.remove('is-open');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();
