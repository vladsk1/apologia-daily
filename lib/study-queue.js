/* Apologia Daily — unified "due today" queue (plumbing; no doctrinal content).
 *
 * WHY. The site had three separate spaced-review systems that never saw each
 * other: the account deck (Supabase `flashcards`, used by /today), the
 * Objection Deck (localStorage `ad_objdeck`) and the mastery-page refreshes
 * (localStorage `ad_reviews`, lib/review-queue.js). Revising in one did not
 * show up in the others, and the dashboard counted only one of them.
 *
 * WHAT. This file does NOT move anyone's data. Each system keeps its own store
 * and schedule; this only (a) reads what is due from the two local stores so
 * /today can review everything in one place, and (b) owns the Objection Deck's
 * SM-2 maths so objection-deck.html and /today grade identically.
 *
 * API (window.ADStudy):
 *   objDue(list)          -> objections the learner has drilled before that are due today
 *   objGrade(id, quality) -> apply SM-2 to one objection and save
 *   sm2(state, quality)   -> the shared SM-2 step (returns the new state)
 *   localDueCount(list?)  -> due mastery refreshes + due drilled objections
 *                            (pass the objections list when you have it; without
 *                            it only the mastery count is known synchronously)
 */
(function () {
  var OKEY = 'ad_objdeck';
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function loadObj() { try { return JSON.parse(localStorage.getItem(OKEY) || '{}'); } catch (e) { return {}; } }
  function saveObj(m) { try { localStorage.setItem(OKEY, JSON.stringify(m)); } catch (e) {} }

  /* SM-2, same maths as the account deck in today.html. */
  function sm2(s, quality) {
    s = s || { ef: 2.5, reps: 0, interval: 0, due: todayISO() };
    s.ef = Math.max(1.3, (s.ef || 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    if (quality < 3) { s.reps = 0; s.interval = 1; }
    else {
      s.reps = (s.reps || 0) + 1;
      if (s.reps === 1) s.interval = 1;
      else if (s.reps === 2) s.interval = 6;
      else s.interval = Math.round((s.interval || 1) * s.ef);
    }
    var d = new Date(); d.setDate(d.getDate() + s.interval);
    s.due = d.toISOString().slice(0, 10);
    return s;
  }

  var API = {
    sm2: sm2,
    /* Only objections with a schedule entry count: an objection you have never
       drilled is "new", not "due", so it does not flood the daily review. */
    objDue: function (list) {
      var m = loadObj(), t = todayISO();
      return (list || []).filter(function (o) { var s = m[o.id]; return s && s.due && s.due <= t; });
    },
    objGrade: function (id, quality) {
      var m = loadObj();
      m[id] = sm2(m[id], quality);
      saveObj(m);
    },
    localDueCount: function (list) {
      var n = 0;
      try { if (window.ADReview) n += window.ADReview.count(); } catch (e) {}
      if (list) n += API.objDue(list).length;
      else {
        var m = loadObj(), t = todayISO();
        for (var k in m) if (Object.prototype.hasOwnProperty.call(m, k) && m[k] && m[k].due && m[k].due <= t) n++;
      }
      return n;
    }
  };
  window.ADStudy = API;
})();
