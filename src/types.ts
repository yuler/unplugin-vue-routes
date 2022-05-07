/**
 * Plugin options.
 */
export interface Options {
  /**
   * The pages directory. Default is `src/pages`
   */
  pages?: string

  /**
   * The routes output file. Default is `src/router/routes.ts`
   */
  output?: string
}

export interface ResolvedOptions extends Required<Options> {}
