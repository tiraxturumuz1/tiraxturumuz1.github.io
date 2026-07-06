// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/', 
  plugins: [react()],
  resolve: {
    alias: {
      // این خط باعث می‌شود @ در کدها به پوشه src اشاره کند
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
  server: {
    port: 5173,
    host: true, // اجازه می‌دهد در شبکه محلی و Docker در دسترس باشد
    open: true,
  },
})
