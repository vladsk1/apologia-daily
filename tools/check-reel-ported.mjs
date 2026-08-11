#!/usr/bin/env node
/**
 * check-reel-ported.mjs — provenance check for short-form specs.
 *
 *   node tools/check-reel-ported.mjs <spec.json> [<spec.json> ...]
 *   node tools/check-reel-ported.mjs --audit          # every reel spec + xcard
 *
 * WHY THIS EXISTS
 * ───────────────
 * A reel spec is compressed doctrine. CLAUDE.md's rule 8 (PORT-OR-DON'T-CLAIM)
 * says every sentence should be lifted verbatim from a certified page, and that
 * anything authored must be DECLARED to the gate. Until now that was an honour
 * system, and the honour system kept losing: across the 2026-08-08 and -08-11
 * sessions every ported sentence survived every lens, and roughly two thirds of
 * the authored ones became the next round's defect. The gates were not
 * re-checking our essays — they were checking a paraphrase of them.
 *
 * So this script makes provenance MECHANICAL. It reads every on-screen string
 * and every voiceover sentence, and asserts each one appears verbatim in one of
 * the certified pages the spec names. What it cannot find, it reports — and the
 * spec must then declare that string in a top-level `authored` array, with a
 * reason, or the check fails.
 *
 * WHAT IT BUYS YOU (the fast path, documented in the make-reel skill):
 * a spec that passes with only non-doctrinal declared strings (a hook, a CTA)
 * is text that has ALREADY cleared argument + orthodoxy on the page it came
 * from. Re-gating it start to finish is the waste. That spec needs ONE
 * orthodoxy pass over the seams, not a full dual-consensus double round.
 *
 * ⚠ WHAT IT DOES **NOT** DO — do not oversell this in a future session:
 * it proves a string is verbatim, NOT that it is used in context. A sentence
 * lifted out of the paragraph that fenced it can still be a defect: that is
 * exactly what happened to the X card on 2026-08-11, whose sub-line was a
 * perfect port of ev-s3.html:654 and still read toward two Gods once the
 * fencing paragraph was gone. A clean run here means "no new claims were
 * invented," which is a floor, not a certificate.
 *
 * Exit 0 = every substantive string is either ported or declared. 1 = not.
 */

import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

/* Strings shorter than this are structural, not claims ("was.", "He didn't
   stop.", "JOHN 1:1"). Requiring a verbatim source hit on them produces noise,
   and a net that cries wolf gets ignored — the lesson check-stamp-integrity
   learned the hard way at 59 unread flags. */
const MIN_SUBSTANTIVE = 18;

/* Boilerplate that appears in every spec and belongs to the brand, not to an
   argument. Matched after normalisation. */
const CHROME = [
  'apologiadaily.com',
  'the full case at',
  'the full story at',
  'read the full essay at',
  'keep watching',
];

/** HTML entity + typography normaliser. The certified pages are HTML and store
 *  &mdash; / &rsquo; / &ldquo; where a spec stores the literal character, so a
 *  naive comparison misses every quoted sentence. This is the same class of bug
 *  as the `Lema&icirc;tre` search that returned zero hits on an essay that opens
 *  with him — a pattern cannot see what it cannot spell. */
