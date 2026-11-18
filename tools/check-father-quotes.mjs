#!/usr/bin/env node
/**
 * check-father-quotes.mjs — rule 7(a) of the Church Fathers library (docs/FREE_LIBRARY_CANDIDATES.md).
 *
 * For every work hosted in full under /fathers, find every place the site quotes or cites it and
 * compare the quotation with the hosted text:
 *   - every /sources passage for the work must appear word for word in the hosted text, at the
 *     section it claims (this is the strict part: these quotes reach the live AI);
 *   - every quotation found near a citation of the work on a served page (essays, cards, mastery
 *     pages, answers, briefs) is looked up in the hosted text and reported as
 *       MATCH (with the section it really comes from — flagged if that differs from the cited one),
 *       or NOT FOUND (a different translation, a misquote, or a quote of someone else — check it).
 *
 * Matching ignores case, punctuation and whitespace, and treats "…"/"..." as a break, so a quote
 * with an omission still matches piece by piece. A quote from a modern translation will show as
 * NOT FOUND: that is a prompt to check, not automatically an error.
 *
 * Usage: node tools/check-father-quotes.mjs            # report (exit 0)
 *        node tools/check-father-quotes.mjs --strict   # exit 1 if a /sources passage does not match
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'fathers', '_data');
const STRICT = process.argv.includes('--strict');
const norm = (s) => String(s).toLowerCase().replace(/[‘’'`]/g, '').replace(/[^a-z]+/g, ' ').trim();
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', mdash: '—', ndash: '–', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', hellip: '…' };
const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&([a-z]+);/gi, (m, e) => ENT[e] ?? m);
const visible = (html) => decode(html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

function servedFiles() {
  const out = [];
  const add = (dir, re) => { const d = path.join(ROOT, dir); if (!existsSync(d)) return;
    for (const f of readdirSync(d)) if (re.test(f)) out.push(path.posix.join(dir, f)); };
  add('library', /^(?!index\.html$)[^.]+\.html$/);
  add('.', /^ev-s\d+\.html$/);
  add('.', /^ev-m-.+\.html$/);
  add('answers', /^[^_].+\.html$/);
  for (const f of ['worldviews.html', 'pocket-cards.html', 'daily-args.json', 'briefs/_data.json']) if (existsSync(path.join(ROOT, f))) out.push(f);
  return out;
}

let fail = 0;
for (const f of readdirSync(DATA).filter((x) => x.endsWith('.json') && !x.endsWith('.text.json'))) {
  const meta = JSON.parse(readFileSync(path.join(DATA, f), 'utf8'));
  const text = JSON.parse(readFileSync(path.join(DATA, f.replace(/\.json$/, '.text.json')), 'utf8'));
  const qc = meta.quoteCheck; if (!qc) { console.log(`- ${meta.slug}: no quoteCheck config, skipped`); continue; }
  const secs = [];
  for (const p of text.parts) for (const s of p.sections)
    secs.push({ at: `${p.n}.${s.n}`, n: norm(s.paras.map((pp) => pp.filter((x) => typeof x === 'string').join(' ')).join(' ')) });
  const all = secs.map((s) => s.n).join(' ');
  const whereIs = (q) => {
    const pieces = q.split(/…|\.\.\./).map(norm).filter((x) => x.split(' ').length >= 3);
    if (!pieces.length) return null;
    for (const p of pieces) if (!all.includes(p)) return null;
    const hit = secs.find((s) => s.n.includes(pieces[0]));
    return hit ? hit.at : '(spans sections)';
  };
  console.log(`\n=== ${meta.author}, ${meta.work} ===`);

  // 1. /sources passages (strict)
  const workRe = new RegExp(qc.sourcesWorkRe, 'i');
  for (const sf of readdirSync(path.join(ROOT, 'sources')).filter((x) => x.endsWith('.json'))) {
    for (const e of JSON.parse(readFileSync(path.join(ROOT, 'sources', sf), 'utf8'))) {
      if (e.author !== meta.author || !workRe.test(e.work)) continue;
      const at = whereIs(e.text); const claimed = String(e.section).replace(/^\D+/, '');
      if (!at) { fail++; console.log(`  ✗ /sources ${e.id}: NOT FOUND in the hosted text`); }
      else if (at !== claimed) { fail++; console.log(`  ✗ /sources ${e.id}: found at ${at}, but its section says ${claimed}`); }
      else console.log(`  ✓ /sources ${e.id} (${at})`);
    }
  }

  // 2. quotations near citations on served pages (report)
  const citeRe = new RegExp(qc.citeRe, 'gi');
  for (const file of servedFiles()) {
    const raw = readFileSync(path.join(ROOT, file), 'utf8');
    const txt = file.endsWith('.json') ? raw.replace(/\\"/g, '"') : visible(raw);
    const seen = new Set();
    for (const m of txt.matchAll(citeRe)) {
      const w = txt.slice(Math.max(0, m.index - 700), m.index + 300);
      if (!new RegExp(qc.authorRe, 'i').test(w)) continue;
      const cited = (m[0].match(/(\d{1,2})[.\s]*(\d{1,2})?/) || []).slice(1).filter(Boolean).join('.');
      for (const q of w.matchAll(/[“"]([^”"]{20,400})[”"]/g)) {
        const quote = q[1].trim(); if (quote.split(/\s+/).length < 5 || seen.has(quote)) continue;
        seen.add(quote);
        const at = whereIs(quote);
        const flag = at && cited.includes('.') && at !== cited ? `  ⚠ cited as ${cited}` : '';
        console.log(`  ${at ? '✓ MATCH ' + at : '? NOT FOUND'}  ${file}  “${quote.slice(0, 90)}${quote.length > 90 ? '…' : ''}”${flag}`);
      }
    }
  }
}
if (STRICT && fail) { console.error(`\n✗ ${fail} /sources passage(s) do not match the hosted text.`); process.exit(1); }
console.log(fail ? `\n${fail} /sources mismatch(es).` : '\n/sources passages all match the hosted text.');
