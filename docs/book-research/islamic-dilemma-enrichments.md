# Islam-section enrichments from *The Islamic Dilemma* (Frost, 2026) — SHIPPED 2026-08-03

> **Status: SHIPPED / gated CLEAN (2026-08-03).** All three enrichments were inserted and taken
> through the full pipeline. **Gate results (dual-consensus, deity/Trinity + rival-worldview tier):**
> - `apologia-citations`: **0 errors** across 29 checked claims. Every scholar/work/date verified.
>   Refinements applied: Nickel article page range **pp. 207–223** added; the Elliott page-cite (85/105)
>   **kept omitted** as unverifiable (falls outside the IGT text range); "late antiquity" scoped to the
>   *Infancy Gospel of Thomas* (the *Arabic Infancy Gospel*'s dating is disputed / possibly post-Islamic);
>   the Nickel "~25-passage" figure **kept omitted** (unverified).
> - `apologia-argument`: **0 BREAK.** Two POLISH items applied ("descends from"→"earliest home is";
>   `worldviews` card gained "the later end of a contested range"). Garima confirmed as corroboration,
>   not proof; the appended authorities do **not** harden the Whittingham *maʿna*/*naṣṣ* calibration.
> - **DUAL-CONSENSUS** `apologia-orthodoxy`: **CLEAN** (0 heresy; manuscripts=preservation-not-truth held;
>   apocrypha factual + explicitly non-canonical; no clarifier candidates) **AND** `apologia-neutrality`:
>   **no BREAK.** One [WEAK] + one POLISH applied (Witztum factive verb softened to "have argued… stand
>   closer"; Nickel standpoint disclosed "(a Christian scholar of Islam)", "documents" not "supports").
> - **Fix pass re-gated by BOTH lenses → both returned CLEAN** (standing rule: a fix pass re-opens the gate).
> - Files: `library/islam-jesus.html` (§1), `library/islam-dilemma.html` (§2, §3), `worldviews.html` (§3 nod),
>   `briefs/_data.json` (§3 brief clause; briefs index rebuilt). All `content-review` stamps bumped 2026-08-03.
> - ⚠ **Note on tooling:** the `apologia-argument`/`-orthodoxy`/`-neutrality` fleet types were **not registered**
>   in this session, so each gate was run faithfully via a read-only `general-purpose` agent loaded with the
>   exact `.claude/agents/*.md` definition. `apologia-citations` ran as its native registered type.
> - All guardrails from the pre-gate draft (below) survived: Whittingham caution intact, Garima hedges intact,
>   apocrypha non-mocking and not implying Christian canonicity.
>
> **✅ RE-VERIFIED LIVE 2026-08-10 (ledger re-test — book-sweep note #9).** All three enrichments confirmed
> still on their target pages, all guardrails intact, and all three `content-backlog.md` rows marked
> **DONE 2026-08-03** (ledger NOT stale):
> - **§1** — `islam-jesus.html` carries the clay-birds / *Infancy Gospel of Thomas* / Witztum apocryphal-source
>   strand (fns 18–19); the "the New Testament supplies the only account" verdict is landed, not implied.
> - **§2** — `islam-dilemma.html` carries Nickel (fn 13), Griffith (fn 16), Sinai (fn 18), Witztum
>   (bibliography); **the Whittingham *maʿna*/*naṣṣ* caution SURVIVED** — not hardened to "only meaning / Ibn
>   Ḥazm invented textual corruption."
> - **§3** — `islam-dilemma.html` carries the Garima / first-*hijra*-to-Aksum illustration (fns 24–25) + the
>   `worldviews.html` Horn-1 nod + the `briefs/_data.json` clause; **both bounded hedges SURVIVED** ("roughly
>   the fifth to seventh centuries"; "the Aksumite kingdom … not a documented particular church").
>
> **⭐ STANDING OUTPUT — is the source better than our essays anywhere?** On these three planks, **no longer** —
> Frost was ahead of us on the apocryphal-source strand, the *taḥrīf* sourcing, and the Garima illustration,
> and all three are now shipped and gated CLEAN. **This note is DERIVATIVE, not an independent source:** the
> source is Frost's *The Islamic Dilemma*, mapped in [`islamic-dilemma.md`](islamic-dilemma.md) — the
> source-level cross-check belongs there (done 2026-08-06, plus a further Step-Zero enrichment 2026-08-07: the
> John of Damascus / *De Haeresibus* ch. 100 paragraph). **Do not re-mine Frost from this note.**
> ⚠ One citation debt is on-record in the `islam-dilemma.html` stamp (tied to `islamic-dilemma.md`, not this
> note): `apologia-citations` on John of Damascus's reported replies (against Sahas) + the Tov dating ranges,
> both egress-blocked — needs a web-enabled session.
>
> **Original pre-gate draft notes are retained below for the record.**

> **Status: DRAFT / pre-gate.** These are drop-in-ready enrichments surfaced by
> [`islamic-dilemma.md`](islamic-dilemma.md) and logged in
> [`../content-backlog.md`](../content-backlog.md) (2026-08-03 batch). The target pages are **dual-consensus
> gated** (deity/Trinity + rival-worldview/Islam). **Nothing here is live.** Before insertion each block must
> run `apologia-citations → apologia-argument → apologia-orthodoxy + apologia-neutrality`, then the target
> file's `content-review` stamp is bumped. Present the apocryphal material **factually, never mockingly**
> (1 Peter 3:15). Prose below is written in the house voice and pre-checked by hand + the stand-in reviews,
> but is **not** a substitute for the dedicated gate.
>
> ⚠ **Calibration guard that must survive the gate:** do NOT let these harden `library/islam-dilemma.html`'s
> deliberately-cautious framing of the *taḥrīf* meaning-vs-wording split, or the "Ibn Ḥazm invented textual
> corruption" point — our essay is more careful than Frost here (per Whittingham), and that is correct. These
> enrichments *add sourcing and illustration*; they do not re-open that calibration.

---

## Enrichment 1 — The apocryphal-source strand (NEW angle) → `library/islam-jesus.html`
**Why:** genuinely new. On-site only the Infancy Gospel of Thomas appears (once). The point that the Qur'an's
account of the biblical past tracks *later legend* (apocrypha + Syriac homily) rather than the Scriptures it
claims to confirm is a distinct strand we lack — and it strengthens the dilemma (a book that claims to
*confirm* the Torah and Gospel is, at points, confirming the apocrypha instead).

**Placement:** a short new subsection in `library/islam-jesus.html`, after the treatment of the Qur'anic Jesus'
miracles / titles.

**Draft prose (pre-gate):**
> **When the Qur'an follows a story the Gospels never told.** Among the miracles the Qur'an ascribes to Jesus
> is one the four Gospels never record: as a child, he fashions birds from clay and breathes life into them
> (Q 3:49; 5:110). That scene is not from Matthew, Mark, Luke, or John — it descends from a second-century
> apocryphal work, the *Infancy Gospel of Thomas*, which circulated (in an Arabic form) among some Christians
> of late antiquity. It is one of several places where the Qur'an's retelling of the biblical past follows not
> the Scriptures themselves but the *legends that grew up around them* — the homilies of Syriac-speaking
> Christians and the expansions of later Jewish tradition. Scholars such as Joseph Witztum have traced how the
> Qur'an's versions of Joseph, Adam, and Abraham echo Syriac fathers like Ephrem and Jacob of Serugh rather
> than the Hebrew text. None of this is said to score a point; it is simply what the sources show. But it does
> press on the dilemma: a book that presents itself as *confirming* the Torah and the Gospel is, at these
> points, confirming the apocrypha and the sermon instead.

**Primaries to verify (each still owes a page-cite before publish):**
- Clay-birds: **Infancy Gospel of Thomas** (J. K. Elliott, *The Apocryphal New Testament*, Oxford/Clarendon,
  1993, pp. 85, 105); the **Arabic Infancy Gospel** (Elias & Orfali, *The Gospel of the Infancy*, Brill 2019).
  ✅ clay-birds = Infancy-Gospel attribution already verified in the 2026-08-03 citation pass.
- Syriac homily influence: **Joseph Witztum, *The Syriac Milieu of the Quran: The Recasting of Biblical
  Narrative*** (Princeton diss., 2011); **Charbel Rizk, *The Joseph Story in the Qur'an and in the Syriac
  Tradition*** (Brill, 2023). Fathers: **Ephrem the Syrian** (d. 373), **Jacob of Serugh** (d. 521).
- Verses **Q 3:49; 5:110** ✅ verified.

**Guardrails:** dual-consensus. Factual, non-mocking tone. Do not imply Christians accept the apocrypha as
Scripture (we don't) — the point is the *Qur'an's* sourcing, not ours.

---

## Enrichment 2 — Firm up the *taḥrīf*-verse sourcing (footnotes) → `library/islam-dilemma.html`
**Why:** the essay's *taḥrīf* / "what scripture did 7th-c. Christians hold" material is sound but under-sourced
against current scholarship. Four academics the book routes to would anchor it (and none is on-site, or is
under-used). This is **citation-strengthening, not a reword** — the existing prose stays; these become
footnotes/authorities.

**Placement:** footnotes on the existing claims in `library/islam-dilemma.html` (the "Handling *Tahrif*
Precisely" section and the manuscript/"what the Christians held" material).

**Authorities to add (verify page-cites before publish):**
- **Gordon Nickel, *The Gentle Answer to the Muslim Accusation of Biblical Falsification*** (Bruton Gate,
  2015); and **"Early Muslim Accusations of Taḥrīf: Muqātil ibn Sulaymān's commentary on key qur'anic
  verses"** (2007, p. 207 for the ~25-passage figure) — anchors that the *taḥrīf* verbs (Q 2:75; 4:46; 5:13;
  5:41) were read by early commentators as distortion of *meaning*, and the count of passages cited for alleged
  alteration. ⚠ Keep Whittingham's caution attached (the clean meaning/wording split is contested) — Nickel
  *supports* the argument without requiring us to overstate it.
- **Sidney Griffith, *The Bible in Arabic: the scriptures of the "People of the Book" in the language of
  Islam*** (Princeton, 2013) — the natural authority for the "what scripture did 7th-c. Christians actually
  hold / was there an Arabic Bible" plank, and the *euangelion* → *Injīl* loanword.
- **Nicolai Sinai, *Key Terms of the Qur'an: A Critical Dictionary*** (Princeton, 2023) — for the definitions
  of *kitāb*, *muhaymin* (Q 5:48), and *ummī* (Q 7:157). ⚠ On *muhaymin* the demo review could confirm the
  argument's shape but not a specific Sinai page; verify the exact locus, and don't put a claim in his mouth he
  doesn't make (the classical tafsīr reading is the safe anchor).
- **Joseph Witztum, *The Syriac Milieu of the Quran*** (2011) — shared with Enrichment 1; anchors the
  Syriac-source strand if the essay references it.

**Guardrails:** dual-consensus (light — this is sourcing). All four verified real in the 2026-08-03 pass; only
the **specific page-cites** are outstanding. Do not use the sources to strengthen a claim past what our
Whittingham-calibrated wording already says.

---

## Enrichment 3 — The Garima Gospels / migration-to-Aksum illustration → `library/islam-dilemma.html`
**Why:** a vivid, memorable, and rhetorically strong illustration for the manuscript evidence — and one tied to
Islam's *own* early history, which lands harder than a generic manuscript list. Not currently on-site.

**Placement:** inside the essay's existing **"Horn 1 Under the Manuscript Evidence"** section (as a closing
illustration).

**Draft prose (pre-gate):**
> One illustration sits especially close to Islam's own story. The **Garima Gospels** — an illuminated copy of
> the four Gospels in Ge'ez, kept by the Ethiopian church — have been radiocarbon-dated to roughly the fifth to
> seventh centuries, a range that brackets Muhammad's own lifetime. And it was to that same **Aksumite
> Christian kingdom** that Muhammad's own companions fled during the early persecution at Mecca — the migration
> to Abyssinia (c. 615) — where a Christian king gave them refuge. So the four Gospels the Islamic sources
> place the first Muslims *alongside* in Ethiopia are the same four we can still read today: Matthew, Mark,
> Luke, and John. The claim that "the Bible we have is not the Bible they had" has to reckon with the
> manuscripts sitting in the very kingdom the first Muslims themselves sheltered in.

**Primaries to verify:**
- **Garima Gospels** radiocarbon dating (~330–650, most-cited c. 390–660): **McKenzie, Watson, et al., *The
  Garima Gospels: Early Illuminated Gospel Books from Ethiopia*** (Oxford: Manar al-Athar, 2016). ⚠ **Bounded:**
  "Muhammad's own era" uses the *later end* of a genuinely contested radiocarbon bracket — keep "roughly the
  fifth to seventh centuries" / "brackets," never a precise "dated to Muhammad's lifetime."
- **First Hijra / migration to Abyssinia** (~615), refuge with the Negus (al-Najāshī): standard sīra + the
  Kingdom of Aksum. ⚠ **Bounded:** the refuge was the Aksumite *kingdom/court*, not a documented specific
  church — say "the same Aksumite Christian kingdom," per the 2026-08-03 citation fix on the demo.

**Guardrails:** dual-consensus. Keep both bounded-date and bounded-refuge hedges above; the argument survives
the later-end date either way, so there is no need to over-claim the dating.

---

## Execution checklist (for a fleet-loaded session)
1. Insert Enrichment 1 into `library/islam-jesus.html`; Enrichments 2–3 into `library/islam-dilemma.html`
   (optionally mirror a one-line Garima nod into the `worldviews.html` Horn-1 evidence card).
2. Run `apologia-citations` (confirm the outstanding page-cites above), then `apologia-argument`, then the
   **dual-consensus** pair `apologia-orthodoxy` + `apologia-neutrality`. Apply fixes; re-run per the
   "fix pass re-opens the gate" rule.
3. Bump each edited file's `content-review` stamp; run `node tools/check-stamp-integrity.mjs` +
   `node tools/check-content-review.mjs --changed` + `node --test tests/*.test.mjs`.
4. If a `/briefs` entry exists for the dilemma, refresh it; rebuild indexes. Mark the three
   `content-backlog.md` rows Done.
