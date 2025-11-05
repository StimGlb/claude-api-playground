import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // ✅ Pointe vers votre serveur Node.js
        changeOrigin: true,
        secure: false
      }
    }
  }
})