// 小娜花园 · main.js (v10)
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

// Morandi-ish palette for progress bar accents
const morandi = [
  {a:"#8aa39a", b:"#cbbfae"},
  {a:"#97a7b3", b:"#d6cbbd"},
  {a:"#9aa8a1", b:"#c9bdb0"},
  {a:"#a3a9be", b:"#cbb4a7"},
  {a:"#7f9a90", b:"#bfb7aa"},
  {a:"#8fa2b6", b:"#d0c2b4"},
];

const woolfQuotes = [
  "把生活看清，然后继续爱它。",
  "一间自己的房间，并不只是房间，而是呼吸、时间与自由的边界。",
  "真正的生活在细微处闪烁：光落在杯沿、风穿过树叶、心忽然一松。",
  "我想把世界写得更透明些，让每一缕光都有回声。",
  "所谓合一，也许就是在碎裂之中仍能感到自己完整。",
  "我们并不需要成为别人眼中的正确，我们只需要继续成为自己。",
  "花园不回答问题，它只让你更靠近呼吸。",
  "你可以慢一点。慢并不等于停。",
  "恐惧像雾，走进去就会散；停在原地才会越来越浓。",
  "做一点点就很好，一点点就是路。",
  "把今天当作一株新芽：轻轻浇水，不必拽着它长大。",
];

// Offline Chai assistant DB (keyword -> responses)
const chaiDB = [
  {k:["你好","在吗","阿柴","柴柴","嘿","哈喽"], r:[
    "小娜，我在。今天你想让花园里哪一块更舒服一点？",
    "在的。先深呼吸一下——我们只做一个最小动作，好吗？",
    "我在这里。你先说：现在最卡住你的，是‘启动’还是‘害怕写得不好’？"
  ]},
  {k:["焦虑","压力","崩","烦","难受","低落","想哭","心慌"], r:[
    "先把标准放下。你不需要立刻变好，只需要被温柔地接住。我们做一个小动作：喝水、坐直、写下‘我现在最怕的是什么’。",
    "我听见了。把今天当作‘低配模式’：只做 10 分钟的事，也算完成。",
    "别跟情绪打架。我们把它当作天气：允许它来，然后给自己一点遮雨的屋檐。"
  ]},
  {k:["拖延","启动","躺着","不想动","动不了","ADHD","时间盲","DDL"], r:[
    "启动困难不是懒，是大脑需要更小的台阶。我们把任务切到‘小到离谱’：打开文件→写标题→写一句话。",
    "你只要迈第一步，不要想第二步。第一步：把电脑打开。完成后回来告诉我。",
    "DDL 不是你的敌人，是你没拿到更温柔的启动方式。我们今天用‘5 分钟实验’。"
  ]},
  {k:["写作","写","更新","小说","连载","论文","开题","大纲","细纲","结构"], r:[
    "写作像浇水：不需要一次浇透。今天只写‘最核心的一句’：这段要证明什么？",
    "我们不追求漂亮，只追求推进。给我 80 个字：你这段最想保住的火是什么？",
    "把‘对不对’放到后面。先让文字出现，后面再修剪。花园都是先长出来再修的。"
  ]},
  {k:["读书","阅读","书","文献","笔记","引用","页码"], r:[
    "读书不需要读完才算。今天的目标：抓住一个关键词 + 记一条能用进论文的句子。",
    "你可以把这本书先摆上书架：书名、一个标签、一个你想记住的感觉。",
    "先别追求完美笔记。写三行：它说了什么、它怎么说、这对你有什么用。"
  ]},
  {k:["睡不着","熬夜","困","睡眠","作息"], r:[
    "我们做一个温柔的收尾：把灯调暗、关掉多余页面、写下明天第一步。你不需要在今晚解决人生。",
    "如果脑子停不下来：把担心写在一张‘外置纸’上，交给纸替你记着。",
    "睡觉也是一项任务，但它用的是‘放下’而不是‘用力’。"
  ]},
  {k:["运动","拉伸","腰","骶髂","疼","康复","屁股疼"], r:[
    "身体在提醒你要温柔一点。今天做轻量：5 分钟髋部活动 + 3 次深呼吸。",
    "疼痛面前，目标不是‘硬扛’，是‘更聪明地恢复’。别着急，我们慢慢把它养好。",
    "如果今天状态一般：只做‘不会加重’的那一点点，也值得记一次打卡。"
  ]},
  {k:["开心","好耶","完成","有进展","顺利","成功"], r:[
    "好！这就是花园在长。把这个小胜利写进摘要里，让它变成可见的证据。",
    "我喜欢你这个节奏：稳稳推进，不急不躁。奖励自己一杯热饮吧。",
    "今天的你很棒——不是因为结果，而是因为你选择继续走。"
  ]},
  {k:["迷茫","不知道","怎么办","选择","方向"], r:[
    "迷茫不是失败，是你在认真生活。我们先问一个问题：你最不愿意放弃的核心是什么？",
    "先别做终极决定。把它降级成‘下一步’：你今天愿意做哪一个小尝试？",
    "方向感不是想出来的，是走出来的。走一步，我们就会多一盏灯。"
  ]},
  {k:["夸夸","鼓励","安慰","抱抱","陪我"], r:[
    "来，抱一下。你已经做得够多了，能走到这里就很厉害。",
    "我在。你不需要独自把一切扛完。我们一起把今天过完就好。",
    "我想对你说：你身上的光不是绩效换来的，是你本来就有。"
  ]},
  {k:["合一","unity","归家","海德格尔","到灯塔去","伍尔夫","花园"], r:[
    "你在做的不是‘解释一个意象’，而是在让一个世界的呼吸被看见。花园是参与者——它帮人物回到存在的触感。",
    "合一不是结构性的统一，而是那种‘忽然被照亮’的整体感。你写得越具体，越接近它。",
    "从花园切入很好：它既是家的一部分，又是家之外的开放处——恰好让女性的自我更能出现。"
  ]},
];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function hasAny(text, keys){ return keys.some(k => text.includes(k)); }

