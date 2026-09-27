#!/usr/bin/env node
/**
 * build-greek-data.mjs — build the Greek New Testament word-by-word data for the
 * inline "original language" mode of the verse popups (Phase 2a). Parses STEP's
 * TAGNT (Translators Amalgamated Greek NT, CC BY, by Tyndale House / STEPBible),
 * takes the SBL Greek NT text stream, and writes per-book files.
 *
 *   library/bible/GRC/<USFM>.json
 *     { "<chapter>.<verse>": [ [word, translit, gloss, lemma, dictMeaning, morphCode], ... ] }
 *
 * The morphCode (Robinson) is decoded to readable grammar at RUNTIME by
 * library/verse-popup.js, so these files stay compact. Attribution required
 * (CC BY): "STEPBible / Tyndale House".
 *
 * Usage:  node tools/build-greek-data.mjs [--test]
 *   Downloads the two TAGNT files to _tagnt_*.txt (gitignored) if not present.
 *   --test prints John 1:1 parsed and writes nothing.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const OUTDIR = 'library/bible/GRC';
const SRC = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Translators%20Amalgamated%20OT%2BNT/';
const FILES = [
  ['_tagnt_mat_jhn.txt', 'TAGNT%20Mat-Jhn%20-%20Translators%20Amalgamated%20Greek%20NT%20-%20STEPBible.org%20CC-BY.txt'],
  ['_tagnt_act_rev.txt', 'TAGNT%20Act-Rev%20-%20Translators%20Amalgamated%20Greek%20NT%20-%20STEPBible.org%20CC-BY.txt'],
];

async function ensure(local, remote) {
  if (existsSync(local)) return readFileSync(local, 'utf8');
  const res = await fetch(SRC + remote);
  if (!res.ok) throw new Error('fetch failed ' + res.status + ' ' + remote);
  const t = await res.text();
  writeFileSync(local, t);
  return t;
}

// A data line: "<Book>.<ch>.<v>#<word>=...". We take only refs with NO versification
// annotation. TAGNT's primary ref is NRSV versification; where a verse carries a
// [KJV]/(NA)/{other} bracket, NRSV and BSB (Berean) numbering can DIFFER (e.g. BSB
// follows KJV's 14-verse 2 Cor 13, so NRSV 13:13 = BSB 13:14). Keying such a line by
// its NRSV primary ref would put the Greek on the WRONG BSB verse. Rather than shift a
// verse, we leave those (few) versification-boundary verses out — the popup shows
// "not available", which is honest. The genuinely-absent verses (Mark 16:9-20, the
// pericope adulterae, etc.) are omitted by the SBL text itself and stay out too.
const DATA_RE = /^[0-9A-Za-z]+\.\d+\.\d+#\d+=/;
// Strip TAGNT editorial markup that can appear anywhere on a word — the pilcrow ¶
// paragraph mark, the ¬ segment mark, and the [[ ]] disputed-text brackets (e.g.
// Rom 10:13 "σωθήσεται.¶", Mat 11:17 "ὠρχήσασθε,¶¬", Mrk 16:8 "ἀμήν.¶]]") — then
// trim leading/trailing whitespace and punctuation.
function stripPunct(s) {
  return s.replace(/[¶¬[\]]/g, '')
          .replace(/^[\s,.;:·’'"“”·’\-]+|[\s,.;:·’'"“”·’\-]+$/g, '');
}

function parseWord(line) {
  const f = line.split('\t');
  const c0 = f[0];                                   // Jhn.1.1#01=NKO
  const editions = f[5] || '';
  if (!/(^|\+)SBL(\+|$)/.test(editions)) return null; // SBL text stream only
  const ref = c0.slice(0, c0.indexOf('#'));           // Jhn.1.1
  const parts = ref.split('.');
  const usfm = parts[0].toUpperCase();
  const ch = +parts[1], v = +parts[2];
  const pos = parseInt(c0.slice(c0.indexOf('#') + 1), 10); // "01=NKO" -> 1 (dedupe variants)
  // f[1] = "Ἐν (En)" -> greek + translit
  const g1 = f[1] || '';
  const pi = g1.lastIndexOf('(');
  const greek = stripPunct(pi > -1 ? g1.slice(0, pi) : g1);
  const translit = pi > -1 ? g1.slice(pi + 1).replace(/\)\s*$/, '').trim() : '';
  // context gloss "In [the]" -> "In the"; first drop a "[NN]" KJV verse-number marker
  // TAGNT prefixes at a KJV-verse boundary inside an NRSV verse (e.g. "[14] I have written").
  const gloss = stripPunct((f[2] || '').replace(/\[\d+\]/g, '').replace(/[[\]]/g, ''));
  // f[3] = "G1722=PREP" ; f[4] = "ἐν=in/on/among"
  const morph = ((f[3] || '').split('=')[1] || '').trim();
  const l4 = (f[4] || '').split('=');
  const lemma = stripPunct(l4[0] || '');
  const dict = (l4[1] || '').trim();
  if (!greek) return null;
  return { usfm, ch, v, pos, word: [greek, translit, gloss, lemma, dict, morph] };
}

async function main() {
  const test = process.argv.includes('--test');
  const books = {};   // usfm -> { "ch.v": { pos: wordArr } }
  for (const [local, remote] of FILES) {
    const text = await ensure(local, remote);
    for (const line of text.split(/\r?\n/)) {
      if (!DATA_RE.test(line)) continue;
      const w = parseWord(line);
      if (!w) continue;
      const b = (books[w.usfm] = books[w.usfm] || {});
      const key = w.ch + '.' + w.v;
      const verse = (b[key] = b[key] || {});
      if (!(w.pos in verse)) verse[w.pos] = w.word;   // first SBL word at this position
    }
  }
  if (test) {
    const j = books.JHN['1.1'];
    console.log('John 1:1 words:', Object.keys(j).length);
    Object.keys(j).map(Number).sort((a, b) => a - b).forEach((p) => console.log('  ', JSON.stringify(j[p])));
    return;
  }
  mkdirSync(OUTDIR, { recursive: true });
  let totalWords = 0, files = 0, maxKB = 0;
  for (const usfm of Object.keys(books)) {
    mkdirSync(`${OUTDIR}/${usfm}`, { recursive: true });
    const byCh = {};                                  // ch -> { verse: [words] }
    for (const key of Object.keys(books[usfm])) {
      const [ch, v] = key.split('.');
      const verse = books[usfm][key];
      const words = Object.keys(verse).map(Number).sort((a, b) => a - b).map((p) => verse[p]);
      totalWords += words.length;
      (byCh[ch] = byCh[ch] || {})[v] = words;
    }
    for (const ch of Object.keys(byCh)) {
      const json = JSON.stringify(byCh[ch]);
      writeFileSync(`${OUTDIR}/${usfm}/${ch}.json`, json);
      files++; maxKB = Math.max(maxKB, Math.round(json.length / 1024));
    }
  }
  console.log(`Wrote ${files} Greek chapter files across 27 books (${totalWords} words) to ${OUTDIR}/`);
  console.log('Largest chapter file: ' + maxKB + 'KB');
}
main();
