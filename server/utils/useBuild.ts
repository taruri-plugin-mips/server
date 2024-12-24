import type { Peer } from 'crossws'
import type { Arch } from '~~/types'
import { exec } from 'node:child_process'
import { readFileSync, unwatchFile, watchFile } from 'node:fs'
import { consola } from 'consola'

interface BuildProps {
  arch: Arch
  path: string
  minPath: string
}

export function useBuild(
  props: BuildProps,
  peer: Peer,
  _options: {
    debug: boolean
    logpath: {
      mini: string
      full: string
    }
    end: boolean
  },
) {
  peer.send(useSend201(`Building Start ${props.arch.name} target in ${props.arch.target} ...`))
  const dockerFolder = useRuntimeConfig().dockerFolder
  return new Promise<void>((resolve, reject) => {
    exec(
      `docker exec -d container_tauri_${props.arch.name} sh -c "cd ${dockerFolder}${props.minPath} && cargo tauri build --target ${props.arch.target} ${_options.debug ? '--debug' : ''} > ${dockerFolder}${_options.logpath.mini} 2>&1; echo 'BUILD ${_options.end ? 'FINISHED' : 'NEXT'}' >> ${dockerFolder}${_options.logpath.mini}"`,
      (error, stdout, stderr) => {
        if (error) {
          consola.error(`exec error: ${error}`)
          reject(error)
        }
        if (stderr) {
          consola.error(`exec error: ${stderr}`)
          reject(stderr)
        }
        watchFile(`${_options.logpath.full}`, () => {
          const log = readFileSync(`${_options.logpath.full}`, 'utf-8')
          const lines = log.split('\n')
          const lastLine = lines[lines.length - 2]
          consola.start(lastLine)
          if (['BUILD FINISHED', 'BUILD NEXT'].includes(lastLine!)) {
            unwatchFile(`${_options.logpath.full}`)
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
