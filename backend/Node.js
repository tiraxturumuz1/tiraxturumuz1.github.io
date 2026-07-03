import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;
const PI_BASE = "https://api.minepi.com/v2";
const PUBLIC_URL = process.env.PUBLIC_URL || "https://apppidaonkm2562.pinet.com";

app.get("/pi/metadata", (req, res) => {
  res.json({
    title: "Pi Dao",
    description: "Pi payment app",
    image: `${PUBLIC_URL}/preview.png`,
    url: PUBLIC_URL
  });
});

app.post("/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;
    const r = await fetch(`${PI_BASE}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { Authorization: `Key ${PI_API_KEY}` }
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

app.listen(3000, () => console.log("Pi backend running on port 3000"));
