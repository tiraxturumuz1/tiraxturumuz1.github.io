
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware برای احراز هویت کاربران عادی (JWT)
 * این میدل‌ور برای محافظت از مسیرهای کاربر و دریافت اطلاعات پروفایل استفاده می‌شود.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // ساختار هدر باید به صورت 'Bearer <TOKEN>' باشد
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access Denied: No Token Provided. Please login first.' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or Expired Token' 
            });
        }
        
        // در اینجا decodedPayload حاوی اطلاعاتی است که در routes/auth.js در jwt.sign قرار دادیم
        // یعنی: { id: user.id, role: user.role }
        req.user = decodedPayload; 
        next();
    });
};

/**
 * Middleware برای محافظت از مسیرهای ادمین
 * بررسی می‌کند که آیا هدر مخصوص ادمین (x-admin-key) با مقدار تعریف شده در .env مطابقت دارد یا خیر.
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
