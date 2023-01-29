import * as React from 'react'

import { useFileSelect } from '@hooks/useFileSelect'

interface Props {
  selectFile: (fileString: string) => void
}
export function FileUpload({ selectFile }: Props) {
  const { getInputProps, getRootProps } = useFileSelect({
    onFileSelect: selectFile,
  })

  return (
    <div className="min-w-[200px] flex-1">
      <div
        {...getRootProps({
          className:
            'flex h-40 items-center justify-center rounded-lg border-4 border-double border-slate-400 p-4 transition-all hover:cursor-pointer hover:border-slate-500 ease-out',
        })}
      >
        <input {...getInputProps()} />
        <p className="text-slate-400">
          Drag and drop a file here or click to upload an image.
        </p>
      </div>

      <h3 className="mt-2 text-center text-sm">Choose a File</h3>
    </div>
  )
}
