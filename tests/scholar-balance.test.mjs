// Guards tools/check-scholar-balance.mjs — the counter behind the READER-IN-THE-PEW RULE
// (CLAUDE.md, owner-directed 2026-11-24). The tool is report-only, so nothing here fails on
// the CONTENT of the site; these tests pin the counting logic and the registry's integrity,
// because a counter that quietly miscounts is worse than no counter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadRegistry, analyse, htmlToText, splitUnits, tierLines } from '../tools/check-scholar-balance.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const reg = loadRegistry();

test('registry: every pattern compiles and nobody is on two benches', () => {
  const raw = JSON.parse(readFileSync(join(ROOT, 'tools', 'scholar-balance.json'), 'utf8'));
  const names = new Map();
  for (const list of ['defenders', 'dissenters', 'mixed']) {
    assert.ok(Array.isArray(raw[list]) && raw[list].length, `${list} is a non-empty list`);
    for (const e of raw[list]) {
      assert.doesNotThrow(() => new RegExp(e.pattern, 'g'), `${e.name} pattern compiles`);
      assert.ok(!names.has(e.name), `${e.name} is listed once (also in ${names.get(e.name)})`);
      names.set(e.name, list);
    }
  }
});

test('registry: first names and look-alikes do not cross the benches', () => {
  // "Craig Keener" must not count William Lane Craig; "Alister McGrath" is a defender, not
  // James F. McGrath; "Francis Collins" is not John J. Collins.
  const a = analyse('Craig Keener and Alister McGrath and Francis Collins each argue the point at length here.', reg);
  assert.equal(a.dissent, 0);
  assert.deepEqual(Object.keys(a.names.defenders).sort(), ['Alister McGrath', 'Craig Keener']);
});

test('a sceptic conceding a fact is a hostile witness, not dissent', () => {
  const a = analyse('Even the agnostic Bart Ehrman concedes that Jesus existed and was crucified under Pilate.', reg);
  assert.equal(a.witness, 1);
  assert.equal(a.dissent, 0);
  assert.deepEqual(a.flags, []);
});

test('dissent named in a plain tier is flagged; the same sentence in the deep dive is not', () => {
  const sent = 'James McGrath argues that the title is set alongside the creed rather than folded into it.';
  const card = (plain, deep) => [
    'In plain English: the first Christians worshipped Jesus.',
    'The Case, Plainly', plain,
    'Deep Dive — the full case', 'How to explain this to someone', 'They prayed to him from the first.',
    'Richard Bauckham reads the verse as including Jesus within the one God, for the reasons given here.', deep,
    'Research the evidence, line by line', 'The texts are early.',
  ].join('\n');
  const inPlain = analyse(card(sent, ''), reg);
  assert.equal(inPlain.plainDissent, 1);
  assert.ok(inPlain.flags.includes('PLAIN-TIER DISSENT'));
  const inDeep = analyse(card('He received worship.', sent), reg);
  assert.equal(inDeep.plainDissent, 0);
  assert.ok(!inDeep.flags.includes('PLAIN-TIER DISSENT'));
});

test('the explain script and "In conversation" line are held to the plain-tier standard', () => {
  const tiers = tierLines(['Free summary.', 'Deep Dive', 'How to explain this to someone',
    'Say this to a friend.', 'In conversation: "ask them this."', 'Then the long argument.'].join('\n'));
  assert.deepEqual(tiers.filter((t) => t.line).map((t) => t.tier), ['free', 'script', 'script', 'deep']);
});

test('a card with no explain script still reaches the deep tier', () => {
  const tiers = tierLines(['Free.', 'The Case, Plainly', 'Plain case.', 'Deep DiveEvery claim examined', 'Deep text.'].join('\n'));
  assert.equal(tiers.at(-1).tier, 'deep');
});

test('bench, refrain and an essay with no tiers', () => {
  const caveat = 'The reading is genuinely contested, and Maurice Casey argues the title was a later creation of the church.';
  const a = analyse([caveat, 'Some other sentence about the evidence.', caveat].join('\n'), reg);
  assert.equal(a.repeats.length, 1);
  assert.equal(a.repeats[0].n, 2);
  assert.ok(a.flags.includes('REFRAIN'));
  assert.ok(a.flags.includes('BENCH'));       // two named dissents, no named defence
  assert.equal(a.plainDissent, 0);            // no tier markers → one 'essay' tier, never "plain"
});

