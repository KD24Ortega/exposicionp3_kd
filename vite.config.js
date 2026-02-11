import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'maskable-192.png', 'maskable-512.png'],
      manifest: {
        name: 'GastoZen',
        short_name: 'GastoZen',
        description: 'Tus gastos e ingresos, claros y al día. Funciona sin internet e instalable.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d6efd',
        shortcuts: [
          {
            name: 'Nuevo gasto',
            short_name: 'Nuevo gasto',
            description: 'Abrir directo para registrar un gasto.',
            url: '/?action=new&type=EXPENSE',
            icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html'
      }
    })
  ]
})
