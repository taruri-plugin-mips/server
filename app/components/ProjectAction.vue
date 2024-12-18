<script setup lang="ts">
const props = defineProps<{
  folder?: string
}>()
</script>

<template>
  <div>
    {{ props.folder }}
  </div>
</template>
