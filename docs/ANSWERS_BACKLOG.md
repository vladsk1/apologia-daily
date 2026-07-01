# /answers/ Flywheel — Prioritized Question Backlog

_Compiled from two parallel research passes (SEO keyword-demand + audience/trend), deduped and
merged. Goal: scale `/answers/` from 34 pages toward 300+. Each answer = one search-phrased
question → `<title>`/`<h1>`/slug, ~400–700 words, QAPage/FAQPage schema, gated (citations →
argument → orthodoxy) before deploy, appended to `answers/_data.json` → `node tools/gen-answers.mjs`._

**Demand tiers are directional estimates** (no keyword-tool access) from PAA patterns, GotQuestions'
index, "Top 101 Theology Questions" data, and live 2026 trend coverage. Both passes independently
surfaced the OT-violence / slavery / Mormon-JW / OT-vs-NT-God clusters → high confidence.

## Execution principle (why the order below)
- **Cheap wins first:** questions that map to an *existing deep essay* draft fast and ship with a
  rigorous "go deeper" link. ~47 of the 90 have an essay.
- **`laws.html` is natural-theology, NOT OT ethics** — so the highest-demand cluster (genocide/
  slavery) has **no backing essay**: heavier to write, higher doctrinal stakes. Sequence them after
  the cheap wins, or pair with a new Evidence Library essay.
- **Neutrality-flagged** items must present the range of faithful Christian views, not adjudicate
  (route carefully through `apologia-orthodoxy`).
- **HOLD for human sign-off:** live ethical/pastoral questions (LGBTQ+, women-submission framing) —
  not pure apologetics-evidence questions; framing must be scoped by a human first.

---

## TIER A — First sprint: high demand + existing essay (cheap, fast, low-risk)
Draft these exactly like the FAQ batches (essay-grounded).

| Question (as typed) | slug | category | go-deeper | demand |
|---|---|---|---|---|
| If God made everything, who made God? | `who-made-god` | God's Existence | kalam | High |
| Was Jesus copied from pagan myths like Horus and Mithras? | `was-jesus-copied-from-pagan-myths` | Resurrection | coincidences | High |
| Who decided which books are in the Bible? | `who-decided-which-books-are-in-the-bible` | Bible Reliability | canon | High |
| Why were some gospels left out of the Bible? | `why-were-some-gospels-left-out-of-the-bible` | Bible Reliability | canon | High |
| Do Jehovah's Witnesses believe Jesus is God? | `do-jehovahs-witnesses-believe-jesus-is-god` | Other Religions | trinity_jw | High |
| Is Jesus Michael the Archangel (JW claim)? | `is-jesus-michael-the-archangel` | Other Religions | trinity_jw | Med |
| Is the Mormon Jesus the same as the biblical Jesus? | `is-the-mormon-jesus-the-same-as-the-bible` | Other Religions | trinity_mormons | High |
| Are Mormons Christians? | `are-mormons-christians` | Other Religions | trinity_mormons | High (neutral-flag) |
| Are Jehovah's Witnesses Christians? | `are-jehovahs-witnesses-christians` | Other Religions | trinity_jw | High (neutral-flag) |
| If Jesus is God, why did he pray / not know the day or hour? | `if-jesus-is-god-why-did-he-pray` | Who Jesus Is | phil2 | High |
| Where is the Trinity in the Bible? | `where-is-the-trinity-in-the-bible` | Who Jesus Is | nt_trinity | High |
| Why do Christians say Jesus is the only way to God? | `why-is-jesus-the-only-way-to-god` | Faith & Doubt | uniqueness | High |
| Why did the disciples die for their faith? | `why-did-the-disciples-die-for-their-faith` | Resurrection | disciplesbelief | High |
| Does the Big Bang point to God? | `does-the-big-bang-point-to-god` | Science & Faith | bigbang | High |
| Do Muslims and Christians worship the same God? | `do-muslims-and-christians-worship-the-same-god` | Other Religions | trinity_islam | High |
| Did Jesus die on the cross, or does the Quran deny it? | `did-jesus-die-on-the-cross-islam` | Other Religions | islam-jesus | High |
| Is Jesus "a god" in John 1:1 (New World Translation)? | `is-jesus-a-god-in-john-1-1-nwt` | Other Religions | jesus_as_god_nt | Med |
| Can science explain the origin of life? | `can-science-explain-the-origin-of-life` | Science & Faith | originlife | Med |
| Does the multiverse explain away fine-tuning? | `does-the-multiverse-explain-fine-tuning` | Science & Faith | finetuning | Med |
| Is God just wishful thinking (Freud)? | `is-god-just-wishful-thinking` | God's Existence | desire | Med |
| How many prophecies did Jesus fulfill? | `how-many-prophecies-did-jesus-fulfill` | Who Jesus Is | messianic-prophecy | High |
| Is the virgin birth credible? | `is-the-virgin-birth-credible` | Who Jesus Is | virginbirth | Med (Christmas spikes) |
| What is the minimal facts argument for the resurrection? | `what-is-the-minimal-facts-argument` | Resurrection | minimalfacts | Med |

