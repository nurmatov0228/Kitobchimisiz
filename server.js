import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("./")); // index.html ni browserga xizmat qiladi

app.post("/sendResult", async (req, res) => {
    const { fullname, phone, total, level, comment, answers = [] } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    const message = `
📚 Yangi test natijasi
👤 Ism: ${fullname}
📞 Telefon: ${phone}
📊 Ball: ${total}
🏷 Daraja: ${level}
📝 Tahlil: ${comment}
✅ Javoblar:
${answers.join("\n")}
`;

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
            },
        );
        const data = await response.json();
        console.log(data); // <- shu logga qarang, nima xato chiqayotganini ko‘rish uchun
        if (!data.ok) return res.status(500).json(data);
        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log("Server 3000-portda ishlayapti"));

