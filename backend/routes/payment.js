const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/payments/create
 * @desc    ایجاد یک درخواست پرداخت جدید در شبکه Pi
 * @access  Private (Requires JWT)
 */
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { amount, orderId, currency } = req.body;
        const userId = req.user.id; // دریافت شناسه کاربر از توکن JWT

        console.log(`[Payment] Initiating order ${orderId} for user ${userId}`);

        // --- ارتباط با Pi Network API ---
        // در اینجا از کلید امن PI_API_KEY که در .env است استفاده می‌کنیم
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

        // در دنیای واقعی، شما اینجا باید اطلاعات تراکنش را در دیتابیس ذخیره کنید
        // با وضعیت "PENDING" (در انتظار تایید)

        res.status(200).json({
            success: true,
            message: 'Payment request created successfully',
            data: piResponse.data
        });

    } catch (error) {
        console.error('❌ Payment Route Error:', error.response?.data || error.message);
        
        res.status(500).json({
            success: false,
            message: 'Failed to process payment with Pi Network',
            error: error.response?.data || error.message
        });
    }
});

/**
 * @route   GET /api/payments/history
 * @desc    دریافت تاریخچه پرداخت‌های یک کاربر خاص
 * @access  Private (Requires JWT)
 */
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // در اینجا کوئری به MongoDB برای پیدا کردن تراکنش‌های این کاربر زده می‌شود
        // مثال: const history = await Transaction.find({ userId });
        res.json({ success: true, data: [] }); 
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
