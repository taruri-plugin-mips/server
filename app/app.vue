<script setup lang="ts">
useHead({
  title: 'upload bundled',
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <main class="w-full h-full">
      <NuxtPage />
      <LazyFooter />
    </main>
  </NuxtLayout>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}

html {
  background: #FFFFFF;
}

html.dark {
  background: #222222;
}
</style>
