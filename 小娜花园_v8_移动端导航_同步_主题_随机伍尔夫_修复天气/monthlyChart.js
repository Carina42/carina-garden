(function(){
  // Gentle Morandi bar chart (responsive) on canvas
  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const colors = ["#7aa184","#9ab08a","#c7ab6b","#d0a28e","#8b87c6","#7c8fb4","#bedadc","#c2c2b0","#d88fb6","#a06c5a","#6f7fa3","#2f6b53"];

  function countByMonth(books){
    const arr = new Array(12).fill(0);
    books.forEach(b=>{
      if(!b.finishedDate) return;
      const d = new Date(b.finishedDate + "T00:00:00");
      if(Number.isNaN(d.getTime())) return;
      arr[d.getMonth()] += 1;
    });
    return arr;
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
    ctx.setTransform(dpr,0,0,dpr,0,0); // draw in CSS pixels
    return {ctx, w: cssW, h: cssH};
  }

  function draw(books, canvas){
    if(!canvas) return;
    const isMobile = window.matchMedia("(max-width: 560px)").matches;
    const {ctx, w, h} = setupCanvas(canvas, isMobile ? 260 : 240);
    ctx.clearRect(0,0,w,h);

    const data = countByMonth(books);
    const max = Math.max(1, ...data);
    const padX = isMobile ? 12 : 16;
    const padTop = 28;
    const padBottom = 30;
    const chartH = h - padTop - padBottom;

    // background wash
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0, "rgba(255,255,255,0.65)");
    bg.addColorStop(1, "rgba(255,255,255,0.35)");
    ctx.fillStyle = bg;
    roundRect(ctx, 8, 8, w-16, h-16, 16);
    ctx.fill();

    // title
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.font = "13px ui-sans-serif, system-ui, -apple-system";
    ctx.fillText(`${new Date().getFullYear()} 年 · 月度阅读完成数`, padX, 18);

    const gap = isMobile ? 6 : 8;
    const barW = (w - padX*2 - gap*11) / 12;

    const baseY = padTop + chartH;

    for(let i=0;i<12;i++){
      const val = data[i];
      const bh = (val / max) * (chartH - 16);
      const x = padX + i*(barW+gap);
      const y = baseY - bh;

      // bar fill
      const c = colors[i % colors.length];
      const grd = ctx.createLinearGradient(0, y, 0, y+bh);
      grd.addColorStop(0, c + "cc");
      grd.addColorStop(1, "rgba(255,255,255,0.55)");
      ctx.fillStyle = grd;
      roundRect(ctx, x, y, barW, Math.max(2,bh), 10);
      ctx.fill();

      // month label
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.font = isMobile ? "11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                          : "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(months[i], x, baseY + 16);

      // value
      if(val>0){
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
        ctx.fillText(String(val), x + 2, y - 6);
      }
    }
  }

  window.drawMonthlyTrend = draw;
})();