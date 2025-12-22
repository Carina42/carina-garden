// 小娜花园 · main.js (v11)
// 目标：不拆旧功能，只加：主题选择、雨天边框真实雨丝、太阳光、导出导入、移动端更多自动收纳。

let timer;
let timeLeft = 25 * 60;
let isRunning = false;

const morandi = [
  {a:"#8aa39a", b:"#cbbfae"},
  {a:"#97a7b3", b:"#d6cbbd"},
  {a:"#9aa8a1", b:"#c9bdb0"},
  {a:"#a3a9be", b:"#cbb4a7"},
  {a:"#7f9a90", b:"#bfb7aa"},
  {a:"#8fa2b6", b:"#d0c2b4"},
  {a:"#b78f92", b:"#d6cbbd"},
  {a:"#a29b7d", b:"#d6cbbd"},
  {a:"#6f7d86", b:"#cbbfae"},
];

const themes = [
  { id:"fern",  name:"蕨绿", a:"#8aa39a", b:"#cbbfae", c:"#a7b3c1"},
  { id:"moss",  name:"苔影", a:"#7f9a90", b:"#c7bfb1", c:"#9fb0a5"},
  { id:"clay",  name:"陶土", a:"#a07f73", b:"#cbbfae", c:"#a9b1b9"},
  { id:"mist",  name:"雾蓝", a:"#8fa2b6", b:"#d0c2b4", c:"#a3a9be"},
  { id:"rose",  name:"蔷薇", a:"#b78f92", b:"#d6cbbd", c:"#9aa8a1"},
  { id:"wheat", name:"麦穗", a:"#a29b7d", b:"#d6cbbd", c:"#8fa2b6"},
  { id:"ink",   name:"墨青", a:"#6f7d86", b:"#cbbfae", c:"#97a7b3"},
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

// Theme apply
function applyTheme(themeId){
  document.body.dataset.theme = themeId;
  localStorage.setItem("xn_theme", themeId);
}
function applyNight(isNight){
  document.body.classList.toggle("night", !!isNight);
  localStorage.setItem("xn_night", isNight ? "1" : "0");
}

function buildThemeGrid(){
  const grid = document.getElementById("themeGrid");
  if (!grid) return;
  grid.innerHTML = "";
  themes.forEach(t => {
    const card = document.createElement("div");
    card.className = "theme-card sparkle";
    card.innerHTML = `
      <div class="swatches">
        <div class="sw" style="background:${t.a}"></div>
        <div class="sw" style="background:${t.b}"></div>
        <div class="sw" style="background:${t.c}"></div>
      </div>
      <div class="theme-name">${t.name}</div>
    `;
    card.addEventListener("click", () => {
      applyTheme(t.id);
      burstAt(card, 12);
      pickAccent(); // sync progress bar
      closeThemeModal();
    });
    grid.appendChild(card);
  });
}
function openThemeModal(){
  const m = document.getElementById("themeModal");
  if (!m) return;
  m.style.display = "block";
  m.setAttribute("aria-hidden","false");
}
function closeThemeModal(){
  const m = document.getElementById("themeModal");
  if (!m) return;
  m.style.display = "none";
  m.setAttribute("aria-hidden","true");
}
function setupThemeModal(){
  buildThemeGrid();
  document.getElementById("themeBtn")?.addEventListener("click", (e) => { openThemeModal(); spawnPetals(e.clientX, e.clientY, 10); });
  document.getElementById("closeTheme")?.addEventListener("click", closeThemeModal);
  document.getElementById("themeBackdrop")?.addEventListener("click", closeThemeModal);
  document.getElementById("toggleNight")?.addEventListener("click", (e) => {
    const next = !document.body.classList.contains("night");
    applyNight(next);
    spawnPetals(e.clientX, e.clientY, 10);
  });

  // load saved
  const savedTheme = localStorage.getItem("xn_theme") || "fern";
  applyTheme(savedTheme);
  const savedNight = localStorage.getItem("xn_night") === "1";
  applyNight(savedNight);
}

function setRandomQuote() {
  // 让 woolfQuotes.js 来接管，这里不再执行旧逻辑
  if(window.WoolfQuotes && window.WoolfQuotes.render) {
    window.WoolfQuotes.render("woolfQuote", "woolfQuoteSource");
  }
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

function pickAccent(){
  const pick = rand(morandi);
  const bar = document.getElementById("yearProgressBar");
  if (bar) bar.style.background = `linear-gradient(90deg, ${pick.a}, ${pick.b})`;
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

// Export/Import (解决电脑/手机不同步：用文件同步)
function exportData(){
  const payload = {
    version: "xn_garden_v11",
    time: new Date().toISOString(),
    localStorage: {}
  };
  for (let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith("xn_") || k.startsWith("today") || k.startsWith("xn_garden_") || k.startsWith("xn_garden")){
      payload.localStorage[k] = localStorage.getItem(k);
    }
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "小娜花园_数据备份.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 800);
  burstAt(document.getElementById("exportData"), 12);
}
function importData(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(String(reader.result));
      const kv = data?.localStorage || {};
      Object.keys(kv).forEach(k => localStorage.setItem(k, kv[k]));
      updateMoodTodoDisplay();
      pickAccent();
      initYearProgress();
      const savedTheme = localStorage.getItem("xn_theme") || "fern";
      applyTheme(savedTheme);
      const savedNight = localStorage.getItem("xn_night") === "1";
      applyNight(savedNight);
      setRandomQuote();
      alert("导入完成 ✅（如果你也导入了阅读/待办数据，去对应页面刷新即可）");
    }catch(e){
      alert("导入失败：文件不是正确的备份格式。");
    }
  };
  reader.readAsText(file);
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

// Weather layer effects (rain strips in border + sunlight)
function clearWeatherLayer(){
  const layer = document.getElementById("weatherLayer");
  if (!layer) return;
  layer.innerHTML = "";
}
function renderWeatherLayer(kind){
  const layer = document.getElementById("weatherLayer");
  if (!layer) return;
  layer.innerHTML = "";

  if (kind === "rain"){
    // "真实雨水一样掉下来的效果"：只在边框区域落雨（左右两条雨幕 + 上边缘少量）
    const w = window.innerWidth;
    const leftStrip = 140;
    const rightStripStart = w - 140;

    const makeDrop = (xMin, xMax) => {
      const d = document.createElement("div");
      d.className = "raindrop";
      const x = xMin + Math.random()*(xMax-xMin);
      const top = -Math.random()*400;
      const dur = 1.2 + Math.random()*1.2;
      const delay = Math.random()*1.6;
      d.style.left = x + "px";
      d.style.top = top + "px";
      d.style.animationDuration = dur + "s";
      d.style.animationDelay = delay + "s";
      d.style.opacity = String(0.55 + Math.random()*0.35);
      d.style.height = (14 + Math.random()*26) + "px";
      layer.appendChild(d);
    };

    // sides
    for (let i=0;i<52;i++){
      if (Math.random() < 0.5) makeDrop(0, leftStrip);
      else makeDrop(rightStripStart, w);
    }
    // a few along top border
    for (let i=0;i<12;i++){
      const d = document.createElement("div");
      d.className = "raindrop";
      d.style.left = (Math.random()*w) + "px";
      d.style.top = (-Math.random()*160) + "px";
      d.style.animationDuration = (1.1 + Math.random()*1.3) + "s";
      d.style.animationDelay = (Math.random()*1.2) + "s";
      d.style.opacity = String(0.35 + Math.random()*0.25);
      d.style.height = (10 + Math.random()*18) + "px";
      layer.appendChild(d);
    }
  } else if (kind === "sun"){
    const s = document.createElement("div");
    s.className = "sunlight";
    layer.appendChild(s);
  }
}

// Weather (real, via Open-Meteo)
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

    renderWeatherLayer(wt.kind);
  }catch(_){
    setText(`天气：${place} · 暂不可用`);
    document.body.dataset.weather = "unknown";
    clearWeatherLayer();
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

// Chat
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
      setTimeout(() => appendChat("bot", chaiReply(msg)), 160);
      burstAt(send, 8);
    };
    send.addEventListener("click", doSend);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSend(); });
  }
}

