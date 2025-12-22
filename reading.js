
const booksContainer = document.getElementById("booksContainer");
const bookForm = document.getElementById("bookForm");
const flowerZone = document.getElementById("flowerZone");

let bookList = JSON.parse(localStorage.getItem("bookList")) || [];

function createBookCard(book, index) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.onclick = () => openBookModal(index);

  const img = document.createElement("img");
  img.className = "book-cover";
  img.src = book.cover || "https://cdn-icons-png.flaticon.com/512/29/29302.png";
  img.alt = book.title;

  const label = document.createElement("div");
  label.className = "book-label";
  label.textContent = book.title;

  card.appendChild(img);
  card.appendChild(label);
  booksContainer.appendChild(card);
}

function openBookModal(index) {
  const book = bookList[index];
  document.getElementById("modalTitle").innerText = book.title;
  document.getElementById("modalTags").innerText = book.tags;
  document.getElementById("modalQuote").innerText = book.quote;
  document.getElementById("modalNotes").innerText = book.notes;
  document.getElementById("bookModal").style.display = "block";

  // 花朵动画
  const flower = document.createElement("div");
  flower.className = "flower-bloom";
  flower.style.left = `${Math.random() * 90 + 5}%`;
  flower.style.animationDelay = `${Math.random() * 0.5}s`;
  flowerZone.appendChild(flower);
  setTimeout(() => flower.remove(), 4000);
}

function closeBookModal() {
  document.getElementById("bookModal").style.display = "none";
}

bookForm.onsubmit = (e) => {
  e.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById("bookCover").files[0];

  reader.onload = () => {
    const newBook = {
      title: document.getElementById("bookTitle").value,
      tags: document.getElementById("bookTags").value,
      quote: document.getElementById("bookQuote").value,
      notes: document.getElementById("bookNotes").value,
      cover: reader.result || ""
    };
    bookList.push(newBook);
    localStorage.setItem("bookList", JSON.stringify(bookList));
    booksContainer.innerHTML = "";
    bookList.forEach(createBookCard);
    bookForm.reset();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
};

// 初始化
bookList.forEach(createBookCard);

window.onclick = function(event) {
  const modal = document.getElementById("bookModal");
  if (event.target === modal) modal.style.display = "none";
};
