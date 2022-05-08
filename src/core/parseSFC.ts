import {parse} from '@vue/compiler-sfc'

export function parseSFC(code: string) {
  return parse(code, {pad: 'space'}).descriptor
}
