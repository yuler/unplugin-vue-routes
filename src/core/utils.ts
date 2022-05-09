import Debug from 'debug'

export const debug = {
  options: Debug('unplugin-vue-pages:options'),
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const camelize = (str: string): string => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function pascalize(str: string) {
  return capitalize(camelize(str))
}

export function throttle<ArgumentsType extends unknown[], ReturnType>(
  fn: (...args: ArgumentsType) => ReturnType,
  wait: number,
): (...args: ArgumentsType) => ReturnType {
  let timeout: number | undefined
  let result: ReturnType
  let last = 0

  const throttled = function (this: any, ...args: ArgumentsType) {
    const call = () => {
      timeout = undefined
      last = Date.now()
      result = fn.apply(this, args)
    }

    const delta = Date.now() - last

    if (!timeout) {
      if (delta >= wait) {
        call()
      } else {
        timeout = +setTimeout(call, wait - delta)
      }
    }

    return result
  }

  return throttled
}

export function leadingSlash(str: string) {
  return str.charAt(0) === '/' ? str : `/${str}`
}
