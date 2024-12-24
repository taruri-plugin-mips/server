export type ArchName = 'amd' | 'arm' | 'mips'

export interface Arch {
  name: ArchName
  target: string
}
