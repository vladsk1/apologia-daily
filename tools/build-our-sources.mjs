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
  ouml: 'ö', auml: 'ä', icirc: 'î', aacute: 'á', iacute: 'í', oacute: 'ó', ccedil: 'ç', shy: '',
  amacr: 'ā', imacr: 'ī', umacr: 'ū', acirc: 'â', ecirc: 'ê', ucirc: 'û', ocirc: 'ô',
  Tau: 'Τ', Upsilon: 'Υ', Pi: 'Π', Omicron: 'Ο', Sigma: 'Σ', Alpha: 'Α', Epsilon: 'Ε', Omega: 'Ω' };
export function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (n in ENTITIES ? ENTITIES[n] : n.toLowerCase() in ENTITIES ? ENTITIES[n.toLowerCase()] : m));
}
const clean = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

/** Author display name from the text before the title: "Wright, N. T." -> "N. T. Wright". */
export function authorOf(liHtml) {
  let head = clean(liHtml.split('<em>')[0]).split(/[“"]/)[0].replace(/[.,\s]+$/, '');
  head = head.replace(/(?:,\s*|\s*\()\b(?:eds?|trans)\.?\)?(?:\s*(?:and|&)\s*\(?(?:eds?|trans)\.?\)?)?$/i, '').replace(/[.,\s]+$/, '');
  const etAl = /,?\s*et al\.?$/i.test(head);
  head = head.replace(/,?\s*et al\.?$/i, '');
  // "Surname, Given[, Jr.][, Co-author, … and Last]" -> "Given Surname Jr. & Co-author & Last"
  head = head.replace(/\s*\(with [^)]*\)/, '');
  head = head.replace(/[.,]?\s+review of\b.*$/i, ''); // "Tuckett, C. M. Review of Richard Bauckham," -> the reviewer
  const parts = head.split(/\s*,\s*(?:and\s+|&\s+)?|\s+(?:and|&)\s+/).map((x) => x.replace(/[.\s]+$/, '')).filter(Boolean);
  let names = [];
  if (parts.length >= 2 && parts[0].split(' ').length <= 3) {
    let i = 2;
    if (/^(Jr|Sr|II|III)$/.test(parts[2] || '')) { names.push(`${parts[1]} ${parts[0]} ${parts[2]}.`.replace(/(II|III)\.$/, '$1')); i = 3; }
    else names.push(`${parts[1]} ${parts[0]}`);
    names = names.concat(parts.slice(i));
  } else names = parts;
  let a = names.length > 2 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names.join(' & ');
  if (etAl) a += ' et al.';
  a = a.replace(/\b([A-Z])(?=\s|$)/g, '$1.').replace(/\.\./g, '.').replace(/\.\s+Review symposium.*$/, '').trim();
  return a.length > 70 ? '' : a;
}

// Works whose bibliography line has no parseable personal author (scriptures, creeds,
// church manuals, hadith collections) or an irregular one. Keyed by the parsed title;
// the value is the author shown. Found by the 2026-09-24 citations gate.
export const AUTHOR_OVERRIDES = {
  'Sahih Muslim': 'Muslim ibn al-Hajjaj',
  'The Holy Bible, English Standard Version': 'Crossway',
  'The Bridges’ Translation of the Ten Qira’at of the Noble Qur’an': 'Fadel Soliman et al.',
  'Sahih al-Bukhari': 'Muhammad al-Bukhari',
  'Virtues of the Qur’an': 'Muhammad al-Bukhari',
  'Quicunque vult': 'Anonymous (the Athanasian Creed)',
  'Muhammad in the Bible': 'ʿAbd al-Aḥad Dāwūd (David Benjamin Keldani)',
  'The Origins of Prebiological Systems and of Their Molecular Matrices': 'Theodosius Dobzhansky (discussion remark; volume ed. Sidney W. Fox)',
  'Doctrine and Covenants': 'The Church of Jesus Christ of Latter-day Saints',
  'Teachings of Presidents of the Church: Lorenzo Snow': 'The Church of Jesus Christ of Latter-day Saints',
  'The King Follett Sermon': 'Joseph Smith',
  'Trinity > History of Trinitarian Doctrines': 'Dale Tuggy',
  'Ecclesiastical History': 'Eusebius',
  'Sensed Presence and Mystical Experiences Are Predicted by Suggestibility, Not by the Application of Transcranial Weak Complex Magnetic Fields': 'Pehr Granqvist et al.',
  "Defenders of Reason in Islam: Mu'tazilism from Medieval School to Modern Symbol": 'Richard C. Martin & Mark R. Woodward, with Dwi S. Atmaja',
  'Seder Olam Rabbah': 'Attributed to Yose ben Halafta',
  'The Great Isaiah Scroll': 'The Israel Museum, Jerusalem',
  'The Great Isaiah Scroll (1QIsaa)': 'The Israel Museum, Jerusalem',
};

// Organisation names the "Surname, Given and Co-author" parser splits apart.
const AUTHOR_FIXES = {
  'Tract Society Watch Tower Bible': 'Watch Tower Bible and Tract Society',
  'Canon Institute Text': 'Text & Canon Institute',
  'Israel Museum': 'The Israel Museum, Jerusalem',
};

/** Parse one essay's bibliography into [{a,s,t,v,y}]. */
export function parseBibliography(html) {
  const m = html.match(/<h2[^>]*>[^<]*Bibliograph[^<]*<\/h2>([\s\S]*?)<\/(?:ul|ol)>/);
  if (!m) return null;
  const out = [];
  for (const [, li] of m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)) {
    const em = li.match(/<em>([\s\S]*?)<\/em>/);
    const txt = clean(li);
    const q = txt.match(/[“"]([^”"]+)[”"]/);
    // An article cited only by its quoted title has no <em>; keep it. A line with
    // neither (Scripture-only or unformatted) names no work, so skip it.
    if (!em && !q) continue;
    const emTxt = em ? clean(em[1]).replace(/[.,]+$/, '') : '';
    // An italic title that comes BEFORE a quoted string is the work; the quote is then a
    // chapter or section inside it. A quote before the italic is an article in that journal.
    const emFirst = em && q && txt.indexOf(emTxt) !== -1 && txt.indexOf(emTxt) < txt.indexOf(q[0]);
    const quoted = q && !emFirst;
    let title = (quoted ? q[1] : emTxt).replace(/[.,]+$/, '');
    // A book review: list it as the reviewer's "Review of <book>", not as the book itself.
    if (em && !/^Review of/i.test(title) && /\breview of\b/i.test(clean(li.split('<em>')[0]))) title = `Review of ${title.split('. ')[0]}`;
    const surname = (txt.split(/,|\(|\.| and /)[0].trim().split(' ').pop() || '');
    const rest = txt.replace(title, '').replace(emTxt, '');
    const year = (rest.match(/(?<![\d.:])(1[5-9]\d\d|20[0-2]\d)(?!\d|\.\d)/) || [''])[0];
    const o = AUTHOR_OVERRIDES[title];
    // A line that opens with its quoted title names no author (usually a web reference).
    const unsigned = !o && /^[“"‘]/.test(txt);
    const wiki = unsigned && /wikipedia\.org/i.test(txt);
    let a = o || (wiki ? 'Wikipedia' : unsigned ? 'No named author' : authorOf(li) || surname);
    a = AUTHOR_FIXES[a] || a;
    out.push({ a, s: o ? o.split(' ').pop() : unsigned ? 'zz-unsigned' : surname, t: title, v: quoted ? emTxt : '', y: year });
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

/* ── Talks & papers we studied ────────────────────────────────────────────────
 * The page's VIDEOS/ARTICLES cards are gated copy, so they are hand-written, not
 * generated. But the SET of cards must track the research libraries: every note in
 * docs/video-research/ and docs/article-research/ needs a card carrying its note id
 * (n:"<file-stem>"), or an entry below saying why it is left off. --check fails on a
 * note with no card, or a card whose note no longer exists. (Owner rule, 2026-09-24:
 * the page is updated whenever a talk or paper is added to the library.)
 */
export const STUDIED_DIRS = ['docs/video-research', 'docs/article-research'];
export const STUDIED_EXCLUDED = {
  'muhammad-in-the-bible-prophet-dilemma': 'speaker not identified in the note ("Michael", surname not captured); list once verified',
};
const NON_NOTES = /^(INDEX|README|MINING-BRIEF.*)\.md$/;

export function studiedCoverage(root = '.') {
  const notes = STUDIED_DIRS.flatMap((d) =>
    readdirSync(`${root}/${d}`).filter((f) => f.endsWith('.md') && !NON_NOTES.test(f)).map((f) => f.slice(0, -3)));
  const page = readFileSync(`${root}/our-sources.html`, 'utf8');
  const cards = [...page.matchAll(/\bn:"([a-z0-9-]+)"/g)].map((m) => m[1]);
  const missing = notes.filter((n) => !cards.includes(n) && !(n in STUDIED_EXCLUDED)).sort();
  const orphans = cards.filter((c) => !notes.includes(c)).sort();
  const staleExclusions = Object.keys(STUDIED_EXCLUDED).filter((n) => !notes.includes(n) || cards.includes(n));
  return { notes: notes.length, cards: cards.length, missing, orphans, staleExclusions };
}

function main() {
  const next = serialize(build('.'));
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== next) {
      console.error(`${OUT} is stale: an essay bibliography changed. Run: node tools/build-our-sources.mjs`);
      process.exit(1);
    }
    console.log(`${OUT} is current.`);
    const cov = studiedCoverage('.');
    const bad = [
      ...cov.missing.map((n) => `  research note with no card on our-sources.html: ${n}`),
      ...cov.orphans.map((n) => `  card whose research note does not exist: ${n}`),
      ...cov.staleExclusions.map((n) => `  STUDIED_EXCLUDED entry is stale (note gone, or it now has a card): ${n}`),
    ];
    if (bad.length) {
      console.error('Talks & papers we studied is out of step with the research libraries:\n' + bad.join('\n') +
        '\nAdd a card (n:"<note-file-stem>") to VIDEOS or ARTICLES in our-sources.html and gate it, ' +
        'or record a reason in STUDIED_EXCLUDED in tools/build-our-sources.mjs.');
      process.exit(1);
    }
    console.log(`Talks & papers: ${cov.cards} cards cover ${cov.notes} research notes.`);
    return;
  }
  writeFileSync(OUT, next);
  const d = JSON.parse(next);
  console.log(`Wrote ${OUT}: ${d.works.length} works from ${Object.keys(d.essays).length} essays.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
