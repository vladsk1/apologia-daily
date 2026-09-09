/* recall.js — retrieval-practice checkpoints for the deep-dive essays.

   Between the major sections of an essay it drops a quiet "Recall checkpoint":
   a muted divider the reader can tap to be prompted to restate, in their own
   words, the point of the section they just finished — the single most
   evidence-backed study technique (active retrieval + spacing), applied in
   context as you read rather than only in a quiz afterwards.

   It carries NO authored answer and asserts no doctrine — it references only the
   section's own heading (already on the page) and a generic recall instruction,
   and the optional "Check me" button hands the section to the essay's existing
   AI Tutor. So it is pure interaction plumbing: no new content, no doctrinal gate.

   Usage: one include per essay — <script src="/library/recall.js" defer></script>
   Collapsed by default (just a slim pill); expands on tap. Keyboard-accessible.
   Placed before every <h2> except the first, i.e. at the end of each section. */
(function(){
  if(window.__essayRecall) return; window.__essayRecall = true;

  function run(){
    var body = document.querySelector('.art-body');
    if(!body) return;
    var heads = [].slice.call(body.querySelectorAll('h2'))
      .filter(function(h){ return (h.textContent||'').trim().length > 1; });
    if(heads.length < 3) return;   // too short to benefit from mid-essay checkpoints

    injectCss();
    // a checkpoint at the END of each section = just before the NEXT h2 (skip the
    // first h2, which has no section before it). Reference the section just read.
    for(var i = 1; i < heads.length; i++){
      var prev = heads[i-1].textContent.replace(/\s+/g,' ').trim();
      insertBefore(heads[i], prev);
    }
  }

  function insertBefore(h2, sectionTitle){
    var wrap = document.createElement('div');
    wrap.className = 'rc-check';
    var openBtn = document.createElement('button');
    openBtn.type = 'button'; openBtn.className = 'rc-pill';
    openBtn.setAttribute('aria-expanded','false');
    openBtn.innerHTML = '<span class="rc-ic" aria-hidden="true">&#129504;</span> Recall checkpoint';

    var panel = document.createElement('div');
    panel.className = 'rc-panel'; panel.hidden = true;
    panel.innerHTML =
      '<p class="rc-q">Before reading on&mdash;in a sentence of your own, what did ' +
        '<strong>&ldquo;' + esc(sectionTitle) + '&rdquo;</strong> establish?</p>' +
      '<div class="rc-row">' +
        '<button type="button" class="rc-got">I&rsquo;ve got it</button>' +
        '<button type="button" class="rc-ask">Check me with the tutor &rarr;</button>' +
      '</div>';

    wrap.appendChild(openBtn); wrap.appendChild(panel);
    h2.parentNode.insertBefore(wrap, h2);

    openBtn.addEventListener('click', function(){
      var open = panel.hidden;
      panel.hidden = !open;
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      openBtn.classList.toggle('rc-open', open);
    });
    panel.querySelector('.rc-got').addEventListener('click', function(){
      panel.hidden = true; openBtn.setAttribute('aria-expanded','false'); openBtn.classList.remove('rc-open');
      openBtn.classList.add('rc-done');
      openBtn.innerHTML = '<span class="rc-ic" aria-hidden="true">&#10003;</span> Recalled';
      try{ if(window.adTrack) window.adTrack('essay_recall_got', {}); }catch(e){}
    });
    panel.querySelector('.rc-ask').addEventListener('click', function(){
      askTutor(sectionTitle);
    });
  }

  function askTutor(sectionTitle){
    if(typeof window.toggleFloatTutor !== 'function' || !document.getElementById('float-input')) return;
    try{
      var fp = document.getElementById('float-panel');
      var isOpen = fp && fp.style.display && fp.style.display !== 'none';
      if(!isOpen) window.toggleFloatTutor();
      var input = document.getElementById('float-input');
      if(input){
        input.value = 'Test my understanding of the section “' + sectionTitle +
          '” from this essay: ask me one question about it, then tell me if my answer is right.';
        setTimeout(function(){ try{ input.focus(); }catch(e){} }, 120);
      }
      if(window.adTrack) window.adTrack('essay_recall_ask', {});
    }catch(e){}
  }

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function injectCss(){
    var css = [
      '.rc-check{margin:30px 0 8px;text-align:center}',
      ".rc-pill{font-family:'DM Sans',system-ui,sans-serif;font-size:.74rem;font-weight:600;letter-spacing:.03em;",
      'color:#8a6d1f;background:rgba(200,169,81,.10);border:1px solid rgba(200,169,81,.32);border-radius:999px;',
      'padding:.38em .95em;cursor:pointer;display:inline-flex;align-items:center;gap:.5em;transition:background .15s,color .15s}',
      '.rc-pill:hover{background:rgba(200,169,81,.18);color:#0a1628}',
      '.rc-pill.rc-open{background:#0a1628;color:#fff;border-color:#0a1628}',
      '.rc-pill.rc-done{color:#2f7a48;background:rgba(70,150,95,.10);border-color:rgba(70,150,95,.32);cursor:default}',
      '.rc-pill:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
      '.rc-ic{font-size:1em}',
      '.rc-panel{max-width:560px;margin:.7rem auto 0;text-align:left;background:#fff;border:1px solid #e8e2d8;',
      'border-radius:12px;padding:1rem 1.15rem}',
      ".rc-q{font-family:'Source Serif 4',Georgia,serif;font-size:1rem;line-height:1.55;color:#2a3a52;margin:0 0 .8rem}",
      '.rc-q strong{color:#0a1628}',
      '.rc-row{display:flex;flex-wrap:wrap;gap:.6rem}',
      ".rc-row button{font-family:'DM Sans',system-ui,sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;border-radius:7px;padding:.5em .95em;border:1px solid transparent}",
      '.rc-got{background:transparent;color:#5a6b82;border-color:#d9d2c6}',
      '.rc-got:hover{color:#0a1628;border-color:#0a1628}',
      '.rc-ask{background:#c8a951;color:#0a1628;border:none}',
      '.rc-ask:hover{background:#d4b96a}',
      '.rc-row button:focus-visible{outline:2px solid #c8a951;outline-offset:2px}',
      '@media (prefers-reduced-motion:reduce){.rc-pill{transition:none}}'
    ].join('');
    var st = document.createElement('style'); st.id = 'essay-recall-css'; st.textContent = css;
    document.head.appendChild(st);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
