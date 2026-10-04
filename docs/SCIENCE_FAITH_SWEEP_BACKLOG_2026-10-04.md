# Science & Faith sweep — logged, not fixed (2026-10-04)

Owner-directed over-charity + live fact-check sweep of the Science & Faith tab (ev-s5).

- Essays went live in commit 7da9efd1.
- The 8 cards and their MK/ES mirrors went live in the commit that adds this file.

Everything below was surfaced by the gates and deliberately **not** fixed in this pass (rule 9: freeze the scope of a fix pass). Mastery pages (ev-m-*) are the next phase.

## ✅ BACKLOG PASS 2026-10-04 — what was done, and what is left

The owner's rule is to fix a tab's logged issues before the next tab, except low-priority missing-objection items.

**Done.** The WORDING / ACCURACY items below are fixed and gated: four lenses, 0 heresy, confirmation rounds. They cover:
- all card items, the tab intro, and the MK/ES card mirrors (fidelity-gated);
- the essay citation and wording items;
- the mastery-page leftovers, with the counters now set to the 7-page Science & Faith track;
- the off-page twins: daily-args.json, api/push.js, pocket-cards (science), and the palace.html rooms (First Light, origin-of-life, mathematics, laws);
- the overclaim scorer cap, ported to ev-m-beauty and widened on ev-m-privileged;
- the Vilenkin colon twins: kalam, mk/kalam, who-said-it.

**✅ P2 essay ADDITIONS — DONE 2026-10-04** (each one drafted, gated through 3 rounds, 0 heresy):
- bigbang: cyclic/bounce models (Steinhardt–Turok, Ijjas–Steinhardt, Kinney–Stein, Pavlović–Sossich)
- cosmic: inflation and the low-entropy beginning (Guth; Carroll; Schiffrin–Wald; Penrose cited via Carroll)
- originlife: Keefe & Szostak 2001
- mathematics: Derek Abbott 2013
- privileged: the 2024 edition (from the website description only)
- miracles: Augustine, *City of God* XXI.8

**✅ Axe 10^77 RESCOPE — DONE 2026-10-04, site-wide.** The 10^77 figure is Axe's EXTRAPOLATION to "sequences performing a specific function by any domain-sized fold". His β-lactamase domain gave about 1 in 10^64. Earlier wording called it the rarity "for the enzyme domain he studied", and this sweep had itself propagated that error. Fixed on:
- the essays: originlife, cambrian
- ev-s5 + MK/ES (including the 10^106 arithmetic sentence, which had understated its own result by ~29 orders of magnitude)
- ev-m-cambrian, ev-m-originlife
- daily-args.json
- speed-round.html (quiz stem)
- scholars.html: its "quotation" from Axe was not found in any source, so it was replaced with a marked summary of the abstract

**New open items from this pass:**
- **Sibling surfaces now lag the new essay sections:**
  - ev-s5 card item (4) and ev-m-bigbang:419: the cyclic reply has no dilution answer and no Kinney–Stein / Pavlović–Sossich dispute
  - ev-m-cosmic: no inflation objection
  - ev-m-originlife: no Keefe & Szostak
  - ev-m-mathematics: no Abbott base-rate concession
  - ev-s5 mathematics card (~l.379): "not chosen by trial and error" is contested by Abbott
- **/sources:** add `augustine-civ-21-8` (Dods, NPNF1 vol. 2; now verified verbatim), then rebuild.
- **scholars.html Axe bio:** "Director of Biologic Institute" may be outdated (he is now at Biola), and "MRC Centre" should read "MRC Centre for Protein Engineering". Unverified, so not changed.
- **ev-m-privileged and ev-m-beauty:** the overclaim-cap regex was widened. Other pages that carry a 'proves' guard still use the older form.
- **Book checks:** McMullin page (bigbang fn 27); Leslie pp. 13–14 and the "fifty" marksmen (cosmic); Penrose *Road to Reality* §§28.6–28.7 locus (cosmic).
- **Owner decisions:**
  - laws "a gift … has a giver" (essay l.214; ev-s5 l.411/478/1102);
  - re-base the cosmic card's Conway Morris / Rare Earth / Polkinghorne sections on the essay;
  - rename "Cosmic Purposiveness" site-wide;
  - the essay laws meta "governed by … laws";
  - build ev-m-miracles?;
  - the pocket bigbang "what Genesis 1:1 always implied".
