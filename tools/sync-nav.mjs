#!/usr/bin/env node
/* sync-nav.mjs — single source of truth for the site nav MENU.
 *
 * The site is 305 raw HTML files with the nav hardcoded in each, so the menu
 * drifts (e.g. removing "Memory Palace" meant editing ~98 files by hand). This
 * script defines the canonical `<ul class="adn-links">` block ONCE and writes it
 * into every file that has an `<nav class="adn-nav">`.
 *
 * SAFETY: it replaces ONLY the `.adn-links` menu list. It never touches the
 * `.adn-right` auth region (Sign in / Sign out / user), because 187 of the nav
 * pages don't define signOut() and run a lighter auth nav on purpose — rewriting
 * that region would bolt a broken button onto them. Menu links carry no per-page
 * JS (the dropdown is handled generically by ad-nav.js, loaded on all 284 files).
 *
 * Idempotent. Edit CANON below, then run:  node tools/sync-nav.mjs
 * Add --check to report drift without writing (CI-friendly; exits 1 if any file
 * would change).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// ── CANONICAL MENU (edit here — the one source of truth) ──
const CANON = `<ul class="adn-links">
      <li><a href="/search.html" class="adn-search-link" aria-label="Search">&#128269; Search</a></li>
      <li><a href="/evidence-library.html">Evidence Library</a></li>
      <li><a href="/daily-devotional.html">Daily Devotional</a></li>
      <li><a href="/debate-arena.html">Debate Arena</a></li>
      <li><a href="/asked-and-answered.html">Asked &amp; Answered</a></li>
      <li><a href="/worldviews.html">Worldviews</a></li>
      <li><a href="/study-plans.html">Study Plans</a></li>
      <li class="adn-has-drop adn-has-mega">
        <button type="button" class="adn-more" aria-expanded="false">More <span class="adn-caret">&#9662;</span></button>
        <div class="adn-mega">
          <div class="adn-mega-in">
            <div class="adn-mega-col">
              <div class="adn-mega-h">Go deeper</div>
              <a class="adn-mi" href="/library/"><span class="adn-mi-ic">&#128220;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Deep-Dive Essays</span><span class="adn-mi-dc">Long-form, fully-cited essays.</span></span></a>
              <a class="adn-mi" href="/answers/"><span class="adn-mi-ic">&#10024;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Answers</span><span class="adn-mi-dc">The questions people ask most.</span></span></a>
              <a class="adn-mi" href="/sources.html"><span class="adn-mi-ic">&#128220;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Source Library</span><span class="adn-mi-dc">The creeds &amp; Church Fathers, verified.</span></span></a>
              <a class="adn-mi" href="/whats-new.html"><span class="adn-mi-ic">&#128240;</span><span class="adn-mi-tx"><span class="adn-mi-nm">What&#39;s New</span><span class="adn-mi-dc">Latest essays, features &amp; reels.</span></span></a>
            </div>
            <div class="adn-mega-col">
              <div class="adn-mega-h">Practice &amp; community</div>
              <a class="adn-mi" href="/coach.html"><span class="adn-mi-ic">&#129305;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Coach</span><span class="adn-mi-dc">Your skill map &amp; a plan for your weak spots.</span></span></a>
              <a class="adn-mi" href="/games.html"><span class="adn-mi-ic">&#127918;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Games</span><span class="adn-mi-dc">Quizzes that feed your streak.</span></span></a>
              <a class="adn-mi" href="/study-groups.html"><span class="adn-mi-ic">&#128101;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Study Groups <span class="adn-mi-tag">New</span></span><span class="adn-mi-dc">Study with people you love.</span></span></a>
              <a class="adn-mi" href="/reading-club.html"><span class="adn-mi-ic">&#128214;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Reading Clubs</span><span class="adn-mi-dc">The classics, chapter by chapter.</span></span></a>
            </div>
            <div class="adn-mega-col">
              <div class="adn-mega-h">For you</div>
              <a class="adn-mi" href="/parents.html"><span class="adn-mi-ic">&#128106;</span><span class="adn-mi-tx"><span class="adn-mi-nm">For Parents</span><span class="adn-mi-dc">Your kids&#39; hardest questions.</span></span></a>
              <a class="adn-mi" href="/video-library.html"><span class="adn-mi-ic">&#127909;</span><span class="adn-mi-tx"><span class="adn-mi-nm">Videos</span><span class="adn-mi-dc">Short, shareable explainers.</span></span></a>
            </div>
            <div class="adn-mega-foot">
              <a href="/about.html">About</a>
              <a href="/what-we-believe.html">What We Believe</a>
              <a href="/editorial-standards.html">Editorial Standards</a>
            </div>
          </div>
        </div>
      </li>
    </ul>`;

// matches the whole adn-links UL (incl. the nested adn-drop) up to the auth region
const RE = /<ul class="adn-links">[\s\S]*?<\/ul>(\s*)<div class="adn-right">/;

const check = process.argv.includes('--check');

// Doctrinally-gated content (see tools/check-content-review.mjs): NEVER touched
// here — a nav-only edit would trip the content-review gate and wrongly demand a
// fresh orthodoxy stamp. Nav consistency on these leaf pages isn't worth that.
const CONTENT_GATED = [
  /^library\/(?!index\.html$).+\.html$/,  // deep-dive essays (+ mk/ es/ mirrors)
  /^ev-s\d[a-z0-9.]*\.html$/,             // hub fragments (no nav anyway)
  /^worldviews\.html$/,
];
const isGated = (p) => CONTENT_GATED.some((re) => re.test(p));

// all tracked .html files, minus node_modules and gated content
const files = execSync('git ls-files "*.html"', { cwd: process.cwd(), encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean)
  .filter(f => !f.startsWith('node_modules/'))
  .filter(f => !isGated(f));

// whitespace-insensitive compare so --check flags real menu drift (added/removed/
// reordered links), never cosmetic indentation a formatter might introduce.
const norm = (s) => s.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
const canonNorm = norm(`${CANON}\n<div class="adn-right">`);

let changed = 0, skipped = 0, scanned = 0;
const drifted = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (!html.includes('<nav class="adn-nav">')) continue;
  scanned++;
  const matches = html.match(new RegExp(RE, 'g')) || [];
  if (matches.length !== 1) { skipped++; console.warn(`SKIP (${matches.length} nav matches): ${f}`); continue; }
  if (check) {
    const m = html.match(RE);
    if (norm(m[0]) !== canonNorm) { drifted.push(f); changed++; }
  } else {
    const next = html.replace(RE, `${CANON}$1<div class="adn-right">`);
    if (next !== html) { drifted.push(f); writeFileSync(f, next); changed++; }
  }
}

console.log(`\nScanned ${scanned} nav pages · ${changed} ${check ? 'would change' : 'updated'} · ${skipped} skipped.`);
if (check && changed > 0) {
  console.log('Drifted files:\n  ' + drifted.join('\n  '));
  process.exit(1);
}
