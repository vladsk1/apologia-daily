#!/usr/bin/env node
/*
 * check-scripture-refs.mjs — mechanical Scripture-REFERENCE resolver (check B3).
 *
 * WHAT IT CATCHES: a chapter:verse citation whose chapter is past the book's real
 * length, or to a book that cannot be resolved — e.g. "Daniel 15:2" (Daniel has
 * 12 chapters), "Hebrews 14:1" (13), "2 Peter 4:1" (3). Fabricated/typo'd
 * references are a fast credibility loss and nothing mechanical caught them before.
 *
 * FALSE-POSITIVE SAFETY IS THE WHOLE DESIGN (a net that cries wolf gets ignored —
 * the repo's cardinal rule). So, learned from a first pass over the live corpus:
 *  - It requires a chapter:VERSE colon ("Daniel 15:2"), never a bare "Daniel 70".
 *    Bare "<Book> <number>" collides with dates ("Jeremiah 605" BC), people
 *    ("William James 190"), and topics ("Daniel 70 weeks"); the colon form is a
 *    real verse citation, where an out-of-range chapter is almost always a typo.
 *  - It skips the Apostolic Fathers' letters that share NT book names (Ignatius
 *    "to the Ephesians 9:1", Polycarp "to the Philippians") via a "to the " guard.
 *  - Its book table includes the deuterocanon AND the extra-canonical books the
 *    site actually cites by chapter:verse (2 Baruch, 4 Ezra, 1 Enoch), so those
 *    resolve instead of mis-matching a short canonical name.
 *  - A baseline (tools/scripture-refs-baseline.json) absorbs legitimate residue,
 *    so CI fails only on a NEW bad ref. Accept one with --update.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: check the QUOTED WORDS (the site quotes
 * copyrighted ESV/NIV — a bundled public-domain translation would mismatch every
 * quote), or VERSE numbers (versification differs across traditions — Psalm
 * numbering, Malachi 3/4, 3 John 14/15 — a verse net would false-positive). The
 * data here is FACT (chapter counts), not translation text.
 *
 * Usage:
 *   node tools/check-scripture-refs.mjs           # fail on a new out-of-range ref
 *   node tools/check-scripture-refs.mjs --list    # print every out-of-range ref
 *   node tools/check-scripture-refs.mjs --update   # write current hits to the baseline
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = join(ROOT, 'tools', 'scripture-refs-baseline.json');

// book (canonical display name) -> number of chapters. Fact, not translation text.
export const CHAPTERS = {
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
  'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
  '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
  'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  'Jude': 1, 'Revelation': 22,
  // Deuterocanon
  'Tobit': 14, 'Judith': 16, 'Wisdom of Solomon': 19, 'Wisdom': 19,
  'Sirach': 51, 'Ecclesiasticus': 51, 'Baruch': 6, '1 Maccabees': 16,
  '2 Maccabees': 15,
  // Extra-canonical works the site cites by chapter:verse (longer names first-win)
  '2 Baruch': 87, '4 Ezra': 16, '2 Esdras': 16, '1 Esdras': 9, '1 Enoch': 108,
};

const ALIASES = {
  'Psalm': 'Psalms', 'Song of Songs': 'Song of Solomon', 'Canticles': 'Song of Solomon',
  'Qoheleth': 'Ecclesiastes', 'Revelations': 'Revelation',
};

const nameToKey = (raw) => {
  const n = raw.replace(/\s+/g, ' ').trim();
  if (CHAPTERS[n] != null) return n;
  if (ALIASES[n] && CHAPTERS[ALIASES[n]] != null) return ALIASES[n];
  return null;
};

const ALL_NAMES = [...Object.keys(CHAPTERS), ...Object.keys(ALIASES)]
  .sort((a, b) => b.length - a.length)
  .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
// "<Book> <chapter>:<verse>" only (colon required). "to the " before the name
// (Ignatius/Polycarp letters) is excluded by a lookbehind.
const REF_RE = new RegExp(
  `(?<!to the )\\b(${ALL_NAMES.join('|')})\\s+(\\d{1,3}):\\d`, 'g');

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', 'docs', 'tools', 'tests', 'sources', 'briefs',
  'ios', 'android', 'app', '_pdfs', '_parked', '.github', 'scripts',
]);

function servedHtml(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const top = relative(ROOT, full).split('/')[0];
    if (EXCLUDE_DIRS.has(top)) continue;
    const st = statSync(full);
    if (st.isDirectory()) servedHtml(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const stripTags = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&#160;/g, ' ');

// Returns [{file, ref, book, chapter, why}] for refs whose chapter is out of range.
export function findBadRefs(files, readFile) {
  const bad = [];
  for (const f of files) {
    const rel = typeof f === 'string' && f.includes('/') ? relative(ROOT, f) : f;
    const text = stripTags(readFile(f));
    let m;
    REF_RE.lastIndex = 0;
    while ((m = REF_RE.exec(text)) !== null) {
      const key = nameToKey(m[1]);
      if (!key) continue;
      const chap = parseInt(m[2], 10);
      const max = CHAPTERS[key];
      if (chap < 1 || chap > max) {
        bad.push({ file: rel.replace(/\\/g, '/'), ref: m[0].replace(/\s+/g, ' ').trim(),
                   book: key, chapter: chap, why: `${key} has ${max} chapter(s)` });
      }
    }
  }
  return bad;
}

function loadBaseline() {
  try { return new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).accepted || []); }
  catch { return new Set(); }
}
const sig = (b) => `${b.file} :: ${b.ref}`;

function main() {
  const args = process.argv.slice(2);
  const files = servedHtml(ROOT);
  const bad = findBadRefs(files, (f) => readFileSync(f, 'utf8'));

  if (args.includes('--list')) {
    if (!bad.length) { console.log('No out-of-range Scripture references found.'); return; }
    for (const b of bad) console.log(`  ${b.file}: "${b.ref}" — ${b.why}`);
    console.log(`\n${bad.length} out-of-range reference(s) across ${files.length} pages.`);
    return;
  }
  if (args.includes('--update')) {
    writeFileSync(BASELINE, JSON.stringify({ accepted: bad.map(sig).sort() }, null, 2) + '\n');
    console.log(`Baseline updated: ${bad.length} accepted reference(s).`);
    return;
  }

  const baseline = loadBaseline();
  const fresh = bad.filter((b) => !baseline.has(sig(b)));
  if (!fresh.length) {
    console.log(`✓ Scripture references: ${files.length} pages scanned, no new out-of-range citation.`);
    return;
  }
  console.error(`✗ ${fresh.length} Scripture reference(s) point past a book's real length:\n`);
  for (const b of fresh) console.error(`  ${b.file}: "${b.ref}" — ${b.why}`);
  console.error('\nFix the reference. If it is genuinely valid (an Orthodox/LXX or extra-canonical');
  console.error('chapter, or a Father\'s letter this net misread), accept it on-record with:');
  console.error('  node tools/check-scripture-refs.mjs --update');
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
