# apologia-daily
Christian apologetics platform — Apologia Daily

## Analytics: excluding your own visits

The site uses Vercel Web Analytics (loaded on index, dashboard, ask-anything,
debate-arena, login, signup). Vercel does NOT record IP addresses, so you cannot
filter out your own visits after the fact. Instead, those pages load analytics
through a small loader that supports a per-browser opt-out:

- Visit `/?nocount=1` once on a device to STOP counting that browser
  (sets a localStorage flag `ad-nocount` so the analytics script never loads there).
- Visit `/?nocount=0` to clear the flag and resume counting.

Notes: the flag is per-browser / per-device (set it on your phone too), applies to
the whole site (localStorage is per-origin), only affects future visits, and is
cleared if you wipe browser data. Deploy by pushing to `main` (Vercel auto-deploys).