<script setup lang="ts">
const props = defineProps<{
  status?: number
  value?: string
}>()
</script>

<template>
  <div class="flex text-sm gap-2" style="text-overflow:ellipsis;overflow:hidden;">
    <span>{{ props.status }}</span>
    <span
      class="
      text-dark text-op-70 hover:text-op-100 whitespace-nowrap
      dark:text-light dark:text-op-70 dark:hover:text-op-100
      cursor-default
      "
    >
      {{ props.value }}
    </span>
  </div>
</template>
