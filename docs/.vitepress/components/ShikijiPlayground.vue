<script setup lang="ts">
import { usePlayground } from '../store/playground'

const play = usePlayground()
</script>

<template>
  <div class="vp-doc">
    <h1>WIP</h1>
    <div grid="~ cols-2">
      <textarea v-model="play.input" />
      <div v-html="play.output" />
    </div>
  </div>
</template>
