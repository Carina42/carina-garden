
(function(){
  const LS_KEY = "chaiChatHistory";

  function nowTime(){
    const d = new Date();
    return d.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"});
  }

  function loadHistory(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }catch{ return []; }
  }
  function saveHistory(arr){
    localStorage.setItem(LS_KEY, JSON.stringify(arr.slice(-30)));
  }

  function el(tag, cls, text){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(text!==undefined) e.textContent = text;
    return e;
  }

  async function sendToServer(message, history){
    // Calls Vercel serverless function at /api/chai
    const resp = await fetch("/api/chai",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ message, history })
    });
    if(!resp.ok){
      const t = await resp.text();
      throw new Error(t || ("HTTP " + resp.status));
    }
    const data = await resp.json();
    return data.reply || "（阿柴暂时没接上…）";
  }

  function append(log, who, text){
    const box = el("div", "msg " + (who==="me"?"me":"bot"));
    const meta = el("div","meta", (who==="me"?"你":"阿柴") + " · " + nowTime());
    const body = el("div", null, text);
    box.appendChild(meta);
    box.appendChild(body);
    log.appendChild(box);
    log.scrollTop = log.scrollHeight;
  }

  function mount(){
    const fab = document.getElementById("chai-fab");
    const panel = document.getElementById("chai-chat");
    if(!fab || !panel) return;

    const closeBtn = panel.querySelector(".close");
    const log = panel.querySelector(".log");
    const input = panel.querySelector("input");
    const sendBtn = panel.querySelector("button.send");

    // hydrate
    const history = loadHistory();
    history.forEach(m => append(log, m.role==="user" ? "me":"bot", m.content));

    function open(){ panel.classList.add("open"); input.focus(); }
    function close(){ panel.classList.remove("open"); }
    fab.addEventListener("click", ()=> panel.classList.contains("open")? close(): open());
    closeBtn.addEventListener("click", close);

    async function doSend(){
      const msg = (input.value || "").trim();
      if(!msg) return;
      input.value = "";
      append(log,"me",msg);

      const hist = loadHistory();
      const newHist = hist.concat([{role:"user",content:msg}]);
      saveHistory(newHist);

      sendBtn.disabled = true;
      sendBtn.textContent = "发送中…";

      try{
        const reply = await sendToServer(msg, newHist);
        append(log,"bot",reply);
        const hist2 = loadHistory().concat([{role:"assistant",content:reply}]);
        saveHistory(hist2);
      }catch(err){
        append(log,"bot","（发送失败）" + (err?.message || "网络或服务异常"));
      }finally{
        sendBtn.disabled = false;
        sendBtn.textContent = "发送";
      }
    }

    sendBtn.addEventListener("click", doSend);
    input.addEventListener("keydown",(e)=>{
      if(e.key==="Enter" && !e.shiftKey){
        e.preventDefault();
        doSend();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
