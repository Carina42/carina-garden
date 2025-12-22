// 获取定位并调用天气 API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    const data = await res.json();
    const weatherCode = data.current_weather.weathercode;
    const temp = data.current_weather.temperature;
    document.getElementById("weather-text").innerText =
      `天气：${temp}°C，${weatherCode}`;

    const effect = document.getElementById("weather-effect");
    if (weatherCode < 3) effect.className = "sunny-effect";
    else if (weatherCode < 51) effect.className = "cloudy-effect";
    else if (weatherCode < 61) effect.className = "rainy-effect";
    else effect.className = "snowy-effect";
  });
}

// 年度进度
const now = new Date();
const start = new Date(now.getFullYear(), 0, 1);
const end = new Date(now.getFullYear()+1, 0, 1);
const total = (end - start)/(1000*60*60*24);
const past = (now - start)/(1000*60*60*24);
const percent = Math.floor((past/total)*100);
document.getElementById("year-text").innerText =
  `今年已过去 ${Math.floor(past)} 天，还剩 ${Math.floor(total-past)} 天`;
document.getElementById("progress-fill").style.width = percent + "%";

// 随机语录
const woolfQuotes = [
  "Books are the mirrors of the soul.",
  "A woman must have money and a room of her own.",
  "I am rooted, but I flow.",
  "For most of history, Anonymous was a woman."
];
document.getElementById("woolf-quote").innerText =
  woolfQuotes[Math.floor(Math.random()*woolfQuotes.length)];

// 模拟阅读 & 写作状态（后续可从 localStorage 获取）
document.getElementById("reading-count").innerText = localStorage.getItem("bookCount")||0;
document.getElementById("writing-status").innerText = localStorage.getItem("wroteToday")=="true"?"已写":"未写";
document.getElementById("writing-words").innerText = localStorage.getItem("wordCount")||0;
