import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function apiHandlerPlugin(): Plugin {
  return {
    name: 'api-handler-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]

        if (
          url === '/api/students' ||
          url === '/api/settings' ||
          url === '/api/create-checkout-session' ||
          url === '/api/verify-payment'
        ) {
          const wrappedRes = res as any
          if (!wrappedRes.status) {
            wrappedRes.status = (code: number) => {
              wrappedRes.statusCode = code
              return wrappedRes
            }
          }
          if (!wrappedRes.json) {
            wrappedRes.json = (data: any) => {
              wrappedRes.setHeader('Content-Type', 'application/json')
              wrappedRes.end(JSON.stringify(data))
            }
          }

          try {
            if (url === '/api/students') {
              // @ts-ignore
              const { default: studentsHandler } = await import('./api/students.js')
              await studentsHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/settings') {
              // @ts-ignore
              const { default: settingsHandler } = await import('./api/settings.js')
              await settingsHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/create-checkout-session') {
              // @ts-ignore
              const { default: checkoutHandler } = await import('./api/create-checkout-session.js')
              await checkoutHandler(req as any, wrappedRes)
              return
            }
            if (url === '/api/verify-payment') {
              // @ts-ignore
              const { default: verifyHandler } = await import('./api/verify-payment.js')
              await verifyHandler(req as any, wrappedRes)
              return
            }
          } catch (err: any) {
            console.error(`Error handling ${url}:`, err)
            wrappedRes.statusCode = 500
            wrappedRes.setHeader('Content-Type', 'application/json')
            wrappedRes.end(JSON.stringify({ error: err.message || 'Internal Server Error' }))
            return
          }
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiHandlerPlugin()],
})
