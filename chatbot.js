
(function(){
  const $ = (id)=>document.getElementById(id);

  function ensure(){
    const btn = $("toggle-chatbot");
    const box = $("chatbot-box");
    const close = $("close-chatbot");
    const send = $("send-btn");
    const input = $("user-input");
    const area = $("chat-area");
    if(!btn || !box || !close || !send || !input || !area) return null;

    function open(){ box.classList.add("show"); }
    function hide(){ box.classList.remove("show"); }

    btn.addEventListener("click", open);
    close.addEventListener("click", hide);

    input.addEventListener("keydown", (e)=>{
      if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        send.click();
      }
    });

    function append(role, text){
      const wrap = document.createElement("div");
      wrap.className = "msg " + (role==="user" ? "user" : "assistant");
      const bub = document.createElement("div");
      bub.className = "bubble";
      bub.textContent = text;
      wrap.appendChild(bub);
      area.appendChild(wrap);
      area.scrollTop = area.scrollHeight;
    }

    async function sendMsg(){
      const msg = (input.value || "").trim();
      if(!msg) return;
      input.value = "";
      append("user", msg);

      const thinking = document.createElement("div");
      thinking.className = "msg assistant";
      const bub = document.createElement("div");
      bub.className = "bubble";
      bub.textContent = "……（柴柴在思考）";
      thinking.appendChild(bub);
      area.appendChild(thinking);
      area.scrollTop = area.scrollHeight;

      try{
        const res = await fetch("/api/chat", {
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({message: msg})
        });

        if(!res.ok){
          const t = await res.text();
          throw new Error("api_error:" + t);
        }
        const data = await res.json();
        bub.textContent = data.reply || "（没有收到回复）";
      }catch(err){
        bub.textContent = "聊天暂时不可用：需要在 Vercel 部署 /api/chat，并设置 OPENAI_API_KEY 环境变量。";
      }
    }

    send.addEventListener("click", sendMsg);

    // greeting once
    if(!area.dataset.greeted){
      area.dataset.greeted = "1";
      append("assistant", "嗨小娜，我在。今天要在柴窝里做点什么？（读书/写作/花园/生活都可以）");
    }
    return {open, hide, append};
  }

  document.addEventListener("DOMContentLoaded", ensure);
})();
