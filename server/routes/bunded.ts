import { consola } from 'consola'
import { join } from 'pathe'
import { arch } from '../utils/useBuild'

export default defineWebSocketHandler({
  async message(peer, message) {
    consola.ready('message', message.text())
    peer.subscribe(message.text())

    const releaseFolder = message.text()
    let _successFlag = 0

    for (const item of arch) {
      try {
        const res = await useCopyFolder({
          src: releaseFolder,
          desc: join(releaseFolder, '..', item.name),
        })

        consola.info(`copy ${item.name} finished -> `, res)

        await useBuild({
          arch: item,
          path: res.path,
          minPath: res.minPath,
        }, peer)

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
