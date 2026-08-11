#!/usr/bin/env node
/**
 * check-mirror-parity.mjs — translated-mirror drift guard.
 *
 * WHY THIS EXISTS (2026-08-11). While gating `ev-s3.html` card 06, four review
 * rounds fixed a falsifiable claim about the Greek preposition `pros`, an
 * unfenced Philo/syncretism passage, and a say-aloud line — and every one of
 * those defects was STILL LIVE, verbatim, in `ev-s3.mk.html`. Nothing flagged
 * it. It surfaced only because one reviewer happened to open the mirror on its
 * own initiative, three rounds in.
 *
 * That is the exact failure `CLAUDE.md` already names for the English surfaces
 * ("the fix must reach every served surface, not just the essay") — but every
 * existing guard is blind to it. `check-retired-claims.mjs` matches English
 * regexes, so a retired claim survives translation untouched.
 * `check-stamp-integrity.mjs` compares a file to its OWN stamp, so a mirror
 * that nobody edits never looks stale. A doctrinal gate reads the file it is
 * given. None of them compares a source with its translation.
 *
 * WHAT IT DOES. Given a commit range, it finds every English source file that
 * changed and whose translated mirror did NOT change in the same range, and
 * reports the pair. That is the cheap, mechanical half of the problem — it
 * cannot read Macedonian or Spanish and makes no attempt to. A flag means
 * "these two files have diverged; a human or a translation pass must decide,"
 * never "the translation is wrong."
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It does not diff content across languages,
 * does not score translation quality, and does not fail on a mirror that is
 * merely OLDER than its source — translations legitimately lag, and a guard
 * that cries wolf gets ignored (see the `check-stamp-integrity` history in
 * CLAUDE.md, which reached 59 unread flags). It fires only on a change that
 * lands on one side of a pair within the range being checked.
 *
 * ACCEPTING A DELIBERATE LAG. Record it in `tools/mirror-parity-ledger.json`
 * with a reason and the source commit the mirror is known to lag behind, or run
 * `--update` to record every current divergence at once. Same accept-on-record
 * pattern as `orthodoxy-tripwires-baseline.json` and `answer-openings-baseline.json`.
 *
 * USAGE
 *   node tools/check-mirror-parity.mjs                 # vs origin/main, blocking
 *   node tools/check-mirror-parity.mjs --warn          # report only, exit 0 (CI default)
 *   node tools/check-mirror-parity.mjs --base <ref>    # compare against another ref
 *   node tools/check-mirror-parity.mjs --audit         # every pair + last-touched dates
 *   node tools/check-mirror-parity.mjs --update        # accept current divergences on record
 *
 * ⚠ The CLI body is guarded (see the bottom of this file). Importing this
 * module must never call process.exit — doing so in a sibling tool once
 * collapsed the whole node:test suite from 90 tests to 76, all green.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = path.join(REPO, 'tools', 'mirror-parity-ledger.json');

/**
 * Mirror layouts in this repo, as of 2026-08-11:
 *   ev-sN.html          -> ev-sN.mk.html            (sibling, infix locale)
 *   library/foo.html    -> library/mk/foo.html      (locale subdirectory)
 *                       -> library/es/foo.html
 * Add a rule here when a new mirrored surface appears; the shape is
 * { locales, mirrorsOf(sourcePath) -> [mirrorPath] } and paths are repo-relative.
 */
const LOCALES = ['mk', 'es'];

export function mirrorsOf(file) {
  // ev-s3.html -> ev-s3.mk.html   (never treat an existing mirror as a source)
  const evMatch = /^ev-s(\d+)\.html$/.exec(file);
  if (evMatch) return LOCALES.map((l) => `ev-s${evMatch[1]}.${l}.html`);

  // library/foo.html -> library/{mk,es}/foo.html
  const libMatch = /^library\/([^/]+\.html)$/.exec(file);
  if (libMatch) return LOCALES.map((l) => `library/${l}/${libMatch[1]}`);

  return [];
}

export function isMirror(file) {
  return /^ev-s\d+\.(mk|es)\.html$/.test(file) || /^library\/(mk|es)\//.test(file);
}

