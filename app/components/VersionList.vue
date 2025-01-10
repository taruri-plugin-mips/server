<script setup lang="ts">
import type { Folder } from '~~/types/project'

const modelValue = defineModel<Folder[]>({
  default: [],
})

async function handleDownload(path: string) {
  const response = await fetch(`/api/download?path=${encodeURIComponent(path)}`)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = path.substring(path.lastIndexOf('/') + 1)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

// 批量下载所有deb文件
async function handleDownloadAll(debs: any[]) {
  for (const deb of debs)
    await handleDownload(deb.path)
}
</script>

<template>
  <div
    v-for="version in modelValue"
    :key="version.path"
    class="
      bg-light text-dark border border-light/20
      dark:bg-dark dark:text-light dark:border dark:border-dark/20
      rounded-md px-3 py-2 w-95% shadow-md
    "
  >
    <div class="flex justify-between" :class="[version.debs ? 'border-b border-gray/15 pb-2' : '']">
      <div>
        {{ version.name }}
      </div>
      <div v-if="version.debs">
        <button
          class="text-blue-500 hover:text-blue-700"
          @click="handleDownloadAll(version.debs)"
        >
          全部下载
        </button>
      </div>
    </div>
    <div v-if="version.debs" class="flex flex-col justify-center items-start leading-normal mt-1">
      <button
        v-for="deb in version.debs"
        :key="deb.name"
        class="text-left hover:text-blue-500 transition-colors"
        @click="handleDownload(deb.path)"
      >
        {{ deb.name }}
      </button>
    </div>
  </div>
</template>
