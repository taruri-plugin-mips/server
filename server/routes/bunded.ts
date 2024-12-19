import { exec } from 'node:child_process'
import fs from 'fs-extra'

export default defineWebSocketHandler({
  message(peer, message) {
    peer.subscribe(message.text())

    const folder = useRuntimeConfig().folder
    const dockerFolder = useRuntimeConfig().dockerFolder
    // 在 message.text() 中获取到的是客户端发送的消息,去除跟 folder 相同的部分
    const path = message.text().replace(folder, '')

    const arch = ['amd', 'arm', 'mips']
    arch.forEach((item) => {
      // amd release build
      exec(
        `docker exec -d tauri-${item} sh -c "cd ${dockerFolder}${path} && cargo tauri build --target x86_64-unknown-linux-gnu > ${dockerFolder}${path}/tauri_build_${item}.log 2>&1; echo 'BUILD FINISHED' >> ${dockerFolder}${path}/tauri_build_${item}.log"`,
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
            message: 'Build amd started...',
          }))
          // 侦听文件变化
          fs.watchFile(`${path}/tauri_build_amd.log`, (_curr, _prev) => {
            // 判断最后一行是否为 BUILD FINISHED
            const log = fs.readFileSync(`${path}/tauri_build_amd.log`, 'utf-8')
            const lines = log.split('\n')
            const lastLine = lines[lines.length - 2]
            if (lastLine === 'BUILD FINISHED') {
              peer.send(JSON.stringify({
                status: 201,
                message: 'Build amd finished...next bunded...',
              }))
            }
            else {
              peer.send(JSON.stringify({
                status: 201,
                message: lastLine,
              }))
            }
          })
        },
      )
    })

    peer.send(JSON.stringify({
      status: 201,
      message: '2.0 -> build arm and other',
    }))
  },
  close(peer) {
    peer.send('close project release')
  },
  error(peer, error) {
    console.error('error', error)
  },
})
