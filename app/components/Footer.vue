<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@destyler/tooltip'

const items = ref<{
  icon: string
  path: string
  name: string
}[]>([
  {
    icon: 'i-carbon-home',
    path: '/',
    name: 'Home Page',
  },
  {
    icon: 'version',
    path: '/version',
    name: 'version manager',
  },
  {
    icon: 'docs',
    path: '/docs',
    name: 'Preview Docs',
  },
])

const route = useRoute()

const isActive = (path: string) => route.path === path

const color = useColorMode()

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div
    class="
    absolute bottom-5 w-screen text-center
    text-gray-700 dark:text-gray-200
    flex justify-center items-center"
  >
    <div class="flex justify-center items-center">
      <nav
        class="
        bg-gray-background px-2.5 py-2 rounded-xl
        shadow-xl drop-shadow-xl gap-2.5
        border-px border-gray-border
        flex justify-center items-center "
      >
        <TooltipProvider v-for="item in items" :key="item.path">
          <TooltipRoot>
            <TooltipTrigger>
              <NuxtLink :to="item.path">
                <div
                  class="p-1.5 rounded-md cursor-pointer text-base flex justify-center items-center"
                  :class="[isActive(item.path) ? 'bg-primary text-light' : 'hover:bg-gray/20']"
                >
                  <Icones :name="item.icon" class="w-17px h-17px" />
                </div>
              </NuxtLink>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                :side-offset="8"
                class="
                z-50 overflow-hidden rounded-md px-3 py-1.5
                text-xs animate-in fade-in-0 zoom-in-95
                bg-gray-background text-dark dark:text-light
                border border-gray-border
                data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0
                data-[state=closed]:zoom-out-95
                data-[side=bottom]:slide-in-from-top-2
                data-[side=left]:slide-in-from-right-2
                data-[side=right]:slide-in-from-left-2
                data-[side=top]:slide-in-from-bottom-2"
              >
                {{ item.name }}
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>

        <hr class="w-px h-15px bg-dark/70 dark:bg-light/70 border-none">
        <ClientOnly>
          <div
            class="p-1.5 rounded-md cursor-pointer text-base flex justify-center items-center hover:bg-gray/20"
            @click="toggleDark"
          >
            <Icones v-if="color.value === 'dark'" name="i-carbon-moon" class="w-17px h-17px" />
            <Icones v-else name="i-carbon-sun" class="w-17px h-17px" />
          </div>
        </ClientOnly>
      </nav>
    </div>
  </div>
</template>
