#!/usr/bin/env node
/* Active-Reading curated-takeaways helper.
 *
 *   node tools/build-active-reading.mjs --skeleton slugA,slugB   # print {slug:{heading:""}} to fill
 *   node tools/build-active-reading.mjs --check                  # validate data file + coverage report
 *   node tools/build-active-reading.mjs                          # coverage report only
 *
 * The curated takeaways live in library/active-reading-data.json:
 *   { "<slug>": { "<section heading>": "<one-line key takeaway>", ... }, ... }
 * active-reading.js matches by a tolerant normalization, but keys should be the real
 * section headings (from each essay's .art-body <h2>s) so coverage is auditable.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'library');
const DATA = join(LIB, 'active-reading-data.json');

const norm = (s) => (s || '').toLowerCase().replace(/&[a-z0-9#]+;/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
  .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
  .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
  .replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// section headings = <h2> inside .art-body (bounded by the .art-refs footnotes block)
function sectionHeadings(html) {
  const start = html.indexOf('class="art-body"');
  if (start === -1) return null;
  let end = html.indexOf('class="art-refs"', start);
  if (end === -1) end = html.length;
  const body = html.slice(start, end);
  const out = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = re.exec(body))) {
    const text = decode(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    if (text) out.push(text);
  }
  return out;
}

const essays = readdirSync(LIB).filter((f) => f.endsWith('.html'))
  .filter((f) => readFileSync(join(LIB, f), 'utf8').includes('class="art-body"'))
  .map((f) => f.replace(/\.html$/, ''));

const args = process.argv.slice(2);
const skeleton = args.includes('--skeleton');
const check = args.includes('--check');

if (skeleton) {
  const list = (args[args.indexOf('--skeleton') + 1] || '').split(',').map((s) => s.trim()).filter(Boolean);
  const obj = {};
  for (const slug of list) {
    const p = join(LIB, slug + '.html');
    if (!existsSync(p)) { console.error(`  ! no such essay: ${slug}`); continue; }
    const hs = sectionHeadings(readFileSync(p, 'utf8')) || [];
    obj[slug] = {};
    hs.forEach((h) => { obj[slug][h] = ''; });
  }
  console.log(JSON.stringify(obj, null, 2));
  process.exit(0);
}

const data = existsSync(DATA) ? JSON.parse(readFileSync(DATA, 'utf8')) : {};
let orphans = 0, coveredSections = 0, totalSections = 0, essaysWithData = 0;

for (const slug of essays) {
  const hs = sectionHeadings(readFileSync(join(LIB, slug + '.html'), 'utf8')) || [];
  const realNorms = new Set(hs.map(norm));
  totalSections += hs.length;
  const entry = data[slug];
  if (entry && Object.keys(entry).length) {
    essaysWithData++;
    for (const k of Object.keys(entry)) {
      if (!realNorms.has(norm(k))) { orphans++; console.error(`  ✗ ${slug}: curated key has no matching section heading: "${k}"`); }
    }
    const curatedNorms = new Set(Object.keys(entry).map(norm));
    coveredSections += hs.filter((h) => curatedNorms.has(norm(h))).length;
  }
}

console.log(`Active-reading curated coverage: ${essaysWithData}/${essays.length} essays have takeaways; ${coveredSections}/${totalSections} sections curated (rest use the first-sentence fallback).`);
if (orphans) {
  console.error(`\n✗ ${orphans} curated key(s) do not match any section heading — fix the key(s) in active-reading-data.json.`);
  if (check) process.exit(1);
}
if (check) console.log('✓ active-reading-data.json keys all match real section headings.');
