import fs from 'node:fs'

export default defineEventHandler(async (event) => {
  const { path }: { path: string } = getQuery(event)
  // 通过 path 获取文件名字
  const fileName = path.substring(path.lastIndexOf('/') + 1)

  setHeader(event, 'Content-Type', 'application/vnd.debian.binary-package')
  setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`)

  return fs.createReadStream(path)
})
