import { copy, type CopyFilterAsync, type CopyFilterSync } from 'fs-extra'

interface CopyFolderProps {
  src: string
  desc: string
  filter?: CopyFilterSync | CopyFilterAsync | undefined
}

export function useCopyFolder(props: CopyFolderProps) {
  const folder = useRuntimeConfig().folder
  return new Promise<{ path: string, minPath: string }>((resolve, reject) => {
    copy(`${props.src}`, props.desc, {
      filter: props.filter,
    })
      .then(() => {
        resolve({
          path: props.desc,
          minPath: props.desc.replace(folder, ''),
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
