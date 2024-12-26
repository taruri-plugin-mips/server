<script setup lang="ts">
import type { Folder } from '~~/types/project'

const modelValue = defineModel<Folder[]>({
  default: [],
})
</script>

<template>
  <div
    v-for="version in modelValue"
    :key="version.path"
    class="
  bg-light text-dark border border-light/20
  dark:bg-dark dark:text-light dark:border dark:border-dark/20
  rounded-md px-3 py-2 w-95% shadow-md cursor-pointer
  "
  >
    <div>
      {{ version.name }}
    </div>
  </div>
</template>
