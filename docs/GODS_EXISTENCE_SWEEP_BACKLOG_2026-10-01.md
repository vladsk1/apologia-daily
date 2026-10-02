# God's Existence tab (ev-s1): deferred items from the 2026-10-01 over-charity + fact-check sweep

**Scope (phase 1 = essays, DONE 2026-10-01):** the 12 essays on the God's Existence tab —
kalam, leibniz, thomistic, finetuning, consciousness, reason, moral, evil, beauty, ontological, religious, desire —
plus the Macedonian and Spanish mirrors of kalam, finetuning, moral and evil.

**Rounds.** Round 1 ran three read-only Explore gates per group of three essays: a four-lens review, a live web
fact-check and a research-library cross-check with copy-edit and links. Fix scripts were written on scratch copies.
Round 2 was a confirmation gate, round 3 a narrow final gate, and every gate's wording was applied verbatim.
All 12 essays came out STAMPABLE on all four lenses with 0 HERESY. The 8 mirrors were synced and fidelity-checked
FAITHFUL with 0 heresy; they are AI-translated and still need a native-language review.

**Still to do on this tab:** phase 2 is the cards (`ev-s1.html` plus `.mk` and `.es`); phase 3 is the 12 `ev-m-*`
mastery pages. Every round-1 gate logged card-side contradictions for the cards round (for example: the
arg-finetuning "conceded across the board" wording; the arg-moral premise numbering; arg-religious overclaiming;
arg-reason "self-refutation"; arg-desire "every category of desire"; the arg-ontological free tier; the arg-leibniz
essence–existence grouping; arg-evil "is solved"; arg-beauty "reasonably land"; the arg-kalam Krauss/Carroll
promise; "Elliott Sober the atheist philosopher").

Nothing below is done. Each item needs its own gated pass (CLAUDE.md rule 9).

## Mirror gaps that existed before this sweep (not rebuilt; translate with fences intact)
- **mk/kalam:** about 70KB against 94KB for the English. Missing:
  - the evidence panel;
  - the Grim Reaper / Pruss–Koons / Benardete paragraph;
  - the Swinburne paragraph;
  - the Tolman and Wall additions;
  - the Aquinas/Maimonides paragraph and its fn 17;
  - the subsection "Then isn't God infinitely old?", which carries the timelessness-neutrality fence and the "Eternal, and not remote" orthonote;
  - the Quentin Smith sentence and the Hackett/Hick lines;
  - the FAQ and its FAQPage.

  The deism orthonote was added in this sync.
- **mk/moral:** missing the Lewis "crooked line" and Denhollander paragraph, the Nietzsche/is-ought firewall section,
  the Plantinga footnote, the FAQ and FAQPage, and six bibliography entries. "Морисон" should probably be spelled "Мористон".
- **mk/finetuning:** missing the Hossenfelder passage and its footnote (it must carry its symmetry disclosure), the
  FAQ and FAQPage, and the evidence panel. Its Article JSON-LD is still in English. The spellings "Мекгру" and "Мекгроувите" are inconsistent.
