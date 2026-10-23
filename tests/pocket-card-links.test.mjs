// Every pocket card must carry the way back to its full essay (2026-09-30: the card
// prints the essay address + a real QR code, and the share link opens the essay).
// Earlier history: every pocket card's share link must land on the argument it promises.
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

test('every pocket card links to its full essay (card print, QR and share link)', () => {
  const pc = read('pocket-cards.html');
  const ids = [...pc.matchAll(/\{\s*id:\s*'([^']+)'[^\n]*?link:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(ids.length >= 70, `expected the full deck, parsed ${ids.length}`);
  assert.match(pc, /<script src="\/lib\/pocket-qr\.js"><\/script>/, 'pocket-cards.html must load lib/pocket-qr.js');

  const js = read('lib/pocket-qr.js');
  const ESSAY = JSON.parse(js.match(/window\.POCKET_ESSAY = (\{[\s\S]*?\});/)[1]);
  const QR = JSON.parse(js.match(/window\.POCKET_QR = (\{[\s\S]*?\});/)[1]);

  const broken = [];
  for (const id of ids) {
    const path = ESSAY[id];
    if (!path) { broken.push(`${id}: no essay mapped (run python3 tools/build-pocket-qr.py)`); continue; }
    if (!/^library\/[\w-]+\.html$/.test(path) || !existsSync(join(ROOT, path))) broken.push(`${id}: ${path} does not exist`);
    if (!/^data:image\/png;base64,/.test(QR[path] || '')) broken.push(`${id}: no QR code for ${path}`);
  }
  assert.deepEqual(broken, [], 'pocket cards without a working essay link:\n' + broken.join('\n'));
});
