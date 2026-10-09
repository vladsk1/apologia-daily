/* "Defend it live" (2026-09-30).
   Adds one button to the closing box (.bigcta) of each ev-m-* mastery page that
   opens the Debate Arena with a fitting opponent and one of the Arena's own
   PRESET topics already selected (debate-arena.html only accepts an exact
   preset match, so nothing typed here can reach the AI as a prompt).
   UI plumbing only: no argument content lives in this file. */
(function () {
  var A = ['atheist', 'Does God exist?'];
  var SUFFER = ['atheist', 'Why does God allow suffering?'];
  var SCI = ['atheist', 'Can science explain everything?'];
  var RES = ['atheist', 'Did Jesus rise from the dead?'];
  var BIB = ['atheist', 'Is the Bible reliable?'];
  var DEITY = ['muslim', 'Is Jesus God or a prophet?'];
  var MORAL = ['secularist', 'Can morality exist without God?'];
  var HARM = ['secularist', 'Does religion do more harm than good?'];
  var OPPRESS = ['secularist', 'Is the Bible oppressive?'];

  var MAP = {
    // God's existence
    kalam: A, finetuning: A, leibniz: A, cosmic: A, bigbang: A, laws: A, mathematics: A,
    beauty: A, desire: A, religious: A, thomistic: A, privileged: A, ontological: A,
    consciousness: A, reason: A, moral: MORAL, evil: SUFFER,
    originlife: SCI, cambrian: SCI, 'science-history': SCI,
    // Resurrection
    emptytomb: RES, burial: RES, appearances: RES, minimal: RES, disciplesbelief: RES,
    earlycreed: RES, postresurrection: RES, paul: RES, sceptics: RES, respred: RES,
    // Biblical reliability and history
    manuscript: BIB, deadseascrolls: BIB, archaeology: BIB, canon: BIB, earlydate: BIB,
    eyewitnesses: BIB, names: BIB, coincidences: BIB, consistency: BIB, multiatt: BIB,
    hist_jesus: BIB, jewishness: BIB, prophecy: BIB, messianic_prophecy: BIB,
    daniel70: BIB, typology: BIB, uniqueness: BIB,
    // Jesus and the Trinity
    jesus_claims: DEITY, jesus_as_god_nt: DEITY, titles: DEITY, hands: DEITY, phil2: DEITY,
    john11: DEITY, 'jesus-is-yahweh': DEITY, 'worship-of-jesus': DEITY, 'paul-divinity': DEITY,
    'christ-before-bethlehem': DEITY, 'crucified-messiah': DEITY, 'jesus-messiah-claim': DEITY, virginbirth: DEITY,
    jesuschar: DEITY, humanity: DEITY, nt_trinity: DEITY, ot_trinity: DEITY, shema: DEITY,
    modalism: DEITY, relations: DEITY, philosophical_trinity: DEITY,
    'proto-trinitarian': DEITY, early_church_trinity: DEITY, eternal_generation: DEITY,
    holy_spirit: DEITY, analogies: DEITY, trinity_islam: DEITY, trinity_jw: DEITY,
    trinity_mormons: DEITY,
    // The Christian Revolution
    riseofchurch: HARM, persecution: HARM, compassion: HARM, progress: HARM,
    equality: OPPRESS
  };
  var WHO = { atheist: 'an atheist', muslim: 'a Muslim', agnostic: 'an agnostic', secularist: 'a secularist' };

  function add() {
    var m = location.pathname.match(/ev-m-([\w-]+)\.html$/);
    var pick = m && MAP[m[1]];
    var box = document.querySelector('.bigcta');
    if (!pick || !box || box.querySelector('.defend-live')) return;
    var a = document.createElement('a');
    a.className = 'btn defend-live';
    a.href = '/debate-arena.html?opp=' + pick[0] + '&topic=' + encodeURIComponent(pick[1]);
    a.textContent = 'Defend it live: debate ' + WHO[pick[0]] + ' on “' + pick[1] + '” →';
    a.style.cssText = 'display:inline-block;margin-top:14px;text-decoration:none;background:#fff;color:#0a1628;' +
      'border:1px solid #fff;font-weight:600;';
    a.addEventListener('click', function () {
      try { if (window.adTrack) adTrack('defend_live_click', { arg: m[1], opp: pick[0] }); } catch (e) {}
    });
    var wrap = document.createElement('div');
    wrap.appendChild(a);
    var next = box.querySelector('.btn.gold');
    if (next && next.nextSibling) box.insertBefore(wrap, next.nextSibling); else box.appendChild(wrap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
