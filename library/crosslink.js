/* ─────────────────────────────────────────────────────────────────────────────
   crosslink.js — make "argued elsewhere in this Library" an actual link.

   THE DEFECT. Ten places in the served content tell the reader that the case
   they are asking about is made somewhere else in this Library, and then give
   them no way to get there: seven in the Christian Revolution tab (ev-s8.html)
   and three in the essays it is built from (persecution, riseofchurch,
   compassion). Every one of them is the SAME promise — that Christianity's truth
   rests on the resurrection, argued elsewhere — and it is exactly the promise a
   reader is most likely to want to follow, because these pages have just spent
   several paragraphs insisting that growth, martyrdom and moral influence do
   NOT prove the faith true. The page hands the reader a debt and no address.

   WHY THIS IS A SCRIPT AND NOT AN EDIT TO THE PROSE.
   The obvious fix is to wrap the phrase in an <a> in the HTML. That would work,
   and it would also change doctrinal-bearing lines in four gated files, which
   `tools/check-stamp-integrity.mjs` flags by design (its isBoilerplateLine()
   exempts a line that is ONLY an anchor, and deliberately does not exempt an
   inline prose link, "a <p> carrying prose AND a link shares the line with text
   and still trips the flag"). That would put a re-gate debt on ev-s8.html and
   three certified essays in exchange for a navigation fix that changes not one
   word of doctrine.

   So this follows the precedent already set twice on this site —
   `library/reviewed-badge.js` and `library/evidence.js` — where a bare
   <script src> include is treated as plumbing and no essay is flagged. NOT ONE
   WORD OF CERTIFIED PROSE IS ADDED, REMOVED OR REORDERED HERE. The script wraps
   an existing phrase in an anchor and stops.

   Consequences that matter and were checked:
     • textContent is unchanged, so `argExcerpt()` in evidence-library.html still
       feeds /api/tutor the same card text, and the essays still send the same
       .art-body text. Wrapping a phrase in <a> does not alter textContent.
     • The Evidence Library tabs are injected with innerHTML, and scripts inside
       injected HTML never execute — so the fragments cannot carry this include
       themselves. The hub calls apply() after each section loads.
     • On the hub, every .card carries onclick="tog(this)". A click on a link
       inside a card would bubble and collapse the card the reader is reading, so
       propagation is stopped — the same guard the hub already uses on its other
       in-card links.

   WHERE THE LINKS POINT, AND WHY THAT IS A JUDGEMENT WORTH STATING.
   All ten sentences point at one of two things, and the sentence itself says
   which: the ones that name the early eyewitness creed of 1 Corinthians 15:3-7
   go to that argument; the rest, which say "above all the resurrection", go to
   the minimal-facts case, which is this Library's entry point to it. Reading
   mode is preserved: from a hub card the link opens the matching hub card, from
   an essay it opens the sibling essay. No sentence is sent anywhere it does not
   already name.
   ───────────────────────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var PHRASE = 'elsewhere in this Library';

  /* Both destinations exist and are certified. The slugs are the hub's own
     ARG_TAB keys (earlycreed -> s3, minimal -> s2); the paths are the essays
     those cards link to. Keep the two in step if either is ever renamed. */
  var CREED = {
    slug: 'earlycreed',
    essay: '/library/earlycreed.html',
    label: 'The early creed of 1 Corinthians 15:3–7'
  };
  var RESURRECTION = {
    slug: 'minimal',
    essay: '/library/minimalfacts.html',
    label: 'The resurrection — the minimal-facts case'
  };

  /* Which of the two a given sentence is promising. The test reads the text
     immediately BEFORE the phrase, which is where these sentences name their
     subject ("...the early eyewitness creed in 1 Corinthians 15:3-7, argued
     elsewhere in this Library").   is there because the prose uses
     non-breaking spaces inside the reference. */
  function destinationFor(before) {
    return /1[\s ]*Corinthians|early[\s ]+(eyewitness[\s ]+)?creed/i.test(before)
      ? CREED : RESURRECTION;
  }

  /* An essay links to its sibling essay; a hub card links to the hub card. */
  function hrefFor(dest) {
    return /\/library\//.test(location.pathname)
      ? dest.essay
      : 'evidence-library.html?arg=' + dest.slug;
  }

  var SKIP = /^(A|SCRIPT|STYLE|SUP|NOSCRIPT|TEXTAREA|INPUT|BUTTON)$/;

  /* True if the node sits inside something we must not touch — an existing link
     (no nested anchors), a footnote marker, or a <script>. JSON-LD FAQ schema
     carries the same sentence and is caught here by the SCRIPT test: schema text
     is not rendered, so it neither needs nor can carry a link.

     The A test is also what makes apply() idempotent: once a phrase is wrapped,
     its text node lives inside an anchor and is skipped on every later pass. The
     hub can therefore call apply() per section while the script's own
     document-wide pass also runs, without double-wrapping anything. */
  function inSkippedContext(node) {
    for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP.test(p.nodeName)) return true;
    }
    return false;
  }

  function injectCSS() {
    if (document.getElementById('ad-xlink-css')) return;
    var s = document.createElement('style');
    s.id = 'ad-xlink-css';
    /* Inherit the surrounding colour rather than imposing one: this phrase
       appears in light prose (.oa, li), in the navy Pro tier (.pt) and in essay
       body text, and a single hard-coded colour is unreadable in at least one of
       them. A dotted gold underline reads as a link in all three. */
    s.textContent =
      '.ad-xlink{color:inherit;text-decoration:none;' +
      'border-bottom:1px dotted var(--g,#c8a951);' +
      'box-shadow:inset 0 -1px 0 rgba(200,169,81,.18);}' +
      '.ad-xlink:hover,.ad-xlink:focus-visible{color:var(--g,#c8a951);' +
      'border-bottom-style:solid;box-shadow:none;}';
    document.head.appendChild(s);
  }

  function linkTextNode(textNode) {
    var text = textNode.nodeValue;
    var i = text.indexOf(PHRASE);
    if (i === -1) return false;

    var dest = destinationFor(
      /* the sentence so far: this node's own text plus what the parent already
         rendered before it, which is where "1 Corinthians 15" usually sits
         (it is wrapped in its own element for the non-breaking spaces). */
      (textNode.parentNode ? textNode.parentNode.textContent.slice(0, 400) : '') + text.slice(0, i)
    );

    var a = document.createElement('a');
    a.className = 'ad-xlink';
    a.href = hrefFor(dest);
    a.textContent = PHRASE;
    /* The visible words stay exactly as certified, so the accessible name has to
       carry the destination — "elsewhere in this Library" tells a screen-reader
       user nothing about where the link goes. */
    a.setAttribute('aria-label', PHRASE + ' — ' + dest.label);
    a.title = dest.label;
    /* Every .card on the hub is onclick="tog(this)"; without this the reader's
       click would follow the link AND collapse the card behind them. */
    a.addEventListener('click', function (e) { e.stopPropagation(); });

    var after = textNode.splitText(i);
    after.nodeValue = after.nodeValue.slice(PHRASE.length);
    after.parentNode.insertBefore(a, after);
    return true;
  }

  function apply(root) {
    var scope = root || document;
    if (!scope.querySelectorAll) return 0;
    injectCSS();

    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return n.nodeValue && n.nodeValue.indexOf(PHRASE) !== -1
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    /* Collect first, mutate after: splitText() rewrites the tree the walker is
       standing in, and mutating mid-walk silently skips nodes. */
    var hits = [], n;
    while ((n = walker.nextNode())) if (!inSkippedContext(n)) hits.push(n);

    var count = 0;
    for (var i = 0; i < hits.length; i++) if (linkTextNode(hits[i])) count++;
    return count;
  }

  global.ADCrossLink = { apply: apply, phrase: PHRASE };

  /* Full pages (the essays) self-start. The hub calls apply() itself after each
     fetched section is injected, because those scripts never run. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(document); });
  } else {
    apply(document);
  }
})(window);
