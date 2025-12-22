(function(){
  const $ = (id)=>document.getElementById(id);
  const STORE_KEY = "chai_chat_history_v7";
  const MODE_KEY = "chai_chat_mode_v7"; // "gentle" | "straight"

  // --------- 小型“阿柴语料库” ----------
  // 说明：无联网、无API。用关键词/意图匹配做回复；再加一点点“变量插值”让它更像你的小窝。
  const KB = [
    { id:"greet", triggers:["你好","嗨","在吗","阿柴","柴柴"], replies:[
      "我在，小娜。先把今天的心情放进柴窝里：你现在是【想被抱抱】还是【想被推动】？",
      "嗨，我在。今天我们要先照顾身体、还是先照顾写作？",
      "在的。来：先喝一口水，然后告诉我你想推进哪一件小事。"
    ]},
    { id:"writing_start", triggers:["写作","开始写","开写","写不动","启动","拖延","ADHD"], replies:[
      "我们用最小动作启动：打开文档→写一句“今天这段想写___”。只要一句就算赢。",
      "你不用一次把整段写好。先写“粗糙版本”，我来陪你把它修成你想要的样子。",
      "启动困难不是懒，是摩擦力大。给自己一个 5 分钟小计时：只写 80 字。"
    ]},
    { id:"writing_progress", triggers:["写了","字","更新","小剧场"], replies:[
      "收到！这就很棒了。把它当作“点火”，今天只要保持火种不灭就行。",
      "很好——先不评判质量，只记录：你已经在路上了。",
      "写出来了就是真实存在的材料；之后怎么雕琢，是未来的你去做的事。"
    ]},
    { id:"reading", triggers:["读书","阅读","书","论文","文献","到灯塔去","伍尔夫"], replies:[
      "读书页我给你留了书架：每一本都是你在世界上留下的温柔证据。",
      "如果今天只读 3 页也没关系。我们要的是节律，不是完美。",
      "要不要把你刚读到的一句喜欢的话贴过来？我可以帮你做成卡片式摘录。"
    ]},
    { id:"sleep", triggers:["睡","失眠","早睡","熬夜","困","作息"], replies:[
      "先把身体放在第一位：今晚的目标不是“早睡”，是“比昨天早 15 分钟”。",
      "如果现在还不困：把灯调暗、把屏幕亮度降到最低、给自己一个收尾仪式。",
      "睡眠像植物浇水：少量但稳定。我们先守住连续性。"
    ]},
    { id:"exercise", triggers:["运动","拉伸","走路","跑步","瑜伽","康复","骶髂"], replies:[
      "运动页我们以“轻量稳定”为原则：今天做 5 分钟也算打卡。",
      "如果是骶髂还不舒服：避免长时间单侧受力，先做温和激活再拉伸。",
      "把动作拆小：站起来走 2 分钟→回来继续。身体会慢慢被你养回来。"
    ]},
    { id:"todo", triggers:["待办","任务","DDL","焦虑","好多事"], replies:[
      "只选一件“最优先”：今天只要把它推进 10%。其余都暂时不判刑。",
      "我们按“下一步动作”写待办：例如“打开文档→定位引用页码”，而不是“写完论文”。",
      "你可以把最头疼的一件发我，我帮你拆成 3 个可开始的小步骤。"
    ]},
    { id:"mood_low", triggers:["难过","崩溃","不行","自责","厌恶","焦虑","烦"], replies:[
      "先不解决问题，先把你从风暴里拎出来：你现在最强烈的感受是什么？一句话就行。",
      "你不是失败，你是累了。我们把目标降到“保底版本”，然后再谈漂亮版本。",
      "把自责换成记录：发生了什么？你身体哪里紧？呼吸先慢下来。"
    ]},
    { id:"encourage", triggers:["加油","鼓励","我可以吗","我怕","不敢"], replies:[
      "可以。因为你已经一次次证明：你会写，你会走，你会回来。",
      "怕也可以做。我们不等无畏，直接带着怕往前挪一小步。",
      "把期待放轻一点，把频率放稳一点——这就是你的长期主义。"
    ]},
    { id:"straight_mode", triggers:["直言不讳","别安慰","刺痛","说真话"], replies:[
      "收到：我切到【直言模式】。你现在最需要的是行动，而不是更完美的计划。",
      "好，那我就不哄：你拖着不做，不是因为不会，是因为你在逃避不确定性。",
      "直说：今天不写，明天只会更难写。你需要的是‘每天最少量’而不是灵感。"
    ], action:(ctx)=>{ ctx.mode="straight"; }},
    { id:"gentle_mode", triggers:["温柔一点","抱抱","轻松一点"], replies:[
      "好，我切到【温柔模式】。我们先照顾你，再推进事情。",
      "收到。今天的柴窝只做“可完成的事”。",
      "可以。先把你放在安全的节奏里。"
    ], action:(ctx)=>{ ctx.mode="gentle"; }},
  ];

  const FALLBACK = [
    "我听见了。要不要把它拆成：事实 / 感受 / 下一步？",
    "我们先选一个小动作：你现在最愿意做的最小一步是什么？",
    "把你现在的目标说得更小一点，我陪你落地。"
  ];

  function loadMode(){
    try{ return localStorage.getItem(MODE_KEY) || "gentle"; }catch(_){ return "gentle"; }
  }
  function saveMode(mode){
    try{ localStorage.setItem(MODE_KEY, mode); }catch(_){}
  }

  function pick(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function scoreMessage(msg, triggers){
    const m = msg.toLowerCase();
    let score = 0;
    triggers.forEach(t=>{
      if(!t) return;
      if(m.includes(String(t).toLowerCase())) score += 2;
    });
    return score;
  }

  function dynamicReply(msg, ctx){
    // 1) 写作字数识别
    let m = msg.match(/(\d{2,6})\s*字/);
    if(m){
      const n = parseInt(m[1],10);
      if(Number.isFinite(n)){
        if(n>=2000) return `哇，这个量很硬核了：${n} 字。今天你已经把“写作肌肉”练到了。要不要顺手记一句：这段最满意的地方是什么？`;
        if(n>=500) return `收到！${n} 字就是一块踏实的砖。今天别急着评判质量，先把节奏记住：你做到了。`;
        return `很好，${n} 字也是火种。今天我们就以“不断更”为胜利条件。`;
      }
    }

    // 2) 读完几本
    m = msg.match(/(\d{1,3})\s*本/);
    if(m && /读|看|阅读/.test(msg)){
      const n = parseInt(m[1],10);
      if(Number.isFinite(n)){
        return `读了 ${n} 本！把它写进书架上会很有成就感。你想给这 ${n} 本各贴一个关键词标签吗？（比如：植物/伍尔夫/女性主义/论文）`;
      }
    }

    // 3) 情绪词增强
    if(/想哭|哭了|好累|撑不住/.test(msg)){
      return "来，先抱一下。你不用马上变好——我们先把你从‘撑不住’变成‘还能呼吸’。现在做 3 次慢呼吸：吸 4 拍、停 2 拍、呼 6 拍。";
    }

    return null;
  }

  function generateReply(msg, ctx){
    const dyn = dynamicReply(msg, ctx);
    if(dyn) return dyn;

    // mode trigger
    let best = null;
    let bestScore = 0;
    for(const item of KB){
      const s = scoreMessage(msg, item.triggers);
      if(s > bestScore){
        bestScore = s;
        best = item;
      }
    }
    if(best && bestScore>0){
      if(best.action) best.action(ctx);
      saveMode(ctx.mode);
      const base = pick(best.replies);
      if(ctx.mode === "straight" && best.id !== "straight_mode"){
        // 直言风味增强
        return base + "（直言补一句：别追求完美启动，先把最小动作做出来。）";
      }
      return base;
    }

    return pick(FALLBACK);
  }

  function ensure(){
    const btn = $("toggle-chatbot");
    const box = $("chatbot-box");
    const close = $("close-chatbot");
    const send = $("send-btn");
    const input = $("user-input");
    const area = $("chat-area");
    if(!btn || !box || !close || !send || !input || !area) return null;

    const ctx = { mode: loadMode() };

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
      bub.innerHTML = escapeHTML(text);
      wrap.appendChild(bub);
      area.appendChild(wrap);
      area.scrollTop = area.scrollHeight;
    }

    function saveHistory(){
      try{
        const msgs = [...area.querySelectorAll(".msg")].slice(-60).map(m=>({
          role: m.classList.contains("user") ? "user" : "assistant",
          text: m.textContent || ""
        }));
        localStorage.setItem(STORE_KEY, JSON.stringify(msgs));
      }catch(_){}
    }

    function loadHistory(){
      try{
        const raw = localStorage.getItem(STORE_KEY);
        if(!raw) return false;
        const msgs = JSON.parse(raw);
        if(!Array.isArray(msgs) || msgs.length===0) return false;
        area.innerHTML = "";
        msgs.forEach(m=>append(m.role, m.text));
        return true;
      }catch(_){ return false; }
    }

    function sendMsg(){
      const msg = (input.value || "").trim();
      if(!msg) return;
      input.value = "";
      append("user", msg);
      const reply = generateReply(msg, ctx);
      append("assistant", reply);
      saveHistory();
    }

    send.addEventListener("click", sendMsg);

    // greeting / restore
    const restored = loadHistory();
    if(!restored){
      append("assistant", "嗨小娜，我在。现在我们用的是离线版柴柴（无需API）。你想先推进读书、写作，还是照顾一下身体？");
      saveHistory();
    }
    return {open, hide, append};
  }

  document.addEventListener("DOMContentLoaded", ensure);
})();