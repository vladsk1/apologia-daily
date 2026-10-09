/* tab-nav.js — "On this tab" navigation for the Evidence Library hub
   (evidence-library.html). Pure display of what the open tab already contains,
   the hub's counterpart of library/toc.js on the essays: it introduces no new
   claim or content, so it needs no doctrinal gate.

   It lists the arguments (cards) in the open tab and, under the open card, that
   card's own section labels (.apl / .obt / .prob tier headings and the .psl
   sub-headings of "The Case, Plainly"), so a reader can move around a long tab
   or a long open card without scrolling all the way up or down.

   Layout: wide screens only (>=1280px) — a fixed sidebar in the left margin;
   the hub's centred column is nudged right so the two never overlap, and the
   sidebar shortens so it never runs past the end of the tab content. Phones
   get nothing (owner decision 2026-10-09: an inline panel and an open-card-bar
   dropdown were tried and did not work well on a phone).

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
    en: { tab: 'On this tab', essay: 'Read the deep-dive essay', mastery: 'Mastery track' },
    mk: { tab: 'Во овој дел', essay: 'Прочитај го есејот', mastery: 'Мајсторска патека' },
    es: { tab: 'En esta pestaña', essay: 'Leer el ensayo completo', mastery: 'Ruta de dominio' }
  }[LANG];

  var HEAD_SEL = '.apl, .obt, .prob, .psl';
  var side, lastSig = '';

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

  // The essay a card points to most often (cards also link sibling essays).
  function essayHref(card) {
    var n = {}, best = null;
    $$('a[href^="/library/"]', card).forEach(function (x) {
      var h = (x.getAttribute('href') || '').split('#')[0];
      if (!/^\/library\/[^/]+\.html$/.test(h)) return;
      n[h] = (n[h] || 0) + 1; if (!best || n[h] > n[best]) best = h;
    });
    return best;
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
      a.addEventListener('click', function (e) { e.preventDefault(); goCard(c); });
      li.appendChild(a);
      if (c === open) {
        var sub = document.createElement('ul'); sub.className = 'tn-sub';
        // The card's own links to its deep-dive essay and its mastery page.
        var go = [];
        var ess = essayHref(c); if (ess) go.push([ess, T.essay]);
        var mas = $('a[href^="ev-m-"], a[href^="/ev-m-"]', c); if (mas) go.push([mas.getAttribute('href'), T.mastery]);
        if (go.length) {
          var gl = document.createElement('li'); gl.className = 'tn-go';
          go.forEach(function (g) {
            var ga = document.createElement('a'); ga.href = g[0]; ga.textContent = g[1]; gl.appendChild(ga);
          });
          sub.appendChild(gl);
        }
        heads(c).forEach(function (h, i) {
          if (!h.id) h.id = c.id + '-s' + i;
          var sl = document.createElement('li');
          if (h.classList.contains('psl')) sl.className = 'tn-psl';
          var sa = document.createElement('a'); sa.href = '#' + h.id; sa.dataset.id = h.id;
          sa.textContent = txt(h);
          sa.addEventListener('click', function (e) { e.preventDefault(); scrollToEl(h); });
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

    // Phones get no tab menu (owner decision 2026-10-09: the inline panel and
    // the open-card-bar dropdown did not work well on a phone).
    spy();
  }

  function spy() {
    var m = $('.main');
    if (side && m) {
      // Show only while the tab content fills the space beside it: not over the
      // hero at the top, and never running down over the footer at the bottom.
      var r = m.getBoundingClientRect(), avail = Math.min(window.innerHeight - 170, r.bottom - 140);
      var show = r.top < 200 && avail > 160;
      side.style.visibility = show ? 'visible' : 'hidden';
      if (show) side.style.maxHeight = avail + 'px';
    }
    var sec = curSec(), open = openCard(sec); if (!open) return;
    var hs = heads(open), mark = top() + 8, active = null;
    for (var i = 0; i < hs.length; i++) {
      if (hs[i].getBoundingClientRect().top <= mark) active = hs[i].id; else break;
    }
    $$('.tn-sub a').forEach(function (a) { a.classList.toggle('is-active', a.dataset.id === active); });
  }

  function css() {
    var s = document.createElement('style'); s.id = 'tab-nav-css';
    s.textContent = [
      ".tn-side{font-family:'DM Sans',sans-serif}",
      '.tn-side ul{list-style:none;margin:0;padding:0}',
      '.tn-side a{display:flex;gap:.5em;text-decoration:none;color:#5a6b82;font-size:.82rem;line-height:1.4;padding:.34em 0 .34em .7em;border-left:2px solid transparent}',
      '.tn-side a:hover{color:#0a1628}',
      '.tn-n{font-weight:700;color:#aecae8;min-width:1.6em}',
      'li.tn-card.is-open > a{color:#0a1628;font-weight:600;border-left-color:#c8a951}',
      '.tn-sub{margin:.1em 0 .5em !important}',
      '.tn-sub a{padding-left:2.3em !important;font-size:.76rem !important;color:#7a8ba0 !important}',
      '.tn-sub li.tn-psl a{padding-left:3em !important}',
      '.tn-go{display:flex;flex-direction:column;gap:4px;margin:.3em 0 .5em 2.3em}',
      '.tn-go a{padding:.45em .7em !important;border:1px solid #e3d6ad !important;border-radius:6px;background:#fbf8f0;color:#7a5c12 !important;font-weight:600;font-size:.76rem !important}',
      '.tn-go a:hover{background:#f4ecd4}',
      '.tn-sub a.is-active{color:#0a1628 !important;font-weight:600;border-left-color:#c8a951}',
      '.tn-h{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a6d1f;margin:0 0 .6em .7em}',
      '.tn-side{position:fixed;top:140px;left:24px;width:220px;max-height:calc(100vh - 170px);overflow:auto;z-index:20;display:none;padding-right:6px}',
      '.tn-side a:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
      '@media (min-width:1280px){.tn-side{display:block}',
      '  .main{margin-left:max(270px, calc((100vw - 1100px) / 2)) !important;max-width:min(1100px, calc(100vw - 300px)) !important}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function init() {
    if (!$('.main .sec')) return;
    css();
    side = document.createElement('div'); side.className = 'tn-side'; side.setAttribute('role', 'navigation'); side.setAttribute('aria-label', T.tab);
    document.body.appendChild(side);

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
    addEventListener('scroll', spy, { passive: true });
    addEventListener('resize', schedule);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
