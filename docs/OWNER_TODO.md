# Owner to-do — things only you can do

One running list from the 2026-10-08 legal/security audit (items 1–10). Code changes are
already live; these are the steps that need your Supabase, Vercel or PostHog login, or
information only you have. Tick each one off (change `[ ]` to `[x]` and add the date).

## Status — 2026-10-09

**Done**
- ✅ 1 — Supabase security script (RLS hardening) run; owner-reported.
- ✅ 2 (part) — Age-screen SQL run; checks passed (`user_age` protected, `authenticated SELECT` only).
- ✅ 3 — Signup notifications checked: new-account trigger on INSERT; email-confirmed trigger on UPDATE, gated on `email_confirmed_at`.
- ✅ 4 / 4c — `RATE_SALT` and `UNSUB_SECRET` added in Vercel; redeployed.
- ✅ 4b (part) — `EMAIL_SENDER_NAME` added in Vercel.
- ✅ 5 — PostHog session replay switched off (it had been on; the site's code was already blocking it).
- ✅ 13 — DMCA agent: declined.

**Still to do**
- ⬜ 2 (rest) — Test signup with a throwaway email (check `age_band` = 18+, `still_in_profile` = false), then Study Groups on your own account: answer the age question, post a message.
- ⬜ 8 — Delete that test account from Dashboard → Account (first live test of account deletion).
- ⏳ 4b (rest) / 10 — `EMAIL_POSTAL_ADDRESS` once you have a PO box; redeploy after adding it.
- ⏳ 9 — Send me the legal/entity name (+ ABN if any) if you want it in the privacy policy.
- ⬜ 7 — Optional: delete old PostHog events whose URL contains `q=`.
- ⬜ 0 — Quick live-site check on a computer (homepage, sign-in, an essay, a video) — not yet confirmed.
- ⬜ 11 / 12 — Before Pro goes on sale: Stripe account + A$8/month product; free-trial decision.
- ⬜ (from today's content work) — To start the Cavin reply: allow `philarchive.org` + `webapp.uibk.ac.at` in the cloud environment's network settings, or upload his 2019 paper.

## First, a 2-minute check of the live site

- [ ] **0. Open apologiadaily.com on a computer** and check: the homepage loads, you can sign in
  (the "I'm human" check appears), an essay looks normal, and a video plays. The security policy
  and self-hosted fonts (audit item 10) were tested on a local copy, not production. If anything
  looks wrong, tell me what you saw.

## When you have Supabase access (Dashboard → SQL Editor)

- [x] **1. Run [`docs/SUPABASE_RLS_HARDENING.md`](SUPABASE_RLS_HARDENING.md)** (audit item 1). ✅ Done, owner-reported 2026-10-09 (optional Step 4 not confirmed).
  Run Step 1 first and keep its output, then Step 2, then the Step 3 checks. Step 4 (clear old
  Explain It Back text) is optional but recommended. Until this runs, `push_subscriptions`,
  `flashcards`, `study_plans_progress`, `explain_sessions` and `daily_arguments` are unverified.
- [~] **2. Run [`docs/AGE_SCREEN.md`](AGE_SCREEN.md)** (audit item 3). ✅ SQL run + table checks passed 2026-10-09; ⬜ still to do: the test signup + Study Groups test (its Step 2). Until it runs, the 18+ rule
  for Study Groups is only the old "press OK" box. Then do its Step 2 checks, including one
  test signup. The optional cleanup line removes any existing under-18 group memberships.
- [x] **3. Signup notification fires on INSERT only** — ✅ checked 2026-10-09. There is no dashboard "Webhook": the notices come from two custom triggers on `auth.users` — `on_auth_user_created` → `notify_new_signup()` on **INSERT** (correct), and `on_auth_user_confirmed` → `notify_email_confirmed()` on **UPDATE**, which is intended (the "email confirmed" notice) and whose function checks `email_confirmed_at`, so it does not fire on ordinary account updates such as sign-ins. (Plus `trg_copy_signup_age` on INSERT from the age screen.)

You can run 1 and 2 in the same sitting, in that order.

## When you have Vercel access (Project → Settings → Environment Variables)

- [x] **4. Add `RATE_SALT`** ✅ added 2026-10-09 (Production). = any long random string (e.g. 40+ characters from a password
  manager), for Production. It scrambles IP addresses for the rate limits; without it the code
  falls back to another secret, which works but isn't ideal.
- [~] **4b. Add `EMAIL_POSTAL_ADDRESS`** — `EMAIL_SENDER_NAME` ✅ added 2026-10-09; ⏳ `EMAIL_POSTAL_ADDRESS` waits on a PO box (item 10). = your postal address on one line (a PO box is fine),
  and **`EMAIL_SENDER_NAME`** = the legal name (see 9). Both go in the footer of the weekly
  summary and group-reminder emails, which anti-spam law requires (audit item 5). Until it is
  set, those emails go out without an address.
- [x] **4c. Add `UNSUB_SECRET`** ✅ added 2026-10-09 (Production). = another long random string. Unsubscribe links are then signed
  with it instead of `CRON_SECRET`, so rotating `CRON_SECRET` later won't break them. Links
  already sent keep working either way.

Redeploy once after adding these (Deployments → ⋯ → Redeploy).

## When you have PostHog access (eu.posthog.com)

- [x] **5. Settings → Session replay:** ✅ 2026-10-09 — it was ON in PostHog ("Record user sessions" + "Capture console logs"); owner switched recording OFF (console-log capture is then locked, as it depends on recording). The site's code had already forced replay off, so nothing was recorded. (The code forces it off anyway.)
- [ ] **6. Expect fewer PostHog events from now on.** PostHog only runs for visitors who click
  "Allow analytics" (audit item 4). Vercel Analytics still counts every page view. Not a bug.
- [ ] **7. Optional:** delete old events whose URL contains `?q=` (before 2026-10-08 a typed
  question could appear in the page address). Data management → filter `$current_url`
  contains `q=`.

## With a computer and a throwaway email address

- [ ] **8. Test signup → Study Groups → delete account** with a throwaway account (after 1 and
  2 above). Account deletion has never been run against the live database.

## Before Pro goes on sale (audit item 6; decided 2026-10-08: AUD, monthly only)

You:
- [ ] **11. Create a Stripe account** (stripe.com, Australian business) and a product "Apologia
  Daily Pro" with one price: **A$8 / month, recurring**. Turn on the **Customer Portal**
  (Settings → Billing → Customer portal: allow cancel, update card, view invoices) and
  **email receipts** (Settings → Emails → successful payments + refunds).
- [ ] **12. Decide, later:** free trial (none / 7 days / other) and which features stay free.

Me, once 11 is done (the new terms already promise these, so they must exist on launch day):
- Stripe Checkout button on the pricing card, with the terms line next to it (already there).
- A webhook that marks the account as Pro, replacing the hardcoded `isPro = true`.
- A "Manage or cancel subscription" button in Dashboard → Account (Stripe Customer Portal).
- The in-app path: Apple/Google purchases through RevenueCat (no Stripe inside the app).

## Optional

- [x] ~~**13. Register a US DMCA agent**~~ — **declined by the owner 2026-10-09.** The terms' own copyright-complaints process stands without it. (audit item 9). Only matters for US "safe harbour" if a
  user posts infringing material in a study group. About US$6 every 3 years at
  dmca.copyright.gov (needs the legal name, 9, and a postal address, 10). The terms already
  carry a copyright-complaints process (`terms.html#copyright-complaints`) that works without
  it; once registered, tell me and I'll name the agent there.

## Information I need from you

- [ ] **9. Legal entity name** for the privacy policy: your name as a sole trader, or a business
  name (with ABN if you have one).
- [ ] **10. Postal address**: you can set it yourself as `EMAIL_POSTAL_ADDRESS` (4b), or send it
  to me and I'll put it in the privacy policy's contact section too.

---
*Audit items 1–10: all code changes are live (2026-10-08). Everything left on this list needs you.*
