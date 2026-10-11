#!/usr/bin/env node
/* tools/mastery-convert.mjs — rebuild a LEGACY mastery page (4-checkpoint dial) on the
 * Bronze/Silver/Gold standard, from a PORT FILE. Phase 2 of
 * docs/MASTERY_ROLLOUT_GUIDE_2026-10-11.md.
 *
 *   node tools/mastery-convert.mjs <slug>            # docs/mastery-ports/<slug>.json -> ev-m-<slug>.html
 *   node tools/mastery-convert.mjs <slug> --dry      # print what would change, write nothing
 *
 * WHAT IT DOES (deterministic; the only content it introduces is the port file's):
 *   - keeps everything the legacy page already carries at the new standard: the summary,
 *     the syllogism, the premise-defence cards, the objection accordions, "Touch the
 *     originals", ARG_PREMISES, the offline `checks`, Drill 3 (the seeded objection and
 *     its certified model answer), the next-argument CTA, the share card;
 *   - adds, from the port file: the key-terms card, the "what follows" reason-it-out rows,
 *     "The honest state of the debate", the Bronze checkpoint (ORDER + PROPS), 12 cards,
 *     the 4 cold objections (Drill 4), the unseen-objection Gold gate, the three Explain
 *     levels and the level-2 hardest-objection prompt;
 *   - replaces the legacy inline script with the Kalam template script (levelOf, Bronze
 *     grading, OBJ drill, unseen gate, explainHi, discPassed) with the page's own data
 *     substituted in; removes FRESH_MS and the "typed 9 characters" rule;
 *   - appends the template CSS the legacy page lacks (levels, glossary, derive, gradeline…).
 *
 * WHAT IT DOES NOT DO: gate anything. The converted page is UNGATED until the four lenses
 * run on it; the stamp gets a "CONVERSION — gate pending" note and the lens dates are NOT
 * bumped here. tests/mastery-contract.test.mjs then holds the page to the contract. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!slug) { console.error('usage: node tools/mastery-convert.mjs <slug> [--dry]'); process.exit(2); }

const pagePath = path.join(ROOT, `ev-m-${slug}.html`);
const portArg = process.argv.indexOf('--port');
const portPath = portArg > 0 ? path.resolve(process.argv[portArg + 1]) : path.join(ROOT, 'docs', 'mastery-ports', `${slug}.json`);
const kalamPath = path.join(ROOT, 'ev-m-kalam.html');
for (const p of [pagePath, portPath, kalamPath]) if (!existsSync(p)) { console.error('missing: ' + p); process.exit(2); }

/* Working copies on Windows may carry CRLF; normalise so the anchors match, write back LF. */
const CRLF = String.fromCharCode(13, 10);
let L = readFileSync(pagePath, 'utf8').split(CRLF).join('\n');
const K = readFileSync(kalamPath, 'utf8').split(CRLF).join('\n');
const P = JSON.parse(readFileSync(portPath, 'utf8'));

if (L.includes('function levelOf')) { console.error(`ev-m-${slug}.html already carries the Bronze/Silver/Gold standard`); process.exit(1); }

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const js = (s) => JSON.stringify(String(s)); // safe JS string literal
function must(cond, msg) { if (!cond) { console.error('ERROR: ' + msg); process.exit(1); } }
function replaceOnce(src, re, rep, what) {
  const m = src.match(re); must(m, `could not find ${what}`);
  must(!(re.global) || src.match(re).length === 1, `${what} matched more than once`);
  return src.replace(re, typeof rep === 'function' ? rep : () => rep);
}
function insertBefore(src, marker, block, what) {
  const i = typeof marker === 'string' ? src.indexOf(marker) : src.search(marker);
  must(i >= 0, `could not find insertion point: ${what}`);
  return src.slice(0, i) + block + src.slice(i);
}
function insertAfter(src, marker, block, what) {
  const i = src.indexOf(marker); must(i >= 0, `could not find insertion point: ${what}`);
  return src.slice(0, i + marker.length) + block + src.slice(i + marker.length);
}
function lastIndexBefore(src, needle, before) { const i = src.lastIndexOf(needle, before); must(i >= 0, `no ${needle} before ${before}`); return i; }

