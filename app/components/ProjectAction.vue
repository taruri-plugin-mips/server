<script setup lang="ts">
const props = withDefaults(defineProps<{
  folder: string
  debug?: boolean
  arch?: string
}>(), {
  debug: false,
  arch: 'amd,arm,mips',
})

const history = ref<any>([])

const actionItemRef = useTemplateRef('action-item')

onMounted(() => {
  const { send, data, open, close } = useWebSocket(`ws://${location.host}/bunded`, {
    immediate: false,
  })

  open()

  send(
    JSON.stringify({
      folder: props.folder,
      debug: props.debug,
      arch: props.arch,
    }),
  )

  watch(data, (value) => {
    const resp = JSON.parse(value)
    if (resp.status === 200) {
      close()
    }
    history.value.push(resp)
    actionItemRef.value!.scrollTop = actionItemRef.value!.scrollHeight + 400
  })
})
</script>

<template>
  <div ref="action-item" class="flex flex-col w-120 h-80 border border-gray-border rounded-2xl px-4 py-2 text-dark dark:text-light overflow-auto scrollbar-hide">
    <Actionitem v-for="(item, index) in history" :key="index" :status="item.status" :value="item.message" />
  </div>
</template>
