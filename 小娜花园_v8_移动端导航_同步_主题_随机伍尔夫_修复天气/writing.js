
(function(){
  const KEY = "chai_writing_v6";
  const $ = (id)=>document.getElementById(id);

  function read(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '{"daily":{}}'); }catch(_){ return {daily:{}}; }
  }
  function save(v){
    localStorage.setItem(KEY, JSON.stringify(v));
  }
  function today(){
    return new Date().toISOString().slice(0,10);
  }

  function monthKey(d){
    return d.slice(0,7); // YYYY-MM
  }

  function calcMonthTotal(data){
    const m = monthKey(today());
    let sum = 0;
    for(const k in data.daily){
      if(k.startsWith(m)) sum += Number(data.daily[k].words||0);
    }
    return sum;
  }

  function encourage(words, mood){
    if(words >= 1500) return "今天你真是火力全开。把这股劲儿留一点给明天。";
    if(words >= 600) return "很好，火在稳定燃烧。保持这个节奏就够了。";
    if(words > 0) return "已经开始了，就赢了一半。允许自己慢慢写。";
    if(mood === "blocked") return "卡住也没关系：写一句也算写作。先把门推开一点点。";
    return "今天可以用 5 分钟写一个小开头：让身体先动起来。";
  }

  function renderHeat(data){
    const box = $("wHeat");
    if(!box) return;
    box.innerHTML = "";
    const end = new Date();
    for(let i=13;i>=0;i--){
      const d = new Date(end.getTime() - i*24*60*60*1000);
      const key = d.toISOString().slice(0,10);
      const words = Number(data.daily?.[key]?.words || 0);
      const cell = document.createElement("div");
      cell.className = "heat-cell" + (words>0 ? " on" : "");
      cell.title = `${key}：${words}字`;
      box.appendChild(cell);
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const data = read();
    const t = today();

    const mt = $("wMonthTotal");
    if(mt) mt.textContent = String(calcMonthTotal(data));

    renderHeat(data);

    $("wSave")?.addEventListener("click", ()=>{
      const words = Number(($("wWords")?.value || "0"));
      const mood = ($("wMood")?.value || "");
      data.daily[t] = {words, mood, at: Date.now()};
      save(data);

      if(mt) mt.textContent = String(calcMonthTotal(data));
      $("wEncourage").textContent = encourage(words, mood);
      renderHeat(data);
    });

    // load existing
    const exist = data.daily[t]?.words;
    if(exist != null) $("wWords").value = String(exist);
    const em = data.daily[t]?.mood;
    if(em) $("wMood").value = em;
    $("wEncourage").textContent = encourage(Number(exist||0), em||"");
  });
})();
