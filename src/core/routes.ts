import path, {format, normalize} from 'node:path'
import fg from 'fast-glob'
import {leadingSlash, pascalize} from './utils'

export function generateRoutes(pages: string) {
  // `Style`: `nested`
  const patterns = ['**/*.vue']

  // TODO: `Style`: `flat`
  // const patterns = ['*./*.layout.vue', '*/*.route.vue', '!*./*.route.vue']

  const files = fg.sync(patterns, {
    cwd: pages,
    onlyFiles: true,
  })

  const routes: string[] = []

  for (const file of files) {
    const route = resolveRoute(file)
    routes.push(`
    {
      path: '${route.path}',
      name: '${route.name}',
      component: () => import('${route.componentImport}'),
    }
    `)
  }

  return template(routes)
}

function template(routes: string[]): string {
  return `
import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  ${routes.join(',')}
]

export default routes

`.trimStart()
}

function resolveRoute(file: string) {
  // const _path = leadingSlash(file)

  const segments = file.split(path.delimiter)
  const extname = path.extname(file)
  const dirname = path.dirname(file)
  const filename = path.basename(file, extname)

  if (filename.toUpperCase() === 'index') {
    // filename = '/'
  } else if (filename.startsWith('$')) {
    // filename = `:${filename.slice(1)}`
  }

  const path_ = leadingSlash(path.join(dirname, filename).toLowerCase())
  const name = path.join(dirname)

  const route: Route = {
    path: path_,
    name: pascalize(path_.split('/').join('-')),
    componentImport: `@/pages/${file}`,
  }

  return route
}

interface Route {
  path: string
  name: string
  componentImport: string
  redirect?: string
  alias?: string
  props?: object
  meta?: object
  children?: Route[]
}
