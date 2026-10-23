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

test('beginners_path days: union across devices, never drops a finished day', () => {
  const local = JSON.stringify({ days: [1, 2] });
  const server = JSON.stringify({ days: [1, 2, 3] });
  const m = JSON.parse(mergeKey('beginners_path', local, server));
  assert.deepEqual(m.days.slice().sort(), [1, 2, 3]);
});

test('ad_reviews: the whole newer record wins — a later "needs work" reset is not undone', () => {
  const local = JSON.stringify({ kalam: { step: 0, due: '2026-10-01', last: '2026-09-30' } });
  const server = JSON.stringify({ kalam: { step: 4, due: '2026-11-01', last: '2026-09-01' }, moral: { step: 0, due: '2026-10-02', added: '2026-09-29' } });
  const m = JSON.parse(mergeKey('ad_reviews', local, server));
  assert.deepEqual(m.kalam, { step: 0, due: '2026-10-01', last: '2026-09-30' });
  assert.ok(m.moral, 'server-only review kept');
});

test('ad_calibration: keeps one real prediction/score pair, never a mix', () => {
  const m = JSON.parse(mergeKey('ad_calibration', JSON.stringify({ k: { p: 9, a: 3, at: '2026-09-01' } }), JSON.stringify({ k: { p: 3, a: 8, at: '2026-09-20' } })));
  assert.deepEqual(m.k, { p: 3, a: 8, at: '2026-09-20' });
});

test('challenge progress: a corrupted numeric copy never overwrites the real day list', () => {
  const m = JSON.parse(mergeKey('ad_ch_easter40', JSON.stringify({ started: true, completed: [1, 2, 3] }), JSON.stringify({ started: true, completed: 4 })));
  assert.deepEqual(m.completed, [1, 2, 3]);
  const m2 = JSON.parse(mergeKey('ad_ch_easter40', JSON.stringify({ completed: [1, 2] }), JSON.stringify({ completed: [2, 5] })));
  assert.deepEqual(m2.completed.slice().sort(), [1, 2, 5]);
});

test('append-order lists keep the NEWEST entries when capped (devotional days never trimmed at 200)', () => {
  const local = JSON.stringify(Array.from({ length: 250 }, (_, i) => 'D' + String(i).padStart(3, '0')));
  const server = JSON.stringify(['D000']);
  const m = JSON.parse(mergeKey('completed', local, server));
  assert.equal(m.length, 250); assert.ok(m.includes('D249'), 'today survives');
  const h = JSON.parse(mergeKey('speedRoundHistory', JSON.stringify(Array.from({ length: 210 }, (_, i) => ({ n: i }))), JSON.stringify([{ n: -1 }])));
  assert.equal(h.length, 200); assert.equal(h[h.length - 1].n, 209, 'newest kept');
});

test('keyMatches: the fuller learning record now syncs', () => {
  for (const k of ['ad_reviews', 'ad_calibration', 'beginners_path', 'completed', 'ad_joined_books']) assert.ok(keyMatches(k), k);
});

test('ad_reviews: a reviewed record beats one that was only scheduled later', () => {
  const m = JSON.parse(mergeKey('ad_reviews', JSON.stringify({ k: { step: 0, added: '2026-09-25' } }), JSON.stringify({ k: { step: 3, last: '2026-09-20' } })));
  assert.equal(m.k.step, 3);
});

test('quizCompleted streak dates are not trimmed at 200', () => {
  const local = JSON.stringify(Array.from({ length: 230 }, (_, i) => 'Q' + i));
  const m = JSON.parse(mergeKey('quizCompleted', local, JSON.stringify(['Q0'])));
  assert.equal(m.length, 230);
});
