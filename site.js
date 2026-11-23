(function () {
  'use strict';
  var CFG = window.NEXUS_CONFIG || {};
  var API = CFG.apiUrl || '';

  /* —— runtime UI patch (n.ai / favicons / Север Оператив) —— */
  function patchUI() {
    try {
      // Favicons
      if (!document.querySelector('link[href*="favicon-120"]')) {
        var head = document.head || document.getElementsByTagName('head')[0];
        function addIcon(href, sizes, rel) {
          var l = document.createElement('link');
          l.rel = rel || 'icon';
          l.type = 'image/png';
          if (sizes) l.sizes = sizes;
          l.href = href;
          head.appendChild(l);
        }
        addIcon('/favicon.png', '32x32');
        addIcon('/favicon-120.png', '120x120');
        addIcon('/favicon-144.png', '144x144');
        addIcon('/apple-touch-icon.png', null, 'apple-touch-icon');
      }
      // Nav: Intelligence → n.ai
      document.querySelectorAll('a[href*="intelligence"]').forEach(function (a) {
        if (/intelligence/i.test(a.textContent) || a.textContent.trim() === 'Intelligence') {
          a.textContent = 'n.ai';
        }
      });
      // Footer: Север Оператив
      if (!document.querySelector('a[href*="alarm.nexusroleplay"]') && document.body) {
        var foot = document.querySelector('footer') || document.createElement('footer');
        if (!foot.parentNode) {
          foot.style.cssText = 'margin:28px auto 20px;width:min(1100px,calc(100% - 24px));padding:16px 18px;border-radius:16px;text-align:center;font-size:13px;color:#9b93b3;background:linear-gradient(165deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(24px)';
          document.body.appendChild(foot);
        }
        var bar = document.createElement('div');
        bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px 20px;justify-content:center;align-items:center;margin-top:12px';
        bar.innerHTML = '<a href="https://alarm.nexusroleplay.ru" target="_blank" rel="noopener" style="color:#7dd3fc;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#37FFD0;box-shadow:0 0 8px #37FFD0"></span>Север Оператив</a>'
          + '<a href="/m/nexus/intelligence.html" style="color:#c4b5fd;font-weight:600;text-decoration:none">n.ai</a>';
        foot.appendChild(bar);
      }
    } catch (e) {}
  }

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
      if (card.closest && card.closest('.top')) return;
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
    patchUI();
    var path = location.pathname || '';
    if (path.indexOf('adminroleplay') !== -1) return;
    if (path.indexOf('not-approved') !== -1) {
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
