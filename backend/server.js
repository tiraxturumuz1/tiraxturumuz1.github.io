import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

const app = express();

// --- تنظیمات امنیتی و میان‌افزارها ---
app.use(helmet()); // اضافه کردن هدرهای امنیتی برای جلوگیری از حملات XSS و غیره
app.use(cors({ 
    origin: process.env.FRONTEND_URL, // فقط اجازه دسترسی به فرانت‌اند پروژه تو
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"] // اجازه دادن به هدر اختصاصی ما
}));
app.use(express.json()); // قابلیت خواندن JSON از درخواست‌ها

// متغیرهای محیطی مورد نیاز
const PI_API_KEY = process.env.PI_API_KEY;
const PI_BASE = "https://api.minepi.com/v2";
const PUBLIC_URL = process.env.PUBLIC_URL || "https://apppidaonkm2562.pinet.com";

/**
 * Middleware برای بررسی امنیت درخواست‌ها
 * فقط درخواست‌هایی که دارای API KEY درست هستند اجازه عبور دارند.
 */
const validateApiKey = (req, res, next) => {
    const userKey = req.headers['x-api-key'];
    if (!userKey || userKey !== PI_API_KEY) {
        console.warn(`⚠️ Unauthorized attempt from IP: ${req.ip}`);
        return res.status(401).json({ error: "Unauthorized: Invalid or missing API Key" });
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
// این مسیر وقتی فراخوانی می‌شود که کاربر در فرانت‌اند دکمه پرداخت را زده است
app.post("/approve", validateApiKey, async (req, res) => {
    try {
        const { paymentId } = req.body;
        if (!paymentId) return res.status(400).json({ error: "paymentId is required" });

        console.log(`🔄 Approving payment request: ${paymentId}`);

        const response = await fetch(`${PI_BASE}/payments/${paymentId}/approve`, {
            method: "POST",
            headers: { 
                "Authorization": `Key ${PI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.text();
        console.log(`✅ Approval response: ${data}`);
        res.status(response.status).send(data);

    } catch (e) {
        console.error("❌ Error in /approve:", e.message);
        res.status(500).json({ error: e.message });
    }
});

// --- ۳. مسیر نهایی کردن پرداخت (Complete) ---
// این مرحله نهایی است و تراکنش را در شبکه Pi تثبیت می‌کند
app.post("/complete", validateApiKey, async (req, res) => {
    try {
        const { paymentId, txid } = req.body;
        if (!paymentId || !txid) return res.status(400).json({ error: "paymentId and txid are required" });

        console.log(`✅ Completing payment: ${paymentId} with TXID: ${txid}`);

        const response = await fetch(`${PI_BASE}/payments/${paymentId}/complete`, {
            method: "POST",
            headers: {
                "Authorization": `Key ${PI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ txid })
        });

        const data = await response.text();
        console.log(`🎉 Completion response: ${data}`);
        res.status(response.status).send(data);

    } catch (e) {
        console.error("❌ Error in /complete:", e.message);
        res.status(500).json({ error: e.message });
    }
});

// --- ۴. مسیر سلامت (Health Check) ---
app.get("/health", (req, res) => {
    res.json({ 
        status: "online", 
        timestamp: new Date().toISOString(),
        message: "PiDao Backend is running smoothly" 
    });
});

// شروع به کار سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
==================================================
🚀 PiDao Professional Backend is LIVE!
--------------------------------------------------
📍 Port: ${PORT}
📍 Mode: ${process.env.NODE_ENV}
📍 Metadata: ${PUBLIC_URL}/pi/metadata
📍 Frontend Allowed: ${process.env.FRONTEND_URL}
==================================================
    `);
});
