# Biblical Reliability tab (ev-s4): deferred items from the 2026-09-29 over-charity + fact-check sweep

**Scope:** the 11 essays on the Evidence Library's Biblical Reliability tab:
- archaeology, canon, coincidences, consistency, deadseascrolls, earlydate
- eyewitnesses, jewishness, manuscript, names, prophecy

**Rounds.** Every essay went through read-only Explore gates, with files md5-hashed before and after each round:
1. **Four-lens review** (citations, argument, orthodoxy, neutrality), plus:
   - a whole-essay live web fact-check;
   - a research-library cross-check;
   - a copy-edit and link pass.
2. **Four-lens confirmation** of the fix pass.
3. **Narrow final gate** on the round-2 edits.

All 11 finished STAMPABLE with 0 HERESY.

This file holds what was deliberately NOT applied. CLAUDE.md rule 9 says pre-existing optional improvements become backlog rows, not bundle-ins. Each row needs its own gated pass before it ships. **Nothing below is done.**

## ✅ UPDATE 2026-10-01 — cards, mirrors and mastery pages DONE (status measured at commit time)
- **ev-s4.html cards (11):** swept, gated four lenses, stamped 2026-09-29. Markup fixed (orphan tutor fragments on manuscript + archaeology, unclosed divs on coincidences + names that nested arg-names inside arg-coincidences).
- **ev-s4.mk.html + ev-s4.es.html:** all 11 cards re-translated card-by-card from the certified English, fidelity-checked FAITHFUL / 0 heresy, polish pass re-checked; stamped 2026-10-01 as AI-translated, pending native-language doctrinal gate.
- **11 ev-m-* mastery pages:** two fix rounds + narrow final gate + two confirmation passes; all four lenses STAMPABLE, 0 HERESY; stamped 2026-10-01. Changed `checks` regexes tested with node.
- **library/deadseascrolls.html:** one resurrection-pointer clause added after certification, gated, stamp note r3 (2026-10-01).
- The card/essay mismatch rows below were settled IN THE CARDS by bounding the cards to their essays. Two remain as **owner decisions** (not defects): whether the **prophecy** card's Tyre/Cyrus/Jeremiah material and the **consistency** card's unity/typology material should get a certified essay section underneath them.

### New rows from the 2026-10-01 mastery gates (not applied; each needs its own gated pass)
- **ev-m-consistency (P2, structural):** the page argues unity → a single guiding Author (P1–C); `library/consistency.html` is about contradiction vs difference and does not argue that. Same owner decision as the consistency card above.
- ✅ DONE 2026-10-01 (commit 3358dc6d) — **ev-m-prophecy + library/prophecy.html (P3):** "the way a Roman court would sentence him" (essay line ~173) — no OT text prophesies a Roman sentence; and "distinguished from “my people” who go astray" (essay ~193) blends Isa 53:8 with 53:6. Fix essay and page together.
- **ev-m-eyewitnesses (P4):** the drill asks for "the honest limit" but neither `checks` nor ARG_PREMISES scores it.
- **ev-m-deadseascrolls + library/deadseascrolls.html (P4):** "older than any previously available" slightly overclaims (Nash Papyrus is older); "dating to before the time of Christ" could be "some dating to…". Fix at the essay level first.

## (History) Owed next in the same sweep — as written 2026-09-29
- **Propagate to the other ev-s4 surfaces.** The essay fixes must be carried to:
  - the ev-s4 cards, including `ev-s4.mk.html` and `ev-s4.es.html`;
  - the 11 `ev-m-*` mastery pages, including `ARG_PREMISES`, cards, checks and drill answers.

  This is the next phase of the owner's order: essays → cards → mastery.
- **Known card/essay mismatches to settle in the cards round:**
  - **Consistency card vs essay (P1).** The card argues the unity of Scripture (typology, covenant, Frye). Its "Research … in full" links point to `consistency.html`, which is about contradictions and carries none of that material. Either retarget the links or add a gated unity section.
  - **Prophecy card vs essay (P2).**
    - The card's national prophecies (Tyre, Ezekiel 26 vs 29:18) are absent from the essay.
    - The card premise "the probability of this pattern occurring by chance is extremely small" sits uneasily with the essay's retirement of Stoner-style odds.
  - **Coincidences card (P2).** "Cherry-picked … the opposite of design" and "Luck multiplies away" are stronger than the essay, which concedes that the misses are uncounted.
  - **Archaeology card (P3).** Check the subtitle "Hundreds of archaeological discoveries confirm biblical accounts" and its Albright quote against the essay's bounds.

- **`library/mk/manuscript.html` has an older content gap.** It never received several passages the English gained before this sweep:
  - the Mill/Collins/Bentley paragraph;
  - the evidence panel;
  - the disputed-variants section;
  - the harmonization sentence;
  - the Aland paragraph;
  - the CBGM/Lanier edition-stability paragraph;
  - the Tacitus paragraph.

  Everything this sweep changed that has an MK counterpart is synced. The gaps need a full re-translation pass with the fences carried intact. `library/es/manuscript.html` lacks only the evidence panel.

## Citation checks that need a book in hand (not verifiable online)
- **manuscript:** Metzger–Ehrman page numbers in fn 6 (59, 64, 93–95), fn 11 (154–155) and fn 12 (155).
- **deadseascrolls:**
  - Archer, *Survey of OT Introduction* (Moody 1994): find the page for the 95% quote. The page was dropped as unverifiable.
- **canon:**
  - Metzger, *Canon of the NT*: find the pages on the early Pauline collection. The page range was dropped; pp. 43 and 49 are leads from a table-of-contents reconstruction.
