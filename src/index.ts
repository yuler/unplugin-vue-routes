import fs from 'node:fs'
import {createUnplugin} from 'unplugin'
import {createFilter} from '@rollup/pluginutils'
import chokidar from 'chokidar'
import type {Options, ResolvedOptions} from './types'
import {generateRoutes} from './core/routes'
import {throttle} from './core/utils'

export default createUnplugin<Options>((options = {}) => {
  // TODO: options.pages
  const defaultOptions = {
    pages: 'src/pages',
    output: 'src/router/routes.ts',
  }

  const resolvedOptions: ResolvedOptions = {
    ...defaultOptions,
    ...options,
  }

  const include = [/\.vue$/, /\.vue\?vue/]
  const exclude = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
  const filter = createFilter(include, exclude)

  const generateRoutesFile = throttle(() => {
    console.log('Write routes file...')
    fs.writeFileSync(
      resolvedOptions.output,
      generateRoutes(resolvedOptions.pages),
      'utf-8',
    )
  }, 500)

  return {
    name: 'unplugin-vue-routes',
    enforce: 'post',
    transformInclude(id) {
      return filter(id)
    },
    // transform(code, id) {
    //   console.log(code, id)
    //   return null
    // },

    vite: {
      configResolved(config) {
        generateRoutesFile()

        if (
          config.command === 'serve' ||
          (config.command === 'build' && config.build.watch)
        ) {
          const watcher = chokidar.watch(resolvedOptions.pages)
          watcher.on('unlink', _ => {
            generateRoutesFile()
          })
          watcher.on('add', _ => {
            generateRoutesFile()
          })
        }
      },
    },
  }
})
