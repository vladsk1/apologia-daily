// Content-pipeline invariants that protect the gates themselves.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { runOffline, CASES } from '../tools/test-crisis-routing.mjs';
import { isBoilerplateLine } from '../tools/check-stamp-integrity.mjs';

// Every /answers/* opening must LEAD WITH THE ANSWER — the short-form rule.
// The lint is a curated regex net for known front-loaded-opening tells; it
// exits non-zero (throwing here) if any answer opens by conceding/steelmanning
// before answering. Complements the apologia-argument gate.
test('no answer opens with a front-loaded tell (leads with the answer)', () => {
  assert.doesNotThrow(
    () => execFileSync('node', ['tools/check-answer-openings.mjs'], { cwd: process.cwd(), stdio: 'pipe' }),
    'an /answers/* entry opens front-loaded — run: node tools/check-answer-openings.mjs',
  );
});

// No /answers/* entry may carry an un-reviewed OVER-CONCESSION / unearned symmetry
// toward a rival or heterodox view — in ANY paragraph or the meta subtitle, not
// just the opening. This is the gap that let the "Are Mormons/JWs Christians?"
// concessions ship (they led with the correct "no," so the openings lint passed).
// Complements the apologia-argument/-neutrality/-orthodoxy pull-quote test.
test('no answer carries an over-concession tell (whole answer + meta)', () => {
  assert.doesNotThrow(
    () => execFileSync('node', ['tools/check-answer-concessions.mjs'], { cwd: process.cwd(), stdio: 'pipe' }),
    'an /answers/* entry over-concedes — run: node tools/check-answer-concessions.mjs',
  );
});

// The deterministic crisis backstop in api/ask.js must catch every unmistakable
// first-person crisis phrasing and stay silent on ordinary questions. This
// extracts the LIVE regex from api/ask.js and asserts it against the labeled
// corpus, so a regression in the regex (or its accidental removal) fails CI.
// The full end-to-end classifier path is exercised separately by
// `node tools/test-crisis-routing.mjs --live` (needs the deployed endpoint).
test('crisis backstop regex matches its labeled corpus (deterministic layer)', () => {
  const results = runOffline();
  const failed = results.filter((r) => !r.ok);
  assert.equal(
    failed.length, 0,
    `crisisBackstop misroutes ${failed.length} case(s): ${failed.map((r) => `"${r.msg}"`).join(', ')} — run: node tools/test-crisis-routing.mjs`,
  );
  // Guard against the corpus being gutted to trivially pass.
  assert.ok(CASES.filter((c) => c.backstop).length >= 6, 'crisis corpus lost its backstop-positive cases');
});

// Every content-review stamp must be valid JSON. A stamp with an unescaped inner
// double-quote silently breaks the gate's parser (the 2026-07-14 finding).
test('every content-review stamp parses as valid JSON', () => {
  const files = [
    ...globSync('library/**/*.html'),
    ...globSync('ev-s*.html'),
    'worldviews.html', 'what-we-believe.html', 'api/ask.js',
  ];
  for (const f of files) {
    let txt;
    try { txt = readFileSync(f, 'utf8'); } catch { continue; }
    const m = txt.match(/content-review:\s*(\{.*\})/);
    if (!m) continue; // unstamped is the content-review GATE's job, not this test's
    assert.doesNotThrow(() => JSON.parse(m[1]), `${f}: content-review stamp is not valid JSON`);
  }
});

// api/ask.js is the live AI's guardrail prompt. A future edit must not silently
// gut the non-negotiables. This is a presence check, not a semantic one.
test('api/ask.js retains its core orthodoxy guardrails', () => {
  const ask = readFileSync(new URL('../api/ask.js', import.meta.url), 'utf8').toLowerCase();
  const required = [
    'classical christian orthodoxy',
    'orthodoxy outranks charity',
    'final self-check',
    'salvation through christ alone',
    'begins to exist',        // the Kalam wording rule ("...that BEGINS to exist has a cause")
    'denominational neutrality',
  ];
  for (const s of required) assert.ok(ask.includes(s), `api/ask.js is missing a guardrail: "${s}"`);
});

