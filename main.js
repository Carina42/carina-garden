// 年度进度条
const now = new Date();
const start = new Date(now.getFullYear(), 0, 1);
const end = new Date(now.getFullYear() + 1, 0, 1);
const total = Math.floor((end - start) / (1000 * 60 * 60 * 24));
const past = Math.floor((now - start) / (1000 * 60 * 60 * 24));
const percent = ((past / total) * 100).toFixed(1);

document.getElementById("year-text").textContent =
  `今年已经过去了 ${past} 天，还剩下 ${total - past} 天`;

const progressFill = document.getElementById("progress-fill");
progressFill.style.width = percent + "%";

// 莫兰迪色系
const morandi = [
  "#c5c6c7", "#a8c0b5", "#d2b48c", "#e5c1bd", "#c0d6df",
  "#f1e3dd", "#b4c5c1", "#d3cbc6", "#d9b8c4"
];
progressFill.style.backgroundColor =
  morandi[Math.floor(Math.random() * morandi.length)];

// 伍尔夫语录（可扩展）
const quotes = [
  "Books are the mirrors of the soul. – Woolf",
  "A woman must have money and a room of her own...",
  "For most of history, Anonymous was a woman.",
  "I am rooted, but I flow."
];
document.getElementById("woolf-quote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

// 天气模拟 + 边框装饰
const weatherStates = ["sunny", "cloudy", "rainy", "snowy"];
const todayWeather = weatherStates[Math.floor(Math.random() * 4)];
document.getElementById("weather").textContent = "天气：" + todayWeather;

const deco = document.getElementById("weather-decoration");
deco.className = todayWeather;