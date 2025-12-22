// 小娜花园 · reading.js
const LS_KEY = "xn_garden_reading_books_v1";

const els = {
  count: document.getElementById("book-count"),
  add: document.getElementById("add-book"),
  remove: document.getElementById("remove-book"),
  clear: document.getElementById("clear-books"),
  shelf: document.getElementById("bookshelf"),
  tbody: document.getElementById("reading-table-body"),
  form: document.getElementById("upload-form"),
  title: document.getElementById("book-title"),
  cover: document.getElementById("book-cover"),
  note: document.getElementById("book-note"),
  flower: document.getElementById("flower-display"),
};

function loadBooks(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}
function saveBooks(books){
  localStorage.setItem(LS_KEY, JSON.stringify(books));
}
function getShortTitle(title){
  const t = (title || "未命名").trim();
  if (!t) return "未命名";
  // show last 6 chars
  return t.length > 6 ? t.slice(0, 6) + "…" : t;
}

function spawnPetalsAt(x, y, n = 12){
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    const dx = (Math.random() * 120 - 60);
    const dy = (Math.random() * 120 - 60);
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--x0", "0px");
    p.style.setProperty("--y0", "0px");
    p.style.setProperty("--x1", dx + "px");
    p.style.setProperty("--y1", dy + "px");
    p.style.background = `rgba(${Math.floor(120+Math.random()*60)}, ${Math.floor(140+Math.random()*60)}, ${Math.floor(130+Math.random()*60)}, .85)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

function flowerTick(){
  if (!els.flower) return;
  els.flower.style.opacity = "1";
  els.flower.style.transform = `translateX(${(Math.random()*12-6).toFixed(0)}px)`;
  setTimeout(() => {
    if (!els.flower) return;
    els.flower.style.opacity = ".75";
  }, 350);
}

function render(){
  const books = loadBooks();
  if (els.count) els.count.textContent = books.length.toString();

  renderShelf(books);
  renderTable(books);
}

function renderShelf(books){
  if (!els.shelf) return;
  els.shelf.innerHTML = "";

  const perRow = 10;
  const rows = Math.ceil(books.length / perRow) || 1;

  for (let r = 0; r < rows; r++){
    const row = document.createElement("div");
    row.className = "shelf-row";

    for (let i = 0; i < perRow; i++){
      const idx = r*perRow + i;
      if (idx >= books.length) break;

      const book = books[idx];
      const item = document.createElement("div");
      item.className = "book";
      item.dataset.index = idx;

      if (book.cover){
        item.classList.add("cover");
        item.style.backgroundImage = `url(${book.cover})`;
      } else {
        item.innerHTML = `
          <div class="spine">
            <div class="title">${escapeHtml(getShortTitle(book.title))}</div>
            <div class="mark">小娜花园</div>
          </div>
        `;
      }

      item.addEventListener("click", (e) => {
        const rect = item.getBoundingClientRect();
        spawnPetalsAt(rect.left + rect.width/2, rect.top + rect.height/2, 10);
        flowerTick();
      });

      row.appendChild(item);
    }

    els.shelf.appendChild(row);
  }
}

function renderTable(books){
  if (!els.tbody) return;
  els.tbody.innerHTML = "";

  books.forEach((b, idx) => {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = b.title || "未命名";

    const tdCover = document.createElement("td");
    if (b.cover){
      const img = document.createElement("img");
      img.className = "cover-thumb";
      img.src = b.cover;
      img.alt = b.title || "cover";
      tdCover.appendChild(img);
    } else {
      tdCover.textContent = "—";
      tdCover.style.color = "rgba(60,50,40,.55)";
    }

    const tdNote = document.createElement("td");
    tdNote.textContent = b.note || "";

    const tdAct = document.createElement("td");
    const del = document.createElement("button");
    del.className = "btn btn-ghost sparkle";
    del.type = "button";
    del.textContent = "删除";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      removeAt(idx);
      const rect = del.getBoundingClientRect();
      spawnPetalsAt(rect.left + rect.width/2, rect.top + rect.height/2, 10);
    });
    tdAct.appendChild(del);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCover);
    tr.appendChild(tdNote);
    tr.appendChild(tdAct);

    els.tbody.appendChild(tr);
  });
}

function addBlank(){
  const books = loadBooks();
  books.push({ title: "未命名", cover: "", note: "" });
  saveBooks(books);
  render();
  flowerTick();
}
function removeLast(){
  const books = loadBooks();
  books.pop();
  saveBooks(books);
  render();
  flowerTick();
}
function removeAt(idx){
  const books = loadBooks();
  books.splice(idx, 1);
  saveBooks(books);
  render();
  flowerTick();
}
function clearAll(){
  if (!confirm("确定要清空阅读书架吗？（会删除本机保存的数据）")) return;
  saveBooks([]);
  render();
  flowerTick();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

async function fileToDataUrl(file){
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setup(){
  if (els.add) els.add.addEventListener("click", (e) => {
    addBlank();
    spawnPetalsAt(e.clientX, e.clientY, 12);
  });
  if (els.remove) els.remove.addEventListener("click", (e) => {
    removeLast();
    spawnPetalsAt(e.clientX, e.clientY, 12);
  });
  if (els.clear) els.clear.addEventListener("click", (e) => {
    clearAll();
    spawnPetalsAt(e.clientX, e.clientY, 16);
  });

  if (els.form){
    els.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = (els.title?.value || "").trim() || "未命名";
      const note = (els.note?.value || "").trim();
      const file = els.cover?.files?.[0];

      const books = loadBooks();
      let cover = "";
      if (file){
        cover = await fileToDataUrl(file);
      }
      books.push({ title, cover, note });
      saveBooks(books);

      if (els.title) els.title.value = "";
      if (els.note) els.note.value = "";
      if (els.cover) els.cover.value = "";

      render();
      flowerTick();
      const btn = document.getElementById("upload-book");
      if (btn){
        const rect = btn.getBoundingClientRect();
        spawnPetalsAt(rect.left + rect.width/2, rect.top + rect.height/2, 16);
      }
    });
  }

  // ornaments
  document.querySelectorAll(".ornament").forEach(btn => {
    btn.addEventListener("click", (e) => spawnPetalsAt(e.clientX, e.clientY, 14));
  });

  render();
}

window.addEventListener("load", setup);