/* ---------- validate the port file ---------- */
must(P.slug === slug, 'port slug mismatch');
for (const k of ['title', 'short', 'keyTerms', 'derive', 'honestState', 'order', 'props', 'cards', 'obj', 'unseen', 'explain2']) must(P[k] != null, `port file missing ${k}`);
must(P.keyTerms.length >= 6 && P.keyTerms.length <= 8, 'keyTerms: need 6-8');
must(P.derive.length >= 3 && P.derive.length <= 6, 'derive: need 3-6 rows');
must(P.order.length === 3, 'order: need 3 lines');
must(P.props.filter(p => p.ok).length >= 3 && P.props.filter(p => !p.ok).length >= 3 && P.props.length >= 8, 'props: need >=3 true, >=3 decoys, >=8 total');
must(P.cards.length === 12, 'cards: need exactly 12');
must(P.obj.length === 4, 'obj: need exactly 4');
must(P.unseen.q && P.unseen.model && P.unseen.who, 'unseen: need who/q/model');

const NUMWORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/* ---------- 1. CSS the legacy page lacks ---------- */
function cssBlocks(css) {
  const out = []; let i = 0;
  while (i < css.length) {
    const j = css.indexOf('{', i); if (j < 0) break;
    const sel = css.slice(i, j).trim(); let depth = 0, k = j;
    for (; k < css.length; k++) { if (css[k] === '{') depth++; else if (css[k] === '}') { depth--; if (depth === 0) break; } }
    out.push({ sel, body: css.slice(j, k + 1) }); i = k + 1;
  }
  return out;
}
const WANT = /\.(glossary|gt|levels|lvl|medal|lt|ls|gradeline|recall|honest|derive|dr|formnote)\b/;
const kcss = K.match(/<style>([\s\S]*?)<\/style>/)[1];
const lcss = L.match(/<style>([\s\S]*?)<\/style>/)[1];
const have = new Set(cssBlocks(lcss).map(b => b.sel));
const add = cssBlocks(kcss).filter(b => (b.sel.startsWith('@media') ? WANT.test(b.body) : WANT.test(b.sel)) && !have.has(b.sel)).map(b => b.sel + b.body);
if (add.length) L = replaceOnce(L, /<\/style>/, '\n/* ---- Bronze/Silver/Gold template styles (added by tools/mastery-convert.mjs) ---- */\n' + add.join('\n') + '\n</style>', '</style>');

/* ---------- 2. dial copy + levels ladder ---------- */
L = replaceOnce(L, /<p>Four checkpoints[^<]*<\/p>/,
  '<p>Three earned levels — <b>Bronze</b> (rebuild it), <b>Silver</b> (defend it cold), <b>Gold</b> (handle an objection you&rsquo;ve never seen, then prove it again weeks later). Clicking through no longer counts; demonstrated recall does. Progress saves to your account.</p>',
  'the "Four checkpoints" dial copy');
const LEVELS = `
  <div class="levels" id="levels">
    <div class="lvl" id="lvl-bronze"><div class="medal">&#129353;</div><div class="lt"><b>Bronze · Understand</b><span>Rebuild the syllogism and what the argument establishes, from memory (&ge;80%)</span></div><div class="ls">Locked</div></div>
    <div class="lvl" id="lvl-silver"><div class="medal">&#129352;</div><div class="lt"><b>Silver · Defend</b><span>Explain it &ge;8/10 <em>and</em> field its objections cold</span></div><div class="ls">Locked</div></div>
    <div class="lvl" id="lvl-gold"><div class="medal">&#129351;</div><div class="lt"><b>Gold · Master</b><span>Answer an unseen objection, pick the right argument from a mixed set, then re-prove it on 3 spaced reviews</span></div><div class="ls">Locked</div></div>
  </div>
`;
L = insertBefore(L, '<!-- ===================== PHASE 1: UNDERSTAND', LEVELS + '\n  ', 'PHASE 1 marker');

