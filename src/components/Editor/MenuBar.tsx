import * as React from 'react'
import { Editor } from '@tiptap/react'
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiH3,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiMarkPenLine,
  RiText,
  RiUnderline,
} from 'react-icons/ri'

import { Button } from '@components/common/Button'
import { cn } from '@lib/utils'

interface Props {
  editor: Editor
}
export default function MenuBar(props: Props) {
  const { editor } = props

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b-2 border-slate-500 p-2">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          'rounded-md w-7 h-7 text-black hover:bg-slate-100',
          editor.isActive('bold')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiBold className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('italic')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiItalic className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('underline')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiUnderline className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('highlight')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiMarkPenLine className="text-base" />
      </Button>

      <div className="mx-1 h-6 w-[1px] bg-slate-200"></div>

      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('paragraph')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiText className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('heading', { level: 1 })
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiH1 className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('heading', { level: 2 })
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiH2 className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive('heading', { level: 3 })
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiH3 className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          'rounded-md w-7 h-7 hover:bg-slate-100',
          editor.isActive('codeBlock')
            ? 'bg-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiCodeSSlashLine className="text-base" />
      </Button>

      <div className="mx-1 h-6 w-[1px] bg-slate-200"></div>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive({ textAlign: 'left' })
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiAlignLeft className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn(
          'rounded-md  w-7 h-7 hover:bg-slate-100',
          editor.isActive({ textAlign: 'center' })
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiAlignCenter className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cn(
          'rounded-md w-7 h-7 hover:bg-slate-100',
          editor.isActive({ textAlign: 'right' })
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiAlignRight className="text-base" />
      </Button>

      <div className="mx-1 h-6 w-[1px] bg-slate-200"></div>

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'rounded-md w-7 h-7 hover:bg-slate-100',
          editor.isActive('bulletList')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiListUnordered className="text-base" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'rounded-md w-7 h-7 hover:bg-slate-100',
          editor.isActive('orderedList')
            ? 'bg-brand-500 border-brand-500 text-white hover:text-slate-700'
            : ''
        )}
        variant="plain"
      >
        <RiListOrdered className="text-base" />
      </Button>

      <div className="mx-1 h-6 w-[1px] bg-slate-200"></div>

      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={cn('rounded-md w-7 h-7 hover:bg-slate-100')}
        variant="plain"
      >
        <RiArrowGoBackLine className="text-base" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={cn('rounded-md w-7 h-7 hover:bg-slate-100')}
        variant="plain"
      >
        <RiArrowGoForwardLine className="text-base" />
      </Button>
    </div>
  )
}
