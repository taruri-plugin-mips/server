<script setup lang="ts">
const props = defineProps<{
  name: string | 'version' | 'docs'
}>()
</script>

<template>
  <IconesVersionIcon v-if="props.name === 'version'" />
  <IconesDocsIcon v-else-if="props.name === 'docs'" />
  <div v-else :class="props.name" />
</template>