// Mobile nav "more" - build menu from hidden links so desktop never shows "更多"
function setupNavMore(){
  const btn = document.getElementById("navMoreBtn");
  const menu = document.getElementById("navMoreMenu");
  if (!btn || !menu) return;

  const rebuildMenu = () => {
    menu.innerHTML = "";
    const hiddenLinks = Array.from(document.querySelectorAll('.top-nav a[data-mobile="hide"]'));
    hiddenLinks.forEach(a => {
      const clone = a.cloneNode(true);
      clone.setAttribute("role","menuitem");
      menu.appendChild(clone);
    });
  };
  rebuildMenu();

  const shouldShow = () => window.matchMedia("(max-width: 640px)").matches;
  const syncVisibility = () => {
    btn.style.display = shouldShow() ? "inline-flex" : "none";
    if (!shouldShow()){
      menu.style.display = "none";
      menu.setAttribute("aria-hidden","true");
    }
  };
  syncVisibility();
  window.addEventListener("resize", syncVisibility);

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

// Service worker
function setupPWA(){
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}

window.addEventListener("load", () => {
  setupThemeModal();
  pickAccent();
  setRandomQuote();
  initYearProgress();
  initWeather();
  setupPWA();

 const refresh = document.getElementById("refreshQuote");
if (refresh) refresh.addEventListener("click", (e) => { 
  setRandomQuote(); // 这里的 setRandomQuote 已经变成调用伍尔夫语录了
  spawnPetals(e.clientX, e.clientY, 10); 
});

  updateDisplay();
  updateMoodTodoDisplay();

  document.getElementById("saveMoodTodo")?.addEventListener("click", saveMoodTodo);
  document.getElementById("clearMoodTodo")?.addEventListener("click", clearMoodTodo);

  document.getElementById("exportData")?.addEventListener("click", exportData);
  const importFile = document.getElementById("importFile");
  if (importFile){
    importFile.addEventListener("change", () => {
      const f = importFile.files?.[0];
      if (f) importData(f);
      importFile.value = "";
    });
  }

  const tomato = document.getElementById("tomato");
  if (tomato){
    tomato.addEventListener("click", togglePomodoro);
    tomato.addEventListener("dblclick", resetPomodoro);
  }

  setupChat();
  setupNavMore();
  setupOrnaments();
});
