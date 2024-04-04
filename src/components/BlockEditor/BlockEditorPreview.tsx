'use client'

import { EditorContent, PureEditorContent } from '@tiptap/react'
import { memo, useRef } from 'react'

import '@/styles/index.css'

import { useBlockEditorPreview } from '@/hooks/useBlockEditorPreview'
import { TiptapProps } from './types'

const BlockEditorPreview = ({ ydoc, provider }: TiptapProps) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const { editor } = useBlockEditorPreview({ ydoc, provider })

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex h-full flex-1 flex-col">
        <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
      </div>
    </div>
  )
}

export default memo(BlockEditorPreview)
