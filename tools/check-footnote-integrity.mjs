#!/usr/bin/env node
/*
 * check-footnote-integrity.mjs — verify the WHOLE footnote apparatus, not just the markers.
 *
 * THE HOLE THIS CLOSES, and it is not hypothetical.
 *
 * On 2026-08-07 a paragraph was added to library/islam-dilemma.html. It needed its own
 * footnote, so footnote 2 was split: the new note became 3 and notes 3-28 were renumbered
 * to 4-29 with an assert-guarded script. The script bumped every <sup>N</sup> marker. The
 * mapping was then verified — 29 markers, 29 <li>, contiguous and ascending — and declared
 * clean.
 *
 * It was not clean. Footnotes on this site CROSS-REFERENCE EACH OTHER IN PROSE:
 *
 *     "see Whittingham (note 14)"        "the scholarly survey cited in note 14"
 *     "Abdelnour ... (note 4)"           "Metzger and Ehrman ... (note 16)"
 *
 * Eleven of those pointers were left at the pre-split numbering. The damage:
 *
 *   - note 14 cited ITSELF as its own authority;
 *   - Whittingham — the specialist the essay leans on precisely to concede AGAINST its
 *     own argument — became unreachable from SIX of the places invoking him. A reader
 *     checking whether a real specialist stood behind the essay's biggest concession
 *     landed on a tafsir note about al-Tabari instead.
 *
 * Nothing in CI saw it. sup-li integrity was perfect the whole time. It was found by an
 * expensive review agent, one full gate round after it was introduced — which is precisely
 * the kind of mechanical error a script should catch for free.
 *
 * WHY THE OTHER CHECKERS DON'T COVER IT. check-content-review.mjs asks whether a file
 * carries a stamp. check-stamp-integrity.mjs asks whether doctrinal lines changed after
 * the stamp. Neither looks inside the footnote list. The repo rule "re-verify footnote
 * <sup> to <li> integrity before deploying" is real but incomplete: it names the markers
 * and is silent on the cross-references, so following it exactly still ships this bug.
 *
 * WHAT IT CHECKS, per gated HTML file that has a Footnotes <ol>:
 *   1. MARKERS      every <sup>N</sup> maps 1:1 to one <li>, contiguous 1..N, ascending.
 *   2. POINTERS     every "(note N)" / "in note N" inside the footnotes resolves to a note
 *                   that exists.
 *   3. SELF-CITES   no note points at itself.
 *   4. ORPHANS      no <li> is unreachable (defined but never called).
 *
 * ⚠ TWO THINGS A FUTURE SESSION WILL BE TEMPTED TO "SIMPLIFY" — do not.
 *   (a) Pointers appear in TWO forms: parenthesised "(note 15)" and prose "cited in note 15".
 *       A /\(note \d+\)/ regex undercounts. islam-dilemma.html has 12 pointers, only 11 of
 *       them parenthesised.
 *   (b) The bibliography is a SECOND <ol>/<ul> of <li> in the same file. Scope every count
 *       to the Footnotes list or the numbers are meaningless.
 *
 * USAGE
 *   node tools/check-footnote-integrity.mjs            # all gated files, exit 1 on failure
 *   node tools/check-footnote-integrity.mjs <file...>  # specific files
 *   node tools/check-footnote-integrity.mjs --changed  # files changed vs origin/main
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { globSync } from 'node:fs';

const GATED = ['library/*.html', 'ev-s*.html', 'ev-m-*.html', 'answers/*.html', 'worldviews.html'];

/**
 * Pull the Footnotes <ol> only — never the bibliography list that follows it.
 * Returns {html, start} so callers can bound the body scan by POSITION.
 *
 * ⚠ Do NOT go back to html.split(/Footnotes/i)[0] to find the body. The word
 * "footnotes" occurs inside the content-review stamp's `by` note on several files
 * (sessions describe their own footnote work there), so splitting on the word cuts
 * at the stamp and reports 0 markers. This tool's first run failed exactly that way,
 * on a stamp written minutes earlier by the session writing this tool.
 */
export function extractFootnoteList(html) {
  const m = /<h2[^>]*>\s*Footnotes\s*<\/h2>[\s\S]{0,200}?<ol[^>]*>([\s\S]*?)<\/ol>/i.exec(html);
  if (!m) return null;
  return { html: m[1], start: m.index };
}

