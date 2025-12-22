
(function(){
  const $ = (id)=>document.getElementById(id);
  const BOOK_KEY = "chai_books_v6";

  function readBooks(){
    try{ return JSON.parse(localStorage.getItem(BOOK_KEY) || "[]"); }catch(_){ return []; }
  }
  function saveBooks(list){
    localStorage.setItem(BOOK_KEY, JSON.stringify(list));
  }
  function uid(){
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function parseTags(s){
    return (s||"")
      .split(/[,，]/g)
      .map(x=>x.trim())
      .filter(Boolean)
      .slice(0, 12);
  }
  function moodColor(m){
    const map = {
      calm:   "#7aa184",
      warm:   "#c7ab6b",
      excited:"#d88fb6",
      sad:    "#7c8fb4",
      angry:  "#d07c6a",
      awe:    "#8b87c6"
    };
    return map[m] || "#6f7fa3";
  }
  function spineGradient(seed){
    const palettes = [
      ["#2f6b53","#7aa184"], // leaf
      ["#446a4b","#9ab08a"], // moss
      ["#8b6b2b","#c7ab6b"], // sun
      ["#6f7fa3","#9ca6bd"], // night
      ["#a06c5a","#d0a28e"], // clay
    ];
    const idx = (seed % palettes.length);
    const [a,b] = palettes[idx];
    return `linear-gradient(180deg, ${a}, ${b})`;
  }

  function ensureModal(){
    const modal = $("bookModal");
    const close = $("modalClose");
    if(!modal || !close) return;
    close.addEventListener("click", ()=> modal.classList.remove("show"));
    modal.addEventListener("click", (e)=>{
      if(e.target === modal) modal.classList.remove("show");
    });
  }

  function renderBooks(){
    const list = readBooks();
    const filter = ($("tagFilter")?.value || "").trim().toLowerCase();
    const filtered = filter
      ? list.filter(b => (b.tags||[]).join(",").toLowerCase().includes(filter) || (b.title||"").toLowerCase().includes(filter))
      : list;

    // Count
    const countEl = $("bookCount");
    if(countEl) countEl.textContent = String(filtered.length);

    // Bookshelf: 10 per row
    const shelf = $("bookshelf");
    if(shelf){
      shelf.innerHTML = "";
      const perRow = 10;
      const rows = Math.max(1, Math.ceil(filtered.length / perRow));
      let idx = 0;
      for(let r=0;r<rows;r++){
        const row = document.createElement("div");
        row.className = "shelf-row";
        for(let i=0;i<perRow;i++){
          if(idx >= filtered.length) break;
          const b = filtered[idx];
          const spine = document.createElement("div");
          spine.className = "book-spine";
          spine.dataset.id = b.id;
          spine.title = b.title || "未命名";
          // cover
          if(b.coverData){
            const img = document.createElement("img");
            img.src = b.coverData;
            spine.appendChild(img);
            const ov = document.createElement("div");
            ov.className = "spine-overlay";
            spine.appendChild(ov);
          }else{
            const seed = hash(b.title || b.id);
            spine.style.background = spineGradient(seed);
          }
          const t = document.createElement("div");
          t.className = "spine-title";
          t.textContent = (b.title || "").slice(0, 14);
          spine.appendChild(t);
          spine.addEventListener("click", ()=> openModal(b.id));
          row.appendChild(spine);
          idx++;
        }
        shelf.appendChild(row);
      }
    }

    // Cards
    const cards = $("cards");
    if(cards){
      cards.innerHTML = "";
      if(filtered.length === 0){
        const empty = document.createElement("div");
        empty.className = "hint";
        empty.textContent = "还没有书。点右上角 ➕ 添加一本，让书架先长起来。";
        cards.appendChild(empty);
      }else{
        filtered.forEach(b=>{
          const card = document.createElement("div");
          card.className = "book-card";
          card.addEventListener("click", ()=> openModal(b.id));
          const thumb = document.createElement("div");
          thumb.className = "book-thumb";
          if(b.coverData){
            const img = document.createElement("img");
            img.src = b.coverData;
            thumb.appendChild(img);
          }else{
            thumb.style.background = spineGradient(hash(b.title||b.id));
          }
          const info = document.createElement("div");
          info.className = "book-info";
          const title = document.createElement("div");
          title.className = "book-title";
          title.textContent = b.title || "未命名";
          const sub = document.createElement("div");
          sub.className = "book-sub";
          sub.textContent = [b.author, b.finishedDate].filter(Boolean).join(" · ") || "—";
          const tags = document.createElement("div");
          tags.className = "book-tags";
          (b.tags||[]).slice(0,8).forEach(t=>{
            const s = document.createElement("span");
            s.className = "tag";
            s.textContent = t;
            tags.appendChild(s);
          });
          const snippet = document.createElement("div");
          snippet.className = "book-snippet";
          snippet.textContent = (b.quote || b.notes || "").slice(0, 120) || "点击添加笔记与佳句。";
          info.appendChild(title);
          info.appendChild(sub);
          info.appendChild(tags);
          info.appendChild(snippet);
          card.appendChild(thumb);
          card.appendChild(info);
          cards.appendChild(card);
        });
      }
    }

    // Charts
    if(window.drawMonthlyTrend) window.drawMonthlyTrend(filtered, $("readingTrendChart"));
    if(window.drawEmotionHeatmap) window.drawEmotionHeatmap(filtered, $("emotionHeatmap"));
  }

  function openModal(id){
    const b = readBooks().find(x=>x.id===id);
    if(!b) return;
    const modal = $("bookModal");
    if(!modal) return;

    const cover = $("modalCover");
    cover.innerHTML = "";
    if(b.coverData){
      const img = document.createElement("img");
      img.src = b.coverData;
      cover.appendChild(img);
    }else{
      cover.style.background = spineGradient(hash(b.title||b.id));
    }

    $("modalTitle").textContent = b.title || "未命名";
    $("modalSub").textContent = [b.author, b.finishedDate].filter(Boolean).join(" · ") || "—";
    const tagBox = $("modalTags");
    tagBox.innerHTML = "";
    (b.tags||[]).forEach(t=>{
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      tagBox.appendChild(s);
    });

    const q = $("modalQuote");
    q.textContent = b.quote ? `“${b.quote}”` : "（未填写引用佳句）";
    const notes = $("modalNotes");
    notes.textContent = b.notes || "（未填写读后感/线索）";

    // mood tint
    if(b.mood){
      modal.querySelector(".modal-card").style.boxShadow = `0 18px 40px rgba(0,0,0,0.08), 0 0 0 3px ${moodColor(b.mood)}22`;
    }else{
      modal.querySelector(".modal-card").style.boxShadow = "";
    }

    modal.classList.add("show");
  }

  function bloom(){
    const zone = $("flowerZone");
    if(!zone) return;
    for(let i=0;i<6;i++){
      const f = document.createElement("div");
      f.className = "flower";
      f.style.left = (Math.random()*80 + 10) + "%";
      f.style.top = (Math.random()*20 + 70) + "%";
      f.style.animationDelay = (Math.random()*0.25) + "s";
      zone.appendChild(f);
      setTimeout(()=>f.remove(), 3800);
    }
  }

  function hash(s){
    let h = 0;
    for(let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function init(){
    ensureModal();

    $("tagFilter")?.addEventListener("input", ()=> renderBooks());

    // plus/minus
    $("bookPlus")?.addEventListener("click", ()=>{
      // focus form, slight bloom, and optionally pre-create record? better: just focus & open.
      $("title")?.focus();
      bloom();
      window.scrollTo({top: document.body.scrollHeight * 0.2, behavior:"smooth"});
    });
    $("bookMinus")?.addEventListener("click", ()=>{
      const list = readBooks();
      if(list.length===0) return;
      list.pop();
      saveBooks(list);
      renderBooks();
      bloom();
    });

    // form submit
    const form = $("bookForm");
    form?.addEventListener("submit", (e)=>{
      e.preventDefault();
      const title = ($("title")?.value || "").trim();
      if(!title) return;

      const book = {
        id: uid(),
        title,
        author: ($("author")?.value || "").trim(),
        tags: parseTags(($("tags")?.value || "").trim()),
        finishedDate: ($("finishedDate")?.value || "").trim(),
        mood: ($("mood")?.value || "").trim(),
        quote: ($("quote")?.value || "").trim(),
        notes: ($("notes")?.value || "").trim(),
        coverData: ""
      };

      const file = $("cover")?.files?.[0];
      const finalize = ()=>{
        const list = readBooks();
        list.push(book);
        saveBooks(list);
        form.reset();
        bloom();
        renderBooks();
      };

      if(file){
        const reader = new FileReader();
        reader.onload = ()=>{ book.coverData = String(reader.result || ""); finalize(); };
        reader.readAsDataURL(file);
      }else{
        finalize();
      }
    });

    renderBooks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
