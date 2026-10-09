/* mastery-ui.js — shared layout + interaction-feedback layer for every ev-m-*.html
   mastery page (styles in /library/mastery-ui.css).

   PURE PRESENTATION. This file adds no argument content: every string it shows that
   is not a short UI label ("Answer", "Why", "Got it", "Read", "Try it") is either
   typed by the reader or MOVED from elsewhere on the same certified page (the premise
   text shown above each premise defence is cloned from that page's own syllogism).
   It never edits doctrinal text, never changes scoring, and never writes to the
   page's mastery state — the page's own handlers still run exactly as before; this
   layer only makes their effects visible.

   What it does:
   1. Pressed-state feedback — aria-pressed on every toggle; ordering chips show the
      position you gave them; objection/unseen ratings leave a visible receipt.
   2. Reason-it-out reveals — optional "your answer first" box, a full-width answer
      block (plus a "Why" line where the page supplies one), a got-it / not-quite
      self-mark, and a progress count with Reveal all.
   3. Section clarity — numbers each card within its phase (1.1, 1.2 …), labels it
      Read / Try it / Test yourself, and adds a sticky Understand · Practice · Prove
      bar that shows where you are.
   4. Older pages' premise defences — opened by default, each headed by the exact
      premise it defends (cloned from the syllogism) and a "Why believe it" label. */
