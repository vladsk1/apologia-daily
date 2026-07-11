/* ============================================================
   Apologia Daily \u2014 Coach engine
   Capture + scoring for the personalised training Coach.

   Storage: localStorage 'ad_prefs'.coach = { signals:[...] }
   Each signal: { ts, id, src, score(0..1), note }
     id   \u2014 an argument id from ARGS (e.g. 'moral'), or 'cat:<Category>'
     src  \u2014 'explain' | 'quiz' | 'debate' | 'flashcard' | 'mastery'
     score\u2014 0..1 performance (1 = strong, 0 = weak)

   The engine ALSO derives signals from the existing 'ad_mastery' map
   that every Mastery Track already writes \u2014 so it has real coverage
   without instrumenting all 60+ argument pages.

   Public API (window.Coach):
     record(sig)            \u2014 capture one signal (tools call this)
     recordExplain(id,score10), recordQuiz(catOrId,pct),
     recordDebate(catOrId,score100), recordFlashcards(id,ok)
     profile()              \u2014 [{id,name,cat,mastery,trend,signals,last}]
     prescription()         \u2014 {read,evidence,steps,startHref} | null
     renderPanel(elId)      \u2014 dashboard panel
     renderLog(elId)        \u2014 coach.html training log
     reset()                \u2014 clear coach signals (debug)
   ============================================================ */
