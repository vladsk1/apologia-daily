#!/usr/bin/env node
/* sync-date-modified.mjs — keep each page's JSON-LD `dateModified` in step with its
 * content-review stamp, so search engines and AI answer engines are not told a
 * freshly re-reviewed essay is months old.
 *
 * WHY THIS EXISTS. `dateModified` is the freshness signal crawlers read, and AI
 * citation weights freshness heavily (docs/MARKET_RESEARCH_2026-09-03.md §1.2).
 * It was hand-maintained and nobody bumped it on re-review: on 2026-09-23 all 93
 * library essays that carry both fields showed a `dateModified` OLDER than their
 * latest review (e.g. library/manuscript.html: reviewed 2026-08-29, schema said
 * 2026-06-28). The visible "Reviewed & current" badge (library/reviewed-badge.js)
 * was right; only the machine-readable date was stale.
 *
 * THE RULE. The review date is the MOST RECENT of the stamp's argument /
 * orthodoxy / neutrality / citations dates — the same rule reviewed-badge.js uses,
 * so the badge and the schema can never disagree. `dateModified` must be on or
 * after it. A later `dateModified` is left alone (a non-doctrinal edit after the
 * review is a real modification). Pages without a stamp or without a
 * `dateModified` are skipped — this tool never invents either.
 *
 * Run:   node tools/sync-date-modified.mjs          (rewrite stale dates in place)
 *        node tools/sync-date-modified.mjs --check  (CI: exit 1 if any are stale)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const CHECK = process.argv.includes('--check');
const STAMP_RE = /content-review:\s*(\{[^}]*\})/;
const DATE_MOD_RE = /("dateModified"\s*:\s*")(\d{4}-\d{2}-\d{2})(")/g;
const LENSES = ['argument', 'orthodoxy', 'neutrality', 'citations'];

/** Latest lens date in a stamp object, or null. Takes the first YYYY-MM-DD in each
 *  lens value, so a value like "2026-07-29 (see note)" still reads correctly. */
export function latestReviewDate(stamp) {
  const dates = LENSES
    .map((k) => (typeof stamp?.[k] === 'string' ? stamp[k].match(/\d{4}-\d{2}-\d{2}/) : null))
    .filter(Boolean)
    .map((m) => m[0]);
  return dates.length ? dates.sort().at(-1) : null;
}

/** Returns { html, stale: [{from,to}] } with every stale dateModified raised to `review`. */
export function syncHtml(html, review) {
  const stale = [];
  const out = html.replace(DATE_MOD_RE, (m, pre, date, post) => {
    if (date >= review) return m;
    stale.push({ from: date, to: review });
    return pre + review + post;
  });
  return { html: out, stale };
}

function main() {
  const files = execSync("git ls-files '*.html'", { encoding: 'utf8' }).split('\n').filter(Boolean);
  const report = [];
  let checked = 0;
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('"dateModified"')) continue;
    const m = html.match(STAMP_RE);
    if (!m) continue;
    let stamp;
    try { stamp = JSON.parse(m[1]); } catch { continue; } // unparseable stamps are check-content-review's job
    const review = latestReviewDate(stamp);
    if (!review) continue;
    checked++;
    const { html: out, stale } = syncHtml(html, review);
    if (!stale.length) continue;
    report.push({ file, from: stale[0].from, to: review });
    if (!CHECK) writeFileSync(file, out);
  }

  if (!report.length) {
    console.log(`✓ dateModified: all ${checked} stamped pages are on or after their latest review date.`);
    return;
  }
  const verb = CHECK ? 'STALE' : 'updated';
  console.log(`dateModified ${verb} on ${report.length} of ${checked} stamped pages:`);
  for (const r of report) console.log(`  ${r.file}: ${r.from} -> ${r.to}`);
  if (CHECK) {
    console.error('\nFix: node tools/sync-date-modified.mjs   (then commit the result)');
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('sync-date-modified.mjs')) main();
