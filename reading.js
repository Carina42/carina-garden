// 小娜花园 · reading.js (v11)
const LS_KEY = "xn_garden_reading_books_v1";

const themes = [
  { id:"fern",  name:"蕨绿", a:"#8aa39a", b:"#cbbfae", c:"#a7b3c1"},
  { id:"moss",  name:"苔影", a:"#7f9a90", b:"#c7bfb1", c:"#9fb0a5"},
  { id:"clay",  name:"陶土", a:"#a07f73", b:"#cbbfae", c:"#a9b1b9"},
  { id:"mist",  name:"雾蓝", a:"#8fa2b6", b:"#d0c2b4", c:"#a3a9be"},
  { id:"rose",  name:"蔷薇", a:"#b78f92", b:"#d6cbbd", c:"#9aa8a1"},
  { id:"wheat", name:"麦穗", a:"#a29b7d", b:"#d6cbbd", c:"#8fa2b6"},
  { id:"ink",   name:"墨青", a:"#6f7d86", b:"#cbbfae", c:"#97a7b3"},
];

const els = {
  count: document.getElementById("book-count"),
  add: document.getElementById("add-book"),
  remove: document.getElementById("remove-book"),
  clear: document.getElementById("clear-books"),
  shelf: document.getElementById("bookshelf"),
  tbody: document.getElementById("reading-table-body"),
  form: document.getElementById("upload-form"),
  title: document.getElementById("book-title"),
  cover: document.getElementById("book-cover"),
  note: document.getElementById("book-note"),
  flower: document.getElementById("flower-display"),
  weatherPill: document.getElementById("weatherPill"),
  navMoreBtn: document.getElementById("navMoreBtn"),
  navMoreMenu: document.getElementById("navMoreMenu"),
};

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// Theme modal helpers (same ids as index)
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
    card.addEventListener("click", () => { applyTheme(t.id); burstAt(card, 12); closeThemeModal(); });
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
  document.getElementById("themeBtn")?.addEventListener("click", (e) => { openThemeModal(); spawnPetalsAt(e.clientX, e.clientY, 10); });
  document.getElementById("closeTheme")?.addEventListener("click", closeThemeModal);
  document.getElementById("themeBackdrop")?.addEventListener("click", closeThemeModal);
  document.getElementById("toggleNight")?.addEventListener("click", (e) => {
    const next = !document.body.classList.contains("night");
    applyNight(next);
    spawnPetalsAt(e.clientX, e.clientY, 10);
  });

  const savedTheme = localStorage.getItem("xn_theme") || "fern";
  applyTheme(savedTheme);
  const savedNight = localStorage.getItem("xn_night") === "1";
  applyNight(savedNight);
}

function loadBooks(){
  try{ return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }catch(e){ return []; }
}
function saveBooks(books){ localStorage.setItem(LS_KEY, JSON.stringify(books)); }

