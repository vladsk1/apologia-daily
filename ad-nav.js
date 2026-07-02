/* Apologia Daily — shared nav behavior: dropdown, mobile menu, active link */
(function(){
  function init(){
    var nav=document.querySelector('.adn-nav'); if(!nav) return;
    var path=(location.pathname||'/').replace(/\/index\.html$/,'/')||'/';
    var links=nav.querySelectorAll('.adn-links a');
    for(var i=0;i<links.length;i++){
      var href=links[i].getAttribute('href')||'';
      if(!href||href==='#') continue;
      var ap=href.replace(/^https?:\/\/[^/]+/,'').replace(/\/index\.html$/,'/');
      if(ap===path || (ap.length>1 && path.indexOf(ap)===0)) links[i].classList.add('adn-active');
    }
    var burger=nav.querySelector('.adn-burger');
    if(burger){burger.addEventListener('click',function(){var o=nav.classList.toggle('adn-menu-open');burger.setAttribute('aria-expanded',o?'true':'false');});}
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
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
