import type { Message } from '~~/types'
import { existsSync, readFileSync, unwatchFile, watchFile } from 'node:fs'
import { consola } from 'consola'
import { createFileSync } from 'fs-extra'
import { join } from 'pathe'

export default defineWebSocketHandler({
  async message(peer, message) {
    consola.ready('message', JSON.parse(message.text()))
    peer.subscribe(message.text())

    const msg: Message = JSON.parse(message.text()) as Message

    const folder = useRuntimeConfig().folder
    const releaseFolder = msg.folder
    const debug = msg.debug
    const arch = useArch(msg.arch)
    let _successFlag = 0

    // 创建 日志 log 文件
    const logPath = join(releaseFolder, '..', 'tauri_build.log')
    // 判断文件是否存在，不存在则创建
    if (!existsSync(logPath)) {
      createFileSync(logPath)
      const minLogoPath = logPath.replace(folder, '')

      for (const [index, item] of arch.entries()) {
        try {
          const res = await useCopyFolder({
            src: releaseFolder,
            desc: join(releaseFolder, '..', item.name),
          })

          consola.info(`copy ${item.name} finished -> `, res)

          await useBuild(
            {
              arch: item,
              path: res.path,
              minPath: res.minPath,
            },
            peer,
            {
              debug,
              logpath: {
                mini: minLogoPath,
                full: logPath,
              },
              end: index === arch.length - 1,
            },
          )

          consola.success(`${item.name} Build finished.`)
          _successFlag += 1
          if (_successFlag >= arch.length) {
            peer.send(useSend200('Build finished.'))
          }
          else {
            peer.send(useSend202(`${item.name} Build finished.`))
          }
        }
        catch (err) {
          consola.error(err)
        }
      }
    }
    else {
      const log = readFileSync(`${logPath}`, 'utf-8')
      log.split('\n').forEach((line) => {
        if (line === 'BUILD FINISHED') {
          peer.send(useSend200('Build finished.'))
        }
        if (line !== '') {
          peer.send(useSend201(line))
        }
      })
      watchFile(`${logPath}`, () => {
        const log = readFileSync(`${logPath}`, 'utf-8')
        const lines = log.split('\n')
        const lastLine = lines[lines.length - 2]
        consola.start(lastLine)
        if (lastLine === 'BUILD FINISHED') {
          unwatchFile(`${logPath}`)
          peer.send(useSend200('Build finished.'))
        }
        else {
          peer.send(useSend201(`${lastLine}`))
        }
      })
    }
  },
  close(peer) {
    peer.send({
      status: '200',
      message: 'close',
    })
  },
  error(peer, error) {
    consola.error('error', error)
    peer.send({
      status: 500,
      message: `error, ${error}`,
    })
  },
})
