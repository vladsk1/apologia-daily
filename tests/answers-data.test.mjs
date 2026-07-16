// Integrity of answers/_data.json — the source the generator + gate read.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../answers/_data.json', import.meta.url), 'utf8'));
const CATS = new Set([
  "God's Existence", 'The Resurrection', 'Bible Reliability', 'Science & Faith',
  'Who Jesus Is', 'Suffering & Evil', 'Faith & Doubt', 'Islam & World Religions',
]);

test('answers array exists and is non-empty', () => {
  assert.ok(Array.isArray(data.answers) && data.answers.length > 0);
});

test('no duplicate answer slugs', () => {
  const slugs = data.answers.map((a) => a.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  assert.deepEqual(dupes, [], `duplicate slugs: ${dupes.join(', ')}`);
});

test('every slug is URL-safe (lowercase, digits, hyphens)', () => {
  for (const a of data.answers) assert.match(a.slug, /^[a-z0-9-]+$/, `bad slug: ${a.slug}`);
});

test('every answer has a valid category', () => {
  for (const a of data.answers) assert.ok(CATS.has(a.category), `${a.slug}: bad category "${a.category}"`);
});

test('every answer carries both review dates (argument + orthodoxy)', () => {
  for (const a of data.answers) {
    assert.ok(a.reviewed && a.reviewed.argument && a.reviewed.orthodoxy,
      `${a.slug}: missing reviewed.{argument,orthodoxy}`);
  }
});

test('every clarifier phrase appears verbatim in its answer body', () => {
  for (const a of data.answers) {
    for (const c of a.clarifiers || []) {
      assert.ok(a.a.includes(c.phrase),
        `${a.slug}: clarifier phrase not found verbatim in "a": "${c.phrase}"`);
    }
  }
});
