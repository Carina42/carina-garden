
document.addEventListener("DOMContentLoaded", function () {
    const toggleChatbot = document.getElementById("toggle-chatbot");
    const chatbotBox = document.getElementById("chatbot-box");
    const closeChatbot = document.getElementById("close-chatbot");
    const sendButton = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatArea = document.getElementById("chat-area");

    toggleChatbot.addEventListener("click", () => {
        chatbotBox.style.display = "block";
    });

    closeChatbot.addEventListener("click", () => {
        chatbotBox.style.display = "none";
    });

    sendButton.addEventListener("click", () => {
        const message = userInput.value.trim();
        if (!message) return;
        appendMessage("你", message);
        userInput.value = "";

        // 发送给 OpenAI API（此处为占位符，需服务器代理或自定义后端支持）
        fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_API_KEY"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: message }]
            })
        })
            .then((res) => res.json())
            .then((data) => {
                const reply = data.choices[0].message.content.trim();
                appendMessage("柴柴", reply);
            })
            .catch(() => {
                appendMessage("柴柴", "出错啦！请检查网络或 API 设置。");
            });
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-message";
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});
