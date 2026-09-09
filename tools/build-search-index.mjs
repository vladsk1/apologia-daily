#!/usr/bin/env node
/*
 * Builds search-index.json — the client-side index powering /search.html.
 * Sources (structured, already-certified content — no re-authoring):
 *   - Evidence Library essays  ← library/index.html  (libcard title + blurb)
 *   - Mastery pages            ← ev-m-*.html          (<title> + meta description)
 *   - Answers                  ← answers/_data.json  (question + short answer)
 *   - Feature / tool pages     ← FEATURE_PAGES list   (<title> + meta description)
 *   - Glossary terms           ← glossary.html        (var TERMS array)
 *
 * Titles/descriptions for the HTML-sourced records are read from each page's
 * own <title> and <meta name="description"> — no copy is re-authored here, so a
 * page's search entry can never drift from the page. (Usability item 13.)
 *
 * Each record: { t:title, u:url, d:description, c:category, y:type }
 * type y ∈ essay | mastery | answer | feature | term
 * Run:  node tools/build-search-index.mjs   (re-run after adding essays/answers/terms)
 * A CI check (--check) fails if the committed index is stale.
 */
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// fileURLToPath (not .pathname) so this works on Windows too — .pathname yields
// a broken "/C:/…%20…" path (leading slash + undecoded spaces) on win32.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
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

// ── shared: pull a page's own <title> + meta description, cleaned ──
const ENT = { '&amp;': '&', '&#38;': '&', '&mdash;': '—', '&ndash;': '–',
  '&#8212;': '—', '&#8211;': '–', '&rsquo;': '’', '&lsquo;': '‘',
  '&#8217;': '’', '&#39;': "'", '&#x27;': "'", '&apos;': "'", '&quot;': '"',
  '&ldquo;': '“', '&rdquo;': '”', '&nbsp;': ' ', '&hellip;': '…' };
function decode(s) {
  return (s || '')
    .replace(/<[^>]+>/g, '')                                  // strip any stray tags
    .replace(/&#x?[0-9a-f]+;|&[a-z]+;/gi, (m) => ENT[m.toLowerCase()] ?? ENT[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}
function pageMeta(html) {
  const t = html.match(/<title>([\s\S]*?)<\/title>/i);
  const d = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  // drop the " | Apologia Daily" (or "— Apologia Daily") site suffix from titles
  const title = decode(t ? t[1] : '').replace(/\s*[|–—-]\s*Apologia Daily\s*$/i, '');
  return { title, desc: decode(d ? d[1] : '') };
}

// ── Mastery pages (ev-m-*.html) — each reads its own <title> + meta desc ──
function mastery() {
  const out = [];
  for (const f0 of globSync('ev-m-*.html')) {
    const f = f0.replace(/\\/g, '/');
    const { title, desc } = pageMeta(read('/' + f));
    if (!title) continue;
    out.push({ t: title, u: '/' + f, d: desc, c: 'Mastery Track', y: 'mastery' });
  }
  return out.sort((a, b) => a.t.localeCompare(b.t));
}

// ── Feature / tool pages — a curated list of destinations a reader might search
// for by name. Only the LIST (file + category) is maintained here; the title and
// blurb are read from each page's own <title>/<meta>, so they cannot drift. ──
const FEATURE_PAGES = [
  ['games.html', 'Practice'], ['flashcards.html', 'Practice'], ['daily-quiz.html', 'Practice'],
  ['daily-mix.html', 'Practice'], ['speed-round.html', 'Practice'], ['who-said-it.html', 'Practice'],
  ['challenge.html', 'Practice'], ['objection-deck.html', 'Practice'], ['objection-catcher.html', 'Practice'],
  ['palace.html', 'Practice'], ['explain-it-back.html', 'Practice'], ['conversation-journal.html', 'Practice'],
  ['name-the-heresy.html', 'Practice'],
  ['evidence-library.html', 'Guides & Tools'], ['worldviews.html', 'Guides & Tools'],
  ['pocket-cards.html', 'Guides & Tools'], ['debate-arena.html', 'Guides & Tools'],
  ['daily-devotional.html', 'Guides & Tools'], ['study-plans.html', 'Guides & Tools'],
  ['beginners-path.html', 'Guides & Tools'], ['today.html', 'Guides & Tools'],
  ['coach.html', 'Guides & Tools'], ['scholars.html', 'Guides & Tools'],
  ['ask-anything.html', 'Guides & Tools'],
];
function features() {
  const out = [];
  for (const [f, cat] of FEATURE_PAGES) {
    let html;
    try { html = read('/' + f); } catch { continue; }   // skip a missing page rather than break the build
    const { title, desc } = pageMeta(html);
    if (!title) continue;
    out.push({ t: title, u: '/' + f, d: desc, c: cat, y: 'feature' });
  }
  return out;
}

const index = [...essays(), ...mastery(), ...answers(), ...features(), ...terms()];
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