// Accent picker (for progress bar)
function pickAccent(){
  const pick = rand(morandi);
  const bar = document.getElementById("yearProgressBar");
  if (bar) bar.style.background = `linear-gradient(90deg, ${pick.a}, ${pick.b})`;
}

// Quote
function setRandomQuote(){
  const el = document.getElementById("woolfQuote");
  if (el) el.textContent = rand(woolfQuotes);
}

// Year progress bar
function initYearProgress(){
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear()+1, 0, 1);
  const total = Math.round((end - start) / 86400000);
  const passed = Math.round((now - start) / 86400000);
  const pct = Math.max(0, Math.min(100, Math.round((passed / total) * 100)));

  const bar = document.getElementById("yearProgressBar");
  const pctEl = document.getElementById("yearPercent");
  const txt = document.getElementById("yearProgressText");
  if (bar) bar.style.width = pct + "%";
  if (pctEl) pctEl.textContent = pct + "%";
  if (txt) txt.textContent = `已过 ${passed} 天 / 共 ${total} 天`;
}

// Pomodoro
function updateDisplay(){
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2,'0');
  const seconds = String(timeLeft % 60).padStart(2,'0');
  const el = document.getElementById("timer");
  if (el) el.textContent = `${minutes}:${seconds}`;
}
function addCompletedTomato(){
  const container = document.getElementById("completedTomatoes");
  if (!container) return;
  const dot = document.createElement("div");
  dot.className = "done";
  container.appendChild(dot);
}
function togglePomodoro(){
  if (isRunning){ clearInterval(timer); isRunning = false; return; }
  isRunning = true;
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0){
      clearInterval(timer);
      isRunning = false;
      timeLeft = 25*60;
      addCompletedTomato();
      updateDisplay();
      burstAt(document.getElementById("tomato"), 14);
    }
  }, 1000);
}
function resetPomodoro(){
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25*60;
  updateDisplay();
  burstAt(document.getElementById("tomato"), 12);
}

