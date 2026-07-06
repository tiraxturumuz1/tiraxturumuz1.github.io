// backend/test-db.js
require('dotenv').config(); // برای خواندن فایل .env
const mongoose = require('mongoose');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ خطا: DATABASE_URL در فایل .env پیدا نشد!");
  process.exit(1);
}

console.log("⏳ در حال تلاش برای اتصال به MongoDB...");
console.log("🔗 رشته اتصال استفاده شده:", dbUrl.split('@')[1]); // برای امنیت، فقط بخش آدرس را نشان می‌دهد

mongoose.connect(dbUrl)
  .then(() => {
    console.log("✅ موفقیت‌آمیز! اتصال به دیتابیس برقرار شد.");
    console.log("🚀 حالا می‌توانید سرور اصلی خود را با خیال راحت اجرا کنید.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ خطا در اتصال به دیتابیس:");
    console.error(err.message);
    console.log("\n💡 نکته: اگر خطا مربوط به Authentication بود، نام کاربری را در .env چک کنید.");
    process.exit(1);
  });
