/**
 * fathers.test.mjs — guards the Church Fathers "Full works" library (/fathers, owner ruling
 * 2026-11-18; rules in docs/FREE_LIBRARY_CANDIDATES.md → "Church Fathers library: hosting rules").
 *
 *   1. The generated pages are up to date, the hosted text still matches its word-for-word
 *      copy-check (hash), every neutral note and essay link points at a real section.
 *   2. Every /sources passage from a hosted work matches the hosted text at the section it claims
 *      (rule 7a — these passages reach the live AI).
 *   3. Rule 1: no 1894 editors' footnote markers or note text survive in the hosted text.
 *   4. Rule 5: every page, and the shelf on sources.html, carries the "historic witnesses, not
 *      Scripture" line; every page states that the editors' notes are omitted.
 *   5. Every "Read in context" link lands on a section that exists.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'fathers', '_data');
const TOP = 'These are historic witnesses, not Scripture. We present them complete, including passages that Christian traditions read differently.';
const books = existsSync(DATA)
  ? readdirSync(DATA).filter((f) => f.endsWith('.json') && !f.endsWith('.text.json')).map((f) => ({
      meta: JSON.parse(readFileSync(path.join(DATA, f), 'utf8')),
      text: JSON.parse(readFileSync(path.join(DATA, f.replace(/\.json$/, '.text.json')), 'utf8')),
    }))
  : [];
const run = (args) => execFileSync('node', args, { cwd: ROOT, stdio: 'pipe' }).toString();

test('fathers pages are up to date and the hosted text matches its copy-check', () => {
  assert.doesNotThrow(() => run(['tools/build-fathers.mjs', '--check']),
    'run: node tools/build-fathers.mjs (or, if the text changed, re-run the copy-check and --stamp-hash)');
});

test('every /sources passage from a hosted work matches the hosted text at its section', () => {
  assert.doesNotThrow(() => run(['tools/check-father-quotes.mjs', '--strict']),
    'a /sources passage does not match the hosted Father text — run: node tools/check-father-quotes.mjs');
});

test('no 1894 editors’ footnote markers or note text remain in the hosted text (rule 1)', () => {
  for (const { meta, text } of books) {
    const flat = JSON.stringify(text.parts);
    assert.ok(!/\[\d{3,4}\]/.test(flat), `${meta.slug}: a footnote marker like [3382] survives`);
    for (const tell of ['Benedictine', 'Petavius', 'Billius', 'Combefis', 'Elias Cretensis', 'A.V.', 'v. l.']) {
      assert.ok(!flat.includes(tell), `${meta.slug}: editors’-note text "${tell}" appears in the hosted text`);
    }
  }
});

test('every page and the sources.html shelf carry the top line; pages state the notes are omitted (rule 5)', () => {
  assert.ok(readFileSync(path.join(ROOT, 'sources.html'), 'utf8').includes(TOP), 'sources.html shelf is missing the top line');
  for (const { meta, text } of books) {
    const pages = [`${meta.slug}.html`, ...text.parts.map((p) => `${meta.partSlug}${p.n}.html`)];
    for (const p of pages) {
      const html = readFileSync(path.join(ROOT, 'fathers', p), 'utf8');
      assert.ok(html.includes(TOP), `fathers/${p} is missing the top line`);
      assert.ok(html.includes('introductions and footnotes are omitted'), `fathers/${p} does not say the editors’ notes are omitted`);
    }
  }
});

test('every "Read in context" link points at a section that exists', () => {
  for (const f of readdirSync(path.join(ROOT, 'sources')).filter((x) => x.endsWith('.json'))) {
    for (const e of JSON.parse(readFileSync(path.join(ROOT, 'sources', f), 'utf8'))) {
      if (!e.context_url) continue;
      const [file, hash] = e.context_url.replace(/^\//, '').split('#');
      assert.ok(existsSync(path.join(ROOT, file)), `${e.id}: ${file} does not exist`);
      assert.ok(readFileSync(path.join(ROOT, file), 'utf8').includes(`id="${hash}"`), `${e.id}: #${hash} not found in ${file}`);
    }
  }
});
