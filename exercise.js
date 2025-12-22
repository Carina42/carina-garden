
(function(){
  const KEY = "chai_exercise_v6";
  const $ = (id)=>document.getElementById(id);

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ return []; } }
  function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function today(){ return new Date().toISOString().slice(0,10); }

  function weekStart(d){
    const dt = new Date(d+"T00:00:00");
    const day = (dt.getDay()+6)%7; // Mon=0
    dt.setDate(dt.getDate() - day);
    return dt.toISOString().slice(0,10);
  }

  function render(){
    const list = read().slice().sort((a,b)=> (b.date||"").localeCompare(a.date||"")).slice(0,10);
    const listEl = $("eList");
    if(listEl){
      listEl.innerHTML = "";
      if(list.length===0){
        const e = document.createElement("div");
        e.className = "hint";
        e.textContent = "还没有记录运动。散步 10 分钟也算。";
        listEl.appendChild(e);
      }else{
        list.forEach(it=>{
          const row = document.createElement("div");
          row.className = "kv";
          row.innerHTML = `<span class="mono">${it.date}</span><span>${it.what||"运动"}</span><b>${Number(it.minutes||0)} min</b>`;
          listEl.appendChild(row);
        });
      }
    }

    // week total
    const t = today();
    const ws = weekStart(t);
    const all = read();
    const total = all
      .filter(x=>x.date>=ws && x.date<=t)
      .reduce((a,b)=>a+(Number(b.minutes)||0),0);
    const wt = $("eWeekTotal");
    if(wt) wt.textContent = String(total);
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const d = $("eDate");
    if(d) d.value = today();

    $("eSave")?.addEventListener("click", ()=>{
      const date = ($("eDate")?.value || today()).trim();
      const what = ($("eWhat")?.value || "").trim();
      const minutes = Number(($("eMin")?.value || "0"));
      const list = read();
      list.push({date, what, minutes});
      save(list);
      render();
      $("eWhat").value = "";
      $("eMin").value = "";
    });

    render();
  });
})();
