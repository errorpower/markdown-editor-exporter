import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 7812,
    proxy: {
      '/api': {
        target: 'http://localhost:7813',
        changeOrigin: true,
      },
    },
  },
})