// The argument-briefs retrieval layer (briefs/ -> lib/briefs-verified.js -> api/ask.js)
// must stay safe: only twice-gated briefs may reach the live module, and the build
// output must be in sync. This is the /sources-style trust boundary for briefs.
test('argument-briefs index is in sync (build is deterministic)', () => {
  assert.doesNotThrow(
    () => execFileSync('node', ['tools/build-briefs-index.mjs', '--check'], { cwd: process.cwd(), stdio: 'pipe' }),
    'briefs build is stale — run: node tools/build-briefs-index.mjs',
  );
});

test('lib/briefs-verified.js contains ONLY twice-gated briefs (no ungated leak to live)', async () => {
  const data = JSON.parse(readFileSync(new URL('../briefs/_data.json', import.meta.url), 'utf8'));
  const { VERIFIED_BRIEFS } = await import('../lib/briefs-verified.js');
  const gatedIds = new Set(
    data.filter((b) => b.reviewed && b.reviewed.argument && b.reviewed.orthodoxy).map((b) => b.id),
  );
  for (const b of VERIFIED_BRIEFS) {
    assert.ok(gatedIds.has(b.id), `ungated brief "${b.id}" leaked into the live module`);
  }
  // Every entry must carry the required fields + a reviewed object (stamped or not).
  for (const b of data) {
    for (const k of ['id', 'topic', 'tags', 'framing', 'from', 'reviewed']) {
      assert.ok(k in b, `brief "${b.id || '?'}" missing "${k}"`);
    }
    assert.ok(b.reviewed && typeof b.reviewed === 'object', `brief "${b.id}" reviewed must be an object`);
  }
});

// Retrieval tuning battery: on-topic questions must surface a brief, and clearly
// off-topic / intra-Christian-dispute questions must surface NONE (so the model
// just answers normally). Guards recall AND precision against a future STOP-word or
// threshold regression. Not exhaustive — a representative net.
test('brief retrieval fires on-topic and stays silent off-topic', async () => {
  const { retrieveBriefs } = await import('../lib/retrieve-briefs.js');
  const onTopic = [
    'Is Jesus God?',
    'Did Jesus ever actually claim to be God?',
    'Isnt the Trinity a logical contradiction?',
    'Does fine tuning prove the universe was designed?',
    'What caused the universe to exist?',
    'Was Jesus just copied from Mithras and Osiris?',
    'Did the disciples hallucinate seeing Jesus?',
    'How was the 1 Corinthians 15 creed dated so early?',
    'Why does God allow suffering?',
    'Where does morality come from without God?',
    'Can we trust the New Testament manuscripts?',
    'Do Muslims and Christians worship the same God?',
    'Are Mormons Christians?',
    'Wasnt Jesus just a good moral teacher?',
  ];
  const offTopic = [
    'what is the best pizza topping',
    'How do I stay motivated to exercise?',
    'Should I get baptized as an infant or adult?',  // intra-Christian dispute — no brief
    'who was Pontius Pilate',
    'Are Catholics Christians?',                      // intra-Christian — no brief (not Mormon/JW)
    'What do Christians believe about heaven?',
    'how do I forgive someone',
  ];
  for (const q of onTopic) {
    assert.ok(retrieveBriefs(q, 1).length === 1, `expected a brief for on-topic question: "${q}"`);
  }
  for (const q of offTopic) {
    assert.ok(retrieveBriefs(q, 1).length === 0, `expected NO brief for off-topic question: "${q}"`);
  }
});

// The briefs instruction block must keep the framing OPTIONAL and subordinate to the
// guardrails — a future edit must not turn it into a script the model must follow.
test('api/ask.js keeps the argument-brief block optional + guardrail-subordinate', () => {
  const ask = readFileSync(new URL('../api/ask.js', import.meta.url), 'utf8');
  const ask_l = ask.toLowerCase();
  assert.ok(ask.includes('buildBriefsBlock'), 'the briefs block builder is missing');
  assert.ok(ask.includes('retrieveBriefs'), 'brief retrieval is not wired');
  const required = [
    'optional',                       // the framing is optional background
    'ignore it',                      // the model may ignore it
    'never overrides a guardrail',    // guardrails win
    'not a quotable source',          // not to be quoted verbatim
  ];
  for (const s of required) assert.ok(ask_l.includes(s), `briefs block missing its safety instruction: "${s}"`);
});

