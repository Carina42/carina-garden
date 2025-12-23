// 小娜花园 · main.js
let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let completedCount = 0;

// Morandi-ish soft colors for small random accents
const morandi = [
  {a:"#8aa39a", b:"#cbbfae"}, // fern + clay
  {a:"#97a7b3", b:"#d6cbbd"}, // mist + oat
  {a:"#9aa8a1", b:"#c9bdb0"}, // sage + sand
  {a:"#a3a9be", b:"#cbb4a7"}, // lilac + rose clay
  {a:"#7f9a90", b:"#bfb7aa"}, // moss + linen
];

const woolfQuotes = [
  "并不是要把生活打磨成完美，而是要把生活看清，然后继续爱它。",
  "一间自己的房间，并不只是房间，而是呼吸、时间与自由的边界。",
  "真正的生活在细微处闪烁：光落在杯沿、风穿过树叶、心忽然一松。",
  "如果必须选择，我宁愿选择那一瞬间的清醒与灿烂。",
  "写作像把手伸进水里：你看不见水底，但你知道那里有路。",
  "人并非被大事件塑造，而是被无数小小的日常抚摸成形。",
  "我想把世界写得更透明些，让每一缕光都有回声。",
  "所谓合一，也许就是在碎裂之中仍能感到自己完整。",
  "我们并不需要成为别人眼中的正确，我们只需要继续成为自己。",
  "花园不回答问题，它只让你更靠近呼吸。",
  "你可以慢一点。慢并不等于停。",
  "恐惧像雾，走进去就会散；停在原地才会越来越浓。",
  "做一点点就很好，一点点就是路。",
  "把今天当作一株新芽：轻轻浇水，不必拽着它长大。",
  "真正的勇敢不是不怕，而是怕着也仍然向前。",
];

function pickAccent() {
  const pick = morandi[Math.floor(Math.random() * morandi.length)];
  document.documentElement.style.setProperty('--accent', pick.a);
  document.documentElement.style.setProperty('--accent-2', pick.b);
  document.documentElement.style.setProperty('--sparkle', pick.a + "CC");
  const bar = document.getElementById("yearProgressBar");
  if (bar) bar.style.background = `linear-gradient(90deg, ${pick.a}, ${pick.b})`;
}

function setRandomQuote() {
  const q = woolfQuotes[Math.floor(Math.random() * woolfQuotes.length)];
  const el = document.getElementById("woolfQuote");
  if (el) el.textContent = q;
}

function initYearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
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

function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const el = document.getElementById("timer");
  if (el) el.textContent = `${minutes}:${seconds}`;
}

function togglePomodoro() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    return;
  }
  isRunning = true;
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      timeLeft = 25 * 60;
      completedCount++;
      addCompletedTomato();
      updateDisplay();
      burstAt(document.getElementById("tomato"));
    }
  }, 1000);
}

function resetPomodoro() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
  burstAt(document.getElementById("tomato"));
}

function addCompletedTomato() {
  const container = document.getElementById("completedTomatoes");
  if (!container) return;
  const dot = document.createElement("div");
  dot.className = "done";
  container.appendChild(dot);
}

function toggleChat() {
  const chat = document.getElementById("chat-window");
  if (!chat) return;
  const now = chat.style.display === "block";
  chat.style.display = now ? "none" : "block";
  chat.setAttribute("aria-hidden", now ? "true" : "false");
  if (!now) burstAt(document.getElementById("chat-button"));
}

function saveMoodTodo() {
  const mood = document.getElementById("moodInput")?.value ?? "";
  const todo = document.getElementById("todoInput")?.value ?? "";
  localStorage.setItem("todayMood", mood);
  localStorage.setItem("todayTodo", todo);
  updateMoodTodoDisplay();
  burstAt(document.querySelector(".mood-card .btn-primary"));
}

function clearMoodTodo() {
  localStorage.removeItem("todayMood");
  localStorage.removeItem("todayTodo");
  document.getElementById("moodInput") && (document.getElementById("moodInput").value = "");
  document.getElementById("todoInput") && (document.getElementById("todoInput").value = "");
  updateMoodTodoDisplay();
  burstAt(document.querySelector(".mood-card .btn-soft"));
}

function updateMoodTodoDisplay() {
  const mood = localStorage.getItem("todayMood") || "（还没记录）";
  const todo = localStorage.getItem("todayTodo") || "（还没设置）";
  const m = document.getElementById("moodDisplay");
  const t = document.getElementById("todoDisplay");
  if (m) m.textContent = `今日心情：${mood}`;
  if (t) t.textContent = `待办优先事项：${todo}`;
}

// ---- Small interactive animation: petals ----
function burstAt(target, n = 10) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  spawnPetals(x, y, n);
}

