# Shipping Apologia Daily to the App Store & Google Play

Status as of **2026-07-26**: the native app **scaffolding is built and committed**. What
remains is (a) two compliance blockers, (b) the store accounts, and (c) the build/submit
steps that must run on a Mac.

> **Read the blockers in §1 first.** Both will cause a rejection if skipped, and neither is
> something the scaffolding can fix on its own.

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

### 1a-0. ROTATE `METRICS_SECRET` — **do this now, independently of the app**

A code review of the app work found the production `METRICS_SECRET` hardcoded in
`monitor.html` (`'Apologia2026!'`), in two places: the metrics fetch and a client-side
"admin password" gate. `monitor.html` is **publicly served** (it is not blocked in
`vercel.json`), so the value has been readable by anyone who viewed source — and
`api/metrics.js` uses it to gate an endpoint that reads Supabase with the **service-role**
key. The app work would have widened this into downloadable store binaries.

**Fixed in code:** the secret is gone from `monitor.html` (the operator now types it at
sign-in; it is verified server-side and held in `sessionStorage`), and `monitor.html` /
`logs.html` / `admin.html` are excluded from the app bundle, with a test asserting the built
bundle contains no secrets or operator pages.

**Still required from you — the code fix cannot do this:**

1. Set a **new** `METRICS_SECRET` in the Vercel dashboard (the old value is in git history
   and has been publicly served; it must be treated as compromised).
2. Consider blocking `/monitor.html` at the edge — add a `vercel.json` redirect, or put it
   behind Vercel Access Protection. The server-side `requireSecret` gate is the real
   protection, but the page need not be public.
3. Review Supabase logs for unexpected `/api/metrics` usage.


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
  If Supabase auth is email-only, you can skip it — confirm which providers are enabled.
- **Demo account.** Give the reviewer working credentials in App Store Connect, or they cannot
  see anything behind auth. This is a frequent, avoidable rejection.

---

## 8. Release checklist

- [ ] **`METRICS_SECRET` rotated in Vercel** (§1a-0) ← the old value is compromised
- [x] In-app account deletion **built** (§1a) — still needs live end-to-end testing
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
