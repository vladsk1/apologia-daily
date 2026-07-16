#!/usr/bin/env node
/* Answer-page generator — the content flywheel.
   Reads answers/_data.json and writes an indexable /answers/<slug>.html for any
   entry that does not yet have a page (additive: never overwrites existing pages).
   Then prints the <li> snippets (grouped by category) and the sitemap lines to
   add for the new pages.

   Flywheel: a visitor question comes in (api/submit-question) -> draft a short
   answer -> run it through the SAME mandatory pipeline as an essay: apologia-argument
   (incl. the over-concession / pull-quote check) AND apologia-orthodoxy -> apply fixes ->
   set "reviewed": true on the entry -> `node tools/gen-answers.mjs` -> paste the printed
   index + sitemap snippets -> deploy.

   REVIEW GATE (enforced below): an entry is refused (no page written) unless its `reviewed`
   object stamps BOTH checks: { argument: "<date>", orthodoxy: "<date>", by: "<name>" }.
   Answers are not a lighter tier than essays; see CLAUDE.md "MANDATORY content pipeline" and
   the "Orthodoxy outranks charity" guardrail. Stamping a date asserts that agent actually ran
   and the page was fixed to CLEAN — never stamp a check you did not run.

   SHORT-FORM ANSWER RULE (mandatory for every `a`; the argument gate enforces it):
   A short answer's JOB is to ANSWER the question — directly, from our own convictional
   footing, inside the guardrails and the site's mission (strengthen the believer, reach the
   seeker honestly) — and THEN point to the fuller study for the deep engagement. It is NOT an
   essay. Therefore:
     • LEAD WITH THE ANSWER. Do not open by steelmanning, amplifying, or "granting the force of"
       the objection. A front-loaded concession — an opening that builds the skeptic's/other
       side's case before answering — is a DEFECT even when the body later refutes it (it fails
       the pull-quote test and can leave a believer nearer to doubt).
     • CONCEDE THE OBSERVATION, NEVER THE INFERENCE. Concede only accurate facts and the person's
       sincerity — never the opponent's frame, the soundness of a mistaken inference, or an
       unearned symmetry. Keep any acknowledgment brief and fact-bound.
     • Close with the "go deeper" pointer (essay/relatedLabel). The full "steelman the strongest
       objection at length" work belongs in the deep-dive essay, not the short answer.
   Pastoral empathy (validating the EMOTION of a doubt or a hard question) is allowed and good;
   conceding the INTELLECTUAL case to the skeptic is not.

   Entry shape in _data.json:
     { slug, q, category, meta, a,                // a uses \n\n between paragraphs
       reviewed: { argument, orthodoxy, by },     // REQUIRED: argument+orthodoxy dates to generate;
                                                  //   argument may be null while a fix is pending
       pending?,                                  // (optional) note on what's outstanding for a null check
       essay?, relatedLabel?,                     // explicit essay href (e.g. "/library/islam-preservation.html")
       related?, relatedLabel? }                  // OR legacy "ev-m-*.html" (maps to /library/<x>.html + practice link)
*/
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CANON } from './sync-nav.mjs';   // single source of truth for the nav menu

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ANSWERS = join(ROOT, 'answers');
const data = JSON.parse(readFileSync(join(ANSWERS, '_data.json'), 'utf8'));

// ── DRIFT AUDIT ──
// Every answer's text lives in THREE places that must agree: the visible <div class="ad-answer">,
// the QAPage JSON-LD acceptedAnswer, and _data.json "a". If the visible page is hand-edited
// without updating _data.json, the gate (which reads _data.json) certifies the wrong copy —
// exactly the 2026-07-04 finding on the Bible-reliability pages. This runs on every invocation
// and loudly warns on any page whose live visible text has drifted from its _data.json source.
const _norm = (s) => String(s)
  // orthonote clarifiers are presentation-only: unwrap the whole clarifier span back to
  // just its phrase (group $1) so the ＊ mark + box vanish AND no boundary whitespace is
  // introduced — the phrase then compares exactly against _data.json "a".
  .replace(/<span class="on"><span class="on-phrase">([\s\S]*?)<\/span><!--onote-->[\s\S]*?<!--\/onote--><\/span>/g, '$1')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&mdash;/g, '-').replace(/&ndash;/g, '-').replace(/&rsquo;|&lsquo;|’|‘/g, "'")
  .replace(/&ldquo;|&rdquo;|“|”/g, '"').replace(/[—–]/g, '-')
  .replace(/\s+/g, ' ').trim();
