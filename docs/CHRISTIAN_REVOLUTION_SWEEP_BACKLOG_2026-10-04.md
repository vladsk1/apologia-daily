# Christian Revolution sweep (ev-s8): logged, not fixed (2026-10-04)

This is an owner-directed sweep of the Christian Revolution tab, checking for over-charity and running a live fact-check. The seven essays were also cross-checked against Glen Scrivener's *The Air We Breathe* (owner request), using the research note docs/book-research/the-air-we-breathe.md.

The following went live in the commit that adds this file:
- `riseofchurch`, `persecution`, `equality`, `compassion`, `science-history`, `abolition` and `progress`, each with four lenses STAMPABLE and 0 heresy.

The cards (ev-s8 + MK/ES) and the mastery pages are the next phases.

## 🔴 P1: owner decision. Nowhere on the site gives a full account of the church's crimes
`legacy.html` was retired on 2026-09-30, and it was the only place that set out the full record: Crusades, Inquisition, antisemitism, colonial abuses. None of the seven current essays carries it.

Here is what each currently covers:
- **Abolition:** the church's complicity in slavery, without softening it.
- **Equality:** names slaveholding, caste, and turning on the Jewish people.
- **Science-history:** Galileo.

Several essays used to promise that "companion essays set them out in full". Those promises have been corrected, so they no longer claim it.

**Decision needed:** should this record have a certified home? The options are a new essay, or a section in an existing essay such as `progress` or `riseofchurch`.

## Book check: page numbers taken only from Scrivener's footnotes, NOT added
Scrivener's editions may be paginated differently from ours, so each needs checking against the edition our essay cites:
- **abolition:**
  - Stark, *Triumph*, 376 (fn1)
  - Hugh Thomas, *The Slave Trade*, 794 (fn6, England by c.1200)
  - Davis, *Slavery and Human Progress*, 139 (fn10)
  - Holland, *Dominion*, 307–8 (fn3)
  - Cone, *The Cross and the Lynching Tree*, 133–34 (fn16)
  - McLaughlin p. 190 (fn17). It was added on the strength of the note's verbatim record; confirm it.
- **progress:** Pinker, *Enlightenment Now*, 149 (swords), 215 ("Life is sacred"), and the page of the "mysterious arc" line.
- **riseofchurch:** Ehrman's AD 300 figure (ch. 6). Our sources variously say 2–3 or 2.5–3.5 million, and the essay now says "roughly 2.5–3".
- **compassion:**
  - The Himmler print locus in Noakes & Pridham (vol./page).
  - Hurtado, *Destroyer of the gods*, pages for the love-ethic claim.
- **equality:**
  - Siedentop, *Inventing the Individual*, p. 51: confirm whether the line reads "both ancient thinking and ancient society".
  - Harari, *Sapiens*, page for "the Americans got the idea of equality from Christianity".
- **persecution:** Van Nuffelen's page range was deleted as unverified (riseofchurch fn17). Restore it if JSTOR or Brill confirms it.

## Per-essay items (BACKLOG, P2–P4)
- **riseofchurch:**
  - The Ehrman figure in the body, fn5 and the FAQ is only "roughly" in parity.
  - fn18's Fragment citation sits under a "state power" heading.
- **persecution:**
  - Phileas of Thmuis (Eusebius, *HE* 8.10) as an eyewitness of the Great Persecution. This is also a `/sources` candidate.
  - fn14 and fn15 both give the full *Myth of Persecution* citation.
- **equality:**
  - Siedentop's medieval canon-law mechanism (p. 249; backlog row 290, re-targeted from legacy).
  - Name Parfit and Wielenberg, as compassion does.
  - Add a minimalfacts link in fn16.