function normalise(s) {
  return String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/[’‘‛`]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Trailing/leading punctuation differs constantly between a spec line and its
 *  source (a line break becomes a comma, a full stop becomes a dash). Strip it
 *  for comparison — the words are what we are verifying, not the pointing. */
const core = (s) => normalise(s).replace(/^[^a-z0-9"']+/, '').replace(/[^a-z0-9"']+$/, '');

/** Pull the certified pages a spec claims to be built from. `source` is
 *  free text in every existing spec ("ev-s3.html card 06 (…) + library/john11.html"),
 *  so filenames are extracted rather than requiring all 57 specs to be re-shaped.
 *  An explicit `ported_from` array wins when present. */
function sourceFilesFor(spec) {
  if (Array.isArray(spec.ported_from) && spec.ported_from.length) return spec.ported_from;
  const raw = String(spec.source || '');
  const hits = raw.match(/[\w./-]+\.html/g) || [];
  return [...new Set(hits)];
}

/** NEAR-PORT detection.
 *
 *  Verbatim matching alone is too strict to gate on, and a net that cries wolf
 *  gets ignored. Real compressions legitimately drop an aside or swap a pronoun
 *  for its antecedent: the card reads "He could have written simply…" and the
 *  reel needs "John could have written simply…"; the card reads "real
 *  relationship, real 'withness,' within his own life" and the reel drops the
 *  middle for width. Neither invents a claim.
 *
 *  So a string counts as a NEAR port when its words appear IN ORDER inside a
 *  reasonably tight window of the source — i.e. it is the source sentence with
 *  material removed, never with material added. That asymmetry is the whole
 *  point: dropping words cannot introduce a claim, and anything that adds one
 *  fails to match and lands in AUTHORED where a lens must look at it.
 *
 *  ⚠ It can still change MEANING — dropping a hedge is exactly how "usually
 *  qualitative" becomes "qualitative". NEAR is a warning tier, not a pass. */
function makeNearMatcher(corpus) {
  // Strip punctuation off each token before indexing: the corpus stores
  // "made." and a spec line ends "made", and without this every sentence-final
  // word silently fails to match.
  const bare = (w) => w.replace(/[^a-z0-9']/g, '');
  const words = corpus.split(' ').map(bare).filter(Boolean);
  const at = new Map();
  for (let i = 0; i < words.length; i++) {
    if (!at.has(words[i])) at.set(words[i], []);
    at.get(words[i]).push(i);
  }
  return (text) => {
    const q = core(text).split(' ').map(bare).filter(Boolean);
    if (q.length < 3) return false;
    // Allow the source window to be up to 2.2x the quote's length: enough for a
    // dropped aside, not enough to stitch unrelated sentences together.
    const span = Math.ceil(q.length * 2.2) + 6;
    for (const start of at.get(q[0]) || []) {
      let k = start, qi = 0;
      while (qi < q.length && k < words.length && k - start <= span) {
        if (words[k] === q[qi]) qi++;
        k++;
      }
      if (qi === q.length) return true;
    }
    return false;
  };
}

/** A scene's text is one sentence broken across `lines[]` for layout — "God is
 *  one — yet real" / "relationship within his own life." is a single ported
 *  clause typeset in two. Matching line-by-line therefore reports genuine ports
 *  as missing, which is the cry-wolf failure that got check-stamp-integrity
 *  ignored at 59 unread flags. So: take the longest contiguous RUN of lines
 *  whose joined text is in the corpus, mark the whole run ported, and recurse
 *  on what is left. Only text that survives every run length is really absent. */
function matchRuns(items, corpus) {
  const ported = [];
  const leftover = [];
  let i = 0;
  while (i < items.length) {
    let best = 0;
    for (let len = items.length - i; len >= 1; len--) {
      const joined = core(items.slice(i, i + len).map((x) => x.t).join(' '));
      if (joined.length >= MIN_SUBSTANTIVE && corpus.includes(joined)) { best = len; break; }
    }
    if (best) { ported.push(...items.slice(i, i + best)); i += best; }
    else { leftover.push(items[i]); i += 1; }
  }
  return { ported, leftover };
}

/** Groups of strings that belong together on one frame, plus the loose ones. */
function groupsOf(spec) {
  const groups = [];   // [{ where, items:[{t}] }] — matched as runs
  const labels = [];   // kickers: navigational, never prose in the essay
  const refs = [];

  const g = (where, arr) => {
    const items = (arr || []).map((l) => ({ t: String(typeof l === 'string' ? l : l.t || '') }))
      .filter((x) => x.t.trim());
    if (items.length) groups.push({ where, items });
  };

  for (const [i, sc] of (spec.scenes || []).entries()) {
    const n = i + 1;
    if (sc.kicker) labels.push({ t: sc.kicker, where: `scene ${n} kicker` });
    if (sc.ref) refs.push({ t: sc.ref, where: `scene ${n} ref` });
    g(`scene ${n} lines`, sc.lines);
    g(`scene ${n} big`, sc.big);
    g(`scene ${n} sub`, sc.sub);
  }
  g('headline', spec.headline);
  g('sub', spec.sub);

  // The voiceover is published content — it is the narration the owner records.
  // ⚠ It reaches NEITHER a video frame NOR the shipped .srt (gen_reel.py builds
  // captions from big/sub/lines only), so a claim that lives only here does not
  // reach the viewer of the silent artifact. Found 2026-08-11 by
  // apologia-neutrality, after a fix pass discharged three findings into it.
  // Checked all the same, because the voiced cut is still published content.
  if (spec.voiceover) {
    const sents = String(spec.voiceover)
      .split(/(?<=[.?!”"])\s+(?=[A-Z“"])/)
      .map((t) => ({ t }))
      .filter((x) => x.t.trim());
    if (sents.length) groups.push({ where: 'voiceover', items: sents, loose: true });
  }
  return { groups, labels, refs };
}

const isChrome = (t) => { const c = core(t); return CHROME.some((x) => c.includes(x)); };
/** A scripture reference ("John 1:1, 1:3") is a pointer, not a claim. */
const isRef = (t) => /^[\d\s]*[a-z]+\.?\s*\d+[:\d\s,–-]*$/i.test(String(t).trim());

function checkSpec(path) {
  const spec = JSON.parse(readFileSync(path, 'utf8'));
  const srcFiles = sourceFilesFor(spec);
  const missingSrc = srcFiles.filter((f) => !existsSync(f));
  const corpus = srcFiles
    .filter((f) => existsSync(f))
    .map((f) => normalise(readFileSync(f, 'utf8')))
    .join('\n');

  const declared = new Map(
    (Array.isArray(spec.authored) ? spec.authored : [])
      .map((a) => [core(typeof a === 'string' ? a : a.t), typeof a === 'string' ? '' : (a.why || '')]),
  );

  const ported = [];
  const near = [];
  const undeclared = [];
  const declaredHits = [];
  const skipped = [];
  const isNear = makeNearMatcher(corpus);
  const { groups, labels, refs } = groupsOf(spec);

  for (const r of refs) skipped.push({ ...r, why: 'scripture reference' });

  for (const grp of groups) {
    // Drop chrome and sub-substantive fragments BEFORE run-matching, so they
    // cannot break an otherwise-contiguous ported sentence in half.
    const live = [];
    for (const it of grp.items) {
      if (isChrome(it.t)) { skipped.push({ ...it, where: grp.where, why: 'brand chrome' }); continue; }
      live.push({ ...it, where: grp.where });
    }
    const { ported: p, leftover } = matchRuns(live, corpus);
    ported.push(...p);

    for (const it of leftover) {
      const c = core(it.t);
      if (c.length < MIN_SUBSTANTIVE) { skipped.push({ ...it, why: 'too short to carry a claim' }); continue; }
      if (declared.has(c)) { declaredHits.push({ ...it, why: declared.get(c) }); continue; }
      if (isNear(it.t)) { near.push(it); continue; }
      undeclared.push(it);
    }
  }

  return { path, spec, srcFiles, missingSrc, ported, near, declaredHits, undeclared, skipped, labels };
}

function report(r) {
  const substantive = r.ported.length + r.near.length + r.declaredHits.length + r.undeclared.length;
  const pct = substantive ? Math.round((r.ported.length / substantive) * 100) : 100;
  const bad = r.undeclared.length > 0 || r.missingSrc.length > 0 || !r.srcFiles.length;

  console.log(`${bad ? '⛔' : '✓'} ${r.path}`);
  if (!r.srcFiles.length) {
    console.log('     no certified source named — add "source" or "ported_from"');
  } else {
    console.log(`     sources: ${r.srcFiles.join(', ')}`);
  }
  for (const f of r.missingSrc) console.log(`     ⛔ named source not found on disk: ${f}`);
  console.log(`     ${r.ported.length} verbatim  ·  ${r.near.length} near (source minus words)`
    + `  ·  ${r.declaredHits.length} declared  ·  ${r.undeclared.length} AUTHORED`
    + `   — ${pct}% verbatim of ${substantive} substantive`);
  console.log(`     ${r.skipped.length} skipped (chrome/refs/fragments)  ·  ${r.labels.length} kickers not checked`);
  if (process.env.REEL_PORT_VERBOSE) {
    for (const n of r.near) console.log(`     ~ NEAR      ${n.where}: "${n.t}"`);
  }

  for (const d of r.declaredHits) {
    console.log(`     ⚠ DECLARED  ${d.where}: "${d.t}"${d.why ? `\n                 why: ${d.why}` : ''}`);
  }
  for (const u of r.undeclared) {
    console.log(`     ⛔ AUTHORED — no certified source — ${u.where}:\n          "${u.t}"`);
  }
  return bad;
}

const args = process.argv.slice(2);
let specs;
if (args[0] === '--audit') {
  specs = [...globSync('tools/reel/specs/*.json'), ...globSync('tools/reel/xcards/*.json')].sort();
} else if (args.length) {
  specs = args;
} else {
  console.error('usage: check-reel-ported.mjs <spec.json...> | --audit');
  process.exit(2);
}

let failed = 0;
for (const s of specs) {
  try {
    if (report(checkSpec(s))) failed++;
  } catch (e) {
    console.log(`⛔ ${s} — could not read: ${e.message}`);
    failed++;
  }
  console.log('');
}

if (failed) {
  console.error(`⛔ ${failed} spec(s) carry a string with no certified source and no declaration.`);
  console.error('   Either port the sentence from the essay/card, or add it to a top-level');
  console.error('   "authored": [{ "t": "…", "why": "…" }] array so the gate sees it named.');
  console.error('   A declared string is fine; an undeclared one is how paraphrase ships.\n');
  process.exit(1);
}
console.log(`✓ ${specs.length} spec(s): every substantive string is ported or declared.`);
process.exit(0);
