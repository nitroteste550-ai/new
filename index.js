// index.js - Proxy para proteger Webhook Discord
import express from "express";
import fetch from "node-fetch"; // se estiver usando Node >= 18, pode usar fetch nativo

const app = express();
const PORT = process.env.PORT || 3000;

// Coloque aqui o seu webhook real
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1430492449591132221/p6Nt33V_WSBIkN5vpDeoy-xAMJP_AAs-q521oS-XGc28fDwG27nvie4zOZ-W9JlFbAYj";

// Middleware para ler JSON
app.use(express.json());

// Endpoint do proxy
app.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) return res.status(400).json({ error: "Payload vazio" });

    // Repassa para o Discord
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Falha ao enviar para Discord" });
    }

    return res.json({ success: true, message: "Payload enviado via proxy!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no proxy" });
  }
});

app.listen(PORT, () => console.log(`🚀 Proxy rodando na porta ${PORT}`));
