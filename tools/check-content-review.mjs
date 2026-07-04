#!/usr/bin/env node
/*
 * check-content-review.mjs — pipeline enforcement for site content.
 *
 * Extends the answers-layer gate (tools/gen-answers.mjs) to the rest of the
 * content that the CLAUDE.md pipeline covers: deep-dive essays, Evidence
 * Library hub fragments, reel scripts, and the live AI prompt. It verifies
 * that any NEW or CHANGED content file carries a review stamp recording that
 * BOTH the argument-soundness (apologia-argument) and orthodoxy
 * (apologia-orthodoxy) gates ran and the page was fixed to CLEAN.
 *
 * IMPORTANT — same honest caveat as the answers gate: the stamp cannot PROVE
 * the agents ran. It is a dated, auditable human assertion. Never stamp a
 * check you did not run. This tool makes an *unstamped* change impossible to
 * ship silently; it does not certify a *stamped* one.
 *
 * STAMP FORMAT
 *   HTML (essays / fragments / worldviews):
 *     <!-- content-review: {"argument":"2026-07-04","orthodoxy":"2026-07-04","by":"name"} -->
 *   JS  (api/ask.js live prompt):
 *     // content-review: {"argument":"2026-07-04","orthodoxy":"2026-07-04","by":"name"}
 *   JSON (tools/reel/specs/*.json): a top-level object field
 *     "reviewed": { "argument": "2026-07-04", "orthodoxy": "2026-07-04", "by": "name" }
 *
 * Both `argument` and `orthodoxy` must be non-empty (a date string). `argument`
 * may be null ONLY while a fix is genuinely pending — that still fails the gate,
 * by design, so it can't be forgotten.
 *
 * USAGE
 *   node tools/check-content-review.mjs <file> [<file> ...]   # check specific files
 *   node tools/check-content-review.mjs --changed [<base>]    # check files changed vs base (default origin/main)
 *   node tools/check-content-review.mjs --audit               # list every content file lacking a valid stamp
 * Exit code 0 = all checked content files are stamped; 1 = one or more are not.
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

// A file is "content" (subject to the pipeline) if it matches one of these.
// answers/*.html is intentionally excluded — it has its own gate in gen-answers.mjs.
const CONTENT_PATTERNS = [
  /^library\/(?!index\.html$).+\.html$/,   // deep-dive essays incl. mk/ es/ mirrors
  /^ev-s\d[a-z0-9.]*\.html$/,              // Evidence Library hub fragments (+ .mk/.es)
  /^worldviews\.html$/,                    // worldviews cards (Islam Case tier etc.)
  /^tools\/reel\/specs\/.+\.json$/,        // short-form reel scripts
  /^api\/ask\.js$/,                        // the live "Ask Anything" AI system prompt
];

const isContent = (p) => CONTENT_PATTERNS.some((re) => re.test(p));

const HTML_RE = /content-review:\s*(\{[^}]*\})/;
const JS_RE = /content-review:\s*(\{[^}]*\})/;

function stampFor(path) {
  // returns { ok: bool, reason: string } for a single content file
  if (!existsSync(path)) return { ok: true, reason: 'deleted (skipped)' };
  const raw = readFileSync(path, 'utf8');
  let obj = null;
  try {
    if (path.endsWith('.json')) {
      obj = JSON.parse(raw).reviewed ?? null;
    } else {
      const m = raw.match(path.endsWith('.js') ? JS_RE : HTML_RE);
      obj = m ? JSON.parse(m[1]) : null;
    }
  } catch (e) {
    return { ok: false, reason: `stamp present but unparseable (${e.message})` };
  }
  if (!obj || typeof obj !== 'object') return { ok: false, reason: 'no content-review stamp' };
  const missing = ['argument', 'orthodoxy'].filter((k) => !obj[k]);
  if (missing.length) return { ok: false, reason: `stamp missing: ${missing.join(' + ')}` };
  return { ok: true, reason: `argument ${obj.argument} · orthodoxy ${obj.orthodoxy}${obj.by ? ' · ' + obj.by : ''}` };
}

function changedFiles(base) {
  const b = base || 'origin/main';
  // added/modified (exclude deleted) between base and working tree
  const out = execSync(`git diff --name-only --diff-filter=d ${b}... 2>/dev/null; git diff --name-only --diff-filter=d`, { encoding: 'utf8' });
  return [...new Set(out.split('\n').map((s) => s.trim()).filter(Boolean))];
}

function allContentFiles() {
  return globSync('{library/**/*.html,ev-s*.html,worldviews.html,tools/reel/specs/*.json,api/ask.js}').filter(isContent);
}

// ---- main ----
const args = process.argv.slice(2);
let files;
if (args[0] === '--audit') {
  files = allContentFiles();
} else if (args[0] === '--changed') {
  files = changedFiles(args[1]).filter(isContent);
} else if (args.length) {
  files = args.filter(isContent);
} else {
  console.error('usage: check-content-review.mjs <file...> | --changed [base] | --audit');
  process.exit(2);
}

if (!files.length) {
  console.log('✓ No content files to check.');
  process.exit(0);
}

const fails = [];
for (const f of files.sort()) {
  const { ok, reason } = stampFor(f);
  console.log(`${ok ? '✓' : '⛔'} ${f}${ok ? `   (${reason})` : `   — ${reason}`}`);
  if (!ok) fails.push(f);
}

if (fails.length) {
  console.error(`\n⛔ ${fails.length} content file(s) lack a valid content-review stamp.`);
  console.error('   Run the argument (apologia-argument) + orthodoxy (apologia-orthodoxy) gates,');
  console.error('   fix to CLEAN, then add the stamp (see the format at the top of this file).');
  console.error('   Never stamp a check you did not run.\n');
  process.exit(1);
}
console.log(`\n✓ All ${files.length} checked content file(s) carry an argument+orthodoxy review stamp.`);
process.exit(0);
