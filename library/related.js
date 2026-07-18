/* Related-arguments panel for Evidence Library deep-dive essays.
   Reads the precomputed /library/related.json (content-similarity + category)
   and injects a "Related arguments" section after the bibliography. */
(function () {
  function slugOf() {
    var p = location.pathname.split('/').filter(Boolean);
    return p.length ? p[p.length - 1] : '';
  }

  function chip(cat) {
    return '<span style="display:inline-block;font-family:\'DM Sans\',sans-serif;font-size:.66rem;' +
      'font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#a88930;' +
      'background:rgba(200,169,81,.12);border:1px solid rgba(200,169,81,.3);' +
      'border-radius:20px;padding:2px 9px;margin-bottom:8px;">' + cat + '</span>';
  }

  function card(r) {
    return '<a href="/library/' + r.slug + '" style="display:flex;flex-direction:column;' +
      'background:#fff;border:1px solid #e8e2d8;border-radius:8px;padding:14px 16px;' +
      'text-decoration:none;transition:border-color .15s,box-shadow .15s;" ' +
      'onmouseover="this.style.borderColor=\'#c8a951\';this.style.boxShadow=\'0 4px 14px rgba(15,32,64,.08)\';" ' +
      'onmouseout="this.style.borderColor=\'#e8e2d8\';this.style.boxShadow=\'none\';">' +
      chip(r.cat) +
      '<span style="font-family:\'Playfair Display\',serif;font-size:1.02rem;font-weight:600;' +
      'color:#0a1628;line-height:1.3;">' + r.title + '</span>' +
      '<span style="font-family:\'DM Sans\',sans-serif;font-size:.82rem;color:#1e4278;' +
      'margin-top:8px;">Read the deep dive &rarr;</span></a>';
  }

  function render(entry) {
    if (!entry || !entry.related || !entry.related.length) return;
    var sec = document.createElement('section');
    sec.className = 'art-related';
    sec.setAttribute('aria-label', 'Related arguments');
    sec.style.cssText = 'margin-top:42px;border-top:1px solid #e8e2d8;padding-top:18px;';
    sec.innerHTML =
      '<h2 style="font-family:\'Playfair Display\',serif;font-weight:600;font-size:1.2rem;' +
      'color:#0a1628;margin:0 0 4px;">Related arguments</h2>' +
      '<p style="font-family:\'DM Sans\',sans-serif;font-size:.88rem;color:#5a6b82;margin:0 0 16px;">' +
      'Keep building the case &mdash; these deep dives connect closely to this one.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;">' +
      entry.related.map(card).join('') + '</div>';

    var refs = document.querySelector('.art-refs');
    if (refs && refs.parentNode) {
      refs.parentNode.insertBefore(sec, refs.nextSibling);
    } else {
      var main = document.querySelector('main.art') || document.querySelector('main');
      if (main) main.appendChild(sec); else return;
    }
  }

  // ---- companion reading-guide cross-links (Reading Clubs) ----
  var CLUB = {
    hab: { id: 'case-for-the-resurrection', title: 'The Case for the Resurrection of Jesus', author: 'Habermas &amp; Licona' },
    bop: { id: 'body-of-proof', title: 'Body of Proof', author: 'Jeremiah J. Johnston' },
    gt:  { id: 'i-dont-have-enough-faith', title: 'I Don’t Have Enough Faith to Be an Atheist', author: 'Geisler &amp; Turek' }
  };
  var CLUB_MAP = {
    minimalfacts: ['hab','bop'], emptytomb: ['hab','bop'], paulconv: ['hab','bop'], appearances: ['hab','bop'],
    sceptics: ['hab','bop'], burial: ['hab','bop'], disciplesbelief: ['hab','bop'], postres: ['hab','bop'],
    earlycreed: ['hab','bop'],
    kalam: ['gt'], finetuning: ['gt'], cosmic: ['gt'], originlife: ['gt'], laws: ['gt'], moral: ['gt'],
    manuscript: ['gt'], earlydate: ['gt'], eyewitnesses: ['gt'], jesus_claims: ['gt'], jesus_as_god_nt: ['gt']
  };
  function clubCard(b) {
    return '<a href="/reading-club.html?book=' + b.id + '" style="display:flex;flex-direction:column;' +
      'background:#0a1628;border:1px solid #1e3357;border-radius:8px;padding:14px 16px;text-decoration:none;' +
      'transition:border-color .15s,box-shadow .15s;" ' +
      'onmouseover="this.style.borderColor=\'#c8a951\';this.style.boxShadow=\'0 4px 14px rgba(15,32,64,.18)\';" ' +
      'onmouseout="this.style.borderColor=\'#1e3357\';this.style.boxShadow=\'none\';">' +
      '<span style="font-family:\'DM Sans\',sans-serif;font-size:.66rem;font-weight:600;letter-spacing:.06em;' +
      'text-transform:uppercase;color:#c8a951;margin-bottom:8px;">&#128214; Companion reading guide</span>' +
      '<span style="font-family:\'Playfair Display\',serif;font-size:1.02rem;font-weight:600;color:#fff;line-height:1.3;">' + b.title + '</span>' +
      '<span style="font-family:\'DM Sans\',sans-serif;font-size:.78rem;color:#8ea2bf;margin-top:3px;">' + b.author + '</span>' +
      '<span style="font-family:\'DM Sans\',sans-serif;font-size:.82rem;color:#e8cf87;margin-top:10px;">Open the reading guide &rarr;</span></a>';
  }
  function renderClubs(slug) {
    var ids = CLUB_MAP[slug.replace(/\.html$/, '')];
    if (!ids || !ids.length) return;
    var sec = document.createElement('section');
    sec.className = 'art-clubs';
    sec.setAttribute('aria-label', 'Companion reading guides');
    sec.style.cssText = 'margin-top:34px;border-top:1px solid #e8e2d8;padding-top:18px;';
    sec.innerHTML =
      '<h2 style="font-family:\'Playfair Display\',serif;font-weight:600;font-size:1.2rem;color:#0a1628;margin:0 0 4px;">Read alongside a book</h2>' +
      '<p style="font-family:\'DM Sans\',sans-serif;font-size:.88rem;color:#5a6b82;margin:0 0 16px;">Work through the case chapter by chapter in a Reading Club &mdash; with discussion questions.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;">' +
      ids.map(function (k) { return clubCard(CLUB[k]); }).join('') + '</div>';
    var main = document.querySelector('main.art') || document.querySelector('main');
    if (main) main.appendChild(sec);
  }

  function init() {
    var slug = slugOf();
    if (!slug) return;
    renderClubs(slug);
    fetch('/library/related.json', { cache: 'force-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { if (data && data[slug]) render(data[slug]); })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
