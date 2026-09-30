/* Apologia Daily — ONE "today's step" for the whole site (plumbing; no doctrinal content).
 *
 * WHY (2026-09-30). The dashboard, Coach, Study Plans and Beginner's Path each
 * offered its own "do this today", so a learner on a study plan could be told four
 * different things by four pages. This decides a single step, in a fixed order,
 * and every page shows the same one.
 *
 * ORDER (owner-approved):
 *   1. Beginner's Path — started (1+ day done) and not finished (<5 days).
 *   2. An active Study Plan — its next unfinished day. study-plans.html records
 *      that day in localStorage 'ad_plan_next' whenever it renders; this file
 *      re-checks the plan is still active in 'study_plans' before using it.
 *   3. Coach — once there is enough practice history (the same thresholds
 *      today.html already uses to adapt its Learn step), the weakest argument.
 *   4. Otherwise — Today's session and its daily argument.
 *
 * Nothing here changes anyone's progress; it only reads it.
 *
 * API (window.ADToday):
 *   step() -> { source, label, title, note, href }
 *   render(el, opts) -> fills el with a "Your step today" card; returns the step.
 *                       opts.skip: sources to leave hidden on this page (e.g. ['daily'])
 */
(function () {
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  /* Only same-site paths may become links (the values come from localStorage). */
  function safeHref(h, fallback) {
    h = String(h || '');
    if (/^\/?[\w\-./]+(\?[\w=&%\-.]*)?(#[\w\-]*)?$/.test(h) && !/^\/\//.test(h) && h.indexOf(':') === -1) return h.charAt(0) === '/' ? h : '/' + h;
    return fallback;
  }

  function beginner() {
    var bp = get('beginners_path', null);
    var n = bp && Array.isArray(bp.days) ? bp.days.length : 0;
    if (n < 1 || n >= 5) return null;
    return { source: 'beginner', label: 'Beginner’s Path', title: 'Day ' + (n + 1) + ' of 5',
             note: 'Carry on the five-day introduction where you left off.', href: '/beginners-path.html#day-' + (n + 1) };
  }

  function plan() {
    var nx = get('ad_plan_next', null);
    if (!nx || !nx.id) return null;
    var sv = get('study_plans', {});
    var pr = sv && sv[nx.id];
    if (!pr || !pr.started || pr.finished) return null;     // plan finished or reset since
    var title = (nx.title || 'Your study plan') + ' — Day ' + nx.day + (nx.total ? ' of ' + nx.total : '');
    return { source: 'plan', label: 'Your study plan', title: title, note: nx.text || '',
             href: '/study-plans.html?plan=' + encodeURIComponent(nx.id) };
  }

  function coach() {
    var C = window.Coach;
    if (!C || !C.profile || !C.prescription) return null;
    try {
      var prof = C.profile().filter(function (s) { return s.isArg; });
      var signals = prof.reduce(function (n, s) { return n + (s.count || 0); }, 0);
      if (prof.length < 2 || signals < 3) return null;        // not enough history yet
      var p = C.prescription();
      if (!p || !p.id || p.mastery >= 85) return null;          // nothing weak enough to target
      return { source: 'coach', label: 'Your Coach', title: 'Work on ' + p.name,
               note: 'Your weakest argument right now. Today’s session will target it.', href: '/today' };
    } catch (e) { return null; }
  }

  function step() {
    return beginner() || plan() || coach() ||
      { source: 'daily', label: 'Today’s session', title: 'Today’s argument',
        note: 'Five minutes: review what is due, learn today’s argument, prove you can say it.', href: '/today' };
  }

  function render(el, opts) {
    var s = step();
    if (!el) return s;
    opts = opts || {};
    if (opts.skip && opts.skip.indexOf(s.source) !== -1) { el.style.display = 'none'; return s; }
    el.innerHTML = '';
    var a = document.createElement('a');
    a.href = safeHref(s.href, '/today');
    a.className = 'ad-today-step';
    a.style.cssText = 'display:flex;align-items:center;gap:1rem;text-decoration:none;background:#050d1a;border:1px solid rgba(200,169,81,0.45);border-radius:8px;padding:0.95rem 1.25rem;margin:0 0 1rem;';
    var body = document.createElement('div'); body.style.cssText = 'flex:1;min-width:0;';
    var k = document.createElement('div');
    k.style.cssText = "font-family:'DM Sans',sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#c8a951;margin-bottom:2px;";
    k.textContent = 'Your step today · ' + s.label;
    var t = document.createElement('div');
    t.style.cssText = "font-family:'Playfair Display',Georgia,serif;font-size:1.08rem;font-weight:700;color:#fff;";
    t.textContent = s.title;
    body.appendChild(k); body.appendChild(t);
    if (s.note) {
      var n = document.createElement('div');
      n.style.cssText = "font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(255,255,255,0.6);margin-top:3px;line-height:1.45;";
      n.textContent = s.note;
      body.appendChild(n);
    }
    var b = document.createElement('span');
    b.style.cssText = "font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:600;background:#c8a951;color:#050d1a;padding:9px 18px;border-radius:4px;white-space:nowrap;";
    b.textContent = s.source === 'daily' || s.source === 'coach' ? 'Start →' : 'Continue →';
    a.appendChild(body); a.appendChild(b);
    a.addEventListener('click', function () { try { if (window.adTrack) adTrack('today_step_click', { source: s.source, page: location.pathname }); } catch (e) {} });
    el.appendChild(a);
    el.style.display = 'block';
    return s;
  }

  window.ADToday = { step: step, render: render };
})();
