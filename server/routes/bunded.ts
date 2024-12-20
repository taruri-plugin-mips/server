import { exec } from 'node:child_process'
import { join } from 'node:path'
import fs from 'fs-extra'

export default defineWebSocketHandler({
  message(peer, message) {
    peer.subscribe(message.text())

    const releaseFolder = message.text()
    const folder = useRuntimeConfig().folder
    const dockerFolder = useRuntimeConfig().dockerFolder
    // 在 message.text() 中获取到的是客户端发送的消息,去除跟 folder 相同的部分

    const arch = [
      {
        name: 'amd',
        target: 'x86_64-unknown-linux-gnu',
      },
      {
        name: 'arm',
        target: 'aarch64-unknown-linux-gnu',
      },
      {
        name: 'mips',
        target: 'mips64el-unknown-linux-gnuabi64',
      },
    ]
    let successFlag = 0
    arch.forEach((item) => {
      // release build
      new Promise<{ path: string, minPath: string }>((resolve) => {
        // 将 release 文件夹复制到 item.name
        fs.copy(`${releaseFolder}`, join(releaseFolder, '..', item.name))
          .then(() => {
            resolve({
              path: join(releaseFolder, '..', item.name),
              minPath: join(releaseFolder, '..', item.name).replace(folder, ''),
            })
          })
      }).then((res) => {
        exec(
          `docker exec -d container_tauri_${item.name} sh -c "cd ${dockerFolder}${res.minPath} && cargo tauri build --target ${item.target} > ${dockerFolder}${res.minPath}/tauri_build_${item.name}.log 2>&1; echo 'BUILD FINISHED' >> ${dockerFolder}${res.minPath}/tauri_build_${item.name}.log"`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
              return
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`)
            }
            // starts
            peer.send(JSON.stringify({
              status: 201,
              message: `${item.name} Build amd started...`,
            }))
            // 侦听文件变化
            fs.watchFile(`${res.path}/tauri_build_${item.name}.log`, (_curr, _prev) => {
              // 判断最后一行是否为 BUILD FINISHED
              const log = fs.readFileSync(`${res.path}/tauri_build_${item.name}.log`, 'utf-8')
              const lines = log.split('\n')
              const lastLine = lines[lines.length - 2]
              if (lastLine === 'BUILD FINISHED') {
                successFlag += 1
                if (successFlag === arch.length) {
                  peer.send(JSON.stringify({
                    status: 200,
                    message: `${item.name} Build finished.`,
                  }))
                }
                else {
                  peer.send(JSON.stringify({
                    status: 201,
                    message: `${item.name} Build amd finished...next bunded...`,
                  }))
                }
                // 结束exec
                fs.unwatchFile(`${res.path}/tauri_build_${item.name}.log`)
              }
              else {
                peer.send(JSON.stringify({
                  status: 201,
                  message: `${item.name} ${lastLine}`,
                }))
              }
            })
          },
        )
      })
    })
  },
  close(peer) {
    peer.send('close project release')
  },
  error(peer, error) {
    console.error('error', error)
  },
})
