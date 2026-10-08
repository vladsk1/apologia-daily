/* age-gate.js — the Study Groups 18+ check (2026-10-08 audit, item 3).
 *
 * Study Groups are open chat between members, so they are adults-only. The rule is
 * ENFORCED IN THE DATABASE (docs/AGE_SCREEN.md: every group insert policy and the
 * join_group_by_code RPC call is_adult()). This file is only the friendly front:
 *   - reads the user's own age band from public.user_age (written at signup);
 *   - for accounts made before the age screen existed, asks once for month + year and
 *     stores the band through the set_my_age RPC (nothing else is kept);
 *   - if docs/AGE_SCREEN.md has not been run yet (table/RPC missing), falls back to the
 *     old "press OK if you are 18+" confirm so the page keeps working.
 *
 * Usage:  if (!(await adAgeGate(sb))) return;
 */
(function () {
  var cached = null; // true | false once known for this page view

  var ADULTS_MSG = 'Study Groups are for adults (18+). Under 18? Ask a parent, youth leader or pastor to run a group you can be part of with them. Everything else on the site is open to you.';

  function missing(err) {
    if (!err) return false;
    var c = err.code || '';
    return c === '42P01' || c === 'PGRST205' || c === 'PGRST202' || c === '42883' || /does not exist|could not find/i.test(err.message || '');
  }

  function legacyConfirm() {
    try { if (localStorage.getItem('ad_groups_adult_ok') === '1') return true; } catch (e) {}
    var ok = confirm('Study Groups are for adults (18+).\n\nPress OK to confirm you are 18 or older. Under 18? Ask a parent, youth leader or pastor to run the group.');
    if (ok) { try { localStorage.setItem('ad_groups_adult_ok', '1'); } catch (e) {} }
    return ok;
  }

  function isAdultRow(row) {
    if (!row) return false;
    if (row.age_band === '18+') return true;
    return !!(row.adult_from && new Date(row.adult_from + 'T00:00:00') <= new Date());
  }

  function notice(html) {
    var wrap = document.createElement('div');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(10,22,40,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
    wrap.innerHTML = '<div style="background:#fff;color:#0a1628;max-width:420px;width:100%;border-radius:8px;padding:1.5rem;font-family:inherit;line-height:1.55;">' + html + '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  function showAdultsOnly() {
    var w = notice('<p style="margin:0 0 1rem;">' + ADULTS_MSG + '</p><button type="button" style="padding:10px 18px;border:0;border-radius:4px;background:#c8a951;color:#0a1628;font-weight:600;cursor:pointer;">OK</button>');
    var b = w.querySelector('button'); b.focus();
    b.onclick = function () { w.remove(); };
  }

  // Ask once: month + year. Resolves to {year, month} or null if dismissed.
  function askBirth() {
    return new Promise(function (resolve) {
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var now = new Date().getFullYear(), years = '';
      for (var y = now; y >= now - 100; y--) years += '<option value="' + y + '">' + y + '</option>';
      var sel = 'style="flex:1;padding:9px;border:1px solid #ccc;border-radius:4px;font:inherit;"';
      var w = notice(
        '<p style="margin:0 0 .75rem;font-weight:600;">One quick question</p>' +
        '<label for="ag-m" style="display:block;margin-bottom:.4rem;">Month and year you were born</label>' +
        '<div style="display:flex;gap:8px;margin-bottom:.5rem;">' +
        '<select id="ag-m" aria-label="Birth month" ' + sel + '><option value="">Month</option>' +
        months.map(function (n, i) { return '<option value="' + (i + 1) + '">' + n + '</option>'; }).join('') + '</select>' +
        '<select id="ag-y" aria-label="Birth year" ' + sel + '><option value="">Year</option>' + years + '</select></div>' +
        '<p style="font-size:.85rem;color:#555;margin:0 0 1rem;">We keep only whether you are 18 or over, not your birth date. You only need to answer this once.</p>' +
        '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
        '<button type="button" id="ag-cancel" style="padding:10px 16px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;">Cancel</button>' +
        '<button type="button" id="ag-ok" style="padding:10px 18px;border:0;border-radius:4px;background:#c8a951;color:#0a1628;font-weight:600;cursor:pointer;">Continue</button></div>');
      w.querySelector('#ag-m').focus();
      w.querySelector('#ag-cancel').onclick = function () { w.remove(); resolve(null); };
      w.querySelector('#ag-ok').onclick = function () {
        var m = parseInt(w.querySelector('#ag-m').value, 10), y = parseInt(w.querySelector('#ag-y').value, 10);
        if (!m || !y) return;
        w.remove(); resolve({ year: y, month: m });
      };
    });
  }

  window.adAgeGate = async function (sb) {
    if (cached !== null) { if (!cached) showAdultsOnly(); return cached; }
    if (!sb) return false;
    var r = await sb.from('user_age').select('age_band,adult_from').maybeSingle();
    if (r.error) {
      if (missing(r.error)) return (cached = legacyConfirm());
      return false; // unknown error: don't let them through, don't cache
    }
    if (r.data) {
      cached = isAdultRow(r.data);
      if (!cached) showAdultsOnly();
      return cached;
    }
    var b = await askBirth();
    if (!b) return false;
    var s = await sb.rpc('set_my_age', { birth_year: b.year, birth_month: b.month });
    if (s.error) {
      if (missing(s.error)) return (cached = legacyConfirm());
      return false;
    }
    if (s.data === '18+') return (cached = true);
    cached = false;
    if (s.data === 'under_13') {
      var w = notice('<p style="margin:0 0 1rem;">Accounts on Apologia Daily are for people aged 13 and over. Please ask a parent or guardian to delete this account from <a href="/dashboard.html">Dashboard &rarr; Account</a>, or email <a href="mailto:contact@apologiadaily.com">contact@apologiadaily.com</a> and we will delete it.</p><button type="button" style="padding:10px 18px;border:0;border-radius:4px;background:#c8a951;color:#0a1628;font-weight:600;cursor:pointer;">OK</button>');
      w.querySelector('button').onclick = function () { w.remove(); };
    } else {
      showAdultsOnly();
    }
    return false;
  };
})();
