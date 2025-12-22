(function(){
  const KEY = "chai_theme_v7";

  const THEMES = [
    { cls:"theme-leaf",  name:"叶影",  chips:["#2f6b53","#7aa184","#f7f4ef"] },
    { cls:"theme-moss",  name:"苔雾",  chips:["#3d6c5a","#8fb59b","#f2efe8"] },
    { cls:"theme-sun",   name:"日光",  chips:["#9b6b2f","#d8c7a8","#fbf6ee"] },
    { cls:"theme-night", name:"夜墨",  chips:["#2b3a4a","#7b9db0","#f2f3f5"] },
    { cls:"theme-sage",  name:"鼠尾草",chips:["#58756b","#a3b7a9","#f3f2ee"] },
    { cls:"theme-clay",  name:"陶土",  chips:["#7b4d3a","#cfae9f","#f6f0eb"] },
    { cls:"theme-rose",  name:"蔷薇",  chips:["#7a3d4f","#d7a7b6","#f7f1f3"] },
    { cls:"theme-sky",   name:"晴蓝",  chips:["#2f5e7a","#a7c6d7","#f1f6f8"] }
  ];

  function applyTheme(cls){
    document.body.classList.remove(...THEMES.map(t=>t.cls));
    document.body.classList.add(cls);
    try{ localStorage.setItem(KEY, cls); }catch(_){}
    // update active badge
    const current = THEMES.find(t=>t.cls===cls);
    const badge = document.getElementById("themeCurrent");
    if(badge && current) badge.textContent = current.name;
  }

  function restoreTheme(){
    try{
      const saved = localStorage.getItem(KEY);
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

  document.addEventListener("DOMContentLoaded", ()=>{
    restoreTheme();
    highlightNav();
    ensurePickerUI();
  });

  window.__chaiTheme = { applyTheme };
})();
