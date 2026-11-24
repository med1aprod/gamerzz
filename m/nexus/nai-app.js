(function(){
  var CFG=window.NEXUS_CONFIG||{};
  var BASE="https://api.groq.com/openai/v1";
  var MODEL=(CFG&&CFG.groqModel)||"llama-3.3-70b-versatile";
  var SYSTEM="Ты — n.ai, официальный интеллект Nexus RP от создателей проекта. Только имя n.ai. Никогда не называй Llama, Qwen, Meta, Groq, OpenAI. Русский язык. НИКОГДА не пиши код/скрипты/HTML/CSS/JS/Python. На такие просьбы: «Я конечно могу сделать, но политика Nexus Intelligence ограничивает это.» Правила: DM 60–120 demorgan; DB 45–90; PG 60/WARN; SK WARN/Ban 3д; TK 120/WARN; NRP 30–90; RK 60; MG 30; Mass DM Ban 7–15; Bug Abuse 120/Ban 7. Discord https://discord.gg/gRdeVkG5vf Донат https://pay.cloudtips.ru/p/3eaaca3d 218₽. Север Оператив https://alarm.nexusroleplay.ru. Разметка: # ## **факт** [текст](url) таблицы.";
  var POLICY="Я конечно могу сделать, но политика Nexus Intelligence ограничивает это.";
  var history=[{role:"system",content:SYSTEM}], busy=false;
  var scroll=document.getElementById("scroll"), input=document.getElementById("input"), sendBtn=document.getElementById("send"), typing=document.getElementById("typing"), toast=document.getElementById("toast");

  function resolveKey(){
    var c=window.NEXUS_CONFIG||CFG||{};
    if(c.groqKey) return c.groqKey;
    try{
      if(c._k&&c._k.length){
        var p="NexusRP-n.ai-2026-play";
        var b=atob(c._k.join(""));
        var out="";
        for(var i=0;i<b.length;i++) out+=String.fromCharCode(b.charCodeAt(i)^p.charCodeAt(i%p.length));
        c.groqKey=out;
        return out;
      }
    }catch(e){}
    return "";
  }

  function showErr(m){toast.textContent=m;toast.classList.add("show");setTimeout(function(){toast.classList.remove("show");},4800);}
  function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function codeReq(t){t=(t||"").toLowerCase();return ["напиши код","напиши скрипт","write code","javascript","python","```","function(","сделай бота","чит "].some(function(k){return t.indexOf(k)!==-1;});}
  function inlineMd(s){s=esc(s);s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');s=s.replace(/\*\*(.+?)\*\*/g,'<span class="hl">$1</span>');s=s.replace(/`([^`]+)`/g,"<code>$1</code>");return s;}
  function renderMd(raw){
    raw=String(raw||"").replace(/```[\s\S]*?```/g,"\n");
    var lines=raw.split("\n"),html="",i=0;
    while(i<lines.length){
      var line=lines[i],t=line.trim();
      if(/^##\s+/.test(line)){html+="<h2>"+inlineMd(line.replace(/^##\s+/,""))+"</h2>";i++;continue;}
      if(/^#\s+/.test(line)){html+="<h1>"+inlineMd(line.replace(/^#\s+/,""))+"</h1>";i++;continue;}
      if(t.charAt(0)==="|"&&t.indexOf("|")!==-1){var rows=[];while(i<lines.length&&lines[i].indexOf("|")!==-1){rows.push(lines[i]);i++;}
        var cells=rows.map(function(r){return r.split("|").map(function(c){return c.trim();}).filter(Boolean);}).filter(function(c,idx){return idx===0||!c.every(function(x){return/^:?-+:?$/.test(x);});});
        if(cells.length){html+='<div class="table-wrap"><table><thead><tr>'+cells[0].map(function(c){return"<th>"+inlineMd(c)+"</th>";}).join("")+"</tr></thead><tbody>";
          for(var r=1;r<cells.length;r++){html+="<tr>"+cells[0].map(function(_,ci){return"<td>"+inlineMd((cells[r]||[])[ci]||"")+"</td>";}).join("")+"</tr>";}
          html+="</tbody></table></div>";}
        continue;}
      if(/^[-*]\s+/.test(line)){html+="<ul>";while(i<lines.length&&/^[-*]\s+/.test(lines[i])){html+="<li>"+inlineMd(lines[i].replace(/^[-*]\s+/,""))+"</li>";i++;}html+="</ul>";continue;}
      if(t===""){i++;continue;}
      var p=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^#/.test(lines[i])&&!/^[-*]/.test(lines[i])&&lines[i].trim().charAt(0)!=="|"){p.push(lines[i]);i++;}
      html+="<p>"+inlineMd(p.join(" "))+"</p>";
    }
    return html||"<p></p>";
  }
  function addMsg(role,text){
    var w=document.createElement("div");w.className="msg "+(role==="user"?"user":"ai");
    if(role==="user"){w.innerHTML='<div class="bubble"></div>';w.querySelector(".bubble").textContent=text;}
    else{w.innerHTML='<div class="bubble"><div class="who">n.ai</div><div class="md"></div></div>';w.querySelector(".md").innerHTML=renderMd(text);}
    scroll.appendChild(w);scroll.scrollTop=scroll.scrollHeight;
  }
  function setBusy(v){busy=v;sendBtn.disabled=v;typing.classList.toggle("on",v);if(v){scroll.appendChild(typing);scroll.scrollTop=scroll.scrollHeight;}}
  function send(text){
    text=(text||input.value||"").trim();if(!text||busy)return;
    var KEY=resolveKey();
    if(!KEY){showErr("n.ai: config.js не отдал ключ. Проверь /config.js на сайте.");return;}
    input.value="";input.style.height="auto";
    addMsg("user",text);
    if(codeReq(text)){addMsg("assistant",POLICY);history.push({role:"user",content:text},{role:"assistant",content:POLICY});return;}
    history.push({role:"user",content:text});setBusy(true);
    var model=(window.NEXUS_CONFIG&&window.NEXUS_CONFIG.groqModel)||MODEL;
    fetch(BASE+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+KEY},body:JSON.stringify({model:model,messages:history,temperature:0.5,max_tokens:1800})})
    .then(function(res){return res.json().then(function(data){if(!res.ok)throw new Error((data&&data.error&&data.error.message)||("HTTP "+res.status));return data;});})
    .then(function(data){
      var reply=(data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content)||"";
      if(/```/.test(reply)||/\bfunction\s*\(/.test(reply)) reply=POLICY;
      reply=reply.replace(/\b(Qwen|Llama|LLaMA|Meta AI|ChatGPT|GPT-4|Groq)\b/gi,"n.ai");
      history.push({role:"assistant",content:reply});if(history.length>24)history=[history[0]].concat(history.slice(-22));
      addMsg("assistant",reply);
    }).catch(function(err){showErr("n.ai: "+(err.message||"сбой"));addMsg("assistant","## Сбой связи\n\n**Не удалось получить ответ.** [Discord](https://discord.gg/gRdeVkG5vf)");})
    .finally(function(){setBusy(false);});
  }
  sendBtn.addEventListener("click",function(){send();});
  input.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}});
  document.getElementById("chips").addEventListener("click",function(e){var b=e.target.closest("button[data-q]");if(b)send(b.getAttribute("data-q"));});
  var menu=document.querySelector(".menu"),links=document.querySelector(".links");
  if(menu&&links){menu.addEventListener("click",function(e){e.stopPropagation();links.classList.toggle("open");});document.addEventListener("click",function(e){if(!links.contains(e.target)&&e.target!==menu)links.classList.remove("open");});}
})();
