<script setup lang="ts">
import type { Folder } from '~~/types/project'

const projectValue = ref<string>('')

const versionList = ref<Folder[]>([])
watch(projectValue, async (value) => {
  versionList.value = await $fetch('/api/projects/version', {
    params: {
      path: value,
    },
  })
})
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <BasicCard class="w-70! h-79%!">
      <ProjectList v-model="projectValue" />
    </BasicCard>
    <BasicDivider orientation="vertical" />
    <BasicCard class="w-100! h-79%!">
      <VersionList v-model="versionList" />
    </BasicCard>
  </div>
</template>
