#!/usr/bin/env node
/*
 * render-reviewer-pdfs.mjs — render the reviewer PDF pack for the sample
 * Evidence Library essays (English + Macedonian + a side-by-side spread each).
 *
 * WHAT IT PRODUCES, into <outdir> (default ./reviewer-pdfs):
 *   <Essay>_EN.pdf                      the certified English essay
 *   <Essay>_MK.pdf                      the AI-translated Macedonian mirror
 *   <Essay>_EN-MK-side-by-side.pdf      landscape, EN left / MK right (page-parallel)
 *   READ ME.txt                         what the pack is and what review is asked for
 *
 * HOW: it serves the repo over a local port, drives the pre-installed headless
 * Chromium through Playwright to print each page (nav / breadcrumbs / the "Pro"
 * badge / floating widgets removed for a clean reading PDF), then composes the
 * side-by-side spreads with pdf-lib. No network, no API keys — everything is
 * rendered from the working copy, so the PDFs always match the current content.
 *
 * ONE-TIME SETUP (the only dependencies; deliberately NOT added to package.json
 * so the dependency-free test suite stays that way):
 *   npm i playwright pdf-lib && npx playwright install chromium
 *
 * RUN:
 *   node tools/render-reviewer-pdfs.mjs ~/Desktop/"Pastor Sash"
 *   node tools/render-reviewer-pdfs.mjs               # -> ./reviewer-pdfs
 *
 * Add an essay by extending ESSAYS below (key = the library/<key>.html stem).
 */

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';

const require = createRequire(import.meta.url);
function need(mod, hint) {
  try { return require(mod); }
  catch {
    console.error(`\nMissing dependency "${mod}".\nRun this once, then re-run:\n  npm i playwright pdf-lib && npx playwright install chromium\n`);
    process.exit(1);
  }
}
const { chromium } = need('playwright');
const { PDFDocument } = need('pdf-lib');

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(process.argv[2] || join(REPO, 'reviewer-pdfs'));

const ESSAYS = [
  { key: 'finetuning',   name: 'Fine-Tuning' },
  { key: 'kalam',        name: 'Kalam-Cosmological-Argument' },
  { key: 'jesus_claims', name: 'Who-Did-Jesus-Claim-To-Be' },
  { key: 'minimalfacts', name: 'Minimal-Facts' },
  { key: 'hands',        name: 'HANDS-Deity-of-Christ' },
];

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon' };

// Strip nav / breadcrumbs / Pro badge / floating fixed widgets for a clean print.
const CLEANUP = () => {
  const kill = (sel) => document.querySelectorAll(sel).forEach((n) => n.remove());
  kill('.adn-nav'); kill('.art-crumbs'); kill('#proGate'); kill('.ad-mega-foot'); kill('.art-badge');
  document.querySelectorAll('body *').forEach((n) => {
    const p = getComputedStyle(n).position;
    if (p === 'fixed' || p === 'sticky') n.remove();
  });
  const art = document.querySelector('main.art');
  if (art) { art.style.margin = '0 auto'; art.style.maxWidth = '760px'; art.style.padding = '0 8px'; }
  document.body.style.background = '#ffffff';
};

async function renderOne(page, url, out) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: '@page{margin:16mm 14mm;} body{-webkit-print-color-adjust:exact;print-color-adjust:exact;} a{color:inherit;text-decoration:none;}' });
  await page.evaluate(CLEANUP);
  await page.evaluate(() => (document.fonts && document.fonts.ready)).catch(() => {});
  await page.waitForTimeout(400);
  await page.pdf({ path: out, format: 'A4', printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' } });
}

// EN left / MK right on one landscape-A4 sheet, page by page.
async function sideBySide(enPath, mkPath, outPath) {
  const [enBytes, mkBytes] = [await readFile(enPath), await readFile(mkPath)];
  const out = await PDFDocument.create();
  const en = await out.embedPdf(enBytes, [...Array((await PDFDocument.load(enBytes)).getPageCount()).keys()]);
  const mk = await out.embedPdf(mkBytes, [...Array((await PDFDocument.load(mkBytes)).getPageCount()).keys()]);
  const W = 841.89, H = 595.28, half = W / 2;
  const n = Math.max(en.length, mk.length);
  const draw = (pg, emb, xOff) => {
    const s = Math.min(half / emb.width, H / emb.height);
    pg.drawPage(emb, { x: xOff + (half - emb.width * s) / 2, y: (H - emb.height * s) / 2, xScale: s, yScale: s });
  };
  for (let i = 0; i < n; i++) {
    const pg = out.addPage([W, H]);
    if (i < en.length) draw(pg, en[i], 0);
    if (i < mk.length) draw(pg, mk[i], half);
  }
  await writeFile(outPath, await out.save());
}

const READ_ME = `Apologia Daily - sample Evidence Library essays for review
==========================================================

Five deep-dive essays, each provided three ways:

  <Essay>_EN.pdf                   English (our certified, fully-sourced original)
  <Essay>_MK.pdf                   Macedonian (first-pass AI translation)
  <Essay>_EN-MK-side-by-side.pdf   landscape, English left / Macedonian right

The essays:
  1. Fine-Tuning
  2. Kalam Cosmological Argument
  3. Who Did Jesus Claim to Be?
  4. The Minimal Facts (resurrection)
  5. HANDS - the Deity of Christ

The English essays are our certified originals. The Macedonian versions are
first-pass AI translations, synced to the current English and checked for
fidelity + orthodoxy, but PENDING a native-Macedonian theological/linguistic
review. That review is what we are asking for: read the Macedonian, compare it
to the English where helpful, and flag anything that reads wrongly in Macedonian
or drifts from the meaning. (In the side-by-side the pages run parallel but the
Macedonian is a little longer, so it drifts by a page or two toward the end.)
`;

async function main() {
  await mkdir(OUT, { recursive: true });
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const fp = join(REPO, p);
      if (!fp.startsWith(REPO)) { res.writeHead(403).end(); return; }
      const body = await readFile(fp);
      res.writeHead(200, { 'Content-Type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404).end('not found'); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const e of ESSAYS) {
    const enOut = join(OUT, `${e.name}_EN.pdf`);
    const mkOut = join(OUT, `${e.name}_MK.pdf`);
    await renderOne(page, `${base}/library/${e.key}.html`, enOut);
    await renderOne(page, `${base}/library/mk/${e.key}.html`, mkOut);
    await sideBySide(enOut, mkOut, join(OUT, `${e.name}_EN-MK-side-by-side.pdf`));
    console.log(`✓ ${e.name} (EN + MK + side-by-side)`);
  }
  await browser.close();
  server.close();
  await writeFile(join(OUT, 'READ ME.txt'), READ_ME);
  console.log(`\nDone. ${ESSAYS.length * 3} PDFs + READ ME written to:\n  ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
