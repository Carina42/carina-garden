// 小娜花园 · reading.js (v12.0)
const LS_KEY = "xn_garden_reading_books_v1";

document.addEventListener("DOMContentLoaded", () => {
  renderShelf();
  
  // 添加书籍 (为了简化代码，保持原有的简易添加逻辑，或调用之前的上传逻辑)
  document.getElementById("add-book-btn")?.addEventListener("click", () => {
    const title = prompt("书名是什么？");
    if(!title) return;
    const books = getBooks();
    books.push({ title, note: "未读完" });
    saveBooks(books);
    renderShelf();
  });
});

function getBooks() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch(e) { return []; }
}
function saveBooks(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }

function renderShelf() {
  const shelf = document.getElementById("bookshelf");
  if(!shelf) return;
  shelf.innerHTML = "";
  const books = getBooks();
  
  books.forEach((b, idx) => {
    const item = document.createElement("div");
    item.className = "book-item";
    
    // 随机书脊颜色
    const hue = Math.floor(Math.random() * 50 + 100); // 绿色系
    item.style.backgroundColor = `hsl(${hue}, 20%, 85%)`;
    
    // 如果有封面图
    if(b.cover && b.cover.length > 20) {
       item.innerHTML = `<img src="${b.cover}" class="book-cover-img" />`;
    } else {
       item.innerHTML = `<div class="book-spine">${b.title}</div>`;
    }

    item.onclick = () => showDetail(idx);
    shelf.appendChild(item);
  });
}

// 需求11: 详情弹窗与删除
function showDetail(idx) {
  // 移除旧的 modal 如果有
  const old = document.getElementById("bookModal");
  if(old) old.remove();
  
  const books = getBooks();
  const b = books[idx];
  
  const modal = document.createElement("div");
  modal.className = "modal show"; // 直接显示
  modal.id = "bookModal";
  
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-panel" style="text-align:center;">
      <button class="modal-close">✕</button>
      <h3>${b.title}</h3>
      <div style="margin:15px 0; color:#666; font-size:0.9rem; max-height:200px; overflow:auto;">
        ${b.note || "（暂无笔记）"}
      </div>
      ${b.cover ? `<img src="${b.cover}" style="max-height:150px; border-radius:4px; margin-bottom:15px;">` : ''}
      <div style="margin-top:20px; border-top:1px dashed #eee; padding-top:15px;">
        <button class="btn btn-ghost" id="delBookBtn" style="color:#e57373; border-color:#e57373;">🗑️ 删除这本书</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 绑定关闭
  const close = () => modal.remove();
  modal.querySelector(".modal-close").onclick = close;
  modal.querySelector(".modal-backdrop").onclick = close;
  
  // 绑定删除
  modal.querySelector("#delBookBtn").onclick = () => {
    if(confirm(`确定要将《${b.title}》移出书架吗？`)) {
      books.splice(idx, 1);
      saveBooks(books);
      renderShelf();
      close();
    }
  };
}
