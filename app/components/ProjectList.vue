<script setup lang="ts">
import type { Project } from '~~/types/project'
import dayjs from 'dayjs'

const projectList = ref<Project[]>([])

onMounted(async () => {
  projectList.value = await $fetch('/api/projects/list')
})
</script>

<template>
  <div
    v-for="i in projectList"
    :key="i.path"
    class="
    bg-light text-dark border border-light/20
    dark:bg-dark dark:text-light dark:border dark:border-dark/20
    rounded-md w-60 px-3 py-2 shadow-md cursor-pointer
    "
  >
    <div class="text-base font-bold">
      {{ i.name }}
    </div>
    <div class="text-xs mt-2">
      {{ dayjs(i.time).format('YYYY-MM-DD HH:mm:ss') }}
    </div>
  </div>
</template>
