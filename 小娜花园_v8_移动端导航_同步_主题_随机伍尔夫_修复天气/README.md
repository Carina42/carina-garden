# 柴窝之家 v6（进阶版）

## 结构
- 静态页面：index.html / reading.html / writing.html / sleep.html / exercise.html / todo.html / goals.html
- 样式：style.css（全站统一植物系 + 主题切换）
- 主题切换：themeSwitch.js（按钮循环切换：leaf/moss/sun/night）
- 首页逻辑：main.js（天气、边框联动、倒计时进度条、自定义倒计时、番茄钟、今日摘要）
- 阅读页：reading.js（书架、封面上架、卡片笔记、标签筛选、趋势图/热力图）
- 图表：monthlyChart.js（Canvas柱图，不依赖外部库）
- 情绪热力：emotionHeatmap.js（Canvas月度情绪马赛克）
- 聊天：chatbot.js + chatbot.css（前端UI） + api/chat.js（Vercel后端函数）

## 部署到 Vercel
1. 把所有文件上传到 GitHub 仓库根目录（保持路径：api/chat.js 在 api/ 目录下）。
2. Vercel 导入该仓库进行部署。
3. 在 Vercel 项目 Settings → Environment Variables 添加：
   - OPENAI_API_KEY = 你的 OpenAI API Key
4. 重新部署（Redeploy）。
5. 打开站点，右下角 ☁️ 即可聊天。

## 天气说明
- 使用 open-meteo（无需 key）。
- 默认回退到郑州（定位拒绝/失败时）。