test('the review stamp and scripts are not counted as served prose', () => {
  const text = htmlToText('<p>Jesus rose.</p><!-- content-review: {"by":"Ehrman contested debated"} --><script>var x="Ehrman";</script>');
  assert.equal(analyse(text, reg).dissent, 0);
  assert.equal(analyse(text, reg).hedges, 0);
});

test('hub fragments split into one unit per card', () => {
  const units = splitUnits('ev-sX.html', '<div class="tab"><div class="card" id="arg-one">A</div><div class="card" id="arg-two">B</div></div>');
  assert.deepEqual(units.map((u) => u.id), ['ev-sX.html#arg-one', 'ev-sX.html#arg-two']);
});

test('bench gate: a new tip toward dissent fails, a baselined one may not grow, a fixed one passes', async () => {
  const { benchViolations } = await import('../tools/check-scholar-balance.mjs');
  const row = (id, defenders, dissent) => ({ id, defenders, dissent });
  assert.deepEqual(benchViolations([row('a', 3, 3), row('b', 5, 2)], {}), []);                 // level or ahead → fine
  assert.equal(benchViolations([row('new', 1, 2)], {})[0].kind, 'new');                        // not baselined → fails
  assert.deepEqual(benchViolations([row('old', 1, 4)], { old: 3 }), []);                       // baselined, same gap → tolerated debt
  assert.equal(benchViolations([row('old', 1, 6)], { old: 3 })[0].kind, 'worse');              // baselined gap grew → fails
  assert.deepEqual(benchViolations([row('old', 4, 4)], { old: 3 }), []);                       // fixed → passes (then --update drops it)
});

test('unitRoles: a "dissenter" arguing FOR the page\'s claim is a witness on that page only', () => {
  const sent = 'Bart Ehrman wrote an entire book demolishing the mythicist position.';
  const r = { ...reg, unitRoles: { 'card#x': { witness: ['Bart Ehrman'], why: 'test' } } };
  assert.equal(analyse(sent, r, 'card#x').dissent, 0);
  assert.equal(analyse(sent, r, 'card#x').witness, 1);
  assert.equal(analyse(sent, r, 'card#y').dissent, 1);
});

test('unitRoles entries carry a written reason and name real registry dissenters', () => {
  const raw = JSON.parse(readFileSync(join(ROOT, 'tools', 'scholar-balance.json'), 'utf8'));
  const dissenters = new Set(raw.dissenters.map((d) => d.name));
  for (const [unit, v] of Object.entries(raw.unitRoles || {})) {
    if (unit.startsWith('_')) continue;                        // _readme notes
    assert.ok(v.why && v.why.length > 30, `${unit} has a written reason`);
    const named = [...(v.witness || []), ...(v.defender || [])];
    const mixed = new Set(raw.mixed.map((d) => d.name));
    assert.ok(named.length + (v.dissenter || []).length, `${unit} names at least one scholar`);
    for (const n of named) assert.ok(dissenters.has(n), `${unit}: ${n} is a registry dissenter`);
    for (const n of v.dissenter || []) assert.ok(mixed.has(n), `${unit}: ${n} (dissenter override) is in the mixed list`);
  }
});

test('unitRoles: a registry dissenter named as the REPLY on one page counts as defence there only', () => {
  const sent = 'J. D. G. Dunn argued against the theory that the secrecy is a purely theological device.';
  const r = { ...reg, unitRoles: { 'card#x': { defender: ['James D. G. Dunn'], why: 'test' } } };
  assert.equal(analyse(sent, r, 'card#x').defenders, 1);
  assert.equal(analyse(sent, r, 'card#x').dissent, 0);
  assert.equal(analyse(sent, r, 'card#y').dissent, 1);
});

test('a name with initials is not split away from its surname', () => {
  const a = analyse('The argument is made at length by Michael F. Bird, in his book on the Gospels, as readers will find.', reg);
  assert.deepEqual(Object.keys(a.names.defenders), ['Michael F. Bird']);
  const b = analyse('The case was pressed by J. D. G. Dunn. A second sentence follows here.', reg);
  assert.equal(b.dissent, 1);
});

test('unitRoles.dissenter: a "mixed" scholar who is a page\'s named objection counts as dissent there only', () => {
  const sent = 'Paula Fredriksen argues that Jesus proclaimed the kingdom but did not publicly claim the title himself.';
  const r = { ...reg, unitRoles: { 'card#x': { dissenter: ['Paula Fredriksen'], why: 'test' } } };
  assert.equal(analyse(sent, r, 'card#x').dissent, 1);
  assert.equal(analyse(sent, r, 'card#y').dissent, 0);
});
