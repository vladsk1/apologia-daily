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

  function init() {
    var slug = slugOf();
    if (!slug) return;
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
