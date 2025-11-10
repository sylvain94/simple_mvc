#!/usr/bin/env node

/**
 * Simple proxy server to resolve CORS problems
 * Redirect requests from http://localhost:8080/api to https://192.168.1.141:8443/api
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8080;
const API_TARGET = 'https://192.168.1.141:8443';

// Configuration of the proxy for API requests
const apiProxy = createProxyMiddleware('/api', {
  target: API_TARGET,
  changeOrigin: true,
  secure: false, // Accept self-signed certificates
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying: ${req.method} ${req.url} → ${API_TARGET}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Response: ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('🔴 Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
});

// Use the proxy for all /api requests
app.use(apiProxy);

// Serve static files (build of the application)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA routes (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API requests will be proxied to ${API_TARGET}`);
  console.log(`📁 Static files served from dist/ directory`);
});

