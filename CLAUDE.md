# Apologia Daily — project guide

> **Resuming / new session?** Read **`HANDOFF.md`** first — it lists what's currently
> deployed, open threads, and known issues to pick up.

Apologia Daily (apologiadaily.com) is a commercial Christian apologetics platform: a
static HTML/CSS/JS site on Vercel, with Supabase (auth/db) and Claude-powered AI
features (`/api/*.js`). The **Evidence Library** (`/library/*.html`) is the heart of the
site: long-form, fully-cited deep-dive essays.

## MANDATORY content pipeline (any new essay or substantive content)

Every essay or substantive page added to the site **must** pass through this pipeline,
in order. Do not deploy content that has skipped a stage.

1. **Draft** — `apologia-author` (or `apologia-evidence`) writes it in the house format
   (numbered footnotes + bibliography), inside the guardrails below.
2. **Scholar-editor review** — `apologia-evidence`: scholarly accuracy, rigor, sourcing,
   completeness, steelmanning.
3. **Citation fact-check** — `apologia-citations` (read-only): every scripture/Qur'an
   reference exists and is quoted accurately; every scholar/source/date/venue is real and
   correctly attributed; no fabricated quotes or statistics.
4. **Argument-soundness review** — `apologia-argument` (read-only): logical validity,
   premise strength, fair steelmanning of the strongest objection, no overstatement,
   honest concession.
5. **Copy-edit** — `apologia-editor`: typos, grammar, tone consistency, broken markup/links.
6. **Apply fixes + verify footnote integrity** — every `<sup>N</sup>` must map to exactly
   one `<li>`; preserve that mapping across all edits.
7. **FINAL GATE — `apologia-orthodoxy`** (read-only): doctrinal certification. **This is
   always the last check before deploy.** Content is not deployed until it is certified
   CLEAN (or flags are resolved). A single [HERESY]-level flag blocks deploy.
8. **Deploy** (see deploy workflow below).

Read-only agents (citations, argument, orthodoxy) report; a human-supervised step applies
their fixes. The orthodoxy agent is an automated gate, **not** a substitute for eventual
human/pastoral doctrinal sign-off on high-stakes content.

## NON-NEGOTIABLE guardrails (mirror `api/ask.js`; enforced by every agent)

- **Classical orthodoxy** (Apostles'/Nicene Creed): full deity AND humanity of Christ;
  Trinity (one God, three co-equal co-eternal persons — never modalism, tritheism, or
  Arian/subordinationist drift); bodily resurrection; authority of Scripture; salvation
  through Christ alone. Never affirm heterodoxy in the site's own voice.
- **Denominational neutrality**: defend the faith common to Catholics, Orthodox, and
  Protestants; do NOT adjudicate intra-Christian disputes (baptism, predestination,
  papacy, sacraments, Marian doctrine, end-times) as settled.
- **Tone — 1 Peter 3:15**: gentleness and respect; steelman every objection in its
  strongest form before answering; never triumphalist, strawman, or condescending;
  represent other faiths (Judaism, Islam, JW, Mormonism, atheism) charitably.
- **No fabrication**: no invented quotes, citations, dates, or statistics.
- **Argument-specific rules**:
  - Kalam: "whatever **begins to exist** has a cause," never "everything has a cause."
  - Bible reliability: manuscripts prove **accurate preservation**, not that the content
    is true — argue truth separately.
  - Fine-tuning: the **data** is conceded by atheist physicists; **design** is the inferred,
    contested conclusion — never "scientists agree the universe is designed."
  - Suffering/evil: concede the mystery first; no tidy complete theodicy; Plantinga is a
    *defense* (consistency), not a proof.
  - Morality: never "atheists can't be moral"; objective moral **duties need a ground**.
  - Resurrection: lead with the 1 Corinthians 15:3–7 early creed (within ~2–5 years);
    never frame the evidence as "merely written decades later."

## The agent fleet

| Agent | Role | Access |
|---|---|---|
| `apologia-author` | Writes long-form deep-dive essays | write |
| `apologia-evidence` | Scholar-editor: accuracy, rigor, sourcing, steelmanning | write |
| `apologia-citations` | Fact-checks every scripture/source citation | read-only |
| `apologia-argument` | Judges argument soundness / steelmanning / overstatement | read-only |
| `apologia-editor` | Copy-edit: typos, grammar, markup, links | write |
| `apologia-orthodoxy` | **Final doctrinal gate** — runs last, certifies orthodoxy | read-only |
| `apologia-strategist` / `-research` / `-product` / `-growth` / `-seo` / `-social` | Growth/strategy/content research (not part of essay QA) | varies |

## Evidence Library structure
- Hub: `evidence-library.html` (tabs fetch `ev-sN.html` fragments via JS).
- Mastery pages: `ev-m-*.html`. Deep-dive essays: `library/*.html`
  (template: `library/manuscript.html`). Index: `library/index.html`; also wire new
  essays into `sitemap.xml` and the relevant `ev-sN.html` section.

## Deploy workflow (security-critical)
- Work on the feature branch; **never `git checkout main`** (a stale local main lacks
  `.claude/agents/` and de-registers the agent fleet).
- Deploy by fast-forward push: `git push origin <branch>:main`.
- Apply edits with assert-guarded scripts (verify exact-match counts) and re-verify
  footnote `<sup>↔<li>` integrity before deploying.
