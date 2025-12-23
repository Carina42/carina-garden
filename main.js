
(function(){
  const $ = (id)=>document.getElementById(id);

  // ---------- Woolf Quote (random each refresh) ----------
  function renderQuote(){
    try{
      if(window.WoolfQuotes && typeof window.WoolfQuotes.render === "function"){
        window.WoolfQuotes.render("woolfQuote","woolfQuoteSource");
      }
    }catch(_){}
  }

// ---------- Countdown / progress ----------
  function pct(a,b){ return Math.max(0, Math.min(100, (a/b)*100)); }
  function setProgress(barId, textId, p, label){
    const bar = $(barId);
    const txt = $(textId);
    if(bar) bar.style.width = `${p.toFixed(2)}%`;
    if(txt) txt.textContent = label;
  }
  function updateTimeProgress(){
    const now = new Date();

    // Year
    const y = now.getFullYear();
    const startY = new Date(y,0,1,0,0,0,0);
    const endY = new Date(y+1,0,1,0,0,0,0);
    const yearPassed = now - startY;
    const yearTotal = endY - startY;
    const yearP = pct(yearPassed, yearTotal);
    const daysLeft = Math.ceil((endY - now) / (1000*60*60*24));
    setProgress("yearProgressBar","yearProgressText", yearP, `已过去 ${yearP.toFixed(1)}% · 还剩 ${daysLeft} 天`);

    // Month
    const startM = new Date(y, now.getMonth(), 1, 0,0,0,0);
    const endM = new Date(y, now.getMonth()+1, 1, 0,0,0,0);
    const monthP = pct(now - startM, endM - startM);
    const mDaysLeft = Math.ceil((endM - now) / (1000*60*60*24));
    setProgress("monthProgressBar","monthProgressText", monthP, `已过去 ${monthP.toFixed(1)}% · 还剩 ${mDaysLeft} 天`);

    // Day
    const startD = new Date(y, now.getMonth(), now.getDate(), 0,0,0,0);
    const endD = new Date(y, now.getMonth(), now.getDate()+1, 0,0,0,0);
    const dayP = pct(now - startD, endD - startD);
    const minsLeft = Math.ceil((endD - now) / (1000*60));
    const h = Math.floor(minsLeft/60), m = minsLeft%60;
    setProgress("dayProgressBar","dayProgressText", dayP, `还剩 ${h}h ${m}m · 今日已走过 ${dayP.toFixed(1)}%`);
  }

  // ---------- Custom countdowns ----------
  const CC_KEY = "chai_custom_countdowns_v6";
  function loadCC(){
    try{ return JSON.parse(localStorage.getItem(CC_KEY) || "[]"); }catch(_){ return []; }
  }
  function saveCC(list){
    try{ localStorage.setItem(CC_KEY, JSON.stringify(list)); }catch(_){}
  }
  function renderCC(){
    const listEl = $("ccList");
    if(!listEl) return;
    const list = loadCC();
    listEl.innerHTML = "";
    if(list.length===0){
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = "还没有自定义倒计时。比如：旅行、DDL、活动，都可以加进来。";
      listEl.appendChild(empty);
      return;
    }
    const now = new Date();
    list
      .sort((a,b)=> (a.date||"").localeCompare(b.date||""))
      .forEach((it, idx)=>{
        const d = new Date(it.date+"T00:00:00");
        const diff = Math.ceil((d - now)/(1000*60*60*24));
        const row = document.createElement("div");
        row.className = "cc-item";
        row.innerHTML = `
          <div class="cc-left">
            <div class="cc-title">${escapeHtml(it.title||"未命名")}</div>
            <div class="cc-sub">${it.date} · ${diff>=0 ? `还有 ${diff} 天` : `已过去 ${Math.abs(diff)} 天`}</div>
          </div>
          <button class="cc-del" title="删除">🗑️</button>
        `;
        row.querySelector(".cc-del").addEventListener("click", ()=>{
          const next = loadCC().filter((_,i)=>i!==idx);
          saveCC(next);
          renderCC();
        });
        listEl.appendChild(row);
      });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ---------- Weather (Open-Meteo, no key) ----------
  // https://open-meteo.com/
  function weatherCodeToKind(code){
    // categories
    if(code===0) return {kind:"sun", emoji:"☀️", label:"晴"};
    if([1,2,3].includes(code)) return {kind:"cloud", emoji:"⛅", label:"多云"};
    if([45,48].includes(code)) return {kind:"cloud", emoji:"🌫️", label:"雾"};
    if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return {kind:"rain", emoji:"🌧️", label:"雨"};
    if([71,73,75,77,85,86].includes(code)) return {kind:"snow", emoji:"🌨️", label:"雪"};
    if([95,96,99].includes(code)) return {kind:"rain", emoji:"⛈️", label:"雷暴"};
    return {kind:"cloud", emoji:"⛅", label:"天气"};
  }

  async function fetchWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url, {cache: "no-store"});
    if(!res.ok) throw new Error("weather_fetch_failed");
    return await res.json();
  }


  
  const WEATHER_KEY = "chai_weather_cache_v7";
  function saveWeatherCache(obj){
    try{ localStorage.setItem(WEATHER_KEY, JSON.stringify(obj)); }catch(_){}
  }
  function loadWeatherCache(){
    try{ return JSON.parse(localStorage.getItem(WEATHER_KEY)||"null"); }catch(_){ return null; }
  }

function setWeatherUI(placeName, tempC, code, wind){
    const w = weatherCodeToKind(code);
    const locChip = $("locationChip");
    const chip = $("weatherChip");
    const big = $("weatherBig");
    const cond = $("weatherCond");
    const temp = $("weatherTemp");
    const windEl = $("weatherWind");
    if(locChip) locChip.textContent = `📍 ${placeName}`;
    if(chip) chip.textContent = `${w.emoji} ${w.label} · ${tempC}°C`;
    if(big) big.textContent = w.emoji;
    if(cond) cond.textContent = w.label;
    if(temp) temp.textContent = `${tempC}°C`;
    if(windEl) windEl.textContent = `${wind} km/h`;
    renderOrnaments(w.kind);
  }

  function renderOrnaments(kind){
    const box = $("weatherOrnaments");
    if(!box) return;
    box.innerHTML = "";
    const corners = [
      {x:"26px", y:"26px"},
      {x:"calc(100% - 60px)", y:"28px"},
      {x:"28px", y:"calc(100% - 66px)"},
      {x:"calc(100% - 62px)", y:"calc(100% - 68px)"},
    ];
    const leafs = [
      {x:"calc(50% - 14px)", y:"18px"},
      {x:"calc(50% - 18px)", y:"calc(100% - 58px)"},
    ];
    const icon = kind==="sun" ? "☀️" : kind==="rain" ? "🌧️" : kind==="snow" ? "🌨️" : "☁️";
    const cls = kind==="sun" ? "sun" : kind==="rain" ? "rain" : kind==="snow" ? "snow" : "cloud";
    corners.forEach((c,i)=>{
      const d = document.createElement("div");
      d.className = `orn ${cls}`;
      d.textContent = icon;
      d.style.left = c.x;
      d.style.top = c.y;
      d.style.animationDelay = `${i*0.25}s`;
      box.appendChild(d);
    });
    leafs.forEach((c,i)=>{
      const d = document.createElement("div");
      d.className = "orn leaf";
      d.textContent = "🍃";
      d.style.left = c.x;
      d.style.top = c.y;
      d.style.animationDelay = `${0.15+i*0.4}s`;
      box.appendChild(d);
    });
  }

  async function initWeather(){
    // Fallback: Zhengzhou
    let lat = 34.7466, lon = 113.6254, place = "郑州";
    try{
      const pos = await new Promise((resolve, reject)=>{
        if(!navigator.geolocation) return reject(new Error("no_geo"));
        navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy:false, timeout: 7000, maximumAge: 15*60*1000});
      });
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      place = "当前位置";
    }catch(_){ /* keep fallback */ }

    try{
      const data = await fetchWeather(lat, lon);
      const cur = data.current;
      const tempC = Math.round(cur.temperature_2m);
      const code = cur.weather_code;
      const wind = Math.round(cur.wind_speed_10m);
      setWeatherUI(place, tempC, code, wind);
      saveWeatherCache({place, lat, lon, tempC, code, wind, ts: Date.now()});
    }catch(_){
      // graceful
      const cached = loadWeatherCache();
      if(cached && cached.tempC!=null){
        setWeatherUI(cached.place || place, cached.tempC, cached.code ?? 2, cached.wind ?? "—");
      }else{
        setWeatherUI(place, "—", 2, "—");
      }
    }
  }

  // ---------- Summary (pull from localStorage written by pages) ----------
  function readJSON(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }catch(_){ return fallback; }
  }
  function updateSummary(){
    const books = readJSON("chai_books_v6", []);
    const writing = readJSON("chai_writing_v6", {});
    const exercise = readJSON("chai_exercise_v6", []);
    const sleep = readJSON("chai_sleep_v6", []);

    const todayKey = new Date().toISOString().slice(0,10);
    const wroteToday = writing?.daily?.[todayKey]?.words || 0;
    const exToday = exercise.filter(x=>x.date===todayKey).reduce((a,b)=>a+(Number(b.minutes)||0),0);
    const sleepToday = sleep.find(x=>x.date===todayKey)?.hours || 0;
    const readToday = books.filter(b=>b.finishedDate===todayKey).length;

    const set = (id, val)=> { const el=$(id); if(el) el.textContent = String(val); };
    set("sumReading", readToday);
    set("sumWriting", wroteToday);
    set("sumExercise", exToday);
    set("sumSleep", sleepToday);

    // mood & top todo restore
    const mood = localStorage.getItem("chai_mood_v6") || "";
    const topTodo = localStorage.getItem("chai_top_todo_v6") || "";
    const moodInput = $("moodInput");
    const topTodoInput = $("topTodoInput");
    const topTodoDisplay = $("topTodoDisplay");
    if(moodInput && mood) moodInput.value = mood;
    if(topTodoInput && topTodo) topTodoInput.value = topTodo;
    if(topTodoDisplay) topTodoDisplay.textContent = topTodo ? `今天最重要：${topTodo}` : "还没写最优先事项。";
  }

  function initMoodTodo(){
    const moodInput = $("moodInput");
    const topTodoInput = $("topTodoInput");
    const moodHint = $("moodSavedHint");
    const topTodoDisplay = $("topTodoDisplay");

    $("saveMoodBtn")?.addEventListener("click", ()=>{
      const v = (moodInput?.value || "").trim();
      localStorage.setItem("chai_mood_v6", v);
      if(moodHint) moodHint.textContent = v ? "已保存。" : "已清空。";
      setTimeout(()=>{ if(moodHint) moodHint.textContent=""; }, 1200);
    });
    $("saveTopTodoBtn")?.addEventListener("click", ()=>{
      const v = (topTodoInput?.value || "").trim();
      localStorage.setItem("chai_top_todo_v6", v);
      if(topTodoDisplay) topTodoDisplay.textContent = v ? `今天最重要：${v}` : "还没写最优先事项。";
    });
  }

  // ---------- Pomodoro ----------
  function initPomodoro(){
    const btn = $("tomatoBtn");
    const timeEl = $("pomodoroTime");
    const line = $("tomatoLine");

    if(!btn || !timeEl || !line) return;

    const KEY = "chai_pomo_v6";
    const state = readJSON(KEY, {secLeft:1500, running:false, done:0, lastTick:0});
    let secLeft = state.secLeft || 1500;
    let running = !!state.running;
    let done = state.done || 0;
    let timerId = null;

    function fmt(s){
      const m = Math.floor(s/60);
      const ss = s%60;
      return `${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
    }
    function render(){
      timeEl.textContent = fmt(secLeft);
      line.innerHTML = "";
      for(let i=0;i<done;i++){
        const span = document.createElement("span");
        span.textContent = "🍅";
        line.appendChild(span);
      }
    }
    function save(){
      localStorage.setItem(KEY, JSON.stringify({secLeft, running, done, lastTick: Date.now()}));
    }
    function stop(){
      if(timerId) clearInterval(timerId);
      timerId = null;
      running = false;
      save();
    }
    function start(){
      if(timerId) return;
      running = true;
      save();
      timerId = setInterval(()=>{
        secLeft--;
        if(secLeft <= 0){
          done++;
          secLeft = 1500;
          bloom(); // celebrate
        }
        render();
        save();
      }, 1000);
    }

    // Resume with drift correction
    if(running && state.lastTick){
      const elapsed = Math.floor((Date.now() - state.lastTick)/1000);
      secLeft = Math.max(0, secLeft - elapsed);
    }

    btn.addEventListener("click", ()=>{
      if(running) stop();
      else start();
    });
    btn.addEventListener("dblclick", ()=>{
      stop();
      secLeft = 1500;
      render();
      save();
    });

    function bloom(){
      // small subtle bloom on index
      const zone = document.createElement("div");
      zone.className = "flower-zone";
      zone.style.position = "fixed";
      zone.style.inset = "0";
      zone.style.pointerEvents = "none";
      zone.style.zIndex = "60";
      document.body.appendChild(zone);
      for(let i=0;i<5;i++){
        const f = document.createElement("div");
        f.className = "flower";
        f.style.left = (Math.random()*80 + 10) + "%";
        f.style.top = (Math.random()*20 + 70) + "%";
        f.style.animationDelay = (Math.random()*0.2) + "s";
        zone.appendChild(f);
      }
      setTimeout(()=>zone.remove(), 3800);
    }

    render();
    if(running) start();
  }

  // ---------- init ----------
  document.addEventListener("DOMContentLoaded", ()=>{
    renderQuote();

    initWeather();
    updateTimeProgress();
    setInterval(updateTimeProgress, 20_000);

    renderCC();
    $("ccAdd")?.addEventListener("click", ()=>{
      const title = ($("ccTitle")?.value || "").trim();
      const date = ($("ccDate")?.value || "").trim();
      if(!title || !date) return;
      const list = loadCC();
      list.push({title, date});
      saveCC(list);
      if($("ccTitle")) $("ccTitle").value = "";
      renderCC();
    });

    updateSummary();
    initMoodTodo();

    initPomodoro();
  });

})();