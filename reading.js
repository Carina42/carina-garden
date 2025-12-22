
let count = 0;

function updateCount() {
  document.getElementById("book-count").innerText = count;
  if (count > 0) {
    document.getElementById("flower-display").innerText = "🌸 花儿开啦！";
  } else {
    document.getElementById("flower-display").innerText = "未开花";
  }
}

document.getElementById("add-book").onclick = () => {
  count++;
  updateCount();
};

document.getElementById("remove-book").onclick = () => {
  if (count > 0) count--;
  updateCount();
};

document.getElementById("upload-book").onclick = () => {
  const title = document.getElementById("book-title").value;
  const file = document.getElementById("book-cover").files[0];
  if (!title || !file) return alert("请填写书名并上传封面");

  const reader = new FileReader();
  reader.onload = function(e) {
    // 封面图显示在书架
    const img = document.createElement("img");
    img.src = e.target.result;
    const slot = document.createElement("div");
    slot.className = "book-slot";
    slot.appendChild(img);
    document.getElementById("bookshelf-container").appendChild(slot);

    // 表格同步
    const row = document.createElement("tr");
    row.innerHTML = `<td>${title}</td><td><img src="${e.target.result}" height="60"/></td><td></td>`;
    document.getElementById("reading-table-body").appendChild(row);

    count++;
    updateCount();
  };
  reader.readAsDataURL(file);
};
