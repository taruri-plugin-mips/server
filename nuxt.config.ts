export default defineNuxtConfig({
  compatibilityDate: '2024-12-17',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/devtools',
    'nuxt-vitest',
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
    folder: '/root/code', // `dev_token` is the default value
  },
  nitro: {
    experimental: {
      websocket: true,
    }
  },
})
