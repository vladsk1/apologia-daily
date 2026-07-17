// Deterministic lexical retrieval over the GATED argument-briefs corpus, for the
// live /api/ask step. No network, no embeddings, no external deps — a small curated
// set is well served by weighted term overlap. Sibling of lib/retrieve-sources.js.
//
// Lives OUTSIDE api/ so Vercel bundles it into the importing endpoint rather than
// turning it into its own serverless function (we're at the Hobby function limit).
//
// SAFETY: it can only ever see lib/briefs-verified.js, which the build step emits
// from twice-gated entries only — an un-gated brief cannot reach a live answer.

import { VERIFIED_BRIEFS } from './briefs-verified.js';

// Common apologetics/question words carry no retrieval signal — drop them so a
// question doesn't match every brief that merely mentions "God" or "Jesus".
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

// Light suffix stemmer so question wording matches curated tags across word forms
// ("hallucinate"/"hallucination", "rose"/"risen" aside, "disciple"/"disciples",
// "resurrection"/"resurrected"). Deliberately conservative: if stripping would
// leave a stub shorter than 4 chars, keep the original word (avoids "creed"->"cre"
// style over-stemming and the false matches that invites).
function stem(w) {
  let s = w.replace(/(ions?|ing|edly|ed|ies|es|s)$/, '');
  if (s.length > 4) s = s.replace(/e$/, '');
  return s.length >= 4 ? s : w;
}

function tokens(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);
}

// Precompute per-brief token sets once at module load.
const INDEXED = VERIFIED_BRIEFS.map((b) => ({
  b,
  tagTokens: new Set((b.tags || []).flatMap((t) => tokens(t))),
  topicTokens: new Set(tokens(b.topic)),
  framingTokens: new Set(tokens(b.framing)),
}));

/**
 * Return up to `k` gated briefs most relevant to `question`, best first.
 * Tags (curated topic labels) weigh most, then the topic label, then framing overlap.
 * A minimum score keeps weak matches out — retrieval "anchoring" is the risk, so we
 * only surface a brief on a genuine topical hit; if nothing clears the bar we return
 * [] and the caller answers with no brief block.
 */
export function retrieveBriefs(question, k = 1) {
  const q = new Set(tokens(question));
  if (!q.size) return [];

  const scored = [];
  for (const { b, tagTokens, topicTokens, framingTokens } of INDEXED) {
    let score = 0;
    for (const w of q) {
      if (tagTokens.has(w)) score += 3;
      else if (topicTokens.has(w)) score += 2;
      else if (framingTokens.has(w)) score += 1;
    }
    // Require a real topical match: at least two curated-tag hits (or the
    // equivalent). Briefs are broad framing, so the bar is deliberately higher
    // than /sources to avoid injecting a loosely-related brief that could anchor
    // the answer.
    if (score >= 6) scored.push({ b, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((x) => x.b);
}
