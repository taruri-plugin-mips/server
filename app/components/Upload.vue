<script setup lang="ts">
const model = defineModel()

const { files, open, reset, onChange } = useFileDialog({
  multiple: false,
})

const dialogToggle = ref<boolean>(false)

onChange((fileList) => {
  if (fileList?.length) {
    dialogToggle.value = true
  }
})

watch(() => dialogToggle.value, (value) => {
  if (!value) {
    reset()
  }
})
</script>

<template>
  <div
    class="
    w-200 h-100 rounded-2xl
    border border-gray-border
    border-6 border-dashed
    flex justify-center
    text-dark dark:text-light"
  >
    <div class="flex flex-col items-center mt-14">
      <div class="i-carbon-cloud-app w-14 h-14" />
      <div class="mt-12">
        <h1 class="text-center font-bold text-3xl">
          Choose a file or drag & drop it here
        </h1>
        <p class="text-center text-gray/70 text-xl">
          only zip up to 50MB
        </p>
      </div>
      <div class="mt-12">
        <button class="border border-gray-border border-2 rounded-md px-4 py-2 hover:bg-gray/20" @click="open()">
          Browse File
        </button>
      </div>
    </div>
  </div>
  <FileUploadDialog v-model="dialogToggle" v-model:file="files" />
</template>
