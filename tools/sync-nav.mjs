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
      <li><a href="/evidence-library.html">Evidence Library</a></li>
      <li><a href="/daily-devotional.html">Daily Devotional</a></li>
      <li><a href="/debate-arena.html">Debate Arena</a></li>
      <li><a href="/asked-and-answered.html">Asked &amp; Answered</a></li>
      <li><a href="/worldviews.html">Worldviews</a></li>
      <li><a href="/study-plans.html">Study Plans</a></li>
      <li class="adn-has-drop">
        <button type="button" class="adn-more" aria-expanded="false">More <span class="adn-caret">&#9662;</span></button>
        <ul class="adn-drop">
          <li><a href="/library/">Deep-Dive Essays</a></li>
          <li><a href="/games.html">Games</a></li>
          <li><a href="/study-groups.html">Study Groups</a></li>
          <li><a href="/reading-club.html">Reading Clubs</a></li>
          <li><a href="/parents.html">For Parents</a></li>
          <li><a href="/video-library.html">Videos</a></li>
          <li><a href="/answers/">Answers</a></li>
          <li><a href="/whats-new.html">What&#39;s New</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/what-we-believe.html">What We Believe</a></li>
          <li><a href="/editorial-standards.html">Editorial Standards</a></li>
        </ul>
      </li>
    </ul>`;

// matches the whole adn-links UL (incl. the nested adn-drop) up to the auth region
const RE = /<ul class="adn-links">[\s\S]*?<\/ul>(\s*)<div class="adn-right">/;

const check = process.argv.includes('--check');

// all tracked .html files, minus node_modules
const files = execSync('git ls-files "*.html"', { cwd: process.cwd(), encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean)
  .filter(f => !f.startsWith('node_modules/'));

let changed = 0, skipped = 0, scanned = 0;
const drifted = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (!html.includes('<nav class="adn-nav">')) continue;
  scanned++;
  const matches = html.match(new RegExp(RE, 'g')) || [];
  if (matches.length !== 1) { skipped++; console.warn(`SKIP (${matches.length} nav matches): ${f}`); continue; }
  const next = html.replace(RE, `${CANON}$1<div class="adn-right">`);
  if (next !== html) {
    drifted.push(f);
    if (!check) writeFileSync(f, next);
    changed++;
  }
}

console.log(`\nScanned ${scanned} nav pages · ${changed} ${check ? 'would change' : 'updated'} · ${skipped} skipped.`);
if (check && changed > 0) {
  console.log('Drifted files:\n  ' + drifted.join('\n  '));
  process.exit(1);
}
