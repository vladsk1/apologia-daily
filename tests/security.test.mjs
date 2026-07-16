// Static security invariants. Cheap, deterministic backstops for the highest-stakes
// class of bug. NOT a substitute for the apologia-engineer review or a real audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';

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

// Cron-protected endpoints must read the secret from env and must not carry a
// hardcoded fallback (the published-secret finding). Presence-level guard.
test('cron endpoints require CRON_SECRET from env (no hardcoded fallback)', () => {
  for (const f of ['api/weekly-email.js', 'api/push.js']) {
    let txt;
    try { txt = readFileSync(f, 'utf8'); } catch { continue; }
    if (!/CRON_SECRET/.test(txt)) continue;
    assert.match(txt, /process\.env\.CRON_SECRET/, `${f}: CRON_SECRET should come from process.env`);
    // no literal like:  CRON_SECRET || 'some-hardcoded-value'
    assert.doesNotMatch(txt, /CRON_SECRET\s*\|\|\s*['"][^'"]+['"]/,
      `${f}: CRON_SECRET must not have a hardcoded fallback (fail closed instead)`);
  }
});
