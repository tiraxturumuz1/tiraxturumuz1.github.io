const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // شناسه تراکنش که از شبکه Pi می‌گیریم (اثبات بلاکچینی)
  piTransactionId: { 
    type: String, 
    required: true, 
    unique: true // جلوگیری از ثبت دوباره یک تراکنش تکراری
  },
  // مبلغ پرداخت شده
  amount: { 
    type: Number, 
    required: true 
  },
  // واحد پول (مثلاً PI)
  currency: { 
    type: String, 
    default: 'PI' 
  },
  // اطلاعات کاربر (اگر کاربر لاگین کرده باشد)
  userId: { 
    type: String, 
    default: 'guest' 
  },
  // جزئیات اضافی از سمت فرانت‌اِند (مثلاً چه محصولی خریده)
  metadata: {
    productName: String,
    orderId: String
  },
  // وضعیت تراکنش
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  },
  // زمان انجام تراکنش
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