/* ---------- 3. Understand: phasesub, key terms, derive, honest state, Bronze gate ---------- */
const uStart = L.indexOf('<section id="understand">'); must(uStart >= 0, '#understand');
L = L.slice(0, uStart) + L.slice(uStart).replace(/<p class="phasesub">[^<]*<\/p>/,
  '<p class="phasesub">Not more prose — the load-bearing structure, defended bone by bone, then proven from memory. Work top to bottom; the checkpoint at the end asks you to rebuild it with nothing in front of you.</p>');

const KEYTERMS = `
    <div class="card">
      <span class="kick">Before you start · key terms</span>
      <h4>${NUMWORDS[P.keyTerms.length]} words this argument leans on</h4>
      <p style="font-size:14.5px;color:var(--tm);font-family:var(--ui);margin-bottom:6px">Learn these first — the objections below turn on them, and most weak versions of the argument come from blurring one of them.</p>
      <div class="glossary">
${P.keyTerms.map(t => `        <div class="gt"><b>${esc(t.t)}</b><span>${esc(t.d)}</span></div>`).join('\n')}
      </div>
    </div>
`;
{
  const firstCard = L.indexOf('<div class="card">', uStart); must(firstCard > 0, 'first card in #understand');
  L = L.slice(0, firstCard) + KEYTERMS.trimStart() + '\n    ' + L.slice(firstCard);
}

const DERIVE = `
    <div class="card">
      <span class="kick">What follows — and what doesn&rsquo;t</span>
      <h4>Don&rsquo;t read the conclusion — reason to it</h4>
      <p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:4px">Working only from what the argument has established: what does each piece of evidence rule out, and how far does the inference reach? Reason each line out, then reveal.</p>
      <div class="derive">
${P.derive.map(r => `        <div class="dr"><div class="q">${esc(r.q)}</div><button class="rev" type="button" onclick="this.closest('.dr').classList.add('shown')">Reveal</button><span class="ans">${esc(r.ans)}</span><span class="why">${esc(r.why)}</span></div>`).join('\n')}
      </div>
    </div>

`;
{
  const dp1 = L.indexOf('Defending Premise 1'); must(dp1 > 0, 'Defending Premise 1 kick');
  const cardStart = lastIndexBefore(L, '<div class="card"', dp1);
  L = L.slice(0, cardStart) + DERIVE.trimStart() + '    ' + L.slice(cardStart);
}

const HONEST = `
    <div class="card">
      <span class="kick">The honest state of the debate</span>
      <h4>Where the argument really stands${P.honestState.fairness ? ' — and a fairness most defenders skip' : ''}</h4>
      <p>${esc(P.honestState.p1)}</p>
${P.honestState.fairness ? `      <p class="honest"><b>A fairness most defenders skip:</b> ${esc(P.honestState.fairness)}</p>\n` : ''}      <p><b>The bounded verdict:</b> ${esc(P.honestState.verdict)}</p>
    </div>

    <div class="card" id="bronzeGate">
      <span class="kick">Checkpoint · earn Bronze</span>
      <h4>Rebuild it from memory — nothing in front of you</h4>
      <p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:4px">Close the sections above. This is the retrieval that turns reading into knowing — and it is how this argument reaches <b>Bronze&nbsp;· Understand</b> on your shelf. Opening accordions no longer counts; showing you can rebuild the structure does.</p>
      <div class="recall">
        <div class="q">1 &middot; Put the argument in order — tap the three lines in sequence.</div>
        <div id="orderPool" class="btnrow"></div>
        <div id="orderSeq" style="font-family:var(--ui);font-size:13.5px;color:var(--tm);margin-top:10px;min-height:1.2em"></div>
      </div>
      <div class="recall" style="margin-top:12px">
        <div class="q">2 &middot; What does the argument establish? Select every claim it reaches — and nothing it doesn&rsquo;t.</div>
        <div id="propPool" style="display:flex;flex-wrap:wrap;gap:9px;margin-top:4px"></div>
      </div>
      <div class="btnrow"><button class="btn primary" onclick="gradeBronze(this)">Check my reconstruction</button><button class="btn ghost" onclick="resetBronze()">Reset</button></div>
      <div class="gradeline" id="bronzeGrade"></div>
    </div>
`;
{
  const pStart = L.indexOf('<section id="practice">'); must(pStart > 0, '#practice');
  const close = lastIndexBefore(L, '</section>', pStart);
  L = L.slice(0, close) + HONEST.trimStart() + '  ' + L.slice(close);
}

