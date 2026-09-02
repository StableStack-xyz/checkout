import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  resolve: { alias: { '#': '/src' } },
  plugins: [
    tanstackRouter({ target: 'react', routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
    tailwindcss(),
    viteReact(),
  ],
  server: {
    port: 3100,
    proxy: {
      '/api/checkout': {
        target: process.env.VITE_CHECKOUT_BASE_URL || 'http://localhost:5005',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/checkout/, ''),
      },
    },
  },
})