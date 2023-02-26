import * as React from 'react'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, HTMLContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { Button } from '@components/common/Button'
import MenuBar from './MenuBar'

interface Props {
  content?: HTMLContent
  onSubmit?: (content?: HTMLContent) => void
}
export function Editor(props: Props) {
  const { content, onSubmit } = props

  const [mode, setMode] = React.useState<'preview' | 'edit'>('preview')

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
        class: 'px-2 py-4 prose prose-sm sm:prose text-left focus:outline-none',
      },
    },
    content,
    editable: mode === 'edit',
  })

  React.useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(mode === 'edit')
  }, [editor, mode])

  return (
    <div className="rounded-lg border-2 border-slate-500">
      {editor && <MenuBar editor={editor} />}
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
              onClick={() => {
                onSubmit?.(editor?.getHTML())
                setMode('edit')
              }}
              variant="primary"
            >
              Save
            </Button>
          </>
        )}

        {mode === 'preview' && (
          <Button
            className="py-2 px-4 text-xs hover:bg-white"
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
