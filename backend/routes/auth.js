// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/pi-login
 * @desc    احراز هویت با استفاده از شناسه کاربر شبکه Pi
 * @access  Public
 * @body    { pi_user_id: string, username: string (optional) }
 */
router.post('/pi-login', async (req, res) => {
  const { pi_user_id, username } = req.body;

  // ۱. اعتبارسنجی ورودی اولیه
  if (!pi_user_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Pi User ID الزامی است' 
    });
  }

  try {
    // ۲. بررسی اینکه آیا کاربر قبلاً در دیتابیس ثبت شده است یا خیر
    let user = await User.findOne({ piUserId: pi_user_id });

    if (!user) {
      // ۳. اگر کاربر جدید است، یک اکانت برای او ایجاد کن
      console.log(`[Auth] New user detected: ${pi_user_id}. Creating account...`);
      user = new User({
        piUserId: pi_user_id,
        username: username || `PiUser_${pi_user_id.substring(0, 5)}`, // اگر نامی نفرستاد، یک نام موقت بساز
        role: 'user'
      });
      await user.save();
    } else {
      console.log(`[Auth] Existing user login: ${user.username} (${pi_user_id})`);
    }

    // ۴. ایجاد توکن JWT (با استفاده از کلید امن از فایل .env)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || '7d' }
    );

    // ۵. ارسال پاسخ موفقیت‌آمیز شامل توکن و اطلاعات کاربر
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        piUserId: user.piUserId
      }
    });

  } catch (error) {
    console.error('❌ Pi Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در فرآیند احراز هویت شبکه Pi' 
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    دریافت اطلاعات کاربر فعلی بر اساس توکن ارسالی
 * @access  Private
 * @note    این مسیر برای حل مشکل رفرش صفحه در فرانت‌اِند حیاتی است.
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // req.user.id از طریق middleware authenticateToken پر شده است
    const user = await User.findById(req.user.id).select('-__v');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'کاربر یافت نشد' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        piUserId: user.piUserId
      }
    });
  } catch (error) {
    console.error('❌ Get Me Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در دریافت اطلاعات کاربری' 
    });
  }
});

module.exports = router;