(function (global) {
  'use strict';

  var ARGS = {
  appearances:{n:"The Resurrection Appearances",c:"The Resurrection"},
  archaeology:{n:"Archaeological Confirmation of the Bible",c:"Biblical Reliability"},
  beauty:{n:"The Argument from Beauty",c:"God's Existence"},
  bigbang:{n:"The Argument from the Big Bang",c:"Science & Faith"},
  burial:{n:"The Argument from the Burial",c:"The Resurrection"},
  cambrian:{n:"The Cambrian Explosion",c:"Science & Faith"},
  canon:{n:"The Canon Formation Argument",c:"Biblical Reliability"},
  coincidences:{n:"The Argument from Undesigned Coincidences",c:"Biblical Reliability"},
  consciousness:{n:"The Argument from Consciousness",c:"God's Existence"},
  consistency:{n:"The Internal Consistency of Scripture",c:"Biblical Reliability"},
  cosmic:{n:"The Argument from Cosmic Purposiveness",c:"Science & Faith"},
  daniel70:{n:"Daniel's 70 Weeks",c:"Jesus"},
  deadseascrolls:{n:"The Dead Sea Scrolls and Old Testament Reliability",c:"Biblical Reliability"},
  desire:{n:"The Argument from Desire",c:"God's Existence"},
  disciplesbelief:{n:"Why the Disciples Believed",c:"The Resurrection"},
  early_church_trinity:{n:"The Trinity in the Early Church",c:"The Trinity"},
  earlycreed:{n:"The Early Creed of 1 Corinthians 15",c:"Jesus"},
  earlydate:{n:"The Early Date of the New Testament",c:"Biblical Reliability"},
  emptytomb:{n:"The Empty Tomb",c:"The Resurrection"},
  eternal_generation:{n:"The Eternal Generation of the Son",c:"The Trinity"},
  evil:{n:"The Problem of Evil as Evidence for God",c:"God's Existence"},
  eyewitnesses:{n:"The Reliability of the Gospel Eyewitnesses",c:"Biblical Reliability"},
  finetuning:{n:"The Fine-Tuning Argument",c:"God's Existence"},
  hands:{n:"The HANDS Framework",c:"Jesus"},
  hist_jesus:{n:"The Historical Existence of Jesus",c:"Jesus"},
  jesus_as_god_nt:{n:"Jesus as God in the New Testament",c:"Jesus"},
  jesus_claims:{n:"Did Jesus Claim to Be God",c:"Jesus"},
  jesuschar:{n:"The Character of Jesus",c:"Jesus"},
  jewishness:{n:"The Argument from the Jewishness of Jesus",c:"Biblical Reliability"},
  john11:{n:"John 1:1 and the Pre-existence of Christ",c:"Jesus"},
  kalam:{n:"The Kalam Cosmological Argument",c:"God's Existence"},
  laws:{n:"The Argument from the Laws of Nature",c:"Science & Faith"},
  leibniz:{n:"The Leibniz Contingency Argument",c:"God's Existence"},
  manuscript:{n:"The Manuscript Reliability Argument",c:"Biblical Reliability"},
  mathematics:{n:"The Argument from Mathematics",c:"Science & Faith"},
  messianic_prophecy:{n:"Messianic Prophecy \u2014 the Statistical Case",c:"Jesus"},
  minimal:{n:"The Minimal Facts Argument",c:"The Resurrection"},
  modalism:{n:"Answering Modalism",c:"The Trinity"},
  moral:{n:"The Moral Argument",c:"God's Existence"},
  multiatt:{n:"The Criterion of Multiple Attestation",c:"Jesus"},
  names:{n:"The Argument from Palestinian Names",c:"Biblical Reliability"},
  nt_trinity:{n:"The Trinity in the New Testament",c:"The Trinity"},
  ontological:{n:"The Ontological Argument",c:"God's Existence"},
  originlife:{n:"The Origin of Life Argument",c:"Science & Faith"},
  ot_trinity:{n:"Old Testament Foundations of the Trinity",c:"The Trinity"},
  paul:{n:"The Conversion of Paul",c:"The Resurrection"},
  phil2:{n:"The Philippians 2 Hymn",c:"Jesus"},
  philosophical_trinity:{n:"The Philosophical Defence of the Trinity",c:"The Trinity"},
  postresurrection:{n:"Post-Resurrection Behaviour",c:"The Resurrection"},
  privileged:{n:"The Privileged Planet Argument",c:"Science & Faith"},
  prophecy:{n:"The Argument from Fulfilled Prophecy in the Old Testament",c:"Biblical Reliability"},
  reason:{n:"The Argument from Reason",c:"God's Existence"},
  religious:{n:"The Argument from Religious Experience",c:"God's Existence"},
  respred:{n:"The Resurrection Predictions",c:"Jesus"},
  sceptics:{n:"The Conversion of the Sceptics",c:"The Resurrection"},
  shema:{n:"The Shema and the Trinity",c:"The Trinity"},
  thomistic:{n:"The Thomistic Cosmological Argument",c:"God's Existence"},
  titles:{n:"The Titles of Jesus",c:"Jesus"},
  trinity_islam:{n:"Answering Islam on the Trinity",c:"The Trinity"},
  trinity_jw:{n:"Answering the Watchtower",c:"The Trinity"},
  trinity_mormons:{n:"Answering Mormonism on the Trinity",c:"The Trinity"},
  uniqueness:{n:"The Uniqueness of the Resurrection Claim",c:"Jesus"},
  virginbirth:{n:"The Virgin Birth and Isaiah 7:14",c:"Jesus"}
  };

  var SIGNAL_CAP = 250;
  var HALF_LIFE_MS = 21 * 24 * 60 * 60 * 1000; /* recency weighting: ~3 weeks */
  var STALE_MS = 30 * 24 * 60 * 60 * 1000;

  /* ---------- storage ---------- */
  function prefs() { try { return JSON.parse(localStorage.getItem('ad_prefs') || '{}'); } catch (e) { return {}; } }
  function savePrefs(p) { try { localStorage.setItem('ad_prefs', JSON.stringify(p)); } catch (e) {} }
  function store() { var p = prefs(); return (p.coach && typeof p.coach === 'object') ? p.coach : { signals: [] }; }
  function commit(c) { var p = prefs(); p.coach = c; savePrefs(p); }
  function now() { try { return Date.now(); } catch (e) { return 0; } }

  /* reverse name -> id, so tools can pass a human title */
  var NAME2ID = {};
  for (var k in ARGS) NAME2ID[ARGS[k].n.toLowerCase()] = k;
  function resolveId(idOrName) {
    if (!idOrName) return null;
    if (ARGS[idOrName]) return idOrName;
    var low = String(idOrName).toLowerCase();
    if (NAME2ID[low]) return NAME2ID[low];
    if (low.indexOf('cat:') === 0) return idOrName; /* category pseudo-skill */
    return idOrName; /* unknown id kept as-is */
  }
  function meta(id) {
    if (ARGS[id]) return { name: ARGS[id].n, cat: ARGS[id].c, isArg: true };
    if (String(id).indexOf('cat:') === 0) { var c = id.slice(4); return { name: c, cat: c, isArg: false }; }
    return { name: id, cat: 'General', isArg: false };
  }

  /* ---------- capture ---------- */
  function record(sig) {
    if (!sig || sig.score == null) return;
    var id = resolveId(sig.id);
    if (!id) return;
    var c = store();
    c.signals = c.signals || [];
    c.signals.push({
      ts: sig.ts || now(),
      sid: sig.sid || genSid(),
      id: id,
      src: sig.src || 'other',
      score: Math.max(0, Math.min(1, Number(sig.score))),
      note: String(sig.note || '').slice(0, 140),
      synced: false
    });
    if (c.signals.length > SIGNAL_CAP) c.signals = c.signals.slice(-SIGNAL_CAP);
    commit(c);
    pushNew(); /* best-effort cross-device sync */
  }
  /* convenience wrappers for the tools */
  function recordExplain(id, score10, label) {
    var s = Math.max(0, Math.min(1, Number(score10) / 10));
    record({ id: id, src: 'explain', score: s, note: 'Explain It Back \u2014 scored ' + Math.round(Number(score10)) + '/10' + (label ? ' (' + label + ')' : '') });
  }
  function recordQuiz(idOrCat, pct, label) {
    record({ id: idOrCat, src: 'quiz', score: Math.max(0, Math.min(1, Number(pct) / 100)), note: 'Quiz \u2014 ' + Math.round(Number(pct)) + '%' + (label ? ' (' + label + ')' : '') });
  }
  function recordDebate(idOrCat, score100, label) {
    record({ id: idOrCat, src: 'debate', score: Math.max(0, Math.min(1, Number(score100) / 100)), note: 'Debate Arena \u2014 scored ' + Math.round(Number(score100)) + '/100' + (label ? ' (' + label + ')' : '') });
  }
  function recordFlashcards(id, ok) {
    record({ id: id, src: 'flashcard', score: ok ? 0.7 : 0.3, note: ok ? 'Cleared the flashcard deck' : 'Struggled on flashcards' });
  }
  function recordConversation(idOrCat, score, note) {
    record({ id: idOrCat, src: 'conversation', score: Math.max(0, Math.min(1, Number(score))), note: note || 'Real conversation logged' });
  }

  /* ---------- derive signals from existing ad_mastery ---------- */
  function masteryMap() { try { return JSON.parse(localStorage.getItem('ad_mastery') || '{}'); } catch (e) { return {}; } }
  function deriveFromMastery() {
    var m = masteryMap(), out = [];
    for (var id in m) {
      if (!ARGS[id]) continue;
      var e = m[id] || {};
      /* component completion -> a 0..1 mastery estimate */
      var frac = (e.read ? 0.25 : 0) + (e.explain ? 0.35 : 0) +
                 (e.cards ? 0.20 : 0) + (e.debate ? 0.20 : 0);
      var stale = e.fresh && (now() - e.fresh) > STALE_MS;
      if (stale) frac *= 0.6; /* memory fades */
      var note = e.done ? (stale ? 'Mastered earlier \u2014 going stale, due for review' : 'Mastered in the Evidence Library')
                        : 'Started but not yet mastered (' +
                          [e.read && 'read', e.explain && 'explained', e.cards && 'drilled', e.debate && 'defended']
                            .filter(Boolean).join(', ') + ')';
      out.push({ ts: e.fresh || e.done || (now() - HALF_LIFE_MS), id: id, src: 'mastery', score: frac, note: note });
    }
    return out;
  }

  /* ---------- scoring ---------- */
  function allSignals() {
    var c = store();
    return (c.signals || []).concat(deriveFromMastery());
  }
  function recencyWeight(ts) {
    var age = Math.max(0, now() - (ts || 0));
    return Math.pow(0.5, age / HALF_LIFE_MS);
  }
  function profile() {
    var sigs = allSignals(), by = {};
    sigs.forEach(function (s) { (by[s.id] = by[s.id] || []).push(s); });
    var out = [];
    for (var id in by) {
      var list = by[id].slice().sort(function (a, b) { return a.ts - b.ts; });
      var wsum = 0, vsum = 0, last = 0;
      list.forEach(function (s) { var w = recencyWeight(s.ts); wsum += w; vsum += w * s.score; last = Math.max(last, s.ts); });
      var mastery = wsum ? Math.round((vsum / wsum) * 100) : 0;
      /* trend: recent half vs older half (need >=2) */
      var trend = 'flat';
      if (list.length >= 2) {
        var mid = Math.floor(list.length / 2);
        var older = avg(list.slice(0, mid)), recent = avg(list.slice(mid));
        trend = recent - older > 0.06 ? 'up' : (older - recent > 0.06 ? 'down' : 'flat');
      }
      var mt = meta(id);
      out.push({ id: id, name: mt.name, cat: mt.cat, isArg: mt.isArg, mastery: mastery, trend: trend,
                 last: last, count: list.length,
                 signals: list.slice(-5).reverse().map(function (s) { return { src: s.src, note: s.note }; }),
                 history: list.slice(-6).map(function (s) { return Math.round(s.score * 100); }) });
    }
    out.sort(function (a, b) { return a.mastery - b.mastery || b.count - a.count; });
    return out;
  }
  function avg(a) { return a.length ? a.reduce(function (s, x) { return s + x.score; }, 0) / a.length : 0; }

  /* ---------- prescription ---------- */
  function prescription() {
    var prof = profile().filter(function (s) { return s.isArg; });
    if (!prof.length) return null;
    var w = prof[0]; /* weakest argument */
    var srcNote = (w.signals[0] && w.signals[0].note) || '';
    var verb = w.mastery < 45 ? 'keeps tripping you up' : (w.mastery < 70 ? 'is still shaky' : 'is close \u2014 worth locking in');
    return {
      id: w.id, name: w.name, cat: w.cat, mastery: w.mastery,
      read: 'Across your recent practice, <b>' + esc(w.name) + '</b> (' + esc(w.cat) + ') ' + verb + '. Let\u2019s work it today.',
      evidence: w.signals.map(function (s) { return s.note; }).slice(0, 3).join(' \u00b7 ') || 'Based on your activity so far',
      startHref: 'ev-m-' + w.id + '.html',
      steps: [
        { act: 'Re-read the steelman and defences', tool: 'Evidence Library', href: 'ev-m-' + w.id + '.html' },
        { act: 'Explain it back, scored \u2014 aim for 7+', tool: 'Explain It Back', href: 'explain-it-back.html' },
        { act: 'Spar a skeptic on this exact point', tool: 'Debate Arena', href: 'debate-arena.html' }
      ]
    };
  }

  /* ---------- rendering ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function renderPanel(elId) {
    var body = document.getElementById(elId);
    if (!body) return;
    var p = prescription();
    if (p) {
      var steps = p.steps.map(function (s, i) {
        return '<div style="display:flex;gap:11px;align-items:flex-start;padding:9px 2px;border-bottom:1px solid rgba(255,255,255,0.07);">' +
          '<span style="flex:0 0 22px;width:22px;height:22px;border-radius:50%;background:rgba(200,169,81,0.16);border:1px solid rgba(200,169,81,0.35);color:#c8a951;font-family:\'DM Sans\',sans-serif;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;">' + (i + 1) + '</span>' +
          '<span style="flex:1;font-family:\'DM Sans\',sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.85);line-height:1.4;">' + esc(s.act) +
          '<span style="display:block;font-size:0.72rem;color:#aecae8;margin-top:1px;">' + esc(s.tool) + '</span></span></div>';
      }).join('');
      body.innerHTML =
        '<p style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.08rem;line-height:1.6;color:rgba(255,255,255,0.92);margin-bottom:0.4rem;">' + p.read + '</p>' +
        '<p style="font-family:\'DM Sans\',sans-serif;font-size:0.74rem;color:rgba(255,255,255,0.4);margin-bottom:1rem;">' + esc(p.evidence) + '</p>' +
        '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:0.4rem 1rem;margin-bottom:1.1rem;">' + steps + '</div>' +
        '<div style="display:flex;gap:0.6rem;flex-wrap:wrap;">' +
          '<a href="' + esc(p.startHref) + '" style="font-family:\'DM Sans\',sans-serif;font-size:0.85rem;font-weight:600;background:#c8a951;color:#050d1a;padding:10px 22px;border-radius:4px;text-decoration:none;">Start session &rarr;</a>' +
          '<a href="coach.html" style="font-family:\'DM Sans\',sans-serif;font-size:0.85rem;font-weight:500;color:rgba(255,255,255,0.7);padding:10px 16px;border-radius:4px;text-decoration:none;border:1px solid rgba(255,255,255,0.14);">Full training log</a></div>' +
        convoLink();
    } else {
      body.innerHTML =
        '<p style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.08rem;line-height:1.6;color:rgba(255,255,255,0.92);margin-bottom:0.5rem;">Your Coach is warming up.</p>' +
        '<p style="font-family:\'DM Sans\',sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.55);line-height:1.6;margin-bottom:1.1rem;">Finish a debate, quiz, or Explain It Back and the Coach starts tracking where you\u2019re strong and where you slip \u2014 then builds you a daily session aimed squarely at your weakest argument.</p>' +
        '<div style="display:flex;gap:0.6rem;flex-wrap:wrap;">' +
          '<a href="debate-arena.html" style="font-family:\'DM Sans\',sans-serif;font-size:0.85rem;font-weight:600;background:#c8a951;color:#050d1a;padding:10px 22px;border-radius:4px;text-decoration:none;">Do a drill to begin &rarr;</a>' +
          '<a href="coach.html" style="font-family:\'DM Sans\',sans-serif;font-size:0.85rem;font-weight:500;color:rgba(255,255,255,0.7);padding:10px 16px;border-radius:4px;text-decoration:none;border:1px solid rgba(255,255,255,0.14);">Preview the Coach &rarr;</a></div>' +
        convoLink();
    }
  }
  /* link to log a real-world conversation for coaching (feeds the profile) */
  function convoLink() {
    return '<div style="margin-top:0.9rem;border-top:1px solid rgba(255,255,255,0.08);padding-top:0.8rem;">' +
      '<a href="conversation-journal.html" style="font-family:\'DM Sans\',sans-serif;font-size:0.78rem;color:rgba(255,255,255,0.55);text-decoration:none;">' +
      '&#128172; Had a real debate or got a question you couldn&rsquo;t answer? <span style="color:#c8a951;font-weight:600;">Log it for coaching &rarr;</span></a></div>';
  }

  function dial(pct) {
    var r = 20, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    var col = pct >= 70 ? '#2f7d57' : pct >= 50 ? '#9a7416' : '#b23b32';
    return '<div style="position:relative;width:48px;height:48px;flex-shrink:0;"><svg width="48" height="48" style="transform:rotate(-90deg)">' +
      '<circle cx="24" cy="24" r="' + r + '" stroke="#d4e0ec" stroke-width="5" fill="none"></circle>' +
      '<circle cx="24" cy="24" r="' + r + '" stroke="' + col + '" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"></circle>' +
      '</svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:\'DM Sans\',sans-serif;font-size:0.78rem;font-weight:700;color:#0a1628;">' + pct + '</div></div>';
  }
  function trendBadge(t) {
    if (t === 'up') return '<span style="font-family:\'DM Sans\',sans-serif;font-size:0.7rem;font-weight:600;text-transform:uppercase;padding:4px 11px;border-radius:99px;color:#2f7d57;background:#e7f2ec;white-space:nowrap;">&#9650; Improving</span>';
    if (t === 'down') return '<span style="font-family:\'DM Sans\',sans-serif;font-size:0.7rem;font-weight:600;text-transform:uppercase;padding:4px 11px;border-radius:99px;color:#b23b32;background:#fdeceb;white-space:nowrap;">&#9660; Slipping</span>';
    return '<span style="font-family:\'DM Sans\',sans-serif;font-size:0.7rem;font-weight:600;text-transform:uppercase;padding:4px 11px;border-radius:99px;color:#9a7416;background:#fbf3e2;white-space:nowrap;">&#9644; Steady</span>';
  }
  function renderLog(elId) {
    var el = document.getElementById(elId);
    if (!el) return;
    var prof = profile();
    if (!prof.length) {
      el.innerHTML = '<div style="background:#fff;border:1px dashed #d4e0ec;border-radius:11px;padding:2rem;text-align:center;font-family:\'DM Sans\',sans-serif;color:#7a8fa8;">' +
        '<div style="font-size:1.6rem;margin-bottom:.5rem;">&#129305;</div>' +
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.1rem;color:#0a1628;margin-bottom:.4rem;">No training data yet</div>' +
        'Finish a debate, quiz, Explain It Back, or any Mastery Track and your weakness profile builds here automatically.</div>';
      return;
    }
    el.innerHTML = prof.map(function (s, idx) {
      var rows = s.signals.map(function (g) {
        return '<div style="font-family:\'DM Sans\',sans-serif;font-size:.82rem;color:#3a4a62;line-height:1.5;padding:7px 0;border-bottom:1px solid #d4e0ec;display:flex;gap:8px;">' +
          '<span style="font-size:.6rem;font-weight:600;text-transform:uppercase;color:#285a9e;background:#f0f6fb;border:1px solid #ddeaf5;padding:2px 7px;border-radius:5px;height:fit-content;white-space:nowrap;">' + esc(s_src(g.src)) + '</span>' + esc(g.note) + '</div>';
      }).join('');
      var spark = s.history.map(function (v, i) {
        return '<div style="flex:1;border-radius:2px 2px 0 0;min-height:4px;height:' + Math.max(8, v) + '%;background:' + (i === s.history.length - 1 ? '#c8a951' : '#aecae8') + ';"></div>';
      }).join('');
      var fixHref = s.isArg ? ('ev-m-' + s.id + '.html') : 'evidence-library.html';
      return '<div style="background:#fff;border:1px solid #d4e0ec;border-radius:11px;overflow:hidden;">' +
        '<div onclick="(function(b){b.style.display=b.style.display===\'block\'?\'none\':\'block\';})(this.parentNode.querySelector(\'.cz-body\'))" style="display:grid;grid-template-columns:1fr auto auto;gap:1rem;align-items:center;padding:1.1rem 1.4rem;cursor:pointer;">' +
          '<div><div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.02rem;font-weight:600;color:#0a1628;">' + esc(s.name) + '</div>' +
          '<div style="font-family:\'DM Sans\',sans-serif;font-size:.74rem;color:#7a8fa8;margin-top:2px;">' + esc(s.cat) + ' &middot; ' + s.count + ' signal' + (s.count === 1 ? '' : 's') + '</div></div>' +
          trendBadge(s.trend) + dial(s.mastery) + '</div>' +
        '<div class="cz-body" style="display:' + (idx === 0 ? 'block' : 'none') + ';padding:0 1.4rem 1.4rem;border-top:1px solid #d4e0ec;">' +
          '<div style="display:grid;grid-template-columns:1fr 160px;gap:1.4rem;margin-top:1.1rem;">' +
            '<div><div style="font-family:\'DM Sans\',sans-serif;font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#7a8fa8;margin-bottom:.5rem;">What fed this score</div>' + rows + '</div>' +
            '<div><div style="font-family:\'DM Sans\',sans-serif;font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#7a8fa8;margin-bottom:.5rem;">Recent trend</div>' +
              '<div style="display:flex;align-items:flex-end;gap:4px;height:46px;">' + spark + '</div></div>' +
          '</div>' +
          '<div style="margin-top:1.1rem;text-align:right;"><a href="' + fixHref + '" style="font-family:\'DM Sans\',sans-serif;font-size:.78rem;font-weight:600;padding:8px 16px;border-radius:4px;background:#1e4278;color:#fff;text-decoration:none;">Drill this &rarr;</a></div>' +
        '</div></div>';
    }).join('');
  }
  function s_src(src) {
    return { explain: 'Explain', quiz: 'Quiz', debate: 'Debate', flashcard: 'Cards', mastery: 'Track', conversation: 'Real talk' }[src] || src;
  }

  /* ---------- Skill Map: the whole territory, coloured by mastery ---------- */
  function mColor(m) { return m >= 70 ? '#2f7d57' : (m >= 45 ? '#9a7416' : '#b23b32'); }
  var CAT_ORDER = ["God's Existence", 'The Resurrection', 'Jesus', 'Biblical Reliability', 'Science & Faith', 'The Trinity'];
  var CAT_ICON = { "God's Existence": '\u{1F30C}', 'The Resurrection': '✝️', 'Jesus': '\u{1F451}', 'Biblical Reliability': '\u{1F4D6}', 'Science & Faith': '\u{1F52C}', 'The Trinity': '☘️' };
  function dialLg(pct) {
    var r = 30, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    var col = pct >= 70 ? '#7fe0b0' : pct >= 45 ? '#e8cf87' : '#f0a99f';
    return '<div style="position:relative;width:78px;height:78px;flex-shrink:0;"><svg width="78" height="78" style="transform:rotate(-90deg)">' +
      '<circle cx="39" cy="39" r="' + r + '" stroke="rgba(255,255,255,0.13)" stroke-width="7" fill="none"></circle>' +
      '<circle cx="39" cy="39" r="' + r + '" stroke="' + col + '" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"></circle>' +
      '</svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:\'DM Sans\',sans-serif;color:#fff;">' +
      '<span style="font-size:1.35rem;font-weight:700;line-height:1;">' + pct + '</span><span style="font-size:.52rem;color:rgba(255,255,255,.5);letter-spacing:.1em;">MASTERY</span></div></div>';
  }
  function renderSkillMap(elId) {
    var el = document.getElementById(elId); if (!el) return;
    var byId = {}; profile().forEach(function (s) { if (s.isArg) byId[s.id] = s; });
    var cats = {}, total = 0, unlocked = 0, msum = 0;
    for (var id in ARGS) { var a = ARGS[id]; (cats[a.c] = cats[a.c] || []).push({ id: id, name: a.n }); total++; var p = byId[id]; if (p) { unlocked++; msum += p.mastery; } }
    var overall = unlocked ? Math.round(msum / unlocked) : 0;
    var head = unlocked === 0 ? 'Your map is waiting. Finish one drill and the first squares light up.'
      : (unlocked / total < 0.25 ? 'You’ve started charting the map — keep unlocking territory.'
        : (overall >= 70 ? 'Strong across the board. Keep the weak squares warm.'
          : 'Your competence is growing — here’s the whole territory.'));

    var cards = CAT_ORDER.filter(function (c) { return cats[c]; }).map(function (c) {
      var items = cats[c], un = 0, sum = 0;
      var cells = items.map(function (it) {
        var p = byId[it.id];
        if (p) {
          un++; sum += p.mastery;
          return '<a href="ev-m-' + it.id + '.html" title="' + esc(it.name) + ' — ' + p.mastery + '%' + (p.trend === 'up' ? ' (improving)' : p.trend === 'down' ? ' (slipping)' : '') + '" ' +
            'style="width:34px;height:34px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:\'DM Sans\',sans-serif;font-size:.62rem;font-weight:700;color:#fff;text-decoration:none;background:' + mColor(p.mastery) + ';position:relative;">' + p.mastery +
            (p.trend === 'up' ? '<span style="position:absolute;top:-4px;right:-3px;font-size:.5rem;color:#2f7d57;">▲</span>' : '') + '</a>';
        }
        return '<a href="ev-m-' + it.id + '.html" title="' + esc(it.name) + ' — not started yet" ' +
          'style="width:34px;height:34px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.8rem;color:#b8c4d4;text-decoration:none;background:#eef2f7;border:1px solid #dde5ee;">·</a>';
      }).join('');
      var cavg = un ? Math.round(sum / un) : 0;
      return '<div style="background:#fff;border:1px solid #d4e0ec;border-radius:12px;padding:1.1rem 1.2rem;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.7rem;">' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1rem;font-weight:600;color:#0a1628;">' + CAT_ICON[c] + ' ' + esc(c) + '</div>' +
          '<div style="font-family:\'DM Sans\',sans-serif;font-size:.72rem;color:#7a8fa8;white-space:nowrap;">' + un + '/' + items.length + (un ? ' · ' + cavg + '%' : '') + '</div></div>' +
        '<div style="height:5px;background:#eef2f7;border-radius:3px;margin-bottom:.9rem;overflow:hidden;"><div style="height:100%;width:' + Math.round(un / items.length * 100) + '%;background:' + (un ? mColor(cavg) : '#d4e0ec') + ';border-radius:3px;"></div></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + cells + '</div></div>';
    }).join('');

    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:1.4rem;background:linear-gradient(135deg,#0a1628,#163058);border-radius:14px;padding:1.4rem 1.6rem;margin-bottom:1.3rem;flex-wrap:wrap;">' +
        dialLg(overall) +
        '<div style="flex:1;min-width:210px;">' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.22rem;color:#fff;margin-bottom:.3rem;line-height:1.35;">' + head + '</div>' +
          '<div style="font-family:\'DM Sans\',sans-serif;font-size:.84rem;color:rgba(255,255,255,.62);"><b style="color:#e8cf87;">' + unlocked + '</b> of ' + total + ' arguments unlocked' + (unlocked ? ' · <b style="color:#e8cf87;">' + overall + '%</b> average mastery' : '') + '</div>' +
        '</div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:1rem;">' + cards + '</div>' +
      '<div style="font-family:\'DM Sans\',sans-serif;font-size:.72rem;color:#7a8fa8;margin-top:1rem;display:flex;gap:1.1rem;flex-wrap:wrap;align-items:center;">' +
        '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#2f7d57;vertical-align:-1px;"></span> 70%+ solid</span>' +
        '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#9a7416;vertical-align:-1px;"></span> 45–69% shaky</span>' +
        '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#b23b32;vertical-align:-1px;"></span> under 45%</span>' +
        '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#eef2f7;border:1px solid #dde5ee;vertical-align:-1px;"></span> not started</span>' +
        '<span style="margin-left:auto;color:#1e4278;">Tap a square to drill it &rarr;</span></div>';
  }

  /* ---------- Supabase persistence (cross-device) ----------
     Explicit recorded signals upsert to a per-user 'coach_signals'
     table (RLS). Offline-first: localStorage is always the live cache;
     remote is reconciled by the client-generated 'sid'. deriveFromMastery
     signals are NOT stored here (ad_mastery has its own sync).
     Requires @supabase/supabase-js loaded on the page; otherwise the
     engine runs fully client-side and flushes on the next synced page.

     One-time table setup (run in the Supabase SQL editor):
       create table if not exists public.coach_signals (
         id uuid primary key default gen_random_uuid(),
         user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
         sid text not null, skill_id text not null, src text,
         score real, note text, ts bigint,
         created_at timestamptz default now(),
         unique (user_id, sid)
       );
       alter table public.coach_signals enable row level security;
       create policy "coach_own" on public.coach_signals for all
         using (auth.uid() = user_id) with check (auth.uid() = user_id);
  */
  var SB_URL = 'https://noprgxkwniouukmrfozc.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcHJneGt3bmlvdXVrbXJmb3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE1MTUsImV4cCI6MjA5NjEzNzUxNX0.GKmQgpndtaBUcz5SoT9H3bDsqjNSPixJJj4G3BrVkJw';
  var _sb = null;
  function client() {
    if (_sb) return _sb;
    /* Reuse a shared client only if the host page exposed one. NEVER create a
       second GoTrue client: two clients with the same storage key race on token
       refresh, and Supabase's refresh-token rotation can then revoke the whole
       session (random logouts). Cross-device sync stays dormant until (a) the
       coach_signals table exists and (b) pages expose their single client as
       window.__adSb for reuse. Until then the Coach runs fully local. */
    try { if (global.__adSb) { _sb = global.__adSb; return _sb; } } catch (e) {}
    return null;
  }
  function session() {
    var c = client();
    if (!c) return Promise.resolve(null);
    return c.auth.getSession()
      .then(function (r) { return (r.data && r.data.session) || null; })
      .catch(function () { return null; });
  }
  function genSid() { return now().toString(36) + '-' + Math.random().toString(36).slice(2, 9); }
  function markSynced(sids) {
    var set = {}; sids.forEach(function (s) { set[s] = 1; });
    var c = store(); (c.signals || []).forEach(function (s) { if (set[s.sid]) s.synced = true; });
    commit(c);
  }
  /* push any local-only (unsynced) signals to remote */
  function pushNew() {
    var c = store(), pending = (c.signals || []).filter(function (s) { return !s.synced; });
    if (!pending.length || !client()) return Promise.resolve();
    return session().then(function (ses) {
      if (!ses || !ses.user) return;
      var uid = ses.user.id;
      var rows = pending.map(function (s) {
        if (!s.sid) s.sid = genSid();
        return { user_id: uid, sid: s.sid, skill_id: s.id, src: s.src, score: s.score, note: s.note, ts: s.ts };
      });
      return client().from('coach_signals').upsert(rows, { onConflict: 'user_id,sid' })
        .then(function (res) { if (!res.error) markSynced(pending.map(function (s) { return s.sid; })); });
    }).catch(function () {});
  }
  /* pull remote -> merge into local by sid -> flush local-only -> callback */
  function sync(cb) {
    var done = function () { try { if (cb) cb(); } catch (e) {} };
    if (!client()) { done(); return Promise.resolve(); }
    return session().then(function (ses) {
      if (!ses || !ses.user) { done(); return; }
      return client().from('coach_signals')
        .select('sid,skill_id,src,score,note,ts').eq('user_id', ses.user.id)
        .then(function (res) {
          if (res.error) { done(); return; }
          var c = store(); c.signals = c.signals || [];
          var have = {}; c.signals.forEach(function (s) { if (s.sid) have[s.sid] = 1; });
          (res.data || []).forEach(function (r) {
            if (!have[r.sid]) c.signals.push({ ts: r.ts || 0, sid: r.sid, id: r.skill_id, src: r.src, score: r.score, note: r.note, synced: true });
          });
          if (c.signals.length > SIGNAL_CAP) c.signals = c.signals.slice(-SIGNAL_CAP);
          commit(c);
          return pushNew().then(done);
        });
    }).catch(function () { done(); });
  }

  function reset() { var p = prefs(); delete p.coach; savePrefs(p); }

  global.Coach = {
    ARGS: ARGS,
    record: record,
    recordExplain: recordExplain,
    recordQuiz: recordQuiz,
    recordDebate: recordDebate,
    recordFlashcards: recordFlashcards,
    recordConversation: recordConversation,
    profile: profile,
    prescription: prescription,
    renderPanel: renderPanel,
    renderLog: renderLog,
    renderSkillMap: renderSkillMap,
    sync: sync,
    reset: reset
  };
})(window);
