const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// تنظیمات اولیه
app.use(helmet());
app.use(cors());
app.use(express.json());

// لایه امنیتی ساده برای چک کردن کلید
const validateApiKey = (req, res, next) => {
    const userApiKey = req.headers['x-api-key'];
    if (userApiKey !== process.env.PI_API_KEY) {
        return res.status(401).json({ message: "❌ دسترسی غیرمجاز: کلید اشتباه است" });
    }
    next();
};

// مسیر تست (آیا سرور زنده است؟)
app.get('/test', (req, res) => {
    res.json({ message: "✅ سرور PiDao با موفقیت روشن شد!" });
});

// مسیر پرداخت (شبیه‌سازی شده)
app.post('/payments/verify', validateApiKey, (req, res) => {
    const { amount, metadata } = req.body;
    console.log("💰 دریافت درخواست پرداخت:", amount, "با اطلاعات:", metadata);
    
    res.json({ 
        success: true, 
        message: "پرداخت با موفقیت در سیستم ثبت شد" 
    });
});

// شروع به کار سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 سرور در پورت ${PORT} آماده است.`);
    console.log(`🔗 برای تست در مرورگر بزن: http://localhost:${PORT}/test`);
});
