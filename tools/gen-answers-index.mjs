#!/usr/bin/env node
/**
 * gen-answers-index.mjs
 * Emits answers/search-index.json — a lightweight client-side retrieval index
 * over the already-gated /answers/ library, so the "Asked & Answered" page can
 * match a pasted objection to an existing answer (served free, $0, pre-reviewed)
 * before ever calling the live AI.
 *
 * Output: [{ slug, q, category, href, keywords:[...] }]
 * Run:    node tools/gen-answers-index.mjs   (writes answers/search-index.json)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'answers', '_data.json');
const OUT = join(ROOT, 'answers', 'search-index.json');

// Common words that carry no matching signal.
const STOP = new Set(`a an the of to in on for and or but if is are was were be been being
do does did how what why who when where which that this these those with without about into
can could should would will shall may might must not no yes it its as at by from than then
there their they them we you your our his her he she i me my mine ours out over under again
just more most some any all every each other another such only own same so up down off then
once here your yours you're isn't don't doesn't wasn't aren't really actually even also
question answer answers evidence christian christianity jesus god bible`.split(/\s+/));

function keywords(entry) {
  const text = `${entry.q} ${entry.category}`.toLowerCase();
  const words = text.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const w of words) {
    if (w.length < 3 || STOP.has(w)) continue;
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

// Mirror gen-answers.mjs goDeeper(): prefer an explicit essay, else map a
// legacy ev-m-<x>.html practice ref to its /library/<x>.html deep-dive.
function deepLink(e) {
  if (e.essay) return { label: e.relatedLabel || 'Read the deep-dive essay', href: e.essay };
  if (e.related) {
    const stem = e.related.replace(/^ev-m-/, '').replace(/\.html$/, '');
    return { label: e.relatedLabel || 'Read the deep-dive essay', href: `/library/${stem}.html` };
  }
  return null;
}

const data = JSON.parse(readFileSync(DATA, 'utf8'));
const index = data.answers.map((e) => ({
  slug: e.slug,
  q: e.q,
  category: e.category,
  href: `/answers/${e.slug}.html`,
  keywords: keywords(e),
  a: e.a,                 // full pre-gated answer text (\n\n between paragraphs)
  deep: deepLink(e),      // { label, href } | null
}));

writeFileSync(OUT, JSON.stringify(index));
const kb = Math.round(Buffer.byteLength(JSON.stringify(index)) / 1024);
console.log(`✓ wrote answers/search-index.json — ${index.length} answers indexed (${kb} KB)`);
