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

test('monitor page carries no secret, and an unconfigured dashboard is distinguishable', async () => {
  // The metrics secret used to be hardcoded in monitor.html, which is publicly
  // served. It must never come back — the operator supplies it at sign-in.
  const page = readFileSync(new URL('../monitor.html', import.meta.url), 'utf8');
  assert.ok(!/ADMIN_PASSWORD\s*=\s*['"][^'"]+['"]/.test(page),
    'monitor.html must not hardcode an admin password');
  assert.ok(!/secret=['"]?\s*\+?\s*encodeURIComponent\(\s*['"][^'"]+['"]\s*\)/.test(page),
    'monitor.html must not embed a literal metrics secret');
  assert.match(page, /sessionStorage/, 'the typed secret should live in sessionStorage, not source');

  // With METRICS_SECRET unset, /api/metrics must answer 503 not_configured rather
  // than a bare 401. Otherwise "never set up" and "wrong password" are
  // indistinguishable, and the operator is locked out of the panels that need no
  // secret at all. It still returns NO data on this path.
  const savedSecret = process.env.METRICS_SECRET;
  delete process.env.METRICS_SECRET;
  const { default: handler } = await import('../api/metrics.js?state=unset');
  const captured = {};
  const res = {
    setHeader() {}, end() { return this; },
    status(c) { captured.code = c; return this; },
    json(b) { captured.body = b; return this; },
  };
  await handler({ method: 'GET', query: {}, headers: {} }, res);
  assert.equal(captured.code, 503);
  assert.equal(captured.body.error, 'not_configured');
  assert.ok(!captured.body.metrics, 'the unconfigured path must not return metrics');
  if (savedSecret !== undefined) process.env.METRICS_SECRET = savedSecret;
});

test('/api/health signals outages with 503 so uptime monitors can see them', async () => {
  // Uptime tools (UptimeRobot, Better Stack, Pingdom) judge up-vs-down from the
  // HTTP STATUS, not the body. This endpoint used to answer 200 even while
  // reporting "degraded", so a monitor pointed at it stayed green through a
  // database outage — false reassurance, which is worse than no monitoring.
  const mkRes = () => { const R = {}; return { setHeader() {}, end() { return this; },
    status(c) { R.code = c; return this; }, json(b) { R.body = b; return this; }, R }; };
  const realFetch = globalThis.fetch;
  const savedKey = process.env.ANTHROPIC_API_KEY;
  const savedMetrics = process.env.METRICS_SECRET;
  const savedHealth = process.env.HEALTH_SECRET;

  try {
    process.env.ANTHROPIC_API_KEY = 'present';
    // The paid LLM pings stay off; a SKIPPED check must not count as an outage.
    delete process.env.METRICS_SECRET;
    delete process.env.HEALTH_SECRET;

    globalThis.fetch = async () => ({ ok: true, json: async () => [{ day_number: 1 }] });
    const { default: healthy } = await import('../api/health.js?case=ok');
    let res = mkRes();
    await healthy({ method: 'GET', query: {}, headers: {} }, res);
    assert.equal(res.R.code, 200, 'a healthy site must return 200');
    assert.equal(res.R.body.status, 'healthy');
    assert.equal(res.R.body.checks.endpoints.status, 'skipped',
      'the paid pings should be skipped, and skipping must not trip an alarm');

    globalThis.fetch = async () => { throw new Error('database unreachable'); };
    const { default: degraded } = await import('../api/health.js?case=down');
    res = mkRes();
    await degraded({ method: 'GET', query: {}, headers: {} }, res);
    assert.equal(res.R.code, 503, 'an outage must return 503, not 200');
    assert.equal(res.R.body.status, 'degraded');
  } finally {
    globalThis.fetch = realFetch;
    if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = savedKey;
    if (savedMetrics !== undefined) process.env.METRICS_SECRET = savedMetrics;
    if (savedHealth !== undefined) process.env.HEALTH_SECRET = savedHealth;
  }
});

test('every table created in the repo setup SQL turns on row-level security', () => {
  // Supabase exposes every public table to the anon key through PostgREST. A table
  // created without RLS is readable and writable by anyone holding the key that sits in
  // every page. 2026-10-08 audit: push_subscriptions was documented with no RLS at all.
  const files = [
    ...globSync('docs/**/*.md'), ...globSync('api/*.js'), ...globSync('lib/*.js'),
    ...globSync('*.js'), ...globSync('**/*.sql').filter((f) => !f.startsWith('node_modules')),
  ];
  const missing = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const created = [...src.matchAll(/create table(?: if not exists)?\s+(?:public\.)?([a-z_][a-z0-9_]*)/gi)].map((m) => m[1].toLowerCase());
    for (const t of new Set(created)) {
      const rls = new RegExp(`alter table\\s+(?:public\\.)?${t}\\s+enable row level security`, 'i');
      if (!rls.test(src)) missing.push(`${f}: ${t}`);
    }
  }
  assert.deepEqual(missing, [], 'tables created without "enable row level security" in the same file:\n' + missing.join('\n'));
});

