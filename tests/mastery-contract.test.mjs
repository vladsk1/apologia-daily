/* Mastery-page DATA CONTRACT (Phase 1.1 of docs/MASTERY_ROLLOUT_GUIDE_2026-10-11.md).
 *
 * Every Bronze/Silver/Gold page (one whose inline script defines levelOf) must carry
 * the arrays the shared mechanics in lib/review-queue.js read, at the counts the
 * standard promises the learner — 12 graded cards, 4 cold objections, an unseen
 * objection, a 10-chip Bronze checkpoint, the mixed-argument Gold sub-gate. The
 * rollout of the 70 legacy pages (Phase 2) is "done" for a page only when it passes
 * this test. Every page, legacy or not, must carry ARG_PREMISES + the 5-row offline
 * scorer and load the shared review queue.
 *
 * Counts are measured from the page source, not from a doctrinal reading — the
 * content gate certifies WHAT the strings say; this only guarantees they exist. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(ROOT).filter(f => /^ev-m-.+\.html$/.test(f)).sort();

function block(src, startRe, name) {
  const m = src.match(startRe);
  assert.ok(m, `${name}: array start not found`);
  const from = m.index + m[0].length;
  const end = src.indexOf('\n];', from);
  assert.ok(end > from, `${name}: array end not found`);
  return src.slice(from, end);
}
const count = (s, re) => (s.match(re) || []).length;

test('every mastery page loads the shared review queue and carries the grader rubric', () => {
  assert.ok(pages.length >= 83, `expected >= 83 mastery pages, found ${pages.length}`);
  for (const f of pages) {
    const src = readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(src.includes('/lib/review-queue.js'), `${f}: must include /lib/review-queue.js`);
    const prem = block(src, /var ARG_PREMISES = \[/, f + ' ARG_PREMISES');
    assert.ok(count(prem, /^\s*['"]/gm) >= 3, `${f}: ARG_PREMISES needs >= 3 lines`);
    const checks = block(src, /var checks = \[/, f + ' checks');
    assert.equal(count(checks, /\{ok:/g), 5, `${f}: the offline scorer needs exactly 5 check rows`);
  }
});

test('Bronze/Silver/Gold pages satisfy the data contract', () => {
  const bsg = pages.filter(f => readFileSync(path.join(ROOT, f), 'utf8').includes('function levelOf'));
  assert.ok(bsg.length >= 13, `expected >= 13 B/S/G pages, found ${bsg.length}`);
  for (const f of bsg) {
    const src = readFileSync(path.join(ROOT, f), 'utf8');
    const cards = block(src, /const cards = \[/, f + ' cards');
    // Two authoring styles are live: {q:'…', a:'…'} and JSON-style {"q": "…", "a": "…"} (properly-basic).
    const nCards = count(cards, /\{\s*["']?q["']?\s*:/g);
    assert.ok(nCards >= 12, `${f}: needs >= 12 flashcards (found ${nCards})`);
    const obj = block(src, /var OBJ = \[/, f + ' OBJ');
    assert.equal(count(obj, /\{\s*["']?who["']?\s*:/g), 4, `${f}: needs exactly 4 cold objections`);
    assert.ok(/model:/.test(obj), `${f}: each cold objection needs a certified model reply`);
    const order = block(src, /var ORDER = \[/, f + ' ORDER');
    assert.equal(count(order, /^\s*["']/gm), 3, `${f}: ORDER needs the 3 syllogism lines`);
    const props = block(src, /var PROPS = \[/, f + ' PROPS');
    // Kalam has 6 true + 4 decoys; most pages 4 + 4; fine-tuning 3 + 5. The floor is what
    // makes the 80% pass mark meaningful: at least 3 true, at least 3 decoys, 8+ chips in all.
    assert.ok(count(props, /["']?ok["']?\s*:\s*true/g) >= 3, `${f}: PROPS needs >= 3 true chips`);
    assert.ok(count(props, /["']?ok["']?\s*:\s*false/g) >= 3, `${f}: PROPS needs >= 3 decoy chips`);
    assert.ok(count(props, /["']?ok["']?\s*:\s*(true|false)/g) >= 8, `${f}: PROPS needs >= 8 chips`);
    assert.ok(src.includes('id="unseenModel"'), `${f}: needs the unseen-objection Gold gate`);
    assert.ok(src.includes('id="bronzeGate"'), `${f}: needs the Bronze checkpoint`);
    assert.ok(src.includes('id="explainLevels"'), `${f}: needs the three Explain It Back levels`);
    assert.ok(/discPassed\(\)/.test(src) && /if\(silver && state\.unseen && discPassed\(\) && spacedCount\(\)>=3\) return 3;/.test(src),
      `${f}: Gold must require the mixed-argument drill (discPassed) in levelOf`);
    assert.ok(src.includes('id="rq-disc"'), `${f}: ladder needs the rq-disc row`);
    assert.ok(/state\.explainHi/.test(src), `${f}: Silver must require the 8+ at Explain level 2 or 3 (explainHi)`);
    assert.ok(!src.includes('FRESH_MS'), `${f}: legacy 30-day fade must be gone`);
  }
});

test('the shared mechanics layer is present and documents the card rule', () => {
  const rq = readFileSync(path.join(ROOT, 'lib', 'review-queue.js'), 'utf8');
  assert.ok(rq.includes('PHASE 1 (2026-10-11)'), 'lib/review-queue.js must carry the Phase 1 layer');
  assert.ok(rq.includes('CARD RULE'), 'lib/review-queue.js must state the card rule');
  for (const fn of ['dueCards', 'gradeCard', 'initReproof', 'initCards', 'initPretest', 'initDiscrimination', 'initIfThen', 'initTypedCloze']) {
    assert.ok(rq.includes(fn), `lib/review-queue.js must define ${fn}`);
  }
  const ui = readFileSync(path.join(ROOT, 'library', 'mastery-ui.js'), 'utf8');
  assert.ok(ui.includes('PAGE DATA CONTRACT'), 'mastery-ui.js header must state the page data contract');
  const ps = readFileSync(path.join(ROOT, 'progress-sync.js'), 'utf8');
  for (const k of ['ad_cards', 'ad_pretest', 'ad_ifthen_arg']) assert.ok(ps.includes(`'${k}'`), `progress-sync.js must sync ${k}`);
  const today = readFileSync(path.join(ROOT, 'today.html'), 'utf8');
  assert.ok(today.includes("kind:'mcard'") && today.includes('ADReview.gradeCard'), 'today.html must review and grade mastery-page cards');
  const sw = readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.ok(sw.includes("'ad-due'") && sw.includes('due to re-prove'), 'sw.js must use the posted due list in push notifications');
});
