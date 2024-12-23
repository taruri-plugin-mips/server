<script setup lang="ts">
const props = defineProps<{
  status?: number
  value?: string
}>()

const stautsIcon = computed<string>(() => {
  switch (props.status) {
    case 200:
      return 'i-carbon:face-wink-filled bg-green-500'
    case 202:
      return 'i-carbon:face-satisfied-filled bg-yellow-500'
    case 201:
      return 'i-carbon:face-neutral-filled bg-blue-500'
    case 500:
      return 'i-carbon:face-dizzy-filled bg-red-500'
    default:
      return 'i-carbon:face-pending-filled bg-gray-500'
  }
})
</script>

<template>
  <div class="flex text-sm gap-2 text-ellipsis">
    <Icones :name="stautsIcon" />
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
