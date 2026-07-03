import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// بارگذاری متغیرهای .env
dotenv.config();

const app = express();

// --- تنظیمات امنیتی و میان‌افزارها ---
app.use(helmet()); // امنیت هدرها
app.use(cors({ origin: process.env.FRONTEND_URL })); // اجازه فقط به فرانت‌اند ما
app.use(express.json()); // برای خواندن درخواست‌های JSON

// متغیرهای محیطی
const PI_API_KEY = process.env.PI_API_KEY;
const PI_BASE = "https://api.minepi.com/v2";
const PUBLIC_URL = process.env.PUBLIC_URL || "https://apppidaonkm2562.pinet.com";

// لایه امنیتی برای مسیرهای حساس (مثل approve و complete)
const validateApiKey = (req, res, next) => {
    const userKey = req.headers['x-api-key'];
    if (userKey !== PI_API_KEY) {
        return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }
    next();
};

// --- ۱. مسیر Metadata (برای نمایش در Pi Browser) ---
app.get("/pi/metadata", (req, res) => {
    res.json({
        title: "Pi Dao",
        description: "The future of decentralized governance on the Pi Network.",
        image: `${PUBLIC_URL}/preview.png`,
        url: PUBLIC_URL
    });
});

// --- ۲. مسیر تایید پرداخت (Approve) ---
// این مسیر باید توسط فرانت‌اند با API Key صدا زده شود
app.post("/approve", validateApiKey, async (req, res) => {
    try {
        const { paymentId } = req.body;
        console.log(`🔄 Approving payment: ${paymentId}`);

        const response = await fetch(`${PI_BASE}/payments/${paymentId}/approve`, {
            method: "POST",
            headers: { Authorization: `Key ${PI_API_KEY}` }
        });
        
        const data = await response.text();
        res.status(response.status).send(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- ۳. مسیر نهایی کردن پرداخت (Complete) ---
app.post("/complete", validateApiKey, async (req, res) => {
    try {
        const { paymentId, txid } = req.body;
        console.log(`✅ Completing payment: ${paymentId} with TXID: ${txid}`);

        const response = await fetch(`${PI_BASE}/payments/${paymentId}/complete`, {
            method: "POST",
            headers: {
                Authorization: `Key ${PI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ txid })
        });

        const data = await response.text();
        res.status(response.status).send(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- ۴. مسیر تست سلامت سرور ---
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "PiDao Backend is running" });
});

// شروع به کار سرور
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 PiDao Professional Backend running on port ${PORT}`);
    console.log(`🌐 Metadata URL: ${PUBLIC_URL}/pi/metadata`);
});
