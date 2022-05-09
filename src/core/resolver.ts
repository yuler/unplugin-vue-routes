import path from 'node:path'
import fg from 'fast-glob'
import prettier from 'prettier'
import {ResolvedOptions} from '../types'

export type ResolverPagesOptions = Omit<ResolvedOptions, 'output'>

/**
 * Resolve valid pages
 */
export async function resolvePages({
  pages,
  extensions,
  ignore,
}: ResolverPagesOptions) {
  return await fg(`**/*.{${extensions.join(',')}}`, {
    ignore: ['node_modules', '.git', ...ignore],
    cwd: path.resolve(process.cwd(), pages),
    onlyFiles: true,
  })
}

export interface Route {
  name: string
  path: string
  component: string
  redirect?: string
  alias?: string
  props?: object
  meta?: object
  children?: Route[]
}

// TODO: style: 'nesting' | 'flat' = 'nesting',
export async function resolveRoutes(options: ResolvedOptions) {
  const files = await resolvePages(options)
  const routes: Route[] = []

  for (const file of files) {
    const segments = file
      .replace(new RegExp(`\\.(${options.extensions.join('|')})$`), '')
      .split('/')

    const route: Route = {
      name: '',
      path: '',
      component: `/${file}`,
    }

    let parent = routes

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i] as string
      // Square brackets
      const isDynamic = /^\[.+\]$/.test(segment)
      const normalized = (
        isDynamic
          ? segment.replace(/^\[(\.{3})?/, '').replace(/\]$/, '')
          : segment
      ).toLowerCase()

      route.name += route.name ? `-${normalized}` : normalized

      const child = parent.find(parentRoute => parentRoute.name === route.name)

      if (child) {
        child.children = child.children || []
        parent = child.children
        route.path = ''
      } else if (normalized === 'index' && !route.path) {
        route.path += '/'
      } else if (normalized !== 'index') {
        if (isDynamic) {
          route.path += `/:${normalized}`

          // Catch-all route
          if (/^\[\.{3}/.test(segment)) {
            route.path += '(.*)'
          } else if (i === segments.length - 1) {
            route.path += '?'
          }
        } else {
          route.path += `/${normalized}`
        }
      }
    }

    parent.push(route)
  }

  return normalizeRoutes(routes)
}

function normalizeRoutes(routes: Route[], parent?: Route) {
  for (const route of routes) {
    route.name = route.name.replace(/-index$/, '')

    if (parent) route.path = route.path.replace(/^\//, '').replace(/\?$/, '')

    if (route.children) {
      route.children = normalizeRoutes(route.children, route)
    }
  }
  return routes
}

export async function stringifyRoutes(routes: Route[]) {
  let options = {}
  // Try load prettier config
  try {
    const configFile = await prettier.resolveConfigFile()
    options = (await prettier.resolveConfig(configFile!)) || {}
  } catch {}

  return prettier.format(
    `
    import type {RouteRecordRaw} from 'vue-router'

    const routes: RouteRecordRaw[] = [
      ${routes.map(route => stringifyRoute(route)).join(',\n')}
    ]

    export default routes`,
    options,
  )
}

function stringifyRoute(route: Route): string {
  const properties = []

  for (const [key, value] of Object.entries(route)) {
    if (key === 'component') {
      properties.push(`${key}: () => import('@/pages${value}')`)
    } else if (key === 'meta') {
      properties.push(`${key}: ${JSON.stringify(value)}`)
    } else if (key === 'children' && route.children?.length) {
      properties.push(
        `${key}: [ ${route.children.map(route => stringifyRoute(route))}, \n ]`,
      )
    } else {
      properties.push(`${key}: '${value}'`)
    }
  }

  return `{${properties.join(',\n')}}`.trim()
}

// TODO: `parseSFC`
