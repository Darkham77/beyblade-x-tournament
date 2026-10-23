import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  plugins: [
    {
      name: 'serve-onnx-wasm-raw',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/onnx/')) {
            const cleanUrl = req.url.split('?')[0];
            const filePath = path.resolve(__dirname, 'public' + cleanUrl);
            if (fs.existsSync(filePath)) {
              const ext = path.extname(filePath);
              if (ext === '.wasm') res.setHeader('Content-Type', 'application/wasm');
              if (ext === '.mjs' || ext === '.js') res.setHeader('Content-Type', 'application/javascript');
              res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
              res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
    },
    react(),
    tailwindcss(),
  ],
})
