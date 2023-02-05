import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'

interface Props {
  onFileSelect: (fileString: string) => void
}
export function useFileSelect({ onFileSelect }: Props) {
  const [fileString, setFileString] = React.useState<string>()

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader()

        reader.onerror = () => {
          toast.error('Error reading file')
        }

        reader.onload = () => {
          const base64String = reader.result as string
          setFileString(base64String)

          onFileSelect(base64String)
        }

        reader.readAsDataURL(file)
      })
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },
    multiple: false,
    maxFiles: 1,
  })

  return { fileString, getRootProps, getInputProps }
}
