(function(){
  // 12-month mood mosaic heatmap (responsive) on canvas
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
    const v = parseInt(m.length===3 ? m.split("").map(c=>c+c).join("") : m, 16);
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
      const d = new Date(b.finishedDate + "T00:00:00");
      if(Number.isNaN(d.getTime())) return;
      const m = d.getMonth();
      const mood = (b.mood||"none");
      const cell = byM[m];
      cell.count += 1;
      cell.moodCount[mood] = (cell.moodCount[mood]||0) + 1;
    });
    return byM.map(cell=>{
      let best = "none", bestC = 0;
      Object.entries(cell.moodCount).forEach(([k,v])=>{
        if(v>bestC){ bestC=v; best=k; }
      });
      return { mood: best, count: cell.count };
    });
  }

  function roundRect(ctx, x, y, w, h, r){
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  function setupCanvas(canvas, cssH){
    const dpr = window.devicePixelRatio || 1;
    const cssW = Math.max(280, Math.floor((canvas.parentElement ? canvas.parentElement.clientWidth : canvas.clientWidth) || 700));
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return {ctx, w: cssW, h: cssH};
  }

  function draw(books, canvas){
    if(!canvas) return;
    const isMobile = window.matchMedia("(max-width: 560px)").matches;
    const {ctx, w, h} = setupCanvas(canvas, isMobile ? 240 : 220);
    ctx.clearRect(0,0,w,h);

    const data = summarize(books);
    const maxC = Math.max(1, ...data.map(x=>x.count));
    const pad = isMobile ? 12 : 18;

    // background
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0, "rgba(255,255,255,0.65)");
    bg.addColorStop(1, "rgba(255,255,255,0.35)");
    ctx.fillStyle = bg;
    roundRect(ctx, 8, 8, w-16, h-16, 16);
    ctx.fill();

    // title
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.font = "13px ui-sans-serif, system-ui, -apple-system";
    ctx.fillText("四季心情地图 · 按月份汇总", pad, 18);

    const cellW = (w - pad*2) / 12;
    const cellH = isMobile ? 120 : 110;
    const top = 34;

    for(let i=0;i<12;i++){
      const {mood, count} = data[i];
      const strength = Math.min(1, count / maxC);
      const base = moodBase[mood] || moodBase.none;
      const fill = mix("#f7f4ef", base, 0.35 + 0.55*strength);

      const x = pad + i*cellW;
      const y = top;

      ctx.fillStyle = fill;
      roundRect(ctx, x+4, y, cellW-8, cellH, 12);
      ctx.fill();

      // month label
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.font = isMobile ? "11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                          : "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(months[i], x + 8, y + cellH + 18);

      // tiny dot for intensity
      if(count>0){
        ctx.fillStyle = "rgba(0,0,0,0.20)";
        ctx.beginPath();
        ctx.arc(x + cellW/2, y + cellH/2, 10 + 10*strength, 0, Math.PI*2);
        ctx.fill();
      }
    }

    // legend (mobile: smaller)
    const legendY = top + cellH + (isMobile ? 26 : 30);
    const legend = [
      ["calm","平静"], ["warm","温暖"], ["excited","雀跃"],
      ["sad","微伤"], ["angry","烦躁"], ["awe","惊奇"]
    ];
    let lx = pad;
    legend.forEach(([k,label])=>{
      const c = moodBase[k];
      ctx.fillStyle = c + "cc";
      roundRect(ctx, lx, legendY, 18, 10, 5);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.60)";
      ctx.font = isMobile ? "11px ui-sans-serif, system-ui, -apple-system" : "12px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(label, lx + 24, legendY + 10);
      lx += isMobile ? 78 : 92;
    });
  }

  window.drawEmotionHeatmap = draw;
})();