import * as React from 'react'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, HTMLContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { Button } from '@components/common/Button'
import MenuBar from './MenuBar'

type ViewMode = 'edit' | 'preview'

interface Props {
  content?: HTMLContent
  onSubmit?: (content: HTMLContent, onSuccess: VoidFunction) => void
  loading?: boolean
}
export function Editor(props: Props) {
  const { content, loading, onSubmit } = props

  const [mode, setMode] = React.useState<ViewMode>('preview')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: 'px-2 py-4 prose-sm text-left focus:outline-none',
      },
    },
    content,
  })

  React.useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(mode === 'edit')
  }, [editor, mode])

  return (
    <div className="rounded-lg border-2 border-slate-500">
      {editor && mode === 'edit' && <MenuBar editor={editor} />}

      <EditorContent editor={editor} />

      <footer className="flex items-center justify-end gap-2 border-t-2 border-slate-500 p-2">
        {mode === 'edit' && (
          <>
            <Button
              className="py-2 px-4 text-xs hover:bg-white"
              onClick={() => setMode('preview')}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              className="py-2 px-4 text-xs"
              loading={loading}
              onClick={() => {
                if (editor) {
                  onSubmit?.(editor.getHTML(), () => setMode('preview'))
                }
              }}
              variant="primary"
            >
              Save
            </Button>
          </>
        )}

        {mode === 'preview' && (
          <Button
            className="border-transparent py-1 px-3 text-sm text-brand-500 hover:bg-white"
            onClick={() => setMode('edit')}
            variant="secondary"
          >
            Edit
          </Button>
        )}
      </footer>
    </div>
  )
}
