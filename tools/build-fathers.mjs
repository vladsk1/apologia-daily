#!/usr/bin/env node
/**
 * build-fathers.mjs — the Church Fathers "Full works" library.
 *
 * Owner ruling 2026-11-18 (docs/FREE_LIBRARY_CANDIDATES.md → "Church Fathers library: hosting
 * rules"): public-domain Father texts are hosted IN FULL, each with a short guide, linked Bible
 * references and links to our essays. This script turns
 *     fathers/_data/<slug>.json        — guide, notes, essay links, copy-check record, review stamp
 *     fathers/_data/<slug>.text.json   — the Father's text (machine-extracted, copy-checked)
 * into
 *     fathers/<slug>.html              — the book page (guide, key passages, contents, colophon)
 *     fathers/<partSlug><n>.html       — one page per part (oration/book), section-numbered
 * and keeps the "Full works" shelf on sources.html in step (between the fathers-shelf markers).
 *
 * The rules it enforces mechanically:
 *  - Rule 1 (editors' notes stripped): the text file holds only the Father's words, the section
 *    numbers and Bible references; this script adds nothing else to the text.
 *  - The text cannot drift after its copy-check: its SHA-256 must equal copyCheck.textSha256.
 *    Change the text → re-run the copy-check → update the hash (--stamp-hash).
 *  - Rule 2 (neutral notes): every note must point at a real section.
 *  - Rule 6 (review): the guide + notes are doctrinal content; the stamp comes from "reviewed"
 *    and fathers/*.html is in CONTENT_PATTERNS, so an unreviewed book cannot pass CI.
 *
 * Usage:  node tools/build-fathers.mjs            # write
 *         node tools/build-fathers.mjs --check    # CI: fail if any output is stale
 *         node tools/build-fathers.mjs --stamp-hash <slug>   # record the text hash after a copy-check
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CANON } from './sync-nav.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'fathers', '_data');
const CHECK = process.argv.includes('--check');
const STAMP = process.argv.includes('--stamp-hash') ? process.argv[process.argv.indexOf('--stamp-hash') + 1] : null;
const SITE = 'https://apologiadaily.com';
export const TOP_LINE = 'These are historic witnesses, not Scripture. We present them complete, including passages that Christian traditions read differently.';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
export const textHash = (text) => createHash('sha256').update(JSON.stringify(text.parts)).digest('hex');

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
const FOOT = `<footer class="fw-foot">
  <a href="/">apologiadaily.com</a> &middot; <a href="/sources.html#full-works">Church Fathers &amp; Creeds</a> &middot; <a href="/evidence-library.html">Evidence Library</a>
  <div class="fw-foot-tag">Defending the faith with gentleness and respect.</div>
</footer>`;

function stamp(meta) {
  const r = meta.reviewed;
  if (!r) return '<!-- content-review: PENDING — guide and notes not yet reviewed (rule 6) -->';
  return `<!-- content-review: ${JSON.stringify(r)} -->`;
}

function loadSources() {
  const byId = {};
  for (const f of readdirSync(path.join(ROOT, 'sources')).filter((x) => x.endsWith('.json'))) {
    for (const e of JSON.parse(readFileSync(path.join(ROOT, 'sources', f), 'utf8'))) byId[e.id] = e;
  }
  return byId;
}

const partFile = (meta, n) => `${meta.partSlug}${n}.html`;
const secHref = (meta, at) => { const [p, s] = String(at).split('.'); return `/fathers/${partFile(meta, p)}#s${s}`; };

function head({ title, desc, url, ld }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} | Apologia Daily</title>
<meta name="description" content="${escAttr(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="book">
<meta property="og:site_name" content="Apologia Daily">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-default.jpg">
<meta name="twitter:image" content="${SITE}/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@apologiadaily">
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/ad-nav.css">
<link rel="stylesheet" href="/fathers/fathers.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>`;
}
const SCRIPTS = `<script src="/analytics.js" defer></script>
<script src="/ad-nav.js" defer></script>
<script src="/library/verse-popup.js" defer></script>`;

function colophon(meta, text, { full }) {
  const t = meta.translation;
  let out = `<p><b>Translation:</b> ${esc(t.translators)}, <em>${esc(t.edition)}</em>. Public domain.</p>
<p>The ${meta.printYear} editors&rsquo; introductions and footnotes are omitted; their Bible references are kept. Text: ${esc(t.base)}, ${t.compared ? esc(t.compared) : `compared word by word with a scan of the ${meta.printYear} printing; differences in wording were checked by hand against a second scan`}.</p>`;
  if (full) {
    out += `<p><b>Copy-check (${esc(meta.copyCheck.date)}).</b> ${esc(meta.copyCheck.method)} ${esc(meta.copyCheck.result)}</p>
<p><b>Corrections to the transcription</b> (${esc(meta.authorShort)}&rsquo;s words, restored to the ${meta.printYear} printing):</p>
<ul class="fw-corr">${text.corrections.map((c) => `<li>${esc(c.sec)}: the transcription reads &ldquo;${esc(c.from)}&rdquo;; the ${meta.printYear} printing reads &ldquo;${esc(c.to)}&rdquo;.</li>`).join('')}</ul>`;
    if ((text.refCorrections || []).length) {
      out += `
<p><b>Corrected Bible references</b> (the editors&rsquo; references, not ${esc(meta.authorShort)}&rsquo;s words):</p>
<ul class="fw-corr">${text.refCorrections.map((c) => `<li>${esc(c.sec)}: ${esc(c.from)} &rarr; ${esc(c.to)} &mdash; ${esc(c.why)}.</li>`).join('')}</ul>`;
    }
  }
  return `<section class="fw-colo" aria-label="About this text">${out}</section>`;
}

function renderPara(segs) {
  return segs.map((s) => (typeof s === 'string' ? esc(s) : `<span class="fw-ref">(${esc(s.ref)})</span>`)).join('').replace(/\s+(<span class="fw-ref">)/g, ' $1');
}

function partPage(meta, text, part, sources) {
  const url = `${SITE}/fathers/${partFile(meta, part.n)}`;
  const idx = text.parts.findIndex((p) => p.n === part.n);
  const prev = text.parts[idx - 1], next = text.parts[idx + 1];
  const notes = Object.fromEntries((meta.notes || []).map((n) => [n.at, n.text]));
  const cites = {};
  for (const l of meta.essayLinks || []) for (const c of l.cites || []) (cites[c] = cites[c] || []).push(l);
  const ctx = {};
  for (const id of meta.keyPassages || []) { const e = sources[id]; if (e && e.context_url) ctx[e.context_url.split('#')[1]] = true; }
  const title = `${meta.author}, ${meta.partLabel} ${part.n}: ${part.title}`;
  const body = part.sections.map((s) => {
    const key = `${part.n}.${s.n}`;
    const num = s.supplied
      ? `<a class="fw-num fw-supplied" href="#s${s.n}" title="This section has no number in the ${meta.printYear} printing; the standard number is supplied.">[${s.n}]</a>`
      : `<a class="fw-num" href="#s${s.n}" aria-label="Section ${key}">${s.n}</a>`;
    const note = notes[key] ? `\n    <aside class="fw-note"><b>A note on this passage.</b> ${esc(notes[key])}</aside>` : '';
    const cite = cites[key] ? `\n    <p class="fw-cited">Our essays cite this section: ${cites[key].map((l) => `<a href="${l.href}">${esc(l.title)}</a>`).join(' &middot; ')}</p>` : '';
    return `  <section class="fw-sec" id="s${s.n}">
    ${num}
    <div class="fw-body">${s.paras.map((p) => `<p>${renderPara(p)}</p>`).join('')}</div>${note}${cite}
  </section>`;
  }).join('\n');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Chapter', name: `${meta.partLabel} ${part.n}: ${part.title}`, url, inLanguage: 'en',
      author: { '@type': 'Person', name: meta.author },
      isPartOf: { '@type': 'Book', name: meta.work, url: `${SITE}/fathers/${meta.slug}.html` } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Church Fathers & Creeds', item: `${SITE}/sources.html` },
      { '@type': 'ListItem', position: 2, name: meta.work, item: `${SITE}/fathers/${meta.slug}.html` },
      { '@type': 'ListItem', position: 3, name: `${meta.partLabel} ${part.n}` }] },
  ];
  const desc = `${meta.author}, ${meta.partLabel} ${part.n} (${part.title}${part.subtitle ? ': ' + part.subtitle : ''}), complete, in the ${meta.printYear} public-domain translation.`;
  return `${head({ title, desc, url, ld })}
${stamp(meta)}
<body>
${NAV}
<main class="fw-main">
  <nav class="fw-crumbs"><a href="/sources.html#full-works">Church Fathers &amp; Creeds</a> &rsaquo; <a href="/fathers/${meta.slug}.html">${esc(meta.workShort)}</a> &rsaquo; <span>${meta.partLabel} ${part.n}</span></nav>
  <header class="fw-head">
    <p class="fw-eyebrow">${esc(meta.author)} &middot; ${esc(meta.workShort)} &middot; AD ${meta.year}</p>
    <h1>${esc(part.title)}</h1>
    ${part.subtitle ? `<p class="fw-sub">${esc(part.subtitle)}</p>` : ''}
    <p class="fw-topline">${esc(TOP_LINE)} <a href="/fathers/${meta.slug}.html">Read the guide &rarr;</a></p>
  </header>
  <article class="fw-text">
${body}
  </article>
  <nav class="fw-pn" aria-label="More of this work">
    ${prev ? `<a href="/fathers/${partFile(meta, prev.n)}">&larr; ${meta.partLabel} ${prev.n}</a>` : '<span></span>'}
    <a href="/fathers/${meta.slug}.html">Contents &amp; guide</a>
    ${next ? `<a href="/fathers/${partFile(meta, next.n)}">${meta.partLabel} ${next.n} &rarr;</a>` : '<span></span>'}
  </nav>
${colophon(meta, text, { full: false })}
</main>
${FOOT}
${SCRIPTS}
</body>
</html>
`;
}

function bookPage(meta, text, sources) {
  const url = `${SITE}/fathers/${meta.slug}.html`;
  const keys = (meta.keyPassages || []).map((id) => sources[id]).filter((e) => e && e.verified);
  const keyHtml = keys.map((e) => `    <figure class="fw-key">
      <blockquote>${esc(e.text)}</blockquote>
      <figcaption>${esc(e.section)} &middot; <a href="${escAttr(e.context_url || '#')}">Read it in context &rarr;</a></figcaption>
    </figure>`).join('\n');
  const contents = text.parts.map((p) => `    <li><a href="/fathers/${partFile(meta, p.n)}"><b>${meta.partLabel} ${p.n}</b> &middot; ${esc(p.title)}${p.subtitle ? ': ' + esc(p.subtitle) : ''}</a><span>${esc(meta.topics[p.n] || '')} &middot; ${p.sections.length} sections</span></li>`).join('\n');
  const essays = (meta.essayLinks || []).map((l) => `    <li><a href="${l.href}">${esc(l.title)}</a> &mdash; ${esc(l.about)} (${l.cites.map((c) => `<a href="${secHref(meta, c)}">${c}</a>`).join(', ')})</li>`).join('\n');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Book', name: meta.work, url, inLanguage: 'en',
      author: { '@type': 'Person', name: meta.author }, translator: meta.translation.translators,
      description: meta.description, isAccessibleForFree: true, copyrightNotice: 'Public domain' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Church Fathers & Creeds', item: `${SITE}/sources.html` },
      { '@type': 'ListItem', position: 2, name: meta.work }] },
  ];
  return `${head({ title: `${meta.work} — ${meta.author}`, desc: meta.description, url, ld })}
${stamp(meta)}
<body>
${NAV}
<main class="fw-main">
  <nav class="fw-crumbs"><a href="/sources.html#full-works">Church Fathers &amp; Creeds</a> &rsaquo; <span>${esc(meta.workShort)}</span></nav>
  <header class="fw-head">
    <p class="fw-eyebrow">Full works &middot; ${esc(meta.author)} (${esc(meta.authorDates)})</p>
    <h1>${esc(meta.work)}</h1>
    <p class="fw-sub">${esc(meta.place)}, AD ${meta.year} &middot; complete, in the ${meta.printYear} public-domain translation</p>
    <p class="fw-topline">${esc(TOP_LINE)}</p>
  </header>
  <section class="fw-guide" aria-label="Guide">
${meta.guide.map((g) => `    <h2>${esc(g.h)}</h2>\n    ${g.html}`).join('\n')}
  </section>
  ${keys.length ? `<section class="fw-keys" aria-label="Key passages">
    <h2>Key passages</h2>
    <p class="fw-keys-note">Each is verified word for word against the ${meta.printYear} text.</p>
${keyHtml}
  </section>` : ''}
  <section class="fw-contents" aria-label="Contents">
    <h2>Read the ${meta.partLabel.toLowerCase()}s</h2>
    <ol>
${contents}
    </ol>
  </section>
  ${essays ? `<section class="fw-essays" aria-label="Where our essays use this work">
    <h2>Where our essays use these orations</h2>
    <ul>
${essays}
    </ul>
  </section>` : ''}
${colophon(meta, text, { full: true })}
</main>
${FOOT}
${SCRIPTS}
</body>
</html>
`;
}

function shelfBlock(books) {
  const cards = books.map(({ meta, text }) => `      <a class="fw-card" href="/fathers/${meta.slug}.html">
        <span class="fw-card-au">${esc(meta.author)} &middot; ${esc(meta.tradition)}</span>
        <span class="fw-card-t">${esc(meta.work)}</span>
        <span class="fw-card-d">AD ${meta.year} &middot; ${text.parts.length} ${meta.partLabel.toLowerCase()}s, complete &middot; with a short guide</span>
      </a>`).join('\n');
  return `<!-- fathers-shelf:start (generated by tools/build-fathers.mjs — do not edit by hand) -->
    <section class="fw-shelf" id="full-works" aria-label="Full works">
      <h2 class="fw-shelf-h">Full works</h2>
      <p class="fw-shelf-line">${esc(TOP_LINE)}</p>
      <div class="fw-cards">
${cards}
      </div>
      <h2 class="fw-shelf-h fw-shelf-pass">Passages</h2>
    </section>
    <!-- fathers-shelf:end -->`;
}

// ── main ──
const books = [];
for (const f of readdirSync(DATA).filter((x) => x.endsWith('.json') && !x.endsWith('.text.json')).sort()) {
  const metaPath = path.join(DATA, f);
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  const text = JSON.parse(readFileSync(path.join(DATA, f.replace(/\.json$/, '.text.json')), 'utf8'));
  const h = textHash(text);
  if (STAMP === meta.slug) {
    meta.copyCheck.textSha256 = h;
    writeFileSync(metaPath, JSON.stringify(meta, null, 1) + '\n');
    console.log(`stamped text hash for ${meta.slug}: ${h}`);
  } else if (meta.copyCheck.textSha256 !== h) {
    console.error(`✗ ${meta.slug}: the text no longer matches its copy-check (hash ${h.slice(0, 12)}… ≠ ${String(meta.copyCheck.textSha256).slice(0, 12)}…).\n  Re-run the copy-check, then: node tools/build-fathers.mjs --stamp-hash ${meta.slug}`);
    process.exit(1);
  }
  const secs = new Set(text.parts.flatMap((p) => p.sections.map((s) => `${p.n}.${s.n}`)));
  for (const n of meta.notes || []) if (!secs.has(n.at)) { console.error(`✗ ${meta.slug}: note points at missing section ${n.at}`); process.exit(1); }
  for (const l of meta.essayLinks || []) {
    if (!existsSync(path.join(ROOT, l.href.replace(/^\//, '')))) { console.error(`✗ ${meta.slug}: essay link ${l.href} does not exist`); process.exit(1); }
    for (const c of l.cites) if (!secs.has(c)) { console.error(`✗ ${meta.slug}: essay link cites missing section ${c}`); process.exit(1); }
  }
  books.push({ meta, text });
}

const sources = loadSources();
const outputs = [];
for (const { meta, text } of books) {
  for (const id of meta.keyPassages || []) {
    const e = sources[id];
    if (!e || !e.verified) { console.error(`✗ ${meta.slug}: key passage ${id} is missing or not verified in /sources`); process.exit(1); }
  }
  outputs.push([`fathers/${meta.slug}.html`, bookPage(meta, text, sources)]);
  for (const part of text.parts) outputs.push([`fathers/${partFile(meta, part.n)}`, partPage(meta, text, part, sources)]);
}
// sources.html shelf
const srcPath = 'sources.html';
const src = readFileSync(path.join(ROOT, srcPath), 'utf8');
const re = /<!-- fathers-shelf:start[\s\S]*?<!-- fathers-shelf:end -->/;
if (!re.test(src)) { console.error('✗ sources.html has no fathers-shelf markers'); process.exit(1); }
outputs.push([srcPath, src.replace(re, shelfBlock(books))]);

const norm = (s) => s.replace(/\r\n/g, '\n');
let stale = 0;
for (const [rel, content] of outputs) {
  const p = path.join(ROOT, rel);
  const cur = existsSync(p) ? readFileSync(p, 'utf8') : null;
  if (cur !== null && norm(cur) === norm(content)) continue;
  if (CHECK) { console.error(`✗ stale: ${rel}`); stale++; continue; }
  writeFileSync(p, content);
  console.log(`wrote ${rel}`);
}
if (CHECK && stale) { console.error(`\n${stale} file(s) out of date — run: node tools/build-fathers.mjs`); process.exit(1); }
if (CHECK) console.log(`✓ fathers library up to date (${books.length} work(s), ${outputs.length} files)`);
