// 年度进度条
const yearProgress = document.getElementById('yearProgress');
const yearPercentageText = document.getElementById('yearPercentageText');
const today = new Date();
const start = new Date(today.getFullYear(), 0, 0);
const diff = today - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);
const percentage = Math.floor((dayOfYear / 365) * 100);
yearProgress.style.width = percentage + '%';
yearProgress.style.backgroundColor = '#a4c49a';
yearPercentageText.textContent = `今年已过去 ${percentage}%`;

// 天气
navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=demo&q=${latitude},${longitude}`);
  const data = await response.json();
  document.getElementById("weatherInfo").textContent =
    `${data.location.name}：${data.current.condition.text}，${data.current.temp_c}°C`;
  const icon = data.current.condition.icon;
  document.getElementById("weatherVisual").innerHTML = `<img src="${icon}" alt="weather icon">`;
});

// 随机语录
const quotes = [
  "“I am rooted, but I flow.” – Virginia Woolf",
  "“Books are the mirrors of the soul.”",
  "“Arrange whatever pieces come your way.”",
  "“Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.”"
];
document.getElementById("woolfQuote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

// 番茄钟
let timer = 1500, interval = null;
const timerDisplay = document.getElementById("timer");
const tomato = document.getElementById("tomato");
const finishedTomatoes = document.getElementById("finishedTomatoes");

function updateTimer() {
  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function tick() {
  timer--;
  updateTimer();
  if (timer <= 0) {
    clearInterval(interval);
    finishedTomatoes.innerHTML += "🍅";
    timer = 1500;
    updateTimer();
  }
}

tomato.onclick = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(tick, 1000);
  }
};
tomato.ondblclick = () => {
  clearInterval(interval);
  interval = null;
  timer = 1500;
  updateTimer();
};

// 聊天入口
document.getElementById("chatToggle").onclick = () => {
  const iframe = document.getElementById("chatIframe");
  iframe.style.display = iframe.style.display === "none" ? "block" : "none";
};

updateTimer();