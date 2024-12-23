<script setup lang="ts">
import type { Arch } from '~~/server/utils/useBuild'
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@destyler/dialog'
import { Divider } from '@destyler/divider'
import { SwitchRoot, SwitchThumb } from '@destyler/switch'

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
    router.push(`/action?folder=${res.folder}&debug=${debugMode.value}&arch=${archList.value.filter(item => item.model).map(item => item.arch.name).join(',')}`)
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
              <SwitchRoot
                v-model:checked="debugMode"
                class="
                peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
                rounded-full border-2 border-transparent transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                data-[state=checked]:bg-gray data-[state=unchecked]:bg-gray-border
                "
              >
                <SwitchThumb
                  class="
                  pointer-events-none block h-5 w-5 rounded-full
                  bg-gray-background
                  shadow-lg ring-0 transition-transform
                  data-[state=checked]:translate-x-5
                  data-[state=unchecked]:translate-x-0
                  "
                />
              </SwitchRoot>
            </span>
          </div>
          <div class="flex justify-start gap-2">
            <div><span class="font-bold">Build Arch: </span></div>
            <div class="flex ">
              <span v-for="(arch, index) in archList" :key="arch.arch.name" class="flex ">
                <span class="flex items-center gap-1">
                  <CheckboxRoot v-model:checked="arch.model" class="h-4 w-4 shrink-0 rounded-sm border border-gray-border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-background">
                    <CheckboxIndicator class="flex items-center justify-center text-current">
                      <div class="i-carbon:checkmark w-4 h-4" />
                    </CheckboxIndicator>
                  </CheckboxRoot>
                  <span>{{ arch.arch.name }}</span>
                </span>
                <Divider
                  v-if="index < archList.length - 1"
                  class="bg-gray-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-8/10 data-[orientation=vertical]:w-px mx-3"
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
