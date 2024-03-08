'use client'

import { HocuspocusProvider, TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useSearchParams } from 'next/navigation'
import { useLayoutEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'

import { BlockEditor } from '@/components/BlockEditor'
import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocuments, type Document } from '@/hooks/use-documents'

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

export default function Document({ params }: DocumentIdPageProps) {
  const [provider, setProvider] = useState<TiptapCollabProvider | HocuspocusProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const documentsList = useDocuments(state => state.documents)

  const document: Document | undefined = documentsList?.find(doc => doc.id === params.documentId)

  const hasCollab = parseInt(searchParams.get('noCollab') as string) !== 1

  const documentId = params.documentId as string

  const ydoc = useMemo(() => new Y.Doc(), [])

  useLayoutEffect(() => {
    if (hasCollab) {
      setProvider(
        new HocuspocusProvider({
          url: 'ws://127.0.0.1:1234',
          name: 'example-document',
          document: ydoc,
        }),
      )
    }
  }, [setProvider, collabToken, ydoc, documentId, hasCollab])

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  if (hasCollab && !provider) return

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto">
        <Toolbar initialData={document} />
        <BlockEditor hasCollab={hasCollab} ydoc={ydoc} provider={provider} />
      </div>
    </div>
  )
}
