<script setup lang="ts">
const props = defineProps<{
  folder: string
}>()

const history = ref<any>([])

onMounted(() => {
  const { send, status, data, open, close } = useWebSocket(`ws://${location.host}/bunded`, {
    immediate: false,
  })

  open()
  send(props.folder)

  watch(data, (value) => {
    const resp = JSON.parse(value)
    history.value.push(resp)
    if (resp.status === 200) {
      close()
    }
  })
})
</script>

<template>
  <div class="flex flex-col w-120 h-80 border border-gray-border rounded-2xl px-4 py-2 text-dark dark:text-light">
    <Actionitem v-for="(item, index) in history" :key="index" :status="item.status" :value="item.message" />
  </div>
</template>
