// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

const app = express();

// --- Middleware ---
app.use(express.json()); // برای خواندن JSON از req.body

// تنظیم CORS بر اساس لیست مجاز در .env
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    // اجازه دادن به درخواست‌هایی که origin آن‌ها در لیست مجاز است یا درخواست‌های بدون origin (مثل Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- مدل داده (Transaction Model) ---
// نکته: در پروژه شما فایل مدل در مسیر متفاوت است، اینجا مستقیماً تعریف می‌کنیم یا از فایل import می‌کنیم
// فرض بر این است که فایل مدل شما در مسیر زیر است:
const Transaction = require('./models/Transaction'); 

// --- اتصال به MongoDB ---
const mongoURI = process.env.DATABASE_URL;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error("Error Details:", err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error("💡 TIP: Check your internet/VPN or DNS settings. This is a DNS lookup error.");
    }
  });

// --- مسیرهای پرداخت (Payment Routes) ---

// ۱. ایجاد درخواست اولیه پرداخت
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, type, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const newTransaction = new Transaction({
      amount,
      type: type || 'PRODUCT_PURCHASE',
      status: 'PENDING',
      metadata: metadata,
      createdAt: new Date()
    });

    await newTransaction.save();

    res.status(201).json({
      success: true,
      orderId: newTransaction._id
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ success: false, message: "Failed to create transaction" });
  }
});

// ۲. تایید تراکنش (Server Approval)
app.post('/api/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body; 

    // در اینجا می‌توانید منطق‌های امنیتی اضافه کنید
    // مثلاً چک کردن اینکه آیا این transactionId قبلاً استفاده شده یا خیر
    
    res.status(200).json({ success: true, message: "Transaction approved by server" });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ success: false, message: "Approval failed" });
  }
});

// ۳. تکمیل نهایی تراکنش (Completion)
app.post('/api/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid, amount, productId } = req.body;

    const transaction = await Transaction.findById(paymentId);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: "Transaction already completed" });
    }

    // آپدیت وضعیت تراکنش
    transaction.status = 'COMPLETED';
    transaction.txid = txid; 
    await transaction.save();

    // --- منطق اصلی بیزنس ---
    if (productId === 1) { 
       console.log(`🚀 Membership activated for transaction: ${paymentId}`);
       // در اینجا می‌توانید مدل User را پیدا کرده و نقش او را تغییر دهید
    }
    // -----------------------

    res.status(200).json({ 
      success: true, 
      message: "Payment completed and membership activated!" 
    });
  } catch (error) {
    console.error("Complete Payment Error:", error);
    res.status(500).json({ success: false, message: "Failed to complete transaction" });
  }
});

// --- مسیر تست سلامت سرور ---
app.get('/health', (req, res) => {
  res.send('Server is running...');
});

// --- شروع سرور ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
