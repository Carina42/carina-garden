// 小娜花园 · reading.js (v10)
const LS_KEY = "xn_garden_reading_books_v1";

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

function loadBooks(){
  try{ return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }catch(e){ return []; }
}
function saveBooks(books){ localStorage.setItem(LS_KEY, JSON.stringify(books)); }

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

function setupNavMore(){
  const btn = els.navMoreBtn;
  const menu = els.navMoreMenu;
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

function setup(){
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
  setupNavMore();
  initWeather();
}

window.addEventListener("load", setup);