const drift = [];
for (const e of data.answers) {
  const fp = join(ANSWERS, e.slug + '.html');
  if (!existsSync(fp)) continue;
  const html = readFileSync(fp, 'utf8');
  const m = html.match(/<div class="ad-answer">([\s\S]*?)<\/div>/);
  if (!m) continue;
  if (_norm(m[1]) !== _norm(String(e.a).split('\n\n').map((p) => `<p>${p}</p>`).join(''))) drift.push(e.slug);
}
if (drift.length) {
  console.error(`\n⚠️  DRIFT: ${drift.length} page(s) whose live visible text ≠ _data.json "a" (the gate reads _data.json, so the live copy may be UN-REVIEWED). Reconcile _data.json + JSON-LD to the visible text, then re-gate:`);
  drift.forEach((s) => console.error('   - ' + s));
  console.error('');
}

const NAV = `<nav class="adn-nav">
  <a href="/" class="adn-logo">Apologia<span>Daily</span></a>
  <button class="adn-burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>
  <div class="adn-collapse">
    ${CANON}
    <div class="adn-right">
      <a href="/dashboard.html" class="adn-dash" id="nav-dashboard" style="display:none;">Dashboard</a>
      <span class="adn-user" id="nav-user"></span>
      <a href="/login.html" class="adn-signin" id="nav-signin">Sign in</a>
      <a href="/signup.html" class="adn-cta" id="nav-cta">Start Free</a>
    </div>
  </div>
</nav>`;

const FOOT = `<footer class="ad-foot">
  <a href="/">apologiadaily.com</a> &middot; <a href="/evidence-library.html">Evidence Library</a> &middot; <a href="/answers/">All answers</a>
  <div class="ad-foot-tag">Defending the faith with gentleness and respect.</div>
</footer>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function goDeeper(e) {
  if (e.essay) {
    return `  <p class="ad-related">Go deeper: <a href="${e.essay}">${esc(e.relatedLabel || 'Read the full essay')} &mdash; full essay &rarr;</a></p>`;
  }
  if (e.related) {
    const essayHref = '/library/' + e.related.replace(/^ev-m-/, '');
    return `  <p class="ad-related">Go deeper: <a href="${essayHref}">${esc(e.relatedLabel || 'the full essay')} &mdash; full essay &rarr;</a> &middot; <a href="/${e.related}">practice it &rarr;</a></p>`;
  }
  return '';
}

// Sibling cross-links: up to 5 other answers in the same category. Builds the
// internal-linking mesh (topic clusters) that concentrates relevance for search.
function moreQs(e) {
  const sibs = data.answers.filter((x) => x.category === e.category && x.slug !== e.slug).slice(0, 5);
  if (!sibs.length) return '';
  const items = sibs.map((s) => `      <li><a href="/answers/${s.slug}.html">${esc(s.q)}</a></li>`).join('\n');
  return `  <nav class="ad-more-qs" aria-label="More questions about ${esc(e.category)}">
    <h2>More on ${esc(e.category)}</h2>
    <ul>
${items}
    </ul>
    <p class="ad-more-all"><a href="/answers/">Browse all questions &rarr;</a></p>
  </nav>
`;
}

// A doctrinal "clarifier": a gold ＊ next to a delicate phrase whose box (rendered by
// /library/orthonote.js) says what the phrase IS and IS NOT saying. The mark + box are
// wrapped in <!--onote-->…<!--/onote--> so the drift audit treats them as presentation,
// not canonical text. c.is / c.not may contain inline <em>/<strong> (trusted author HTML);
// c.phrase / c.heading are escaped. The box text is DOCTRINAL and must pass the orthodoxy gate.
function clarifierMarkup(c) {
  return `<span class="on"><span class="on-phrase">${esc(c.phrase)}</span>`
    + `<!--onote--><button class="on-mark" type="button" aria-label="Doctrinal clarification" aria-expanded="false">＊</button>`
    + `<span class="on-box" role="tooltip"><span class="on-h">${esc(c.heading)}</span>`
    + `<span class="on-row on-yes"><b>Is saying</b><span>${c.is}</span></span>`
    + `<span class="on-row on-no"><b>Not saying</b><span>${c.not}</span></span>`
    + `</span><!--/onote--></span>`;
}

function page(e) {
  const url = `https://apologiadaily.com/answers/${e.slug}.html`;
  let paras = String(e.a).split('\n\n').map((p) => `<p>${esc(p.trim())}</p>`).join('\n      ');
  for (const c of (e.clarifiers || [])) {
    const target = esc(c.phrase);
    const idx = paras.indexOf(target);
    if (idx === -1) throw new Error(`clarifier phrase not found in ${e.slug}: "${c.phrase}"`);
    paras = paras.slice(0, idx) + clarifierMarkup(c) + paras.slice(idx + target.length);
  }
  const ld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'QAPage',
    mainEntity: { '@type': 'Question', name: e.q, acceptedAnswer: { '@type': 'Answer', text: String(e.a).replace(/\n\n/g, '  ') } }
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(e.q)} | Apologia Daily</title>
<meta name="description" content="${esc(e.meta)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Apologia Daily">
<meta property="og:title" content="${esc(e.q)}">
<meta property="og:description" content="${esc(e.meta)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="answers.css">
<script type="application/ld+json">${ld}</script>
  <link rel="stylesheet" href="/ad-nav.css">
