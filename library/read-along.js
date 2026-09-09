/* read-along.js — the essay "Listen to this essay" read-aloud, shared across all
   deep-dive essays (was an identical inline block duplicated in 92 files).

   It keeps everything the inline version did — the Listen button, the fixed
   mini-player (pause / resume / stop), sentence-level highlighting of the
   paragraph being read, and auto-scroll — and ADDS word-level highlighting:
   the individual word currently being spoken lights up inside the sentence,
   read-along style (usability item, 2026-09-09).

   The word layer uses the speech API's `boundary` event + the CSS Custom
   Highlight API, so it needs NO DOM mutation. Both are feature-detected and the
   whole word layer is wrapped so it can never break the core read-aloud: where a
   browser doesn't fire word boundaries (common on mobile) or lacks the highlight
   API, it silently falls back to the sentence highlight that always worked.

   Markup this script binds to (kept in each essay): #listen-btn / #listen-stop
   (top button), #ad-miniplayer with .mp-pp / #mp-prog / #mp-title / .mp-stop,
   and the .ad-reading sentence-highlight class. It exposes window.adToggleListen
   and window.adStopListen for the inline onclick handlers.

   Pure presentation of the essay's own text — no new content, no doctrinal gate. */
(function(){
  var synth = window.speechSynthesis;
  var items = [], idx = 0, playing = false, paused = false, curEl = null;

  // ---- word-level highlight support (all optional, all guarded) ----
  var WORD_HL = !!(window.CSS && CSS.highlights && window.Highlight && document.createRange);
  var wordMap = null;        // [{node, off, len, start}] for the current sentence
  function injectCss(){
    if(!WORD_HL || document.getElementById('ad-word-css')) return;
    var s = document.createElement('style');
    s.id = 'ad-word-css';
    // ::highlight() paints over the .ad-reading sentence tint; a touch stronger.
    s.textContent = '::highlight(ad-word){background:rgba(200,169,81,.5);color:#0a1628;border-radius:2px}';
    document.head.appendChild(s);
  }
  function clearWord(){
    if(WORD_HL){ try{ CSS.highlights.delete('ad-word'); }catch(e){} }
    wordMap = null;
  }
  // Build a map from each character of the spoken text (whitespace-collapsed,
  // <sup>/buttons/hidden evidence-panel text excluded — matching how `gather`
  // builds the utterance string) back to a live (textNode, offset). This lets a
  // boundary charIndex resolve to an exact DOM range with no mutation.
  var SKIP = /^(SUP|BUTTON|SCRIPT|STYLE)$/;
  function buildWordMap(el){
    wordMap = null;
    if(!WORD_HL) return;
    try{
      var map = [];              // map[i] = {node, off} for char i of the collapsed text
      var lastSpace = true;      // collapse leading + interior whitespace runs
      (function walk(node){
        for(var n = node.firstChild; n; n = n.nextSibling){
          if(n.nodeType === 3){  // text node
            var s = n.nodeValue;
            for(var i = 0; i < s.length; i++){
              var ch = s[i];
              if(/\s/.test(ch)){
                if(!lastSpace){ map.push({node:n, off:i, sp:true}); lastSpace = true; }
              } else { map.push({node:n, off:i, sp:false}); lastSpace = false; }
            }
          } else if(n.nodeType === 1){
            var tag = n.tagName;
            // skip footnote markers, buttons, and the hidden evidence-panel box
            if(SKIP.test(tag) || (n.classList && n.classList.contains('ev-box'))) continue;
            walk(n);
          }
        }
      })(el);
      // trim a trailing collapsed space so indices line up with the trimmed text
      while(map.length && map[map.length-1].sp) map.pop();
      wordMap = map;
    }catch(e){ wordMap = null; }
  }
  function highlightWord(charIndex){
    if(!WORD_HL || !wordMap || charIndex == null) return;
    try{
      if(charIndex >= wordMap.length) return;
      // extend from charIndex to the end of the word (next collapsed space)
      var end = charIndex;
      while(end < wordMap.length && !wordMap[end].sp) end++;
      if(end <= charIndex) return;
      var a = wordMap[charIndex], b = wordMap[end-1];
      var range = document.createRange();
      range.setStart(a.node, a.off);
      range.setEnd(b.node, b.off + 1);
      CSS.highlights.set('ad-word', new window.Highlight(range));
    }catch(e){ /* leave the sentence highlight in place */ }
  }

  function gather(){
    var body = document.querySelector('.art-body'); items = [];
    if(!body) return;
    body.querySelectorAll('h2,h3,p').forEach(function(n){
      var clone = n.cloneNode(true);
      // Exclude footnote markers, the "See the evidence" button, and the hidden
      // evidence-panel box — so the narration reads the prose, not the widget
      // chrome, and so the spoken text lines up with buildWordMap's exclusions
      // (which keeps word highlighting aligned past an inline evidence panel).
      clone.querySelectorAll('sup, button, .ev-box').forEach(function(s){ s.remove(); });
      var t = clone.textContent.replace(/\s+/g,' ').trim();
      if(t) items.push({ text:t, el:n });
    });
  }
  function pickVoice(){
    var vs = synth.getVoices();
    return vs.find(function(v){ return /en[-_]?(US|GB)/i.test(v.lang) && /natural|google|samantha|daniel|aria|jenny|libby/i.test(v.name); })
        || vs.find(function(v){ return /^en/i.test(v.lang); }) || vs[0];
  }
  function highlight(el){
    if(curEl) curEl.classList.remove('ad-reading');
    clearWord();
    curEl = el || null;
    if(el){
      el.classList.add('ad-reading');
      buildWordMap(el);
      var r = el.getBoundingClientRect();
      if(r.top < 80 || r.bottom > (window.innerHeight - 110)) el.scrollIntoView({ behavior:'smooth', block:'center' });
    }
  }
  function setUI(){
    var top = document.getElementById('listen-btn'), stopTop = document.getElementById('listen-stop');
    var mp = document.getElementById('ad-miniplayer');
    if(playing){
      var label = paused ? '&#9654;&nbsp; Resume' : '&#10074;&#10074;&nbsp; Pause';
      mp.style.display = 'flex';
      mp.querySelector('.mp-pp').innerHTML = label;
      if(top) top.innerHTML = label;
      if(stopTop) stopTop.style.display = 'inline-block';
      document.getElementById('mp-prog').textContent = Math.min(idx+1, items.length) + ' / ' + items.length;
      document.getElementById('mp-title').textContent = curEl ? curEl.textContent.replace(/\s+/g,' ').trim().slice(0,70) : '';
    } else {
      mp.style.display = 'none';
      if(top) top.innerHTML = '&#9654;&nbsp; Listen to this essay';
      if(stopTop) stopTop.style.display = 'none';
    }
  }
  function speakNext(){
    if(idx >= items.length){ adStopListen(); return; }
    highlight(items[idx].el); setUI();
    var u = new SpeechSynthesisUtterance(items[idx].text);
    var v = pickVoice(); if(v) u.voice = v; u.rate = 1.0; u.pitch = 1.0;
    if(WORD_HL){
      u.onboundary = function(e){ if(e.name === 'word' || e.name == null) highlightWord(e.charIndex); };
    }
    u.onend = function(){ clearWord(); idx++; if(playing && !paused) speakNext(); };
    synth.speak(u);
  }
  window.adToggleListen = function(){
    if(!('speechSynthesis' in window)){ alert('Your browser does not support read-aloud.'); return; }
    injectCss();
    if(!playing){ gather(); idx = 0; playing = true; paused = false; speakNext(); }
    else if(!paused){ try{ synth.pause(); }catch(e){} paused = true; setUI(); }
    else { try{ synth.resume(); }catch(e){} paused = false; setUI(); }
  };
  window.adStopListen = function(){
    playing = false; paused = false;
    try{ synth.cancel(); }catch(e){}
    clearWord();
    if(curEl){ curEl.classList.remove('ad-reading'); curEl = null; }
    setUI();
  };
  if(synth && typeof synth.onvoiceschanged !== 'undefined'){ synth.onvoiceschanged = function(){}; }
  window.addEventListener('beforeunload', function(){ try{ synth.cancel(); }catch(e){} });
})();
