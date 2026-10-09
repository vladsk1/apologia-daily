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
   sidebar shortens so it never runs past the end of the tab content. Phones:
   a "Sections" button in the pinned open-card bar drops down the sections of
   the argument currently open (owner decision 2026-10-09: per argument, not the
   whole tab; it closes when a different argument opens).

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
    en: { tab: 'On this tab', sec: 'Sections', mastery: 'Master this argument', essay: 'Read the full deep-dive essay', tutor: 'Ask the AI Tutor about this argument' },
    mk: { tab: 'Во овој дел', sec: 'Делови', mastery: 'Совладај го аргументот', essay: 'Прочитај го целиот есеј', tutor: 'Прашај го AI тутор за овој аргумент' },
    es: { tab: 'En esta pestaña', sec: 'Secciones', mastery: 'Domina este argumento', essay: 'Lee el ensayo completo', tutor: 'Pregunta al tutor de IA sobre este argumento' }
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
    }).concat(tail(card));
  }

  // The three blocks every card closes with — kept on this page: the sidebar
  // scrolls to them rather than leaving for the mastery page or the essay.
  function tail(card) {
    var out = [];
    var mas = $('a[href^="ev-m-"], a[href^="/ev-m-"]', card);
    var ess = null;
    if (mas) $$('a[href^="/library/"]', mas.parentNode).forEach(function (x) { if (x.parentNode === mas.parentNode) ess = x; });
    var tut = $('.inline-tutor', card);
    [[mas, T.mastery], [ess, T.essay], [tut, T.tutor]].forEach(function (t) {
      if (t[0] && t[0].offsetParent !== null) { t[0].__tnLabel = t[1]; out.push(t[0]); }
    });
    return out;
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

  // The open argument's own sections, ending with its Master / essay / tutor blocks.
  function buildSub(c) {
    var sub = document.createElement('ul'); sub.className = 'tn-sub';
    heads(c).forEach(function (h, i) {
      if (!h.id) h.id = c.id + '-s' + i;
      var sl = document.createElement('li');
      if (h.classList.contains('psl')) sl.className = 'tn-psl';
      var sa = document.createElement('a'); sa.href = '#' + h.id; sa.dataset.id = h.id;
      sa.textContent = h.__tnLabel || txt(h);
      sa.addEventListener('click', function (e) {
        e.preventDefault(); closeDrop(); scrollToEl(h);
        var inp = h.classList.contains('inline-tutor') && $('input', h);
        if (inp) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (x) { inp.focus(); } }, 450);
      });
      sl.appendChild(sa); sub.appendChild(sl);
    });
    return sub;
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
      if (c === open) { var sub = buildSub(c); if (sub.children.length) li.appendChild(sub); }
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

    // Phones: the Sections dropdown belongs to ONE argument; if a different
    // argument opens (or none), close it so it never shows the wrong list.
    if (drop.__card && drop.__card !== open) closeDrop();
    attachBarButton();
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

  // Phones: a "Sections" button in the hub's pinned open-card bar (.ocb) that
  // drops down the CURRENT argument's sections only — rebuilt on every open, so
  // it always matches the argument the reader is in.
  var drop, dropBtn;
  function attachBarButton() {
    var bar = $('.ocb'); if (!bar || $('.tn-ocb', bar)) return;
    dropBtn = document.createElement('button');
    dropBtn.type = 'button'; dropBtn.className = 'tn-ocb'; dropBtn.setAttribute('aria-expanded', 'false');
    dropBtn.innerHTML = '&#9776; ' + T.sec;
    dropBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drop.classList.contains('tn-on')) { closeDrop(); return; }
      var open = openCard(curSec()); if (!open) return;
      drop.innerHTML = '';
      var h = document.createElement('div'); h.className = 'tn-h';
      h.textContent = (txt($('.cnum', open)) + ' ' + txt($('.ct', open))).trim();
      drop.appendChild(h); drop.appendChild(buildSub(open));
      drop.__card = open;
      drop.style.top = bar.getBoundingClientRect().bottom + 'px';
      drop.classList.add('tn-on'); dropBtn.setAttribute('aria-expanded', 'true'); spy();
    });
    var x = $('.ocb-x', bar); bar.insertBefore(dropBtn, x || null);
  }
  function closeDrop() {
    if (!drop || !drop.classList.contains('tn-on')) return;
    drop.classList.remove('tn-on'); drop.__card = null;
    if (dropBtn) dropBtn.setAttribute('aria-expanded', 'false');
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
      '.tn-sub a.is-active{color:#0a1628 !important;font-weight:600;border-left-color:#c8a951}',
      '.tn-h{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a6d1f;margin:0 0 .6em .7em}',
      '.tn-side{position:fixed;top:140px;left:24px;width:220px;max-height:calc(100vh - 170px);overflow:auto;z-index:20;display:none;padding-right:6px}',
      '.tn-side a:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
      ".tn-drop{font-family:'DM Sans',sans-serif;position:fixed;left:0;right:0;z-index:2147483000;display:none;background:#fff;border-bottom:1px solid #e8e2d8;box-shadow:0 10px 24px rgba(5,13,26,.25);max-height:65vh;overflow:auto;padding:12px 16px}",
      '.tn-drop.tn-on{display:block}',
      '.tn-drop ul{list-style:none;margin:0;padding:0}',
      '.tn-drop a{display:block;text-decoration:none;color:#5a6b82;font-size:.86rem;line-height:1.4;padding:.45em 0 .45em .8em;border-left:2px solid transparent}',
      '.tn-drop li.tn-psl a{padding-left:1.6em;font-size:.82rem}',
      '.tn-drop a.is-active{color:#0a1628;font-weight:600;border-left-color:#c8a951}',
      '.tn-drop .tn-h{font-family:var(--fd,serif);font-size:.95rem;letter-spacing:0;text-transform:none;color:#0a1628;margin:0 0 .5em .8em}',
      '.tn-ocb{flex:0 0 auto;font-family:var(--ui,sans-serif);font-size:.76rem;font-weight:500;cursor:pointer;color:#fff;background:transparent;border:1px solid rgba(200,169,81,.6);border-radius:3px;padding:6px 12px}',
      '.tn-ocb:focus-visible,.tn-drop a:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
      '@media (min-width:1280px){.tn-side{display:block}.tn-ocb{display:none}',
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
    drop.setAttribute('role', 'navigation'); drop.setAttribute('aria-label', T.sec);
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
