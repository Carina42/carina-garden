
/**
 * 柴窝之家 · main.js（主页）
 * - 年/月/日进度条 + 自定义倒计时事件
 * - 伍尔夫每日一句（每日固定）
 * - 今日摘要（读取各子页面 localStorage）
 * - 番茄钟（点击番茄开始/暂停，双击清零；完成后计入今日）
 * 说明：天气与边框视觉已移至 weather.js（所有页面共享）
 */
(function(){
  const $ = (s)=>document.querySelector(s);
  const pad2 = (n)=>String(n).padStart(2,"0");
  const localDayKey = ()=>{
    const d = new Date();
    const y = d.getFullYear();
    const m = pad2(d.getMonth()+1);
    const da = pad2(d.getDate());
    return `${y}-${m}-${da}`;
  };

  function seededPick(arr, seedStr){
    let h = 2166136261;
    for(let i=0;i<seedStr.length;i++){
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const idx = Math.abs(h) % arr.length;
    return arr[idx];
  }

  const WOOLF_QUOTES = [
    "我既扎根，又流动。——Virginia Woolf",
    "写作像把一盏灯递给自己：不必照亮全世界，只要照亮下一步。",
    "锁住你的图书馆也无妨；但没有门闩能锁住思想的自由。——伍尔夫",
    "生活并不要求完美的持续；它更喜欢温柔而顽固的回返。",
    "把到来的碎片好好摆放——它们终会组成你想要的形状。",
    "当你感到迟钝时，去触摸一点真实：一片叶子、一次呼吸、一个句子。",
    "世界需要的不止是答案，也需要提问时的光。",
    "“A woman must have money and a room of her own if she is to write fiction.” — Woolf",
    "“Books are the mirrors of the soul.” — Woolf (attributed)"
  ];

  // ---------- Progress: year/month/day ----------
  function progress(){
    const d = new Date();
    const y = d.getFullYear();

    const startY = new Date(y,0,1);
    const endY = new Date(y+1,0,1);
    const yearPct = ((d - startY) / (endY - startY)) * 100;

    const startM = new Date(y, d.getMonth(), 1);
    const endM = new Date(y, d.getMonth()+1, 1);
    const monthPct = ((d - startM) / (endM - startM)) * 100;

    const startD = new Date(y, d.getMonth(), d.getDate());
    const endD = new Date(y, d.getMonth(), d.getDate()+1);
    const dayPct = ((d - startD) / (endD - startD)) * 100;

    const leftYear = Math.ceil((endY - d)/86400000);
    const leftMonth = Math.ceil((endM - d)/86400000);
    const leftDay = Math.ceil((endD - d)/3600000);

    const setBar = (sel, pct, txt)=>{
      const bar = document.querySelector(sel + " .bar i");
      const val = document.querySelector(sel + " .value");
      if(bar) bar.style.width = Math.max(0, Math.min(100,pct)) + "%";
      if(val) val.textContent = txt;
    };

    setBar("#progYear", yearPct, `还剩 ${leftYear} 天`);
    setBar("#progMonth", monthPct, `还剩 ${leftMonth} 天`);
    setBar("#progDay", dayPct, `还剩 ${leftDay} 小时`);
  }

  // ---------- Custom countdown events ----------
  const EVT_KEY = "chaiEvents";
  function loadEvents(){
    try{ return JSON.parse(localStorage.getItem(EVT_KEY)||"[]"); }catch{ return []; }
  }
  function saveEvents(arr){
    localStorage.setItem(EVT_KEY, JSON.stringify(arr));
  }
  function fmtDate(iso){
    const d = new Date(iso + "T00:00:00");
    const y = d.getFullYear();
    const m = pad2(d.getMonth()+1);
    const da = pad2(d.getDate());
    return `${y}-${m}-${da}`;
  }
  function daysUntil(iso){
    const now = new Date();
    const tgt = new Date(iso + "T00:00:00");
    const diff = tgt - new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.ceil(diff/86400000);
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  function renderEvents(){
    const list = $("#eventList");
    if(!list) return;
    const evts = loadEvents()
      .filter(e=>e?.date && e?.title)
      .sort((a,b)=> (a.date>b.date?1:-1));

    list.innerHTML = "";
    if(evts.length===0){
      const div = document.createElement("div");
      div.className = "small";
      div.textContent = "还没有自定义倒计时事项。比如：旅行 / 投稿 / 会议 / 生日…";
      list.appendChild(div);
      return;
    }

    evts.forEach((e, idx)=>{
      const left = daysUntil(e.date);
      const item = document.createElement("div");
      item.className = "event-item";
      item.innerHTML = `
        <div class="left">
          <div class="title">⏳ ${escapeHtml(e.title)}</div>
          <div class="meta">${fmtDate(e.date)} · 还剩 <b>${left}</b> 天</div>
        </div>
        <div class="right">
          <button class="btn danger" data-del="${idx}">删除</button>
        </div>`;
      list.appendChild(item);
    });

    list.querySelectorAll("button[data-del]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const i = parseInt(btn.dataset.del,10);
        const arr = loadEvents();
        arr.splice(i,1);
        saveEvents(arr);
        renderEvents();
      });
    });
  }

  function initEventForm(){
    const title = $("#evtTitle");
    const date = $("#evtDate");
    const add = $("#evtAdd");
    if(!title || !date || !add) return;

    const d = new Date();
    date.value = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;

    add.addEventListener("click", ()=>{
      const t = (title.value||"").trim();
      const dt = (date.value||"").trim();
      if(!t || !dt) return;
      const arr = loadEvents();
      arr.push({ title: t, date: dt });
      saveEvents(arr);
      title.value = "";
      renderEvents();
    });
  }

  // ---------- Daily summary ----------
  function readJson(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }catch{ return fallback; }
  }
  function initSummary(){
    const kv = {
      reading: $("#sumReading"),
      writing: $("#sumWriting"),
      sleep: $("#sumSleep"),
      exercise: $("#sumExercise"),
      todo: $("#sumTodo"),
      pomo: $("#sumPomo")
    };
    if(!kv.reading) return;

    const today = localDayKey();

    const books = readJson("chaiBooks", []);
    const readToday = books.filter(b => (b.finishedDate||"").startsWith(today)).length;

    const writing = readJson("chaiWriting", {});
    const words = (writing[today]?.words)||0;

    const sleep = readJson("chaiSleep", {});
    const hours = sleep[today]?.hours ?? "";

    const ex = readJson("chaiExercise", {});
    const mins = ex[today]?.minutes ?? "";

    const todos = readJson("chaiTodos", []);
    const top = (todos.find(t=>!t.done) || {}).text || "（暂无）";

    const pomo = readJson("chaiPomodoro", {});
    const done = pomo[today]?.done ?? 0;

    kv.reading.textContent = readToday ? `今天新增 ${readToday} 本` : "今天还没记录";
    kv.writing.textContent = words ? `今天 ${words} 字` : "今天还没写";
    kv.sleep.textContent = hours!=="" ? `昨夜 ${hours}h` : "还没记";
    kv.exercise.textContent = mins!=="" ? `今天 ${mins}min` : "还没记";
    kv.todo.textContent = top;
    kv.pomo.textContent = done ? `今日 ${done} 个番茄` : "今天还没番茄";
  }

  // ---------- Pomodoro ----------
  const POMO_KEY = "chaiPomodoro";
  function loadPomo(){ return readJson(POMO_KEY, {}); }
  function savePomo(obj){ localStorage.setItem(POMO_KEY, JSON.stringify(obj)); }
  function initPomodoro(){
    const tomato = $("#tomato");
    const timeEl = $("#pomoTime");
    const doneEl = $("#pomoDone");
    if(!tomato || !timeEl || !doneEl) return;

    let seconds = 25*60;
    let running = false;
    let timer = null;

    function draw(){
      const m = Math.floor(seconds/60);
      const s = seconds%60;
      timeEl.textContent = `${pad2(m)}:${pad2(s)}`;
    }

    function markDone(){
      const day = localDayKey();
      const obj = loadPomo();
      obj[day] = obj[day] || { done: 0 };
      obj[day].done += 1;
      savePomo(obj);

      const span = document.createElement("span");
      span.textContent = "🍅";
      doneEl.appendChild(span);
      initSummary();
    }

    function hydrateDone(){
      doneEl.innerHTML = "";
      const day = localDayKey();
      const obj = loadPomo();
      const n = obj[day]?.done || 0;
      for(let i=0;i<n;i++){
        const span = document.createElement("span");
        span.textContent="🍅";
        doneEl.appendChild(span);
      }
    }

    function start(){
      if(running) return;
      running = true;
      timer = setInterval(()=>{
        seconds -= 1;
        if(seconds <= 0){
          clearInterval(timer);
          timer = null;
          running = false;
          seconds = 25*60;
          draw();
          markDone();
        }else{
          draw();
        }
      }, 1000);
    }
    function pause(){
      running = false;
      if(timer) clearInterval(timer);
      timer = null;
    }
    function reset(){
      pause();
      seconds = 25*60;
      draw();
    }

    tomato.addEventListener("click", ()=> running? pause(): start());
    tomato.addEventListener("dblclick", reset);

    hydrateDone();
    draw();
  }

  // ---------- Quote ----------
  function initQuote(){
    const q = $("#quoteText");
    if(!q) return;
    const seed = localDayKey();
    q.textContent = seededPick(WOOLF_QUOTES, seed);
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    progress();
    initEventForm();
    renderEvents();
    initQuote();
    initPomodoro();
    initSummary();
    setInterval(progress, 60*1000);
  });
})();