/* ---------- 4. Practice: phasesub, Explain levels, card copy, Drill 3 relabel, Drill 4 ---------- */
{
  const pStart = L.indexOf('<section id="practice">');
  L = L.slice(0, pStart) + L.slice(pStart).replace(/<p class="phasesub">[^<]*<\/p>/,
    '<p class="phasesub">Knowledge you can\'t retrieve under pressure isn\'t yours yet. These drills make you <em>generate</em> the argument, not recognise it — harder now, on purpose, so it holds in a real conversation.</p>');
}
L = replaceOnce(L, /Drill 1 · Explain It Back<\/span>/, 'Drill 1 · Explain It Back &mdash; free recall</span>', 'Drill 1 kick');
{
  // the <p> immediately before the explain textarea becomes the levels intro, then the level buttons
  const ta = L.indexOf('<textarea id="explainBox"'); must(ta > 0, '#explainBox');
  const pOpen = lastIndexBefore(L, '<p ', ta); const pClose = L.indexOf('</p>', pOpen) + 4;
  const intro = '<p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:12px">Scroll the sections away and generate it from memory — recalling is what builds durable memory; re-reading only feels like it does. Pick your level; the bar rises as you go. Scored out of 10, graded for accuracy first. An 8+ at level 2 or 3 is one half of <b>Silver</b>.</p>\n' +
    '      <div class="btnrow" id="explainLevels" style="margin:0 0 10px">\n' +
    '        <button class="btn ghost sel" type="button" data-lv="1" onclick="setExplainLevel(this,1)">1 · State it</button>\n' +
    '        <button class="btn ghost" type="button" data-lv="2" onclick="setExplainLevel(this,2)">2 · &hellip;and answer its hardest objection</button>\n' +
    '        <button class="btn ghost" type="button" data-lv="3" onclick="setExplainLevel(this,3)">3 · &hellip;to a hostile grad student</button>\n' +
    '      </div>';
  L = L.slice(0, pOpen) + intro + L.slice(pClose);
}
L = replaceOnce(L, /<p style="font-size:15px;color:var\(--tm\);font-family:var\(--ui\);margin-bottom:16px">Five cards[^<]*<\/p>/,
  '<p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:16px">Twelve cards drawn from the premises, objections, concessions, and sources above. <b>Answer out loud before you flip</b> — the effort of recall is the whole point; a card you merely recognise hasn\'t stuck. Each card is graded: type the key idea, flip, mark it. Three correct recalls and a card rests; it comes back on Today when it is due.</p>',
  'the "Five cards" intro');
