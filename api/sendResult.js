export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Body parse qilish serverless uchun
  let body = {};
  try {
    body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => data += chunk);
      req.on("end", () => resolve(JSON.parse(data)));
      req.on("error", err => reject(err));
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { fullname, phone, total, level, comment, answers = [] } = body;

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Bot token yoki chat_id yo'q" });
  }

  const message = `
📚 Yangi test natijasi
👤 Ism: ${fullname || "-"}
📞 Telefon: ${phone || "-"}
📊 Ball: ${total || "-"}
🏷 Daraja: ${level || "-"}
📝 Tahlil: ${comment || "-"}
✅ Javoblar:
${Array.isArray(answers) ? answers.join("\n") : "-"}
`;

  try {
    // Node 18+ da fetch global
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: data.description || "Telegram error" });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}