import {ResolvedOptions} from '../types'
import {resolveRoutes, stringifyRoutes} from './resolver'

export async function generateCode(options: ResolvedOptions) {
  const routes = await resolveRoutes(options)
  console.log(routes)
  const code = await stringifyRoutes(routes)
  return code
}
