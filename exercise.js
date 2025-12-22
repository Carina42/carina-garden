
(function(){
  const KEY="chaiExercise";
  const pad2=n=>String(n).padStart(2,"0");
  const dayKey=(d=new Date())=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  const read=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch{return{};} };
  const write=(o)=>localStorage.setItem(KEY, JSON.stringify(o));

  const mins=$("#eMin");
  const type=$("#eType");
  const save=$("#eSave");
  const today=$("#eToday");
  const week=$("#eWeek");
  const list=$("#eList");

  function $(s){ return document.querySelector(s); }

  function update(){
    const obj=read();
    const dk=dayKey();
    const v=obj[dk];
    today.textContent = v ? `${v.minutes}min · ${v.type||""}` : "—";

    let sum=0;
    for(let i=0;i<7;i++){
      const d=new Date(); d.setDate(d.getDate()-i);
      const k=dayKey(d);
      if(obj[k]?.minutes) sum += obj[k].minutes;
    }
    week.textContent = `${sum}min`;

    list.innerHTML="";
    for(let i=0;i<10;i++){
      const d=new Date(); d.setDate(d.getDate()-i);
      const k=dayKey(d);
      const v=obj[k];
      const div=document.createElement("div");
      div.className="item";
      div.innerHTML = `<div class="left"><div class="t">${k}</div><div class="m">${v?.type? v.type:""}</div></div><div class="v">${(v?.minutes!==undefined)? (v.minutes+"min"):"—"}</div>`;
      list.appendChild(div);
    }
  }

  save.addEventListener("click", ()=>{
    const dk=dayKey();
    const obj=read();
    const m=parseInt(mins.value||"0",10);
    if(isNaN(m) || m<0){ alert("请输入正确分钟数"); return; }
    obj[dk]={ minutes:m, type:(type.value||"").trim() };
    write(obj);
    mins.value=""; type.value="";
    update();
  });

  document.addEventListener("DOMContentLoaded", update);
})();
