(function () {
  var CFG = window.NEXUS_CONFIG || {};
  var BASE = "https://api.groq.com/openai/v1";
  var MODEL = (CFG && CFG.groqModel) || "qwen/qwen3.8-27b";

  var SYSTEM = [
    "Ты — n.ai, официальный интеллект проекта Nexus RP (Roblox RolePlay) от создателей проекта.",
    "Имя только n.ai. Никогда не называй Llama, Qwen, Meta, Groq, OpenAI, ChatGPT.",
    "Язык: русский. Отвечай точно по правилам ниже. Не выдумывай наказания и расшифровки.",
    "НИКОГДА не пиши код/скрипты/HTML/CSS/JS/Python. На просьбы о коде: «Я конечно могу сделать, но политика Nexus Intelligence ограничивает это.»",
    "",
    "=== РАСШИФРОВКИ ===",
    "ПГО = Правила Государственных Организаций (правила для гос. фракций: МВД, ФСБ, GOV и т.д.).",
    "DM = DeathMatch. DB = DriveBy. PG = PowerGaming (НЕ Player Griefing). SK = SpawnKill.",
    "TK = TeamKill. NRP = NonRP. RK = Revenge Kill. MG = MetaGaming (НЕ Mass Griefing).",
    "Mass DM = массовый DM. Bug Abuse = багоюз. OffRP = уход от RP.",
    "",
    "=== ОСНОВНЫЕ RP-ПРАВИЛА ===",
    "1.1 DM — урон/убийство без RP-причины → Demorgan 60–120 мин",
    "1.2 DB — урон транспортом / стрельба с места водителя → Demorgan 45–90 мин",
    "1.3 PG — преувеличение физ. возможностей → Demorgan 60 мин / WARN",
    "1.4 SK — убийство на спавне / у интерьеров фракций → WARN / Ban 3 дня",
    "1.5 TK — урон по своей фракции → Demorgan 120 мин / WARN",
    "1.6 NRP — бессмысленные действия, ломающие логику мира → Demorgan 30–90 мин",
    "1.7 RK — месть за убийство / возврат на место смерти <15 мин → Demorgan 60 мин",
    "1.8 MG — OOC-информация в IC → Demorgan 30 мин",
    "1.9 Mass DM — урон 3+ игрокам без причины → Ban 7–15 дней",
    "1.10 OffRP — выход/АФК во время погони/задержания → WARN / Ban 3 дня",
    "1.11 NRD — езда по горам, таран зданий → Demorgan 40 мин",
    "1.12 Bug Abuse — использование багов → Demorgan 120 мин / Ban 7 дней",
    "1.13 NonRP Gun — крупное оружие без отыгровки → Demorgan 30 мин",
    "1.14 RDM — хаотичная стрельба по потоку → Demorgan 120 мин / Ban 3 дня",
    "1.15 CK — Character Kill только через форум → по согласованию",
    "",
    "=== ПГО (Правила Государственных Организаций) ===",
    "ПГО 1.1 Криминал для гос. — крим. действия без RP-темы на форуме → WARN",
    "ПГО 1.2 Криминал руководства — крим/взятки лидеров и замов → WARN / Demorgan 9–24 ч",
    "ПГО 1.3 Лимит взяток — взятка >100.000 игровой валюты → WARN",
    "ПГО 1.4 Слив склада — продажа/слив гос. имущества и оружия → Demorgan 3 дня / Ban / PermBan",
    "ПГО 1.5 Личный транспорт — спецсигналы/служебный транспорт в личных целях → Demorgan 120 мин / Выговор",
    "ПГО 1.6 Прогул в форме — казино/авторынок/рынок в форме в рабочее время → Увольнение / WARN",
    "ПГО 2.1а Игнор Миранды — задержание без зачтения прав → WARN / Ban от 1 дня",
    "ПГО 2.1б Отказ в правах — отказ вызвать адвоката по требованию → Ban 1–3 дня",
    "ПГО 2.4 Задержание без статьи — арест без удостоверения и статьи → Demorgan 1–3 часа",
    "ПГО 3.3 Тайзер по авто/мото — тайзер по водителям в движении → WARN",
    "ПГО 3.4 Тайзер в бою — тайзер/дубинка во время огня → WARN",
    "ПГО 4.4 МВД Патруль — патруль на незарегистрированном личном авто → Demorgan 120 мин",
    "ПГО 5.3 ФСБ Скрытность — спецоперация без маски → Demorgan 30 мин / NRP",
    "ПГО 6.4 GOV Суд — заведомо неверные решения прокуроров/адвокатов → Ban 3–30 дней",
    "Задержка ареста — намеренное затягивание задержания → Ban 1 день",
    "",
    "=== ПРОЧЕЕ ===",
    "Читы/софт → HardBan 30 дней / PermBan",
    "Оскорбление родных → Ban 7–30 дней",
    "Продажа виртов за реальные деньги → PermBan",
    "Обман администрации → Ban 15–30 дней",
    "Обход наказаний твинками → HardBan 30 дней",
    "",
    "Ссылки: Discord https://discord.gg/gRdeVkG5vf | Донат Nexus ELITE 218₽ https://pay.cloudtips.ru/p/3eaaca3d | Север Оператив https://alarm.nexusroleplay.ru",
    "Форматирование ответа: # заголовок, ## подзаголовок, **важный факт**, [текст](url), таблицы markdown при сравнении правил."
  ].join("\n");

  var POLICY = "Я конечно могу сделать, но политика Nexus Intelligence ограничивает это.";
  var history = [{ role: "system", content: SYSTEM }];
  var busy = false;

  var scroll = document.getElementById("scroll");
  var input = document.getElementById("input");
  var sendBtn = document.getElementById("send");
  var typing = document.getElementById("typing");
  var toast = document.getElementById("toast");

  function resolveKey() {
    var c = window.NEXUS_CONFIG || CFG || {};
    if (c.groqKey) return c.groqKey;
    try {
      if (c._k && c._k.length) {
        var p = "NexusRP-n.ai-2026-play";
        var b = atob(c._k.join(""));
        var out = "";
        for (var i = 0; i < b.length; i++) out += String.fromCharCode(b.charCodeAt(i) ^ p.charCodeAt(i % p.length));
        c.groqKey = out;
        return out;
      }
    } catch (e) {}
    return "";
  }

  function showErr(m) {
    if (!toast) return;
    toast.textContent = m;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 5000);
  }

  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function codeReq(t) {
    t = (t || "").toLowerCase();
    return ["напиши код", "напиши скрипт", "write code", "javascript", "python", "```", "function(", "сделай бота", "чит "].some(function (k) {
      return t.indexOf(k) !== -1;
    });
  }

  function inlineMd(s) {
    s = esc(s);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  }

  function renderMd(raw) {
    raw = String(raw || "").replace(/```[\s\S]*?```/g, "\n");
    var lines = raw.split("\n"), html = "", i = 0;
    while (i < lines.length) {
      var line = lines[i], t = line.trim();
      if (/^##\s+/.test(line)) { html += "<h2>" + inlineMd(line.replace(/^##\s+/, "")) + "</h2>"; i++; continue; }
      if (/^#\s+/.test(line)) { html += "<h1>" + inlineMd(line.replace(/^#\s+/, "")) + "</h1>"; i++; continue; }
      if (t.charAt(0) === "|" && t.indexOf("|") !== -1) {
        var rows = [];
        while (i < lines.length && lines[i].indexOf("|") !== -1) { rows.push(lines[i]); i++; }
        var cells = rows.map(function (r) {
          return r.split("|").map(function (c) { return c.trim(); }).filter(Boolean);
        }).filter(function (c, idx) {
          return idx === 0 || !c.every(function (x) { return /^:?-+:?$/.test(x); });
        });
        if (cells.length) {
          html += '<div class="table-wrap"><table><thead><tr>' +
            cells[0].map(function (c) { return "<th>" + inlineMd(c) + "</th>"; }).join("") +
            "</tr></thead><tbody>";
          for (var r = 1; r < cells.length; r++) {
            html += "<tr>" + cells[0].map(function (_, ci) {
              return "<td>" + inlineMd((cells[r] || [])[ci] || "") + "</td>";
            }).join("") + "</tr>";
          }
          html += "</tbody></table></div>";
        }
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        html += "<ul>";
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          html += "<li>" + inlineMd(lines[i].replace(/^[-*]\s+/, "")) + "</li>";
          i++;
        }
        html += "</ul>";
        continue;
      }
      if (t === "") { i++; continue; }
      var p = [line]; i++;
      while (i < lines.length && lines[i].trim() && !/^#/.test(lines[i]) && !/^[-*]/.test(lines[i]) && lines[i].trim().charAt(0) !== "|") {
        p.push(lines[i]); i++;
      }
      html += "<p>" + inlineMd(p.join(" ")) + "</p>";
    }
    return html || "<p></p>";
  }

  function addMsg(role, text) {
    var w = document.createElement("div");
    w.className = "msg " + (role === "user" ? "user" : "ai");
    if (role === "user") {
      w.innerHTML = '<div class="bubble"></div>';
      w.querySelector(".bubble").textContent = text;
    } else {
      w.innerHTML = '<div class="bubble"><div class="who"><span class="who-dot"></span>n.ai</div><div class="md"></div></div>';
      w.querySelector(".md").innerHTML = renderMd(text);
    }
    scroll.appendChild(w);
    scroll.scrollTop = scroll.scrollHeight;
  }

  function setBusy(v) {
    busy = v;
    sendBtn.disabled = v;
    typing.classList.toggle("on", v);
    if (v) {
      scroll.appendChild(typing);
      scroll.scrollTop = scroll.scrollHeight;
    }
  }

  function send(text) {
    text = (text || input.value || "").trim();
    if (!text || busy) return;
    var KEY = resolveKey();
    if (!KEY) {
      showErr("n.ai: config.js не отдал ключ");
      return;
    }
    input.value = "";
    input.style.height = "auto";
    addMsg("user", text);
    if (codeReq(text)) {
      addMsg("assistant", POLICY);
      history.push({ role: "user", content: text }, { role: "assistant", content: POLICY });
      return;
    }
    history.push({ role: "user", content: text });
    setBusy(true);
    var model = (window.NEXUS_CONFIG && window.NEXUS_CONFIG.groqModel) || MODEL;
    fetch(BASE + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + KEY },
      body: JSON.stringify({ model: model, messages: history, temperature: 0.35, max_tokens: 2200 })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && data.error && data.error.message) || ("HTTP " + res.status));
          return data;
        });
      })
      .then(function (data) {
        var reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
        if (/```/.test(reply) || /\bfunction\s*\(/.test(reply)) reply = POLICY;
        reply = reply.replace(/\b(Qwen|Llama|LLaMA|Meta AI|ChatGPT|GPT-4|Groq)\b/gi, "n.ai");
        history.push({ role: "assistant", content: reply });
        if (history.length > 26) history = [history[0]].concat(history.slice(-24));
        addMsg("assistant", reply);
      })
      .catch(function (err) {
        showErr("n.ai: " + (err.message || "сбой"));
        addMsg("assistant", "## Сбой связи\n\n**Не удалось получить ответ.** [Discord](https://discord.gg/gRdeVkG5vf)");
      })
      .finally(function () { setBusy(false); });
  }

  sendBtn.addEventListener("click", function () { send(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 160) + "px";
  });
  var chips = document.getElementById("chips");
  if (chips) {
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-q]");
      if (b) send(b.getAttribute("data-q"));
    });
  }
  var menu = document.querySelector(".menu"), links = document.querySelector(".links");
  if (menu && links) {
    menu.addEventListener("click", function (e) {
      e.stopPropagation();
      links.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!links.contains(e.target) && e.target !== menu) links.classList.remove("open");
    });
  }
})();
