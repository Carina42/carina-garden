
/**
 * Vercel Serverless Function: /api/chai
 * - Place OPENAI_API_KEY in Vercel Environment Variables
 * - This file keeps your key OFF the client (required).
 *
 * Uses Chat Completions endpoint for compatibility.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { message, history } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing OPENAI_API_KEY (set it in Vercel env vars)" });
      return;
    }

    const messages = [
      {
        role: "system",
        content:
          "你是阿柴（柴柴助理），语气温柔、简洁、植物系。你会帮助用户整理读书/写作/生活记录，输出可执行的小步骤。避免夸张措辞。"
      },
      ...(Array.isArray(history) ? history.slice(-12) : []),
      { role: "user", content: String(message || "") }
    ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.7
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      res.status(resp.status).json({ error: data?.error || data });
      return;
    }

    const reply = data?.choices?.[0]?.message?.content ?? "（阿柴暂时没接上…）";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
