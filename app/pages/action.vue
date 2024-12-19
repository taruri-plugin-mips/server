<script setup lang="ts">
const route = useRoute()

const folder = computed(() => route.query.folder?.toString() || '')
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <Suspense>
      <LazyProjectAction :folder="folder" />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>
