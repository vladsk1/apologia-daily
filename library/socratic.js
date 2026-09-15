/* socratic.js — "Teach me this" guided-reasoning tutor.
 *
 * Instead of answering questions (the float-tutor / ask-selection do that), this leads
 * the reader to BUILD an argument for themselves, one step at a time, in a back-and-forth.
 *
 * Two entry points, one engine:
 *   • Deep-dive essays: auto-inserts a launcher at the top of .art-body, teaching from the
 *     essay's own text (window.AD_ARG + .art-body).
 *   • Evidence Library hub: window.ADSocratic.apply(container) adds a launcher to each card,
 *     teaching from that card's own certified text — so a reader learns the argument without
 *     leaving the card. (evidence-library.html calls this from enhanceSection.)
 *   • window.openSocratic({argument, getExcerpt}) opens the conversation programmatically.
 *
 * It talks to the SAME endpoint the float-tutor uses (/api/tutor) with mode:"socratic",
 * sending the certified text as reference and the running dialogue as history. All the
 * endpoint's rails apply automatically: the pastoral/crisis path runs first, and the
 * orthodoxy / neutrality / argument-accuracy boundaries are in the (gated) system prompt.
 *
 * The Socratic SYSTEM PROMPT is doctrinal content and is gated in api/tutor.js. This file
 * is interaction plumbing + UI copy — it adds no doctrinal claim of its own, and it teaches
 * only from certified text supplied at call time.
 */
