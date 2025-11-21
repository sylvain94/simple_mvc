import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

const apiBaseUrl = process.env.VITE_API_URL || 'https://192.168.1.141:8443';

// Configuration du logging syslog
const LOG_DIR = '/opt/mediahubws/logs/mediahubws-admin';
const LOG_FILE = path.join(LOG_DIR, 'proxy.log');

// Créer le répertoire de logs s'il n'existe pas
try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
} catch (error) {
  console.warn('⚠️ Impossible de créer le répertoire de logs:', error.message);
}

// Fonction de logging au format syslog
const logToSyslog = (level, facility, message, additionalData = {}) => {
  const timestamp = new Date().toISOString();
  const hostname = process.env.HOSTNAME || 'mediahub-proxy';
  const appName = 'vite-proxy';
  const procId = process.pid;
  
  // Format syslog: <priority>timestamp hostname app-name[proc-id]: message
  // Priority = facility * 8 + severity
  const priorities = {
    'emergency': 0, 'alert': 1, 'critical': 2, 'error': 3,
    'warning': 4, 'notice': 5, 'info': 6, 'debug': 7
  };
  
  const priority = (facility * 8) + (priorities[level] || 6);
  const syslogMessage = `<${priority}>${timestamp} ${hostname} ${appName}[${procId}]: ${message}`;
  
  // Ajouter les données supplémentaires si présentes
  let fullMessage = syslogMessage;
  if (Object.keys(additionalData).length > 0) {
    fullMessage += ` | ${JSON.stringify(additionalData)}`;
  }
  
  try {
    fs.appendFileSync(LOG_FILE, fullMessage + '\n');
  } catch (error) {
    // Fallback vers console si l'écriture fichier échoue
    console.log('📝 PROXY LOG:', fullMessage);
    console.warn('⚠️ Erreur écriture log:', error.message);
  }
};

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
            const errorMessage = `Proxy error for ${req.method} ${req.url}`;
            logToSyslog('error', 16, errorMessage, {
              method: req.method,
              url: req.url,
              error: err.message,
              target: options.target + req.url
            });
            console.log('🔴 Proxy error:', err);
          });
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const requestMessage = `Proxying request ${req.method} ${req.url}`;
            logToSyslog('info', 16, requestMessage, {
              method: req.method,
              url: req.url,
              target: options.target + req.url,
              headers: req.headers,
              userAgent: req.headers['user-agent'],
              remoteAddress: req.connection?.remoteAddress || req.socket?.remoteAddress
            });
            console.log('🔄 Proxying request:', req.method, req.url, '→', options.target + req.url);
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const responseMessage = `Proxy response ${proxyRes.statusCode} for ${req.method} ${req.url}`;
            const logLevel = proxyRes.statusCode >= 400 ? 'warning' : 'info';
            
            logToSyslog(logLevel, 16, responseMessage, {
              method: req.method,
              url: req.url,
              statusCode: proxyRes.statusCode,
              statusMessage: proxyRes.statusMessage,
              responseHeaders: proxyRes.headers,
              contentLength: proxyRes.headers['content-length'],
              contentType: proxyRes.headers['content-type'],
              duration: Date.now() - req._startTime
            });
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
          });
          
          // Capturer le timestamp de début de requête
          proxy.on('proxyReq', (proxyReq, req, res) => {
            req._startTime = Date.now();
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
