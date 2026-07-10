// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// وارد کردن مسیرها (Routes)
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

// بارگذاری متغیرهای محیطی
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middlewareها
app.use(express.json());
app.use(cors()); // در محیط Production محدودتر کنید

// --- ثبت مسیرهای API (Routing) ---

// مسیرهای احراز هویت (لاگین با Pi و دریافت پروفایل)
// این مسیرها با requests فرانت‌اند در useAuth.ts هماهنگ هستند
app.use('/api/auth', authRoutes);

// مسیرهای پرداخت (ایجاد تراکنش و تاریخچه)
app.use('/api/payment', paymentRoutes);

// مسیرهای مدیریت (آمار و لیست تراکنش‌ها برای ادمین)
app.use('/api/admin', adminRoutes);

// --- مسیرهای تست و سلامت (Health Checks) ---

app.get('/health', async (req, res) => {
  try {
    // تست اتصال به دیتابیس با یک کوئری ساده
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'OK', 
      message: 'Server is running and connected to PostgreSQL' 
    });
  } catch (error) {
    console.error("Health Check Error:", error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed' 
    });
  }
});

// مدیریت خطاهای عمومی برای جلوگیری از کرش کردن سرور
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong on the server!' 
  });
});

// شروع به کار سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(` Database: PostgreSQL (via Prisma)`);
  console.log(`==========================================`);
});
