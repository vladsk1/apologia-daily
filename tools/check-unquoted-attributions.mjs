#!/usr/bin/env node
/*
 * check-unquoted-attributions.mjs — whole-corpus guard for QUOTE-SHAPED BUT
 * UNQUOTED phrases: wording attributed to a named source by an attributive verb
 * ("which he called …", "in his own words …", "as Douglass put it …") but left
 * OUTSIDE quotation marks.
 *
 * WHY THIS EXISTS. On 2026-09-07 a Frederick Douglass MISQUOTATION was found
 * live and already citations-certified on library/abolition.html: his 1850
 * phrase about the Constitution ("as opposite as heaven and hell") had been
 * welded onto his 1845 Appendix passage about religion and introduced with
 * "which he called …" — but NOT in quotation marks. The citations agent, which
 * verifies QUOTED strings against their sources, never checked it: it wasn't
 * marked as a quotation, so it fell into the gap between "a quote to verify" and
 * "the author's own prose." The two genuinely-quoted fragments in the same
 * sentence verified clean, which masked it further. See the 2026-09-07
 * post-mortem: a quote-shaped phrase left outside quotation marks is a citation
 * checker's structural blind spot. This turns that blind spot into a hard check.
 *
 * WHAT IT IS (and is NOT). A coarse regex net, NOT a judge. It flags an
 * attributive-of-WORDING verb followed by a long UNQUOTED span, so a human
 * either (a) quote-marks + footnotes it if it is a quotation (which then makes
 * it checkable by the citations agent), or (b) rewords it so it plainly reads as
 * paraphrase, or (c) accepts it on-record as a genuine paraphrase via --update.
 * It does NOT verify quotation accuracy — the apologia-citations agent does that,
 * and this check's whole point is to force quote-shaped wording INTO quotes so
 * that agent can see it. A clean run does not certify any attribution is
 * accurate; a FAIL means wording is attributed to a source without quotes.
 *
 * HOW IT STAYS USEFUL: a BASELINE ALLOWLIST (context-hashed, like
 * check-orthodoxy-tripwires.mjs). On --update every current match is recorded;
 * thereafter it fails ONLY on a NEW unquoted attribution. Legitimate paraphrases
 * already on the site are absorbed; a newly introduced one must be quoted,
 * reworded, or explicitly accepted in a reviewable diff.
 *
 * USAGE
 *   node tools/check-unquoted-attributions.mjs            # check vs baseline (exit 1 on new match)
 *   node tools/check-unquoted-attributions.mjs --update   # regenerate the baseline allowlist
 *   node tools/check-unquoted-attributions.mjs --list     # show all current matches w/ context
 *
 * Baseline file: tools/unquoted-attributions-baseline.json
 */
import { readFileSync, writeFileSync, existsSync, globSync } from 'node:fs';
import { createHash } from 'node:crypto';

const BASELINE = 'tools/unquoted-attributions-baseline.json';

// Served prose surfaces. Mirrors check-orthodoxy-tripwires.mjs, plus the ev-m-*
// mastery pages (whose flashcard/premise JS strings are exactly the memorised
// layer a misquote does the most damage on). index/link-hub pages are skipped.
const GLOBS = [
  '*.html',
  'library/**/*.html',
  'answers/*.html',
  'ev-s*.html',
  'ev-m-*.html',
  'worldviews.html',
  'demo/*.html',
];

