/* tab-nav.js — "On this tab" navigation for the Evidence Library hub
   (evidence-library.html). Pure display of what the open tab already contains,
   the hub's counterpart of library/toc.js on the essays: it introduces no new
   claim or content, so it needs no doctrinal gate.

   It lists the arguments (cards) in the open tab and, under the open card, that
   card's own section labels (.apl / .obt / .prob tier headings and the .psl
   sub-headings of "The Case, Plainly"), so a reader can move around a long tab
   or a long open card without scrolling all the way up or down.

   Layout, chosen by CSS media query, as on the essays:
     - wide screens (>=1280px): a fixed sidebar in the left margin; the hub's
       centred column is nudged right so the two never overlap;
     - narrow screens: a collapsible "On this tab" panel at the top of each tab,
       plus a "Sections" button in the pinned open-card bar (.ocb) that drops
       the same list down from the top of the screen, so a reader deep inside a
       card never has to scroll back up to find it.

   Hooks: none required. It watches the hub for tab switches, fragment loads and
   card open/close (MutationObserver), and uses the hub's own tog() and
   chromeTop() when present. Usage: <script src="/library/tab-nav.js" defer>. */
(function () {
  if (window.__tabNav) return; window.__tabNav = true;

  var LANG = (function () {
    try {
      var u = new URLSearchParams(location.search).get('lang');
      if (u === 'mk' || u === 'es' || u === 'en') return u;
      var s = localStorage.getItem('ev_lang'); return (s === 'mk' || s === 'es') ? s : 'en';
    } catch (e) { return 'en'; }
  })();
  var T = {
    en: { tab: 'On this tab', sec: 'Sections', all: 'All arguments' },
    mk: { tab: 'Во овој дел', sec: 'Делови', all: 'Сите аргументи' },
    es: { tab: 'En esta pestaña', sec: 'Secciones', all: 'Todos los argumentos' }
  }[LANG];

  var HEAD_SEL = '.apl, .obt, .prob, .psl';
  var side, drop, dropBtn, lastSig = '';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function txt(el) { return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function top() { return (typeof window.chromeTop === 'function' ? window.chromeTop() : 120) + 12; }

  function curSec() { return $('.main .sec.go'); }
  function cards(sec) { return sec ? $$('.card[id]', sec).filter(function (c) { return $('.ct', c); }) : []; }
  function openCard(sec) { return sec ? $('.card.op', sec) : null; }

  function heads(card) {
    if (!card) return [];
    var cb = $('.cb', card); if (!cb) return [];
    return $$(HEAD_SEL, cb).filter(function (h) {
      if (h.closest('details:not([open])')) return false;          // skip collapsed drill-downs
      if (h.offsetParent === null) return false;                    // skip hidden (paywalled etc.)
      return txt(h).length > 1;
    });
  }

  function scrollToEl(el) {
    var y = el.getBoundingClientRect().top + window.pageYOffset - top();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
  }

  function goCard(card) {
    if (!card.classList.contains('op')) {
      if (typeof window.tog === 'function') window.tog(card); else card.classList.add('op');
    }
    var h = $('.ch', card) || card;
    setTimeout(function () { scrollToEl(h); }, 30);
  }

  // Build the list markup for the current tab.
  function buildList(withAllLabel) {
    var sec = curSec(), ul = document.createElement('ul'), open = openCard(sec);
    cards(sec).forEach(function (c) {
      var li = document.createElement('li'); li.className = 'tn-card' + (c === open ? ' is-open' : '');
      var a = document.createElement('a'); a.href = '#' + c.id;
      var n = txt($('.cnum', c));
      a.innerHTML = (n ? '<span class="tn-n">' + n + '</span>' : '') + '<span></span>';
      a.lastChild.textContent = txt($('.ct', c));
      a.addEventListener('click', function (e) { e.preventDefault(); closeDrop(); goCard(c); });
      li.appendChild(a);
      if (c === open) {
        var sub = document.createElement('ul'); sub.className = 'tn-sub';
        heads(c).forEach(function (h, i) {
          if (!h.id) h.id = c.id + '-s' + i;
          var sl = document.createElement('li');
          if (h.classList.contains('psl')) sl.className = 'tn-psl';
          var sa = document.createElement('a'); sa.href = '#' + h.id; sa.dataset.id = h.id;
          sa.textContent = txt(h);
          sa.addEventListener('click', function (e) { e.preventDefault(); closeDrop(); scrollToEl(h); });
          sl.appendChild(sa); sub.appendChild(sl);
        });
        if (sub.children.length) li.appendChild(sub);
      }
      ul.appendChild(li);
    });
    return ul;
  }

  function render() {
    var sec = curSec(); if (!sec) return;
    var open = openCard(sec);
    var sig = (sec.id || '') + '|' + cards(sec).length + '|' + (open ? open.id + ':' + heads(open).length : '');
    if (sig === lastSig) { spy(); return; }
    lastSig = sig;

    // (a) sidebar
    side.innerHTML = '<div class="tn-h">' + T.tab + '</div>';
    side.appendChild(buildList());

    // (b) inline panel at the top of the open tab's content
    var host = $('[id$="-content"]', sec);
    if (host && cards(sec).length) {
      var inl = $('.tn-inline', host);
      if (!inl) {
        inl = document.createElement('details'); inl.className = 'tn-inline';
        inl.innerHTML = '<summary><span>' + T.tab + '</span><span class="tn-chev" aria-hidden="true">&#9662;</span></summary>';
        // Just above the argument list: before the first card, or before the
        // category label (.sub) that heads it.
        var first = cards(sec)[0], at = first;
        if (first && first.previousElementSibling && first.previousElementSibling.classList.contains('sub')) at = first.previousElementSibling;
        if (at && at.parentNode) at.parentNode.insertBefore(inl, at); else host.insertBefore(inl, host.firstChild);
      }
      var old = $(':scope > ul', inl); if (old) old.remove();
      inl.appendChild(buildList());
    }

    // (c) dropdown behind the open-card bar's Sections button
    if (drop.classList.contains('tn-on')) { drop.innerHTML = ''; drop.appendChild(buildList()); }
    attachBarButton();
    spy();
  }

  function spy() {
    var m = $('.main');
    if (side && m) side.style.visibility = m.getBoundingClientRect().top < 200 ? 'visible' : 'hidden';
    var sec = curSec(), open = openCard(sec); if (!open) return;
    var hs = heads(open), mark = top() + 8, active = null;
    for (var i = 0; i < hs.length; i++) {
      if (hs[i].getBoundingClientRect().top <= mark) active = hs[i].id; else break;
    }
    $$('.tn-sub a').forEach(function (a) { a.classList.toggle('is-active', a.dataset.id === active); });
  }

  // "Sections" button inside the hub's pinned open-card bar (.ocb).
  function attachBarButton() {
    var bar = $('.ocb'); if (!bar || $('.tn-ocb', bar)) return;
    dropBtn = document.createElement('button');
    dropBtn.type = 'button'; dropBtn.className = 'tn-ocb'; dropBtn.setAttribute('aria-expanded', 'false');
    dropBtn.innerHTML = '&#9776; ' + T.sec;
    dropBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drop.classList.contains('tn-on')) { closeDrop(); return; }
      drop.innerHTML = ''; drop.appendChild(buildList());
      drop.style.top = (bar.getBoundingClientRect().bottom) + 'px';
      drop.classList.add('tn-on'); dropBtn.setAttribute('aria-expanded', 'true'); spy();
    });
    var x = $('.ocb-x', bar); bar.insertBefore(dropBtn, x || null);
  }
  function closeDrop() {
    if (!drop.classList.contains('tn-on')) return;
    drop.classList.remove('tn-on'); if (dropBtn) dropBtn.setAttribute('aria-expanded', 'false');
  }

  function css() {
    var s = document.createElement('style'); s.id = 'tab-nav-css';
    s.textContent = [
      ".tn-side,.tn-inline,.tn-drop{font-family:'DM Sans',sans-serif}",
      '.tn-side ul,.tn-inline ul,.tn-drop ul{list-style:none;margin:0;padding:0}',
      '.tn-side a,.tn-inline a,.tn-drop a{display:flex;gap:.5em;text-decoration:none;color:#5a6b82;font-size:.82rem;line-height:1.4;padding:.34em 0 .34em .7em;border-left:2px solid transparent}',
      '.tn-side a:hover,.tn-inline a:hover,.tn-drop a:hover{color:#0a1628}',
      '.tn-n{font-weight:700;color:#aecae8;min-width:1.6em}',
      'li.tn-card.is-open > a{color:#0a1628;font-weight:600;border-left-color:#c8a951}',
      '.tn-sub{margin:.1em 0 .5em !important}',
      '.tn-sub a{padding-left:2.3em !important;font-size:.76rem !important;color:#7a8ba0 !important}',
      '.tn-sub li.tn-psl a{padding-left:3em !important}',
      '.tn-sub a.is-active{color:#0a1628 !important;font-weight:600;border-left-color:#c8a951}',
      '.tn-h{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a6d1f;margin:0 0 .6em .7em}',
      '.tn-side{position:fixed;top:140px;left:24px;width:220px;max-height:calc(100vh - 170px);overflow:auto;z-index:20;display:none;padding-right:6px}',
      '.tn-inline{display:block;background:#fff;border:1px solid #e8e2d8;border-radius:10px;margin:0 0 18px;padding:0 14px}',
      '.tn-inline summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:.75em 0;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8a6d1f}',
      '.tn-inline summary::-webkit-details-marker{display:none}',
      '.tn-inline[open] .tn-chev{transform:rotate(180deg)}',
      '.tn-inline ul{padding:0 0 .6em}',
      '.tn-ocb{flex:0 0 auto;font-family:var(--ui,sans-serif);font-size:.76rem;font-weight:500;cursor:pointer;color:#fff;background:transparent;border:1px solid rgba(200,169,81,.6);border-radius:3px;padding:6px 12px}',
      '.tn-drop{position:fixed;left:0;right:0;z-index:2147483000;display:none;background:#fff;border-bottom:1px solid #e8e2d8;box-shadow:0 10px 24px rgba(5,13,26,.25);max-height:65vh;overflow:auto;padding:10px 16px}',
      '.tn-drop.tn-on{display:block}',
      '.tn-side a:focus-visible,.tn-inline a:focus-visible,.tn-drop a:focus-visible,.tn-inline summary:focus-visible,.tn-ocb:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
      '@media (min-width:1280px){.tn-side{display:block}.tn-inline{display:none}.tn-ocb{display:none}',
      '  .main{margin-left:max(270px, calc((100vw - 1100px) / 2)) !important;max-width:min(1100px, calc(100vw - 300px)) !important}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function init() {
    if (!$('.main .sec')) return;
    css();
    side = document.createElement('div'); side.className = 'tn-side'; side.setAttribute('role', 'navigation'); side.setAttribute('aria-label', T.tab);
    document.body.appendChild(side);
    drop = document.createElement('div'); drop.className = 'tn-drop';
    document.body.appendChild(drop);
    document.addEventListener('click', function (e) {
      if (drop.contains(e.target) || (dropBtn && dropBtn.contains(e.target))) return; closeDrop();
    });

    var pending = false;
    function schedule() {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; render(); });
    }
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        if (muts[i].type === 'childList' || (t.classList && (t.classList.contains('sec') || t.classList.contains('card')))) { schedule(); return; }
      }
    }).observe($('.main'), { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    addEventListener('scroll', function () { closeDrop(); attachBarButton(); spy(); }, { passive: true });
    addEventListener('resize', schedule);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
