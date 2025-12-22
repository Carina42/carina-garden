
(function(){
  const KEY = "chai_todo_v6";
  const $ = (id)=>document.getElementById(id);

  function read(){
    try{ return JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ return []; }
  }
  function save(list){
    localStorage.setItem(KEY, JSON.stringify(list));
  }
  function today(){ return new Date().toISOString().slice(0,10); }

  function norm(s){ return (s||"").trim(); }

  function render(){
    const listEl = $("tList");
    const topEl = $("tTop");
    if(!listEl || !topEl) return;
    const list = read();

    // top priority: those with ! prefix and not done, else first not done
    const open = list.filter(x=>!x.done);
    const prio = open.find(x=>x.prio) || open[0];
    topEl.textContent = prio ? prio.text : "——";

    // also sync homepage "top todo"
    if(prio) localStorage.setItem("chai_top_todo_v6", prio.text);

    listEl.innerHTML = "";
    if(list.length===0){
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = "还没有待办。写一个小任务开始吧。";
      listEl.appendChild(empty);
      return;
    }

    list.forEach((it, idx)=>{
      const row = document.createElement("div");
      row.className = "todo-item";
      const left = document.createElement("div");
      left.className = "todo-left";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!it.done;
      cb.addEventListener("change", ()=>{
        const list2 = read();
        list2[idx].done = cb.checked;
        save(list2);
        render();
      });

      const text = document.createElement("div");
      text.className = "todo-text";
      text.textContent = it.text;

      const meta = document.createElement("div");
      meta.className = "todo-meta";
      meta.textContent = `${it.prio ? "优先" : "普通"} · ${it.date || ""}`;

      left.appendChild(cb);
      const stack = document.createElement("div");
      stack.style.display = "flex";
      stack.style.flexDirection = "column";
      stack.appendChild(text);
      stack.appendChild(meta);
      left.appendChild(stack);

      const actions = document.createElement("div");
      actions.className = "todo-actions";
      const up = document.createElement("button");
      up.className = "todo-btn";
      up.textContent = "⬆️";
      up.title = "上移";
      up.addEventListener("click", ()=>{
        if(idx===0) return;
        const list2 = read();
        const tmp = list2[idx-1];
        list2[idx-1] = list2[idx];
        list2[idx] = tmp;
        save(list2);
        render();
      });

      const del = document.createElement("button");
      del.className = "todo-btn";
      del.textContent = "🗑️";
      del.title = "删除";
      del.addEventListener("click", ()=>{
        const list2 = read().filter((_,i)=>i!==idx);
        save(list2);
        render();
      });

      actions.appendChild(up);
      actions.appendChild(del);

      row.appendChild(left);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    $("tAdd")?.addEventListener("click", ()=>{
      const textRaw = norm($("tText")?.value);
      if(!textRaw) return;
      const prio = textRaw.startsWith("!");
      const text = prio ? textRaw.slice(1).trim() : textRaw;
      const list = read();
      list.unshift({text, prio, done:false, date: today(), id: Math.random().toString(36).slice(2)});
      save(list);
      $("tText").value = "";
      render();
    });

    $("tClearDone")?.addEventListener("click", ()=>{
      const list = read().filter(x=>!x.done);
      save(list);
      render();
    });
    $("tClearAll")?.addEventListener("click", ()=>{
      save([]);
      render();
    });

    render();
  });
})();
