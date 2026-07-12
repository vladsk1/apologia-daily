#!/usr/bin/env node
/*
 * Builds search-index.json — the client-side index powering /search.html.
 * Sources (structured, already-certified content — no re-authoring):
 *   - Evidence Library essays  ← library/index.html  (libcard title + blurb)
 *   - Answers                  ← answers/_data.json  (question + short answer)
 *   - Glossary terms           ← glossary.html        (var TERMS array)
 *
 * Each record: { t:title, u:url, d:description, c:category, y:type }
 * Run:  node tools/build-search-index.mjs   (re-run after adding essays/answers/terms)
 * A CI check (--check) fails if the committed index is stale.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(ROOT + p, 'utf8');

// ── Evidence Library essays (from the crawlable libcard list) ──
function essays() {
  const html = read('library/index.html');
  const re = /<a class="libcard" href="([^"]+)"><span class="lt">([\s\S]*?)<\/span><span class="ld">([\s\S]*?)<\/span>/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    out.push({ t: m[2].trim(), u: m[1].trim(), d: m[3].trim(), c: 'Evidence Library', y: 'essay' });
  }
  return out;
}

// ── Answers (structured data file) ──
function answers() {
  const data = JSON.parse(read('answers/_data.json'));
  const arr = Array.isArray(data) ? data : (data.answers || Object.values(data));
  return arr
    .filter((a) => a && a.slug && a.q)
    .map((a) => ({
      t: a.q.trim(),
      u: '/answers/' + a.slug + '.html',
      d: (a.meta || '').trim(),
      c: a.category || 'Answers',
      y: 'answer',
    }));
}

// ── Glossary terms (eval the TERMS array literal from glossary.html) ──
function terms() {
  const html = read('glossary.html');
  const start = html.indexOf('var TERMS = [');
  if (start === -1) return [];
  const from = html.indexOf('[', start);
  // find the matching ']' that is followed by ';'
  let depth = 0, end = -1;
  for (let i = from; i < html.length; i++) {
    const ch = html[i];
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) return [];
  const literal = html.slice(from, end + 1);
  let list;
  try { list = new Function('return ' + literal)(); }
  catch (e) { console.error('Could not parse glossary TERMS:', e.message); return []; }
  return list
    .filter((t) => t && t.term)
    .map((t) => ({
      t: t.term.trim(),
      u: '/glossary.html',
      d: (t.preview || t.definition || '').trim(),
      c: t.tag || 'Glossary',
      y: 'term',
    }));
}

const index = [...essays(), ...answers(), ...terms()];
const json = JSON.stringify(index);

const CHECK = process.argv.includes('--check');
const OUT = 'search-index.json';
if (CHECK) {
  let current = '';
  try { current = read(OUT); } catch {}
  if (current.trim() !== json.trim()) {
    console.error(`✗ ${OUT} is stale — run: node tools/build-search-index.mjs`);
    process.exit(1);
  }
  console.log(`✓ ${OUT} is up to date (${index.length} records).`);
} else {
  writeFileSync(ROOT + OUT, json);
  const by = index.reduce((a, r) => ((a[r.y] = (a[r.y] || 0) + 1), a), {});
  console.log(`Wrote ${OUT}: ${index.length} records`, by);
}