- **Other tabs / corpus:**
  - "flagged above" (actually below) and "Each gets its best form first" on ~58 other ev-m pages;
  - the counters on s1/s4/s8;
  - scholars.html:983 Axe unscoped;
  - the remaining daily-args science twins (mathematics p2, privileged eclipses/p2, cosmic evidence);
  - the palace Window and Equations rooms;
  - the ev-s5 originlife "10^106 trials … a reasonable chance" understatement;
  - tools/check-footnote-integrity.mjs and tools/build-objections.mjs are inert/broken on Windows paths;
  - objections.json is stale site-wide.
- **Correction:** the Penzias do-not-use flag lives in docs/book-research/return-of-the-god-hypothesis.md (F17), not INDEX.md.

## Essays

### bigbang
- **P2:** answer Steinhardt–Turok's reply to Tolman and Ijjas–Steinhardt (2019).
- **P3:**
  - Aron Wall's 2013 GSL singularity theorem.
  - McMullin page number.
  - Lesnefsky et al. is missing from the bibliography.
  - Vilenkin p.176 punctuation (essay "There is no escape," vs card colon).
  - Krauss steelman could add "the laws of quantum gravity are still something".

### cosmic
- **P2:** inflation as an explanation of the smooth beginning, with Penrose's reply.
- **P3:**
  - Leslie pp. 13–14, Davies p. 232 and the Carroll 2012 attribution are unverified.
  - The Penrose anti-anthropic point has no chapter locus.
- The card's Conway Morris / Rare Earth / Polkinghorne material has no counterpart in the essay. Either re-base the card or add an essay section.

### originlife
- **P2:** Keefe & Szostak 2001 as the peer-reviewed "numbers are wrong" critic.
- **P3:** update the progress paragraph past 2009 (Sutherland 2015, Joyce lab 2024).
- **P4:**
  - fn 20 self-citation.
  - de Duve p.437 wording against the American Scientist PDF.
  - "the only uncontested known source is a mind".

### cambrian
- **P3:** the genomic toolkit predates the Cambrian (choanoflagellate and sponge genomes).
- **P3:** Christians (Coulson, evolutionary creationists) press the god-of-the-gaps objection too; port the clause from originlife.
- **P3:** "facts that essentially everyone agrees on" → "the facts the relevant science agrees on".
- **P4:** Müller 2017 and the Prothero review are missing from the bibliography.

### mathematics
- **P2:** a named living selection critic (Abbott 2013, Hossenfelder 2018).
- **P3:** Field's conservativeness answer at full strength.
- **P4:** "four camps" taxonomy; Pais locus.

### laws
- **P3:**
  - the map lacks dispositional essentialism and primitivism;
  - the Brooke/Harrison pairing;
  - give the 2020 PhilPapers figure a full citation once it is reachable.