// The stamp-integrity boilerplate classifier decides whether a changed diff line
// on a gated page is non-doctrinal (nav/SEO/script-include → ignore) or doctrinal
// prose (→ flag "edited after certification"). A regression here would either spam
// false flags (SEO edits) or, worse, silently pass a doctrinal edit. isBoilerplateLine
// takes a raw diff line (leading +/-). JSON-LD is deliberately NOT boilerplate: the
// FAQPage schema mirrors the essays' doctrinal FAQ answers.
test('stamp-integrity classifier: SEO/nav/script lines are boilerplate, doctrinal prose is not', () => {
  // boilerplate (must be ignored by the stamp check)
  const boilerplate = [
    '+  <title>Christian Answers to Islam | Apologia Daily</title>',
    '-<title>Old Title</title>',
    '+<meta name="description" content="x">',
    '+<link rel="canonical" href="https://apologiadaily.com/x">',
    '+<script src="/library/active-reading.js" defer></script>',
    '+  <script src="/library/orthonote.js" defer></script>',
    '+<li><a href="/x">Nav link</a></li>',
    '+   ',
    '+  <!-- content-review: {"argument":"2026-07-25","orthodoxy":"2026-07-25","by":"x"} -->',
  ];
  for (const l of boilerplate) assert.equal(isBoilerplateLine(l), true, `should be boilerplate: ${l}`);

  // doctrinal prose + JSON-LD (must NOT be treated as boilerplate → still flaggable)
  const doctrinal = [
    '+<p>The Son is fully and eternally God, co-equal with the Father.</p>',
    '-<p>Jesus only appeared to die on the cross.</p>',
    '+<script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"text":"the Son is God"}]}</script>',
    '+<h2>Why the resurrection is the best explanation</h2>',
  ];
  for (const l of doctrinal) assert.equal(isBoilerplateLine(l), false, `should NOT be boilerplate: ${l}`);
});

test("What's New feed is generated, in sync, and every link resolves", () => {
  // The feed was hand-maintained and went six weeks stale on five entries from
  // 2026-06-15 while ~100 answers and dozens of essays shipped — on a page linked
  // from the nav of every page. It is now generated from the content-review
  // stamps; these guard that it stays that way.
  const ROOT2 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const page = readFileSync(path.join(ROOT2, 'whats-new.html'), 'utf8');

  const s = page.indexOf('/* whats-new:start */');
  const e = page.indexOf('/* whats-new:end */');
  assert.ok(s !== -1 && e !== -1 && e > s, 'generated markers missing from whats-new.html');
  const block = page.slice(s, e);

  const entries = [...block.matchAll(/date:\s*'(\d{4}-\d{2}-\d{2})'/g)].map((m) => m[1]);
  assert.ok(entries.length >= 8, `expected a populated feed, found ${entries.length} entries`);

  // Newest first — the page relies on this ordering for its "New" badges.
  const sorted = [...entries].sort().reverse();
  assert.deepEqual(entries, sorted, 'feed entries must be newest-first');

  // A changelog that links to a 404 is worse than no changelog.
  for (const [, href] of block.matchAll(/link:\s*'([^']+)'/g)) {
    assert.ok(existsSync(path.join(ROOT2, href)), `What's New links to a missing page: ${href}`);
  }

  // No batch re-gate may flood the feed with one afternoon's work.
  const perDate = entries.reduce((m, d) => m.set(d, (m.get(d) || 0) + 1), new Map());
  for (const [d, n] of perDate) {
    assert.ok(n <= 4, `${n} entries share ${d}; the per-date cap is 4`);
  }

  // The page must not promise a cadence it cannot keep.
  assert.ok(!/added to Apologia Daily regularly/i.test(page),
    'the page should not promise a publishing cadence');
});
