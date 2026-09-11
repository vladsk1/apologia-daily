/* Apologia Daily — shared nav behavior: dropdown, mobile menu, active link */
(function(){
  function init(){
    var nav=document.querySelector('.adn-nav'); if(!nav) return;
    /* Ask Anything was replaced by Asked & Answered. Repoint any legacy nav link at
       runtime so pages whose static nav still points at the old URL stay correct
       (the old URL also 301s server-side). Nav-scoped only; body links untouched. */
    try {
      var legacy=nav.querySelectorAll('a[href*="ask-anything.html"]');
      for(var L=0;L<legacy.length;L++){
        legacy[L].setAttribute('href','/asked-and-answered.html');
        if((legacy[L].textContent||'').trim()==='Ask Anything') legacy[L].textContent='Asked & Answered';
      }
    } catch(e){}
    var path=(location.pathname||'/').replace(/\/index\.html$/,'/')||'/';
    var links=nav.querySelectorAll('.adn-links a');
    for(var i=0;i<links.length;i++){
      var href=links[i].getAttribute('href')||'';
      if(!href||href==='#') continue;
      var ap=href.replace(/^https?:\/\/[^/]+/,'').replace(/\/index\.html$/,'/');
      if(ap===path || (ap.length>1 && path.indexOf(ap)===0)) links[i].classList.add('adn-active');
    }
    var burger=nav.querySelector('.adn-burger');
    if(burger){burger.addEventListener('click',function(){var o=nav.classList.toggle('adn-menu-open');burger.setAttribute('aria-expanded',o?'true':'false');if(o){var lk=nav.querySelector('.adn-links');if(lk)lk.scrollTop=0;}});}
    var more=nav.querySelector('.adn-more'), hd=nav.querySelector('.adn-has-drop');
    if(more&&hd){more.addEventListener('click',function(e){e.stopPropagation();var o=hd.classList.toggle('adn-open');more.setAttribute('aria-expanded',o?'true':'false');});}
    document.addEventListener('click',function(e){if(hd&&!hd.contains(e.target))hd.classList.remove('adn-open');});
    /* Signed-in shim: many older pages' navAuth() shows Sign out but predates the
       Dashboard link — whenever Sign out becomes visible, reveal Dashboard too. */
    var so=document.getElementById('nav-signout'), dash=document.getElementById('nav-dashboard');
    if(so&&dash&&!/dashboard\.html$/.test(location.pathname)){
      var sync=function(){ if(so.style.display!=='none'&&so.style.display!==''&&dash.style.display==='none'){ dash.style.display='inline-block'; } };
      sync();
      try{ new MutationObserver(sync).observe(so,{attributes:true,attributeFilter:['style']}); }catch(e){}
    }
    try{ navAuthSwap(); }catch(e){}
  }

  /* Global signed-in nav swap (usability fix). Answer pages ship no auth JS and the
     deep-dive essays only check the pro-gate, so their nav always read "Sign in"
     even when the reader was logged in. Reflect the login on EVERY page by reading
     the persisted Supabase session straight from localStorage — no supabase-js load,
     no network call. DISPLAY ONLY: this never authorizes anything; every protected
     action still re-validates the token server-side. If a page's own navAuth() has
     already filled nav-user, we defer to it. */
  var SB_TOKEN_KEY='sb-noprgxkwniouukmrfozc-auth-token';
  function readSession(){
    try{
      var raw=localStorage.getItem(SB_TOKEN_KEY); if(!raw) return null;
      var o=JSON.parse(raw); var s=(o&&(o.currentSession||o))||null;
      if(!s||!s.access_token) return null;
      if(s.expires_at && (s.expires_at*1000) < Date.now()) return null; /* expired → treat as logged out */
      var u=s.user||{}, md=u.user_metadata||{};
      return { name:(md.full_name||md.name||(u.email?String(u.email).split('@')[0]:'')||'Account') };
    }catch(e){ return null; }
  }
  function navAuthSwap(){
    var signin=document.getElementById('nav-signin'); if(!signin) return; /* page has no auth nav */
    var user=document.getElementById('nav-user');
    if(user && (user.textContent||'').trim()) return; /* a page's own navAuth already ran */
    var sess=readSession(); if(!sess) return; /* logged out → leave "Sign in" as-is */
    if(user){ user.textContent=sess.name; user.style.display='inline-block'; }
    signin.style.display='none';
    var cta=document.getElementById('nav-cta'); if(cta) cta.style.display='none';
    var d=document.getElementById('nav-dashboard'); if(d) d.style.display='inline-block';
    var out=document.getElementById('nav-signout');
    if(out){
      out.style.display='inline-block';
      if(!out.getAttribute('onclick') && !out.__adWired){ out.__adWired=1;
        out.addEventListener('click',function(e){ e.preventDefault(); adSignOut(); }); }
    }
  }
  /* Fallback sign-out for pages that ship no supabase-js (answers/essays): clearing
     the persisted session token IS the client sign-out here. It intentionally does
     NOT revoke the refresh token server-side (no client to call) — pages that load
     supabase-js keep their own onclick="signOut()" which does the full revoke, and
     this fallback only binds when no such handler exists. */
  function adSignOut(){
    try{ for(var i=localStorage.length-1;i>=0;i--){ var k=localStorage.key(i); if(k&&/^sb-.*-auth-token$/.test(k)) localStorage.removeItem(k); } }catch(e){}
    window.location.href='/index.html';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