- **P4:**
  - "faithful God … faithful cosmos" overreach;
  - gift → Giver equivocation (owner's call).

### privileged
- **P2:** engage the 2024 20th-anniversary edition.
- **P3:**
  - the Jupiter-shield and Moon-stabilisation claims are disputed (Horner & Jones; Lissauer et al.);
  - propagate the fixes to the pocket card.

### miracles
- **P2:** Augustine, City of God 21.8 ("not contrary to nature, but to what is known of nature").
- **P3:** ev-m-miracles.html still does not exist.

## Cards (ev-s5.html)

### bigbang
- "closed system, entropy always increases" → "isolated … never decreases".
- The "With the proof now in place…" quote appears twice.
- "the smartest people in the room believed…" overgeneralises.

### cosmic
- Duplicated "Ward and Brownlee draw no theistic conclusion".
- Verdict "far more at home" is stronger than "a real tilt of the scales".
- The Move 2 Hamming reply.

### originlife
- "search a space of 10^77" is loose (it is a ratio).
- "serious, careful, brilliant work" was kept by the gate.

### cambrian
- The Conway Morris paraphrase is not in the essay.
- The own-voice heading "Not evidence against evolution."
- An own-voice clause sits between Meyer-attributed clauses.

### mathematics
- Mendel and Lemaître are listed as "founders".
- "Lemaitre" is missing its accent.
- Lennox → "mathematician".
- "a precision that exceeds any other form of human knowledge".
- Complex numbers had 19th-c. physics uses.
- "they should" in the Case Plainly close.

### laws
- The Case Plainly tier lacks the deism fence and resurrection pointer.
- The subtitle "rational Lawgiver" leans on the "law" pun; there are twins in api/push.js and daily-args.json.
- "developed for purely formal reasons".
- Premise 2 "not physical" is stated flatly.

### privileged
- Case Plainly states the Moon claim in our own voice.
- "perfectly covers" (essay: "almost exactly").
- The free tier has no deism fence.
- No resurrection link.
- The temporary-eclipse objection is absent, as are the Smithsonian and Copernican objections.

### miracles
- "In conversation" misdescribes a probabilistic Humean.
- "secular philosopher" vs "secular philosopher of science" is inconsistent.
- No resurrection links.
- The free tier never states Part II.

### Tab intro
- The ev-s5 intro line "Some of the strongest evidence for God comes from science itself … all point toward a Creator" sits near "science proves God". It needs its own gate.

## Off-card twins still carrying old wording

- **daily-args.json:**
  - unhedged Crick "appears almost a miracle";
  - unscoped Axe 1-in-10^77;
  - the laws "Lawgiver" subtitle.
- **api/push.js:** subtitle twins.
- **Pocket cards** for the science category: not checked.

## Translations (MK/ES)

All 16 cards are AI-translated; the native doctrinal gate is pending, as everywhere.

Macedonian style inconsistencies that do not change meaning:
- ти/вие address;
- "Move N" rendered three ways;
- "brute" rendered as суров/гол;
- Мајер/Мејер and Акс/Екс spellings.

## Mastery pages (ev-m-*.html) — swept 2026-10-04

All 7 are re-gated and stamped. ev-m-cosmic was re-based on its essay, and the other six were edited. The items below were logged and not fixed (rule 9).

### Off-page twins still carrying retired wording
- **palace.html, Memory-Palace rooms:**
  - originlife room (~l.396): "Chemistry alone never writes language" and "only ever traces back to a mind" (overclaim).
  - laws room (l.408–410): "imply a Lawgiver" and "signature of a Lawgiver" (retired pun).
  - "First Light" (bigbang) room: "flare into being from nothing" and "Cosmology points to an absolute beginning".
  - Each needs its own gate.
- **daily-args.json:**
  - bigbang: "Atheist cosmologist Alexander Vilenkin", "cannot be past-eternal", and the Penzias "five Books of Moses" quote (INDEX flags it as do-not-use).
  - cosmic: "many careful thinkers".
- **ev-s5.html #arg-laws headline:** "best explained by a rational Lawgiver" (the same pun as the subtitle twins already logged).
- **Rebuild** objections.json (`tools/build-objections.mjs`) and search-index.json after the mastery card changes, if they draw from the ev-m decks.

### Corpus boilerplate (all ev-m pages)
- The library counters disagree: "Argument N of 19" vs "1 of 22" vs "Twenty-one more".
- The drill prompt "State both premises, the conclusion, and what the cause must be like" is a kalam leftover on the design pages.
- "Each gets its best form first" and the "Strongest form" labels sit close to the retired `objections-never-a-strawman` wording. The swept pages now say "Each is stated as you will actually meet it, then answered", but many un-swept pages still carry the old line. Consider a retired-claims entry.
- **Scorer residue:** the "proves" overclaim cap added to ev-m-privileged should also go onto ev-m-beauty, which has the same gap.

### Per page
- **bigbang:**
  - chip "a beginning that demands a cause" → "asks for a cause";
  - the M8c reply's "it should be labeled as such" reads oddly in a reply.
- **cosmic:**
  - h1 and breadcrumb still read "Cosmic Purposiveness";
  - "the hardest objection of all is flagged above" (it is below);
  - Aristotle row "every purposiveness argument";
  - Wigner row "a fact begging explanation";
  - the discoverability port could add "a suggestive pattern, not a demonstrated correlation".
- **mathematics:**
  - meta/og "is what you'd expect if a mind made it" → "more at home";
  - Platonism reply's "owes an account of the bridge" → "sharpens rather than solves".
- **laws:**
  - Support-P2 "there's no reason a mindless cosmos should be ordered" overclaims (port: "There is no obvious reason a physical cosmos should be transparent to thought");
  - Support-P1 title and meta "governed by … laws" presuppose the governing view and lack "so far as we can measure";
  - Drill 3 has nested straight quotes;
  - check 4 includes `brute`, which check 2 also requires.
- **originlife:**
  - cards[3] could add "one strand of a convergent case".
- **cambrian:**
  - visible P1 vs ARG_PREMISES[0] wording differs;
  - conclusion "best explanation" vs the essay's "best current explanation";
  - the SEO summary says "sudden origin" (the chip now says "rapid");
  - the "Working biologists…" sentence sits after the resurrection pointer.
- **privileged:**
  - cards[4] "our clear vantage" → "comparatively";
  - the eyes/atmosphere caveat appears four times (trim);
  - the common-cause objection is missing (P3);
  - no Jefferys row in "Touch the originals".
