# Shipping Apologia Daily to the App Store & Google Play

Status as of **2026-07-26**: the native app **scaffolding is built and committed**. What
remains is (a) two compliance blockers, (b) the store accounts, and (c) the build/submit
steps that must run on a Mac.

> **Read the blockers in §1 first.** Both will cause a rejection if skipped, and neither is
> something the scaffolding can fix on its own.
>
> ### ⚠ RE-AUDITED 2026-08-11 — READ §1.5 BEFORE §1.
>
> A verification pass re-checked every claim in this file against the live tree and found
> **six blockers this document did not know about**, two of them rejection-grade and one on a
> **hard 20-day external deadline**. §1.5 has them. It also *cleared* one blocker: Sign in
> with Apple is **not** required. **Owner decision (2026-08-11): the app work starts once
> Stripe is set up**, so nothing in §1.5 has been fixed yet — it is a queue, not a report.

---

## 1.5. BLOCKERS FOUND 2026-08-11 (none of these are fixed)

Verified by reading the tree, not by trusting §0–§9. The suite passes **111/111** and
`npm run build:app` produces **374** files (§0 says 372 — the allowlist is extension-based,
so pages added since July ship automatically; that part is healthy).

### 🔴 1.5a — Android `targetSdk` is 34; Google Play requires **36** from **2026-08-31**

`android/variables.gradle:3` sets `targetSdkVersion = 34`. From **August 31, 2026** new apps
and updates must target **Android 16 (API 36)**. Target SDK is tied to the Capacitor major
version, so this is not a one-line bump — it means **upgrading Capacitor 6 → 8** (Cap 8:
`minSdk 24`, `compileSdk`/`targetSdk 36`, **Node 22+**, and Swift Package Manager as the iOS
default, which changes the iOS build steps in §3). An extension to **Nov 1, 2026** can be
requested in Play Console; take it if Stripe/pricing slips past the deadline.

⚠ The upgrade **cannot be compile-verified from the Linux session** — Android needs a Gradle
build, iOS needs the iMac. Plan to do it in a session with a machine that can build.

### 🔴 1.5b — the captcha will lock the App Review team out of the app

`login.html:104` and `signup.html:104` render a Cloudflare Turnstile widget
(sitekey `0x4AAAAAAD41xNE9t5rbRuaA`). **Inside the app the page origin is `https://localhost`**,
and Turnstile validates the hostname against the widget's allowed-domain list. If `localhost`
is not on that list, **sign-in and sign-up both fail in the app** — for every user, and for
the reviewer, which is a reliable rejection ("we were unable to log in").

Fix either way (both are cheap): add `localhost` to the widget's allowed hostnames in the
Cloudflare dashboard, **or** skip the captcha when `window.__AD_IN_APP` is true (that flag is
already set by the shim at the top of `analytics.js`). ⚠ Skipping the captcha in-app removes a
real anti-abuse control from a build anyone can unpack — prefer the allowed-hostname route.
**Test it on a device before submitting; this cannot be verified from the browser.**

### 🟠 1.5c — password-reset emails contain a dead link in-app

`login.html:207` builds the redirect as `window.location.origin + '/update-password.html'`.
In the app that resolves to **`https://localhost/update-password.html`** — a link that cannot
open. Fix: use the production origin when `window.__AD_IN_APP`.

Related, lower severity: `signup.html:168` sets no `emailRedirectTo`, so confirmation falls
back to the Supabase Site URL and opens the **website in a browser** rather than the app. That
works, but it is a clunky first run and there are no deep links / associated domains
configured. **Give the reviewer a pre-confirmed demo account** so they never hit it (§7).

### 🟠 1.5d — push is a shipped dependency wired to nothing

`@capacitor/push-notifications` is in `package.json` and configured in `capacitor.config.json`,
but: **no client code calls the plugin** (nothing references `PushNotifications`), there is no
`google-services.json` — `android/app/build.gradle:53` literally logs *"google-services.json
not found … Push Notifications won't work"* — and there is **no iOS push entitlement**. The
site's real push is **web push via a service worker** (`analytics.js:405–460`), which does not
run inside a Capacitor webview.

