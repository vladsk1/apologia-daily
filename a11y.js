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
 *      such as the Evidence Library tabs, through a MutationObserver;
 *   7. (batch 3) form fields with no accessible name (only a placeholder) get an
 *      aria-label from their placeholder, so screen readers announce what to type;
 *   8. (batch 4) colour contrast on LIGHT backgrounds: text below the WCAG AA ratio
 *      (4.5:1, or 3:1 for large text) is darkened in the same hue just enough to
 *      pass, and form-field borders / placeholders get a 3:1 / 4.5:1 colour. Text on
 *      dark backgrounds (gold on navy) is never touched. ?nocontrast=1 turns this
 *      off for one page view (used for before/after comparisons).
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
    /* placeholders on light-background fields (class added by fixContrast) */
    '.a11y-ph::placeholder{color:#5c6b7d !important;opacity:1 !important;}',
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
        try { operableIn(document); hideDecorativeSvgs(); markLiveRegions(); labelFields(); fixContrast(); } catch (e) {}
      }, 50);
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* 7. Name unlabelled fields. A placeholder is not a label: it is often not read,
     and it disappears once you type. Anything already named (aria-label,
     aria-labelledby, title, a <label for>, or a wrapping <label>) is left alone. */
  function hasName(el) {
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')) return true;
    if (el.closest('label')) return true;
    if (el.id) {
      try { if (document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(el.id) : el.id) + '"]')) return true; } catch (e) {}
    }
    return false;
  }
  function labelFields(root) {
    var f = (root || document).querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]):not([type=checkbox]):not([type=radio]),textarea,select');
    for (var i = 0; i < f.length; i++) {
      var el = f[i];
      if (hasName(el)) continue;
      var name = '';
      // 1) a visible <label> right before the field that just isn't connected to it
      var prev = el.previousElementSibling;
      if (prev && prev.tagName === 'LABEL' && !prev.htmlFor) name = (prev.textContent || '').trim();
      // 2) the placeholder, cut before any worked example ("e.g. ...", "...")
      if (!name) {
        name = (el.getAttribute('placeholder') || '').replace(/^\s*e\.g\.?\s*/i, '').split(/\s+e\.g\.|\u2026|\.\.\./)[0].replace(/[\s,.:;\u2014-]+$/, '').trim();
        if (!name) name = (el.getAttribute('placeholder') || '').replace(/^\s*e\.g\.?\s*/i, '').split(/\u2026|\.\.\./)[0].replace(/\s+/g, ' ').trim().slice(0, 80);
      }
      // 3) a select's empty "choose one" prompt option (never a real choice)
      if (!name && el.tagName === 'SELECT' && el.options && el.options[0] && el.options[0].value === '') name = (el.options[0].text || '').replace(/^[-\s]+|[-\s]+$/g, '');
      // 4) a short text sibling just before it
      if (!name && prev && prev.textContent && prev.textContent.trim().length < 80) name = prev.textContent.trim();
      if (name) el.setAttribute('aria-label', name);
    }
  }

  /* 8. Contrast on light backgrounds. */
  function parseRgb(c) {
    var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c || '');
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
  }
  function lum(r, g, b) {
    var a = [r, g, b].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function ratio(l1, l2) { var a = Math.max(l1, l2), b = Math.min(l1, l2); return (a + 0.05) / (b + 0.05); }
  // Effective solid background behind el, or null if it sits on an image/gradient.
  function bgOf(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      var c = parseRgb(cs.backgroundColor);
      if (c && c[3] > 0.95) return c;
    }
    return [255, 255, 255, 1];
  }
  function blend(fg, bg) { var a = fg[3]; return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)]; }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
      var d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6;
    }
    return [h, s, l];
  }
  function hslToRgb(h, s, l) {
    function f(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    if (!s) return [l * 255, l * 255, l * 255];
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255];
  }
  // Darken rgb (same hue/saturation) until it reaches `need` against bg luminance.
  function darkenTo(rgb, bgL, need) {
    var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    for (var l = hsl[2]; l > 0; l -= 0.02) {
      var c = hslToRgb(hsl[0], hsl[1], l);
      if (ratio(lum(c[0], c[1], c[2]), bgL) >= need) return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')';
    }
    return null;
  }
  var CONTRAST_OFF = /[?&]nocontrast=1\b/.test(location.search);
  function fixContrast(root) {
    if (CONTRAST_OFF) return;
    var all = root ? [root].concat([].slice.call(root.querySelectorAll('*'))) : document.body.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.__adC) continue;
      el.__adC = 1;
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'svg') continue;
      var isField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      var hasText = false;
      for (var k = el.firstChild; k; k = k.nextSibling) if (k.nodeType === 3 && /\S/.test(k.nodeValue)) { hasText = true; break; }
      if (!hasText && !isField) continue;
      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      var bg = bgOf(el);
      if (!bg) continue;
      var bgL = lum(bg[0], bg[1], bg[2]);
      if (bgL < 0.45) continue;                                  // dark background: leave alone
      var fg = parseRgb(cs.color);
      if (fg && hasText) {
        var f = blend(fg, bg);
        var size = parseFloat(cs.fontSize) || 16, bold = (parseInt(cs.fontWeight, 10) || 400) >= 700;
        var need = (size >= 24 || (bold && size >= 18.66)) ? 3 : 4.5;
        if (ratio(lum(f[0], f[1], f[2]), bgL) < need) {
          var nc = darkenTo(f, bgL, need);
          if (nc) { el.__adCol = [el.style.getPropertyValue('color'), el.style.getPropertyPriority('color')]; el.style.setProperty('color', nc, 'important'); }
        }
      }
      if (isField) {
        var bc = parseRgb(cs.borderTopColor), bw = parseFloat(cs.borderTopWidth) || 0;
        if (bc && bw > 0) {
          var b2 = blend(bc, bg);
          if (ratio(lum(b2[0], b2[1], b2[2]), bgL) < 3) {
            var nb = darkenTo(b2, bgL, 3);
            if (nb) { el.__adBorder = [el.style.getPropertyValue('border-color'), el.style.getPropertyPriority('border-color')]; el.style.setProperty('border-color', nb, 'important'); }
          }
        }
        if (el.getAttribute('placeholder')) el.classList.add('a11y-ph');
      }
    }
  }

  // When a page changes an element's class (a tab turning active, a card opening),
  // drop our override on it and its children and measure again, so a colour we
  // darkened never gets stuck after the page restyles the element.
  function restore(el, prop, saved) {
    if (saved[0]) el.style.setProperty(prop, saved[0], saved[1]); else el.style.removeProperty(prop);
  }
  function recheck(node) {
    var list = [node].concat([].slice.call(node.querySelectorAll ? node.querySelectorAll('*') : []));
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      // Put back exactly what the page had set inline (often nothing).
      if (el.__adCol) { restore(el, 'color', el.__adCol); el.__adCol = 0; }
      if (el.__adBorder) { restore(el, 'border-color', el.__adBorder); el.__adBorder = 0; }
      el.__adC = 0;
    }
    fixContrast(node);
  }
  function watchClasses() {
    if (!window.MutationObserver || CONTRAST_OFF) return;
    var queue = [], timer = null;
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        // body/html classes flip on scroll or menu-open on some pages: re-checking the
        // whole page each time would be wasted work, and they don't recolour text.
        if (t === document.body || t === document.documentElement) continue;
        if (queue.indexOf(t) === -1) queue.push(t);
      }
      if (timer) return;
      timer = setTimeout(function () {
        timer = null;
        var q = queue; queue = [];
        for (var j = 0; j < q.length; j++) { try { if (q[j].isConnected) recheck(q[j]); } catch (e) {} }
      }, 60);
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  }

  function run() {
    try { addSkipLink(); } catch (e) {}
    try { markLiveRegions(); } catch (e) {}
    try { hideDecorativeSvgs(); } catch (e) {}
    try { labelFields(); } catch (e) {}
    try { fixContrast(); watchClasses(); } catch (e) {}
    try { operableIn(document); watch(); } catch (e) {}
  }

  try { addStyle(); } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
