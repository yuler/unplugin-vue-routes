import path from 'node:path'
import {defineConfig} from 'vite'
import Inspect from 'vite-plugin-inspect'
import Vue from '@vitejs/plugin-vue'
import Unplugin from '../src/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    Inspect(),
    Vue(),
    Unplugin({pages: 'src/pages', output: 'src/routes.ts'}),
  ],
})
