import * as React from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  selectFile: (fileString: string) => void;
}
export function FileUpload({ selectFile }: Props) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result as string;

          selectFile(base64String);
        };

        reader.readAsDataURL(file);
      });
    },
    [selectFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
      'video/*': ['.mp4', '.webm'],
    },
    multiple: false,
    maxFiles: 1,
  });

  return (
    <div className="min-w-[200px] flex-1">
      <div
        {...getRootProps({
          className:
            'flex h-40 items-center justify-center rounded-lg border-4 border-double border-astronaut-300 p-4 transition hover:cursor-pointer hover:border-astronaut-400',
        })}
      >
        <input {...getInputProps()} />
        <p className="text-astronaut-300">
          Drag and drop a file here or click to upload an image.
        </p>
      </div>

      <h3 className="mt-2 text-center text-sm">Choose File</h3>
    </div>
  );
}
