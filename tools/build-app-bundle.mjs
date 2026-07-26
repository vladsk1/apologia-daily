#!/usr/bin/env node
/**
 * build-app-bundle.mjs — assemble the Capacitor web bundle (app/www).
 *
 * Apologia Daily is a static site deployed to Vercel. The native app (iOS +
 * Android, via Capacitor) ships the CLIENT assets *inside* the app bundle so it
 * is a real, offline-capable app — NOT a thin remote-URL webview (which Apple
 * rejects under Guideline 4.2). Dynamic data still comes from the live site:
 * the `/api/*` serverless functions stay on Vercel and Supabase is called
 * directly. The Capacitor fetch shim in analytics.js rewrites relative
 * `/api/*` calls to https://apologiadaily.com/api/* when running in the app.
 *
 * What ships in the bundle:
 *   - every client-facing file at the repo root (html/css/js/json/img/…)
 *   - the answers/, library/, and demo/ directories
 * What is EXCLUDED (server-only, build-only, or meta):
 *   - api/ (serverless — stays on Vercel), lib/ (server modules),
 *     sources/ & briefs/ (build inputs; the client fetches the *-index.json
 *     copies that live at the root), tools/, docs/, tests/, node_modules/,
 *     .github/, .git/, .claude/, drafts/, and the app/ output tree itself.
 *
 * Rebuild any time source changes:  npm run build:app   (or: node tools/build-app-bundle.mjs)
 * Then `cap sync` copies app/www into the native projects.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'app', 'www');

// Directories at the repo root that are client-facing and ship whole.
const INCLUDE_DIRS = new Set(['answers', 'library', 'demo']);

// Root-level files with these extensions are client assets and ship...
const CLIENT_EXT = new Set([
  '.html', '.css', '.js', '.mjs', '.json', '.png', '.jpg', '.jpeg', '.gif',
  '.svg', '.ico', '.webmanifest', '.xml', '.txt', '.woff', '.woff2', '.ttf', '.webp'
]);

// ...except these root files, which are build/config/meta and must NOT ship.
const EXCLUDE_ROOT_FILES = new Set([
  'package.json', 'package-lock.json', 'npm-shrinkwrap.json',
  'capacitor.config.json', 'capacitor.config.ts', 'capacitor.config.js',
  'vercel.json', 'jsconfig.json', 'tsconfig.json'
]);

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

/**
 * Keep in-app navigation inside the app.
 * A few pages link to the production site with an ABSOLUTE href (e.g. a demo
 * page's "back to the site" link). Inside the app those would bounce the user
 * out to a browser, so rewrite anchor hrefs pointing at our own origin to
 * root-relative paths — in the BUNDLE COPY ONLY; the live site is untouched.
 *
 * Deliberately narrow: it matches only `<a ... href="https://apologiadaily.com…"`.
 * `<link rel="canonical">` and og:/twitter: meta URLs (≈420 of them) MUST stay
 * absolute — they are SEO metadata, not navigation — and are not matched here
 * because the pattern requires an opening `<a` tag.
 */
const ABS_ANCHOR = /(<a\b[^>]*?\bhref=")https:\/\/(?:www\.)?apologiadaily\.com(\/[^"]*|)"/gi;
let rewrites = 0;
function localizeAnchors(html) {
  return html.replace(ABS_ANCHOR, (_m, head, pathPart) => {
    rewrites++;
    return `${head}${pathPart || '/'}"`;
  });
}

let fileCount = 0;
/** Copy a file, applying the anchor rewrite to HTML; everything else is byte-for-byte. */
async function copyFileMaybeRewrite(src, dest) {
  if (/\.html?$/i.test(src)) {
    await fs.writeFile(dest, localizeAnchors(await fs.readFile(src, 'utf8')), 'utf8');
  } else {
    await fs.copyFile(src, dest);
  }
  fileCount++;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else if (entry.isFile()) {
      await copyFileMaybeRewrite(s, d);
    }
  }
}

async function main() {
  await rmrf(OUT);
  await fs.mkdir(OUT, { recursive: true });

  // 1) Root-level client files
  for (const entry of await fs.readdir(ROOT, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (EXCLUDE_ROOT_FILES.has(entry.name)) continue;
    if (entry.name.startsWith('.')) continue;            // .env, .gitignore, dotfiles
    if (entry.name.endsWith('.md')) continue;            // README/HANDOFF/CLAUDE etc.
    if (!CLIENT_EXT.has(path.extname(entry.name).toLowerCase())) continue;
    await copyFileMaybeRewrite(path.join(ROOT, entry.name), path.join(OUT, entry.name));
  }

  // 2) Whole client directories
  for (const dir of INCLUDE_DIRS) {
    const src = path.join(ROOT, dir);
    try {
      const st = await fs.stat(src);
      if (st.isDirectory()) await copyDir(src, path.join(OUT, dir));
    } catch { /* dir absent — skip */ }
  }

  // Sanity: the app entry point must exist.
  try {
    await fs.access(path.join(OUT, 'index.html'));
  } catch {
    console.error('ERROR: app/www/index.html missing — bundle would not load.');
    process.exit(1);
  }

  console.log(`✓ app bundle built: ${fileCount} files → app/www (${rewrites} absolute in-app link(s) made relative)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
