<script setup lang="ts">
const route = useRoute()

const folder = computed(() => route.query.folder?.toString() || '')
const name = computed(() => route.query.name?.toString() || '')
const debug = computed(() => route.query.debug?.toString() === 'true')
const arch = computed(() => route.query.arch?.toString() || '')
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <Suspense>
      <LazyProjectAction
        :name="name"
        :folder="folder"
        :debug="debug"
        :arch="arch"
      />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>