(function () {
  if (window.__socratic) return; window.__socratic = true;

  var KICKOFF = 'Begin the guided walkthrough now. Ask me your first question — just one — to start building this argument. Do not summarise the whole argument.';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  // ── styles (injected once) ──
  var stylesDone = false;
  function ensureStyles() {
    if (stylesDone) return; stylesDone = true;
    var st = document.createElement('style');
    st.textContent = [
      '.soc-launch{display:flex;gap:12px;align-items:center;background:linear-gradient(135deg,#0a1628,#12294a);color:#fff;border:0;border-radius:12px;padding:15px 18px;margin:0 0 22px;cursor:pointer;width:100%;text-align:left;font-family:"DM Sans",system-ui,sans-serif;box-shadow:0 6px 18px rgba(10,22,40,.14)}',
      '.soc-launch:hover{box-shadow:0 8px 24px rgba(10,22,40,.22)}',
      '.soc-launch .ic{font-size:1.5rem;line-height:1}',
      '.soc-launch .tx{flex:1}',
      '.soc-launch .t1{font-weight:600;font-size:.98rem;display:block}',
      '.soc-launch .t2{font-size:.82rem;color:#c9d5e8;display:block;margin-top:2px}',
      '.soc-launch .go{color:#c8a951;font-weight:600;font-size:.82rem;white-space:nowrap}',
      '.soc-launch.soc-card{margin:0 0 16px}',
      // right-edge launcher tab for essays (stacks above the "Ask AI Tutor" tab)
      '.soc-tab{background:#0a1628;color:#fff;border:1px solid rgba(200,169,81,.55);border-right:0;border-radius:7px 0 0 7px;padding:9px 13px;font-family:"DM Sans",system-ui,sans-serif;cursor:pointer;box-shadow:-4px 0 16px rgba(10,22,40,.28);display:flex;align-items:center;gap:9px;white-space:nowrap;text-align:left}',
      '.soc-tab:hover{background:#12294a}',
      '.soc-tab .ic{font-size:1.15rem;line-height:1}',
      '.soc-tab .t1{display:block;font-size:.82rem;font-weight:600;line-height:1.2}',
      '.soc-tab .t2{display:block;font-size:.66rem;font-weight:400;color:#c9d5e8;line-height:1.2;margin-top:1px}',
      // conversation container: NO backdrop, does not block or capture clicks on the essay
      '.soc-ov{position:fixed;inset:0;z-index:1900;pointer-events:none}',
      // mobile: a bottom sheet leaving the top of the essay visible
      '.soc-modal{pointer-events:auto;position:fixed;left:0;right:0;bottom:0;height:min(64vh,600px);background:#f7f4ef;border-radius:16px 16px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -10px 40px rgba(0,0,0,.28)}',
      // desktop: a right-side rail, and the article/hub column shifts left so its text
      // sits fully beside the rail (not under it) — the essay stays readable while asking
      '@media(min-width:880px){.soc-modal{left:auto;top:64px;right:0;bottom:0;width:400px;height:auto;border-radius:12px 0 0 12px;box-shadow:-10px 0 44px rgba(0,0,0,.22)}',
      'html.soc-open .art,html.soc-open .main{margin-left:24px;margin-right:424px}}',
      '.art,.main{transition:margin .2s ease}',
      // while the tutor panel is open, hide the floating launch tabs and nudge pills
      // so nothing (e.g. the "Daily reminder" bell) overlaps the conversation controls
      'html.soc-open #float-tutor,html.soc-open #ad-notify,html.soc-open #ad-install,html.soc-open #ad-ios-install{display:none!important}',
      '.soc-hd{background:linear-gradient(135deg,#0a1628,#12294a);color:#fff;padding:15px 18px;display:flex;align-items:center;gap:11px;flex:0 0 auto}',
      '.soc-hd .ic{font-size:1.35rem}',
      '.soc-hd .h1{font-family:"DM Sans",system-ui,sans-serif;font-weight:600;font-size:.98rem;margin:0}',
      '.soc-hd .h2{font-family:"DM Sans",system-ui,sans-serif;font-size:.76rem;color:#c9d5e8;margin:1px 0 0}',
      '.soc-x{margin-left:auto;background:none;border:0;color:rgba(255,255,255,.6);font-size:1.3rem;cursor:pointer;padding:4px 6px;line-height:1}',
      '.soc-x:hover{color:#fff}',
      '.soc-log{flex:1 1 auto;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px}',
      '.soc-msg{max-width:88%;font-family:"Source Serif 4",Georgia,serif;font-size:1rem;line-height:1.55;padding:11px 14px;border-radius:13px}',
      '.soc-msg p{margin:0 0 .6em}.soc-msg p:last-child{margin:0}',
      '.soc-ai{align-self:flex-start;background:#fff;border:1px solid #e8e2d8;color:#1a2740;border-bottom-left-radius:4px}',
      '.soc-you{align-self:flex-end;background:#0a1628;color:#fff;border-bottom-right-radius:4px}',
      '.soc-crisis{align-self:stretch;max-width:100%;background:#fff;border:1px solid #d9c4c4;border-left:3px solid #b4534f}',
      '.soc-typing{align-self:flex-start;color:#7a8699;font-family:"DM Sans",sans-serif;font-size:.85rem;padding:6px 4px}',
      '.soc-ft{flex:0 0 auto;border-top:1px solid #e2dccf;background:#f7f4ef;padding:11px 14px}',
      '.soc-row{display:flex;gap:9px;align-items:flex-end}',
      '.soc-in{flex:1;font-family:"DM Sans",sans-serif;font-size:.92rem;padding:10px 12px;border:1px solid #d5cdbf;border-radius:9px;background:#fff;color:#0f1f38;resize:none;max-height:120px;outline:none}',
      '.soc-in:focus{border-color:#c8a951;box-shadow:0 0 0 3px rgba(200,169,81,.16)}',
      '.soc-send{background:#c8a951;color:#050d1a;border:0;border-radius:9px;font-family:"DM Sans",sans-serif;font-weight:600;font-size:.88rem;padding:11px 16px;cursor:pointer;flex:0 0 auto}',
      '.soc-send:disabled{opacity:.5;cursor:default}',
      '.soc-note{font-family:"DM Sans",sans-serif;font-size:.68rem;color:#96a0b0;text-align:center;margin:7px 0 0}'
    ].join('');
    document.head.appendChild(st);
  }

  // ── modal singleton ──
  var ov, log, input, sendBtn, hdTitle, cur = null;

  function buildModal() {
    if (ov) return;
    ov = document.createElement('div');
    ov.className = 'soc-ov';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Teach me this — guided tutor');
    ov.style.display = 'none';
    ov.innerHTML =
      '<div class="soc-modal">' +
        '<div class="soc-hd"><span class="ic">&#127891;</span><div><p class="h1">Teach me this</p>' +
          '<p class="h2"></p></div>' +
          '<button class="soc-x" type="button" aria-label="Close">&#10005;</button></div>' +
        '<div class="soc-log" aria-live="polite"></div>' +
        '<div class="soc-ft"><div class="soc-row">' +
          '<textarea class="soc-in" rows="1" placeholder="Type your answer&hellip;" aria-label="Your answer"></textarea>' +
          '<button class="soc-send" type="button">Send</button></div>' +
          '<p class="soc-note">AI tutor &middot; guided by this argument. If you&rsquo;re struggling with something serious, it will point you to real help.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    log = ov.querySelector('.soc-log');
    input = ov.querySelector('.soc-in');
    sendBtn = ov.querySelector('.soc-send');
    hdTitle = ov.querySelector('.soc-hd .h2');

    ov.querySelector('.soc-x').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    sendBtn.addEventListener('click', function () { submit(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
    });
    input.addEventListener('input', function () {
      input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov && ov.style.display !== 'none') close(); });
  }

  function close() { if (ov) ov.style.display = 'none'; document.documentElement.classList.remove('soc-open'); }

  function bubble(cls, html) {
    var d = document.createElement('div');
    d.className = 'soc-msg ' + cls;
    d.innerHTML = '<p>' + html + '</p>';
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function openSocratic(opts) {
    opts = opts || {};
    ensureStyles(); buildModal();
    cur = {
      argument: (opts.argument || 'this argument'),
      getExcerpt: (typeof opts.getExcerpt === 'function' ? opts.getExcerpt : function () { return ''; }),
      history: [], busy: false
    };
    hdTitle.textContent = cur.argument;
    log.innerHTML = '';
    input.value = ''; input.style.height = 'auto';
    ov.style.display = 'block';
    document.documentElement.classList.add('soc-open');
    kickoff();
    setTimeout(function () { input && input.focus(); }, 80);
  }
  window.openSocratic = openSocratic;

  function kickoff() {
    cur.history.push({ role: 'user', content: KICKOFF });   // kept in history, not shown
    callAPI();
  }

  function submit() {
    if (!cur) return;
    var t = (input.value || '').trim();
    if (!t || cur.busy) return;
    input.value = ''; input.style.height = 'auto';
    bubble('soc-you', fmt(t));
    cur.history.push({ role: 'user', content: t });
    callAPI();
  }

  function callAPI() {
    cur.busy = true; if (sendBtn) sendBtn.disabled = true;
    var typing = document.createElement('div');
    typing.className = 'soc-typing'; typing.textContent = 'Tutor is thinking…';
    log.appendChild(typing); log.scrollTop = log.scrollHeight;

    var excerpt = '';
    try { excerpt = (cur.getExcerpt() || '').toString().slice(0, 40000); } catch (e) { excerpt = ''; }
    var prior = cur.history.slice(0, -1);
    var question = cur.history[cur.history.length - 1].content;
    var session = cur; // guard against a close+reopen mid-flight

    fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'socratic', question: question, argument: cur.argument,
        category: 'Evidence Library', excerpt: excerpt, history: prior
      })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (session !== cur) return;   // a different session was opened; drop stale reply
        typing.remove();
        var ans = res.d && res.d.answer;
        if (res.d && res.d.crisis) {
          bubble('soc-crisis', fmt(ans || ''));
        } else if (res.ok && ans) {
          bubble('soc-ai', fmt(ans));
          cur.history.push({ role: 'assistant', content: ans });
        } else {
          bubble('soc-ai', 'Sorry — I couldn&rsquo;t reach the tutor just now. Please try again in a moment.');
          cur.history.pop();
        }
      }).catch(function () {
        if (session !== cur) return;
        typing.remove();
        bubble('soc-ai', 'Sorry — something went wrong reaching the tutor. Please try again.');
        cur.history.pop();
      }).then(function () {
        if (session !== cur) return;
        cur.busy = false; if (sendBtn) sendBtn.disabled = false;
        if (input) input.focus();
      });
  }

  function makeLauncher(cardClass) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'soc-launch' + (cardClass ? ' soc-card' : '');
    b.innerHTML = '<span class="ic">&#127891;</span><span class="tx">' +
      '<span class="t1">Teach me this</span>' +
      '<span class="t2">Reason through the argument step by step with the AI tutor &mdash; you do the thinking.</span>' +
      '</span><span class="go">Start &rarr;</span>';
    return b;
  }

  // ── essay launcher: a right-edge tab stacked above the "Ask AI Tutor" tab ──
  // Deliberately NOT inserted into the essay body: the walkthrough should be reachable
  // from anywhere in the essay, not assume the reader has scrolled to the top; and the
  // conversation opens as a side rail / bottom sheet so the essay stays readable.
  ready(function () {
    var body = document.querySelector('.art-body');
    var argName = (window.AD_ARG && String(window.AD_ARG).trim()) ||
      (document.title || '').replace(/\s*[|—-].*$/, '').trim();
    if (!body || !argName) return;
    argName = argName.replace(/\\(['’])/g, '$1');
    ensureStyles();
    function essayExcerpt() {
      var ab = document.querySelector('.art-body');
      if (!ab) return '';
      var clone = ab.cloneNode(true);
      var chrome = clone.querySelectorAll('.soc-launch, .soc-tab, script, style');
      for (var i = 0; i < chrome.length; i++) chrome[i].parentNode.removeChild(chrome[i]);
      return (clone.textContent || '').replace(/\s+/g, ' ').trim();
    }
    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'soc-tab';
    tab.setAttribute('aria-label', 'Teach me this — guided tutor');
    tab.innerHTML = '<span class="ic">&#127891;</span><span><span class="t1">Teach me this</span><span class="t2">Guided, step by step</span></span>';
    tab.addEventListener('click', function () {
      openSocratic({ argument: argName, getExcerpt: essayExcerpt });
    });
    var host = document.getElementById('float-tutor');
    if (host) {
      // stack it in the same right-edge column, just above the Ask AI Tutor button
      host.insertBefore(tab, host.firstChild);
      // give the sibling "Ask AI Tutor" button a matching descriptor so the two tabs
      // read as two distinct tools (ask vs be taught). Runs once, guarded.
      var ask = document.getElementById('float-btn');
      if (ask && !ask.__socDesc) {
        ask.__socDesc = true;
        ask.style.alignItems = 'center';
        ask.innerHTML = '<span style="font-size:1.15rem;line-height:1;">&#129504;</span>' +
          '<span style="text-align:left;">' +
          '<span style="display:block;font-size:.82rem;font-weight:600;line-height:1.2;">Ask AI Tutor</span>' +
          '<span style="display:block;font-size:.66rem;font-weight:400;line-height:1.2;margin-top:1px;opacity:.82;">Ask any question</span></span>';
      }
    } else {
      // fallback: a standalone right-edge tab, vertically centred
      tab.style.position = 'fixed';
      tab.style.right = '0';
      tab.style.top = '50%';
      tab.style.transform = 'translateY(-50%)';
      tab.style.zIndex = '500';
      document.body.appendChild(tab);
    }
  });

  // ── Evidence Library hub: one launcher per card ──
  window.ADSocratic = {
    apply: function (container) {
      try {
        if (!container) return;
        ensureStyles();
        var cards = container.querySelectorAll ? container.querySelectorAll('.card') : [];
        for (var i = 0; i < cards.length; i++) (function (card) {
          if (card.__soc) return; card.__soc = true;
          var cb = card.querySelector('.cb') || card;
          // argument name: prefer the inline-tutor's data-arg, else the card title
          var btn = card.querySelector('[data-arg]');
          var titleEl = card.querySelector('.ct');
          // prefer the clean card title; some data-arg attributes carry a stray
          // escaping backslash (e.g. "Paul\'s"), so strip \ before a quote either way
          var argName = (titleEl ? titleEl.textContent.trim() : '') ||
            (btn && btn.getAttribute('data-arg')) || 'this argument';
          argName = argName.replace(/\\(['’])/g, '$1');
          var launch = makeLauncher(true);
          launch.addEventListener('click', function (e) {
            e.stopPropagation();  // the whole .card toggles on click; don't close it
            openSocratic({
              argument: argName,
              getExcerpt: function () {
                if (typeof window.argExcerpt === 'function') {
                  var x = window.argExcerpt(card); if (x) return x;
                }
                var body = card.querySelector('.cb') || card;
                return (body.innerText || body.textContent || '').replace(/\s+/g, ' ').trim();
              }
            });
          });
          cb.insertBefore(launch, cb.firstChild);
        })(cards[i]);
      } catch (e) {}
    }
  };

  // Close the load-order race on the hub: the first section's enhanceSection() can run
  // before this deferred script defines window.ADSocratic (later tab switches are fine
  // because it is defined by then). A MutationObserver catches cards whenever they are
  // injected — initial section, tab switches, or any re-render — independent of timing.
  // apply() is idempotent (card.__soc guard); this is a no-op on essays (no cards ever).
  ready(function () {
    if (!('MutationObserver' in window)) { window.ADSocratic.apply(document); return; }
    var queued = false;
    function flush() { queued = false; window.ADSocratic.apply(document); }
    var mo = new MutationObserver(function () {
      if (queued) return; queued = true;
      (window.requestAnimationFrame || setTimeout)(flush);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.ADSocratic.apply(document); // catch anything already present
  });
})();
