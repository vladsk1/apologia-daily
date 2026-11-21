// answer-patch.mjs — surgical in-place sync for a LIVE answer page.
//
// WHY THIS EXISTS (BAR-25, 2026-11-21). `gen-answers.mjs --sync` used to rewrite a drifted
// page wholesale from its template. Answer pages are not purely generated: some carry
// hand-authored content the template knows nothing about — a "Related questions" <section>
// with its own FAQPage JSON-LD block, a hand-chosen "Go deeper" link. A wholesale rewrite
// silently DELETED all of that (it happened on are-there-contradictions-in-the-bible.html,
// and was caught only by reading the diff). So --sync now patches ONLY the regions that are
// generated from answers/_data.json and that the drift audit compares:
//   1. the <meta name="description"> content
//   2. the <meta property="og:description"> content
//   3. the generator's own FAQPage JSON-LD acceptedAnswer text (the COMPACT block whose single
//      Question name is the entry's q) — any other JSON-LD block is left untouched
//   4. the inner HTML of <div class="ad-answer"> (paragraphs + clarifier spans; no nested divs)
// Everything else on the page is preserved byte for byte. If any of the four regions cannot be
// found exactly once, patchAnswerPage refuses (returns { ok:false, reason }) and the caller must
// NOT write — a page that no longer has the generated shape needs a human, not a regenerate.

const BODY_RE = /(<div class="ad-answer">)([\s\S]*?)(<\/div>)/g;
const META_RE = /(<meta name="description" content=")([^"]*)(">)/g;
const OG_RE = /(<meta property="og:description" content=")([^"]*)(">)/g;
const LD_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function countMatches(re, s) {
  re.lastIndex = 0;
  let n = 0;
  while (re.exec(s)) n++;
  re.lastIndex = 0;
  return n;
}

/**
 * @param {string} html   the live page
 * @param {{ q:string, body:string, metaAttr:string, ldText:string }} gen
 *        body = rendered inner HTML for .ad-answer; metaAttr = attribute-escaped meta;
 *        ldText = the acceptedAnswer text (plain string; it is JSON-encoded here)
 * @returns {{ ok:true, html:string } | { ok:false, reason:string }}
 */
export function patchAnswerPage(html, gen) {
  for (const [name, re] of [['ad-answer body', BODY_RE], ['meta description', META_RE], ['og:description', OG_RE]]) {
    const n = countMatches(re, html);
    if (n !== 1) return { ok: false, reason: `${name}: expected exactly 1 region, found ${n}` };
  }
  // Locate the generator's own FAQPage block: compact JSON, @type FAQPage, one Question named q.
  let target = null;
  let m;
  LD_RE.lastIndex = 0;
  while ((m = LD_RE.exec(html))) {
    let obj;
    try { obj = JSON.parse(m[1]); } catch { continue; }
    const me = obj && obj['@type'] === 'FAQPage' && Array.isArray(obj.mainEntity) ? obj.mainEntity : null;
    if (me && me.length === 1 && me[0] && me[0].name === gen.q && m[1] === JSON.stringify(obj)) {
      if (target) return { ok: false, reason: 'generated FAQPage JSON-LD: found more than one candidate block' };
      target = { start: m.index, end: m.index + m[0].length, obj };
    }
  }
  LD_RE.lastIndex = 0;
  if (!target) return { ok: false, reason: 'generated FAQPage JSON-LD: no compact block whose Question is this entry\'s q' };

  target.obj.mainEntity[0].acceptedAnswer = { '@type': 'Answer', text: gen.ldText };
  const newLd = `<script type="application/ld+json">${JSON.stringify(target.obj)}</script>`;
  let out = html.slice(0, target.start) + newLd + html.slice(target.end);
  out = out.replace(BODY_RE, (_, a, _b, c) => a + gen.body + c);
  out = out.replace(META_RE, (_, a, _b, c) => a + gen.metaAttr + c);
  out = out.replace(OG_RE, (_, a, _b, c) => a + gen.metaAttr + c);
  return { ok: true, html: out };
}
