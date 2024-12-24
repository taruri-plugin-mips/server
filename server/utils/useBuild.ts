import type { Peer } from 'crossws'
import type { Arch } from '~~/types'
import { exec } from 'node:child_process'
import { readFileSync, unwatchFile, watchFile } from 'node:fs'
import { consola } from 'consola'
import { createFileSync } from 'fs-extra'

interface BuildProps {
  arch: Arch
  path: string
  minPath: string
}

export function useBuild(
  props: BuildProps,
  peer: Peer,
  _options?: {
    debug?: boolean
  },
) {
  peer.send(useSend201(`Building Start ${props.arch.name} target in ${props.arch.target} ...`))
  const dockerFolder = useRuntimeConfig().dockerFolder
  return new Promise<void>((resolve, reject) => {
    createFileSync(`${props.path}/tauri_build_${props.arch.name}.log`)
    exec(
      `docker exec -d container_tauri_${props.arch.name} sh -c "cd ${dockerFolder}${props.minPath} && cargo tauri build --target ${props.arch.target} ${_options?.debug ? '--debug' : ''} > ${dockerFolder}${props.minPath}/tauri_build_${props.arch.name}.log 2>&1; echo 'BUILD FINISHED' >> ${dockerFolder}${props.minPath}/tauri_build_${props.arch.name}.log"`,
      (error, stdout, stderr) => {
        if (error) {
          consola.error(`exec error: ${error}`)
          reject(error)
        }
        if (stderr) {
          consola.error(`exec error: ${stderr}`)
          reject(stderr)
        }
        watchFile(`${props.path}/tauri_build_${props.arch.name}.log`, () => {
          const log = readFileSync(`${props.path}/tauri_build_${props.arch.name}.log`, 'utf-8')
          const lines = log.split('\n')
          const lastLine = lines[lines.length - 2]
          consola.start(lastLine)
          if (lastLine === 'BUILD FINISHED') {
            unwatchFile(`${props.path}/tauri_build_${props.arch.name}.log`)
            resolve()
          }
          else {
            peer.send(useSend201(`${lastLine}`))
          }
        })
      },
    )
  })
}
