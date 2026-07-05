const jwt = require('jsonwebtoken');

/**
 * Middleware برای احراز هویت کاربران عادی (JWT)
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access Denied: No Token Provided. Please login first.' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or Expired Token' 
            });
        }
        req.user = user; // اطلاعات کاربر (مثل piUserId) به درخواست اضافه می‌شود
        next();
    });
};

/**
 * Middleware برای محافظت از مسیرهای ادمین
 * بررسی می‌کند که آیا هدر مخصوص ادمین ارسال شده یا خیر
 */
const authenticateAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    
    if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: 'Forbidden: Unauthorized Admin Access' 
        });
    }
};

module.exports = { authenticateToken, authenticateAdmin };
