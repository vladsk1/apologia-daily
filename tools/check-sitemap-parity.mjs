#!/usr/bin/env node
/**
 * check-sitemap-parity.mjs — sitemap coverage guard for indexable content.
 *
 * WHY THIS EXISTS (2026-08-24). `library/legacy.html` was a live, certified,
 * self-canonical essay that had silently fallen out of `sitemap.xml` when the
 * ev-s8 tab was rebuilt — a certified page Google could only reach via stray
 * cross-links, with no coverage signal and nothing to catch it. An SEO audit
 * found it by hand. Nothing mechanical guarded "every indexable content page
 * is actually in the sitemap," so a new essay or answer page can ship missing
 * from the sitemap and nobody notices until traffic doesn't come.
 *
 * WHAT IT DOES. For the two indexable content trees — `library/*.html` (the
 * deep-dive essays) and `answers/*.html` (the flywheel) — it asserts that every
 * page which is genuinely indexable is present in `sitemap.xml`, and that every
 * library/answers URL in the sitemap still exists on disk (no stale entries).
 *
 * A page is treated as indexable UNLESS one of these deliberately excludes it:
 *   - it canonicalises to a DIFFERENT url (e.g. a page consolidated onto another
 *     — Google is told not to index it, so it needn't be in the sitemap);
 *   - it is the `source` of a redirect in `vercel.json` (retired / moved — it
 *     301s away and must NOT be in the sitemap). This is why retiring a page via
 *     a vercel redirect automatically satisfies this guard with no allowlist.
 *
 * Scope is deliberately the two content trees only — not every .html file — so
 * app shells, demos, and the JS-loaded `ev-s*` fragments don't create noise. A
 * guard that cries wolf gets ignored (see the check-stamp-integrity history).
 *
 * Exit 0 = clean; exit 1 = at least one indexable page missing, or a stale
 * sitemap entry. Run: node tools/check-sitemap-parity.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

const ORIGIN = 'https://apologiadaily.com';

function sitemapLocs() {
  const xml = readFileSync('sitemap.xml', 'utf8');
  const set = new Set();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) set.add(m[1].trim());
  return set;
}

function redirectSources() {
  // Any page that 301s away in vercel.json is intentionally out of the sitemap.
  const set = new Set();
  try {
    const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'));
    for (const r of (cfg.redirects || [])) if (r.source) set.add(r.source);
  } catch { /* no vercel.json → no redirect exclusions */ }
  return set;
}

function canonicalOf(html) {
  const m = html.match(/rel="canonical"\s+href="([^"]+)"/i);
  return m ? m[1].trim() : null;
}

export function runSitemapParity() {
  const locs = sitemapLocs();
  const redirects = redirectSources();
  const files = globSync('{library/*.html,answers/*.html}').filter((f) => !f.endsWith('/index.html'));

  const missing = [];   // indexable, on disk, but absent from sitemap
  const excluded = [];  // deliberately skipped (reason recorded)

  for (const f of files) {
    const url = `${ORIGIN}/${f}`;
    const route = `/${f}`;
    const html = readFileSync(f, 'utf8');

    if (redirects.has(route)) { excluded.push(`${f}  (redirected in vercel.json)`); continue; }
    const canon = canonicalOf(html);
    if (canon && canon !== url) { excluded.push(`${f}  (canonical → ${canon})`); continue; }

    if (!locs.has(url)) missing.push(f);
  }

  // Stale: a library/answers URL advertised in the sitemap whose file is gone.
  const stale = [];
  for (const loc of locs) {
    if (!loc.startsWith(`${ORIGIN}/library/`) && !loc.startsWith(`${ORIGIN}/answers/`)) continue;
    const rel = loc.slice(ORIGIN.length + 1);
    if (rel.startsWith('library/mk/') || rel.startsWith('library/es/')) continue; // mirrors tracked elsewhere
    if (!existsSync(rel)) stale.push(loc);
  }

  return { missing, stale, excluded, checked: files.length };
}

// ── CLI ──
if (import.meta.url === `file://${process.argv[1]}`) {
  const { missing, stale, excluded, checked } = runSitemapParity();
  const verbose = process.argv.includes('--audit');
  if (verbose) {
    console.log(`Checked ${checked} library/answers page(s).`);
    for (const e of excluded) console.log(`  · excluded: ${e}`);
  }
  let bad = false;
  if (missing.length) {
    bad = true;
    console.error(`✗ ${missing.length} indexable page(s) MISSING from sitemap.xml:`);
    for (const f of missing) console.error(`    ${f}`);
    console.error(`  Fix: add each to sitemap.xml, OR (if retired) redirect it in vercel.json, OR canonicalise it elsewhere.`);
  }
  if (stale.length) {
    bad = true;
    console.error(`✗ ${stale.length} sitemap URL(s) with NO file on disk (stale):`);
    for (const u of stale) console.error(`    ${u}`);
    console.error(`  Fix: remove the stale <url> block from sitemap.xml.`);
  }
  if (!bad) console.log(`✓ Sitemap parity: all ${checked} indexable library/answers page(s) are in sitemap.xml; no stale entries.`);
  process.exit(bad ? 1 : 0);
}
