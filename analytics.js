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
})();
