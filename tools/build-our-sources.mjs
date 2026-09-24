#!/usr/bin/env node
/* build-our-sources.mjs — generates our-sources.json, the data behind /our-sources.html.
 *
 * The "Our Sources" page promises readers that its list always matches what the
 * essays actually cite. That promise is only true if the list is DERIVED, never
 * hand-kept: so this script reads the "Bibliography" list of every English
 * deep-dive essay (library/*.html, not the es/ mk/ mirrors) and writes one entry
 * per distinct work, with the essays that cite it.
 *
 * Nothing here is authored prose. The critic labels and "how we use it" notes
 * are doctrinal-adjacent copy about named people, so they live in the gated page
 * (our-sources.html), not in this generator.
 *
 * Run after any essay edit:  node tools/build-our-sources.mjs
 * CI runs --check, which exits 1 if our-sources.json is stale.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = 'our-sources.json';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', eacute: 'é', egrave: 'è', uuml: 'ü',
  ouml: 'ö', auml: 'ä', icirc: 'î', aacute: 'á', iacute: 'í', oacute: 'ó', ccedil: 'ç', shy: '' };
export function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in ENTITIES ? ENTITIES[n.toLowerCase()] : m));
}
const clean = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

/** Author display name from the text before the title: "Wright, N. T." -> "N. T. Wright". */
export function authorOf(liHtml) {
  let head = clean(liHtml.split('<em>')[0]).split(/[“"]/)[0].replace(/[.,\s]+$/, '');
  head = head.replace(/,?\s*\(?(?:ed|eds|trans)\.?\)?(?:\s*(?:and|&)\s*\(?(?:ed|eds|trans)\.?\)?)?$/i, '').replace(/[.,\s]+$/, '');
  // "Surname, Given[, Jr.][, Co-author, … and Last]" -> "Given Surname Jr. & Co-author & Last"
  head = head.replace(/\s*\(with [^)]*\)/, '');
  const parts = head.split(/\s*,\s*(?:and\s+|&\s+)?|\s+(?:and|&)\s+/).map((x) => x.replace(/[.\s]+$/, '')).filter(Boolean);
  let names = [];
  if (parts.length >= 2 && parts[0].split(' ').length <= 3) {
    let i = 2;
    if (/^(Jr|Sr|II|III)$/.test(parts[2] || '')) { names.push(`${parts[1]} ${parts[0]} ${parts[2]}.`.replace(/(II|III)\.$/, '$1')); i = 3; }
    else names.push(`${parts[1]} ${parts[0]}`);
    names = names.concat(parts.slice(i));
  } else names = parts;
  let a = names.length > 2 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names.join(' & ');
  a = a.replace(/\b([A-Z])(?=\s|$)/g, '$1.').replace(/\.\./g, '.').replace(/\.\s+Review symposium.*$/, '').trim();
  return a.length > 70 ? '' : a;
}

/** Parse one essay's bibliography into [{a,s,t,v,y}]. */
export function parseBibliography(html) {
  const m = html.match(/<h2[^>]*>[^<]*Bibliograph[^<]*<\/h2>([\s\S]*?)<\/(?:ul|ol)>/);
  if (!m) return null;
  const out = [];
  for (const [, li] of m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)) {
    const em = li.match(/<em>([\s\S]*?)<\/em>/);
    if (!em) continue; // Scripture-only or unformatted lines carry no work title
    const txt = clean(li);
    const emTxt = clean(em[1]).replace(/[.,]+$/, '');
    const q = txt.match(/[“"]([^”"]+)[”"]/);
    const title = (q ? q[1] : emTxt).replace(/[.,]+$/, '');
    const surname = (txt.split(/,|\(|\.| and /)[0].trim().split(' ').pop() || '');
    const year = (txt.match(/\b(1[5-9]\d\d|20[0-2]\d)\b/) || [''])[0];
    out.push({ a: authorOf(li) || surname, s: surname, t: title, v: q ? emTxt : '', y: year });
  }
  return out;
}

export function build(root = '.') {
  const dir = `${root}/library`;
  const files = readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
  const works = new Map();
  const essays = {};
  for (const f of files) {
    const html = readFileSync(`${dir}/${f}`, 'utf8');
    const bib = parseBibliography(html);
    if (!bib) continue;
    const name = f.slice(0, -5);
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    essays[name] = h1 ? clean(h1[1]) : name;
    for (const w of bib) {
      const key = `${w.s.toLowerCase()}|${w.t.toLowerCase().replace(/\W/g, '').slice(0, 28)}`;
      if (!works.has(key)) works.set(key, { ...w, e: new Set() });
      works.get(key).e.add(name);
    }
  }
  const list = [...works.values()]
    .map((w) => ({ ...w, e: [...w.e].sort() }))
    .sort((x, y) => y.e.length - x.e.length || x.s.localeCompare(y.s) || x.t.localeCompare(y.t));
  return { essays, works: list };
}

export const serialize = (d) => JSON.stringify(d) + '\n';

function main() {
  const next = serialize(build('.'));
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== next) {
      console.error(`${OUT} is stale: an essay bibliography changed. Run: node tools/build-our-sources.mjs`);
      process.exit(1);
    }
    console.log(`${OUT} is current.`);
    return;
  }
  writeFileSync(OUT, next);
  const d = JSON.parse(next);
  console.log(`Wrote ${OUT}: ${d.works.length} works from ${Object.keys(d.essays).length} essays.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
