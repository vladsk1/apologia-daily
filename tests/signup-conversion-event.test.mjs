/**
 * signup-conversion-event.test.mjs
 *
 * `signup_completed` (signup.html) fires at form-submit success — BEFORE the
 * user clicks the confirmation email. It is a form-completion metric, not a
 * conversion metric. Mapping it to an ad platform's registration conversion
 * would optimise ad delivery toward people who abandon at the confirmation
 * email, i.e. pay to find non-users. See docs/META_ADS_PLAN.md.
 *
 * The true conversion event is `signup_confirmed`, fired on the first
 * authenticated dashboard load. These tests guard the two properties that make
 * it trustworthy — both are easy to "simplify" away by someone who doesn't know
 * why they're there:
 *
 *   1. a localStorage guard, so a returning user doesn't re-fire it every visit;
 *   2. a created_at recency window — WITHOUT IT, deploying the event fires it
 *      for every EXISTING user on their next dashboard load, manufacturing a
 *      false conversion spike in exactly the data the event exists to fix.
 *
 * Source is read from the real files so this cannot drift from the pages.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dashboard = readFileSync(path.join(ROOT, 'dashboard.html'), 'utf8');
const signup = readFileSync(path.join(ROOT, 'signup.html'), 'utf8');

/* Anchor on the adTrack CALL, not the first mention of the name — the first
   occurrence is the explanatory comment header, which sits above the guards. */
function emitBlock() {
  const i = dashboard.indexOf("adTrack('signup_confirmed'");
  assert.ok(i > -1, 'signup_confirmed must be emitted');
  return dashboard.slice(Math.max(0, i - 1200), i + 300);
}

test('dashboard emits a signup_confirmed event', () => {
  assert.match(dashboard, /adTrack\(\s*'signup_confirmed'/,
    'signup_confirmed is the only trustworthy registration conversion — it must be emitted');
});

test('signup_confirmed is guarded against re-firing for a returning user', () => {
  const block = emitBlock();
  assert.match(block, /localStorage\.getItem\(\s*confirmKey/,
    'must check localStorage before firing');
  assert.match(block, /localStorage\.setItem\(\s*confirmKey/,
    'must record that it fired');
  assert.match(block, /ad_signup_confirmed_'\s*\+\s*user\.id/,
    'the key must be per-user, or one account suppresses the event for another on a shared device');
});

test('signup_confirmed only fires for genuinely new accounts', () => {
  const block = emitBlock();
  assert.match(block, /user\.created_at/,
    'must read created_at — without a recency window every existing user fires the event on next visit');
  assert.match(block, /7\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/,
    'the 7-day window is the guard against a false conversion spike on deploy');
  assert.match(block, /isNewAccount\s*&&/,
    'the recency check must actually gate the emit, not merely be computed');
});

test('signup.html warns that signup_completed is pre-confirmation', () => {
  assert.match(signup, /signup_completed/, 'the form-completion event still exists');
  const idx = signup.indexOf("adTrack('signup_completed'");
  const preamble = signup.slice(Math.max(0, idx - 900), idx);
  assert.match(preamble, /BEFORE the user\s*\n?\s*clicks the confirmation email|BEFORE the user/,
    'the pre-confirmation caveat must sit with the call, where a future editor will see it');
  assert.match(preamble, /CompleteRegistration/,
    'must name the specific misuse it is warning against');
});

test('signup_completed still records whether a session existed', () => {
  // `confirmed: false` is what makes the overcount detectable in PostHog, so a
  // funnel built on the old event can at least be filtered rather than silently wrong.
  const idx = signup.indexOf("adTrack('signup_completed'");
  const call = signup.slice(idx, idx + 260);
  assert.match(call, /confirmed:\s*!!\(data && data\.session\)/,
    'the confirmed flag is the escape hatch for anything already built on this event');
});
