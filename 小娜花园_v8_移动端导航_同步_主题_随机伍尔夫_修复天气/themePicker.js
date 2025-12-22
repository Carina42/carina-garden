(function(){
  const KEY = "xng_theme_v8";

  const THEMES = [
    { cls:"theme-fern",  name:"蕨影",  note:"深绿 · 安心",  chips:["#2f6b53","#7aa184","#f7f4ef"] },
    { cls:"theme-moss",  name:"苔雾",  note:"灰绿 · 轻柔",  chips:["#446a4b","#9ab08a","#f5f6f0"] },
    { cls:"theme-oat",   name:"燕麦",  note:"米白 · 松弛",  chips:["#7b6a4f","#d8c7a8","#fbf6ee"] },
    { cls:"theme-mist",  name:"雾蓝",  note:"灰蓝 · 清醒",  chips:["#2f5e7a","#a7c6d7","#f1f6f8"] },
    { cls:"theme-rose",  name:"蔷薇",  note:"豆沙 · 温暖",  chips:["#7a3d4f","#d7a7b6","#f7f1f3"] },
    { cls:"theme-clay",  name:"陶土",  note:"赤陶 · 可靠",  chips:["#7b4d3a","#cfae9f","#f6f0eb"] },
    { cls:"theme-lilac", name:"灰紫",  note:"薰衣草 · 轻梦", chips:["#5b5875","#b2b0c6","#f3f2f6"] },
    { cls:"theme-night", name:"夜松",  note:"深夜 · 护眼",  chips:["#2b3a4a","#7b9db0","#1b1f28"] }
  ];

  function applyTheme(cls){
    document.body.classList.remove(...THEMES.map(t=>t.cls), "theme-leaf","theme-sun","theme-sage","theme-sky","theme-clay","theme-rose","theme-moss","theme-night");
    document.body.classList.add(cls);
    try{ localStorage.setItem(KEY, cls); }catch(_){}
    // update active badge
    const current = THEMES.find(t=>t.cls===cls);
    const badge = document.getElementById("themeCurrent");
    if(badge && current) badge.textContent = current.name;
  }

  function restoreTheme(){
    try{
      const saved = localStorage.getItem(KEY) || localStorage.getItem("chai_theme_v7");
      if(saved && THEMES.some(t=>t.cls===saved)) applyTheme(saved);
      else applyTheme(THEMES[0].cls);
    }catch(_){
      applyTheme(THEMES[0].cls);
    }
  }

  function highlightNav(){
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const map = {
      "index.html":"home","reading.html":"reading","writing.html":"writing",
      "sleep.html":"sleep","exercise.html":"exercise","todo.html":"todo","goals.html":"goals"
    };
    const key = map[path];
    document.querySelectorAll(".nav-item").forEach(a=>{
      a.classList.toggle("active", a.dataset.nav === key);
    });
  }

  function ensurePickerUI(){
    const btn = document.getElementById("themeToggle");
    const modal = document.getElementById("themePicker");
    const grid = document.getElementById("themeGrid");
    const close = document.getElementById("themeClose");
    if(!btn || !modal || !grid || !close) return;

    function open(){ modal.classList.add("show"); }
    function hide(){ modal.classList.remove("show"); }

    btn.addEventListener("click", open);
    close.addEventListener("click", hide);
    modal.addEventListener("click", (e)=>{ if(e.target === modal) hide(); });

    // build cards
    grid.innerHTML = "";
    THEMES.forEach(t=>{
      const card = document.createElement("button");
      card.type = "button";
      card.className = "theme-card";
      card.setAttribute("data-theme", t.cls);
      card.innerHTML = `
        <span class="swatches">
          ${t.chips.map(c=>`<i style="background:${c}"></i>`).join("")}
        </span>
        <span class="theme-name">${t.name}</span>
      `;
      card.addEventListener("click", ()=>{
        applyTheme(t.cls);
        hide();
      });
      grid.appendChild(card);
    });
  }


  function ensureMoreMenu(){
    const btn = document.getElementById("moreBtn");
    const menu = document.getElementById("moreMenu");
    if(!btn || !menu) return;

    function close(){
      btn.setAttribute("aria-expanded","false");
      menu.classList.remove("show");
    }
    function open(){
      btn.setAttribute("aria-expanded","true");
      menu.classList.add("show");
    }

    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const expanded = btn.getAttribute("aria-expanded")==="true";
      expanded ? close() : open();
    });
    document.addEventListener("click", (e)=>{
      if(menu.classList.contains("show")) close();
    });
    document.addEventListener("keydown", (e)=>{
      if(e.key==="Escape") close();
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    restoreTheme();
    highlightNav();
    ensurePickerUI();
    ensureMoreMenu();
  });

  window.__chaiTheme = { applyTheme };
})();
