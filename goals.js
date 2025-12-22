<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>小娜花园 · 专注</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="morandi-theme">
  <div class="garden-frame">
     <div id="weatherLayer" class="weather-layer"></div>
  </div>

  <div class="page-container">
    <header class="site-header">
      <div class="brand"><h1>小娜花园</h1></div>
      <nav class="top-nav">
        <a href="index.html">主页</a>
        <a href="focus.html" class="active">专注</a>
        <a href="reading.html">阅读</a>
        <a href="writing.html">写作</a>
        <a href="sleep.html" data-mobile="hide">睡眠</a>
        <a href="exercise.html" data-mobile="hide">运动</a>
        <button id="navMoreBtn" class="nav-more">更多 ▾</button>
        <div id="navMoreMenu" class="nav-more-menu"></div>
        <button id="themeBtn" class="btn btn-ghost">🎨</button>
      </nav>
    </header>

    <main class="layout">
      <section class="card">
        <div class="card-header">
          <h2>今日心情</h2>
        </div>
        <div class="mood-selector">
          <span class="mood-btn" data-val="😊">😊</span>
          <span class="mood-btn" data-val="🌿">🌿</span>
          <span class="mood-btn" data-val="🌧️">🌧️</span>
          <span class="mood-btn" data-val="🤯">🤯</span>
          <span class="mood-btn" data-val="😴">😴</span>
        </div>
        <div id="currentMoodText" style="text-align:center; color:var(--accent); font-size:0.9rem;"></div>
      </section>

      <section class="card">
        <div class="card-header">
          <h2>待办事项</h2>
          <span class="hint">优先项排序</span>
        </div>
        <div style="display:flex; gap:5px; margin-bottom:10px;">
          <input id="newTodo" class="input" style="flex:1; padding:8px; border-radius:4px; border:1px solid #ddd;" placeholder="添加一件小事..." />
          <button id="addTodo" class="btn btn-primary">+</button>
        </div>
        <div id="todoList" class="todo-list"></div>
      </section>

      <section class="card full-width" style="border-top: 4px solid #a8d5ba; box-shadow: 0 10px 20px rgba(168, 213, 186, 0.3);">
        <div class="card-header">
          <h2>今日感恩</h2>
          <button id="exportGratitude" class="btn btn-ghost">📸 导出图片</button>
        </div>
        <div class="gratitude-inputs" style="display:flex; flex-direction:column; gap:10px;">
          <input class="g-input input" placeholder="1. 感谢今天的..." />
          <input class="g-input input" placeholder="2. 感谢..." />
          <input class="g-input input" placeholder="3. 感谢..." />
        </div>
        <button id="saveGratitude" class="btn btn-primary" style="margin-top:15px; width:100%;">保存记录</button>
      </section>
    </main>

    <div id="gratitudeModal" class="modal">
      <div class="modal-backdrop"></div>
      <div class="modal-panel" style="max-width:400px; text-align:center;">
        <button class="modal-close" id="closeGModal">✕</button>
        <h3>选择卡片样式</h3>
        <div style="display:flex; gap:10px; margin-bottom:15px; justify-content:center;">
          <button class="btn btn-soft" onclick="renderCard(1)">简约</button>
          <button class="btn btn-soft" onclick="renderCard(2)">植物</button>
          <button class="btn btn-soft" onclick="renderCard(3)">信纸</button>
        </div>
        <div id="cardPreviewArea"></div>
        <div style="margin-top:10px; font-size:0.8rem; color:#888;">长按上方图片即可保存</div>
      </div>
    </div>
    
    <div id="themeModal" class="modal"><div class="modal-backdrop"></div><div class="modal-panel"><button class="modal-close" id="closeTheme">✕</button><h3>主题</h3><div id="themeGrid"></div></div></div>

  </div>
  <script src="main.js"></script>
  <script src="focus.js"></script>
</body>
</html>
