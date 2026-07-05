// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ۱. ثبت‌نام کاربر جدید
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // چک کردن اینکه کاربر قبلاً ثبت نام نکرده باشد
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'کاربر با این ایمیل وجود دارد' });

    user = await User.findOne({ username });
    if (user) return res.status(400).json({ success: false, message: 'این نام کاربری رزرو شده است' });

    // هش کردن پسورد (امنیت بالا)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ذخیره کاربر
    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // تولید توکن برای لاگین خودکار بعد از ثبت‌نام
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION || '7d'
    });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطای سرور در هنگام ثبت‌نام' });
  }
});

// ۲. ورود کاربر
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // پیدا کردن کاربر
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'ایمیل یا پسورد اشتباه است' });

    // چک کردن پسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'ایمیل یا پسورد اشتباه است' });

    // تولید توکن
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION || '7d'
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطای سرور در هنگام ورود' });
  }
});

module.exports = router;
