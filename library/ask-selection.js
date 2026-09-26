/* ask-selection.js — active-reading helper for the deep-dive essays AND the
   Evidence Library hub cards. Select any passage in an essay body (.art-body) or
   an argument card's body (.cb) and a small "Ask about this" button appears;
   tapping it opens the existing AI Tutor with your selection pre-filled, so a
   reader can interrogate the exact sentence that puzzles them without retyping it.

   It only surfaces the tutor that is already on the page (window.toggleFloatTutor
   + #float-input + sendFloatQuestion) — it adds no new endpoint and no new
   content. Interaction plumbing only; no doctrinal gate.

   Usage: one include per essay AND on evidence-library.html —
     <script src="/library/ask-selection.js" defer></script>
   Requires the page's float-tutor (present on all deep-dive essays and the hub). */
(function(){
  if(window.__askSelection) return; window.__askSelection = true;

  var MIN = 8, MAX = 400;          // selection length window (chars)
  var btn = null, lastText = '';

  function tutorReady(){ return typeof window.toggleFloatTutor === 'function' && document.getElementById('float-input'); }

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
      '.ask-sel:focus-visible{outline:2px solid #c8a951;outline-offset:2px}' +
      // "below" variant: on touch the button sits UNDER the selection so it clears
      // the OS copy/paste callout (which pops up above the selection); arrow flips up.
      '.ask-sel.below{transform:translate(-50%,0)}' +
      '.ask-sel.below::after{top:-6px;bottom:auto;' +
      'border:0;border-left:1px solid rgba(200,169,81,.5);border-top:1px solid rgba(200,169,81,.5)}';
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

  // The essay body (.art-body) or a single argument card body (.cb), never the
  // tutor panel, the nav, or the "Read it with the AI tutor" helper box itself.
  function containerOf(node){
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    if(!el) return null;
    if(el.closest('.reader-help')) return null;
    return el.closest('.art-body, .cb');
  }

  function currentSelectionInBody(){
    var sel = window.getSelection && window.getSelection();
    if(!sel || sel.isCollapsed || !sel.rangeCount) return null;
    var text = sel.toString().replace(/\s+/g, ' ').trim();
    if(text.length < MIN || text.length > MAX) return null;
    var range = sel.getRangeAt(0);
    // both ends must sit inside the SAME essay body or card body
    var c1 = containerOf(range.startContainer), c2 = containerOf(range.endContainer);
    if(!c1 || c1 !== c2) return null;
    return { text: text, rect: range.getBoundingClientRect() };
  }

  var coarse = false;
  try { coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches; } catch(e){}

  function onSelect(){
    if(!tutorReady()) return;
    var s = currentSelectionInBody();
    if(!s || !s.rect || (!s.rect.width && !s.rect.height)){ hide(); return; }
    lastText = s.text;
    var b = ensureBtn();
    var left = Math.min(Math.max(70, s.rect.left + s.rect.width/2), window.innerWidth - 70);
    // On touch, drop the button below the selection so it doesn't collide with the
    // OS selection callout (Copy/Share…), which appears above; desktop keeps it above.
    if(coarse){
      b.classList.add('below');
      b.style.top = Math.min(window.innerHeight - 12, s.rect.bottom + 12) + 'px';
    } else {
      b.classList.remove('below');
      b.style.top = Math.max(46, s.rect.top - 8) + 'px';
    }
    b.style.left = left + 'px'; b.style.display = 'inline-flex';
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
        input.value = 'Help me understand this passage: "' + text + '"';
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

  // MOBILE: touch text-selection fires neither mouseup nor keyup, so the two
  // listeners above never ran on a phone and the button never appeared. The
  // selectionchange event DOES fire on touch (repeatedly, as the handles move),
  // so debounce it and act once the selection settles. touchend catches the
  // lift. Both also work on desktop; the debounce keeps them cheap.
  var sct = null;
  document.addEventListener('selectionchange', function(){
    clearTimeout(sct);
    sct = setTimeout(onSelect, 350);
  });
  document.addEventListener('touchend', function(){ setTimeout(onSelect, 60); }, { passive: true });
})();
