// 小娜花园 · main.js v12.0
// 整合：Theme, Weather, Chat, Sync, Pomodoro, Quotes, Layout Logic

// --- 1. 真实 Woolf 英文语录 (需求5) ---
const woolfQuotes = [
  { text: "A woman must have money and a room of her own if she is to write fiction.", source: "A Room of One's Own" },
  { text: "I am rooted, but I flow.", source: "The Waves" },
  { text: "No need to hurry. No need to sparkle. No need to be anybody but oneself.", source: "A Room of One's Own" },
  { text: "Arrange whatever pieces come your way.", source: "The Diary of Virginia Woolf" },
  { text: "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.", source: "A Room of One's Own" },
  { text: "To enjoy the sun, the dust, the street.", source: "Mrs. Dalloway" },
  { text: "For most of history, Anonymous was a woman.", source: "A Room of One's Own" }
];

function setQuote() {
  const el = document.getElementById("woolfQuote");
  const src = document.getElementById("woolfSource");
  if (!el) return;
  const q = woolfQuotes[Math.floor(Math.random() * woolfQuotes.length)];
  el.textContent = `"${q.text}"`;
  if (src) src.textContent = `— Virginia Woolf, ${q.source}`;
}

// --- 2. 优化后的天气逻辑 (需求2 & 3: 沉浸式 + 防卡顿) ---
async function initWeather() {
  const layer = document.getElementById("weatherLayer");
  const pill = document.getElementById("weatherPill");
  const isMobile = window.innerWidth < 640;

  // 渲染雨滴 (限制数量防止手机卡顿)
  const renderRain = () => {
    if(!layer) return;
    layer.innerHTML = "";
    // 手机端大幅减少粒子: 电脑 50, 手机 15
    const count = isMobile ? 15 : 50; 
    for(let i=0; i<count; i++) {
      const d = document.createElement("div");
      d.className = "raindrop";
      d.style.left = Math.random() * 100 + "vw";
      d.style.animationDuration = (0.8 + Math.random()) + "s";
      d.style.animationDelay = Math.random() + "s";
      layer.appendChild(d);
    }
  };

  try {
    // 简单的地理定位与API获取
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m`);
        const data = await res.json();
        const code = data.current.weather_code;
        const temp = data.current.temperature_2m;
        
        let kind = "cloud";
        let label = "多云";
        
        // 简化的天气代码映射
        if([0,1].includes(code)) { kind = "sun"; label = "晴"; }
        if([51,53,61,63,80,81,82].includes(code)) { kind = "rain"; label = "雨"; }
        if([71,73,75].includes(code)) { kind = "snow"; label = "雪"; }

        document.body.dataset.weather = kind;
        if(pill) pill.textContent = `${label} · ${Math.round(temp)}°C`;
        
        if(kind === "rain" || kind === "snow") renderRain();
        else layer.innerHTML = ""; // 晴天/多云不需要粒子，省电
      } catch(e) {
         if(pill) pill.textContent = "天气暂不可用";
      }
    }, () => {
      if(pill) pill.textContent = "未定位";
    });
  } catch(e) { console.log("Weather init error", e); }
}

// --- 3. 阿柴聊天机器人 (需求6修复) ---
// 关键词匹配逻辑修复：确保能抓取到
const chaiDB = [
  { k: ["你好","hi","hello","在吗"], r: "小娜，我在。今天想先从哪件小事开始？" },
  { k: ["难过","伤心","焦虑","哭","烦","累"], r: "抱抱。不需要立刻好起来，只需要允许自己现在感觉不好。在花园里坐一会儿吧。" },
  { k: ["写","卡文","写不出来"], r: "写作不需要一开始就完美。试着只写一句“最烂的句子”，只要写下来就是胜利。" },
  { k: ["谢谢","感恩"], r: "也谢谢你照顾好自己。记在感恩日记里了吗？" },
  { k: ["待办","任务","不想动"], r: "去专注页看看？我们只挑一件最重要的做，其他的都允许它先放着。" }
];

function setupChat() {
  const btn = document.getElementById("chat-button");
  const win = document.getElementById("chat-window");
  const close = document.getElementById("chat-close");
  const send = document.getElementById("chatSend");
  const input = document.getElementById("chatInput");
  const body = document.getElementById("chatBody");

  if(!btn) return;

  // 使用 class 'open' 控制显示，避免 style 冲突
  const toggle = () => win.classList.toggle("open");

  btn.onclick = toggle;
  close.onclick = toggle;

  const addMsg = (txt, type) => {
    const d = document.createElement("div");
    d.className = `chat-bubble ${type}`;
    d.textContent = txt;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  };

  const reply = (txt) => {
    const lower = txt.toLowerCase();
    // 修复查找逻辑
    const found = chaiDB.find(item => item.k.some(key => lower.includes(key)));
    setTimeout(() => {
      addMsg(found ? found.r : "我在听。这让你感觉怎么样？或者我们可以试着拆解一下这个问题。", "bot");
    }, 600);
  };

  const doSend = () => {
    const val = input.value.trim();
    if(!val) return;
    addMsg(val, "me");
    input.value = "";
    reply(val);
  };

  send.onclick = doSend;
  input.onkeydown = (e) => { if(e.key === "Enter") doSend(); };
  
  // 初始问候
  if(body.children.length === 0) addMsg("嗨，我是阿柴。今天过得怎么样？", "bot");
}

// --- 4. 番茄钟 (需求9: 生长动画) ---
let timerInt;
let timeLeft = 25 * 60;
function setupPomodoro() {
  const btn = document.getElementById("tomato");
  const display = document.getElementById("timer");
  const basket = document.getElementById("tomatoBasket");
  if(!btn) return;

  const update = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2,0);
    const s = (timeLeft % 60).toString().padStart(2,0);
    display.textContent = `${m}:${s}`;
    
    // 生长高度计算: 0% -> 100%
    const total = 25 * 60;
    const pct = ((total - timeLeft) / total) * 100;
    btn.style.setProperty('--grow-height', `${pct}%`);
  };

  btn.onclick = () => {
    if(timerInt) { // 暂停/停止（番茄消失）
      clearInterval(timerInt);
      timerInt = null;
      timeLeft = 25 * 60; 
      update();
      btn.style.setProperty('--grow-height', '0%'); // 消失
    } else { // 开始
      timerInt = setInterval(() => {
        timeLeft--;
        update();
        if(timeLeft <= 0) {
          clearInterval(timerInt);
          timerInt = null;
          timeLeft = 25 * 60;
          update();
          btn.style.setProperty('--grow-height', '0%');
          // 收获
          const t = document.createElement("div");
          t.className = "done-dot";
          basket.appendChild(t);
          alert("番茄成熟了！休息一下吧。");
        }
      }, 1000);
    }
  };
}

// --- 5. 同步功能 (需求4) ---
function setupSync() {
  const modal = document.getElementById("syncModal");
  const openBtn = document.getElementById("openSyncModal");
  const closeBtn = document.getElementById("closeSync");
  const copyBtn = document.getElementById("btnCopySync");
  const importBtn = document.getElementById("btnImportSync");
  const text = document.getElementById("syncDataString");

  if(!openBtn) return;

  openBtn.onclick = () => {
    modal.classList.add("show");
    // 生成同步码 (Base64)
    const data = JSON.stringify(localStorage);
    // 使用 unicode safe base64
    text.value = btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
  };

  const closeModal = () => modal.classList.remove("show");
  closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if(e.target === modal) closeModal(); };

  copyBtn.onclick = () => {
    text.select();
    document.execCommand("copy");
    copyBtn.textContent = "已复制！";
    setTimeout(() => copyBtn.textContent = "复制导出码", 2000);
  };

  importBtn.onclick = () => {
    try {
      if(!text.value) return;
      // 解码
      const str = atob(text.value.trim());
      const json = decodeURIComponent(str.split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const data = JSON.parse(json);
      // 清空旧数据并写入新数据
      localStorage.clear();
      for (let k in data) localStorage.setItem(k, data[k]);
      alert("同步成功！页面将刷新。");
      location.reload();
    } catch(e) {
      alert("同步码格式错误，请检查。");
      console.error(e);
    }
  };
}

// --- 6. 导航栏更多菜单逻辑修复 (需求1) ---
function setupNav() {
  const moreBtn = document.getElementById("navMoreBtn");
  const menu = document.getElementById("navMoreMenu");
  
  // 1. 自动填充移动端隐藏的链接
  const hiddenLinks = document.querySelectorAll('.top-nav a[data-mobile="hide"]');
  hiddenLinks.forEach(link => {
    const clone = link.cloneNode(true);
    // 移除 data-mobile 属性，确保在菜单里显示
    clone.removeAttribute('data-mobile'); 
    menu.appendChild(clone);
  });

  if(moreBtn && menu) {
    moreBtn.onclick = (e) => {
      e.stopPropagation();
      menu.classList.toggle("show");
    };
    // 点击外部关闭
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !moreBtn.contains(e.target)) {
        menu.classList.remove("show");
      }
    });
  }
}

// --- 7. 主题逻辑 (整合) ---
function setupTheme() {
  const themes = [
    {id:"fern", name:"蕨影", color:"#8aa39a"},
    {id:"moss", name:"苔雾", color:"#7f9a90"},
    {id:"rose", name:"蔷薇", color:"#b78f92"},
    {id:"mist", name:"雾蓝", color:"#8fa2b6"},
    {id:"clay", name:"陶土", color:"#a07f73"}
  ];
  const modal = document.getElementById("themeModal");
  const btn = document.getElementById("themeBtn");
  const close = document.getElementById("closeTheme");
  const grid = document.getElementById("themeGrid");
  const nightBtn = document.getElementById("toggleNight");

  // Load Saved
  const savedT = localStorage.getItem("xn_theme") || "fern";
  document.body.dataset.theme = savedT;
  if(localStorage.getItem("xn_night") === "1") document.body.classList.add("night");

  // Render Grid
  if(grid) {
    grid.innerHTML = "";
    themes.forEach(t => {
      const d = document.createElement("div");
      d.style.cssText = `height:40px; background:${t.color}; border-radius:8px; cursor:pointer; border:2px solid transparent`;
      if(t.id === savedT) d.style.borderColor = "#333";
      d.title = t.name;
      d.onclick = () => {
        document.body.dataset.theme = t.id;
        localStorage.setItem("xn_theme", t.id);
        modal.classList.remove("show");
      };
      grid.appendChild(d);
    });
  }

  if(btn) btn.onclick = () => modal.classList.add("show");
  if(close) close.onclick = () => modal.classList.remove("show");
  if(nightBtn) nightBtn.onclick = () => {
    document.body.classList.toggle("night");
    localStorage.setItem("xn_night", document.body.classList.contains("night") ? "1" : "0");
  };
}

// --- 初始化 ---
window.addEventListener("DOMContentLoaded", () => {
  setQuote();
  initWeather();
  setupChat();
  setupPomodoro();
  setupSync();
  setupNav();
  setupTheme();

  // 刷新语录
  document.getElementById("refreshQuote")?.addEventListener("click", setQuote);

  // 首页数据回显
  const mood = localStorage.getItem("todayMood");
  const todoList = JSON.parse(localStorage.getItem("xn_todos") || "[]");
  const hMood = document.getElementById("homeMood");
  const hTodo = document.getElementById("homeTodo");
  
  if(hMood) hMood.textContent = mood || "未记录";
  if(hTodo) {
    const activeTodo = todoList.find(t => !t.done);
    hTodo.textContent = activeTodo ? activeTodo.text : (todoList.length > 0 ? "全部已完成" : "无待办");
  }
});
