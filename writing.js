
(function(){
  const KEY="chaiWriting";
  const pad2=n=>String(n).padStart(2,"0");
  const dayKey=()=>{
    const d=new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  };
  const monthKey=()=>{
    const d=new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  };
  const read=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch{return{};} };
  const write=(o)=>localStorage.setItem(KEY, JSON.stringify(o));

  const words=$("#wWords");
  const mood=$("#wMood");
  const save=$("#wSave");
  const today=$("#wToday");
  const month=$("#wMonth");
  const streak=$("#wStreak");
  const enc=$("#wEnc");

  function $(s){ return document.querySelector(s); }

  function calcStreak(obj){
    let s=0;
    const now=new Date();
    for(let i=0;i<366;i++){
      const d=new Date(now.getFullYear(), now.getMonth(), now.getDate()-i);
      const k=`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
      if((obj[k]?.words||0)>0) s++;
      else break;
    }
    return s;
  }

  function updateUI(){
    const obj=read();
    const dk=dayKey();
    const mk=monthKey();
    const w=(obj[dk]?.words||0);
    today.textContent = w ? `${w} 字` : "0";
    const sum=Object.entries(obj).filter(([k,v])=>k.startsWith(mk) && (v?.words||0)>0)
      .reduce((a,[k,v])=>a+(v.words||0),0);
    month.textContent = `${sum} 字`;
    streak.textContent = `${calcStreak(obj)} 天`;

    const msg =
      w>=2000 ? "很猛：今天的你在发光。明天只要再回到桌前一点点，就会更稳。" :
      w>=800  ? "今天写得很扎实。保持这个节奏，灵魂会被你养得很亮。" :
      w>0     ? "哪怕只写一点点，也是在给自己铺路。继续温柔地坚持。" :
               "今天还没写也没关系——只要回到纸面一行，就算重新开始。";
    enc.textContent = msg;
  }

  save.addEventListener("click", ()=>{
    const dk=dayKey();
    const obj=read();
    obj[dk]=obj[dk]||{};
    obj[dk].words=Math.max(0, parseInt(words.value||"0",10)||0);
    obj[dk].mood=(mood.value||"").trim();
    write(obj);
    updateUI();
    words.value="";
  });

  document.addEventListener("DOMContentLoaded", updateUI);
})();
