import { useEffect, useState } from 'react'

import { TiptapCollabProvider, WebSocketStatus, type HocuspocusProvider } from '@hocuspocus/provider'
import { Editor, useEditor } from '@tiptap/react'
import * as Y from 'yjs'

import { ExtensionKit } from '@/extensions/extension-kit'
import Collaboration from '@tiptap/extension-collaboration'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditorPreview = ({
  ydoc,
  provider,
}: {
  ydoc: Y.Doc
  provider?: TiptapCollabProvider | HocuspocusProvider | null | undefined
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting)

  const editor = useEditor(
    {
      autofocus: true,
      editable: false,
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
      ],
      editorProps: {
        attributes: {
          class: 'min-h-full',
        },
      },
    },
    [ydoc, provider],
  )

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status)
    })
  }, [provider])

  window.editor = editor

  return { editor }
}
