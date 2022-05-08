import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import prettier from 'prettier'
import {leadingSlash, pascalize} from './utils'
import {parseSFC} from './parseSFC'

export async function generateRoutes(pages: string) {
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
    const route = resolveRoute(pages, file)
    let code = `{\n`

    for (const [key, value] of Object.entries(route)) {
      code += `${key}: ${key === 'component' ? value : JSON.stringify(value)},`
    }

    code += `\n}`

    routes.push(code)
  }

  return template(routes)
}

async function template(routes: string[]) {
  let options
  // Try load prettier config
  try {
    const configFile = await prettier.resolveConfigFile()
    options = (await prettier.resolveConfig(configFile!)) || {}
  } catch {}

  return prettier.format(
    `
    import type {RouteRecordRaw} from 'vue-router'

    const routes: RouteRecordRaw[] = [
      ${routes.join(',\n  ')}
    ]

    export default routes`,
    options,
  )
}

function resolveRoute(pages: string, filepath: string) {
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

  // Resolve `<route>` in SFC
  const content = fs.readFileSync(path.resolve(pages, filepath), 'utf-8')
  const parsed = parseSFC(content)

  const routeBlock = parsed.customBlocks.find(block => block.type === 'route')

  // TODO: refs https://github.com/ktsn/vue-route-generator/blob/master/src/resolve.ts#L49-L56
  let routeConfig = {}
  if (routeBlock) {
    routeConfig = JSON.parse(routeBlock.content)
  }

  const route: Route = {
    path: leadingSlash(paths.join('/')),
    name: pascalize(names.join('-')),
    component: `() => import('@/pages/${filepath}')`,
    ...routeConfig,
  }

  return route
}

interface Route {
  path: string
  name: string
  component: string
  redirect?: string
  alias?: string
  props?: object
  meta?: object
  children?: Route[]
}
