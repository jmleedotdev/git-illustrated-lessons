import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// A separate dev-server entry: never a route or import in the production app graph.
function designShowcase(): Plugin {
  return {
    name: 'development-design-showcase',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/__design' && path !== '/__design/') return next()

        try {
          const html = await server.transformIndexHtml(
            '/__design/',
            `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Git visual notes / shared foundations</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/dev/main.ts"></script>
  </body>
</html>`,
          )
          res.setHeader('Content-Type', 'text/html')
          res.end(html)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), vueDevTools(), designShowcase()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
