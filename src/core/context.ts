import fs, {FSWatcher} from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import Debug from 'debug'
import {Options, ResolvedOptions} from '../types'
import {resolveOptions} from './options'
import {generateCode} from './generator'
import {throttle} from './utils'
import type {ViteDevServer} from 'vite'

const debug = Debug('unplugin-vue-routes:context')

export class PageContext {
  options: ResolvedOptions

  private _server: ViteDevServer | undefined

  constructor(options?: Options) {
    this.options = resolveOptions(options)
    this.generateRoutes = throttle(this.generateRoutes.bind(this), 500)
  }

  glob() {
    const {extensions, ignore, pages} = this.options
    const files = fg.sync(`**/*.{${extensions.join(',')}}`, {
      ignore: ['node_modules', '.git', ...ignore],
      cwd: path.resolve(process.cwd(), pages),
      onlyFiles: true,
      absolute: true,
    })

    debug('glob', files)

    return files
  }

  async generateRoutes() {
    debug('generate routes')
    const code = await generateCode(this.options)
    fs.writeFileSync(this.options.output, code, 'utf-8')
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server) return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: FSWatcher) {
    watcher.on('unlink', _ => {
      this.generateRoutes()
    })
    watcher.on('add', _ => {
      this.generateRoutes()
    })
    watcher.on('chnage', _ => {
      this.generateRoutes()
    })
  }
}
