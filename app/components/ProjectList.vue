<script setup lang="ts">
import type { Folder } from '~~/types/project'

import dayjs from 'dayjs'

const modelValue = defineModel<string>()

const projectList = ref<Folder[]>([])

onMounted(async () => {
  projectList.value = await $fetch('/api/projects/list')
  modelValue.value = projectList.value[0]?.path
})

function handleClick(path: string) {
  modelValue.value = path
}
</script>

<template>
  <div
    v-for="project in projectList"
    :key="project.path"
    :data-selected="project.path === modelValue"
    class="
    bg-light text-dark text-op-80 border border-light/20
    dark:bg-dark dark:text-light dark:text-op-80 dark:border dark:border-dark/20
    rounded-md w-95% px-3 py-2 shadow-md cursor-pointer
    data-[selected=true]:border-primary
    data-[selected=true]:text-op-100
    dark:data-[selected=true]:text-op-100
    "
    @click="handleClick(project.path)"
  >
    <div class="text-base font-bold">
      {{ project.name }}
    </div>
    <div class="text-xs mt-2">
      {{ dayjs(project.time).format('YYYY-MM-DD HH:mm:ss') }}
    </div>
  </div>
</template>
