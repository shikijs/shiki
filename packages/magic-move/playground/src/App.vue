<script setup lang="ts">
import Playground from './Playground.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <Playground />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<style>
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
  html {
    background: #020202;
    color: #ccc;
  }
}
</style>
