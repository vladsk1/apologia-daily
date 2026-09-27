#!/usr/bin/env node
/**
 * build-bible-data.mjs — build the on-site Bible data for the tap-to-read verse
 * popups (site-wide). Splits the complete Berean Standard Bible (public domain /
 * CC0) into per-book JSON files, loaded on demand by library/verse-popup.js, plus
 * a small index of verse counts so references can be validated (and linked) without
 * loading any text.
 *
 * Source: Free Use Bible API (bible.helloao.org), BSB complete.simple.json.
 * Output:
 *   library/bible/BSB/<USFM>.json   { "<chapter>.<verse>": "text", ... }
 *   library/bible/BSB/index.json    { "<USFM>": [versesInCh1, versesInCh2, ...], ... }
 *
 * Usage:  node tools/build-bible-data.mjs
 *   Uses ./_bsb_complete.json if present (a cached download); otherwise fetches it.
 *   The cache file is temporary and should not be committed.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const CACHE = '_bsb_complete.json';
const OUTDIR = 'library/bible/BSB';
const SRC = 'https://bible.helloao.org/api/BSB/complete.simple.json';

async function load() {
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, 'utf8'));
  const res = await fetch(SRC);
  if (!res.ok) throw new Error('fetch failed ' + res.status);
  const txt = await res.text();
  writeFileSync(CACHE, txt);
  return JSON.parse(txt);
}

async function main() {
  const data = await load();
  mkdirSync(OUTDIR, { recursive: true });
  const index = {};
  let books = 0, verses = 0;
  for (const book of data.books) {
    const usfm = book.id;
    const out = {};
    const counts = [];
    for (const chWrap of book.chapters) {
      const ch = chWrap.chapter || chWrap;
      const num = ch.number;
      let maxV = 0;
      for (const item of ch.content || []) {
        if (!item || item.type !== 'verse') continue;
        const t = (item.text || '').replace(/\s+/g, ' ').trim();
        if (!t) continue;
        out[num + '.' + item.number] = t;
        if (item.number > maxV) maxV = item.number;
        verses++;
      }
      counts[num - 1] = maxV;
    }
    writeFileSync(`${OUTDIR}/${usfm}.json`, JSON.stringify(out));
    index[usfm] = counts;
    books++;
  }
  writeFileSync(`${OUTDIR}/index.json`, JSON.stringify(index));
  console.log(`Wrote ${books} book files + index.json (${verses} verses) to ${OUTDIR}/`);
}
main();
