/**
 * 小娜花园 v12.0 - 沉浸式天气模块
 * 需求2：手机端全屏覆盖，产生沉浸感
 */
(function(){
  function apply沉浸式Weather(kind) {
    const layer = document.getElementById("weatherLayer");
    if(!layer) return;
    layer.innerHTML = "";
    
    // 判断是否为移动端
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      layer.classList.add("full-immersion"); // CSS中定义的沉浸类
      // 需求2: 根据天气类型生成全屏覆盖粒子
      if (kind === 'rain') {
        createRainDrops(layer);
      } else if (kind === 'sunny') {
        layer.style.background = "radial-gradient(circle at 50% 20%, rgba(255,223,0,0.2) 0%, transparent 70%)";
      }
    } else {
      layer.classList.remove("full-immersion");
      // 保持电脑端的边缘天气特效（原有逻辑）
    }
  }

  function createRainDrops(container) {
    for(let i=0; i<30; i++) {
      const drop = document.createElement("div");
      drop.className = "rain-drop";
      drop.style.left = Math.random() * 100 + "%";
      drop.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(drop);
    }
  }

  window.initWeatherV12 = apply沉浸式Weather;
})();
