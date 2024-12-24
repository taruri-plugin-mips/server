<script setup lang="ts">
import { Divider } from '@destyler/divider'

defineOptions({
  inheritAttrs: true,
})
</script>

<template>
  <Divider
    class="bg-gray-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-8/10 data-[orientation=vertical]:w-px mx-3"
  />
</template>
