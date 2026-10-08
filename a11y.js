/* a11y.js — site-wide accessibility basics (2026-10-08 audit, item 8, batch 1).
 *
 * Loaded once per page by ad-nav.js and analytics.js (whichever runs first; the
 * guard below stops a second copy). Changes nothing for mouse users:
 *   1. a visible focus outline for KEYBOARD focus (:focus-visible), restoring the
 *      outlines that page styles removed with outline:none;
 *   2. a "Skip to content" link, shown only when it receives keyboard focus;
 *   3. reduced motion for people who ask their device for it;
 *   4. AI replies announced to screen readers as they arrive (aria-live);
 *   5. decorative SVG icons hidden from screen readers;
 *   6. (batch 2) click-only elements (a div/span/li with an onclick: flashcards,
 *      accordion cards, homepage feature cards, video cards, language switchers)
 *      made reachable with Tab and operable with Enter / Space, and announced as a
 *      button (or a link, when the click navigates). Covers content added later,
 *      such as the Evidence Library tabs, through a MutationObserver.
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

  /* 6. Keyboard access for click-only elements. Skips real controls, anything that
     already manages its own focus (tabindex/role set), and the many wrappers whose
     onclick only stops propagation. Enter/Space act only when the element itself has
     focus, so a button nested inside a card does not also toggle the card. */
  var CLICKABLE = 'div[onclick],span[onclick],li[onclick],article[onclick],section[onclick],td[onclick],img[onclick]';
  // Accordion cards hold their whole expanded content inside the clickable element.
  // Making that a "button" would flatten every heading and paragraph in it, so for
  // those the keyboard control goes on the card's header line instead.
  var HEADER = '.ch,.argument-header,.card-header,.cf-q,[class*="-header"],[class*="-head"]';
  function headerOf(el) {
    if ((el.textContent || '').length < 300) return null;      // small card: whole thing is the control
    var kids = el.children;
    for (var i = 0; i < kids.length; i++) if (kids[i].matches && kids[i].matches(HEADER)) return kids[i];
    return null;
  }
  function isOpen(el) { return /\b(open|expanded|flipped|active)\b/.test(el.className || ''); }
  function makeOperable(el) {
    if (el.__adOperable) return;
    var code = el.getAttribute('onclick') || '';
    if (/^\s*event\.stopPropagation\(\)\s*;?\s*$/.test(code)) return;
    el.__adOperable = true;
    if (el.hasAttribute('role') || el.hasAttribute('tabindex')) return; // the page handles it
    var hdr = headerOf(el);
    var target = hdr || el;
    if (target.hasAttribute('tabindex') || target.hasAttribute('role')) return; // page manages it
    target.setAttribute('tabindex', '0');
    target.setAttribute('role', /location|href/.test(code) ? 'link' : 'button');
    if (hdr) {
      target.setAttribute('aria-expanded', isOpen(el) ? 'true' : 'false');
      el.addEventListener('click', function () {
        setTimeout(function () { target.setAttribute('aria-expanded', isOpen(el) ? 'true' : 'false'); }, 0);
      });
    }
    target.addEventListener('keydown', function (e) {
      if (e.target !== target) return;
      var k = e.key;
      if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
        if (k !== 'Enter' && target.getAttribute('role') === 'link') return; // links: Enter only
        e.preventDefault();
        el.click();
      }
    });
  }
  function operableIn(root) {
    var list = (root.querySelectorAll ? root.querySelectorAll(CLICKABLE) : []);
    for (var i = 0; i < list.length; i++) makeOperable(list[i]);
    if (root.matches && root.matches(CLICKABLE)) makeOperable(root);
  }
  function watch() {
    if (!window.MutationObserver) return;
    var pending = false;
    new MutationObserver(function (muts) {
      if (pending) return;
      pending = true;
      setTimeout(function () {
        pending = false;
        try { operableIn(document); hideDecorativeSvgs(); markLiveRegions(); } catch (e) {}
      }, 50);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function run() {
    try { addSkipLink(); } catch (e) {}
    try { markLiveRegions(); } catch (e) {}
    try { hideDecorativeSvgs(); } catch (e) {}
    try { operableIn(document); watch(); } catch (e) {}
  }

  try { addStyle(); } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
