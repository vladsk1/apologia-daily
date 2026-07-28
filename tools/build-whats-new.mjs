#!/usr/bin/env node
/**
 * build-whats-new.mjs — generate the What's New feed from the review stamps.
 *
 * WHY: whats-new.html is linked from the nav on all ~319 pages, and its ENTRIES
 * list was hand-maintained. The page's own comment says adding an entry "takes
 * about 30 seconds" — but nobody has, so it sat on 5 items from 2026-06-15 while
 * roughly 100 answers, dozens of essays and several features shipped. A stale
 * changelog on every page advertises a dead project, which is worse than none.
 *
 * SOURCE OF TRUTH — and its honest limit. Dates come from the content-review
 * stamps: the `orthodoxy` date in each `library/*.html` stamp and in each
 * `answers/_data.json` entry's `reviewed` object. Git add-dates were considered
 * and rejected: this repository's history was squashed/imported, so 216 of 226
 * content files share a single add-date and would produce a fake changelog.
 *
 * The stamp date is when a page was last CERTIFIED, not first published, so a
 * re-gated older essay legitimately resurfaces. That is why the page is framed
 * as "added and updated" rather than "new" — the wording matches what the data
 * can actually support.
 *
 * Usage:
 *   node tools/build-whats-new.mjs           # rewrite the generated block
 *   node tools/build-whats-new.mjs --check   # CI: fail if stale
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = path.join(ROOT, 'whats-new.html');
const START = '    /* whats-new:start */';
const END = '    /* whats-new:end */';
const MAX_ENTRIES = 14;

const esc = (s) => String(s)
  .replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  .replace(/[‘’]/g, (m) => (m === '‘' ? '\\u2018' : '\\u2019'))
  .replace(/[“”]/g, (m) => (m === '“' ? '\\u201c' : '\\u201d'))
  .replace(/—/g, '\\u2014').replace(/–/g, '\\u2013')
  .replace(/\s+/g, ' ').trim();

/* Decode HTML entities. Source titles and meta descriptions are HTML, so they
   carry &mdash;, &quot;, &ldquo; and friends. The page renders each entry through
   escapeHtml(), which turns the leading & into &amp; — so an undecoded entity
   reaches the reader as the literal text "&mdash;". Decode here so the JS string
   holds real characters and escapeHtml() has nothing to mangle.
   &amp; MUST be decoded last, or "&amp;mdash;" would wrongly become an em dash. */
function decodeEntities(str) {
  const NAMED = {
    mdash: '\u2014', ndash: '\u2013', hellip: '\u2026', nbsp: ' ',
    lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201c', rdquo: '\u201d',
    quot: '"', apos: "'", lt: '<', gt: '>',
  };
  return String(str)
    .replace(/&([a-zA-Z]+);/g, (m, name) => (name in NAMED ? NAMED[name] : m))
    .replace(/&#x([0-9a-fA-F]+);/g, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&');
}

/** Trim a page <title> down to the human part. */
function cleanTitle(t) {
  return t.replace(/\s*[|—–-]\s*Apologia Daily.*$/i, '').trim();
}

/** First sentence of a meta description, capped. */
function shortDesc(s, cap = 165) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (t.length <= cap) return t;
  const cut = t.slice(0, cap);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return (stop > 60 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, '')) + (stop > 60 ? '' : '…');
}

function essays() {
  const out = [];
  for (const f of readdirSync(path.join(ROOT, 'library')).filter((n) => n.endsWith('.html'))) {
    if (f === 'index.html' || /\.(mk|es)\.html$/.test(f)) continue;   // hubs and translations
    const src = readFileSync(path.join(ROOT, 'library', f), 'utf8');
    const stamp = src.match(/<!--\s*content-review:\s*(\{[\s\S]*?\})\s*-->/);
    if (!stamp) continue;
    let date;
    try { date = JSON.parse(stamp[1]).orthodoxy; } catch { continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) continue;
    const title = (src.match(/<title>([^<]+)</) || [])[1];
    const desc = (src.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    if (!title) continue;
    out.push({
      date, type: 'argument', title: decodeEntities(cleanTitle(title)),
      desc: decodeEntities(shortDesc(desc)) || 'A full deep dive, with sources.',
      link: `library/${f}`, cta: 'Read the deep dive',
    });
  }
  return out;
}

function answers() {
  const data = JSON.parse(readFileSync(path.join(ROOT, 'answers', '_data.json'), 'utf8'));
  const rows = Array.isArray(data) ? data : (data.answers || []);
  return rows.flatMap((a) => {
    const date = a && a.reviewed && a.reviewed.orthodoxy;
    if (!a || !a.slug || !a.q || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return [];
    return [{
      date, type: 'objection', title: decodeEntities(a.q),
      desc: decodeEntities(shortDesc((a.meta && a.meta.description) || a.q)),
      link: `answers/${a.slug}.html`, cta: 'Read the answer',
    }];
  });
}

/* Cap how many entries may share one date. Content is gated in batches -- a
   single re-gate afternoon stamped 13 essays -- so a naive "newest first" feed
   shows one day's work and nothing else. Capping per date makes the page span
   several weeks and mixes essays with answers, which is both more useful and a
   truer picture of what has been happening. */
const PER_DATE_CAP = 4;
const perDate = new Map();
const all = [...essays(), ...answers()]
  // newest first; stable tiebreak on title so the output can't churn between runs
  .sort((x, y) => (y.date.localeCompare(x.date)) || x.title.localeCompare(y.title))
  .filter((e) => {
    const n = (perDate.get(e.date) || 0) + 1;
    perDate.set(e.date, n);
    return n <= PER_DATE_CAP;
  })
  .slice(0, MAX_ENTRIES);

if (!all.length) {
  console.error('✗ no stamped content found — refusing to write an empty feed.');
  process.exit(1);
}

const rendered = all.map((e) =>
  `      { date: '${e.date}',\n` +
  `        type: '${e.type}',\n` +
  `        title: '${esc(e.title)}',\n` +
  `        desc: '${esc(e.desc)}',\n` +
  `        link: '${e.link}',\n` +
  `        cta: '${e.cta}' },`
).join('\n\n');

const block = `${START}\n${rendered}\n${END}`;

const page = readFileSync(PAGE, 'utf8');
const s = page.indexOf(START), e = page.indexOf(END);
if (s === -1 || e === -1) {
  console.error(`✗ markers not found in whats-new.html — expected ${START.trim()} … ${END.trim()}`);
  process.exit(1);
}
const next = page.slice(0, s) + block + page.slice(e + END.length);

if (process.argv.includes('--check')) {
  if (next !== page) {
    console.error('✗ whats-new.html is stale. Run: node tools/build-whats-new.mjs');
    process.exit(1);
  }
  console.log(`✓ whats-new.html is up to date (${all.length} entries, newest ${all[0].date}).`);
} else {
  writeFileSync(PAGE, next);
  console.log(`✓ whats-new.html rebuilt: ${all.length} entries, newest ${all[0].date}.`);
}
