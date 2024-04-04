'use client'

import { EditorContent, PureEditorContent } from '@tiptap/react'
import { memo, useRef } from 'react'

import { LinkMenu } from '@/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'

import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { TextMenu } from '../menus/TextMenu'
import { TiptapProps } from './types'

const BlockEditor = ({ ydoc, provider }: TiptapProps) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const { editor, users, characterCount, collabState, leftSidebar } = useBlockEditor({ ydoc, provider })

  const displayedUsers = users.slice(0, 3)

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex h-full flex-1 flex-col">
        <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default memo(BlockEditor)
