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

// A file is "content" (subject to the BLOCKING gate) if it matches one of these.
// answers/*.html is intentionally excluded — it has its own gate in gen-answers.mjs.
const CONTENT_PATTERNS = [
  /^library\/(?!index\.html$).+\.html$/,   // deep-dive essays incl. mk/ es/ mirrors
  /^ev-s\d[a-z0-9.]*\.html$/,              // Evidence Library hub fragments (+ .mk/.es)
  /^ev-m-.+\.html$/,                       // Evidence Library mastery pages (all 67, gated 2026-07-29)
  /^worldviews\.html$/,                    // worldviews cards (Islam Case tier etc.)
  /^tools\/reel\/specs\/.+\.json$/,        // short-form reel scripts
  /^tools\/reel\/xcards\/.+\.json$/,       // X / social share-cards. CLAUDE.md's standing
                                           // share-card rule has always called these gated
                                           // content (argument+orthodoxy, +neutrality for
                                           // deity/Trinity/Islam) — but they were never in
                                           // this list, so nothing enforced it. Added
                                           // 2026-08-11. Only CHANGED files are gated, so
                                           // the 6 known-unstamped specs are caught the
                                           // next time one is touched, as designed.
  /^api\/(ask|debate|feedback|tutor|devotional)\.js$/,  // live AI system prompts: Ask, the Debate
                                           // personas, debate/conversation scoring + coaching,
                                           // the Evidence Library tutor + grader, and the
                                           // devotional reflection prompt. Added 2026-08-10:
                                           // all five hold doctrinal instructions and only
                                           // ask.js was ever gated.
  /^lib\/crisis\.js$/,                     // CRISIS_REPLY — served verbatim to someone in crisis
];

const isContent = (p) => CONTENT_PATTERNS.some((re) => re.test(p));

/* ────────────────────────────────────────────────────────────────────────────
   THE AUDIT SCOPE — inverted default.

   WHY THIS EXISTS. CONTENT_PATTERNS is an ENUMERATION: it lists what IS gated,
   so anything nobody remembered to add is invisible. That is not hypothetical —
   on 2026-07-28 it emerged that `pocket-cards.html` (70 compressed doctrinal
   arguments, built to be exported as images) had never been reviewed, because it
   was not on the list. Gating it revealed 23 blocking findings. The audit that
   followed found 105 unstamped user-facing pages, including 63 `ev-m-*` mastery
   pages averaging ~2,100 words each — one of which, `ev-m-shema.html`, was
   publishing the very echad "composite unity" argument that `library/shema.html`
   calls a discredited overreach.

   CLAUDE.md says "there is no such thing as content too small to gate." That rule
   was implemented as a list of six things. The gap between the rule and the list
   is where those pages lived.

   So the audit inverts the default: EVERYTHING user-facing needs a stamp unless
   it appears in EXEMPT below WITH A REASON. Adding a page no longer requires
   anyone to remember; skipping one requires them to justify it in writing.
   ──────────────────────────────────────────────────────────────────────────── */
const USER_FACING = [
  /^[^/]+\.html$/,                          // every page served at the site root
  /^library\/.+\.html$/,                    // essays + the library hub
  /^tools\/reel\/(specs|xcards)\/.+\.json$/, // reel scripts AND X share-cards
  /^api\/ask\.js$/,
];

/* Exempt = no doctrinal content of its own. Each entry states why, so a reader
   can challenge the judgement. A page that RENDERS gated content (rather than
   asserting anything itself) is exempt; a page that makes claims is not. */
const EXEMPT = new Map([
  // Legal / policy — reviewed by a human for accuracy, not for doctrine.
  ['privacy.html', 'legal text, no doctrinal claims'],
  ['terms.html', 'legal text, no doctrinal claims'],
  // Authentication and account plumbing — forms only.
  ['login.html', 'auth form'],
  ['signup.html', 'auth form'],
  ['update-password.html', 'auth form'],
  ['join.html', 'invite redemption form'],
  // Operator-only, excluded from the app bundle and not linked publicly.
  ['monitor.html', 'operator dashboard, not public content'],
  // Shells: the doctrinal content they display is gated at its source.
  ['dashboard.html', 'app shell; renders gated content'],
  ['today.html', 'shell; renders the gated daily items'],
  ['search.html', 'renders search-index.json, which is generated from gated pages'],
  ['shared-answer.html', 'renders a gated /answers entry'],
  ['sources.html', 'renders the /sources corpus, gated by verified:true'],
  ['ask-anything.html', 'shell for api/ask.js, which is itself gated'],
  ['coach.html', 'shell; coaching prompts live in api/*'],
  ['conversation-journal.html', 'shell; user-authored content'],
  ['study-groups.html', 'shell; group plumbing'],
  ['video-library.html', 'catalogue of third-party videos'],
]);

