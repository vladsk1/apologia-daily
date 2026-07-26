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
import { readFileSync, existsSync, readdirSync } from 'node:fs';
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

test('app-facing API endpoints set CORS on the real response, not only OPTIONS', async () => {
  // The original bug: headers were set INSIDE the `if (req.method === 'OPTIONS')`
  // branch, so the preflight passed but the POST response had no
  // Access-Control-Allow-Origin. Same-origin on the website (invisible), fatal in
  // the app, where the page origin is https://localhost.
  const endpoints = ['ask', 'debate', 'devotional', 'feedback', 'tutor', 'submit-question', 'push'];
  for (const name of endpoints) {
    const src = readFileSync(path.join(ROOT, 'api', `${name}.js`), 'utf8');
    assert.match(src, /import \{ applyCors \} from '\.\.\/lib\/cors\.js'/,
      `api/${name}.js must use the shared CORS helper`);
    assert.match(src, /if \(applyCors\(req, res\)\) return;/,
      `api/${name}.js must call applyCors before handling the request`);
    assert.ok(!/OPTIONS'\s*\)\s*\{\s*res\.setHeader\('Access-Control-Allow-Origin'/.test(src),
      `api/${name}.js must not set CORS only inside the OPTIONS branch`);
  }

  // And the helper itself must set the header for non-OPTIONS methods.
  const { applyCors } = await import(path.join(ROOT, 'lib', 'cors.js'));
  const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; }, status() { return this; }, end() { return this; } };
  const isPreflight = applyCors({ method: 'POST', headers: { origin: 'https://localhost' } }, res);
  assert.equal(isPreflight, false, 'POST must not be treated as a preflight');
  assert.equal(headers['Access-Control-Allow-Origin'], 'https://localhost',
    'the app origin must be allowed on the actual response');
  assert.equal(headers['Vary'], 'Origin', 'Vary: Origin is required when the ACAO value varies');

  // An unknown origin must not be reflected back.
  const h2 = {};
  const res2 = { setHeader: (k, v) => { h2[k] = v; }, status() { return this; }, end() { return this; } };
  applyCors({ method: 'POST', headers: { origin: 'https://evil.example.com' } }, res2);
  assert.notEqual(h2['Access-Control-Allow-Origin'], 'https://evil.example.com',
    'an unrecognised origin must never be reflected');
});

test('purchases wrapper cannot charge anyone until real keys are configured', () => {
  const src = readFileSync(path.join(ROOT, 'app-purchases.js'), 'utf8');
  // Placeholder detection is what keeps billing inert; losing it would arm purchases.
  assert.match(src, /indexOf\('REPLACE'\)\s*!==\s*-1\) return null/,
    'keyFor() must reject placeholder keys');
  // Positive-format check: only PUBLIC SDK keys may ship. A mis-pasted RevenueCat
  // SECRET key (sk_…) in a public binary would grant full account API access.
  assert.match(src, /\^\(appl_\|goog_\)/,
    'keyFor() must accept only public appl_/goog_ SDK keys');
  // Entitlement name is the contract with RevenueCat + docs/APP_STORE.md, and is
  // read from config so it cannot drift from app/revenuecat.example.json.
  assert.match(src, /DEFAULT_ENTITLEMENT\s*=\s*'pro'/, "default entitlement must stay 'pro'");
  assert.match(src, /cfg\.entitlement/, 'entitlement must be read from config, not hardcoded twice');
  // A real secret key must never be committed in the example config.
  const example = readFileSync(path.join(ROOT, 'app', 'revenuecat.example.json'), 'utf8');
  assert.match(example, /REPLACE_WITH_REVENUECAT_KEY/, 'example config must not contain a real key');
});

test('app bundle build excludes operator-only pages', () => {
  const src = readFileSync(path.join(ROOT, 'tools', 'build-app-bundle.mjs'), 'utf8');
  const m = src.match(/EXCLUDE_ROOT_FILES\s*=\s*new Set\(\[([\s\S]*?)\]\)/);
  assert.ok(m, 'EXCLUDE_ROOT_FILES not found');
  const excluded = (m[1].match(/'([^']+)'/g) || []).map(s => s.replace(/'/g, ''));
  // monitor.html embedded a live ops secret; a store binary is trivially
  // unzipped and archived forever, so operator pages must never ship in one.
  for (const page of ['monitor.html', 'logs.html', 'admin.html']) {
    assert.ok(excluded.includes(page), `${page} must be excluded from the app bundle`);
  }
});

test('built app bundle contains no secrets or operator pages', () => {
  // Only meaningful once the bundle has been built; skip cleanly in a fresh clone
  // (app/www is git-ignored) so CI does not fail for the wrong reason.
  const www = path.join(ROOT, 'app', 'www');
  if (!existsSync(www)) return;

  const offenders = [];
  const SECRET_PATTERNS = [
    [/SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SERVICE_KEY/, 'service-role key name'],
    [/"role"\s*:\s*"service_role"/, 'service_role JWT'],
    [/\bsk_(live|test)?[-_]?[A-Za-z0-9]{16,}/, 'secret-style API key'],
    [/METRICS_SECRET\s*=\s*['"][^'"]+['"]/, 'hardcoded METRICS_SECRET'],
    [/ADMIN_PASSWORD\s*=\s*['"][^'"]+['"]/, 'hardcoded admin password'],
    [/CRON_SECRET\s*=\s*['"][^'"]+['"]/, 'hardcoded cron secret'],
  ];
  const FORBIDDEN_FILES = new Set(['monitor.html', 'logs.html', 'admin.html']);

  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (FORBIDDEN_FILES.has(e.name)) offenders.push(`${path.relative(www, p)}: operator-only page`);
      if (!/\.(html?|js|mjs|json|css)$/i.test(e.name)) continue;
      const text = readFileSync(p, 'utf8');
      for (const [re, label] of SECRET_PATTERNS) {
        if (re.test(text)) offenders.push(`${path.relative(www, p)}: ${label}`);
      }
    }
  };
  walk(www);

  assert.deepEqual(offenders, [],
    'app/www must ship no secrets or operator pages — it becomes a downloadable, permanently archived binary');
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
