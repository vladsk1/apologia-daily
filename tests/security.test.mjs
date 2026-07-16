// Static security invariants. Cheap, deterministic backstops for the highest-stakes
// class of bug. NOT a substitute for the apologia-engineer review or a real audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';
import { clientIp } from '../lib/ratelimit.js';

// The per-IP cap is the only cost control on the unmetered LLM endpoints, so the
// IP must come from a header the client can't forge. A spoofed leftmost
// X-Forwarded-For must NOT mint a fresh bucket.
test('clientIp uses the unforgeable x-real-ip, not the leftmost X-Forwarded-For', () => {
  // attacker prepends a fake XFF; x-real-ip is the platform-set truth
  const req = { headers: { 'x-forwarded-for': '1.1.1.1, 9.9.9.9', 'x-real-ip': '9.9.9.9' } };
  assert.equal(clientIp(req), '9.9.9.9');
});
test('clientIp falls back to the LAST XFF hop (trusted proxy), never the first', () => {
  const req = { headers: { 'x-forwarded-for': 'fake, fake2, 8.8.8.8' } };
  assert.equal(clientIp(req), '8.8.8.8');
  assert.equal(clientIp({ headers: {} }), 'unknown');
});

// Entitlement (Pro) must derive from a SERVER-controlled field. user_metadata is
// client-writable (updateUser from the browser) — reading it would let any user
// self-grant Pro. The real check must read app_metadata / a subscriptions table.
test('paywall never reads the client-writable user_metadata.is_pro', () => {
  const files = [...globSync('*.html'), ...globSync('*.js'), ...globSync('ev-m-*.html')];
  for (const f of files) {
    const txt = readFileSync(f, 'utf8');
    assert.doesNotMatch(txt, /user_metadata\.is_pro/,
      `${f}: reads user_metadata.is_pro (client-writable) — entitlement must come from app_metadata / server`);
  }
});

// The Supabase service-role key bypasses RLS. It must live ONLY in server code
// (api/*.js, read from env) and must NEVER appear in anything shipped to the browser.
test('service-role key never appears in client-shipped files', () => {
  const clientFiles = [
    ...globSync('*.html'), ...globSync('*.js'),
    ...globSync('library/**/*.html'), ...globSync('answers/*.html'),
  ];
  for (const f of clientFiles) {
    const txt = readFileSync(f, 'utf8');
    assert.doesNotMatch(txt, /service_role|SERVICE_ROLE_KEY/i,
      `${f}: references the service-role key — it must be server-only (api/*.js, from env)`);
  }
});

// Cron/webhook/ops endpoints must guard via the shared, fail-closed requireSecret
// helper (not a hand-rolled copy that can drift to fail-open, as new-signup once
// did) and must carry no hardcoded secret fallback (the published-secret finding).
test('secret-guarded endpoints use the shared requireSecret helper (no hardcoded fallback)', () => {
  for (const f of ['api/weekly-email.js', 'api/push.js', 'api/logs.js', 'api/metrics.js', 'api/new-signup.js']) {
    let txt;
    try { txt = readFileSync(f, 'utf8'); } catch { continue; }
    assert.match(txt, /requireSecret\(/, `${f}: must guard via the shared requireSecret helper`);
    assert.doesNotMatch(txt, /_SECRET\s*\|\|\s*['"][^'"]+['"]/,
      `${f}: a secret must not have a hardcoded fallback (fail closed instead)`);
  }
});
