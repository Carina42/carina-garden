
(function(){
  // A 12-month mosaic: dominant mood & intensity by count
  const moodBase = {
    calm:   "#7aa184",
    warm:   "#c7ab6b",
    excited:"#d88fb6",
    sad:    "#7c8fb4",
    angry:  "#d07c6a",
    awe:    "#8b87c6",
    none:   "#c2c2b0"
  };
  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];

  function hexToRgb(hex){
    const m = String(hex).replace("#","").trim();
    const v = parseInt(m,16);
    return {r:(v>>16)&255, g:(v>>8)&255, b:v&255};
  }
  function mix(a,b,t){
    const A = hexToRgb(a), B = hexToRgb(b);
    const r = Math.round(A.r + (B.r-A.r)*t);
    const g = Math.round(A.g + (B.g-A.g)*t);
    const b2 = Math.round(A.b + (B.b-A.b)*t);
    return `rgb(${r},${g},${b2})`;
  }

  function summarize(books){
    const byM = Array.from({length:12}, ()=>({count:0, moodCount:{}}));
    books.forEach(b=>{
      if(!b.finishedDate) return;
      const d = new Date(b.finishedDate+"T00:00:00");
      if(Number.isNaN(d.getTime())) return;
      const m = d.getMonth();
      byM[m].count++;
      const mood = (b.mood||"none");
      byM[m].moodCount[mood] = (byM[m].moodCount[mood]||0)+1;
    });
    return byM;
  }

  function dominant(moodCount){
    let best = "none", bestV = 0;
    for(const k in moodCount){
      const v = moodCount[k];
      if(v>bestV){ bestV=v; best=k; }
    }
    return best || "none";
  }

  function draw(books, canvas){
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    const data = summarize(books);
    const maxC = Math.max(1, ...data.map(x=>x.count));
    const pad = 28;
    const cellW = (w - pad*2)/12;
    const cellH = 120;

    // title
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.font = "13px ui-sans-serif, system-ui, -apple-system";
    ctx.fillText("阅读情绪热力图（按月：主情绪 × 阅读量）", pad, 18);

    for(let i=0;i<12;i++){
      const x = pad + i*cellW + 4;
      const y = 40;
      const m = data[i];
      const dom = dominant(m.moodCount);
      const base = moodBase[dom] || moodBase.none;

      // intensity: mix with white by inverse count
      const t = 1 - (m.count/maxC); // 0 = strong, 1 = pale
      const fill = mix(base, "#ffffff", Math.min(0.65, 0.18 + t*0.7));
      ctx.fillStyle = fill;

      roundRect(ctx, x, y, cellW-8, cellH, 12);
      ctx.fill();

      // month label
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(months[i]+"月", x+8, y+18);

      // count
      ctx.font = "20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(String(m.count), x+8, y+48);

      // mood
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
      const moodLabel = moodToZh(dom);
      ctx.fillText(moodLabel, x+8, y+70);

      // small dots for distribution (up to 8)
      const dots = Object.entries(m.moodCount).sort((a,b)=>b[1]-a[1]).slice(0,3);
      let dy = y+92;
      dots.forEach(([k,v], idx)=>{
        const c = moodBase[k] || moodBase.none;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x+12, dy+idx*16, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.font = "11px ui-sans-serif, system-ui, -apple-system";
        ctx.fillText(`${moodToZh(k)} ×${v}`, x+22, dy+idx*16+4);
      });
    }
  }

  function moodToZh(m){
    const map = {
      calm:"清澈", warm:"温暖", excited:"雀跃", sad:"怅然", angry:"愤怒", awe:"震颤", none:"未记录"
    };
    return map[m] || "未记录";
  }

  function roundRect(ctx,x,y,w,h,r){
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);
    ctx.arcTo(x,y,x+w,y,rr);
    ctx.closePath();
  }

  window.drawEmotionHeatmap = draw;
})();
