#!/usr/bin/env node
/* update-sitemap-lastmod.mjs — set each sitemap <lastmod> to the file's real
 * last-commit date (git), so lastmod stops lying. Maps a <loc> URL back to a
 * file on disk, reads `git log -1 --format=%cs`, and rewrites the date in place.
 * URLs that don't resolve to a tracked file keep their existing lastmod.
 * Run: node tools/update-sitemap-lastmod.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SITEMAP = 'sitemap.xml';
const ORIGIN = 'https://apologiadaily.com';
// vercel.json rewrites: pretty URL -> file
const REWRITES = { '/today': 'today.html', '/join': 'join.html' };

function locToFile(loc) {
  let p = loc.replace(ORIGIN, '');
  if (REWRITES[p]) return REWRITES[p];
  if (p === '' || p === '/') return 'index.html';
  p = p.replace(/^\//, '');
  if (p.endsWith('/')) p += 'index.html';          // /answers/ -> answers/index.html
  else if (!p.includes('.')) p += '.html';          // /foo -> foo.html (defensive)
  return p;
}

const gitDateCache = {};
function gitDate(file) {
  if (file in gitDateCache) return gitDateCache[file];
  let d = null;
  try {
    d = execSync(`git log -1 --format=%cs -- "${file}"`, { encoding: 'utf8' }).trim() || null;
  } catch (e) { d = null; }
  return (gitDateCache[file] = d);
}

let xml = readFileSync(SITEMAP, 'utf8');
let updated = 0, unresolved = 0, unchanged = 0;
const misses = [];

xml = xml.replace(/<loc>([^<]+)<\/loc><lastmod>([0-9-]+)<\/lastmod>/g, (m, loc, old) => {
  const file = locToFile(loc);
  if (!existsSync(file)) { unresolved++; misses.push(loc); return m; }
  const d = gitDate(file);
  if (!d) { unresolved++; misses.push(loc); return m; }
  if (d === old) { unchanged++; return m; }
  updated++;
  return `<loc>${loc}</loc><lastmod>${d}</lastmod>`;
});

writeFileSync(SITEMAP, xml);
console.log(`sitemap lastmod: ${updated} updated · ${unchanged} already current · ${unresolved} unresolved`);
if (misses.length) console.log('  unresolved (kept old date):\n    ' + misses.slice(0, 20).join('\n    '));
