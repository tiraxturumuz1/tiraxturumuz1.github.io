// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middlewareها
app.use(express.json());
app.use(cors());

// --- تعریف مسیرهای API ---

// نکته: مطمئن شوید در فایل‌های auth.js و payment.js 
// به جای require('../models/User') از استفاده مستقیم از prisma استفاده می‌کنید.
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// --- مسیر تست سلامت (Health Check) ---

app.get('/health', async (req, res) => {
  try {
    // تست اتصال به PostgreSQL با یک کوئری ساده
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'OK', 
      message: 'Server is running and connected to PostgreSQL via Prisma' 
    });
  } catch (error) {
    console.error("Database Connection Error:", error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed. Check your DATABASE_URL in .env' 
    });
  }
});

// مدیریت خطاهای عمومی
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
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
  console.log(`✅ Database: PostgreSQL (Prisma ORM)`);
  console.log(`==========================================`);
});

// بستن اتصال Prisma هنگام خاموش شدن سرور
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
