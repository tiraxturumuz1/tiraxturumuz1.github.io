// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // چون پروژه روی دامنه اصلی است، حتما از '/' استفاده کنید.
  // این کار از خطای 404 در لود شدن فایل‌های JS و CSS جلوگیری می‌کند.
  base: '/', 

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
      output: {
        // تنظیمات برای مدیریت بهتر نام فایل‌ها و جلوگیری از تداخل کش مرورگر با استفاده از Hash
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },

  server: {
    // تنظیمات سرور توسعه برای دسترسی در شبکه (مفید برای تست با گوشی یا Docker)
    port: 5173,
    host: true, // اجازه می‌دهد با IP سیستم هم به پروژه دسترسی داشته باشید
    open: true, // به محض اجرای دستور، مرورگر را باز می‌کند
  },
})
