<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'

const model = defineModel<boolean>()
</script>

<template>
  <span class="flex items-center gap-1">
    <CheckboxRoot v-model:checked="model" class="h-4 w-4 shrink-0 rounded-sm border border-gray-border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-background">
      <CheckboxIndicator class="flex items-center justify-center text-current">
        <div class="i-carbon:checkmark w-4 h-4" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <slot />
  </span>
</template>
