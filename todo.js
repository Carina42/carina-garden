
(function(){
  const KEY="chaiTodos";
  const pad2=n=>String(n).padStart(2,"0");
  const dayKey=()=>{
    const d=new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  };
  const read=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch{return[];} };
  const write=(a)=>localStorage.setItem(KEY, JSON.stringify(a));

  const text=$("#tText");
  const due=$("#tDue");
  const add=$("#tAdd");
  const list=$("#tList");

  function $(s){ return document.querySelector(s); }

  function render(){
    const arr=read();
    // sort: undone first, then due
    arr.sort((a,b)=>{
      if(!!a.done !== !!b.done) return a.done? 1 : -1;
      return (a.due||"").localeCompare(b.due||"");
    });
    write(arr);
    list.innerHTML="";
    if(arr.length===0){
      const div=document.createElement("div");
      div.className="small";
      div.textContent="还没有待办。写一条最重要的就够。";
      list.appendChild(div);
      return;
    }
    arr.forEach((t,i)=>{
      const div=document.createElement("div");
      div.className="item";
      div.innerHTML = `
        <div class="left">
          <div class="t">${escapeHtml(t.text)}</div>
          <div class="m">${t.due? ("截止："+t.due):""}</div>
        </div>
        <div class="right">
          <button class="btn" data-done="${i}">${t.done?"已完成":"完成"}</button>
          <button class="btn danger" data-del="${i}">删除</button>
        </div>`;
      list.appendChild(div);
    });

    list.querySelectorAll("button[data-done]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const i=parseInt(btn.dataset.done,10);
        const arr=read();
        arr[i].done = !arr[i].done;
        write(arr);
        render();
      });
    });
    list.querySelectorAll("button[data-del]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const i=parseInt(btn.dataset.del,10);
        const arr=read();
        arr.splice(i,1);
        write(arr);
        render();
      });
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  add.addEventListener("click", ()=>{
    const v=(text.value||"").trim();
    if(!v) return;
    const arr=read();
    arr.push({ text:v, due:(due.value||""), done:false, createdAt:new Date().toISOString() });
    write(arr);
    text.value="";
    render();
  });

  document.addEventListener("DOMContentLoaded", ()=>{
    due.value = dayKey();
    render();
  });
})();