</head>
<body>
${NAV}
<main class="ad-main">
  <nav class="ad-crumbs"><a href="/">Home</a> &rsaquo; <a href="/answers/">Answers</a> &rsaquo; <span>${esc(e.category)}</span></nav>
  <article>
    <h1>${esc(e.q)}</h1>
    <div class="ad-answer">${paras}</div>
  </article>
${goDeeper(e)}
  <button class="ad-share" type="button" onclick="adShare()">Share this answer</button>
${moreQs(e)}  <section class="ad-cta">
    <h2>Have a question of your own?</h2>
    <p>Ask Apologia Daily and get a thoughtful, evidence-based answer &mdash; free, no account needed.</p>
    <a class="ad-cta-btn" href="/asked-and-answered.html">Ask your question &rarr;</a>
  </section>
</main>
${FOOT}
<script>
function adShare(){
  var d={title:document.title,text:${JSON.stringify(e.q)},url:location.href};
  if(navigator.share){navigator.share(d).catch(function(){});return;}
  if(navigator.clipboard){navigator.clipboard.writeText(location.href);}
  var b=document.querySelector('.ad-share');if(b){var o=b.textContent;b.textContent='Link copied ✓';setTimeout(function(){b.textContent=o;},1500);}
}
</script>
  <script src="/analytics.js" defer></script>
  <script src="/ad-nav.js" defer></script>
${(e.clarifiers && e.clarifiers.length) ? '  <script src="/library/orthonote.js" defer></script>\n' : ''}</body>
</html>
`;
}

// ── REVIEW GATE (enforced) ──
// A new answer page is NOT generated unless its entry records BOTH required checks in a
// structured `reviewed` object: { argument: "<date>", orthodoxy: "<date>", by: "<name>" }.
// A bare `true` no longer passes — you must consciously stamp each gate (date + signer),
// which is an audit trail and harder to fake on autopilot. By policy, stamping a date means
// the corresponding agent (apologia-argument / apologia-orthodoxy) actually ran and the page
// was fixed to CLEAN. This is the SAME pipeline an essay gets; answers are not a lighter tier.
// See CLAUDE.md "MANDATORY content pipeline" + the "Orthodoxy outranks charity" guardrail.
// Additive: existing pages are never regenerated, so this only ever blocks brand-new answers.
// NOTE: the flag cannot PROVE the agents ran — it records an explicit, dated human assertion;
// the ultimate guarantee is the reviewer's integrity.
const missingChecks = (e) => {
  const r = e.reviewed;
  if (!r || typeof r !== 'object') return ['argument', 'orthodoxy'];
  return ['argument', 'orthodoxy'].filter((k) => !r[k]);   // null / "" / absent = not done
};
const blocked = [];
const created = [];
for (const e of data.answers) {
  const fp = join(ANSWERS, e.slug + '.html');
  if (existsSync(fp)) continue;              // additive: never overwrite a live page
  const missing = missingChecks(e);
  if (missing.length) { blocked.push([e, missing]); continue; }
  writeFileSync(fp, page(e), 'utf8');
  created.push(e);
}

if (blocked.length) {
  console.error(`\n⛔ ${blocked.length} new entr${blocked.length === 1 ? 'y' : 'ies'} BLOCKED — reviewed.{argument,orthodoxy} not both stamped. Run the missing gate(s), fix to CLEAN, then add the date(s):`);
  blocked.forEach(([e, missing]) => console.error(`   - ${e.slug}   missing: ${missing.join(' + ')}`));
  console.error('   No page was written for the above. Gate content, then re-run.\n');
}

if (!created.length) { console.log('No new pages — every _data.json entry already has a page.'); process.exit(0); }

console.log(`Created ${created.length} new page(s):`);
created.forEach((e) => console.log('  answers/' + e.slug + '.html  [' + e.category + ']'));

// Index snippets, grouped by category (in first-seen order among the new ones)
const byCat = {};
for (const e of created) (byCat[e.category] ||= []).push(e);
console.log('\n--- INDEX snippets (paste into answers/index.html) ---');
for (const cat of Object.keys(byCat)) {
  console.log(`      <div class='ad-cat'>${esc(cat)}</div>`);
  console.log(`      <ul class='ad-qlist'>`);
  for (const e of byCat[cat]) console.log(`        <li><a href='/answers/${e.slug}.html'>${esc(e.q)}</a></li>`);
  console.log(`      </ul>`);
}
console.log('\n--- SITEMAP lines (paste into sitemap.xml) ---');
for (const e of created) console.log(`  <url><loc>https://apologiadaily.com/answers/${e.slug}.html</loc><lastmod>2026-06-30</lastmod><priority>0.7</priority></url>`);
