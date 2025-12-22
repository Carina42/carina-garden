
(function(){
  const THEMES = ["theme-moss","theme-sun","theme-night","theme-default"];
  const DEFAULT = "theme-default";
  const key = "chaiTheme";

  function setTheme(name){
    document.body.classList.remove(...THEMES);
    document.body.classList.add(name);
    localStorage.setItem(key, name);
    // update aria-pressed
    document.querySelectorAll("[data-theme]").forEach(btn=>{
      btn.setAttribute("aria-pressed", btn.dataset.theme===name ? "true":"false");
    });
  }

  window.ChaiTheme = { setTheme };

  document.addEventListener("DOMContentLoaded", ()=>{
    const saved = localStorage.getItem(key) || DEFAULT;
    setTheme(saved);
    document.querySelectorAll("[data-theme]").forEach(btn=>{
      btn.addEventListener("click", ()=> setTheme(btn.dataset.theme));
    });
  });
})();
