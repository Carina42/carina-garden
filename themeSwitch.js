(function(){
  const THEMES = ["theme-leaf","theme-moss","theme-sun","theme-night"];
  const KEY = "chai_theme_v6";

  function applyTheme(cls){
    document.body.classList.remove(...THEMES);
    document.body.classList.add(cls);
    try{ localStorage.setItem(KEY, cls); }catch(_){}
  }

  function nextTheme(){
    const current = THEMES.find(t => document.body.classList.contains(t)) || THEMES[0];
    const idx = THEMES.indexOf(current);
    const next = THEMES[(idx+1) % THEMES.length];
    applyTheme(next);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // restore
    try{
      const saved = localStorage.getItem(KEY);
      if(saved && THEMES.includes(saved)) applyTheme(saved);
    }catch(_){}

    // highlight current nav
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const map = {
      "index.html":"home","reading.html":"reading","writing.html":"writing",
      "sleep.html":"sleep","exercise.html":"exercise","todo.html":"todo","goals.html":"goals"
    };
    const key = map[path];
    document.querySelectorAll(".nav-item").forEach(a=>{
      if(a.dataset.nav === key) a.classList.add("active");
    });

    const btn = document.getElementById("themeToggle");
    if(btn){
      btn.addEventListener("click", nextTheme);
    }
  });

  // expose for debugging
  window.__chaiTheme = { applyTheme, nextTheme };
})();