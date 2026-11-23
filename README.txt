Nexus RP — play.nexusroleplay.ru
Repo: med1aprod/gamerzz

== Уже в репозитории ==
- Весь HTML (index, rules, donate, discord, news, team, faq, not-approved)
- config.js — Groq key обфусцирован, подставляется сам
- n.ai: /m/nexus/intelligence.html + nai-app.js
- aurora.js / aurora.css — фон + курсор (index)
- site.js — новости API, tilt, maintenance, патч меню n.ai + футер «Север Оператив» + multi-favicon links
- vercel.json rewrites (not-approved, admin, intelligence)
- robots.txt

== Залей вручную 1 раз (бинарь из zip) ==
favicon.png
favicon-120.png   (Яндекс)
favicon-144.png   (Google)
apple-touch-icon.png

Файлы лежат в локальном nexus_full_site.zip у сборки.

== Проверка ==
1. Vercel redeploy с main
2. /m/nexus/intelligence — чат n.ai
3. Меню: пункт n.ai
4. Футер: Север Оператив → alarm.nexusroleplay.ru
5. Hard maintenance → /not-approved.html
