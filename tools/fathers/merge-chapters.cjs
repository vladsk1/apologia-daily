// tools/fathers/merge-chapters.cjs — Augustine, On the Trinity (NPNF1-03, 2026-11-18). CCEL prints this volume chapter by chapter
// (an editors' chapter title, the text, then that chapter's footnotes), with section numbers running through each BOOK, and a
// chapter often begins in the middle of a section. Some books open with a preface, which is that book's section 1, unnumbered.
// extract-ccel.cjs is therefore run with one block per text segment (tools/fathers/augustine-config.json); this script
// joins the blocks into books: the chapter title (the editors' heading) is dropped; a preface becomes section 1; and any
// paragraphs that come before a chapter's first section number are appended to the section they continue.
// Usage: node merge-chapters.cjs <raw.json> <map.json> <out.json>
const fs = require('fs');
const [, , rawPath, mapPath, outPath] = process.argv;
const R = JSON.parse(fs.readFileSync(rawPath, 'utf8')); const M = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const books = new Map(); let carried = 0;
for (const o of R.orations) {
  const m = M.find((x) => x.k === o.n); if (!m) throw new Error('no map for block ' + o.n);
  const title = o.heads[0] || '';
  if (!/^(Chapter \d+\s*\.?\s*-+|Preface\b)/.test(title)) throw new Error(`block ${o.n}: first head is not a chapter or preface title: ${title.slice(0, 60)}`);
  const b = books.get(m.book) || { n: m.book, sections: [] }; books.set(m.book, b);
  const extra = o.heads.slice(1);
  if (/^Preface/.test(title)) {
    if (b.sections.length) throw new Error(`book ${m.book}: preface after sections`);
    if (o.sections.length && o.sections[0].n === 1) { if (extra.length) o.sections[0].paras.unshift(...extra); }
    else if (extra.length) b.sections.push({ n: 1, roman: '1', paras: extra });
  } else if (extra.length) {
    const last = b.sections[b.sections.length - 1]; if (!last) throw new Error(`book ${m.book}: text before the first section`);
    last.paras.push(...extra); carried += extra.length;
  }
  b.sections.push(...o.sections.map((s) => ({ n: s.n, roman: s.roman, paras: s.paras.slice() })));
}
const out = { source: R.source, orations: [...books.values()].sort((a, b) => a.n - b.n) };
const gaps = []; for (const b of out.orations) { let prev = 0; for (const s of b.sections) { if (s.n !== prev + 1) gaps.push(`${b.n}: ${prev} -> ${s.n}`); prev = s.n; } }
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
console.log(out.orations.map((b) => `${b.n}:${b.sections.length}`).join(' '), '| paragraphs carried into the previous section:', carried);
if (gaps.length) console.log('numbering gaps (resolve against the scans):', gaps.join(' | '));
