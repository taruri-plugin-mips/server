import type { Peer } from 'crossws'
import type { Arch } from '~~/types'
import { exec } from 'node:child_process'
import { join } from 'node:path'
import TailFile from '@logdna/tail-file'
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
    distpath: {
      full: string
      min: string
    }
    end: boolean
  },
) {
  consola.info(props, _options)
  peer.send(useSend201(`Building Start ${props.arch.name} target in ${props.arch.target} ...`))
  const dockerFolder = useRuntimeConfig().dockerFolder
  const localFolder = useRuntimeConfig().folder
  return new Promise<void>((resolve) => {
    exec(
      `docker run --rm \
        -v ${localFolder}:${dockerFolder} \
        -w ${dockerFolder}${props.minPath} \
        tuari-debian:${props.arch.name} \
        sh -c "cargo tauri build --target ${props.arch.target} > ${dockerFolder}${_options.logpath.mini} 2>&1; echo 'BUILD ${_options.end ? 'FINISHED' : 'NEXT'}' >> ${dockerFolder}${_options.logpath.mini}"`,
      (error, stdout, stderr) => {
        if (error) {
          consola.error(`exec error: ${error}`)
        }
        if (stderr) {
          consola.error(`exec error: ${stderr}`)
        }
      },
    )
    const tail = new TailFile(_options.logpath.full, { encoding: 'utf-8' })
    tail.on('data', (data) => {
      data.split('\n').filter((line: any) => line.trim() !== '').forEach((line: any) => {
        consola.info(line)
        peer.send(useSend201(`${line}`))
        if (['BUILD FINISHED', 'BUILD NEXT'].includes(line)) {
          tail.quit()
          useCopyFolder({
            src: join(props.path, 'src-tauri', 'target', props.arch.target),
            desc: join(_options.distpath.full, props.arch.name),
          })
          resolve()
        }
      })
    }).start()
  })
}
