// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client'); // اضافه کردن Prisma

const prisma = new PrismaClient(); // تعریف کلاینت پرایزما

/**
 * @route   POST /api/payments/create
 * @desc    ایجاد یک درخواست پرداخت جدید در شبکه Pi و ذخیره در دیتابیس
 * @access  Private (Requires JWT)
 */
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { amount, orderId, currency } = req.body;
        const userId = req.user.id; 

        console.log(`[Payment] Initiating order ${orderId} for user ${userId}`);

        // ۱. ارتباط با Pi Network API
        const piResponse = await axios.post('https://api.minepi.com/v2/payments/create', {
            amount: amount,
            memo: `Order ID: ${orderId}`,
            currency: currency || 'PI'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.PI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // ۲. ذخیره تراکنش در PostgreSQL با استفاده از Prisma
        // نکته: فرض می‌کنیم در schema.prisma مدلی به نام Transaction داری
        const newTransaction = await prisma.transaction.create({
            data: {
                userId: userId,
                amount: parseFloat(amount),
                orderId: orderId,
                status: 'PENDING', // وضعیت اولیه
                currency: currency || 'PI',
                // اگر در اسکیما فیلد دیگری مثل piPaymentId داری اینجا اضافه کن
            }
        });

        res.status(200).json({
            success: true,
            message: 'Payment request created and recorded',
            data: {
                transaction: newTransaction,
                piData: piResponse.data
            }
        });

    } catch (error) {
        console.error('❌ Payment Route Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to process payment',
            error: error.response?.data || error.message
        });
    }
});

/**
 * @route   GET /api/payments/history
 * @desc    دریافت تاریخچه پرداخت‌های یک کاربر از PostgreSQL
 * @access  Private (Requires JWT)
 */
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // جایگزین کردن کوئری MongoDB با کوئری Prisma
        const history = await prisma.transaction.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc' // جدیدترین‌ها اول
            }
        });

        res.json({ success: true, data: history }); 
    } catch (error) {
        console.error('❌ History Route Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