## TIER B — High demand, NO existing essay (standalone, heavier; some neutral-flag)
Cross-validated by both passes = real demand. Write with the "concede the difficulty first" voice.

| Question | slug | category | flag |
|---|---|---|---|
| Did God command genocide in the Old Testament? | `did-god-command-genocide` | Bible Difficulties | tone-critical |
| Why did God command the killing of the Canaanites? | `why-did-god-command-killing-the-canaanites` | Bible Difficulties | tone-critical |
| Is the conquest of Canaan morally justified? | `is-the-conquest-of-canaan-justified` | Bible Difficulties | tone-critical |
| Does the Bible support/condone slavery? | `does-the-bible-condone-slavery` | Bible Difficulties | tone-critical |
| Why doesn't the Bible directly condemn slavery? | `why-doesnt-the-bible-condemn-slavery` | Bible Difficulties | tone-critical |
| Is the God of the Old Testament different from Jesus? | `is-the-ot-god-different-from-jesus` | Bible Difficulties | evergreen |
| Is God a moral monster? (OT violence) | `is-god-a-moral-monster` | Bible Difficulties | tone-critical |
| Is hell real, and what is it like? | `is-hell-real` | Suffering & Afterlife | neutral-flag (annihilation vs conscious) |
| What happens when you die? | `what-happens-when-you-die` | Suffering & Afterlife | neutral-flag |
| What about those who never heard of Jesus? | `what-about-those-who-never-heard-of-jesus` | Suffering & Afterlife | neutral-flag |
| Why won't God just prove he exists? (divine hiddenness) | `why-doesnt-god-just-prove-he-exists` | God's Existence | — |
| How can I know Christianity is true? | `how-can-i-know-christianity-is-true` | Christian Life | cornerstone (links whole library) |
| I'm deconstructing my faith — is that wrong? | `is-it-wrong-to-deconstruct-my-faith` | Christian Life | surging, tone-critical |
| Why do so many people leave the church? | `why-do-people-leave-the-church` | Christian Life | pastoral |
| Is it normal to feel hurt by the church? | `is-it-normal-to-feel-hurt-by-the-church` | Christian Life | pastoral (distinct from doubt) |
| Why are there so many hypocrites in the church? | `why-are-there-hypocrites-in-the-church` | Christian Life | — |
| Has Christianity done more harm than good? | `has-christianity-done-more-harm-than-good` | Objections | balance-critical |
| Can you believe in God and evolution? | `can-you-believe-in-god-and-evolution` | Science & Faith | neutral-flag (map the views) |
| How old is the earth according to the Bible? | `how-old-is-the-earth-according-to-the-bible` | Science & Faith | neutral-flag |
| Was Noah's flood a real global flood? | `was-noahs-flood-a-real-global-flood` | Science & Faith | neutral-flag |
| Do we have free will if God knows everything? | `do-we-have-free-will-if-god-knows-everything` | Suffering & Afterlife | neutral-flag (no Calvin/Arminius) |