test('every Supabase JWT shipped to the browser is the anon key, never service_role', () => {
  const files = [...globSync('*.html'), ...globSync('*.js'), ...globSync('library/**/*.{html,js}'),
    ...globSync('answers/*.html'), ...globSync('lib/*.js').filter((f) => !/delete-account|verify-user/.test(f))];
  const bad = [];
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(/eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g)) {
      let role = '?';
      try { role = JSON.parse(Buffer.from(m[1], 'base64url').toString('utf8')).role; } catch { /* not a JWT */ }
      if (role !== 'anon') bad.push(`${f}: role=${role}`);
    }
  }
  assert.deepEqual(bad, [], 'non-anon JWT in a client-shipped file:\n' + bad.join('\n'));
});

test('age screen: every Study Groups read/write policy and the invite RPC require an adult', () => {
  // docs/AGE_SCREEN.md is the SQL the owner runs; the database is the only real 18+ guard.
  const sql = readFileSync('docs/AGE_SCREEN.md', 'utf8');
  for (const p of ['groups_insert', 'gm_select', 'gm_insert', 'gmsg_select', 'gmsg_insert', 'gact_select', 'gact_insert']) {
    const m = sql.match(new RegExp(`create policy ${p} on[\\s\\S]*?;`));
    assert.ok(m, `${p} policy missing from docs/AGE_SCREEN.md`);
    assert.match(m[0], /public\.is_adult\(\)/, `${p} does not check is_adult()`);
  }
  const rpc = sql.match(/function public\.join_group_by_code[\s\S]*?end; \$\$;/);
  assert.ok(rpc && /if not public\.is_adult\(\) then raise exception 'adults_only'/.test(rpc[0]), 'join_group_by_code must refuse non-adults');
  // the signup trigger must never be able to abort account creation
  const trg = sql.match(/function public\.copy_signup_age[\s\S]*?end; \$\$;/);
  assert.ok(trg && /exception when others then null/.test(trg[0]), 'copy_signup_age must swallow its own errors');
  // is_adult takes no argument, so nobody can ask about another user
  assert.doesNotMatch(sql, /function public\.is_adult\(\s*\w/);
});

test('age screen: signup sends no birth date and nothing at all for an under-13', () => {
  const src = readFileSync('signup.html', 'utf8');
  assert.doesNotMatch(src, /adult_from|birth_year|dobY\s*\}/, 'signup must not send a birth date');
  const fn = src.slice(src.indexOf('async function handleSignup'));
  assert.ok(fn.indexOf('age < 13') !== -1 && fn.indexOf('age < 13') < fn.indexOf('sb.auth.signUp'),
    'the under-13 refusal must run before any signup call');
});
