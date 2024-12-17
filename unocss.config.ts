import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetAnimations } from 'unocss-preset-animations'

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {
      gray: {
        background: 'hsl(var(--background-gray))',
        border: 'hsl(var(--border-gray))',
      },
      primary: 'hsl(var(--primary-color))',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetAnimations(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: [
    'i-carbon-home',
  ],
})
