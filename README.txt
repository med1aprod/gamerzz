NEXUS RP — обновлённый сайт (Vercel)

Файлы:
- index.html     — главная
- donate.html    — донат (один: https://pay.cloudtips.ru/p/3eaaca3d)
- discord.html   — Discord (https://discord.gg/gRdeVkG5vf)
- rules.html     — правила (на основе pl-ay-nexus)
- news.html      — новости
- team.html      — команда
- faq.html       — FAQ
- logo.png       — логотип
- bg-3d.png      — пример фона (не обязателен, фон сделан CSS)

Что улучшено:
• Современные шрифты: Outfit + Space Grotesk
• Настоящий glass (blur + saturate + specular inset highlights)
• Анимированный вертикальный 3D-фон в акцентных цветах (фиолетовый → синий → бирюзовый)
• Больше золота и анимаций
• Логотип в шапке
• Мобильное меню
• Всё влезает и адаптивно

КАК ОБНОВИТЬ САЙТ НА VERCEL БЕЗ СОЗДАНИЯ НОВОГО ПРОЕКТА:

Вариант 1 (рекомендуется, через Git):
1. Открой папку своего проекта локально (ту, что уже подключена к Vercel).
2. Замени все HTML-файлы и добавь logo.png.
3. git add .
4. git commit -m "Update Nexus RP site design"
5. git push
Vercel автоматически задеплоит изменения.

Вариант 2 (через Dashboard Vercel):
1. Зайди в vercel.com → свой проект.
2. Deployments → найди последний → или Settings → Git.
3. Если проект без Git: используй CLI:
   npx vercel --prod
   (из папки с новыми файлами, выбери существующий проект).

Вариант 3 (drag & drop):
1. В Vercel открой проект → Deployments → "Redeploy" или создай новый deployment, загрузив zip/папку.
2. Лучше подключить GitHub/GitLab репозиторий один раз — дальше просто пуши.

После деплоя проверь:
- logo.png загружен рядом с HTML
- ссылки Discord и доната работают
- сайт открывается на телефоне

