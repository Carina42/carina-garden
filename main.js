
let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let completedCount = 0;

function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}

function togglePomodoro() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
  } else {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        completedCount++;
        document.getElementById("completedTomatoes").innerHTML += '<span class="tomato-icon">🍅</span>';
        timeLeft = 25 * 60;
        updateDisplay();
      }
    }, 1000);
  }
}

function resetPomodoro() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  updateDisplay();
  isRunning = false;
}

function toggleChat() {
  const chat = document.getElementById("chat-window");
  chat.style.display = chat.style.display === "block" ? "none" : "block";
}

function saveMoodTodo() {
  const mood = document.getElementById("moodInput").value;
  const todo = document.getElementById("todoInput").value;
  localStorage.setItem("todayMood", mood);
  localStorage.setItem("todayTodo", todo);
  updateMoodTodoDisplay();
}

function updateMoodTodoDisplay() {
  const mood = localStorage.getItem("todayMood") || "（还没记录今日心情）";
  const todo = localStorage.getItem("todayTodo") || "（还没设置今日最重要事项）";
  document.getElementById("moodDisplay").textContent = `今日心情：${mood}`;
  document.getElementById("todoDisplay").textContent = `待办优先事项：${todo}`;
}

window.onload = () => {
  updateDisplay();
  updateMoodTodoDisplay();
};
