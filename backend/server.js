const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// تنظیمات CORS (بر اساس نیاز خودتان تنظیم کنید)
app.use(cors()); 

// --- مسیرهای پرداخت (Payment Routes) ---

// ۱. ایجاد درخواست اولیه پرداخت
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, type, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: type || 'PRODUCT_PURCHASE',
        status: 'PENDING',
        // نکته مهم: در PostgreSQL دیگر نیاز به JSON.stringify نیست
        metadata: metadata || {} 
      }
    });

    res.status(201).json({
      success: true,
      orderId: newTransaction.id
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ success: false, message: "Failed to create transaction" });
  }
});

// ۲. تایید تراکنش (Server Approval)
app.post('/api/payment/approve', async (req, res) => {
  try {
    // فعلاً برای تست، این مسیر همیشه موفق است
    res.status(200).json({ success: true, message: "Transaction approved by server" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Approval failed" });
  }
});

// ۳. تکمیل نهایی تراکنش (Completion)
app.post('/api/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid, productId } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: paymentId }
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: "Transaction already completed" });
    }

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

// مسیر اضافی برای مشاهده تراکنش‌ها (برای تست)
app.get('/api/transactions', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(transactions);
});

app.get('/health', (req, res) => {
  res.send('Server is running with PostgreSQL (Prisma)...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
