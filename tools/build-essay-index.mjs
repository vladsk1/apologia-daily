#!/usr/bin/env node
/**
 * build-essay-index.mjs — turn the deep-dive essays into a retrievable, citable
 * index of paragraphs. This is the foundation for two parked goals:
 *   (1) research-grade AI: ground answers in essay paragraphs and cite each claim
 *       to an exact anchor (library/<slug>.html#p<N>);
 *   (2) the "guides" (Objection/Verse/Scholar pages) and faceted search.
 *
 * It changes NO live content — it only reads the certified essays and emits data.
 * Anchors are p<N> = the 0-based index of the <p> among the essay's .art-body
 * paragraphs, matching document order of `.art-body p`, so a companion runtime
 * (library/para-anchors.js) can assign the same ids for the links to land.
 *
 * Output:
 *   essay-index.json          [ { slug, title, section, anchor, text }, ... ]
 *   lib/essays-verified.js     export const ESSAY_PARAS = [...]  (bundled into api/ask.js)
 *   essay-slugs.json           [ "<slug>", ... ]  (tiny; the client validates citations against it)
 *
 * Usage:  node tools/build-essay-index.mjs [--check]
 *   --check exits non-zero if the outputs are out of date (for CI).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const DECODE = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&nbsp;': ' ', '&middot;': '·' };
function decode(s) { return s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&[a-z]+;|&#\d+;/gi, (m) => DECODE[m] || m); }
function stripTags(s) { return decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim(); }

// Extract the exact content of the first <div class="art-body"> ... balanced </div>.
function artBody(html) {
  const m = html.match(/<div class="art-body">/);
  if (!m) return '';
  let i = m.index + m[0].length, depth = 1;
  const re = /<div\b|<\/div>/g; re.lastIndex = i;
  let t;
  while ((t = re.exec(html))) {
    depth += t[0] === '</div>' ? -1 : 1;
    if (depth === 0) return html.slice(i, t.index);
  }
  return html.slice(i);
}

function build() {
  const rows = [];
  for (const f of readdirSync('library').filter((f) => f.endsWith('.html'))) {
    const html = readFileSync('library/' + f, 'utf8');
    if (!html.includes('class="art-body"')) continue;
    const slug = f.replace(/\.html$/, '');
    const title = stripTags((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || slug);
    const body = artBody(html);
    let section = '', pIndex = 0, div = 0;
    // Count only TOP-LEVEL paragraphs (direct children of .art-body, i.e. not nested
    // in a <div>). This matches the runtime, which anchors `.art-body > p` — so
    // JS-injected boxes (reader-help, evidence panels) never shift the numbering.
    const tok = /<div\b|<\/div>|<h2\b[^>]*>([\s\S]*?)<\/h2>|<p\b[^>]*>([\s\S]*?)<\/p>/g;
    let t;
    while ((t = tok.exec(body))) {
      if (t[0] === '</div>') { if (div > 0) div--; continue; }
      if (t[0].charAt(1) === 'd') { div++; continue; }          // <div
      if (t[1] !== undefined) { if (div === 0) section = stripTags(t[1]); continue; }
      if (div !== 0) continue;                                   // <p> nested in a div — not a top-level paragraph
      const anchor = 'p' + pIndex; pIndex++;
      const text = stripTags(t[2]);
      if (text.length < 40) continue;                            // skip labels / captions
      rows.push({ slug, title, section, anchor, text });
    }
  }
  return rows;
}

const rows = build();
const json = JSON.stringify(rows);
const slugs = [...new Set(rows.map((r) => r.slug))];
const slugsJson = JSON.stringify(slugs);
const lib = 'export const ESSAY_PARAS = ' + json + ';\n';
if (process.argv.includes('--check')) {
  let cur = ''; try { cur = readFileSync('essay-index.json', 'utf8'); } catch (e) {}
  if (cur.trim() !== json.trim()) { console.error('✗ essay-index.json is stale — run: node tools/build-essay-index.mjs'); process.exit(1); }
  console.log('✓ essay-index.json is up to date (' + rows.length + ' paragraphs)');
} else {
  writeFileSync('essay-index.json', json + '\n');
  writeFileSync('lib/essays-verified.js', lib);
  writeFileSync('essay-slugs.json', slugsJson + '\n');
  console.log(`Wrote essay-index.json, lib/essays-verified.js, essay-slugs.json: ${rows.length} paragraphs from ${slugs.length} essays.`);
}
