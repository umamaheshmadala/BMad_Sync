import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import open from 'open'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'open-chrome-incognito',
      configureServer(server) {
        let opened = false
        const url = 'http://localhost:5173/'
        server.httpServer?.once('listening', () => {
          if (opened) return
          opened = true
          const launch = async () => {
            try {
              await open(url, { app: { name: 'chrome', arguments: ['--incognito'] } })
            } catch {
              try {
                await open(url, { app: { name: 'google chrome', arguments: ['--incognito'] } })
              } catch {
                await open(url)
              }
            }
          }
          void launch()
        })
      },
    },
  ],
  optimizeDeps: {
    include: ['react-router-dom'],
  },
  server: {
    open: false, // Do not auto-open via Vite; handled by plugin above
  },
})