L = replaceOnce(L, /Drill 3 · [^<]*<\/span>/, 'Drill 3 · The common objection (worked example)</span>', 'Drill 3 kick');
{
  const d3 = L.indexOf('Drill 3 · The common objection'); const pOpen = L.indexOf('<p ', d3); const pClose = L.indexOf('</p>', pOpen) + 4;
  L = L.slice(0, pOpen) + '<p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:16px">Start here: draft your reply, then reveal a model answer to compare. This is the <em>worked example</em> — Drill 4 then makes you do it cold across the whole objection set.</p>' + L.slice(pClose);
}
const DRILL4 = `
    <!-- answer the objections cold -->
    <div class="practicecard" id="objDrill">
      <span class="kick" style="font-family:var(--ui);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gd);font-weight:600;display:block;margin-bottom:11px">Drill 4 · Answer the objections cold</span>
      <h4 style="font-family:var(--fd);font-size:19px;font-weight:600;margin-bottom:6px">Four objections, no notes — reply, then check</h4>
      <p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:16px">The other half of <b>Silver</b>. Draft a reply from memory, reveal the certified answer, and rate yourself honestly. Clear all four with a &ldquo;nailed it&rdquo; and you can field them in the wild — not just recognise them on the page.</p>
      <div class="interloc">
        <div class="av" id="odAv">SK</div>
        <div><div class="who2" id="odWho">Skeptic</div><div class="bub" id="odQ"></div></div>
      </div>
      <textarea id="odBox" placeholder="Your reply, from memory..."></textarea>
      <div class="btnrow">
        <button class="btn gold" type="button" onclick="odReveal()">Reveal the certified answer</button>
      </div>
      <div class="modelans" id="odModel">
        <div class="lbl">A strong reply — ported from this page&rsquo;s certified answer</div>
        <p id="odModelText"></p>
        <div class="confrow" style="margin-top:12px">
          <button type="button" onclick="odRate(1)">Shaky — I&rsquo;ll redo this one</button>
          <button type="button" onclick="odRate(2)">Nailed it &#10003;</button>
        </div>
      </div>
      <div class="flashnav">
        <button class="btn ghost" type="button" onclick="odPrev()">&lsaquo; Prev</button>
        <span id="odCount"></span>
        <button class="btn ghost" type="button" onclick="odNext()">Next &rsaquo;</button>
      </div>
    </div>

`;
{
  const pv = L.indexOf('<section id="proveit">'); must(pv > 0, '#proveit');
  const close = lastIndexBefore(L, '</section>', pv);
  L = L.slice(0, close) + DRILL4.trimStart() + '  ' + L.slice(close);
}

/* ---------- 5. Prove: phasesub, ladder, honesty copy, unseen gate ---------- */
{
  const pv = L.indexOf('<section id="proveit">');
  L = L.slice(0, pv) + L.slice(pv).replace(/<p class="phasesub">[^<]*<\/p>/,
    '<p class="phasesub">Mastery isn\'t a feeling — it\'s three levels, each earned by <em>showing</em> you can do the thing, then proven again over time. Don\'t trust the warm glow of having read it; prove it cold.</p>');
}
const LADDER = `<span class="kick">Your levels on this argument</span>
      <h4>What each one takes</h4>
      <div class="checklist" id="levelReqs">
        <div class="cl" id="rq-bronze"><div class="box">✓</div><div class="txt"><b>Bronze · Understand</b><span>Rebuild the syllogism + what the argument establishes, from memory (&ge;80%) — the checkpoint at the end of &ldquo;Understand it.&rdquo;</span></div><div class="state">Not yet</div></div>
        <div class="cl" id="rq-explain"><div class="box">✓</div><div class="txt"><b>Silver · part 1 · Explain it</b><span>Score 8+ on Explain It Back at level 2 or 3 (the argument <em>and</em> its hardest objection)</span></div><div class="state">Not yet</div></div>
        <div class="cl" id="rq-objections"><div class="box">✓</div><div class="txt"><b>Silver · part 2 · Objections cold</b><span>Answer all four objection drills with &ldquo;nailed it&rdquo;</span></div><div class="state">Not yet</div></div>
        <div class="cl" id="rq-unseen"><div class="box">✓</div><div class="txt"><b>Gold · part 1 · The unseen objection</b><span>Face one objection the page never drilled (below)</span></div><div class="state">Not yet</div></div>
        <div class="cl" id="rq-disc"><div class="box">✓</div><div class="txt"><b>Gold · part 2 · Pick the right tool</b><span>Pass &ldquo;which argument answers this?&rdquo; &mdash; four of five, mixed with neighbouring arguments</span></div><div class="state">Not yet</div></div>
        <div class="cl" id="rq-spaced"><div class="box">✓</div><div class="txt"><b>Gold · part 3 · Prove it again</b><span>Clear this argument on 3 spaced reviews — it returns on its own</span></div><div class="state">0 of 3</div></div>
      </div>
      <p style="font-family:var(--ui);font-size:13px;color:var(--tm);margin-top:14px">Gold can slip back to Silver if you stop turning up for the spaced reviews — real mastery is perishable, which is why it's worth something. The dashboard brings this one back when it's due.</p>`;
