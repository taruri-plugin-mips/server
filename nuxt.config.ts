export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/devtools',
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '~/styles/index.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    folder: '/root/code',
    dockerFolder: '/root/code',
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
})
