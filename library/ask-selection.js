/* ask-selection.js — active-reading helper for the deep-dive essays. Select any
   passage in the essay body and a small "Ask about this" button appears; tapping
   it opens the existing AI Tutor with your selection pre-filled, so a reader can
   interrogate the exact sentence that puzzles them without retyping it.

   It only surfaces the tutor that is already on the page (window.toggleFloatTutor
   + #float-input + sendFloatQuestion) — it adds no new endpoint and no new
   content. Interaction plumbing only; no doctrinal gate.

   Usage: one include per essay — <script src="/library/ask-selection.js" defer></script>
   Requires the essay's inline float-tutor (present on all deep-dive essays). */
(function(){
  if(window.__askSelection) return; window.__askSelection = true;

  var MIN = 8, MAX = 400;          // selection length window (chars)
  var btn = null, lastText = '';
  var HINT_KEY = 'ad_ask_hint_seen';
  var hintEl = null, hintTimer = null;

  function tutorReady(){ return typeof window.toggleFloatTutor === 'function' && document.getElementById('float-input'); }

  // One-time, dismissible coachmark so readers discover the select-to-ask
  // feature instead of stumbling on it. Shows once per browser (localStorage),
  // auto-hides after a few seconds, and vanishes the moment the reader either
  // makes a real selection (they've found it) or opens the tutor from it.
  function killHint(){
    if(hintTimer){ clearTimeout(hintTimer); hintTimer = null; }
    if(!hintEl) return;
    var el = hintEl; hintEl = null;
    el.classList.remove('is-in');
    setTimeout(function(){ try{ el.remove(); }catch(e){} }, 260);
  }

  function showHintOnce(){
    if(hintEl || !tutorReady() || !document.querySelector('.art-body')) return;
    try{ if(localStorage.getItem(HINT_KEY)) return; }catch(e){ return; } // storage blocked → can't dedupe, so don't nag
    try{ localStorage.setItem(HINT_KEY, '1'); }catch(e){}

    var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var verb = touch ? 'Tap and hold' : 'Highlight';

    var s = document.createElement('style');
    s.textContent =
      '.ask-hint{position:fixed;left:16px;bottom:16px;z-index:530;max-width:330px;' +
      "font-family:'DM Sans',system-ui,sans-serif;background:#0a1628;color:#fff;" +
      'border:1px solid rgba(200,169,81,.5);border-radius:12px;padding:.85rem 1rem;' +
      'box-shadow:0 12px 32px rgba(10,22,40,.3);display:flex;gap:.6rem;align-items:flex-start;' +
      'opacity:0;transform:translateY(8px);transition:opacity .25s ease,transform .25s ease}' +
      '.ask-hint.is-in{opacity:1;transform:translateY(0)}' +
      '.ask-hint .ah-ic{color:#c8a951;font-size:1.1em;line-height:1.35;flex:0 0 auto}' +
      '.ask-hint .ah-tx{font-size:.86rem;line-height:1.45}' +
      '.ask-hint .ah-tx b{color:#c8a951;font-weight:700}' +
      '.ask-hint .ah-x{flex:0 0 auto;background:none;border:0;color:#9fb0c8;font-size:1.15rem;' +
      'line-height:1;cursor:pointer;padding:0 .1em;margin-left:.1em}' +
      '.ask-hint .ah-x:hover{color:#fff}' +
      '.ask-hint .ah-x:focus-visible{outline:2px solid #c8a951;outline-offset:2px}' +
      '@media (max-width:640px){.ask-hint{left:12px;right:12px;bottom:84px;max-width:none}}' +
      '@media (prefers-reduced-motion:reduce){.ask-hint{transition:none}}';
    document.head.appendChild(s);

    hintEl = document.createElement('div');
    hintEl.className = 'ask-hint'; hintEl.setAttribute('role', 'status');
    hintEl.innerHTML =
      '<span class="ah-ic" aria-hidden="true">&#128172;</span>' +
      '<span class="ah-tx"><b>Tip:</b> ' + verb + ' any sentence in the essay to ask the AI tutor about it.</span>' +
      '<button type="button" class="ah-x" aria-label="Dismiss tip">&times;</button>';
    document.body.appendChild(hintEl);
    requestAnimationFrame(function(){ if(hintEl) hintEl.classList.add('is-in'); });
    hintEl.querySelector('.ah-x').addEventListener('click', killHint);
    hintTimer = setTimeout(killHint, 9000);
    if(window.adTrack){ try{ window.adTrack('essay_ask_hint_shown', {}); }catch(e){} }
  }

  function ensureBtn(){
    if(btn) return btn;
    var s = document.createElement('style');
    s.textContent =
      '.ask-sel{position:fixed;z-index:520;transform:translate(-50%,-100%);' +
      "font-family:'DM Sans',system-ui,sans-serif;font-size:.8rem;font-weight:600;" +
      'background:#0a1628;color:#fff;border:1px solid rgba(200,169,81,.5);border-radius:8px;' +
      'padding:7px 12px;display:none;align-items:center;gap:7px;cursor:pointer;' +
      'box-shadow:0 8px 24px rgba(10,22,40,.28);white-space:nowrap}' +
      '.ask-sel::after{content:"";position:absolute;left:50%;bottom:-6px;width:11px;height:11px;' +
      'background:#0a1628;border-right:1px solid rgba(200,169,81,.5);border-bottom:1px solid rgba(200,169,81,.5);' +
      'transform:translateX(-50%) rotate(45deg)}' +
      '.ask-sel .as-ic{color:#c8a951}' +
      '.ask-sel:hover{border-color:#c8a951}' +
      '.ask-sel:focus-visible{outline:2px solid #c8a951;outline-offset:2px}';
    document.head.appendChild(s);
    btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'ask-sel';
    btn.innerHTML = '<span class="as-ic">&#128172;</span> Ask about this';
    btn.addEventListener('mousedown', function(e){ e.preventDefault(); }); // keep selection alive
    btn.addEventListener('click', ask);
    document.body.appendChild(btn);
    return btn;
  }

  function hide(){ if(btn) btn.style.display = 'none'; }

  function currentSelectionInBody(){
    var sel = window.getSelection && window.getSelection();
    if(!sel || sel.isCollapsed || !sel.rangeCount) return null;
    var text = sel.toString().replace(/\s+/g, ' ').trim();
    if(text.length < MIN || text.length > MAX) return null;
    var body = document.querySelector('.art-body');
    if(!body) return null;
    var range = sel.getRangeAt(0);
    // both ends must sit inside the essay body (not the tutor panel or nav)
    if(!body.contains(range.startContainer) || !body.contains(range.endContainer)) return null;
    return { text: text, rect: range.getBoundingClientRect() };
  }

  function onSelect(){
    if(!tutorReady()) return;
    var s = currentSelectionInBody();
    if(!s || !s.rect || (!s.rect.width && !s.rect.height)){ hide(); return; }
    lastText = s.text;
    killHint();   // they've found it — the coachmark is redundant now
    var b = ensureBtn();
    var top = Math.max(46, s.rect.top - 8);       // sit just above the selection, clear of the nav
    var left = Math.min(Math.max(70, s.rect.left + s.rect.width/2), window.innerWidth - 70);
    b.style.top = top + 'px'; b.style.left = left + 'px'; b.style.display = 'inline-flex';
  }

  function ask(){
    var text = lastText;
    hide();
    if(!text || !tutorReady()) return;
    try{
      // open the tutor panel if it is closed
      var panel = document.getElementById('float-panel');
      var isOpen = panel && panel.style.display && panel.style.display !== 'none';
      if(!isOpen) window.toggleFloatTutor();
      var input = document.getElementById('float-input');
      if(input){
        input.value = 'Help me understand this part of the essay: "' + text + '"';
        setTimeout(function(){ try{ input.focus(); input.selectionStart = input.selectionEnd = input.value.length; }catch(e){} }, 120);
      }
      if(window.adTrack) window.adTrack('essay_ask_selection', { len: text.length });
    }catch(e){}
    // clear the highlight so the reader sees the question, not the selection
    try{ var sel = window.getSelection(); if(sel) sel.removeAllRanges(); }catch(e){}
  }

  document.addEventListener('mouseup', function(){ setTimeout(onSelect, 0); });
  document.addEventListener('keyup', function(e){ if(e.shiftKey || e.key === 'Shift') setTimeout(onSelect, 0); });
  document.addEventListener('scroll', hide, { passive: true });
  document.addEventListener('mousedown', function(e){ if(btn && e.target !== btn && !btn.contains(e.target)) hide(); });

  // gentle one-time nudge, a beat after the page settles
  function initHint(){ setTimeout(showHintOnce, 700); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHint);
  else initHint();
})();
