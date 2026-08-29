/* ─────────────────────────────────────────────────────────────────────────────
   diagram.js — the Evidence Library's figure layer.

   THE GAP. At the time of writing the site carries ZERO diagrams, figures or
   images across 8 Evidence Library tabs and 92 deep-dive essays. The only <svg>
   in a tab is the accordion chevron, one per card. The writing is the site's
   strength; the presentation is an unbroken wall of text.

   ── THE THREE RULES THIS FILE EXISTS TO ENFORCE ─────────────────────────────

   1. NO RASTER IMAGES. Every figure is HTML + CSS. Text stays TEXT — selectable,
      searchable, translatable, and still present in `textContent`. Nobody can
      add an `orthonote` to a JPEG, no gate can read one, and a picture cannot be
      corrected without a redraw. A diagram here is a layout, not an image.

   2. THE WORDS ARE PORTED, NEVER AUTHORED. This file carries ZERO content
      strings by design — every word rendered comes from the host page, so the
      gates read the same strings in the same file they always have. This is the
      house rule that has held without exception across every gate round on
      record: ported sentences survive, authored ones become the next defect. A
      figure reveals structure the certified text already asserts; it adds no
      claim of its own.

   3. THE FIGURE IS ADDITIVE, NEVER A REPLACEMENT. `argExcerpt()` in
      evidence-library.html feeds a card's `textContent` to /api/tutor as the
      source of truth for what the reader is looking at (its own comment records
      the tutor inventing the HANDS framework when starved of it), and the essays
      send `.art-body` text the same way. A figure that REPLACED a paragraph
      would silently blind the tutor and strip the page for search. So figures
      render text nodes and sit alongside their prose, never instead of it.

   ── THE THREE TYPES, AND WHY ONLY THESE ─────────────────────────────────────

   Each type is affirmative: it draws OUR case. None of them draws the
   opponent's argument, and none of them is a place to summarise an objection —
   that work belongs in the prose, where it can be stated at length and in the
   strongest accurate form the essays already give it. A compressed box is the
   worst possible venue for someone else's position, because compression is
   exactly where a fair summary turns into a strawman.

     syllogism   — the premise/conclusion shape, ported from the card's own
                   "The argument" list. The chain the reader is being asked to
                   follow, shown as a chain.
     timeline    — dates already stated in the certified text. This answers the
                   single most common objection shape on the site ("written
                   decades later") by SHOWING the gap rather than asserting it —
                   the strongest possible form of the positive case.
     concessions — what named non-Christian and sceptical scholars GRANT, in
                   their own cited words. One column, all of it favourable. This
                   is the hostile-witness argument, which is the most persuasive
                   affirmative evidence the site has, and it is not a strawman by
                   construction: it quotes what a critic concedes rather than
                   characterising what a critic argues.

   ⚠ `scope` ON A SYLLOGISM IS NOT AN OBJECTION AND MUST NOT BE DROPPED WHERE THE
   ESSAY HAS ONE. It is the essay's own sentence bounding its own conclusion —
   the Kalam reaching "a transcendent cause, not yet the triune God of the Nicene
   Creed"; fine-tuning conceding the DATA while DESIGN stays the inferred step;
   manuscripts proving preservation and not truth. These are guardrails in
   CLAUDE.md, they are stated in our voice, and a figure that shows the chain
   while dropping the scope line would make the picture claim more than the
   paragraph beneath it. That is how a confident reader gets ambushed later, and
   this project's mission section is explicit that confidence must be EARNED.
   Include it wherever the source paragraph has one; omit it only when it genuinely
   has none.

   ⚠⚠ A HARVESTED FIELD CANNOT HOST AN `orthonote` ＊ — established by the
   orthodoxy gate on the first live figure (Kalam, 2026-08-29). `fromList` and
   `scope` read their text with `.textContent`, which FLATTENS an ＊ clarifier:
   the "Is saying / Not saying" box would be dragged into the sentence as inline
   garbage. So a figure is a NON-INTERACTIVE FORMAT in exactly the sense
   CLAUDE.md's clarifier standard means, and a clarifier candidate here routes to
   a WORDING fix — port the ＊'s own "Is saying" / "Not saying" rows into the
   prose as plain sentences — never to an ＊ inside the figure.
     The same gate round showed why this matters. Porting a fenced sentence
   without its fence leaves a box that is net-negative: the first cut carried
   "not yet the triune God of the Nicene Creed, nor even a morally good or
   worship-worthy being" under a heading promising "what this DOES and does not
   show", with no "does" content at all. Both lenses converged on it
   independently. When porting into a figure, carry the POSITIVE half of the
   source passage too, and check the heading's promise is actually met.

   🔴 NO TRINITY DIAGRAM, ON ANY PAGE. OWNER RULING, 2026-08-29 — a blanket
   prohibition, not a quality bar to clear, and not reopenable by a future
   session on its own initiative. Only the owner can lift it. Do not add a
   Trinity type to this file, and do not build one anywhere else either: essay,
   tab card, mastery page, pocket card, flashcard, reel, X card, share-card PNG
   or app screen. The standing rule lives in CLAUDE.md; this is its enforcement
   point in code.
     Why: every popular attempt teaches a heresy the moment doctrine is
   compressed into shapes — Venn circles and the shield read as partialism, the
   clover and water/ice/steam as modalism, three figures as tritheism. Even the
   historic Scutum Fidei asserts identity and distinction across six labelled
   edges. And a picture is the worst possible carrier for a correction: no
   orthonote ＊ attaches to it, no gate reads it, check-retired-claims and
   check-orthodoxy-tripwires are blind to it, and a screenshot cannot be
   recalled. CLAUDE.md records this same compression failure in text form
   repeatedly; a diagram is that failure with the safety net removed.
     Scope: this bans depicting the Trinity itself — the relations of the
   persons. A timeline of Nicaea's date, or a concessions figure, on a page that
   discusses the Trinity is fine, so long as it does not depict the divine
   persons or their relations.

   ── USAGE ───────────────────────────────────────────────────────────────────

     <div class="ad-fig" data-fig='{"type":"syllogism", ...}'></div>
     <script src="/library/diagram.js" defer></script>

   or programmatically: ADDiagram.render(el, spec).

   The Evidence Library tabs are injected with innerHTML and scripts inside
   injected HTML never execute, so a fragment cannot carry the include itself —
   the hub calls ADDiagram.auto(container) after each section loads.
   ───────────────────────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var CSS = [
    '.ad-fig{margin:1.6rem 0;font-family:var(--ui,"DM Sans",sans-serif);}',
    '.ad-fig *{box-sizing:border-box;}',
    '.ad-fig figure{margin:0;border:1px solid var(--b,#d4e0ec);border-radius:7px;background:#fff;overflow:hidden;}',
    '.ad-fig .adf-head{padding:.75rem 1.05rem;border-bottom:1px solid var(--b,#d4e0ec);background:var(--n4,#f0f6fb);}',
    '.ad-fig .adf-kicker{font-size:.61rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--mu,#7a8fa8);}',
    '.ad-fig .adf-title{font-family:var(--fd,"Playfair Display",Georgia,serif);font-size:1rem;font-weight:700;color:var(--n,#0a1628);margin-top:3px;line-height:1.35;}',
    '.ad-fig .adf-body{padding:1.15rem 1.05rem;}',
    '.ad-fig figcaption{padding:.7rem 1.05rem;border-top:1px solid var(--b,#d4e0ec);font-size:.72rem;line-height:1.6;color:var(--mu,#7a8fa8);}',
    '.ad-fig figcaption b{color:var(--m,#3a4a62);font-weight:600;}',

    /* syllogism */
    '.adf-prem{display:flex;gap:.8rem;align-items:flex-start;padding:.72rem .9rem;border:1px solid var(--b,#d4e0ec);border-radius:5px;background:var(--o,#f8f7f4);}',
    '.adf-tag{flex:0 0 auto;font-size:.65rem;font-weight:700;letter-spacing:.05em;color:#fff;background:var(--n3,#1e4278);border-radius:3px;padding:3px 7px;margin-top:2px;min-width:2.15rem;text-align:center;}',
    '.adf-txt{font-family:var(--bo,"Source Serif 4",Georgia,serif);font-size:.92rem;line-height:1.6;color:var(--m,#3a4a62);}',
    '.adf-join{height:19px;display:flex;align-items:center;padding-left:1.6rem;}',
    '.adf-join svg{width:12px;height:19px;stroke:#aecae8;stroke-width:2;fill:none;}',
    '.adf-concl{border-color:var(--g,#c8a951);background:rgba(200,169,81,.1);}',
    '.adf-concl .adf-tag{background:var(--g,#c8a951);color:var(--n,#0a1628);}',
    '.adf-concl .adf-txt{color:var(--n,#0a1628);font-weight:500;}',
    '.adf-scope{margin-top:.8rem;padding:.62rem .9rem;border-left:3px solid var(--mu,#7a8fa8);background:var(--n4,#f0f6fb);font-size:.82rem;line-height:1.62;color:var(--m,#3a4a62);border-radius:0 4px 4px 0;}',
    '.adf-scope b{display:block;font-family:var(--ui,sans-serif);font-size:.6rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:var(--mu,#7a8fa8);margin-bottom:.28rem;}',

    /* timeline */
    '.adf-tl-track{position:relative;height:3px;background:var(--b,#d4e0ec);border-radius:2px;margin:1.9rem .6rem .2rem;}',
    '.adf-tl-span{position:absolute;top:0;height:3px;background:var(--g,#c8a951);border-radius:2px;}',
    '.adf-tl-ev{position:absolute;top:-5px;transform:translateX(-50%);}',
    /* the outer ring is the host background, so genuinely clustered events read
       as a cluster rather than as one smudged blob — and the clustering IS the
       point on a timeline like the creed's */
    '.adf-tl-dot{width:10px;height:10px;border-radius:50%;background:#fff;border:3px solid var(--n3,#1e4278);box-shadow:0 0 0 2px var(--adf-ground,#fff);}',
    '.adf-tl-ev.is-key .adf-tl-dot{border-color:var(--g,#c8a951);}',
    /* a fading tail: the timeline continues past the last dated point */
    '.adf-tl-open{position:absolute;right:0;top:0;height:3px;width:22%;border-radius:2px;background:linear-gradient(90deg,var(--b,#d4e0ec),transparent);}',
    '.adf-tl-list{margin:1.35rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem;}',
    '.adf-tl-li{display:flex;gap:.8rem;align-items:baseline;line-height:1.55;}',
    '.adf-tl-when{flex:0 0 6.4rem;font-weight:600;color:var(--n3,#1e4278);font-size:.78rem;}',
    '.adf-tl-li.is-key .adf-tl-when{color:#8a6d1f;}',
    '.adf-tl-what{font-family:var(--bo,"Source Serif 4",Georgia,serif);font-size:.88rem;color:var(--m,#3a4a62);}',
    '.adf-tl-gap{margin-top:1rem;padding:.62rem .9rem;border-radius:4px;background:rgba(200,169,81,.11);border:1px solid rgba(200,169,81,.34);font-size:.83rem;color:#6f560f;line-height:1.6;}',

    /* concessions */
    '.adf-con{display:grid;gap:.7rem;}',
    '.adf-item{border:1px solid #b9e3d5;background:var(--gr2,#e1f5ee);border-radius:5px;padding:.75rem .9rem;}',
    '.adf-who{font-size:.79rem;font-weight:700;color:var(--gr,#0f6e56);margin-bottom:.3rem;}',
    '.adf-who span{display:block;font-weight:400;font-size:.72rem;color:#3f7d6c;margin-top:1px;}',
    '.adf-grants{font-family:var(--bo,"Source Serif 4",Georgia,serif);font-size:.89rem;line-height:1.6;color:#0d4b3c;}',
    '.adf-cite{margin-top:.35rem;font-size:.7rem;line-height:1.5;color:#4a7f70;}',
    '.adf-con-note{margin-top:.25rem;padding:.62rem .9rem;background:var(--n4,#f0f6fb);border-left:3px solid var(--n3,#1e4278);border-radius:0 4px 4px 0;font-size:.82rem;line-height:1.62;color:var(--m,#3a4a62);}',

    '@media(max-width:640px){.adf-tl-li{flex-direction:column;gap:.1rem;}.adf-tl-when{flex:none;}}',

    /* dark host: the .pro tier and the hub's navy panels */
    '.pro .ad-fig figure{background:rgba(255,255,255,.04);border-color:rgba(200,169,81,.25);}',
    '.pro .ad-fig .adf-head{background:rgba(255,255,255,.05);border-color:rgba(200,169,81,.2);}',
    '.pro .ad-fig .adf-title{color:#fff;}',
    '.pro .ad-fig .adf-txt,.pro .ad-fig .adf-tl-what{color:rgba(255,255,255,.76);}',
    '.pro .ad-fig .adf-prem{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.13);}',
    '.pro .ad-fig .adf-concl{background:rgba(200,169,81,.13);border-color:rgba(200,169,81,.45);}',
    '.pro .ad-fig .adf-concl .adf-txt{color:#fff;}',
    '.pro .ad-fig .adf-scope,.pro .ad-fig .adf-con-note{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);}',
    '.pro .ad-fig .adf-tl-when{color:var(--g,#c8a951);}',
    '.pro .ad-fig{--adf-ground:#0f2040;}',
    '.pro .ad-fig .adf-tl-track{background:rgba(255,255,255,.16);}',
    '.pro .ad-fig .adf-tl-open{background:linear-gradient(90deg,rgba(255,255,255,.16),transparent);}',
    '.pro .ad-fig figcaption{color:rgba(255,255,255,.45);border-color:rgba(255,255,255,.1);}',
    '.pro .ad-fig figcaption b{color:rgba(255,255,255,.7);}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('ad-fig-css')) return;
    var s = document.createElement('style');
    s.id = 'ad-fig-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Every string reaching the DOM goes through this. The specs are authored by
     us, but escaping is not optional: pocket-cards.html shipped an injection
     sink of exactly this shape — an interpolated value rendered as HTML — and it
     was closed by adding an escaper. Same discipline here. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function frame(spec, inner) {
    var head = (spec.kicker || spec.title)
      ? '<div class="adf-head">' +
        (spec.kicker ? '<div class="adf-kicker">' + esc(spec.kicker) + '</div>' : '') +
        (spec.title ? '<div class="adf-title">' + esc(spec.title) + '</div>' : '') +
        '</div>'
      : '';
    /* The caption is provenance, not decoration: it names the certified
       paragraph these words were ported from, so a reviewer can find the source
       sentence without leaving the page. */
    var cap = spec.source
      ? '<figcaption><b>Ported from:</b> ' + esc(spec.source) + '</figcaption>'
      : '';
    return '<figure>' + head + '<div class="adf-body">' + inner + '</div>' + cap + '</figure>';
  }

  var ARROW = '<svg viewBox="0 0 12 19" aria-hidden="true"><path d="M6 1v12"/><path d="M2 10l4 4 4-4"/></svg>';

  var TYPES = {

    /* spec.premises[]  — ported verbatim from the card's own "The argument" list
       spec.conclusion  — the same list's final line
       spec.scope       — the essay's OWN bounding sentence. See the warning at
                          the top of this file: this is our claim about our own
                          conclusion, not an objection, and dropping it makes the
                          figure claim more than the prose it sits beside. */
    syllogism: function (spec, el) {
      /* PREFERRED MODE — `fromList`: harvest the premises from an <ol> the host
         page already prints, instead of repeating them in the data attribute.
         Doing it the other way round would put the same three doctrinal
         sentences in two places in one file, and this repo's whole history is
         fixes that landed on one surface and not its twin. Here the <ol> stays
         the single source of truth: the gates read exactly the markup they
         always have, an editor has one place to change, and if this script never
         runs the reader still sees the ordered list. `scope` is harvested the
         same way, from a contained .fig-scope element. */
      if (spec.fromList && el) {
        var lis = el.querySelectorAll('ol > li, ul > li');
        var got = [];
        for (var k = 0; k < lis.length; k++) got.push(lis[k].textContent.trim());
        if (got.length) {
          spec = Object.assign({}, spec);
          spec.premises = spec.conclusionIsLast ? got.slice(0, -1) : got;
          if (spec.conclusionIsLast) spec.conclusion = got[got.length - 1];
        }
        var sc = el.querySelector('.fig-scope');
        if (sc && !spec.scope) spec.scope = sc.textContent.trim();
      }
      var out = '';
      (spec.premises || []).forEach(function (p, i) {
        if (i) out += '<div class="adf-join">' + ARROW + '</div>';
        out += '<div class="adf-prem"><span class="adf-tag">P' + (i + 1) + '</span>' +
               '<span class="adf-txt">' + esc(p) + '</span></div>';
      });
      if (spec.conclusion) {
        out += '<div class="adf-join">' + ARROW + '</div>' +
               '<div class="adf-prem adf-concl"><span class="adf-tag">&there4;</span>' +
               '<span class="adf-txt">' + esc(spec.conclusion) + '</span></div>';
      }
      if (spec.scope) {
        out += '<div class="adf-scope"><b>' + esc(spec.scopeLabel || 'What this does and does not show') +
               '</b>' + esc(spec.scope) + '</div>';
      }
      return frame(spec, out);
    },

    /* spec.events[] — { at, when, what, key }
         at   — a number used ONLY to place the dot on the axis. OMIT IT to keep
                the event in the list but off the axis (see the warning below).
         when — the label exactly as the certified text words it ("c. AD 30-33").
                Never derived from `at`: a figure must not silently harden
                "around 30" into "30".
       spec.span {from,to} — the stretch to highlight
       spec.gap            — the sentence the gap is there to make visible

       ⚠ AN AXIS POSITION IS A CLAIM, AND IT IS THE EASIEST ONE TO MAKE BY
       ACCIDENT. Placing a dot commits the figure to a date. Where the certified
       essay deliberately declines to give one — earlycreed.html says only that
       "the Gospels were all written later", and an authored "c. AD 65-95" on
       exactly that point was caught and removed by the citations gate — the
       event must be listed WITHOUT an `at`, so the prose stays open-ended and
       the picture does not quietly settle a dating question the essay left open.
       A number invented to make a layout work is still an authored claim. */
    timeline: function (spec) {
      var ev = (spec.events || []).slice();
      if (!ev.length) return '';
      /* Only events carrying an `at` are placed; the rest keep their order and
         appear in the list alone. */
      var placed = ev.filter(function (e) { return typeof e.at === 'number'; })
                     .sort(function (a, b) { return a.at - b.at; });

      var track = '';
      if (placed.length) {
        var lo = spec.min != null ? spec.min : placed[0].at;
        var hi = spec.max != null ? spec.max : placed[placed.length - 1].at;
        var range = (hi - lo) || 1;
        var pos = function (v) { return ((v - lo) / range) * 100; };

        track = '<div class="adf-tl-track" aria-hidden="true">';
        if (spec.span) {
          track += '<div class="adf-tl-span" style="left:' + pos(spec.span.from).toFixed(2) +
                   '%;width:' + (pos(spec.span.to) - pos(spec.span.from)).toFixed(2) + '%"></div>';
        }
        placed.forEach(function (e) {
          track += '<div class="adf-tl-ev' + (e.key ? ' is-key' : '') +
                   '" style="left:' + pos(e.at).toFixed(2) + '%"><div class="adf-tl-dot"></div></div>';
        });
        /* an open end, for a timeline whose last events are deliberately undated */
        if (placed.length < ev.length) track += '<div class="adf-tl-open"></div>';
        track += '</div>';
      }

      /* The axis is decoration and is hidden from assistive tech; THIS list is
         the figure. It stays in the DOM as text for the tutor, for search and
         for screen readers. */
      var list = '<ul class="adf-tl-list">';
      ev.forEach(function (e) {
        list += '<li class="adf-tl-li' + (e.key ? ' is-key' : '') + '">' +
                '<span class="adf-tl-when">' + esc(e.when) + '</span>' +
                '<span class="adf-tl-what">' + esc(e.what) + '</span></li>';
      });
      list += '</ul>';

      return frame(spec, track + list +
        (spec.gap ? '<div class="adf-tl-gap">' + esc(spec.gap) + '</div>' : ''));
    },

    /* spec.items[] — { who, credentials, grants, cite }
         who         — the scholar, named, so the claim is checkable
         credentials — why their concession carries weight (an agnostic NT
                       scholar, a co-founder of the Jesus Seminar). Not a slur
                       and not a label they would reject: ported from the essay.
         grants      — WHAT THEY CONCEDE, in the essay's certified wording.
       spec.note     — the essay's framing line.
       This type never states what a critic ARGUES, only what a critic GRANTS. */
    concessions: function (spec) {
      var out = '<div class="adf-con">';
      (spec.items || []).forEach(function (it) {
        out += '<div class="adf-item"><div class="adf-who">' + esc(it.who) +
               (it.credentials ? '<span>' + esc(it.credentials) + '</span>' : '') + '</div>' +
               '<div class="adf-grants">' + esc(it.grants) + '</div>' +
               (it.cite ? '<div class="adf-cite">' + esc(it.cite) + '</div>' : '') + '</div>';
      });
      out += '</div>';
      if (spec.note) out += '<div class="adf-con-note">' + esc(spec.note) + '</div>';
      return frame(spec, out);
    }
  };

  function render(el, spec) {
    injectCSS();
    var fn = TYPES[spec && spec.type];
    if (!fn) return false;
    /* Build first, assign second: `fromList` reads markup out of `el`, so
       overwriting innerHTML before the html string exists would destroy the very
       list it harvests. It also means a throw mid-build leaves the fallback
       markup on the page untouched. */
    var html = fn(spec, el);
    if (!html) return false;
    el.classList.add('ad-fig');
    el.innerHTML = html;
    return true;
  }

  function auto(root) {
    var nodes = (root || document).querySelectorAll('.ad-fig[data-fig]');
    var n = 0;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute('data-fig-done')) continue;
      try {
        if (render(el, JSON.parse(el.getAttribute('data-fig')))) {
          el.setAttribute('data-fig-done', '1');
          n++;
        }
      } catch (e) {
        /* A malformed spec must leave the page exactly as it was. Tabs are
           injected by fetch(); a throw here would kill whatever ran after it. */
        if (global.console) console.warn('[ad-fig] bad spec', e);
      }
    }
    return n;
  }

  global.ADDiagram = { render: render, auto: auto, types: Object.keys(TYPES) };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { auto(); });
  } else {
    auto();
  }
})(window);
