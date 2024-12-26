import type { Project } from '~~/types/project'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'pathe'

export default defineEventHandler(() => {
  const folder = useRuntimeConfig().folder
  const lists: Project[] = []
  // 获取 folder 下的所有文件夹
  const folderLists = readdirSync(folder, {
    withFileTypes: true,
  })
  // 获取到文件的更新时间
  folderLists.forEach((item) => {
    if (item.isDirectory()) {
      const stats = statSync(join(folder, item.name))
      lists.push({
        name: item.name,
        path: join(folder, item.name),
        time: stats.mtime,
      })
    }
  })

  // 通过时间排序
  lists.sort((a, b) => {
    return b.time.getTime() - a.time.getTime()
  })

  return lists
})
