const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // اضافه شد
require('dotenv').config();

// وارد کردن مدل تراکنش
const Transaction = require('./models/Transaction'); 

const app = express();

// --- تنظیمات ---
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// --- اتصال به MongoDB ---
// نکته: در .env باید DATABASE_URL را فعال کرده باشی
const dbURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/pidao_db';

mongoose.connect(dbURI)
  .then(() => console.log('✅ متصل به دیتابیس MongoDB'))
  .catch((err) => console.error('❌ خطا در اتصال به دیتابیس:', err));

// --- میان‌افزار امنیتی ---
const validateApiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== process.env.PI_API_KEY) {
    return res.status(403).json({ message: 'دسترسی غیرمجاز' });
  }
  next();
};

app.use('/api/payment', validateApiKey);

// --- مسیرهای پرداخت ---

// ۱. تایید اولیه (مشابه قبل)
app.post('/api/payment/approve', (req, res) => {
  // در دنیای واقعی اینجا باید با API شبکه Pi چک شود
  res.status(200).json({ 
    success: true, 
    transactionId: `pi_txn_${Date.now()}` 
  });
});

// ۲. نهایی کردن و ذخیره در دیتابیس (اصلاح شده)
app.post('/api/payment/complete', async (req, res) => {
  const { transactionId, paymentDetails } = req.body;

  try {
    // بررسی اینکه آیا این تراکنش قبلاً ثبت شده یا نه (جلوگیری از Double Spending)
    const existingTx = await Transaction.findOne({ piTransactionId: transactionId });
    if (existingTx) {
      return res.status(400).json({ message: 'این تراکنش قبلاً ثبت شده است.' });
    }

    // ایجاد یک سند جدید در دیتابیس
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
    
    console.log(`✨ تراکنش ${transactionId} با موفقیت در دیتابیس ذخیره شد.`);
    res.status(200).json({ success: true, message: 'تراکنش ثبت شد.' });

  } catch (error) {
    console.error('❌ خطا در ذخیره تراکنش:', error);
    res.status(500).json({ message: 'خطا در ثبت تراکنش در دیتابیس.' });
  }
});

// --- راه اندازی ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 سرور PiDao با قابلیت ذخیره‌سازی آماده است روی پورت ${PORT}`);
});