/**
 * Body markers, in document order — everything before the footnote list begins.
 *
 * ⚠ EXCLUDES EXPONENTS. `10<sup>123</sup>` and `10<sup>500</sup>` are mathematics, not
 * citations, and library/finetuning.html and library/cambrian.html are full of them. A
 * <sup> preceded immediately by a digit is an exponent. Without this the tool reports
 * every fine-tuning essay as broken.
 */
export function extractMarkers(html, boundary) {
  const body = html.slice(0, boundary ?? html.length);
  return [...body.matchAll(/(.?)<sup[^>]*>(\d+)<\/sup>/g)]
    .filter((m) => !/\d/.test(m[1]))
    .map((m) => Number(m[2]));
}

/** Both pointer forms: "(note 15)" and "cited in note 15". */
export function extractPointers(listHtml) {
  const items = listHtml.match(/<li[\s\S]*?<\/li>/g) ?? [];
  const out = [];
  items.forEach((li, i) => {
    for (const m of li.matchAll(/\bnote\s+(\d+)\b/gi)) {
      out.push({ from: i + 1, to: Number(m[1]) });
    }
  });
  return out;
}

export function auditFile(path, html) {
  const found = extractFootnoteList(html);
  if (!found) return null; // no footnote apparatus — nothing to check
  const list = found.html;
  const problems = [];
  const items = list.match(/<li[\s\S]*?<\/li>/g) ?? [];
  const count = items.length;
  const markers = extractMarkers(html, found.start);

  // 1. every marker resolves to a real note; every note is called at least once.
  //    ⚠ REPEATS ARE LEGITIMATE — citing the same source twice reuses its marker, which
  //    is ordinary scholarly practice and is live on library/relations.html (notes 1, 6)
  //    and library/trinity_mormons.html (note 7). Do not "restore" a 1:1 rule here.
  const dangling = [...new Set(markers.filter((n) => n < 1 || n > count))];
  if (dangling.length) {
    problems.push(`marker(s) point at no such note: ${dangling.join(', ')} (only ${count} notes)`);
  }
  const orphans = Array.from({ length: count }, (_, i) => i + 1).filter((n) => !markers.includes(n));
  if (orphans.length) {
    problems.push(`footnote(s) defined but never called: ${orphans.join(', ')}`);
  }
  // ordering is judged on FIRST occurrence only, since repeats legitimately look backwards
  const firsts = [...new Set(markers)];
  if (JSON.stringify(firsts) !== JSON.stringify([...firsts].sort((a, b) => a - b))) {
    problems.push('footnotes are first called out of order');
  }

  // 2 + 3. internal cross-references
  for (const { from, to } of extractPointers(list)) {
    if (to > count || to < 1) {
      problems.push(`note ${from} points at note ${to}, which does not exist (only ${count} notes)`);
    } else if (to === from) {
      problems.push(`note ${from} cites ITSELF — the classic symptom of a half-finished renumber`);
    }
  }

  return { path, count, markers: markers.length, pointers: extractPointers(list).length, problems };
}

function targets(argv) {
  if (argv.includes('--changed')) {
    let base = 'origin/main';
    try { execSync(`git rev-parse --verify ${base}`, { stdio: 'ignore' }); } catch { base = 'HEAD~1'; }
    return execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf8' })
      .split('\n').filter((f) => f.endsWith('.html'));
  }
  const explicit = argv.filter((a) => !a.startsWith('--'));
  if (explicit.length) return explicit;
  return GATED.flatMap((p) => globSync(p)).filter((f) => !/\.(mk|es)\.html$/.test(f));
}

function main() {
  const files = targets(process.argv.slice(2));
  let checked = 0, failed = 0;
  for (const f of files) {
    let html;
    try { html = readFileSync(f, 'utf8'); } catch { continue; }
    const r = auditFile(f, html);
    if (!r) continue;
    checked++;
    if (r.problems.length) {
      failed++;
      console.error(`\n✗ ${f}  (${r.count} notes, ${r.markers} markers, ${r.pointers} internal pointers)`);
      for (const p of r.problems) console.error(`    ${p}`);
    }
  }
  if (failed) {
    console.error(`\n✗ Footnote integrity: ${failed} of ${checked} file(s) broken.`);
    console.error('  A renumber must rewrite the markers AND the "(note N)" cross-references in the footnote prose.');
    process.exit(1);
  }
  console.log(`✓ Footnote integrity: ${checked} file(s) checked, markers and internal cross-references all resolve.`);
}

// guard the CLI body: importing this module must not exit the importer.
// (check-retired-claims.mjs learned this the hard way — an unguarded process.exit
//  silently collapsed the test suite from 90 tests to 76, all green.)
if (import.meta.url === `file://${process.argv[1]}`) main();
