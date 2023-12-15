<script setup lang="ts">
import { usePlayground } from '../store/playground'

const play = usePlayground()
</script>

<template>
  <div class="vp-doc">
    <div grid="~ cols-2 gap-4" p4>
      <textarea v-model="play.input" font-mono rounded p4 my4.5 />
      <ShikijiMiniPlayground />
    </div>
  </div>
</template>
