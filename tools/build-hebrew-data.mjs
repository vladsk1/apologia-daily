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
 * KEYED BY ENGLISH (NRSV) NUMBERING so the output lines up with library/bible/BSB
 * (the English index the popup looks up). TAHOT's reference column is
 * "Eng (+Heb)#Heb.word" — e.g. "Psa.3.1(3.2)#01" means English 3:1 = Hebrew 3:2.
 * We key by the ENGLISH part and drop the (Heb) bracket. An earlier version keyed
 * by the whole field and a regex that rejected any bracketed ref, silently dropping
 * ~8.5% of OT verses (every psalm title offset, Joel 2:28-3:21, Malachi 4, etc.).
 * English "verse 0" (a psalm title, which has no English verse number) is omitted —
 * never shifted onto a real verse.
 *
 * The morphCode (OpenScriptures Hebrew morphology) is decoded to readable grammar
 * at RUNTIME by library/verse-popup.js. A pronominal suffix (Sp...) is a separate
 * morpheme and is preserved as "<stem>+<suffix>" (e.g. "HR+Sp1cs" for li, preposition
 * + 1st-person-singular suffix) so the grammar line can name the "me/his/them".
 * Attribution required (CC BY): "STEPBible / Tyndale House". Hebrew renders RTL.
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

// A data line: "<Book>.<ch>.<v>[(<hebRef>)]#<word>=<group>\t..." — the optional
// (hebRef) bracket appears only where English and Hebrew numbering differ.
const DATA_RE = /^[0-9A-Za-z]+\.\d+\.\d+(?:\([^)]*\))?#\d+=/;
function firstSeg(s) { return (s || '').split('\\')[0]; }     // drop trailing \punctuation

function parseWord(line) {
  const f = line.split('\t');
  const c0 = f[0];
  const grp = (c0.split('=')[1] || '');
  // Base text = Leningrad (L). Also accept Restored (R): TAHOT's own text-type for the two
  // verses missing from the Leningrad codex (Jos.21.36-37 from 1Ch.6.63-64; Neh.7.67b from
  // Ezr.2.66), restored from parallels. R exists ONLY at those loci and never coexists with L,
  // so this adds those verses without mixing readings elsewhere. Qere (Q) / Ketiv (K) variants
  // and bracketed manuscript sigla (A/B/C/D...) are still excluded.
  if (!/[LR]/.test(grp)) return null;
  const hashIdx = c0.indexOf('#');
  const refField = c0.slice(0, hashIdx);                      // "Psa.3.1(3.2)" or "Job.1.1"
  const bracket = refField.match(/\(([^)]*)\)\s*$/);          // Hebrew ref, when it differs
  const engRef = refField.replace(/\([^)]*\)\s*$/, '');       // "Psa.3.1" — English/NRSV numbering (== BSB)
  const parts = engRef.split('.');
  const usfm = parts[0].toUpperCase();
  const ch = +parts[1], v = +parts[2];
  if (!Number.isFinite(ch) || !Number.isFinite(v)) return null;
  if (v === 0) return null;                                   // English "v0" = psalm title, no English verse — omit
  const hebRef = bracket ? bracket[1] : (ch + '.' + v);       // used only to de-dupe words within an English verse
  const pos = parseInt(c0.slice(hashIdx + 1), 10);
  const word = firstSeg(f[1]).replace(/\//g, '').trim();      // join morphemes into the whole word
  const translit = firstSeg(f[2]).replace(/\//g, '').trim();
  const gloss = firstSeg(f[3]).replace(/\//g, ' ').replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();
  // A "word" can be prefix(es) + stem + suffix. For the lemma/grammar DETAIL, pick the
  // CONTENT morpheme (noun/verb/adjective) rather than a prepositional prefix or suffix.
  const morphs = firstSeg(f[5]).split('/');
  const lemmas = firstSeg(f[11]).split('/');
  let ci = 0;
  for (let i = 0; i < morphs.length; i++) { const p0 = (morphs[i] || '').replace(/^[HA]/, '')[0]; if (p0 === 'N' || p0 === 'V' || p0 === 'A') { ci = i; break; } }
  let morph = (morphs[ci] || '').trim();
  // Keep a pronominal suffix (Sp...) — a separate morpheme carrying the load-bearing
  // "me/his/them" (e.g. Isa 45:23 li). Appended as "<stem>+<suffix>" for the runtime decoder.
  for (let i = 0; i < morphs.length; i++) {
    if (i === ci) continue;
    const s = (morphs[i] || '').replace(/^[HA]/, '');
    if (s[0] === 'S' && s[1] === 'p') { morph += '+' + s; break; }
  }
  let lemma = '', dict = '';
  const seg = (lemmas[ci] || '').replace(/[{}]/g, '');        // {Hxxxx=lemma=gloss»...}
  const p = seg.split('=');
  if (p.length >= 3) { lemma = (p[1] || '').trim(); dict = p.slice(2).join('=').split('»')[0].replace(/^[:\s]+/, '').split('@')[0].trim(); }
  if (!word) return null;
  return { usfm, ch, v, hebRef, pos, word: [word, translit, gloss, lemma, dict || gloss, morph] };
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
      // Accumulate in file order (correct English reading order), de-duping by the
      // Hebrew ref + word position so a merged/variant word can't collide with another.
      const verse = (b[key] = b[key] || { seen: new Set(), words: [] });
      const dk = w.hebRef + '#' + w.pos;
      if (!verse.seen.has(dk)) { verse.seen.add(dk); verse.words.push(w.word); }
    }
  }
  if (test) {
    const d = (books.DEU && books.DEU['6.4'] && books.DEU['6.4'].words) || [];
    console.log('Deut 6:4 words:', d.length);
    d.forEach((w) => console.log('  ', JSON.stringify(w)));
    return;
  }
  mkdirSync(OUTDIR, { recursive: true });
  let words = 0, files = 0, maxKB = 0;
  for (const usfm of Object.keys(books)) {
    mkdirSync(`${OUTDIR}/${usfm}`, { recursive: true });
    const byCh = {};
    for (const key of Object.keys(books[usfm])) {
      const [ch, v] = key.split('.');
      const arr = books[usfm][key].words;
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
