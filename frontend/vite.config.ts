import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // برای مخزن‌هایی که نامشان tiraxturumuz1.github.io است، base باید '/' باشد
  base: '/', 
  plugins: [react()],
  resolve: {
    alias: {
      // این بخش کمک می‌کند در کدها به جای آدرس‌های طولانی، از @ استفاده کنید
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // تنظیمات مربوط به خروجی نهایی
    outDir: 'dist',
    assetsDir: 'assets', // تمام فایل‌های CSS و JS در این پوشه قرار می‌گیرند
    sourcemap: false,
    rollupOptions: {
      output: {
        // این بخش باعث می‌شود نام فایل‌ها برای کش شدن بهتر مدیریت شود
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