## TIER C — Fresh / 2026-timely, low competition (differentiation, net-new)
White space the incumbents haven't covered as crisp Q&A. Some have philosophy-essay backing.

| Question | slug | category | go-deeper |
|---|---|---|---|
| Can an AI have a soul? | `can-an-ai-have-a-soul` | Science & Faith | consciousness |
| Should I trust an AI chatbot with spiritual questions? | `should-i-trust-ai-with-spiritual-questions` | Christian Life | none |
| Does simulation theory disprove God? | `does-simulation-theory-disprove-god` | God's Existence | ontological |
| Are near-death experiences evidence for the afterlife? | `are-near-death-experiences-evidence-for-afterlife` | Suffering & Afterlife | none |
| What actually makes someone a Christian? | `what-makes-someone-a-christian` | Faith & Doubt | none |
| Is the Book of Mormon historically reliable? | `is-the-book-of-mormon-historically-reliable` | Other Religions | archaeology |
| Did Jesus ever literally say "I am God"? | `did-jesus-literally-say-i-am-god` | Who Jesus Is | jesus_claims |
| Is atheism a religion / does it require faith? | `does-atheism-require-faith` | Objections | reason |

## HOLD — needs human/pastoral sign-off before drafting
Top-tier demand but live ethical/pastoral (not pure apologetics-evidence). Scope framing first.
- Does the Bible condemn being gay? / any LGBTQ+ doctrinal question
- Is the Bible sexist? / Why does Paul tell women to be silent / submit? (handle as historical-context
  apologetic only; do NOT adjudicate complementarian vs egalitarian)

## OUT OF SCOPE
- Christian nationalism / church-and-politics — real trend, but political-sociological, not an
  apologetics evidence question. Doesn't fit the Evidence Library mission.

---

## Further backlog (remaining net-new, condensed — pull into later sprints)
**Bible Difficulties:** do the Gospels contradict on the resurrection; three days & three nights;
Jesus' two genealogies; mustard seed "smallest seed"; does the Bible say the earth is flat; did God
create evil (Isa 45:7); where did Cain get his wife. **Bible/Canon:** what are the Dead Sea Scrolls;
is the Old Testament reliable; did the Bible copy Gilgamesh; was the Bible written by men; why so many
translations; is the KJV the only true Bible (neutral). **Science:** do science & Christianity
conflict; is intelligent design science; is Genesis literal (neutral); do miracles violate natural
law; is believing in miracles irrational; does neuroscience disprove the soul. **God/Philosophy:**
does the universe need an explanation; why does the universe obey math; can physics explain the mind;
is Earth's place designed; does beauty point to God; does the size of the universe mean God doesn't
exist. **Jesus/Trinity:** was Jesus really Jewish; is the Trinity in the OT; is the Trinity three
gods or modalism; did Daniel predict when the Messiah would come. **Other religions:** is Muhammad a
true prophet; how can God be three and one (Tawhid); is the Quran a literary miracle; Buddhism vs
Christianity on suffering; is God personal or impersonal; is religion just where you were born.
**Suffering:** is it fair that good people go to hell; why natural disasters/childhood cancer; why
doesn't God answer prayer. **Resurrection:** is Jesus a myth; was Jesus really buried; how soon was
the resurrection preached; did Jesus survive the crucifixion (swoon). **Christian Life:** how do I
start believing with doubts; how to respond when someone attacks my faith; can you lose faith and get
it back; how to talk to an atheist.

_Full annotated 90-item SEO list + 12 trend clusters with sources are in the two research transcripts
from the session that generated this file._
