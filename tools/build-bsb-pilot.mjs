#!/usr/bin/env node
/**
 * build-bsb-pilot.mjs — fetch the Berean Standard Bible (public domain, CC0)
 * verse text for the references in a given essay and write it to a local JSON
 * file the tap-to-read popup reads. This bakes the verses INTO the repo, so the
 * live popup has no runtime dependency on any external Bible API.
 *
 * Source: Free Use Bible API (bible.helloao.org), BSB = Berean Standard Bible,
 * released to the public domain (CC0) by the BSB translation team / Bible Hub.
 *
 * Usage:  node tools/build-bsb-pilot.mjs library/hands.html
 *         (writes/updates library/bsb-verses.json with every verse in every
 *          chapter the essay references — so ranges and all refs are covered.)
 *
 * Keyed by USFM: "JHN.1.1" -> "In the beginning was the Word...". The runtime
 * script (library/verse-popup.js) uses the SAME book map to turn a reference in
 * the prose into this key and look up the text.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API = 'https://bible.helloao.org/api/BSB';

// USFM code -> the name/abbreviation tokens that may appear in prose.
// Tokens are matched after normalisation (lowercase, no spaces, no periods).
const BOOKS = {
  GEN: ['genesis', 'gen'], EXO: ['exodus', 'exod', 'exo', 'ex'], LEV: ['leviticus', 'lev'],
  NUM: ['numbers', 'num'], DEU: ['deuteronomy', 'deut', 'deu'], JOS: ['joshua', 'josh', 'jos'],
  JDG: ['judges', 'judg', 'jdg'], RUT: ['ruth', 'rut'], '1SA': ['1samuel', '1sam', '1sa'],
  '2SA': ['2samuel', '2sam', '2sa'], '1KI': ['1kings', '1kgs', '1ki'], '2KI': ['2kings', '2kgs', '2ki'],
  '1CH': ['1chronicles', '1chron', '1chr', '1ch'], '2CH': ['2chronicles', '2chron', '2chr', '2ch'],
  EZR: ['ezra', 'ezr'], NEH: ['nehemiah', 'neh'], EST: ['esther', 'esth', 'est'], JOB: ['job'],
  PSA: ['psalms', 'psalm', 'pss', 'ps'], PRO: ['proverbs', 'prov', 'pro'], ECC: ['ecclesiastes', 'eccl', 'ecc'],
  SNG: ['songofsongs', 'songofsolomon', 'song', 'sng'], ISA: ['isaiah', 'isa'], JER: ['jeremiah', 'jer'],
  LAM: ['lamentations', 'lam'], EZK: ['ezekiel', 'ezek', 'ezk'], DAN: ['daniel', 'dan'],
  HOS: ['hosea', 'hos'], JOL: ['joel', 'jol'], AMO: ['amos', 'amo'], OBA: ['obadiah', 'obad', 'oba'],
  JON: ['jonah', 'jon'], MIC: ['micah', 'mic'], NAM: ['nahum', 'nah', 'nam'], HAB: ['habakkuk', 'hab'],
  ZEP: ['zephaniah', 'zeph', 'zep'], HAG: ['haggai', 'hag'], ZEC: ['zechariah', 'zech', 'zec'],
  MAL: ['malachi', 'mal'], MAT: ['matthew', 'matt', 'mat', 'mt'], MRK: ['mark', 'mrk', 'mk'],
  LUK: ['luke', 'luk', 'lk'], JHN: ['john', 'jhn', 'jn'], ACT: ['acts', 'act'], ROM: ['romans', 'rom'],
  '1CO': ['1corinthians', '1cor', '1co'], '2CO': ['2corinthians', '2cor', '2co'],
  GAL: ['galatians', 'gal'], EPH: ['ephesians', 'eph'], PHP: ['philippians', 'phil', 'php'],
  COL: ['colossians', 'col'], '1TH': ['1thessalonians', '1thess', '1th'], '2TH': ['2thessalonians', '2thess', '2th'],
  '1TI': ['1timothy', '1tim', '1ti'], '2TI': ['2timothy', '2tim', '2ti'], TIT: ['titus', 'tit'],
  PHM: ['philemon', 'phlm', 'phm'], HEB: ['hebrews', 'heb'], JAS: ['james', 'jas'],
  '1PE': ['1peter', '1pet', '1pe'], '2PE': ['2peter', '2pet', '2pe'], '1JN': ['1john', '1jn'],
  '2JN': ['2john', '2jn'], '3JN': ['3john', '3jn'], JUD: ['jude', 'jud'], REV: ['revelation', 'rev'],
};
const TOKEN2USFM = {};
for (const [usfm, toks] of Object.entries(BOOKS)) for (const t of toks) TOKEN2USFM[t] = usfm;

// Build a reference regex: optional leading number, book word, chapter, sep, verse, optional range.
const BOOK_ALT = [...new Set(Object.keys(TOKEN2USFM))]
  .sort((a, b) => b.length - a.length) // longest first so "isaiah" wins over "isa"
  .map((t) => t.replace(/([.*+?^${}()|[\]\\])/g, '\\$1'))
  .join('|');
// prose token like "1 Corinthians", "1 Cor.", "Isa.", "John"
const REF_RE = /(\b(?:[1-3]\s*)?[A-Za-z]{2,}\.?)\s*(\d+)[:.](\d+)(?:[-–](\d+))?/g;

function norm(bookTok) { return bookTok.toLowerCase().replace(/[\s.]/g, ''); }

async function main() {
  const file = process.argv[2] || 'library/hands.html';
  let html = readFileSync(file, 'utf8')
    .replace(/&ndash;|&#8211;/g, '–').replace(/&mdash;|&#8212;/g, '—');
  // strip tags so a reference is never split by inline markup
  const text = html.replace(/<[^>]+>/g, ' ');

  const chapters = new Set(); // "JHN/1"
  let m;
  REF_RE.lastIndex = 0;
  while ((m = REF_RE.exec(text))) {
    const usfm = TOKEN2USFM[norm(m[1])];
    if (!usfm) continue;
    chapters.add(usfm + '/' + m[2]);
  }
  console.log('Referenced chapters:', chapters.size);

  const out = existsSync('library/bsb-verses.json')
    ? JSON.parse(readFileSync('library/bsb-verses.json', 'utf8')) : {};
  let added = 0;
  for (const ck of chapters) {
    const [usfm, ch] = ck.split('/');
    const res = await fetch(`${API}/${usfm}/${ch}.json`);
    if (!res.ok) { console.error('  ! failed', ck, res.status); continue; }
    const j = await res.json();
    const chap = j.chapter || (j.chapters && j.chapters[0]) || j;
    const content = chap.content || chap;
    for (const item of content) {
      if (!item || item.type !== 'verse') continue;
      const txt = (item.content || [])
        .map((c) => (typeof c === 'string' ? c : (c && c.text) ? c.text : ''))
        .join(' ').replace(/\s+/g, ' ').trim();
      if (!txt) continue;
      const key = `${usfm}.${ch}.${item.number}`;
      if (!(key in out)) added++;
      out[key] = txt;
    }
  }
  // stable sort keys for a clean diff
  const sorted = {};
  for (const k of Object.keys(out).sort()) sorted[k] = out[k];
  writeFileSync('library/bsb-verses.json', JSON.stringify(sorted, null, 0) + '\n');
  console.log(`Wrote library/bsb-verses.json: ${Object.keys(sorted).length} verses (${added} new).`);
}
main();
