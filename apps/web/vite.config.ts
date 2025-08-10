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
        server.httpServer?.once('listening', () => {
          if (opened) return
          opened = true
          // Resolve the actual port Vite selected (in case 5173 was taken)
          const address = server.httpServer!.address()
          // address can be string or AddressInfo
          const port = typeof address === 'object' && address && 'port' in address ? (address as any).port : (server.config.server?.port ?? 5173)
          const url = `http://localhost:${port}/`
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
    // Force using 5173 for Playwright expectations
    port: 5173,
    strictPort: true,
  },
})
