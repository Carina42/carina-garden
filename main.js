
// 主题切换
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 倒计时显示
function updateCountdown() {
  const now = new Date();
  const yearEnd = new Date(now.getFullYear(), 11, 31);
  const daysLeft = Math.ceil((yearEnd - now) / (1000 * 60 * 60 * 24));
  document.getElementById("year-end-countdown").innerText = `今年还剩下 ${daysLeft} 天`;
}
updateCountdown();

// 自定义倒计时添加
document.getElementById("custom-countdown-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("event-name").value;
  const date = new Date(document.getElementById("event-date").value);
  const now = new Date();
  const days = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  const li = document.createElement("li");
  li.textContent = `${name}：还有 ${days} 天`;
  document.getElementById("custom-countdown-list").appendChild(li);
  this.reset();
});

// 随机语录
const quotes = [
  "“I am rooted, but I flow.” — Virginia Woolf",
  "“Books are the mirrors of the soul.” — Virginia Woolf",
  "“No need to hurry. No need to sparkle.”",
  "“A woman must have money and a room of her own.”",
  "“The eyes of others our prisons; their thoughts our cages.”"
];
document.getElementById("quote-text").innerText = quotes[Math.floor(Math.random() * quotes.length)];

// 天气模拟（未来可接入API）
document.getElementById("weather-display").innerText = "☀️ 郑州 · 晴 15°C";
// ⚠️ 你可使用 OpenWeatherMap API 获取实时天气并渲染不同背景
