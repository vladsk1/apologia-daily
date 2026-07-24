/* Active-Reading Layer — recall checkpoints on the deep-dive essays.
 *
 * After each prose section (each <h2> inside .art-body) it injects a COLLAPSED, skippable
 * "before you scroll on" recall prompt. On "Reveal" it shows the section's KEY POINT:
 *   1. a CURATED one-line takeaway from /library/active-reading-data.json (our own words,
 *      gated through argument+orthodoxy) when one exists for that section; otherwise
 *   2. the section's own OPENING SENTENCE, pulled verbatim from the DOM (a memory jog;
 *      certification-free by construction — it is the essay's own already-certified text).
 *
 * Design (see docs/ACTIVE_READING_SPEC.md): reading-flow first (collapsed, never blocks
 * scrolling), no cost on the fallback path, .art-body only (excludes the Pro-gate header,
 * footnotes, bibliography, FAQ, related, put-it-into-practice), pressure-free progress,
 * accessible (real buttons, aria-expanded, keyboard), reduced-motion + dark-mode aware.
 */
(function () {
  'use strict';
  if (window.__adActiveReading) return;
  window.__adActiveReading = true;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  // tolerant heading match: lowercase, drop entities/punctuation, collapse spaces
  function norm(s) {
    return (s || '').toLowerCase().replace(/&[a-z0-9#]+;/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  ready(function () {
    var body = document.querySelector('.art-body');
    if (!body || body.getAttribute('data-ar') === 'done') return;
    var slug = (location.pathname.split('/').pop() || 'essay').replace(/\.html$/, '');

    // Fetch curated takeaways; on any failure fall back to first-sentence for every section.
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; build({}); } }, 1500);
    fetch('/library/active-reading-data.json', { cache: 'force-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (all) {
        if (done) return; done = true; clearTimeout(timer);
        build((all && all[slug]) || {});
      });

    function build(curatedRaw) {
      // normalize curated keys once
      var curated = {};
      Object.keys(curatedRaw || {}).forEach(function (k) { curated[norm(k)] = curatedRaw[k]; });

      var kids = Array.prototype.slice.call(body.children);
      var sections = [], cur = null;
      kids.forEach(function (el) {
        if (el.tagName === 'H2') { cur = { h: el, nodes: [] }; sections.push(cur); }
        else if (cur) { cur.nodes.push(el); }
      });
      if (sections.length < 2) return;

      var store = readStore(slug), made = 0;
      sections.forEach(function (sec, i) {
        var firstP = null, words = 0;
        for (var n = 0; n < sec.nodes.length; n++) {
          if (sec.nodes[n].tagName === 'P') {
            if (!firstP) firstP = sec.nodes[n];
            words += (sec.nodes[n].textContent || '').trim().split(/\s+/).length;
          }
        }
        if (!firstP || words < 55) return;
        var last = sec.nodes[sec.nodes.length - 1];
        if (!last) return;

        var key = curated[norm(sec.h.textContent)];
        var takeaway = key || firstSentence(firstP);
        if (!takeaway) return;

        var cp = buildCheckpoint(takeaway, !!key, i, slug, store);
        last.insertAdjacentElement('afterend', cp);
        made++;
      });
      if (made) { injectStyles(); body.setAttribute('data-ar', 'done'); }
    }
  });

  function firstSentence(p) {
    var t = (p.textContent || '').trim().replace(/\s+/g, ' ');
    if (!t) return '';
    var m = t.match(/^.*?[.!?”"’](?=\s+[“"'A-Z0-9])/);
    var s = m ? m[0] : t;
    if (s.length > 240) s = s.slice(0, 237).replace(/\s+\S*$/, '') + '…';
    return s;
  }

  function buildCheckpoint(text, curated, idx, slug, store) {
    var isDone = store.indexOf(idx) !== -1;
    var wrap = document.createElement('aside');
    wrap.className = 'ar-check' + (isDone ? ' ar-done' : '');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Recall checkpoint');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ar-q';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span class="ar-icon" aria-hidden="true">&#10022;</span>' +
      '<span class="ar-prompt">Before you scroll on &mdash; can you put this section in your own words?</span>' +
      '<span class="ar-cue">Reveal &#8595;</span>';

    var panel = document.createElement('div');
    panel.className = 'ar-a';
    panel.hidden = true;
    var cap = document.createElement('p');
    cap.className = 'ar-a-label';
    cap.textContent = curated
      ? 'The key point of this section:'
      : 'How this section opens (a memory jog — re-read it if that didn’t come back):';
    var q = document.createElement('blockquote');
    q.className = 'ar-a-text';
    q.textContent = text;                                  // textContent — never innerHTML
    var lab = document.createElement('label');
    lab.className = 'ar-got';
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = isDone;
    lab.appendChild(cb);
    lab.appendChild(document.createTextNode(' I could recall it'));
    panel.appendChild(cap); panel.appendChild(q); panel.appendChild(lab);

    btn.addEventListener('click', function () {
      var ex = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!ex));
      panel.hidden = ex;
    });
    cb.addEventListener('change', function () {
      if (cb.checked) { wrap.classList.add('ar-done'); addToStore(slug, idx); }
      else { wrap.classList.remove('ar-done'); removeFromStore(slug, idx); }
    });

    wrap.appendChild(btn); wrap.appendChild(panel);
    return wrap;
  }

  function key(slug) { return 'ad_read_' + slug; }
  function readStore(slug) { try { return JSON.parse(localStorage.getItem(key(slug)) || '[]') || []; } catch (e) { return []; } }
  function writeStore(slug, a) { try { localStorage.setItem(key(slug), JSON.stringify(a)); } catch (e) {} }
  function addToStore(slug, i) { var a = readStore(slug); if (a.indexOf(i) === -1) { a.push(i); writeStore(slug, a); } }
  function removeFromStore(slug, i) { writeStore(slug, readStore(slug).filter(function (x) { return x !== i; })); }

  function injectStyles() {
    if (document.getElementById('ar-styles')) return;
    var css = [
      '.ar-check{margin:26px 0;border:1px solid #e6dfd2;border-left:3px solid #c8a951;border-radius:8px;background:#fbf9f4;font-family:"DM Sans",system-ui,sans-serif}',
      '.ar-check.ar-done{border-left-color:#4a7a52;background:#f6f9f4}',
      '.ar-q{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;cursor:pointer;padding:12px 15px;font:inherit;color:#3a4a62}',
      '.ar-icon{color:#c8a951;font-size:15px;flex:0 0 auto}',
      '.ar-prompt{flex:1 1 auto;font-size:.9rem;font-weight:600;color:#0a1628}',
      '.ar-cue{flex:0 0 auto;font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:#1e4278;font-weight:600}',
      '.ar-q[aria-expanded="true"] .ar-cue{opacity:.55}',
      '.ar-a{padding:0 15px 14px 15px}',
      '.ar-a-label{margin:2px 0 6px;font-size:.76rem;color:#7a7263;font-style:italic}',
      '.ar-a-text{margin:0 0 10px;padding:8px 12px;border-left:2px solid #d8cdb4;background:#fff;color:#2a2a2a;font-size:.9rem;line-height:1.55;border-radius:0 6px 6px 0}',
      '.ar-got{display:inline-flex;align-items:center;gap:7px;font-size:.83rem;color:#3a4a62;cursor:pointer}',
      '.ar-got input{width:15px;height:15px;accent-color:#4a7a52}',
      '@media (prefers-reduced-motion:no-preference){.ar-a{animation:ar-in .18s ease-out}@keyframes ar-in{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}}',
      '@media (prefers-color-scheme:dark){.ar-check{background:#141b28;border-color:#26303f}.ar-check.ar-done{background:#131d16}.ar-prompt{color:#f4efe6}.ar-q{color:#c3cad6}.ar-a-text{background:#0d131d;color:#e8e2d8;border-left-color:#3a4657}.ar-a-label{color:#9aa3b0}.ar-got{color:#c3cad6}}'
    ].join('');
    var s = document.createElement('style'); s.id = 'ar-styles'; s.textContent = css;
    document.head.appendChild(s);
  }
})();
