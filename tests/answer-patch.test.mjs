// BAR-25 (2026-11-21): `gen-answers.mjs --sync` used to rewrite a drifted answer page
// wholesale, silently deleting hand-authored content (a "Related questions" section and
// its own FAQPage JSON-LD). It now patches only the four generated regions via
// tools/answer-patch.mjs. These tests pin that behaviour.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { patchAnswerPage } from '../tools/answer-patch.mjs';

const Q = "Aren't there contradictions in the Bible?";
const genLd = (text) => JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [{ '@type': 'Question', name: Q, acceptedAnswer: { '@type': 'Answer', text } }] });
const HAND_LD = '{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "How many angels?", "acceptedAnswer": {"@type": "Answer", "text": "Hand-authored."}}]}';
const HAND_SECTION = '<section class="ad-related-qs">\n      <h2>Related questions</h2>\n      <h3>How many angels?</h3>\n      <p>Hand-authored.</p>\n    </section>';
const fixture = (body, meta, ld) => `<!DOCTYPE html><html><head>
<meta name="description" content="${meta}">
<meta property="og:description" content="${meta}">
<script type="application/ld+json">${ld}</script>
<script type="application/ld+json">${HAND_LD}</script>
</head><body><article><div class="ad-answer">${body}</div>
    ${HAND_SECTION}
  </article>
  <p class="ad-related">Go deeper: <a href="/ev-m-consistency.html">hand-chosen link &rarr;</a></p>
</body></html>`;

test('patchAnswerPage replaces only the generated regions and preserves hand-authored content', () => {
  const before = fixture('<p>Old body.</p>', 'Old meta.', genLd('Old body.'));
  const r = patchAnswerPage(before, { q: Q, body: '<p>New body.</p>', metaAttr: 'New meta.', ldText: 'New body.' });
  assert.equal(r.ok, true, r.reason);
  const after = r.html;
  assert.ok(after.includes('<div class="ad-answer"><p>New body.</p></div>'));
  assert.ok(after.includes('<meta name="description" content="New meta.">'));
  assert.ok(after.includes('<meta property="og:description" content="New meta.">'));
  assert.ok(after.includes(genLd('New body.')), 'generated JSON-LD updated');
  // hand-authored content survives byte for byte
  assert.ok(after.includes(HAND_SECTION), 'Related questions section preserved');
  assert.ok(after.includes(HAND_LD), 'hand-authored FAQPage JSON-LD preserved');
  assert.ok(after.includes('hand-chosen link'), 'hand-chosen Go deeper link preserved');
  // and nothing else moved: undoing the four edits gives back the original
  const undone = patchAnswerPage(after, { q: Q, body: '<p>Old body.</p>', metaAttr: 'Old meta.', ldText: 'Old body.' });
  assert.equal(undone.html, before);
});

test('patchAnswerPage refuses (writes nothing) when a generated region is missing or ambiguous', () => {
  const noGenLd = fixture('<p>b</p>', 'm', '{"@type":"Thing"}');
  assert.equal(patchAnswerPage(noGenLd, { q: Q, body: 'x', metaAttr: 'y', ldText: 'z' }).ok, false);
  const twoBodies = fixture('<p>b</p>', 'm', genLd('b')).replace('</article>', '<div class="ad-answer">dup</div></article>');
  assert.equal(patchAnswerPage(twoBodies, { q: Q, body: 'x', metaAttr: 'y', ldText: 'z' }).ok, false);
});

test('every live answer page is patchable in place (so --sync never needs a wholesale rewrite)', () => {
  const dir = 'answers';
  const data = JSON.parse(readFileSync(join(dir, '_data.json'), 'utf8'));
  const bad = [];
  for (const e of data.answers) {
    let html;
    try { html = readFileSync(join(dir, e.slug + '.html'), 'utf8'); } catch { continue; }
    const r = patchAnswerPage(html, { q: e.q, body: 'x', metaAttr: 'y', ldText: 'z' });
    if (!r.ok) bad.push(`${e.slug}: ${r.reason}`);
  }
  assert.deepEqual(bad, [], 'pages --sync could not patch:\n' + bad.join('\n'));
  assert.ok(readdirSync(dir).length > 0);
});
