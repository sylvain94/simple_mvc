import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Configuration pour gérer les requêtes HTTPS vers votre backend
    proxy: {
      '/api': {
        target: 'https://localhost:8443',
        changeOrigin: true,
        secure: false, // Ignorer les certificats SSL auto-signés en développement
        rewrite: (path) => path // Garder le préfixe /api
      }
    }
  }
})
