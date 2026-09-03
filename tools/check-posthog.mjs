#!/usr/bin/env node
/*
 * check-posthog.mjs — is analytics actually reaching PostHog in production?
 *
 * WHY THIS EXISTS
 *   PostHog was showing ~2 visitors while Vercel Web Analytics showed ~100 for
 *   the same window. Vercel Analytics is served first-party from our own domain
 *   (never blocked); PostHog loads from eu.i.posthog.com and can be silently
 *   dropped by ad/tracker blockers, a wrong-region key, a CSP that forgot to
 *   allow it, or a deploy that shipped a stale analytics.js. This script checks
 *   every one of those from the OUTSIDE, against the LIVE site — so it must be
 *   run from a machine with real internet (a local session), NOT the cloud
 *   sandbox, whose egress policy blocks apologiadaily.com and *.posthog.com.
 *
 * WHAT IT CHECKS (each prints PASS / FAIL / WARN with the reason)
 *   1. Local  analytics.js parses and PostHog is switched ON (real key, not the
 *      REPLACE placeholder).
 *   2. Live   https://apologiadaily.com/analytics.js is reachable and its key +
 *      host + capture settings MATCH the repo (catches "deployed an old build").
 *   3. Region key is valid for its host: POST {host}/decide → 200 means the key
 *      works on that region; 401/403 means a US/EU mismatch or a dead key (this
 *      is the classic "everything silently rejected" bug).
 *   4. Live homepage actually references /analytics.js AND its Content-Security-
 *      Policy header allows *.posthog.com in BOTH script-src and connect-src
 *      (a missing connect-src is the subtle one: the script loads, the events
 *      never send).
 *   5. PostHog's static/array.js CDN is reachable from here.
 *   Optional --send fires ONE real event (event: "diagnostic_ping") so you can
 *   confirm end-to-end delivery by watching PostHog → Activity. Off by default
 *   so a health check never pollutes product data.
 *
 * IMPORTANT — the honest limit: this proves the PIPES are open (key valid, CSP
 *   correct, endpoints reachable, deploy fresh). It CANNOT reproduce YOUR
 *   browser's ad-blocker — headless/Node has no extensions. If every check here
 *   PASSES but your dashboard is still low, the loss is client-side blockers
 *   (fix: reverse-proxy PostHog through our own domain) OR you are reading the
 *   wrong dashboard panel (PostHog "Persons"/identified-only vs "Web Analytics"
 *   total visitors). Both are called out in the final summary.
 *
 * USAGE
 *   node tools/check-posthog.mjs                 # check the live site (default)
 *   node tools/check-posthog.mjs --send          # also fire one diagnostic_ping event
 *   node tools/check-posthog.mjs --site https://apologiadaily.com
 * Exit code 0 = pipes are open; 1 = at least one blocking check FAILED.
 * Needs Node 18+ (global fetch). No dependencies, no repo state changed.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');

const args = process.argv.slice(2);
const SEND = args.includes('--send');
const siteIdx = args.indexOf('--site');
const SITE = (siteIdx !== -1 && args[siteIdx + 1] ? args[siteIdx + 1] : 'https://apologiadaily.com').replace(/\/+$/, '');

const results = [];
const record = (status, label, detail) => {
  results.push({ status, label, detail });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️ ' : '❌';
  console.log(`${icon} ${status.padEnd(4)} ${label}`);
  if (detail) console.log(`        ${String(detail).replace(/\n/g, '\n        ')}`);
};

// Pull POSTHOG_KEY / POSTHOG_HOST / capture flags out of an analytics.js body.
function parseAnalytics(js) {
  const key = (js.match(/POSTHOG_KEY\s*=\s*'([^']+)'/) || [])[1] || null;
  const host = (js.match(/POSTHOG_HOST\s*=\s*'([^']+)'/) || [])[1] || null;
  const capturePageview = /capture_pageview:\s*true/.test(js);
  const autocapture = /autocapture:\s*true/.test(js);
  const referencesKey = key && key.indexOf('REPLACE') === -1;
  return { key, host, capturePageview, autocapture, on: !!referencesKey };
}

async function timedFetch(url, opts = {}, ms = 15000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctl.signal, redirect: 'follow' });
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  console.log(`\n  PostHog delivery check → ${SITE}\n  ${'─'.repeat(52)}`);

  // ---- 1. Local analytics.js ------------------------------------------------
  let local;
  try {
    local = parseAnalytics(readFileSync(join(REPO, 'analytics.js'), 'utf8'));
    if (!local.on) {
      record('FAIL', 'Local analytics.js has PostHog OFF (placeholder key)',
        'POSTHOG_KEY is still the REPLACE placeholder — no events would ever send.');
    } else {
      record('PASS', 'Local analytics.js: PostHog ON',
        `key ${local.key.slice(0, 8)}…  host ${local.host}  ` +
        `pageview=${local.capturePageview} autocapture=${local.autocapture}`);
    }
  } catch (e) {
    record('FAIL', 'Could not read repo analytics.js', e.message);
    return finish();
  }

  // ---- 2. Live analytics.js matches the repo --------------------------------
  let live = null;
  try {
    const r = await timedFetch(`${SITE}/analytics.js`);
    if (!r.ok) {
      record('FAIL', `Live /analytics.js returned HTTP ${r.status}`,
        'The deployed site is not serving analytics.js — analytics cannot run.');
    } else {
      live = parseAnalytics(await r.text());
      const drift = [];
      if (live.key !== local.key) drift.push(`key: live ${live.key ? live.key.slice(0, 8) + '…' : 'none'} vs repo ${local.key.slice(0, 8)}…`);
      if (live.host !== local.host) drift.push(`host: live ${live.host} vs repo ${local.host}`);
      if (!live.on) drift.push('live build has PostHog OFF (placeholder key)');
      if (drift.length) {
        record('FAIL', 'Live analytics.js does NOT match the repo (stale deploy)', drift.join('\n'));
      } else {
        record('PASS', 'Live analytics.js matches the repo', `key ${live.key.slice(0, 8)}…  host ${live.host}`);
      }
    }
  } catch (e) {
    record('FAIL', 'Could not reach the live site',
      `${e.message}\n(If this is the cloud sandbox, egress is blocked — run this from a LOCAL session.)`);
  }

  const eff = live && live.on ? live : local; // check the live config where we have it

  // ---- 3. Region / key validity ---------------------------------------------
  if (eff.on && eff.host) {
    try {
      const r = await timedFetch(`${eff.host.replace(/\/+$/, '')}/decide/?v=3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: eff.key, distinct_id: 'posthog-healthcheck' }),
      });
      const other = eff.host.includes('eu.') ? eff.host.replace('eu.', 'us.') : eff.host.replace('us.', 'eu.');
      if (r.ok) {
        record('PASS', `Key is valid for its region (${eff.host})`, `POST /decide → HTTP ${r.status}`);
      } else if (r.status === 401) {
        // PostHog itself returns 401 for a token that does not belong to this region.
        record('FAIL', `Key REJECTED by ${eff.host} (HTTP 401)`,
          `The project key does not belong to this region/host — the project most likely lives on the OTHER region.\n` +
          `Switch POSTHOG_HOST to: ${other}  (confirm in PostHog: the app URL shows eu. or us.)`);
      } else if (r.status === 403) {
        // 403 is almost always a proxy / WAF in front, NOT a PostHog auth error.
        record('WARN', `/decide returned HTTP 403 (likely a network proxy, not PostHog)`,
          'A corporate/VPN/sandbox proxy is probably intercepting the request. Re-run on a normal connection to get a real key verdict.');
      } else {
        record('WARN', `/decide returned HTTP ${r.status}`, 'Unexpected — inspect manually; key may still be fine.');
      }
    } catch (e) {
      record('WARN', 'Could not reach the PostHog /decide endpoint', e.message);
    }
  }

  // ---- 4. Homepage references analytics.js + CSP allows PostHog --------------
  try {
    const r = await timedFetch(`${SITE}/`);
    const html = await r.text();
    if (/analytics\.js/.test(html)) {
      record('PASS', 'Live homepage includes /analytics.js');
    } else {
      record('FAIL', 'Live homepage does NOT reference analytics.js', 'PostHog never loads on the front page.');
    }
    const csp = r.headers.get('content-security-policy') || '';
    if (!csp) {
      record('WARN', 'No Content-Security-Policy header on the homepage', 'Cannot verify PostHog is allowed; check other headers.');
    } else {
      const seg = (name) => {
        const m = csp.match(new RegExp(name + '\\s+([^;]*)'));
        return m ? m[1] : '';
      };
      const scriptOK = /posthog\.com/.test(seg('script-src')) || /posthog\.com/.test(seg('default-src'));
      const connectOK = /posthog\.com/.test(seg('connect-src')) || /posthog\.com/.test(seg('default-src'));
      if (scriptOK && connectOK) {
        record('PASS', 'CSP allows *.posthog.com in script-src AND connect-src');
      } else {
        record('FAIL', 'CSP is missing PostHog',
          `script-src allows posthog: ${scriptOK}; connect-src allows posthog: ${connectOK}.\n` +
          'If connect-src is missing it, the script loads but events never send (this looks exactly like "low counts").');
      }
    }
  } catch (e) {
    record('WARN', 'Could not fetch the live homepage', e.message);
  }

  // ---- 5. PostHog CDN reachable ---------------------------------------------
  if (eff.on && eff.host) {
    try {
      const r = await timedFetch(`${eff.host.replace(/\/+$/, '')}/static/array.js`);
      record(r.ok ? 'PASS' : 'WARN', `PostHog array.js CDN reachable (HTTP ${r.status})`,
        r.ok ? '' : 'The loader script itself may not download for real users.');
    } catch (e) {
      record('WARN', 'Could not reach PostHog array.js', e.message);
    }
  }

  // ---- optional: fire one real event ----------------------------------------
  if (SEND && eff.on && eff.host) {
    try {
      const r = await timedFetch(`${eff.host.replace(/\/+$/, '')}/capture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: eff.key,
          event: 'diagnostic_ping',
          distinct_id: 'posthog-healthcheck',
          properties: { source: 'tools/check-posthog.mjs', at: new Date().toISOString() },
        }),
      });
      record(r.ok ? 'PASS' : 'FAIL', `Sent one diagnostic_ping event (HTTP ${r.status})`,
        r.ok ? 'Watch PostHog → Activity for "diagnostic_ping" within ~1 minute to confirm end-to-end delivery.'
             : 'The capture endpoint rejected the event.');
    } catch (e) {
      record('FAIL', 'Could not send the diagnostic event', e.message);
    }
  }

  finish();
}

function finish() {
  const fails = results.filter((r) => r.status === 'FAIL');
  console.log(`\n  ${'─'.repeat(52)}`);
  if (fails.length === 0) {
    console.log('  ✅ Pipes are OPEN — key valid, CSP correct, deploy fresh, endpoints reachable.\n');
    console.log('  If the dashboard is still low despite this, it is one of two things this');
    console.log('  script CANNOT see from the server side:');
    console.log('    1. Ad/tracker blockers dropping eu.i.posthog.com in real browsers.');
    console.log('       Fix: reverse-proxy PostHog through apologiadaily.com so it is first-party.');
    console.log('    2. You are reading the wrong panel — PostHog "Persons" / identified-only');
    console.log('       shows just signed-in users. Compare Vercel to PostHog → Web Analytics.\n');
  } else {
    console.log(`  ❌ ${fails.length} blocking issue(s) found — fix the FAIL lines above.\n`);
  }
  process.exitCode = fails.length ? 1 : 0;
}

// Guard the CLI body so importing this module never runs the network checks.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}

export { parseAnalytics };
