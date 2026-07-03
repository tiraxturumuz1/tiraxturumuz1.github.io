import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * تنظیمات بسیار حیاتی برای GitHub Pages:
   * چون سایت شما در مسیر روت اصلی نیست و در یک زیرشاخه (Sub-directory) قرار دارد،
   * باید مقدار base را دقیقاً مطابق با نام مخزن (Repository Name) قرار دهید.
   * در اینجا نام مخزن شما 'daotest.github.io' است.
   */
  base: '/daotest.github.io/', 

  plugins: [react()],

  build: {
    /**
     * تنظیمات مربوط به خروجی نهایی (Build)
     */
    outDir: 'dist', // پوشه‌ای که فایل‌های نهایی در آن ساخته می‌شوند
    emptyOutDir: true, // پاک کردن پوشه dist قبل از ساخت فایل‌های جدید
    sourcemap: false, // غیرفعال کردن sourcemap برای کاهش حجم فایل‌ها در حالت تولید
  },

  server: {
    /**
     * تنظیمات مربوط به محیط توسعه (Local Development)
     * وقتی روی سیستم خودتان دستور npm run dev را می‌زنید
     */
    port: 5173,
    open: true, // باز کردن خودکار مرورگر هنگام شروع سرور
    strictPort: true,
  },

  resolve: {
    /**
     * تنظیمات مربوط به شناسایی مسیرها (Alias)
     * این کار باعث می‌شود در کدنویسی به جای استفاده از مسیرهای طولانی مثل ../../ 
     * بتوانید از مسیرهای ساده‌تر استفاده کنید.
     */
    alias: {
      '@': '/src',
    },
  },
});
