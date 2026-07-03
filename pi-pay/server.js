import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;
const PI_BASE = "https://api.minepi.com/v2";
const PUBLIC_URL = "https://apppidaonkm2562.pinet.com";

app.get("/", (req, res) => {
  res.send("Pi backend is running");
});

app.get("/pi/metadata", (req, res) => {
  res.status(200).json({
    title: "Pi Dao",
    description: "Pi payment app",
    image: `${PUBLIC_URL}/preview.png`,
    url: PUBLIC_URL,
    tags: ["pi", "payment", "wallet"]
  });
});

app.post("/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: "paymentId is required" });

    const r = await fetch(`${PI_BASE}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`
      }
    });

    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/complete", async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) {
      return res.status(400).json({ error: "paymentId and txid are required" });
    }

    const r = await fetch(`${PI_BASE}/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log("server running on port 3000"));