// Attributive-of-WORDING lead-ins: each asserts that the words that FOLLOW are
// the source's own (a label, a coinage, a phrase), which is precisely when the
// following text ought to be quoted. Deliberately narrow — verbs that normally
// introduce PARAPHRASE ("argued that", "wrote that", "said that", "believed")
// are excluded, because they flood false positives and do not claim verbatim
// wording. `￿` is the sentinel that textOf() substitutes for every quote
// character (see normQuotes) so "immediately followed by a quote" is detectable
// uniformly across ", ', curly quotes and HTML entities.
const LEADINS = [
  // "(which|whom|who|he|she|they) (once) called/termed/dubbed/branded/labelled [it|them|this|his…]"
  /\b(?:which|whom|who|he|she|they)\s+(?:once\s+)?(?:called|termed|dubbed|branded|labell?ed)\s+(?:it|them|this|his|her|its|their|him|the\s+\w+)?\s*/gi,
  // "what/as (he|she|they|Name) called|termed|dubbed"
  /\b(?:what|as)\s+(?:he|she|they|[A-Z][a-z]+)\s+(?:called|termed|dubbed|labell?ed)\s+(?:it|them|this)?\s*/gi,
  // "in (his|her|their|Name's) (own) words," / "in the words of Name,"
  /\bin\s+(?:his|her|their|its|[A-Z][a-z]+(?:'s|’s))\s+(?:own\s+)?words,?\s*/gi,
  /\bin\s+the\s+words\s+of\s+[^,.<]{2,40},\s*/gi,
  // "to (use|borrow) (his|her|their|Name's) (own) phrase|term|words|expression,"
  /\bto\s+(?:use|borrow)\s+(?:his|her|their|[A-Z][a-z]+(?:'s|’s))\s+(?:own\s+)?(?:phrase|term|words|expression),?\s*/gi,
  // "(as) Name put it," (a proper-noun subject putting it a certain way)
  /\b(?:as\s+)?[A-Z][a-z]+\s+(?:famously\s+|memorably\s+)?put\s+it,?\s*/g,
  // "coined the phrase|term …"
  /\bcoined\s+the\s+(?:phrase|term)\s+/gi,
  // "(famously|memorably) (called|described … as|termed|put it)"
  /\b(?:famously|memorably)\s+(?:called|termed|described(?:\s+it)?\s+as|put\s+it)\s+(?:it|them|this)?\s*/gi,
];

// Minimum number of words in the trailing UNQUOTED span for a hit. Short
// characterisations ("called it a fraud", "termed it slavery") are not
// quote-shaped and are excluded; vivid multi-word phrases ("as opposite as
// heaven and hell" = 6, "the boldest of all frauds" = 5) are. Tuned 2026-09-07
// against the live corpus to isolate phrase-shaped attributions.
const MIN_WORDS = 4;

const QUOTE = '￿'; // internal sentinel for any opening/closing quote char

function normQuotes(html) {
  return html
    .replace(/&ldquo;|&rdquo;|&lsquo;|&rsquo;|&quot;|&#822[01];|&#821[67];|&#39;|&#34;/gi, QUOTE)
    .replace(/["'“”‘’«»‹›`]/g, QUOTE);
}

// Strip <style> and HTML comments. Scripts are KEPT: the ev-m-* flashcard/
// ARG_PREMISES JS strings are doctrinal content and are exactly where a misquote
// hides. HTML comments are stripped because content-review stamps live there and
// legitimately QUOTE bad/retired wording as examples (same reason
// check-retired-claims strips them) — scanning them would flag the stamp that
// documents the very fix. Comments are not reader-facing prose. The baseline
// absorbs benign library-code noise in scripts.
function textOf(html) {
  return normQuotes(
    html.replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/\r\n/g, '\n'),
  );
}

function files() {
  const set = new Set();
  for (const g of GLOBS) for (const f0 of globSync(g)) {
    const f = f0.replace(/\\/g, '/');
    if (/\/index\.html$/.test(f) || f === 'index.html') continue;
    set.add(f);
  }
  return [...set].sort();
}

function ctxKey(file, m, text, idx) {
  const start = Math.max(0, idx - 30), end = Math.min(text.length, idx + m.length + 60);
  const ctx = text.slice(start, end).replace(new RegExp(QUOTE, 'g'), '"').replace(/\s+/g, ' ').trim().toLowerCase();
  const h = createHash('sha1').update(ctx).digest('hex').slice(0, 12);
  return { key: `${file}||${h}`, ctx };
}

// Given the text following an attributive lead-in, decide whether it is an
// UNQUOTED phrase-shaped span. Returns the span text if it is a hit, else null.
function trailingUnquoted(rest) {
  // If the very next non-space character is a quote sentinel, it IS quoted → OK.
  const lead = rest.match(/^\s*/)[0].length;
  if (rest[lead] === QUOTE) return null;
  // Take the span up to the next sentence terminator or tag boundary. QUOTE is
  // deliberately NOT a stop char here: if a quote opens anywhere before the
  // terminator (e.g. "…put it in his 1995 address, \"even the most…\""), the
  // attributed wording IS quoted and must be seen, not truncated away.
  const m = rest.slice(lead).match(new RegExp(`^[^.!?;:<\\n]{0,220}`));
  const span = (m ? m[0] : '').trim();
  if (span.includes(QUOTE)) return null;           // a quote opens before the terminator → treat as quoted
  const words = span.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
  if (words.length < MIN_WORDS) return null;       // too short to be quote-shaped
  return span;
}

function scan() {
  const hits = [];
  for (const file of files()) {
    const text = textOf(readFileSync(file, 'utf8'));
    for (const re of LEADINS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        const rest = text.slice(m.index + m[0].length);
        const span = trailingUnquoted(rest);
        if (span) {
          const { key, ctx } = ctxKey(file, m[0] + span, text, m.index);
          hits.push({ file, lead: m[0].replace(/\s+/g, ' ').trim(), span, key, ctx });
        }
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
  }
  return hits;
}

const arg = process.argv[2];
const hits = scan();

if (arg === '--list') {
  for (const h of hits) console.log(`${h.file}\n   …${h.ctx}…\n`);
  console.log(`\n${hits.length} total match(es) across ${new Set(hits.map((h) => h.file)).size} file(s).`);
  process.exit(0);
}

if (arg === '--update') {
  const baseline = { generated: 'run `--update` to refresh', keys: [...new Set(hits.map((h) => h.key))].sort() };
  writeFileSync(BASELINE, JSON.stringify(baseline, null, 2) + '\n');
  console.log(`Baseline written: ${baseline.keys.length} accepted occurrence(s) across ${new Set(hits.map((h) => h.file)).size} file(s).`);
  console.log('Review the diff — each accepted attribution should be a genuine paraphrase, not a quotation.');
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error(`No baseline at ${BASELINE}. Run:  node tools/check-unquoted-attributions.mjs --update`);
  process.exit(1);
}

const allow = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).keys || []);
const novel = hits.filter((h) => !allow.has(h.key));

if (novel.length === 0) {
  console.log(`✓ Unquoted attributions: no new quote-shaped-but-unquoted phrase (${allow.size} baselined).`);
  process.exit(0);
}

console.error(`⛔ ${novel.length} NEW quote-shaped-but-unquoted attribution(s) — each attributes wording to a source without quotes:\n`);
for (const h of novel) {
  console.error(`  ${h.file}`);
  console.error(`     …${h.ctx}…`);
  console.error(`     lead: "${h.lead}"  →  unquoted: "${h.span.slice(0, 80)}${h.span.length > 80 ? '…' : ''}"\n`);
}
console.error('If it IS a quotation: put it in quotation marks and footnote its source, so the');
console.error('citations gate can verify it (this is the check\'s whole purpose). If it is a');
console.error('paraphrase: reword so it does not read as the source\'s own words. If it is a genuine,');
console.error('checked paraphrase, accept it on-record:');
console.error('   node tools/check-unquoted-attributions.mjs --update   (then commit the baseline diff)');
process.exit(1);
