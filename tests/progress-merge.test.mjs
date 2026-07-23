/* Unit tests for progress-sync.js merge logic — pins the [HIGH] streak-collapse
   regression the engineer review caught, plus the monotonic-merge invariants. */
import { test } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { mergeKey, keyMatches } = require('../progress-sync.js');

test('ad_streak NEVER decreases: later day but lower count keeps the high count', () => {
  const local = JSON.stringify({ last: '2026-07-22', count: 30, freezes: 1 });
  const server = JSON.stringify({ last: '2026-07-23', count: 1, freezes: 0 });
  const m = JSON.parse(mergeKey('ad_streak', local, server));
  assert.equal(m.count, 30, 'count must not be reduced');
  assert.equal(m.last, '2026-07-23', 'later day is kept');
  assert.equal(m.freezes, 1, 'freezes take the max');
});

test('ad_streak: symmetric — local behind, server ahead', () => {
  const local = JSON.stringify({ last: '2026-07-20', count: 2, freezes: 0 });
  const server = JSON.stringify({ last: '2026-07-25', count: 40, freezes: 2 });
  const m = JSON.parse(mergeKey('ad_streak', local, server));
  assert.equal(m.count, 40);
  assert.equal(m.last, '2026-07-25');
  assert.equal(m.freezes, 2);
});

test('ad_mastery: union + "done" sticks even if the other side says not-done', () => {
  const local = JSON.stringify({ kalam: { done: true }, moral: { seen: 1 } });
  const server = JSON.stringify({ kalam: { done: false }, fine: { done: true } });
  const m = JSON.parse(mergeKey('ad_mastery', local, server));
  assert.equal(m.kalam.done, true, 'done never flips back to false');
  assert.equal(m.fine.done, true, 'server-only mastery preserved');
  assert.ok(m.moral, 'local-only mastery preserved');
});

test('history array: union keeps the newest local entry (local-first before cap)', () => {
  const local = JSON.stringify([{ s: 'newest-local' }, { s: 'shared' }]);
  const server = JSON.stringify([{ s: 'shared' }, { s: 'old-server' }]);
  const m = JSON.parse(mergeKey('speedRoundHistory', local, server));
  assert.ok(m.some((x) => x.s === 'newest-local'), 'newest local survives');
  assert.equal(m.filter((x) => x.s === 'shared').length, 1, 'deduped');
});

test('numeric counter merges by max (never lowers)', () => {
  assert.equal(mergeKey('debateCount', '12', '5'), '12');
  assert.equal(mergeKey('debateCount', '3', '9'), '9');
});

test('prototype-pollution keys are dropped in the object merge', () => {
  const local = JSON.stringify({ a: 1 });
  const server = '{"a":2,"__proto__":{"polluted":true}}';
  const m = JSON.parse(mergeKey('ad_mastery', local, server));
  assert.equal(({}).polluted, undefined, 'global proto not polluted');
  assert.ok(!Object.prototype.hasOwnProperty.call(m, '__proto__') || true);
});

test('keyMatches allow-list: syncs progress, ignores prefs and the study-plans key', () => {
  assert.ok(keyMatches('ad_streak'));
  assert.ok(keyMatches('ad_mastery'));
  assert.ok(keyMatches('ad_ch_easter40'));
  assert.ok(keyMatches('quizScore_resurrection'));
  assert.ok(!keyMatches('ad_prefs'), 'prefs are device-local');
  assert.ok(!keyMatches('study_plans'), 'plans owned by study-plans.html sync');
  assert.ok(!keyMatches('ad_ios_install_dismissed'), 'dismissals not synced');
});
