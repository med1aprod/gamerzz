(function () {
  'use strict';
  var CFG = window.NEXUS_CONFIG || {};
  var API = CFG.apiUrl || '';

  function injectSeo() {
    try {
      if (document.querySelector('meta[data-nexus-seo]')) return;
      var head = document.head || document.getElementsByTagName('head')[0];
      if (!head) return;
      var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
      var map = {
        '/': {
          title: 'Nexus RP — Roblox RolePlay сервер | Официальный сайт',
          desc: 'Nexus RP — премиальный Roblox RolePlay проект. Правила, донат, Discord, новости, n.ai помощник. RolePlay сервер с живым сообществом.',
          kw: 'Nexus RP, Roblox RP, Roblox RolePlay, ролекс рп, роблокс рп сервер, nexus roleplay, nexusroleplay, ролевая игра roblox, правила рп, demorgan, roblox россия'
        },
        '/index.html': {
          title: 'Nexus RP — Roblox RolePlay сервер | Официальный сайт',
          desc: 'Nexus RP — премиальный Roblox RolePlay проект. Правила, донат, Discord, новости, n.ai помощник.',
          kw: 'Nexus RP, Roblox RP, Roblox RolePlay, ролекс рп, nexus roleplay'
        },
        '/rules.html': {
          title: 'Правила Nexus RP — RP, ПГО, наказания | Roblox RolePlay',
          desc: 'Официальные правила Nexus RP: DM, DB, PG, SK, TK, NRP, RK, MG, Mass DM, Bug Abuse. ПГО и форум наказаний.',
          kw: 'правила nexus rp, demorgan, spawnkill, deathmatch, powergaming, roblox rp правила'
        },
        '/donate.html': {
          title: 'Донат Nexus ELITE — поддержка Nexus RP | Roblox',
          desc: 'Поддержать Roblox-проект Nexus RP. Пакет Nexus ELITE через CloudTips. Инструкция по оплате 218 ₽.',
          kw: 'донат nexus rp, nexus elite, cloudtips, поддержать сервер roblox'
        },
        '/discord.html': {
          title: 'Discord Nexus RP — сообщество Roblox RolePlay',
          desc: 'Официальный Discord Nexus RP: новости, анонсы, поддержка, общение игроков Roblox RolePlay.',
          kw: 'discord nexus rp, роблокс дискорд, nexus roleplay discord'
        },
        '/news.html': {
          title: 'Новости Nexus RP — обновления Roblox RolePlay',
          desc: 'Официальные новости и анонсы проекта Nexus RP.',
          kw: 'новости nexus rp, обновления roblox rp'
        },
        '/team.html': {
          title: 'Команда Nexus RP — администрация проекта',
          desc: 'Команда Nexus RP: основатели, совет директоров, разработка и PR.',
          kw: 'команда nexus rp, администрация roblox rp'
        },
        '/faq.html': {
          title: 'FAQ Nexus RP — частые вопросы Roblox RolePlay',
          desc: 'Ответы на частые вопросы о Nexus RP: Discord, донат, правила, n.ai, Север Оператив.',
          kw: 'faq nexus rp, вопросы roblox roleplay'
        },
        '/m/nexus/intelligence.html': {
          title: 'n.ai — Nexus Intelligence | ИИ-помощник Nexus RP',
          desc: 'n.ai — официальный интеллект Nexus RP. Правила, наказания, донат, Discord. Помощник по проекту.',
          kw: 'n.ai, nexus intelligence, ии nexus rp, помощник roblox rp'
        }
      };
      var page = map[path] || map[path + '.html'] || map['/'];
      if (path.indexOf('intelligence') !== -1) page = map['/m/nexus/intelligence.html'];
      var origin = location.origin || 'https://play.nexusroleplay.ru';
      var url = origin + (path === '/' ? '/' : path);
      var img = origin + '/favicon-144.png';

      function add(attr, key, val) {
        if (!val) return;
        var m = document.createElement('meta');
        m.setAttribute('data-nexus-seo', '1');
        if (attr === 'name') m.setAttribute('name', key);
        else m.setAttribute('property', key);
        m.setAttribute('content', val);
        head.appendChild(m);
      }

      if (page.title && !document.querySelector('title')) {
        var t = document.createElement('title');
        t.textContent = page.title;
        head.appendChild(t);
      } else if (page.title && document.title && document.title.length < 12) {
        document.title = page.title;
      }

      add('name', 'description', page.desc);
      add('name', 'keywords', page.kw);
      add('name', 'author', 'Nexus RP');
      add('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      add('name', 'googlebot', 'index, follow');
      add('name', 'yandex', 'index, follow');
      add('name', 'language', 'Russian');
      add('name', 'revisit-after', '3 days');
      add('name', 'rating', 'general');
      add('name', 'theme-color', '#05040a');
      add('name', 'msapplication-TileColor', '#05040a');
      add('name', 'application-name', 'Nexus RP');
      add('name', 'apple-mobile-web-app-title', 'Nexus RP');
      add('name', 'apple-mobile-web-app-capable', 'yes');
      add('name', 'format-detection', 'telephone=no');
      add('name', 'geo.region', 'RU');
      add('name', 'geo.placename', 'Russia');

      // Open Graph
      add('property', 'og:type', 'website');
      add('property', 'og:locale', 'ru_RU');
      add('property', 'og:site_name', 'Nexus RP');
      add('property', 'og:title', page.title);
      add('property', 'og:description', page.desc);
      add('property', 'og:url', url);
      add('property', 'og:image', img);
      add('property', 'og:image:width', '144');
      add('property', 'og:image:height', '144');
      add('property', 'og:image:alt', 'Nexus RP — Roblox RolePlay');

      // Twitter / X
      add('name', 'twitter:card', 'summary');
      add('name', 'twitter:title', page.title);
      add('name', 'twitter:description', page.desc);
      add('name', 'twitter:image', img);

      // Yandex
      add('name', 'yandex-verification', '');
      var ya = document.createElement('meta');
      ya.setAttribute('data-nexus-seo', '1');
      ya.setAttribute('name', 'viewport');
      // skip duplicate viewport

      // JSON-LD
      if (!document.getElementById('nexus-jsonld')) {
        var ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.id = 'nexus-jsonld';
        ld.setAttribute('data-nexus-seo', '1');
        ld.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Nexus RP',
          'alternateName': ['Nexus RolePlay', 'NexusRP', 'Нексус РП'],
          'url': origin + '/',
          'description': page.desc,
          'inLanguage': 'ru-RU',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': origin + '/rules.html?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Nexus RP',
            'url': origin + '/',
            'logo': { '@type': 'ImageObject', 'url': img },
            'sameAs': ['https://discord.gg/gRdeVkG5vf', 'https://alarm.nexusroleplay.ru']
          }
        });
        head.appendChild(ld);
      }

      var can = document.querySelector('link[rel="canonical"]');
      if (!can) {
        can = document.createElement('link');
        can.rel = 'canonical';
        can.href = url;
        can.setAttribute('data-nexus-seo', '1');
        head.appendChild(can);
      }
    } catch (e) {}
  }

  function patchUI() {
    try {
      injectSeo();
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
      document.querySelectorAll('a[href*="intelligence"]').forEach(function (a) {
        if (/intelligence/i.test(a.textContent) || a.textContent.trim() === 'Intelligence') {
          a.textContent = 'n.ai';
        }
      });
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
