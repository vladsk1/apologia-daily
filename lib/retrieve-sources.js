// Deterministic lexical retrieval over the VERIFIED public-domain source corpus,
// for the live /api/ask step. No network, no embeddings, no external deps — a
// small curated corpus (~100 passages) is well served by weighted term overlap.
//
// Lives OUTSIDE api/ so Vercel bundles it into the importing endpoint rather than
// turning it into its own serverless function (we're at the Hobby function limit).
//
// SAFETY: it can only ever see lib/sources-verified.js, which the build step emits
// from verified:true entries only — an unverified passage cannot reach a live answer.

import { VERIFIED_SOURCES } from './sources-verified.js';

// Common apologetics/question words carry no retrieval signal — drop them so a
// question doesn't match every passage that merely mentions "God" or "Jesus".
const STOP = new Set([
  'the', 'a', 'an', 'of', 'to', 'and', 'is', 'in', 'on', 'for', 'that', 'this',
  'with', 'as', 'it', 'be', 'are', 'was', 'were', 'do', 'does', 'did', 'how',
  'what', 'why', 'who', 'when', 'where', 'which', 'if', 'not', 'no', 'yes',
  'from', 'by', 'at', 'or', 'so', 'my', 'your', 'you', 'we', 'they', 'he', 'she',
  'i', 'can', 'could', 'would', 'should', 'about', 'there', 'their', 'them',
  'god', 'jesus', 'christ', 'lord', 'christian', 'christians', 'christianity',
  'bible', 'believe', 'belief', 'say', 'said', 'says', 'tell', 'answer', 'question',
  'people', 'someone', 'friend', 'really', 'just', 'like', 'think', 'know',
]);

function tokens(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

// Precompute per-passage token sets once at module load.
const INDEXED = VERIFIED_SOURCES.map((s) => ({
  s,
  tagTokens: new Set((s.tags || []).flatMap((t) => tokens(t))),
  metaTokens: new Set([...tokens(s.author), ...tokens(s.work)]),
  textTokens: new Set(tokens(s.text)),
}));

/**
 * Return up to `k` verified passages most relevant to `question`, best first.
 * Tags (curated topic labels) weigh most, then author/work, then body overlap.
 * A minimum score keeps irrelevant passages out — if nothing clears the bar we
 * return [], and the caller simply answers without a source block.
 */
export function retrieveSources(question, k = 3) {
  const q = new Set(tokens(question));
  if (!q.size) return [];

  const scored = [];
  for (const { s, tagTokens, metaTokens, textTokens } of INDEXED) {
    let score = 0;
    for (const w of q) {
      if (tagTokens.has(w)) score += 3;
      else if (metaTokens.has(w)) score += 2;
      else if (textTokens.has(w)) score += 1;
    }
    // Require a real topical match: one curated tag hit, or several body hits.
    if (score >= 3) scored.push({ s, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((x) => x.s);
}
