<script setup lang="ts">
import { usePlayground } from '../store/playground'

const play = usePlayground()
</script>

<template>
  <div class="vp-doc">
    <div class="grid cols-2 gap-4 p4">
      <textarea v-model="play.input" class="font-mono rounded p4 my4.5" />
      <ShikiMiniPlayground />
    </div>
  </div>
</template>
