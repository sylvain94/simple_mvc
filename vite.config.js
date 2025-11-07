import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const apiBaseUrl = process.env.VITE_API_URL || 'https://192.168.1.141:8443';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080, // Changé pour correspondre à votre port actuel
    host: true,
    https: false,
    // Configuration proxy pour résoudre les problèmes CORS
    proxy: {
      '/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        secure: false, // Accepte les certificats auto-signés
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxying request:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  preview: {
    port: 8080,
    host: true,
    // Même configuration proxy pour le mode preview
    proxy: {
      '/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
