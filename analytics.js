/* ============================================================
   Apologia Daily — product analytics loader
   Loads Vercel Web Analytics (pageviews) + PostHog (retention,
   funnels, feature events). Safe by default: if POSTHOG_KEY is left
   as the placeholder, PostHog stays OFF (no tracking, no errors) and
   only Vercel pageview analytics runs.

   TO TURN ON POSTHOG:
   1. Create a free project at posthog.com (choose EU hosting for a
      privacy-conscious audience).
   2. Paste the Project API key (starts with "phc_") into POSTHOG_KEY
      below, and set POSTHOG_HOST to the matching region.
   That's it — events below start flowing.

   Custom events captured: pageviews (auto), upgrade_clicked,
   signup_intent, login_intent. Call window.adTrack('event', {..})
   anywhere to add more (e.g. on a completed drill).
   ============================================================ */
(function () {
  'use strict';

  var POSTHOG_KEY = 'phc_qrovkG3stLv8pvL5NWYuyghweekGuP2S8BscpTf9AFkJ';
  var POSTHOG_HOST = 'https://eu.i.posthog.com'; /* US: https://us.i.posthog.com */

  /* ---- Vercel Web Analytics (load once; pageviews + sources) ---- */
  try {
    if (!document.querySelector('script[src*="/_vercel/insights/script.js"]')) {
      var v = document.createElement('script');
      v.defer = true; v.src = '/_vercel/insights/script.js';
      document.head.appendChild(v);
    }
  } catch (e) {}

  /* ---- PostHog (only when a real key is configured) ---- */
  var phOn = POSTHOG_KEY && POSTHOG_KEY.indexOf('REPLACE') === -1;
  if (phOn) {
    !function (t, e) { var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.async = !0, p.src = s.api_host + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);
    try {
      window.posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: true,
        autocapture: true,
        persistence: 'localStorage+cookie'
      });
    } catch (e) {}

    /* Identify the signed-in user so retention/funnels are per-person.
       Reads the Supabase session straight from localStorage — no second
       auth client (avoids the token-refresh conflict that logs users out). */
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /^sb-.*-auth-token$/.test(k)) {
          var tok = JSON.parse(localStorage.getItem(k) || '{}');
          var user = tok.user || (tok.currentSession && tok.currentSession.user) || null;
          if (user && user.id && window.posthog && window.posthog.identify) {
            window.posthog.identify(user.id, user.email ? { email: user.email } : {});
          }
          break;
        }
      }
    } catch (e) {}
  }

  /* ---- tiny event helper (safe no-op if PostHog is off) ---- */
  window.adTrack = function (name, props) {
    try { if (window.posthog && window.posthog.capture) window.posthog.capture(name, props || {}); } catch (e) {}
  };

  /* ---- auto-instrument the key funnel events via delegated clicks ---- */
  try {
    document.addEventListener('click', function (ev) {
      var el = ev.target && ev.target.closest ? ev.target.closest('a,button') : null;
      if (!el) return;
      var href = (el.getAttribute && el.getAttribute('href')) || '';
      var cls = (el.className && el.className.toString) ? el.className.toString() : '';
      var txt = (el.textContent || '').toLowerCase();
      var where = location.pathname;
      if (/#pricing/.test(href) || /upgrade/i.test(cls) || txt.indexOf('upgrade') !== -1) {
        window.adTrack('upgrade_clicked', { where: where });
      } else if (/signup/i.test(href) || /\badn-cta\b|\bnav-cta\b/.test(cls)) {
        window.adTrack('signup_intent', { where: where });
      } else if (/login/i.test(href)) {
        window.adTrack('login_intent', { where: where });
      }
    }, true);
  } catch (e) {}

  /* ============================================================
     Content engagement + funnel instrumentation (delegated, site-wide).
     Adds what autocapture can't: acquisition attribution, scroll depth,
     FAQ reach, and named clicks on the internal answer<->essay funnel.
     Everything routes through adTrack (safe no-op if PostHog is off).
     ============================================================ */
  try {
    var _p = location.pathname;
    var _ct = /^\/library\/mk\//.test(_p) ? 'essay_mk'
            : /^\/library\/[^/]+\.html$/.test(_p) ? 'essay'
            : /^\/answers\/[^/]+\.html$/.test(_p) ? 'answer'
            : (_p === '/' || /\/index\.html?$/.test(_p)) ? 'home'
            : 'page';

    /* Acquisition: log the first campaign/referral landing of the session
       so organic vs social vs referral traffic is attributable. */
    try {
      var _qs = new URLSearchParams(location.search || '');
      var _c = {}, _keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
      for (var _i = 0; _i < _keys.length; _i++) { var _v = _qs.get(_keys[_i]); if (_v) _c[_keys[_i]] = _v; }
      if (Object.keys(_c).length && !sessionStorage.getItem('ad_camp_logged')) {
        sessionStorage.setItem('ad_camp_logged', '1');
        _c.landing = _p;
        try { if (document.referrer) _c.referrer = document.referrer; } catch (x) {}
        window.adTrack('campaign_landing', _c);
      }
    } catch (e) {}

    /* Scroll-depth milestones on long-form content (each fires once). */
    if (_ct === 'essay' || _ct === 'answer' || _ct === 'essay_mk') {
      var _fired = {}, _marks = [25, 50, 75, 90], _tk = null;
      var _depth = function () {
        try {
          var d = document.documentElement;
          var range = d.scrollHeight - window.innerHeight;
          if (range <= 40) return;
          var pct = Math.round(((window.scrollY || d.scrollTop || 0) / range) * 100);
          for (var i = 0; i < _marks.length; i++) {
            var m = _marks[i];
            if (pct >= m && !_fired[m]) {
              _fired[m] = 1;
              window.adTrack('scroll_depth', { depth: m, content_type: _ct, path: _p });
              if (m === 90) window.adTrack('read_complete', { content_type: _ct, path: _p });
            }
          }
        } catch (x) {}
      };
      window.addEventListener('scroll', function () {
        if (_tk) return; _tk = setTimeout(function () { _tk = null; _depth(); }, 300);
      }, { passive: true });
      window.addEventListener('load', _depth);
    }

    /* FAQ section reached — the FAQ is always-open, so track visibility. */
    try {
      var _faq = document.querySelector('.ad-faq');
      if (_faq && 'IntersectionObserver' in window) {
        var _io = new IntersectionObserver(function (ents) {
          for (var i = 0; i < ents.length; i++) {
            if (ents[i].isIntersecting) { window.adTrack('faq_viewed', { content_type: _ct, path: _p }); _io.disconnect(); break; }
          }
        }, { threshold: 0.3 });
        _io.observe(_faq);
      }
    } catch (e) {}

    /* Named clicks on the internal answer<->essay funnel + share + ask. */
    document.addEventListener('click', function (ev) {
      try {
        var el = ev.target && ev.target.closest ? ev.target.closest('a,button') : null;
        if (!el || !el.closest) return;
        var href = (el.getAttribute && el.getAttribute('href')) || '';
        var cls = (el.className && el.className.toString) ? el.className.toString() : '';
        var oc = (el.getAttribute && el.getAttribute('onclick')) || '';
        var evt = null, props = { from: _p, content_type: _ct };
        if (el.closest('.art-shortanswer')) { evt = 'short_answer_click'; props.to = href; }
        else if (el.closest('.ad-more-qs')) { evt = 'related_answer_click'; props.to = href; }
        else if (el.closest('.ad-related')) { evt = 'go_deeper_click'; props.to = href; }
        else if (el.closest('.ba-inner')) { evt = 'home_browse_click'; props.to = href; }
        else if (/\bad-share\b/.test(cls)) { evt = 'share_click'; }
        else if (/\bhc-btn\b/.test(cls) || el.id === 'hcBtn') { evt = 'ask_click'; }
        else if (/handleSignup/.test(oc)) { evt = 'signup_submit'; }
        if (evt) window.adTrack(evt, props);
      } catch (x) {}
    }, true);
  } catch (e) {}

  /* ============================================================
     PWA: make the site installable + work offline.
     Injects the manifest/icons/theme tags (so we don't have to edit
     every page's <head>), registers the service worker, and offers a
     tasteful Install button only when the browser reports it's installable.
     ============================================================ */
  try {
    var head = document.head || document.getElementsByTagName('head')[0];
    function addOnce(sel, make) { if (head && !document.querySelector(sel)) head.appendChild(make()); }
    addOnce('link[rel="manifest"]', function () {
      var l = document.createElement('link'); l.rel = 'manifest'; l.href = '/manifest.json'; return l;
    });
    addOnce('link[rel="apple-touch-icon"]', function () {
      var l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = '/apple-touch-icon.png'; return l;
    });
    addOnce('meta[name="theme-color"]', function () {
      var m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#0a1628'; return m;
    });
    addOnce('meta[name="apple-mobile-web-app-capable"]', function () {
      var m = document.createElement('meta'); m.name = 'apple-mobile-web-app-capable'; m.content = 'yes'; return m;
    });
    addOnce('meta[name="apple-mobile-web-app-title"]', function () {
      var m = document.createElement('meta'); m.name = 'apple-mobile-web-app-title'; m.content = 'Apologia'; return m;
    });

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
      });
    }

    /* ---- engagement gate: don't nag first-time visitors ----
       Count visits once per session; consider someone "engaged" on their 2nd
       visit, or once they have any saved progress. Install/notify affordances
       only appear for engaged users (or after a long dwell this session). */
    try {
      if (!sessionStorage.getItem('ad_sess_counted')) {
        sessionStorage.setItem('ad_sess_counted', '1');
        var vc = (parseInt(localStorage.getItem('ad_visits') || '0', 10) || 0) + 1;
        localStorage.setItem('ad_visits', String(vc));
      }
    } catch (e) {}
    function adEngaged() {
      try {
        if ((parseInt(localStorage.getItem('ad_visits') || '0', 10) || 0) >= 2) return true;
        if (localStorage.getItem('ad_mastery') || localStorage.getItem('ad_streak')) return true;
      } catch (e) {}
      return false;
    }

    /* small shared pill-button factory (bottom-right stack) */
    function adPill(id, label, bottomPx, onClick) {
      if (document.getElementById(id)) return document.getElementById(id);
      var b = document.createElement('button');
      b.id = id; b.textContent = label;
      b.setAttribute('style',
        'position:fixed;right:14px;bottom:' + bottomPx + 'px;z-index:99999;' +
        'font:600 13px/1 "DM Sans",system-ui,sans-serif;background:#c8a951;color:#0a1628;' +
        'border:0;border-radius:999px;padding:11px 16px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35)');
      b.onclick = onClick;
      document.body.appendChild(b);
      return b;
    }

    /* Install prompt — Android/desktop Chrome. Stash the event always, but only
       surface the button for engaged users (or after 60s dwell this session). */
    var deferred = null, installShown = false;
    function showInstall() {
      if (installShown || !deferred) return;
      installShown = true;
      try { window.adTrack('pwa_install_offered', { where: location.pathname }); } catch (x) {}
      adPill('ad-install', '↓ Install app', 14, function () {
        if (!deferred) return;
        deferred.prompt();
        deferred.userChoice.then(function (c) {
          try { window.adTrack('pwa_install_choice', { outcome: c && c.outcome }); } catch (x) {}
          deferred = null;
          var el = document.getElementById('ad-install'); if (el) el.remove();
        });
      });
    }
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); deferred = e;
      try { window.adTrack('pwa_installable', { where: location.pathname }); } catch (x) {}
      if (adEngaged()) showInstall();
      else setTimeout(showInstall, 60000); // give first-timers time to look around
    });
    window.addEventListener('appinstalled', function () {
      try { window.adTrack('pwa_installed', {}); } catch (x) {}
    });

    /* ---- Push opt-in: "Daily reminder" bell, only for engaged users ----
       Asks permission only on explicit tap (never auto-prompts), subscribes via
       the VAPID public key, and registers the subscription server-side. */
    window.adEnablePush = async function () {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          alert('Notifications are not supported on this browser.'); return false;
        }
        var perm = await Notification.requestPermission();
        try { window.adTrack('push_permission', { outcome: perm }); } catch (x) {}
        if (perm !== 'granted') return false;
        var pub = await (await fetch('/api/push?do=public')).json();
        if (!pub || !pub.key) { alert('Daily reminders are not configured yet.'); return false; }
        var reg = await navigator.serviceWorker.ready;
        function b64ToU8(s) {
          var pad = '='.repeat((4 - s.length % 4) % 4);
          var b = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
          return Uint8Array.from(b, function (c) { return c.charCodeAt(0); });
        }
        var sub = await reg.pushManager.subscribe({
          userVisibleOnly: true, applicationServerKey: b64ToU8(pub.key)
        });
        await fetch('/api/push', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub)
        });
        try { window.adTrack('push_subscribed', {}); } catch (x) {}
        var el = document.getElementById('ad-notify'); if (el) el.textContent = '✓ Reminders on';
        return true;
      } catch (e) { return false; }
    };

    /* Turn daily reminders OFF: unsubscribe locally. The cron auto-prunes the
       now-dead endpoint (push service returns 410) on its next run. */
    window.adDisablePush = async function () {
      try {
        if (!('serviceWorker' in navigator)) return false;
        var reg = await navigator.serviceWorker.ready;
        var sub = reg.pushManager && (await reg.pushManager.getSubscription());
        if (sub) await sub.unsubscribe();
        try { window.adTrack('push_unsubscribed', {}); } catch (x) {}
        return true;
      } catch (e) { return false; }
    };

    /* Is this device currently subscribed to reminders? */
    window.adPushOn = async function () {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
        var reg = await navigator.serviceWorker.ready;
        return !!(reg.pushManager && (await reg.pushManager.getSubscription()));
      } catch (e) { return false; }
    };
    // offer the bell to engaged users who haven't enabled it yet
    try {
      if (adEngaged() && 'Notification' in window && Notification.permission === 'default') {
        var bottom = (deferred || !installShown) ? 60 : 14;
        adPill('ad-notify', '🔔 Daily reminder', bottom, function () { window.adEnablePush(); });
      }
    } catch (e) {}
  } catch (e) {}
})();
