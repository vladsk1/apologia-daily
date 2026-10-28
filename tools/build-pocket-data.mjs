#!/usr/bin/env node
/* Extract the pocket-card deck from pocket-cards.html (the SINGLE SOURCE OF TRUTH
   for the card content) into pocket-cards.json, a flat feed-ready array that
   scroll.html (the vertical pocket-card feed) consumes.

   pocket-cards.html stays authoritative and byte-identical; this file only
   READS it, so no content re-gate is triggered. Run after any pocket-card edit
   and commit the JSON alongside it.

     node tools/build-pocket-data.mjs            # write pocket-cards.json
     node tools/build-pocket-data.mjs --check    # CI: fail if stale (no write)

   Essay links come from lib/pocket-qr.js (window.POCKET_ESSAY), itself generated
   by tools/build-pocket-qr.py — same provenance the live page uses. */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Slice out a `<kw> <name> = { ... };` object literal by brace-matching from
   the first line that contains the marker to the matching `};`, then evaluate
   it in an isolated Function scope. The deck is hand-authored JS (single quotes,
   \u escapes, apostrophes), not JSON — so we evaluate rather than JSON.parse. */
function evalObjectLiteral(src, marker, returnName) {
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`marker not found: ${marker}`);
  // walk from the opening brace, counting braces, string-aware
  let i = src.indexOf('{', start);
  const open = i;
  let depth = 0, inStr = false, quote = '';
  for (; i < src.length; i++) {
    const c = src[i], prev = src[i - 1];
    if (inStr) {
      if (c === quote && prev !== '\\') inStr = false;
    } else if (c === '"' || c === "'" || c === '`') {
      inStr = true; quote = c;
    } else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  const literal = src.slice(open, i); // `{ ... }`
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; const ${returnName} = ${literal}; return ${returnName};`)();
}

const html = readFileSync(join(ROOT, 'pocket-cards.html'), 'utf8');
const qrJs = readFileSync(join(ROOT, 'lib', 'pocket-qr.js'), 'utf8');

const ARGS = evalObjectLiteral(html, 'var ARGS = {', 'ARGS');
const ESSAY = evalObjectLiteral(qrJs, 'window.POCKET_ESSAY = {', 'POCKET_ESSAY');

// Human-readable category labels for the feed eyebrow.
const CAT_LABEL = {
  existence: 'Does God exist?',
  resurrection: 'The Resurrection',
  jesus: 'Who is Jesus?',
  bible: 'Is the Bible reliable?',
  science: 'Science & Faith',
  trinity: 'The Trinity',
  islam: 'Islam',
  church: 'The Christian Revolution',
};

const cards = [];
for (const [cat, list] of Object.entries(ARGS)) {
  if (!Array.isArray(list)) continue;
  for (const c of list) {
    cards.push({
      id: c.id,
      category: cat,
      categoryLabel: CAT_LABEL[cat] || cat,
      title: c.title,
      tagline: c.tagline,
      points: c.points,
      question: c.question,
      essay: ESSAY[c.id] || 'library/',
    });
  }
}

const out = {
  generated: 'tools/build-pocket-data.mjs — do not edit by hand; edit pocket-cards.html',
  count: cards.length,
  cards,
};
const json = JSON.stringify(out, null, 2) + '\n';
const target = join(ROOT, 'pocket-cards.json');

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(target, 'utf8'); } catch { /* missing */ }
  if (current !== json) {
    console.error('pocket-cards.json is STALE — run: node tools/build-pocket-data.mjs');
    process.exit(1);
  }
  console.log(`pocket-cards.json current (${cards.length} cards).`);
} else {
  writeFileSync(target, json);
  console.log(`Wrote pocket-cards.json (${cards.length} cards).`);
}
