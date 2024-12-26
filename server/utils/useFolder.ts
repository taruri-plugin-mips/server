import type { Folder } from '~~/types/project'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'pathe'

export function useFolder(path: string): Folder[] {
  const lists: Folder[] = []
  // get all the folders
  const folderLists = readdirSync(path, {
    withFileTypes: true,
  })
  // get the folder's info and update time
  folderLists.forEach((item) => {
    if (item.isDirectory()) {
      const stats = statSync(join(path, item.name))
      lists.push({
        name: item.name,
        path: join(path, item.name),
        time: stats.mtime,
      })
    }
  })

  // sort the list by time
  lists.sort((a, b) => {
    return b.time.getTime() - a.time.getTime()
  })

  return lists
}
