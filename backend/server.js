const connectDB = require('./db');
// ... سایر import‌ها

// اتصال به دیتابیس
connectDB();

// حالا در مسیر پرداخت، داده‌ها را با متاداده ذخیره می‌کنیم:
app.post('/payments/verify', validateApiKey, async (req, res) => {
    const { paymentId, amount, userId, metadata } = req.body;

    try {
        // ۱. تایید در شبکه Pi (شبیه‌سازی شده)
        const isVerified = true; 

        if (isVerified) {
            // ۲. ذخیره در MongoDB با تمام جزئیات و متاداده‌ها
            const newPayment = await Payment.create({
                paymentId,
                userId,
                amount,
                metadata: {
                    ...metadata, // تمام متاداده‌هایی که از فرانت‌اند آمده (مثل projectId)
                    verifiedAt: new Date()
                }
            });

            res.json({ success: true, payment: newPayment });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
