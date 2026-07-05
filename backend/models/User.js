// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // شناسه منحصر به فرد کاربر در شبکه Pi (بسیار مهم برای شناسایی کاربر)
  piUserId: {
    type: String,
    required: true,
    unique: true, // جلوگیری از ایجاد کاربر تکراری برای یک ID واحد
    trim: true
  },
  // نام کاربری نمایش داده شده در اپلیکیشن شما
  username: {
    type: String,
    required: true,
    unique: true, // اگر می‌خواهید نام‌های کاربری در اپ شما هم یکتا باشند
    trim: true,
    default: 'Pi User'
  },
  // نقش کاربر (مثلاً user یا admin) برای مدیریت دسترسی‌ها
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // آدرس کیف پول (اگر نیاز دارید تراکنش‌ها را مدیریت کنید)
  piWalletAddress: {
    type: String,
    default: ''
  },
  // سایر فیلدها در صورت نیاز
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ایجاد ایندکس برای جستجوی سریع‌تر بر اساس piUserId
userSchema.index({ piUserId: 1 });

module.exports = mongoose.model('User', userSchema);
