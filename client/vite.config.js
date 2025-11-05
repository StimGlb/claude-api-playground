import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://opulent-sniffle-xjjj45rrpj73p6w4-3001.app.github.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})