import fs from 'fs-extra'
import { join } from 'pathe'
import { useFolder } from '~~/server/utils/useFolder'

export default defineEventHandler(async (event) => {
  const { path }: { path: string } = getQuery(event)
  const folderLists = useFolder(path)

  await Promise.all(folderLists.map(async (item) => {
    const debPath = join(item.path, 'envs')

    if (!fs.existsSync(debPath))
      return

    try {
      const files = await fs.readdir(debPath)
      item.debs = files
        .filter(file => file.endsWith('.deb'))
        .map(file => ({
          name: file,
          path: join(debPath, file),
          relativePath: join('envs', file), // 相对路径
        }))
    }
    catch (err) {
      console.error(`Error reading directory ${debPath}:`, err)
      item.debs = []
    }
  }))

  return folderLists
})