- **coincidences:** McGrew, *Hidden in Plain View*, page numbers for fn 4 and fn 18.
- **names:**
  - Bauckham, *Jesus and the Eyewitnesses*: check pp. 67–92 and 71–73, and the 15.6% / 18.2% figures, against a legitimate copy. Pagination differs between the 1st and 2nd editions.
  - Williams, *Can We Trust the Gospels?*, ch. 3: confirm the chapter for the *limnē* point (pp. 57–58 per a secondary source).
- **jewishness:** Keener, *John*, 1:339–363 locator.
- **Sherwin-White and Keener:** confirm Keener's 383–401 range. Only p. 400 is verified.

## Optional improvements / stronger material (each a gated content row)
- **manuscript**
  - P3: Gurry, *NTS* 62/1 (2016), gives ~500,000 variants, framed as "a by-product of abundance".
  - P4: Elliott's "damp squib" dissent within Lanier's data.
  - P4: Link `deadseascrolls.html` from the Greek-OT sentence.
  - P4: Replace "real disagreements among serious people" with "among specialists". The same fix is needed in deadseascrolls and canon.
- **deadseascrolls**
  - P3: Popović 2025 found that 1950s castor-oil conservation contamination skewed some early radiocarbon results. Backlog row 42's "contamination caveat" half never shipped.
  - P3: Add the owner's truth-model pointer (resurrection / Jesus' endorsement of Israel's Scriptures) to the conclusion.
  - P4: Bound "already the dominant Jewish text across the land".
- **canon**
  - ✅ DONE 2026-10-01 — P2: The early church actively rejected known pseudepigrapha:
    - Serapion on the Gospel of Peter (Eusebius, *HE* 6.12);
    - Tertullian on the Acts of Paul (*De baptismo* 17).
  - P3: The rule of faith predates the lists (circularity reply).
  - P3: Add Colossians 4:16 as the first-century Pauline-collection anchor.
  - P3: Augustine / Florence as the Catholic-side precedent (neutral symmetry).
  - P4: The Ethiopian and Assyrian NT canons.
  - P4: Melito of Sardis.
  - P4: Cite *Dei Filius* / *Dei Verbum* for the Catholic recognition claim.
- **archaeology**
  - ✅ DONE 2026-10-01 — P2: Positive Exodus plausibility (Hoffmeier) and the *'eleph* reading.
  - ✅ DONE 2026-10-01 — P2: Kenyon on erosion at Jericho.
  - P3: Qeiyafa / Ben-Yosef.
  - P3: A source for Sayce's 1880/1881 paper.
  - P3: The Incirli trilingual *p'l* datum in the Darius paragraph.
  - P3: Cross-link `/answers/was-there-writing-in-early-israel.html`.
  - P4: The Tell Halaf bilingual; Kitchen 1966; the Hezekiah bulla citation (E. Mazar); bibliography gaps for inline-cited works.
- **prophecy**
  - ✅ DONE 2026-10-01 — P2: FAQ questions on Isaiah 53 and Crossan.
  - ✅ DONE 2026-10-01 — P2: Boyarin, *The Jewish Gospels*, on pre-Christian suffering-messiah readings (bounded: the rabbinic texts are post-Jesus in their present form; Schäfer's critique included).
  - P3: Answer the "we = the nations' kings" (52:15) reading and Isa 49:3's Israel-to-Israel mission (49:5–6).
  - P3: The Crossan crucifixion concession; the *ka'ari* verbless-clause point; fact-check "most NT scholars … history scripturalized".
  - P4: Isaiah LXX is usually mid-2nd century.
- **coincidences**
  - P3: Replace fn 16's Wikipedia source with a named critic.
  - P3: Add Mark 6:45 to the Bethsaida reply.
  - P3: Address Carrier's "unconscious absorption" variant head-on.
  - P4: John 1:44 vs Mark 1:29 friction.
  - P4: Blunt as a `/sources` PD candidate (never logged).
  - P4: The Mary/Martha case.
  - P4: The IBE pointer (row 244).
- **consistency**
  - P2: One Old Testament hard case (Kings/Chronicles numbers; 2 Sam 24 vs 1 Chr 21).
  - P3: Ehrman's theological-diversity form of the objection.
  - P4: Blomberg, "Legitimacy and Limits of Harmonization" (1986).
  - P4: Greenleaf as a `/sources` PD candidate.
- **jewishness**
  - ✅ DONE 2026-10-01 — P2: The post-70 anachronism objection (John 9:22 *aposynagogos*; Matt 22:7; Matt 23).
  - P3: Hengel as the answer to Bousset.
  - P3: Keith & Le Donne on the criteria.
  - P4: The heading "the objection that should get the last word" → "the objection to answer last".
- **earlydate**
  - P3: The Pervo/Tyson second-century steelman.
  - P3: The 1 Clement / Polycarp / Ignatius terminus.
  - P3: Wright and France Olivet claims need footnotes.
  - P3: Move the Sanders "probably pre-70" clause into reply one.
  - P4: The Gallio anchor.
  - P4: Harmonize Papias's date (c. 110–130 here vs c. 95–110 in `/sources`).
- **eyewitnesses**
  - ✅ DONE 2026-10-01 — P2: Luke 1:1–4 and John 19:35 / 21:24 (port from the ev-s4 card).
  - P3: Hengel on the uniform Gospel titles.
  - P3: Weeden's critique of Bailey.
  - P4: C. H. Turner's Markan plural-to-singular pattern.
- **names**
  - P4: "a modern scholar's lifetime of cataloguing inscriptions" undersells Ilan's sources.

## Research-library ledgers
The stale ledgers found by this sweep's cross-check are corrected in the same commit series. See the commit "Research notes: correct stale ledgers found by the Biblical-Reliability cross-check".
