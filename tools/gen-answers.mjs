#!/usr/bin/env node
/* Answer-page generator — the content flywheel.
   Reads answers/_data.json and writes an indexable /answers/<slug>.html for any
   entry that does not yet have a page (additive: never overwrites existing pages).
   Then prints the <li> snippets (grouped by category) and the sitemap lines to
   add for the new pages.

   Flywheel: a visitor question comes in (api/submit-question) -> draft a short
   answer -> run it through citations + argument + orthodoxy -> append an entry to
   answers/_data.json -> `node tools/gen-answers.mjs` -> paste the printed index +
   sitemap snippets -> deploy.

   Entry shape in _data.json:
     { slug, q, category, meta, a,                // a uses \n\n between paragraphs
       essay?, relatedLabel?,                     // explicit essay href (e.g. "/library/islam-preservation.html")
       related?, relatedLabel? }                  // OR legacy "ev-m-*.html" (maps to /library/<x>.html + practice link)
*/
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ANSWERS = join(ROOT, 'answers');
const data = JSON.parse(readFileSync(join(ANSWERS, '_data.json'), 'utf8'));

const NAV = `<nav class="adn-nav">
  <a href="/" class="adn-logo">Apologia<span>Daily</span></a>
  <button class="adn-burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>
  <div class="adn-collapse">
    <ul class="adn-links">
      <li><a href="/evidence-library.html">Evidence Library</a></li>
      <li><a href="/daily-devotional.html">Daily Devotional</a></li>
      <li><a href="/debate-arena.html">Debate Arena</a></li>
      <li><a href="/ask-anything.html">Ask Anything</a></li>
      <li><a href="/worldviews.html">Worldviews</a></li>
      <li><a href="/study-plans.html">Study Plans</a></li>
      <li class="adn-has-drop">
        <button type="button" class="adn-more" aria-expanded="false">More <span class="adn-caret">&#9662;</span></button>
        <ul class="adn-drop">
          <li><a href="/library/">Deep-Dive Essays</a></li><li><a href="/video-library.html">Videos</a></li>
          <li><a href="/games.html">Games</a></li>
          <li><a href="/whats-new.html">What&#39;s New</a></li>
          <li><a href="/answers/">Answers</a></li>
          <li><a href="/study-groups.html">Study Groups</a></li>
          <li><a href="/reading-club.html">Reading Clubs</a></li><li><a href="/about.html">About</a></li><li><a href="/what-we-believe.html">What We Believe</a></li><li><a href="/editorial-standards.html">Editorial Standards</a></li>
        </ul>
      </li>
    </ul>
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

function page(e) {
  const url = `https://apologiadaily.com/answers/${e.slug}.html`;
  const paras = String(e.a).split('\n\n').map((p) => `<p>${esc(p.trim())}</p>`).join('\n      ');
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
  <section class="ad-cta">
    <h2>Have a question of your own?</h2>
    <p>Ask Apologia Daily and get a thoughtful, evidence-based answer &mdash; free, no account needed.</p>
    <a class="ad-cta-btn" href="/ask-anything.html">Ask your question &rarr;</a>
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
</body>
</html>
`;
}

const created = [];
for (const e of data.answers) {
  const fp = join(ANSWERS, e.slug + '.html');
  if (existsSync(fp)) continue;
  writeFileSync(fp, page(e), 'utf8');
  created.push(e);
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
