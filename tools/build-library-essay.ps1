<#
  build-library-essay.ps1 — Apologia Daily Deep-Dive Library page builder.

  Turns a reviewed draft into a published library page: templated HTML (nav,
  Pro-gate unlocked, floating AI tutor, footnotes, bibliography, Article JSON-LD),
  links the matching Evidence Library card, and adds the page to sitemap.xml.

  The DRAFT file must begin with these comment fields (one per line):
    <!-- TITLE: ... -->         full essay title (also the <h1> and og:title)
    <!-- META: ... -->          ~150-char meta description
    <!-- SLUG: ... -->          url/file slug, e.g. consciousness  -> /library/consciousness.html
    <!-- ARG: ... -->           argument name for the AI-tutor label
    <!-- CATEGORY: ... -->      "God's Existence" | "Jesus" | "Resurrection" | ...
    <!-- CRUMB: ... -->         short breadcrumb label, e.g. Consciousness
    <!-- MASTERY: ... -->       matching mastery page, e.g. ev-m-consciousness.html
  ...followed by the body (<h2>/<h3>/<p>, <sup>n</sup>), then <h2>Footnotes</h2><ol>..</ol>,
  then a <h2>Bibliography...</h2><ul>..</ul>.

  Usage:  pwsh tools/build-library-essay.ps1 -Draft drafts/consciousness.html [-Root .]
#>
param(
  [Parameter(Mandatory=$true)][string]$Draft,
  [string]$Root
)
$ErrorActionPreference='Stop'
if(-not $Root){ $Root = Split-Path (Split-Path (Resolve-Path $Draft) -Parent) -Parent }
$Root = (Resolve-Path $Root).Path
$enc = New-Object System.Text.UTF8Encoding($false)
$today = Get-Date -Format 'yyyy-MM-dd'
$raw = [System.IO.File]::ReadAllText((Resolve-Path $Draft))

function Field($n){ ([regex]::Match($raw, "<!-- $($n): (.*?) -->")).Groups[1].Value.Trim() }
$title=Field 'TITLE'; $meta=Field 'META'; $slug=Field 'SLUG'; $arg=Field 'ARG'
$cat=Field 'CATEGORY'; $crumb=Field 'CRUMB'; $mastery=Field 'MASTERY'
if(-not $slug -or -not $title){ throw "Draft missing SLUG or TITLE header: $Draft" }

# body / footnotes / bibliography
$fnIdx=$raw.IndexOf('<h2>Footnotes</h2>')
if($fnIdx -lt 0){ throw "Draft missing '<h2>Footnotes</h2>': $Draft" }
$body=([regex]::Replace($raw.Substring(0,$fnIdx),'(?s)<!--.*?-->','')).Trim()
$fnPart=$raw.Substring($fnIdx)
$footnotes=([regex]::Match($fnPart,'(?s)<ol>.*?</ol>')).Value
$bib=([regex]::Match($fnPart,'(?s)<ul>.*?</ul>')).Value

# helpers
function AttrEsc($s){ $s.Replace('"','&quot;') }
function JsonEsc($s){ ([System.Net.WebUtility]::HtmlDecode($s)) -replace '\\','\\' -replace '"','\"' }
$catCrumb = if($cat -eq 'Jesus'){'Jesus'} elseif($cat -match 'God'){'God&rsquo;s Existence'} else { $cat -replace "'", '&rsquo;' }
$argjs = $arg.Replace("'","\'")
$schema = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"'+(JsonEsc $title)+'","description":"'+(JsonEsc $meta)+'","author":{"@type":"Organization","name":"Apologia Daily"},"publisher":{"@type":"Organization","name":"Apologia Daily","url":"https://apologiadaily.com"},"mainEntityOfPage":{"@type":"WebPage","@id":"https://apologiadaily.com/library/'+$slug+'.html"},"datePublished":"'+$today+'","dateModified":"'+$today+'","about":"Christian apologetics","isAccessibleForFree":true}</script>'

