/* library/objection-tree.js
 * ---------------------------------------------------------------------------
 * Turns an essay's "Strongest Objections" PROSE section into a set of
 * tap-to-open, colour-coded objection cards — WITHOUT changing a single word
 * of the certified prose. It only re-presents paragraphs that are already on
 * the page, so (like reviewed-badge.js and evidence.js) it is pure display of
 * already-gated content and needs no content re-gate: no new doctrinal text is
 * introduced, nothing is paraphrased. The only authored strings are the
 * navigational hint, the "Objection" chip, and the colour legend.
 *
 * HOW IT WORKS
 *   - Finds the <h2> whose text matches /strongest objections/ in .art-body.
 *   - For each following <h3> (an objection) up to the next <h2>, it wraps that
 *     objection's <p> paragraphs into a collapsible card. The <h3> text becomes
 *     the card header; the paragraphs move inside, untouched.
 *   - The first paragraph (the objection at its strongest) gets a rust left-
 *     rule; the rest (our response) get a navy one — the essay's own
 *     objection -> concede -> reply -> verdict shape made visible.
 *
 * WHY NOT <details>: native <details> collapses with display:none, which drops
 * the hidden text out of element.innerText. The "Listen to this essay" player
 * and the AI-tutor excerpt both read .art-body innerText, so a collapsed
 * <details> would make them SKIP the objections. This collapses with a CSS
 * max-height clip instead, which keeps every paragraph in the render tree (and
 * in innerText and in the crawlable DOM) whether open or closed.
 *
 * OPT-IN: include this script only on essays that should get the tree.
 *
 * ORDER MATTERS: include this AFTER /library/verse-popup.js, which assigns the
 * p<N> anchor ids to `.art-body > p` for the AI paragraph-citation deep-links.
 * Those ids are assigned first, then travel WITH each paragraph node when we
 * move it, so getElementById('p<N>') keeps working.
 * ------------------------------------------------------------------------- */
(function () {
  if (window.__objTreeDone) return;

  function injectCSS() {
    if (document.getElementById('obt-css')) return;
    var css = [
      '.obt-wrap{margin:16px 0 8px}',
      '.obt-hint{font-family:"DM Sans",sans-serif;font-size:.9rem;color:#5a6b82;margin:0 0 14px}',
      '.obt{border:1px solid #e8e2d8;border-radius:10px;background:#fff;margin-bottom:10px;overflow:hidden}',
      '.obt.open{border-color:#d8cfbf}',
      '.obt-sum{width:100%;text-align:left;display:flex;align-items:center;gap:11px;padding:13px 15px;cursor:pointer;background:none;border:none;font:inherit;color:inherit}',
      '.obt.open .obt-sum{background:#f4ecdd}',
      '.obt-sum:focus-visible{outline:2px solid #a88930;outline-offset:-2px}',
      '.obt-chip{font-family:"DM Sans",sans-serif;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#b0453f;background:rgba(176,69,63,.1);border:1px solid rgba(176,69,63,.28);border-radius:5px;padding:3px 8px;white-space:nowrap;flex:none}',
      '.obt-q{flex:1;font-family:"Playfair Display",serif;font-weight:600;font-size:1.06rem;color:#0a1628;line-height:1.35}',
      '.obt-chev{color:#a88930;font-size:13px;transition:transform .2s;flex:none}',
      '.obt.open .obt-chev{transform:rotate(180deg)}',
      '.obt-clip{max-height:0;overflow:hidden;transition:max-height .3s ease}',
      '.obt.open .obt-clip{max-height:none}',
      '.obt-body{padding:2px 15px 14px}',
      '.obt-body p{padding-left:13px;border-left:2px solid transparent}',
      '.obt-body p.obt-skeptic{border-left-color:rgba(176,69,63,.42)}',
      '.obt-body p.obt-ours{border-left-color:rgba(30,66,120,.42)}',
      '.obt-legend{font-family:"DM Sans",sans-serif;font-size:.78rem;color:#8a94a3;margin:12px 0 0}',
      '.obt-legend .obt-r{color:#b0453f}.obt-legend .obt-n{color:#1e4278}'
    ].join('');
    var s = document.createElement('style');
    s.id = 'obt-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function boot() {
    if (window.__objTreeDone) return;
    var body = document.querySelector('.art-body');
    if (!body) return;

    // Locate the objections section header.
    var h2s = body.querySelectorAll('h2');
    var head = null;
    for (var i = 0; i < h2s.length; i++) {
      if (/strongest objections/i.test(h2s[i].textContent || '')) { head = h2s[i]; break; }
    }
    if (!head) return;

    // Group the section's <h3> objections with their following <p> paragraphs.
    var cards = [];
    var current = null;
    var node = head.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      var tag = node.tagName;
      if (tag === 'H3') {
        current = { title: node, paras: [] };
        cards.push(current);
      } else if (current && tag === 'P') {
        current.paras.push(node);
      }
      node = node.nextElementSibling;
    }
    if (!cards.length) return;

    injectCSS();

    var wrap = document.createElement('div');
    wrap.className = 'obt-wrap';
    var hint = document.createElement('p');
    hint.className = 'obt-hint';
    hint.textContent = 'Tap an objection to see it stated at its strongest, then answered in full.';
    wrap.appendChild(hint);

    cards.forEach(function (c, ci) {
      var card = document.createElement('div');
      card.className = 'obt' + (ci === 0 ? ' open' : ''); // first open so the pattern is obvious

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'obt-sum';
      btn.setAttribute('aria-expanded', ci === 0 ? 'true' : 'false');
      var chip = document.createElement('span');
      chip.className = 'obt-chip';
      chip.textContent = 'Objection';
      var q = document.createElement('span');
      q.className = 'obt-q';
      q.innerHTML = c.title.innerHTML; // keep any <em>/entities from the heading
      var chev = document.createElement('span');
      chev.className = 'obt-chev';
      chev.setAttribute('aria-hidden', 'true');
      chev.innerHTML = '&#9662;';
      btn.appendChild(chip);
      btn.appendChild(q);
      btn.appendChild(chev);

      var clip = document.createElement('div');
      clip.className = 'obt-clip';
      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'obt-body';
      c.paras.forEach(function (p, pi) {
        // colour only — no text change. First paragraph = the objection; rest = our response.
        p.classList.add(pi === 0 ? 'obt-skeptic' : 'obt-ours');
        bodyDiv.appendChild(p); // MOVES the node (p<N> ids assigned by verse-popup travel with it)
      });
      clip.appendChild(bodyDiv);

      btn.addEventListener('click', function () {
        var open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      card.appendChild(btn);
      card.appendChild(clip);
      wrap.appendChild(card);
    });

    var leg = document.createElement('p');
    leg.className = 'obt-legend';
    leg.innerHTML = 'The skeptic&rsquo;s case in <b class="obt-r">rust</b>, our response in <b class="obt-n">navy</b>. Every point keeps the essay&rsquo;s own footnotes.';
    wrap.appendChild(leg);

    // Insert the tree where the section used to be, then drop the now-empty <h3> titles.
    head.parentNode.insertBefore(wrap, head.nextSibling);
    cards.forEach(function (c) {
      if (c.title && c.title.parentNode) c.title.parentNode.removeChild(c.title);
    });

    window.__objTreeDone = true;
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
