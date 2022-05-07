import path from 'node:path'
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
    routes.push(
      `
  {
    path: '${route.path}',
    name: '${route.name}',
    component: () => import('${route.componentImport}'),
  }
`.trim(),
    )
  }

  return template(routes)
}

function template(routes: string[]): string {
  return `
import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  ${routes.join(',\n  ')}
]

export default routes
`.trimStart()
}

function resolveRoute(filepath: string) {
  const extname = path.extname(filepath)
  const segments = filepath.slice(0, -extname.length).split(path.sep)

  // Resolve route path.
  const paths: string[] = []
  const names: string[] = []
  for (let segment of segments) {
    segment = segment.toLowerCase()
    let path_ = segment
    let name = segment
    if (segment === 'index') {
      name = ''
      path_ = ''
    } else if (/^\[\[(.*)\]\]$/.test(segment)) {
      name = segment.slice(2, -2)
      path_ = `:${name}?`
    } else if (/^\[(.*)\]$/.test(segment)) {
      name = segment.slice(1, -1)
      path_ = `:${name}`
    } else if (/^\[\.\.\.(.*)\]\]$/.test(segment)) {
      name = segment.slice(4, -1)
      path_ = `:${name}*`
    }

    names.push(name)
    paths.push(path_)
  }

  const route: Route = {
    path: leadingSlash(paths.join('/')),
    name: pascalize(names.join('-')),
    componentImport: `@/pages/${filepath}`,
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
