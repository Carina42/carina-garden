
/**
 * 柴窝之家 · reading.js
 * - 书籍数据 chaiBooks（localStorage）
 * - 年度计数 chaiBookCount + 是否自动+1
 * - 书架：每层 10 本，封面渲染
 * - 卡片笔记：搜索/标签筛选
 * - 月度趋势图 + 情绪热力图（canvas）
 */
(function(){
  const LS_BOOKS = "chaiBooks";
  const LS_COUNT = "chaiBookCount";
  const LS_AUTOINC = "chaiBookAutoInc";

  const $ = (s)=>document.querySelector(s);
  const pad2 = (n)=>String(n).padStart(2,"0");
  const localDayKey = ()=>{
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  };
  function readJson(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }catch{ return fallback; }
  }
  function writeJson(key, val){
    localStorage.setItem(key, JSON.stringify(val));
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  // ---------- data ----------
  let books = readJson(LS_BOOKS, []);
  let count = parseInt(localStorage.getItem(LS_COUNT) || String(books.length || 0), 10);
  let autoInc = (localStorage.getItem(LS_AUTOINC) ?? "true") === "true";

  function saveAll(){
    writeJson(LS_BOOKS, books);
    localStorage.setItem(LS_COUNT, String(count));
    localStorage.setItem(LS_AUTOINC, String(autoInc));
  }

  // ---------- UI refs ----------
  const countText = $("#countText");
  const plus = $("#countPlus");
  const minus = $("#countMinus");
  const syncToggle = $("#countSyncToggle");
  const shelfBox = $("#shelfBox");

  const bTitle = $("#bTitle");
  const bAuthor = $("#bAuthor");
  const bTags = $("#bTags");
  const bMood = $("#bMood");
  const bNotes = $("#bNotes");
  const bDate = $("#bDate");
  const bCover = $("#bCover");
  const bAdd = $("#bAdd");

  const q = $("#q");
  const tag = $("#tag");
  const clear = $("#clear");
  const cards = $("#cards");

  const modal = $("#modal");
  const mTitle = $("#mTitle");
  const mCover = $("#mCover");
  const mBadges = $("#mBadges");
  const mMeta = $("#mMeta");
  const mNotes = $("#mNotes");
  const mClose = $("#mClose");
  const mDelete = $("#mDelete");
  const mReread = $("#mReread");

  const chart = $("#monthlyChart");
  const heat = $("#emotionHeatmap");

  let modalIndex = -1;

  // ---------- helpers ----------
  function tagList(str){
    return (str||"")
      .split(/[,，/、\s]+/)
      .map(s=>s.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  function setCountUI(){
    if(countText) countText.textContent = String(count);
    if(syncToggle) syncToggle.textContent = `自动+1：${autoInc ? "开" : "关"}`;
  }

  function setDefaultDate(){
    if(!bDate) return;
    bDate.value = localDayKey();
  }

  function makeBookSpineEl(book, idx){
    const d = document.createElement("div");
    d.className = "book" + (book.coverData ? " has-cover":"");
    d.title = book.title || "（未命名）";
    if(book.coverData){
      d.style.backgroundImage = `url(${book.coverData})`;
    }
    const spine = document.createElement("div");
    spine.className = "spine";
    const dot = document.createElement("div");
    dot.className = "dot";
    d.appendChild(spine);
    d.appendChild(dot);
    d.addEventListener("click", ()=> openModal(idx));
    return d;
  }

  // ---------- shelf render ----------
  function renderShelf(){
    if(!shelfBox) return;
    shelfBox.innerHTML = "";
    const perRow = 10;
    const rows = Math.ceil(books.length / perRow) || 1;
    for(let r=0;r<rows;r++){
      const row = document.createElement("div");
      row.className = "row";
      const slice = books.slice(r*perRow, r*perRow + perRow);
      slice.forEach((b, i)=>{
        row.appendChild(makeBookSpineEl(b, r*perRow+i));
      });
      shelfBox.appendChild(row);
    }
  }

  // ---------- card render ----------
  function bookMatches(book, text, tagText){
    const t = (text||"").trim().toLowerCase();
    const tg = (tagText||"").trim().toLowerCase();
    const blob = [
      book.title, book.author, book.tags, book.notes, book.mood
    ].join(" ").toLowerCase();

    const okText = !t || blob.includes(t);
    const okTag = !tg || (book.tags||"").toLowerCase().includes(tg);
    return okText && okTag;
  }

  function renderCards(){
    if(!cards) return;
    cards.innerHTML = "";

    const text = q?.value || "";
    const tg = tag?.value || "";
    const list = books
      .map((b, i)=>({b,i}))
      .filter(x=>bookMatches(x.b, text, tg));

    if(list.length===0){
      const div = document.createElement("div");
      div.className = "small";
      div.textContent = "没有匹配的书。换个关键词试试？";
      cards.appendChild(div);
      return;
    }

    list.slice().reverse().forEach(({b,i})=>{
      const wrap = document.createElement("div");
      wrap.className = "card bookcard";

      const cover = document.createElement("div");
      cover.className = "cover";
      if(b.coverData) cover.style.backgroundImage = `url(${b.coverData})`;

      const info = document.createElement("div");
      info.className = "info";
      const title = document.createElement("div");
      title.style.fontWeight = "800";
      title.style.fontSize = "14px";
      title.textContent = b.title || "（未命名）";

      const meta = document.createElement("div");
      meta.className = "small";
      const date = b.finishedDate || "";
      meta.textContent = `${b.author || "（作者未填）"} · ${date}`;

      const badges = document.createElement("div");
      badges.className = "badges";
      tagList(b.tags).forEach(t=>{
        const bd = document.createElement("span");
        bd.className = "badge";
        bd.textContent = t;
        badges.appendChild(bd);
      });
      if(b.mood){
        const bd = document.createElement("span");
        bd.className = "badge";
        bd.textContent = "情绪：" + b.mood;
        badges.appendChild(bd);
      }
      if(b.reread){
        const bd = document.createElement("span");
        bd.className = "badge";
        bd.textContent = "想重读";
        badges.appendChild(bd);
      }

      const snippet = document.createElement("div");
      snippet.className = "small";
      snippet.textContent = (b.notes||"").slice(0, 60) + ((b.notes||"").length>60 ? "…" : "");

      const actions = document.createElement("div");
      actions.className = "actions";
      const open = document.createElement("button");
      open.className = "btn primary";
      open.textContent = "打开";
      open.addEventListener("click", ()=> openModal(i));
      const del = document.createElement("button");
      del.className = "btn danger";
      del.textContent = "删除";
      del.addEventListener("click", ()=> deleteBook(i));
      actions.appendChild(open);
      actions.appendChild(del);

      info.appendChild(title);
      info.appendChild(meta);
      info.appendChild(badges);
      info.appendChild(snippet);
      info.appendChild(actions);

      wrap.appendChild(cover);
      wrap.appendChild(info);

      cards.appendChild(wrap);
    });
  }

  // ---------- modal ----------
  function openModal(i){
    modalIndex = i;
    const b = books[i];
    if(!b) return;

    mTitle.textContent = b.title || "（未命名）";
    mCover.style.backgroundImage = b.coverData ? `url(${b.coverData})` : "none";
    mBadges.innerHTML = "";
    tagList(b.tags).forEach(t=>{
      const bd = document.createElement("span");
      bd.className = "badge";
      bd.textContent = t;
      mBadges.appendChild(bd);
    });
    if(b.mood){
      const bd = document.createElement("span");
      bd.className = "badge";
      bd.textContent = "情绪：" + b.mood;
      mBadges.appendChild(bd);
    }
    if(b.reread){
      const bd = document.createElement("span");
      bd.className = "badge";
      bd.textContent = "想重读";
      mBadges.appendChild(bd);
    }

    mMeta.textContent = `${b.author||"（作者未填）"} · ${b.finishedDate||""}`;
    mNotes.textContent = b.notes || "（还没写笔记，也没关系：慢慢来。）";

    modal.classList.add("open");
  }

  function closeModal(){
    modal.classList.remove("open");
    modalIndex = -1;
  }

  function deleteBook(i){
    if(i<0 || i>=books.length) return;
    const ok = confirm("要删除这本书的记录吗？（不会影响计数按钮的数字）");
    if(!ok) return;
    books.splice(i,1);
    saveAll();
    renderAll();
    closeModal();
  }

  // ---------- add book ----------
  async function readFileAsDataURL(file){
    return new Promise((resolve,reject)=>{
      const r = new FileReader();
      r.onload = ()=> resolve(r.result);
      r.onerror = ()=> reject(new Error("读取封面失败"));
      r.readAsDataURL(file);
    });
  }

  async function addBook(){
    const title = (bTitle.value||"").trim();
    if(!title){
      alert("书名是必填的噢");
      return;
    }
    const book = {
      title,
      author: (bAuthor.value||"").trim(),
      tags: (bTags.value||"").trim(),
      mood: (bMood.value||"").trim(),
      notes: (bNotes.value||"").trim(),
      finishedDate: (bDate.value||localDayKey()).trim(),
      coverData: "",
      reread: false,
      createdAt: new Date().toISOString()
    };
    const file = bCover.files?.[0];
    if(file){
      book.coverData = await readFileAsDataURL(file);
    }

    books.push(book);

    if(autoInc){
      count += 1;
    }
    saveAll();

    // reset minimal
    bTitle.value = "";
    bAuthor.value = "";
    bTags.value = "";
    bMood.value = "";
    bNotes.value = "";
    bCover.value = "";

    renderAll();
  }

  // ---------- charts ----------
  const MORANDI = ["#b8c0d4","#c8d6c1","#d9cfc3","#e8c0b9","#f4d7d0","#dbc2cf","#bedadc","#c2c2b0","#b6a6ca","#b9d8d3","#d4cbc4","#c6d3c8"];
  function drawMonthly(){
    if(!chart) return;
    const ctx = chart.getContext("2d");
    const w = chart.width, h = chart.height;
    ctx.clearRect(0,0,w,h);

    const months = Array.from({length:12}, (_,i)=>i);
    const counts = new Array(12).fill(0);
    books.forEach(b=>{
      if(!b.finishedDate) return;
      const d = new Date(b.finishedDate+"T00:00:00");
      if(isNaN(d)) return;
      if(d.getFullYear() !== new Date().getFullYear()) return;
      counts[d.getMonth()] += 1;
    });

    const max = Math.max(1, ...counts);
    const pad = 24;
    const baseY = h - pad;
    const barW = (w - pad*2) / 12 * 0.72;
    const gap = (w - pad*2) / 12 * 0.28;

    // axis
    ctx.globalAlpha = .9;
    ctx.strokeStyle = "rgba(0,0,0,.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, baseY);
    ctx.lineTo(w-pad, baseY);
    ctx.stroke();

    // title
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.font = "12px ui-rounded, system-ui";
    ctx.fillText(`${new Date().getFullYear()} 月度阅读（本）`, pad, 16);

    // bars
    months.forEach((m,i)=>{
      const x = pad + i*((barW+gap));
      const bh = (counts[i]/max) * (h - pad*2 - 10);
      const y = baseY - bh;

      ctx.fillStyle = MORANDI[i % MORANDI.length];
      roundRect(ctx, x, y, barW, bh, 10, true, false);

      // label
      ctx.fillStyle = "rgba(0,0,0,.55)";
      ctx.font = "11px ui-rounded, system-ui";
      ctx.fillText(String(i+1), x + barW/2 - 3, baseY + 14);

      // value
      ctx.fillStyle = "rgba(0,0,0,.55)";
      ctx.font = "11px ui-rounded, system-ui";
      ctx.fillText(String(counts[i]), x + barW/2 - 3, y - 6);
    });

    function roundRect(ctx, x, y, w, h, r, fill, stroke){
      if(w<2*r) r = w/2;
      if(h<2*r) r = h/2;
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.arcTo(x+w, y, x+w, y+h, r);
      ctx.arcTo(x+w, y+h, x, y+h, r);
      ctx.arcTo(x, y+h, x, y, r);
      ctx.arcTo(x, y, x+w, y, r);
      ctx.closePath();
      if(fill) ctx.fill();
      if(stroke) ctx.stroke();
    }
  }

  const MOOD_COLORS = {
    "平静":"#b9d8d3",
    "愉悦":"#c8d6c1",
    "感动":"#e8c0b9",
    "惊喜":"#b8c0d4",
    "沉思":"#d4cbc4",
    "低落":"#c2c2b0",
    "愤怒":"#dbc2cf"
  };

  function drawHeatmap(){
    if(!heat) return;
    const ctx = heat.getContext("2d");
    const W = heat.width, H = heat.height;
    ctx.clearRect(0,0,W,H);

    const year = new Date().getFullYear();
    const start = new Date(year,0,1);
    const end = new Date(year+1,0,1);
    const days = Math.round((end-start)/86400000);

    // grid: 53 weeks x 7 days
    const cols = 53, rows = 7;
    const pad = 18;
    const cell = Math.floor((W - pad*2) / cols);
    const cellH = Math.floor((H - pad*2) / rows);
    const size = Math.min(cell, cellH);

    // map day->mood color & intensity
    const map = new Map(); // key: dayIndex, val: {color, n}
    books.forEach(b=>{
      if(!b.finishedDate) return;
      const d = new Date(b.finishedDate+"T00:00:00");
      if(isNaN(d) || d.getFullYear()!==year) return;
      const idx = Math.floor((d - start)/86400000);
      const prev = map.get(idx) || { color: "#d9cfc3", n: 0 };
      const c = MOOD_COLORS[b.mood] || prev.color;
      map.set(idx, { color: c, n: prev.n + 1 });
    });

    // title
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.font = "12px ui-rounded, system-ui";
    ctx.fillText(`${year} 阅读情绪热力图（按日）`, pad, 16);

    for(let day=0; day<days; day++){
      const date = new Date(start.getTime() + day*86400000);
      const dow = (date.getDay()+6)%7; // Monday=0 vibe
      const week = Math.floor((day + (start.getDay()+6)%7) / 7);
      if(week>=cols) continue;

      const x = pad + week*size;
      const y = pad + dow*size;

      const v = map.get(day);
      const base = "rgba(0,0,0,.08)";
      ctx.fillStyle = base;
      roundRect(ctx, x, y, size-2, size-2, 6, true, false);

      if(v){
        const alpha = Math.min(0.85, 0.35 + 0.18*(v.n-1));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = v.color;
        roundRect(ctx, x, y, size-2, size-2, 6, true, false);
        ctx.globalAlpha = 1.0;
      }
    }

    // legend
    const moods = Object.keys(MOOD_COLORS);
    let lx = pad, ly = H - 12;
    ctx.font = "11px ui-rounded, system-ui";
    moods.forEach((m,i)=>{
      const c = MOOD_COLORS[m];
      const bx = lx + i*88;
      if(bx + 80 > W - pad) return;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = c;
      roundRect(ctx, bx, ly-10, 12, 12, 4, true, false);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "rgba(0,0,0,.55)";
      ctx.fillText(m, bx + 16, ly);
    });

    function roundRect(ctx, x, y, w, h, r, fill, stroke){
      if(w<2*r) r = w/2;
      if(h<2*r) r = h/2;
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.arcTo(x+w, y, x+w, y+h, r);
      ctx.arcTo(x+w, y+h, x, y+h, r);
      ctx.arcTo(x, y+h, x, y, r);
      ctx.arcTo(x, y, x+w, y, r);
      ctx.closePath();
      if(fill) ctx.fill();
      if(stroke) ctx.stroke();
    }
  }

  // ---------- modal actions ----------
  function toggleReread(){
    if(modalIndex<0) return;
    books[modalIndex].reread = !books[modalIndex].reread;
    saveAll();
    renderAll();
    openModal(modalIndex); // refresh badges
  }

  // ---------- bind ----------
  function bind(){
    plus.addEventListener("click", ()=>{ count++; saveAll(); setCountUI(); });
    minus.addEventListener("click", ()=>{ if(count>0) count--; saveAll(); setCountUI(); });
    syncToggle.addEventListener("click", ()=>{ autoInc = !autoInc; saveAll(); setCountUI(); });

    bAdd.addEventListener("click", (e)=>{ e.preventDefault(); addBook(); });

    q.addEventListener("input", renderCards);
    tag.addEventListener("input", renderCards);
    clear.addEventListener("click", ()=>{
      q.value = ""; tag.value = ""; renderCards();
    });

    mClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e)=>{ if(e.target===modal) closeModal(); });
    mDelete.addEventListener("click", ()=> deleteBook(modalIndex));
    mReread.addEventListener("click", toggleReread);
  }

  function renderAll(){
    setCountUI();
    renderShelf();
    renderCards();
    drawMonthly();
    drawHeatmap();
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    setDefaultDate();
    setCountUI();
    bind();
    renderAll();
  });
})();
