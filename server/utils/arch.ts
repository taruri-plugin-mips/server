import type { Arch } from '~~/types'

export const arch: Arch[] = [
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

export function useArch(archNames: string) {
  const archNameList = archNames.split(',')
  return arch.filter(a => archNameList.includes(a.name))
}