(function () {
  'use strict';
  if (!/\/ev-m-[^/]*$/.test(location.pathname) && !document.getElementById('understand')) return;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function txt(el) { return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- 1. pressed-state feedback ---------- */
  function syncPressed() {
    $$('#propPool button, #explainLevels button, #confRow button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.classList.contains('sel') ? 'true' : 'false');
    });
  }
  function initPressed() {
    // Note each button's state BEFORE the page's own handler runs (capture phase),
    // then react AFTER it has run (deferred), so we see what the press changed.
    var before = new WeakMap();
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button');
      if (b) before.set(b, b.disabled);
    }, true);
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button');
      if (!b) return;
      var wasDisabled = before.has(b) ? before.get(b) : b.disabled;
      setTimeout(function () {
        syncPressed();
        // ordering chips: stamp the position the reader gave this line
        var pool = b.closest('#orderPool');
        if (pool && !wasDisabled && b.disabled) {
          b.setAttribute('data-step', String($$('button:disabled', pool).length));
        }
        if (/resetBronze/.test(b.getAttribute('onclick') || '')) {
          $$('#orderPool button').forEach(function (x) { x.removeAttribute('data-step'); });
        }
        // rating buttons inside a revealed model answer
        var oc = b.getAttribute('onclick') || '';
        var m = oc.match(/^(odRate|unseenRate)\((\d)\)/);
        if (m) rated(b, m[1], m[2] === '2');
      }, 0);
    });
    // Pool chips are injected late by the page; sync once they exist.
    setTimeout(syncPressed, 600);
  }
  function rated(btn, kind, good) {
    var card = btn.closest('.practicecard') || btn.closest('.card');
    if (!card) return;
    if (kind === 'unseenRate') {
      $$('button', btn.parentNode).forEach(function (x) { x.classList.toggle('sel', x === btn); x.setAttribute('aria-pressed', x === btn ? 'true' : 'false'); });
    }
    var t = card.querySelector('.mu-toast') || el('div', 'mu-toast');
    t.className = 'mu-toast ' + (good ? 'good' : 'redo');
    t.textContent = kind === 'odRate'
      ? (good ? '✓ Marked as nailed — on to the next objection.' : 'Marked to redo — it stays in your queue. On to the next one.')
      : (good ? '✓ Recorded: nailed it. That counts toward Gold.' : 'Recorded: shaky. Sit with the answer above and come back to it.');
    if (!t.parentNode) {
      var anchor = kind === 'odRate' ? (card.querySelector('.flashnav') || btn.parentNode) : btn.parentNode;
      anchor.parentNode.insertBefore(t, anchor.nextSibling);
    }
    // restart the fade so repeated presses still register visibly
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  }

  /* ---------- 2. reason-it-out reveals ---------- */
  function initDerive() {
    $$('.derive').forEach(function (box) {
      var rows = $$('.dr', box);
      if (!rows.length) return;
      var bar = el('div', 'mu-derive-bar',
        '<span><b class="mu-n">0</b> of ' + rows.length + ' reasoned out</span>' +
        '<span class="mu-prog" aria-hidden="true"><i></i></span>' +
        '<button type="button" class="mu-link">Reveal all</button>');
      box.parentNode.insertBefore(bar, box);
      function update() {
        var n = rows.filter(function (r) { return r.classList.contains('shown'); }).length;
        $('.mu-n', bar).textContent = n;
        $('.mu-prog i', bar).style.width = (100 * n / rows.length) + '%';
        $('.mu-link', bar).style.display = n === rows.length ? 'none' : '';
      }
      $('.mu-link', bar).addEventListener('click', function () {
        rows.forEach(function (r) { if (!r.classList.contains('shown')) show(r); });
        update();
      });
      rows.forEach(function (r, i) {
        var rev = $('.rev', r), ans = $('.ans', r);
        if (!rev || !ans) return;
        var g = el('div', 'mu-guess');
        var inp = el('input');
        inp.type = 'text'; inp.autocomplete = 'off';
        inp.placeholder = 'Your answer first (optional) — then Reveal';
        inp.setAttribute('aria-label', 'Your answer to: ' + txt($('.q', r)));
        g.appendChild(inp);
        r.insertBefore(g, ans);
        var why = $('.why', r);
        var you = el('div', 'mu-you');
        var self = el('div', 'mu-self',
          '<span>Did you get there?</span><span class="mu-self-b">' +
          '<button type="button" data-v="1" aria-pressed="false">Got it</button>' +
          '<button type="button" data-v="0" aria-pressed="false">Not quite</button></span>');
        var after = why || ans;
        r.insertBefore(you, after.nextSibling);
        r.insertBefore(self, you.nextSibling);
        $$('button', self).forEach(function (b) {
          b.addEventListener('click', function () {
            var good = b.getAttribute('data-v') === '1';
            $$('button', self).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
            r.classList.toggle('mu-got', good);
            r.classList.toggle('mu-miss', !good);
          });
        });
        rev.addEventListener('click', function () { setTimeout(function () { show(r); update(); }, 0); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); rev.click(); } });
      });
      function show(r) {
        r.classList.add('shown');
        var inp = $('.mu-guess input', r), you = $('.mu-you', r);
        var v = inp ? inp.value.trim() : '';
        if (you) {
          you.textContent = v ? ('You said: “' + v + '” — compare it with the answer above.') : '';
          you.style.display = v ? '' : 'none';
        }
      }
      update();
    });
  }

  /* ---------- 3. section clarity ---------- */
  var PHASES = [['understand', 'Understand'], ['practice', 'Practice'], ['proveit', 'Prove']];
  function cardType(c, phaseId) {
    var k = txt($('.kick', c)).toLowerCase();
    if (phaseId === 'proveit' || c.id === 'bronzeGate' || /checkpoint|earn bronze|unseen|gold/.test(k)) return ['test', 'Test yourself'];
    if (c.querySelector('textarea, input, .derive, #propPool, .flash, .ordergrid') ||
        $$('button', c).some(function (b) { return !b.closest('summary') && !b.closest('.acc'); })) return ['act', 'Try it'];
    return ['read', 'Read'];
  }
  function initSections() {
    PHASES.forEach(function (p, pi) {
      var sec = document.getElementById(p[0]);
      if (!sec) return;
      var n = 0;
      $$(':scope > .card, :scope > .practicecard', sec).forEach(function (c) {
        var kick = $(':scope > .kick', c);
        if (!kick || kick.closest('.mu-kickrow')) return;
        n++;
        c.id = c.id || ('mu-' + p[0] + '-' + n);
        c.setAttribute('data-mu-title', txt($('h4', c)) || txt(kick));
        var h4 = $(':scope > h4', c);
        // Premise headings are full sentences: set every "Defending Premise" heading
        // (and any other long card heading) at body size, so they read as text, not
        // as a wall of display type, and all premise cards match.
        if (h4 && (/^\s*Defending/i.test(txt(kick)) || txt(h4).length > 110)) h4.classList.add('mu-longh');
        var row = el('div', 'mu-kickrow');
        kick.parentNode.insertBefore(row, kick);
        row.appendChild(el('span', 'mu-step', (pi + 1) + '.' + n));
        row.appendChild(kick);
        var t = cardType(c, p[0]);
        row.appendChild(el('span', 'mu-type ' + t[0], t[1]));
      });
    });
    var nav = $('.adn-nav');
    var first = document.getElementById('understand');
    if (!nav || !first) return;
    var bar = el('div', 'mu-bar');
    bar.setAttribute('aria-label', 'Mastery track sections');
    var inner = el('div', 'mu-bar-in');
    PHASES.forEach(function (p, i) {
      if (!document.getElementById(p[0])) return;
      var a = el('a', null, '<span class="n">' + (i + 1) + '</span><span class="t">' + p[1] + '</span>');
      a.href = '#' + p[0];
      a.setAttribute('data-p', p[0]);
      inner.appendChild(a);
    });
    var where = el('span', 'mu-where');
    inner.appendChild(where);
    bar.appendChild(inner);
    nav.parentNode.insertBefore(bar, nav.nextSibling);
    var cards = $$('[data-mu-title]');
    var ticking = false;
    function onScroll() {
      ticking = false;
      var y = 64 + 46 + 24;
      bar.classList.toggle('on', first.getBoundingClientRect().top < y + 40);
      var cur = null;
      PHASES.forEach(function (p) { var s = document.getElementById(p[0]); if (s && s.getBoundingClientRect().top < y + 1) cur = p[0]; });
      $$('a', inner).forEach(function (a) { a.classList.toggle('cur', a.getAttribute('data-p') === cur); });
      var cc = null;
      cards.forEach(function (c) { if (c.getBoundingClientRect().top < y + 1) cc = c; });
      var step = cc && $('.mu-step', cc);
      where.textContent = cc ? ((step ? step.textContent + ' · ' : '') + cc.getAttribute('data-mu-title')) : '';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ---------- 4. older pages: premise defences open, claim on top ---------- */
  function initPremiseDefence() {
    $$('#understand .card').forEach(function (c) {
      if (!/defending the premises/i.test(txt($('.kick', c)))) return;
      $$('details.acc', c).forEach(function (d) {
        var s = $('summary', d);
        var m = txt(s).match(/^Support for (P\d+)\s*[—–-]\s*(.*)$/);
        if (!m) return;
        var prem = $$('.syllogism .prem').filter(function (p) { return txt($('.tag', p)) === m[1]; })[0];
        d.classList.add('mu-pdef');
        d.open = true;
        s.innerHTML = '';
        s.appendChild(el('span', 'mu-ptag', m[1]));
        s.appendChild(document.createTextNode(m[2].charAt(0).toUpperCase() + m[2].slice(1)));
        var body = $('.body', d);
        if (!body) return;
        if (prem && $('p', prem)) {
          var claim = el('div', 'mu-claim', '<span class="l">The premise</span>');
          claim.appendChild($('p', prem).cloneNode(true));
          d.insertBefore(claim, body);
        }
        d.insertBefore(el('span', 'mu-why-h', 'Why believe it'), body);
      });
    });
  }

  /* ---------- 5. premise-defence cards: map, sub-heads, numbered supports,
     objections with the reply held back until the reader has tried ---------- */
  function initPremiseCards() {
    $$('#understand .card').forEach(function (c) {
      var sups = $$(':scope > .support', c);
      if (!sups.length) return;
      var objs = $$('.objin', c);
      var room = $(':scope > .whoholds', c);
      var id = c.id || (c.id = 'mu-pd-' + Math.random().toString(36).slice(2, 8));
      function anchorFor(node, key) { node.id = node.id || (id + '-' + key); return '#' + node.id; }
      // sub-heads
      var h1 = el('div', 'mu-pdh', '<span class="i">1</span>Why believe it');
      sups[0].parentNode.insertBefore(h1, sups[0]);
      var topObj = $$(':scope > .objin', c);
      var h2 = null;
      if (topObj.length) { h2 = el('div', 'mu-pdh obj', '<span class="i">2</span>Objections it must survive'); c.insertBefore(h2, topObj[0]); }
      var h3 = null;
      if (room) { h3 = el('div', 'mu-pdh room', '<span class="i">' + (h2 ? 3 : 2) + '</span>Who holds what'); c.insertBefore(h3, room); }
      // map
      var map = el('div', 'mu-pdmap');
      map.appendChild(el('span', 'l', 'In this section'));
      function chip(label, target) { var a = el('a', null, label); a.href = target; map.appendChild(a); }
      chip(sups.length + (sups.length === 1 ? ' line' : ' lines') + ' of support', anchorFor(h1, 'why'));
      if (objs.length) chip(objs.length + (objs.length === 1 ? ' objection' : ' objections') + ' answered', anchorFor(h2 || objs[0], 'obj'));
      if (h3) chip('Who holds what', anchorFor(h3, 'room'));
      var after = $(':scope > .precise', c) || $(':scope > h4', c);
      if (after) after.parentNode.insertBefore(map, after.nextSibling);
      // numbered supports
      sups.forEach(function (sp, i) { sp.classList.add('mu-sup'); var sh = $('.sh', sp); if (sh) sh.insertBefore(el('span', 'mu-supn', String(i + 1)), sh.firstChild); });
      // objections: reply held back
      objs.forEach(function (o) {
        var rl = $(':scope > .rl', o);
        if (!rl || o.querySelector('.mu-replybtn')) return;
        var wrap = el('div', 'mu-reply');
        var n = rl; var move = [];
        while (n) { move.push(n); n = n.nextElementSibling; }
        move.forEach(function (x) { wrap.appendChild(x); });
        var btn = el('button', 'mu-replybtn', 'Try to answer it, then show the reply');
        btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', function () {
          var open = o.classList.toggle('mu-open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          btn.textContent = open ? 'Hide the reply' : 'Try to answer it, then show the reply';
        });
        o.appendChild(btn); o.appendChild(wrap);
      });
    });
  }

  /* ---------- 6. Bronze checkpoint: undo, instant order feedback, per-chip marks ----------
     The ordering chips locked on tap, so a wrong first tap could only be cleared
     with the separate Reset (which also wiped the property picks), and nothing
     said whether the order was right until "Check my reconstruction" — often off
     screen. This adds Undo / Start over, says right-or-not the moment all lines
     are placed, and after Check marks each property chip right / wrong / missed.
     Reads the page's own globals (ORDER, _ordSel, _ordSeq); scoring unchanged. */
  function initCheckpoint() {
    var pool = document.getElementById('orderPool');
    var seq = document.getElementById('orderSeq');
    if (!pool || !seq || !window.ORDER) return;
    var ctr = el('div', 'mu-ordctl',
      '<button type="button" class="mu-mini" data-a="undo">&#8630; Undo last</button>' +
      '<button type="button" class="mu-mini" data-a="clear">Start over</button>');
    var fb = el('div', 'mu-ordfb');
    seq.parentNode.insertBefore(ctr, seq.nextSibling);
    ctr.parentNode.insertBefore(fb, ctr.nextSibling);
    function sel() { return window._ordSel || []; }
    function chipFor(k) { return $$('button', pool).filter(function (b) { return b.textContent === window.ORDER[k]; })[0]; }
    function refresh() {
      var s = sel(), n = window.ORDER.length;
      ctr.style.display = s.length ? '' : 'none';
      if (s.length < n) { fb.className = 'mu-ordfb'; fb.textContent = ''; return; }
      var ok = s.every(function (k, i) { return k === i; });
      fb.className = 'mu-ordfb show ' + (ok ? 'good' : 'bad');
      fb.textContent = ok
        ? '✓ Right order. Now pick the properties below, then press “Check my reconstruction.”'
        : '✗ Not quite — that is not the order of the argument. Use Undo or Start over and try again.';
    }
    function release(k) { var b = chipFor(k); if (b) { b.disabled = false; b.style.opacity = 1; b.removeAttribute('data-step'); } }
    ctr.addEventListener('click', function (e) {
      var a = e.target.closest('button'); if (!a) return;
      var s = sel();
      if (a.getAttribute('data-a') === 'undo') { if (s.length) release(s.pop()); }
      else { while (s.length) release(s.pop()); }
      if (typeof window._ordSeq === 'function') window._ordSeq();
      refresh();
    });
    pool.addEventListener('click', function () { setTimeout(refresh, 0); });
    // per-chip marks after Check; cleared on Reset or on any further pick
    var pp = document.getElementById('propPool');
    function clearMarks() { if (pp) $$('button', pp).forEach(function (b) { b.classList.remove('mu-right', 'mu-wrong', 'mu-missed'); }); var k = document.getElementById('mu-key'); if (k) k.remove(); }
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button'); if (!b) return;
      var oc = b.getAttribute('onclick') || '';
      if (/gradeBronze/.test(oc)) setTimeout(function () {
        clearMarks();
        if (pp) $$('button', pp).forEach(function (c) {
          var want = c.getAttribute('data-ok') === '1', got = c.classList.contains('sel');
          if (want && got) c.classList.add('mu-right');
          else if (!want && got) c.classList.add('mu-wrong');
          else if (want && !got) c.classList.add('mu-missed');
        });
        var g = document.getElementById('bronzeGrade');
        if (g) {
          var key = el('div', 'mu-key', '<span class="r">Green</span> = right · <span class="w">red</span> = not something the argument establishes · <span class="m">dashed</span> = one you missed');
          key.id = 'mu-key'; g.parentNode.insertBefore(key, g.nextSibling);
          g.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
      if (/resetBronze/.test(oc)) setTimeout(function () { clearMarks(); refresh(); }, 0);
      if (pp && b.closest('#propPool')) clearMarks();
    }, true);
    refresh();
  }

  function run() {
    try { initPremiseDefence(); } catch (e) { if (window.console) console.warn("mastery-ui initPremiseDefence:", e); }
    try { initPremiseCards(); } catch (e) { if (window.console) console.warn("mastery-ui initPremiseCards:", e); }
    try { initSections(); } catch (e) { if (window.console) console.warn("mastery-ui initSections:", e); }
    try { initDerive(); } catch (e) { if (window.console) console.warn("mastery-ui initDerive:", e); }
    try { initPressed(); } catch (e) { if (window.console) console.warn("mastery-ui initPressed:", e); }
    try { initCheckpoint(); } catch (e) { if (window.console) console.warn("mastery-ui initCheckpoint:", e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
