// backend/routes/payment.js (یا مستقیماً در server.js)
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // استفاده از مدل موجود در پروژه شما

// ۱. ایجاد درخواست اولیه پرداخت
router.post('/create', async (req, res) => {
  try {
    const { amount, type, metadata } = req.body;

    // ایجاد یک تراکنش در وضعیت 'PENDING'
    const newTransaction = new Transaction({
      amount,
      type, // مثلاً 'PRODUCT_PURCHASE' یا 'MEMBERSHIP'
      status: 'PENDING',
      metadata: metadata, // ذخیره اطلاعات محصول (productId و غیره)
      createdAt: new Date()
    });

    await newTransaction.save();

    // برگرداندن orderId به فرانت‌اِند برای استفاده در Pi SDK
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
// در این مرحله سرور تایید می‌کند که تراکنش با قوانین شما همخوانی دارد
router.post('/approve', async (req, res) => {
  try {
    const { paymentId } = req.body; 
    // در دنیای واقعی، اینجا باید چک کنید که آیا کاربر اجازه انجام این عملیات را دارد یا خیر

    res.status(200).json({ success: true, message: "Transaction approved by server" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Approval failed" });
  }
});

// ۳. تکمیل نهایی تراکنش (Completion)
// وقتی Pi شبکه تایید می‌کند، این مرحله فراخوانی می‌شود تا محصول به کاربر داده شود
router.post('/complete', async (req, res) => {
  try {
    const { paymentId, txid, amount, productId } = req.body;

    // پیدا کردن تراکنش بر اساس paymentId (که همان orderId از مرحله اول است)
    const transaction = await Transaction.findById(paymentId);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // آپدیت وضعیت تراکنش
    transaction.status = 'COMPLETED';
    transaction.txid = txid; // ذخیره شناسه تراکنش شبکه Pi برای پیگیری‌های بعدی
    await transaction.save();

    // --- منطق اصلی بیزنس شما اینجا قرار می‌گیرد ---
    // اگر productId مربوط به عضویت بود:
    if (productId === 1) { 
       // کد مربوط به فعال‌سازی عضویت کاربر در دیتابیس (مثلاً تغییر role کاربر به MEMBER)
       console.log("Activating Membership for user...");
    }
    // -------------------------------------------

    res.status(200).json({ success: true, message: "Payment completed and membership activated!" });
  } catch (error) {
    console.error("Complete Payment Error:", error);
    res.status(500).json({ success: false, message: "Failed to complete transaction" });
  }
});

module.exports = router;
