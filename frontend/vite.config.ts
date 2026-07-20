import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // بارگذاری متغیرهای محیطی از فایل .env بر اساس mode (development یا production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // تغییر از '/' به './' برای حل مشکل صفحه سفید در GitHub Pages
    base: './', 

    plugins: [react()],

    resolve: {
      alias: {
        // تنظیم Alias برای استفاده راحت‌تر از @ در پروژه‌های React
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // پوشه خروجی نهایی
      outDir: 'dist',
      // پوشه مربوط به فایل‌های استاتیک مثل عکس‌ها و فونت‌ها
      assetsDir: 'assets',
      // غیرفعال کردن sourcemap برای کاهش حجم فایل‌های نهایی در حالت Production
      sourcemap: false,
      rollupOptions: {
        // تنظیمات برای مدیریت بهتر نام فایل‌ها و جلوگیری از تداخل کش مرورگر با استفاده از Hash
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },

    server: {
      // استفاده از پورت تعریف شده در فایل .env (مثلاً VITE_PORT=5000)
      // اگر در .env چیزی تعریف نشده باشد، پیش‌فرض روی 5173 قرار می‌گیرد
      port: parseInt(env.VITE_PORT || '5173'),
      
      // بسیار مهم برای Docker: اجازه دادن به دسترسی از طریق IP و شبکه کانتینرها
      host: true, 
      
      // تنظیم strictPort برای جلوگیری از پرش خودکار به پورت دیگر در صورت اشغال بودن پورت اصلی
      strictPort: true,

      // به محض اجرای دستور، مرورگر را باز می‌کند (اختیاری)
      open: true,
    },
  }
})
