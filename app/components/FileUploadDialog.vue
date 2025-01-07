<script setup lang="ts">
import type { Arch } from '~~/types'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@destyler/dialog'

const model = defineModel<boolean>({ default: false })

const file = defineModel<FileList | null>('file', { default: null })

// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
const regex = /(.+)-(.+)-release\.zip/

const fileInfo = computed(() => {
  const match = file.value?.[0]?.name.match(regex)
  return {
    name: match?.[1],
    version: match?.[2],
  }
})

const archList = ref<{
  arch: Arch
  model: boolean
}[]>([])

onMounted(() => {
  $fetch('/api/arch').then((res) => {
    res.forEach((item: Arch) => {
      archList.value.push({
        arch: item,
        model: true,
      })
    })
  })
})

const debugMode = ref<boolean>(false)

const router = useRouter()

async function handleConfirm() {
  const formdata = new FormData()
  formdata.append('file', file.value?.[0] as File, `${fileInfo.value.name}-${fileInfo.value.version}-release.zip`)
  await $fetch('/api/release', {
    method: 'post',
    body: formdata,
  }).then((res: any) => {
    router.push(`/action?name=${res.name}&folder=${res.folder}&debug=${debugMode.value}&arch=${archList.value.filter(item => item.model).map(item => item.arch.name).join(',')}`)
  })
}
</script>

<template>
  <DialogRoot v-model:open="model">
    <DialogPortal>
      <DialogOverlay
        class="
        fixed inset-0 z-50
        bg-gray/50
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0"
      />
      <DialogContent
        class="
        fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg
        translate-x-[-50%] translate-y-[-50%] gap-4 border p-6
        sm:rounded-lg bg-gray-background border-gray-border
        shadow-xl drop-shadow-xl duration-200
        text-dark dark:text-light
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[state=closed]:slide-out-to-left-50%
        data-[state=closed]:slide-out-to-top-48%
        data-[state=open]:slide-in-from-left-50%
        data-[state=open]:slide-in-from-top-48%"
      >
        <div class="flex flex-col space-y-[1.5] text-center sm:text-left">
          <DialogTitle class="text-lg font-semibold leading-none tracking-tight">
            Release Project Info
          </DialogTitle>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="flex justify-start gap-2">
            <span class="font-bold">Name: </span>
            <span>{{ fileInfo.name }}</span>
          </div>
          <div class="flex justify-start gap-2">
            <span class="font-bold">Version: </span>
            <span><code>{{ fileInfo.version }}</code></span>
          </div>
          <div class="flex justify-start gap-2">
            <span class="font-bold">Debug Mode: </span>
            <span>
              <BasicSwitch v-model="debugMode" />
            </span>
          </div>
          <div class="flex justify-start gap-2">
            <div><span class="font-bold">Build Arch: </span></div>
            <div class="flex ">
              <span v-for="(arch, index) in archList" :key="arch.arch.name" class="flex ">
                <BasicCheckbox v-model="arch.model">
                  <span>{{ arch.arch.name }}</span>
                </BasicCheckbox>
                <BasicDivider
                  v-if="index < archList.length - 1"
                  decorative
                  orientation="vertical"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-end gap-4">
          <DialogClose
            class="
            dark:bg-light dark:text-dark dark:hover:bg-light/90
            bg-dark text-light hover:bg-dark/90
            px-2 py-1 rounded-md
            "
            @click="handleConfirm"
          >
            Confirm
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