L = replaceOnce(L, /<div class="checklist">[\s\S]*?<div class="cl" id="ck-debate">[^\n]*\n\s*<\/div>/, LADDER, 'the legacy ck-* checklist');
L = replaceOnce(L, /<p style="font-size:14px;color:var\(--tm\);font-family:var\(--ui\)">Your self-rating is tracked[^<]*<\/p>/,
  '<p style="font-size:14px;color:var(--tm);font-family:var(--ui)">Rate yourself — then see whether your Explain It Back score backs it up. Felt-confidence and shown-confidence are not the same thing, and the gap is worth knowing before a real conversation.</p>',
  'the self-rating copy');
const UNSEEN = `
    <div class="card" id="unseenGate">
      <span class="kick">Gold gate · the unseen objection</span>
      <h4>One you weren&rsquo;t coached on</h4>
      <p style="font-size:15px;color:var(--tm);font-family:var(--ui);margin-bottom:14px">Everything above rehearsed objections the page showed you. Here is the real test of mastery: an objection we deliberately did <em>not</em> drill. Reason it out cold from what the argument established, then reveal how it actually handles it. An honest &ldquo;nailed it&rdquo; is the first half of Gold.</p>
      <div class="interloc">
        <div class="av">${esc((P.unseen.av || P.unseen.who.slice(0, 2)).toUpperCase())}</div>
        <div><div class="who2">${esc(P.unseen.who)}</div><div class="bub">"${esc(P.unseen.q)}"</div></div>
      </div>
      <textarea id="unseenBox" placeholder="Reason it out from what the argument established..."></textarea>
      <div class="btnrow"><button class="btn gold" type="button" onclick="unseenReveal()">Reveal how the argument handles it</button></div>
      <div class="modelans" id="unseenModel">
        <div class="lbl">How the argument answers it — ported from the deep dive</div>
        <p>${esc(P.unseen.model)}</p>
        <div class="confrow" style="margin-top:12px">
          <button type="button" onclick="unseenRate(1)">Shaky — I&rsquo;ll sit with it</button>
          <button type="button" onclick="unseenRate(2)">Nailed it &#10003;</button>
        </div>
      </div>
    </div>

`;
L = insertBefore(L, '<div class="bigcta">', UNSEEN.trimStart() + '    ', 'bigcta');

