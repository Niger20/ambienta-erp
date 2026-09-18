import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // El build va directo al public/ del backend
    outDir: path.resolve(__dirname, '../api/public'),
    emptyOutDir: true,
  },
  server: {
    // En desarrollo: redirige /api/* al backend para evitar CORS
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      }
    },
  },
})
