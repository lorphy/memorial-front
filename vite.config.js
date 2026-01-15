import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    proxy: {
      '/api': {
        target: 'https://memorial-backend-xl42.onrender.com',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://memorial-backend-xl42.onrender.com',
        changeOrigin: true
      }
    }
  }
})
