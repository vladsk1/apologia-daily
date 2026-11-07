/* ============================================================
   signin-nudge.js — gentle "sign in to save your progress" prompt.

   The learning tools (challenge, daily-mix, daily-quiz, explain-it-back, coach,
   today, objection-deck) work fully signed-out, but their streak/progress then
   lives ONLY in that browser. progress-sync.js already syncs it the moment a
   user is signed in — this just makes that benefit visible, so an anonymous
   user has a reason to create a (free) account.

   STRICT no-op when: signed in, already dismissed, or localStorage is blocked.
   It never gates anything — the tools stay fully usable without an account.
   Include it with:  <script src="/signin-nudge.js" defer></script>
   ============================================================ */
(function () {
  'use strict';
  var DISMISS_KEY = 'ad-signin-nudge-dismissed';

  function signedIn() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /^sb-.*-auth-token$/.test(k)) {
          var t = JSON.parse(localStorage.getItem(k) || '{}');
          var u = t.user || (t.currentSession && t.currentSession.user);
          if (u && u.id) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function dismissed() {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch (e) { return false; }
  }

  function build() {
    try {
      if (signedIn() || dismissed()) return;
      if (document.getElementById('ad-signin-nudge')) return;

      var next = encodeURIComponent(location.pathname + location.search);
      var bar = document.createElement('div');
      bar.id = 'ad-signin-nudge';
      bar.setAttribute('role', 'note');
      bar.style.cssText = [
        'display:flex', 'align-items:center', 'gap:10px', 'flex-wrap:wrap',
        'justify-content:center', 'text-align:center',
        'font-family:"DM Sans",system-ui,sans-serif', 'font-size:0.88rem',
        'line-height:1.45', 'color:#0a1628',
        'background:#fbf6e9', 'border-bottom:1px solid #e7d9ad',
        'padding:10px 44px 10px 16px', 'position:relative'
      ].join(';');

      var msg = document.createElement('span');
      msg.innerHTML = 'Your streak and progress are saved only on this device. ' +
        '<a href="/login.html?next=' + next + '" style="color:#1e4278;font-weight:600;text-decoration:underline;">Sign in</a> ' +
        'to keep them across your phone and laptop — it’s free.';

      var close = document.createElement('button');
      close.type = 'button';
      close.setAttribute('aria-label', 'Dismiss');
      close.textContent = '×';
      close.style.cssText = [
        'position:absolute', 'right:12px', 'top:50%', 'transform:translateY(-50%)',
        'background:none', 'border:none', 'font-size:1.3rem', 'line-height:1',
        'color:#7a6a3a', 'cursor:pointer', 'padding:0 4px'
      ].join(';');
      close.onclick = function () {
        try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
        if (bar.parentNode) bar.parentNode.removeChild(bar);
      };

      bar.appendChild(msg);
      bar.appendChild(close);
      if (document.body) document.body.insertBefore(bar, document.body.firstChild);
    } catch (e) { /* never break the page over a nudge */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
