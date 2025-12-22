
(function(){
  const KEY="chaiSleep";
  const pad2=n=>String(n).padStart(2,"0");
  const dayKey=(d=new Date())=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  const read=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch{return{};} };
  const write=(o)=>localStorage.setItem(KEY, JSON.stringify(o));

  const hours=$("#sHours");
  const note=$("#sNote");
  const save=$("#sSave");
  const today=$("#sToday");
  const avg=$("#sAvg");
  const list=$("#sList");

  function $(s){ return document.querySelector(s); }

  function update(){
    const obj=read();
    const dk=dayKey();
    const h = obj[dk]?.hours;
    today.textContent = (h!==undefined) ? `${h}h` : "—";

    const arr=[];
    for(let i=0;i<7;i++){
      const d=new Date(); d.setDate(d.getDate()-i);
      const k=dayKey(d);
      const v=obj[k];
      if(v && typeof v.hours==="number") arr.push(v.hours);
    }
    const av = arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : "—";
    avg.textContent = arr.length ? `${av}h` : "—";

    list.innerHTML="";
    for(let i=0;i<10;i++){
      const d=new Date(); d.setDate(d.getDate()-i);
      const k=dayKey(d);
      const v=obj[k];
      const div=document.createElement("div");
      div.className="item";
      div.innerHTML = `<div class="left"><div class="t">${k}</div><div class="m">${v?.note? v.note:""}</div></div><div class="v">${(v && typeof v.hours==="number")? (v.hours+"h"):"—"}</div>`;
      list.appendChild(div);
    }
  }

  save.addEventListener("click", ()=>{
    const dk=dayKey();
    const obj=read();
    obj[dk]=obj[dk]||{};
    const val=parseFloat(hours.value||"");
    if(isNaN(val) || val<0){ alert("请输入正确的小时数"); return; }
    obj[dk].hours = Math.round(val*10)/10;
    obj[dk].note = (note.value||"").trim();
    write(obj);
    hours.value="";
    note.value="";
    update();
  });

  document.addEventListener("DOMContentLoaded", update);
})();
