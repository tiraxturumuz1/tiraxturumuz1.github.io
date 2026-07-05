// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// مسیر احراز هویت با Pi Network
router.post('/pi-login', async (req, res) => {
  const { pi_user_id, username } = req.body;

  if (!pi_user_id) {
    return res.status(400).json({ success: false, message: 'Pi User ID الزامی است' });
  }

  try {
    // ۱. بررسی اینکه آیا کاربر قبلاً وجود دارد یا خیر
    let user = await User.findOne({ piUserId: pi_user_id });

    if (!user) {
      // ۲. اگر وجود نداشت، کاربر جدید بساز
      user = new User({
        piUserId: pi_user_id,
        username: username || 'PiUser', // استفاده از نام کاربری پیش‌فرض در صورت نبودن
        role: 'user'
      });
      await user.save();
    }

    // ۳. ایجاد توکن JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || '7d' }
    );

    // ۴. پاسخ موفقیت‌آمیز
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Pi Login Error:', error);
    res.status(500).json({ success: false, message: 'خطا در فرآیند احراز هویت شبکه Pi' });
  }
});

module.exports = router;
