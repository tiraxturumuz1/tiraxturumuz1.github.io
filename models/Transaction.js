// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // شناسه ای که سرور برای پیگیری سفارش ایجاد می کند
  orderId: { 
    type: String, 
    // unique: true // اگر بخواهیم یکتا باشد، باید موقع ایجاد مطمئن شویم تکراری نیست
  },
  // شناسه تراکنش در شبکه Pi (بعد از تکمیل)
  txid: { 
    type: String, 
    // unique: true // این شناسه باید حتما یکتا باشد
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
    productId: String // بهتر است شناسه عددی محصول را هم اینجا نگه داریم
  },
  // وضعیت تراکنش
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED'], 
    default: 'PENDING' // پیش‌فرض باید PENDING باشد
  },
  // زمان انجام تراکنش
}, { timestamps: true }); // timestamps به طور خودکار createdAt و updatedAt را اضافه می کند

module.exports = mongoose.model('Transaction', transactionSchema);
