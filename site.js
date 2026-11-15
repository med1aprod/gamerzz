(function () {
  'use strict';
  var CFG = window.NEXUS_CONFIG || {};
  var API = CFG.apiUrl || '';

  function fetchPublic() {
    if (!API) return Promise.resolve(null);
    var sep = API.indexOf('?') >= 0 ? '&' : '?';
    return fetch(API + sep + 'action=public')
      .then(function (r) { return r.json(); })
      .then(function (d) { return d; })
      .catch(function () { return null; });
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showSoft(text) {
    if (document.getElementById('softMaint')) return;
    var bar = document.createElement('div');
    bar.id = 'softMaint';
    bar.className = 'soft-maint';
    bar.innerHTML = '<span>⚠</span><span>' + esc(text || 'Технические работы. Возможны баги.') + '</span>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function goHardRedirect() {
    var target = '/not-approved.html';
    if (location.pathname.indexOf('not-approved') !== -1) return;
    location.replace(target);
  }

  function applyPublicData(d) {
    if (!d || !d.ok) return;

    if (d.maintenance === 'hard') {
      goHardRedirect();
      return;
    }
    if (d.maintenance === 'soft') showSoft(d.soft_text);

    var list = document.getElementById('newsList');
    if (list) {
      if (d.news && d.news.length) {
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
            '<p>' + esc(n.body) + '</p></div></article>'
          );
        }).join('');
      } else {
        list.innerHTML = '<p class="muted" style="text-align:center;padding:24px;color:var(--muted)">Пока нет опубликованных новостей.</p>';
      }
      bindTilt();
    }

    document.querySelectorAll('[data-discord-invite]').forEach(function (a) {
      if (d.discord_invite) a.href = d.discord_invite;
    });
  }

  function bindTilt() {
    document.querySelectorAll('.tilt-card, .glass.card, .member, .feat, .faq-item, .rule-card, .donate-card, .discord-card, .news-card, .loader-box').forEach(function (card) {
      if (card._tiltBound) return;
      if (card.closest && card.closest('.top')) return; // no tilt on navbar
      card._tiltBound = true;
      card.classList.add('tilt-card');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  function init() {
    var path = location.pathname || '';
    if (path.indexOf('adminroleplay') !== -1) return;
    if (path.indexOf('not-approved') !== -1) {
      // on maintenance page: still fetch to show texts / leave if off
      fetchPublic().then(function (d) {
        if (!d || !d.ok) return;
        if (d.maintenance !== 'hard') {
          location.replace('/');
          return;
        }
        var t = document.getElementById('naTitle');
        var p = document.getElementById('naText');
        if (t && d.hard_title) t.textContent = d.hard_title;
        if (p && d.hard_text) p.textContent = d.hard_text;
        var a = document.getElementById('naDiscord');
        if (a && d.discord_invite) a.href = d.discord_invite;
      });
      return;
    }
    bindTilt();
    fetchPublic().then(applyPublicData);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.NEXUS = { fetchPublic: fetchPublic };
})();
