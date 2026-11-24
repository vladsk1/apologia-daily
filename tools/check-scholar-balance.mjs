#!/usr/bin/env node
/*
 * check-scholar-balance.mjs — the counter behind the READER-IN-THE-PEW RULE (CLAUDE.md,
 * owner-directed 2026-11-24).
 *
 * THE FAILURE IT MEASURES. On 2026-11-24 a pastor's-eye read of the Jesus tab found 26 cards
 * with zero doctrinal errors and six that could not be handed to a congregation. Every hedge
 * had passed argument, orthodoxy and neutrality, because each lens judges one claim at a
 * time. Counted across the tab: "contested" 83 times; Ehrman named 50 times, Dunn 41,
 * McGrath 32; 82% of the named defence resting on four scholars, and Blomberg, Keener,
 * Craig, Habermas and Licona named zero times; 8 cards naming more dissent than defence and
 * 7 naming a dissenter in a plain tier. Nothing mechanical could see it. This can.
 *
 * WHAT IT COUNTS, per card (ev-s*.html is split on id="arg-…") or per essay, and per tier:
 *   - named DEFENDERS vs named DISSENTERS (tools/scholar-balance.json);
 *   - a dissenter mentioned in a sentence where he CONCEDES a fact is a HOSTILE WITNESS —
 *     that counts for the case and is reported separately, never flagged;
 *   - dissent named in a PLAIN tier (free summary, "The Case, Plainly", the "How to explain
 *     this" / "In conversation" scripts) — the rule forbids it;
 *   - hedge words per 1,000 words;
 *   - REPEATED caveats: the same hedge- or dissent-bearing sentence appearing more than once.
 *
 * WHAT IT IS NOT. A coarse net, not a judge — the repo's cardinal rule is that a net that
 * cries wolf gets ignored. It cannot tell an answered dissent from one left standing, it
 * matches surnames (the registry keeps the patterns narrow), it only finds EXACT repeats, and
 * it reads English only (the MK/ES mirrors are skipped). So it is REPORT-ONLY: it exits 0
 * unless --strict is passed. The apologia-pastor lens is the judge; this gives it numbers.
 *
 * Usage:
 *   node tools/check-scholar-balance.mjs ev-s3.html library/titles.html   # these files
 *   node tools/check-scholar-balance.mjs --changed [base]                  # changed vs origin/main
 *   node tools/check-scholar-balance.mjs --audit [--top N]                 # whole English library
 *   ... --flagged   only print units with a flag      ... --names   list who was counted
 *   ... --strict    exit 1 if any unit is flagged     ... --warn    always exit 0 (CI)
 *   node tools/check-scholar-balance.mjs --check    # BLOCKING: named dissent may not outweigh
 *                                                   # named defence (baseline = recorded debt)
 *   node tools/check-scholar-balance.mjs --update   # rewrite the baseline after fixing units
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = join(ROOT, 'tools', 'scholar-balance.json');
const BASELINE = join(ROOT, 'tools', 'scholar-balance-baseline.json');

/* THE BLOCKING PART (owner ruling, 2026-11-24): "named defence is never outweighed by named
   dissent" is a rule, not a hope. The baseline records every unit that broke it on the day the
   rule was written, with its gap (dissent − defence). --check fails when a unit NOT in the
   baseline tips toward dissent, or when a baselined unit's gap GROWS. The debt can only shrink:
   fix a unit and run --update to drop it from the baseline. */
export function benchGap(a) { return a.dissent - a.defenders; }
export function benchViolations(rows, baseline) {
  const out = [];
  for (const r of rows) {
    const gap = benchGap(r);
    if (gap <= 0) continue;
    const allowed = baseline[r.id];
    if (allowed === undefined) out.push({ id: r.id, gap, kind: 'new', defenders: r.defenders, dissent: r.dissent });
    else if (gap > allowed) out.push({ id: r.id, gap, kind: 'worse', allowed, defenders: r.defenders, dissent: r.dissent });
  }
  return out;
}
function readBaseline() {
  if (!existsSync(BASELINE)) return {};
  return JSON.parse(readFileSync(BASELINE, 'utf8')).units || {};
}