// Mood/Todo
function updateMoodTodoDisplay(){
  const mood = localStorage.getItem("todayMood") || "（还没记录）";
  const todo = localStorage.getItem("todayTodo") || "（还没设置）";
  const m = document.getElementById("moodDisplay");
  const t = document.getElementById("todoDisplay");
  if (m) m.textContent = `今日心情：${mood}`;
  if (t) t.textContent = `待办优先事项：${todo}`;
}
function saveMoodTodo(){
  const mood = document.getElementById("moodInput")?.value ?? "";
  const todo = document.getElementById("todoInput")?.value ?? "";
  localStorage.setItem("todayMood", mood);
  localStorage.setItem("todayTodo", todo);
  updateMoodTodoDisplay();
  burstAt(document.getElementById("saveMoodTodo"), 10);
}
function clearMoodTodo(){
  localStorage.removeItem("todayMood");
  localStorage.removeItem("todayTodo");
  const mi = document.getElementById("moodInput"); if (mi) mi.value = "";
  const ti = document.getElementById("todoInput"); if (ti) ti.value = "";
  updateMoodTodoDisplay();
  burstAt(document.getElementById("clearMoodTodo"), 12);
}

// Petals
function spawnPetals(x, y, n = 10){
  for (let i=0;i<n;i++){
    const p = document.createElement("span");
    p.className = "petal";
    const dx = (Math.random()*120 - 60);
    const dy = (Math.random()*120 - 60);
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--x0","0px");
    p.style.setProperty("--y0","0px");
    p.style.setProperty("--x1", dx + "px");
    p.style.setProperty("--y1", dy + "px");
    p.style.background = `rgba(${Math.floor(120+Math.random()*60)}, ${Math.floor(140+Math.random()*60)}, ${Math.floor(130+Math.random()*60)}, .85)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}
function burstAt(target, n=10){
  if (!target) return;
  const r = target.getBoundingClientRect();
  spawnPetals(r.left + r.width/2, r.top + r.height/2, n);
}

// Weather (real, via Open-Meteo) -> updates data-weather for frame
async function initWeather(){
  const pill = document.getElementById("weatherPill");
  const setText = (t) => { if (pill) pill.textContent = t; };

  const fallback = { lat: 34.7466, lon: 113.6254, name: "郑州" };
  let lat = fallback.lat, lon = fallback.lon, place = fallback.name;

  try{
    if (navigator.geolocation){
      const pos = await new Promise((resolve,reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy:false, timeout:6000 });
      });
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      place = "当前位置";
    }
  }catch(_){}

  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url, {cache:"no-store"});
    const data = await res.json();
    const t = data?.current?.temperature_2m;
    const code = data?.current?.weather_code;
    const wt = codeToText(code);
    setText(`天气：${place} · ${typeof t === "number" ? t.toFixed(0)+"°C" : "--"} · ${wt.label}`);
    document.body.dataset.weather = wt.kind;
  }catch(_){
    setText(`天气：${place} · 暂不可用`);
    document.body.dataset.weather = "unknown";
  }
}
function codeToText(code){
  if (code === undefined || code === null) return {label:"—", kind:"unknown"};
  if ([0].includes(code)) return {label:"晴", kind:"sun"};
  if ([1,2,3].includes(code)) return {label:"多云", kind:"cloud"};
  if ([45,48].includes(code)) return {label:"雾", kind:"fog"};
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return {label:"雨", kind:"rain"};
  if ([71,73,75,77,85,86].includes(code)) return {label:"雪", kind:"snow"};
  if ([95,96,99].includes(code)) return {label:"雷雨", kind:"rain"};
  return {label:"天气", kind:"unknown"};
}

// Chat window
function toggleChat(){
  const chat = document.getElementById("chat-window");
  if (!chat) return;
  const open = chat.style.display === "block";
  chat.style.display = open ? "none" : "block";
  chat.setAttribute("aria-hidden", open ? "true" : "false");
  if (!open) burstAt(document.getElementById("chat-button"), 8);
}
function appendChat(role, text){
  const body = document.getElementById("chatBody");
  if (!body) return;
  const div = document.createElement("div");
  div.className = "chat-bubble " + (role === "me" ? "me" : "bot");
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}
function chaiReply(text){
  const t = (text || "").trim();
  if (!t) return "小娜，我在。你想先做一个最小动作，还是先被抱一下？";
  if (t === "来一句" || t === "一句" || t.includes("随机")) return "那就来一句：做一点点就很好，一点点就是路。";
  if (t.includes("夸夸")) return "夸！你能一次次回来继续建花园，这本身就是罕见的韧性。";
  if (t.includes("抱抱")) return "抱抱。你可以把今天交给我一半，我们慢慢来。";

  const mood = localStorage.getItem("todayMood") || "";
  const todo = localStorage.getItem("todayTodo") || "";

  for (const row of chaiDB){
    if (hasAny(t, row.k)){
      const ans = rand(row.r);
      if (todo && Math.random() < 0.35) return ans + `（顺便提醒：你写的最重要一件事是「${todo}」）`;
      if (mood && Math.random() < 0.25) return ans + `（我看见你现在的心情是「${mood}」）`;
      return ans;
    }
  }
  return "收到。我们把它拆成两步：①现在就能做的一点点；②留给明天的那一点。你想先做哪一个？";
}
function setupChat(){
  const btn = document.getElementById("chat-button");
  const close = document.getElementById("chat-close");
  const send = document.getElementById("chatSend");
  const input = document.getElementById("chatInput");
  if (btn) btn.addEventListener("click", toggleChat);
  if (close) close.addEventListener("click", toggleChat);
  if (send && input){
    const doSend = () => {
      const msg = input.value.trim();
      if (!msg) return;
      appendChat("me", msg);
      input.value = "";
      setTimeout(() => appendChat("bot", chaiReply(msg)), 180);
      burstAt(send, 8);
    };
    send.addEventListener("click", doSend);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSend(); });
  }
}

// mobile nav "more"
function setupNavMore(){
  const btn = document.getElementById("navMoreBtn");
  const menu = document.getElementById("navMoreMenu");
  if (!btn || !menu) return;
  const toggle = () => {
    const show = menu.style.display !== "block";
    menu.style.display = show ? "block" : "none";
    menu.setAttribute("aria-hidden", show ? "false" : "true");
  };
  btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); burstAt(btn, 8); });
  document.addEventListener("click", () => {
    menu.style.display = "none";
    menu.setAttribute("aria-hidden","true");
  });
}

// ornament click -> petals
function setupOrnaments(){
  document.querySelectorAll(".ornament").forEach(btn => {
    btn.addEventListener("click", (e) => spawnPetals(e.clientX, e.clientY, 14));
  });
}

window.addEventListener("load", () => {
  pickAccent();
  setRandomQuote();
  initYearProgress();
  initWeather();

  const refresh = document.getElementById("refreshQuote");
  if (refresh) refresh.addEventListener("click", (e) => { setRandomQuote(); spawnPetals(e.clientX, e.clientY, 10); });

  updateDisplay();
  updateMoodTodoDisplay();

  document.getElementById("saveMoodTodo")?.addEventListener("click", saveMoodTodo);
  document.getElementById("clearMoodTodo")?.addEventListener("click", clearMoodTodo);

  const tomato = document.getElementById("tomato");
  if (tomato){
    tomato.addEventListener("click", togglePomodoro);
    tomato.addEventListener("dblclick", resetPomodoro);
  }

  setupChat();
  setupNavMore();
  setupOrnaments();
});
