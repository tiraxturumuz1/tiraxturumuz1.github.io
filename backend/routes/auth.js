// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

/**
 * @route   POST /api/auth/pi-login
 * @desc    احراز هویت با استفاده از شناسه کاربر شبکه Pi
 */
router.post('/pi-login', async (req, res) => {
  const { pi_user_id, username } = req.body;

  if (!pi_user_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Pi User ID الزامی است' 
    });
  }

  try {
    // ۱. جستجو در PostgreSQL با استفاده از Prisma
    let user = await prisma.user.findUnique({
      where: { piUserId: pi_user_id }
    });

    if (!user) {
      // ۲. اگر کاربر جدید است، ایجاد کاربر در دیتابیس جدید
      console.log(`[Auth] New user detected: ${pi_user_id}. Creating account...`);
      user = await prisma.user.create({
        data: {
          piUserId: pi_user_id,
          username: username || `PiUser_${pi_user_id.substring(0, 5)}`,
          role: 'user'
        }
      });
    } else {
      console.log(`[Auth] Existing user login: ${user.username}`);
    }

    // ۳. ایجاد توکن JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, // در Prisma معمولاً فیلد id است نه _id
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION || '7d'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
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
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // در middleware، مقدار id را در req.user قرار داده‌ایم
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'کاربر یافت نشد' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
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
