import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/daotest.github.io/', // <--- حتماً نام دقیق مخزن خود را اینجا بنویسید
  build: {
    outDir: 'dist',
  }
})
