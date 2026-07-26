/**
 * app-bridge.test.mjs — guards the native-app (Capacitor) bridge in analytics.js.
 *
 * analytics.js loads on every page of the live site, so a regression in the
 * Capacitor block would be a SITE-WIDE outage, not an app-only bug. Two
 * invariants matter and are asserted here:
 *
 *   1. On the WEB (window.Capacitor absent) the block is a STRICT no-op —
 *      window.fetch is left untouched, so apologiadaily.com behaves exactly as
 *      it did before the app existed.
 *   2. In the APP, relative "/api/*" calls (and only those) are rewritten to the
 *      production origin, without double-prefixing absolute URLs that merely
 *      contain "/api/", and idempotently if the block ever runs twice.
 *
 * The block is extracted from the real analytics.js rather than duplicated, so
 * this test cannot drift away from the shipped code.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function extractBridge() {
  const src = readFileSync(path.join(ROOT, 'analytics.js'), 'utf8');
  const start = src.indexOf('  /* ---- Native app (Capacitor) bridge');
  const end = src.indexOf('  /* ---- Cross-device progress sync');
  assert.ok(start !== -1 && end > start, 'Capacitor bridge block not found in analytics.js');
  const block = src.slice(start, end);
  assert.ok(block.includes('__AD_FETCH_PATCHED'), 'bridge block missing its re-entry guard');
  return block;
}

/** Run the real bridge block against a fake window. */
function runBridge(block, { native }) {
  const calls = [];
  const win = {
    fetch: (u) => { calls.push(u); return Promise.resolve('ok'); },
    Capacitor: native ? { isNativePlatform: () => true } : undefined,
  };
  const prevWindow = globalThis.window;
  globalThis.window = win;
  try { new Function(block)(); } finally { globalThis.window = prevWindow; }
  return { win, calls };
}

test('web: the Capacitor bridge is a strict no-op', () => {
  const { win, calls } = runBridge(extractBridge(), { native: false });
  const originalFetch = win.fetch;

  assert.equal(win.__AD_FETCH_PATCHED, undefined, 'fetch must not be patched on the web');
  assert.equal(win.__AD_IN_APP, false);

  win.fetch('/api/ask');
  assert.equal(calls[0], '/api/ask', 'relative /api URLs must pass through untouched on the web');
  assert.equal(win.fetch, originalFetch, 'window.fetch must be the original reference');
});

test('app: only relative /api/* is rewritten to the production origin', () => {
  const { win, calls } = runBridge(extractBridge(), { native: true });
  assert.equal(win.__AD_IN_APP, true);

  win.fetch('/api/ask');
  assert.equal(calls[0], 'https://apologiadaily.com/api/ask');

  win.fetch('/api/push?do=today');
  assert.equal(calls[1], 'https://apologiadaily.com/api/push?do=today', 'query strings must survive');

  win.fetch('/library/kalam.html');
  assert.equal(calls[2], '/library/kalam.html', 'non-api paths must be untouched');

  win.fetch('https://example.com/api/y');
  assert.equal(calls[3], 'https://example.com/api/y', 'absolute URLs containing /api/ must not be prefixed');

  win.fetch('/daily-args.json');
  assert.equal(calls[4], '/daily-args.json', 'root data files must be untouched');

  const urlObj = new URL('https://apologiadaily.com/api/ask');
  win.fetch(urlObj);
  assert.equal(calls[5], urlObj, 'non-string fetch inputs must pass through unchanged');
});

test('app: re-running the bridge does not double-wrap fetch', () => {
  const block = extractBridge();
  const { win, calls } = runBridge(block, { native: true });
  const patched = win.fetch;

  const prevWindow = globalThis.window;
  globalThis.window = win;
  try { new Function(block)(); } finally { globalThis.window = prevWindow; }

  assert.equal(win.fetch, patched, 're-entry guard must prevent a second wrapper');
  win.fetch('/api/ask');
  assert.equal(calls.at(-1), 'https://apologiadaily.com/api/ask', 'must not double-prefix');
});

test('purchases wrapper cannot charge anyone until real keys are configured', () => {
  const src = readFileSync(path.join(ROOT, 'app-purchases.js'), 'utf8');
  // Placeholder detection is what keeps billing inert; losing it would arm purchases.
  assert.match(src, /REPLACE/, 'placeholder-key detection must remain');
  assert.match(src, /indexOf\('REPLACE'\)\s*===\s*-1/, 'keyFor() must reject placeholder keys');
  // Entitlement name is the contract with RevenueCat + docs/APP_STORE.md.
  assert.match(src, /ENTITLEMENT\s*=\s*'pro'/, "entitlement must stay 'pro'");
  // A real secret key must never be committed in the example config.
  const example = readFileSync(path.join(ROOT, 'app', 'revenuecat.example.json'), 'utf8');
  assert.match(example, /REPLACE_WITH_REVENUECAT_KEY/, 'example config must not contain a real key');
});

test('app bundle build excludes server-side and secret-bearing paths', () => {
  const src = readFileSync(path.join(ROOT, 'tools', 'build-app-bundle.mjs'), 'utf8');
  // The bundle ships inside a public binary: only these dirs may be copied wholesale.
  const m = src.match(/INCLUDE_DIRS\s*=\s*new Set\(\[([^\]]*)\]\)/);
  assert.ok(m, 'INCLUDE_DIRS allowlist not found');
  const included = m[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
  assert.deepEqual(included.sort(), ['answers', 'demo', 'library'],
    'bundle dir allowlist changed — server dirs (api/, lib/, sources/, briefs/) must never ship');
  // Dotfiles (.env) are skipped by prefix, not by extension.
  assert.match(src, /startsWith\('\.'\)/, 'dotfile exclusion (.env etc.) must remain');
});
