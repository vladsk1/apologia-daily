/* a11y.js — site-wide accessibility basics (2026-10-08 audit, item 8, batch 1).
 *
 * Loaded once per page by ad-nav.js and analytics.js (whichever runs first; the
 * guard below stops a second copy). Changes nothing for mouse users:
 *   1. a visible focus outline for KEYBOARD focus (:focus-visible), restoring the
 *      outlines that page styles removed with outline:none;
 *   2. a "Skip to content" link, shown only when it receives keyboard focus;
 *   3. reduced motion for people who ask their device for it;
 *   4. AI replies announced to screen readers as they arrive (aria-live);
 *   5. decorative SVG icons hidden from screen readers.
 */
(function () {
  'use strict';
  if (window.__AD_A11Y) return;
  window.__AD_A11Y = true;

  var CSS = [
    /* 1. Keyboard focus. :focus-visible only, so a mouse click shows nothing new.
       !important beats the page-level outline:none rules. The offset keeps the ring
       visible on gold buttons too. */
    ':focus-visible{outline:3px solid #c8a951 !important;outline-offset:2px !important;}',
    /* 2. Skip link: off-screen until focused. */
    '.a11y-skip{position:absolute;left:-9999px;top:0;z-index:2147483001;}',
    '.a11y-skip:focus{left:16px;top:12px;background:#0a1628;color:#f5f0e6;padding:10px 16px;border-radius:4px;' +
      'font:600 15px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;text-decoration:none;}',
    '.sr-only{position:absolute !important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}',
    /* 3. Reduced motion. Very short rather than zero, so animations and transitions
       still reach their end state (content that fades in still appears). */
    '@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;' +
      'animation-iteration-count:1 !important;animation-delay:0s !important;transition-duration:.01ms !important;' +
      'transition-delay:0s !important;scroll-behavior:auto !important;}}'
  ].join('\n');

  /* Where AI replies are written, page by page. A polite live region reads new text
     out after the screen reader finishes what it is saying. */
  var LIVE = [
    '#chat-box',          // debate-arena
    '#answer-body',       // ask-anything
    '#result',            // asked-and-answered
    '#hcAnswer',          // homepage chat
    '#ai-response-text',  // daily-devotional
    '#float-response',    // library essays: AI tutor
    '#scoreFeed',         // ev-m-* mastery pages: Explain It Back feedback
    '#fb-strengths', '#fb-improve', // explain-it-back
    '#start-result-inner' // homepage "where do I start"
  ];

  function addStyle() {
    var s = document.createElement('style');
    s.id = 'a11y-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function findMainTarget() {
    var m = document.querySelector('main, [role="main"]');
    if (m) return m;
    // No main landmark: mark the top-level block that holds the page's first
    // heading as main (never the nav, header or footer).
    var h = document.querySelector('h1') || document.querySelector('h2');
    if (!h) return null;
    var el = h;
    while (el.parentElement && el.parentElement !== document.body) el = el.parentElement;
    // A top-level wrapper that also holds the nav or footer is the whole page, not
    // its main content: then just skip to the heading and add no landmark.
    if (el === h || /^(NAV|HEADER|FOOTER)$/.test(el.tagName) || el.querySelector('nav,header,footer')) {
      return h;
    }
    el.setAttribute('role', 'main');
    return el;
  }

  function addSkipLink() {
    var target = findMainTarget();
    if (!target) return;
    if (!target.id) target.id = 'main-content';
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.style.outline = target.style.outline || 'none'; // focus lands here programmatically; no ring needed
    var a = document.createElement('a');
    a.className = 'a11y-skip';
    a.href = '#' + target.id;
    a.textContent = 'Skip to content';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      target.focus();
      try { target.scrollIntoView(); } catch (x) {}
    });
    document.body.insertBefore(a, document.body.firstChild);
  }

  function markLiveRegions() {
    LIVE.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && !el.hasAttribute('aria-live')) {
        el.setAttribute('aria-live', 'polite');
        if (sel === '#chat-box') el.setAttribute('role', 'log');
      }
    });
  }

  function hideDecorativeSvgs(root) {
    var svgs = (root || document).querySelectorAll('svg:not([aria-hidden]):not([role]):not([aria-label]):not([aria-labelledby])');
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i];
      if (svg.querySelector('title')) continue; // has an accessible name: leave it
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    }
  }

  function run() {
    try { addSkipLink(); } catch (e) {}
    try { markLiveRegions(); } catch (e) {}
    try { hideDecorativeSvgs(); } catch (e) {}
  }

  try { addStyle(); } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
