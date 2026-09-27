#!/usr/bin/env node
/**
 * build-hebrew-data.mjs — build the Hebrew Old Testament word-by-word data for the
 * inline "original language" mode of the verse popups (Phase 2b). Parses STEP's
 * TAHOT (Translators Amalgamated Hebrew OT, CC BY, Tyndale House / STEPBible),
 * takes the Leningrad (Masoretic) base text, and writes per-CHAPTER files.
 *
 *   library/bible/HBO/<USFM>/<chapter>.json
 *     { "<verse>": [ [word, translit, gloss, lemma, dictMeaning, morphCode], ... ] }
 *
 * The morphCode (OpenScriptures Hebrew morphology) is decoded to readable grammar
 * at RUNTIME by library/verse-popup.js. Attribution required (CC BY):
 * "STEPBible / Tyndale House". Hebrew renders right-to-left in the popup.
 *
 * Usage:  node tools/build-hebrew-data.mjs [--test]
 *   Downloads the four TAHOT files to _tahot_*.txt (gitignored) if not present.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const OUTDIR = 'library/bible/HBO';
const SRC = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Translators%20Amalgamated%20OT%2BNT/';
const FILES = [
  ['_tahot_gen_deu.txt', 'TAHOT%20Gen-Deu%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt'],
  ['_tahot_jos_est.txt', 'TAHOT%20Jos-Est%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt'],
  ['_tahot_job_sng.txt', 'TAHOT%20Job-Sng%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt'],
  ['_tahot_isa_mal.txt', 'TAHOT%20Isa-Mal%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt'],
];

async function ensure(local, remote) {
  if (existsSync(local)) return readFileSync(local, 'utf8');
  const res = await fetch(SRC + remote);
  if (!res.ok) throw new Error('fetch failed ' + res.status + ' ' + remote);
  const t = await res.text(); writeFileSync(local, t); return t;
}

const DATA_RE = /^[0-9A-Za-z]+\.\d+\.\d+#\d+=/;
function firstSeg(s) { return (s || '').split('\\')[0]; }     // drop trailing \punctuation

function parseWord(line) {
  const f = line.split('\t');
  const c0 = f[0];
  const grp = (c0.split('=')[1] || '');
  if (!/L/.test(grp)) return null;                            // Leningrad (Masoretic) base text
  const ref = c0.slice(0, c0.indexOf('#'));
  const parts = ref.split('.');
  const usfm = parts[0].toUpperCase();
  const ch = +parts[1], v = +parts[2];
  const pos = parseInt(c0.slice(c0.indexOf('#') + 1), 10);
  const word = firstSeg(f[1]).replace(/\//g, '').trim();      // join morphemes into the whole word
  const translit = firstSeg(f[2]).replace(/\//g, '').trim();
  const gloss = firstSeg(f[3]).replace(/\//g, ' ').replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();
  // A "word" can be prefix(es) + stem + suffix. For the lemma/grammar DETAIL, pick the
  // CONTENT morpheme (noun/verb/adjective) rather than a prepositional prefix or suffix.
  const morphs = firstSeg(f[5]).split('/');
  const lemmas = firstSeg(f[11]).split('/');
  let ci = 0;
  for (let i = 0; i < morphs.length; i++) { const p0 = (morphs[i] || '').replace(/^[HA]/, '')[0]; if (p0 === 'N' || p0 === 'V' || p0 === 'A') { ci = i; break; } }
  const morph = (morphs[ci] || '').trim();
  let lemma = '', dict = '';
  const seg = (lemmas[ci] || '').replace(/[{}]/g, '');        // {Hxxxx=lemma=gloss»...}
  const p = seg.split('=');
  if (p.length >= 3) { lemma = (p[1] || '').trim(); dict = p.slice(2).join('=').split('»')[0].replace(/^[:\s]+/, '').split('@')[0].trim(); }
  if (!word) return null;
  return { usfm, ch, v, pos, word: [word, translit, gloss, lemma, dict || gloss, morph] };
}

async function main() {
  const test = process.argv.includes('--test');
  const books = {};
  for (const [local, remote] of FILES) {
    if (test && local !== '_tahot_gen_deu.txt') continue;
    const text = await ensure(local, remote);
    for (const line of text.split(/\r?\n/)) {
      if (!DATA_RE.test(line)) continue;
      const w = parseWord(line);
      if (!w) continue;
      const b = (books[w.usfm] = books[w.usfm] || {});
      const key = w.ch + '.' + w.v;
      const verse = (b[key] = b[key] || {});
      if (!(w.pos in verse)) verse[w.pos] = w.word;
    }
  }
  if (test) {
    const d = books.DEU['6.4'];
    console.log('Deut 6:4 words:', Object.keys(d).length);
    Object.keys(d).map(Number).sort((a, b) => a - b).forEach((p) => console.log('  ', JSON.stringify(d[p])));
    return;
  }
  mkdirSync(OUTDIR, { recursive: true });
  let words = 0, files = 0, maxKB = 0;
  for (const usfm of Object.keys(books)) {
    mkdirSync(`${OUTDIR}/${usfm}`, { recursive: true });
    const byCh = {};
    for (const key of Object.keys(books[usfm])) {
      const [ch, v] = key.split('.');
      const verse = books[usfm][key];
      const arr = Object.keys(verse).map(Number).sort((a, b) => a - b).map((x) => verse[x]);
      words += arr.length; (byCh[ch] = byCh[ch] || {})[v] = arr;
    }
    for (const ch of Object.keys(byCh)) {
      const json = JSON.stringify(byCh[ch]);
      writeFileSync(`${OUTDIR}/${usfm}/${ch}.json`, json);
      files++; maxKB = Math.max(maxKB, Math.round(json.length / 1024));
    }
  }
  console.log(`Wrote ${files} Hebrew chapter files across ${Object.keys(books).length} books (${words} words) to ${OUTDIR}/`);
  console.log('Largest chapter file: ' + maxKB + 'KB');
}
main();
