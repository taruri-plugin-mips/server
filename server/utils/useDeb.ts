import type { Arch } from '~~/types/arch'
import child from 'node:child_process'
import consola from 'consola'
import { join } from 'pathe'

export interface UseDebOptions {
  projectName: string
  dist: string
  archList: Arch[]
}
export function useDeb(props: UseDebOptions) {
  return new Promise<void>((resolve) => {
    const envsPath = join(props.dist, '..', 'envs')
    // 在 dist 目录下创建 对应 arch 的 deb 目录
    const { dist, archList, projectName } = props
    const dockerFolder = useRuntimeConfig().dockerFolder
    archList.forEach((arch) => {
      // 将 dist 目录下 arch 目录下release 下的 bin 文件 复制到 envs/arch/bin 目录下
      child.exec(`cp ${join(dist, arch.name, 'release', projectName)} ${join(envsPath, arch.name, 'usr', 'bin')}`, (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          return
        }
        if (stderr) {
          console.error(stderr)
          return
        }
        consola.log(stdout, 'copy finished')
        // 运行 docker 编译成 deb 文件
        child.exec(
          `docker run --rm \
            -v ${join(envsPath, arch.name)}:${join(dockerFolder, arch.name)} \
            -w ${dockerFolder} \
            tuari-debian:${arch.name} \
            dpkg -b "${join(dockerFolder, arch.name)}" "${dockerFolder}/${arch.name}/${projectName}.${arch.name}.deb"
          `,
          () => {
            consola.log(stdout, 'deb finished')
          },
        )
      })
    })
    resolve()
  })
}