export function loadRegistry(path = REGISTRY) {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const compile = (list) => (list || []).map((e) => ({ name: e.name, re: new RegExp(e.pattern, 'g') }));
  return {
    defenders: compile(raw.defenders),
    dissenters: compile(raw.dissenters),
    mixed: compile(raw.mixed),
    witness: new RegExp(raw.witnessCues, 'i'),
    hedges: new RegExp(raw.hedges, 'gi'),
    thresholds: raw.thresholds || { hedgesPer1000: 2.5 },
    unitRoles: raw.unitRoles || {},
  };
}

const ENT = { nbsp: ' ', amp: '&', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', ldquo: '“',
  rdquo: '”', quot: '"', hellip: '…', ouml: 'ö', uuml: 'ü', eacute: 'é', middot: '·' };

/* Served prose only: scripts, styles and comments go — which also removes the content-review
   stamp, so a hedge merely QUOTED in a stamp's history is never counted against the page. */
export function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(h[1-6]|summary|button)[^>]*>/gi, '\n\n')
    .replace(/<\/(p|div|li|h[1-6]|summary|tr|section|details|button)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n] ?? m)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

// ev-s* hub fragments hold many cards; everything else is one unit.
export function splitUnits(file, html) {
  const parts = html.split(/(?=<div[^>]*\bid="arg-)/);
  if (parts.length < 2) return [{ id: file, html }];
  return parts
    .map((p) => ({ id: `${file}#${(p.match(/\bid="(arg-[a-z0-9_-]+)"/) || [])[1] || 'preamble'}`, html: p }))
    .filter((u) => !u.id.endsWith('#preamble'));
}

const TIER_MARKS = [
  [/The Case, Plainly/, 'plain'],
  [/^\s*Deep\s?Dive/, 'deep'],   // not every card has the explain script, so the tier cannot hang on it
  [/How to explain this to someone/, 'script'],
  [/Research the evidence, line by line/, 'research'],
];
export const PLAIN_TIERS = new Set(['free', 'plain', 'script']);

/* Tier per line. A card starts in the free summary. The "How to explain this to someone"
   paragraph and any "In conversation:" line are the script a believer is coached to SAY, so
   they are held to the plain-tier standard; the rest of that section is the deep dive.
   A page with none of the markers (an essay) is one tier, 'essay'. */
export function tierLines(text) {
  const lines = text.split('\n');
  const hasTiers = TIER_MARKS.some(([re]) => re.test(text));
  if (!hasTiers) return lines.map((line) => ({ tier: 'essay', line }));
  let tier = 'free';
  let scriptLeft = 0;
  return lines.map((line) => {
    for (const [re, t] of TIER_MARKS) {
      if (re.test(line)) { tier = t === 'script' ? 'deep' : t; scriptLeft = t === 'script' ? 1 : 0; return { tier, line: '' }; }
    }
    if (tier === 'deep' && /^\s*In conversation\b/.test(line)) return { tier: 'script', line };
    if (tier === 'deep' && scriptLeft > 0 && line.trim()) { scriptLeft -= 1; return { tier: 'script', line }; }
    return { tier, line };
  });
}

// Split into sentences, but never after a lone initial ("Michael F. Bird", "J. D. G. Dunn",
// "N. T. Wright") — a split there hides the name from its own pattern.
const sentences = (line) => line.split(/(?<![\s(“"'‘][A-Z]\.)(?<=[.!?])\s+(?=[A-Z“"'‘(])/).filter((x) => x.trim());
const norm = (x) => x.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const count = (re, x) => { re.lastIndex = 0; return (x.match(re) || []).length; };

export function analyse(text, reg, unitId = '') {
  const alwaysWitness = new Set(reg.unitRoles?.[unitId]?.witness || []);
  const defendsHere = new Set(reg.unitRoles?.[unitId]?.defender || []);
  const dissentsHere = new Set(reg.unitRoles?.[unitId]?.dissenter || []);
  const out = { words: text.split(/\s+/).filter(Boolean).length, defenders: 0, dissent: 0, witness: 0,
    plainDissent: 0, hedges: 0, repeats: [], names: { defenders: {}, dissenters: {} }, plainExamples: [] };
  const seen = new Map();
  for (const { tier, line } of tierLines(text)) {
    for (const sent of sentences(line)) {
      let dissentHere = 0;
      for (const d of reg.defenders) {
        const n = count(d.re, sent);
        if (n) { out.defenders += n; out.names.defenders[d.name] = (out.names.defenders[d.name] || 0) + n; }
      }
      for (const d of reg.dissenters) {
        const n = count(d.re, sent);
        if (!n) continue;
        if (defendsHere.has(d.name)) { out.defenders += n; out.names.defenders[d.name] = (out.names.defenders[d.name] || 0) + n; continue; }
        out.names.dissenters[d.name] = (out.names.dissenters[d.name] || 0) + n;
        if (alwaysWitness.has(d.name) || reg.witness.test(sent)) { out.witness += n; continue; }
        out.dissent += n; dissentHere += n;
        if (PLAIN_TIERS.has(tier)) {
          out.plainDissent += n;
          if (out.plainExamples.length < 3) out.plainExamples.push(`[${tier}] ${d.name}: ${sent.trim().slice(0, 150)}`);
        }
      }
      // A scholar filed as "mixed" who is THE named objection on this page counts as dissent here
      // (unitRoles.dissenter) — an honest count must not hide a page's headline critic.
      for (const d of reg.mixed || []) {
        if (!dissentsHere.has(d.name)) continue;
        const n = count(d.re, sent);
        if (!n) continue;
        out.names.dissenters[d.name] = (out.names.dissenters[d.name] || 0) + n;
        out.dissent += n; dissentHere += n;
        if (PLAIN_TIERS.has(tier)) {
          out.plainDissent += n;
          if (out.plainExamples.length < 3) out.plainExamples.push(`[${tier}] ${d.name}: ${sent.trim().slice(0, 150)}`);
        }
      }
      const h = count(reg.hedges, sent);
      out.hedges += h;
      if ((h || dissentHere) && sent.trim().length >= 60) {
        const k = norm(sent);
        seen.set(k, { n: (seen.get(k)?.n || 0) + 1, sent: sent.trim() });
      }
    }
  }
  for (const v of seen.values()) if (v.n > 1) out.repeats.push(v);
  out.repeats.sort((a, b) => b.n - a.n);
  out.hedgesPer1000 = out.words ? +(out.hedges * 1000 / out.words).toFixed(1) : 0;
  out.flags = [];
  if (out.plainDissent) out.flags.push('PLAIN-TIER DISSENT');
  if (out.dissent > out.defenders) out.flags.push('BENCH');
  if (out.repeats.length) out.flags.push('REFRAIN');
  if (out.hedgesPer1000 > reg.thresholds.hedgesPer1000) out.flags.push('HEDGE-DENSITY');
  return out;
}

function englishContentFiles() {
  const top = readdirSync(ROOT).filter((f) => /^ev-s\d+\.html$/.test(f) || f === 'worldviews.html');
  const lib = readdirSync(join(ROOT, 'library')).filter((f) => f.endsWith('.html') && f !== 'index.html')
    .map((f) => `library/${f}`);
  return [...top.sort(), ...lib.sort()];
}

function changedFiles(base) {
  const wanted = new Set(englishContentFiles());
  try {
    const out = execSync(`git diff --name-only ${base}...HEAD`, { cwd: ROOT, encoding: 'utf8' })
      + execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' });
    return [...new Set(out.split('\n').map((x) => x.trim()).filter((f) => wanted.has(f)))];
  } catch { return []; }
}

function main() {
  const args = process.argv.slice(2);
  const flag = (f) => args.includes(f);
  const top = flag('--top') ? Number(args[args.indexOf('--top') + 1]) : 0;
  let files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--top' && args[i - 1] !== '--changed');
  if (flag('--audit') || flag('--check') || flag('--update')) files = englishContentFiles();
  else if (flag('--changed')) {
    const next = args[args.indexOf('--changed') + 1];
    files = changedFiles(next && !next.startsWith('--') ? next : 'origin/main');
  }
  if (!files.length) { console.log('scholar-balance: no files to check.'); return; }

  const reg = loadRegistry();
  let rows = [];
  for (const file of files) {
    const p = join(ROOT, file);
    if (!existsSync(p)) { console.log(`scholar-balance: ${file} not found — skipped.`); continue; }
    for (const u of splitUnits(file, readFileSync(p, 'utf8'))) rows.push({ id: u.id, ...analyse(htmlToText(u.html), reg, u.id) });
  }
  if (flag('--update')) {
    const units = {};
    for (const r of rows) if (benchGap(r) > 0) units[r.id] = benchGap(r);
    writeFileSync(BASELINE, JSON.stringify({
      _readme: 'Units (cards / essays) whose NAMED DISSENT outweighed NAMED DEFENCE when the READER-IN-THE-PEW RULE became binding (2026-11-24), with the gap (dissent - defence). This is recorded DEBT, not permission: check-scholar-balance --check fails if a unit not listed here tips toward dissent, or if a listed gap grows. Fix a unit (port certified defenders, cut unanswered or repeated dissent), then run --update so it drops out. Never add an entry by hand to get a red build green.',
      units,
    }, null, 2) + '\n');
    console.log(`scholar-balance: baseline written — ${Object.keys(units).length} unit(s) still name more dissent than defence.`);
    return;
  }
  if (flag('--check')) {
    const bad = benchViolations(rows, readBaseline());
    if (!bad.length) { console.log(`scholar-balance: OK — no card or essay newly names more dissent than defence (${Object.keys(readBaseline()).length} baselined, none worse).`); return; }
    console.error('scholar-balance: NAMED DISSENT OUTWEIGHS NAMED DEFENCE (CLAUDE.md → READER-IN-THE-PEW RULE, 3b)\n');
    for (const b of bad) console.error(`  ✗ ${b.id} — defence ${b.defenders}, dissent ${b.dissent}${b.kind === 'worse' ? ` (gap ${b.gap}, baseline allowed ${b.allowed})` : ' (not in the baseline)'}`);
    console.error('\nFix the page, not the count: port a certified sentence naming a scholar who DEFENDS the reading (verified by apologia-citations), cut a dissent that is repeated or left unanswered, or — if a "dissenter" is in fact arguing for our claim on this page — record that with its reason in tools/scholar-balance.json → unitRoles. Never add a name from memory to move the number.');
    process.exit(1);
  }
  const flagged = rows.filter((r) => r.flags.length);
  const totals = rows.reduce((t, r) => ({ defenders: t.defenders + r.defenders, dissent: t.dissent + r.dissent,
    witness: t.witness + r.witness, plainDissent: t.plainDissent + r.plainDissent, hedges: t.hedges + r.hedges,
    words: t.words + r.words }), { defenders: 0, dissent: 0, witness: 0, plainDissent: 0, hedges: 0, words: 0 });

  let show = flag('--flagged') || top ? flagged : rows;
  if (top) show = [...show].sort((a, b) => (b.plainDissent - a.plainDissent) || ((b.dissent - b.defenders) - (a.dissent - a.defenders))).slice(0, top);

  console.log('scholar-balance — named defenders vs named dissent, hedges, repeated caveats (report-only)\n');
  console.log('defend  dissent  witness  plain-tier  hedges/1k  repeats  unit');
  for (const r of show) {
    console.log(`${String(r.defenders).padStart(6)}  ${String(r.dissent).padStart(7)}  ${String(r.witness).padStart(7)}  ${String(r.plainDissent).padStart(10)}  ${String(r.hedgesPer1000).padStart(9)}  ${String(r.repeats.length).padStart(7)}  ${r.id}${r.flags.length ? '   ⚠ ' + r.flags.join(' · ') : ''}`);
    if (flag('--names')) {
      const fmt = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ${c}`).join(', ') || '—';
      console.log(`        defenders: ${fmt(r.names.defenders)}\n        dissenters (incl. as witness): ${fmt(r.names.dissenters)}`);
    }
    if (!top) {
      for (const e of r.plainExamples) console.log(`        plain-tier → ${e}`);
      for (const rp of r.repeats.slice(0, 3)) console.log(`        said ${rp.n}× → ${rp.sent.slice(0, 150)}`);
    }
  }
  console.log(`\n${rows.length} unit(s), ${flagged.length} flagged. Totals: defenders ${totals.defenders} · dissent ${totals.dissent} · hostile-witness ${totals.witness} · plain-tier dissent ${totals.plainDissent} · hedges ${totals.hedges} (${(totals.hedges * 1000 / Math.max(1, totals.words)).toFixed(1)}/1k words).`);
  console.log('Flags: PLAIN-TIER DISSENT = a dissenter named in the free summary, "The Case, Plainly" or an explain script · BENCH = more named dissent than named defence · REFRAIN = the same caveat sentence more than once · HEDGE-DENSITY = over the registry threshold.');
  console.log('A coarse net, not a judge: the apologia-pastor lens decides. Rule: CLAUDE.md → READER-IN-THE-PEW RULE.');
  if (flag('--strict') && !flag('--warn') && flagged.length) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