// Petals
function spawnPetalsAt(x, y, n = 12){
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
function burstAt(el, n=12){
  if (!el) return;
  const r = el.getBoundingClientRect();
  spawnPetalsAt(r.left + r.width/2, r.top + r.height/2, n);
}
function flowerTick(){
  if (!els.flower) return;
  els.flower.style.opacity = "1";
  els.flower.style.transform = `translateX(${(Math.random()*12-6).toFixed(0)}px)`;
  setTimeout(() => { if (els.flower) els.flower.style.opacity = ".75"; }, 350);
}

function render(){
  const books = loadBooks();
  if (els.count) els.count.textContent = String(books.length);
  renderShelf(books);
  renderTable(books);
}

function renderShelf(books){
  if (!els.shelf) return;
  els.shelf.innerHTML = "";
  const perRow = 10;
  const rows = Math.ceil(books.length / perRow) || 1;

  for (let r=0;r<rows;r++){
    const row = document.createElement("div");
    row.className = "shelf-row";
    for (let i=0;i<perRow;i++){
      const idx = r*perRow + i;
      if (idx >= books.length) break;
      const b = books[idx];

      const item = document.createElement("div");
      item.className = "book";
      if (b.cover){
        item.classList.add("cover");
        item.style.backgroundImage = `url(${b.cover})`;
      } else {
        item.innerHTML = `<div class="spine"><div class="title">${escapeHtml(shortTitle(b.title))}</div><div class="mark">小娜花园</div></div>`;
      }
      item.addEventListener("click", () => { burstAt(item, 10); flowerTick(); });
      row.appendChild(item);
    }
    els.shelf.appendChild(row);
  }
}

function renderTable(books){
  if (!els.tbody) return;
  els.tbody.innerHTML = "";
  books.forEach((b, idx) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = b.title || "未命名";

    const td2 = document.createElement("td");
    if (b.cover){
      const img = document.createElement("img");
      img.className = "cover-thumb";
      img.src = b.cover;
      img.alt = b.title || "cover";
      td2.appendChild(img);
    } else {
      td2.textContent = "—";
      td2.style.color = "rgba(60,50,40,.55)";
    }

    const td3 = document.createElement("td");
    td3.textContent = b.note || "";

    const td4 = document.createElement("td");
    const del = document.createElement("button");
    del.className = "btn btn-ghost sparkle";
    del.type = "button";
    del.textContent = "删除";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      const books2 = loadBooks();
      books2.splice(idx, 1);
      saveBooks(books2);
      render();
      burstAt(del, 10);
    });
    td4.appendChild(del);

    tr.append(td1, td2, td3, td4);
    els.tbody.appendChild(tr);
  });
}

function shortTitle(t){
  const s = (t || "未命名").trim();
  return s.length > 6 ? s.slice(0,6) + "…" : s;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

async function fileToDataUrl(file){
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Weather layer (same as index)
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
    for (let i=0;i<52;i++){
      if (Math.random() < 0.5) makeDrop(0, leftStrip);
      else makeDrop(rightStripStart, w);
    }
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

async function initWeather(){
  const pill = els.weatherPill;
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

// Mobile nav more (same strategy: clone hidden links)
function setupNavMore(){
  const btn = els.navMoreBtn;
  const menu = els.navMoreMenu;
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

// PWA
function setupPWA(){
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}

function setup(){
  setupThemeModal();
  setupNavMore();
  setupPWA();

  els.add?.addEventListener("click", (e) => {
    const books = loadBooks();
    books.push({ title:"未命名", cover:"", note:"" });
    saveBooks(books); render(); flowerTick(); spawnPetalsAt(e.clientX, e.clientY, 12);
  });
  els.remove?.addEventListener("click", (e) => {
    const books = loadBooks(); books.pop();
    saveBooks(books); render(); flowerTick(); spawnPetalsAt(e.clientX, e.clientY, 12);
  });
  els.clear?.addEventListener("click", (e) => {
    if (!confirm("确定要清空阅读书架吗？（会删除本机保存的数据）")) return;
    saveBooks([]); render(); flowerTick(); spawnPetalsAt(e.clientX, e.clientY, 16);
  });

  els.form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = (els.title?.value || "").trim() || "未命名";
    const note = (els.note?.value || "").trim();
    const file = els.cover?.files?.[0];

    const books = loadBooks();
    let cover = "";
    if (file) cover = await fileToDataUrl(file);
    books.push({ title, cover, note });
    saveBooks(books);

    if (els.title) els.title.value = "";
    if (els.note) els.note.value = "";
    if (els.cover) els.cover.value = "";

    render(); flowerTick();
    burstAt(document.getElementById("upload-book"), 16);
  });

  document.querySelectorAll(".ornament").forEach(btn => {
    btn.addEventListener("click", (e) => spawnPetalsAt(e.clientX, e.clientY, 14));
  });

  render();
  initWeather();
}

window.addEventListener("load", setup);
