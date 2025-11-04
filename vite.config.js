import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const apiBaseUrl = process.env.VITE_API_URL || 'https://192.168.1.141:8443';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // Port par défaut de Vite (non-privilégié)
    host: true,
    https: false, // Changez à true si vous voulez HTTPS en dev (nécessite certificats)
    // Configuration to handle HTTPS requests to your backend
    proxy: {
      '/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
