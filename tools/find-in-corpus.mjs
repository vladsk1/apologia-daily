#!/usr/bin/env node
// find-in-corpus.mjs — entity-aware search across the live content surfaces.
//
// WHY: our HTML stores accented / special characters as HTML entities, so a plain grep is BLIND to
// them. `Lemaître` is stored as `Lema&icirc;tre`; a mine that greps "Lemaître" gets ZERO hits and
// nearly files him as a coverage gap when he opens the essay (this actually happened, 2026-08-06).
// A search pattern cannot see what it cannot spell. This tool DECODES entities on both sides before
// matching, so an accented term finds its encoded form (and vice-versa), case-insensitively.
//
// Usage:
//   node tools/find-in-corpus.mjs "Lemaître"            # search .html surfaces
//   node tools/find-in-corpus.mjs "Lemaître" --json     # also search the content .json
//   node tools/find-in-corpus.mjs --self-test           # prove the entity-decode works (CI-safe)
//
// Read-only, dependency-free, no network. Reports file:line + a snippet, and a per-file hit count.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  agrave: 'à', aacute: 'á', acirc: 'â', auml: 'ä', atilde: 'ã', aring: 'å', aelig: 'æ',
  egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë',
  igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ograve: 'ò', oacute: 'ó', ocirc: 'ô', ouml: 'ö', otilde: 'õ', oslash: 'ø',
  ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü',
  ntilde: 'ñ', ccedil: 'ç', yacute: 'ý', yuml: 'ÿ', szlig: 'ß',
  Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Auml: 'Ä', Atilde: 'Ã', Aring: 'Å',
  Egrave: 'È', Eacute: 'É', Ecirc: 'Ê', Euml: 'Ë',
  Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï',
  Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Ouml: 'Ö', Otilde: 'Õ', Oslash: 'Ø',
  Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü', Ntilde: 'Ñ', Ccedil: 'Ç',
};

export function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => cp(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => cp(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => (name in NAMED ? NAMED[name] : m));
}
function cp(n) {
  try { return String.fromCodePoint(n); } catch { return ''; }
}
function norm(s) {
  return decodeEntities(s).toLowerCase();
}

const EXCLUDE_DIRS = new Set([
  '.git', 'node_modules', 'app', '_parked', '_pdfs', '_transcripts', '.vercel', 'coverage',
]);
function walk(dir, exts, out) {
  for (const name of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(name)) continue;
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
}

function selfTest() {
  const checks = [
    ['Lema&icirc;tre', 'Lemaître'],
    ['R&eacute;sum&eacute;', 'résumé'],
    ['caf&#233;', 'café'],
    ['na&#239;ve', 'naïve'],
    ['Erasmus &amp; More', 'erasmus & more'],
    ['&#x111;', 'đ'],
  ];
  let ok = true;
  for (const [encoded, expectPlain] of checks) {
    const got = norm(encoded);
    const want = expectPlain.toLowerCase();
    const pass = got === want || got.includes(want);
    if (!pass) { ok = false; console.error(`FAIL: norm(${JSON.stringify(encoded)}) = ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`); }
  }
  // the headline case: searching the accented term finds the encoded line
  const line = 'Georges Lema&icirc;tre proposed the primeval atom.';
  if (!norm(line).includes(norm('Lemaître'))) { ok = false; console.error('FAIL: accented term did not match its encoded form'); }
  console.log(ok ? '✓ find-in-corpus self-test passed' : '✗ find-in-corpus self-test FAILED');
  process.exit(ok ? 0 : 1);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();

const withJson = args.includes('--json');
const term = args.find((a) => !a.startsWith('--'));
if (!term) {
  console.error('usage: node tools/find-in-corpus.mjs "<term>" [--json]');
  process.exit(2);
}

const exts = withJson ? ['.html', '.json'] : ['.html'];
const files = [];
walk(ROOT, exts, files);

const needle = norm(term);
let totalHits = 0;
let filesWithHits = 0;
for (const file of files.sort()) {
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  if (!norm(text).includes(needle)) continue;
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const lines = text.split('\n');
  const hits = [];
  lines.forEach((ln, i) => {
    if (norm(ln).includes(needle)) hits.push([i + 1, ln.trim()]);
  });
  if (!hits.length) continue; // matched across a wrapped line only; rare
  filesWithHits++;
  totalHits += hits.length;
  console.log(`\n${rel}  (${hits.length})`);
  for (const [n, snippet] of hits.slice(0, 8)) {
    const s = snippet.length > 120 ? snippet.slice(0, 119) + '…' : snippet;
    console.log(`  ${n}: ${s}`);
  }
  if (hits.length > 8) console.log(`  … +${hits.length - 8} more`);
}
console.log(`\n${totalHits} hit(s) in ${filesWithHits} file(s)  [term: "${term}", entity-decoded]`);
