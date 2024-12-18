import { exec } from 'node:child_process'
import fs from 'fs-extra'

export default defineWebSocketHandler({
  message(peer, message) {
    peer.subscribe(message.text())

    // amd release build
    exec(
      `docker exec -d tauri-amd sh -c "cd /root/code/tauri_v1/src-tauri && cargo tauri build --target x86_64-unknown-linux-gnu > /root/code/tauri_build.log 2>&1; echo 'BUILD FINISHED' >> /root/code/tauri_build.log"`,
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
        fs.watchFile('/Users/elonehoo/Downloads/tauri_build.log', (curr, prev) => {
          // 判断最后一行是否为 BUILD FINISHED
          const log = fs.readFileSync('/Users/elonehoo/Downloads/tauri_build.log', 'utf-8')
          const lines = log.split('\n')
          const lastLine = lines[lines.length - 2]
          if (lastLine === 'BUILD FINISHED') {
            peer.send(JSON.stringify({
              status: 200,
              message: 'Build amd finished...',
            }))
          }
          else {
            peer.send(JSON.stringify({
              status: 201,
              message: 'Building amd...',
            }))
          }
        })
      },
    )
  },
  close(peer) {
    peer.send('close project release')
  },
  error(peer, error) {
    console.error('error', error)
  },
})
