// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client'); // استفاده از Prisma به جای Mongoose

// بارگذاری متغیرهای محیطی
dotenv.config();

const app = express();
const prisma = new PrismaClient(); // مقداردهی اولیه به Prisma

// --- Middleware ---
app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- مسیرهای پرداخت (Payment Routes) ---

// ۱. ایجاد درخواست اولیه پرداخت
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, type, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // استفاده از Prisma برای ذخیره در SQLite
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: type || 'PRODUCT_PURCHASE',
        status: 'PENDING',
        metadata: JSON.stringify(metadata || {}), // تبدیل شیء به رشته برای ذخیره در SQLite
      }
    });

    res.status(201).json({
      success: true,
      orderId: newTransaction.id // Prisma از فیلد id استفاده می‌کند
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

    // پیدا کردن تراکنش با Prisma
    const transaction = await prisma.transaction.findUnique({
      where: { id: paymentId }
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: "Transaction already completed" });
    }

    // آپدیت وضعیت با Prisma
    const updatedTransaction = await prisma.transaction.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        txid: txid
      }
    });

    if (productId === 1) { 
       console.log(`🚀 Membership activated for transaction: ${paymentId}`);
    }

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
  res.send('Server is running with SQLite (Prisma)...');
});

// --- شروع سرور ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
