const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// وارد کردن مدل تراکنش
// مطمئن شوید فایل models/Transaction.js را ساخته‌اید
const Transaction = require('./models/Transaction'); 

const app = express();

// --- تنظیمات میان‌افزارها (Middlewares) ---
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// --- اتصال به MongoDB ---
const dbURI = process.env.DATABASE_URL;

mongoose.connect(dbURI)
  .then(() => console.log('✅ متصل به دیتابیس MongoDB (PiDao Database)'))
  .catch((err) => console.error('❌ خطا در اتصال به دیتابیس:', err));

// --- میان‌افزار امنیتی برای APIها ---
const validateApiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== process.env.PI_API_KEY) {
    return res.status(403).json({ message: 'دسترسی غیرمجاز: کلید API نامعتبر است.' });
  }
  next();
};

// اعمال امنیت روی تمامی مسیرهایی که با /api/payment شروع می‌شوند
app.use('/api/payment', validateApiKey);

// --- مسیرهای پرداخت (Payment Routes) ---

// ۱. تایید اولیه درخواست پرداخت
app.post('/api/payment/approve', (req, res) => {
  // در محیط واقعی، این بخش باید با شبکه Pi ارتباط برقرار کند
  res.status(200).json({ 
    success: true, 
    transactionId: `pi_txn_${Date.now()}` 
  });
});

// ۲. نهایی کردن تراکنش و ذخیره در دیتابیس
app.post('/api/payment/complete', async (req, res) => {
  const { transactionId, paymentDetails } = req.body;

  // بررسی وجود اطلاعات ضروری
  if (!transactionId || !paymentDetails || !paymentDetails.amount) {
    return res.status(400).json({ message: 'اطلاعات پرداخت ناقص است.' });
  }

  try {
    // جلوگیری از ثبت تراکنش تکراری (Double Spending Protection)
    const existingTx = await Transaction.findOne({ piTransactionId: transactionId });
    if (existingTx) {
      return res.status(400).json({ message: 'این تراکنش قبلاً ثبت شده است.' });
    }

    // ساخت سند جدید برای ذخیره در MongoDB
    const newTransaction = new Transaction({
      piTransactionId: transactionId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency || 'PI',
      metadata: {
        productName: paymentDetails.productName || 'PiDao Service',
        orderId: paymentDetails.orderId || 'N/A'
      },
      status: 'completed'
    });

    await newTransaction.save();
    
    console.log(`✨ تراکنش موفق: ${transactionId} در دیتابیس ذخیره شد.`);
    res.status(200).json({ success: true, message: 'تراکنش با موفقیت تایید و ثبت شد.' });

  } catch (error) {
    console.error('❌ خطا در عملیات ذخیره‌سازی:', error);
    res.status(500).json({ message: 'خطا در سرور هنگام ثبت تراکنش.' });
  }
});

// --- مسیر مشاهده لیست تراکنش‌ها (Admin Route) ---
// این مسیر برای تست و مشاهده گزارش‌ها استفاده می‌شود
app.get('/api/admin/transactions', async (req, res) => {
  try {
    // دریافت تمام تراکنش‌ها از جدیدترین به قدیمی‌ترین
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('❌ خطا در دریافت لیست تراکنش‌ها:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات از دیتابیس.' });
  }
});

// --- راه اندازی سرور ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 سرور PiDao فعال شد`);
  console.log(`📍 آدرس: http://localhost:${PORT}`);
  console.log(`🗄️ وضعیت دیتابیس: در حال تلاش برای اتصال...`);
  console.log(`================================================`);
});
