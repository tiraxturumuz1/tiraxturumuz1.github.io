import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;
const PI_BASE = "https://api.minepi.com/v2";

app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  const r = await fetch(`${PI_BASE}/payments/${paymentId}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Key ${PI_API_KEY}`
    }
  });

  const text = await r.text();
  res.status(r.status).send(text);
});

app.post("/complete", async (req, res) => {
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
});

app.listen(3000, () => console.log("server running"));