So push is dead in the app whichever way you go. **This is a decision, not a fix:**
- **Strip from v1 (recommended)** — drop the plugin + config from the app build. Web push on
  the website is untouched. Removes APNs certificates, Firebase setup and a schema change from
  the critical path.
- **Wire it natively** — APNs + `google-services.json` + registration code + a **native-token
  store**, since `push_subscriptions` is keyed by web `endpoint` and has no `user_id` (the same
  column gap already logged against account deletion in §1a).

### 🟠 1.5e — no `PrivacyInfo.xcprivacy`

`ios/App` carries no privacy manifest. Apple has required one since May 2024 (data collection
+ required-reason API declarations). Expect upload warnings and possible rejection without it.

### 🟠 1.5f — the paywall is further from ready than §1b implies

**176 pages** hardcode `var isPro = true`, `app-purchases.js` is referenced by **zero** HTML
pages, and **`video-library.html:720` still advertises a live "Unlock Pro — $8/mo" button**
pointing at `index.html#pricing` for a price nothing can charge. `ev-s1.mk.html` already
neutralized this exact copy to "launching soon" — do the same here.

⚠ **This is the item Stripe intersects, and the intersection is a rejection risk:** Apple
forbids selling a digital subscription through Stripe *inside the app* (Guideline 3.1.1). If
Stripe becomes the web checkout, the app build must either ship the IAP path (RevenueCat, §5)
or ship with no purchase path at all — never a button that routes to Stripe.

### ✅ CLEARED — Sign in with Apple is **not** required

§7 left this open pending a check of which providers are enabled. Verified: auth is
**email + password only** (`login.html:174` `signInWithPassword`, `signup.html:168` `signUp`;
no `signInWithOAuth` anywhere). Sign in with Apple is only mandatory alongside third-party
social login. **One less blocker.**

---

## 0. What has been built (and how it works)

