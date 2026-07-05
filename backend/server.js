// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// وارد کردن مسیرهای (Routes) ماژولار
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

const app = express();

// --- Middleware ---

// تنظیم CORS برای اجازه دادن به فرانت‌اِند
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// اجازه دادن به ارسال داده‌های JSON در بدنه درخواست (Body)
app.use(express.json());

// --- Database Connection ---
const mongoURI = process.env.DATABASE_URL;
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes Registration ---

// مسیرهای احراز هویت (Register/Login)
app.use('/api/auth', authRoutes);

// مسیرهای پرداخت (Create Payment/History)
app.use('/api/payments', paymentRoutes);

// مسیرهای ادمین (Stats/Transactions)
app.use('/api/admin', adminRoutes);

// --- Error Handling ---

// هندلر برای مسیرهایی که وجود ندارند (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// هندلر برای خطاهای کلی سرور (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server!'
    });
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening on port: ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});
