let count = parseInt(localStorage.getItem("bookCount")||"0");
const shelf = document.getElementById("book-shelf");
const tableBody = document.getElementById("reading-table-body");
document.getElementById("book-count").innerText = count;

function renderShelf() {
  shelf.innerHTML = "";
  for (let i=0; i<count; i++){
    const slot = document.createElement("div");
    slot.className = "book-slot";
    shelf.appendChild(slot);
  }
}

document.getElementById("add-book").onclick = () => {
  count++;
  localStorage.setItem("bookCount", count);
  document.getElementById("book-count").innerText = count;
  renderShelf();
};

document.getElementById("remove-book").onclick = () => {
  if (count>0) {
    count--;
    localStorage.setItem("bookCount", count);
    document.getElementById("book-count").innerText = count;
    renderShelf();
  }
};

document.getElementById("upload-book").onclick = () => {
  const title = document.getElementById("book-title").value;
  const file = document.getElementById("book-cover").files[0];
  if(!title || !file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.createElement("img");
    img.src = e.target.result;
    const slot = document.createElement("div");
    slot.className = "book-slot";
    slot.appendChild(img);
    shelf.appendChild(slot);

    const row = document.createElement("tr");
    row.innerHTML = `<td>${title}</td><td><img src="${e.target.result}" width="50"></td><td></td>`;
    tableBody.appendChild(row);
  };
  reader.readAsDataURL(file);
};

renderShelf();