The website is a static site on Vercel. The app wraps the **same client assets** with
[Capacitor](https://capacitorjs.com), which produces a real Xcode project and a real Android
Studio project.

| Piece | Where | Notes |
|---|---|---|
| Capacitor config | `capacitor.config.json` | appId `com.apologiadaily.app`, brand navy `#0a1628` |
| Web bundle builder | `tools/build-app-bundle.mjs` | assembles `app/www` (372 files) |
| Icon/splash source art | `tools/build-app-icons.mjs` | writes `app/assets/*`, then `@capacitor/assets` fans out 113 sizes |
| iOS project | `ios/` | committed; needs a Mac to build |
| Android project | `android/` | committed; buildable anywhere |
| Purchases wrapper | `app-purchases.js` | RevenueCat; **inert until keys are set** |
| Purchase keys | `app/revenuecat.example.json` | copy to `revenuecat.json` at repo root (git-ignored) |

**Architecture decision — the app is not a remote-URL webview.** The client HTML/CSS/JS ships
*inside* the binary, so the app opens and reads offline. Only dynamic calls go to the network:
the `/api/*` serverless functions stay on Vercel, and Supabase is called directly. A shim at the
top of `analytics.js` rewrites relative `/api/*` calls to `https://apologiadaily.com/api/*` when
running natively (it is a strict no-op on the web, so the website is unaffected). This matters
for review: a thin wrapper around a URL is rejected under Guideline 4.2.

**Rebuild after any site change:**

```bash
npm install          # first time only
npm run sync         # rebuilds app/www AND copies it into ios/ + android/
```

---

## 1. BLOCKERS — do these before submitting

### 1a-0. The `monitor.html` secret — RESOLVED, no action needed

**A note kept for the record, because an earlier version of this file told you to rotate a key
urgently. That instruction was wrong and is withdrawn.**

`monitor.html` (which is publicly served) hardcoded `'Apologia2026!'` as the metrics secret. The
first review rated this CRITICAL. On checking the Vercel dashboard, **`METRICS_SECRET` had never
been set** — and `lib/require-secret.js` fails closed, so `/api/metrics` denied *everyone*,
including anyone who read that value out of the page source. **No data was ever reachable through
it, and there is nothing to rotate.**

The correct severity was *latent*: it would have become a real hole the moment anyone set that
variable to that value, and it would have been baked permanently into store binaries, which cannot
be un-published. So the fix still stands:

- the secret is gone from source (the operator types it at sign-in; verified server-side, kept in
  `sessionStorage`),
- `monitor.html` / `logs.html` / `admin.html` are excluded from the app bundle, and
- `tests/app-bridge.test.mjs` scans the **built** bundle for secrets and operator pages.

**Process lesson:** check whether an env var actually exists before rating a hardcoded secret.
A fail-closed gate with no configured secret is a locked door, not an open one.

### 1a. In-app account deletion (Apple Guideline 5.1.1(v)) — **BUILT ✅, needs live testing**

Apple requires that **any app supporting account creation must let the user delete the account
from inside the app**. A "email us to delete" link is explicitly *not* sufficient, and this is a
common, reliable rejection. Google Play requires the same.

**What was built:**

- **`lib/verify-user.js`** — resolves the caller from their own Supabase access token
  (GoTrue `/auth/v1/user`, so revoked sessions are rejected). Returns `null` on *every* failure
  mode — missing/malformed/expired token, network error — and callers must treat that as a reject.
- **`lib/delete-account.js`** — deletes the user's rows across all user-scoped tables, then the
  auth user **last** — and **aborts entirely if any table delete failed**, so a mid-way failure
  can never destroy the login while rows survive (orphaned data the user could no longer reach).
  Fails closed with no service-role key: it deletes *nothing* rather than half-deleting. A
  PostgREST error is only tolerated when it means "no such table" (`42P01`/`PGRST205`/`PGRST106`);
  a wrong *column* (`42703`) is a failure, never a silent skip that would report a false success.
- **`api/new-signup.js?do=delete-account`** — the HTTP route. Folded into this existing endpoint
  because **Vercel Hobby caps the project at 12 serverless functions and we are at the cap**
  (the same reason `push.js` and `weekly-email.js` route by `?do=`). It is the other end of the
  account lifecycle this file already handles. The user id comes **only** from the verified
  token; a body-supplied id is ignored. Requires a typed `confirm: "DELETE"` and is rate limited.
- **`dashboard.html`** — an "Account" section with a confirmation modal that requires typing
  `DELETE`. It clears local state and signs out afterwards, and never reports success unless the
  server confirmed it.
- **`privacy.html`** — now documents the self-service path.
- **`tests/delete-account.test.mjs`** — asserts the security invariants: identity only from a
  verified token, fail-closed on misconfiguration, the auth delete **skipped** when any table
  failed, a wrong column never mistaken for an absent table, a non-UUID id refused before any
  delete is issued, `Authorization` present in the CORS allow-list (without it the app cannot
  call this at all), and the delete route never falling through to the shared-secret webhook path.

**Before submitting, verify on a real deploy** (this could not be exercised against live
Supabase from the build environment):

1. Create a throwaway account, add some progress/flashcards, then delete it from the Dashboard.
2. Confirm in Supabase that the auth user **and** its rows are gone.
3. Confirm the old session cannot be reused and that signing up again with the same email works.
4. **Set BOTH env vars in Vercel** — `SUPABASE_SERVICE_ROLE_KEY` (to delete the rows) and
   **`SUPABASE_ANON_KEY`** (to verify the caller's token). `SUPABASE_ANON_KEY` is **new to this
   repo**: without it every deletion fails closed with a 503 and a server log, rather than
   pretending to delete. The anon key is the public one already embedded in the site's HTML.

**Known limit — `push_subscriptions`:** that table is keyed by `endpoint` with **no `user_id`**,
so the server cannot remove a user's rows by id. The client unsubscribes this device before
calling, and the cron prunes dead endpoints (410) on its next run — but a subscription made on a
*different* device will linger until it expires. If you want this airtight, add a `user_id`
column to `push_subscriptions` and delete by it in `lib/delete-account.js`.

### 1b. Payments — pricing is undecided and the paywall is still a stub

You chose **RevenueCat**, and the plumbing is in `app-purchases.js`. But two things are still
open, and both are human decisions:

- **Prices are not set.** `CLAUDE.md` notes the site advertises a dead "$8/mo + 7-day trial"
  while `isPro` is hardcoded `true` across the mastery pages. Decide the real price/packaging
  before creating store products.
- **Nothing is wired to the paywall yet — deliberately.** `app-purchases.js` resolves to "not
  subscribed" and no page consumes it. Flipping ~100 gated pages onto a live entitlement is a
  product change that needs your explicit sign-off; it was not done silently.

Apple takes **15–30%** of subscription revenue (15% under the Small Business Program, which you
should apply for). Selling a digital subscription through Stripe *inside the app* is a rejection.

---

## 2. Accounts and costs

| What | Cost | Needed for |
|---|---|---|
| Apple Developer Program | **$99/year** | any App Store submission (and TestFlight) |
| Google Play Developer | **$25 one-time** | Play submission |
| RevenueCat | free under ~$2.5k/mo tracked revenue | subscriptions |

Apple enrollment can take a few days (and may ask for a D-U-N-S number if you enroll as an
organization — enrolling as an **individual** is faster). Google now also requires most new
personal developer accounts to run a **closed test with 12+ testers for 14 days** before
production access — start that early, it is the longest pole for Play.

---

## 3. iOS — on your iMac

Your iMac is what makes iOS possible; none of this can run in the Linux cloud session.

**Check first:** Xcode 15+ requires macOS Sonoma or later, which supports iMacs from roughly
2017 on. `Apple menu → About This Mac`. If the iMac is older than that, it can still run an
older Xcode, but App Store Connect enforces a minimum SDK — verify before relying on it.

```bash
# 1. Install Xcode from the Mac App Store (large — do this ahead of time), then:
sudo xcode-select --install                      # command line tools
sudo gem install cocoapods                       # or: brew install cocoapods

# 2. Get the repo and build the web bundle
git clone <this repo> && cd apologia-daily
npm install
npm run build:app

# 3. Install the iOS native dependencies (this step was SKIPPED in the cloud session —
#    CocoaPods cannot run on Linux, so it must happen here)
npx cap sync ios

# 4. Open Xcode
npx cap open ios
```

In Xcode:
1. Select the **App** target → **Signing & Capabilities** → check *Automatically manage
   signing* → pick your Team. The bundle identifier is `com.apologiadaily.app`.
2. Add the **Push Notifications** capability (the app ships `@capacitor/push-notifications`).
   Skip this only if you strip push from v1.
3. Set **Version** `1.0` and **Build** `1`.
4. Run on the simulator, then on your own iPhone, and click through: sign in, the AI features
   (confirm the `/api` shim works over the network), offline open, and deep pages.
5. **Product → Archive** → *Distribute App* → *App Store Connect*.

Then in App Store Connect: create the app record, upload screenshots, fill the privacy
questionnaire, attach the build, and submit.

---

## 4. Android

The Android project is complete and committed. It builds on the iMac too (or any machine with
Android Studio) — no Mac requirement.

```bash
npm run build:app
npx cap sync android
npx cap open android     # opens Android Studio
```

Then: **Build → Generate Signed App Bundle** → create an upload keystore → produce an `.aab`.

> **Guard the keystore.** Losing it means you can never update the app under the same listing.
> Back it up somewhere durable; it is git-ignored on purpose (`*.keystore`).

Set `versionCode`/`versionName` in `android/app/build.gradle` (currently `1` / `"1.0"`) — Play
rejects an upload whose `versionCode` is not higher than the last.

---

## 5. RevenueCat + in-app purchases

1. Create the RevenueCat project; add both an iOS and an Android app.
2. Create the subscription products in **App Store Connect** and **Play Console** using matching
   IDs (suggested: `apologia_pro_monthly`, `apologia_pro_annual`).
3. In RevenueCat, attach those products to an entitlement named **`pro`** (this is what
   `app-purchases.js` checks) and put them in an Offering.
4. Copy `app/revenuecat.example.json` → `revenuecat.json` **at the repo root**, and paste the
   two **public SDK keys**. Never put a RevenueCat *secret* key in that file — it ships in the
   binary. The file is git-ignored.
5. Call `ADPurchases.identify(supabaseUserId)` after login so entitlements follow the account
   across devices.
6. Apple requires a visible **"Restore Purchases"** control — `ADPurchases.restore()` exists for
   it, but the UI still needs to be added wherever the paywall lands.

Test with a StoreKit sandbox account (iOS) and a Play licence tester (Android) before shipping.

---

## 6. Store listing assets you will need to produce

- **Screenshots** — iPhone 6.7" and 6.5"; Android phone. (Take them from the simulator/emulator.)
- **Description, keywords, support URL, marketing URL.**
- **Privacy policy URL** → `https://apologiadaily.com/privacy` ✅ exists.
- **Apple privacy questionnaire / Play Data Safety form.** Be accurate: the app collects an
  email (Supabase auth), product analytics (PostHog — note `analytics.js` sends an id, not the
  email), and sends user-typed questions to Anthropic's API for the AI features. `privacy.html`
  already describes this; keep the forms consistent with it.
- **Age rating.** Content is religious/educational, no objectionable material; `privacy.html`
  states the service is not directed to under-13s, so answer the children's-category questions
  accordingly.

---

## 7. Review-risk notes specific to this app

- **Guideline 4.2 (minimum functionality).** The mitigation is already in place — the content
  ships in the bundle and works offline, and the app has genuine native-flavoured features
  (daily loop, spaced-repetition flashcards, push, offline reading). In the review notes, say
  plainly that it is an offline-capable study app, not a website shortcut.
- **Guideline 4.3 (spam).** Fine here — this is a substantial original library, not a template.
- **Religious content.** Permitted. Apple's line is that content must not be demeaning toward a
  group. The site's standing guardrails (1 Peter 3:15 tone; charity toward Judaism, Islam, JW,
  Mormonism, atheism; "charity is accuracy") already aim well inside that line — the Islam and
  worldview pages are the ones a reviewer is most likely to sample, and they are the most
  heavily gated content on the site.
- **Sign in with Apple.** Required *only if* you offer third-party social login (Google/Facebook).
  ✅ **Confirmed 2026-08-11: auth is email+password only, so this is not required** (§1.5).
  Re-check if a social provider is ever added.
- **Demo account.** Give the reviewer working credentials in App Store Connect, or they cannot
  see anything behind auth. This is a frequent, avoidable rejection.

---

## 8. Release checklist

- [x] `monitor.html` secret removed (§1a-0) — nothing to rotate; it was never configured
- [x] `SUPABASE_ANON_KEY` set in Vercel — **required** for account deletion
- [x] In-app account deletion **built** (§1a) — still needs live end-to-end testing
- [x] Sign in with Apple confirmed **not required** — email+password only (§1.5)
- [ ] **Android `targetSdk` 36 / Capacitor 8 upgrade — hard Play deadline 2026-08-31** (§1.5a)
- [ ] **Turnstile verified working in the app** — or captcha skipped in-app (§1.5b)
- [ ] Password-reset redirect fixed for the app origin (§1.5c)
- [ ] Push stripped from v1, **or** wired natively with a token store (§1.5d)
- [ ] `PrivacyInfo.xcprivacy` added to `ios/App` (§1.5e)
- [ ] Dead "$8/mo" button neutralized; no Stripe purchase path inside the app (§1.5f)
- [ ] Account deletion verified against live Supabase (throwaway account, rows gone)
- [ ] Pricing decided; store products created; paywall wired to the `pro` entitlement (§1b)
- [ ] Apple Developer + Google Play accounts active
- [ ] `npm run sync` run after the final site change
- [ ] Tested on a real iPhone and a real Android device (not just simulators)
- [ ] AI features verified **inside the app** (confirms the `/api` origin shim)
- [ ] Restore Purchases control visible
- [ ] Privacy questionnaire / Data Safety form completed and consistent with `privacy.html`
- [ ] Reviewer demo account provided
- [ ] Keystore backed up somewhere you will still have in two years

---

## 9. Keeping the app in sync with the site

The app bundles a **snapshot** of the site, so content changes do not reach installed apps until
you ship an update. Text/essay updates therefore need a new build and a store review (~1 day on
iOS, usually faster on Play).

If that cadence becomes painful, the options are: (a) move the frequently-changing surfaces to
fetch from the live site at runtime, or (b) add Capacitor Live Updates. Do not switch the app to
loading the whole site from a remote URL — that reintroduces the 4.2 rejection risk that the
bundled-assets approach exists to avoid.
