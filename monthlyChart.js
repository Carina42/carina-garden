
(function(){
  // Draw a gentle Morandi bar chart on canvas
  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const colors = ["#7aa184","#9ab08a","#c7ab6b","#d0a28e","#8b87c6","#7c8fb4","#d88fb6","#a06c5a","#6f7fa3","#2f6b53","#bedadc","#c2c2b0"];

  function countByMonth(books){
    const arr = new Array(12).fill(0);
    books.forEach(b=>{
      if(!b.finishedDate) return;
      const d = new Date(b.finishedDate + "T00:00:00");
      if(Number.isNaN(d.getTime())) return;
      const m = d.getMonth();
      arr[m] += 1;
    });
    return arr;
  }

  function clear(ctx,w,h){
    ctx.clearRect(0,0,w,h);
  }

  function draw(books, canvas){
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    clear(ctx,w,h);

    const data = countByMonth(books);
    const maxV = Math.max(1, ...data);
    const pad = 36;
    const baseY = h - pad;
    const barW = (w - pad*2) / 12 - 6;

    // axes
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, baseY);
    ctx.lineTo(w - pad, baseY);
    ctx.stroke();

    // bars
    for(let i=0;i<12;i++){
      const x = pad + i*((w - pad*2)/12) + 3;
      const val = data[i];
      const bh = (val/maxV) * (h - pad*2 - 10);
      const y = baseY - bh;

      // bar
      const grd = ctx.createLinearGradient(0,y,0,baseY);
      grd.addColorStop(0, colors[i%colors.length]);
      grd.addColorStop(1, "rgba(255,255,255,0.55)");
      ctx.fillStyle = grd;
      roundRect(ctx, x, y, barW, bh, 8);
      ctx.fill();

      // label
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(months[i], x, baseY + 16);

      // value
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(String(val), x + 2, y - 6);
    }

    // title
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.font = "13px ui-sans-serif, system-ui, -apple-system";
    const year = new Date().getFullYear();
    ctx.fillText(`${year} 年 · 月度阅读完成数`, pad, 18);
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

  window.drawMonthlyTrend = draw;
})();
