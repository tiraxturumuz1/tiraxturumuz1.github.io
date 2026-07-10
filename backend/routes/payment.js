// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * @route   POST /api/payments/create
 * @desc    ایجاد یک درخواست پرداخت جدید در شبکه Pi و ذخیره در دیتابیس
 * @access  Private (Requires JWT)
 */
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { amount, orderId } = req.body; // orderId حالا مهم است
        const userIdStr = req.user.id; 

        console.log(`[Payment] Initiating order ${orderId} for user ${userIdStr}`);

        // تبدیل ID از رشته به عدد برای مطابقت با اسکیما (Int)
        const userId = parseInt(userIdStr);

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid User ID format' });
        }
        
        // بررسی اینکه آیا این orderId قبلاً در دیتابیس وجود دارد یا نه
        const existingTransaction = await prisma.transaction.findUnique({
            where: {
                orderId: orderId
            }
        });

        if (existingTransaction) {
            return res.status(400).json({ success: false, message: `Order ID ${orderId} already exists.` });
        }

        // ۱. ارتباط با Pi Network API
        const piResponse = await axios.post('https://api.minepi.com/v2/payments/create', {
            amount: amount,
            memo: `Order ID: ${orderId}`,
            currency: 'PI'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.PI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // ۲. ذخیره تراکنش در PostgreSQL با orderId
        const newTransaction = await prisma.transaction.create({
            data: {
                userId: userId,
                amount: parseFloat(amount),
                orderId: orderId, // حالا این فیلد در اسکیما وجود دارد
                status: 'pending' // مطابق با نمونه اسکیما تو
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
        // اگر خطا به دلیل تکراری بودن orderId بود، پیام مناسب‌تری برگردان
        if (error.code === 'P2002' && error.meta?.target?.includes('orderId')) {
             return res.status(400).json({ success: false, message: `Order ID ${orderId} already exists.` });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to process payment',
            error: error.message 
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
        const userId = parseInt(req.user.id);

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid User ID format' });
        }

        // دریافت تاریخچه بر اساس userId عددی
        // حالا می‌توانید تراکنش‌ها را با جزئیات بیشتری واکشی کنید، مثلاً نام کاربر
        const history = await prisma.transaction.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: { // اضافه کردن اطلاعات کاربر مرتبط
                user: {
                    select: { // فقط فیلدهای مورد نیاز را انتخاب کن
                        id: true,
                        username: true,
                        piUserId: true
                    }
                }
            }
        });

        res.json({ success: true, data: history }); 
    } catch (error) {
        console.error('❌ History Route Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
