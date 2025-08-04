<script setup lang="ts">
import type { FundingLink } from 'tm-grammars'
import { Tooltip } from 'floating-vue'

defineProps<{
  funding: FundingLink[] | undefined
  name: string
}>()
</script>

<template>
  <Tooltip
    v-if="funding && funding.length > 0"
    theme="twoslash"
    class="group"
    relative inline-block mya align-middle
  >
    <button
      title="Funding"
      hover="bg-gray/10"
      p1 rounded
    >
      <div
        i-carbon:favorite-filled
        op25 group-hover:op100 group-focus-within:op100 group-hover:text-red-500
        transition-opacity duration-250
      />
    </button>

    <template #popper>
      <div p2 class="vp-doc text-sm">
        <strong block mb-2>Support {{ name }} development:</strong>
        <div
          v-for="link, i in funding"
          :key="i"
          text-nowrap
        >
          <template v-if="link.handle">
            {{ link.name }}:
          </template>
          <a :href="link.url" target="_blank">{{ link.handle || link.name }}</a>
        </div>
      </div>
    </template>
  </Tooltip>
</template>
