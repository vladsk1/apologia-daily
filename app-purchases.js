/* ============================================================
   Apologia Daily — in-app purchases (RevenueCat) — PLUMBING ONLY.

   Apple and Google require digital subscriptions sold inside a native app to
   go through Apple In-App Purchase / Google Play Billing (an external card
   processor like Stripe is grounds for rejection). RevenueCat wraps both
   behind one SDK and one "entitlement" check.

   ⚠ SAFETY — THIS FILE CANNOT CHARGE ANYONE AS SHIPPED. It is deliberately
   inert until a human completes BOTH of these:
     1. real API keys are set in app/revenuecat.json (see .example), and
     2. real products/prices are configured in App Store Connect + Play Console.
   Until then every call is a no-op that resolves to "not subscribed", and NO
   paywall anywhere on the site has been switched over to it. Prices are a
   human decision (see docs/APP_STORE.md) — never wire real prices or flip the
   paywall without explicit owner sign-off.

   USAGE (once configured):
     await ADPurchases.init();                  // safe to call on every page
     const pro = await ADPurchases.isPro();     // entitlement check
     const offerings = await ADPurchases.getOfferings();
     await ADPurchases.purchase(pkg);           // from an offering
     await ADPurchases.restore();               // REQUIRED by Apple for subs

   Web builds: window.Capacitor is absent, so this is a strict no-op and the
   existing website paywall logic is untouched.
   ============================================================ */
(function () {
  'use strict';

  var PLACEHOLDER = 'REPLACE_WITH_REVENUECAT_KEY';
  var DEFAULT_ENTITLEMENT = 'pro';   // RevenueCat entitlement identifier
  var cfg = null, ready = false, initPromise = null;

  /* The entitlement name is also declared in app/revenuecat.example.json. Read
     it from the config so the two cannot drift into checking different names
     (which would silently deny access to paying users). */
  function entitlement() {
    return (cfg && cfg.entitlement) || DEFAULT_ENTITLEMENT;
  }

  function inApp() {
    var c = window.Capacitor;
    return !!(c && (typeof c.isNativePlatform === 'function' ? c.isNativePlatform() : c.isNative));
  }

  function platform() {
    var c = window.Capacitor;
    try { return (c && typeof c.getPlatform === 'function') ? c.getPlatform() : 'web'; }
    catch (e) { return 'web'; }
  }

  /* Load keys from app/revenuecat.json (git-ignored; see the .example file).
     Absent or placeholder keys => purchases stay off. */
  function loadConfig() {
    if (cfg) return Promise.resolve(cfg);
    return fetch('/revenuecat.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (j) { cfg = j || {}; return cfg; });
  }

  /* Accept ONLY a public SDK key. RevenueCat's public keys are prefixed
     `appl_` (Apple) and `goog_` (Google); a SECRET key (`sk_...`) grants full
     account API access and must never ship in a binary that anyone can unzip.
     Positive-format matching (not just "isn't a placeholder") means a
     mis-pasted secret key leaves purchases OFF rather than leaking. */
  function keyFor(c) {
    var k = platform() === 'ios' ? c.iosApiKey : c.androidApiKey;
    if (!k || typeof k !== 'string') return null;
    if (k.indexOf(PLACEHOLDER) !== -1 || k.indexOf('REPLACE') !== -1) return null;
    if (!/^(appl_|goog_)/.test(k)) {
      try {
        console.error('[purchases] Ignoring RevenueCat key: expected a PUBLIC SDK key ' +
          '(appl_… / goog_…). Never put a secret key (sk_…) in revenuecat.json.');
      } catch (e) {}
      return null;
    }
    return k;
  }

  function plugin() {
    var p = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Purchases;
    return p || null;
  }

  var ADPurchases = {
    /** True only when running natively AND real keys are configured. */
    enabled: function () { return ready; },

    /** Idempotent; safe on every page. Resolves false when purchases are off. */
    init: function () {
      if (initPromise) return initPromise;
      initPromise = (function () {
        if (!inApp()) return Promise.resolve(false);
        return loadConfig().then(function (c) {
          var key = keyFor(c);
          var p = plugin();
          if (!key || !p) return false;               // not configured yet => inert
          return p.configure({ apiKey: key })
            .then(function () { ready = true; return true; })
            .catch(function () { return false; });
        });
      })();
      return initPromise;
    },

    /** Entitlement check. Resolves false (never throws) when purchases are off. */
    isPro: function () {
      return this.init().then(function (on) {
        if (!on) return false;
        return plugin().getCustomerInfo().then(function (res) {
          var info = (res && res.customerInfo) || res || {};
          var ent = info.entitlements && info.entitlements.active;
          return !!(ent && ent[entitlement()]);
        }).catch(function () { return false; });
      });
    },

    /** Available packages/prices, as configured in the stores. [] when off. */
    getOfferings: function () {
      return this.init().then(function (on) {
        if (!on) return [];
        return plugin().getOfferings().then(function (res) {
          var cur = res && res.current;
          return (cur && cur.availablePackages) || [];
        }).catch(function () { return []; });
      });
    },

    /** Purchase a package from getOfferings(). Rejects when purchases are off. */
    purchase: function (pkg) {
      return this.init().then(function (on) {
        if (!on) return Promise.reject(new Error('Purchases are not configured.'));
        return plugin().purchasePackage({ aPackage: pkg });
      });
    },

    /** Restore prior purchases — Apple REQUIRES a visible "Restore" control. */
    restore: function () {
      return this.init().then(function (on) {
        if (!on) return Promise.reject(new Error('Purchases are not configured.'));
        return plugin().restorePurchases();
      });
    },

    /** Link purchases to the signed-in Supabase user (call after login). */
    identify: function (userId) {
      return this.init().then(function (on) {
        if (!on || !userId) return false;
        return plugin().logIn({ appUserID: String(userId) })
          .then(function () { return true; }).catch(function () { return false; });
      });
    }
  };

  window.ADPurchases = ADPurchases;
})();