function git(args, { allowFail = false } = {}) {
  try {
    return execSync(`git ${args}`, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    if (allowFail) return '';
    throw err;
  }
}

function resolveBase(requested) {
  const candidates = requested ? [requested] : ['origin/main', 'main'];
  for (const ref of candidates) {
    if (git(`rev-parse --verify --quiet ${ref}`, { allowFail: true })) return ref;
  }
  return null;
}

function loadLedger() {
  if (!existsSync(LEDGER)) return { accepted: {} };
  try {
    const parsed = JSON.parse(readFileSync(LEDGER, 'utf8'));
    return parsed && typeof parsed === 'object' ? { accepted: parsed.accepted || {} } : { accepted: {} };
  } catch {
    return { accepted: {} };
  }
}

/**
 * Core check. Pure enough to unit-test: pass an explicit `changedFiles` list and
 * it will not shell out to git at all.
 */
export function findDivergences({ changedFiles, existsCheck = (f) => existsSync(path.join(REPO, f)) }) {
  const changed = new Set(changedFiles);
  const out = [];
  for (const file of changedFiles) {
    if (isMirror(file)) continue;
    for (const mirror of mirrorsOf(file)) {
      if (!existsCheck(mirror)) continue;      // no mirror for this page yet — not a divergence
      if (changed.has(mirror)) continue;        // both sides moved together — correct
      out.push({ source: file, mirror });
    }
  }
  return out;
}

function runCli(argv) {
  const warnOnly = argv.includes('--warn');
  const audit = argv.includes('--audit');
  const update = argv.includes('--update');
  const baseIdx = argv.indexOf('--base');
  const requestedBase = baseIdx !== -1 ? argv[baseIdx + 1] : null;

  if (audit) {
    const sources = git('ls-files "ev-s*.html" "library/*.html"')
      .split('\n')
      .filter((f) => f && !isMirror(f));
    let pairs = 0;
    console.log('Mirror pairs (source last-touched vs mirror last-touched):\n');
    for (const src of sources) {
      for (const mirror of mirrorsOf(src)) {
        if (!existsSync(path.join(REPO, mirror))) continue;
        pairs++;
        const srcDate = git(`log -1 --format=%cs -- ${src}`, { allowFail: true }) || '?';
        const mirDate = git(`log -1 --format=%cs -- ${mirror}`, { allowFail: true }) || '?';
        const stale = srcDate !== '?' && mirDate !== '?' && mirDate < srcDate;
        console.log(`  ${stale ? '⚠' : ' '} ${src}  ${srcDate}   ->   ${mirror}  ${mirDate}`);
      }
    }
    console.log(`\n${pairs} mirror pair(s). A ⚠ here is informational — translations lag by design.`);
    return 0;
  }

  const base = resolveBase(requestedBase);
  if (!base) {
    console.log('✓ Mirror parity: no base ref to compare against (skipped).');
    return 0;
  }

  const mergeBase = git(`merge-base HEAD ${base}`, { allowFail: true }) || base;
  const changedFiles = git(`diff --name-only ${mergeBase} HEAD`, { allowFail: true })
    .split('\n')
    .filter(Boolean);

  const divergences = findDivergences({ changedFiles });
  const ledger = loadLedger();

  if (update) {
    const accepted = { ...ledger.accepted };
    for (const d of divergences) {
      accepted[`${d.source} -> ${d.mirror}`] = {
        acceptedAt: git('log -1 --format=%cs', { allowFail: true }) || 'unknown',
        sourceCommit: git('rev-parse --short HEAD', { allowFail: true }),
        reason: 'RECORD A REASON HERE — why this mirror may lag its source.',
      };
    }
    writeFileSync(LEDGER, `${JSON.stringify({ accepted }, null, 2)}\n`);
    console.log(`Recorded ${divergences.length} divergence(s) in tools/mirror-parity-ledger.json.`);
    console.log('⚠ Fill in the "reason" field for each before committing — an unexplained');
    console.log('  accept is how a documented hole becomes an undocumented one.');
    return 0;
  }

  const live = divergences.filter((d) => !ledger.accepted[`${d.source} -> ${d.mirror}`]);

  if (live.length === 0) {
    const n = changedFiles.filter((f) => !isMirror(f) && mirrorsOf(f).length).length;
    console.log(`✓ Mirror parity: ${n} mirrored source file(s) changed vs ${base}; every mirror moved with its source.`);
    return 0;
  }

  console.log(`✗ Mirror parity: ${live.length} source file(s) changed without their translated mirror.\n`);
  for (const d of live) {
    console.log(`  ${d.source}`);
    console.log(`    mirror unchanged: ${d.mirror}`);
  }
  console.log('\n  A fix that lands only in English leaves the retired claim live in translation.');
  console.log('  Options: update the mirror in this commit; delete the affected mirror passage');
  console.log('  (absent beats wrong on an ungated surface); or accept on record with --update');
  console.log('  and a written reason. Do NOT hand-write translated doctrinal prose that no');
  console.log('  native reviewer will gate — see docs/STATEMENT_OF_FAITH.md, which still logs');
  console.log('  Macedonian and Spanish doctrinal review as outstanding.');

  return warnOnly ? 0 : 1;
}

// ⚠ CLI guard — see the header note. Never let an import run this.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(runCli(process.argv.slice(2)));
}
