/**
 * Plugin options.
 */
export interface Options {
  /**
   * Relative path to the pages directory.
   *
   * @default 'src/pages'
   */
  pages?: string

  /**
   * List of valid pages file extensions.
   *
   * @default ['vue', 'ts', 'js']
   */
  extensions?: string[]

  /**
   * The glob patterns for ignore match.
   */
  ignore?: string[]

  /**
   * The routes code output.
   */
  output?: string
}

export type ResolvedOptions = Required<Options>
