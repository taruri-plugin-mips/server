import type { Arch } from '~~/types/arch'
import fs from 'fs-extra'
import { join } from 'pathe'

export interface UseDebOptions {
  projectName: string
  dist: string
  archList: Arch[]
}
export function useDeb(props: UseDebOptions) {
  console.info('useDeb', props)
  const envsPath = join(props.dist, '..', 'envs')
  console.log('envsPath', envsPath)
  // 在 dist 目录下创建 对应 arch 的 deb 目录
  const { dist, archList, projectName } = props
  archList.forEach((arch) => {
    console.log('arch', arch)
    // 将 dist 目录下 arch 目录下release 下的 bin 文件 复制到 envs/arch/bin 目录下
    fs.copySync(join(dist, arch.name, 'release', projectName), join(envsPath, arch.name, 'usr', 'bin', projectName))
  })
}