- **compassion:**
  - Answer the ancient Near Eastern "widow and orphan" royal ideology (Hammurabi, *ma'at*) at full strength.
  - The *splanchnizomai* phrasing is awkward.
  - Holland's *Dominion* is now an orphan bibliography entry.
- **science-history:**
  - Brooke's "complexity thesis".
  - The 1992 papal acknowledgement; Galileo's tidal theory was wrong.
  - Melanchthon.
  - Jefferson's 1820 letter as an early voice of the warfare thesis.
  - Scrivener's point that the conflict myth is a secularised light-vs-priests story.
  - Bibliography gaps: Harrison 2002, Martinez, Foster, Oakley.
  - Soften "said so in the very books that made their names".
- **abolition:**
  - Institutional complicity on both sides (*Dum Diversas*/*Romanus Pontifex*; the Codrington plantations; the 1845 Southern Baptist split; Furman, Stringfellow and Thornwell).
  - Las Casas's early proposal, which he later repented.
  - Germantown 1688, Woolman, Benezet, *In Supremo* 1839.
  - Douglass's "image of God" line.
  - Davis, "a moral achievement that may have no parallel" (*Inhuman Bondage*, 331).
  - "climax of all misnomers" is a loose gloss.
- **progress:**
  - Maritain's "on condition that no one asks us why" (verify).
  - Augustine, *City of God* 12 on cyclical time.
  - Boethius on Fortune's wheel.
  - Pinker's "does justice roll on like a river?".
  - fn2 "always" → "typically".

## Twins on other surfaces: carry into the cards and mastery rounds
- **ev-s8.html:**
  - the Julian "poor who were not their own" (×2) and "took in the infants their neighbours exposed"
  - "disposed of in secret"
  - "her pregnant slave"
  - "indispensable pressure"
  - "slaveholding religion of this land" (×2)
  - "Victorian" (×3)
  - "still favoured the older astronomy"
  - "fine-tuning argument"
  - Matthew 25:40 wording
- **ev-m-science-history:** Harrison's "voluntarist thesis"; "Victorian"; "still favoured the older astronomy".
- **ev-m-persecution:** "her pregnant slave".
- **ev-m-compassion:** the Julian, infant-exposure and Matthew 25:40 wording.
- **ev-m-riseofchurch:** the Julian "ordered… fund", "done most" and "could not defeat" wording.

## Mastery pages (ev-m-*): DONE 2026-10-04, with these items logged, not fixed
All seven ev-m pages went live after one four-lens round and four confirmation rounds: all lenses STAMPABLE, 0 heresy.
The biggest finding was the mock scorer (`renderMockScore`, the offline fallback grader). On every page it gave full marks to overclaims such as "this proves Christianity true" and penalised the corrected bounded answer. Each page now carries a shared, node-tested overclaim guard (`OVER` / `OVERCLAIM`) that caps an overclaiming answer at 6/10. The scripts and tests are in the session scratchpad.
- **P3, model answers below 10 on the mock scorer:** science-history scores 8 (fails the Premise-2 check) and progress scores 6 (fails the Premise-2 and named-critic checks). Both are pre-existing: the model answer is a debate reply, not a full reconstruction.
- **P3, guard limits.** The guard is verb-first. It does not catch subject-first overclaims: "Christianity is proven true", "Clearly Christianity is true", "This makes Christianity true". The real grader is /api/tutor; the regex is only the fallback, so this is an incremental-hardening item, not a blocker.
- **P4, loose BOUNDNEG on equality/compassion.** A negation within 30 characters of "show"/"prove" earns bound credit. This predates the sweep.
- **P3, science-history formnote:** still says "and it stops there". The page was not reframed to "not a proof is not not-evidence", unlike equality and compassion.
- **P3, abolition:** in "Christians who were breaking it", "it" could point to the conviction or to the standard (P2, ARG_PREMISES[1], flashcard).
- **P3, riseofchurch:**
  - Flashcard 1 still says "the growth is attested by hostile witnesses", out of step with P1 and ARG_PREMISES.
  - The sources row calls Hopkins a "critique".
  - The ctaText reads "That's 1 of 22".
- **P3, persecution:** Galen is said to explain the courage "only as delusion" beside his "not inferior to … philosophers". This is the existing Galen item.
- **P3, the "1 of 22" counter** is stale boilerplate on about 19 ev-m pages site-wide. **"flagged above"** should read "below" on about 58 ev-m pages.
- **Card twin:** in ev-s8.html:68, "Maximinus Daia soon renewed it" has an ambiguous antecedent. The mastery page now reads "renewed the persecution".
- **Share card, site-wide:** `#shareCard` had a fixed `height:675px`, so long premises overflowed and clipped the footer from the PNG. These seven pages now use `min-height`; the other 74 ev-m pages still need it. A separate task was offered to the owner.

## Stale records to update
- docs/content-backlog.md:
  - Row ~92 still treats the tab as "The Church in History", with three essays and legacy, and with ev-m-legacy. It should now cover seven essays.
  - Row ~93 (the Holland reel "secular historian") was done on 2026-09-09; mark it DONE.
  - Row ~300's target is progress.html, not legacy.
  - Row ~291 has Hurtado's year as 2017; it is 2016.
- docs/book-research/INDEX.md (~l.35–45 and 121) still names legacy.html as the live home. riseofchurch's Ehrman footnote is now fn5.
- docs/book-research/the-air-we-breathe.md:
  - Re-home every legacy.html live-door row to the seven essays.
  - Correct these facts: the Tacitus loci are swapped (*Histories* 4.11 = *servili supplicio*); Minucius Felix's Christian voice is *Oct.* 37; Telemachus is c.404; Aristotle reads "shall live"; Soranus/Temkin is 1956; Hurtado is 2016; Harper is 2013.
  - The Thurman line is from *Deep River*.
  - Douglass's 1848 letter closes "your fellow man, but not your slave".
  - Mark the shipped rows DONE: Davis/Douglass/Gregory/medieval abolition; Parker; Galileo and Draper/White; global Christianity.
  - Re-tally the row count.
- CLAUDE.md (~l.118) still calls the Holland reel row open.
