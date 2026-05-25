import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Replit serves the preview over a proxied host; allowedHosts keeps HMR/preview happy.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Sakina — Adhkar & Duʼa',
        short_name: 'Sakina',
        description:
          'A calm, ad-free companion for morning & evening adhkar, duʼa, and dhikr. Works offline. No ads, no tracking.',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#0e6b54',
        background_color: '#f1ebdf',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        prefer_related_applications: false,
        categories: ['lifestyle', 'education', 'books'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          { src: 'screenshots/home.png', sizes: '1170x2532', type: 'image/png', form_factor: 'narrow', label: 'Home — salam and today’s remembrance' },
          { src: 'screenshots/adhkar.png', sizes: '1170x2532', type: 'image/png', form_factor: 'narrow', label: 'Morning & evening adhkar' },
          { src: 'screenshots/tasbih.png', sizes: '1170x2532', type: 'image/png', form_factor: 'narrow', label: 'Tasbih counter' },
        ],
        shortcuts: [
          { name: 'Morning & evening adhkar', short_name: 'Adhkar', url: '/?tab=adhkar', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Tasbih counter', short_name: 'Tasbih', url: '/?tab=tasbih', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Duʼa', short_name: 'Duʼa', url: '/?tab=duas', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }] },
        ],
      },
      workbox: {
        // All content is local JSON, so a precache of the build is fully offline-capable.
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
})
