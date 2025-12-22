
(function(){
  const KEY = "chai_goals_v6";
  const $ = (id)=>document.getElementById(id);

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ return []; } }
  function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }

  function updateYear(){
    const now = new Date();
    const y = now.getFullYear();
    const start = new Date(y,0,1);
    const end = new Date(y+1,0,1);
    const passed = now - start;
    const total = end - start;
    const p = Math.max(0, Math.min(1, passed/total));
    const leftDays = Math.ceil((end - now) / (1000*60*60*24));
    $("gDaysLeft").textContent = `${leftDays} 天`;
    $("gYearFill").style.width = `${(p*100).toFixed(2)}%`;
  }

  function render(){
    const listEl = $("gList");
    if(!listEl) return;
    const list = read();
    listEl.innerHTML = "";
    if(list.length===0){
      const e = document.createElement("div");
      e.className = "hint";
      e.textContent = "还没有目标。写一个很小、很可实现的开始。";
      listEl.appendChild(e);
      return;
    }
    list.forEach((it, idx)=>{
      const row = document.createElement("div");
      row.className = "todo-item";
      row.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" ${it.done ? "checked":""} />
          <div>
            <div class="todo-text">${it.text}</div>
            <div class="todo-meta">${it.done ? "已完成" : "进行中"}</div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="todo-btn" title="删除">🗑️</button>
        </div>
      `;
      const cb = row.querySelector("input");
      cb.addEventListener("change", ()=>{
        const list2 = read();
        list2[idx].done = cb.checked;
        save(list2);
        render();
      });
      row.querySelector(".todo-btn").addEventListener("click", ()=>{
        const list2 = read().filter((_,i)=>i!==idx);
        save(list2);
        render();
      });
      listEl.appendChild(row);
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    updateYear();
    render();
    $("gAdd")?.addEventListener("click", ()=>{
      const text = ($("gText")?.value || "").trim();
      if(!text) return;
      const list = read();
      list.unshift({text, done:false});
      save(list);
      $("gText").value = "";
      render();
    });
  });
})();
