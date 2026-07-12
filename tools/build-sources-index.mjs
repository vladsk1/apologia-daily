#!/usr/bin/env node
/*
 * Builds sources-index.json from every sources/*.json file — a flat, searchable
 * index of the public-domain source library (see sources/README.md) for the
 * content agents and (later) a retrieval step in the live pipeline.
 *
 * Run:   node tools/build-sources-index.mjs
 * CI:    node tools/build-sources-index.mjs --check   (fails if stale)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// fileURLToPath (not .pathname) so this works on Windows too — .pathname yields
// a broken "/C:/…%20…" path (leading slash + undecoded spaces) on win32.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = ROOT + 'sources/';

const REQUIRED = ['id', 'author', 'work', 'section', 'translation', 'pd', 'source_url', 'verified', 'text'];

const entries = [];
const problems = [];
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  let arr;
  try { arr = JSON.parse(readFileSync(DIR + file, 'utf8')); }
  catch (e) { problems.push(`${file}: invalid JSON — ${e.message}`); continue; }
  if (!Array.isArray(arr)) { problems.push(`${file}: expected an array`); continue; }
  for (const e of arr) {
    for (const k of REQUIRED) if (!(k in e)) problems.push(`${file} · ${e.id || '?'}: missing "${k}"`);
    if (e.pd !== true) problems.push(`${file} · ${e.id}: pd must be true (public domain only)`);
    entries.push({
      id: e.id, author: e.author, work: e.work, year: e.year || null,
      section: e.section, translation: e.translation, source_url: e.source_url,
      verified: !!e.verified, tags: e.tags || [], text: e.text,
    });
  }
}

if (problems.length) {
  console.error('✗ Source library problems:\n  ' + problems.join('\n  '));
  process.exit(1);
}

const ids = entries.map((e) => e.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) { console.error('✗ Duplicate ids: ' + [...new Set(dupes)].join(', ')); process.exit(1); }

const json = JSON.stringify(entries);
const OUT = 'sources-index.json';
if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(ROOT + OUT, 'utf8'); } catch {}
  if (current.trim() !== json.trim()) {
    console.error(`✗ ${OUT} is stale — run: node tools/build-sources-index.mjs`);
    process.exit(1);
  }
  console.log(`✓ ${OUT} is up to date (${entries.length} passages).`);
} else {
  writeFileSync(ROOT + OUT, json);
  const v = entries.filter((e) => e.verified).length;
  console.log(`Wrote ${OUT}: ${entries.length} passages (${v} verified, ${entries.length - v} pending).`);
}
