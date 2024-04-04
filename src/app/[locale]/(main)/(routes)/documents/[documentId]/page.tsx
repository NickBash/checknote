'use client'

import { HocuspocusProvider, TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'

import BlockEditor from '@/components/BlockEditor/BlockEditor'
import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { useDocuments, type DocumentCopy } from '@/stores'

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

export default function Document({ params }: DocumentIdPageProps) {
  const [provider, setProvider] = useState<TiptapCollabProvider | HocuspocusProvider | null>(null)
  const searchParams = useSearchParams()
  const listDocuments = useDocuments(state => state.listDocuments)

  const documentCopy: DocumentCopy | undefined = useMemo(
    () => listDocuments?.find(doc => doc.id === params.documentId),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listDocuments],
  )

  const documentCopyEditor: DocumentCopy | undefined = useMemo(
    () => listDocuments?.find(doc => doc.id === params.documentId),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.documentId],
  )

  useEffect(() => {
    console.log(documentCopyEditor)
  }, [documentCopyEditor])

  const hasCollab = parseInt(searchParams.get('noCollab') as string) !== 1

  const ydoc = useMemo(() => new Y.Doc(), [])

  useEffect(() => {
    if (hasCollab && documentCopy) {
      setProvider(
        new HocuspocusProvider({
          url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
          name: documentCopy?.contentId as string,
          document: ydoc,
          forceSyncInterval: 200,
        }),
      )
    }

    return () => provider?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentCopyEditor])

  if (documentCopyEditor === undefined || documentCopy === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Not found</p>
      </div>
    )
  }

  if (hasCollab && !provider) return

  return (
    <div className="pb-40">
      <Cover url={documentCopy?.coverImage} documentId={params.documentId} />
      <div className="mx-auto">
        <Toolbar initialData={documentCopy} documentId={params.documentId} />
        <BlockEditor hasCollab={hasCollab} ydoc={ydoc} provider={provider} />
      </div>
    </div>
  )
}
