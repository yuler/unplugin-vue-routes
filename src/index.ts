import {createUnplugin} from 'unplugin'
import type {Options} from './types'
import chokidar from 'chokidar'
import {PageContext} from './core/context'

export default createUnplugin<Options>(options => {
  const ctx = new PageContext(options)

  return {
    name: 'unplugin-vue-routes',
    enforce: 'pre',

    transformInclude(id) {
      return ctx.glob().includes(id)
    },

    transform(code, id) {
      ctx.generateRoutes()
      return null
    },

    vite: {
      configResolved(config) {
        if (config.build.watch && config.command === 'build')
          ctx.setupWatcher(chokidar.watch(ctx.glob()))
      },
      configureServer(server) {
        ctx.setupViteServer(server)
      },
    },
  }
})
