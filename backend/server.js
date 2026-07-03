const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- تنظیمات Middleware ---

// ۱. اجازه دسترسی به فرانت‌اِند (CORS)
app.use(cors({
  origin: process.env.FRONTEND_URL // اجازه دسترسی فقط به آدرس مشخص شده در .env
}));

app.use(express.json());

// ۲. میان‌افزار امنیتی برای تایید کلید API (محافظ اصلی)
const validateApiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  const serverApiKey = process.env.PI_API_KEY;

  if (!clientApiKey || clientApiKey !== serverApiKey) {
    console.warn(`⚠️ درخواست غیرمجاز از IP: ${req.ip} - کلید نامعتبر است.`);
    return res.status(403).json({ message: 'دسترسی غیرمجاز: کلید API نامعتبر است.' });
  }
  
  // اگر کلید درست بود، اجازه بده درخواست به مرحله بعد برود
  next();
};

// اعمال میان‌افزار امنیتی روی تمام مسیرهای مربوط به پرداخت
// با این کار، تمام درخواست‌هایی که به /api/payment شروع می‌شوند، باید کلید درست داشته باشند
app.use('/api/payment', validateApiKey);

// --- مسیرهای (Routes) اصلی ---

// مسیر تایید اولیه پرداخت
app.post('/api/payment/approve', (req, res) => {
  console.log('✅ درخواست تایید پرداخت دریافت شد:', req.body);
  
  // در اینجا منطق تایید با Pi Network قرار می‌گیرد
  // فعلاً یک پاسخ موفقیت‌آمیز فرضی برمی‌گردانیم
  res.status(200).json({ 
    success: true, 
    transactionId: `pi_txn_${Date.now()}` 
  });
});

// مسیر نهایی کردن و ثبت در دیتابیس
app.post('/api/payment/complete', (req, res) => {
  const { transactionId, paymentDetails } = req.body;
  console.log(`✅ ثبت نهایی تراکنش: ${transactionId}`);

  // در اینجا کد ذخیره‌سازی در MongoDB قرار می‌گیرد
  // 예: await Transaction.create({ transactionId, ...paymentDetails });

  res.status(200).json({ 
    success: true, 
    message: 'تراکنش با موفقیت ثبت شد.' 
  });
});

// --- راه اندازی سرور ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 سرور PiDao با موفقیت روی پورت ${PORT} روشن شد.`);
  console.log(`🛡️ امنیت فعال است. کلید مورد انتظار: ${process.env.PI_API_KEY.substring(0, 5)}...`);
});
