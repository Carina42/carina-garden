
// Vercel Serverless Function: /api/chat
// Set environment variable: OPENAI_API_KEY
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing message" });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing OPENAI_API_KEY env var" });
      return;
    }

    // Use OpenAI Responses API (recommended) via fetch
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: "你是柴窝之家的柴柴助理：温柔、植物系、简洁不油腻。帮助用户记录、规划、写作、读书与生活复盘。回答用中文，语气像可靠的伙伴。"
          },
          { role: "user", content:uji(message) }
        ]
      })
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(500).json({ error: "OpenAI request failed", details: t });
      return;
    }
    const data = await r.json();

    // Extract text
    let reply = "";
    if (data && data.output && Array.isArray(data.output)) {
      // Responses API: output -> content
      for (const item of data.output) {
        if (item && item.content) {
          for (const c of item.content) {
            if (c.type === "output_text" && c.text) reply += c.text;
          }
        }
      }
    }
    if (!reply) reply = "（柴柴没有拿到文本输出…）";

    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: "Server error", details: String(e) });
  }
}

// prevent accidental unicode control issues
function uji(s){ return String(s); }
