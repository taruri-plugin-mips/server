import { useFolder } from '~~/server/utils/useFolder'

export default defineEventHandler((event) => {
  const { path }: { path: string } = getQuery(event)
  return useFolder(path)
})
