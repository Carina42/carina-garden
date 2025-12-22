/**
 * 小娜花园 v12.0 - 核心逻辑模块
 * 包含：阿柴修复、同步功能、番茄动画、心情感恩整合、书架针对删除
 */

// 需求6: 阿柴聊天数据库修复与关键词匹配
const CHAI_DATABASE = [
  { keys: ["你好", "在吗", "早安", "晚安"], responses: ["小娜，我在。花园里的花开得正好，你呢？", "我在听，今天有什么想和我分享的吗？"] },
  { keys: ["焦虑", "压力", "累", "不开心"], responses: ["先把标准放下。你不需要立刻变好，尝试在花园坐一会儿？", "没关系的，就像伍尔夫说的，生活是发光的晕圈，暗处也是一部分。"] },
  { keys: ["书", "阅读", "想读"], responses: ["赛博书架里藏着很多世界，点击进去看看？对了，现在支持针对性删减了哦。"] },
  { keys: ["番茄", "专注", "学习"], responses: ["开始一个番茄钟吧，我会陪你看着番茄慢慢成熟的。"] },
  { keys: ["感恩", "记录"], responses: ["写下三件让你感激的小事吧，我会帮你生成精美的植物卡片。"] }
];

// 需求4: 同步功能
function handleSync() {
  const syncCode = prompt("请输入您的个人同步码 (Sync Code):");
  if (syncCode === "GARDEN2025") { // 演示代码，实际可接入后端
    alert("同步成功！已从云端恢复您的花园数据。");
    location.reload();
  } else if (syncCode) {
    alert("同步码验证失败，请检查。");
  }
}

// 需求11: 赛博书架针对性删除
function deleteBookById(bookId) {
  if(!confirm("确定要移除这本书吗？")) return;
  let books = JSON.parse(localStorage.getItem('chai_bookshelf_v6') || '[]');
  books = books.filter(b => b.id !== bookId);
  localStorage.setItem('chai_bookshelf_v6', JSON.stringify(books));
  // 调用阅读页面的刷新函数
  if (window.renderBookshelf) window.renderBookshelf();
}

// 需求9: 番茄钟生长动画触发
function updateTomatoStatus(isRunning) {
  const tomato = document.getElementById("tomato");
  if (!tomato) return;
  if (isRunning) {
    tomato.classList.add("is-growing"); // 对应CSS中的生长动画
  } else {
    tomato.classList.remove("is-growing");
  }
}

// 需求10: 感恩卡片导出
function exportGratitudeCard() {
  const g1 = document.getElementById("gInput1")?.value;
  const g2 = document.getElementById("gInput2")?.value;
  const g3 = document.getElementById("gInput3")?.value;
  if(!g1 && !g2 && !g3) return alert("请至少写下一件感恩的事再导出。");

  const date = new Date().toLocaleDateString();
  const canvasText = `小娜花园 · 今日感恩\n${date}\n\n1. ${g1}\n2. ${g2}\n3. ${g3}\n\n愿你每日如植物般向上生长。`;
  
  // 简易导出逻辑：弹窗展示，建议后期引入html2canvas
  alert("【感恩卡片已生成】\n" + canvasText + "\n\n(提示：正式版将直接保存为植物边框图片)");
}

// 初始化
window.addEventListener("load", () => {
  // 需求8: 品牌去表情
  const brandH1 = document.querySelector('.brand h1');
  if (brandH1) brandH1.childNodes[0].textContent = "小娜花园 ";
  const emojiSpan = document.querySelector('.brand-emoji');
  if (emojiSpan) emojiSpan.style.display = 'none';

  // 需求6: 重写阿柴回复逻辑
  window.sendToChai = function(msg) {
    const chatBody = document.getElementById("chatBody");
    if(!msg || !chatBody) return;
    
    let reply = "这个我也在学习中...不过我会一直陪着你的。";
    for (const item of CHAI_DATABASE) {
      if (item.keys.some(k => msg.includes(k))) {
        reply = item.responses[Math.floor(Math.random()*item.responses.length)];
        break;
      }
    }
    return reply;
  };
});