$tpl=@'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}} | Apologia Daily</title>
<meta name="description" content="{{METAATTR}}">
<link rel="canonical" href="https://apologiadaily.com/library/{{SLUG}}.html">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Apologia Daily">
<meta property="og:title" content="{{TITLEATTR}}">
<meta property="og:description" content="{{METAATTR}}">
<meta property="og:url" content="https://apologiadaily.com/library/{{SLUG}}.html">
<meta name="twitter:card" content="summary">
{{SCHEMA}}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/ad-nav.css">
<style>
  body{background:#f7f4ef;color:#0f1f38;font-family:'Source Serif 4',Georgia,serif;line-height:1.75;margin:0}
  .art{max-width:720px;margin:0 auto;padding:34px 24px 60px}
  .art-crumbs{font-family:'DM Sans',sans-serif;font-size:.8rem;color:#5a6b82;margin-bottom:18px}
  .art-crumbs a{color:#5a6b82;text-decoration:none}
  .art-crumbs a:hover{color:#a88930}
  .art-eyebrow{font-family:'DM Sans',sans-serif;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#a88930;font-weight:600}
  .art-badge{display:inline-block;font-family:'DM Sans',sans-serif;font-size:.62rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0a1628;background:#c8a951;border-radius:99px;padding:3px 9px;margin-left:8px;vertical-align:middle}
  h1{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.8rem,5vw,2.5rem);line-height:1.16;color:#0a1628;margin:10px 0 8px}
  .art-meta{font-family:'DM Sans',sans-serif;font-size:.85rem;color:#5a6b82;margin-bottom:28px;border-bottom:1px solid #e8e2d8;padding-bottom:18px}
  .art-body h2{font-family:'Playfair Display',serif;font-weight:600;font-size:1.5rem;color:#0a1628;margin:34px 0 10px}
  .art-body h3{font-family:'Playfair Display',serif;font-weight:600;font-size:1.18rem;color:#0f2040;margin:24px 0 8px}
  .art-body p{font-size:1.08rem;margin-bottom:1rem}
  .art-body blockquote{margin:1rem 0;padding:12px 18px;border-left:3px solid #c8a951;background:#fff;border-radius:0 6px 6px 0;font-style:italic;color:#2a3a52}
  .art-body ol,.art-body ul{font-size:1.05rem;padding-left:1.3rem}
  .art-body li{margin-bottom:6px}
  .art-body sup{color:#a88930;font-weight:600;font-size:.72em}
  .art-body a{color:#1e4278}
  .art-refs{margin-top:42px;border-top:1px solid #e8e2d8;padding-top:18px}
  .art-refs h2{font-family:'Playfair Display',serif;font-weight:600;font-size:1.2rem;color:#0a1628;margin:18px 0 8px}
  .art-refs ol,.art-refs ul{font-family:'DM Sans',sans-serif;font-size:.88rem;color:#3a4a62;line-height:1.6;padding-left:1.2rem}
  .art-refs li{margin-bottom:8px}
  .art-refs a{color:#1e4278;word-break:break-word}
  .art-cta{background:linear-gradient(155deg,#0a1628,#0f2040);color:#fff;border-radius:16px;padding:26px 28px;margin:38px 0 0;text-align:center}
  .art-cta h2{font-family:'Playfair Display',serif;color:#fff;font-size:1.3rem;margin:0 0 6px}
  .art-cta p{font-family:'DM Sans',sans-serif;color:#cdd8e8;font-size:.95rem;margin:0 auto 16px;max-width:46ch}
  .art-cta a{display:inline-block;font-family:'DM Sans',sans-serif;font-weight:600;background:#c8a951;color:#0a1628;text-decoration:none;padding:11px 22px;border-radius:8px;margin:4px}
  .art-cta a.ghost{background:transparent;color:#e8cf87;border:1px solid rgba(200,169,81,.5)}
</style>
</head>
<body>
<nav class="adn-nav">
  <a href="/" class="adn-logo">Apologia<span>Daily</span></a>
  <button class="adn-burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>
  <div class="adn-collapse">
    <ul class="adn-links">
      <li><a href="/evidence-library.html">Evidence Library</a></li>
      <li><a href="/daily-devotional.html">Daily Devotional</a></li>
      <li><a href="/debate-arena.html">Debate Arena</a></li>
      <li><a href="/ask-anything.html">Ask Anything</a></li>
      <li><a href="/worldviews.html">Worldviews</a></li>
      <li><a href="/study-plans.html">Study Plans</a></li>
      <li class="adn-has-drop">
        <button type="button" class="adn-more" aria-expanded="false">More <span class="adn-caret">&#9662;</span></button>
        <ul class="adn-drop">
          <li><a href="/library/">Deep-Dive Essays</a></li>
          <li><a href="/video-library.html">Videos</a></li>
          <li><a href="/games.html">Games</a></li>
          <li><a href="/whats-new.html">What&#39;s New</a></li>
          <li><a href="/answers/">Answers</a></li>
          <li><a href="/study-groups.html">Study Groups</a></li>
          <li><a href="/reading-club.html">Reading Clubs</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/what-we-believe.html">What We Believe</a></li>
          <li><a href="/editorial-standards.html">Editorial Standards</a></li>
        </ul>
      </li>
    </ul>
    <div class="adn-right">
      <a href="/dashboard.html" class="adn-dash" id="nav-dashboard" style="display:none;">Dashboard</a>
      <span class="adn-user" id="nav-user"></span>
      <a href="/login.html" class="adn-signin" id="nav-signin">Sign in</a>
      <a href="/signup.html" class="adn-cta" id="nav-cta">Start Free</a>
    </div>
  </div>
</nav>
<div id="proGate" style="display:none;position:fixed;inset:64px 0 0;z-index:90;background:linear-gradient(160deg,#050d1a,#0f2040);color:#fff;align-items:center;justify-content:center;text-align:center;padding:24px">
  <div style="max-width:460px">
    <div style="font-size:34px;margin-bottom:8px">&#128274;</div>
    <h2 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:600;margin-bottom:10px">Deep-Dive Essays are a Pro feature</h2>
    <p style="font-family:'DM Sans',sans-serif;color:#cdd8e8;font-size:15px;margin-bottom:22px">Go beyond the summary: the full scholarly case for each argument &mdash; its history, the strongest objections answered at length, with sources and an AI tutor.</p>
    <a href="/index.html#pricing" style="display:inline-block;font-family:'DM Sans',sans-serif;font-weight:600;background:#c8a951;color:#0a1628;text-decoration:none;padding:11px 24px;border-radius:6px;margin-bottom:14px">Upgrade to Pro &mdash; $8/mo</a>
    <div><a href="/evidence-library.html" style="font-family:'DM Sans',sans-serif;color:#8ea2bf;font-size:13px;text-decoration:none">&larr; Back to the Evidence Library</a></div>
  </div>
</div>
<main class="art">
  <nav class="art-crumbs"><a href="/evidence-library.html">Evidence Library</a> &rsaquo; {{CATCRUMB}} &rsaquo; <a href="/{{MASTERY}}">{{CRUMB}}</a> &rsaquo; <span>Deep Dive</span></nav>
  <p class="art-eyebrow">Deep Dive Essay <span class="art-badge">Pro</span></p>
  <h1>{{TITLE}}</h1>
  <p class="art-meta">Apologia Daily &middot; deep dive &middot; fully sourced</p>
<div id="ad-listen" style="display:flex;align-items:center;gap:12px;margin:0 0 28px;padding:12px 16px;background:#0a1628;border-radius:10px;">
    <button id="listen-btn" type="button" onclick="adToggleListen()" style="display:flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;background:#c8a951;color:#0a1628;border:none;border-radius:6px;padding:9px 16px;cursor:pointer;">&#9654;&nbsp; Listen to this essay</button>
    <span id="listen-status" style="font-family:'DM Sans',sans-serif;font-size:.76rem;color:rgba(255,255,255,.45);">Free preview voice</span>
    <button id="listen-stop" type="button" onclick="adStopListen()" style="display:none;margin-left:auto;font-family:'DM Sans',sans-serif;font-size:.78rem;background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:7px 12px;cursor:pointer;">Stop</button>
  </div>
  <div class="art-body">
{{BODY}}
  </div>
  <div class="art-refs">
    <h2>Footnotes</h2>
    {{FOOTNOTES}}
    <h2>Bibliography &amp; further reading</h2>
    {{BIB}}
  </div>
  <section class="art-cta">
    <h2>Put it into practice</h2>
    <p>Reconstruct this argument from memory, drill its objections, and defend it in the interactive Mastery Track.</p>
    <a href="/{{MASTERY}}">Practice this argument &rarr;</a>
    <a class="ghost" href="/ask-anything.html">Ask a question &rarr;</a>
  </section>
</main>
<div id="float-tutor" style="position:fixed;bottom:50%;right:0;transform:translateY(50%);z-index:500;display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;">
  <div id="float-panel" style="display:none;background:#0a1628;border:1px solid rgba(200,169,81,0.3);border-radius:8px 0 0 8px;width:min(320px,calc(100vw - 60px));box-shadow:-8px 0 32px rgba(0,0,0,0.4);">
    <div style="padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-family:'DM Sans',sans-serif;font-size:0.7rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#c8a951;">AI Tutor</div>
        <div style="font-family:'Playfair Display',serif;font-size:0.9rem;color:#fff;margin-top:2px;">{{ARG}}</div>
      </div>
      <button type="button" onclick="toggleFloatTutor()" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:1rem;cursor:pointer;padding:4px;">&#10005;</button>
    </div>
    <div style="padding:1rem 1.25rem;">
      <textarea id="float-input" rows="2" placeholder="Ask anything about this argument&hellip;" style="width:100%;box-sizing:border-box;font-family:'DM Sans',sans-serif;font-size:0.85rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:4px;color:#fff;padding:8px 10px;resize:none;outline:none;" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendFloatQuestion();}"></textarea>
      <button type="button" onclick="sendFloatQuestion()" id="float-send-btn" style="margin-top:0.5rem;width:100%;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;background:#c8a951;color:#050d1a;border:none;border-radius:4px;padding:9px;cursor:pointer;">Ask AI Tutor</button>
      <div id="float-response" style="display:none;margin-top:0.75rem;background:rgba(255,255,255,0.04);border-radius:4px;padding:0.75rem;font-family:'Source Serif 4',serif;font-size:0.85rem;color:rgba(255,255,255,0.8);line-height:1.7;max-height:200px;overflow-y:auto;white-space:pre-wrap;"></div>
      <div style="margin-top:0.65rem;font-family:'DM Sans',sans-serif;font-size:0.62rem;line-height:1.5;color:rgba(255,255,255,0.4);">AI-generated tutor &mdash; verify specific facts and quotes against the essay above and the primary sources.</div>
    </div>
  </div>
  <button type="button" onclick="toggleFloatTutor()" id="float-btn" style="background:#c8a951;color:#050d1a;border:none;border-radius:6px 0 0 6px;padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:600;cursor:pointer;box-shadow:-4px 0 16px rgba(200,169,81,0.35);display:flex;align-items:center;gap:7px;white-space:nowrap;"><span style="font-size:1rem;">&#129504;</span> Ask AI Tutor</button>
</div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
var AD_ARG = '{{ARGJS}}';
var floatOpen=false;
function toggleFloatTutor(){
  floatOpen=!floatOpen;
  document.getElementById('float-panel').style.display=floatOpen?'block':'none';
  var b=document.getElementById('float-btn');
  b.style.background=floatOpen?'#0a1628':'#c8a951';
  b.style.color=floatOpen?'#c8a951':'#050d1a';
  b.style.border=floatOpen?'1px solid rgba(200,169,81,0.3)':'none';
  if(floatOpen){ setTimeout(function(){var i=document.getElementById('float-input'); if(i) i.focus();},100); }
}
async function sendFloatQuestion(){
  var inp=document.getElementById('float-input'),btn=document.getElementById('float-send-btn'),resp=document.getElementById('float-response');
  var q=(inp.value||'').trim(); if(!q) return;
  btn.disabled=true; var ol=btn.textContent; btn.textContent='Thinking...';
  resp.style.display='block'; resp.textContent='...';
  try{
    var r=await fetch('/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,argument:AD_ARG,category:'Evidence Library'})});
    var d=await r.json(); resp.textContent=(d.answer||'Sorry, no response just now. Please try again.');
  }catch(e){ resp.textContent='The tutor is unavailable right now. Please try again in a moment.'; }
  btn.disabled=false; btn.textContent=ol;
}
(function(){
  function boot(){
    if(window.supabase && window.supabase.createClient){
      try{
        var sb=window.supabase.createClient('https://noprgxkwniouukmrfozc.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcHJneGt3bmlvdXVrbXJmb3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE1MTUsImV4cCI6MjA5NjEzNzUxNX0.GKmQgpndtaBUcz5SoT9H3bDsqjNSPixJJj4G3BrVkJw');
        sb.auth.getSession().then(function(result){
          var session=result.data && result.data.session;
          var isPro=true;
          if(!isPro){ var g=document.getElementById('proGate'); if(g) g.style.display='flex'; }
        });
      }catch(e){}
    }
  }
  if(document.readyState!=='loading') boot(); else document.addEventListener('DOMContentLoaded',boot);
})();
</script>
<script src="/ad-nav.js" defer></script>
<style>
  .ad-reading{ background:rgba(200,169,81,.16); box-shadow:inset 4px 0 0 #c8a951; border-radius:3px; transition:background .25s ease; }
  #ad-miniplayer{ position:fixed; left:0; right:0; bottom:0; z-index:600; display:none; align-items:center; gap:10px; background:#0a1628; border-top:1px solid rgba(200,169,81,.35); padding:10px 16px; padding-bottom:calc(10px + env(safe-area-inset-bottom)); box-shadow:0 -6px 20px rgba(0,0,0,.28); }
  #ad-miniplayer .mp-pp{ background:#c8a951; color:#0a1628; font-family:'DM Sans',sans-serif; font-weight:600; font-size:.88rem; border:none; border-radius:6px; padding:9px 14px; min-width:108px; cursor:pointer; }
  #ad-miniplayer .mp-prog{ font-family:'DM Sans',sans-serif; font-size:.7rem; color:rgba(255,255,255,.4); white-space:nowrap; }
  #ad-miniplayer .mp-title{ font-family:'DM Sans',sans-serif; font-size:.78rem; color:rgba(255,255,255,.55); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #ad-miniplayer .mp-stop{ background:transparent; color:rgba(255,255,255,.6); border:1px solid rgba(255,255,255,.22); border-radius:6px; font-family:'DM Sans',sans-serif; font-size:.76rem; padding:8px 12px; cursor:pointer; }
</style>
<div id="ad-miniplayer" role="region" aria-label="Essay audio player">
  <button class="mp-pp" type="button" onclick="adToggleListen()">&#10074;&#10074;&nbsp; Pause</button>
  <span class="mp-prog" id="mp-prog"></span>
  <span class="mp-title" id="mp-title"></span>
  <button class="mp-stop" type="button" onclick="adStopListen()">Stop</button>
</div>
<script>
(function(){
  var synth = window.speechSynthesis;
  var items = [], idx = 0, playing = false, paused = false, curEl = null;
  function gather(){
    var body = document.querySelector('.art-body'); items = [];
    if(!body) return;
    body.querySelectorAll('h2,h3,p').forEach(function(n){
      var clone = n.cloneNode(true);
      clone.querySelectorAll('sup').forEach(function(s){ s.remove(); });
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
    curEl = el || null;
    if(el){
      el.classList.add('ad-reading');
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
    u.onend = function(){ idx++; if(playing && !paused) speakNext(); };
    synth.speak(u);
  }
  window.adToggleListen = function(){
    if(!('speechSynthesis' in window)){ alert('Your browser does not support read-aloud.'); return; }
    if(!playing){ gather(); idx = 0; playing = true; paused = false; speakNext(); }
    else if(!paused){ try{ synth.pause(); }catch(e){} paused = true; setUI(); }
    else { try{ synth.resume(); }catch(e){} paused = false; setUI(); }
  };
  window.adStopListen = function(){
    playing = false; paused = false;
    try{ synth.cancel(); }catch(e){}
    if(curEl){ curEl.classList.remove('ad-reading'); curEl = null; }
    setUI();
  };
  if(synth && typeof synth.onvoiceschanged !== 'undefined'){ synth.onvoiceschanged = function(){}; }
  window.addEventListener('beforeunload', function(){ try{ synth.cancel(); }catch(e){} });
})();
</script>
</body>
</html>
'@

$page = $tpl.Replace('{{TITLE}}',$title).Replace('{{TITLEATTR}}',(AttrEsc $title)).Replace('{{METAATTR}}',(AttrEsc $meta)).Replace('{{SLUG}}',$slug).Replace('{{MASTERY}}',$mastery).Replace('{{CATCRUMB}}',$catCrumb).Replace('{{CRUMB}}',$crumb).Replace('{{SCHEMA}}',$schema).Replace('{{BODY}}',$body).Replace('{{FOOTNOTES}}',$footnotes).Replace('{{BIB}}',$bib).Replace('{{ARGJS}}',$argjs).Replace('{{ARG}}',$arg)
if($page -match '\{\{'){ throw "Unfilled placeholder remains for $slug" }
$out = Join-Path $Root "library\$slug.html"
[System.IO.File]::WriteAllText($out,$page,$enc)
Write-Host "  built  library/$slug.html  (body $($body.Length) chars)"

# link the matching Evidence Library card (search ev-s*.html for the inline-tutor anchor)
$btn = @"
<a href="/library/$slug.html" onclick="event.stopPropagation()" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;text-decoration:none;background:rgba(200,169,81,.1);border:1px solid rgba(200,169,81,.5);border-radius:6px;padding:1rem 1.25rem;margin-top:1rem;">
  <span style="display:flex;align-items:center;gap:.75rem;">
    <span style="font-size:1.1rem;">&#128214;</span>
    <span>
      <span style="display:block;font-family:var(--fd);font-size:.9rem;font-weight:700;color:#fff;">Read the full deep-dive essay</span>
      <span style="display:block;font-family:var(--ui);font-size:.75rem;color:rgba(255,255,255,.55);margin-top:2px;">The full scholarly case, the strongest objections answered &mdash; with sources &middot; Free</span>
    </span>
  </span>
  <span style="font-family:var(--ui);font-size:.82rem;font-weight:500;padding:9px 18px;border-radius:3px;background:var(--g);color:var(--n);white-space:nowrap;">Read the essay &rarr;</span>
</a>
"@
$anchor = '<div class="inline-tutor" onclick="event.stopPropagation()" id="it-' + $slug + '">'
$linked = $false
Get-ChildItem $Root -Filter 'ev-s*.html' -File | ForEach-Object {
  if(-not $linked){
    $c=[System.IO.File]::ReadAllText($_.FullName)
    if($c.Contains($anchor)){
      if($c.Contains("/library/$slug.html")){ Write-Host "  card already linked in $($_.Name)"; $linked=$true }
      else { $c=$c.Replace($anchor,$btn+"`n"+$anchor); [System.IO.File]::WriteAllText($_.FullName,$c,$enc); Write-Host "  linked card in $($_.Name)"; $linked=$true }
    }
  }
}
if(-not $linked){ Write-Host "  WARNING: no ev-s*.html card found with id=it-$slug" }

# sitemap
$sm = Join-Path $Root 'sitemap.xml'
$s=[System.IO.File]::ReadAllText($sm)
if($s -notmatch "/library/$slug\.html"){
  $s=$s.Replace('</urlset>',"  <url><loc>https://apologiadaily.com/library/$slug.html</loc><lastmod>$today</lastmod><priority>0.6</priority></url>`n</urlset>")
  [System.IO.File]::WriteAllText($sm,$s,$enc); Write-Host "  sitemap entry added"
} else { Write-Host "  already in sitemap" }