- **mk/evil:** missing the FAQ and FAQPage.
- **es/*:** missing the evidence panels and several reader scripts. es/moral links the English evil essay although a Spanish one exists.
  es/finetuning says "herida técnica" where the English says "unfinished business".

## Optional improvements (gates' BACKLOG, by priority)
- **P1, evil:** add a body paragraph with a reply on Draper's Hypothesis of Indifference ("Pain and Pleasure", 1989). After the
  round-1 correction it is cited only in a footnote.
- **P2, kalam:** the A-theory vs B-theory of time objection; the Krauss "universe from nothing" objection with Albert's reply.
- **P2, moral:** Mackie's argument from queerness.
- **P2, leibniz:** the objection that the explanation could be abstract objects or several necessary beings.
- **P2, thomistic:** Oppy's "single first member" (uniqueness) prong; the hammers line from *ST* I q.46 a.2 ad 7.
- **P2, consciousness:** the strongest physicalist reply (a-posteriori physicalism, the phenomenal-concept strategy); intentionality and zombies, which are on the card but missing from the essay.
- **P2, reason:** teleosemantics (Millikan/Papineau) stated at full strength.
- **P2, religious:** Martin's "negative principle of credulity"; name Gale and Fales as cross-checkability critics.
- **P2, desire:** add Wielenberg (*God and the Reach of Reason*, 2008) as a named critic.
- **P3/P4:** the Hilbert's Hotel pages in Craig & Sinclair (the citation currently shows the full chapter range 101–201); the Kreeft *Handbook* pages (dropped as unverified);
  Plantinga's *Logos* 1991 citation; Sobel on modal collapse; the SEP "Religious Experience" and "Moral Arguments" links; bibliography
  entries for Collins 1999, Penrose, Chalmers 2016, Adams, Oppy 2000, Latta 1898, Feser 2012 and WJE vol. 6; Hossenfelder *Lost in Math*
  as a beauty footnote; "a deflationary reply worth taking seriously" (beauty); the deism-gap duplicate link in leibniz.

## Research-library ledgers
Corrected in the same commit: `docs/book-research/INDEX.md`, `is-god-real.md`, `return-of-the-god-hypothesis.md`,
`on-guard.md`, and `docs/content-backlog.md` rows 214, 289 and 304. Still open: the Meyer list on
`return-of-the-god-hypothesis.md` line 16 also wrongly lists kalam, finetuning, privileged and moral, where the only "Meyer" is inside the
review stamp, and canon, whose hit is Marvin Meyer. Only originlife and cambrian actually cite Stephen Meyer.

## Cards phase (ev-s1.html + .mk/.es), 2026-10-02 — logged, not fixed (rule 9)

**Status.** All 12 cards were swept. Four gate rounds returned 0 HERESY. Both mirrors were rebuilt card by card from the
certified English, and their fidelity was gated FAITHFUL.

Open items:

- **Stale subtitles.** The old card subtitles are still live in `api/push.js` and `daily-args.json`:
  - "calibrated to extraordinary precision"
  - "cannot be explained by matter alone"
  - "we can't trust our own reasoning"

  These need replacing with the new certified subtitles. Gate them as content.
- **"Fair-minded" Morriston.** `library/kalam.html` still calls Morriston "a fair-minded and persistent critic". The
  card dropped "fair-minded"; the essay should match. The same applies to the MK mirror's "Морисон" spelling: the cards
  now use "Мористон".
- **Kalam timelessness tension.** In `library/kalam.html`, "From a cause to a Creator" says the cause "must be spaceless,
  timeless", but the fence says the Kalam "settles none" of the God-and-time question. The card mirrors this tension.
  Settle it essay-first.
- **Desire card.** The "surprised by Joy … found at last in the God of Christianity" line is loose. In the book, Joy
  loses its importance after conversion, and the theistic conversion (1929) came before the Christian one (1931). The
  Pascal, anthropology and Memorial sections have no essay underneath them.
- **Consciousness card.** "On atheism, consciousness is an accidental by-product" should say naturalism, not atheism.
- **Religious card.** The mystical-tradition section (Paul; the Teresa/John/Julian portraits; Aquinas as "great Christian
  mystic") has no essay underneath it.
- **Reason card.** The FAQ's "Churchland … evolution largely indifferent to truth" overreads her 1987 point. The Pro text
  "far exceed what survival requires" restates the retired abstract-reasoning reply.
- **Leibniz and Thomistic cards.** The Pro tier lacks the essay's Russell "just there" exchange, the taxicab objection,
  Hume/Kant, and the Third Way quantifier-shift note.
- **Ontological card.** The Gödel deep-dive section has no essay underneath it.
- **Evil card.** The free Q&A #2 line "The questioner already believes in objective moral reality" overclaims against the
  internal-critique questioner. The "defence"/"defense" spelling is mixed.
- **Hub AI-tutor demo.** The demo text on `evidence-library.html` says the universe's "constants are fine-tuned to a
  precision no human engineer could match" and is "infinitely more complex than any watch". That is unhedged, outside the
  certified fine-tuning wording, and ungated.
- **Orthonote box on mobile.** At phone width the "NOT SAYING" label pill clips slightly at the box's left edge. This
  affects every orthonote (shared CSS), not just the new one.
- **Native review.** Every Macedonian and Spanish card is still owed a native doctrinal gate. Translator-flagged terms
  for the native reviewer:
  - MK "интенционално внатрепостоење" (Brentano)
  - MK "ортодоксни" (chosen over "православни" for neutrality)
  - MK "Принцип на доверба" (Credulity)
  - ES "garantía" (warrant)
