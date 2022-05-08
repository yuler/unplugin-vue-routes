<route lang="json">
{
  "name": "home",
  "meta": {
    "requiresAuth": true
  }
}
</route>

<template>
  <div id="app">
    <h1>App</h1>
    <ul>
      <li v-for="route in routes" key="route">{{ route }}</li>
    </ul>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const routes = reactive(router.getRoutes())
</script>
