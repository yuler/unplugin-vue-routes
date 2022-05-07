import {defineConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRoutes from 'unplugin-vue-routes'

export default defineConfig({
  plugins: [Vue(), VueRoutes.vite()],
})
