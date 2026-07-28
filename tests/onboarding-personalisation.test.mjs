/**
 * onboarding-personalisation.test.mjs
 *
 * The dashboard's onboarding asks five questions and promises to "personalise
 * your experience". Three of the answers already drove something (`mode`,
 * `focus`, and `intent` via the welcome line); `level` and `goal` were captured,
 * saved to the Supabase user record, and then read by nothing — so someone who
 * answered "Complete beginner" saw exactly what an "advanced" user saw.
 *
 * These guard the fix: LEVEL_MAP decides how DEEP to send someone into the
 * content, GOAL_MAP decides WHAT to send them to practise, and the card hides
 * itself when neither answer is present.
 *
 * The maps and the render function are EXTRACTED FROM dashboard.html at test
 * time rather than duplicated here, so this cannot silently drift from the page.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(ROOT, 'dashboard.html'), 'utf8');

function extract(re, label) {
  const m = src.match(re);
  assert.ok(m, `${label} not found in dashboard.html — did it get renamed or removed?`);
  return m[0];
}

const CODE =
  extract(/var LEVEL_MAP = \{[\s\S]*?\n  \};/, 'LEVEL_MAP') + '\n' +
  extract(/var GOAL_MAP = \{[\s\S]*?\n  \};/, 'GOAL_MAP') + '\n' +
  extract(/function applyStartHere\(\) \{[\s\S]*?\n  \}/, 'applyStartHere()');

/** Render the real card with a given ad_prefs payload. */
function render(prefs) {
  const store = { ad_prefs: JSON.stringify(prefs) };
  const localStorage = { getItem: (k) => store[k] ?? null };
  const el = { innerHTML: '', style: { display: 'none' } };
  const document = { getElementById: (id) => (id === 'start-here' ? el : null) };
  new Function('localStorage', 'document', CODE + '; return applyStartHere;')(localStorage, document)();
  return el;
}

test('level decides how deep into the content a user is sent', () => {
  const routes = {
    beginner: 'answers/',                 // plain-English short answers
    some: 'evidence-library.html',        // the full argument, objection and limits
    advanced: 'library/',                 // deep-dive essays with the apparatus
  };
  for (const [level, href] of Object.entries(routes)) {
    const el = render({ level });
    assert.equal(el.style.display, 'block', `level=${level} should show the card`);
    assert.ok(el.innerHTML.includes(`href="${href}"`),
      `level=${level} should route to ${href}`);
  }
});

test('goal decides what the user is sent to practise', () => {
  const routes = {
    faith: 'daily-devotional.html',
    conversations: 'debate-arena.html',
    specific: 'asked-and-answered.html',
  };
  for (const [goal, href] of Object.entries(routes)) {
    const el = render({ goal });
    assert.ok(el.innerHTML.includes(`href="${href}"`), `goal=${goal} should route to ${href}`);
  }
});

test('level and goal render together without clobbering each other', () => {
  const el = render({ level: 'beginner', goal: 'conversations' });
  assert.ok(el.innerHTML.includes('answers/'), 'level route missing');
  assert.ok(el.innerHTML.includes('debate-arena.html'), 'goal route missing');
});

test('the card stays hidden when there is nothing to personalise', () => {
  // A user who onboarded BEFORE these answers were used must not be shown an
  // empty box — this is the regression that would hit every existing account.
  for (const prefs of [{}, { intent: 'defend', focus: 'god', mode: 'guided' }]) {
    const el = render(prefs);
    assert.equal(el.style.display, 'none');
    assert.equal(el.innerHTML, '');
  }
});

test('unrecognised answers fail quietly rather than rendering junk', () => {
  const el = render({ level: 'bogus', goal: 'bogus' });
  assert.equal(el.style.display, 'none');
});

test('every route the maps point at actually exists', () => {
  // A personalised card that sends a new user to a 404 is worse than no card.
  const hrefs = [...CODE.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 6, 'expected at least 6 routes across the two maps');
  for (const href of hrefs) {
    const target = href.endsWith('/') ? path.join(href, 'index.html') : href;
    assert.ok(existsSync(path.join(ROOT, target)), `${href} does not exist on disk`);
  }
});

test('the onboarding still asks for level and goal', () => {
  // If a future edit drops either question, the maps above become dead code and
  // the card silently stops rendering for new users.
  const steps = extract(/var OB_STEPS = \[[\s\S]*?\n  \];/, 'OB_STEPS');
  for (const id of ['intent', 'level', 'focus', 'goal', 'mode']) {
    assert.ok(new RegExp(`id:\\s*'${id}'`).test(steps), `onboarding step '${id}' is missing`);
  }
});
