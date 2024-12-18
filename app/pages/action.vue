<script setup lang="ts">
const route = useRoute()

const { send, status, data, open, close } = useWebSocket(`ws://${location.host}/bunded`, {
  immediate: false,
})

const folder = computed(() => route.query.folder?.toString())

onMounted(() => {
  // send(route.query.folder)

  // watch(data, (value) => {
  //   console.log(value)
  //   const resp = JSON.parse(value)
  //   if (resp.status === 200) {
  //     console.log('Release success')
  //     close()
  //   }
  // })
})
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
