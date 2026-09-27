/* citations.js — turn the AI's inline citation tags into clickable footnotes.
   The live /api/ask answer may contain tags like [[disciplesbelief#p3]] that
   point at the exact paragraph of one of our reviewed essays. This walks a
   rendered answer element, replaces each VALID tag with a small superscript
   footnote link (to /library/<slug>.html#p<N>), numbers them, and STRIPS any
   tag whose slug is not a real essay — so a stray/fabricated tag can never
   render as a broken link. Validation is against /essay-slugs.json (tiny),
   loaded once and cached.

   Usage: include once, then after rendering an answer call
     window.ADCite && ADCite.process(answerBodyElement);
   Safe no-op until the slug list loads (it queues and processes on arrival). */
(function () {
  if (window.ADCite) return;

  var SLUGS = null, queue = [];
  fetch('/essay-slugs.json').then(function (r) { return r.json(); }).then(function (list) {
    SLUGS = new Set(list); queue.forEach(process); queue = [];
  }).catch(function () { SLUGS = new Set(); queue.forEach(process); queue = []; });

  var css = document.createElement('style');
  css.textContent =
    '.cite-link{text-decoration:none;cursor:pointer}' +
    '.cite-link sup{color:#a88930;font-weight:700;font-size:.7em;padding:0 1px;border-bottom:1px dotted rgba(168,137,48,.6)}' +
    '.cite-link:hover sup{color:#7a6320;border-bottom-color:#a88930}';
  (document.head || document.documentElement).appendChild(css);

  var RE = /\[\[([a-z0-9][a-z0-9_-]*)#p(\d+)\]\]/g;

  function process(el) {
    if (!el) return;
    if (!SLUGS) { queue.push(el); return; }
    var counter = {}, next = 1;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) { RE.lastIndex = 0; if (RE.test(n.nodeValue)) nodes.push(n); }
    nodes.forEach(function (node) {
      var text = node.nodeValue; RE.lastIndex = 0;
      var m, last = 0, frag = document.createDocumentFragment(), touched = false;
      while ((m = RE.exec(text))) {
        touched = true;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        last = m.index + m[0].length;
        var slug = m[1], p = m[2];
        if (!SLUGS.has(slug)) continue;                 // unknown essay -> drop the tag entirely
        var key = slug + '#p' + p;
        if (!(key in counter)) counter[key] = next++;
        var a = document.createElement('a');
        a.className = 'cite-link'; a.href = '/library/' + slug + '.html#p' + p;
        a.target = '_blank'; a.rel = 'noopener'; a.title = 'Source: our ' + slug.replace(/[-_]/g, ' ') + ' essay';
        var sup = document.createElement('sup'); sup.textContent = '[' + counter[key] + ']';
        a.appendChild(sup); frag.appendChild(a);
      }
      if (touched) { if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
    });
  }

  window.ADCite = { process: process };
})();
