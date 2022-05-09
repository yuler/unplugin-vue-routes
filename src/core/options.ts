import {Options, ResolvedOptions} from '../types'
import createDebuger from 'debug'

export function resolveOptions(options?: Options): ResolvedOptions {
  const defaultOptions: ResolvedOptions = {
    pages: 'src/pages',
    extensions: ['vue', 'ts', 'js'],
    ignore: [],
    output: 'src/router/routes.ts',
  }

  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  }

  createDebuger('unplugin-vue-pages:options')(resolvedOptions)

  return resolvedOptions
}
