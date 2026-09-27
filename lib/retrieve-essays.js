// Deterministic lexical retrieval over our OWN certified deep-dive essays, for the
// live /api/ask step. Same approach as lib/retrieve-sources.js: no network, no
// embeddings, no deps — weighted term overlap over ~2,500 essay paragraphs.
//
// Lives OUTSIDE api/ so Vercel bundles it into the importing endpoint rather than
// turning it into its own serverless function (we're at the Hobby function limit).
//
// SAFETY / PROVENANCE: it can only ever see lib/essays-verified.js, which the build
// step emits from the certified library/*.html essays. Each hit carries a stable
// anchor (slug + p<N>) so the answer can cite the exact paragraph it drew on, and
// the caller instructs the model to cite ONLY these provided anchors.

import { ESSAY_PARAS } from './essays-verified.js';

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

// Precompute per-paragraph token sets once at module load. Title/section carry the
// topical signal (they weigh more); the body confirms the match.
const INDEXED = ESSAY_PARAS.map((p) => ({
  p,
  headTokens: new Set([...tokens(p.title), ...tokens(p.section)]),
  textTokens: new Set(tokens(p.text)),
}));

/**
 * Top-k essay paragraphs for a question. Title/section hits weigh most; a body
 * hit adds one. A minimum score keeps off-topic paragraphs out — if nothing
 * clears the bar we return [], and the caller answers with no essay block. At
 * most `perEssay` paragraphs from any single essay, so the block spans the
 * library rather than dumping one page.
 */
export function retrieveEssays(question, k = 5, perEssay = 2) {
  const q = new Set(tokens(question));
  if (!q.size) return [];
  const scored = [];
  for (const { p, headTokens, textTokens } of INDEXED) {
    let score = 0;
    for (const w of q) {
      if (headTokens.has(w)) score += 3;
      else if (textTokens.has(w)) score += 1;
    }
    if (score >= 4) scored.push({ p, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const out = [], seen = {};
  for (const { p } of scored) {
    seen[p.slug] = (seen[p.slug] || 0);
    if (seen[p.slug] >= perEssay) continue;
    seen[p.slug]++;
    out.push(p);
    if (out.length >= k) break;
  }
  return out;
}
