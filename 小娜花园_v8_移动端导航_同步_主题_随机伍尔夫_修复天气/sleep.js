
(function(){
  const KEY = "chai_sleep_v6";
  const $ = (id)=>document.getElementById(id);

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ return []; } }
  function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function today(){ return new Date().toISOString().slice(0,10); }

  function render(){
    const listEl = $("sList");
    if(!listEl) return;
    const list = read().slice().sort((a,b)=> (b.date||"").localeCompare(a.date||"")).slice(0,7);
    listEl.innerHTML = "";
    if(list.length===0){
      const e = document.createElement("div");
      e.className = "hint";
      e.textContent = "还没有记录。先从今天开始：写一个小时数。";
      listEl.appendChild(e);
      return;
    }
    list.forEach(it=>{
      const row = document.createElement("div");
      row.className = "kv";
      row.innerHTML = `<span class="mono">${it.date}</span><b>${Number(it.hours||0).toFixed(2)} h</b>`;
      listEl.appendChild(row);
    });

    // sync homepage summary: store today's hours
    const t = today();
    const todayRec = read().find(x=>x.date===t);
    if(todayRec){
      // stored in main.js via chai_sleep_v6 already
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const d = $("sDate");
    if(d) d.value = today();

    $("sSave")?.addEventListener("click", ()=>{
      const date = ($("sDate")?.value || today()).trim();
      const hours = Number(($("sHours")?.value || "0"));
      const list = read();
      const idx = list.findIndex(x=>x.date===date);
      if(idx>=0) list[idx] = {date, hours};
      else list.push({date, hours});
      save(list);
      render();
    });

    render();
  });
})();
