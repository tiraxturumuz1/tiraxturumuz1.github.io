/**
 * PiDao Backend - Secure Core Server
 * 
 * This server acts as a secure middleware between the Pi Network 
 * and the Frontend, protecting all sensitive API keys.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

// --- [1] Middleware Configuration ---

// اجازه دسترسی به فرانت‌اِند شما (از فایل .env خوانده می‌شود)
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json()); // برای خواندن JSON در Body درخواست‌ها

// --- [2] Database Connection ---
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- [3] Security Middlewares (Custom) ---

/**
 * Middleware برای بررسی توکن JWT کاربران
 * این کار باعث می‌شود فقط کاربران وارد شده بتوانند به برخی مسیرها دسترسی داشته باشند.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
        req.user = user;
        next();
    });
};

/**
 * Middleware برای محافظت از مسیرهای ادمین
 * چک می‌کند که آیا درخواست دارای Admin Secret Key معتبر هست یا خیر.
 */
const authenticateAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Unauthorized Admin Access' });
    }
};

// --- [4] API Routes ---

/**
 * مسیر Login/Auth:
 * در اینجا کاربر با استفاده از اطلاعات Pi احراز هویت شده و سرور به او JWT می‌دهد.
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { piUserId, username } = req.body;
        
        // در اینجا شما باید کاربر را در دیتابیس چک کنید یا بسازید
        // فعلاً یک توکن نمونه برای تست تولید می‌کنیم
        const user = { id: piUserId, username: username || 'PiUser' };
        
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        
        res.json({ 
            success: true, 
            token, 
            user 
        });
    } catch (error) {
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
});

/**
 * مسیر پرداخت (Payment Integration):
 * این مسیر بسیار حساس است. کلید PI_API_KEY هرگز به کلاینت نمی‌رسد.
 * کلاینت فقط درخواست را به اینجا می‌فرستد و سرور با شبکه Pi صحبت می‌کند.
 */
app.post('/api/payments/create', authenticateToken, async (req, res) => {
    try {
        // اطلاعات لازم از کلاینت (توسط کاربر لاگین شده)
        const { amount, orderId } = req.body;
        const userId = req.user.id;

        console.log(`[Payment] Processing order ${orderId} for user ${userId} (Amount: ${amount})`);

        // --- ارتباط با Pi Network API ---
        // اینجا از کلید مخفی که در .env ذخیره شده استفاده می‌کنیم
        const piResponse = await axios.post('https://api.minepi.com/v2/payments/create', {
            amount: amount,
            memo: `Order #${orderId}`,
            // سایر پارامترهای مورد نیاز شبکه Pi
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.PI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // ذخیره تراکنش در دیتابیس و بازگرداندن نتیجه به کلاینت
        res.json({ success: true, data: piResponse.data });

    } catch (error) {
        console.error('❌ Payment Error:', error.response?.data || error.message);
        res.status(500).json({ 
            message: 'Payment processing failed', 
            error: error.response?.data || error.message 
        });
    }
});

/**
 * مسیرهای مخصوص ادمین (Admin Only)
 * مثل مشاهده لیست کل تراکنش‌ها یا مدیریت کاربران
 */
app.get('/api/admin/transactions', authenticateAdmin, async (req, res) => {
    try {
        // در اینجا کوئری به دیتابیس برای گرفتن تراکنش‌ها زده می‌شود
        res.json({ message: 'Admin Access Granted', data: [] });
    } catch (error) {
        res.status(500).json({ message: 'Admin error', error: error.message });
    }
});

// --- [5] Error Handling & Server Start ---

// مدیریت خطاهای ۴۰۴
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
🚀 PiDao Backend is running!
----------------------------------
🌐 URL: http://localhost:${PORT}
🛡️ Mode: ${process.env.NODE_ENV}
🔒 Security: JWT & Admin Key Enabled
----------------------------------
    `);
});
