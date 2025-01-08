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
    <div class="flex justify-between" :class="[version.debs ? 'border-b border-gray/15 pb-2' : '']">
      <div>
        {{ version.name }}
      </div>
      <div v-if="version.debs">
        all download
      </div>
    </div>
    <div v-if="version.debs" class="flex flex-col justify-center items-start leading-normal mt-1">
      <div v-for="deb in version.debs" :key="deb.name">
        <span>{{ deb.name }}</span>
      </div>
    </div>
  </div>
</template>
