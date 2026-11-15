(function () {
  'use strict';
  var CFG = window.NEXUS_CONFIG || {};
  var API = CFG.apiUrl || '';

  /* ---- Theme ---- */
  var theme = localStorage.getItem('nexus-theme') || 'dark';
  function applyTheme(t) {
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('nexus-theme', t);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = t === 'dark' ? '☾' : '☀';
  }
  applyTheme(theme);

  /* ---- Fetch public API ---- */
  var cache = null;
  function fetchPublic() {
    if (!API) return Promise.resolve(null);
    return fetch(API + (API.indexOf('?') >= 0 ? '&' : '?') + 'action=public')
      .then(function (r) { return r.json(); })
      .then(function (d) { cache = d; return d; })
      .catch(function () { return null; });
  }

  /* ---- Maintenance ---- */
  function showSoft(text) {
    if (document.getElementById('softMaint')) return;
    var bar = document.createElement('div');
    bar.id = 'softMaint';
    bar.className = 'soft-maint';
    bar.innerHTML = '<span>⚠</span><span>' + (text || 'Технические работы. Возможны баги.') + '</span>';
    document.body.insertBefore(bar, document.body.firstChild);
  }
  function showHard(title, text) {
    if (document.getElementById('hardMaint')) return;
    var el = document.createElement('div');
    el.id = 'hardMaint';
    el.className = 'hard-maint';
    el.innerHTML =
      '<div class="hard-box">' +
      '<img src="/logo.png" alt="Nexus" onerror="this.src=\'logo.png\'">' +
      '<h1>' + (title || 'Технические работы') + '</h1>' +
      '<p>' + (text || 'Сайт временно недоступен.') + '</p>' +
      '<a class="hard-discord" href="' + (CFG.discordInvite || '#') + '" target="_blank" rel="noopener">Discord</a>' +
      '</div>';
    document.body.appendChild(el);
  }

  function applyPublicData(d) {
    if (!d || !d.ok) return;
    if (d.maintenance === 'soft') showSoft(d.soft_text);
    if (d.maintenance === 'hard') showHard(d.hard_title, d.hard_text);
    // news page
    var list = document.getElementById('newsList');
    if (list && d.news && d.news.length) {
      list.innerHTML = d.news.map(function (n) {
        return (
          '<article class="news-card glass tilt-card">' +
          '<div class="news-accent"></div><div class="news-body">' +
          '<div class="news-meta">' +
          (n.date ? '<span class="date">' + esc(n.date) + '</span>' : '') +
          (n.status ? '<span class="news-status">' + esc(n.status) + '</span>' : '') +
          (n.category ? '<span class="news-tag">' + esc(n.category) + '</span>' : '') +
          '</div>' +
          '<h3>' + esc(n.title) + '</h3>' +
          '<p>' + esc(n.body) + '</p>' +
          '</div></article>'
        );
      }).join('');
      bindTilt();
    }
    // discord widget counts if available later
    var inv = document.querySelectorAll('[data-discord-invite]');
    inv.forEach(function (a) {
      if (d.discord_invite) a.href = d.discord_invite;
    });
  }
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- 3D tilt cards ---- */
  function bindTilt() {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      if (card._tiltBound) return;
      card._tiltBound = true;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---- Theme button inject ---- */
  function ensureThemeBtn() {
    var nav = document.querySelector('.nav');
    if (!nav || document.getElementById('themeToggle')) return;
    var b = document.createElement('button');
    b.id = 'themeToggle';
    b.type = 'button';
    b.className = 'theme-btn';
    b.title = 'Тема';
    b.textContent = theme === 'dark' ? '☾' : '☀';
    b.addEventListener('click', function () {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
    });
    var menu = nav.querySelector('.menu');
    if (menu) nav.insertBefore(b, menu);
    else nav.appendChild(b);
  }

  /* ---- Init ---- */
  function init() {
    ensureThemeBtn();
    bindTilt();
    // skip hard overlay logic on admin pages
    if (location.pathname.indexOf('adminroleplay') !== -1) return;
    fetchPublic().then(applyPublicData);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.NEXUS = { fetchPublic: fetchPublic, applyTheme: applyTheme };
})();
