import { useFolder } from '~~/server/utils/useFolder'

export default defineEventHandler(() => {
  const folder = useRuntimeConfig().folder
  return useFolder(folder)
})