const isExempt = (p) => EXEMPT.has(p);
const needsStamp = (p) => USER_FACING.some((re) => re.test(p)) && !isExempt(p);

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
  // A gate date must LOOK like a date. Presence alone used to be enough, so a
  // work-in-progress placeholder ("PENDING", "TODO", "n/a") satisfied the gate
  // exactly as a real date would and shipped as certified. Found 2026-08-11 by
  // apologia-neutrality on the John 1:1 reel specs, whose honest PENDING stamps
  // passed this check clean.
  const undated = ['argument', 'orthodoxy', 'neutrality']
    .filter((k) => obj[k] && !/^\d{4}-\d{2}-\d{2}$/.test(String(obj[k])));
  if (undated.length) {
    const shown = undated.map((k) => `${k}="${obj[k]}"`).join(' + ');
    return { ok: false, reason: `stamp date is not a YYYY-MM-DD date: ${shown}` };
  }
  return { ok: true, reason: `argument ${obj.argument} · orthodoxy ${obj.orthodoxy}${obj.by ? ' · ' + obj.by : ''}` };
}

function changedFiles(base) {
  const b = base || 'origin/main';
  // added/modified (exclude deleted) between base and working tree.
  // No shell redirection here: execSync uses cmd.exe on Windows, where
  // `2>/dev/null` means "write stderr to the file \dev\null", which fails and
  // takes the whole gate down with it. Swallow stderr via stdio instead, and
  // tolerate a missing base ref rather than throwing.
  const sh = (c) => {
    try { return execSync(c, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }); }
    catch { return ''; }
  };
  // git emits forward slashes on every platform, so these need no normalizing.
  const out = sh(`git diff --name-only --diff-filter=d ${b}...`) + sh('git diff --name-only --diff-filter=d');
  return [...new Set(out.split('\n').map((s) => s.trim()).filter(Boolean))];
}

function allContentFiles() {
  return globSync('{library/**/*.html,ev-s*.html,ev-m-*.html,worldviews.html,tools/reel/specs/*.json,api/ask.js}').filter(isContent);
}

/* Everything user-facing that is not explicitly exempt. This is the AUDIT scope,
   deliberately much wider than the blocking scope — see the note above EXEMPT. */
function allUserFacingFiles() {
  return globSync('{*.html,library/**/*.html,tools/reel/specs/*.json,tools/reel/xcards/*.json,api/ask.js}')
    .filter(needsStamp);
}

// ---- main ----
const args = process.argv.slice(2);
let files;
if (args[0] === '--audit') {
  files = allContentFiles();
} else if (args[0] === '--audit-all') {
  /* Non-blocking coverage report over EVERY user-facing file. Wired into CI so
     the size of the ungated surface is visible on every run, rather than being
     rediscovered by accident. Always exits 0 — it reports, it does not gate. */
  const all = allUserFacingFiles();
  const missing = all.filter((f) => !stampFor(f).ok);
  const groups = new Map();
  for (const f of missing) {
    const k = f.startsWith('ev-m-') ? 'ev-m-* mastery pages'
      : f.startsWith('library/') ? 'library/'
      : f.includes('/') ? f.split('/').slice(0, -1).join('/') + '/'
      : 'root pages';
    groups.set(k, [...(groups.get(k) || []), f]);
  }
  console.log(`Coverage: ${all.length - missing.length}/${all.length} user-facing files carry a review stamp.`);
  console.log(`${EXEMPT.size} file(s) exempt by name, each with a recorded reason.\n`);
  if (!missing.length) {
    console.log('✓ Every non-exempt user-facing file is stamped.');
  } else {
    console.log(`⚠ ${missing.length} file(s) carry no valid stamp:\n`);
    for (const [g, fs] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${g} — ${fs.length}`);
      for (const f of fs.slice(0, 8)) console.log(`      ${f}`);
      if (fs.length > 8) console.log(`      … and ${fs.length - 8} more`);
    }
    console.log('\nThis report does not fail the build. Triage: docs/GATE_COVERAGE.md');
  }
  process.exit(0);
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
