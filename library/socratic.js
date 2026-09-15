/* socratic.js — "Teach me this" guided-reasoning tutor for the deep-dive essays.
 *
 * Adds a launcher button near the top of an essay. Instead of answering questions
 * (the existing float-tutor / ask-selection do that), this leads the reader to BUILD
 * the argument for themselves, one step at a time, in a back-and-forth conversation.
 *
 * It talks to the SAME endpoint the float-tutor uses (/api/tutor) with mode:"socratic",
 * sending the essay text as reference and the running dialogue as history. All the
 * endpoint's rails apply automatically: the pastoral/crisis path runs first, and the
 * orthodoxy / neutrality / argument-accuracy boundaries are in the system prompt.
 *
 * The Socratic SYSTEM PROMPT is doctrinal content and is gated in api/tutor.js. This
 * file is interaction plumbing + UI copy — it adds no doctrinal claim of its own.
 *
 * Usage: one include per essay — <script src="/library/socratic.js" defer></script>
 * Requires window.AD_ARG (the argument name, set inline on every deep-dive essay)
 * and a .art-body container (the certified essay text, sent as reference).
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
  // Render assistant text as safe HTML: escape, then paragraph/line breaks + **bold**.
  function fmt(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  ready(function () {
    var body = document.querySelector('.art-body');
    var argName = (window.AD_ARG && String(window.AD_ARG).trim()) ||
      (document.title || '').replace(/\s*[|—-].*$/, '').trim();
    if (!body || !argName) return;

    var history = [];      // [{role, content}] — includes the hidden kickoff user turn
    var busy = false;
    var started = false;

    // ── styles ──
    var st = document.createElement('style');
    st.textContent = [
      '.soc-launch{display:flex;gap:12px;align-items:center;background:linear-gradient(135deg,#0a1628,#12294a);color:#fff;border:0;border-radius:12px;padding:15px 18px;margin:0 0 22px;cursor:pointer;width:100%;text-align:left;font-family:"DM Sans",system-ui,sans-serif;box-shadow:0 6px 18px rgba(10,22,40,.14)}',
      '.soc-launch:hover{box-shadow:0 8px 24px rgba(10,22,40,.22)}',
      '.soc-launch .ic{font-size:1.5rem;line-height:1}',
      '.soc-launch .tx{flex:1}',
      '.soc-launch .t1{font-weight:600;font-size:.98rem;display:block}',
      '.soc-launch .t2{font-size:.82rem;color:#c9d5e8;display:block;margin-top:2px}',
      '.soc-launch .go{color:#c8a951;font-weight:600;font-size:.82rem;white-space:nowrap}',
      '.soc-ov{position:fixed;inset:0;z-index:2000;background:rgba(6,13,26,.55);display:flex;align-items:flex-end;justify-content:center;padding:0}',
      '@media(min-width:640px){.soc-ov{align-items:center;padding:24px}}',
      '.soc-modal{background:#f7f4ef;width:100%;max-width:620px;height:88vh;max-height:760px;border-radius:16px 16px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -8px 40px rgba(0,0,0,.3)}',
      '@media(min-width:640px){.soc-modal{border-radius:16px;height:80vh}}',
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

    // ── launcher ──
    var launch = document.createElement('button');
    launch.type = 'button';
    launch.className = 'soc-launch';
    launch.innerHTML = '<span class="ic">&#127891;</span><span class="tx">' +
      '<span class="t1">Teach me this</span>' +
      '<span class="t2">Reason through the argument step by step with the AI tutor &mdash; you do the thinking.</span>' +
      '</span><span class="go">Start &rarr;</span>';
    body.insertBefore(launch, body.firstChild);

    var ov, log, input, sendBtn;

    function buildModal() {
      ov = document.createElement('div');
      ov.className = 'soc-ov';
      ov.setAttribute('role', 'dialog');
      ov.setAttribute('aria-modal', 'true');
      ov.setAttribute('aria-label', 'Teach me this — guided tutor');
      ov.innerHTML =
        '<div class="soc-modal">' +
          '<div class="soc-hd"><span class="ic">&#127891;</span><div><p class="h1">Teach me this</p>' +
            '<p class="h2">' + esc(argName) + '</p></div>' +
            '<button class="soc-x" type="button" aria-label="Close">&#10005;</button></div>' +
          '<div class="soc-log" aria-live="polite"></div>' +
          '<div class="soc-ft"><div class="soc-row">' +
            '<textarea class="soc-in" rows="1" placeholder="Type your answer&hellip;" aria-label="Your answer"></textarea>' +
            '<button class="soc-send" type="button">Send</button></div>' +
            '<p class="soc-note">AI tutor &middot; guided by this essay. If you&rsquo;re struggling with something serious, it will point you to real help.</p>' +
          '</div>' +
        '</div>';
      document.body.appendChild(ov);
      log = ov.querySelector('.soc-log');
      input = ov.querySelector('.soc-in');
      sendBtn = ov.querySelector('.soc-send');

      ov.querySelector('.soc-x').addEventListener('click', close);
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      sendBtn.addEventListener('click', function () { submit(); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      });
      input.addEventListener('input', function () {
        input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      });
      document.addEventListener('keydown', escClose);
    }

    function escClose(e) { if (e.key === 'Escape' && ov) close(); }

    function open() {
      if (!ov) buildModal();
      ov.style.display = 'flex';
      if (!started) { started = true; kickoff(); }
      setTimeout(function () { input && input.focus(); }, 80);
    }
    function close() { if (ov) ov.style.display = 'none'; }

    function bubble(cls, html) {
      var d = document.createElement('div');
      d.className = 'soc-msg ' + cls;
      d.innerHTML = '<p>' + html + '</p>';
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }

    function kickoff() {
      history.push({ role: 'user', content: KICKOFF });   // kept in history, not shown
      callAPI();
    }

    function submit() {
      var t = (input.value || '').trim();
      if (!t || busy) return;
      input.value = ''; input.style.height = 'auto';
      bubble('soc-you', fmt(t));
      history.push({ role: 'user', content: t });
      callAPI();
    }

    function callAPI() {
      busy = true; if (sendBtn) sendBtn.disabled = true;
      var typing = document.createElement('div');
      typing.className = 'soc-typing'; typing.textContent = 'Tutor is thinking…';
      log.appendChild(typing); log.scrollTop = log.scrollHeight;

      var ab = document.querySelector('.art-body');
      var excerpt = ab ? (ab.innerText || ab.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40000) : '';
      // send prior turns as history; the latest turn is `question` (crisis-checked server-side)
      var prior = history.slice(0, -1);
      var question = history[history.length - 1].content;

      fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'socratic', question: question, argument: argName,
          category: 'Evidence Library', excerpt: excerpt, history: prior
        })
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          typing.remove();
          var ans = res.d && res.d.answer;
          if (res.d && res.d.crisis) {
            bubble('soc-crisis', fmt(ans || ''));
            // do not keep pressing the lesson after a crisis reply
          } else if (res.ok && ans) {
            bubble('soc-ai', fmt(ans));
            history.push({ role: 'assistant', content: ans });
          } else {
            bubble('soc-ai', 'Sorry — I couldn&rsquo;t reach the tutor just now. Please try again in a moment.');
            history.pop(); // drop the unanswered turn so retry works cleanly
          }
        }).catch(function () {
          typing.remove();
          bubble('soc-ai', 'Sorry — something went wrong reaching the tutor. Please try again.');
          history.pop();
        }).then(function () {
          busy = false; if (sendBtn) sendBtn.disabled = false;
          if (input) input.focus();
        });
    }

    launch.addEventListener('click', open);
  });
})();
