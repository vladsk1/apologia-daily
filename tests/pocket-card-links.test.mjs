// Every pocket card's share link must land on the argument it promises.
//
// pocket-cards.html builds the link in updateShareLink(): evidence-library.html?arg=<slug>
// (the hub opens the card with id="arg-<slug>", listed in its ARG_TAB), or a library
// essay that IS the argument. On 2026-09-25 six cards sent ?arg= ids the hub did not
// know (so the reader landed on the first tab with nothing open) and three pointed at
// worldviews.html, which cannot open a specific card — while the page promised the
// link opens "this argument". This test keeps that promise true.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(ROOT, f), 'utf8');

test('every pocket card share link resolves to its argument', () => {
  const pc = read('pocket-cards.html');
  const cards = [...pc.matchAll(/\{\s*id:\s*'([^']+)'[^\n]*?link:\s*'([^']+)'/g)].map((m) => ({ id: m[1], link: m[2] }));
  assert.ok(cards.length >= 70, `expected the full deck, parsed ${cards.length}`);

  const mapSrc = pc.match(/var HUB_SLUG = (\{[\s\S]*?\});/);
  assert.ok(mapSrc, 'HUB_SLUG map not found in updateShareLink()');
  const HUB_SLUG = Function(`return (${mapSrc[1]})`)();

  const hub = read('evidence-library.html');
  const ARG_TAB = JSON.parse(hub.match(/var ARG_TAB = (\{[^;]*\});/)[1]);
  const hubCards = new Set();
  for (let i = 1; i <= 8; i++) {
    const f = `ev-s${i}.html`;
    if (!existsSync(join(ROOT, f))) continue;
    for (const m of read(f).matchAll(/id="arg-([^"]+)"/g)) hubCards.add(m[1]);
  }

  const broken = [];
  for (const { id, link } of cards) {
    if (!existsSync(join(ROOT, link))) { broken.push(`${id}: target ${link} does not exist`); continue; }
    if (link === 'evidence-library.html') {
      const slug = HUB_SLUG[id] || id;
      if (!hubCards.has(slug) || !ARG_TAB[slug]) broken.push(`${id}: ?arg=${slug} matches no hub card`);
    }
  }
  assert.deepEqual(broken, [], 'pocket-card share links that would not open their argument:\n' + broken.join('\n'));
});
