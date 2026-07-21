/* build-objections.mjs — harvest the Objection Deck from the certified ev-m mastery pages.
 *
 * The Objection Deck is an interleaved spaced-repetition drill: front = a skeptic's
 * objection, back = your move. Every card is HARVESTED VERBATIM from the objection-style
 * flashcards already living inside the ev-m-*.html mastery pages — which have each cleared
 * the citations -> argument -> orthodoxy pipeline. We do NOT author new doctrine here; we
 * re-surface certified replies in a new, interleaved practice format. (The prompt side is
 * lightly, mechanically cleaned — e.g. "Reply to: X" -> "X" — never the reply.)
 *
 * Output: objections.json  (consumed by objection-deck.html)
 * Run:    node tools/build-objections.mjs         (writes)
 *         node tools/build-objections.mjs --check  (CI: fails if out of date)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
const CHECK = process.argv.includes('--check');

/* id -> {n:name, c:category} from coach.js ARGS, plus a fallback for ev-m ids not in ARGS. */
function argMap() {
  const s = readFileSync(ROOT + 'coach.js', 'utf8');
  const m = s.match(/var ARGS = \{([\s\S]*?)\n {2}\};/);
  const out = {};
  if (m) {
    const re = /([a-z0-9_]+)\s*:\s*\{\s*n\s*:\s*(["'])((?:\\.|(?!\2).)*)\2\s*,\s*c\s*:\s*(["'])((?:\\.|(?!\4).)*)\4/g;
    let e;
    while ((e = re.exec(m[1]))) out[e[1]] = { n: e[3], c: e[5] };
  }
  // ev-m ids not present in ARGS (Trinity / OT-Jesus additions)
  const fallback = {
    analogies:   { n: 'Why Every Trinity Analogy Fails', c: 'The Trinity' },
    holy_spirit: { n: 'The Deity and Personhood of the Holy Spirit', c: 'The Trinity' },
    relations:   { n: 'What Distinguishes the Persons', c: 'The Trinity' },
    typology:    { n: 'Typology: Christ in the Old Testament', c: 'Old Testament & Jesus' },
  };
  for (const k in fallback) if (!out[k]) out[k] = fallback[k];
  return out;
}

/* Decide whether a flashcard is objection-shaped (skeptic's challenge -> rebuttal). */
function isObjection(q) {
  const t = q.toLowerCase();
  return (
    /^reply to:/.test(t) ||
    /\bskeptic\b/.test(t) ||
    /\bobjection\b/.test(t) ||
    /\bcritic(s|ism)?\b/.test(t) ||
    /isn['’]?t\b/.test(t) ||
    /doesn['’]?t\b/.test(t) ||
    /wasn['’]?t\b/.test(t) ||
    /aren['’]?t\b/.test(t) ||
    /couldn['’]?t\b/.test(t) ||
    /\bwhy (isn|must|not|can|does|is|would|should)/.test(t) ||
    /\bwhat about\b/.test(t) ||
    /counter-?example/.test(t) ||
    /your (reply|response)\b/.test(t) ||
    /—\s*(your|reply|respond)/.test(t) ||
    /\bhow (does|do|can|would)\b.*\b(objection|skeptic|fail|answer|respond)/.test(t) ||
    /\bbut (what|isn|doesn|couldn|the|how|if)\b/.test(t)
  );
}

/* Present the front as the objection itself. Only the PROMPT is cleaned, never the reply. */
function cleanFront(q) {
  let f = q.trim();
  f = f.replace(/^reply to:\s*/i, '');          // "Reply to: X" -> "X"
  f = f.replace(/\s*—\s*your (reply|response)\??$/i, ''); // drop trailing "— your reply?"
  // capitalize first letter if we stripped a lowercase-leading prefix
  if (f && /[a-z]/.test(f[0])) f = f[0].toUpperCase() + f.slice(1);
  return f;
}

/* Decode a JS string literal's inner text (handles \' \" \\ \n \uXXXX etc.). */
function jsUnescape(inner) {
  return inner.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_m, g) => {
    if (g[0] === 'u' || g[0] === 'x') return String.fromCharCode(parseInt(g.slice(1), 16));
    const map = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', '0': '\0' };
    return map[g] !== undefined ? map[g] : g; // \' -> ' , \" -> " , \\ -> \ , \/ -> /
  });
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

const ARGS = argMap();
const files = readdirSync(ROOT).filter((f) => /^ev-m-.*\.html$/.test(f)).sort();
const cardRe = /\{q:\s*(["'])((?:\\.|(?!\1).)*)\1\s*,\s*a:\s*(["'])((?:\\.|(?!\3).)*)\3\s*\}/g;

const items = [];
const seen = new Set();
for (const file of files) {
  const arg = file.replace(/^ev-m-/, '').replace(/\.html$/, '');
  const meta = ARGS[arg] || { n: arg, c: 'General' };
  const s = readFileSync(ROOT + file, 'utf8');
  const block = s.match(/const cards = \[([\s\S]*?)\];/);
  if (!block) continue;
  let m;
  cardRe.lastIndex = 0;
  while ((m = cardRe.exec(block[1]))) {
    const q = jsUnescape(m[2]);
    const a = jsUnescape(m[4]);
    if (!isObjection(q)) continue;
    const front = cleanFront(q);
    if (!front || front.length < 8) continue;
    const key = slug(front);
    if (seen.has(arg + '|' + key)) continue;
    seen.add(arg + '|' + key);
    items.push({
      id: arg + '-' + key,
      arg,
      argName: meta.n,
      category: meta.c,
      front,
      back: a,
      source: 'ev-m-' + arg + '.html',
    });
  }
}

items.sort((x, y) => (x.category + x.arg + x.id).localeCompare(y.category + y.arg + y.id));

const byCat = {};
for (const it of items) byCat[it.category] = (byCat[it.category] || 0) + 1;

const payload = {
  generated: 'tools/build-objections.mjs',
  note: 'Harvested VERBATIM (reply side) from certified ev-m-*.html mastery pages. Do not hand-edit; re-run the build.',
  count: items.length,
  categories: byCat,
  objections: items,
};
const json = JSON.stringify(payload, null, 2) + '\n';
const outPath = ROOT + 'objections.json';

if (CHECK) {
  let cur = '';
  try { cur = readFileSync(outPath, 'utf8'); } catch { /* missing */ }
  if (cur !== json) {
    console.error('✗ objections.json is out of date. Run: node tools/build-objections.mjs');
    process.exit(1);
  }
  console.log(`✓ objections.json is up to date (${items.length} objections).`);
} else {
  writeFileSync(outPath, json, 'utf8');
  console.log(`Wrote objections.json — ${items.length} objections across ${Object.keys(byCat).length} categories:`);
  for (const c of Object.keys(byCat).sort()) console.log(`  ${byCat[c].toString().padStart(3)}  ${c}`);
}
