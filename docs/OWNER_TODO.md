# Owner to-do — things only you can do

One running list from the 2026-10-08 legal/security audit (items 1–10). Code changes are
already live; these are the steps that need your Supabase, Vercel or PostHog login, or
information only you have. Tick each one off (change `[ ]` to `[x]` and add the date).

## When you have Supabase access (Dashboard → SQL Editor)

- [ ] **1. Run [`docs/SUPABASE_RLS_HARDENING.md`](SUPABASE_RLS_HARDENING.md)** (audit item 1).
  Run Step 1 first and keep its output, then Step 2, then the Step 3 checks. Step 4 (clear old
  Explain It Back text) is optional but recommended. Until this runs, `push_subscriptions`,
  `flashcards`, `study_plans_progress`, `explain_sessions` and `daily_arguments` are unverified.
- [ ] **2. Run [`docs/AGE_SCREEN.md`](AGE_SCREEN.md)** (audit item 3). Until it runs, the 18+ rule
  for Study Groups is only the old "press OK" box. Then do its Step 2 checks, including one
  test signup. The optional cleanup line removes any existing under-18 group memberships.
- [ ] **3. Database → Webhooks:** check that the `auth.users` signup webhook fires on **INSERT
  only**. (An UPDATE hook is ignored by the code now, but it shouldn't be there.)

You can run 1 and 2 in the same sitting, in that order.

## When you have Vercel access (Project → Settings → Environment Variables)

- [ ] **4. Add `RATE_SALT`** = any long random string (e.g. 40+ characters from a password
  manager), for Production. It scrambles IP addresses for the rate limits; without it the code
  falls back to another secret, which works but isn't ideal.
- [ ] **4b. Add `EMAIL_POSTAL_ADDRESS`** = your postal address on one line (a PO box is fine),
  and **`EMAIL_SENDER_NAME`** = the legal name (see 9). Both go in the footer of the weekly
  summary and group-reminder emails, which anti-spam law requires (audit item 5). Until it is
  set, those emails go out without an address.
- [ ] **4c. Add `UNSUB_SECRET`** = another long random string. Unsubscribe links are then signed
  with it instead of `CRON_SECRET`, so rotating `CRON_SECRET` later won't break them. Links
  already sent keep working either way.

Redeploy once after adding these (Deployments → ⋯ → Redeploy).

## When you have PostHog access (eu.posthog.com)

- [ ] **5. Settings → Session replay:** confirm it is off. (The code forces it off anyway.)
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

## Information I need from you

- [ ] **9. Legal entity name** for the privacy policy: your name as a sole trader, or a business
  name (with ABN if you have one).
- [ ] **10. Postal address**: you can set it yourself as `EMAIL_POSTAL_ADDRESS` (4b), or send it
  to me and I'll put it in the privacy policy's contact section too.

---
*New items are added here as the audit continues (items 5–10).*