/* ---------- 6. the inline script: Kalam template with this page's data ---------- */
const kScript = K.match(/<script>\n\/\* ---- state: three earned levels[\s\S]*?<\/script>/); must(kScript, 'Kalam template script');
const lScriptRe = /<script>\n\/\* ---- in-memory state[\s\S]*?<\/script>/;
must(lScriptRe.test(L), 'legacy inline script');
const Lscript = L.match(lScriptRe)[0];
const take = (src, re, what) => { const m = src.match(re); must(m, `legacy ${what}`); return m[0]; };
const lPrem = take(Lscript, /var ARG_PREMISES = \[[\s\S]*?\n\];/, 'ARG_PREMISES');
const lChecks = take(Lscript, /  var checks = \[[\s\S]*?\n  \];/, 'checks');
let S = kScript[0];
S = S.replace(/var ARG_PREMISES = \[[\s\S]*?\n\];/, () => lPrem);
S = S.replace(/  var checks = \[[\s\S]*?\n  \];/, () => lChecks);
S = S.replace(/const cards = \[[\s\S]*?\n\];/, () => 'const cards = [\n' + P.cards.map(c => `  {q:${js(c.q)}, a:${js(c.a)}}`).join(',\n') + '\n];');
S = S.replace(/var ORDER = \[[\s\S]*?\n\];/, () => 'var ORDER = [\n' + P.order.map(o => '  ' + js(o)).join(',\n') + '\n];');
S = S.replace(/var PROPS = \[[\s\S]*?\n\];/, () => 'var PROPS = [\n' + P.props.map(p => `  {t:${js(p.t)}, ok:${p.ok ? 'true' : 'false'}}`).join(',\n') + '\n];');
S = S.replace(/var OBJ = \[[\s\S]*?\n\];/, () => 'var OBJ = [\n' + P.obj.map(o => `  {who:${js(o.who)}, q:${js(o.q)}, model:${js(o.model)}}`).join(',\n') + '\n];');
must(S.includes("'The Kalam Cosmological Argument'"), 'title slots');
S = S.split("'The Kalam Cosmological Argument'").join(js(P.title));
S = S.split('"The Kalam Cosmological Argument"').join(js(P.title));
must(S.includes('(Morriston: our causal intuition'), 'level-2 prompt slot');
// the slot sits inside a single-quoted JS string: escape backslashes and apostrophes
const explain2 = String(P.explain2).replace(/\n/g, ' ').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
S = S.replace(/\(Morriston: our causal intuition[^)]*\)/, () => '(' + explain2 + ')');
S = S.replace("'From memory: the argument AND your best answer to its hardest objection (Morriston)...'", "'From memory: the argument AND your best answer to its hardest objection...'");
S = S.replace("'From memory: both premises, the conclusion, and what the cause must be...'", "'From memory: both premises, the conclusion, and what follows from them...'");
must(S.includes("'Kalam mastered"), 'short-name slots');
S = S.split("'Kalam mastered \\u2014 Gold on your shelf'").join(js(P.short + ' mastered — Gold on your shelf'));
S = S.split("'\\u25C6 \\u00A0Kalam \\u2014 Gold \\u00B7 mastered'").join(js('◆  ' + P.short + ' — Gold · mastered'));
S = S.split("'\\u25C6 \\u00A0Kalam \\u2014 ' +").join(js('◆  ' + P.short + ' — ') + ' +');
must(!S.includes('Kalam'), 'a Kalam-specific string survived in the template script: ' + (S.match(/[^\n]*Kalam[^\n]*/) || [''])[0]);
L = L.replace(lScriptRe, () => S);

/* ---------- 7. stamp note (lens dates NOT bumped; the gate does that) ---------- */
const note = `2026-10-11 CONVERSION TO THE BRONZE/SILVER/GOLD STANDARD (tools/mastery-convert.mjs from docs/mastery-ports/${slug}.json; Phase 2 of docs/MASTERY_ROLLOUT_GUIDE_2026-10-11.md). Added: key terms, what-follows rows, honest state, Bronze checkpoint (ORDER/PROPS), 12 cards, 4 cold objections, unseen-objection Gold gate, three Explain levels. Kept verbatim: summary, syllogism, premise-defence cards, objection accordions, Touch the originals, ARG_PREMISES, checks, Drill 3. Every new string PORTED from the paired essay / this page (see the port file's ledger). GATE PENDING at conversion time — the lens dates below are NOT yet bumped for the new strings. || `;
L = replaceOnce(L, /(<!-- content-review: \{[^\n]*?"by":\s*")/, (m) => m + note, 'content-review stamp');

/* ---------- 8. sanity ---------- */
for (const id of ['bronzeGate', 'unseenModel', 'explainLevels', 'objDrill', 'rq-disc', 'levels', 'orderPool', 'propPool']) must(L.includes(`id="${id}"`), `output lacks #${id}`);
must(!L.includes('FRESH_MS'), 'FRESH_MS survived');
must(L.includes('function levelOf') && L.includes('discPassed()'), 'template script missing');

if (DRY) { console.log(`DRY RUN ev-m-${slug}.html: ${L.length} bytes (was ${readFileSync(pagePath, 'utf8').length}); css blocks added: ${add.length}`); process.exit(0); }
writeFileSync(pagePath, L, 'utf8');
console.log(`converted ev-m-${slug}.html (+${add.length} css blocks, ${P.cards.length} cards, ${P.obj.length} objections, ${P.keyTerms.length} terms, ${P.derive.length} derive rows)`);