function spawnPetals(x, y, n = 10) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    const dx = (Math.random() * 120 - 60);
    const dy = (Math.random() * 120 - 60);
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--x0", "0px");
    p.style.setProperty("--y0", "0px");
    p.style.setProperty("--x1", dx + "px");
    p.style.setProperty("--y1", dy + "px");
    p.style.background = `rgba(${Math.floor(120+Math.random()*60)}, ${Math.floor(140+Math.random()*60)}, ${Math.floor(130+Math.random()*60)}, .85)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

// ---- Weather (simple): geolocation -> open-meteo fallback ----
async function initWeather() {
  const pill = document.getElementById("weatherPill");
  if (!pill) return;

  // fallback: Zhengzhou
  const fallback = { lat: 34.7466, lon: 113.6254, name: "郑州" };

  function setText(text){ pill.textContent = text; }

  let lat = fallback.lat, lon = fallback.lon, place = fallback.name;

  try {
    if (navigator.geolocation) {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 6000 });
      });
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      place = "当前位置";
    }
  } catch (_) {
    // ignore
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const t = data?.current?.temperature_2m;
    const code = data?.current?.weather_code;
    setText(`天气：${place} · ${typeof t === "number" ? t.toFixed(0) + "°C" : "--"} · ${codeToText(code)}`);
  } catch (_) {
    setText(`天气：${place} · 暂不可用`);
  }
}

function codeToText(code){
  if (code === undefined || code === null) return "—";
  // Very small mapping for a gentle UI label
  if ([0].includes(code)) return "晴";
  if ([1,2,3].includes(code)) return "多云";
  if ([45,48].includes(code)) return "雾";
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return "雨";
  if ([71,73,75,77,85,86].includes(code)) return "雪";
  if ([95,96,99].includes(code)) return "雷雨";
  return "天气";
}

// ---- Offline tiny chat ----
function chaiReply(text){
  const t = (text || "").trim();
  if (!t) return "小娜，我在。你想先从哪一块开始？";
  const lower = t.toLowerCase();

  const has = (arr) => arr.some(k => t.includes(k) || lower.includes(k));
  if (has(["焦虑","难受","低落","崩","烦","压力"])) return "先别急着证明自己。我们做一个最小动作：喝口水、坐起来、写下今天最重要的一句。";
  if (has(["写作","写","码","论文","开题","大纲"])) return "写作就像浇水：不需要一次浇透。今天先 10 分钟，写一句最核心的‘合一’。";
  if (has(["读书","阅读","书","文献"])) return "那就把这本书先摆上书架。哪怕只写一句：它给你什么感觉？";
  if (has(["睡不着","熬夜","困","睡眠"])) return "我们把灯调暗一点：先做一个‘收尾仪式’——关掉多余标签页，写下明天第一步。";
  if (has(["运动","走路","疼","骶髂","腰"])) return "身体在提醒你要温柔一点。今天做轻量：5 分钟拉伸 + 3 次深呼吸，够了。";
  if (has(["开心","好耶","完成","有进展"])) return "好！这就是花园在长。把这个小胜利写进摘要里，我们让它发芽。";
  return "收到。我们把它拆成两步：第一步现在就能做的一点点；第二步留给明天。你更想先做哪一步？";
}

function appendChat(role, text){
  const body = document.querySelector(".chat-body");
  if (!body) return;
  const div = document.createElement("div");
  div.className = "chat-bubble " + (role === "me" ? "me" : "bot");
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function setupChat(){
  const btn = document.getElementById("chat-button");
  const close = document.getElementById("chat-close");
  const send = document.getElementById("chatSend");
  const input = document.getElementById("chatInput");
  if (btn) btn.addEventListener("click", () => toggleChat());
  if (close) close.addEventListener("click", () => toggleChat());
  if (send && input){
    const doSend = () => {
      const msg = input.value.trim();
      if (!msg) return;
      appendChat("me", msg);
      input.value = "";
      setTimeout(() => appendChat("bot", chaiReply(msg)), 220);
      burstAt(send, 8);
    };
    send.addEventListener("click", doSend);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSend(); });
  }
}

function setupOrnaments(){
  document.querySelectorAll(".ornament").forEach(btn => {
    btn.addEventListener("click", (e) => {
      spawnPetals(e.clientX, e.clientY, 14);
    });
    // gentle sway
    const d = (Math.random() * 1.2 + .8).toFixed(2);
    btn.style.transition = `transform ${d}s ease, filter .2s ease`;
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

  const tomato = document.getElementById("tomato");
  if (tomato) {
    tomato.addEventListener("click", togglePomodoro);
    tomato.addEventListener("dblclick", resetPomodoro);
  }

  setupChat();
  setupOrnaments();
});
